/**
 * ESTAMPAPRO 360° - Motor de Procesamiento de Imagen en Canvas HTML5
 * Algoritmos reales de manipulación de píxeles, convolución, colorimetría y preparación para imprenta textil.
 */

import {
  ImageAdjustments,
  CropRect,
  ColorSwapConfig,
  TransparencyWandConfig,
  TextileEffectConfig,
  TextileFilterPreset,
  PrintDpiAnalysis
} from '../../types/imageEditor';

// Utilidad para convertir HEX a RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

// Convertir RGB a HEX
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(c)));
    return clamped.toString(16).padStart(2, '0');
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Convertir RGB a HSL
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

// Convertir HSL a RGB
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h = (h % 360 + 360) % 360 / 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

// Distancia euclidiana entre dos colores RGB
export function colorDistance(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  return Math.sqrt(
    Math.pow(r1 - r2, 2) * 0.299 +
    Math.pow(g1 - g2, 2) * 0.587 +
    Math.pow(b1 - b2, 2) * 0.114
  );
}

/**
 * Crea un canvas duplicado independiente
 */
export function cloneCanvas(source: HTMLCanvasElement): HTMLCanvasElement {
  const clone = document.createElement('canvas');
  clone.width = source.width;
  clone.height = source.height;
  const ctx = clone.getContext('2d')!;
  ctx.drawImage(source, 0, 0);
  return clone;
}

/**
 * Carga una imagen (URL o DataURL) y la dibuja en un canvas
 */
export function loadImageToCanvas(src: string): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      resolve(canvas);
    };
    img.onerror = (err) => reject(new Error('No se pudo cargar la imagen: ' + err));
    img.src = src;
  });
}

/**
 * 2. RECORTAR (Crop con coordenadas relativas porcentuales o píxeles)
 */
export function cropCanvas(
  source: HTMLCanvasElement,
  rect: CropRect
): HTMLCanvasElement {
  const startX = Math.round((rect.x / 100) * source.width);
  const startY = Math.round((rect.y / 100) * source.height);
  const width = Math.max(1, Math.round((rect.width / 100) * source.width));
  const height = Math.max(1, Math.round((rect.height / 100) * source.height));

  const cropped = document.createElement('canvas');
  cropped.width = width;
  cropped.height = height;
  const ctx = cropped.getContext('2d')!;

  ctx.drawImage(source, startX, startY, width, height, 0, 0, width, height);
  return cropped;
}

/**
 * 3. REDIMENSIONAR (Resize con remuestreo de alta calidad)
 */
export function resizeCanvas(
  source: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number,
  interpolation: 'bicubic' | 'smooth' | 'pixelated' = 'bicubic'
): HTMLCanvasElement {
  const dest = document.createElement('canvas');
  dest.width = Math.max(1, Math.round(targetWidth));
  dest.height = Math.max(1, Math.round(targetHeight));
  const ctx = dest.getContext('2d')!;

  if (interpolation === 'pixelated') {
    ctx.imageSmoothingEnabled = false;
  } else {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  }

  // Reducción o ampliación escalonada si la relación es mayor a 2x para evitar artefactos
  if (dest.width < source.width * 0.5 && interpolation !== 'pixelated') {
    let curW = source.width;
    let curH = source.height;
    let tempCanvas = source;

    while (curW * 0.5 > dest.width) {
      curW = Math.round(curW * 0.5);
      curH = Math.round(curH * 0.5);
      const stepCanvas = document.createElement('canvas');
      stepCanvas.width = curW;
      stepCanvas.height = curH;
      const stepCtx = stepCanvas.getContext('2d')!;
      stepCtx.imageSmoothingEnabled = true;
      stepCtx.imageSmoothingQuality = 'high';
      stepCtx.drawImage(tempCanvas, 0, 0, curW, curH);
      tempCanvas = stepCanvas;
    }

    ctx.drawImage(tempCanvas, 0, 0, dest.width, dest.height);
  } else {
    ctx.drawImage(source, 0, 0, dest.width, dest.height);
  }

  return dest;
}

/**
 * 4. ROTAR Y VOLTEAR (Rotación libre por ángulos arbitrarios o 90/180/270 y volteo H/V)
 */
export function rotateAndFlipCanvas(
  source: HTMLCanvasElement,
  angleDegrees: number,
  flipH: boolean = false,
  flipV: boolean = false
): HTMLCanvasElement {
  const rad = (angleDegrees * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));

  const newWidth = Math.round(source.width * cos + source.height * sin);
  const newHeight = Math.round(source.width * sin + source.height * cos);

  const dest = document.createElement('canvas');
  dest.width = Math.max(1, newWidth);
  dest.height = Math.max(1, newHeight);
  const ctx = dest.getContext('2d')!;

  ctx.translate(newWidth / 2, newHeight / 2);
  ctx.rotate(rad);
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
  ctx.drawImage(source, -source.width / 2, -source.height / 2);

  return dest;
}

/**
 * 7-10. AJUSTES FOTOGRÁFICOS REALES (Brillo, Contraste, Saturación, Nitidez, Tono, Temp, Opacidad)
 */
export function applyAdjustments(
  source: HTMLCanvasElement,
  adj: ImageAdjustments
): HTMLCanvasElement {
  const dest = document.createElement('canvas');
  dest.width = source.width;
  dest.height = source.height;
  const ctx = dest.getContext('2d')!;

  // 1. Dibujar imagen inicial
  ctx.drawImage(source, 0, 0);

  // 2. Extraer buffer de píxeles ImageData
  const imgData = ctx.getImageData(0, 0, dest.width, dest.height);
  const data = imgData.data;
  const len = data.length;

  // Factores precalculados
  const brightnessOffset = (adj.brightness / 100) * 128; // -128 a +128
  const contrastFactor = (259 * (adj.contrast + 255)) / (255 * (259 - adj.contrast)); // Fórmula estándar
  const saturationRatio = adj.saturation / 100; // 0 a 2
  const tempOffset = (adj.temperature / 100) * 35; // Cálido suma R resta B, frío al revés
  const opacityFactor = adj.opacity / 100;

  for (let i = 0; i < len; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];
    const a = data[i + 3];

    if (a === 0) continue; // Píxel ya transparente

    // Brillo
    r += brightnessOffset;
    g += brightnessOffset;
    b += brightnessOffset;

    // Contraste
    r = contrastFactor * (r - 128) + 128;
    g = contrastFactor * (g - 128) + 128;
    b = contrastFactor * (b - 128) + 128;

    // Temperatura de color
    r += tempOffset;
    b -= tempOffset;

    // Saturación (mediante luma ITU-R BT.709)
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    r = luma + saturationRatio * (r - luma);
    g = luma + saturationRatio * (g - luma);
    b = luma + saturationRatio * (b - luma);

    // Desplazamiento de Tono (Hue Shift) si aplica
    if (adj.hue !== 0) {
      const hsl = rgbToHsl(Math.max(0, Math.min(255, r)), Math.max(0, Math.min(255, g)), Math.max(0, Math.min(255, b)));
      hsl.h = (hsl.h + adj.hue + 360) % 360;
      const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
      r = rgb.r;
      g = rgb.g;
      b = rgb.b;
    }

    data[i] = Math.max(0, Math.min(255, Math.round(r)));
    data[i + 1] = Math.max(0, Math.min(255, Math.round(g)));
    data[i + 2] = Math.max(0, Math.min(255, Math.round(b)));
    data[i + 3] = Math.max(0, Math.min(255, Math.round(a * opacityFactor)));
  }

  ctx.putImageData(imgData, 0, 0);

  // 10. NITIDEZ MEDIANTE MATRIZ DE CONVOLUCIÓN REAL (Unsharp Mask)
  if (adj.sharpness > 0) {
    const sharpened = applyConvolutionSharpness(dest, adj.sharpness / 100);
    return sharpened;
  }

  return dest;
}

/**
 * Matriz de Convolución 3x3 de Nitidez (Laplaciana / Unsharp Mask)
 */
function applyConvolutionSharpness(canvas: HTMLCanvasElement, intensity: number): HTMLCanvasElement {
  const width = canvas.width;
  const height = canvas.height;
  const ctx = canvas.getContext('2d')!;
  const srcData = ctx.getImageData(0, 0, width, height);
  const src = srcData.data;

  const destCanvas = document.createElement('canvas');
  destCanvas.width = width;
  destCanvas.height = height;
  const destCtx = destCanvas.getContext('2d')!;
  const destData = destCtx.createImageData(width, height);
  const dst = destData.data;

  // Matriz de nitidez ponderada por intensidad:
  // [ 0, -k, 0 ]
  // [ -k, 1 + 4k, -k ]
  // [ 0, -k, 0 ]
  const k = intensity * 0.9;
  const centerWeight = 1 + 4 * k;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;

      for (let c = 0; c < 3; c++) {
        const top = src[((y - 1) * width + x) * 4 + c];
        const bottom = src[((y + 1) * width + x) * 4 + c];
        const left = src[(y * width + (x - 1)) * 4 + c];
        const right = src[(y * width + (x + 1)) * 4 + c];
        const center = src[idx + c];

        const val = center * centerWeight - (top + bottom + left + right) * k;
        dst[idx + c] = Math.max(0, Math.min(255, Math.round(val)));
      }
      dst[idx + 3] = src[idx + 3]; // Conservar alfa intacto
    }
  }

  // Copiar bordes exteriores de 1px
  for (let x = 0; x < width; x++) {
    for (let c = 0; c < 4; c++) {
      dst[x * 4 + c] = src[x * 4 + c];
      dst[((height - 1) * width + x) * 4 + c] = src[((height - 1) * width + x) * 4 + c];
    }
  }
  for (let y = 0; y < height; y++) {
    for (let c = 0; c < 4; c++) {
      dst[(y * width) * 4 + c] = src[(y * width) * 4 + c];
      dst[(y * width + (width - 1)) * 4 + c] = src[(y * width + (width - 1)) * 4 + c];
    }
  }

  destCtx.putImageData(destData, 0, 0);
  return destCanvas;
}

/**
 * 11. CAMBIAR COLORES (Reemplazo selectivo preservando luminosidad y sombreado textil)
 */
export function replaceColorInCanvas(
  source: HTMLCanvasElement,
  config: ColorSwapConfig
): HTMLCanvasElement {
  const dest = cloneCanvas(source);
  const ctx = dest.getContext('2d')!;
  const imgData = ctx.getImageData(0, 0, dest.width, dest.height);
  const data = imgData.data;

  const srcRgb = hexToRgb(config.sourceColor);
  const targetRgb = hexToRgb(config.targetColor);
  const targetHsl = rgbToHsl(targetRgb.r, targetRgb.g, targetRgb.b);

  const maxDist = (config.tolerance / 100) * 180; // Tolerancia calibrada

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < 10) continue;

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const dist = colorDistance(r, g, b, srcRgb.r, srcRgb.g, srcRgb.b);

    if (dist <= maxDist) {
      // Factor de cercanía suave para bordes anti-aliased
      const factor = 1 - dist / maxDist;

      if (config.preserveLuminosity) {
        const curHsl = rgbToHsl(r, g, b);
        // Mantener luminosidad original pero adoptar el tono y saturación del nuevo color
        const newRgb = hslToRgb(targetHsl.h, targetHsl.s, curHsl.l);
        data[i] = Math.round(r * (1 - factor) + newRgb.r * factor);
        data[i + 1] = Math.round(g * (1 - factor) + newRgb.g * factor);
        data[i + 2] = Math.round(b * (1 - factor) + newRgb.b * factor);
      } else {
        data[i] = Math.round(r * (1 - factor) + targetRgb.r * factor);
        data[i + 1] = Math.round(g * (1 - factor) + targetRgb.g * factor);
        data[i + 2] = Math.round(b * (1 - factor) + targetRgb.b * factor);
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return dest;
}

/**
 * 12. CREAR TRANSPARENCIAS (Varita mágica / Eliminación de color con canal alfa suave)
 */
export function applyTransparencyWand(
  source: HTMLCanvasElement,
  config: TransparencyWandConfig
): HTMLCanvasElement {
  const dest = cloneCanvas(source);
  const ctx = dest.getContext('2d')!;
  const imgData = ctx.getImageData(0, 0, dest.width, dest.height);
  const data = imgData.data;

  const targetRgb = hexToRgb(config.targetColor);
  const maxDist = (config.tolerance / 100) * 160;
  const featherRange = Math.max(1, config.feather * 4);

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a === 0) continue;

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const dist = colorDistance(r, g, b, targetRgb.r, targetRgb.g, targetRgb.b);

    if (dist <= maxDist) {
      data[i + 3] = 0; // Transparente total
    } else if (dist < maxDist + featherRange) {
      // Suavizado anti-fringe en los bordes
      const ratio = (dist - maxDist) / featherRange;
      data[i + 3] = Math.min(data[i + 3], Math.round(255 * ratio));
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return dest;
}

/**
 * 5. ELIMINAR FONDOS MEDIANTE ALGORITMO INTELIGENTE / CROMA PERIMETRAL
 * Detecta colores periféricos de esquinas y bordes, realiza flood fill reteniendo el arte central.
 */
export function removeBackgroundSmart(
  source: HTMLCanvasElement,
  tolerance: number = 30,
  edgeFeather: number = 2
): HTMLCanvasElement {
  const width = source.width;
  const height = source.height;
  const dest = cloneCanvas(source);
  const ctx = dest.getContext('2d')!;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // 1. Muestrear esquinas y perímetro para detectar color de fondo primario
  const corners = [
    { x: 0, y: 0 },
    { x: width - 1, y: 0 },
    { x: 0, y: height - 1 },
    { x: width - 1, y: height - 1 },
    { x: Math.floor(width / 2), y: 0 },
    { x: Math.floor(width / 2), y: height - 1 },
    { x: 0, y: Math.floor(height / 2) },
    { x: width - 1, y: Math.floor(height / 2) }
  ];

  let sumR = 0, sumG = 0, sumB = 0, count = 0;
  for (const c of corners) {
    const idx = (c.y * width + c.x) * 4;
    sumR += data[idx];
    sumG += data[idx + 1];
    sumB += data[idx + 2];
    count++;
  }
  const bgR = Math.round(sumR / count);
  const bgG = Math.round(sumG / count);
  const bgB = Math.round(sumB / count);

  const maxDist = (tolerance / 100) * 160;

  // Mapa de píxeles visitados por el flood fill exterior
  const visited = new Uint8Array(width * height);
  const queue: number[] = [];

  // Agregar todos los píxeles perimetrales a la cola si coinciden con el fondo
  for (let x = 0; x < width; x++) {
    queue.push(0 * width + x);
    queue.push((height - 1) * width + x);
  }
  for (let y = 1; y < height - 1; y++) {
    queue.push(y * width + 0);
    queue.push(y * width + (width - 1));
  }

  let head = 0;
  while (head < queue.length) {
    const pos = queue[head++];
    if (visited[pos]) continue;

    const px = pos % width;
    const py = Math.floor(pos / width);
    const idx = pos * 4;

    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    const dist = colorDistance(r, g, b, bgR, bgG, bgB);

    if (dist <= maxDist) {
      visited[pos] = 1;
      data[idx + 3] = 0; // Hacer transparente

      // Revisar vecinos 4-conectados
      if (px > 0 && !visited[pos - 1]) queue.push(pos - 1);
      if (px < width - 1 && !visited[pos + 1]) queue.push(pos + 1);
      if (py > 0 && !visited[pos - width]) queue.push(pos - width);
      if (py < height - 1 && !visited[pos + width]) queue.push(pos + width);
    }
  }

  // Desflecado suave (Edge Defringing / Feathering) en bordes
  if (edgeFeather > 0) {
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const p = y * width + x;
        const idx = p * 4;

        if (data[idx + 3] > 0) {
          // Si tiene vecinos transparentes
          const hasTransNeighbor =
            data[idx - 4 + 3] === 0 ||
            data[idx + 4 + 3] === 0 ||
            data[idx - width * 4 + 3] === 0 ||
            data[idx + width * 4 + 3] === 0;

          if (hasTransNeighbor) {
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const dist = colorDistance(r, g, b, bgR, bgG, bgB);
            if (dist < maxDist * 1.35) {
              data[idx + 3] = Math.round(data[idx + 3] * 0.45);
            }
          }
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return dest;
}

/**
 * 13. ELIMINAR ELEMENTOS / BORRADOR MÁGICO (Inpainting local por síntesis y difusión)
 */
export function inpaintMask(
  source: HTMLCanvasElement,
  maskCanvas: HTMLCanvasElement
): HTMLCanvasElement {
  const width = source.width;
  const height = source.height;
  const dest = cloneCanvas(source);
  const ctx = dest.getContext('2d')!;

  const srcData = ctx.getImageData(0, 0, width, height);
  const src = srcData.data;

  // Extraer datos de la máscara (donde la máscara tiene alfa o canal rojo)
  const maskCtx = maskCanvas.getContext('2d')!;
  const maskData = maskCtx.getImageData(0, 0, width, height).data;

  // Crear mapa binario de máscara
  const maskMap = new Uint8Array(width * height);
  let maskCount = 0;
  for (let i = 0; i < width * height; i++) {
    if (maskData[i * 4 + 3] > 30) {
      maskMap[i] = 1;
      maskCount++;
    }
  }

  if (maskCount === 0) return dest;

  // Difusión / Navier-Stokes simplificada iterativa desde bordes
  const iterations = Math.min(25, Math.max(10, Math.floor(Math.sqrt(maskCount) / 2)));
  const radius = 3;

  for (let iter = 0; iter < iterations; iter++) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const p = y * width + x;
        if (maskMap[p] !== 1) continue;

        let sumR = 0, sumG = 0, sumB = 0, sumWeight = 0;

        for (let dy = -radius; dy <= radius; dy++) {
          const ny = y + dy;
          if (ny < 0 || ny >= height) continue;

          for (let dx = -radius; dx <= radius; dx++) {
            const nx = x + dx;
            if (nx < 0 || nx >= width) continue;

            const np = ny * width + nx;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > radius || dist === 0) continue;

            const weight = 1 / (dist + 0.1);

            // Si es un pixel sano o ya rellenado en iteración previa
            const nIdx = np * 4;
            sumR += src[nIdx] * weight;
            sumG += src[nIdx + 1] * weight;
            sumB += src[nIdx + 2] * weight;
            sumWeight += weight;
          }
        }

        if (sumWeight > 0) {
          const idx = p * 4;
          src[idx] = Math.round(sumR / sumWeight);
          src[idx + 1] = Math.round(sumG / sumWeight);
          src[idx + 2] = Math.round(sumB / sumWeight);
        }
      }
    }
  }

  ctx.putImageData(srcData, 0, 0);
  return dest;
}

/**
 * 6. SUPER-RESOLUCIÓN / MEJORAR RESOLUCIÓN (Bicúbica + Realce de micro-contraste)
 */
export function upscaleImageBicubic(
  source: HTMLCanvasElement,
  factor: 2 | 4 = 2
): HTMLCanvasElement {
  const targetW = source.width * factor;
  const targetH = source.height * factor;

  const upscaled = resizeCanvas(source, targetW, targetH, 'bicubic');
  // Aplicar filtro de recuperación de detalles
  const enhanced = applyConvolutionSharpness(upscaled, 0.45);
  return enhanced;
}

/**
 * 14. CONVERTIR A BLANCO Y NEGRO (Grayscale, Alto Contraste y Tramado Monocromo)
 */
export function applyBlackAndWhite(
  source: HTMLCanvasElement,
  mode: 'grayscale' | 'high_contrast' | 'halftone_mono',
  threshold: number = 128
): HTMLCanvasElement {
  const dest = cloneCanvas(source);
  const ctx = dest.getContext('2d')!;
  const imgData = ctx.getImageData(0, 0, dest.width, dest.height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    if (mode === 'grayscale') {
      data[i] = luma;
      data[i + 1] = luma;
      data[i + 2] = luma;
    } else if (mode === 'high_contrast') {
      const val = luma >= threshold ? 255 : 0;
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
    } else if (mode === 'halftone_mono') {
      // Dithering rápido de umbral con patrón Bayer
      const x = (i / 4) % dest.width;
      const y = Math.floor(i / 4 / dest.width);
      const bayer = ((x % 4) + (y % 4) * 4) * 16;
      const val = luma + (bayer - 128) * 0.3 >= threshold ? 255 : 0;
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return dest;
}

/**
 * 15. CREAR EFECTOS TEXTILES (Duotono, Semitono Serigráfico Halftone, Vintage Grunge, Posterizado)
 */
export function applyTextileEffects(
  source: HTMLCanvasElement,
  config: TextileEffectConfig
): HTMLCanvasElement {
  let result = cloneCanvas(source);

  // 1. Blanco y negro si está activo
  if (config.bwMode !== 'none') {
    result = applyBlackAndWhite(result, config.bwMode, config.thresholdValue);
  }

  // 2. Posterizado (Reducción a N tintas serigráficas)
  if (config.posterizeLevels >= 2) {
    result = applyPosterize(result, config.posterizeLevels);
  }

  // 3. Duotono Textil
  if (config.duotoneEnabled) {
    result = applyDuotone(result, config.duotoneColor1, config.duotoneColor2);
  }

  // 4. Semitono (Halftone) con puntos
  if (config.halftoneMode !== 'none') {
    result = applyHalftoneRaster(result, config.halftoneDotSize, config.halftoneAngle, config.halftoneMode);
  }

  // 5. Desgaste Vintage Grunge Textil
  if (config.vintageGrungeIntensity > 0) {
    result = applyVintageGrunge(result, config.vintageGrungeIntensity);
  }

  return result;
}

/**
 * Posterizado (reducción a N tonos continuos para cuatricromía/separación de tintas)
 */
function applyPosterize(source: HTMLCanvasElement, levels: number): HTMLCanvasElement {
  const dest = cloneCanvas(source);
  const ctx = dest.getContext('2d')!;
  const imgData = ctx.getImageData(0, 0, dest.width, dest.height);
  const data = imgData.data;

  const step = 255 / (levels - 1);

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    data[i] = Math.round(Math.round(data[i] / step) * step);
    data[i + 1] = Math.round(Math.round(data[i + 1] / step) * step);
    data[i + 2] = Math.round(Math.round(data[i + 2] / step) * step);
  }

  ctx.putImageData(imgData, 0, 0);
  return dest;
}

/**
 * Duotono textil
 */
function applyDuotone(source: HTMLCanvasElement, shadowHex: string, lightHex: string): HTMLCanvasElement {
  const dest = cloneCanvas(source);
  const ctx = dest.getContext('2d')!;
  const imgData = ctx.getImageData(0, 0, dest.width, dest.height);
  const data = imgData.data;

  const c1 = hexToRgb(shadowHex);
  const c2 = hexToRgb(lightHex);

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    const luma = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
    data[i] = Math.round(c1.r * (1 - luma) + c2.r * luma);
    data[i + 1] = Math.round(c1.g * (1 - luma) + c2.g * luma);
    data[i + 2] = Math.round(c1.b * (1 - luma) + c2.b * luma);
  }

  ctx.putImageData(imgData, 0, 0);
  return dest;
}

/**
 * Tramado de Semitono Serigráfico (Halftone Screen)
 */
function applyHalftoneRaster(
  source: HTMLCanvasElement,
  dotSize: number,
  angleDeg: number,
  mode: 'mono' | 'cmyk'
): HTMLCanvasElement {
  const dest = document.createElement('canvas');
  dest.width = source.width;
  dest.height = source.height;
  const destCtx = dest.getContext('2d')!;

  const srcCtx = source.getContext('2d')!;
  const srcData = srcCtx.getImageData(0, 0, source.width, source.height).data;

  destCtx.clearRect(0, 0, dest.width, dest.height);

  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const step = Math.max(3, dotSize);
  const maxRadius = step * 0.75;

  for (let y = 0; y < source.height; y += step) {
    for (let x = 0; x < source.width; x += step) {
      // Muestrear píxel promedio en la celda
      let sumR = 0, sumG = 0, sumB = 0, sumA = 0, count = 0;

      for (let dy = 0; dy < step && y + dy < source.height; dy++) {
        for (let dx = 0; dx < step && x + dx < source.width; dx++) {
          const idx = ((y + dy) * source.width + (x + dx)) * 4;
          sumR += srcData[idx];
          sumG += srcData[idx + 1];
          sumB += srcData[idx + 2];
          sumA += srcData[idx + 3];
          count++;
        }
      }

      if (count === 0) continue;
      const avgA = sumA / count;
      if (avgA < 15) continue;

      const avgR = sumR / count;
      const avgG = sumG / count;
      const avgB = sumB / count;
      const luma = (0.2126 * avgR + 0.7152 * avgG + 0.0722 * avgB) / 255;

      // Tamaño de punto inversamente proporcional a la luz
      const pointRadius = (1 - luma) * maxRadius;

      if (pointRadius > 0.5) {
        destCtx.beginPath();
        destCtx.arc(x + step / 2, y + step / 2, pointRadius, 0, Math.PI * 2);

        if (mode === 'mono') {
          destCtx.fillStyle = '#000000';
        } else {
          destCtx.fillStyle = rgbToHex(avgR, avgG, avgB);
        }
        destCtx.fill();
      }
    }
  }

  return dest;
}

/**
 * Textura de desgaste vintage / grunge serigráfico
 */
function applyVintageGrunge(source: HTMLCanvasElement, intensity: number): HTMLCanvasElement {
  const dest = cloneCanvas(source);
  const ctx = dest.getContext('2d')!;
  const imgData = ctx.getImageData(0, 0, dest.width, dest.height);
  const data = imgData.data;

  const threshold = 1 - (intensity / 100) * 0.35; // Probabilidad de micro grieta

  // Pseudo-ruido determinista para el desgaste textil
  for (let y = 0; y < dest.height; y++) {
    for (let x = 0; x < dest.width; x++) {
      const idx = (y * dest.width + x) * 4;
      if (data[idx + 3] === 0) continue;

      const noise1 = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      const fract1 = noise1 - Math.floor(noise1);

      const noise2 = Math.cos(x * 4.123 + y * 9.876);
      const fract2 = (noise2 + 1) / 2;

      if (fract1 > threshold && fract2 > 0.6) {
        data[idx + 3] = Math.round(data[idx + 3] * 0.15); // Desgaste que revela la tela
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return dest;
}

/**
 * 16. APLICAR FILTROS PREESTABLECIDOS PARA PRODUCCIÓN TEXTIL
 */
export function applyFilterPreset(source: HTMLCanvasElement, preset: TextileFilterPreset): HTMLCanvasElement {
  if (preset === 'none') return cloneCanvas(source);

  switch (preset) {
    case 'dtg_optimal':
      // Realce de saturación y micro-contraste para cabezales piezoeléctricos
      return applyAdjustments(source, {
        brightness: 4,
        contrast: 15,
        saturation: 125,
        sharpness: 35,
        hue: 0,
        temperature: 2,
        opacity: 100
      });

    case 'serigrafia_clasica':
      // Alto contraste y nitidez pura para separación de mallas
      return applyAdjustments(source, {
        brightness: -2,
        contrast: 35,
        saturation: 90,
        sharpness: 60,
        hue: 0,
        temperature: 0,
        opacity: 100
      });

    case 'sublimacion_pop':
      // Colores vivos intensos para polímeros de poliéster
      return applyAdjustments(source, {
        brightness: 6,
        contrast: 18,
        saturation: 155,
        sharpness: 25,
        hue: 0,
        temperature: 6,
        opacity: 100
      });

    case 'cyberpunk_streetwear':
      return applyAdjustments(source, {
        brightness: 8,
        contrast: 28,
        saturation: 160,
        sharpness: 40,
        hue: -15,
        temperature: -18,
        opacity: 100
      });

    case 'sepia_tradicional':
      return applyAdjustments(source, {
        brightness: -5,
        contrast: 10,
        saturation: 60,
        sharpness: 20,
        hue: 25,
        temperature: 30,
        opacity: 100
      });

    case 'cinema_moody':
      return applyAdjustments(source, {
        brightness: -8,
        contrast: 22,
        saturation: 85,
        sharpness: 30,
        hue: 0,
        temperature: -10,
        opacity: 100
      });

    case 'crisp_detail':
      return applyAdjustments(source, {
        brightness: 0,
        contrast: 10,
        saturation: 105,
        sharpness: 80,
        hue: 0,
        temperature: 0,
        opacity: 100
      });

    default:
      return cloneCanvas(source);
  }
}

/**
 * CÁLCULO Y ADVERTENCIAS DE RESOLUCIÓN PARA IMPRESIÓN (DPI y Calidad Textil)
 * Fórmula: DPI = (Pixels / MedidaCm) * 2.54
 */
export function calculatePrintDpiAnalysis(
  widthPx: number,
  heightPx: number,
  targetWidthCm: number = 21, // A4 estándar
  targetHeightCm: number = 29.7
): PrintDpiAnalysis {
  // DPI efectivo basado en el ancho físico requerido
  const calculatedDpi = Math.round((widthPx / targetWidthCm) * 2.54);

  // Dimensiones máximas a las que esta imagen puede imprimirse con 300 DPI óptimos
  const maxRecommendedPrintWidthCm = Number(((widthPx / 300) * 2.54).toFixed(1));
  const maxRecommendedPrintHeightCm = Number(((heightPx / 300) * 2.54).toFixed(1));

  let qualityLevel: PrintDpiAnalysis['qualityLevel'] = 'optimal';
  let warningMessage = 'Resolución óptima (≥ 300 DPI). Calidad fotográfica nítida para DTF, DTG y Serigrafía.';

  if (calculatedDpi < 150) {
    qualityLevel = 'insufficient';
    warningMessage = `¡Atención! Densidad insuficiente (${calculatedDpi} DPI). La imagen saldrá pixelada o borrosa en la prenda. Tamaño máx recomendado a 300 DPI: ${maxRecommendedPrintWidthCm} × ${maxRecommendedPrintHeightCm} cm. Utiliza 'Mejorar Resolución IA' o sube un archivo de mayor tamaño.`;
  } else if (calculatedDpi < 240) {
    qualityLevel = 'acceptable';
    warningMessage = `Calidad aceptable (${calculatedDpi} DPI). Adecuada para prendas claras o tiradas estándar, pero podría perder micro-detalle en serigrafía fina de más de 90 hilos.`;
  }

  return {
    widthPx,
    heightPx,
    targetWidthCm,
    targetHeightCm,
    calculatedDpi,
    qualityLevel,
    warningMessage,
    maxRecommendedPrintWidthCm,
    maxRecommendedPrintHeightCm
  };
}
