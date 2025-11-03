import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

export default function UploadSection({ onImageSelected }) {
  const fileRef = useRef(null);

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onImageSelected(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="w-full">
      <div
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={onDrop}
        className="border-2 border-dashed border-slate-300 rounded-xl p-6 md:p-10 text-center bg-white shadow-sm hover:border-indigo-300 transition-colors"
      >
        <div className="mx-auto max-w-xl">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-slate-800">Upload a clear, front-facing photo</h3>
          <p className="text-slate-600 mt-2 text-sm md:text-base">Good lighting, neutral expression, no extreme angles. JPG or PNG works great.</p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Choose Image
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <div className="text-xs text-slate-500 flex items-center justify-center">or drag & drop</div>
          </div>
        </div>
      </div>
    </section>
  );
}
