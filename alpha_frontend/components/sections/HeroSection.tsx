'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection({ headline = "Welcome", subtext = "We build brands" }: { headline?: string, subtext?: string }) {
  return (
    <section className="relative h-screen flex items-center justify-center bg-slate-50 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/50 via-slate-50 to-slate-50"></div>
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.h1 
          className="text-5xl md:text-7xl font-extrabold font-syne text-slate-900 tracking-tight leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {headline}
        </motion.h1>
        
        <motion.p 
          className="mt-6 text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-inter"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {subtext}
        </motion.p>
        
        <motion.div 
          className="mt-10 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <Link href="/contact" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-transform hover:-translate-y-1 shadow-lg shadow-blue-500/30">
            Let&apos;s Talk
          </Link>
          <Link href="/portfolio" className="bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 px-8 py-4 rounded-full text-lg font-semibold transition-transform hover:-translate-y-1 shadow-sm">
            View Our Work
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
