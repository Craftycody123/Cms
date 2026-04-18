'use client';
import { useAuth } from '@/hooks/useAuth';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { CheckCircle, Circle, Trash2 } from 'lucide-react';

export default function AdminInquiries() {
  const { isAuthed, loading } = useAuth();
  const [inquiries, setInquiries] = useState<any[]>([]);

  const fetchInquiries = () => {
    api.get('/inquiries').then(res => {
      // Handle both array and paginated response
      const data = Array.isArray(res.data) ? res.data : res.data.items || [];
      setInquiries(data);
    }).catch(console.error);
  };

  useEffect(() => {
    if (isAuthed) fetchInquiries();
  }, [isAuthed]);

  // Auto-refresh inquiries every 3 seconds
  useAutoRefresh(fetchInquiries, 3000, [isAuthed]);

  const handleMarkRead = async (id: number) => {
    await api.patch(`/inquiries/${id}/read`);
    fetchInquiries();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      await api.delete(`/inquiries/${id}`);
      fetchInquiries();
    }
  };

  if (loading || !isAuthed) return null;

  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 max-w-5xl">
        <h1 className="text-3xl font-bold font-syne mb-8">Inquiries Inbox</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-100">
          {inquiries.length === 0 && <p className="p-8 text-slate-500 text-center">No inquiries found.</p>}
          {inquiries.map(inq => (
            <div key={inq.id} className={`p-6 transition-colors ${inq.is_read ? 'bg-slate-50' : 'bg-white'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                   <h3 className={`text-lg font-bold font-syne ${inq.is_read ? 'text-slate-600' : 'text-slate-900'}`}>{inq.name} <span className="text-sm font-normal text-slate-500 font-inter ml-2">{inq.email}</span></h3>
                   <p className="text-sm text-slate-500 mt-1">{new Date(inq.submitted_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center space-x-3">
                   {!inq.is_read && (
                     <button onClick={() => handleMarkRead(inq.id)} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"><Circle size={16} className="mr-1" fill="currentColor"/> Mark Read</button>
                   )}
                   {inq.is_read && (
                     <span className="text-green-600 text-sm font-medium flex items-center"><CheckCircle size={16} className="mr-1" /> Read</span>
                   )}
                   <button onClick={() => handleDelete(inq.id)} className="text-red-500 hover:text-red-700 ml-4"><Trash2 size={18} /></button>
                </div>
              </div>
              <div className="bg-slate-100 p-4 rounded-xl text-slate-700">
                {inq.message}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
