/**
 * Services CMS - Manages dynamic service content
 */

class ServicesCMS {
  static async loadServices() {
    try {
      const services = await APIService.getServices();
      this.renderServices(services);
    } catch (error) {
      console.error('Failed to load services:', error);
      showToast('Failed to load services', 'error');
    }
  }

  static renderServices(services) {
    const container = document.getElementById('services-list') || 
                     document.getElementById('services-container') || 
                     document.querySelector('[data-services-list]');
    
    if (!container) return;

    if (!services || services.length === 0) {
      container.innerHTML = '<p class="text-white/70">No services available</p>';
      return;
    }

    container.innerHTML = services.map(service => {
      const bgImage = service.icon_url || '';
      return `
      <div class="service-morph-node scroll-reveal group cursor-pointer" style="--bg-img: url('${escapeHtml(bgImage)}');">
        <div class="node-content-wrap">
          <h3 class="font-headline-md text-white text-center font-bold">${escapeHtml(service.title)}</h3>
          <div class="reveal-details text-center">
            <p class="font-body-md text-white/90 leading-relaxed text-sm">${escapeHtml(service.description)}</p>
            <p class="text-laurel-green font-accent-label text-xs uppercase tracking-wider mt-4 font-bold">Category: ${escapeHtml(service.category)}</p>
          </div>
        </div>
      </div>
    `;
    }).join('');

    // Initialize scroll reveal observers
    const reveals = container.querySelectorAll('.scroll-reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(el => obs.observe(el));
  }


  // For admin dashboard only
  static renderServicesForAdmin(services) {
    const container = document.getElementById('services-list') || 
                     document.getElementById('services-container') || 
                     document.querySelector('[data-services-list]');
    
    if (!container) return;

    if (!services || services.length === 0) {
      container.innerHTML = '<p class="text-white/70">No services available</p>';
      return;
    }

    container.innerHTML = services.map(service => {
      const bgImage = service.icon_url || '';
      const imageHtml = bgImage ? `<img src="${escapeHtml(bgImage)}" alt="${escapeHtml(service.title)}" class="service-card-image" style="margin-bottom: 1rem;" onerror="this.style.display='none'">` : '';
      const hasImageClass = bgImage ? 'has-image' : '';
      const innerPadding = bgImage ? '1.25rem' : '0.75rem';
      return `
      <div class="service-card-admin laurel-glass group cursor-pointer ${hasImageClass}">
        ${imageHtml}
        <div style="padding: ${innerPadding}; flex: 1; display: flex; flex-direction: column;">
          <h3 class="font-headline-md text-white font-bold">${escapeHtml(service.title)}</h3>
          <p class="font-body-md text-white/90 leading-relaxed text-sm mt-2">${escapeHtml(service.description)}</p>
          <p class="text-laurel-green font-accent-label text-xs uppercase tracking-wider mt-4 font-bold">Category: ${escapeHtml(service.category)}</p>
          <div class="flex gap-2 justify-start mt-4 admin-controls flex-wrap">
            ${bgImage ? `<button class="btn-view-image text-sm bg-blue-500/50 text-white px-4 py-2 rounded hover:bg-blue-500/70 transition font-bold" data-image="${escapeHtml(bgImage)}" data-title="${escapeHtml(service.title)}">View Image</button>` : ''}
            <button class="btn-edit-service text-sm bg-laurel-green/50 text-white px-4 py-2 rounded hover:bg-laurel-green/70 transition font-bold" data-id="${service.id}">Edit</button>
            <button class="btn-delete-service text-sm bg-red-500/50 text-white px-4 py-2 rounded hover:bg-red-500/70 transition font-bold" data-id="${service.id}">Delete</button>
          </div>
        </div>
      </div>
    `;
    }).join('');

    // View image functionality
    document.querySelectorAll('.btn-view-image').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const imageUrl = e.target.dataset.image;
        const imageTitle = e.target.dataset.title;
        this.showImagePreview(imageUrl, imageTitle);
      });
    });

    document.querySelectorAll('.btn-edit-service').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.editService(e.target.dataset.id);
      });
    });
    document.querySelectorAll('.btn-delete-service').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteService(e.target.dataset.id);
      });
    });
  }

  static showImagePreview(imageUrl, imageTitle) {
    const modal = document.createElement('div');
    modal.className = 'image-preview-modal';
    modal.innerHTML = `
      <div class="relative">
        <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(imageTitle)}" />
        <button onclick="this.closest('.image-preview-modal').remove()" class="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition font-bold">Close</button>
      </div>
    `;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
    document.body.appendChild(modal);
  }

  static async editService(id) {
    if (!AuthService.requireAdmin()) return;

    // Get current service data
    try {
      const services = await APIService.getServices();
      const service = services.find(s => s.id == id);
      if (!service) {
        showToast('Service not found', 'error');
        return;
      }

      ModalForm.show('Edit Service', [
        { name: 'title', label: 'Service Title', type: 'text', required: true, placeholder: 'e.g., Digital Marketing' },
        { name: 'description', label: 'Description', type: 'text', required: true, placeholder: 'What does this service do?' },
        { name: 'category', label: 'Category', type: 'text', required: true, placeholder: 'outdoor/design/creative/marketing/events/additional' },
        { name: 'icon_url', label: 'Icon URL (optional)', type: 'text', required: false, placeholder: 'https://...' }
      ], async (data) => {
        try {
          await APIService.updateService(id, {
            title: data.title,
            description: data.description,
            category: data.category || service.category,
            icon_url: data.icon_url || 'services',
            is_active: true
          });
          showToast('Service updated successfully!', 'success');
          this.loadServices();
        } catch (error) {
          showToast(`Error: ${error.message}`, 'error');
        }
      });
    } catch (error) {
      showToast('Error loading service', 'error');
    }
  }

  static async deleteService(id) {
    if (!AuthService.requireAdmin()) return;

    if (!confirmAction('Delete this service?')) return;

    try {
      await APIService.deleteService(id);
      showToast('Service deleted successfully!', 'success');
      this.loadServices();
    } catch (error) {
      showToast(`Error: ${error.message}`, 'error');
    }
  }

  static async createService() {
    if (!AuthService.requireAdmin()) return;

    ModalForm.show('Add New Service', [
      { name: 'title', label: 'Service Title', type: 'text', required: true, placeholder: 'e.g., Digital Marketing' },
      { name: 'description', label: 'Description', type: 'text', required: true, placeholder: 'What does this service do?' },
      { name: 'category', label: 'Category', type: 'text', required: true, placeholder: 'outdoor/design/creative/marketing/events/additional' },
      { name: 'icon_url', label: 'Icon URL (optional)', type: 'text', required: false, placeholder: 'https://...' }
    ], async (data) => {
      try {
        await APIService.createService({
          title: data.title,
          description: data.description,
          category: data.category || 'additional',
          icon_url: data.icon_url || 'services',
          is_active: true
        });
        showToast('Service created successfully!', 'success');
        this.loadServices();
      } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
      }
    });
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  ServicesCMS.loadServices();
});
