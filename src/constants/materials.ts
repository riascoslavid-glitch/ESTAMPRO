export interface TextileMaterial {
  id: string;
  name: string;
  category: 'algodon' | 'poliester' | 'mezclas' | 'lycra' | 'nylon' | 'denim' | 'franela' | 'otros';
  composition: string;
  typicalWeightGsm: string; // e.g. "180 - 240 GSM"
  recommendedIronTempC: number;
  pressTimeSeconds: number;
  stretchResistance: 'Baja' | 'Media' | 'Alta' | 'Muy Alta';
  dyeMigrationRisk: 'Nulo' | 'Bajo' | 'Medio' | 'Alto (Requiere Bloqueador/Sublistop)';
  compatibleTechniques: string[];
  technicalNotes: string;
}

export const TEXTILE_MATERIALS: TextileMaterial[] = [
  {
    id: 'mat_algodon_peinado',
    name: 'Algodón Peinado Ring-Spun',
    category: 'algodon',
    composition: '100% Algodón peinado de fibra larga',
    typicalWeightGsm: '180 - 240 GSM',
    recommendedIronTempC: 160,
    pressTimeSeconds: 15,
    stretchResistance: 'Media',
    dyeMigrationRisk: 'Nulo',
    compatibleTechniques: ['Serigrafía Plastisol', 'Serigrafía Base Agua / Discharge', 'DTF', 'DTG', 'Bordado'],
    technicalNotes: 'Fibra natural sin riesgo de sangrado de tinte. Acepta tintas al agua con tacto cero y base blanca directa sin sublistop.'
  },
  {
    id: 'mat_algodon_heavyweight',
    name: 'Algodón Pesado Rústico (Heavyweight)',
    category: 'algodon',
    composition: '100% Algodón ring-spun alta densidad',
    typicalWeightGsm: '240 - 280 GSM',
    recommendedIronTempC: 165,
    pressTimeSeconds: 15,
    stretchResistance: 'Baja',
    dyeMigrationRisk: 'Nulo',
    compatibleTechniques: ['Serigrafía Plastisol', 'DTF Textil', 'Bordado de Alta Densidad', 'Vinil Textil'],
    technicalNotes: 'Estructura rígida de moda streetwear (boxy fit). Soporta bordados densos sin arrugas ni fruncidos en el marco.'
  },
  {
    id: 'mat_poliester_dryfit',
    name: 'Poliéster Dry-Fit Deportivo Microperforado',
    category: 'poliester',
    composition: '100% Poliéster con tratamiento de secado rápido',
    typicalWeightGsm: '140 - 160 GSM',
    recommendedIronTempC: 140,
    pressTimeSeconds: 10,
    stretchResistance: 'Alta',
    dyeMigrationRisk: 'Alto (Requiere Bloqueador/Sublistop)',
    compatibleTechniques: ['Sublimación Textil (en blancos/claros)', 'DTF con Polvo Negro Anti-Sublimación', 'Vinil Textil Elástico'],
    technicalNotes: 'ATENCIÓN: En prendas de color o teñidas por dispersión, usar siempre DTF con base anti-migración o vinil sublimart para evitar teñido de la tinta blanca.'
  },
  {
    id: 'mat_polycotton_5050',
    name: 'Mezcla Poly-Cotton (50/50)',
    category: 'mezclas',
    composition: '50% Algodón / 50% Poliéster hilado',
    typicalWeightGsm: '160 - 200 GSM',
    recommendedIronTempC: 150,
    pressTimeSeconds: 12,
    stretchResistance: 'Media',
    dyeMigrationRisk: 'Medio',
    compatibleTechniques: ['DTF', 'Serigrafía Plastisol con baja temperatura', 'Bordado', 'Vinil Textil'],
    technicalNotes: 'No encoge con el lavado. Excelente durabilidad. Curar a menos de 155°C para evitar activar el tinte de poliéster.'
  },
  {
    id: 'mat_triblend',
    name: 'Tri-Blend Ultra Suave',
    category: 'mezclas',
    composition: '50% Poliéster / 25% Algodón / 25% Rayón viscosa',
    typicalWeightGsm: '130 - 150 GSM',
    recommendedIronTempC: 145,
    pressTimeSeconds: 10,
    stretchResistance: 'Alta',
    dyeMigrationRisk: 'Bajo',
    compatibleTechniques: ['DTF', 'Serigrafía con tintas ultra suaves', 'DTG'],
    technicalNotes: 'Caída drapeada y tacto sedoso vintage. No ejercer presión excesiva en plancha para no aplastar el rayón.'
  },
  {
    id: 'mat_lycra_spandex',
    name: 'Lycra / Spandex Elástico',
    category: 'lycra',
    composition: '88% Poliéster / 12% Spandex (Elastano)',
    typicalWeightGsm: '200 - 260 GSM',
    recommendedIronTempC: 135,
    pressTimeSeconds: 10,
    stretchResistance: 'Muy Alta',
    dyeMigrationRisk: 'Medio',
    compatibleTechniques: ['Sublimación', 'DTF Elástico con aditivo stretch', 'Vinil Textil Super-Flex'],
    technicalNotes: 'Requiere película y polvo DTF de alta elongación (stretch) para resistir la prueba de estiramiento sin agrietar.'
  },
  {
    id: 'mat_nylon_cordura',
    name: 'Nylon Técnico / Cordura Impermeable',
    category: 'nylon',
    composition: '100% Poliamida con recubrimiento de poliuretano repelente al agua',
    typicalWeightGsm: '250 - 500 GSM',
    recommendedIronTempC: 140,
    pressTimeSeconds: 12,
    stretchResistance: 'Baja',
    dyeMigrationRisk: 'Nulo',
    compatibleTechniques: ['Serigrafía con aditivo promotor de adherencia para Nylon', 'DTF con poliamida pura', 'Bordado'],
    technicalNotes: 'El repelente de agua impide la adhesión normal. Precalentar la tela 5 segundos para evaporar el tratamiento superficial.'
  },
  {
    id: 'mat_denim',
    name: 'Denim Sarga Gruesa',
    category: 'denim',
    composition: '100% Algodón sarga diagonal',
    typicalWeightGsm: '350 - 450 GSM (12 - 14 oz)',
    recommendedIronTempC: 170,
    pressTimeSeconds: 18,
    stretchResistance: 'Baja',
    dyeMigrationRisk: 'Bajo',
    compatibleTechniques: ['Bordado 3D', 'Serigrafía Plastisol', 'DTF Textil', 'Parches termoadhesivos'],
    technicalNotes: 'Tejido muy robusto. Ideal para bordado con hilos metálicos y parches de cuero o sarga bordada.'
  },
  {
    id: 'mat_french_terry',
    name: 'Franela French Terry & Felpa',
    category: 'franela',
    composition: '80% Algodón / 20% Poliéster con interior perchado',
    typicalWeightGsm: '360 - 420 GSM',
    recommendedIronTempC: 160,
    pressTimeSeconds: 15,
    stretchResistance: 'Media',
    dyeMigrationRisk: 'Bajo',
    compatibleTechniques: ['DTF Textil', 'Serigrafía Plastisol con malla abierta (43T)', 'Bordado Computarizado', 'Vinil Flock'],
    technicalNotes: 'Gramaje alto ideal para hoodies y sudaderas premium. Presión media-alta para asentar las fibras en la termofijación.'
  }
];
