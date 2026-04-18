'use client';
import { useAuth } from '@/hooks/useAuth';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Edit2, Trash2, Upload } from 'lucide-react';

export default function AdminPortfolio() {
  const { isAuthed, loading } = useAuth();
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const fetchPortfolio = () => {
    api.get('/portfolio').then(res => setPortfolio(res.data)).catch(console.error);
  };

  useEffect(() => {
    if (isAuthed) fetchPortfolio();
  }, [isAuthed]);

  // Auto-refresh portfolio every 5 seconds
  useAutoRefresh(fetchPortfolio, 5000, [isAuthed]);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      await api.delete(`/portfolio/${id}`);
      fetchPortfolio();
    }
  };

  const handleImageUpload = async (file: File, itemId?: number) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const params = new URLSearchParams();
      params.append('image_type', 'portfolio');
      if (itemId) {
        params.append('item_id', itemId.toString());
      }

      const response = await api.post(`/upload?${params.toString()}`, formData);

      const imageUrl = response.data.image_url;
      setImagePreview(imageUrl);
      
      // Update editItem with the new image_url
      if (editItem) {
        setEditItem({ ...editItem, image_url: imageUrl });
      }
      
      // Refresh portfolio list
      setTimeout(() => fetchPortfolio(), 500);
    } catch (error: any) {
      console.error('Upload failed:', error.response?.data || error.message);
      const errorMsg = error.response?.status === 401 
        ? 'Authentication failed. Please log in again.' 
        : error.response?.data?.detail || 'Image upload failed';
      alert(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // Use the preview image URL if uploaded
    if (imagePreview) {
      data.image_url = imagePreview;
    }

    data.is_published = data.is_published === 'on';

    try {
      if (editItem) {
        await api.put(`/portfolio/${editItem.id}`, data);
      } else {
        await api.post('/portfolio', data);
      }
      setIsModalOpen(false);
      setEditItem(null);
      setImagePreview('');
      fetchPortfolio();
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenModal = (item?: any) => {
    setEditItem(item || null);
    setImagePreview(item?.image_url || '');
    setIsModalOpen(true);
  };

  if (loading || !isAuthed) return null;

  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold font-syne">Manage Portfolio</h1>
          <button onClick={() => handleOpenModal()} className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors">Add Item</button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-sm text-slate-500">Title</th>
                <th className="px-6 py-4 font-semibold text-sm text-slate-500">Client</th>
                <th className="px-6 py-4 font-semibold text-sm text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map(p => (
                <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-900 font-medium">{p.title}</td>
                  <td className="px-6 py-4 text-slate-500">{p.client_placeholder}</td>
                  <td className="px-6 py-4 flex justify-end space-x-4">
                    <button onClick={() => { handleOpenModal(p); }} className="text-blue-600 hover:text-blue-800"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
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
            <h2 className="text-2xl font-bold font-syne mb-6">{editItem ? 'Edit' : 'Add'} Portfolio Item</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Title</label>
                <input name="title" defaultValue={editItem?.title} required className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Category</label>
                <input name="category" defaultValue={editItem?.category} required className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Client</label>
                <input name="client_placeholder" defaultValue={editItem?.client_placeholder} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Portfolio Image</label>
                <div className="flex flex-col gap-3">
                  {imagePreview && (
                    <div className="w-full h-48 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                      <img src={imagePreview} alt="Image preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <label className="flex items-center justify-center px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <Upload size={18} className="mr-2 text-slate-600" />
                    <span className="text-sm font-medium text-slate-600">Choose image or drag here</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, editItem?.id);
                      }}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  {uploading && <p className="text-sm text-slate-500">Uploading...</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Description</label>
                <textarea name="description" defaultValue={editItem?.description} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" rows={3}></textarea>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" name="is_published" id="is_published" defaultChecked={editItem ? editItem.is_published : true} />
                <label htmlFor="is_published" className="text-sm font-medium text-slate-700">Published</label>
              </div>
              <div className="flex justify-end space-x-4 pt-4 mt-6">
                <button type="button" onClick={() => { setIsModalOpen(false); setEditItem(null); setImagePreview(''); }} className="px-6 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors font-medium">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
