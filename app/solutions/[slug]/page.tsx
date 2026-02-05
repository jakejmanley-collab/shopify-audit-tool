import AuditScanner from '@/app/components/AuditScanner';
import data from '@/data/content.json';
import { notFound } from 'next/navigation';

// We added 'async' here to tell the computer this page needs a second to load parameters
export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  
  // We added 'await' here to make sure the URL 'slug' is actually ready
  const { slug } = await params;

  // Now we find the specific data using that slug
  const page = data.find((item) => item.slug === slug);

  if (!page) notFound();

  return (
    <main className="max-w-3xl mx-auto py-20 px-6 font-sans">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">{page.title}</h1>
      
      <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-10">
        <h2 className="text-red-800 font-bold uppercase text-sm tracking-widest mb-2">The Revenue Leak</h2>
        <p className="text-red-700 text-lg">{page.pain}</p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Manual Fix Steps</h2>
        <p className="text-gray-600 leading-relaxed text-lg">{page.solution}</p>
      </section>

      <section className="mt-16 border-t pt-16">
  <div className="text-center mb-10">
    <h2 className="text-3xl font-bold text-gray-900">Is your store leaking revenue?</h2>
    <p className="text-gray-500 mt-2 text-lg">
      Run our professional diagnostic tool to identify technical conflicts in seconds.
    </p>
  </div>
  
  {/* This line "calls" the component you created in the other file */}
  <AuditScanner />
</section>
    </main>
  );
}