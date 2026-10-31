import * as THREE from 'three';

/**
 * ESTAMPAPRO 360° - Generador de Modelos Humanos y Maniquíes 3D
 * Avatares procedurales con proporciones anatómicas estilizadas,
 * ideales para probador virtual de prendas textiles (hombres, mujeres y maniquíes de sastre).
 */

export type HumanAvatarType =
  | 'masculino_atletico'
  | 'femenino_atletico'
  | 'masculino_streetwear'
  | 'maniqui_sastre';

export interface AvatarDefinition {
  id: HumanAvatarType;
  name: string;
  genderLabel: string;
  heightCm: number;
  chestCm: number;
  waistCm: number;
  description: string;
  defaultSkinHex: string;
}

export const AVATAR_DEFINITIONS: Record<HumanAvatarType, AvatarDefinition> = {
  masculino_atletico: {
    id: 'masculino_atletico',
    name: 'Avatar Masculino Atlético',
    genderLabel: 'Hombre (1.85m)',
    heightCm: 185,
    chestCm: 102,
    waistCm: 82,
    description: 'Proporciones atléticas de corte moderno para poleras, hoodies y ropa deportiva.',
    defaultSkinHex: '#e2cfb7'
  },
  femenino_atletico: {
    id: 'femenino_atletico',
    name: 'Avatar Femenino Atlético',
    genderLabel: 'Mujer (1.72m)',
    heightCm: 172,
    chestCm: 90,
    waistCm: 68,
    description: 'Silueta estilizada equilibrada para prendas streetwear unisex y cortes entallados.',
    defaultSkinHex: '#ebd9cb'
  },
  masculino_streetwear: {
    id: 'masculino_streetwear',
    name: 'Avatar Masculino Streetwear',
    genderLabel: 'Hombre Boxy (1.80m)',
    heightCm: 180,
    chestCm: 108,
    waistCm: 88,
    description: 'Complexión robusta ideal para evaluar prendas oversize, hombros caídos y siluetas urbanas.',
    defaultSkinHex: '#c69c72'
  },
  maniqui_sastre: {
    id: 'maniqui_sastre',
    name: 'Maniquí Técnico de Taller',
    genderLabel: 'Busto de Sastre Profesional',
    heightCm: 165,
    chestCm: 98,
    waistCm: 80,
    description: 'Maniquí de costura tapizado en lino crudo con soporte trípode de madera y herrajes de acero.',
    defaultSkinHex: '#e5dec9'
  }
};

export const SKIN_TONE_PRESETS = [
  { name: 'Marfil Estudio', hex: '#f0e6d6' },
  { name: 'Piel Clara Cálida', hex: '#ebd9cb' },
  { name: 'Bronceado Natural', hex: '#d4aa7d' },
  { name: 'Trigueño / Café', hex: '#a67244' },
  { name: 'Ébano Profundo', hex: '#4a3325' },
  { name: 'Maniquí Carbono Mate', hex: '#27272a' },
  { name: 'Lino Técnico Sastre', hex: '#dcd3b8' }
];

/**
 * Crea el material de la piel / superficie del maniquí con acabado mate suave PBR
 */
export function createAvatarMaterial(colorHex: string, isTailorForm = false): THREE.MeshStandardMaterial {
  if (isTailorForm) {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      roughness: 0.95,
      metalness: 0.0,
      bumpScale: 0.02
    });
  }

  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(colorHex),
    roughness: 0.65,
    metalness: 0.05,
    side: THREE.FrontSide
  });
}

/**
 * Construye el cuerpo del avatar humano o maniquí
 */
export function buildHumanAvatar(
  avatarType: HumanAvatarType,
  skinColorHex: string = '#e2cfb7'
): THREE.Group {
  const group = new THREE.Group();
  group.name = `avatar_${avatarType}`;

  const isTailor = avatarType === 'maniqui_sastre';
  const isFemale = avatarType === 'femenino_atletico';
  const isStreetwear = avatarType === 'masculino_streetwear';

  const skinMat = createAvatarMaterial(skinColorHex, isTailor);

  // Material para calzado / base
  const darkDetailMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.4,
    metalness: 0.1
  });

  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x854d0e,
    roughness: 0.7,
    metalness: 0.05
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xd4d4d8,
    roughness: 0.2,
    metalness: 0.9
  });

  if (isTailor) {
    // --- MANIQUÍ TÉCNICO DE SASTRE ---
    // 1. Torso de lino
    const torsoGeo = new THREE.CylinderGeometry(0.72, 0.65, 2.1, 24);
    torsoGeo.scale(1.0, 1.0, 0.62);
    torsoGeo.translate(0, 1.7, 0);
    const torsoMesh = new THREE.Mesh(torsoGeo, skinMat);
    torsoMesh.castShadow = true;
    torsoMesh.receiveShadow = true;
    group.add(torsoMesh);

    // 2. Cuello y remate de madera superior
    const neckGeo = new THREE.CylinderGeometry(0.24, 0.32, 0.45, 20);
    neckGeo.translate(0, 2.85, 0);
    const neckMesh = new THREE.Mesh(neckGeo, skinMat);
    group.add(neckMesh);

    const capGeo = new THREE.SphereGeometry(0.18, 16, 12);
    capGeo.scale(1.0, 0.5, 1.0);
    capGeo.translate(0, 3.1, 0);
    const capMesh = new THREE.Mesh(capGeo, woodMat);
    group.add(capMesh);

    // 3. Poste de soporte metálico
    const poleGeo = new THREE.CylinderGeometry(0.045, 0.045, 1.6, 16);
    poleGeo.translate(0, 0.8, 0);
    const poleMesh = new THREE.Mesh(poleGeo, chromeMat);
    poleMesh.castShadow = true;
    group.add(poleMesh);

    // 4. Trípode de soporte en madera
    const baseGeo = new THREE.CylinderGeometry(0.45, 0.55, 0.08, 24);
    baseGeo.translate(0, 0.04, 0);
    const baseMesh = new THREE.Mesh(baseGeo, woodMat);
    baseMesh.receiveShadow = true;
    group.add(baseMesh);

    return group;
  }

  // --- AVATARES HUMANOS REALISTAS (MASCULINO, FEMENINO, STREETWEAR) ---

  // Parámetros antropométricos según tipo
  const shoulderWidth = isFemale ? 0.85 : isStreetwear ? 1.25 : 1.1;
  const chestDepth = isFemale ? 0.65 : isStreetwear ? 0.72 : 0.62;
  const waistRadius = isFemale ? 0.42 : isStreetwear ? 0.58 : 0.52;
  const hipRadius = isFemale ? 0.62 : isStreetwear ? 0.62 : 0.56;
  const headScaleY = isFemale ? 0.95 : 1.0;

  // 1. Cabeza y Rostro Estilizado Maniquí
  const headGeo = new THREE.SphereGeometry(0.32, 28, 20);
  headGeo.scale(0.85, 1.15 * headScaleY, 0.95);
  headGeo.translate(0, 3.12, 0);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headMesh.castShadow = true;
  group.add(headMesh);

  // Cuello
  const neckGeo = new THREE.CylinderGeometry(0.19, 0.25, 0.42, 20);
  neckGeo.translate(0, 2.7, 0);
  const neckMesh = new THREE.Mesh(neckGeo, skinMat);
  neckMesh.castShadow = true;
  group.add(neckMesh);

  // 2. Torso Humano Anatómico
  // Pecho y Espalda
  const chestGeo = new THREE.CylinderGeometry(shoulderWidth * 0.72, waistRadius, 1.1, 24);
  chestGeo.scale(1.0, 1.0, chestDepth);
  chestGeo.translate(0, 2.1, 0);
  const chestMesh = new THREE.Mesh(chestGeo, skinMat);
  chestMesh.castShadow = true;
  chestMesh.receiveShadow = true;
  group.add(chestMesh);

  // Hombros Claviculares
  const leftShoulderGeo = new THREE.SphereGeometry(0.24, 16, 14);
  leftShoulderGeo.translate(-shoulderWidth * 0.75, 2.45, 0);
  const leftShoulder = new THREE.Mesh(leftShoulderGeo, skinMat);
  group.add(leftShoulder);

  const rightShoulderGeo = new THREE.SphereGeometry(0.24, 16, 14);
  rightShoulderGeo.translate(shoulderWidth * 0.75, 2.45, 0);
  const rightShoulder = new THREE.Mesh(rightShoulderGeo, skinMat);
  group.add(rightShoulder);

  // Abdomen y Cadera
  const abdomenGeo = new THREE.CylinderGeometry(waistRadius, hipRadius, 0.75, 24);
  abdomenGeo.scale(1.0, 1.0, chestDepth * 0.95);
  abdomenGeo.translate(0, 1.35, 0);
  const abdomenMesh = new THREE.Mesh(abdomenGeo, skinMat);
  abdomenMesh.castShadow = true;
  group.add(abdomenMesh);

  // 3. Brazos y Manos
  // Brazo Izquierdo
  const armRadiusUpper = isFemale ? 0.14 : isStreetwear ? 0.2 : 0.17;
  const leftArmGeo = new THREE.CylinderGeometry(armRadiusUpper, armRadiusUpper * 0.8, 0.95, 16);
  leftArmGeo.rotateZ(0.12);
  leftArmGeo.translate(-shoulderWidth * 0.85, 1.95, 0);
  const leftArmMesh = new THREE.Mesh(leftArmGeo, skinMat);
  leftArmMesh.castShadow = true;
  group.add(leftArmMesh);

  // Antebrazo Izquierdo
  const leftForearmGeo = new THREE.CylinderGeometry(armRadiusUpper * 0.8, armRadiusUpper * 0.65, 0.85, 16);
  leftForearmGeo.rotateZ(0.08);
  leftForearmGeo.translate(-shoulderWidth * 0.92, 1.15, 0.05);
  const leftForearmMesh = new THREE.Mesh(leftForearmGeo, skinMat);
  leftForearmMesh.castShadow = true;
  group.add(leftForearmMesh);

  // Mano Izquierda
  const handGeo = new THREE.BoxGeometry(0.12, 0.24, 0.08);
  handGeo.translate(-shoulderWidth * 0.96, 0.65, 0.08);
  const leftHand = new THREE.Mesh(handGeo, skinMat);
  group.add(leftHand);

  // Brazo Derecho
  const rightArmGeo = new THREE.CylinderGeometry(armRadiusUpper, armRadiusUpper * 0.8, 0.95, 16);
  rightArmGeo.rotateZ(-0.12);
  rightArmGeo.translate(shoulderWidth * 0.85, 1.95, 0);
  const rightArmMesh = new THREE.Mesh(rightArmGeo, skinMat);
  rightArmMesh.castShadow = true;
  group.add(rightArmMesh);

  // Antebrazo Derecho
  const rightForearmGeo = new THREE.CylinderGeometry(armRadiusUpper * 0.8, armRadiusUpper * 0.65, 0.85, 16);
  rightForearmGeo.rotateZ(-0.08);
  rightForearmGeo.translate(shoulderWidth * 0.92, 1.15, 0.05);
  const rightForearmMesh = new THREE.Mesh(rightForearmGeo, skinMat);
  rightForearmMesh.castShadow = true;
  group.add(rightForearmMesh);

  // Mano Derecha
  const rightHand = new THREE.Mesh(handGeo.clone().translate(shoulderWidth * 1.92, 0, 0), skinMat);
  group.add(rightHand);

  // 4. Piernas y Calzado Urbano (Sneakers modernos de exhibición)
  const legRadius = isFemale ? 0.22 : isStreetwear ? 0.28 : 0.25;

  // Pierna Izquierda
  const leftLegGeo = new THREE.CylinderGeometry(legRadius, legRadius * 0.72, 1.85, 20);
  leftLegGeo.translate(-0.35, 0.95, 0);
  const leftLegMesh = new THREE.Mesh(leftLegGeo, skinMat);
  leftLegMesh.castShadow = true;
  leftLegMesh.receiveShadow = true;
  group.add(leftLegMesh);

  // Pierna Derecha
  const rightLegGeo = new THREE.CylinderGeometry(legRadius, legRadius * 0.72, 1.85, 20);
  rightLegGeo.translate(0.35, 0.95, 0);
  const rightLegMesh = new THREE.Mesh(rightLegGeo, skinMat);
  rightLegMesh.castShadow = true;
  rightLegMesh.receiveShadow = true;
  group.add(rightLegMesh);

  // Sneaker Izquierdo
  const sneakerGeo = new THREE.BoxGeometry(0.32, 0.16, 0.65);
  sneakerGeo.translate(-0.35, 0.08, 0.12);
  const leftSneaker = new THREE.Mesh(sneakerGeo, darkDetailMat);
  leftSneaker.castShadow = true;
  group.add(leftSneaker);

  // Sneaker Derecho
  const rightSneaker = new THREE.Mesh(sneakerGeo.clone().translate(0.7, 0, 0), darkDetailMat);
  rightSneaker.castShadow = true;
  group.add(rightSneaker);

  return group;
}
