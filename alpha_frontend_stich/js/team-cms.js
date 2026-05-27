/**
 * Team CMS - Manages dynamic team member content
 */

class TeamCMS {
  static async loadTeam() {
    try {
      const teamMembers = await APIService.getTeamMembers();
      this.renderTeam(teamMembers);
    } catch (error) {
      console.error('Failed to load team members:', error);
      showToast('Failed to load team members', 'error');
    }
  }

  static renderTeam(teamMembers) {
    const container = document.getElementById('team-list') || 
                     document.getElementById('team-container') || 
                     document.querySelector('[data-team-list]');
    
    if (!container) return;

    if (!teamMembers || teamMembers.length === 0) {
      container.innerHTML = '<p class="text-white/70">No team members available</p>';
      return;
    }

    container.innerHTML = teamMembers.map(member => `
      <div class="team-member reveal laurel-glass p-6 text-center group">
        <div class="relative overflow-hidden rounded-lg mb-4 h-64 bg-white/5">
          <img src="${escapeHtml(member.photo_url || 'https://via.placeholder.com/300x400')}" 
               alt="${escapeHtml(member.name)}" 
               class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
        </div>
        <h3 class="font-headline-md text-white font-bold mb-1">${escapeHtml(member.name)}</h3>
        <p class="text-laurel-green font-bold text-sm mb-3">${escapeHtml(member.role)}</p>
        <p class="text-white/70 text-sm mb-4">${escapeHtml(member.bio || '')}</p>
        ${member.social_links ? `
          <div class="flex justify-center gap-3">
            ${member.social_links.linkedin ? `<a href="${escapeHtml(member.social_links.linkedin)}" target="_blank" class="text-white/60 hover:text-laurel-green transition"><span class="material-symbols-outlined text-xl">link</span></a>` : ''}
            ${member.social_links.twitter ? `<a href="${escapeHtml(member.social_links.twitter)}" target="_blank" class="text-white/60 hover:text-laurel-green transition"><span class="material-symbols-outlined text-xl">link</span></a>` : ''}
          </div>
        ` : ''}
      </div>
    `).join('');
  }

  // For admin dashboard only
  static renderTeamForAdmin(teamMembers) {
    const container = document.getElementById('team-list') || 
                     document.getElementById('team-container') || 
                     document.querySelector('[data-team-list]');
    
    if (!container) return;

    if (!teamMembers || teamMembers.length === 0) {
      container.innerHTML = '<p class="text-white/70">No team members available</p>';
      return;
    }

    container.innerHTML = teamMembers.map(member => `
      <div class="team-member reveal laurel-glass p-6 text-center group">
        <div class="relative overflow-hidden rounded-lg mb-4 h-64 bg-white/5">
          <img src="${escapeHtml(member.photo_url || 'https://via.placeholder.com/300x400')}" 
               alt="${escapeHtml(member.name)}" 
               class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
        </div>
        <h3 class="font-headline-md text-white font-bold mb-1">${escapeHtml(member.name)}</h3>
        <p class="text-laurel-green font-bold text-sm mb-3">${escapeHtml(member.role)}</p>
        <p class="text-white/70 text-sm mb-4">${escapeHtml(member.bio || '')}</p>
        <div class="flex gap-2 mt-4 admin-controls justify-center">
          <button class="btn-edit-member text-sm bg-laurel-green/20 text-laurel-green px-3 py-2 rounded hover:bg-laurel-green/30 transition" data-id="${member.id}">
            Edit
          </button>
          <button class="btn-delete-member text-sm bg-red-500/20 text-red-400 px-3 py-2 rounded hover:bg-red-500/30 transition" data-id="${member.id}">
            Delete
          </button>
        </div>
        ${member.social_links ? `
          <div class="flex justify-center gap-3 mt-3">
            ${member.social_links.linkedin ? `<a href="${escapeHtml(member.social_links.linkedin)}" target="_blank" class="text-white/60 hover:text-laurel-green transition"><span class="material-symbols-outlined text-xl">link</span></a>` : ''}
            ${member.social_links.twitter ? `<a href="${escapeHtml(member.social_links.twitter)}" target="_blank" class="text-white/60 hover:text-laurel-green transition"><span class="material-symbols-outlined text-xl">link</span></a>` : ''}
          </div>
        ` : ''}
      </div>
    `).join('');

    // Attach event listeners
    document.querySelectorAll('.btn-edit-member').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.editMember(e.target.dataset.id);
      });
    });
    document.querySelectorAll('.btn-delete-member').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteMember(e.target.dataset.id);
      });
    });
  }

  static async editMember(id) {
    if (!AuthService.requireAdmin()) return;

    // Get current member data
    try {
      const members = await APIService.getTeamMembers();
      const member = members.find(m => m.id == id);
      if (!member) {
        showToast('Team member not found', 'error');
        return;
      }

      ModalForm.show('Edit Team Member', [
        { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Full name' },
        { name: 'role', label: 'Role', type: 'text', required: true, placeholder: 'e.g., Creative Director' },
        { name: 'bio', label: 'Biography', type: 'text', required: false, placeholder: 'Short bio' },
        { name: 'photo_url', label: 'Photo URL', type: 'text', required: false, placeholder: 'https://...' }
      ], async (data) => {
        try {
          await APIService.updateTeamMember(id, {
            name: data.name,
            role: data.role,
            bio: data.bio || '',
            photo_url: data.photo_url || '',
            is_active: true
          });
          showToast('Team member updated successfully!', 'success');
          this.loadTeam();
        } catch (error) {
          showToast(`Error: ${error.message}`, 'error');
        }
      });
    } catch (error) {
      showToast('Error loading team member', 'error');
    }
  }

  static async deleteMember(id) {
    if (!AuthService.requireAdmin()) return;

    if (!confirmAction('Delete this team member?')) return;

    try {
      await APIService.deleteTeamMember(id);
      showToast('Team member deleted successfully!', 'success');
      this.loadTeam();
    } catch (error) {
      showToast(`Error: ${error.message}`, 'error');
    }
  }

  static async createMember() {
    if (!AuthService.requireAdmin()) return;

    ModalForm.show('Add Team Member', [
      { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'e.g., John Doe' },
      { name: 'role', label: 'Role', type: 'text', required: true, placeholder: 'e.g., Creative Director' },
      { name: 'bio', label: 'Bio / About', type: 'text', required: false, placeholder: 'Tell us about them...' },
      { name: 'photo_url', label: 'Photo URL', type: 'text', required: false, placeholder: 'https://...' }
    ], async (data) => {
      try {
        await APIService.createTeamMember({
          name: data.name,
          role: data.role,
          bio: data.bio || '',
          photo_url: data.photo_url || '',
          is_active: true
        });
        showToast('Team member created successfully!', 'success');
        this.loadTeam();
      } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
      }
    });
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  TeamCMS.loadTeam();
});
