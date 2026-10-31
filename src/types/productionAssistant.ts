/**
 * ESTAMPAPRO 360° - Tipos del Asistente Técnico Inteligente de Producción
 * Módulo 8: Guía paso a paso, recomendador técnico, perfiles y registro de auditoría.
 */

import { PrintingTechniqueId } from './techniques';

export type ProductionStepId =
  | 'seleccionar_prenda'       // 1
  | 'identificar_tela'         // 2
  | 'seleccionar_diseno'       // 3
  | 'seleccionar_tecnica'      // 4
  | 'seleccionar_maquina'      // 5
  | 'seleccionar_consumibles'  // 6
  | 'verificar_compatibilidad' // 7
  | 'consultar_ficha_tecnica'  // 8
  | 'preparar_diseno'          // 9
  | 'preparar_prenda'          // 10
  | 'ejecutar_procedimiento'   // 11
  | 'realizar_acabado'         // 12
  | 'inspeccionar_calidad'     // 13
  | 'registrar_trabajo';       // 14

export interface ProductionStepConfig {
  number: number;
  id: ProductionStepId;
  title: string;
  subtitle: string;
  phase: 'Planificación y Selección' | 'Pre-Prensa y Preparación' | 'Ejecución y Acabado' | 'Calidad y Cierre';
  instructions: string[];
  materials: string[];
  tools: string[];
  safetyWarnings: {
    type: 'calor' | 'ventilacion' | 'electricidad' | 'equipos';
    message: string;
  }[];
  parametersBadge?: string;
  defaultChecklist: string[];
  illustrationType: 'garment' | 'fabric' | 'design' | 'technique' | 'machine' | 'consumable' | 'compatibility' | 'spec_sheet' | 'prepress' | 'garment_prep' | 'press_operation' | 'peeling' | 'quality_qc' | 'audit_log';
}

/**
 * Perfil guardado de máquina y materiales
 */
export interface ProductionEquipmentProfile {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  baseTechniqueId: PrintingTechniqueId;
  machineBrandModel: string;
  heatPressModel: string;
  consumableBrand: string;
  substrateComposition: string;
  defaultTempC: number;
  defaultTimeSec: number;
  defaultPressureLevel: string;
  defaultPeeling: string;
  safetyNotes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Registro de trabajo de producción (Audit Log)
 */
export interface ProductionJobRecord {
  id: string;
  ownerId: string;
  operatorName: string;
  operatorEmail: string;
  operatorRole?: string;
  operatorUid: string;
  projectName?: string;
  garmentName: string;
  garmentColor: string;
  fabricComposition: string;
  techniqueId: PrintingTechniqueId;
  techniqueName: string;
  machineUsed: string;
  heatPressUsed: string;
  consumablesUsed: string;
  designName: string;
  designDpi: number;
  quantityUnits: number;
  parametersApplied: {
    temperatureC: number;
    timeSeconds: number;
    pressureBars: string;
    pressureLevel: string;
    peelingType: string;
    prePressSeconds: number;
    postPressSeconds: number;
  };
  compatibilityStatus: 'Optima' | 'Compatible con advertencias' | 'Excepción autorizada' | 'Incompatible';
  qualityChecksPassed: string[];
  qualityRating: 1 | 2 | 3 | 4 | 5;
  observations?: string;
  createdAt: string; // ISO Timestamp
  durationMinutes: number;
}

/**
 * Mensaje del Asistente Técnico de Recomendaciones
 */
export interface AssistantChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isVerifiedRecommendation?: boolean;
  verifiedSource?: string;
  recommendedTechniqueId?: PrintingTechniqueId;
  compatibilityAdvice?: {
    compatible: boolean;
    reason: string;
    cautionPoints: string[];
  };
}
