'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

type Service = {
  id: number;
  title: string;
  category: string;
};

export default function ServicesShowcase() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    api.get('/services').then(res => {
      setServices(res.data.slice(0, 10));
    }).catch(err => console.error(err));
  }, []);

  return (
    <section className="py-24 bg-white overflow-hidden relative">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold font-syne mb-16 text-slate-900">What We Do</h2>
        
        <div className="relative w-full max-w-4xl mx-auto h-[600px] flex items-center justify-center">
          <div className="absolute z-10 w-32 h-32 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-2xl">
            <span className="text-2xl font-bold font-syne">ALPHA</span>
          </div>

          {services.map((service, index) => {
            const angle = (index / services.length) * 360;
            return (
              <motion.div
                key={service.id}
                className="absolute origin-center"
                initial={{ rotate: angle }}
                animate={{ rotate: angle + 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '80px' }}
              >
                <div 
                  className="bg-white border border-slate-100 shadow-lg px-6 py-3 rounded-full group hover:bg-slate-50 transition-colors"
                  style={{ transform: `rotate(-${angle}deg)` }}
                >
                  <p className="text-sm font-semibold text-slate-800">{service.title}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
