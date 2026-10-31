import { PrintingTechnique } from '../types';
import { TECHNIQUES_ENCYCLOPEDIA } from './techniquesEncyclopedia';

export { TECHNIQUES_ENCYCLOPEDIA };

export const PRINTING_TECHNIQUES: PrintingTechnique[] = TECHNIQUES_ENCYCLOPEDIA.map((item) => {
  let setupComplexity: 'Baja' | 'Media' | 'Alta' = 'Media';
  if (item.comparisonMetrics.operationalComplexity.includes('Baja')) setupComplexity = 'Baja';
  else if (item.comparisonMetrics.operationalComplexity.includes('Alta')) setupComplexity = 'Alta';

  let productionSpeed: 'Rápida' | 'Media' | 'Industrial' = 'Media';
  if (item.defaultParameters.speed.includes('900') || item.defaultParameters.speed.includes('industrial')) {
    productionSpeed = 'Industrial';
  } else if (item.defaultParameters.speed.includes('m²/hora') || item.defaultParameters.speed.includes('minuto')) {
    productionSpeed = 'Rápida';
  }

  const minQuantity = item.comparisonMetrics.quantityFlexibilityScore >= 9 ? 1 : (item.comparisonMetrics.quantityFlexibilityScore >= 7 ? 12 : 30);
  const durabilityRating = Math.max(1, Math.min(5, Math.round(item.comparisonMetrics.durabilityScore / 2)));

  return {
    id: item.id,
    name: item.name,
    shortDesc: item.shortDesc,
    fullDesc: item.fullDesc,
    idealFor: item.compatibleFabrics.map(f => f.fabric).slice(0, 3).join(', ') + ' - ' + item.shortDesc,
    recommendedFabrics: item.compatibleFabrics.map((f) => f.fabric),
    minQuantity,
    durabilityRating,
    colorGamut: item.designPreparation.colorModes.join(' / '),
    setupComplexity,
    productionSpeed,
    equipmentRequired: item.machines.map((m) => m.type).concat(item.tools.slice(0, 2))
  };
});

export interface BlankGarmentPreset {
  id: string;
  name: string;
  category: string;
  material: string;
  availableColors: { name: string; hex: string }[];
  printableAreas: string[];
}

export const GARMENT_CATALOG: BlankGarmentPreset[] = [
  {
    id: 'tshirt_heavyweight',
    name: 'Polera Heavyweight Boxy Fit (240g)',
    category: 'remeras_camisetas',
    material: '100% Algodón peinado ring-spun 240 GSM',
    availableColors: [
      { name: 'Negro Profundo', hex: '#0f172a' },
      { name: 'Blanco Crudo', hex: '#f8fafc' },
      { name: 'Gris Melange', hex: '#64748b' },
      { name: 'Verde Militar', hex: '#3f4f34' },
      { name: 'Café Espresso', hex: '#3e2723' }
    ],
    printableAreas: ['Pecho centro (30x40cm)', 'Espalda completa (35x45cm)', 'Bolsillo izquierdo (10x10cm)', 'Mangas (8x30cm)']
  },
  {
    id: 'hoodie_oversize',
    name: 'Hoodie Oversize French Terry (400g)',
    category: 'hoodies_polerones',
    material: '80% Algodón / 20% Poliéster con felpa interior 400 GSM',
    availableColors: [
      { name: 'Negro Carbón', hex: '#18181b' },
      { name: 'Beige Arena', hex: '#d6c7b2' },
      { name: 'Azul Marino Profundo', hex: '#1e293b' },
      { name: 'Verde Olivo', hex: '#4a5d4e' }
    ],
    printableAreas: ['Pecho frente (28x35cm)', 'Espalda maxi (38x48cm)', 'Manga lateral', 'Capucha lateral']
  },
  {
    id: 'cap_trucker',
    name: 'Gorra Trucker 5 Paneles con Malla',
    category: 'gorras_headwear',
    material: 'Frente de algodón estructurado con visera semi-curva y malla posterior',
    availableColors: [
      { name: 'Todo Negro', hex: '#111827' },
      { name: 'Frente Blanco / Malla Negra', hex: '#e2e8f0' },
      { name: 'Azul Real', hex: '#1d4ed8' },
      { name: 'Burdeo', hex: '#881337' }
    ],
    printableAreas: ['Frente central (12x6.5cm)', 'Laterales (6x4cm)']
  },
  {
    id: 'tote_bag_canvas',
    name: 'Tote Bag Lona Reforzada (320g)',
    category: 'bolsos_accesorios',
    material: '100% Algodón lona cruda resistente',
    availableColors: [
      { name: 'Crudo Natural', hex: '#fdfbf7' },
      { name: 'Negro Intenso', hex: '#0a0a0a' },
      { name: 'Verde Botella', hex: '#1e3a2f' }
    ],
    printableAreas: ['Frente (28x32cm)', 'Reverso (28x32cm)']
  }
];
