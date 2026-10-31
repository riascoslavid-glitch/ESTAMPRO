import * as THREE from 'three';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';
import { PrintZone3D, DecalLayer3D } from '../../types';
import { Garment3DModelType } from './garmentGeometries';

/**
 * ESTAMPAPRO 360° - Motor de Mapeo y Proyección 3D de Diseños sobre Prendas
 * Implementa proyección real DecalGeometry sobre superficies tridimensionales,
 * eliminando planos flotantes, distorsiones UV y desprendimiento al girar 360°.
 * Compatible con el catálogo completo de 30 modelos y avatares humanos.
 */

export interface ZoneSurfaceDefinition {
  id: PrintZone3D;
  label: string;
  category: 'frente' | 'espalda' | 'mangas' | 'detalles' | 'pantalones' | 'gorras' | 'accesorios';
  targetPartNames: string[];
  defaultWidthCm: number;
  defaultHeightCm: number;
  maxWidthCm: number;
  maxHeightCm: number;
  // Posiciones base en prenda aislada (Y ~1.35m)
  basePositionIsolated: { x: number; y: number; z: number };
  baseNormalIsolated: { x: number; y: number; z: number };
  // Posiciones base en probador virtual (Avatar humano, Y ~2.15m)
  basePositionAvatar: { x: number; y: number; z: number };
  baseNormalAvatar: { x: number; y: number; z: number };
  cameraFocus: {
    camPosition: [number, number, number];
    camTarget: [number, number, number];
    label: string;
  };
}

export const PRINT_ZONES_METADATA: Record<PrintZone3D, ZoneSurfaceDefinition> = {
  pecho_izquierdo: {
    id: 'pecho_izquierdo',
    label: 'Pecho Izquierdo (Escudo)',
    category: 'frente',
    targetPartNames: ['cuerpo', 'corona_frontal', 'cuerpo_izquierdo'],
    defaultWidthCm: 10,
    defaultHeightCm: 10,
    maxWidthCm: 14,
    maxHeightCm: 14,
    basePositionIsolated: { x: 0.36, y: 1.58, z: 0.49 },
    baseNormalIsolated: { x: 0.15, y: 0, z: 0.98 },
    basePositionAvatar: { x: 0.38, y: 2.28, z: 0.52 },
    baseNormalAvatar: { x: 0.15, y: 0, z: 0.98 },
    cameraFocus: {
      camPosition: [0.9, 1.6, 2.5],
      camTarget: [0.36, 1.58, 0],
      label: 'Zoom Pecho Izquierdo'
    }
  },
  pecho_derecho: {
    id: 'pecho_derecho',
    label: 'Pecho Derecho',
    category: 'frente',
    targetPartNames: ['cuerpo', 'corona_frontal', 'cuerpo_derecho'],
    defaultWidthCm: 10,
    defaultHeightCm: 10,
    maxWidthCm: 14,
    maxHeightCm: 14,
    basePositionIsolated: { x: -0.36, y: 1.58, z: 0.49 },
    baseNormalIsolated: { x: -0.15, y: 0, z: 0.98 },
    basePositionAvatar: { x: -0.38, y: 2.28, z: 0.52 },
    baseNormalAvatar: { x: -0.15, y: 0, z: 0.98 },
    cameraFocus: {
      camPosition: [-0.9, 1.6, 2.5],
      camTarget: [-0.36, 1.58, 0],
      label: 'Zoom Pecho Derecho'
    }
  },
  centro_pecho: {
    id: 'centro_pecho',
    label: 'Centro del Pecho (Medio)',
    category: 'frente',
    targetPartNames: ['cuerpo', 'cuerpo_izquierdo', 'cuerpo_derecho'],
    defaultWidthCm: 18,
    defaultHeightCm: 18,
    maxWidthCm: 25,
    maxHeightCm: 25,
    basePositionIsolated: { x: 0, y: 1.6, z: 0.51 },
    baseNormalIsolated: { x: 0, y: 0, z: 1.0 },
    basePositionAvatar: { x: 0, y: 2.3, z: 0.54 },
    baseNormalAvatar: { x: 0, y: 0, z: 1.0 },
    cameraFocus: {
      camPosition: [0, 1.6, 2.7],
      camTarget: [0, 1.6, 0],
      label: 'Zoom Centro Pecho'
    }
  },
  centro_frontal: {
    id: 'centro_frontal',
    label: 'Frente Completo (Torso)',
    category: 'frente',
    targetPartNames: ['cuerpo', 'cuerpo_izquierdo', 'cuerpo_derecho', 'torso'],
    defaultWidthCm: 28,
    defaultHeightCm: 36,
    maxWidthCm: 38,
    maxHeightCm: 48,
    basePositionIsolated: { x: 0, y: 1.35, z: 0.52 },
    baseNormalIsolated: { x: 0, y: 0, z: 1.0 },
    basePositionAvatar: { x: 0, y: 2.15, z: 0.55 },
    baseNormalAvatar: { x: 0, y: 0, z: 1.0 },
    cameraFocus: {
      camPosition: [0, 1.4, 3.5],
      camTarget: [0, 1.35, 0],
      label: 'Vista Frontal Centrada'
    }
  },
  espalda: {
    id: 'espalda',
    label: 'Espalda (Dorsal Completo)',
    category: 'espalda',
    targetPartNames: ['cuerpo', 'espalda', 'torso'],
    defaultWidthCm: 30,
    defaultHeightCm: 38,
    maxWidthCm: 38,
    maxHeightCm: 48,
    basePositionIsolated: { x: 0, y: 1.45, z: -0.52 },
    baseNormalIsolated: { x: 0, y: 0, z: -1.0 },
    basePositionAvatar: { x: 0, y: 2.15, z: -0.55 },
    baseNormalAvatar: { x: 0, y: 0, z: -1.0 },
    cameraFocus: {
      camPosition: [0, 1.5, -3.8],
      camTarget: [0, 1.45, 0],
      label: 'Vista Espalda 180°'
    }
  },
  espalda_superior: {
    id: 'espalda_superior',
    label: 'Espalda Superior / Nuca',
    category: 'espalda',
    targetPartNames: ['cuerpo', 'espalda', 'torso'],
    defaultWidthCm: 18,
    defaultHeightCm: 8,
    maxWidthCm: 26,
    maxHeightCm: 14,
    basePositionIsolated: { x: 0, y: 2.05, z: -0.48 },
    baseNormalIsolated: { x: 0, y: 0.15, z: -0.98 },
    basePositionAvatar: { x: 0, y: 2.65, z: -0.5 },
    baseNormalAvatar: { x: 0, y: 0.15, z: -0.98 },
    cameraFocus: {
      camPosition: [0, 2.1, -2.8],
      camTarget: [0, 2.05, 0],
      label: 'Zoom Espalda Superior'
    }
  },
  espalda_completa: {
    id: 'espalda_completa',
    label: 'Espalda Completa XL (Dorsal a Cintura)',
    category: 'espalda',
    targetPartNames: ['cuerpo', 'espalda', 'torso'],
    defaultWidthCm: 32,
    defaultHeightCm: 45,
    maxWidthCm: 40,
    maxHeightCm: 52,
    basePositionIsolated: { x: 0, y: 1.35, z: -0.52 },
    baseNormalIsolated: { x: 0, y: 0, z: -1.0 },
    basePositionAvatar: { x: 0, y: 2.05, z: -0.55 },
    baseNormalAvatar: { x: 0, y: 0, z: -1.0 },
    cameraFocus: {
      camPosition: [0, 1.4, -3.8],
      camTarget: [0, 1.35, 0],
      label: 'Espalda Completa'
    }
  },
  manga_izquierda: {
    id: 'manga_izquierda',
    label: 'Manga Izquierda',
    category: 'mangas',
    targetPartNames: ['manga_izquierda', 'mangas', 'franja_manga'],
    defaultWidthCm: 9,
    defaultHeightCm: 14,
    maxWidthCm: 12,
    maxHeightCm: 28,
    basePositionIsolated: { x: 1.15, y: 1.72, z: 0.12 },
    baseNormalIsolated: { x: 0.92, y: 0, z: 0.38 },
    basePositionAvatar: { x: 1.25, y: 2.35, z: 0.14 },
    baseNormalAvatar: { x: 0.92, y: 0, z: 0.38 },
    cameraFocus: {
      camPosition: [3.4, 1.7, 0.4],
      camTarget: [1.1, 1.7, 0],
      label: 'Lateral Manga Izquierda'
    }
  },
  manga_derecha: {
    id: 'manga_derecha',
    label: 'Manga Derecha',
    category: 'mangas',
    targetPartNames: ['manga_derecha', 'mangas', 'franja_manga'],
    defaultWidthCm: 9,
    defaultHeightCm: 14,
    maxWidthCm: 12,
    maxHeightCm: 28,
    basePositionIsolated: { x: -1.15, y: 1.72, z: 0.12 },
    baseNormalIsolated: { x: -0.92, y: 0, z: 0.38 },
    basePositionAvatar: { x: -1.25, y: 2.35, z: 0.14 },
    baseNormalAvatar: { x: -0.92, y: 0, z: 0.38 },
    cameraFocus: {
      camPosition: [-3.4, 1.7, 0.4],
      camTarget: [-1.1, 1.7, 0],
      label: 'Lateral Manga Derecha'
    }
  },
  cuello: {
    id: 'cuello',
    label: 'Cuello / Ribete',
    category: 'detalles',
    targetPartNames: ['cuello', 'tapeta_botones', 'cuello_v', 'cuello_alto'],
    defaultWidthCm: 8,
    defaultHeightCm: 4,
    maxWidthCm: 14,
    maxHeightCm: 6,
    basePositionIsolated: { x: 0, y: 2.22, z: 0.38 },
    baseNormalIsolated: { x: 0, y: 0.3, z: 0.95 },
    basePositionAvatar: { x: 0, y: 2.85, z: 0.42 },
    baseNormalAvatar: { x: 0, y: 0.3, z: 0.95 },
    cameraFocus: {
      camPosition: [0, 2.3, 1.8],
      camTarget: [0, 2.2, 0.2],
      label: 'Detalle Cuello'
    }
  },
  capucha: {
    id: 'capucha',
    label: 'Capucha (Lateral / Posterior)',
    category: 'detalles',
    targetPartNames: ['capucha'],
    defaultWidthCm: 14,
    defaultHeightCm: 14,
    maxWidthCm: 20,
    maxHeightCm: 22,
    basePositionIsolated: { x: 0.42, y: 2.25, z: -0.15 },
    baseNormalIsolated: { x: 0.85, y: 0, z: -0.52 },
    basePositionAvatar: { x: 0.45, y: 2.92, z: -0.16 },
    baseNormalAvatar: { x: 0.85, y: 0, z: -0.52 },
    cameraFocus: {
      camPosition: [1.8, 2.4, -1.8],
      camTarget: [0.35, 2.25, -0.1],
      label: 'Capucha Lateral'
    }
  },
  bolsillos: {
    id: 'bolsillos',
    label: 'Bolsillo Frontal / Lateral',
    category: 'detalles',
    targetPartNames: ['bolsillo', 'bolsillos', 'cuerpo', 'bolsillos_inferiores'],
    defaultWidthCm: 18,
    defaultHeightCm: 12,
    maxWidthCm: 26,
    maxHeightCm: 16,
    basePositionIsolated: { x: 0, y: 0.88, z: 0.52 },
    baseNormalIsolated: { x: 0, y: 0.1, z: 0.99 },
    basePositionAvatar: { x: 0, y: 1.55, z: 0.58 },
    baseNormalAvatar: { x: 0, y: 0.1, z: 0.99 },
    cameraFocus: {
      camPosition: [0, 0.9, 2.3],
      camTarget: [0, 0.88, 0.3],
      label: 'Detalle Bolsillo'
    }
  },
  bolsillo_canguro: {
    id: 'bolsillo_canguro',
    label: 'Bolsillo Canguro (Hoodie)',
    category: 'detalles',
    targetPartNames: ['bolsillo', 'cuerpo'],
    defaultWidthCm: 22,
    defaultHeightCm: 14,
    maxWidthCm: 28,
    maxHeightCm: 18,
    basePositionIsolated: { x: 0, y: 0.98, z: 0.52 },
    baseNormalIsolated: { x: 0, y: 0.08, z: 0.99 },
    basePositionAvatar: { x: 0, y: 1.65, z: 0.58 },
    baseNormalAvatar: { x: 0, y: 0.08, z: 0.99 },
    cameraFocus: {
      camPosition: [0, 1.05, 2.4],
      camTarget: [0, 0.98, 0.3],
      label: 'Bolsillo Canguro'
    }
  },
  pantalones: {
    id: 'pantalones',
    label: 'Pantalones / Pernera Lateral',
    category: 'pantalones',
    targetPartNames: ['piernas', 'leftLeg', 'rightLeg', 'bottom_pantalon_laboral', 'bottom_jogger_streetwear'],
    defaultWidthCm: 12,
    defaultHeightCm: 22,
    maxWidthCm: 16,
    maxHeightCm: 45,
    basePositionIsolated: { x: 0.48, y: 0.75, z: 0.22 },
    baseNormalIsolated: { x: 0.75, y: 0, z: 0.65 },
    basePositionAvatar: { x: 0.48, y: 0.85, z: 0.24 },
    baseNormalAvatar: { x: 0.75, y: 0, z: 0.65 },
    cameraFocus: {
      camPosition: [1.8, 0.8, 2.6],
      camTarget: [0.4, 0.75, 0],
      label: 'Pantalón Lateral'
    }
  },
  pierna_izquierda: {
    id: 'pierna_izquierda',
    label: 'Pierna Izquierda Frontal',
    category: 'pantalones',
    targetPartNames: ['piernas', 'cuerpo_pantaloneta', 'cuerpo_short', 'leftLeg'],
    defaultWidthCm: 12,
    defaultHeightCm: 24,
    maxWidthCm: 16,
    maxHeightCm: 42,
    basePositionIsolated: { x: 0.38, y: 0.75, z: 0.28 },
    baseNormalIsolated: { x: 0.1, y: 0, z: 0.99 },
    basePositionAvatar: { x: 0.38, y: 0.85, z: 0.3 },
    baseNormalAvatar: { x: 0.1, y: 0, z: 0.99 },
    cameraFocus: {
      camPosition: [0.8, 0.8, 2.5],
      camTarget: [0.38, 0.75, 0],
      label: 'Pierna Izquierda'
    }
  },
  pierna_derecha: {
    id: 'pierna_derecha',
    label: 'Pierna Derecha Frontal',
    category: 'pantalones',
    targetPartNames: ['piernas', 'cuerpo_pantaloneta', 'cuerpo_short', 'rightLeg'],
    defaultWidthCm: 12,
    defaultHeightCm: 24,
    maxWidthCm: 16,
    maxHeightCm: 42,
    basePositionIsolated: { x: -0.38, y: 0.75, z: 0.28 },
    baseNormalIsolated: { x: -0.1, y: 0, z: 0.99 },
    basePositionAvatar: { x: -0.38, y: 0.85, z: 0.3 },
    baseNormalAvatar: { x: -0.1, y: 0, z: 0.99 },
    cameraFocus: {
      camPosition: [-0.8, 0.8, 2.5],
      camTarget: [-0.38, 0.75, 0],
      label: 'Pierna Derecha'
    }
  },
  gorras: {
    id: 'gorras',
    label: 'Corona Frontal Gorra',
    category: 'gorras',
    targetPartNames: ['corona_frontal', 'cuerpo'],
    defaultWidthCm: 11,
    defaultHeightCm: 6.5,
    maxWidthCm: 14,
    maxHeightCm: 8,
    basePositionIsolated: { x: 0, y: 1.48, z: 0.75 },
    baseNormalIsolated: { x: 0, y: 0.2, z: 0.98 },
    basePositionAvatar: { x: 0, y: 2.82, z: 0.78 },
    baseNormalAvatar: { x: 0, y: 0.2, z: 0.98 },
    cameraFocus: {
      camPosition: [0, 1.55, 2.4],
      camTarget: [0, 1.48, 0.5],
      label: 'Frontal Gorra Trucker'
    }
  },
  corona_frontal: {
    id: 'corona_frontal',
    label: 'Corona Frontal (Parche / Bordado)',
    category: 'gorras',
    targetPartNames: ['corona_frontal', 'cuerpo'],
    defaultWidthCm: 12,
    defaultHeightCm: 7,
    maxWidthCm: 14,
    maxHeightCm: 8,
    basePositionIsolated: { x: 0, y: 1.48, z: 0.75 },
    baseNormalIsolated: { x: 0, y: 0.2, z: 0.98 },
    basePositionAvatar: { x: 0, y: 2.82, z: 0.78 },
    baseNormalAvatar: { x: 0, y: 0.2, z: 0.98 },
    cameraFocus: {
      camPosition: [0, 1.55, 2.4],
      camTarget: [0, 1.48, 0.5],
      label: 'Corona Frontal'
    }
  },
  pechera_delantal: {
    id: 'pechera_delantal',
    label: 'Pechera / Peto Superior',
    category: 'frente',
    targetPartNames: ['cuerpo', 'pechera'],
    defaultWidthCm: 18,
    defaultHeightCm: 18,
    maxWidthCm: 22,
    maxHeightCm: 24,
    basePositionIsolated: { x: 0, y: 2.05, z: 0.48 },
    baseNormalIsolated: { x: 0, y: 0, z: 1.0 },
    basePositionAvatar: { x: 0, y: 2.65, z: 0.52 },
    baseNormalAvatar: { x: 0, y: 0, z: 1.0 },
    cameraFocus: {
      camPosition: [0, 2.05, 2.6],
      camTarget: [0, 2.05, 0.3],
      label: 'Pechera Delantal'
    }
  },
  bolsillo_delantal: {
    id: 'bolsillo_delantal',
    label: 'Bolsillo Frontal Delantal',
    category: 'detalles',
    targetPartNames: ['bolsillo', 'cuerpo'],
    defaultWidthCm: 22,
    defaultHeightCm: 14,
    maxWidthCm: 26,
    maxHeightCm: 18,
    basePositionIsolated: { x: 0, y: 1.02, z: 0.52 },
    baseNormalIsolated: { x: 0, y: 0, z: 1.0 },
    basePositionAvatar: { x: 0, y: 1.62, z: 0.55 },
    baseNormalAvatar: { x: 0, y: 0, z: 1.0 },
    cameraFocus: {
      camPosition: [0, 1.05, 2.4],
      camTarget: [0, 1.02, 0.3],
      label: 'Bolsillo Delantal'
    }
  },
  falda_delantal: {
    id: 'falda_delantal',
    label: 'Falda Inferior Delantal',
    category: 'frente',
    targetPartNames: ['cuerpo'],
    defaultWidthCm: 26,
    defaultHeightCm: 26,
    maxWidthCm: 32,
    maxHeightCm: 35,
    basePositionIsolated: { x: 0, y: 0.65, z: 0.48 },
    baseNormalIsolated: { x: 0, y: 0, z: 1.0 },
    basePositionAvatar: { x: 0, y: 1.25, z: 0.52 },
    baseNormalAvatar: { x: 0, y: 0, z: 1.0 },
    cameraFocus: {
      camPosition: [0, 0.7, 2.6],
      camTarget: [0, 0.65, 0.3],
      label: 'Falda Delantal'
    }
  },
  bolso_frontal: {
    id: 'bolso_frontal',
    label: 'Cara Frontal Tote Bag / Mochila',
    category: 'accesorios',
    targetPartNames: ['cuerpo', 'bolsillo_frontal'],
    defaultWidthCm: 26,
    defaultHeightCm: 28,
    maxWidthCm: 32,
    maxHeightCm: 34,
    basePositionIsolated: { x: 0, y: 1.08, z: 0.12 },
    baseNormalIsolated: { x: 0, y: 0, z: 1.0 },
    basePositionAvatar: { x: 0, y: 1.2, z: 0.2 },
    baseNormalAvatar: { x: 0, y: 0, z: 1.0 },
    cameraFocus: {
      camPosition: [0, 1.15, 2.6],
      camTarget: [0, 1.08, 0],
      label: 'Cara Frontal Bolso'
    }
  },
  cojin_frontal: {
    id: 'cojin_frontal',
    label: 'Cara Frontal Cojín (35x35 cm)',
    category: 'accesorios',
    targetPartNames: ['cuerpo'],
    defaultWidthCm: 32,
    defaultHeightCm: 32,
    maxWidthCm: 38,
    maxHeightCm: 38,
    basePositionIsolated: { x: 0, y: 1.2, z: 0.32 },
    baseNormalIsolated: { x: 0, y: 0, z: 1.0 },
    basePositionAvatar: { x: 0, y: 1.3, z: 0.35 },
    baseNormalAvatar: { x: 0, y: 0, z: 1.0 },
    cameraFocus: {
      camPosition: [0, 1.2, 2.6],
      camTarget: [0, 1.2, 0],
      label: 'Frontal Cojín'
    }
  },
  toalla_completa: {
    id: 'toalla_completa',
    label: 'Superficie Toalla (Lienzo Completo)',
    category: 'accesorios',
    targetPartNames: ['cuerpo'],
    defaultWidthCm: 35,
    defaultHeightCm: 60,
    maxWidthCm: 45,
    maxHeightCm: 80,
    basePositionIsolated: { x: 0, y: 1.1, z: 0.05 },
    baseNormalIsolated: { x: 0, y: 0, z: 1.0 },
    basePositionAvatar: { x: 0, y: 1.2, z: 0.1 },
    baseNormalAvatar: { x: 0, y: 0, z: 1.0 },
    cameraFocus: {
      camPosition: [0, 1.1, 3.2],
      camTarget: [0, 1.1, 0],
      label: 'Superficie Toalla'
    }
  },
  otras_superficies: {
    id: 'otras_superficies',
    label: 'Dobladillo / Pretina Inferior',
    category: 'detalles',
    targetPartNames: ['dobladillo', 'pretina', 'cuerpo'],
    defaultWidthCm: 16,
    defaultHeightCm: 5,
    maxWidthCm: 30,
    maxHeightCm: 8,
    basePositionIsolated: { x: 0.28, y: 0.35, z: 0.52 },
    baseNormalIsolated: { x: 0.1, y: 0, z: 0.99 },
    basePositionAvatar: { x: 0.3, y: 1.05, z: 0.55 },
    baseNormalAvatar: { x: 0.1, y: 0, z: 0.99 },
    cameraFocus: {
      camPosition: [0.6, 0.45, 2.2],
      camTarget: [0.28, 0.35, 0.2],
      label: 'Dobladillo Inferior'
    }
  }
};

/**
 * Obtiene la lista ordenada de zonas personalizables para un modelo de prenda específico
 */
export function getZonesForGarment(modelId: Garment3DModelType): ZoneSurfaceDefinition[] {
  // Gorras
  if (modelId === 'gorra_trucker') {
    return [
      PRINT_ZONES_METADATA.corona_frontal,
      PRINT_ZONES_METADATA.gorras
    ];
  }

  // Accesorios específicos
  if (modelId === 'bolso_tote' || modelId === 'mochila_morral') {
    return [
      PRINT_ZONES_METADATA.bolso_frontal,
      PRINT_ZONES_METADATA.centro_frontal
    ];
  }
  if (modelId === 'cojin_cuadrado') {
    return [
      PRINT_ZONES_METADATA.cojin_frontal,
      PRINT_ZONES_METADATA.centro_frontal
    ];
  }
  if (modelId === 'toalla_playera') {
    return [
      PRINT_ZONES_METADATA.toalla_completa,
      PRINT_ZONES_METADATA.centro_frontal
    ];
  }

  // Delantal
  if (modelId === 'delantal_chef') {
    return [
      PRINT_ZONES_METADATA.pechera_delantal,
      PRINT_ZONES_METADATA.bolsillo_delantal,
      PRINT_ZONES_METADATA.falda_delantal
    ];
  }

  // Pantalones / Shorts
  if (
    modelId === 'pantalon_cargo' ||
    modelId === 'pantaloneta_playera' ||
    modelId === 'short_deportivo' ||
    modelId === 'overol_laboral'
  ) {
    return [
      PRINT_ZONES_METADATA.pierna_izquierda,
      PRINT_ZONES_METADATA.pierna_derecha,
      PRINT_ZONES_METADATA.pantalones
    ];
  }

  // Busos / Hoodies
  if (
    modelId === 'hoodie' ||
    modelId === 'hoodie_cremallera' ||
    modelId === 'buso_cuello_redondo' ||
    modelId === 'buso_oversize' ||
    modelId === 'buso_deportivo'
  ) {
    return [
      PRINT_ZONES_METADATA.centro_frontal,
      PRINT_ZONES_METADATA.pecho_izquierdo,
      PRINT_ZONES_METADATA.pecho_derecho,
      PRINT_ZONES_METADATA.centro_pecho,
      PRINT_ZONES_METADATA.espalda,
      PRINT_ZONES_METADATA.espalda_superior,
      PRINT_ZONES_METADATA.capucha,
      PRINT_ZONES_METADATA.bolsillo_canguro,
      PRINT_ZONES_METADATA.manga_izquierda,
      PRINT_ZONES_METADATA.manga_derecha
    ];
  }

  // Camisetas (por defecto)
  return [
    PRINT_ZONES_METADATA.centro_frontal,
    PRINT_ZONES_METADATA.pecho_izquierdo,
    PRINT_ZONES_METADATA.pecho_derecho,
    PRINT_ZONES_METADATA.centro_pecho,
    PRINT_ZONES_METADATA.espalda,
    PRINT_ZONES_METADATA.espalda_superior,
    PRINT_ZONES_METADATA.espalda_completa,
    PRINT_ZONES_METADATA.manga_izquierda,
    PRINT_ZONES_METADATA.manga_derecha,
    PRINT_ZONES_METADATA.cuello
  ];
}

/**
 * Busca recursivamente la malla de destino dentro del grupo de la prenda 3D
 */
export function findTargetMeshForZone(
  garmentGroup: THREE.Group,
  zone: PrintZone3D
): THREE.Mesh | null {
  const zoneMeta = PRINT_ZONES_METADATA[zone];
  if (!zoneMeta) return null;

  let bestMesh: THREE.Mesh | null = null;

  garmentGroup.traverse((child) => {
    if (bestMesh) return;
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      const partId = mesh.userData?.partId || mesh.name;

      for (const targetName of zoneMeta.targetPartNames) {
        if (partId && (partId === targetName || partId.includes(targetName) || mesh.name.includes(targetName))) {
          bestMesh = mesh;
          return;
        }
      }
    }
  });

  // Fallback al primer Mesh hijo si no hay coincidencia exacta de nombre
  if (!bestMesh) {
    garmentGroup.traverse((child) => {
      if (!bestMesh && (child as THREE.Mesh).isMesh) {
        bestMesh = child as THREE.Mesh;
      }
    });
  }

  return bestMesh;
}

/**
 * Convierte centímetros físicos a unidades de escala en el espacio 3D de Three.js
 * 1 unidad Three.js = aprox 28-30 cm de torso textil
 */
export function cmToUnits3D(cm: number): number {
  return (cm / 28.0) * 1.0;
}

/**
 * Crea una proyección real DecalGeometry sobre la superficie de la prenda
 */
export function createRealisticDecalMesh(
  targetMesh: THREE.Mesh,
  decalConfig: DecalLayer3D,
  texture: THREE.Texture,
  isAvatarMode: boolean = false
): THREE.Mesh {
  const zoneMeta = PRINT_ZONES_METADATA[decalConfig.zone] || PRINT_ZONES_METADATA.centro_frontal;

  const baseCoords = isAvatarMode ? zoneMeta.basePositionAvatar : zoneMeta.basePositionIsolated;
  const baseNormal = isAvatarMode ? zoneMeta.baseNormalAvatar : zoneMeta.baseNormalIsolated;

  // 1. Calcular posición exacta sobre la superficie considerando offsets en cm
  const offsetX3D = cmToUnits3D(decalConfig.offsetXCm);
  const offsetY3D = cmToUnits3D(decalConfig.offsetYCm);

  const surfacePosition = new THREE.Vector3(
    baseCoords.x + offsetX3D,
    baseCoords.y + offsetY3D,
    baseCoords.z
  );

  // 2. Vector normal hacia afuera de la tela
  const normalVec = new THREE.Vector3(baseNormal.x, baseNormal.y, baseNormal.z).normalize();

  // 3. Orientación tangencial y rotación sobre el plano de la tela
  const dummy = new THREE.Object3D();
  dummy.position.copy(surfacePosition);
  dummy.lookAt(surfacePosition.clone().add(normalVec));

  // Aplicar rotación en grados ingresada por el usuario (sobre el eje Z local del decal)
  dummy.rotation.z += (decalConfig.rotationDeg * Math.PI) / 180;

  // 4. Dimensiones de la caja de proyección volumétrica Decal
  const width3D = cmToUnits3D(decalConfig.widthCm) * decalConfig.scale;
  const height3D = cmToUnits3D(decalConfig.heightCm) * decalConfig.scale;
  const depth3D = Math.max(0.25, Math.min(width3D, height3D) * 0.45);

  const decalSize = new THREE.Vector3(width3D, height3D, depth3D);

  // 5. Configurar Textura
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;

  // 6. Configurar Material PBR de Estampado Textil (tacto serigráfico / DTF)
  const finishProps = getFinishMaterialProps(decalConfig.finishStyle);

  const decalMat = new THREE.MeshStandardMaterial({
    map: texture,
    transparent: true,
    opacity: decalConfig.opacity ?? 1.0,
    alphaTest: 0.015,
    depthTest: true,
    depthWrite: false, // Evita oclusión z-fighting con la malla base
    polygonOffset: true,
    polygonOffsetFactor: -4,
    polygonOffsetUnits: -4,
    roughness: finishProps.roughness,
    metalness: finishProps.metalness,
    side: THREE.DoubleSide
  });

  // 7. Generar DecalGeometry proyectado
  try {
    targetMesh.updateMatrixWorld(true);

    const decalGeometry = new DecalGeometry(
      targetMesh,
      surfacePosition,
      dummy.rotation,
      decalSize
    );

    const decalMesh = new THREE.Mesh(decalGeometry, decalMat);
    decalMesh.name = `decal_${decalConfig.id}`;
    decalMesh.userData = {
      decalId: decalConfig.id,
      zone: decalConfig.zone,
      isDecal: true
    };
    decalMesh.renderOrder = 10;
    return decalMesh;
  } catch (err) {
    console.warn('Fallback a geometría de superficie conforme para decal:', err);
    return createSurfaceConformalFallback(
      surfacePosition,
      normalVec,
      width3D,
      height3D,
      decalConfig.rotationDeg,
      decalMat,
      decalConfig.id,
      decalConfig.zone
    );
  }
}

/**
 * Propiedades PBR según el acabado de la técnica de estampado
 */
function getFinishMaterialProps(style: DecalLayer3D['finishStyle']) {
  switch (style) {
    case 'plastisol_brillante':
      return { roughness: 0.22, metalness: 0.08 };
    case 'base_agua_mate':
      return { roughness: 0.65, metalness: 0.0 };
    case 'sublimado':
      return { roughness: 0.5, metalness: 0.0 };
    case 'relieve_puff':
      return { roughness: 0.4, metalness: 0.05 };
    case 'dtf_suave':
    default:
      return { roughness: 0.35, metalness: 0.03 };
  }
}

/**
 * Geometría conforme de respaldo con curvatura tangencial de tela
 */
function createSurfaceConformalFallback(
  position: THREE.Vector3,
  normal: THREE.Vector3,
  width: number,
  height: number,
  rotationDeg: number,
  material: THREE.Material,
  id: string,
  zone: PrintZone3D
): THREE.Mesh {
  const geo = new THREE.PlaneGeometry(width, height, 16, 16);
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const curve = -Math.pow(x / (width / 2), 2) * 0.04;
    pos.setZ(i, curve);
  }
  geo.computeVertexNormals();

  const dummy = new THREE.Object3D();
  dummy.position.copy(position);
  dummy.lookAt(position.clone().add(normal));
  dummy.rotation.z += (rotationDeg * Math.PI) / 180;

  const mesh = new THREE.Mesh(geo, material);
  mesh.name = `decal_fallback_${id}`;
  mesh.position.copy(dummy.position);
  mesh.rotation.copy(dummy.rotation);
  mesh.userData = { decalId: id, zone, isDecal: true };
  mesh.renderOrder = 10;
  return mesh;
}

/**
 * Crea un marco resaltador luminoso 3D sobre la zona activa seleccionada
 * Proporciona el feedback visual interactivo exigido al hacer clic en una zona
 */
export function createZoneHighlightMesh(
  zone: PrintZone3D,
  isAvatarMode: boolean = false
): THREE.Mesh {
  const meta = PRINT_ZONES_METADATA[zone] || PRINT_ZONES_METADATA.centro_frontal;
  const baseCoords = isAvatarMode ? meta.basePositionAvatar : meta.basePositionIsolated;
  const baseNormal = isAvatarMode ? meta.baseNormalAvatar : meta.baseNormalIsolated;

  const width3D = cmToUnits3D(meta.defaultWidthCm);
  const height3D = cmToUnits3D(meta.defaultHeightCm);

  // Crear marco rectangular con esquinas delimitadas
  const highlightGeo = new THREE.PlaneGeometry(width3D, height3D);
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Dibujar rectángulo cian / índigo neón con esquinas y transparencia suave
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 6;
  ctx.strokeRect(4, 4, 120, 120);

  ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
  ctx.fillRect(8, 8, 112, 112);

  const texture = new THREE.CanvasTexture(canvas);
  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.85,
    depthTest: true,
    depthWrite: false,
    side: THREE.DoubleSide
  });

  const normalVec = new THREE.Vector3(baseNormal.x, baseNormal.y, baseNormal.z).normalize();
  const dummy = new THREE.Object3D();
  // Colocar ligeramente por encima de la superficie para evitar z-fighting
  const surfacePos = new THREE.Vector3(baseCoords.x, baseCoords.y, baseCoords.z).add(normalVec.clone().multiplyScalar(0.015));
  dummy.position.copy(surfacePos);
  dummy.lookAt(surfacePos.clone().add(normalVec));

  const mesh = new THREE.Mesh(highlightGeo, mat);
  mesh.name = `zone_highlight_${zone}`;
  mesh.position.copy(dummy.position);
  mesh.rotation.copy(dummy.rotation);
  mesh.renderOrder = 20;

  return mesh;
}

/**
 * Realiza un raycast sobre la superficie de la prenda para detectar zona y punto de impacto
 */
export function raycastGarmentSurface(
  garmentGroup: THREE.Group,
  raycaster: THREE.Raycaster
): {
  hitPoint: THREE.Vector3;
  hitNormal: THREE.Vector3;
  detectedZone: PrintZone3D;
  targetMesh: THREE.Mesh;
} | null {
  const candidateMeshes: THREE.Mesh[] = [];

  garmentGroup.traverse((child) => {
    if ((child as THREE.Mesh).isMesh && !child.userData?.isDecal && !child.name.startsWith('zone_highlight')) {
      candidateMeshes.push(child as THREE.Mesh);
    }
  });

  const intersects = raycaster.intersectObjects(candidateMeshes, false);
  if (intersects.length === 0) return null;

  const hit = intersects[0];
  const hitPoint = hit.point.clone();
  const face = hit.face;

  let hitNormal = new THREE.Vector3(0, 0, 1);
  if (face) {
    hitNormal = face.normal.clone().transformDirection(hit.object.matrixWorld).normalize();
  }

  const targetMesh = hit.object as THREE.Mesh;
  const partName = targetMesh.userData?.partId || targetMesh.name;

  let detectedZone: PrintZone3D = 'centro_frontal';

  if (partName.includes('manga_izquierda')) {
    detectedZone = 'manga_izquierda';
  } else if (partName.includes('manga_derecha')) {
    detectedZone = 'manga_derecha';
  } else if (partName.includes('capucha')) {
    detectedZone = 'capucha';
  } else if (partName.includes('bolsillo')) {
    detectedZone = 'bolsillos';
  } else if (partName.includes('corona_frontal') || partName.includes('visera')) {
    detectedZone = 'gorras';
  } else if (partName.includes('leg') || partName.includes('piernas') || partName.includes('pantalon') || partName.includes('short')) {
    detectedZone = 'pantalones';
  } else if (hitNormal.z < -0.4) {
    detectedZone = 'espalda';
  } else if (hitPoint.x > 0.18 && hitPoint.y > 1.35) {
    detectedZone = 'pecho_izquierdo';
  } else if (hitPoint.x < -0.18 && hitPoint.y > 1.35) {
    detectedZone = 'pecho_derecho';
  } else if (hitPoint.y < 0.6) {
    detectedZone = 'otras_superficies';
  }

  return {
    hitPoint,
    hitNormal,
    detectedZone,
    targetMesh
  };
}
