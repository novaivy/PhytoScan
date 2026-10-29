import React from 'react';
import { Camera, Sprout } from 'lucide-react';

interface HeaderProps {
  activeTab: 'scan' | 'diagnosis' | 'garden' | 'guide';
  setActiveTab: (tab: 'scan' | 'diagnosis' | 'garden' | 'guide') => void;
  hasActiveDiagnosis: boolean;
  onQuickScan: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  hasActiveDiagnosis,
  onQuickScan,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-stone-50/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => setActiveTab('scan')}
          className="flex items-center gap-2.5 text-stone-900 hover:text-emerald-800 transition-colors shrink-0 text-left"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-800 text-stone-50 flex items-center justify-center shadow-sm">
            <Sprout className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-xl font-bold tracking-tight whitespace-nowrap">
            PhytoScan
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => setActiveTab('scan')}
            className={`transition-colors whitespace-nowrap py-1 relative ${
              activeTab === 'scan'
                ? 'text-emerald-800 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-800'
                : 'hover:text-stone-900'
            }`}
          >
            Leaf Scanner
          </button>
          <button
            onClick={() => setActiveTab('diagnosis')}
            disabled={!hasActiveDiagnosis}
            className={`transition-colors whitespace-nowrap py-1 relative ${
              activeTab === 'diagnosis'
                ? 'text-emerald-800 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-800'
                : hasActiveDiagnosis
                ? 'hover:text-stone-900'
                : 'text-stone-400 cursor-not-allowed'
            }`}
          >
            Diagnostics
          </button>
          <button
            onClick={() => setActiveTab('garden')}
            className={`transition-colors whitespace-nowrap py-1 relative ${
              activeTab === 'garden'
                ? 'text-emerald-800 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-800'
                : 'hover:text-stone-900'
            }`}
          >
            My Garden
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`transition-colors whitespace-nowrap py-1 relative ${
              activeTab === 'guide'
                ? 'text-emerald-800 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-800'
                : 'hover:text-stone-900'
            }`}
          >
            Disease Guide
          </button>
        </nav>

        {/* Zone 3: Primary Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onQuickScan}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-50 bg-emerald-800 hover:bg-emerald-900 active:scale-[0.98] rounded-lg transition-all shadow-sm whitespace-nowrap"
          >
            <Camera className="w-4 h-4" />
            <span>Scan Leaf</span>
          </button>
        </div>
      </div>

      {/* Mobile subnav bar */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-200/70 bg-stone-100/70 py-2 px-2 text-xs font-medium text-stone-600">
        <button
          onClick={() => setActiveTab('scan')}
          className={`px-2 py-1 rounded ${activeTab === 'scan' ? 'bg-white text-emerald-800 font-semibold shadow-xs' : ''}`}
        >
          Scan
        </button>
        <button
          onClick={() => setActiveTab('diagnosis')}
          disabled={!hasActiveDiagnosis}
          className={`px-2 py-1 rounded ${
            activeTab === 'diagnosis'
              ? 'bg-white text-emerald-800 font-semibold shadow-xs'
              : hasActiveDiagnosis
              ? ''
              : 'text-stone-400 opacity-60'
          }`}
        >
          Report
        </button>
        <button
          onClick={() => setActiveTab('garden')}
          className={`px-2 py-1 rounded ${activeTab === 'garden' ? 'bg-white text-emerald-800 font-semibold shadow-xs' : ''}`}
        >
          My Garden
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`px-2 py-1 rounded ${activeTab === 'guide' ? 'bg-white text-emerald-800 font-semibold shadow-xs' : ''}`}
        >
          Field Guide
        </button>
      </div>
    </header>
  );
};
