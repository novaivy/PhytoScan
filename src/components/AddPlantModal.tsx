import React, { useState } from 'react';
import { SAMPLE_IMAGES } from '../data/samplePlants';
import { HealthStatus, MonitoredPlant } from '../types/plant';
import { X, Sprout, Plus } from 'lucide-react';

interface AddPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newPlant: MonitoredPlant) => void;
}

export const AddPlantModal: React.FC<AddPlantModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [nickname, setNickname] = useState('');
  const [species, setSpecies] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [location, setLocation] = useState('Living Room');
  const [status, setStatus] = useState<HealthStatus>('Healthy');
  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_IMAGES.healthy);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    const healthScore = status === 'Healthy' ? 95 : status === 'Early Symptoms' ? 65 : 40;

    const plant: MonitoredPlant = {
      id: `plant-${Date.now()}`,
      nickname: nickname.trim(),
      species: species.trim() || nickname.trim(),
      scientificName: scientificName.trim() || species.trim(),
      location: location.trim(),
      addedDate: new Date().toISOString().split('T')[0],
      lastScannedDate: new Date().toISOString().split('T')[0],
      currentHealthScore: healthScore,
      currentStatus: status,
      primaryIssue: status === 'Healthy' ? 'None detected' : 'Under Observation',
      coverImage: selectedImage,
      scanHistory: [
        {
          date: new Date().toISOString().split('T')[0],
          healthScore,
          healthStatus: status,
          diagnosisName: 'Initial Baseline Registration',
          imageUrl: selectedImage,
          notes: 'Plant added to monitoring registry.',
        },
      ],
      reminders: [
        {
          id: `rem-${Date.now()}-1`,
          title: 'Initial hydration check',
          dueDate: 'Tomorrow',
          type: 'Water',
          completed: false,
        },
        {
          id: `rem-${Date.now()}-2`,
          title: 'Inspect foliage underside for early pests',
          dueDate: 'In 3 days',
          type: 'Inspect',
          completed: false,
        },
      ],
    };

    onAdd(plant);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Sprout className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-stone-900">
            Register Specimen in Garden
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Plant Nickname *
            </label>
            <input
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. Sunny Balcony Lemon, Desk Pothos"
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Common Species
              </label>
              <input
                type="text"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                placeholder="e.g. Meyer Lemon"
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. South Balcony"
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Initial Baseline Health
            </label>
            <select
              value={status}
              onChange={(e: any) => setStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-stone-50 text-stone-800"
            >
              <option value="Healthy">Healthy (Optimal foliage)</option>
              <option value="Early Symptoms">Early Symptoms (Mild spotting/dryness)</option>
              <option value="Moderate Infection">Moderate Infection (Noticeable leaf damage)</option>
              <option value="Severe Infection">Severe Infection (Extensive leaf decay)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Choose Specimen Avatar
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Monstera', img: SAMPLE_IMAGES.healthy },
                { label: 'Tomato', img: SAMPLE_IMAGES.blight },
                { label: 'Hosta', img: SAMPLE_IMAGES.powdery },
                { label: 'Rose', img: SAMPLE_IMAGES.rust },
              ].map((item, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedImage(item.img)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer relative ${
                    selectedImage === item.img
                      ? 'border-emerald-700 ring-2 ring-emerald-700/20'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={item.img}
                    alt={item.label}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!nickname.trim()}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Add Specimen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
