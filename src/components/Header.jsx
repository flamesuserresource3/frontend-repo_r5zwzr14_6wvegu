import React from 'react';
import { Star, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full py-8 md:py-12 bg-gradient-to-b from-indigo-600/10 to-transparent">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-3 text-indigo-600 mb-3">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-semibold tracking-wider uppercase">Face Ratio Analyzer</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
          Rate your face using science-backed facial ratios
        </h1>
        <p className="mt-3 md:mt-4 text-slate-600 max-w-2xl">
          Inspired by FaceIQ’s viral breakdowns. Upload a photo, mark a few key points, and get a balanced score with clear, friendly insights.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 text-indigo-700 bg-indigo-50 rounded-full px-4 py-2">
          <Star className="w-4 h-4 fill-indigo-600 text-indigo-600" />
          <span className="text-sm font-medium">No AI upload required — your photo never leaves the browser</span>
        </div>
      </div>
    </header>
  );
}
