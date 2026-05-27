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

    container.innerHTML = services.map(service => `
      <div class="service-morph-node scroll-reveal" style="--bg-img: url('${escapeHtml(service.icon_url || 'https://via.placeholder.com/300x300?text=' + encodeURIComponent(service.title))}')">
        <div class="node-content-wrap">
          <div class="node-icon-wrap">
            <span class="material-symbols-outlined text-4xl text-laurel-green">${escapeHtml(service.icon_url.split('/').pop().replace(/\.[^.]*$/, '') || 'category')}</span>
          </div>
          <h3 class="font-headline-md text-white text-center font-bold">${escapeHtml(service.title)}</h3>
          
          <div class="reveal-details text-center">
            <p class="font-body-md text-white/90 leading-relaxed">${escapeHtml(service.description)}</p>
            <p class="text-laurel-green font-accent-label text-sm uppercase tracking-wider mt-4 font-bold">Category: ${escapeHtml(service.category)}</p>
          </div>
        </div>
      </div>
    `).join('');

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

    container.innerHTML = services.map(service => `
      <div class="service-morph-node scroll-reveal" style="--bg-img: url('${escapeHtml(service.icon_url || 'https://via.placeholder.com/300x300?text=' + encodeURIComponent(service.title))}')">
        <div class="node-content-wrap">
          <div class="node-icon-wrap">
            <span class="material-symbols-outlined text-4xl text-laurel-green">${escapeHtml(service.icon_url.split('/').pop().replace(/\.[^.]*$/, '') || 'category')}</span>
          </div>
          <h3 class="font-headline-md text-white text-center font-bold">${escapeHtml(service.title)}</h3>
          
          <div class="reveal-details text-center">
            <p class="font-body-md text-white/90 leading-relaxed">${escapeHtml(service.description)}</p>
            <p class="text-laurel-green font-accent-label text-sm uppercase tracking-wider mt-4 font-bold">Category: ${escapeHtml(service.category)}</p>
            
            <div class="flex gap-2 justify-center mt-6 admin-controls">
              <button class="btn-edit-service text-sm bg-laurel-green/30 text-laurel-green px-4 py-2 rounded hover:bg-laurel-green/50 transition font-bold" data-id="${service.id}">
                Edit
              </button>
              <button class="btn-delete-service text-sm bg-red-500/30 text-red-300 px-4 py-2 rounded hover:bg-red-500/50 transition font-bold" data-id="${service.id}">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Attach event listeners
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
