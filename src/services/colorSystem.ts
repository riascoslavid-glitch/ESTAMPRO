export interface TextileColor {
  name: string;
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  cmyk: { c: number; m: number; y: number; k: number };
  pantoneApprox?: string;
  category?: string;
}

export interface TextileColorPalette {
  id: string;
  name: string;
  description: string;
  colors: { name: string; hex: string }[];
}

export class ColorSystem {
  /**
   * Convierte HEX (#RRGGBB) a RGB
   */
  static hexToRgb(hex: string): { r: number; g: number; b: number } {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map((char) => char + char).join('');
    }
    const num = parseInt(cleanHex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  /**
   * Convierte RGB a HEX
   */
  static rgbToHex(r: number, g: number, b: number): string {
    const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
    return (
      '#' +
      [clamp(r), clamp(g), clamp(b)]
        .map((x) => x.toString(16).padStart(2, '0'))
        .join('')
    );
  }

  /**
   * Convierte RGB a HSL
   */
  static rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
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

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  /**
   * Convierte RGB a CMYK de referencia para separación textil
   */
  static rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
    const red = r / 255;
    const green = g / 255;
    const blue = b / 255;

    const k = 1 - Math.max(red, green, blue);
    if (k === 1) {
      return { c: 0, m: 0, y: 0, k: 100 };
    }

    const c = (1 - red - k) / (1 - k);
    const m = (1 - green - k) / (1 - k);
    const y = (1 - blue - k) / (1 - k);

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  }

  /**
   * Genera el objeto completo TextileColor a partir de un valor HEX
   */
  static parseHex(hex: string, name = 'Color Personalizado'): TextileColor {
    const rgb = this.hexToRgb(hex);
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    const cmyk = this.rgbToCmyk(rgb.r, rgb.g, rgb.b);

    return {
      name,
      hex: hex.toLowerCase().startsWith('#') ? hex.toLowerCase() : `#${hex.toLowerCase()}`,
      rgb,
      hsl,
      cmyk
    };
  }
}

export const PRESET_TEXTILE_PALETTES: TextileColorPalette[] = [
  {
    id: 'pal_streetwear',
    name: 'Streetwear & Neutros',
    description: 'Tonos pesados y contemporáneos para drops de moda urbana.',
    colors: [
      { name: 'Negro Profundo', hex: '#0a0a0c' },
      { name: 'Blanco Crudo / Off-White', hex: '#f4f3ef' },
      { name: 'Gris Carbón Asfalto', hex: '#27272a' },
      { name: 'Gris Melange Medio', hex: '#71717a' },
      { name: 'Café Espresso', hex: '#34261e' },
      { name: 'Beige Arena Warm', hex: '#d5c7b3' }
    ]
  },
  {
    id: 'pal_corporativo',
    name: 'Básicos & Corporativo',
    description: 'Colores institucionales estandarizados de alta solidez.',
    colors: [
      { name: 'Azul Marino Clásico', hex: '#0f172a' },
      { name: 'Azul Royal Intenso', hex: '#1d4ed8' },
      { name: 'Rojo Carmesí Bandera', hex: '#dc2626' },
      { name: 'Verde Botella Oscuro', hex: '#14532d' },
      { name: 'Burdeo Vino Tinto', hex: '#881337' },
      { name: 'Blanco Puro Óptico', hex: '#ffffff' }
    ]
  },
  {
    id: 'pal_vintage_earth',
    name: 'Vintage & Tierra',
    description: 'Tonos orgánicos y lavados de efecto retro mineral.',
    colors: [
      { name: 'Verde Olivo Militar', hex: '#44513e' },
      { name: 'Terracota Tostado', hex: '#b45309' },
      { name: 'Mostaza Vintage', hex: '#ca8a04' },
      { name: 'Azul Pizarra Desgastado', hex: '#475569' },
      { name: 'Ocre Seco', hex: '#854d0e' },
      { name: 'Arcilla Salvia', hex: '#849b87' }
    ]
  },
  {
    id: 'pal_neon_fluo',
    name: 'Neón Textil & Fluo',
    description: 'Colores de máxima visibilidad y pigmentos fluorescentes.',
    colors: [
      { name: 'Amarillo Neón Alta Vis', hex: '#facc15' },
      { name: 'Verde Láser Fluo', hex: '#4ade80' },
      { name: 'Naranja Eléctrico', hex: '#fb923c' },
      { name: 'Fucsia Fluo Vibrante', hex: '#f43f5e' },
      { name: 'Cian Turquesa Neón', hex: '#06b6d4' }
    ]
  },
  {
    id: 'pal_pasteles',
    name: 'Pasteles Suaves',
    description: 'Gama suave para colecciones infantiles y estética aesthetic.',
    colors: [
      { name: 'Rosa Empolvado', hex: '#fbcfe8' },
      { name: 'Menta Pastel', hex: '#a7f3d0' },
      { name: 'Lavanda Suave', hex: '#ddd6fe' },
      { name: 'Amarillo Vainilla', hex: '#fef08a' },
      { name: 'Celeste Cielo Claro', hex: '#bae6fd' }
    ]
  }
];
