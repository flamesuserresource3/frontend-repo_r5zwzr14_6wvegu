import React from 'react';
import { Lightbulb } from 'lucide-react';

export default function HowItWorks() {
  return (
    <section className="w-full">
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <div className="flex items-center gap-2 text-slate-800 mb-2">
          <Lightbulb className="w-5 h-5" />
          <h3 className="font-semibold">How it works</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="font-semibold text-slate-800 mb-1">1) Upload & mark points</div>
            <p>Use a clear, front-facing photo. Click the guided points like hairline, eyes, nose, mouth, and chin.</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="font-semibold text-slate-800 mb-1">2) We measure classic ratios</div>
            <p>We compute facial thirds, golden ratio of length/width, eye spacing, and balance between nose and mouth.</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="font-semibold text-slate-800 mb-1">3) Get a friendly score</div>
            <p>See a breakdown with actionable insights — inspired by FaceIQ’s educational breakdowns.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
