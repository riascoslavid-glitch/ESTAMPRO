/**
 * ESTAMPAPRO 360° - Enciclopedia Técnica de Estampado Textil
 * Tipos de datos para centro de consulta técnica, parámetros y comparador.
 */

export type PrintingTechniqueId =
  | 'dtf'
  | 'dtg'
  | 'sublimacion'
  | 'vinil_textil'
  | 'serigrafia'
  | 'bordado'
  | 'uv_dtf'
  | 'transfer_laser'
  | 'transfer_toner'
  | 'flock'
  | 'foil'
  | 'vinilo_reflectivo'
  | 'plastisol'
  | 'tintas_base_agua'
  | 'puff'
  | 'estampado_descarga'
  | 'tecnicas_especiales'
  | 'transfer_plastisol'
  | string;

export type PressureLevel = 'Baja' | 'Media' | 'Media-Alta' | 'Alta' | 'Muy Alta' | 'No aplica';

export type PeelingType = 
  | 'Pelado en Caliente (Hot Peel: 2-4 seg)'
  | 'Pelado en Tibio (Warm Peel: 8-12 seg)'
  | 'Pelado en Frío (Cold Peel: <30°C ambiente)'
  | 'Pelado Instantáneo o Tibio según film'
  | 'No aplica (Impresión directa o bordado)';

export type CoolingType = 
  | 'Enfriamiento con bloque disipador térmico'
  | 'Enfriamiento a temperatura ambiente (30-60 seg)'
  | 'Inmediato (sin enfriamiento)'
  | 'Disipación rápida al aire'
  | 'No aplica';

export interface TechniqueMachine {
  type: string;
  recommendedBrandsModels: string[];
  specsNotes: string;
}

export interface TechniqueConsumable {
  name: string;
  category: 'tinta' | 'film' | 'adhesivo' | 'papel' | 'hilo' | 'quimico' | 'vinilo' | 'otro';
  recommendedBrands: string[];
  specifications: string;
}

export interface FabricCompatibility {
  fabric: string;
  rating: 'Excelente' | 'Compatible con ajuste' | 'No recomendado' | 'Incompatible';
  notes: string;
}

export interface DesignPrepSpecs {
  resolutionDpi: string;
  colorModes: string[];
  vectorRequired: boolean;
  minLineWeightMm: string;
  whiteUnderbaseReq: string;
  fileFormats: string[];
  criticalTips: string[];
}

export interface TechnicalProcedureStep {
  stepNumber: number;
  phase: 'Pre-prensa / Preparación' | 'Producción / Aplicación' | 'Post-prensa / Acabado';
  title: string;
  description: string;
  durationOrTemp?: string;
  criticalWarning?: string;
}

export interface TechnicalParameters {
  tempCelsiusMin: number;
  tempCelsiusMax: number;
  tempFahrenheitMin: number;
  tempFahrenheitMax: number;
  timeSecondsMin: number;
  timeSecondsMax: number;
  pressureLevel: PressureLevel;
  pressureBars?: string;
  pressurePsi?: string;
  speed: string;
  curingMethod: string;
  curingTempTime?: string;
  cooling: CoolingType;
  peeling: PeelingType;
  primaryMaterials: string[];
  machineModelReference: string;
  consumableReference: string;
  verifiedSource: string;
  lastVerifiedDate: string;
  isManufacturerVerified: boolean;
  manufacturerNotice?: string;
}

export interface FinishingSpec {
  touch: 'Tacto Cero (Inapreciable)' | 'Mano Ultra Suave' | 'Mano Suave' | 'Mano Media' | 'Engomado Elástico' | 'Relieve 3D Texturizado' | 'Puntadas Bordadas' | 'Rígido Ultra Brillante' | 'Rígido' | 'Aterciopelado' | string;
  gloss: 'Mate' | 'Satinado' | 'Brillante' | 'Metálico Espejo' | 'Tornasol / Refractivo' | 'Reflectivo de Seguridad' | string;
  elasticity: 'Muy Alta (Bi-stretch)' | 'Alta' | 'Media' | 'Baja' | 'Rígido' | string;
  opacityDarkFabrics: 'Opacidad Total 100%' | 'Alta' | 'Media' | 'Baja (Sólo prendas claras)' | string;
  breathability: 'Muy Alta (Tejido respira)' | 'Alta' | 'Media' | 'Baja (Efecto barrera)' | string;
}

export interface CareProtocol {
  washTempMaxC: number;
  washCycle: string;
  turnInsideOut: boolean;
  bleachAllowed: boolean;
  tumbleDry: 'Prohibido secadora' | 'Prohibido secadora caliente' | 'Baja temperatura ciclo delicado' | 'Apto secadora industrial' | string;
  ironing: string;
  certifiedWashCycles: number;
  curationTimeBeforeFirstWashHours: number;
}

export interface CommonProblem {
  id: string;
  symptom: string;
  probableCause: string;
  technicalSolution: string;
  severity: 'Crítico' | 'Moderado' | 'Preventivo';
}

export interface ManufacturerCalibrationPreset {
  id: string;
  presetName: string;
  brand: string;
  equipmentModel: string;
  consumableUsed: string;
  substrate: string;
  tempC: number;
  timeSec: number;
  pressure: string;
  peeling: string;
  prePressSec: number;
  postPressSec: number;
  verifiedDate: string;
  sourceDoc: string;
}

export interface ComparisonMetrics {
  fabricCompatibilityScore: number; // 1 - 10
  durabilityScore: number;          // 1 - 10
  quantityFlexibilityScore: number; // 1 - 10 (10 = rentable desde 1 unidad)
  initialInvestmentCost: 'Bajo (<$1,000 USD)' | 'Medio ($1,000-$6,000 USD)' | 'Alto ($6,000-$20,000 USD)' | 'Industrial (>$20,000 USD)';
  costPerUnitSmallRun: 'Económico' | 'Medio' | 'Alto' | 'No recomendado';
  costPerUnitBulkRun: 'Muy Económico' | 'Económico' | 'Medio' | 'Alto';
  operationalComplexity: 'Baja' | 'Media' | 'Alta' | 'Muy Alta (Especialista)';
  spaceRequirement: 'Escritorio / Taller chico' | 'Medio (30-60 m²)' | 'Industrial ventilado (>80 m²)';
}

export interface DetailedTechniqueSheet {
  id: PrintingTechniqueId;
  name: string;
  shortDesc: string;
  fullDesc: string;
  functioning: string; // Explicación físico-química y mecánica
  advantages: string[];
  disadvantages: string[];
  machines: TechniqueMachine[];
  tools: string[];
  consumables: TechniqueConsumable[];
  materials: string[];
  compatibleFabrics: FabricCompatibility[];
  designPreparation: DesignPrepSpecs;
  procedure: TechnicalProcedureStep[];
  defaultParameters: TechnicalParameters;
  manufacturerPresets: ManufacturerCalibrationPreset[];
  finishing: FinishingSpec;
  care: CareProtocol;
  commonProblems: CommonProblem[];
  comparisonMetrics: ComparisonMetrics;
}

/**
 * Ficha técnica personalizada guardada por el usuario / taller
 */
export interface CustomTechniqueSheet {
  id: string;
  ownerId: string;
  title: string;
  baseTechniqueId: PrintingTechniqueId;
  baseTechniqueName: string;
  workshopName?: string;
  operatorName?: string;
  equipmentBrandModel: string;
  heatPressModel: string;
  consumableBrand: string;
  substrateFabric: string;
  tempCelsius: number;
  timeSeconds: number;
  pressureLevel: PressureLevel;
  pressureDetails?: string;
  curingDetails?: string;
  coolingMethod: string;
  peelingType: string;
  prePressSeconds: number;
  postPressSeconds: number;
  testedWashCycles?: number;
  technicalNotes: string;
  sourceReference?: string;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}
