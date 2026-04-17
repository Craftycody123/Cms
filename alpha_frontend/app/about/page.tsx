import api from '@/lib/api';

type TeamMember = {
  id: number;
  name: string;
  role: string;
  bio: string;
  photo_url: string;
};

async function getTeam() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/team`, { next: { revalidate: 10 } });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    return [];
  }
}

export default async function AboutPage() {
  const team: TeamMember[] = await getTeam();

  return (
    <div className="pt-24 min-h-screen bg-slate-50">
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h1 className="text-5xl font-bold font-syne text-slate-900 mb-6">About Alpha</h1>
          <p className="text-xl text-slate-600 leading-relaxed font-inter">
            We are a collective of dreamers, designers, and developers. Our mission is to transform 
            brands with bold creativity and strategic precision.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold font-syne mb-4">Our Vision</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              To be the global standard for creative excellence, helping everyday businesses become timeless brands.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold font-syne mb-4">Our Mission</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              To deliver exceptional design and marketing solutions that drive real results, combining aesthetic brilliance with data-backed strategies.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-100">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-4xl font-bold font-syne text-center mb-16">Meet The Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.length > 0 ? team.map(member => (
              <div key={member.id} className="bg-white p-8 rounded-3xl shadow-sm text-center transform hover:-translate-y-2 transition-transform duration-300">
                <div className="w-32 h-32 mx-auto bg-slate-200 rounded-full mb-6 overflow-hidden">
                   {member.photo_url ? <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" /> : null}
                </div>
                <h3 className="text-2xl font-bold font-syne mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                <p className="text-slate-600 text-sm">{member.bio}</p>
              </div>
            )) : (
              <p className="col-span-3 text-center text-slate-500">Team members loading...</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
