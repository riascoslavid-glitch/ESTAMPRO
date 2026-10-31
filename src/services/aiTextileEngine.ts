/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIDesignCategory, AICategoryConfig, AITextileStyle, AIStyleOption, AIGeneratedItem } from '../types/creativeAI';

export const AI_CATEGORIES: AICategoryConfig[] = [
  {
    id: 'deportivos',
    name: 'Deportivos',
    iconName: 'Trophy',
    description: 'Escudos, mascotas agresivas, números dinámicos y emblemas de alto rendimiento para camisetas y jerseys.',
    recommendedGarments: ['Polera Deportiva Dry-Fit', 'Buso Hoodie Deportivo', 'Gorra Trucker'],
    recommendedTechniques: ['DTF (Direct to Film)', 'Sublimación', 'Vinil Textil'],
    popularPrompts: [
      'León geométrico moderno con escudo deportivo en oro metalizado y negro carbón',
      'Águila de presa en vuelo dinámico con líneas de velocidad para club de básquetbol',
      'Tigre con mirada feroz rodeado de rayos hexagonales en azul eléctrico y plata',
      'Escudo heráldico de fútbol con corona de laureles, balón retro y tipografía bold'
    ],
    suggestedPalettes: [
      { name: 'Negro & Oro Campeón', colors: ['#000000', '#F59E0B', '#D97706', '#FFFFFF'] },
      { name: 'Azul Eléctrico & Plata', colors: ['#0284C7', '#38BDF8', '#E2E8F0', '#0F172A'] },
      { name: 'Rojo Furia & Carbón', colors: ['#DC2626', '#EF4444', '#1E293B', '#F8FAFC'] }
    ]
  },
  {
    id: 'empresariales',
    name: 'Empresariales',
    iconName: 'Briefcase',
    description: 'Identidad corporativa elegante, monogramas sutiles, sellos de aniversario y uniformes profesionales.',
    recommendedGarments: ['Camiseta Polo Piqué', 'Chaqueta Softshell', 'Delantal Chef Gabardina'],
    recommendedTechniques: ['Bordado 3D', 'Serigrafía Plastisol', 'DTF Fino'],
    popularPrompts: [
      'Monograma corporativo minimalista en geometría circular con serif moderna',
      'Emblema de 25 aniversario empresarial con laureles y tipografía grabada en platino',
      'Logotipo tecnológico abstracto con hexágonos interconectados y gradiente sutil',
      'Sello de garantía de calidad artesanal con cinta curvada y estrella central'
    ],
    suggestedPalettes: [
      { name: 'Azul Ejecutivo & Blanco', colors: ['#1E3A8A', '#3B82F6', '#94A3B8', '#FFFFFF'] },
      { name: 'Grafito & Platino', colors: ['#334155', '#64748B', '#CBD5E1', '#F8FAFC'] },
      { name: 'Verde Botánico & Cobre', colors: ['#14532D', '#16A34A', '#D97706', '#F1F5F9'] }
    ]
  },
  {
    id: 'infantiles',
    name: 'Infantiles',
    iconName: 'Smile',
    description: 'Personajes amigables, animales tiernos, temas espaciales y aventuras con colores vibrantes no tóxicos.',
    recommendedGarments: ['Camiseta Infantil Algodón Peinado', 'Body Bebé Soft', 'Buso Canguro Niños'],
    recommendedTechniques: ['DTF base agua táctil', 'Serigrafía Tintas al Agua', 'Bordado'],
    popularPrompts: [
      'Pequeño astronauta oso flotando en el espacio rodeado de estrellas sonrientes y planetas de colores pastel',
      'Dinosaurio bebé patinador con gorra hacia atrás en estilo caricatura cute',
      'Zorro del bosque con bufanda tejida sentado entre hongos mágicos de acuarela',
      'Robot curioso reparando una flor con engranes coloridos y luces brillantes'
    ],
    suggestedPalettes: [
      { name: 'Aventura Espacial', colors: ['#3B82F6', '#8B5CF6', '#F43F5E', '#FDE047'] },
      { name: 'Pastel Baby', colors: ['#FBCFE8', '#BAE6FD', '#FEF08A', '#BBF7D0'] },
      { name: 'Safari Alegre', colors: ['#F97316', '#EAB308', '#22C55E', '#14B8A6'] }
    ]
  },
  {
    id: 'promocionales',
    name: 'Promocionales',
    iconName: 'Megaphone',
    description: 'Gráficos de alto impacto visual, sellos de festivales, frases de campaña masiva y eventos publicitarios.',
    recommendedGarments: ['Camiseta Algodón 160g Campaña', 'Bolsa Totebag Lienzo', 'Gorra Promocional'],
    recommendedTechniques: ['Serigrafía Plastisol 1 Tinta', 'DTF Rápido', 'Transfer'],
    popularPrompts: [
      'Insignia circular de festival musical con rayos solares, micrófono vintage y cinta perimetral',
      'Sello de edición limitada con estrellas, textura de sello postal desgastado y fecha 2026',
      'Gráfico tipográfico publicitario de alta energía con palabras en perspectiva 3D',
      'Emblema de carrera urbana 10K con siluetas de corredores y cronómetro estilizado'
    ],
    suggestedPalettes: [
      { name: 'Alto Impacto Neon', colors: ['#000000', '#FACC15', '#EF4444', '#FFFFFF'] },
      { name: 'Monocromo Fuerte', colors: ['#09090B', '#27272A', '#E4E4E7', '#FFFFFF'] },
      { name: 'Festival Sunburst', colors: ['#EA580C', '#F59E0B', '#84CC16', '#0284C7'] }
    ]
  },
  {
    id: 'musicales',
    name: 'Musicales',
    iconName: 'Music',
    description: 'Estética de bandas de rock, hip-hop vintage, vinilos, sintetizadores analógicos y festivales.',
    recommendedGarments: ['Camiseta Oversize Heavyweight 240g', 'Buso French Terry Vintage', 'Gorra Plana'],
    recommendedTechniques: ['Serigrafía Descarga / Discharge', 'DTF Textil', 'Cuatricromía CMYK'],
    popularPrompts: [
      'Calavera con auriculares dj sobre vinilo retro y ondas de audio distorsionadas estilo grunge 90s',
      'Cassette de audio ochentero con cintas flotantes en degradado neón vaporwave',
      'Guitarra eléctrica vintage en llamas con alas mecánicas y tipografía hard rock',
      'Saxofonista de jazz en silueta nocturna con salpicaduras de acuarela dorada y humo'
    ],
    suggestedPalettes: [
      { name: 'Rock Vintage Distressed', colors: ['#18181B', '#71717A', '#DC2626', '#FEF3C7'] },
      { name: 'Vaporwave Neón 80s', colors: ['#D946EF', '#06B6D4', '#6366F1', '#F43F5E'] },
      { name: 'Jazz Nocturno', colors: ['#0F172A', '#D97706', '#E2E8F0', '#3B82F6'] }
    ]
  },
  {
    id: 'artisticos',
    name: 'Artísticos',
    iconName: 'Palette',
    description: 'Ilustraciones de autor, xilografía botánica, arte lineal abstracto, duotonos y composiciones de galería.',
    recommendedGarments: ['Polera Algodón Pima Peruano', 'Totebag Algodón Crudo', 'Hoodie Boxy Fit'],
    recommendedTechniques: ['Serigrafía Semitono Halftone', 'DTG (Direct to Garment)', 'Bordado Minimal'],
    popularPrompts: [
      'Rostro femenino en arte lineal continuo entrelazado con flores silvestres y hojas de laurel',
      'Grabado en madera botánico de flores de amapola y mariposas nocturnas con trama serigráfica',
      'Composición abstracta con formas orgánicas superpuestas, manchas de textura y sol naciente',
      'Paisaje de montaña japonés estilo Ukiyo-e con olas estilizadas y sol carmesí'
    ],
    suggestedPalettes: [
      { name: 'Tierra & Botánica', colors: ['#78350F', '#065F46', '#D97706', '#FEF3C7'] },
      { name: 'Ukiyo-e Japonés', colors: ['#991B1B', '#1E3A8A', '#D97706', '#F8FAFC'] },
      { name: 'Monocromo Fine-Line', colors: ['#09090B', '#3F3F46', '#A1A1AA', '#FFFFFF'] }
    ]
  },
  {
    id: 'tipograficos',
    name: 'Tipográficos',
    iconName: 'Type',
    description: 'Lettering personalizado, fuentes góticas streetwear, caligrafía gestual y frases con kerning calibrado.',
    recommendedGarments: ['Camiseta Cuello Redondo Clásica', 'Sudadera Cuello Redondo', 'Gorra Dad Cap'],
    recommendedTechniques: ['Serigrafía Base Agua', 'Bordado en Realce 3D', 'Vinil Textil Reflectante'],
    popularPrompts: [
      'Frase "STAY WILD & FREE" en tipografía vintage curva con sombras de extrusión 3D y estrellas decorativas',
      'Lettering gótico moderno "CREATIVE REBELS" con efecto de goteo de pintura y remaches metálicos',
      'Composición tipográfica minimalista con coordenadas geográficas y lema inspiracional en helvética bold',
      'Caligrafía oriental combinada con serif contemporánea en distribución vertical para espalda'
    ],
    suggestedPalettes: [
      { name: 'Blanco & Negro Brutalista', colors: ['#000000', '#27272A', '#FAFAFA', '#E4E4E7'] },
      { name: 'Oro Viejo & Burdeos', colors: ['#450A0A', '#B45309', '#FDE68A', '#FAFAFA'] },
      { name: 'Verde Militar & Naranja', colors: ['#1C1917', '#3F6212', '#EA580C', '#FAFAF9'] }
    ]
  },
  {
    id: 'minimalistas',
    name: 'Minimalistas',
    iconName: 'Compass',
    description: 'Iconos sobrios, una sola línea, siluetas de precisión geométrica y estética nórdica para moda urbana limpia.',
    recommendedGarments: ['Polera Boxy Heavyweight', 'Buso Cuello Redondo Minimal', 'Delantal Barista'],
    recommendedTechniques: ['Serigrafía 1 Tinta Fina', 'Bordado Micro', 'DTF Mate'],
    popularPrompts: [
      'Silueta geométrica minimalista de ciervo en trazos angulares y luna menguante',
      'Rosa de los vientos con líneas ultra delgadas y coordenadas náuticas discretas',
      'Ojo sagrado con pestañas geométricas y prisma de luz en línea continua de 1mm',
      'Flor solitaria en trazo continuo encerrada en un rectángulo con bordes redondeados'
    ],
    suggestedPalettes: [
      { name: 'Zen Minimal', colors: ['#09090B', '#71717A', '#F4F4F5', '#FFFFFF'] },
      { name: 'Arena & Carbón', colors: ['#292524', '#78716C', '#D6D3D1', '#F5F5F4'] },
      { name: 'Oliva Suave & Hueso', colors: ['#3F4E4F', '#A27B5C', '#DCD7C9', '#F9F9F9'] }
    ]
  },
  {
    id: 'ilustraciones',
    name: 'Ilustraciones',
    iconName: 'Feather',
    description: 'Ilustraciones complejas, estética tattoo tradicional, cyberpunk, manga japonés y personajes streetwear.',
    recommendedGarments: ['Camiseta Oversize 240g', 'Polerón Canguro Grueso', 'Chaqueta Denim'],
    recommendedTechniques: ['DTF Full Color HD', 'Serigrafía Cuatricromía Simulada', 'Sublimación'],
    popularPrompts: [
      'Máscara samurai Hannya cibernética con cables de neón y flores de cerezo estilo manga cyberpunk',
      'Tigre y serpiente entrelazados en estilo tatuaje tradicional japonés con nubes de viento y olas',
      'Astronauta con traje espacial desgastado observando una nebulosa psicodélica reflejada en su visor',
      'Calavera con casco de motociclista vintage, alas mecánicas y pistones humeantes'
    ],
    suggestedPalettes: [
      { name: 'Cyberpunk Neo-Tokyo', colors: ['#0F172A', '#EC4899', '#06B6D4', '#FACC15'] },
      { name: 'Tattoo Clásico Neo-Tradicional', colors: ['#1C1917', '#B91C1C', '#047857', '#FDE047'] },
      { name: 'Cosmic Nebula', colors: ['#1E1B4B', '#7C3AED', '#EC4899', '#38BDF8'] }
    ]
  },
  {
    id: 'personalizados',
    name: 'Diseños personalizados',
    iconName: 'Wand2',
    description: 'Generación libre con controles avanzados de composición, inclusión de nombres, sellos a medida y logos de clientes.',
    recommendedGarments: ['Cualquier prenda del catálogo', 'Prendas Especiales', 'Accesorios y Gorras'],
    recommendedTechniques: ['DTF Direct to Film', 'Serigrafía', 'Sublimación', 'Bordado'],
    popularPrompts: [
      'Insignia vintage personalizada con nombre del taller, año de fundación y herramientas de impresión cruzadas',
      'Escudo universitario con antorcha del conocimiento, libro abierto y cinta para nombre personalizable',
      'Emblema de barbería clásica con navajas barberas cruzadas, poste tricolor y corona de laureles',
      'Logo de café de especialidad con taza humeante, granos de café estilizados y ramas de cafeto'
    ],
    suggestedPalettes: [
      { name: 'Taller Textil Tradicional', colors: ['#0F172A', '#D97706', '#E2E8F0', '#DC2626'] },
      { name: 'Vintage Barber', colors: ['#1E293B', '#B91C1C', '#1D4ED8', '#F8FAFC'] },
      { name: 'Coffee Roastery', colors: ['#451A03', '#78350F', '#D97706', '#FEF3C7'] }
    ]
  }
];

export const AI_STYLES: AIStyleOption[] = [
  {
    id: 'vector_flat',
    name: 'Vector Plano Streetwear',
    badge: 'Vector',
    description: 'Colores puros sin degradados sucios, trazos gruesos y bordes de corte perfectos para DTF o serigrafía.',
    idealTechnique: 'Serigrafía / DTF',
    colorApproach: 'Tintas planas 3-5 colores'
  },
  {
    id: 'serigrafia_retro',
    name: 'Serigrafía Vintage / Semitono',
    badge: 'Retro',
    description: 'Tramado halftone punteado visible (LPI calibrado), textura desgastada (distressed) y aspecto de los 70s/80s.',
    idealTechnique: 'Serigrafía Manual',
    colorApproach: 'Efecto descarga / semitono'
  },
  {
    id: 'dtf_vibrante',
    name: 'DTF Full Color Degradado',
    badge: 'DTF HD',
    description: 'Colores hipersaturados, brillos espectrales, detalles fotográficos y sombras ricas para film directo.',
    idealTechnique: 'DTF Digital',
    colorApproach: 'Gama extendida CMYK+W'
  },
  {
    id: 'streetwear_grunge',
    name: 'Streetwear Grunge & Acid',
    badge: 'Urban',
    description: 'Estética underground, texturas corrosivas, tipografía ruda e ilustraciones de moda urbana contemporánea.',
    idealTechnique: 'Serigrafía Corrosiva / DTF',
    colorApproach: 'Monocromo o duotono crudo'
  },
  {
    id: 'bordado_3d',
    name: 'Simulación Parche Bordado',
    badge: 'Bordado',
    description: 'Textura de puntadas de hilo visibles, ribete perimetral satinado y volumen 3D para gorras o pecheras.',
    idealTechnique: 'Bordado Computarizado',
    colorApproach: 'Hilos metálicos y poliéster'
  },
  {
    id: 'acuarela_textil',
    name: 'Acuarela Textil Fluida',
    badge: 'Acuarela',
    description: 'Transiciones suaves de pigmento, salpicaduras artísticas y transparencias ideales para prendas claras.',
    idealTechnique: 'Sublimación / DTG',
    colorApproach: 'Gradientes continuos'
  },
  {
    id: 'cyberpunk_neon',
    name: 'Cyberpunk Neón Glow',
    badge: 'Cyber',
    description: 'Contornos fluorescentes cian y magenta sobre fondos oscuros, estética futurista de alta intensidad.',
    idealTechnique: 'DTF / Tintas Neón Flúor',
    colorApproach: 'Flúor reactivo UV'
  },
  {
    id: 'pop_art_comic',
    name: 'Pop Art & Cómic Retro',
    badge: 'Cómic',
    description: 'Puntos Ben-Day estilo Lichtenstein, viñetas gruesas negras e impacto de historieta clásica.',
    idealTechnique: 'Serigrafía Cuatricromía',
    colorApproach: 'Puntos primarios CMY+K'
  }
];

export async function removeBackgroundWithCanvas(
  sourceImageUrl: string,
  tolerance: number = 28,
  targetChroma: { r: number; g: number; b: number } = { r: 255, g: 255, b: 255 }
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(sourceImageUrl);
        }

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        const cornerSamples = [
          { r: data[0], g: data[1], b: data[2] },
          { r: data[(canvas.width - 1) * 4], g: data[(canvas.width - 1) * 4 + 1], b: data[(canvas.width - 1) * 4 + 2] },
          { r: data[(canvas.height - 1) * canvas.width * 4], g: data[(canvas.height - 1) * canvas.width * 4 + 1], b: data[(canvas.height - 1) * canvas.width * 4 + 2] }
        ];

        let bgR = targetChroma.r;
        let bgG = targetChroma.g;
        let bgB = targetChroma.b;
        const avgCornerBrightness = cornerSamples.reduce((acc, c) => acc + (c.r + c.g + c.b) / 3, 0) / cornerSamples.length;
        if (avgCornerBrightness > 210) {
          bgR = Math.round(cornerSamples.reduce((acc, c) => acc + c.r, 0) / cornerSamples.length);
          bgG = Math.round(cornerSamples.reduce((acc, c) => acc + c.g, 0) / cornerSamples.length);
          bgB = Math.round(cornerSamples.reduce((acc, c) => acc + c.b, 0) / cornerSamples.length);
        }

        const maxDist = (tolerance / 100) * 441.67;
        const featherDist = maxDist * 0.45;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const dist = Math.sqrt(
            Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2)
          );

          if (dist < maxDist - featherDist) {
            data[i + 3] = 0;
          } else if (dist < maxDist) {
            const alphaFactor = (dist - (maxDist - featherDist)) / featherDist;
            data[i + 3] = Math.round(data[i + 3] * Math.max(0, Math.min(1, alphaFactor)));
          }
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        console.warn('Canvas remove background fallback:', err);
        resolve(sourceImageUrl);
      }
    };
    img.onerror = () => resolve(sourceImageUrl);
    img.src = sourceImageUrl;
  });
}

export async function enhanceImageQuality(
  sourceImageUrl: string,
  sharpnessLevel: number = 40,
  contrastBoost: number = 15
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(sourceImageUrl);

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        const factor = (259 * (contrastBoost + 255)) / (255 * (259 - contrastBoost));
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] > 0) {
            data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
            data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
            data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
          }
        }

        if (sharpnessLevel > 0) {
          const w = canvas.width;
          const h = canvas.height;
          const copy = new Uint8ClampedArray(data);
          const strength = (sharpnessLevel / 100) * 0.8;

          for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
              const idx = (y * w + x) * 4;
              if (copy[idx + 3] === 0) continue;

              for (let c = 0; c < 3; c++) {
                const center = copy[idx + c];
                const top = copy[((y - 1) * w + x) * 4 + c];
                const bottom = copy[((y + 1) * w + x) * 4 + c];
                const left = copy[(y * w + (x - 1)) * 4 + c];
                const right = copy[(y * w + (x + 1)) * 4 + c];

                const laplacian = 5 * center - top - bottom - left - right;
                const sharpened = center + (laplacian - center) * strength;
                data[idx + c] = Math.min(255, Math.max(0, Math.round(sharpened)));
              }
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        resolve(sourceImageUrl);
      }
    };
    img.onerror = () => resolve(sourceImageUrl);
    img.src = sourceImageUrl;
  });
}

export function generateSyntheticTextileSVG(
  prompt: string,
  category: AIDesignCategory,
  style: AITextileStyle,
  colors: string[]
): string {
  const c1 = colors[0] || '#000000';
  const c2 = colors[1] || '#F59E0B';
  const c3 = colors[2] || '#DC2626';
  const c4 = colors[3] || '#FFFFFF';

  const cleanPrompt = prompt.trim().toUpperCase();
  const titleWord = cleanPrompt.split(' ').slice(0, 3).join(' ') || 'ESTAMPAPRO';
  const secondaryWord = cleanPrompt.includes('LEÓN') || cleanPrompt.includes('LEON') ? 'PREDATOR DIVISION' :
                       cleanPrompt.includes('ÁGUILA') || cleanPrompt.includes('AGUILA') ? 'APEX FLIGHT' :
                       cleanPrompt.includes('CLUB') || cleanPrompt.includes('DEPOR') ? 'CHAMPIONSHIP 2026' :
                       cleanPrompt.includes('CAFE') || cleanPrompt.includes('CAFÉ') ? 'SPECIALTY ROAST' :
                       category === 'deportivos' ? 'ATHLETICS DEPT' :
                       category === 'empresariales' ? 'PREMIUM BRAND' :
                       category === 'infantiles' ? 'HAPPY FRIENDS' :
                       category === 'musicales' ? 'SOUND RECORDINGS' :
                       category === 'artisticos' ? 'ATELIER TEXTILE' :
                       category === 'tipograficos' ? 'STAY AUTHENTIC' : 'LIMITED EDITION';

  let centerGraphic = '';

  if (category === 'deportivos' || cleanPrompt.includes('LEÓN') || cleanPrompt.includes('LEON')) {
    centerGraphic = `
      <polygon points="400,90 620,170 570,510 400,690 230,510 180,170" fill="${c1}" stroke="${c2}" stroke-width="12" stroke-linejoin="round" />
      <polygon points="400,120 590,190 545,490 400,650 255,490 210,190" fill="none" stroke="${c2}" stroke-width="4" stroke-dasharray="14 8" opacity="0.7" />
      <g transform="translate(400, 380) scale(1.15)">
        <polygon points="0,-160 -90,-80 -140,-130 -110,-10 -160,50 -90,70 -130,150 -50,140 0,200 50,140 130,150 90,70 160,50 110,-10 140,-130 90,-80" fill="${c2}" />
        <polygon points="0,-140 -70,-70 -110,-10 -70,50 0,170 70,50 110,-10 70,-70" fill="${c1}" stroke="${c2}" stroke-width="6" />
        <polygon points="-40,-10 -10,-10 -25,-25" fill="${c3}" />
        <polygon points="40,-10 10,-10 25,-25" fill="${c3}" />
        <polygon points="0,40 -25,10 25,10" fill="${c2}" />
        <line x1="0" y1="40" x2="0" y2="70" stroke="${c2}" stroke-width="6" stroke-linecap="round" />
        <line x1="-35" y1="70" x2="35" y2="70" stroke="${c2}" stroke-width="6" stroke-linecap="round" />
        <polygon points="-70,90 -20,120 -50,140" fill="${c2}" opacity="0.9" />
        <polygon points="70,90 20,120 50,140" fill="${c2}" opacity="0.9" />
      </g>
      <g transform="translate(400, 160)">
        <polygon points="0,-22 7,-7 22,-7 11,3 15,18 0,9 -15,18 -11,3 -22,-7 -7,-7" fill="${c2}" />
        <polygon points="-60,-18 -54,-5 -40,-5 -50,4 -46,17 -60,9 -74,17 -70,4 -80,-5 -66,-5" fill="${c2}" opacity="0.8" />
        <polygon points="60,-18 66,-5 80,-5 70,4 74,17 60,9 46,17 50,4 40,-5 54,-5" fill="${c2}" opacity="0.8" />
      </g>
    `;
  } else if (category === 'musicales' || cleanPrompt.includes('ROCK') || cleanPrompt.includes('MUSICA')) {
    centerGraphic = `
      <circle cx="400" cy="380" r="240" fill="${c1}" stroke="${c2}" stroke-width="8" />
      <circle cx="400" cy="380" r="210" fill="none" stroke="${c2}" stroke-width="2" stroke-dasharray="12 6" opacity="0.4" />
      <circle cx="400" cy="380" r="180" fill="none" stroke="${c2}" stroke-width="2" opacity="0.3" />
      <circle cx="400" cy="380" r="150" fill="none" stroke="${c2}" stroke-width="2" opacity="0.3" />
      <circle cx="400" cy="380" r="80" fill="${c3}" stroke="${c4}" stroke-width="4" />
      <g transform="translate(400, 380) scale(1.1)">
        <path d="M -130,-20 C -130,-140 130,-140 130,-20" fill="none" stroke="${c2}" stroke-width="18" stroke-linecap="round" />
        <rect x="-150" y="-30" width="30" height="70" rx="10" fill="${c3}" stroke="${c2}" stroke-width="6" />
        <rect x="120" y="-30" width="30" height="70" rx="10" fill="${c3}" stroke="${c2}" stroke-width="6" />
        <path d="M -70,-30 C -70,-110 70,-110 70,-30 C 70,20 50,50 40,80 L -40,80 C -50,50 -70,20 -70,-30 Z" fill="${c4}" stroke="${c1}" stroke-width="8" />
        <circle cx="-30" cy="-10" r="20" fill="${c1}" />
        <circle cx="30" cy="-10" r="20" fill="${c1}" />
        <polygon points="0,20 -10,35 10,35" fill="${c1}" />
        <rect x="-30" y="55" width="12" height="20" rx="3" fill="${c4}" stroke="${c1}" stroke-width="4" />
        <rect x="-15" y="55" width="12" height="20" rx="3" fill="${c4}" stroke="${c1}" stroke-width="4" />
        <rect x="0" y="55" width="12" height="20" rx="3" fill="${c4}" stroke="${c1}" stroke-width="4" />
        <rect x="15" y="55" width="12" height="20" rx="3" fill="${c4}" stroke="${c1}" stroke-width="4" />
      </g>
    `;
  } else if (category === 'artisticos' || category === 'minimalistas') {
    centerGraphic = `
      <circle cx="400" cy="380" r="220" fill="${c2}" opacity="0.15" />
      <circle cx="400" cy="380" r="190" fill="none" stroke="${c2}" stroke-width="4" stroke-dasharray="8 6" />
      <path d="M 260,460 C 220,380 230,280 320,230 C 330,320 280,410 260,460 Z" fill="${c3}" opacity="0.8" />
      <path d="M 540,460 C 580,380 570,280 480,230 C 470,320 520,410 540,460 Z" fill="${c3}" opacity="0.8" />
      <path d="M 360,250 C 370,230 430,230 440,260 C 450,290 420,310 400,320 L 400,370 C 420,370 435,385 410,400 C 390,405 380,420 400,430 C 420,440 400,460 370,470 C 340,460 330,420 340,390 C 320,370 310,330 330,300 C 350,280 350,260 360,250 Z" 
        fill="none" stroke="${c1}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M 405,290 C 415,280 435,280 445,290" fill="none" stroke="${c1}" stroke-width="8" stroke-linecap="round" />
      <circle cx="425" cy="287" r="4" fill="${c1}" />
    `;
  } else if (category === 'infantiles') {
    centerGraphic = `
      <ellipse cx="400" cy="380" rx="230" ry="80" fill="none" stroke="${c2}" stroke-width="8" transform="rotate(-20 400 380)" />
      <circle cx="400" cy="380" r="160" fill="${c1}" />
      <polygon points="220,240 225,255 240,255 228,265 232,280 220,270 208,280 212,265 200,255 215,255" fill="${c2}" />
      <polygon points="570,260 575,275 590,275 578,285 582,300 570,290 558,300 562,285 550,275 565,275" fill="${c3}" />
      <polygon points="240,490 243,500 255,500 245,508 248,518 240,510 232,518 235,508 225,500 237,500" fill="${c4}" />
      <circle cx="400" cy="360" r="115" fill="${c4}" stroke="${c2}" stroke-width="10" />
      <ellipse cx="400" cy="360" rx="85" ry="70" fill="${c2}" />
      <path d="M 350,330 C 370,320 410,320 440,335 C 430,345 380,340 350,330 Z" fill="${c4}" opacity="0.8" />
      <circle cx="310" cy="275" r="35" fill="${c4}" stroke="${c2}" stroke-width="8" />
      <circle cx="490" cy="275" r="35" fill="${c4}" stroke="${c2}" stroke-width="8" />
      <circle cx="310" cy="275" r="18" fill="${c3}" />
      <circle cx="490" cy="275" r="18" fill="${c3}" />
      <circle cx="380" cy="365" r="10" fill="${c1}" />
      <circle cx="420" cy="365" r="10" fill="${c1}" />
      <ellipse cx="400" cy="385" rx="14" ry="9" fill="${c3}" />
      <path d="M 390,395 Q 400,405 410,395" fill="none" stroke="${c1}" stroke-width="4" stroke-linecap="round" />
    `;
  } else {
    centerGraphic = `
      <circle cx="400" cy="380" r="230" fill="${c1}" stroke="${c2}" stroke-width="12" />
      <circle cx="400" cy="380" r="200" fill="none" stroke="${c2}" stroke-width="4" stroke-dasharray="14 10" />
      <g stroke="${c2}" stroke-width="6" fill="none">
        <path d="M 230,420 C 220,300 280,220 370,180" />
        <path d="M 570,420 C 580,300 520,220 430,180" />
        <ellipse cx="250" cy="370" rx="18" ry="8" transform="rotate(-30 250 370)" fill="${c2}" />
        <ellipse cx="280" cy="310" rx="18" ry="8" transform="rotate(-45 280 310)" fill="${c2}" />
        <ellipse cx="325" cy="250" rx="18" ry="8" transform="rotate(-60 325 250)" fill="${c2}" />
        <ellipse cx="550" cy="370" rx="18" ry="8" transform="rotate(30 550 370)" fill="${c2}" />
        <ellipse cx="520" cy="310" rx="18" ry="8" transform="rotate(45 520 310)" fill="${c2}" />
        <ellipse cx="475" cy="250" rx="18" ry="8" transform="rotate(60 475 250)" fill="${c2}" />
      </g>
      <polygon points="400,240 490,380 400,500 310,380" fill="${c3}" stroke="${c4}" stroke-width="6" />
      <polygon points="400,270 460,380 400,470 340,380" fill="${c1}" stroke="${c2}" stroke-width="4" />
      <text x="400" y="415" font-family="'JetBrains Mono', 'Impact', sans-serif" font-size="95" font-weight="900" fill="${c2}" text-anchor="middle">
        ${titleWord.charAt(0) || 'E'}
      </text>
    `;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
      <defs>
        <path id="curveTop" d="M 160,200 Q 400,110 640,200" fill="none" />
        <path id="curveBottom" d="M 160,650 Q 400,740 640,650" fill="none" />
      </defs>
      ${centerGraphic}
      <path d="M 150,150 L 650,150 L 620,210 L 180,210 Z" fill="${c2}" stroke="${c1}" stroke-width="5" />
      <text font-family="'Plus Jakarta Sans', sans-serif" font-size="34" font-weight="900" letter-spacing="4" fill="${c1}">
        <textPath href="#curveTop" startOffset="50%" text-anchor="middle">
          ${titleWord}
        </textPath>
      </text>
      <path d="M 190,640 L 610,640 L 635,700 L 165,700 Z" fill="${c1}" stroke="${c2}" stroke-width="6" />
      <text font-family="'JetBrains Mono', monospace" font-size="24" font-weight="800" letter-spacing="6" fill="${c2}">
        <textPath href="#curveBottom" startOffset="50%" text-anchor="middle">
          ★ ${secondaryWord} ★
        </textPath>
      </text>
    </svg>
  `.trim();

  const encoded = encodeURIComponent(svg);
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

export function generateDesignVariations(baseItem: AIGeneratedItem): AIGeneratedItem[] {
  const currentCategory = AI_CATEGORIES.find((c) => c.id === baseItem.category) || AI_CATEGORIES[0];
  const palettes = currentCategory.suggestedPalettes;

  return [1, 2, 3].map((num) => {
    const palette = palettes[(num) % palettes.length] || palettes[0];
    const newStyle = AI_STYLES[(num * 2) % AI_STYLES.length].id;
    const variationPrompt = `${baseItem.prompt} [Variante ${num}: ${palette.name} - Estilo ${newStyle}]`;
    const newSvg = generateSyntheticTextileSVG(variationPrompt, baseItem.category, newStyle, palette.colors);

    return {
      id: `ai-var-${Date.now()}-${num}`,
      title: `${baseItem.title} (Var. ${num})`,
      prompt: variationPrompt,
      category: baseItem.category,
      style: newStyle,
      paletteName: palette.name,
      colors: palette.colors,
      imageUrl: newSvg,
      hasTransparentBg: true,
      aspectRatio: '1:1',
      recommendedTechnique: baseItem.recommendedTechnique,
      printWidthCm: baseItem.printWidthCm,
      printHeightCm: baseItem.printHeightCm,
      dpi: 300,
      createdAt: 'Ahora mismo',
      timestamp: Date.now() + num,
      favorite: false,
      source: 'ai_variation',
      separationAdvice: `Trama a 55 LPI con base blanca al 85%. Paleta calibrada: ${palette.name}.`
    };
  });
}
