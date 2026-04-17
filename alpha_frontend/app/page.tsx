import HeroSection from '@/components/sections/HeroSection';
import ServicesShowcase from '@/components/sections/ServicesShowcase';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesShowcase />
      
      {/* About Teaser */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 lg:px-12 text-center max-w-4xl">
          <h2 className="text-4xl font-bold font-syne text-slate-900 mb-6">Who We Are</h2>
          <p className="text-xl text-slate-600 font-inter mb-10 leading-relaxed">
            Alpha is a leading creative agency dedicated to your success. We combine strategic thinking with 
            innovative design to create brand experiences that captivate and convert.
          </p>
          <Link href="/about" className="inline-block border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white px-8 py-3 rounded-full font-semibold transition-colors">
            Learn More About Us
          </Link>
        </div>
      </section>

      {/* Why Us Strip */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-around items-center space-y-8 md:space-y-0 text-center">
          <div>
             <h3 className="text-4xl font-bold font-syne mb-2">10+</h3>
             <p className="text-blue-200">Years Experience</p>
          </div>
          <div>
             <h3 className="text-4xl font-bold font-syne mb-2">200+</h3>
             <p className="text-blue-200">Projects Delivered</p>
          </div>
          <div>
             <h3 className="text-4xl font-bold font-syne mb-2">50+</h3>
             <p className="text-blue-200">Industry Awards</p>
          </div>
        </div>
      </section>
    </>
  );
}
