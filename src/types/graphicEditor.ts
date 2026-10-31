/**
 * ESTAMPAPRO 360° - Tipos del Editor Gráfico Profesional
 * Soporta lienzo vectorial multicapa, textos curvados, formas, pincel y exportación textil.
 */

export type GraphicTool =
  | 'select'
  | 'pencil'
  | 'brush'
  | 'eraser'
  | 'text'
  | 'rect'
  | 'circle'
  | 'line'
  | 'arrow'
  | 'star'
  | 'triangle';

export type TextAlignment = 'left' | 'center' | 'right';

export interface GradientStop {
  offset: number; // 0 to 1
  color: string;
}

export interface LinearGradientDef {
  type: 'linear';
  angle: number; // grados (0 = horizontal, 90 = vertical)
  stops: GradientStop[];
}

export type FillType = string | LinearGradientDef;

export interface GraphicElement {
  id: string;
  name: string;
  type:
    | 'path'
    | 'rect'
    | 'circle'
    | 'line'
    | 'arrow'
    | 'star'
    | 'triangle'
    | 'text'
    | 'image';
  x: number; // en cm dentro del lienzo
  y: number; // en cm
  width: number; // en cm
  height: number; // en cm
  rotation: number; // en grados
  opacity: number; // 0 a 1
  visible: boolean;
  locked: boolean;
  fill: string; // Hex o 'transparent'
  gradient?: LinearGradientDef;
  stroke: string; // Hex o 'transparent'
  strokeWidth: number; // en pt / px
  strokeDash?: 'solid' | 'dashed' | 'dotted';
  borderRadius?: number; // para rectángulos en cm

  // Específico para texto
  text?: string;
  fontFamily?: string;
  fontSize?: number; // en pt
  fontWeight?: 'normal' | 'bold' | '600' | '800';
  fontStyle?: 'normal' | 'italic';
  textAlign?: TextAlignment;
  letterSpacing?: number; // en px
  lineHeight?: number;
  isCurved?: boolean;
  curveRadius?: number; // radio de arco en cm (-30 a +30)
  textStrokeColor?: string;
  textStrokeWidth?: number;
  textShadowColor?: string;
  textShadowBlur?: number;
  textShadowOffsetX?: number;
  textShadowOffsetY?: number;
  skewX?: number; // inclinación en grados (-45 a +45)

  // Específico para trazos a mano alzada (lápiz / pincel)
  points?: Array<{ x: number; y: number }>;
  brushSize?: number;

  // Específico para imágenes y SVG importados
  imageSrc?: string;
  svgContent?: string;
  aspectRatio?: number;
}

export interface CanvasDimensions {
  widthCm: number;
  heightCm: number;
  dpi: number;
  name: string;
}

export const PRINT_CANVAS_TEMPLATES: Record<string, CanvasDimensions> = {
  pecho_centro_a4: {
    name: 'Pecho Centro Estándar (A4 - 21 x 29.7 cm)',
    widthCm: 21,
    heightCm: 29.7,
    dpi: 300
  },
  espalda_maxi_a3: {
    name: 'Espalda Maxi / Poster (A3 - 29.7 x 42 cm)',
    widthCm: 29.7,
    heightCm: 42,
    dpi: 300
  },
  bolsillo_pequeno: {
    name: 'Bolsillo / Escudo Izquierdo (10 x 10 cm)',
    widthCm: 10,
    heightCm: 10,
    dpi: 300
  },
  manga_vertical: {
    name: 'Manga Vertical (8 x 35 cm)',
    widthCm: 8,
    heightCm: 35,
    dpi: 300
  },
  gorra_frontal: {
    name: 'Frente de Gorra (12 x 6.5 cm)',
    widthCm: 12,
    heightCm: 6.5,
    dpi: 300
  },
  tote_bag: {
    name: 'Tote Bag Bolsa Cuadrada (28 x 30 cm)',
    widthCm: 28,
    heightCm: 30,
    dpi: 300
  }
};

export interface GraphicStudioProject {
  id: string;
  title: string;
  clientName?: string;
  garmentName?: string;
  garmentModel?: string;
  templateKey: string;
  canvasWidthCm: number;
  canvasHeightCm: number;
  dpi: number;
  unit: 'cm' | 'mm';
  backgroundColor: string; // 'transparent' | '#ffffff' | '#0f172a' | hex
  mirrorHorizontal: boolean;
  colorProfile: 'CMYK FOGRA39' | 'sRGB' | 'Adobe RGB 1998';
  elements: GraphicElement[];
  previewDataUri?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

