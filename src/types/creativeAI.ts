/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AIDesignCategory =
  | 'deportivos'
  | 'empresariales'
  | 'infantiles'
  | 'promocionales'
  | 'musicales'
  | 'artisticos'
  | 'tipograficos'
  | 'minimalistas'
  | 'ilustraciones'
  | 'personalizados';

export interface AICategoryConfig {
  id: AIDesignCategory;
  name: string;
  iconName: string;
  description: string;
  recommendedGarments: string[];
  recommendedTechniques: string[];
  popularPrompts: string[];
  suggestedPalettes: {
    name: string;
    colors: string[];
  }[];
}

export type AITextileStyle =
  | 'vector_flat'
  | 'serigrafia_retro'
  | 'dtf_vibrante'
  | 'streetwear_grunge'
  | 'bordado_3d'
  | 'acuarela_textil'
  | 'cyberpunk_neon'
  | 'pop_art_comic';

export interface AIStyleOption {
  id: AITextileStyle;
  name: string;
  badge: string;
  description: string;
  idealTechnique: string;
  colorApproach: string;
}

export type AIToolMode =
  | 'generar'
  | 'variaciones'
  | 'estilos'
  | 'colores'
  | 'eliminar_fondo'
  | 'mejorar'
  | 'elementos'
  | 'editar'
  | 'composicion';

export interface AIGeneratedItem {
  id: string;
  title: string;
  prompt: string;
  refinedPrompt?: string;
  category: AIDesignCategory;
  style: AITextileStyle;
  paletteName: string;
  colors: string[];
  imageUrl: string;
  transparentUrl?: string;
  hasTransparentBg: boolean;
  aspectRatio: '1:1' | '3:4' | '4:3';
  recommendedTechnique: string;
  printWidthCm: number;
  printHeightCm: number;
  dpi: number;
  createdAt: string;
  timestamp: number;
  favorite: boolean;
  source: 'gemini' | 'vector_engine' | 'ai_variation' | 'modified';
  separationAdvice?: string;
  isolatedElement?: 'escudo' | 'mascota' | 'sello' | 'emblema' | 'liston' | 'none';
}

export interface AIEnhancementState {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  sharpness: number; // 0 to 100
  colorPaletteIndex: number;
  toleranceAlpha: number; // 0 to 100
}
