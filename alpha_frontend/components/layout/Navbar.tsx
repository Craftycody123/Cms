'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Why Us', href: '/why-us' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold font-syne tracking-tight text-slate-900">
          ALPHA<span className="text-blue-600">.</span>
        </Link>
        <div className="hidden md:flex space-x-8 items-center">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className={`text-sm font-medium transition-colors hover:text-blue-600 ${pathname === link.href ? 'text-blue-600' : 'text-slate-600'}`}>
              {link.name}
            </Link>
          ))}
          <Link href="/contact" className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all transform hover:scale-105">
            Get In Touch
          </Link>
        </div>
        
        <button className="md:hidden text-slate-900 focus:outline-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl flex flex-col px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className={`text-lg font-medium ${pathname === link.href ? 'text-blue-600' : 'text-slate-800'}`}>
              {link.name}
            </Link>
          ))}
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="bg-slate-900 text-white text-center px-4 py-3 rounded-full text-base font-medium mt-4">
            Get In Touch
          </Link>
        </div>
      )}
    </nav>
  );
}
