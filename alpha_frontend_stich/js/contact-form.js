/**
 * Contact Form Handler - Manages contact form submissions
 */

class ContactFormHandler {
  static init() {
    const form = document.querySelector('form[data-contact-form]');
    if (!form) return;

    form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  static async handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const button = form.querySelector('button[type="submit"]');

    try {
      // Get form data
      const fullName = form.querySelector('input[type="text"]').value;
      const email = form.querySelector('input[type="email"]').value;
      const subject = form.querySelector('select').value;
      const message = form.querySelector('textarea').value;

      // Validate
      if (!fullName || !email || !message) {
        showToast('Please fill in all fields', 'warning');
        return;
      }

      if (!isValidEmail(email)) {
        showToast('Please enter a valid email', 'error');
        return;
      }

      // Set loading state
      setButtonLoading(button, true);

      // Submit inquiry
      const response = await APIService.submitInquiry({
        full_name: fullName,
        email: email,
        subject: subject,
        message: message
      });

      // Success
      showToast('Message sent successfully! We\'ll be in touch soon.', 'success');
      form.reset();
      setButtonLoading(button, false);

    } catch (error) {
      showToast(`Error: ${error.message}`, 'error');
      setButtonLoading(button, false);
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  ContactFormHandler.init();
});
