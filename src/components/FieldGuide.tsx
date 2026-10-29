import React, { useState } from 'react';
import { COMMON_DISEASES_ENCYCLOPEDIA } from '../data/samplePlants';
import { DiseaseInfo, PathogenType } from '../types/plant';
import {
  Search,
  BookOpen,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  X,
  ExternalLink,
} from 'lucide-react';

interface FieldGuideProps {
  onScanSpecimen?: (diseaseName: string) => void;
}

export const FieldGuide: React.FC<FieldGuideProps> = ({ onScanSpecimen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDisease, setSelectedDisease] = useState<DiseaseInfo | null>(null);

  const categories = ['all', 'Fungal', 'Bacterial', 'Pest/Insect', 'Nutritional/Abiotic'];

  const filteredDiseases = COMMON_DISEASES_ENCYCLOPEDIA.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.scientificAgent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.commonHosts.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.keyVisualSigns.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Title & Introduction */}
      <div className="max-w-3xl mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900" style={{ textWrap: 'balance' }}>
          Botanical Leaf Disease Field Guide
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-stone-600">
          Visual encyclopedia of common foliar pathogens, nutrient deficiencies, and pest infestations. Learn to identify symptoms early and apply organic controls.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by disease, host (tomato, rose, monstera), or symptom (rings, yellowing)..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
          />
        </div>

        {/* Category Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-stone-100 rounded-xl">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {cat === 'all' ? 'All Pathogens' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Disease Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDiseases.map((disease) => (
          <div
            key={disease.id}
            onClick={() => setSelectedDisease(disease)}
            className="group bg-white rounded-2xl border border-stone-200 hover:border-emerald-700 shadow-xs overflow-hidden transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Photo preview */}
              <div className="relative aspect-16/10 bg-stone-100 overflow-hidden">
                <img
                  src={disease.sampleImage}
                  alt={disease.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono bg-stone-900/80 text-stone-50 backdrop-blur-xs">
                  {disease.category}
                </div>
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-white/90 text-stone-900 backdrop-blur-xs">
                  Severity: {disease.severity}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="text-[11px] font-mono text-stone-500 italic mb-1">
                  {disease.scientificAgent}
                </div>
                <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors mb-2">
                  {disease.name}
                </h3>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
                  {disease.description}
                </p>

                {/* Common Hosts */}
                <div className="mb-3">
                  <span className="text-[11px] font-semibold text-stone-700 block mb-1">
                    Susceptible Hosts:
                  </span>
                  <div className="flex flex-wrap gap-1 text-[11px] text-stone-600">
                    {disease.commonHosts.map((host, hIdx) => (
                      <span key={hIdx} className="bg-stone-100 px-2 py-0.5 rounded text-stone-700">
                        {host}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Sign Bullet */}
                <div className="text-xs text-stone-700 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                  <span className="font-semibold text-stone-900 block mb-0.5">Primary Visual Tell:</span>
                  <p className="line-clamp-2 text-stone-600">
                    {disease.keyVisualSigns[0]}
                  </p>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-5 py-3 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between text-xs font-semibold text-emerald-800">
              <span>View Treatment & Prevention</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {filteredDiseases.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-stone-200">
          <BookOpen className="w-8 h-8 text-stone-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-stone-900">No matching diseases found</h3>
          <p className="text-xs text-stone-500 mt-1">Try adjusting your search terms or filter selection.</p>
        </div>
      )}

      {/* Detailed Disease Modal */}
      {selectedDisease && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl p-6 relative">
            <button
              onClick={() => setSelectedDisease(null)}
              className="absolute top-4 right-4 p-2 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
              <span>{selectedDisease.category}</span>
              <span aria-hidden="true">·</span>
              <span className="italic">{selectedDisease.scientificAgent}</span>
            </div>

            <h2 className="text-2xl font-bold text-stone-900 mb-3">
              {selectedDisease.name}
            </h2>

            {/* Specimen image */}
            <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-stone-900 mb-4">
              <img
                src={selectedDisease.sampleImage}
                alt={selectedDisease.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <p className="text-xs text-stone-700 leading-relaxed mb-4">
              {selectedDisease.description}
            </p>

            {/* Diagnostic Signs */}
            <div className="mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-2">
                Characteristic Visual Signs
              </h4>
              <ul className="space-y-1.5 text-xs text-stone-700">
                {selectedDisease.keyVisualSigns.map((sign, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-800 mt-1.5 shrink-0" />
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Environmental Causes */}
            <div className="mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-2">
                Common Triggers & Drivers
              </h4>
              <ul className="space-y-1.5 text-xs text-stone-700">
                {selectedDisease.typicalCauses.map((cause, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-700 mt-1.5 shrink-0" />
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Organic Treatment */}
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 mb-4 text-xs">
              <span className="font-bold text-emerald-900 block mb-1">
                Organic Treatment Formulation:
              </span>
              <p className="text-emerald-950 leading-relaxed">
                {selectedDisease.organicTreatment}
              </p>
            </div>

            {/* Prevention */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs">
              <span className="font-bold text-stone-900 block mb-1">
                Preventative Cultural Care:
              </span>
              <p className="text-stone-700 leading-relaxed">
                {selectedDisease.preventativeCare}
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedDisease(null)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Close Field Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
