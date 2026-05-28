/**
 * API Service - Centralized API communication with backend
 */

const API_BASE = 'https://cms-rr1p.onrender.com';
const API_URL = `${API_BASE}/api`;

class APIService {
  static getHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  static async handleResponse(response) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || data.message || 'API Error');
    }
    return data;
  }

  // ==================== AUTHENTICATION ====================
  static async login(username, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ username, password })
    });
    const data = await this.handleResponse(response);
    localStorage.setItem('authToken', data.access_token);
    return data;
  }

  static async logout() {
    localStorage.removeItem('authToken');
  }

  static async getCurrentUser() {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // ==================== SERVICES ====================
  static async getServices() {
    const response = await fetch(`${API_URL}/services/`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  static async createService(serviceData) {
    const response = await fetch(`${API_URL}/services/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(serviceData)
    });
    return this.handleResponse(response);
  }

  static async updateService(serviceId, serviceData) {
    const response = await fetch(`${API_URL}/services/${serviceId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(serviceData)
    });
    return this.handleResponse(response);
  }

  static async deleteService(serviceId) {
    const response = await fetch(`${API_URL}/services/${serviceId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // ==================== PORTFOLIO ====================
  static async getPortfolios() {
    const response = await fetch(`${API_URL}/portfolio/`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  static async createPortfolio(portfolioData) {
    const response = await fetch(`${API_URL}/portfolio/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(portfolioData)
    });
    return this.handleResponse(response);
  }

  static async updatePortfolio(portfolioId, portfolioData) {
    const response = await fetch(`${API_URL}/portfolio/${portfolioId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(portfolioData)
    });
    return this.handleResponse(response);
  }

  static async deletePortfolio(portfolioId) {
    const response = await fetch(`${API_URL}/portfolio/${portfolioId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // ==================== TEAM ====================
  static async getTeamMembers() {
    const response = await fetch(`${API_URL}/team/`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  static async createTeamMember(memberData) {
    const response = await fetch(`${API_URL}/team/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(memberData)
    });
    return this.handleResponse(response);
  }

  static async updateTeamMember(memberId, memberData) {
    const response = await fetch(`${API_URL}/team/${memberId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(memberData)
    });
    return this.handleResponse(response);
  }

  static async deleteTeamMember(memberId) {
    const response = await fetch(`${API_URL}/team/${memberId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // ==================== INQUIRIES ====================
  static async submitInquiry(inquiryData) {
    const response = await fetch(`${API_URL}/inquiries/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryData)
    });
    return this.handleResponse(response);
  }

  static async getInquiries(isRead = null, limit = 50, offset = 0) {
    let url = `${API_URL}/inquiries/?limit=${limit}&offset=${offset}`;
    if (isRead !== null) {
      url += `&is_read=${isRead}`;
    }
    const response = await fetch(url, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  static async markInquiryRead(inquiryId, isRead) {
    const response = await fetch(`${API_URL}/inquiries/${inquiryId}/read`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ is_read: isRead })
    });
    return this.handleResponse(response);
  }

  static async deleteInquiry(inquiryId) {
    const response = await fetch(`${API_URL}/inquiries/${inquiryId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // ==================== SITE SETTINGS ====================
  static async getSiteSettings() {
    const response = await fetch(`${API_URL}/settings/`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  static async getSiteSetting(key) {
    const response = await fetch(`${API_URL}/settings/${key}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  static async updateSiteSetting(key, value) {
    const response = await fetch(`${API_URL}/settings/${key}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ value })
    });
    return this.handleResponse(response);
  }

  // ==================== UPLOAD ====================
  static async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_URL}/upload/`, {
      method: 'POST',
      headers: {
        'Authorization': this.getHeaders().Authorization || ''
      },
      body: formData
    });
    return this.handleResponse(response);
  }
}
