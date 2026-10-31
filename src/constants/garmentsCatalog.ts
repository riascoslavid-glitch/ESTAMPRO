import { GarmentItem, GarmentMainCategory, GarmentSubcategory } from '../types';

export interface CategoryMetadata {
  id: GarmentMainCategory;
  label: string;
  subcategories: { id: GarmentSubcategory; label: string }[];
}

export const GARMENT_CATEGORIES_METADATA: CategoryMetadata[] = [
  {
    id: 'camisetas',
    label: 'Camisetas',
    subcategories: [
      { id: 'cuello_redondo', label: 'Cuello redondo' },
      { id: 'cuello_v', label: 'Cuello V' },
      { id: 'oversize', label: 'Oversize' },
      { id: 'deportivas', label: 'Deportivas' },
      { id: 'manga_corta', label: 'Manga corta' },
      { id: 'manga_larga', label: 'Manga larga' },
      { id: 'polo', label: 'Polo' },
      { id: 'infantil', label: 'Infantil' },
      { id: 'bebe', label: 'Bebé' }
    ]
  },
  {
    id: 'busos',
    label: 'Busos y Sudaderas',
    subcategories: [
      { id: 'hoodie', label: 'Hoodie con capucha' },
      { id: 'cremallera', label: 'Cremallera (Zip)' },
      { id: 'cuello_redondo', label: 'Cuello redondo (Crewneck)' },
      { id: 'deportivos', label: 'Deportivos' },
      { id: 'oversize', label: 'Oversize' }
    ]
  },
  {
    id: 'otras_prendas',
    label: 'Otras Prendas',
    subcategories: [
      { id: 'camisas', label: 'Camisas' },
      { id: 'chaquetas', label: 'Chaquetas' },
      { id: 'chalecos', label: 'Chalecos' },
      { id: 'uniformes', label: 'Uniformes' },
      { id: 'pantalones', label: 'Pantalones' },
      { id: 'pantalonetas', label: 'Pantalonetas' },
      { id: 'shorts', label: 'Shorts' },
      { id: 'ropa_deportiva', label: 'Ropa deportiva' },
      { id: 'ropa_laboral', label: 'Ropa laboral' },
      { id: 'delantales', label: 'Delantales' }
    ]
  },
  {
    id: 'accesorios',
    label: 'Accesorios',
    subcategories: [
      { id: 'gorras', label: 'Gorras' },
      { id: 'sombreros', label: 'Sombreros' },
      { id: 'bolsos', label: 'Bolsos' },
      { id: 'morrales', label: 'Morrales' },
      { id: 'mochilas', label: 'Mochilas' },
      { id: 'toallas', label: 'Toallas' },
      { id: 'cojines', label: 'Cojines' },
      { id: 'otros', label: 'Otros textiles' }
    ]
  }
];

export const INITIAL_GARMENTS_CATALOG: GarmentItem[] = [
  {
    id: 'garm-tshirt-heavyweight',
    name: 'Camiseta Heavyweight Boxy Fit (240g)',
    mainCategory: 'camisetas',
    subcategory: 'oversize',
    photoUrl: '/src/assets/images/garment_tshirt_heavyweight_1793416398987.jpg',
    model3DId: 'model_tshirt_boxy_3d',
    model3DName: 'T-Shirt Boxy Fit 3D (.GLB)',
    materialId: 'mat_algodon_heavyweight',
    materialName: 'Algodón Rústico Heavyweight',
    composition: '100% Algodón ring-spun peinado 240 GSM',
    weightGsm: '240 GSM',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Negro Profundo', hex: '#0a0a0c' },
      { name: 'Blanco Crudo', hex: '#f4f3ef' },
      { name: 'Gris Carbón', hex: '#27272a' },
      { name: 'Verde Militar', hex: '#3f4f34' }
    ],
    printableAreas: [
      'Pecho Central (30x40 cm)',
      'Espalda Completa (35x45 cm)',
      'Bolsillo Izquierdo (10x10 cm)',
      'Manga Izquierda (8x25 cm)',
      'Manga Derecha (8x25 cm)'
    ],
    measurements: [
      { size: 'S', chestCm: 54, lengthCm: 71, sleeveCm: 22 },
      { size: 'M', chestCm: 57, lengthCm: 74, sleeveCm: 23 },
      { size: 'L', chestCm: 60, lengthCm: 77, sleeveCm: 24 },
      { size: 'XL', chestCm: 63, lengthCm: 80, sleeveCm: 25 },
      { size: '2XL', chestCm: 66, lengthCm: 83, sleeveCm: 26 }
    ],
    compatibleTechniques: ['DTF', 'Serigrafía Plastisol', 'Serigrafía Base Agua', 'Bordado'],
    basePurchasePrice: 6.80,
    customizableParts: [
      { partId: 'cuerpo', partName: 'Cuerpo / Torso', colorHex: '#0a0a0c' },
      { partId: 'mangas', partName: 'Mangas', colorHex: '#0a0a0c' },
      { partId: 'cuello', partName: 'Cuello Rib 1x1', colorHex: '#0a0a0c' }
    ],
    notes: 'Prenda insignia para marcas streetwear. Cuello alto y grueso de 3 cm sin deformación al lavado.'
  },
  {
    id: 'garm-hoodie-french-terry',
    name: 'Buso Hoodie Oversize French Terry (400g)',
    mainCategory: 'busos',
    subcategory: 'hoodie',
    photoUrl: '/src/assets/images/garment_hoodie_french_terry_1793416400113.jpg',
    model3DId: 'model_hoodie_oversize_3d',
    model3DName: 'Hoodie Drop Shoulder 3D (.GLB)',
    materialId: 'mat_french_terry',
    materialName: 'Franela French Terry',
    composition: '80% Algodón / 20% Poliéster con felpa interior 400 GSM',
    weightGsm: '400 GSM',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Beige Arena Warm', hex: '#d5c7b3' },
      { name: 'Negro Carbón', hex: '#18181b' },
      { name: 'Gris Melange', hex: '#71717a' },
      { name: 'Verde Olivo', hex: '#44513e' }
    ],
    printableAreas: [
      'Pecho Frontal (28x32 cm)',
      'Espalda Maxi (38x48 cm)',
      'Capucha Lateral (12x12 cm)',
      'Manga Izquierda (8x35 cm)',
      'Manga Derecha (8x35 cm)'
    ],
    measurements: [
      { size: 'S', chestCm: 60, lengthCm: 68, sleeveCm: 61 },
      { size: 'M', chestCm: 63, lengthCm: 71, sleeveCm: 63 },
      { size: 'L', chestCm: 66, lengthCm: 74, sleeveCm: 65 },
      { size: 'XL', chestCm: 69, lengthCm: 77, sleeveCm: 67 },
      { size: '2XL', chestCm: 72, lengthCm: 80, sleeveCm: 69 }
    ],
    compatibleTechniques: ['DTF', 'Bordado Computarizado', 'Serigrafía Plastisol'],
    basePurchasePrice: 15.50,
    customizableParts: [
      { partId: 'cuerpo', partName: 'Cuerpo Principal', colorHex: '#d5c7b3' },
      { partId: 'mangas', partName: 'Mangas', colorHex: '#d5c7b3' },
      { partId: 'capucha', partName: 'Capucha Exterior', colorHex: '#d5c7b3' },
      { partId: 'cordones', partName: 'Cordones de Ajuste', colorHex: '#f4f3ef' },
      { partId: 'bolsillo', partName: 'Bolsillo Canguro', colorHex: '#d5c7b3' }
    ],
    notes: 'Capucha doble forrada sin ojalillos metálicos, cordones de algodón al tono y bolsillo canguro reforzado con presillas de seguridad.'
  },
  {
    id: 'garm-cap-trucker',
    name: 'Gorra Trucker 5 Paneles Estructurada',
    mainCategory: 'accesorios',
    subcategory: 'gorras',
    photoUrl: '/src/assets/images/garment_trucker_cap_1793416400133.jpg',
    model3DId: 'model_trucker_cap_3d',
    model3DName: 'Gorra Trucker 5 Paneles 3D (.GLB)',
    materialId: 'mat_algodon_peinado',
    materialName: 'Algodón Sarga + Malla Poliéster',
    composition: 'Frente 100% Algodón sarga con entretela / Malla 100% Poliéster transpirable',
    weightGsm: '120 g',
    sizes: ['Única (Ajustable Snapback 56-62 cm)'],
    colors: [
      { name: 'Total Black', hex: '#0a0a0c' },
      { name: 'Frente Blanco / Malla Negra', hex: '#f4f3ef' },
      { name: 'Azul Marino Clásico', hex: '#0f172a' },
      { name: 'Rojo Carmesí', hex: '#dc2626' }
    ],
    printableAreas: [
      'Frente Central (12x6.5 cm)',
      'Lateral Izquierdo (6x4 cm)',
      'Lateral Derecho (6x4 cm)',
      'Arco Trasero (8x2.5 cm)'
    ],
    measurements: [
      { size: 'Única', chestCm: 58, lengthCm: 16 }
    ],
    compatibleTechniques: ['Bordado 3D / Relieve', 'DTF Textil', 'Parches Termoadhesivos'],
    basePurchasePrice: 3.90,
    customizableParts: [
      { partId: 'frente', partName: 'Panel Frontal', colorHex: '#0a0a0c' },
      { partId: 'visera', partName: 'Visera Semi-Curva', colorHex: '#0a0a0c' },
      { partId: 'malla', partName: 'Malla Trasera', colorHex: '#0a0a0c' },
      { partId: 'boton', partName: 'Botón Superior', colorHex: '#0a0a0c' }
    ],
    notes: 'Frente continuo sin costura vertical, optimizado para bordado en máquina de gorras y parches DTF sin deformación.'
  },
  {
    id: 'garm-camisa-oxford',
    name: 'Camisa Oxford Manga Larga Corporativa',
    mainCategory: 'otras_prendas',
    subcategory: 'camisas',
    photoUrl: '/src/assets/images/hero_textile_studio_1793415151404.jpg',
    model3DId: 'model_shirt_oxford_3d',
    model3DName: 'Camisa Oxford 3D (.GLB)',
    materialId: 'mat_polycotton_5050',
    materialName: 'Tela Oxford Poly-Cotton',
    composition: '65% Poliéster / 35% Algodón hilado 160 GSM',
    weightGsm: '160 GSM',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    colors: [
      { name: 'Blanco Puro Óptico', hex: '#ffffff' },
      { name: 'Celeste Cielo Claro', hex: '#bae6fd' },
      { name: 'Azul Marino Clásico', hex: '#0f172a' }
    ],
    printableAreas: [
      'Bolsillo / Pecho Izquierdo (9x9 cm)',
      'Espalda Superior (25x10 cm)',
      'Cuello Posterior (7x3 cm)',
      'Puño Izquierdo (5x3 cm)'
    ],
    measurements: [
      { size: 'S', chestCm: 52, lengthCm: 76, sleeveCm: 63 },
      { size: 'M', chestCm: 55, lengthCm: 78, sleeveCm: 64 },
      { size: 'L', chestCm: 58, lengthCm: 80, sleeveCm: 65 },
      { size: 'XL', chestCm: 61, lengthCm: 82, sleeveCm: 66 }
    ],
    compatibleTechniques: ['Bordado Computarizado', 'DTF Textil'],
    basePurchasePrice: 11.20,
    customizableParts: [
      { partId: 'cuerpo', partName: 'Cuerpo Camisa', colorHex: '#ffffff' },
      { partId: 'cuello', partName: 'Cuello & Pie de Cuello', colorHex: '#ffffff' },
      { partId: 'punos', partName: 'Puños', colorHex: '#ffffff' }
    ],
    notes: 'Tratamiento fácil planchado (Easy-Care), botones nacarados cosidos en cruz con refuerzo en cuello y canesú.'
  },
  {
    id: 'garm-delantal-barista',
    name: 'Delantal Barista & Taller Lona Reforzada',
    mainCategory: 'otras_prendas',
    subcategory: 'delantales',
    photoUrl: '/src/assets/images/hero_textile_studio_1793415151404.jpg',
    model3DId: 'model_apron_canvas_3d',
    model3DName: 'Delantal de Taller 3D (.GLB)',
    materialId: 'mat_algodon_heavyweight',
    materialName: 'Lona de Algodón Pesada 320g',
    composition: '100% Algodón lona rústica con tirantes cruzados y remaches de bronce',
    weightGsm: '320 GSM',
    sizes: ['Única (85x68 cm ajustable)'],
    colors: [
      { name: 'Negro Carbón', hex: '#18181b' },
      { name: 'Café Espresso', hex: '#34261e' },
      { name: 'Verde Olivo Militar', hex: '#44513e' }
    ],
    printableAreas: [
      'Pechera Superior (20x20 cm)',
      'Bolsillo Frontal (18x12 cm)',
      'Faldón Inferior (25x25 cm)'
    ],
    measurements: [
      { size: 'Única', chestCm: 68, lengthCm: 85 }
    ],
    compatibleTechniques: ['Serigrafía Plastisol', 'DTF Textil', 'Bordado Computarizado', 'Parches de Cuero Grabado'],
    basePurchasePrice: 8.90,
    customizableParts: [
      { partId: 'cuerpo', partName: 'Lona Principal', colorHex: '#18181b' },
      { partId: 'bolsillos', partName: 'Bolsillo Multiherramientas', colorHex: '#34261e' },
      { partId: 'tirantes', partName: 'Tirantes Cruzados', colorHex: '#d5c7b3' }
    ],
    notes: 'Diseño ergonómico con tirantes cruzados a la espalda que evitan el cansancio en el cuello durante jornadas de estampado.'
  },
  {
    id: 'garm-camiseta-dryfit',
    name: 'Camiseta Deportiva Transpirable Dry-Fit',
    mainCategory: 'camisetas',
    subcategory: 'deportivas',
    photoUrl: '/src/assets/images/garment_tshirt_heavyweight_1793416398987.jpg',
    model3DId: 'model_tshirt_sport_3d',
    model3DName: 'Camiseta Deportiva 3D (.GLB)',
    materialId: 'mat_poliester_dryfit',
    materialName: 'Poliéster Dry-Fit',
    composition: '100% Poliéster microfibra con control de humedad y costuras planas anti-roce',
    weightGsm: '145 GSM',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Blanco Óptico Sublimable', hex: '#ffffff' },
      { name: 'Azul Royal Intenso', hex: '#1d4ed8' },
      { name: 'Rojo Carmesí', hex: '#dc2626' },
      { name: 'Amarillo Neón', hex: '#facc15' }
    ],
    printableAreas: [
      'Frente Completo (Sublimación all-over)',
      'Pecho Izquierdo Escudo (9x9 cm)',
      'Espalda Número y Nombre (28x38 cm)',
      'Mangas (8x20 cm)'
    ],
    measurements: [
      { size: 'S', chestCm: 50, lengthCm: 70 },
      { size: 'M', chestCm: 53, lengthCm: 72 },
      { size: 'L', chestCm: 56, lengthCm: 74 },
      { size: 'XL', chestCm: 59, lengthCm: 76 }
    ],
    compatibleTechniques: ['Sublimación Textil', 'DTF con Polvo Anti-Sublimación', 'Vinil Textil Elástico'],
    basePurchasePrice: 4.50,
    customizableParts: [
      { partId: 'cuerpo', partName: 'Panel Frontal & Espalda', colorHex: '#ffffff' },
      { partId: 'mangas', partName: 'Mangas Ranglan', colorHex: '#1d4ed8' },
      { partId: 'cuello', partName: 'Cuello V Deportivo', colorHex: '#0f172a' }
    ],
    notes: 'Tejido de poro abierto que expulsa el sudor. Acepta sublimación por metro o por piezas pre-cortadas.'
  }
];

export const GARMENTS_CATALOG = INITIAL_GARMENTS_CATALOG;
