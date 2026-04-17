'use client';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AdminSettings() {
  const { isAuthed, loading } = useAuth();
  const [settings, setSettings] = useState<any[]>([]);

  const fetchSettings = () => {
    api.get('/settings').then(res => setSettings(res.data)).catch(console.error);
  };

  useEffect(() => {
    if (isAuthed) fetchSettings();
  }, [isAuthed]);

  const handleUpdate = async (key: string, value: string) => {
    await api.put(`/settings/${key}`, { value });
    fetchSettings();
  };

  if (loading || !isAuthed) return null;

  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-3xl font-bold font-syne mb-8">Site Settings</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-8">
          {settings.map(setting => (
            <div key={setting.key}>
              <label className="block text-sm font-medium text-slate-700 uppercase tracking-wider mb-2 font-syne">
                {setting.key.replace('_', ' ')}
              </label>
              <div className="flex space-x-4">
                 <input 
                   defaultValue={setting.value}
                   onBlur={(e) => {
                     if (e.target.value !== setting.value) {
                       handleUpdate(setting.key, e.target.value);
                     }
                   }}
                   className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                 />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
