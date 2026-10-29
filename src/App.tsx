import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Scanner } from './components/Scanner';
import { DiagnosticReport } from './components/DiagnosticReport';
import { MyGarden } from './components/MyGarden';
import { FieldGuide } from './components/FieldGuide';
import { AddPlantModal } from './components/AddPlantModal';
import { INITIAL_MONITORED_PLANTS, SAMPLE_CASES } from './data/samplePlants';
import { MonitoredPlant, PlantDiagnosis } from './types/plant';
import { Sprout, CheckCircle2, BookmarkCheck } from 'lucide-react';

const STORAGE_KEY_PLANTS = 'phytoscan_monitored_plants_v1';
const STORAGE_KEY_LAST_DIAG = 'phytoscan_latest_diagnosis_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'scan' | 'diagnosis' | 'garden' | 'guide'>('scan');
  const [activeDiagnosis, setActiveDiagnosis] = useState<PlantDiagnosis | null>(null);
  const [presetPlantName, setPresetPlantName] = useState<string>('');
  const [isAddPlantOpen, setIsAddPlantOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize monitored plants from localStorage or defaults
  const [monitoredPlants, setMonitoredPlants] = useState<MonitoredPlant[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLANTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved plants from storage');
    }
    return INITIAL_MONITORED_PLANTS;
  });

  // Load last diagnosis if available
  useEffect(() => {
    try {
      const savedDiag = localStorage.getItem(STORAGE_KEY_LAST_DIAG);
      if (savedDiag) {
        setActiveDiagnosis(JSON.parse(savedDiag));
      } else {
        // Default to the first sample case so user can inspect immediately if they switch to report
        setActiveDiagnosis(SAMPLE_CASES[1].diagnosis);
      }
    } catch (e) {
      setActiveDiagnosis(SAMPLE_CASES[1].diagnosis);
    }
  }, []);

  // Save plants to storage when changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PLANTS, JSON.stringify(monitoredPlants));
    } catch (e) {
      console.warn('Could not persist plants to storage');
    }
  }, [monitoredPlants]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleDiagnosisComplete = (diagnosis: PlantDiagnosis) => {
    setActiveDiagnosis(diagnosis);
    try {
      localStorage.setItem(STORAGE_KEY_LAST_DIAG, JSON.stringify(diagnosis));
    } catch (e) {}
    setActiveTab('diagnosis');
    showToast(`Diagnosed ${diagnosis.plantIdentification.commonName} with ${diagnosis.diseaseDiagnosis.diseaseName}`);
  };

  const handleSaveToGarden = (diagnosis: PlantDiagnosis) => {
    // Check if an existing plant matches
    const existingIndex = monitoredPlants.findIndex(
      (p) =>
        p.nickname.toLowerCase() === diagnosis.plantIdentification.commonName.toLowerCase() ||
        p.species.toLowerCase() === diagnosis.plantIdentification.commonName.toLowerCase()
    );

    const newScanEntry = {
      date: new Date().toISOString().split('T')[0],
      healthScore: diagnosis.healthScore,
      healthStatus: diagnosis.healthStatus,
      diagnosisName: diagnosis.diseaseDiagnosis.diseaseName,
      imageUrl: diagnosis.imageUrl,
      notes: diagnosis.diseaseDiagnosis.summary,
    };

    if (existingIndex >= 0) {
      // Update existing plant
      const existing = monitoredPlants[existingIndex];
      const updated: MonitoredPlant = {
        ...existing,
        lastScannedDate: new Date().toISOString().split('T')[0],
        currentHealthScore: diagnosis.healthScore,
        currentStatus: diagnosis.healthStatus,
        primaryIssue: diagnosis.diseaseDiagnosis.diseaseName,
        coverImage: diagnosis.imageUrl,
        scanHistory: [newScanEntry, ...existing.scanHistory],
      };

      const updatedList = [...monitoredPlants];
      updatedList[existingIndex] = updated;
      setMonitoredPlants(updatedList);
      showToast(`Updated health records for "${existing.nickname}"!`);
    } else {
      // Create a new monitored plant
      const newPlant: MonitoredPlant = {
        id: `plant-${Date.now()}`,
        nickname: diagnosis.plantIdentification.commonName,
        species: diagnosis.plantIdentification.commonName,
        scientificName: diagnosis.plantIdentification.scientificName,
        location: 'Garden / Balcony',
        addedDate: new Date().toISOString().split('T')[0],
        lastScannedDate: new Date().toISOString().split('T')[0],
        currentHealthScore: diagnosis.healthScore,
        currentStatus: diagnosis.healthStatus,
        primaryIssue: diagnosis.diseaseDiagnosis.diseaseName,
        coverImage: diagnosis.imageUrl,
        scanHistory: [newScanEntry],
        reminders: [
          {
            id: `rem-${Date.now()}-1`,
            title: diagnosis.treatmentPlan[0]?.title || 'Follow-up foliar inspection',
            dueDate: 'In 2 days',
            type: 'Treat',
            completed: false,
          },
          {
            id: `rem-${Date.now()}-2`,
            title: 'Hydration check (soil moisture baseline)',
            dueDate: 'Tomorrow',
            type: 'Water',
            completed: false,
          },
        ],
      };

      setMonitoredPlants([newPlant, ...monitoredPlants]);
      showToast(`Added "${newPlant.nickname}" to My Garden!`);
    }
  };

  const handleScanPlantFromGarden = (plantName: string) => {
    setPresetPlantName(plantName);
    setActiveTab('scan');
  };

  const handleUpdatePlant = (updatedPlant: MonitoredPlant) => {
    setMonitoredPlants((prev) =>
      prev.map((p) => (p.id === updatedPlant.id ? updatedPlant : p))
    );
  };

  const handleDeletePlant = (plantId: string) => {
    setMonitoredPlants((prev) => prev.filter((p) => p.id !== plantId));
    showToast('Plant removed from garden registry.');
  };

  const handleAddPlant = (newPlant: MonitoredPlant) => {
    setMonitoredPlants([newPlant, ...monitoredPlants]);
    showToast(`Registered "${newPlant.nickname}" to your garden.`);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col text-stone-900">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasActiveDiagnosis={!!activeDiagnosis}
        onQuickScan={() => {
          setPresetPlantName('');
          setActiveTab('scan');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'scan' && (
          <Scanner
            onDiagnosisComplete={handleDiagnosisComplete}
            presetPlantName={presetPlantName}
            onClearPreset={() => setPresetPlantName('')}
          />
        )}

        {activeTab === 'diagnosis' && activeDiagnosis && (
          <DiagnosticReport
            diagnosis={activeDiagnosis}
            onScanAnother={() => {
              setPresetPlantName('');
              setActiveTab('scan');
            }}
            onSaveToGarden={handleSaveToGarden}
            isSaved={monitoredPlants.some(
              (p) =>
                p.scanHistory.some((s) => s.imageUrl === activeDiagnosis.imageUrl) ||
                p.coverImage === activeDiagnosis.imageUrl
            )}
          />
        )}

        {activeTab === 'garden' && (
          <MyGarden
            plants={monitoredPlants}
            onScanPlant={handleScanPlantFromGarden}
            onUpdatePlant={handleUpdatePlant}
            onDeletePlant={handleDeletePlant}
            onAddNewPlant={() => setIsAddPlantOpen(true)}
          />
        )}

        {activeTab === 'guide' && (
          <FieldGuide
            onScanSpecimen={(diseaseName) => {
              setPresetPlantName(diseaseName);
              setActiveTab('scan');
            }}
          />
        )}
      </main>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-50 px-4 py-3 rounded-xl border border-stone-800 shadow-xl flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Add Plant Modal */}
      <AddPlantModal
        isOpen={isAddPlantOpen}
        onClose={() => setIsAddPlantOpen(false)}
        onAdd={handleAddPlant}
      />

      {/* Clean Footer */}
      <footer className="border-t border-stone-200/80 bg-stone-100/60 py-6 text-stone-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-800" />
            <span className="font-semibold text-stone-700">PhytoScan Botanical Diagnostics</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>Multimodal Leaf Pathology & Cultural Care</span>
          </div>
          <div className="flex items-center gap-4 text-stone-500">
            <span>Integrated with Gemini 3.8 Flash Vision</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
