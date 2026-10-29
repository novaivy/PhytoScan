import React, { useState } from 'react';
import { MonitoredPlant, HealthStatus } from '../types/plant';
import {
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Camera,
  Trash2,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Droplets,
  Scissors,
  Pill,
  ArrowRight,
  X,
} from 'lucide-react';

interface MyGardenProps {
  plants: MonitoredPlant[];
  onScanPlant: (plantName: string) => void;
  onUpdatePlant: (updatedPlant: MonitoredPlant) => void;
  onDeletePlant: (plantId: string) => void;
  onAddNewPlant: () => void;
}

export const MyGarden: React.FC<MyGardenProps> = ({
  plants,
  onScanPlant,
  onUpdatePlant,
  onDeletePlant,
  onAddNewPlant,
}) => {
  const [selectedPlant, setSelectedPlant] = useState<MonitoredPlant | null>(plants[0] || null);
  const [newReminderTitle, setNewReminderTitle] = useState('');
  const [newReminderType, setNewReminderType] = useState<'Water' | 'Treat' | 'Prune' | 'Fertilize'>('Water');
  const [newReminderDate, setNewReminderDate] = useState('Tomorrow');

  // Calculate garden stats
  const averageHealth = plants.length > 0
    ? Math.round(plants.reduce((sum, p) => sum + p.currentHealthScore, 0) / plants.length)
    : 100;

  const totalRemindersPending = plants.reduce(
    (sum, p) => sum + p.reminders.filter((r) => !r.completed).length,
    0
  );

  const toggleReminder = (plant: MonitoredPlant, reminderId: string) => {
    const updatedReminders = plant.reminders.map((r) =>
      r.id === reminderId ? { ...r, completed: !r.completed } : r
    );
    const updatedPlant = { ...plant, reminders: updatedReminders };
    onUpdatePlant(updatedPlant);
    if (selectedPlant?.id === plant.id) {
      setSelectedPlant(updatedPlant);
    }
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlant || !newReminderTitle.trim()) return;

    const newRem = {
      id: `rem-${Date.now()}`,
      title: newReminderTitle.trim(),
      dueDate: newReminderDate,
      type: newReminderType,
      completed: false,
    };

    const updated = {
      ...selectedPlant,
      reminders: [...selectedPlant.reminders, newRem],
    };
    onUpdatePlant(updated);
    setSelectedPlant(updated);
    setNewReminderTitle('');
  };

  const getStatusBadge = (status: HealthStatus) => {
    switch (status) {
      case 'Healthy':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Early Symptoms':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Moderate Infection':
      case 'Severe Infection':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-stone-50 text-stone-800 border-stone-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Garden Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900" style={{ textWrap: 'balance' }}>
            My Monitored Garden
          </h1>
          <p className="mt-1 text-xs text-stone-600">
            Track recovery trajectories, log periodic scans, and schedule care regimens for your specimens.
          </p>
        </div>

        <button
          onClick={onAddNewPlant}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-stone-50 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Plant</span>
        </button>
      </div>

      {/* Garden Vitals Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-mono tracking-wider text-stone-500 block">
              Tracked Plants
            </span>
            <span className="text-2xl font-mono font-bold text-stone-900 tabular-nums">
              {plants.length}
            </span>
          </div>
          <span className="text-xs text-stone-500">Specimens registered</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-mono tracking-wider text-stone-500 block">
              Average Health Index
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-mono font-bold text-stone-900 tabular-nums">
                {averageHealth}
              </span>
              <span className="text-xs text-stone-400 font-mono">/ 100</span>
            </div>
          </div>
          <span className="text-xs text-emerald-700 font-medium">Collective Vitality</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-mono tracking-wider text-stone-500 block">
              Pending Care Reminders
            </span>
            <span className="text-2xl font-mono font-bold text-stone-900 tabular-nums">
              {totalRemindersPending}
            </span>
          </div>
          <span className="text-xs text-amber-700 font-medium">Tasks Scheduled</span>
        </div>
      </div>

      {/* Main Split Layout: Plants Grid & Plant Details Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left List of Plant Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {plants.map((plant) => {
            const isSelected = selectedPlant?.id === plant.id;
            return (
              <div
                key={plant.id}
                onClick={() => setSelectedPlant(plant)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white ${
                  isSelected
                    ? 'border-emerald-700 shadow-sm ring-1 ring-emerald-700/20'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Plant Avatar */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    <img
                      src={plant.coverImage}
                      alt={plant.nickname}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-sm font-bold text-stone-900 truncate">
                        {plant.nickname}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getStatusBadge(plant.currentStatus)}`}>
                        {plant.currentStatus}
                      </span>
                    </div>

                    <p className="text-xs text-stone-500 truncate mb-2">
                      {plant.species} <span className="text-stone-400">· {plant.location}</span>
                    </p>

                    <div className="flex items-center gap-4 text-xs text-stone-600">
                      <div className="flex items-center gap-1 font-mono">
                        <span className="text-stone-400">Score:</span>
                        <strong className="text-stone-900">{plant.currentHealthScore}</strong>
                      </div>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <div className="truncate">
                        <span className="text-stone-400">Issue:</span> {plant.primaryIssue || 'None'}
                      </div>
                    </div>
                  </div>

                  {/* Quick Scan Action */}
                  <div className="shrink-0 flex flex-col gap-1.5 items-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onScanPlant(plant.nickname);
                      }}
                      className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Scan new leaf for this plant"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Scan</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {plants.length === 0 && (
            <div className="p-8 rounded-2xl bg-white border border-dashed border-stone-300 text-center">
              <p className="text-xs text-stone-600">Your garden is empty. Add your first houseplant or garden crop!</p>
              <button
                onClick={onAddNewPlant}
                className="mt-3 px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-medium cursor-pointer"
              >
                Add Plant Now
              </button>
            </div>
          )}
        </div>

        {/* Right Detail Inspector (5 cols) */}
        <div className="lg:col-span-5">
          {selectedPlant ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sticky top-20 shadow-xs">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-stone-100">
                <div>
                  <span className="text-xs uppercase font-mono tracking-wider text-stone-400 block">
                    Specimen Profile
                  </span>
                  <h2 className="text-lg font-bold text-stone-900">
                    {selectedPlant.nickname}
                  </h2>
                  <span className="text-xs text-stone-500 italic block">
                    {selectedPlant.scientificName || selectedPlant.species}
                  </span>
                </div>

                <button
                  onClick={() => onDeletePlant(selectedPlant.id)}
                  className="p-2 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Remove plant from garden"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Trajectory / Timeline */}
              <div className="mb-6">
                <span className="text-xs font-bold text-stone-900 block mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                  <span>Diagnostic Scan History & Progress</span>
                </span>

                <div className="space-y-2.5">
                  {selectedPlant.scanHistory.map((scan, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-stone-200 shrink-0">
                          <img
                            src={scan.imageUrl}
                            alt="Scan leaf"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <span className="font-semibold text-stone-900 block">
                            {scan.diagnosisName}
                          </span>
                          <span className="text-stone-500 text-[11px]">
                            {scan.date} {scan.notes ? `· ${scan.notes}` : ''}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-bold text-stone-900 block tabular-nums">
                          {scan.healthScore}%
                        </span>
                        <span className="text-[10px] text-stone-500">
                          {scan.healthStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Care Reminders Checklist */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-stone-700" />
                    <span>Scheduled Care Reminders</span>
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {selectedPlant.reminders.map((rem) => (
                    <div
                      key={rem.id}
                      onClick={() => toggleReminder(selectedPlant, rem.id)}
                      className={`p-2.5 rounded-xl border text-xs flex items-center gap-3 transition-colors cursor-pointer ${
                        rem.completed
                          ? 'bg-emerald-50/50 border-emerald-200 text-stone-500'
                          : 'bg-white border-stone-200 hover:border-emerald-600'
                      }`}
                    >
                      <button
                        type="button"
                        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                          rem.completed
                            ? 'bg-emerald-700 text-white'
                            : 'border border-stone-300'
                        }`}
                      >
                        {rem.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <span className={`block truncate ${rem.completed ? 'line-through' : 'font-medium text-stone-900'}`}>
                          {rem.title}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          Due: {rem.dueDate} · {rem.type}
                        </span>
                      </div>
                    </div>
                  ))}

                  {selectedPlant.reminders.length === 0 && (
                    <p className="text-xs text-stone-400 italic">No pending reminders for this plant.</p>
                  )}
                </div>

                {/* Add Quick Reminder Form */}
                <form onSubmit={handleAddReminder} className="pt-3 border-t border-stone-100 flex flex-col gap-2">
                  <input
                    type="text"
                    value={newReminderTitle}
                    onChange={(e) => setNewReminderTitle(e.target.value)}
                    placeholder="New reminder (e.g. Neem oil spray, Water soil)..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-stone-50"
                  />
                  <div className="flex gap-2">
                    <select
                      value={newReminderType}
                      onChange={(e: any) => setNewReminderType(e.target.value)}
                      className="px-2 py-1 text-xs rounded-lg border border-stone-300 bg-stone-50 text-stone-700"
                    >
                      <option value="Water">Water</option>
                      <option value="Treat">Treat</option>
                      <option value="Prune">Prune</option>
                      <option value="Fertilize">Fertilize</option>
                    </select>
                    <input
                      type="text"
                      value={newReminderDate}
                      onChange={(e) => setNewReminderDate(e.target.value)}
                      placeholder="Due (e.g. In 2 days)"
                      className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-stone-300 bg-stone-50 text-stone-700"
                    />
                    <button
                      type="submit"
                      disabled={!newReminderTitle.trim()}
                      className="px-3 py-1 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-medium rounded-lg cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>

              {/* Scan Now Shortcut */}
              <div className="mt-6 pt-4 border-t border-stone-100">
                <button
                  onClick={() => onScanPlant(selectedPlant.nickname)}
                  className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-stone-50 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <Camera className="w-4 h-4" />
                  <span>Scan {selectedPlant.nickname} Now</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-xs text-stone-500">
              Select a plant on the left to inspect its trajectory and reminders.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
