/**
 * ESTAMPAPRO 360° - Tipos y definiciones del Editor de Imágenes y Preparación Textil
 * Módulo de procesamiento de imagen avanzado para estampados, serigrafía y DTF.
 */

export type ImageEditorTool = 
  | 'transform' // Mover / Zoom / Inspeccionar
  | 'crop' // Recorte libre o con proporciones fijas
  | 'adjust' // Brillo, contraste, saturación, nitidez
  | 'color_swap' // Reemplazo selectivo de color
  | 'transparency' // Varita de transparencia / canal alfa
  | 'ai_bg_remove' // Eliminación de fondo con IA / Croma inteligente
  | 'ai_inpaint' // Borrado mágico / inpainting de elementos
  | 'ai_upscale' // Super-resolución / Upscale con control DPI
  | 'effects' // Semitono, duotono, vintage grunge, posterizado
  | 'filters' // Presets de impresión textil
  | 'compare'; // Modo de comparación antes / después

export type CropAspectRatio = 'free' | '1:1' | '4:3' | '16:9' | 'a4_pecho' | 'pecho_frente' | 'bolsillo';

export interface CropRect {
  x: number; // Porcentaje 0..100
  y: number; // Porcentaje 0..100
  width: number; // Porcentaje 0..100
  height: number; // Porcentaje 0..100
}

export interface ImageAdjustments {
  brightness: number; // -100 a +100 (0 default)
  contrast: number; // -100 a +100 (0 default)
  saturation: number; // 0 a 200 (100 default)
  sharpness: number; // 0 a 100 (0 default, matriz de convolución)
  hue: number; // -180 a +180 (0 default)
  temperature: number; // -100 a +100 (0 default, cálido / frío)
  opacity: number; // 0 a 100 (100 default)
}

export interface ColorSwapConfig {
  active: boolean;
  sourceColor: string; // Hex color to detect
  targetColor: string; // Hex color to replace with
  tolerance: number; // 1 a 100
  preserveLuminosity: boolean;
}

export interface TransparencyWandConfig {
  targetColor: string; // Hex color to make transparent
  tolerance: number; // 1 a 100
  feather: number; // 0 a 10px suavizado de borde
}

export type BlackAndWhiteMode = 'none' | 'grayscale' | 'high_contrast' | 'halftone_mono';

export interface TextileEffectConfig {
  bwMode: BlackAndWhiteMode;
  thresholdValue: number; // 0 a 255 para alto contraste
  halftoneMode: 'none' | 'mono' | 'cmyk';
  halftoneDotSize: number; // 2 a 20 px
  halftoneAngle: number; // 0 a 90 deg
  duotoneEnabled: boolean;
  duotoneColor1: string; // Sombras
  duotoneColor2: string; // Luces
  vintageGrungeIntensity: number; // 0 a 100 (desgaste textil)
  posterizeLevels: number; // 0 (desactivado) o 2..16 colores planos
  neonGlow: boolean;
}

export type TextileFilterPreset = 
  | 'none'
  | 'dtg_optimal'
  | 'serigrafia_clasica'
  | 'sublimacion_pop'
  | 'cyberpunk_streetwear'
  | 'sepia_tradicional'
  | 'cinema_moody'
  | 'crisp_detail';

export interface ImageVersion {
  id: string;
  name: string;
  timestamp: number;
  dataUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  dpi: number;
  actionTaken: string;
}

export interface PrintDpiAnalysis {
  widthPx: number;
  heightPx: number;
  targetWidthCm: number;
  targetHeightCm: number;
  calculatedDpi: number;
  qualityLevel: 'insufficient' | 'acceptable' | 'optimal';
  warningMessage: string;
  maxRecommendedPrintWidthCm: number;
  maxRecommendedPrintHeightCm: number;
}
