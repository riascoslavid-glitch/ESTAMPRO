import * as THREE from 'three';
import {
  Garment3DModelType,
  buildGarment3D,
  createGarmentMaterial
} from './garmentGeometries';
import { TextileFinishType } from './textileTextures';

/**
 * ESTAMPAPRO 360° - Motor de Probador Virtual y Ajustes de Calce
 * Viste al avatar humano con prendas superiores (camisetas, polos, busos, hoodies, chaquetas)
 * y prendas inferiores (joggers, pantalones laborales, shorts deportivos)
 * aplicando multiplicadores de talla visual (S a XXL), tipo de fit (Slim, Regular, Oversize)
 * y longitud sin alterar las referencias de color ni las partes editables.
 */

export type VisualSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type VisualFit = 'slim' | 'regular' | 'oversize';
export type VisualLength = 'corto' | 'regular' | 'largo';

export type BottomGarmentType =
  | 'jogger_streetwear'
  | 'pantalon_laboral'
  | 'short_deportivo'
  | 'ninguno';

export interface FittingConfig {
  size: VisualSize;
  fit: VisualFit;
  length: VisualLength;
  bottomGarment: BottomGarmentType;
  bottomColorHex: string;
}

export const SIZE_SCALE_MULTIPLIERS: Record<VisualSize, { scaleX: number; scaleY: number; scaleZ: number }> = {
  S: { scaleX: 0.94, scaleY: 0.96, scaleZ: 0.94 },
  M: { scaleX: 1.0, scaleY: 1.0, scaleZ: 1.0 },
  L: { scaleX: 1.06, scaleY: 1.03, scaleZ: 1.06 },
  XL: { scaleX: 1.13, scaleY: 1.06, scaleZ: 1.13 },
  XXL: { scaleX: 1.21, scaleY: 1.09, scaleZ: 1.21 }
};

export const FIT_WIDTH_MULTIPLIERS: Record<VisualFit, number> = {
  slim: 0.94,
  regular: 1.0,
  oversize: 1.14
};

export const LENGTH_HEIGHT_MULTIPLIERS: Record<VisualLength, number> = {
  corto: 0.9,
  regular: 1.0,
  largo: 1.12
};

/**
 * Genera la prenda inferior complementaria para vestir las piernas del avatar
 */
export function buildBottomGarment(
  type: BottomGarmentType,
  colorHex: string = '#18181b',
  finish: TextileFinishType = 'french_terry'
): THREE.Group {
  const group = new THREE.Group();
  group.name = `bottom_${type}`;

  if (type === 'ninguno') return group;

  const mat = createGarmentMaterial(colorHex, finish);
  const detailMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.8
  });

  if (type === 'short_deportivo') {
    // --- SHORT DEPORTIVO ---
    // Cintura elástica
    const waistGeo = new THREE.CylinderGeometry(0.58, 0.62, 0.28, 24);
    waistGeo.scale(1.0, 1.0, 0.68);
    waistGeo.translate(0, 1.62, 0);
    const waist = new THREE.Mesh(waistGeo, mat);
    waist.castShadow = true;
    group.add(waist);

    // Pernera izquierda (hasta media rodilla)
    const leftLegGeo = new THREE.CylinderGeometry(0.32, 0.3, 0.72, 20);
    leftLegGeo.translate(-0.35, 1.22, 0);
    const leftLeg = new THREE.Mesh(leftLegGeo, mat);
    leftLeg.castShadow = true;
    group.add(leftLeg);

    // Pernera derecha
    const rightLegGeo = new THREE.CylinderGeometry(0.32, 0.3, 0.72, 20);
    rightLegGeo.translate(0.35, 1.22, 0);
    const rightLeg = new THREE.Mesh(rightLegGeo, mat);
    rightLeg.castShadow = true;
    group.add(rightLeg);

    return group;
  }

  // --- PANTALÓN LARGO / JOGGER STREETWEAR / LABORAL ---
  // Cintura
  const waistGeo = new THREE.CylinderGeometry(0.58, 0.62, 0.35, 24);
  waistGeo.scale(1.0, 1.0, 0.68);
  waistGeo.translate(0, 1.62, 0);
  const waist = new THREE.Mesh(waistGeo, mat);
  waist.castShadow = true;
  group.add(waist);

  // Pernera izquierda completa
  const legRadiusTop = type === 'pantalon_laboral' ? 0.34 : 0.32;
  const legRadiusBottom = type === 'jogger_streetwear' ? 0.22 : 0.28;

  const leftLegGeo = new THREE.CylinderGeometry(legRadiusTop, legRadiusBottom, 1.5, 20);
  leftLegGeo.translate(-0.35, 0.85, 0);
  const leftLeg = new THREE.Mesh(leftLegGeo, mat);
  leftLeg.castShadow = true;
  group.add(leftLeg);

  // Pernera derecha completa
  const rightLegGeo = new THREE.CylinderGeometry(legRadiusTop, legRadiusBottom, 1.5, 20);
  rightLegGeo.translate(0.35, 0.85, 0);
  const rightLeg = new THREE.Mesh(rightLegGeo, mat);
  rightLeg.castShadow = true;
  group.add(rightLeg);

  // Si es jogger, agregar puños elásticos inferiores
  if (type === 'jogger_streetwear') {
    const cuffGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.16, 20);
    cuffGeo.translate(-0.35, 0.16, 0);
    const leftCuff = new THREE.Mesh(cuffGeo, detailMat);
    group.add(leftCuff);

    const rightCuff = new THREE.Mesh(cuffGeo.clone().translate(0.7, 0, 0), detailMat);
    group.add(rightCuff);
  }

  // Si es pantalón laboral, agregar bolsillos tipo cargo en costados
  if (type === 'pantalon_laboral') {
    const pocketGeo = new THREE.BoxGeometry(0.12, 0.38, 0.26);
    pocketGeo.translate(-0.66, 0.95, 0);
    const leftCargo = new THREE.Mesh(pocketGeo, mat);
    group.add(leftCargo);

    const rightCargo = new THREE.Mesh(pocketGeo.clone().translate(1.32, 0, 0), mat);
    group.add(rightCargo);
  }

  return group;
}

/**
 * Genera el conjunto de prenda superior ajustada anatómicamente a los parámetros de fitting
 */
export function buildFittedTopGarment(
  modelType: Garment3DModelType,
  partColors: Record<string, string>,
  finish: TextileFinishType,
  fitting: FittingConfig
): THREE.Group {
  // Construir prenda base
  const topGroup = buildGarment3D(modelType, partColors, finish);

  // Aplicar transformaciones de talla, fit y longitud
  const sizeFactors = SIZE_SCALE_MULTIPLIERS[fitting.size];
  const fitWidth = FIT_WIDTH_MULTIPLIERS[fitting.fit];
  const lengthHeight = LENGTH_HEIGHT_MULTIPLIERS[fitting.length];

  const finalScaleX = sizeFactors.scaleX * fitWidth;
  const finalScaleY = sizeFactors.scaleY * lengthHeight;
  const finalScaleZ = sizeFactors.scaleZ * fitWidth;

  // Si es gorra, posicionar en la cabeza
  if (modelType === 'gorra_trucker') {
    topGroup.scale.set(sizeFactors.scaleX, sizeFactors.scaleY, sizeFactors.scaleZ);
    topGroup.position.set(0, 2.7, 0);
  } else if (
    modelType === 'pantalon_cargo' ||
    modelType === 'pantaloneta_playera' ||
    modelType === 'short_deportivo' ||
    modelType === 'overol_laboral'
  ) {
    topGroup.scale.set(sizeFactors.scaleX, sizeFactors.scaleY, sizeFactors.scaleZ);
    topGroup.position.set(0, 0.0, 0);
  } else if (modelType === 'bolso_tote' || modelType === 'mochila_morral') {
    topGroup.scale.set(sizeFactors.scaleX, sizeFactors.scaleY, sizeFactors.scaleZ);
    topGroup.position.set(0.65, 0.4, 0.2);
  } else if (modelType === 'cojin_cuadrado' || modelType === 'toalla_playera') {
    topGroup.scale.set(sizeFactors.scaleX, sizeFactors.scaleY, sizeFactors.scaleZ);
    topGroup.position.set(0, 0.3, 0.4);
  } else {
    topGroup.scale.set(finalScaleX, finalScaleY, finalScaleZ);
    // Posicionar a la altura clavicular del avatar
    topGroup.position.set(0, 0.05, 0);
  }

  return topGroup;
}
