'use client';
import { useAuth } from '@/hooks/useAuth';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { removeToken } from '@/lib/auth';
import Link from 'next/link';
import { LogOut } from 'lucide-react';

export default function Dashboard() {
  const { isAuthed, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ services: 0, portfolio: 0, unread: 0 });

  const fetchStats = () => {
    Promise.all([
      api.get('/services'),
      api.get('/portfolio'),
      api.get('/inquiries')
    ]).then(([resServices, resPortfolio, resInquiries]) => {
      setStats({
        services: resServices.data.length,
        portfolio: resPortfolio.data.length,
        unread: resInquiries.data.items.filter((i: any) => !i.is_read).length
      });
    }).catch(console.error);
  };

  useEffect(() => {
    if (isAuthed) {
      fetchStats();
    }
  }, [isAuthed]);

  // Auto-refresh stats every 3 seconds
  useAutoRefresh(fetchStats, 3000, [isAuthed]);

  const handleLogout = () => {
    removeToken();
    router.push('/admin/login');
  };

  if (loading || !isAuthed) return <div className="min-h-screen pt-32 text-center text-slate-500">Loading...</div>;

  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold font-syne">Admin Dashboard</h1>
          <button onClick={handleLogout} className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-slate-500 text-lg mb-2">Total Services</h2>
            <p className="text-5xl font-bold font-syne text-slate-900">{stats.services}</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-slate-500 text-lg mb-2">Portfolio Items</h2>
            <p className="text-5xl font-bold font-syne text-slate-900">{stats.portfolio}</p>
          </div>
          <div className="bg-blue-600 text-white p-8 rounded-3xl shadow-lg shadow-blue-500/20">
            <h2 className="text-blue-200 text-lg mb-2">Unread Inquiries</h2>
            <p className="text-5xl font-bold font-syne">{stats.unread}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold font-syne mb-6">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link href="/admin/services" className="px-6 py-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors font-medium text-slate-700">Manage Services</Link>
            <Link href="/admin/portfolio" className="px-6 py-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors font-medium text-slate-700">Manage Portfolio</Link>
            <Link href="/admin/team" className="px-6 py-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors font-medium text-slate-700">Manage Team</Link>
            <Link href="/admin/inquiries" className="px-6 py-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors font-medium text-slate-700">View Inquiries</Link>
            <Link href="/admin/settings" className="px-6 py-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors font-medium text-slate-700">Site Settings</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
