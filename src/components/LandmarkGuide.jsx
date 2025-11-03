import React, { useMemo, useRef, useState, useEffect } from 'react';

// Utility math helpers
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

// Map deviation from ideal ratio to a 0-100 score with a soft tolerance
function scoreRatio(value, ideal, tolerance = 0.15) {
  if (!isFinite(value) || value <= 0) return 0;
  const dev = Math.abs(value - ideal) / ideal; // relative deviation
  const s = 100 * Math.max(0, 1 - dev / tolerance);
  return Math.min(100, Math.max(0, s));
}

function scoreEquality(values, tolerance = 0.12) {
  // Score how close multiple values are to being equal
  if (values.some((v) => !isFinite(v) || v <= 0)) return 0;
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const devs = values.map((v) => Math.abs(v - avg) / avg);
  const worst = Math.max(...devs);
  return Math.min(100, Math.max(0, 100 * Math.max(0, 1 - worst / tolerance)));
}

const steps = [
  { key: 'hairline', label: 'Top of forehead (approx. hairline center)' },
  { key: 'browLeft', label: 'Left eyebrow peak' },
  { key: 'browRight', label: 'Right eyebrow peak' },
  { key: 'noseBase', label: 'Base of nose (columella)' },
  { key: 'chin', label: 'Bottom of chin center' },

  { key: 'cheekLeft', label: 'Left cheek widest point' },
  { key: 'cheekRight', label: 'Right cheek widest point' },

  { key: 'eyeLeftOuter', label: 'Left eye outer corner' },
  { key: 'eyeLeftInner', label: 'Left eye inner corner' },
  { key: 'eyeRightInner', label: 'Right eye inner corner' },
  { key: 'eyeRightOuter', label: 'Right eye outer corner' },

  { key: 'noseLeft', label: 'Left nostril outer edge' },
  { key: 'noseRight', label: 'Right nostril outer edge' },

  { key: 'mouthLeft', label: 'Left mouth corner' },
  { key: 'mouthRight', label: 'Right mouth corner' },
];

export default function LandmarkGuide({ imageSrc, onMetrics }) {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const [points, setPoints] = useState({});
  const [current, setCurrent] = useState(0);
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    setPoints({});
    setCurrent(0);
  }, [imageSrc]);

  const handleImageLoad = (e) => {
    const img = e.currentTarget;
    setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
  };

  const onClick = (e) => {
    if (!containerRef.current || !imgRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const key = steps[current]?.key;
    if (!key) return;

    setPoints((prev) => ({ ...prev, [key]: { x, y } }));
    if (current < steps.length - 1) setCurrent((c) => c + 1);
  };

  const ready = steps.every((s) => points[s.key]);

  const metrics = useMemo(() => {
    if (!ready) return null;

    const p = points;
    const browMid = mid(p.browLeft, p.browRight);
    const faceLength = dist(p.hairline, p.chin);
    const faceWidth = dist(p.cheekLeft, p.cheekRight);

    const third1 = dist(p.hairline, browMid);
    const third2 = dist(browMid, p.noseBase);
    const third3 = dist(p.noseBase, p.chin);

    const leftEyeWidth = dist(p.eyeLeftOuter, p.eyeLeftInner);
    const rightEyeWidth = dist(p.eyeRightOuter, p.eyeRightInner);
    const avgEyeWidth = (leftEyeWidth + rightEyeWidth) / 2;
    const interocular = dist(p.eyeLeftInner, p.eyeRightInner);

    const noseWidth = dist(p.noseLeft, p.noseRight);
    const mouthWidth = dist(p.mouthLeft, p.mouthRight);

    const midline = {
      x: (p.cheekLeft.x + p.cheekRight.x) / 2,
      y: (p.hairline.y + p.chin.y) / 2,
    };

    const symmetryPairs = [
      [p.eyeLeftOuter, p.eyeRightOuter],
      [p.eyeLeftInner, p.eyeRightInner],
      [p.noseLeft, p.noseRight],
      [p.mouthLeft, p.mouthRight],
      [p.cheekLeft, p.cheekRight],
      [p.browLeft, p.browRight],
    ];

    const midDist = (pt) => Math.abs(pt.x - midline.x);
    const symDiffs = symmetryPairs.map(([l, r]) => Math.abs(midDist(l) - midDist(r)));
    const symScale = faceWidth || 1;
    const symmetryScore = 100 * Math.max(0, 1 - (symDiffs.reduce((a, b) => a + b, 0) / symDiffs.length) / (0.08 * symScale));

    // Scores
    const thirdsScore = scoreEquality([third1, third2, third3]);
    const eyeSpacingScore = scoreRatio(interocular / avgEyeWidth, 1.0, 0.18);
    const noseMouthScore = scoreRatio(mouthWidth / noseWidth, 1.6, 0.25);
    const goldenFaceScore = scoreRatio(faceLength / faceWidth, 1.618, 0.25);
    const symmetryClamped = Math.min(100, Math.max(0, symmetryScore));

    const weights = {
      thirds: 0.25,
      eye: 0.2,
      noseMouth: 0.2,
      golden: 0.15,
      symmetry: 0.2,
    };

    const overall =
      thirdsScore * weights.thirds +
      eyeSpacingScore * weights.eye +
      noseMouthScore * weights.noseMouth +
      goldenFaceScore * weights.golden +
      symmetryClamped * weights.symmetry;

    const breakdown = [
      { name: 'Facial thirds', score: Math.round(thirdsScore), tip: 'Aim for similar heights from hairline→brow, brow→nose, nose→chin.' },
      { name: 'Eye spacing', score: Math.round(eyeSpacingScore), tip: 'The gap between eyes ideally ≈ one eye width.' },
      { name: 'Nose ↔ Mouth balance', score: Math.round(noseMouthScore), tip: 'Mouth width around 1.6× nose width looks balanced.' },
      { name: 'Golden ratio (L/W)', score: Math.round(goldenFaceScore), tip: 'Face length to width close to 1.6 is often perceived as harmonious.' },
      { name: 'Left/Right symmetry', score: Math.round(symmetryClamped), tip: 'Small left/right differences are totally normal!' },
    ];

    return {
      overall: Math.round(overall),
      breakdown,
      raw: {
        thirds: [third1, third2, third3],
        eyeSpacing: interocular / (avgEyeWidth || 1),
        noseMouth: mouthWidth / (noseWidth || 1),
        golden: faceLength / (faceWidth || 1),
      },
    };
  }, [points, ready]);

  useEffect(() => {
    if (metrics && onMetrics) onMetrics(metrics);
  }, [metrics, onMetrics]);

  const reset = () => {
    setPoints({});
    setCurrent(0);
  };

  if (!imageSrc) return null;

  const instruction = steps[current]?.label || 'All points placed — review your score below!';

  return (
    <section className="w-full">
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Mark landmarks</h3>
              <button onClick={reset} className="text-sm text-indigo-600 hover:underline">Reset</button>
            </div>
            <div className="relative w-full overflow-hidden rounded-lg border border-slate-200" ref={containerRef} onClick={onClick}>
              <img ref={imgRef} src={imageSrc} alt="Uploaded" onLoad={handleImageLoad} className="w-full h-auto block select-none" />
              {/* Overlay points */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {steps.map((s, idx) => {
                  const pt = points[s.key];
                  if (!pt) return null;
                  return (
                    <g key={s.key}>
                      <circle cx={pt.x} cy={pt.y} r={6} fill={idx === current ? '#4f46e5' : '#6366f1'} opacity={0.9} />
                      <text x={pt.x + 10} y={pt.y + 4} fontSize="12" fill="#111827" fontWeight="600">{idx + 1}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <p className="mt-3 text-sm text-slate-600"><span className="font-medium text-slate-800">Step {Math.min(current + 1, steps.length)}:</span> {instruction}</p>
            <p className="mt-1 text-xs text-slate-500">Tip: Zoom your browser if needed and click precisely. You can reset anytime.</p>
          </div>

          <div className="md:w-1/3">
            <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-2">What you’ll mark</h4>
              <ol className="list-decimal list-inside text-sm text-slate-700 space-y-1">
                {steps.map((s, i) => (
                  <li key={s.key} className={i === current ? 'font-medium text-indigo-700' : ''}>{s.label}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
