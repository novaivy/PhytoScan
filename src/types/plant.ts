export type HealthStatus =
  | 'Healthy'
  | 'Early Symptoms'
  | 'Moderate Infection'
  | 'Severe Infection'
  | 'Nutrient Deficiency'
  | 'Abiotic Stress';

export type PathogenType =
  | 'Fungal'
  | 'Bacterial'
  | 'Viral'
  | 'Pest/Insect'
  | 'Nutritional/Abiotic'
  | 'None - Healthy';

export type SeverityLevel = 'None' | 'Low' | 'Medium' | 'High' | 'Critical';

export interface PlantIdentification {
  commonName: string;
  scientificName: string;
  plantFamily: string;
  confidenceScore: number;
  isPlantLeaf: boolean;
}

export interface SymptomDetail {
  symptom: string;
  location: string;
  appearance: string;
}

export interface TreatmentStep {
  day: string;
  title: string;
  instructions: string;
  type: 'Organic Remedy' | 'Pruning' | 'Environment' | 'Fungicide/Chemical' | 'Monitoring';
}

export interface CareRemedy {
  name: string;
  recipeOrDosage: string;
  organic: boolean;
  frequency: string;
}

export interface CareGuide {
  watering: {
    frequency: string;
    technique: string;
    moistureLevel: string;
  };
  light: {
    ideal: string;
    luxLevel: string;
    warning: string;
  };
  soilAndNutrients: {
    soilType: string;
    fertilizer: string;
    pHRange: string;
  };
  humidityAndAirflow: {
    targetHumidity: string;
    ventilationTip: string;
  };
}

export interface PlantDiagnosis {
  id: string;
  timestamp: string;
  imageUrl: string;
  plantIdentification: PlantIdentification;
  healthStatus: HealthStatus;
  healthScore: number; // 0-100
  diseaseDiagnosis: {
    diseaseName: string;
    pathogenType: PathogenType;
    severityLevel: SeverityLevel;
    summary: string;
    contagious: boolean;
  };
  symptoms: SymptomDetail[];
  rootCauses: string[];
  immediateActions: string[];
  treatmentPlan: TreatmentStep[];
  careGuide: CareGuide;
  remedies: CareRemedy[];
  preventionTips: string[];
}

export interface MonitoredPlant {
  id: string;
  nickname: string;
  species: string;
  scientificName: string;
  location: string; // e.g. "Living Room Window", "Balcony Garden"
  addedDate: string;
  lastScannedDate: string;
  currentHealthScore: number;
  currentStatus: HealthStatus;
  primaryIssue?: string;
  coverImage: string;
  scanHistory: {
    date: string;
    healthScore: number;
    healthStatus: HealthStatus;
    diagnosisName: string;
    imageUrl: string;
    notes?: string;
  }[];
  reminders: {
    id: string;
    title: string;
    dueDate: string;
    type: 'Water' | 'Treat' | 'Prune' | 'Fertilize' | 'Inspect';
    completed: boolean;
  }[];
}

export interface DiseaseInfo {
  id: string;
  name: string;
  scientificAgent: string;
  category: PathogenType;
  commonHosts: string[];
  description: string;
  keyVisualSigns: string[];
  typicalCauses: string[];
  organicTreatment: string;
  preventativeCare: string;
  severity: SeverityLevel;
  sampleImage: string;
}
