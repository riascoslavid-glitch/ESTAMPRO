/**
 * ESTAMPAPRO 360° - Servicio del Portal Comercial y Personalizador de Clientes (Prompt 15)
 * Integrado con Catálogo de Prendas, Motor 3D, Sistema de Pedidos e Inventario.
 * Garantiza privacidad estricta por cliente y persistencia híbrida Firestore + LocalStorage.
 */

import { db, auth } from '../../lib/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import {
  StoreProduct,
  CatalogDesign,
  ClientCustomization,
  PrintPlacementConfig,
  PrintPlacementZone,
  VolumePriceTier,
  StoreOrderRequest
} from '../../types/store';
import { adminProductionService } from '../admin/adminProductionService';
import { OrderRecord, OrderGarmentSizeBreakdown } from '../../types/adminProduction';

// Claves de almacenamiento local seguro
const LS_STORE_PRODUCTS = 'estampapro_store_products_v1';
const LS_CATALOG_DESIGNS = 'estampapro_store_catalog_designs_v1';
const LS_CLIENT_CUSTOMIZATIONS = 'estampapro_client_customizations_v1';

export const PRINT_PLACEMENTS: Record<PrintPlacementZone, PrintPlacementConfig> = {
  pecho_central: {
    id: 'pecho_central',
    name: 'Pecho Central Grande',
    dimensionsCm: '30 x 40 cm',
    maxDecalScale: 0.38,
    description: 'Ubicación clásica frontal de máxima visibilidad sobre el tórax.',
    defaultPosition3D: [0, 0.42, 0.26],
    defaultRotation3D: [0, 0, 0]
  },
  pecho_izquierdo: {
    id: 'pecho_izquierdo',
    name: 'Pecho Izquierdo / Escudo',
    dimensionsCm: '10 x 10 cm',
    maxDecalScale: 0.16,
    description: 'Logo corporativo, escudo deportivo o detalle minimalista.',
    defaultPosition3D: [-0.17, 0.52, 0.25],
    defaultRotation3D: [0, 0.15, 0]
  },
  espalda_completa: {
    id: 'espalda_completa',
    name: 'Espalda Completa',
    dimensionsCm: '35 x 45 cm',
    maxDecalScale: 0.44,
    description: 'Diseño de gran formato en omóplatos y espalda dorsal.',
    defaultPosition3D: [0, 0.44, -0.26],
    defaultRotation3D: [0, Math.PI, 0]
  },
  manga_izquierda: {
    id: 'manga_izquierda',
    name: 'Manga Izquierda',
    dimensionsCm: '9 x 12 cm',
    maxDecalScale: 0.18,
    description: 'Detalle o insignia de marca en manga izquierda.',
    defaultPosition3D: [-0.48, 0.42, 0.02],
    defaultRotation3D: [0, Math.PI / 2, 0]
  },
  manga_derecha: {
    id: 'manga_derecha',
    name: 'Manga Derecha',
    dimensionsCm: '9 x 12 cm',
    maxDecalScale: 0.18,
    description: 'Detalle o insignia de marca en manga derecha.',
    defaultPosition3D: [0.48, 0.42, 0.02],
    defaultRotation3D: [0, -Math.PI / 2, 0]
  },
  nuca: {
    id: 'nuca',
    name: 'Nuca / Cuello Posterior',
    dimensionsCm: '8 x 5 cm',
    maxDecalScale: 0.12,
    description: 'Logo secundario de autor o detalle en la nuca superior.',
    defaultPosition3D: [0, 0.74, -0.21],
    defaultRotation3D: [0, Math.PI, 0]
  }
};

export const INITIAL_STORE_PRODUCTS: StoreProduct[] = [
  {
    id: 'prod-tshirt-heavyweight',
    garmentId: 'garm-tshirt-heavyweight',
    name: 'Camiseta Heavyweight Boxy Fit (240g)',
    shortDescription: '100% Algodón Peinado Ring-Spun 240 GSM. Caída estructurada boxy fit.',
    description: 'Nuestra prenda insignia para marcas de streetwear. Confeccionada con algodón denso de 240g, cuello acanalado de 2.5cm indeformable, dobles costuras reforzadas y pre-encogido térmico para cero deformación.',
    photoUrl: '/src/assets/images/garment_tshirt_heavyweight_1793416398987.jpg',
    model3DType: 'camiseta_basica',
    category: 'camisetas',
    isPublished: true,
    featured: true,
    basePrice: 14990,
    volumePricing: [
      { minQty: 1, maxQty: 9, discountPercent: 0, unitPrice: 14990 },
      { minQty: 10, maxQty: 24, discountPercent: 15, unitPrice: 12740 },
      { minQty: 25, maxQty: 49, discountPercent: 25, unitPrice: 11240 },
      { minQty: 50, maxQty: 99, discountPercent: 35, unitPrice: 9740 },
      { minQty: 100, discountPercent: 45, unitPrice: 8240 }
    ],
    availableColors: [
      { name: 'Negro Profundo', hex: '#0a0a0c' },
      { name: 'Blanco Crudo', hex: '#f4f3ef' },
      { name: 'Gris Carbón', hex: '#27272a' },
      { name: 'Verde Militar', hex: '#3f4f34' },
      { name: 'Azul Petróleo', hex: '#1e293b' },
      { name: 'Terracota Cálido', hex: '#9a3412' }
    ],
    availableSizes: ['S', 'M', 'L', 'XL', '2XL'],
    measurements: [
      { size: 'S', chestCm: 54, lengthCm: 71, sleeveCm: 22 },
      { size: 'M', chestCm: 57, lengthCm: 74, sleeveCm: 23 },
      { size: 'L', chestCm: 60, lengthCm: 77, sleeveCm: 24 },
      { size: 'XL', chestCm: 63, lengthCm: 80, sleeveCm: 25 },
      { size: '2XL', chestCm: 66, lengthCm: 83, sleeveCm: 26 }
    ],
    composition: '100% Algodón peinado ring-spun',
    weightGsm: '240 GSM',
    defaultTechnique: 'DTF Textil HD',
    stockStatus: 'in_stock',
    totalStock: 480,
    linkedInventoryId: 'inv-prn-01',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-hoodie-french-terry',
    garmentId: 'garm-hoodie-french-terry',
    name: 'Polerón Hoodie French Terry 380g',
    shortDescription: 'French Terry pesado 380 GSM. Capucha doble capa con bolsillo canguro.',
    description: 'Polerón de máxima densidad invernal. Interior en rulo francés no perchado que absorbe el sudor y no genera pelusa. Ojales metálicos mate y cordón grueso de algodón con punteras metálicas.',
    photoUrl: '/src/assets/images/garment_hoodie_french_terry_1793416400113.jpg',
    model3DType: 'hoodie',
    category: 'busos',
    isPublished: true,
    featured: true,
    basePrice: 28990,
    volumePricing: [
      { minQty: 1, maxQty: 9, discountPercent: 0, unitPrice: 28990 },
      { minQty: 10, maxQty: 24, discountPercent: 14, unitPrice: 24900 },
      { minQty: 25, maxQty: 49, discountPercent: 24, unitPrice: 22000 },
      { minQty: 50, maxQty: 99, discountPercent: 34, unitPrice: 19100 },
      { minQty: 100, discountPercent: 42, unitPrice: 16800 }
    ],
    availableColors: [
      { name: 'Negro Profundo', hex: '#121212' },
      { name: 'Gris Jaspe Melange', hex: '#4b5563' },
      { name: 'Crema Arena', hex: '#d6d3d1' },
      { name: 'Verde Bosque Oscuro', hex: '#14532d' },
      { name: 'Azul Marino Noche', hex: '#0f172a' }
    ],
    availableSizes: ['S', 'M', 'L', 'XL', '2XL'],
    measurements: [
      { size: 'S', chestCm: 58, lengthCm: 69, sleeveCm: 62 },
      { size: 'M', chestCm: 61, lengthCm: 72, sleeveCm: 64 },
      { size: 'L', chestCm: 64, lengthCm: 75, sleeveCm: 66 },
      { size: 'XL', chestCm: 67, lengthCm: 78, sleeveCm: 68 },
      { size: '2XL', chestCm: 70, lengthCm: 81, sleeveCm: 70 }
    ],
    composition: '80% Algodón Peinado, 20% Poliéster Anti-pilling',
    weightGsm: '380 GSM',
    defaultTechnique: 'Serigrafía Plastisol / DTF',
    stockStatus: 'in_stock',
    totalStock: 220,
    linkedInventoryId: 'inv-prn-02',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-trucker-cap',
    garmentId: 'garm-trucker-cap',
    name: 'Gorra Trucker Espuma Vintage Retro',
    shortDescription: 'Malla transpirable trasera, panel frontal acolchado de alta densidad.',
    description: 'Gorra estilo camionero clásico de 5 paneles. Panel frontal estructurado en espuma de alta densidad ideal para bordado 3D, parches termoadhesivos o estampado DTF con plancha de gorras.',
    photoUrl: '/src/assets/images/garment_trucker_cap_1793416400133.jpg',
    model3DType: 'gorra_trucker',
    category: 'accesorios',
    isPublished: true,
    featured: false,
    basePrice: 11990,
    volumePricing: [
      { minQty: 1, maxQty: 9, discountPercent: 0, unitPrice: 11990 },
      { minQty: 10, maxQty: 24, discountPercent: 18, unitPrice: 9830 },
      { minQty: 25, maxQty: 49, discountPercent: 28, unitPrice: 8630 },
      { minQty: 50, maxQty: 99, discountPercent: 38, unitPrice: 7430 },
      { minQty: 100, discountPercent: 48, unitPrice: 6230 }
    ],
    availableColors: [
      { name: 'Negro / Blanco', hex: '#18181b' },
      { name: 'Total Black', hex: '#000000' },
      { name: 'Azul Marino / Blanco', hex: '#1e3a8a' },
      { name: 'Rojo Carmesí / Blanco', hex: '#991b1b' },
      { name: 'Verde Militar / Negro', hex: '#365314' }
    ],
    availableSizes: ['Ajustable Snapback (55-61cm)'],
    measurements: [
      { size: 'Única', chestCm: 58, lengthCm: 16, sleeveCm: 7 }
    ],
    composition: 'Panel frontal poliéster / Malla trasera nylon transpirable',
    weightGsm: '160 GSM',
    defaultTechnique: 'Bordado Industrial / DTF Gorras',
    stockStatus: 'in_stock',
    totalStock: 350,
    linkedInventoryId: 'inv-prn-03',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-tshirt-dryfit',
    garmentId: 'garm-tshirt-dryfit',
    name: 'Camiseta Deportiva Raglán Dry-Fit',
    shortDescription: 'Microfibra deportiva respirable con tratamiento hidrofóbico.',
    description: 'Diseñada para alto rendimiento atlético. Tejido calado lateral para evacuación rápida del calor y manga raglán que permite libertad total de movimiento articular sin roce en costuras.',
    photoUrl: '/src/assets/images/garment_tshirt_heavyweight_1793416398987.jpg',
    model3DType: 'camiseta_deportiva',
    category: 'camisetas',
    isPublished: true,
    featured: false,
    basePrice: 13990,
    volumePricing: [
      { minQty: 1, maxQty: 9, discountPercent: 0, unitPrice: 13990 },
      { minQty: 10, maxQty: 24, discountPercent: 15, unitPrice: 11890 },
      { minQty: 25, maxQty: 49, discountPercent: 25, unitPrice: 10490 },
      { minQty: 50, maxQty: 99, discountPercent: 35, unitPrice: 9090 },
      { minQty: 100, discountPercent: 45, unitPrice: 7690 }
    ],
    availableColors: [
      { name: 'Azul Royal Sport', hex: '#0284c7' },
      { name: 'Negro Onix', hex: '#09090b' },
      { name: 'Blanco Óptico', hex: '#ffffff' },
      { name: 'Rojo Carmesí', hex: '#dc2626' },
      { name: 'Amarillo Neón', hex: '#eab308' }
    ],
    availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
    measurements: [
      { size: 'S', chestCm: 51, lengthCm: 68, sleeveCm: 21 },
      { size: 'M', chestCm: 54, lengthCm: 71, sleeveCm: 22 },
      { size: 'L', chestCm: 57, lengthCm: 74, sleeveCm: 23 },
      { size: 'XL', chestCm: 60, lengthCm: 77, sleeveCm: 24 }
    ],
    composition: '100% Microfibra Poliéster Interlock Dry-Fit',
    weightGsm: '150 GSM',
    defaultTechnique: 'Sublimación Digital / Vinil Reflectivo',
    stockStatus: 'in_stock',
    totalStock: 300,
    linkedInventoryId: 'inv-prn-01',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-polo-pique',
    garmentId: 'garm-polo-pique',
    name: 'Camisa Polo Piqué Clásica 220g',
    shortDescription: 'Piqué peinado estructurado, cuello tejido y tapeta de dos botones.',
    description: 'Elegancia y presencia corporativa. Tejido en nido de abeja piqué con cuello y puños acanalados de alta durabilidad que no se doblan con el uso diario.',
    photoUrl: '/src/assets/images/garment_tshirt_heavyweight_1793416398987.jpg',
    model3DType: 'polo',
    category: 'camisetas',
    isPublished: true,
    featured: false,
    basePrice: 17990,
    volumePricing: [
      { minQty: 1, maxQty: 9, discountPercent: 0, unitPrice: 17990 },
      { minQty: 10, maxQty: 24, discountPercent: 12, unitPrice: 15830 },
      { minQty: 25, maxQty: 49, discountPercent: 22, unitPrice: 14030 },
      { minQty: 50, maxQty: 99, discountPercent: 32, unitPrice: 12230 },
      { minQty: 100, discountPercent: 42, unitPrice: 10430 }
    ],
    availableColors: [
      { name: 'Azul Marino Corporativo', hex: '#1e3a8a' },
      { name: 'Negro Clásico', hex: '#18181b' },
      { name: 'Blanco Puro', hex: '#f8fafc' },
      { name: 'Rojo Vino', hex: '#831843' },
      { name: 'Verde Botella', hex: '#064e3b' }
    ],
    availableSizes: ['S', 'M', 'L', 'XL', '2XL'],
    measurements: [
      { size: 'S', chestCm: 52, lengthCm: 70, sleeveCm: 22 },
      { size: 'M', chestCm: 55, lengthCm: 73, sleeveCm: 23 },
      { size: 'L', chestCm: 58, lengthCm: 76, sleeveCm: 24 },
      { size: 'XL', chestCm: 61, lengthCm: 79, sleeveCm: 25 }
    ],
    composition: '65% Algodón Peinado, 35% Poliéster Resistente',
    weightGsm: '220 GSM',
    defaultTechnique: 'Bordado Industrial / DTF',
    stockStatus: 'in_stock',
    totalStock: 190,
    linkedInventoryId: 'inv-prn-01',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-crewneck-sweater',
    garmentId: 'garm-crewneck',
    name: 'Buso Cuello Redondo Crewneck 320g',
    shortDescription: 'Corte regular limpio sin capucha, interior perchado afelpado.',
    description: 'El clásico suéter de cuello redondo versátil y cómodo. Con ribete ancho en cuello, puños y cintura con elastano para máxima retención de forma.',
    photoUrl: '/src/assets/images/garment_hoodie_french_terry_1793416400113.jpg',
    model3DType: 'buso_cuello_redondo',
    category: 'busos',
    isPublished: true,
    featured: false,
    basePrice: 24990,
    volumePricing: [
      { minQty: 1, maxQty: 9, discountPercent: 0, unitPrice: 24990 },
      { minQty: 10, maxQty: 24, discountPercent: 15, unitPrice: 21240 },
      { minQty: 25, maxQty: 49, discountPercent: 25, unitPrice: 18740 },
      { minQty: 50, maxQty: 99, discountPercent: 35, unitPrice: 16240 },
      { minQty: 100, discountPercent: 44, unitPrice: 13990 }
    ],
    availableColors: [
      { name: 'Gris Carbón', hex: '#334155' },
      { name: 'Negro', hex: '#0f172a' },
      { name: 'Azul Oxford', hex: '#1e293b' },
      { name: 'Verde Oliva', hex: '#365314' }
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    measurements: [
      { size: 'S', chestCm: 56, lengthCm: 68, sleeveCm: 61 },
      { size: 'M', chestCm: 59, lengthCm: 71, sleeveCm: 63 },
      { size: 'L', chestCm: 62, lengthCm: 74, sleeveCm: 65 },
      { size: 'XL', chestCm: 65, lengthCm: 77, sleeveCm: 67 }
    ],
    composition: '70% Algodón, 30% Poliéster Friza',
    weightGsm: '320 GSM',
    defaultTechnique: 'Serigrafía al Agua / DTF',
    stockStatus: 'in_stock',
    totalStock: 160,
    linkedInventoryId: 'inv-prn-02',
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_CATALOG_DESIGNS: CatalogDesign[] = [
  {
    id: 'des-cat-01',
    title: 'Neo Tokyo Underground Wave',
    category: 'anime',
    previewUrl: '/src/assets/images/garment_hoodie_french_terry_1793416400113.jpg',
    isPublic: true,
    recommendedTechnique: 'DTF Textil HD',
    tags: ['Cyberpunk', 'Japón', 'Ilustración', 'Urbano'],
    colorsCount: 6,
    createdAt: '2026-03-01T10:00:00Z'
  },
  {
    id: 'des-cat-02',
    title: 'California Coastline Surf & Sunset 1984',
    category: 'vintage',
    previewUrl: '/src/assets/images/garment_tshirt_heavyweight_1793416398987.jpg',
    isPublic: true,
    recommendedTechnique: 'Serigrafía Plastisol',
    tags: ['Retro', 'Playa', 'Vintage', '80s'],
    colorsCount: 4,
    createdAt: '2026-03-05T12:00:00Z'
  },
  {
    id: 'des-cat-03',
    title: 'Iron Gym Strength Division',
    category: 'deportivo',
    previewUrl: '/src/assets/images/garment_tshirt_heavyweight_1793416398987.jpg',
    isPublic: true,
    recommendedTechnique: 'Vinil Textil Reflectivo',
    tags: ['Fitness', 'Fuerza', 'Atlético', 'Tipografía'],
    colorsCount: 2,
    createdAt: '2026-03-10T14:00:00Z'
  },
  {
    id: 'des-cat-04',
    title: 'Minimal Geometric Line Art Studio',
    category: 'minimalista',
    previewUrl: '/src/assets/images/garment_trucker_cap_1793416400133.jpg',
    isPublic: true,
    recommendedTechnique: 'DTF Textil HD',
    tags: ['Minimal', 'Arquitectura', 'Líneas', 'Elegante'],
    colorsCount: 1,
    createdAt: '2026-03-12T09:00:00Z'
  },
  {
    id: 'des-cat-05',
    title: 'Original Coffee Roastery Artisan Mark',
    category: 'empresarial',
    previewUrl: '/src/assets/images/hero_textile_studio_1793415151404.jpg',
    isPublic: true,
    recommendedTechnique: 'Bordado Industrial / DTF',
    tags: ['Café', 'Branding', 'Gastronomía', 'Emblema'],
    colorsCount: 3,
    createdAt: '2026-03-15T15:00:00Z'
  },
  {
    id: 'des-cat-06',
    title: 'Mountain Trail Outdoor Explorers',
    category: 'urbano',
    previewUrl: '/src/assets/images/garment_hoodie_french_terry_1793416400113.jpg',
    isPublic: true,
    recommendedTechnique: 'DTF Textil HD',
    tags: ['Aventura', 'Naturaleza', 'Camping', 'Montaña'],
    colorsCount: 5,
    createdAt: '2026-03-18T11:00:00Z'
  }
];

export const INITIAL_CLIENT_CUSTOMIZATIONS: ClientCustomization[] = [
  {
    id: 'cust-demo-01',
    clientId: 'client-user-demo',
    clientEmail: 'carlos@urbandistrict.cl',
    clientName: 'Carlos Mendoza',
    title: 'Camisetas Oversize Tour Invierno',
    garmentId: 'garm-tshirt-heavyweight',
    garmentName: 'Camiseta Heavyweight Boxy Fit (240g)',
    garmentPhotoUrl: '/src/assets/images/garment_tshirt_heavyweight_1793416398987.jpg',
    model3DType: 'camiseta_basica',
    colorHex: '#0a0a0c',
    colorName: 'Negro Profundo',
    techniqueId: 'dtf_textil',
    placement: 'pecho_central',
    uploadedDesignUrl: '/src/assets/images/garment_tshirt_heavyweight_1793416398987.jpg',
    selectedCatalogDesignId: 'des-cat-01',
    customText: 'URBAN DISTRICT SCL',
    textColor: '#f4f3ef',
    textFont: 'Impact, sans-serif',
    textSize: 36,
    textCurve: 0,
    designScale: 1.0,
    designRotation: 0,
    designOffsetX: 0,
    designOffsetY: 0,
    sizesBreakdown: [
      { size: 'S', quantity: 10 },
      { size: 'M', quantity: 20 },
      { size: 'L', quantity: 15 },
      { size: 'XL', quantity: 5 }
    ],
    totalUnits: 50,
    unitPrice: 9740,
    subtotal: 487000,
    discountApplied: 35,
    totalEstimated: 487000,
    status: 'en_revision',
    reviewNotes: 'Por favor confirmar si el blanco necesita rebaje/choke de base blanca.',
    adminFeedback: 'Resolución de 300 DPI verificada. Listo para aprobación final.',
    createdAt: '2026-03-22T10:00:00Z',
    updatedAt: '2026-03-24T12:00:00Z'
  }
];

class ClientStoreService {
  // ----------------------------------------------------
  // PRODUCTOS DE TIENDA (CATÁLOGO COMERCIAL)
  // ----------------------------------------------------
  public getProducts(): StoreProduct[] {
    try {
      const raw = localStorage.getItem(LS_STORE_PRODUCTS);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Error al leer productos de tienda en local', e);
    }
    this.saveProductsLocal(INITIAL_STORE_PRODUCTS);
    return INITIAL_STORE_PRODUCTS;
  }

  private saveProductsLocal(items: StoreProduct[]) {
    try {
      localStorage.setItem(LS_STORE_PRODUCTS, JSON.stringify(items));
    } catch (e) {
      console.warn('Error al guardar productos de tienda', e);
    }
  }

  public async syncProductsFromFirestore(): Promise<StoreProduct[]> {
    if (!auth?.currentUser) return this.getProducts();
    try {
      const snap = await getDocs(collection(db, 'storeProducts'));
      if (!snap.empty) {
        const loaded: StoreProduct[] = [];
        snap.forEach((d) => loaded.push(d.data() as StoreProduct));
        this.saveProductsLocal(loaded);
        return loaded;
      }
    } catch (err) {
      console.warn('Firestore storeProducts sync fallback to local', err);
    }
    return this.getProducts();
  }

  public async saveProduct(product: StoreProduct): Promise<StoreProduct> {
    const list = this.getProducts();
    const idx = list.findIndex((p) => p.id === product.id);
    const updated = { ...product, updatedAt: new Date().toISOString() };

    if (idx >= 0) {
      list[idx] = updated;
    } else {
      list.unshift(updated);
    }
    this.saveProductsLocal(list);

    if (auth?.currentUser) {
      try {
        await setDoc(doc(db, 'storeProducts', updated.id), updated);
      } catch (e) {
        console.warn('Firestore save product error', e);
      }
    }
    return updated;
  }

  public toggleProductPublication(productId: string, isPublished: boolean): StoreProduct[] {
    const list = this.getProducts();
    const p = list.find((item) => item.id === productId);
    if (p) {
      p.isPublished = isPublished;
      p.updatedAt = new Date().toISOString();
      this.saveProduct(p);
    }
    return this.getProducts();
  }

  public updateProductPricing(
    productId: string,
    basePrice: number,
    volumePricing: VolumePriceTier[]
  ): StoreProduct[] {
    const list = this.getProducts();
    const p = list.find((item) => item.id === productId);
    if (p) {
      p.basePrice = basePrice;
      p.volumePricing = volumePricing;
      p.updatedAt = new Date().toISOString();
      this.saveProduct(p);
    }
    return this.getProducts();
  }

  // ----------------------------------------------------
  // DISEÑOS DE CATÁLOGO (PÚBLICOS PARA TODOS LOS CLIENTES)
  // ----------------------------------------------------
  public getCatalogDesigns(): CatalogDesign[] {
    try {
      const raw = localStorage.getItem(LS_CATALOG_DESIGNS);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Error reading catalog designs', e);
    }
    this.saveCatalogDesignsLocal(INITIAL_CATALOG_DESIGNS);
    return INITIAL_CATALOG_DESIGNS;
  }

  private saveCatalogDesignsLocal(items: CatalogDesign[]) {
    try {
      localStorage.setItem(LS_CATALOG_DESIGNS, JSON.stringify(items));
    } catch (e) {
      console.warn('Error saving catalog designs', e);
    }
  }

  public async saveCatalogDesign(design: CatalogDesign): Promise<CatalogDesign> {
    const list = this.getCatalogDesigns();
    const idx = list.findIndex((d) => d.id === design.id);
    if (idx >= 0) {
      list[idx] = design;
    } else {
      list.unshift(design);
    }
    this.saveCatalogDesignsLocal(list);

    if (auth?.currentUser) {
      try {
        await setDoc(doc(db, 'catalogDesigns', design.id), design);
      } catch (e) {
        console.warn('Firestore save catalog design error', e);
      }
    }
    return design;
  }

  public async deleteCatalogDesign(designId: string): Promise<void> {
    const list = this.getCatalogDesigns().filter((d) => d.id !== designId);
    this.saveCatalogDesignsLocal(list);
    if (auth?.currentUser) {
      try {
        await deleteDoc(doc(db, 'catalogDesigns', designId));
      } catch (e) {
        console.warn('Firestore delete catalog design error', e);
      }
    }
  }

  // ----------------------------------------------------
  // PERSONALIZACIONES PRIVADAS DE CLIENTES (PRIVACIDAD ESTRICTA)
  // Cada cliente solo accede a sus propios proyectos y diseños.
  // ----------------------------------------------------
  public getAllCustomizations(): ClientCustomization[] {
    try {
      const raw = localStorage.getItem(LS_CLIENT_CUSTOMIZATIONS);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Error reading client customizations', e);
    }
    this.saveCustomizationsLocal(INITIAL_CLIENT_CUSTOMIZATIONS);
    return INITIAL_CLIENT_CUSTOMIZATIONS;
  }

  private saveCustomizationsLocal(items: ClientCustomization[]) {
    try {
      localStorage.setItem(LS_CLIENT_CUSTOMIZATIONS, JSON.stringify(items));
    } catch (e) {
      console.warn('Error writing client customizations', e);
    }
  }

  /**
   * Obtiene exclusivamente los proyectos y personalizaciones que pertenecen al cliente actual
   * Garantiza que ningún cliente pueda ver los diseños privados de otro.
   */
  public getClientCustomizations(clientId: string, clientEmail?: string): ClientCustomization[] {
    const all = this.getAllCustomizations();
    if (!clientId && !clientEmail) return [];
    return all.filter((c) => {
      if (clientId && c.clientId === clientId) return true;
      if (clientEmail && c.clientEmail?.toLowerCase() === clientEmail.toLowerCase()) return true;
      return false;
    });
  }

  public async saveCustomization(item: ClientCustomization): Promise<ClientCustomization> {
    const all = this.getAllCustomizations();
    const idx = all.findIndex((c) => c.id === item.id);
    const updated: ClientCustomization = {
      ...item,
      updatedAt: new Date().toISOString()
    };

    if (idx >= 0) {
      all[idx] = updated;
    } else {
      all.unshift(updated);
    }
    this.saveCustomizationsLocal(all);

    // Persistir en Firestore si hay sesión activa
    if (auth?.currentUser) {
      try {
        await setDoc(doc(db, 'clientCustomizations', updated.id), updated);
      } catch (e) {
        console.warn('Firestore save client customization error', e);
      }
    }
    return updated;
  }

  public async deleteCustomization(id: string, clientId: string): Promise<void> {
    const all = this.getAllCustomizations().filter(
      (c) => !(c.id === id && (c.clientId === clientId || auth?.currentUser?.email === 'harmonyestampadosr@gmail.com'))
    );
    this.saveCustomizationsLocal(all);

    if (auth?.currentUser) {
      try {
        await deleteDoc(doc(db, 'clientCustomizations', id));
      } catch (e) {
        console.warn('Firestore delete client customization error', e);
      }
    }
  }

  // ----------------------------------------------------
  // MOTOR DE CÁLCULO DE PRECIOS POR VOLUMEN Y CANTIDADES
  // ----------------------------------------------------
  public calculateVolumePricing(
    basePrice: number,
    volumePricing: VolumePriceTier[],
    totalQuantity: number
  ): {
    unitPrice: number;
    discountPercent: number;
    subtotal: number;
    savings: number;
    total: number;
  } {
    if (totalQuantity <= 0) {
      return { unitPrice: basePrice, discountPercent: 0, subtotal: 0, savings: 0, total: 0 };
    }

    // Buscar el tramo de volumen correspondiente
    let matchingTier: VolumePriceTier | undefined;
    for (const tier of volumePricing) {
      if (totalQuantity >= tier.minQty) {
        if (tier.maxQty === undefined || totalQuantity <= tier.maxQty) {
          matchingTier = tier;
        }
      }
    }

    const discountPercent = matchingTier ? matchingTier.discountPercent : 0;
    const unitPrice = matchingTier
      ? matchingTier.unitPrice
      : Math.round(basePrice * (1 - discountPercent / 100));

    const total = unitPrice * totalQuantity;
    const baseSubtotal = basePrice * totalQuantity;
    const savings = Math.max(0, baseSubtotal - total);

    return {
      unitPrice,
      discountPercent,
      subtotal: baseSubtotal,
      savings,
      total
    };
  }

  // ----------------------------------------------------
  // INTEGRACIÓN CON EL SISTEMA DE PEDIDOS E INVENTARIO
  // ----------------------------------------------------
  public async submitStoreOrder(request: StoreOrderRequest): Promise<{
    orderId: string;
    customization: ClientCustomization;
  }> {
    const { customization, requestType, customerContact } = request;

    // 1. Determinar nuevo estado de personalización
    let newStatus: ClientCustomization['status'] = 'pedido_solicitado';
    if (requestType === 'cotizacion') newStatus = 'cotizacion_solicitada';
    if (requestType === 'revision') newStatus = 'en_revision';

    // 2. Crear Orden de Producción real en adminProductionService
    const orderNumber = `PED-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderId = `ord-portal-${Date.now()}`;

    const orderGarments: OrderGarmentSizeBreakdown[] = customization.sizesBreakdown.map((s) => ({
      size: s.size,
      quantity: s.quantity
    }));

    const newOrder: OrderRecord = {
      id: orderId,
      ownerId: customization.clientId || 'portal_customer',
      orderNumber,
      title: `${customization.title || 'Prenda Personalizada'} (${customization.totalUnits} u.)`,
      customerId: customization.clientId,
      customerName: customerContact.name || customization.clientName,
      customerContact: customerContact.name || customization.clientName,
      customerEmail: customerContact.email || customization.clientEmail,
      customerPhone: customerContact.phone || '+56 9 0000 0000',
      techniqueName: customization.techniqueId === 'dtf_textil' ? 'DTF Textil' : 'Serigrafía / DTF',
      status: requestType === 'revision' ? 'pendiente_diseno' : 'recibido',
      priority: customization.totalUnits > 50 ? 'alta' : 'normal',
      totalPieces: customization.totalUnits,
      totalAmount: customization.totalEstimated,
      depositPaid: 0,
      balanceDue: customization.totalEstimated,
      deliveryDate: customerContact.deliveryDateRequested || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      productionNotes: `Solicitud originada en Portal Comercial.\nColor: ${customization.colorName} (${customization.colorHex}).\nUbicación: ${PRINT_PLACEMENTS[customization.placement]?.name}.\nTexto: "${customization.customText || 'N/A'}".\nObservaciones del cliente: ${customerContact.notes || 'Ninguna'}`,
      designs: [
        {
          id: `des-${Date.now()}`,
          name: customization.title || 'Diseño de Cliente',
          previewUrl: customization.uploadedDesignUrl || customization.garmentPhotoUrl,
          placement: PRINT_PLACEMENTS[customization.placement]?.name || 'Pecho central',
          dimensionsCm: PRINT_PLACEMENTS[customization.placement]?.dimensionsCm || '30 x 40 cm',
          technique: 'DTF Textil',
          colorsCount: 4
        }
      ],
      garments: [
        {
          id: `gline-${Date.now()}`,
          garmentId: customization.garmentId,
          garmentName: customization.garmentName,
          colorName: customization.colorName,
          colorHex: customization.colorHex,
          sizes: orderGarments,
          totalUnits: customization.totalUnits,
          unitPrice: customization.unitPrice,
          subtotal: customization.totalEstimated
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Guardar en el servicio de administración y producción
    await adminProductionService.saveOrder(newOrder);

    // 3. Descontar o reservar inventario de blanks de manera trazable
    const storeProducts = this.getProducts();
    const product = storeProducts.find((p) => p.garmentId === customization.garmentId);
    if (product && product.linkedInventoryId) {
      try {
        await adminProductionService.registerStockMovement({
          itemId: product.linkedInventoryId,
          type: 'salida',
          quantity: customization.totalUnits,
          reason: 'consumo_orden',
          orderRefNumber: orderNumber,
          notes: `Prendas en blanco reservadas para pedido #${orderNumber} (${customerContact.name})`
        });
      } catch (invErr) {
        console.warn('No se pudo registrar movimiento automático de inventario', invErr);
      }
    }

    // 4. Actualizar estado de la personalización con el ID de orden vinculada
    const updatedCustomization: ClientCustomization = {
      ...customization,
      status: newStatus,
      associatedOrderId: orderId,
      updatedAt: new Date().toISOString()
    };
    await this.saveCustomization(updatedCustomization);

    return {
      orderId,
      customization: updatedCustomization
    };
  }

  // ----------------------------------------------------
  // FLUJO DE APROBACIÓN DE DISEÑO (CLIENTE Y TALLER)
  // ----------------------------------------------------
  public async approveDesignByClient(
    customizationId: string,
    notes?: string
  ): Promise<ClientCustomization> {
    const all = this.getAllCustomizations();
    const cust = all.find((c) => c.id === customizationId);
    if (!cust) throw new Error('Personalización no encontrada');

    cust.status = 'diseno_aprobado';
    cust.approvedAt = new Date().toISOString();
    if (notes) cust.reviewNotes = notes;
    cust.updatedAt = new Date().toISOString();

    await this.saveCustomization(cust);

    // Si tiene una orden asociada, pasarla a estado 'diseno_aprobado'
    if (cust.associatedOrderId) {
      try {
        await adminProductionService.updateOrderStatus(cust.associatedOrderId, 'diseno_aprobado');
      } catch (err) {
        console.warn('Error al actualizar estado en orden vinculada', err);
      }
    }

    return cust;
  }

  public async reviewDesignByAdmin(
    customizationId: string,
    approved: boolean,
    feedback: string
  ): Promise<ClientCustomization> {
    const all = this.getAllCustomizations();
    const cust = all.find((c) => c.id === customizationId);
    if (!cust) throw new Error('Personalización no encontrada');

    cust.status = approved ? 'diseno_aprobado' : 'observaciones_taller';
    cust.adminFeedback = feedback;
    if (approved) cust.approvedAt = new Date().toISOString();
    cust.updatedAt = new Date().toISOString();

    await this.saveCustomization(cust);

    // Sincronizar estado en orden asociada
    if (cust.associatedOrderId) {
      try {
        const nextOrderStatus = approved ? 'diseno_aprobado' : 'pendiente_diseno';
        await adminProductionService.updateOrderStatus(cust.associatedOrderId, nextOrderStatus);
      } catch (err) {
        console.warn('Error al sincronizar orden con revisión del admin', err);
      }
    }

    return cust;
  }
}

export const clientStoreService = new ClientStoreService();
