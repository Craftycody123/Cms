/**
 * Portfolio CMS - Manages dynamic portfolio/works content
 */

class PortfolioCMS {
  static async loadPortfolios() {
    try {
      const portfolios = await APIService.getPortfolios();
      this.renderPortfolios(portfolios);
    } catch (error) {
      console.error('Failed to load portfolios:', error);
      showToast('Failed to load portfolio items', 'error');
    }
  }

  static renderPortfolios(portfolios) {
    const container = document.getElementById('portfolio-list') || 
                     document.getElementById('portfolio-container') || 
                     document.querySelector('[data-portfolio-list]');
    
    if (!container) return;

    if (!portfolios || portfolios.length === 0) {
      container.innerHTML = '<p class="text-white/70">No portfolio items available</p>';
      return;
    }

    container.innerHTML = portfolios.map(item => `
      <div class="portfolio-item reveal laurel-glass p-6 overflow-hidden group cursor-pointer">
        <div class="relative overflow-hidden rounded-lg mb-4 h-60 bg-white/5">
          <img src="${escapeHtml(item.image_url || 'https://via.placeholder.com/400x300')}" 
               alt="${escapeHtml(item.title)}" 
               class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
        </div>
        <h3 class="font-headline-md text-white font-bold mb-2">${escapeHtml(item.title)}</h3>
        <p class="text-white/70 text-sm mb-3">${escapeHtml(item.description)}</p>
        <div class="flex flex-wrap gap-2">
          ${(item.tags || []).map(tag => `<span class="text-xs bg-white/10 text-white/80 px-3 py-1 rounded-full">${escapeHtml(tag)}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  // For admin dashboard only
  static renderPortfoliosForAdmin(portfolios) {
    const container = document.getElementById('portfolio-list') || 
                     document.getElementById('portfolio-container') || 
                     document.querySelector('[data-portfolio-list]');
    
    if (!container) return;

    if (!portfolios || portfolios.length === 0) {
      container.innerHTML = '<p class="text-white/70">No portfolio items available</p>';
      return;
    }

    container.innerHTML = portfolios.map(item => `
      <div class="portfolio-item reveal laurel-glass p-6 overflow-hidden group cursor-pointer">
        <div class="relative overflow-hidden rounded-lg mb-4 h-60 bg-white/5">
          <img src="${escapeHtml(item.image_url || 'https://via.placeholder.com/400x300')}" 
               alt="${escapeHtml(item.title)}" 
               class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
        </div>
        <h3 class="font-headline-md text-white font-bold mb-2">${escapeHtml(item.title)}</h3>
        <p class="text-white/70 text-sm mb-3">${escapeHtml(item.description)}</p>
        <div class="flex gap-2 mt-4 admin-controls">
          <button class="btn-edit-portfolio text-sm bg-laurel-green/20 text-laurel-green px-3 py-2 rounded hover:bg-laurel-green/30 transition" data-id="${item.id}">
            Edit
          </button>
          <button class="btn-delete-portfolio text-sm bg-red-500/20 text-red-400 px-3 py-2 rounded hover:bg-red-500/30 transition" data-id="${item.id}">
            Delete
          </button>
        </div>
      </div>
    `).join('');

    // Attach event listeners
    document.querySelectorAll('.btn-edit-portfolio').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.editPortfolio(e.target.dataset.id);
      });
    });
    document.querySelectorAll('.btn-delete-portfolio').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deletePortfolio(e.target.dataset.id);
      });
    });
  }

  static async editPortfolio(id) {
    if (!AuthService.requireAdmin()) return;

    // Get current portfolio data
    try {
      const portfolios = await APIService.getPortfolios();
      const portfolio = portfolios.find(p => p.id == id);
      if (!portfolio) {
        showToast('Portfolio item not found', 'error');
        return;
      }

      ModalForm.show('Edit Portfolio Item', [
        { name: 'title', label: 'Project Title', type: 'text', required: true, placeholder: 'e.g., Project Alpha' },
        { name: 'description', label: 'Description', type: 'text', required: true, placeholder: 'Project description' },
        { name: 'category', label: 'Category', type: 'text', required: true, placeholder: 'e.g., branding, digital' },
        { name: 'image_url', label: 'Image URL', type: 'text', required: false, placeholder: 'https://...' },
        { name: 'client_placeholder', label: 'Client/Company', type: 'text', required: false, placeholder: 'Client name' }
      ], async (data) => {
        try {
          await APIService.updatePortfolio(id, {
            title: data.title,
            description: data.description,
            category: data.category || portfolio.category,
            image_url: data.image_url || '',
            client_placeholder: data.client_placeholder || '',
            is_published: true
          });
          showToast('Portfolio item updated successfully!', 'success');
          this.loadPortfolios();
        } catch (error) {
          showToast(`Error: ${error.message}`, 'error');
        }
      });
    } catch (error) {
      showToast('Error loading portfolio item', 'error');
    }
  }

  static async deletePortfolio(id) {
    if (!AuthService.requireAdmin()) return;

    if (!confirmAction('Delete this portfolio item?')) return;

    try {
      await APIService.deletePortfolio(id);
      showToast('Portfolio item deleted successfully!', 'success');
      this.loadPortfolios();
    } catch (error) {
      showToast(`Error: ${error.message}`, 'error');
    }
  }

  static async createPortfolio() {
    if (!AuthService.requireAdmin()) return;

    ModalForm.show('Add Portfolio Item', [
      { name: 'title', label: 'Project Title', type: 'text', required: true, placeholder: 'e.g., E-commerce Redesign' },
      { name: 'description', label: 'Description', type: 'text', required: true, placeholder: 'Project details...' },
      { name: 'category', label: 'Category', type: 'text', required: true, placeholder: 'design/marketing/etc' },
      { name: 'image_url', label: 'Image URL', type: 'text', required: false, placeholder: 'https://...' },
      { name: 'client_placeholder', label: 'Client Name', type: 'text', required: false, placeholder: 'Company name' }
    ], async (data) => {
      try {
        await APIService.createPortfolio({
          title: data.title,
          description: data.description,
          category: data.category || 'general',
          image_url: data.image_url || '',
          client_placeholder: data.client_placeholder || '',
          is_published: true
        });
        showToast('Portfolio item created successfully!', 'success');
        this.loadPortfolios();
      } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
      }
    });
  }

  // Timeline view for works.html - displays portfolio items in alternating timeline layout
  static async loadPortfoliosForWorks() {
    try {
      const portfolios = await APIService.getPortfolios();
      this.renderPortfoliosTimeline(portfolios);
    } catch (error) {
      console.error('Failed to load portfolios:', error);
      showToast('Failed to load portfolio items', 'error');
    }
  }

  static renderPortfoliosTimeline(portfolios) {
    const container = document.getElementById('timeline-items-container') ||
                     document.getElementById('portfolio-timeline') ||
                     document.querySelector('[data-timeline-container]');
    
    if (!container) return;

    if (!portfolios || portfolios.length === 0) {
      container.innerHTML = '<p class="text-white/70 text-center py-12">No portfolio items available</p>';
      return;
    }

    container.innerHTML = portfolios.map((item, index) => {
      const isLeft = index % 2 === 0;
      
      return `
        <div class="flex flex-col md:flex-row items-center justify-between stagger-in group">
          ${isLeft ? `
            <div class="md:w-[45%] text-right order-2 md:order-1 mt-8 md:mt-0">
              <div class="laurel-glass p-8 md:p-12 rounded-lg group-hover:border-laurel-green transition-all text-left border-l-4 border-l-laurel-green">
                <span class="text-laurel-green font-accent-label tracking-widest uppercase mb-4 block font-bold">${escapeHtml(item.category || 'Portfolio')}</span>
                <h3 class="font-headline-md text-white mb-4 text-3xl font-extrabold">${escapeHtml(item.title)}</h3>
                <p class="text-white/70 mb-6 leading-relaxed">${escapeHtml(item.description)}</p>
                ${item.client_placeholder ? `<p class="text-white/60 text-sm mb-6">Client: ${escapeHtml(item.client_placeholder)}</p>` : ''}
                <a href="#" class="inline-flex items-center gap-2 text-laurel-green font-accent-label font-bold group-hover:gap-4 transition-all">
                  VIEW CASE STUDY 
                  <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              </div>
            </div>
            <div class="md:w-[10%] flex justify-center order-1 md:order-2 z-20">
              <div class="timeline-dot w-5 h-5 rounded-full bg-black border-2 border-laurel-green ring-8 ring-laurel-green/10 group-hover:bg-laurel-green visible"></div>
            </div>
            <div class="md:w-[45%] order-3 mt-8 md:mt-0">
              <div class="relative overflow-hidden rounded-lg w-full h-80 bg-white/5">
                <img src="${escapeHtml(item.image_url || 'https://via.placeholder.com/400x400?text=' + encodeURIComponent(item.title))}" 
                     alt="${escapeHtml(item.title)}" 
                     class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
              </div>
            </div>
          ` : `
            <div class="md:w-[45%] order-3 md:order-1 mt-8 md:mt-0">
              <div class="relative overflow-hidden rounded-lg w-full h-80 bg-white/5">
                <img src="${escapeHtml(item.image_url || 'https://via.placeholder.com/400x400?text=' + encodeURIComponent(item.title))}" 
                     alt="${escapeHtml(item.title)}" 
                     class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
              </div>
            </div>
            <div class="md:w-[10%] flex justify-center order-1 md:order-2 z-20">
              <div class="timeline-dot w-5 h-5 rounded-full bg-black border-2 border-laurel-green ring-8 ring-laurel-green/10 group-hover:bg-laurel-green visible"></div>
            </div>
            <div class="md:w-[45%] text-left order-2 mt-8 md:mt-0">
              <div class="laurel-glass p-8 md:p-12 rounded-lg group-hover:border-laurel-green transition-all border-l-4 border-l-laurel-green">
                <span class="text-laurel-green font-accent-label tracking-widest uppercase mb-4 block font-bold">${escapeHtml(item.category || 'Portfolio')}</span>
                <h3 class="font-headline-md text-white mb-4 text-3xl font-extrabold">${escapeHtml(item.title)}</h3>
                <p class="text-white/70 mb-6 leading-relaxed">${escapeHtml(item.description)}</p>
                ${item.client_placeholder ? `<p class="text-white/60 text-sm mb-6">Client: ${escapeHtml(item.client_placeholder)}</p>` : ''}
                <a href="#" class="inline-flex items-center gap-2 text-laurel-green font-accent-label font-bold group-hover:gap-4 transition-all">
                  VIEW CASE STUDY 
                  <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              </div>
            </div>
          `}
        </div>
      `;
    }).join(`<div class="my-24 md:my-48"></div>`);

    // Re-initialize intersection observer for newly rendered items
    const staggerElements = container.querySelectorAll('.stagger-in');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.2 });

    staggerElements.forEach(el => obs.observe(el));
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  PortfolioCMS.loadPortfolios();
});
