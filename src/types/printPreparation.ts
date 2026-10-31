export type PrintFormat = 'PNG' | 'JPG' | 'SVG' | 'PDF' | 'TIFF' | 'EPS';

export type ColorProfile = 
  | 'sRGB IEC61966-2.1' 
  | 'Adobe RGB (1998)' 
  | 'CMYK FOGRA39 (Coated)' 
  | 'CMYK GRACoL 2006' 
  | 'Escala de Grises (Dot Gain 20%)'
  | 'Separación Spot / Pantonera Textil';

export type DimensionUnit = 'cm' | 'mm' | 'in' | 'px';

export type MachineCategory = 
  | 'dtf' 
  | 'dtg' 
  | 'sublimacion' 
  | 'serigrafia' 
  | 'plotter_corte' 
  | 'bordado' 
  | 'uv_dtf'
  | 'transfer_laser';

export interface PrePressMachine {
  id: string;
  name: string;
  category: MachineCategory;
  categoryLabel: string;
  model: string;
  bedWidthMm: number;
  bedHeightMm: number;
  maxDpi: number;
  recommendedDpi: number;
  supportedFormats: PrintFormat[];
  recommendedRip: string;
  ripInstructions: string;
  requiresMirror: boolean;
  requiresWhiteUnderbase: boolean;
  defaultBleedMm: number;
  defaultMarginMm: number;
  isCustom?: boolean;
}

export type SeparationMethod = 
  | 'none' 
  | 'cmyk' 
  | 'underbase_cmyk' 
  | 'spot_colors' 
  | 'simulated_process';

export interface SeparationPlate {
  id: string;
  name: string;
  channelKey: 'white' | 'cyan' | 'magenta' | 'yellow' | 'black' | 'spot1' | 'spot2';
  colorHex: string;
  coveragePercent: number;
  canvasDataUrl: string;
  invertFotolito: boolean; // True to view as opaque black film positive for screen burning
}

export type IssueSeverity = 'pass' | 'info' | 'warning' | 'error';

export interface PreflightIssue {
  id: string;
  rule: 'dpi' | 'dimensions' | 'transparency' | 'format' | 'missing_artwork' | 'out_of_bounds' | 'color_space' | 'bleed_margin';
  severity: IssueSeverity;
  title: string;
  description: string;
  metricValue?: string;
  recommendedValue?: string;
  autoFixAvailable?: boolean;
  autoFixAction?: string;
}

export interface PrepressArtwork {
  id: string;
  name: string;
  originalUrl: string;
  currentUrl: string;
  originalFormat: PrintFormat;
  originalWidthPx: number;
  originalHeightPx: number;
  naturalDpi: number;
  fileSizeBytes: number;
  hasAlpha: boolean;
  hasDirtyAlphaHalos: boolean;
  createdAt: string;
}

export interface PrintPreparationConfig {
  targetMachineId: string;
  unit: DimensionUnit;
  width: number; // In selected unit
  height: number; // In selected unit
  lockAspectRatio: boolean;
  dpi: number;
  transparencyEnabled: boolean;
  colorProfile: ColorProfile;
  bleedMm: number;
  marginMm: number;
  mirrorHorizontal: boolean;
  mirrorVertical: boolean;
  showRegistrationMarks: boolean;
  showColorBars: boolean;
  showBleedAndMargins: boolean;
  showDimensionsOverlay: boolean;
  showMachineBounds: boolean;
  separationMethod: SeparationMethod;
  whiteUnderbaseChokePx: number; // Choke/rebaje 1-4 px
  whiteUnderbaseDensity: number; // 0-100%
  exportFormat: PrintFormat;
}
