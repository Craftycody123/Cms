/**
 * Modal Form Builder - Replaces browser prompts with proper modals
 */

class ModalForm {
  static show(title, fields, onSubmit) {
    // Create modal HTML
    const modalId = 'modal-form-' + Date.now();
    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
    
    let fieldsHTML = fields.map(field => `
      <div class="space-y-2">
        <label class="block text-white font-bold text-sm">${escapeHtml(field.label)}</label>
        <input 
          type="${field.type || 'text'}" 
          name="${field.name}" 
          placeholder="${field.placeholder || ''}"
          class="w-full bg-white/5 border border-white/20 text-white px-4 py-2 rounded focus:border-laurel-green focus:outline-none"
          ${field.required ? 'required' : ''}
        >
      </div>
    `).join('');

    modal.innerHTML = `
      <div class="laurel-glass rounded-lg p-8 w-full max-w-md">
        <h2 class="text-2xl font-bold text-white mb-6">${escapeHtml(title)}</h2>
        <form id="modal-form" class="space-y-4">
          ${fieldsHTML}
          <div class="flex gap-3 mt-8">
            <button type="submit" class="flex-1 bg-laurel-green text-black font-bold py-2 rounded hover:bg-opacity-90 transition">
              Save
            </button>
            <button type="button" class="flex-1 bg-red-500/20 text-red-400 font-bold py-2 rounded hover:bg-red-500/30 transition" onclick="document.getElementById('${modalId}').remove();">
              Cancel
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    // Attach submit handler
    modal.querySelector('#modal-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(modal.querySelector('#modal-form'));
      const data = Object.fromEntries(formData);
      modal.remove();
      onSubmit(data);
    });

    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }
}
