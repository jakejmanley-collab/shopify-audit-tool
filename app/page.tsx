import AuditScanner from "./components/AuditScanner";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      
      {/* The Headline / SEO Hook */}
      <div className="max-w-2xl w-full text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Is "App Bloat" Killing Your <span className="text-blue-600">Mobile Sales?</span>
        </h1>
        <p className="text-lg text-gray-600">
          Scan your Shopify store for hidden technical errors, script conflicts, and revenue leaks. 
          <span className="font-bold text-gray-800"> No installation required.</span>
        </p>
      </div>

      {/* The Scanner Component */}
      <div className="w-full max-w-xl">
        <AuditScanner />
      </div>

      {/* Social Proof / Footer */}
      <div className="mt-12 text-center text-sm text-gray-400">
        <p>Analyzing 1,000+ data points per scan.</p>
      </div>

    </main>
  );
}