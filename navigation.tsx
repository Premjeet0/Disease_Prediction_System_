'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 hover:text-cyan-600 transition">
          <Heart className="w-6 h-6 text-cyan-600" />
          <span>Disease Prediction AI</span>
        </Link>
        
        <div className="flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-gray-700 hover:text-cyan-600 transition">
            Predictor
          </Link>
          <Link href="/models" className="text-sm font-medium text-gray-700 hover:text-cyan-600 transition">
            Model Performance
          </Link>
          <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-cyan-600 transition">
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}
