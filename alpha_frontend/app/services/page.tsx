'use client';
import { useEffect, useState } from 'react';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';

type Service = {
  id: number;
  title: string;
  category: string;
  description: string;
  icon_url: string;
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/services`);
      if (!res.ok) {
        setServices([]);
        return;
      }
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Auto-refresh services every 10 seconds
  useAutoRefresh(fetchServices, 10000, []);

  const groupedServices = services.reduce((acc: Record<string, Service[]>, service) => {
    const cat = service.category.charAt(0).toUpperCase() + service.category.slice(1);
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(service);
    return acc;
  }, {});

  return (
    <div className="pt-24 min-h-screen bg-slate-50">
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h1 className="text-5xl font-bold font-syne text-slate-900 mb-6">Our Services</h1>
          <p className="text-xl text-slate-600 leading-relaxed font-inter">
            Comprehensive creative solutions designed to elevate your brand across every touchpoint.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          {loading && <p className="text-center text-slate-500">Loading services...</p>}
          
          {!loading && Object.keys(groupedServices).length === 0 && (
             <p className="text-center text-slate-500">No services found.</p>
          )}

          {Object.entries(groupedServices).map(([category, items]) => (
            <div key={category} className="mb-20 last:mb-0">
              <h2 className="text-3xl font-bold font-syne text-slate-900 mb-10 pb-4 border-b border-slate-200">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((service) => (
                  <div key={service.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300">
                    {service.icon_url && (
                      <div className="w-16 h-16 mb-4 bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center">
                        <img src={service.icon_url} alt={service.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <h3 className="text-2xl font-bold font-syne mb-4">{service.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
