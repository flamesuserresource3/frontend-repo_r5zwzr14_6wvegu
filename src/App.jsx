import React, { useState } from 'react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import LandmarkGuide from './components/LandmarkGuide';
import ScoreCard from './components/ScoreCard';
import HowItWorks from './components/HowItWorks';

function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [metrics, setMetrics] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      <main className="max-w-5xl mx-auto px-4 pb-16 space-y-8">
        <UploadSection onImageSelected={(src) => { setImageSrc(src); setMetrics(null); }} />
        <HowItWorks />
        <LandmarkGuide imageSrc={imageSrc} onMetrics={setMetrics} />
        <ScoreCard metrics={metrics} />
        <footer className="text-center text-xs text-slate-500 pt-8">
          Built for fun and learning. Not medical or cosmetic advice.
        </footer>
      </main>
    </div>
  );
}

export default App;
