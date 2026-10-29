import { DiseaseInfo, MonitoredPlant, PlantDiagnosis } from '../types/plant';

// Real generated local asset paths
export const SAMPLE_IMAGES = {
  healthy: '/src/assets/images/plant_leaf_healthy_1793100016938.jpg',
  blight: '/src/assets/images/plant_leaf_blight_1793100017512.jpg',
  powdery: '/src/assets/images/plant_leaf_powdery_1793100018308.jpg',
  rust: '/src/assets/images/plant_leaf_rust_1793100019066.jpg',
};

export const SAMPLE_CASES: {
  id: string;
  label: string;
  plantName: string;
  condition: string;
  image: string;
  diagnosis: PlantDiagnosis;
}[] = [
  {
    id: 'sample-healthy',
    label: 'Healthy Monstera',
    plantName: 'Monstera Deliciosa',
    condition: 'Optimal / Pristine',
    image: SAMPLE_IMAGES.healthy,
    diagnosis: {
      id: 'diag-monstera-healthy',
      timestamp: '2026-10-27T10:15:00Z',
      imageUrl: SAMPLE_IMAGES.healthy,
      plantIdentification: {
        commonName: 'Swiss Cheese Plant (Monstera Deliciosa)',
        scientificName: 'Monstera deliciosa Liebm.',
        plantFamily: 'Araceae',
        confidenceScore: 98,
        isPlantLeaf: true,
      },
      healthStatus: 'Healthy',
      healthScore: 97,
      diseaseDiagnosis: {
        diseaseName: 'None Detected - Healthy Foliage',
        pathogenType: 'None - Healthy',
        severityLevel: 'None',
        summary: 'Excellent leaf turgor, robust cuticle formation, and vibrant chlorophyll pigmentation. No signs of fungal pathogens, pests, or nutrient deficiencies.',
        contagious: false,
      },
      symptoms: [
        {
          symptom: 'Glossy deep-green cuticle',
          location: 'Entire leaf surface',
          appearance: 'Uniform healthy coloration with natural fenestrations intact',
        },
        {
          symptom: 'Clean leaf margin',
          location: 'Outer edge and lobes',
          appearance: 'No brown necrosis, tip scorch, or curled borders',
        },
      ],
      rootCauses: [
        'Optimal balance of diffused ambient illumination and soil porosity',
        'Consistent humidity allowing healthy gas exchange without moisture stagnation',
      ],
      immediateActions: [
        'Maintain current routine; dust leaf surface gently with a damp microfiber cloth monthly',
        'Rotate pot 45 degrees bi-weekly to ensure even phototropism',
      ],
      treatmentPlan: [
        {
          day: 'Day 1-7',
          title: 'Routine Foliar Hygiene',
          instructions: 'Wipe dust off leaves to ensure unobstructed stomata function for photosynthesis.',
          type: 'Monitoring',
        },
        {
          day: 'Day 14',
          title: 'Substrate Inspection',
          instructions: 'Check moisture 2 inches below topsoil before next deep watering cycle.',
          type: 'Monitoring',
        },
      ],
      careGuide: {
        watering: {
          frequency: 'Every 7-10 days',
          technique: 'Drench thoroughly until water flows from drainage holes, then discard excess tray water.',
          moistureLevel: 'Allow top 2 inches (5 cm) to dry out between waterings.',
        },
        light: {
          ideal: 'Bright, indirect sunlight',
          luxLevel: '1,500 - 3,500 lux (East or sheltered South/West exposure)',
          warning: 'Avoid harsh direct midday sun which causes bleached sunburn scorch.',
        },
        soilAndNutrients: {
          soilType: 'Chunky aroid mix (orchid bark, perlite, coco coir, pumice)',
          fertilizer: 'Balanced liquid N-P-K 20-20-20 diluted to half strength monthly during growing season',
          pHRange: '5.5 - 6.5 (Slightly acidic)',
        },
        humidityAndAirflow: {
          targetHumidity: '55% - 70% RH',
          ventilationTip: 'Gentle room air circulation prevents fungal spores from settling on large leaves.',
        },
      },
      remedies: [
        {
          name: 'Preventative Organic Neem Wipe',
          recipeOrDosage: '1 tsp cold-pressed organic neem oil + 3 drops mild Castile soap per 1 quart lukewarm water',
          organic: true,
          frequency: 'Once every 4-6 weeks for foliage shine and prophylactic pest deterrent',
        },
      ],
      preventionTips: [
        'Avoid letting roots sit in pooled saucer water to eliminate root rot risk',
        'Provide a sturdy coco coir or moss pole as the plant matures for climbing support',
        'Group with other tropical plants to create a natural humid microclimate',
      ],
    },
  },
  {
    id: 'sample-blight',
    label: 'Early Blight Tomato',
    plantName: 'Solanum lycopersicum',
    condition: 'Target Spot Infection',
    image: SAMPLE_IMAGES.blight,
    diagnosis: {
      id: 'diag-tomato-blight',
      timestamp: '2026-10-27T10:18:00Z',
      imageUrl: SAMPLE_IMAGES.blight,
      plantIdentification: {
        commonName: 'Garden Tomato',
        scientificName: 'Solanum lycopersicum L.',
        plantFamily: 'Solanaceae',
        confidenceScore: 97,
        isPlantLeaf: true,
      },
      healthStatus: 'Early Symptoms',
      healthScore: 54,
      diseaseDiagnosis: {
        diseaseName: 'Early Blight (Alternaria solani)',
        pathogenType: 'Fungal',
        severityLevel: 'Medium',
        summary: 'Prominent circular necrotic lesion with concentric target-board rings surrounded by a vibrant yellow chlorotic halo. Caused by Alternaria solani fungal pathogen.',
        contagious: true,
      },
      symptoms: [
        {
          symptom: 'Concentric target-board spot',
          location: 'Mid-blade of lower leaflet',
          appearance: 'Dark brown sunken bullseye rings 8-15mm across',
        },
        {
          symptom: 'Chlorotic halo',
          location: 'Circumference surrounding necrotic core',
          appearance: 'Bright lemon-yellow breakdown of cellular chlorophyll',
        },
        {
          symptom: 'Tissue embrittlement',
          location: 'Center of spot',
          appearance: 'Desiccated dry dead tissue prone to tearing',
        },
      ],
      rootCauses: [
        'Rain or overhead irrigation splashing fungal spores from topsoil onto lower foliage',
        'Prolonged leaf wetness exceeding 6-8 continuous hours in warm temperatures (24-29°C)',
        'Dense canopy foliage restricting horizontal cross-ventilation',
      ],
      immediateActions: [
        'Sterilize pruning shears with 70% isopropyl alcohol and cleanly snip off this infected leaflet immediately',
        'Bag and dispose of pruned foliage in regular garbage—never add blighted leaves to compost',
        'Cease any overhead sprinkler watering immediately; switch strictly to ground-level drip or soaker hose',
      ],
      treatmentPlan: [
        {
          day: 'Day 1',
          title: 'Mechanical Pruning & Tool Sterilization',
          instructions: 'Remove all foliage within 12 inches of the soil bed. Clean snips between every cut with alcohol wipe.',
          type: 'Pruning',
        },
        {
          day: 'Day 2',
          title: 'Copper Fungicide or Bio-Fungicide Application',
          instructions: 'Spray remaining healthy foliage tops and undersides with liquid copper octanoate or Bacillus subtilis.',
          type: 'Organic Remedy',
        },
        {
          day: 'Day 5',
          title: 'Substrate Mulching',
          instructions: 'Apply a 2-inch layer of clean straw or wood mulch over bare soil to prevent rain splashback.',
          type: 'Environment',
        },
        {
          day: 'Day 7-10',
          title: 'Follow-up Foliar Assessment & Re-spray',
          instructions: 'Inspect upper stems for new dark spots. Re-apply organic bio-fungicide if wet humid weather persists.',
          type: 'Monitoring',
        },
      ],
      careGuide: {
        watering: {
          frequency: 'Every 2-3 days at soil base',
          technique: 'Water early morning directly at soil level. Keep foliage completely dry.',
          moistureLevel: 'Maintain evenly moist but well-drained root bed.',
        },
        light: {
          ideal: 'Full direct sunlight',
          luxLevel: '6,000+ lux (minimum 6-8 hours direct sun daily)',
          warning: 'Shady, damp locations exponentially accelerate Alternaria fungal sporulation.',
        },
        soilAndNutrients: {
          soilType: 'Rich loam amended with organic compost',
          fertilizer: 'Avoid excess nitrogen which causes succulent dense leaf growth; use calcium-rich tomato food with potassium',
          pHRange: '6.2 - 6.8',
        },
        humidityAndAirflow: {
          targetHumidity: 'Under 60% relative humidity preferred',
          ventilationTip: 'Prune non-fruiting suckers to open internal air channels and speed dew evaporation.',
        },
      },
      remedies: [
        {
          name: 'Copper Octanoate (Soap) Spray',
          recipeOrDosage: '2 fl oz per gallon of water in clean pressure sprayer',
          organic: true,
          frequency: 'Every 7 to 10 days until dry warm conditions stabilize',
        },
        {
          name: 'Bacillus subtilis Bio-fungicide (Serenade)',
          recipeOrDosage: 'Beneficial bacterial spray according to label (approx 1-2 tbsp/gal)',
          organic: true,
          frequency: 'Weekly preventive coat during humid periods',
        },
      ],
      preventionTips: [
        'Practice 3-year crop rotation: do not plant tomatoes, potatoes, or peppers in the exact same spot consecutively',
        'Stake and trellis tomato vines vertically to lift vegetative foliage away from damp soil',
        'Mulch heavily around base with pine straw or cedar shavings to create a physical spore barrier',
      ],
    },
  },
  {
    id: 'sample-powdery',
    label: 'Powdery Mildew',
    plantName: 'Hosta / Garden Squash',
    condition: 'Superficial White Spores',
    image: SAMPLE_IMAGES.powdery,
    diagnosis: {
      id: 'diag-hosta-powdery',
      timestamp: '2026-10-27T10:20:00Z',
      imageUrl: SAMPLE_IMAGES.powdery,
      plantIdentification: {
        commonName: 'Plantain Lily / Hosta',
        scientificName: 'Hosta sieboldiana',
        plantFamily: 'Asparagaceae',
        confidenceScore: 95,
        isPlantLeaf: true,
      },
      healthStatus: 'Moderate Infection',
      healthScore: 42,
      diseaseDiagnosis: {
        diseaseName: 'Powdery Mildew (Erysiphales spp.)',
        pathogenType: 'Fungal',
        severityLevel: 'High',
        summary: 'Extensive talcum-powder like white fungal mycelium colonies blanketing the adaxial leaf blade. Reduces photosynthetic yield and causes leaf chlorosis.',
        contagious: true,
      },
      symptoms: [
        {
          symptom: 'White powdery efflorescence',
          location: 'Upper adaxial leaf surface',
          appearance: 'Velvety talcum-like white dust patches coalescing across leaf ridges',
        },
        {
          symptom: 'Chlorotic mottling beneath mycelium',
          location: 'Interveinal tissue',
          appearance: 'Pale yellowing where fungal haustoria penetrate host epidermis',
        },
        {
          symptom: 'Premature senescence',
          location: 'Outer leaf perimeter',
          appearance: 'Curling margins and crisping edges',
        },
      ],
      rootCauses: [
        'High ambient relative humidity (70%+) paired with dry soil moisture stress',
        'Stagnant, shaded air pockets with zero breeze or horizontal ventilation',
        'Overcrowded planting beds preventing sunlight penetration',
      ],
      immediateActions: [
        'Move container to an open location with active airflow and morning sunlight',
        'Snip heavily coated leaves (>75% coverage) to reduce fungal inoculum spore load',
        'Apply an organic potassium bicarbonate or diluted horticultural oil spray during dusk',
      ],
      treatmentPlan: [
        {
          day: 'Day 1',
          title: 'Canopy Thinning & Sanitation',
          instructions: 'Prune the most severely colonized leaves at the petiole base and discard off-site.',
          type: 'Pruning',
        },
        {
          day: 'Day 2',
          title: 'Potassium Bicarbonate / Milk Solution Spray',
          instructions: 'Coat both surfaces of leaves thoroughly with potassium bicarbonate or a 40/60 milk-water foliar wash under sunlight.',
          type: 'Organic Remedy',
        },
        {
          day: 'Day 5',
          title: 'Airflow Optimization',
          instructions: 'Space adjacent pots at least 18 inches apart to allow cross-breeze.',
          type: 'Environment',
        },
        {
          day: 'Day 7 & 14',
          title: 'Foliar Health Recheck',
          instructions: 'Confirm if white powder has turned grey/brown and ceased spreading to new shoots.',
          type: 'Monitoring',
        },
      ],
      careGuide: {
        watering: {
          frequency: 'Deeply once or twice weekly',
          technique: 'Hydrate soil thoroughly; never let root ball desiccate as water stress predisposes leaves to powdery mildew.',
          moistureLevel: 'Consistently cool, moist subsoil.',
        },
        light: {
          ideal: 'Dappled morning sunlight, filtered afternoon shade',
          luxLevel: '2,500 - 4,500 lux',
          warning: 'Dense shade combined with still air creates the prime nursery for Erysiphales spores.',
        },
        soilAndNutrients: {
          soilType: 'Humus-rich, moisture-retentive woodland soil with leaf mold',
          fertilizer: 'Avoid late-season high nitrogen fertilizers which trigger soft mildew-susceptible flushes',
          pHRange: '6.5 - 7.0',
        },
        humidityAndAirflow: {
          targetHumidity: 'Under 65% RH in the immediate canopy zone',
          ventilationTip: 'Oscillating fans or outdoor breezes drastically impede spore germination.',
        },
      },
      remedies: [
        {
          name: 'Potassium Bicarbonate Foliar Wash',
          recipeOrDosage: '1 tablespoon potassium bicarbonate + 1/2 tsp vegetable oil + 1/2 tsp dish soap in 1 gallon water',
          organic: true,
          frequency: 'Every 5 to 7 days until clear',
        },
        {
          name: 'Sunlight Activated Milk Spray',
          recipeOrDosage: '40% whole milk to 60% water (lactoferrin and whey protein generate free radicals when exposed to sun)',
          organic: true,
          frequency: 'Spray every 5 days on sunny mornings',
        },
      ],
      preventionTips: [
        'Select mildew-resistant cultivars when adding new varieties to shade beds',
        'Never mist foliage indoors late in the afternoon',
        'Clean fallen autumn leaf litter where fungal cleistothecia overwinter',
      ],
    },
  },
  {
    id: 'sample-rust',
    label: 'Leaf Rust Fungus',
    plantName: 'Rosa spp. / Mint',
    condition: 'Orange Pustule Spores',
    image: SAMPLE_IMAGES.rust,
    diagnosis: {
      id: 'diag-rose-rust',
      timestamp: '2026-10-27T10:22:00Z',
      imageUrl: SAMPLE_IMAGES.rust,
      plantIdentification: {
        commonName: 'Garden Rose / Shrub Rose',
        scientificName: 'Rosa canina / Rosa hybrida',
        plantFamily: 'Rosaceae',
        confidenceScore: 96,
        isPlantLeaf: true,
      },
      healthStatus: 'Severe Infection',
      healthScore: 36,
      diseaseDiagnosis: {
        diseaseName: 'Rose Rust (Phragmidium mucronatum)',
        pathogenType: 'Fungal',
        severityLevel: 'High',
        summary: 'Dense clustering of raised powdery orange-yellow urediniospores erupting through leaf stomata. Without intervention, causes defoliation and branch dieback.',
        contagious: true,
      },
      symptoms: [
        {
          symptom: 'Raised orange pustules (uredinia)',
          location: 'Abaxial and adaxial blade',
          appearance: 'Vivid rust-orange powdery blisters erupting through the epidermis',
        },
        {
          symptom: 'Necrotic chlorosis',
          location: 'Adjacent leaf tissues',
          appearance: 'Yellow speckled spots corresponding to fungal root invasion',
        },
        {
          symptom: 'Early leaf drop',
          location: 'Lower cane branches',
          appearance: 'Premature shedding of heavily colonized leaves',
        },
      ],
      rootCauses: [
        'Cool, moist spring or autumn weather (15-21°C) with persistent night dew',
        'Overhead sprinkler systems wetting leaves during evening hours',
        'Infected canes or fallen leaves harboring overwintering teliospores',
      ],
      immediateActions: [
        'Carefully prune out infected stems with disinfected hand pruners, placing directly into a sealable plastic bag',
        'Rake and completely remove all fallen leaves from beneath the plant canopy',
        'Apply sulfur-based or bio-fungicide protective barrier to prevent spore germination on new leaves',
      ],
      treatmentPlan: [
        {
          day: 'Day 1',
          title: 'Intensive Pruning & Quarantine',
          instructions: 'Prune away every leaflet showing pustules. Never shake leaves during removal to avoid dispersing airborne spores.',
          type: 'Pruning',
        },
        {
          day: 'Day 2',
          title: 'Wettable Sulfur or Neem Oil Application',
          instructions: 'Spray foliage thoroughly during cool morning hours. Ensure lower leaf surfaces are fully coated.',
          type: 'Organic Remedy',
        },
        {
          day: 'Day 7',
          title: 'Canopy Thinning for Sunshine',
          instructions: 'Prune inward-facing branches to allow sunshine into the interior rose bush center.',
          type: 'Pruning',
        },
        {
          day: 'Day 14',
          title: 'Re-treatment & Stem Inspection',
          instructions: 'Inspect green stems for dark winter teliospores. Re-apply protective organic spray.',
          type: 'Monitoring',
        },
      ],
      careGuide: {
        watering: {
          frequency: 'Once weekly deeply',
          technique: 'Use drip tubing or water the ground directly at the drip line. Avoid spraying canes or leaves.',
          moistureLevel: 'Top 3 inches should be dry before next deep soak.',
        },
        light: {
          ideal: 'Full direct sunshine (minimum 6 hours daily)',
          luxLevel: '5,000 - 8,000 lux',
          warning: 'Morning sun is critical to evaporate morning dew rapidly before fungal spores can germinate.',
        },
        soilAndNutrients: {
          soilType: 'Well-draining, rich loamy soil amended with organic matter',
          fertilizer: 'High potassium (potash) organic feed strengthens cell walls against fungal penetration',
          pHRange: '6.0 - 6.5',
        },
        humidityAndAirflow: {
          targetHumidity: 'Dry canopy zone',
          ventilationTip: 'Plant at least 3 feet away from walls and dense shrubs to facilitate unhindered wind passage.',
        },
      },
      remedies: [
        {
          name: 'Micronized Wettable Sulfur Spray',
          recipeOrDosage: '2-3 tablespoons per gallon of water (do not apply if temperatures exceed 30°C / 85°F)',
          organic: true,
          frequency: 'Every 10-14 days during cool damp seasons',
        },
        {
          name: 'Pure Cold-Pressed Neem Oil with Emulsifier',
          recipeOrDosage: '1.5 tbsp pure neem + 1 tsp baby shampoo/castile soap per gallon water',
          organic: true,
          frequency: 'Every 7 days in late afternoon',
        },
      ],
      preventionTips: [
        'Always clean pruners with rubbing alcohol before moving between different rose shrubs',
        'Clear all debris and mulch beds in winter to break the fungal life cycle',
        'Choose rust-resistant modern hybrid roses or native varieties for humid regions',
      ],
    },
  },
];

export const INITIAL_MONITORED_PLANTS: MonitoredPlant[] = [
  {
    id: 'plant-1',
    nickname: 'Living Room Deliciosa',
    species: 'Monstera Deliciosa',
    scientificName: 'Monstera deliciosa',
    location: 'Living Room East Window',
    addedDate: '2026-09-12',
    lastScannedDate: '2026-10-25',
    currentHealthScore: 97,
    currentStatus: 'Healthy',
    primaryIssue: 'None detected',
    coverImage: SAMPLE_IMAGES.healthy,
    scanHistory: [
      {
        date: '2026-09-12',
        healthScore: 89,
        healthStatus: 'Early Symptoms',
        diagnosisName: 'Minor Dust & Light Deficit',
        imageUrl: SAMPLE_IMAGES.healthy,
        notes: 'Moved closer to window, cleaned leaves.',
      },
      {
        date: '2026-10-25',
        healthScore: 97,
        healthStatus: 'Healthy',
        diagnosisName: 'Optimal Leaf Health',
        imageUrl: SAMPLE_IMAGES.healthy,
        notes: 'New fenestrated leaf unfurled cleanly.',
      },
    ],
    reminders: [
      {
        id: 'rem-1',
        title: 'Deep soak watering (check top 2" dryness)',
        dueDate: 'Tomorrow',
        type: 'Water',
        completed: false,
      },
      {
        id: 'rem-2',
        title: 'Foliar dust wipe with damp cloth',
        dueDate: 'In 4 days',
        type: 'Inspect',
        completed: false,
      },
    ],
  },
  {
    id: 'plant-2',
    nickname: 'Patio Heritage Tomato',
    species: 'Brandywine Tomato',
    scientificName: 'Solanum lycopersicum',
    location: 'South Patio Container',
    addedDate: '2026-10-18',
    lastScannedDate: '2026-10-26',
    currentHealthScore: 54,
    currentStatus: 'Early Symptoms',
    primaryIssue: 'Early Blight (Alternaria solani)',
    coverImage: SAMPLE_IMAGES.blight,
    scanHistory: [
      {
        date: '2026-10-18',
        healthScore: 68,
        healthStatus: 'Early Symptoms',
        diagnosisName: 'Suspected fungal spot on lower leaves',
        imageUrl: SAMPLE_IMAGES.blight,
        notes: 'Pruned lowest branch touching the potting soil.',
      },
      {
        date: '2026-10-26',
        healthScore: 54,
        healthStatus: 'Early Symptoms',
        diagnosisName: 'Early Blight Confirmed',
        imageUrl: SAMPLE_IMAGES.blight,
        notes: 'Applied copper spray, added straw mulch layer.',
      },
    ],
    reminders: [
      {
        id: 'rem-3',
        title: 'Apply follow-up copper fungicide spray',
        dueDate: 'In 2 days',
        type: 'Treat',
        completed: false,
      },
      {
        id: 'rem-4',
        title: 'Snip lower suckers for increased airflow',
        dueDate: 'In 3 days',
        type: 'Prune',
        completed: false,
      },
    ],
  },
  {
    id: 'plant-3',
    nickname: 'English Shrub Rose',
    species: 'David Austin Rose',
    scientificName: 'Rosa hybrida',
    location: 'Garden Bed Border',
    addedDate: '2026-10-20',
    lastScannedDate: '2026-10-27',
    currentHealthScore: 36,
    currentStatus: 'Severe Infection',
    primaryIssue: 'Rose Rust (Phragmidium)',
    coverImage: SAMPLE_IMAGES.rust,
    scanHistory: [
      {
        date: '2026-10-27',
        healthScore: 36,
        healthStatus: 'Severe Infection',
        diagnosisName: 'Rose Rust Outbreak',
        imageUrl: SAMPLE_IMAGES.rust,
        notes: 'Orange pustules visible across mid-tier foliage. Quarantined infected shoots.',
      },
    ],
    reminders: [
      {
        id: 'rem-5',
        title: 'Rake and bag fallen leaves under rose cane',
        dueDate: 'Today',
        type: 'Prune',
        completed: false,
      },
      {
        id: 'rem-6',
        title: 'Spray micronized sulfur emulsion',
        dueDate: 'Tomorrow morning',
        type: 'Treat',
        completed: false,
      },
    ],
  },
];

export const COMMON_DISEASES_ENCYCLOPEDIA: DiseaseInfo[] = [
  {
    id: 'dis-1',
    name: 'Early Blight',
    scientificAgent: 'Alternaria solani',
    category: 'Fungal',
    commonHosts: ['Tomatoes', 'Potatoes', 'Eggplants', 'Peppers'],
    description: 'A destructive fungal pathogen that initiates on the oldest lower foliage, spreading upward. Characterized by dark brown concentric bullseye rings surrounded by bright yellow halos.',
    keyVisualSigns: [
      'Concentric dark rings like a target board',
      'Yellow chlorotic boundary encircling lesions',
      'Lower leaves turn yellow and drop prematurely',
    ],
    typicalCauses: [
      'Soil splash from raindrops or overhead watering',
      'Warm humid weather (24-29°C) with dense plant spacing',
      'Lack of soil mulch layer',
    ],
    organicTreatment: 'Prune affected leaves immediately. Apply organic copper octanoate or Bacillus subtilis spray every 7-10 days.',
    preventativeCare: 'Mulch soil surface with straw or wood shavings; water strictly at ground level; stake plants upright.',
    severity: 'Medium',
    sampleImage: SAMPLE_IMAGES.blight,
  },
  {
    id: 'dis-2',
    name: 'Powdery Mildew',
    scientificAgent: 'Podosphaera, Erysiphe & Oidium spp.',
    category: 'Fungal',
    commonHosts: ['Hostas', 'Roses', 'Zucchini & Squash', 'Begonias', 'Cannabis', 'Cucumbers'],
    description: 'One of the most widespread fungal infections. Manifests as a white, flour-like dusting on leaf blades, stems, and buds, weakening the plant by leeching nutrients and impeding light absorption.',
    keyVisualSigns: [
      'White to pale grey talcum-like powder patches',
      'Leaf distortion, curling, and crinkling',
      'Yellowing tissue under fungal colonies',
    ],
    typicalCauses: [
      'High relative humidity paired with dry root zone',
      'Shady stagnant air microclimates',
      'Over-fertilizing with quick-release nitrogen',
    ],
    organicTreatment: 'Potassium bicarbonate foliar spray (1 tbsp/gal with soap surfactant) or 40% milk-to-water solution under sunlight.',
    preventativeCare: 'Ensure generous plant spacing; place in areas with breeze and morning sun; keep soil evenly hydrated.',
    severity: 'Medium',
    sampleImage: SAMPLE_IMAGES.powdery,
  },
  {
    id: 'dis-3',
    name: 'Plant Rust',
    scientificAgent: 'Pucciniales / Phragmidium spp.',
    category: 'Fungal',
    commonHosts: ['Roses', 'Mint', 'Beans', 'Snapdragons', 'Carnations', 'Fruit Trees'],
    description: 'Obligate fungal parasite that produces thousands of powdery orange, red, or rusty-brown spore pustules that burst through the leaf underside and upper surface.',
    keyVisualSigns: [
      'Raised rusty orange or bright gold blisters (pustules)',
      'Yellow speckles on upper leaf directly above pustules',
      'Premature defoliation leaving bare lower stems',
    ],
    typicalCauses: [
      'Prolonged leaf wetness during cool nights (15-20°C)',
      'Infected overwintering debris left on ground',
      'High-density plantings restricting sun reach',
    ],
    organicTreatment: 'Carefully prune and bag infected foliage. Treat with wettable micronized sulfur or cold-pressed neem oil.',
    preventativeCare: 'Never water overhead in the late afternoon; disinfect shears between plants; maintain open vase prune architecture.',
    severity: 'High',
    sampleImage: SAMPLE_IMAGES.rust,
  },
  {
    id: 'dis-4',
    name: 'Bacterial Leaf Spot',
    scientificAgent: 'Xanthomonas campestris / Pseudomonas spp.',
    category: 'Bacterial',
    commonHosts: ['Peppers', 'Philodendrons', 'Hydrangeas', 'English Ivy', 'Lettuce'],
    description: 'Bacterial lesions that start as small water-soaked translucent dots, expanding into angular brown or black spots often bounded by leaf veins.',
    keyVisualSigns: [
      'Water-soaked dark angular spots bounded by leaf veins',
      'Spots may ooze bacterial exudate during high humidity',
      'Leaves develop ragged holes as centers drop out (shot-hole effect)',
    ],
    typicalCauses: [
      'High heat and high humidity',
      'Handling wet plants or splashing water',
      'Infected seeds or contaminated tools',
    ],
    organicTreatment: 'Remove infected leaves promptly. Apply fixed copper fungicide or hydrogen peroxide solution (1:10 dilution).',
    preventativeCare: 'Ensure strict sanitation; avoid working among damp plants; ensure rapid leaf drying.',
    severity: 'High',
    sampleImage: SAMPLE_IMAGES.blight,
  },
  {
    id: 'dis-5',
    name: 'Iron & Magnesium Chlorosis',
    scientificAgent: 'Abiotic Nutrient Deficiency',
    category: 'Nutritional/Abiotic',
    commonHosts: ['Citrus', 'Gardenias', 'Azaleas', 'Blueberries', 'Ficus'],
    description: 'A non-pathogenic physiological disorder where the plant cannot synthesize chlorophyll due to high soil pH locking out iron, or deficient magnesium.',
    keyVisualSigns: [
      'Interveinal chlorosis: leaf blade turns pale yellow while veins remain dark green',
      'Starts on newest growth (Iron) or oldest lower growth (Magnesium)',
      'No necrotic rings or powdery spores',
    ],
    typicalCauses: [
      'Soil or water pH exceeding 7.0 (alkaline lockout)',
      'Waterlogged or compacted root bed restricting uptake',
      'Exhausted potting media lacking chelated micro-nutrients',
    ],
    organicTreatment: 'Apply chelated iron (EDDHA or EDTA) foliar spray or Epsom salt (magnesium sulfate 1 tbsp/gal) soil drench.',
    preventativeCare: 'Test soil pH; acidify irrigation water if using hard alkaline tap water; repot root-bound specimens in fresh acidic mix.',
    severity: 'Low',
    sampleImage: SAMPLE_IMAGES.healthy,
  },
  {
    id: 'dis-6',
    name: 'Two-Spotted Spider Mite Damage',
    scientificAgent: 'Tetranychus urticae',
    category: 'Pest/Insect',
    commonHosts: ['Monstera', 'Calathea', 'Alocasia', 'Roses', 'Tomatoes'],
    description: 'Microscopic sap-sucking arachnids that puncture plant cells, producing fine yellow stippling and delicate silky webbing beneath leaves.',
    keyVisualSigns: [
      'Fine silvery or yellow speckling (stippling) on upper leaf surface',
      'Delicate gossamer webbing between leaf nodes and petiole forks',
      'Dull, bronzed, or dirty-looking leaf luster',
    ],
    typicalCauses: [
      'Dry, arid indoor air with relative humidity under 40%',
      'Dusty leaf surfaces providing shelter for mites',
      'Lack of natural predatory mites',
    ],
    organicTreatment: 'Wash plant under vigorous lukewarm shower to dislodge mites; coat foliage with insecticidal soap or neem oil every 4 days.',
    preventativeCare: 'Maintain humidity above 55%; wipe leaves weekly; introduce beneficial predatory mites (Phytoseiulus persimilis).',
    severity: 'Medium',
    sampleImage: SAMPLE_IMAGES.powdery,
  },
];
