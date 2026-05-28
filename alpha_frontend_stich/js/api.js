/**
 * API Service - Centralized API communication with backend
 */

const APP_CONFIG = window.APP_CONFIG || (window.APP_CONFIG = {});
const currentOrigin = window.location?.origin || '';
const defaultApiBase = currentOrigin.startsWith('http') ? currentOrigin : 'https://cms-rr1p.onrender.com';
const fallbackApiBase = 'https://cms-rr1p.onrender.com';
APP_CONFIG.API_BASE = APP_CONFIG.API_BASE || defaultApiBase;
APP_CONFIG.FALLBACK_API_BASE = APP_CONFIG.FALLBACK_API_BASE || fallbackApiBase;
APP_CONFIG.API_URL = APP_CONFIG.API_URL || `${APP_CONFIG.API_BASE}/api`;
APP_CONFIG.ADMIN_PATH = APP_CONFIG.ADMIN_PATH || '/admin';

class APIService {
  static getToken() {
    return localStorage.getItem('authToken') || '';
  }

  static getHeaders({ contentType = 'application/json', auth = true } = {}) {
    
    const headers = {};

    if (contentType) {
      headers['Content-Type'] = contentType;
    }

    if (auth) {
      const token = this.getToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  static async parseResponse(response) {
    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return response.json();
    }

    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  static handleUnauthorized() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    window.location.href = APP_CONFIG.ADMIN_PATH;
  }

  static buildRequestHeaders({ contentType = 'application/json', auth = true } = {}) {
    const headers = {};

    if (contentType) {
      headers['Content-Type'] = contentType;
    }

    if (auth) {
      const token = this.getToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  static buildRequestOptions(options = {}, auth = true) {
    const contentType = Object.prototype.hasOwnProperty.call(options, 'contentType')
      ? options.contentType
      : 'application/json';

    const requestHeaders = {
      ...this.buildRequestHeaders({ contentType, auth }),
      ...(options.headers || {})
    };

    if (contentType === null) {
      delete requestHeaders['Content-Type'];
    }

    return {
      ...options,
      headers: requestHeaders
    };
  }

  static async fetchFromBase(baseUrl, path, options = {}) {
    return fetch(`${baseUrl}/api${path}`, this.buildRequestOptions(options, options.auth !== false));
  }

  static async request(path, options = {}, { redirectOnUnauthorized = true, auth = true } = {}) {
    const requestOptions = {
      ...options,
      auth
    };

    let response = await this.fetchFromBase(APP_CONFIG.API_BASE, path, requestOptions);
    let data = await this.parseResponse(response);

    if (response.status === 404 && APP_CONFIG.FALLBACK_API_BASE && APP_CONFIG.FALLBACK_API_BASE !== APP_CONFIG.API_BASE) {
      const fallbackResponse = await this.fetchFromBase(APP_CONFIG.FALLBACK_API_BASE, path, requestOptions);
      const fallbackData = await this.parseResponse(fallbackResponse);
      response = fallbackResponse;
      data = fallbackData;
    }

    if (!response.ok) {
      if (response.status === 401 && redirectOnUnauthorized) {
        this.handleUnauthorized();
      }

      const message = data?.detail || data?.message || data || 'API Error';
      throw new Error(message);
    }

    return data;
  }

  // ==================== AUTHENTICATION ====================
  static async login(username, password) {
    const response = await this.fetchFromBase(APP_CONFIG.API_BASE, '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ username, password }),
      auth: false
    });
    const data = await this.parseResponse(response);

    if (response.status === 404 && APP_CONFIG.FALLBACK_API_BASE && APP_CONFIG.FALLBACK_API_BASE !== APP_CONFIG.API_BASE) {
      const fallbackResponse = await this.fetchFromBase(APP_CONFIG.FALLBACK_API_BASE, '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username, password }),
        auth: false
      });
      const fallbackData = await this.parseResponse(fallbackResponse);

      if (!fallbackResponse.ok) {
        const message = fallbackData?.detail || fallbackData?.message || fallbackData || 'Login failed';
        throw new Error(message);
      }

      localStorage.setItem('authToken', fallbackData.access_token);
      return fallbackData;
    }

    if (!response.ok) {
      const message = data?.detail || data?.message || data || 'Login failed';
      throw new Error(message);
    }

    localStorage.setItem('authToken', data.access_token);
    return data;
  }

  static async logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }

  static async getCurrentUser() {
    return this.request('/auth/me');
  }

  // ==================== SERVICES ====================
  static async getServices() {
    return this.request('/services/');
  }

  static async createService(serviceData) {
    return this.request('/services/', {
      method: 'POST',
      body: JSON.stringify(serviceData)
    });
  }

  static async updateService(serviceId, serviceData) {
    return this.request(`/services/${serviceId}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData)
    });
  }

  static async deleteService(serviceId) {
    return this.request(`/services/${serviceId}`, { method: 'DELETE' });
  }

  // ==================== PORTFOLIO ====================
  static async getPortfolios() {
    return this.request('/portfolio/');
  }

  static async createPortfolio(portfolioData) {
    return this.request('/portfolio/', {
      method: 'POST',
      body: JSON.stringify(portfolioData)
    });
  }

  static async updatePortfolio(portfolioId, portfolioData) {
    return this.request(`/portfolio/${portfolioId}`, {
      method: 'PUT',
      body: JSON.stringify(portfolioData)
    });
  }

  static async deletePortfolio(portfolioId) {
    return this.request(`/portfolio/${portfolioId}`, { method: 'DELETE' });
  }

  // ==================== TEAM ====================
  static async getTeamMembers() {
    return this.request('/team/');
  }

  static async createTeamMember(memberData) {
    return this.request('/team/', {
      method: 'POST',
      body: JSON.stringify(memberData)
    });
  }

  static async updateTeamMember(memberId, memberData) {
    return this.request(`/team/${memberId}`, {
      method: 'PUT',
      body: JSON.stringify(memberData)
    });
  }

  static async deleteTeamMember(memberId) {
    return this.request(`/team/${memberId}`, { method: 'DELETE' });
  }

  // ==================== INQUIRIES ====================
  static async submitInquiry(inquiryData) {
    return this.request('/inquiries/', {
      method: 'POST',
      body: JSON.stringify(inquiryData)
    }, { redirectOnUnauthorized: false, auth: false });
  }

  static async getInquiries(isRead = null, limit = 50, offset = 0) {
    let url = `/inquiries/?limit=${limit}&offset=${offset}`;
    if (isRead !== null) {
      url += `&is_read=${isRead}`;
    }
    return this.request(url);
  }

  static async markInquiryRead(inquiryId, isRead) {
    return this.request(`/inquiries/${inquiryId}/read`, {
      method: 'PATCH',
      body: JSON.stringify({ is_read: isRead })
    });
  }

  static async deleteInquiry(inquiryId) {
    return this.request(`/inquiries/${inquiryId}`, { method: 'DELETE' });
  }

  // ==================== SITE SETTINGS ====================
  static async getSiteSettings() {
    return this.request('/settings/');
  }

  static async getSiteSetting(key) {
    return this.request(`/settings/${key}`);
  }

  static async updateSiteSetting(key, value) {
    return this.request(`/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value })
    });
  }

  // ==================== UPLOAD ====================
  static async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    return this.request('/upload/', {
      method: 'POST',
      contentType: null,
      body: formData
    });
  }
}
