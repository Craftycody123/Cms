export default function WhyUsPage() {
  const steps = [
    { title: "Discovery", desc: "Understanding your brand, audience, and goals." },
    { title: "Strategy", desc: "Crafting a tailored plan to achieve maximum impact." },
    { title: "Execution", desc: "Bringing the strategy to life with creative excellence." },
    { title: "Optimization", desc: "Analyzing results and refining for continuous growth." },
  ];

  return (
    <div className="pt-24 min-h-screen bg-slate-50">
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h1 className="text-5xl font-bold font-syne text-slate-900 mb-6">Why Choose Alpha</h1>
          <p className="text-xl text-slate-600 leading-relaxed font-inter">
            We don&apos;t just create designs; we build comprehensive experiences that empower your business.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold font-syne mb-8">Our Edge</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-2">Creative Excellence</h3>
                <p className="text-slate-600">Award-winning designs that capture attention and drive engagement.</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Data-Driven Approach</h3>
                <p className="text-slate-600">Every decision is backed by analytics and strategic insights.</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Dedicated Partnership</h3>
                <p className="text-slate-600">We work as an extension of your team, committed to your long-term success.</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-600 rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="text-3xl font-bold font-syne mb-10">Our Process</h2>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-blue-400 before:to-transparent">
              {steps.map((step, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-blue-200 bg-blue-500 text-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    {idx + 1}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] px-4">
                    <div className="bg-blue-700/50 p-6 rounded-2xl shadow-sm border border-blue-500/30">
                      <h4 className="font-bold text-xl mb-1">{step.title}</h4>
                      <p className="text-blue-100 text-sm">{step.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
