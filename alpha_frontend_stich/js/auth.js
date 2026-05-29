/**
 * Authentication Service - Handles login, logout, and token management
 */

class AuthService {
  static isLoggedIn() {
    return !!localStorage.getItem('authToken');
  }

  static getToken() {
    return localStorage.getItem('authToken');
  }

  static async login(username, password) {
    try {
      const response = await APIService.login(username, password);
      showToast('Login successful!', 'success');
      return response;
    } catch (error) {
      showToast(`Login failed: ${error.message}`, 'error');
      throw error;
    }
  }

  static logout() {
    APIService.logout();
    window.location.href = window.APP_CONFIG?.ADMIN_PATH || 'admin.html';
  }

  static async getCurrentUser() {
    try {
      const user = await APIService.getCurrentUser();
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  static isAdmin() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user.is_admin === true;
  }

  static requireAdmin() {
    if (!this.isLoggedIn()) {
      showToast('Please log in first', 'warning');
      window.location.href = window.APP_CONFIG?.ADMIN_PATH || 'admin.html';
      return false;
    }
    if (!this.isAdmin()) {
      showToast('Admin access required', 'error');
      return false;
    }
    return true;
  }

  static requireLogin() {
    if (!this.isLoggedIn()) {
      showToast('Please log in first', 'warning');
      window.location.href = window.APP_CONFIG?.ADMIN_PATH || 'admin.html';
      return false;
    }
    return true;
  }
}
