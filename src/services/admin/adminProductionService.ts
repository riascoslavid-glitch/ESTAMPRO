/**
 * ESTAMPAPRO 360° - Servicio Integral de Administración y Producción (Prompt 14)
 * Gestión de Clientes, Pedidos (8 Estados), Inventario (10 categorías con entradas/salidas),
 * Producción de Taller (Operador/Máquina/Técnica/Materiales) y Reportes Analíticos.
 * Persistencia en Firebase Firestore + LocalStorage de alta fiabilidad.
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
  CustomerRecord,
  OrderRecord,
  OrderStatus,
  InventoryItemRecord,
  InventoryCategory,
  InventoryMovementRecord,
  ProductionTaskRecord,
  WorkshopMetricsReport,
  QualityInspectionRecord
} from '../../types/adminProduction';

// Claves de almacenamiento local
const LS_CUSTOMERS = 'estampapro_admin_customers_v1';
const LS_ORDERS = 'estampapro_admin_orders_v1';
const LS_INVENTORY = 'estampapro_admin_inventory_v1';
const LS_MOVEMENTS = 'estampapro_admin_movements_v1';
const LS_TASKS = 'estampapro_admin_production_tasks_v1';
const LS_QUALITY_INSPECTIONS = 'estampapro_admin_quality_inspections_v1';

// ==========================================
// SEED DATA INICIAL REALISTA PARA TALLER
// ==========================================

export const INITIAL_CUSTOMERS: CustomerRecord[] = [
  {
    id: 'cust-01',
    ownerId: 'default',
    name: 'Urban District Apparel',
    contactPerson: 'Carlos Mendoza',
    phone: '+56 9 8765 4321',
    email: 'compras@urbandistrict.cl',
    address: 'Av. Providencia 2140, Of. 602',
    city: 'Santiago',
    taxId: '76.432.189-5',
    category: 'marca_ropa',
    observations: 'Marca de moda urbana streetwear. Exigen tacto cero o base agua suave, cuello estampado con su logo y bolsa individual ecológica.',
    totalOrdersCount: 4,
    totalSpent: 4850000,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-03-20T14:30:00Z'
  },
  {
    id: 'cust-02',
    ownerId: 'default',
    name: 'Club Deportivo Los Leones',
    contactPerson: 'Mariana Silva',
    phone: '+56 9 9876 5432',
    email: 'contacto@leonesdeportes.cl',
    address: 'Calle Los Deportistas 850',
    city: 'Viña del Mar',
    taxId: '65.123.987-1',
    category: 'corporativo',
    observations: 'Uniformes de básquetbol y fútbol. Sublimación digital completa y vinil termo-transferible reflectivo para numeraciones dorsales.',
    totalOrdersCount: 3,
    totalSpent: 2150000,
    createdAt: '2026-02-01T12:00:00Z',
    updatedAt: '2026-03-25T11:15:00Z'
  },
  {
    id: 'cust-03',
    ownerId: 'default',
    name: 'Festival Indie Rock Fest',
    contactPerson: 'Rodrigo Fuentes',
    phone: '+56 9 5555 1234',
    email: 'merch@indierockfest.com',
    address: 'Av. Santa Rosa 1120',
    city: 'Santiago',
    taxId: '77.889.001-K',
    category: 'eventos',
    observations: 'Merchandising oficial para gira musical. Polerones canguro con serigrafía puff en espalda y poleras DTF con colores saturados.',
    totalOrdersCount: 2,
    totalSpent: 3950000,
    createdAt: '2026-02-18T16:00:00Z',
    updatedAt: '2026-03-28T09:45:00Z'
  },
  {
    id: 'cust-04',
    ownerId: 'default',
    name: 'Café & Roastery La Sierra',
    contactPerson: 'Elena Gutiérrez',
    phone: '+56 9 3333 7890',
    email: 'administracion@cafelasierra.com',
    address: 'Paseo Huérfanos 930',
    city: 'Santiago',
    taxId: '76.999.432-8',
    category: 'corporativo',
    observations: 'Delantales de barista en gabardina y poleras polo piqué con bordado industrial de alta densidad en pecho izquierdo.',
    totalOrdersCount: 1,
    totalSpent: 890000,
    createdAt: '2026-03-10T14:00:00Z',
    updatedAt: '2026-03-10T14:00:00Z'
  }
];

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'ord-01',
    ownerId: 'default',
    orderNumber: 'OT-2026-014',
    title: 'Polerones French Terry Oversize — Tour 2026',
    customerId: 'cust-03',
    customerName: 'Festival Indie Rock Fest',
    customerContact: 'Rodrigo Fuentes',
    customerEmail: 'merch@indierockfest.com',
    customerPhone: '+56 9 5555 1234',
    associatedQuoteId: 'COT-2026-004',
    associatedQuoteNumber: 'COT-2026-004',
    techniqueName: 'DTF Textil',
    status: 'en_produccion',
    priority: 'urgente',
    totalPieces: 50,
    totalAmount: 950000,
    depositPaid: 500000,
    balanceDue: 450000,
    deliveryDate: '2026-04-05',
    productionNotes: 'Temperatura de plancha 155°C, 15 seg, pelado en caliente (hot peel) y reprensado final de 5 seg con papel teflón mate.',
    designs: [
      {
        id: 'des-01',
        name: 'Grafica Tour 2026 Neo-Grunge',
        previewUrl: '/src/assets/images/garment_hoodie_french_terry_1793416400113.jpg',
        placement: 'Espalda completa',
        dimensionsCm: '30 x 42 cm',
        technique: 'DTF Textil',
        colorsCount: 6
      },
      {
        id: 'des-02',
        name: 'Isotipo Pecho Minimal',
        previewUrl: '/src/assets/images/garment_hoodie_french_terry_1793416400113.jpg',
        placement: 'Pecho izquierdo',
        dimensionsCm: '10 x 8 cm',
        technique: 'DTF Textil',
        colorsCount: 2
      }
    ],
    garments: [
      {
        id: 'gline-01',
        garmentName: 'Polerón Hoodie French Terry 380g',
        colorName: 'Negro Profundo',
        colorHex: '#121212',
        sizes: [
          { size: 'S', quantity: 10 },
          { size: 'M', quantity: 20 },
          { size: 'L', quantity: 15 },
          { size: 'XL', quantity: 5 }
        ],
        totalUnits: 50,
        unitPrice: 19000,
        subtotal: 950000
      }
    ],
    createdAt: '2026-03-24T10:00:00Z',
    updatedAt: '2026-03-29T16:20:00Z'
  },
  {
    id: 'ord-02',
    ownerId: 'default',
    orderNumber: 'OT-2026-015',
    title: 'Camisetas Heavyweight 240g Colección Invierno',
    customerId: 'cust-01',
    customerName: 'Urban District Apparel',
    customerContact: 'Carlos Mendoza',
    customerEmail: 'compras@urbandistrict.cl',
    customerPhone: '+56 9 8765 4321',
    associatedQuoteId: 'COT-2026-001',
    associatedQuoteNumber: 'COT-2026-001',
    techniqueName: 'Serigrafía Plastisol',
    status: 'preparacion',
    priority: 'alta',
    totalPieces: 100,
    totalAmount: 1480000,
    depositPaid: 800000,
    balanceDue: 680000,
    deliveryDate: '2026-04-10',
    productionNotes: '3 tintas plastisol directo con base blanca bajo relieve. Malla 77T para blancos y 90T para colores.',
    designs: [
      {
        id: 'des-03',
        name: 'Arte Tipográfico Street 90s',
        previewUrl: '/src/assets/images/garment_tshirt_heavyweight_1793416398987.jpg',
        placement: 'Pecho central',
        dimensionsCm: '28 x 35 cm',
        technique: 'Serigrafía Plastisol',
        colorsCount: 3
      }
    ],
    garments: [
      {
        id: 'gline-02',
        garmentName: 'Camiseta Cuello Redondo Heavyweight 240g',
        colorName: 'Gris Melange',
        colorHex: '#8C8D90',
        sizes: [
          { size: 'S', quantity: 20 },
          { size: 'M', quantity: 40 },
          { size: 'L', quantity: 30 },
          { size: 'XL', quantity: 10 }
        ],
        totalUnits: 100,
        unitPrice: 14800,
        subtotal: 1480000
      }
    ],
    createdAt: '2026-03-26T11:30:00Z',
    updatedAt: '2026-03-29T14:00:00Z'
  },
  {
    id: 'ord-03',
    ownerId: 'default',
    orderNumber: 'OT-2026-016',
    title: 'Gorras Trucker Espuma Retro con Parche Bordado',
    customerId: 'cust-01',
    customerName: 'Urban District Apparel',
    customerContact: 'Carlos Mendoza',
    customerEmail: 'compras@urbandistrict.cl',
    customerPhone: '+56 9 8765 4321',
    techniqueName: 'Bordado Industrial',
    status: 'pendiente_diseno',
    priority: 'normal',
    totalPieces: 40,
    totalAmount: 380000,
    depositPaid: 190000,
    balanceDue: 190000,
    deliveryDate: '2026-04-14',
    productionNotes: 'Parche bordado en borde termoadhesivo o bordado 3D con foamy de 3mm.',
    designs: [
      {
        id: 'des-04',
        name: 'Emblema California Wave',
        previewUrl: '/src/assets/images/garment_trucker_cap_1793416400133.jpg',
        placement: 'Frente de gorra',
        dimensionsCm: '10 x 6 cm',
        technique: 'Bordado Industrial',
        colorsCount: 4
      }
    ],
    garments: [
      {
        id: 'gline-03',
        garmentName: 'Gorra Trucker 5 Paneles Malla',
        colorName: 'Negro / Blanco',
        colorHex: '#1F2937',
        sizes: [
          { size: 'Única (Ajustable)', quantity: 40 }
        ],
        totalUnits: 40,
        unitPrice: 9500,
        subtotal: 380000
      }
    ],
    createdAt: '2026-03-28T09:15:00Z',
    updatedAt: '2026-03-28T09:15:00Z'
  },
  {
    id: 'ord-04',
    ownerId: 'default',
    orderNumber: 'OT-2026-017',
    title: 'Poleras Dry-Fit Maratón Primavera 2026',
    customerId: 'cust-02',
    customerName: 'Club Deportivo Los Leones',
    customerContact: 'Mariana Silva',
    customerEmail: 'contacto@leonesdeportes.cl',
    customerPhone: '+56 9 9876 5432',
    associatedQuoteId: 'COT-2026-003',
    associatedQuoteNumber: 'COT-2026-003',
    techniqueName: 'Sublimación',
    status: 'control_calidad',
    priority: 'alta',
    totalPieces: 60,
    totalAmount: 720000,
    depositPaid: 720000,
    balanceDue: 0,
    deliveryDate: '2026-03-31',
    productionNotes: 'Sublimado full print en tela microfibra dry fit 140g. Verificar que no existan sombras térmicas.',
    designs: [
      {
        id: 'des-05',
        name: 'Geometría Gradiente Leones',
        previewUrl: '/src/assets/images/garment_tshirt_heavyweight_1793416398987.jpg',
        placement: 'Cuerpo completo',
        dimensionsCm: 'Full Print',
        technique: 'Sublimación'
      }
    ],
    garments: [
      {
        id: 'gline-04',
        garmentName: 'Camiseta Deportiva Poliéster Dry-Fit',
        colorName: 'Blanco / Azul',
        colorHex: '#3B82F6',
        sizes: [
          { size: 'S', quantity: 15 },
          { size: 'M', quantity: 25 },
          { size: 'L', quantity: 20 }
        ],
        totalUnits: 60,
        unitPrice: 12000,
        subtotal: 720000
      }
    ],
    createdAt: '2026-03-20T15:00:00Z',
    updatedAt: '2026-03-29T18:00:00Z'
  },
  {
    id: 'ord-05',
    ownerId: 'default',
    orderNumber: 'OT-2026-013',
    title: 'Uniformes Personal de Barra y Cocina',
    customerId: 'cust-04',
    customerName: 'Café & Roastery La Sierra',
    customerContact: 'Elena Gutiérrez',
    customerEmail: 'administracion@cafelasierra.com',
    customerPhone: '+56 9 3333 7890',
    techniqueName: 'Bordado Industrial',
    status: 'terminado',
    priority: 'normal',
    totalPieces: 25,
    totalAmount: 430000,
    depositPaid: 430000,
    balanceDue: 0,
    deliveryDate: '2026-03-30',
    productionNotes: 'Empacado individual con etiqueta de cuidados de lavado.',
    designs: [
      {
        id: 'des-06',
        name: 'Logotipo Cafetería Grano de Café',
        previewUrl: '/src/assets/images/avatar_master_printer_1793415150877.jpg',
        placement: 'Pechera central',
        dimensionsCm: '12 x 8 cm',
        technique: 'Bordado Industrial'
      }
    ],
    garments: [
      {
        id: 'gline-05',
        garmentName: 'Delantal Barista Gabardina Premium',
        colorName: 'Marrón Café',
        colorHex: '#5C3A21',
        sizes: [
          { size: 'Estándar', quantity: 25 }
        ],
        totalUnits: 25,
        unitPrice: 17200,
        subtotal: 430000
      }
    ],
    createdAt: '2026-03-15T11:00:00Z',
    updatedAt: '2026-03-29T17:30:00Z'
  },
  {
    id: 'ord-06',
    ownerId: 'default',
    orderNumber: 'OT-2026-018',
    title: 'Camisetas Oversize Colección Anime Cyberpunk',
    customerId: 'cust-01',
    customerName: 'Urban District Apparel',
    customerContact: 'Carlos Mendoza',
    customerEmail: 'compras@urbandistrict.cl',
    customerPhone: '+56 9 8765 4321',
    techniqueName: 'DTF Textil',
    status: 'recibido',
    priority: 'normal',
    totalPieces: 30,
    totalAmount: 450000,
    depositPaid: 200000,
    balanceDue: 250000,
    deliveryDate: '2026-04-18',
    productionNotes: 'Esperando confirmación final del tono púrpura neón.',
    designs: [],
    garments: [
      {
        id: 'gline-06',
        garmentName: 'Camiseta Oversize 220g Cuello Grueso',
        colorName: 'Negro Azabache',
        colorHex: '#0F172A',
        sizes: [
          { size: 'M', quantity: 15 },
          { size: 'L', quantity: 15 }
        ],
        totalUnits: 30,
        unitPrice: 15000,
        subtotal: 450000
      }
    ],
    createdAt: '2026-03-30T08:00:00Z',
    updatedAt: '2026-03-30T08:00:00Z'
  }
];

export const INITIAL_INVENTORY: InventoryItemRecord[] = [
  // 1. PRENDAS
  {
    id: 'inv-pr-01',
    ownerId: 'default',
    sku: 'BLK-TSH-HVY-BLK',
    name: 'Camiseta Cuello Redondo Heavyweight 240g',
    category: 'prendas',
    subcategory: 'Camisetas',
    brand: 'TextilPro Premium',
    currentStock: 180,
    minStockAlert: 50,
    unit: 'unidades',
    unitCost: 4500,
    supplier: 'Distribuidora Textil Central',
    storageLocation: 'Estante A-1',
    notes: 'Algodón peinado 100% 24s. Encogimiento menor al 3%.',
    updatedAt: '2026-03-28T10:00:00Z',
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'inv-pr-02',
    ownerId: 'default',
    sku: 'BLK-HOD-FT-BLK',
    name: 'Polerón Canguro Hoodie French Terry 380g',
    category: 'prendas',
    subcategory: 'Busos',
    brand: 'Urban Blanks',
    currentStock: 22, // ALERTA: Cerca del mínimo
    minStockAlert: 30,
    unit: 'unidades',
    unitCost: 11200,
    supplier: 'Confecciones del Sur',
    storageLocation: 'Estante B-2',
    notes: '80% algodón 20% poliéster. Interior no perchado ideal serigrafía.',
    updatedAt: '2026-03-29T14:00:00Z',
    createdAt: '2026-01-12T10:00:00Z'
  },
  {
    id: 'inv-pr-03',
    ownerId: 'default',
    sku: 'BLK-CAP-TRK-5P',
    name: 'Gorra Trucker 5 Paneles Espuma con Malla',
    category: 'prendas',
    subcategory: 'Accesorios',
    brand: 'Yupoong Style',
    currentStock: 85,
    minStockAlert: 25,
    unit: 'unidades',
    unitCost: 2800,
    supplier: 'Importadora Gorras Chile',
    storageLocation: 'Gaveta C-4',
    updatedAt: '2026-03-25T11:00:00Z',
    createdAt: '2026-01-15T10:00:00Z'
  },

  // 2. TALLAS
  {
    id: 'inv-tal-01',
    ownerId: 'default',
    sku: 'CURV-TAL-M',
    name: 'Curva de Tallas T-Shirt Talla M (Mediana)',
    category: 'tallas',
    size: 'M',
    currentStock: 140,
    minStockAlert: 40,
    unit: 'unidades',
    unitCost: 4500,
    storageLocation: 'Estante A-1-M',
    notes: 'Talla de mayor rotación histórica en taller.',
    updatedAt: '2026-03-28T10:00:00Z',
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'inv-tal-02',
    ownerId: 'default',
    sku: 'CURV-TAL-L',
    name: 'Curva de Tallas T-Shirt Talla L (Grande)',
    category: 'tallas',
    size: 'L',
    currentStock: 95,
    minStockAlert: 35,
    unit: 'unidades',
    unitCost: 4500,
    storageLocation: 'Estante A-1-L',
    updatedAt: '2026-03-28T10:00:00Z',
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'inv-tal-03',
    ownerId: 'default',
    sku: 'CURV-TAL-XL',
    name: 'Curva de Tallas T-Shirt Talla XL',
    category: 'tallas',
    size: 'XL',
    currentStock: 12, // ALERTA
    minStockAlert: 25,
    unit: 'unidades',
    unitCost: 4700,
    storageLocation: 'Estante A-1-XL',
    updatedAt: '2026-03-29T15:00:00Z',
    createdAt: '2026-01-10T10:00:00Z'
  },

  // 3. COLORES
  {
    id: 'inv-col-01',
    ownerId: 'default',
    sku: 'VAR-COL-BLK-01',
    name: 'Prendas Base Color Negro Profundo #111111',
    category: 'colores',
    colorName: 'Negro Profundo',
    colorHex: '#111111',
    currentStock: 210,
    minStockAlert: 60,
    unit: 'unidades',
    unitCost: 4500,
    storageLocation: 'Estante A-Negro',
    updatedAt: '2026-03-27T12:00:00Z',
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'inv-col-02',
    ownerId: 'default',
    sku: 'VAR-COL-WHT-02',
    name: 'Prendas Base Color Blanco Óptico #FAFAFA',
    category: 'colores',
    colorName: 'Blanco Óptico',
    colorHex: '#FAFAFA',
    currentStock: 165,
    minStockAlert: 50,
    unit: 'unidades',
    unitCost: 4300,
    storageLocation: 'Estante A-Blanco',
    updatedAt: '2026-03-27T12:00:00Z',
    createdAt: '2026-01-10T10:00:00Z'
  },

  // 4. TINTAS
  {
    id: 'inv-tin-01',
    ownerId: 'default',
    sku: 'INK-DTF-WHT-1L',
    name: 'Tinta DTF Textil Blanca DMax Ultra-Opaca (1 Litro)',
    category: 'tintas',
    brand: 'DuPont Artistri / ColorPrint',
    colorName: 'Blanco DTF',
    colorHex: '#FFFFFF',
    currentStock: 3.5, // 3.5 Litros
    minStockAlert: 5.0, // ALERTA
    unit: 'litros',
    unitCost: 42000,
    supplier: 'DTF Solutions Chile',
    storageLocation: 'Gabinete Climatizado DTF',
    notes: 'Agitar diariamente para prevenir decantación de dióxido de titanio.',
    updatedAt: '2026-03-29T11:00:00Z',
    createdAt: '2026-01-05T10:00:00Z'
  },
  {
    id: 'inv-tin-02',
    ownerId: 'default',
    sku: 'INK-DTF-CMYK-SET',
    name: 'Set Tintas DTF CMYK 4 Colores (Cyan, Magenta, Yellow, Black)',
    category: 'tintas',
    brand: 'ColorPrint Pro',
    currentStock: 8.0,
    minStockAlert: 4.0,
    unit: 'litros',
    unitCost: 35000,
    supplier: 'DTF Solutions Chile',
    storageLocation: 'Gabinete Climatizado DTF',
    updatedAt: '2026-03-26T16:00:00Z',
    createdAt: '2026-01-05T10:00:00Z'
  },
  {
    id: 'inv-tin-03',
    ownerId: 'default',
    sku: 'INK-PLS-WHT-1KG',
    name: 'Plastisol Blanco Super Flash Libre de Ftalatos (1 Kg)',
    category: 'tintas',
    brand: 'Rutland / Union Ink',
    colorName: 'Blanco Nieve',
    colorHex: '#FFFFFF',
    currentStock: 14.0,
    minStockAlert: 5.0,
    unit: 'kg',
    unitCost: 16500,
    supplier: 'Insumos Serigráficos Andina',
    storageLocation: 'Estantería Químicos 2',
    updatedAt: '2026-03-24T10:00:00Z',
    createdAt: '2026-01-08T10:00:00Z'
  },

  // 5. VINILOS
  {
    id: 'inv-vin-01',
    ownerId: 'default',
    sku: 'VIN-PU-BLK-25M',
    name: 'Vinilo Textil Poliuretano Mate Negro 50cm x 25m',
    category: 'vinilos',
    brand: 'Siser PS Film / Poli-Tape',
    colorName: 'Negro Mate',
    colorHex: '#1A1A1A',
    currentStock: 38, // Metros disponibles
    minStockAlert: 20,
    unit: 'metros',
    unitCost: 4800,
    supplier: 'Vinilos & Plotters SA',
    storageLocation: 'Rack Bobinas 1',
    updatedAt: '2026-03-28T14:00:00Z',
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'inv-vin-02',
    ownerId: 'default',
    sku: 'VIN-REF-3M-SILV',
    name: 'Vinilo Térmico Reflectivo Gris Homologado 3M 50cm',
    category: 'vinilos',
    brand: '3M Scotchlite 8712',
    colorName: 'Plateado Reflectivo',
    colorHex: '#CBD5E1',
    currentStock: 8, // ALERTA: Solo 8 metros
    minStockAlert: 15,
    unit: 'metros',
    unitCost: 9900,
    supplier: 'Seguridad Industrial Chile',
    storageLocation: 'Rack Bobinas 2',
    updatedAt: '2026-03-29T12:00:00Z',
    createdAt: '2026-01-20T10:00:00Z'
  },

  // 6. PELÍCULAS
  {
    id: 'inv-pel-01',
    ownerId: 'default',
    sku: 'FLM-DTF-60CM-100M',
    name: 'Bobina Film DTF PET Hot Peel 60cm x 100m Doble Cara Mate',
    category: 'peliculas',
    brand: 'NanoPrint Film',
    currentStock: 2, // 2 Bobinas
    minStockAlert: 3, // ALERTA
    unit: 'rollos',
    unitCost: 89000,
    supplier: 'DTF Solutions Chile',
    storageLocation: 'Estante DTF Bodega',
    updatedAt: '2026-03-27T10:00:00Z',
    createdAt: '2026-01-15T10:00:00Z'
  },
  {
    id: 'inv-pel-02',
    ownerId: 'default',
    sku: 'FLM-DTF-A3-100SH',
    name: 'Pack Hojas Film DTF A3+ Premium (100 Hojas)',
    category: 'peliculas',
    brand: 'NanoPrint Sheets',
    currentStock: 5,
    minStockAlert: 2,
    unit: 'paquetes',
    unitCost: 45000,
    storageLocation: 'Estante DTF Bodega',
    updatedAt: '2026-03-20T16:00:00Z',
    createdAt: '2026-01-18T10:00:00Z'
  },

  // 7. PAPELES
  {
    id: 'inv-pap-01',
    ownerId: 'default',
    sku: 'PAP-SUB-ASUB-A3',
    name: 'Papel Sublimación A-Sub 125g A3 Secado Rápido (100 Hojas)',
    category: 'papeles',
    brand: 'A-Sub Paper',
    currentStock: 7,
    minStockAlert: 3,
    unit: 'paquetes',
    unitCost: 18500,
    supplier: 'SublimaPro Express',
    storageLocation: 'Gaveta Papelería 1',
    updatedAt: '2026-03-22T10:00:00Z',
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'inv-pap-02',
    ownerId: 'default',
    sku: 'PAP-LAS-NOCUT-A4',
    name: 'Papel Transfer Láser No-Cut Forever Laser-Dark (50 Hojas)',
    category: 'papeles',
    brand: 'Forever Transfer',
    currentStock: 3,
    minStockAlert: 2,
    unit: 'paquetes',
    unitCost: 56000,
    supplier: 'Transfer Laser Tecnologías',
    storageLocation: 'Gaveta Papelería 2',
    updatedAt: '2026-03-18T11:00:00Z',
    createdAt: '2026-01-15T10:00:00Z'
  },

  // 8. HILOS
  {
    id: 'inv-hil-01',
    ownerId: 'default',
    sku: 'THD-POL-40-BLK',
    name: 'Cono Hilo de Bordar Poliéster 40 Negro 5000m',
    category: 'hilos',
    brand: 'Madeira Polyneon',
    colorName: 'Negro 1800',
    colorHex: '#000000',
    currentStock: 12,
    minStockAlert: 4,
    unit: 'conos',
    unitCost: 5900,
    supplier: 'Hilos & Accesorios Bordado',
    storageLocation: 'Rack Hilos Bordadora',
    updatedAt: '2026-03-25T14:00:00Z',
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'inv-hil-02',
    ownerId: 'default',
    sku: 'THD-POL-40-WHT',
    name: 'Cono Hilo de Bordar Poliéster 40 Blanco Nieve 5000m',
    category: 'hilos',
    brand: 'Madeira Polyneon',
    colorName: 'Blanco 1801',
    colorHex: '#FFFFFF',
    currentStock: 10,
    minStockAlert: 4,
    unit: 'conos',
    unitCost: 5900,
    supplier: 'Hilos & Accesorios Bordado',
    storageLocation: 'Rack Hilos Bordadora',
    updatedAt: '2026-03-25T14:00:00Z',
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'inv-hil-03',
    ownerId: 'default',
    sku: 'THD-MET-GLD-2500M',
    name: 'Cono Hilo Metálico Oro Brillante 2500m',
    category: 'hilos',
    brand: 'Marathon Gold',
    colorName: 'Oro Real',
    colorHex: '#F59E0B',
    currentStock: 1, // ALERTA
    minStockAlert: 2,
    unit: 'conos',
    unitCost: 12500,
    supplier: 'Hilos & Accesorios Bordado',
    storageLocation: 'Rack Hilos Bordadora',
    updatedAt: '2026-03-28T09:00:00Z',
    createdAt: '2026-01-12T10:00:00Z'
  },

  // 9. CONSUMIBLES
  {
    id: 'inv-con-01',
    ownerId: 'default',
    sku: 'CSM-POL-DTF-1KG',
    name: 'Polvo Adhesivo Poliamida DTF Poliuretano Grano Fino (1 Kg)',
    category: 'consumibles',
    brand: 'NanoBond TPU Ultra',
    currentStock: 4, // 4 Kg
    minStockAlert: 6, // ALERTA
    unit: 'kg',
    unitCost: 26000,
    supplier: 'DTF Solutions Chile',
    storageLocation: 'Estante DTF Bodega',
    notes: 'Temperatura de fusión 115°C - 125°C. Mantener sellado contra humedad.',
    updatedAt: '2026-03-29T10:00:00Z',
    createdAt: '2026-01-15T10:00:00Z'
  },
  {
    id: 'inv-con-02',
    ownerId: 'default',
    sku: 'CSM-TAPE-HT-10MM',
    name: 'Cinta Térmica Kapton Alta Temperatura 10mm x 33m',
    category: 'consumibles',
    brand: 'HeatShield Pro',
    currentStock: 14,
    minStockAlert: 5,
    unit: 'rollos',
    unitCost: 2200,
    supplier: 'SublimaPro Express',
    storageLocation: 'Mesa Planchado 1',
    updatedAt: '2026-03-20T14:00:00Z',
    createdAt: '2026-01-15T10:00:00Z'
  },
  {
    id: 'inv-con-03',
    ownerId: 'default',
    sku: 'CSM-EMU-SER-1KG',
    name: 'Emulsión Fotopolímero Directa Resistente a Plastisol/Agua (1 Kg)',
    category: 'consumibles',
    brand: 'Murakami / Ulano QTX',
    currentStock: 1.5, // ALERTA
    minStockAlert: 3.0,
    unit: 'kg',
    unitCost: 38000,
    supplier: 'Insumos Serigráficos Andina',
    storageLocation: 'Cuarto Oscuro Revelado',
    notes: 'Caducidad estimada: 6 meses tras apertura.',
    updatedAt: '2026-03-27T17:00:00Z',
    createdAt: '2026-01-20T10:00:00Z'
  },

  // 10. MÁQUINAS
  {
    id: 'inv-maq-01',
    ownerId: 'default',
    sku: 'EQP-DTF-ORIC-60',
    name: 'Impresora DTF Industrial 60cm Doble Cabezal Epson i3200',
    category: 'maquinas',
    brand: 'Oric Industrial / Hosonsoft',
    machineModel: 'Oric DTF-602 Roll-to-Roll + Horno Shaker Automático',
    machineStatus: 'operativa',
    currentStock: 1,
    minStockAlert: 1,
    unit: 'equipos',
    unitCost: 7500000,
    supplier: 'DTF Solutions Chile',
    storageLocation: 'Sala Impresión Climatizada',
    lastMaintenanceDate: '2026-03-15',
    nextMaintenanceDate: '2026-04-15',
    notes: 'Limpieza diaria de wiper y capping al finalizar turno.',
    updatedAt: '2026-03-29T10:00:00Z',
    createdAt: '2026-01-01T10:00:00Z'
  },
  {
    id: 'inv-maq-02',
    ownerId: 'default',
    sku: 'EQP-PLP-SER-6C',
    name: 'Pulpo Serigráfico Textil 6 Colores / 6 Estaciones con Micro-registro',
    category: 'maquinas',
    brand: 'Vastex V-2000 HD',
    machineModel: 'V-2000-66',
    machineStatus: 'operativa',
    currentStock: 1,
    minStockAlert: 1,
    unit: 'equipos',
    unitCost: 4800000,
    storageLocation: 'Taller Central Serigrafía',
    lastMaintenanceDate: '2026-03-01',
    nextMaintenanceDate: '2026-05-01',
    updatedAt: '2026-03-20T12:00:00Z',
    createdAt: '2026-01-01T10:00:00Z'
  },
  {
    id: 'inv-maq-03',
    ownerId: 'default',
    sku: 'EQP-PRS-NEU-4050',
    name: 'Prensa Térmica Neumática Doble Plato 40x50cm',
    category: 'maquinas',
    brand: 'STAHLS Hotronix Dual Air Fusion',
    machineModel: 'Air Fusion 40x50 Auto',
    machineStatus: 'operativa',
    currentStock: 2,
    minStockAlert: 1,
    unit: 'equipos',
    unitCost: 2900000,
    storageLocation: 'Estación de Transferencia 1 y 2',
    lastMaintenanceDate: '2026-03-10',
    nextMaintenanceDate: '2026-04-10',
    updatedAt: '2026-03-25T11:00:00Z',
    createdAt: '2026-01-01T10:00:00Z'
  },
  {
    id: 'inv-maq-04',
    ownerId: 'default',
    sku: 'EQP-BRD-TAJ-4H',
    name: 'Bordadora Computarizada Industrial 4 Cabezales 15 Agujas',
    category: 'maquinas',
    brand: 'Tajima TFMX-IIC',
    machineModel: 'TFMX-IIC 1504',
    machineStatus: 'en_mantenimiento',
    currentStock: 1,
    minStockAlert: 1,
    unit: 'equipos',
    unitCost: 14200000,
    storageLocation: 'Sector Confección y Bordado',
    lastMaintenanceDate: '2026-03-28',
    nextMaintenanceDate: '2026-03-31',
    notes: 'Calibración de tensión cabezal 3 y cambio de cuchillas rotativas.',
    updatedAt: '2026-03-29T09:00:00Z',
    createdAt: '2026-01-01T10:00:00Z'
  }
];

export const INITIAL_MOVEMENTS: InventoryMovementRecord[] = [
  {
    id: 'mov-01',
    ownerId: 'default',
    itemId: 'inv-tin-01',
    itemName: 'Tinta DTF Textil Blanca DMax Ultra-Opaca',
    itemSku: 'INK-DTF-WHT-1L',
    category: 'tintas',
    type: 'salida',
    quantity: 1.5,
    previousStock: 5.0,
    newStock: 3.5,
    reason: 'consumo_orden',
    orderRefNumber: 'OT-2026-014',
    operatorName: 'Rodrigo Maestro Prensa',
    notes: 'Carga de dampers y tanque para tirada de 50 polerones Tour.',
    timestamp: '2026-03-28T14:30:00Z'
  },
  {
    id: 'mov-02',
    ownerId: 'default',
    itemId: 'inv-pr-01',
    itemName: 'Camiseta Cuello Redondo Heavyweight 240g',
    itemSku: 'BLK-TSH-HVY-BLK',
    category: 'prendas',
    type: 'entrada',
    quantity: 100,
    previousStock: 80,
    newStock: 180,
    reason: 'compra',
    operatorName: 'Almacén Central',
    notes: 'Recepción Factura Proveedor N° 45892.',
    timestamp: '2026-03-25T11:00:00Z'
  },
  {
    id: 'mov-03',
    ownerId: 'default',
    itemId: 'inv-con-01',
    itemName: 'Polvo Adhesivo Poliamida DTF Poliuretano Grano Fino',
    itemSku: 'CSM-POL-DTF-1KG',
    category: 'consumibles',
    type: 'salida',
    quantity: 2.0,
    previousStock: 6.0,
    newStock: 4.0,
    reason: 'consumo_orden',
    orderRefNumber: 'OT-2026-014',
    operatorName: 'Rodrigo Maestro Prensa',
    notes: 'Relleno tolva del horno túnel con vibrador electro-magnético.',
    timestamp: '2026-03-29T10:15:00Z'
  }
];

export const INITIAL_PRODUCTION_TASKS: ProductionTaskRecord[] = [
  {
    id: 'task-01',
    ownerId: 'default',
    orderId: 'ord-01',
    orderNumber: 'OT-2026-014',
    customerName: 'Festival Indie Rock Fest',
    operatorName: 'Rodrigo Alarcón (Maestro DTF)',
    machineId: 'inv-maq-01',
    machineName: 'Impresora DTF Industrial 60cm + Horno Shaker',
    technique: 'DTF Textil',
    scheduledDate: '2026-03-30',
    estimatedMinutes: 180,
    actualMinutes: 120,
    status: 'en_proceso',
    totalPieces: 50,
    completedPieces: 35,
    materials: [
      { materialName: 'Film PET DTF 60cm', quantity: '28 metros', isDeducted: true },
      { materialName: 'Poliamida Poliuretano Fina', quantity: '1.2 kg', isDeducted: true },
      { materialName: 'Tinta DTF Blanca DMax', quantity: '850 ml', isDeducted: true }
    ],
    notes: 'Curado en shaker a 125°C constante con velocidad nivel 4.',
    createdAt: '2026-03-28T10:00:00Z',
    updatedAt: '2026-03-30T10:30:00Z'
  },
  {
    id: 'task-02',
    ownerId: 'default',
    orderId: 'ord-02',
    orderNumber: 'OT-2026-015',
    customerName: 'Urban District Apparel',
    operatorName: 'Matías Silva (Serigrafista Senior)',
    machineId: 'inv-maq-02',
    machineName: 'Pulpo Serigráfico Vastex 6C/6E',
    technique: 'Serigrafía Plastisol',
    scheduledDate: '2026-04-02',
    estimatedMinutes: 240,
    status: 'programado',
    totalPieces: 100,
    completedPieces: 0,
    materials: [
      { materialName: 'Plastisol Blanco Super Flash', quantity: '2.5 kg', isDeducted: false },
      { materialName: 'Plastisol Negro Mate', quantity: '1.0 kg', isDeducted: false },
      { materialName: 'Mallas 77T y 90T', quantity: '3 marcos 50x60', isDeducted: true }
    ],
    notes: 'Flash curado intermedio de 4 segundos a 200°C antes de sobre-impresión.',
    createdAt: '2026-03-28T14:00:00Z',
    updatedAt: '2026-03-28T14:00:00Z'
  },
  {
    id: 'task-03',
    ownerId: 'default',
    orderId: 'ord-04',
    orderNumber: 'OT-2026-017',
    customerName: 'Club Deportivo Los Leones',
    operatorName: 'Camila Valenzuela (Sublimación)',
    machineId: 'inv-maq-03',
    machineName: 'Prensa Térmica Neumática 40x50cm',
    technique: 'Sublimación',
    scheduledDate: '2026-03-29',
    estimatedMinutes: 150,
    actualMinutes: 145,
    status: 'control_calidad',
    totalPieces: 60,
    completedPieces: 60,
    qualityPassed: true,
    materials: [
      { materialName: 'Papel Sublimación A-Sub 125g', quantity: '60 pliegos', isDeducted: true },
      { materialName: 'Cinta Térmica Kapton', quantity: '1 rollo', isDeducted: true }
    ],
    notes: 'Control de tono aprobado con espectrofotómetro contra muestra de prueba.',
    createdAt: '2026-03-27T09:00:00Z',
    updatedAt: '2026-03-29T18:00:00Z'
  }
];

// ==========================================
// CLASE MOTOR DE GESTIÓN Y PERSISTENCIA
// ==========================================

class AdminProductionService {
  private ownerId = 'default';

  public setOwnerId(uid?: string) {
    if (uid) {
      this.ownerId = uid;
    }
  }

  // ------------------------------------------
  // CLIENTES
  // ------------------------------------------

  public getCustomers(): CustomerRecord[] {
    try {
      const local = localStorage.getItem(LS_CUSTOMERS);
      if (local) {
        return JSON.parse(local);
      }
    } catch (e) {
      console.warn('Error reading customers from localStorage', e);
    }
    // Seed inicial si está vacío
    this.saveCustomersLocal(INITIAL_CUSTOMERS);
    return INITIAL_CUSTOMERS;
  }

  private saveCustomersLocal(items: CustomerRecord[]) {
    try {
      localStorage.setItem(LS_CUSTOMERS, JSON.stringify(items));
    } catch (e) {
      console.warn('Error writing customers to localStorage', e);
    }
  }

  public async syncCustomersFromFirestore(): Promise<CustomerRecord[]> {
    if (!auth?.currentUser) return this.getCustomers();
    try {
      const q = query(collection(db, 'customers'), where('ownerId', '==', auth.currentUser.uid));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const loaded: CustomerRecord[] = [];
        snap.forEach(d => loaded.push(d.data() as CustomerRecord));
        this.saveCustomersLocal(loaded);
        return loaded;
      }
    } catch (e) {
      console.warn('Firestore load customers fallback to local', e);
    }
    return this.getCustomers();
  }

  public async saveCustomer(customer: CustomerRecord): Promise<CustomerRecord> {
    const list = this.getCustomers();
    const existingIdx = list.findIndex(c => c.id === customer.id);
    const updated: CustomerRecord = {
      ...customer,
      ownerId: auth?.currentUser?.uid || this.ownerId,
      updatedAt: new Date().toISOString()
    };

    if (existingIdx >= 0) {
      list[existingIdx] = updated;
    } else {
      list.unshift(updated);
    }

    this.saveCustomersLocal(list);

    // Sync to Firestore
    if (auth?.currentUser) {
      try {
        await setDoc(doc(db, 'customers', updated.id), updated);
      } catch (err) {
        console.warn('Firestore save customer error', err);
      }
    }
    return updated;
  }

  public async deleteCustomer(id: string): Promise<void> {
    const list = this.getCustomers().filter(c => c.id !== id);
    this.saveCustomersLocal(list);
    if (auth?.currentUser) {
      try {
        await deleteDoc(doc(db, 'customers', id));
      } catch (err) {
        console.warn('Firestore delete customer error', err);
      }
    }
  }

  // ------------------------------------------
  // PEDIDOS (8 ESTADOS + DUPLICAR + CANCELAR)
  // ------------------------------------------

  public getOrders(): OrderRecord[] {
    try {
      const local = localStorage.getItem(LS_ORDERS);
      if (local) {
        return JSON.parse(local);
      }
    } catch (e) {
      console.warn('Error reading orders from localStorage', e);
    }
    this.saveOrdersLocal(INITIAL_ORDERS);
    return INITIAL_ORDERS;
  }

  private saveOrdersLocal(items: OrderRecord[]) {
    try {
      localStorage.setItem(LS_ORDERS, JSON.stringify(items));
    } catch (e) {
      console.warn('Error writing orders to localStorage', e);
    }
  }

  public async syncOrdersFromFirestore(): Promise<OrderRecord[]> {
    if (!auth?.currentUser) return this.getOrders();
    try {
      const q = query(collection(db, 'orders'), where('ownerId', '==', auth.currentUser.uid));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const loaded: OrderRecord[] = [];
        snap.forEach(d => loaded.push(d.data() as OrderRecord));
        this.saveOrdersLocal(loaded);
        return loaded;
      }
    } catch (e) {
      console.warn('Firestore load orders fallback to local', e);
    }
    return this.getOrders();
  }

  public async saveOrder(order: OrderRecord): Promise<OrderRecord> {
    const list = this.getOrders();
    const existingIdx = list.findIndex(o => o.id === order.id);
    const updated: OrderRecord = {
      ...order,
      ownerId: auth?.currentUser?.uid || this.ownerId,
      updatedAt: new Date().toISOString()
    };

    if (existingIdx >= 0) {
      list[existingIdx] = updated;
    } else {
      list.unshift(updated);
    }

    this.saveOrdersLocal(list);

    // Update customer stats if new
    this.refreshCustomerStats(updated.customerId);

    if (auth?.currentUser) {
      try {
        await setDoc(doc(db, 'orders', updated.id), updated);
      } catch (err) {
        console.warn('Firestore save order error', err);
      }
    }
    return updated;
  }

  public async duplicateOrder(sourceId: string): Promise<OrderRecord> {
    const list = this.getOrders();
    const source = list.find(o => o.id === sourceId);
    if (!source) throw new Error('Orden no encontrada');

    const nextOrderNum = `OT-2026-${String(list.length + 15).padStart(3, '0')}`;
    const duplicated: OrderRecord = {
      ...source,
      id: `ord-${Date.now()}`,
      orderNumber: nextOrderNum,
      title: `${source.title} (Copia)`,
      status: 'recibido', // Reinicia en el primer estado
      depositPaid: 0,
      balanceDue: source.totalAmount,
      cancellationReason: undefined,
      cancelledAt: undefined,
      cancelledBy: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    list.unshift(duplicated);
    this.saveOrdersLocal(list);

    if (auth?.currentUser) {
      try {
        await setDoc(doc(db, 'orders', duplicated.id), duplicated);
      } catch (err) {
        console.warn('Firestore save duplicated order', err);
      }
    }
    return duplicated;
  }

  public async cancelOrder(id: string, reason: string): Promise<OrderRecord> {
    const list = this.getOrders();
    const order = list.find(o => o.id === id);
    if (!order) throw new Error('Orden no encontrada');

    order.status = 'cancelado';
    order.cancellationReason = reason;
    order.cancelledAt = new Date().toISOString();
    order.cancelledBy = auth?.currentUser?.displayName || 'Administrador de Taller';
    order.updatedAt = new Date().toISOString();

    this.saveOrdersLocal(list);

    if (auth?.currentUser) {
      try {
        await setDoc(doc(db, 'orders', order.id), order);
      } catch (err) {
        console.warn('Firestore cancel order error', err);
      }
    }
    return order;
  }

  public async updateOrderStatus(id: string, newStatus: OrderStatus): Promise<OrderRecord> {
    const list = this.getOrders();
    const order = list.find(o => o.id === id);
    if (!order) throw new Error('Orden no encontrada');

    order.status = newStatus;
    order.updatedAt = new Date().toISOString();

    this.saveOrdersLocal(list);

    if (auth?.currentUser) {
      try {
        await setDoc(doc(db, 'orders', order.id), order);
      } catch (err) {
        console.warn('Firestore update order status error', err);
      }
    }
    return order;
  }

  private refreshCustomerStats(customerId?: string) {
    if (!customerId) return;
    const customers = this.getCustomers();
    const custIdx = customers.findIndex(c => c.id === customerId);
    if (custIdx < 0) return;

    const orders = this.getOrders().filter(o => o.customerId === customerId && o.status !== 'cancelado');
    customers[custIdx].totalOrdersCount = orders.length;
    customers[custIdx].totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    this.saveCustomersLocal(customers);
  }

  // ------------------------------------------
  // INVENTARIO (10 CATEGORÍAS + MOVIMIENTOS + ALERTAS)
  // ------------------------------------------

  public getInventory(): InventoryItemRecord[] {
    try {
      const local = localStorage.getItem(LS_INVENTORY);
      if (local) {
        return JSON.parse(local);
      }
    } catch (e) {
      console.warn('Error reading inventory from localStorage', e);
    }
    this.saveInventoryLocal(INITIAL_INVENTORY);
    return INITIAL_INVENTORY;
  }

  private saveInventoryLocal(items: InventoryItemRecord[]) {
    try {
      localStorage.setItem(LS_INVENTORY, JSON.stringify(items));
    } catch (e) {
      console.warn('Error writing inventory to localStorage', e);
    }
  }

  public getMovements(): InventoryMovementRecord[] {
    try {
      const local = localStorage.getItem(LS_MOVEMENTS);
      if (local) {
        return JSON.parse(local);
      }
    } catch (e) {
      console.warn('Error reading movements from localStorage', e);
    }
    this.saveMovementsLocal(INITIAL_MOVEMENTS);
    return INITIAL_MOVEMENTS;
  }

  private saveMovementsLocal(items: InventoryMovementRecord[]) {
    try {
      localStorage.setItem(LS_MOVEMENTS, JSON.stringify(items));
    } catch (e) {
      console.warn('Error writing movements to localStorage', e);
    }
  }

  public async saveInventoryItem(item: InventoryItemRecord): Promise<InventoryItemRecord> {
    const list = this.getInventory();
    const existingIdx = list.findIndex(i => i.id === item.id);
    const updated: InventoryItemRecord = {
      ...item,
      ownerId: auth?.currentUser?.uid || this.ownerId,
      updatedAt: new Date().toISOString()
    };

    if (existingIdx >= 0) {
      list[existingIdx] = updated;
    } else {
      list.unshift(updated);
    }

    this.saveInventoryLocal(list);

    if (auth?.currentUser) {
      try {
        await setDoc(doc(db, 'inventory', updated.id), updated);
      } catch (err) {
        console.warn('Firestore save inventory item error', err);
      }
    }
    return updated;
  }

  public async deleteInventoryItem(id: string): Promise<void> {
    const list = this.getInventory().filter(i => i.id !== id);
    this.saveInventoryLocal(list);
    if (auth?.currentUser) {
      try {
        await deleteDoc(doc(db, 'inventory', id));
      } catch (err) {
        console.warn('Firestore delete inventory item error', err);
      }
    }
  }

  public async registerStockMovement(params: {
    itemId: string;
    type: 'entrada' | 'salida';
    quantity: number;
    reason: InventoryMovementRecord['reason'];
    orderRefNumber?: string;
    operatorName?: string;
    notes?: string;
  }): Promise<{ movement: InventoryMovementRecord; updatedItem: InventoryItemRecord }> {
    const items = this.getInventory();
    const item = items.find(i => i.id === params.itemId);
    if (!item) throw new Error('Ítem de inventario no encontrado');

    const previousStock = item.currentStock;
    let newStock = previousStock;

    if (params.type === 'entrada') {
      newStock = previousStock + params.quantity;
    } else {
      newStock = Math.max(0, previousStock - params.quantity);
    }

    item.currentStock = Number(newStock.toFixed(2));
    item.updatedAt = new Date().toISOString();
    this.saveInventoryLocal(items);

    const movement: InventoryMovementRecord = {
      id: `mov-${Date.now()}`,
      ownerId: auth?.currentUser?.uid || this.ownerId,
      itemId: item.id,
      itemName: item.name,
      itemSku: item.sku,
      category: item.category,
      type: params.type,
      quantity: params.quantity,
      previousStock,
      newStock: item.currentStock,
      reason: params.reason,
      orderRefNumber: params.orderRefNumber,
      operatorName: params.operatorName || 'Operador de Turno',
      notes: params.notes,
      timestamp: new Date().toISOString()
    };

    const movements = this.getMovements();
    movements.unshift(movement);
    this.saveMovementsLocal(movements);

    // Sync to Firestore
    if (auth?.currentUser) {
      try {
        await setDoc(doc(db, 'inventory', item.id), item);
        await setDoc(doc(db, 'inventoryMovements', movement.id), movement);
      } catch (err) {
        console.warn('Firestore sync movement error', err);
      }
    }

    return { movement, updatedItem: item };
  }

  // ------------------------------------------
  // PRODUCCIÓN Y ASIGNACIONES
  // ------------------------------------------

  public getProductionTasks(): ProductionTaskRecord[] {
    try {
      const local = localStorage.getItem(LS_TASKS);
      if (local) {
        return JSON.parse(local);
      }
    } catch (e) {
      console.warn('Error reading production tasks', e);
    }
    this.saveTasksLocal(INITIAL_PRODUCTION_TASKS);
    return INITIAL_PRODUCTION_TASKS;
  }

  private saveTasksLocal(items: ProductionTaskRecord[]) {
    try {
      localStorage.setItem(LS_TASKS, JSON.stringify(items));
    } catch (e) {
      console.warn('Error writing production tasks', e);
    }
  }

  public async saveProductionTask(task: ProductionTaskRecord): Promise<ProductionTaskRecord> {
    const list = this.getProductionTasks();
    const existingIdx = list.findIndex(t => t.id === task.id);
    const updated: ProductionTaskRecord = {
      ...task,
      ownerId: auth?.currentUser?.uid || this.ownerId,
      updatedAt: new Date().toISOString()
    };

    if (existingIdx >= 0) {
      list[existingIdx] = updated;
    } else {
      list.unshift(updated);
    }

    this.saveTasksLocal(list);

    if (auth?.currentUser) {
      try {
        await setDoc(doc(db, 'productionTasks', updated.id), updated);
      } catch (err) {
        console.warn('Firestore save production task error', err);
      }
    }
    return updated;
  }

  public async updateTaskProgress(taskId: string, completedPieces: number, status?: ProductionTaskRecord['status']): Promise<ProductionTaskRecord> {
    const list = this.getProductionTasks();
    const task = list.find(t => t.id === taskId);
    if (!task) throw new Error('Tarea no encontrada');

    task.completedPieces = completedPieces;
    if (status) task.status = status;
    if (completedPieces >= task.totalPieces && !status) {
      task.status = 'control_calidad';
    }
    task.updatedAt = new Date().toISOString();

    this.saveTasksLocal(list);

    if (auth?.currentUser) {
      try {
        await setDoc(doc(db, 'productionTasks', task.id), task);
      } catch (err) {
        console.warn('Firestore update task progress error', err);
      }
    }
    return task;
  }

  // ------------------------------------------
  // REPORTES Y ANALÍTICA DE NEGOCIO
  // ------------------------------------------

  public getWorkshopMetricsReport(): WorkshopMetricsReport {
    const orders = this.getOrders();
    const inventory = this.getInventory();
    const tasks = this.getProductionTasks();
    const movements = this.getMovements();

    const pendingOrders = orders.filter(o => 
      ['recibido', 'pendiente_diseno', 'diseno_aprobado', 'preparacion', 'en_produccion', 'control_calidad'].includes(o.status)
    );
    const finishedOrders = orders.filter(o => ['terminado', 'entregado'].includes(o.status));
    const inProduction = orders.filter(o => o.status === 'en_produccion');
    const inQC = orders.filter(o => o.status === 'control_calidad');

    const lowStockItems = inventory.filter(i => i.currentStock <= i.minStockAlert);
    const machines = inventory.filter(i => i.category === 'maquinas');
    const activeMachines = machines.filter(m => m.machineStatus === 'operativa');
    const maintenanceMachines = machines.filter(m => m.machineStatus === 'en_mantenimiento');

    const totalPiecesProducedMonth = orders
      .filter(o => o.status === 'terminado' || o.status === 'entregado')
      .reduce((sum, o) => sum + (o.totalPieces || 0), 0);

    const totalRevenueMonth = orders
      .filter(o => o.status !== 'cancelado')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const operatorsSet = new Set(tasks.map(t => t.operatorName));

    return {
      pendingOrdersCount: pendingOrders.length,
      finishedOrdersCount: finishedOrders.length,
      totalOrdersCount: orders.length,
      ordersInProductionCount: inProduction.length,
      ordersInQualityControlCount: inQC.length,
      totalPiecesProducedMonth,
      totalRevenueMonth,
      availableMaterialsCount: inventory.filter(i => i.currentStock > i.minStockAlert).length,
      materialsNeedingReplenishmentCount: lowStockItems.length,
      lowStockItems,
      activeMachinesCount: activeMachines.length,
      maintenanceMachinesCount: maintenanceMachines.length,
      recentMovementsCount: movements.length,
      activeOperatorsCount: operatorsSet.size
    };
  }

  // ------------------------------------------
  // CONTROL DE CALIDAD Y CERTIFICACIONES (Prompt 16)
  // ------------------------------------------

  public getQualityInspections(): QualityInspectionRecord[] {
    try {
      const local = localStorage.getItem(LS_QUALITY_INSPECTIONS);
      if (local) {
        return JSON.parse(local);
      }
    } catch (e) {
      console.warn('Error reading quality inspections from localStorage', e);
    }
    const seed: QualityInspectionRecord[] = [
      {
        id: 'qc-01',
        ownerId: 'default',
        orderId: 'ord-01',
        orderNumber: 'OT-2026-014',
        customerName: 'Festival Indie Rock Fest',
        garmentName: 'Polerón French Terry 380g',
        techniqueName: 'DTF Textil',
        totalPieces: 50,
        inspectedPieces: 50,
        rejectedPieces: 1,
        rejectionRatePercent: 2.0,
        status: 'aprobado',
        inspectorName: 'Carlos Rivas (Inspector QC)',
        certificateNumber: 'CERT-QC-2026-089',
        observations: 'Excelente polimerización y anclaje de poliamida. Solidez al lavado 5/5. 1 pieza rechazada por mota de pelusa previa al prensado.',
        createdAt: '2026-03-29T15:00:00Z',
        tests: [
          { id: 't1', name: 'Prueba de Estiramiento Cruzado (100%)', description: 'Sin cuarteo ni desprendimiento perimetral del film', category: 'estiramiento', status: 'passed' },
          { id: 't2', name: 'Curado Térmico y Polimerización', description: 'Curado completo verificado con prueba de tacto no pegajoso', category: 'curado', status: 'passed' },
          { id: 't3', name: 'Solidez al Frote y Lavado', description: 'Sin migración de pigmento ni pérdida de densidad', category: 'solidez', status: 'passed' },
          { id: 't4', name: 'Registro y Alineación Anatómica', description: 'Centrado a 7cm de la nuca con margen de error < 2mm', category: 'registro', status: 'passed' },
          { id: 't5', name: 'Tacto y Mano Textil', description: 'Mano flexible y suave al tacto sobre french terry', category: 'tacto', status: 'passed' }
        ]
      }
    ];
    this.saveQualityInspectionsLocal(seed);
    return seed;
  }

  private saveQualityInspectionsLocal(items: QualityInspectionRecord[]) {
    try {
      localStorage.setItem(LS_QUALITY_INSPECTIONS, JSON.stringify(items));
    } catch (e) {
      console.warn('Error writing quality inspections to localStorage', e);
    }
  }

  public async saveQualityInspection(inspection: QualityInspectionRecord): Promise<QualityInspectionRecord> {
    const list = this.getQualityInspections();
    const existingIdx = list.findIndex(i => i.id === inspection.id);
    const updated: QualityInspectionRecord = {
      ...inspection,
      ownerId: auth?.currentUser?.uid || this.ownerId
    };

    if (existingIdx >= 0) {
      list[existingIdx] = updated;
    } else {
      list.unshift(updated);
    }

    this.saveQualityInspectionsLocal(list);

    // Si el control de calidad es aprobado, actualizar la orden asociada a 'terminado'
    if (updated.status === 'aprobado' || updated.status === 'aprobado_con_observaciones') {
      try {
        await this.updateOrderStatus(updated.orderId, 'terminado');
      } catch (err) {
        console.warn('No se pudo actualizar orden a terminado tras QC', err);
      }
    }

    if (auth?.currentUser) {
      try {
        await setDoc(doc(db, 'qualityInspections', updated.id), updated);
      } catch (err) {
        console.warn('Firestore save quality inspection error', err);
      }
    }

    return updated;
  }
}

export const adminProductionService = new AdminProductionService();
