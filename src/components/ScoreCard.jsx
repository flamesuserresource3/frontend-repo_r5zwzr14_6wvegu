import React from 'react';
import { Gauge, Info } from 'lucide-react';

export default function ScoreCard({ metrics }) {
  if (!metrics) return null;
  const score = metrics.overall;

  const label = score >= 85 ? 'Exceptional' : score >= 70 ? 'Great' : score >= 55 ? 'Balanced' : score >= 40 ? 'Developing' : 'Room to grow';
  const color = score >= 85 ? 'from-emerald-500 to-emerald-600' : score >= 70 ? 'from-indigo-500 to-indigo-600' : score >= 55 ? 'from-sky-500 to-sky-600' : score >= 40 ? 'from-amber-500 to-amber-600' : 'from-rose-500 to-rose-600';

  return (
    <section className="w-full">
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/2">
            <div className="flex items-center gap-2 text-slate-800 mb-2">
              <Gauge className="w-5 h-5" />
              <h3 className="font-semibold">Your score</h3>
            </div>
            <div className={`rounded-xl bg-gradient-to-br ${color} text-white p-6 flex items-center justify-between`}>
              <div>
                <div className="text-5xl font-extrabold leading-none">{score}</div>
                <div className="mt-1 text-white/90 font-medium">{label}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/80">Facial harmony index</div>
                <div className="text-xs text-white/70">Based on ratios & symmetry</div>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 mt-0.5 text-slate-500" />
              This is a light‑hearted, educational score — not a definition of beauty. Lighting, expression, and camera angle affect results.
            </p>
          </div>

          <div className="lg:w-1/2">
            <h4 className="font-semibold text-slate-800 mb-3">Breakdown</h4>
            <div className="space-y-3">
              {metrics.breakdown.map((b) => (
                <div key={b.name} className="border border-slate-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium text-slate-800">{b.name}</div>
                    <div className="text-slate-900 font-bold">{b.score}</div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${b.score}%` }} />
                  </div>
                  <div className="text-xs text-slate-600 mt-1">{b.tip}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
