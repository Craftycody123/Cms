/**
 * Admin Dashboard - Comprehensive admin panel management
 */

class AdminDashboard {
  static async init() {
    // Check if already logged in
    if (AuthService.isLoggedIn()) {
      this.showDashboard();
      await this.loadDashboard();
    } else {
      this.showLogin();
    }

    // Setup login form
    this.setupLoginForm();
  }

  static showLogin() {
    document.getElementById('login-container').classList.remove('hidden');
    document.getElementById('dashboard-container').classList.add('hidden');
  }

  static showDashboard() {
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('dashboard-container').classList.remove('hidden');
  }

  static setupLoginForm() {
    const form = document.getElementById('login-form');
    if (form) {
      form.addEventListener('submit', (e) => this.handleLogin(e));
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }
  }

  static async handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    const submitBtn = document.querySelector('#login-form button[type="submit"]');

    try {
      setButtonLoading(submitBtn, true);
      errorEl.classList.add('hidden');

      await AuthService.login(email, password);
      await AuthService.getCurrentUser();
      
      // Show dashboard
      this.showDashboard();
      await this.loadDashboard();
    } catch (error) {
      errorEl.textContent = `Login failed: ${error.message}`;
      errorEl.classList.remove('hidden');
      setButtonLoading(submitBtn, false);
    }
  }

  static async loadDashboard() {
    // Load current user
    const user = await AuthService.getCurrentUser();
    this.updateUserDisplay(user);

    // Initialize tabs
    this.initTabs();

    // Load initial data
    await this.loadInquiries();
  }

  static updateUserDisplay(user) {
    const userDisplay = document.getElementById('current-user');
    if (userDisplay && user) {
      userDisplay.textContent = user.full_name || user.username;
    }
  }

  static initTabs() {
    const tabButtons = document.querySelectorAll('[data-tab]');
    const tabContents = document.querySelectorAll('[data-tab-content]');

    tabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const tabName = e.target.dataset.tab;
        
        // Hide all
        tabContents.forEach(content => {
          content.classList.remove('active');
        });
        tabButtons.forEach(btn => {
          btn.classList.remove('active');
        });

        // Show selected
        const content = document.querySelector(`[data-tab-content="${tabName}"]`);
        if (content) {
          content.classList.add('active');
          e.target.classList.add('active');
          
          // Load data based on tab
          if (tabName === 'inquiries') {
            this.loadInquiries();
          } else if (tabName === 'services') {
            this.loadServices();
          } else if (tabName === 'portfolio') {
            this.loadPortfolio();
          } else if (tabName === 'team') {
            this.loadTeam();
          }
        }
      });
    });
  }

  static async loadServices() {
    try {
      const services = await APIService.getServices();
      ServicesCMS.renderServicesForAdmin(services);
    } catch (error) {
      showToast('Failed to load services', 'error');
    }
  }

  static async loadPortfolio() {
    try {
      const portfolios = await APIService.getPortfolios();
      PortfolioCMS.renderPortfoliosForAdmin(portfolios);
    } catch (error) {
      showToast('Failed to load portfolio', 'error');
    }
  }

  static async loadTeam() {
    try {
      const teamMembers = await APIService.getTeamMembers();
      TeamCMS.renderTeamForAdmin(teamMembers);
    } catch (error) {
      showToast('Failed to load team', 'error');
    }
  }

  static async loadInquiries() {
    try {
      const { items, total_count } = await APIService.getInquiries(null, 100, 0);
      this.renderInquiries(items, total_count);
    } catch (error) {
      console.error('Failed to load inquiries:', error);
      showToast('Failed to load inquiries', 'error');
    }
  }

  static renderInquiries(inquiries, totalCount) {
    const container = document.getElementById('inquiries-list');
    if (!container) return;

    const unreadCount = inquiries.filter(i => !i.is_read).length;

    let html = `
      <div class="mb-6 bg-laurel-green/10 border border-laurel-green/30 p-4 rounded">
        <p class="text-white">Total Inquiries: <span class="font-bold text-laurel-green">${totalCount}</span> | 
           Unread: <span class="font-bold text-orange-400">${unreadCount}</span></p>
      </div>
    `;

    if (!inquiries || inquiries.length === 0) {
      html += '<p class="text-white/70">No inquiries yet</p>';
      container.innerHTML = html;
      return;
    }

    html += `<div class="space-y-4">`;
    inquiries.forEach(inquiry => {
      html += `
        <div class="laurel-glass p-6 ${!inquiry.is_read ? 'border-l-4 border-l-orange-400' : ''}">
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="font-bold text-white">${escapeHtml(inquiry.full_name)}</h3>
              <p class="text-white/60 text-sm">${escapeHtml(inquiry.email)}</p>
            </div>
            <div class="flex gap-2">
              ${!inquiry.is_read ? `
                <button class="btn-mark-read text-xs bg-laurel-green/20 text-laurel-green px-3 py-1 rounded hover:bg-laurel-green/30" data-id="${inquiry.id}">
                  Mark Read
                </button>
              ` : ''}
              <button class="btn-delete-inquiry text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded hover:bg-red-500/30" data-id="${inquiry.id}">
                Delete
              </button>
            </div>
          </div>
          <p class="text-white/70 text-sm mb-2"><strong>Subject:</strong> ${escapeHtml(inquiry.subject)}</p>
          <p class="text-white/80 mb-3">${escapeHtml(inquiry.message)}</p>
          <p class="text-white/50 text-xs">${formatDate(inquiry.submitted_at)}</p>
        </div>
      `;
    });
    html += `</div>`;

    container.innerHTML = html;

    // Attach event listeners
    document.querySelectorAll('.btn-mark-read').forEach(btn => {
      btn.addEventListener('click', (e) => this.markInquiryRead(e.target.dataset.id));
    });
    document.querySelectorAll('.btn-delete-inquiry').forEach(btn => {
      btn.addEventListener('click', (e) => this.deleteInquiry(e.target.dataset.id));
    });
  }

  static async markInquiryRead(id) {
    try {
      await APIService.markInquiryRead(id, true);
      showToast('Marked as read', 'success');
      this.loadInquiries();
    } catch (error) {
      showToast(`Error: ${error.message}`, 'error');
    }
  }

  static async deleteInquiry(id) {
    if (!confirmAction('Delete this inquiry?')) return;

    try {
      await APIService.deleteInquiry(id);
      showToast('Inquiry deleted', 'success');
      this.loadInquiries();
    } catch (error) {
      showToast(`Error: ${error.message}`, 'error');
    }
  }

  static logout() {
    if (confirmAction('Are you sure you want to logout?')) {
      AuthService.logout();
      this.showLogin();
      document.getElementById('login-form').reset();
      showToast('Logged out successfully', 'success');
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  AdminDashboard.init();
});
