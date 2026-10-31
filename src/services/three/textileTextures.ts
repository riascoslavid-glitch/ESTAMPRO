import * as THREE from 'three';

/**
 * ESTAMPAPRO 360° - Generador Procedural de Texturas y Acabados Textiles
 * Crea mapas de normales, rugosidad y tramado textil 100% en código mediante HTML5 Canvas,
 * garantizando cero dependencias externas de archivos 404 y máximo rendimiento.
 */

export type TextileFinishType = 'algodon_jersey' | 'pique' | 'french_terry' | 'dry_fit_mesh' | 'twill_sarga';

export interface TextileMaterialConfig {
  id: TextileFinishType;
  name: string;
  description: string;
  roughness: number;
  metalness: number;
  sheen: number;
  clearcoat?: number;
  normalScale: number;
}

export const TEXTILE_FINISH_PRESETS: Record<TextileFinishType, TextileMaterialConfig> = {
  algodon_jersey: {
    id: 'algodon_jersey',
    name: 'Algodón Peinado 100% (Jersey 240g)',
    description: 'Tejido fino de punto jersey suave con micro-vellosidad natural mate.',
    roughness: 0.88,
    metalness: 0.02,
    sheen: 0.35,
    normalScale: 0.4
  },
  pique: {
    id: 'pique',
    name: 'Tejido Piqué Waffle (Polo 220g)',
    description: 'Trama geométrica en panal de abeja con relieve marcado y textura aireada.',
    roughness: 0.82,
    metalness: 0.01,
    sheen: 0.2,
    normalScale: 0.8
  },
  french_terry: {
    id: 'french_terry',
    name: 'French Terry Afelpado (400g)',
    description: 'Tejido pesado para hoodie con textura suave exterior y densidad térmica.',
    roughness: 0.92,
    metalness: 0.0,
    sheen: 0.45,
    normalScale: 0.6
  },
  dry_fit_mesh: {
    id: 'dry_fit_mesh',
    name: 'Poliéster Dry-Fit Micro-Perforado',
    description: 'Malla técnica deportiva con micro-poros de transpiración y ligero brillo.',
    roughness: 0.62,
    metalness: 0.08,
    sheen: 0.65,
    normalScale: 0.7
  },
  twill_sarga: {
    id: 'twill_sarga',
    name: 'Sarga de Algodón Estructurada (Twill)',
    description: 'Líneas diagonales resistentes típicas de gorras trucker y chaquetas.',
    roughness: 0.85,
    metalness: 0.02,
    sheen: 0.25,
    normalScale: 0.75
  }
};

const textureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Genera mapa de normales y microtrama para algodón Jersey
 */
export function createJerseyTexture(): THREE.CanvasTexture {
  const cacheKey = 'jersey_normal';
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey)!;

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Fondo neutral de mapa de normales (RGB: 128, 128, 255)
  ctx.fillStyle = 'rgb(128, 128, 255)';
  ctx.fillRect(0, 0, size, size);

  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;

  // Generar patrón de tejido entrelazado de punto jersey (v-shape loops)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const loopX = (x % 8) / 8;
      const loopY = (y % 12) / 12;

      // Cálculo de inclinación de la hebra (vector normal en espacio tangente)
      const nx = Math.sin(loopX * Math.PI * 2) * 25;
      const ny = Math.cos(loopY * Math.PI * 2) * 20;

      // Ruido sutil de microfibras textiles
      const noise = (Math.random() - 0.5) * 8;

      data[idx] = Math.max(0, Math.min(255, 128 + nx + noise)); // R = normal X
      data[idx + 1] = Math.max(0, Math.min(255, 128 + ny + noise)); // G = normal Y
      data[idx + 2] = 255; // B = normal Z (apuntando hacia afuera)
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(24, 24);
  texture.colorSpace = THREE.NoColorSpace; // Normal maps use linear space
  texture.needsUpdate = true;

  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Genera mapa de normales de Piqué (waffle honeycomb)
 */
export function createPiqueTexture(): THREE.CanvasTexture {
  const cacheKey = 'pique_normal';
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey)!;

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgb(128, 128, 255)';
  ctx.fillRect(0, 0, size, size);

  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const cellX = (x % 16) - 8;
      const cellY = (y % 16) - 8;
      const dist = Math.sqrt(cellX * cellX + cellY * cellY);

      const nx = (cellX / 8) * 35;
      const ny = (cellY / 8) * 35;
      const noise = (Math.random() - 0.5) * 6;

      data[idx] = Math.max(0, Math.min(255, 128 + nx + noise));
      data[idx + 1] = Math.max(0, Math.min(255, 128 + ny + noise));
      data[idx + 2] = Math.max(160, Math.min(255, 255 - dist * 4));
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(32, 32);
  texture.colorSpace = THREE.NoColorSpace;
  texture.needsUpdate = true;

  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Genera mapa de normales para Dry-Fit (micro-malla deportiva)
 */
export function createDryFitTexture(): THREE.CanvasTexture {
  const cacheKey = 'dry_fit_normal';
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey)!;

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgb(128, 128, 255)';
  ctx.fillRect(0, 0, size, size);

  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      // Perforación alterna hexagonal
      const stagger = Math.floor(y / 14) % 2 === 0 ? 0 : 7;
      const px = ((x + stagger) % 14) - 7;
      const py = (y % 14) - 7;
      const dist = Math.sqrt(px * px + py * py);

      let nx = 0;
      let ny = 0;
      let nz = 255;

      if (dist < 4.5) {
        // En el poro / hoyuelo
        nx = (px / 4.5) * -45;
        ny = (py / 4.5) * -45;
        nz = 200;
      }

      data[idx] = Math.max(0, Math.min(255, 128 + nx));
      data[idx + 1] = Math.max(0, Math.min(255, 128 + ny));
      data[idx + 2] = Math.max(0, Math.min(255, nz));
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(30, 30);
  texture.colorSpace = THREE.NoColorSpace;
  texture.needsUpdate = true;

  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Genera mapa de normales para Sarga / Twill (diagonal)
 */
export function createTwillTexture(): THREE.CanvasTexture {
  const cacheKey = 'twill_normal';
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey)!;

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgb(128, 128, 255)';
  ctx.fillRect(0, 0, size, size);

  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      // Líneas a 45 grados
      const diag = (x + y) % 12;
      const wave = Math.sin((diag / 12) * Math.PI * 2);
      const nx = wave * 30;
      const ny = wave * 30;

      data[idx] = Math.max(0, Math.min(255, 128 + nx));
      data[idx + 1] = Math.max(0, Math.min(255, 128 + ny));
      data[idx + 2] = 240;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(28, 28);
  texture.colorSpace = THREE.NoColorSpace;
  texture.needsUpdate = true;

  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Obtiene la textura adecuada según el acabado seleccionado
 */
export function getNormalTextureForFinish(finish: TextileFinishType): THREE.CanvasTexture {
  switch (finish) {
    case 'pique':
      return createPiqueTexture();
    case 'dry_fit_mesh':
      return createDryFitTexture();
    case 'twill_sarga':
      return createTwillTexture();
    case 'french_terry':
    case 'algodon_jersey':
    default:
      return createJerseyTexture();
  }
}
