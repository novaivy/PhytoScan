import React, { useState } from 'react';
import {
  PlantDiagnosis,
  TreatmentStep,
  CareRemedy,
} from '../types/plant';
import {
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Droplets,
  Sun,
  Wind,
  Layers,
  Calendar,
  Sparkles,
  BookmarkPlus,
  ArrowLeft,
  Send,
  MessageSquare,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

interface DiagnosticReportProps {
  diagnosis: PlantDiagnosis;
  onScanAnother: () => void;
  onSaveToGarden: (diagnosis: PlantDiagnosis) => void;
  isSaved?: boolean;
}

export const DiagnosticReport: React.FC<DiagnosticReportProps> = ({
  diagnosis,
  onScanAnother,
  onSaveToGarden,
  isSaved = false,
}) => {
  const [activeTab, setActiveTab] = useState<'symptoms' | 'treatment' | 'care' | 'remedies' | 'ask'>('symptoms');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [treatmentFilter, setTreatmentFilter] = useState<string>('all');

  // Interactive Care Assistant state
  const [question, setQuestion] = useState<string>('');
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<
    { sender: 'user' | 'assistant'; text: string; tips?: string[] }[]
  >([
    {
      sender: 'assistant',
      text: `Hello! I've reviewed the diagnosis for your ${diagnosis.plantIdentification.commonName}. Feel free to ask me any questions about pruning, dosage ratios, quarantine, or daily care.`,
    },
  ]);

  const toggleStep = (stepKey: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey],
    }));
  };

  const handleAskAssistant = async (e?: React.FormEvent, directQuestion?: string) => {
    if (e) e.preventDefault();
    const query = directQuestion || question;
    if (!query.trim() || chatLoading) return;

    const newHistory = [...chatHistory, { sender: 'user' as const, text: query }];
    setChatHistory(newHistory);
    if (!directQuestion) setQuestion('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/plant/ask-care', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          context: {
            plantName: diagnosis.plantIdentification.commonName,
            diseaseName: diagnosis.diseaseDiagnosis.diseaseName,
            healthStatus: diagnosis.healthStatus,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get advice');
      }

      const data = await response.json();
      setChatHistory([
        ...newHistory,
        {
          sender: 'assistant',
          text: data.answer || 'Here is the recommended care approach.',
          tips: data.actionableTips || [],
        },
      ]);
    } catch (err: any) {
      setChatHistory([
        ...newHistory,
        {
          sender: 'assistant',
          text: 'To manage this leaf issue, isolate the plant immediately to prevent spore migration, gently prune affected sections, and adjust watering to avoid wet foliage.',
          tips: [
            'Wipe snips with 70% alcohol between cuts',
            'Water soil directly without wetting leaves',
            'Ensure bright indirect sunlight and gentle airflow',
          ],
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Color mapping based on health score
  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', bar: 'bg-emerald-600' };
    if (score >= 50) return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', bar: 'bg-amber-600' };
    return { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200', bar: 'bg-rose-600' };
  };

  const scoreStyle = getScoreColor(diagnosis.healthScore);

  const filteredTreatmentPlan = diagnosis.treatmentPlan.filter((step) => {
    if (treatmentFilter === 'all') return true;
    return step.type.toLowerCase().includes(treatmentFilter.toLowerCase());
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          onClick={onScanAnother}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Scan another leaf</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSaveToGarden(diagnosis)}
            disabled={isSaved}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              isSaved
                ? 'bg-stone-100 text-stone-500 border border-stone-200'
                : 'bg-emerald-800 hover:bg-emerald-900 text-stone-50 shadow-xs'
            }`}
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>{isSaved ? 'Saved in My Garden' : 'Save to My Garden'}</span>
          </button>
        </div>
      </div>

      {/* Hero Overview Card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
          {/* Leaf Photo Container */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-stone-900 border border-stone-200">
              <img
                src={diagnosis.imageUrl}
                alt={diagnosis.plantIdentification.commonName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono bg-stone-950/80 text-stone-100 backdrop-blur-xs">
                SPECIMEN ID: {diagnosis.id.slice(-6)}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-stone-500">
              <span>Scanned on {new Date(diagnosis.timestamp).toLocaleDateString()}</span>
              <span>Confidence: {diagnosis.plantIdentification.confidenceScore}%</span>
            </div>
          </div>

          {/* Plant & Pathology Summary Details */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-2">
                <span>{diagnosis.plantIdentification.plantFamily}</span>
                <span aria-hidden="true">·</span>
                <span className="italic">{diagnosis.plantIdentification.scientificName}</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-stone-700">{diagnosis.diseaseDiagnosis.pathogenType}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 mb-1">
                {diagnosis.plantIdentification.commonName}
              </h1>

              <div className="flex flex-wrap items-center gap-3 my-3">
                <div className={`px-3 py-1 rounded-md text-xs font-semibold border ${scoreStyle.bg} ${scoreStyle.text} ${scoreStyle.border}`}>
                  {diagnosis.healthStatus}
                </div>
                <div className="px-3 py-1 rounded-md text-xs font-semibold bg-stone-100 text-stone-800 border border-stone-200">
                  Severity: {diagnosis.diseaseDiagnosis.severityLevel}
                </div>
                {diagnosis.diseaseDiagnosis.contagious && (
                  <div className="px-3 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Contagious to Nearby Plants</span>
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 leading-relaxed mt-2">
                <span className="font-bold text-stone-900 block mb-0.5">Primary Diagnosis: {diagnosis.diseaseDiagnosis.diseaseName}</span>
                {diagnosis.diseaseDiagnosis.summary}
              </div>
            </div>

            {/* Health Rating Gauge */}
            <div className="mt-5 pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-stone-500 block">
                  Leaf Vitality Index
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-mono font-bold text-stone-900 tabular-nums">
                    {diagnosis.healthScore}
                  </span>
                  <span className="text-xs text-stone-400 font-mono">/ 100</span>
                  <span className="text-xs text-stone-500 ml-1">
                    ({diagnosis.healthScore >= 80 ? 'Optimal' : diagnosis.healthScore >= 50 ? 'Requires Care' : 'Urgent First Aid'})
                  </span>
                </div>
              </div>

              {/* Progress track */}
              <div className="w-full sm:w-64 bg-stone-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${scoreStyle.bar}`}
                  style={{ width: `${Math.max(5, diagnosis.healthScore)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="border-t border-stone-200 bg-stone-50/70 px-4 sm:px-6 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('symptoms')}
            className={`py-3 px-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              activeTab === 'symptoms'
                ? 'border-emerald-800 text-emerald-800 font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Symptoms & Causes
          </button>
          <button
            onClick={() => setActiveTab('treatment')}
            className={`py-3 px-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              activeTab === 'treatment'
                ? 'border-emerald-800 text-emerald-800 font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            14-Day Treatment Plan ({diagnosis.treatmentPlan.length} Steps)
          </button>
          <button
            onClick={() => setActiveTab('care')}
            className={`py-3 px-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              activeTab === 'care'
                ? 'border-emerald-800 text-emerald-800 font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Care & Environment
          </button>
          <button
            onClick={() => setActiveTab('remedies')}
            className={`py-3 px-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              activeTab === 'remedies'
                ? 'border-emerald-800 text-emerald-800 font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Remedies & Recipes
          </button>
          <button
            onClick={() => setActiveTab('ask')}
            className={`py-3 px-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ask'
                ? 'border-emerald-800 text-emerald-800 font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Ask Plant Doctor</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Symptoms & Causes */}
      {activeTab === 'symptoms' && (
        <div className="space-y-6">
          {/* Urgent Containment Actions */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900 flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Immediate Containment Actions (Execute Today)</span>
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {diagnosis.immediateActions.map((action, i) => (
                <li
                  key={i}
                  className="bg-white/80 p-3 rounded-xl border border-amber-200/60 text-xs text-amber-950 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual Symptoms Breakdown */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <h3 className="text-base font-bold text-stone-900 mb-4">
              Detected Leaf Symptoms
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {diagnosis.symptoms.map((s, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs flex flex-col justify-between"
                >
                  <div>
                    <span className="font-bold text-stone-900 text-sm block mb-1">
                      {s.symptom}
                    </span>
                    <span className="text-stone-500 block mb-2 font-mono text-[11px]">
                      Location: {s.location}
                    </span>
                    <p className="text-stone-600 leading-relaxed">
                      {s.appearance}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Root Causes & Environmental Drivers */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <h3 className="text-base font-bold text-stone-900 mb-3">
              Root Causes & Pathogen Transmission
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-700">
              {diagnosis.rootCauses.map((cause, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-800 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{cause}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab 2: 14-Day Treatment Protocol */}
      {activeTab === 'treatment' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                14-Day Rehabilitation Protocol
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Check off tasks as you complete them to track your plant's recovery.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
              {['all', 'pruning', 'remedy', 'environment'].map((filterKey) => (
                <button
                  key={filterKey}
                  onClick={() => setTreatmentFilter(filterKey)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer capitalize ${
                    treatmentFilter === filterKey
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {filterKey}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline checklist */}
          <div className="space-y-4">
            {filteredTreatmentPlan.map((step, idx) => {
              const stepKey = `step-${idx}-${step.day}`;
              const isDone = !!completedSteps[stepKey];

              return (
                <div
                  key={stepKey}
                  onClick={() => toggleStep(stepKey)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                    isDone
                      ? 'bg-emerald-50/50 border-emerald-200 opacity-80'
                      : 'bg-white border-stone-200 hover:border-emerald-600'
                  }`}
                >
                  <button
                    type="button"
                    className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isDone
                        ? 'bg-emerald-700 text-white'
                        : 'border border-stone-300 text-transparent hover:border-emerald-600'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-stone-100 text-stone-800 rounded">
                        {step.day}
                      </span>
                      <span className="text-[11px] font-mono text-stone-500">
                        {step.type}
                      </span>
                    </div>

                    <h4
                      className={`text-sm font-semibold transition-colors ${
                        isDone ? 'line-through text-stone-500' : 'text-stone-900'
                      }`}
                    >
                      {step.title}
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed mt-1">
                      {step.instructions}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Care Guide & Environment */}
      {activeTab === 'care' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Watering Guide */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">Hydration & Irrigation</h4>
                <span className="text-xs text-stone-500">Soil moisture & watering technique</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-stone-50">
                <span className="font-semibold text-stone-900 block mb-0.5">Cadence:</span>
                <span className="text-stone-700">{diagnosis.careGuide.watering.frequency}</span>
              </div>
              <div className="p-3 rounded-lg bg-stone-50">
                <span className="font-semibold text-stone-900 block mb-0.5">Application Technique:</span>
                <span className="text-stone-700">{diagnosis.careGuide.watering.technique}</span>
              </div>
              <div className="p-3 rounded-lg bg-stone-50">
                <span className="font-semibold text-stone-900 block mb-0.5">Moisture Target:</span>
                <span className="text-stone-700">{diagnosis.careGuide.watering.moistureLevel}</span>
              </div>
            </div>
          </div>

          {/* Light Exposure */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">Illumination & Photoperiod</h4>
                <span className="text-xs text-stone-500">Lux levels and orientation</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-stone-50">
                <span className="font-semibold text-stone-900 block mb-0.5">Ideal Exposure:</span>
                <span className="text-stone-700">{diagnosis.careGuide.light.ideal}</span>
              </div>
              <div className="p-3 rounded-lg bg-stone-50">
                <span className="font-semibold text-stone-900 block mb-0.5">Calibrated Lux Level:</span>
                <span className="text-stone-700 font-mono">{diagnosis.careGuide.light.luxLevel}</span>
              </div>
              <div className="p-3 rounded-lg bg-stone-50">
                <span className="font-semibold text-stone-900 block mb-0.5">Lighting Warning:</span>
                <span className="text-stone-700">{diagnosis.careGuide.light.warning}</span>
              </div>
            </div>
          </div>

          {/* Soil & Nutrition */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">Substrate & Nutrition</h4>
                <span className="text-xs text-stone-500">Soil porosity, fertilizer & pH</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-stone-50">
                <span className="font-semibold text-stone-900 block mb-0.5">Potting Media Composition:</span>
                <span className="text-stone-700">{diagnosis.careGuide.soilAndNutrients.soilType}</span>
              </div>
              <div className="p-3 rounded-lg bg-stone-50">
                <span className="font-semibold text-stone-900 block mb-0.5">Fertilizer Regimen:</span>
                <span className="text-stone-700">{diagnosis.careGuide.soilAndNutrients.fertilizer}</span>
              </div>
              <div className="p-3 rounded-lg bg-stone-50">
                <span className="font-semibold text-stone-900 block mb-0.5">Optimal Soil pH:</span>
                <span className="text-stone-700 font-mono">{diagnosis.careGuide.soilAndNutrients.pHRange}</span>
              </div>
            </div>
          </div>

          {/* Humidity & Airflow */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">Humidity & Microclimate</h4>
                <span className="text-xs text-stone-500">Atmospheric moisture & aeration</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-stone-50">
                <span className="font-semibold text-stone-900 block mb-0.5">Relative Humidity:</span>
                <span className="text-stone-700 font-mono">{diagnosis.careGuide.humidityAndAirflow.targetHumidity}</span>
              </div>
              <div className="p-3 rounded-lg bg-stone-50">
                <span className="font-semibold text-stone-900 block mb-0.5">Ventilation Guideline:</span>
                <span className="text-stone-700">{diagnosis.careGuide.humidityAndAirflow.ventilationTip}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Remedies & Recipes */}
      {activeTab === 'remedies' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <h3 className="text-base font-bold text-stone-900 mb-2">
            Targeted Organic & Biological Remedies
          </h3>
          <p className="text-xs text-stone-500 mb-6">
            Safe, non-toxic recipes formulated specifically for the diagnosed leaf condition.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {diagnosis.remedies.map((remedy, i) => (
              <div
                key={i}
                className="p-5 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="text-sm font-bold text-stone-900">
                      {remedy.name}
                    </h4>
                    {remedy.organic && (
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-medium">
                        ORGANIC
                      </span>
                    )}
                  </div>

                  <div className="mb-3">
                    <span className="text-xs font-semibold text-stone-700 block mb-1">
                      Preparation & Dosage:
                    </span>
                    <p className="text-xs text-stone-600 bg-white p-2.5 rounded-lg border border-stone-200 font-mono">
                      {remedy.recipeOrDosage}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-stone-500 pt-2 border-t border-stone-200/80">
                  <span className="font-medium text-stone-700">Frequency:</span> {remedy.frequency}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-stone-200">
            <h4 className="text-sm font-bold text-stone-900 mb-3">
              Permanent Prevention Checklist
            </h4>
            <ul className="space-y-2 text-xs text-stone-600">
              {diagnosis.preventionTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab 5: Interactive Ask Plant Doctor */}
      {activeTab === 'ask' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col h-[520px]">
          <div className="mb-4 pb-3 border-b border-stone-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Botanical Pathologist Assistant</span>
              </h3>
              <p className="text-xs text-stone-500">
                Ask specific questions regarding treatments, dosage, and propagation for this plant.
              </p>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-800 text-stone-50'
                      : 'bg-stone-100 text-stone-800 border border-stone-200/70'
                  }`}
                >
                  <p>{msg.text}</p>

                  {msg.tips && msg.tips.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-stone-200/60 space-y-1">
                      <span className="font-bold text-[11px] block text-stone-900">Key Execution Tips:</span>
                      {msg.tips.map((tip, tIdx) => (
                        <div key={tIdx} className="flex items-start gap-1.5 text-stone-700">
                          <span className="text-emerald-700 font-bold">›</span>
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="flex items-start">
                <div className="bg-stone-100 text-stone-600 rounded-xl p-3 text-xs border border-stone-200 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse" />
                  <span>Consulting pathology reference literature...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="flex items-center gap-2 overflow-x-auto py-2 mb-3">
            {[
              'Should I cut this infected leaf off?',
              'How to mix homemade neem oil spray?',
              'Is this contagious to other houseplants?',
              'How much water does it need now?',
            ].map((suggested, idx) => (
              <button
                key={idx}
                onClick={() => handleAskAssistant(undefined, suggested)}
                disabled={chatLoading}
                className="whitespace-nowrap px-2.5 py-1 text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              >
                {suggested}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleAskAssistant} className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={`Ask a question about this ${diagnosis.plantIdentification.commonName}...`}
              disabled={chatLoading}
              className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
            />
            <button
              type="submit"
              disabled={!question.trim() || chatLoading}
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-stone-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
