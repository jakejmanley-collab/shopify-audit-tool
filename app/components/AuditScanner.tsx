'use client';

import { useState } from 'react';

export default function AuditScanner() {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  
  // UI States
  const [isScanning, setIsScanning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');

  // Result Data States
  const [issueCount, setIssueCount] = useState(0);
  const [loadTime, setLoadTime] = useState('0');
  const [scriptCount, setScriptCount] = useState(0);

  const startScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    // 1. Clean the URL
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http')) {
      cleanUrl = `https://${cleanUrl}`;
    }
    setUrl(cleanUrl);

    // 2. Reset UI
    setIsScanning(true);
    setIsFinished(false);
    setProgress(10); 
    setStatus('Initializing secure scanner...');

    try {
      // 3. Start Fake Progress (Visuals only)
      let fakeProgress = 10;
      const progressInterval = setInterval(() => {
        fakeProgress += 5;
        if (fakeProgress < 90) {
          setProgress(fakeProgress);
          // Professional status messages
          if (fakeProgress === 30) setStatus('Analyzing Javascript execution...');
          if (fakeProgress === 60) setStatus('Measuring mobile load latency...');
          if (fakeProgress === 80) setStatus('Identifying script collisions...');
        }
      }, 500);

      // 4. CALL THE REAL API
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: cleanUrl }),
      });

      const data = await response.json();

      // 5. PROCESS RESULTS
      if (data.success) {
        setIssueCount(data.errorCount);
        setLoadTime(data.loadTime);
        setScriptCount(data.scriptCount);
      }

      // 6. FINISH SCAN
      clearInterval(progressInterval);
      setProgress(100); 
      setStatus('Scan Complete!');

      // Slight delay for UX
      setTimeout(() => {
        setIsFinished(true);
      }, 800);

    } catch (error) {
      console.error('Scanner Error:', error);
      setIsScanning(false);
      alert('Connection timeout. Please check the URL and try again.');
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here is where you would send the email to your database/Formspree
    alert(`Success! We have queued your manual audit for ${url}. Check your email (${email}) in 12-24 hours.`);
  };

  return (
    <div className="bg-white border-2 border-blue-100 p-8 rounded-3xl shadow-xl transition-all duration-500">
      
      {/* STATE 1: Initial Input */}
      {!isScanning && !isFinished && (
        <form onSubmit={startScan} className="space-y-4">
          <label className="block text-sm font-bold text-gray-700">Enter Shopify Store URL</label>
          <div className="flex flex-col md:flex-row gap-2">
            <input
              type="text" 
              placeholder="your-store.myshopify.com" 
              className="flex-1 p-4 border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none transition"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">
              Start Free Audit
            </button>
          </div>
        </form>
      )}

      {/* STATE 2: The Animated Scan */}
      {isScanning && !isFinished && (
        <div className="space-y-6 py-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-blue-600 animate-pulse">{status}</span>
            <span className="text-gray-400">{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* STATE 3: The Lead Capture Form (RESULTS DASHBOARD) */}
      {isFinished && (
        <form onSubmit={handleLeadSubmit} className="space-y-6 text-center animate-in fade-in zoom-in duration-500">
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Scan Complete!</h3>

          {/* NEW: The Metrics Dashboard */}
          <div className="text-left bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6">
             <div className="flex justify-between border-b border-gray-200 pb-2 mb-2">
               <span className="text-gray-600">Mobile Load Time:</span>
               <span className={`font-bold ${parseFloat(loadTime) > 3 ? 'text-red-600' : 'text-green-600'}`}>
                 {loadTime}s
               </span>
             </div>
             <div className="flex justify-between border-b border-gray-200 pb-2 mb-2">
               <span className="text-gray-600">Active Scripts:</span>
               <span className="font-bold text-orange-600">{scriptCount}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-gray-600">Technical Conflicts:</span>
               <span className="font-bold text-red-600">{issueCount}</span>
             </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            A specialist must manually verify these <strong>{issueCount} conflicts</strong> to determine the exact revenue impact.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 mb-4 border border-blue-100">
            <strong>Timeline:</strong> You will receive your verified Revenue Recovery Report via email within the next <strong>24 hours</strong>.
          </div>

          <div className="space-y-3">
            <input
              type="email"
              placeholder="Your professional email"
              className="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none transition text-center"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg text-lg">
              Send My Report →
            </button>
          </div>
          
          <p className="text-xs text-gray-400 mt-4 italic">
            *Please check your junk/spam folder if you don't see it in your inbox tomorrow!
          </p>
        </form>
      )}
    </div>
  );
}