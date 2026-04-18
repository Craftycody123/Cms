'use client';
import { useEffect, useState } from 'react';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';

type Portfolio = {
  id: number;
  title: string;
  category: string;
  image_url: string;
  description: string;
  client_placeholder: string;
};

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPortfolio = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/portfolio`);
      if (!res.ok) {
        setPortfolio([]);
        return;
      }
      const data = await res.json();
      setPortfolio(data);
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
      setPortfolio([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  // Auto-refresh portfolio every 10 seconds
  useAutoRefresh(fetchPortfolio, 10000, []);

  return (
    <div className="pt-24 min-h-screen bg-slate-50">
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h1 className="text-5xl font-bold font-syne text-slate-900 mb-6">Our Portfolio</h1>
          <p className="text-xl text-slate-600 leading-relaxed font-inter">
            A showcase of our best work. See how we&apos;ve helped businesses achieve their goals.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          {loading && <p className="text-center text-slate-500">Loading portfolio...</p>}
          
          {!loading && portfolio.length === 0 && (
             <p className="text-center text-slate-500">No portfolio items found.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
            {portfolio.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="w-full h-[400px] bg-slate-200 rounded-3xl mb-6 overflow-hidden relative">
                   {item.image_url ? (
                     <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-400 font-syne text-xl">Image Placeholder</div>
                   )}
                   <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors"></div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl font-bold font-syne mb-2 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                    <p className="text-slate-500 mb-2">Client: {item.client_placeholder}</p>
                    <p className="text-slate-600">{item.description}</p>
                  </div>
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
