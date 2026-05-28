/**
 * Modal Form Builder - Replaces browser prompts with proper modals
 */

class ModalForm {
  static show(title, fields, onSubmit, initialValues = {}) {
    // Create modal HTML
    const modalId = 'modal-form-' + Date.now();
    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto';
    
    let fieldsHTML = fields.map(field => {
      const value = initialValues[field.name] || '';
      return `
      <div class="space-y-2">
        <label class="block text-white font-bold text-sm">${escapeHtml(field.label)}</label>
        <input 
          type="${field.type || 'text'}" 
          name="${field.name}" 
          value="${escapeHtml(value)}"
          placeholder="${field.placeholder || ''}"
          class="w-full bg-white/5 border border-white/20 text-white px-4 py-2 rounded focus:border-laurel-green focus:outline-none image-preview-input"
          data-preview-field="${field.name === 'icon_url' ? 'icon_url' : ''}"
          ${field.required ? 'required' : ''}
        >
      </div>
    `;
    }).join('');

    // Check if any field is icon_url to add preview section
    const hasImageField = fields.some(f => f.name === 'icon_url');
    const previewHTML = hasImageField ? `
      <div id="image-preview-container" class="mt-4 p-4 bg-white/5 border border-white/20 rounded hidden">
        <p class="text-white/70 text-xs mb-2">Image Preview:</p>
        <img id="image-preview" src="" alt="Preview" class="w-full h-auto max-h-48 object-cover rounded" />
      </div>
    ` : '';

    modal.innerHTML = `
      <div class="laurel-glass rounded-lg p-8 w-full max-w-md my-auto">
        <h2 class="text-2xl font-bold text-white mb-6">${escapeHtml(title)}</h2>
        <form id="modal-form" class="space-y-4">
          ${fieldsHTML}
          ${previewHTML}
          <div class="flex gap-3 mt-8">
            <button type="submit" class="flex-1 bg-laurel-green text-black font-bold px-6 py-3 rounded hover:bg-opacity-90 transition">
              Save
            </button>
            <button type="button" class="flex-1 bg-red-500/20 text-red-400 font-bold px-6 py-3 rounded hover:bg-red-500/30 transition" onclick="document.getElementById('${modalId}').remove();">
              Cancel
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    // Setup image preview functionality
    if (hasImageField) {
      const iconUrlInput = modal.querySelector('input[name="icon_url"]');
      const previewContainer = modal.querySelector('#image-preview-container');
      const previewImg = modal.querySelector('#image-preview');

      if (iconUrlInput) {
        // Show preview if there's an initial value
        if (initialValues.icon_url) {
          previewImg.src = initialValues.icon_url;
          previewImg.onload = () => {
            previewContainer.classList.remove('hidden');
          };
        }

        iconUrlInput.addEventListener('input', (e) => {
          const url = e.target.value.trim();
          if (url) {
            previewImg.src = url;
            previewImg.onload = () => {
              previewContainer.classList.remove('hidden');
            };
            previewImg.onerror = () => {
              previewContainer.classList.add('hidden');
            };
          } else {
            previewContainer.classList.add('hidden');
          }
        });
      }
    }

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
