import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0">
        <div>
          <Link href="/" className="text-3xl font-bold font-syne tracking-tight text-white">
            ALPHA<span className="text-blue-500">.</span>
          </Link>
          <p className="mt-4 text-slate-400 max-w-sm">We build brands that stand out in the modern world. Your success is our mission.</p>
        </div>
        <div className="flex space-x-6">
           <a href="#" className="text-slate-400 hover:text-white transition-colors">Twitter</a>
           <a href="#" className="text-slate-400 hover:text-white transition-colors">LinkedIn</a>
           <a href="#" className="text-slate-400 hover:text-white transition-colors">Instagram</a>
        </div>
      </div>
      <div className="container mx-auto px-6 lg:px-12 mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} Alpha Agency. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
