'use client';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Edit2, Trash2 } from 'lucide-react';

export default function AdminTeam() {
  const { isAuthed, loading } = useAuth();
  const [team, setTeam] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  const fetchTeam = () => {
    api.get('/team').then(res => setTeam(res.data)).catch(console.error);
  };

  useEffect(() => {
    if (isAuthed) fetchTeam();
  }, [isAuthed]);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      await api.delete(`/team/${id}`);
      fetchTeam();
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      if (editItem) {
        await api.put(`/team/${editItem.id}`, data);
      } else {
        await api.post('/team', data);
      }
      setIsModalOpen(false);
      setEditItem(null);
      fetchTeam();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !isAuthed) return null;

  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold font-syne">Manage Team</h1>
          <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors">Add Member</button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-sm text-slate-500">Name</th>
                <th className="px-6 py-4 font-semibold text-sm text-slate-500">Role</th>
                <th className="px-6 py-4 font-semibold text-sm text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {team.map(t => (
                <tr key={t.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-900 font-medium">{t.name}</td>
                  <td className="px-6 py-4 text-slate-500">{t.role}</td>
                  <td className="px-6 py-4 flex justify-end space-x-4">
                    <button onClick={() => { setEditItem(t); setIsModalOpen(true); }} className="text-blue-600 hover:text-blue-800"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-50 overflow-y-auto">
          <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-xl">
            <h2 className="text-2xl font-bold font-syne mb-6">{editItem ? 'Edit' : 'Add'} Team Member</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Name</label>
                <input name="name" defaultValue={editItem?.name} required className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Role</label>
                <input name="role" defaultValue={editItem?.role} required className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Photo URL</label>
                <input name="photo_url" defaultValue={editItem?.photo_url} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Bio</label>
                <textarea name="bio" defaultValue={editItem?.bio} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" rows={3}></textarea>
              </div>
              <div className="flex justify-end space-x-4 pt-4 mt-6">
                <button type="button" onClick={() => { setIsModalOpen(false); setEditItem(null); }} className="px-6 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors font-medium">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
