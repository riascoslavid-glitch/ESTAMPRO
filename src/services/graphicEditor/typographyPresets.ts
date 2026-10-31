/**
 * ESTAMPAPRO 360° - Catálogo Tipográfico para Estampados Textiles
 * Fuentes con excelente legibilidad y rendimiento para serigrafía, DTF, vinil de corte y bordado.
 */

export interface TypographyPreset {
  id: string;
  name: string;
  family: string;
  category: 'streetwear' | 'atletico' | 'sans' | 'serif' | 'script' | 'stencil';
  recommendedTechnique: string;
  defaultWeight: 'normal' | 'bold' | '600' | '800';
}

export const TYPOGRAPHY_PRESETS: TypographyPreset[] = [
  {
    id: 'impact_street',
    name: 'Streetwear Heavy (Impact)',
    family: 'Impact, "Arial Black", sans-serif',
    category: 'streetwear',
    recommendedTechnique: 'DTF / Serigrafía Cubriente',
    defaultWeight: '800'
  },
  {
    id: 'athletic_varsity',
    name: 'Varsity Collegiate Athletic',
    family: '"Copperplate", "Arial Black", sans-serif',
    category: 'atletico',
    recommendedTechnique: 'Bordado / Vinil Textil',
    defaultWeight: 'bold'
  },
  {
    id: 'modern_sans',
    name: 'Modern Clean Geometric',
    family: 'Inter, system-ui, -apple-system, sans-serif',
    category: 'sans',
    recommendedTechnique: 'Universal (DTF, DTG, Serigrafía)',
    defaultWeight: '600'
  },
  {
    id: 'classic_serif',
    name: 'Vintage Serif Editorial',
    family: 'Georgia, "Times New Roman", serif',
    category: 'serif',
    recommendedTechnique: 'Serigrafía Tacto Cero / DTG',
    defaultWeight: 'normal'
  },
  {
    id: 'brush_script',
    name: 'Brush Script Urbana Cursiva',
    family: '"Brush Script MT", "Segoe Script", cursive',
    category: 'script',
    recommendedTechnique: 'DTF / Sublimación',
    defaultWeight: 'normal'
  },
  {
    id: 'military_stencil',
    name: 'Stencil Militar Industrial',
    family: '"Courier New", Courier, monospace',
    category: 'stencil',
    recommendedTechnique: 'Serigrafía con plantilla / Vinil',
    defaultWeight: 'bold'
  }
];
