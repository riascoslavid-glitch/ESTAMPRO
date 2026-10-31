/**
 * ESTAMPAPRO 360° - Tipos del Sistema de Administración y Producción (Prompt 14)
 * Módulos: Clientes, Pedidos, Inventario, Producción y Reportes de Taller.
 */

// ==========================================
// 1. CLIENTES (CRM TEXTIL)
// ==========================================

export interface CustomerRecord {
  id: string;
  ownerId: string;
  name: string; // Nombre o Razón Social
  contactPerson: string; // Contacto / Representante
  phone: string;
  email: string;
  address?: string; // Dirección cuando sea necesaria
  city?: string;
  taxId?: string; // RUT / NIT / CIF
  category?: 'mayorista' | 'marca_ropa' | 'corporativo' | 'eventos' | 'minorista';
  observations?: string; // Observaciones técnicas o comerciales
  totalOrdersCount: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 2. PEDIDOS Y ÓRDENES DE TRABAJO (OT)
// ==========================================

/**
 * 8 Estados exactos solicitados por la especificación:
 * Recibido -> Pendiente de diseño -> Diseño aprobado -> Preparación -> En producción -> Control de calidad -> Terminado -> Entregado
 * Más estado especial 'cancelado' con confirmación explícita.
 */
export type OrderStatus =
  | 'recibido'
  | 'pendiente_diseno'
  | 'diseno_aprobado'
  | 'preparacion'
  | 'en_produccion'
  | 'control_calidad'
  | 'terminado'
  | 'entregado'
  | 'cancelado';

export interface OrderStatusConfig {
  id: OrderStatus;
  label: string;
  badgeClass: string;
  description: string;
  orderIndex: number;
}

export const ORDER_STATUSES: Record<OrderStatus, OrderStatusConfig> = {
  recibido: {
    id: 'recibido',
    label: 'Recibido',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-300 dark:border-blue-800',
    description: 'Pedido registrado en taller con prendas y cotización definidas',
    orderIndex: 1
  },
  pendiente_diseno: {
    id: 'pendiente_diseno',
    label: 'Pendiente de diseño',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    description: 'En cola del departamento de arte gráfico o ajuste de vector',
    orderIndex: 2
  },
  diseno_aprobado: {
    id: 'diseno_aprobado',
    label: 'Diseño aprobado',
    badgeClass: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
    description: 'Arte final y mockups 3D validados por el cliente',
    orderIndex: 3
  },
  preparacion: {
    id: 'preparacion',
    label: 'Preparación',
    badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-300 dark:border-purple-800',
    description: 'Corte de blanks, impresión DTF, fotolitos o revelado de mallas',
    orderIndex: 4
  },
  en_produccion: {
    id: 'en_produccion',
    label: 'En producción',
    badgeClass: 'bg-orange-100 text-orange-800 dark:bg-orange-950/70 dark:text-orange-300 border-orange-300 dark:border-orange-800',
    description: 'En prensa térmica, pulpo serigráfico o bordadora activa',
    orderIndex: 5
  },
  control_calidad: {
    id: 'control_calidad',
    label: 'Control de calidad',
    badgeClass: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/70 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800',
    description: 'Inspección de solidez, registro, curado y prueba de estiramiento',
    orderIndex: 6
  },
  terminado: {
    id: 'terminado',
    label: 'Terminado',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    description: 'Prendas dobladas, empacadas y etiquetadas listas para entrega',
    orderIndex: 7
  },
  entregado: {
    id: 'entregado',
    label: 'Entregado',
    badgeClass: 'bg-green-100 text-green-800 dark:bg-green-950/70 dark:text-green-300 border-green-300 dark:border-green-800',
    description: 'Entregado satisfactoriamente al cliente con cobro liquidado',
    orderIndex: 8
  },
  cancelado: {
    id: 'cancelado',
    label: 'Cancelado',
    badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300 dark:border-rose-800',
    description: 'Orden cancelada con registro del motivo y reposición de stock',
    orderIndex: 9
  }
};

export interface OrderGarmentSizeBreakdown {
  size: string; // 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'Juvenil 12', etc.
  quantity: number;
}

export interface OrderGarmentLine {
  id: string;
  garmentId?: string;
  garmentName: string; // ej: 'Polera Heavyweight 240g'
  colorName: string;
  colorHex: string;
  sizes: OrderGarmentSizeBreakdown[];
  totalUnits: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderDesignLink {
  id: string;
  name: string;
  previewUrl: string;
  placement: string; // 'Pecho frente', 'Espalda completa', 'Bolsillo', 'Manga'
  dimensionsCm: string; // ej: '28 x 35 cm'
  technique: string; // DTF, Serigrafía, Sublimación, etc.
  colorsCount?: number;
}

export interface OrderRecord {
  id: string;
  ownerId: string;
  orderNumber: string; // e.g. 'OT-2026-014'
  title: string;
  
  // Asociaciones requeridas:
  customerId: string;
  customerName: string;
  customerContact?: string;
  customerEmail?: string;
  customerPhone?: string;
  
  associatedQuoteId?: string; // Asociación con cotización
  associatedQuoteNumber?: string;
  
  designs: OrderDesignLink[]; // Diseños asociados
  garments: OrderGarmentLine[]; // Prendas asociadas
  
  techniqueName: string; // Técnica principal de estampado
  status: OrderStatus;
  priority: 'normal' | 'alta' | 'urgente';
  
  totalPieces: number;
  totalAmount: number;
  depositPaid: number;
  balanceDue: number;
  
  deliveryDate: string; // Plazo de entrega
  productionNotes?: string; // Observaciones de producción
  
  // Cancelación segura con confirmación
  cancellationReason?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 3. INVENTARIO MULTI-CATEGORÍA
// ==========================================

export type InventoryCategory =
  | 'prendas'
  | 'tallas'
  | 'colores'
  | 'tintas'
  | 'vinilos'
  | 'peliculas'
  | 'papeles'
  | 'hilos'
  | 'consumibles'
  | 'maquinas';

export interface InventoryCategoryInfo {
  id: InventoryCategory;
  label: string;
  iconName: string;
  description: string;
  defaultUnit: string;
}

export const INVENTORY_CATEGORIES: Record<InventoryCategory, InventoryCategoryInfo> = {
  prendas: {
    id: 'prendas',
    label: 'Prendas (Blanks)',
    iconName: 'Shirt',
    description: 'Poleras, polerones, hoodies, gorras y cortes de confección lisos',
    defaultUnit: 'unidades'
  },
  tallas: {
    id: 'tallas',
    label: 'Tallas de Stock',
    iconName: 'Ruler',
    description: 'Control de curvas de tallas (XS, S, M, L, XL, XXL, Especiales)',
    defaultUnit: 'unidades'
  },
  colores: {
    id: 'colores',
    label: 'Variantes de Color',
    iconName: 'Palette',
    description: 'Paletas de telas teñidas, reactivos y blanks por tono',
    defaultUnit: 'unidades'
  },
  tintas: {
    id: 'tintas',
    label: 'Tintas Textiles',
    iconName: 'Droplet',
    description: 'Plastisoles, bases al agua, tintas DTF, tintas de sublimación',
    defaultUnit: 'kg'
  },
  vinilos: {
    id: 'vinilos',
    label: 'Vinilos Textiles',
    iconName: 'Layers',
    description: 'Vinil de corte termotransferible PU, reflectivos, glitter, flock',
    defaultUnit: 'metros'
  },
  peliculas: {
    id: 'peliculas',
    label: 'Películas (Films)',
    iconName: 'Film',
    description: 'Bobinas y hojas PET DTF hot-peel/cold-peel, acetatos fotolitos',
    defaultUnit: 'rollos'
  },
  papeles: {
    id: 'papeles',
    label: 'Papeles Transfer',
    iconName: 'FileText',
    description: 'Papel de sublimación de secado rápido, transfer láser no-cut',
    defaultUnit: 'hojas'
  },
  hilos: {
    id: 'hilos',
    label: 'Hilos de Bordar',
    iconName: 'Sparkles',
    description: 'Conos de poliéster 40, metálicos, fosforescentes y bobinas',
    defaultUnit: 'conos'
  },
  consumibles: {
    id: 'consumibles',
    label: 'Consumibles',
    iconName: 'Boxes',
    description: 'Poliamida DTF, emulsión, cintas térmicas, adhesivo de paleta, papel teflón',
    defaultUnit: 'unidades'
  },
  maquinas: {
    id: 'maquinas',
    label: 'Máquinas y Equipos',
    iconName: 'Printer',
    description: 'Impresoras, pulpos serigráficos, hornos túnel, planchas térmicas, bordadoras',
    defaultUnit: 'equipos'
  }
};

export interface InventoryItemRecord {
  id: string;
  ownerId: string;
  sku: string;
  name: string;
  category: InventoryCategory;
  subcategory?: string;
  brand?: string;
  size?: string; // Talla cuando aplique
  colorName?: string; // Color cuando aplique
  colorHex?: string;
  currentStock: number;
  minStockAlert: number; // Umbral de alerta mínima
  unit: string; // 'unidades', 'kg', 'metros', 'rollos', 'hojas', 'conos'
  unitCost: number; // Costo unitario promedio de adquisición
  supplier?: string;
  storageLocation?: string; // Pasillo, Estante, Gaveta
  notes?: string;
  
  // Parámetros específicos para máquinas
  machineModel?: string;
  machineStatus?: 'operativa' | 'en_mantenimiento' | 'detenida';
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  
  updatedAt: string;
  createdAt: string;
}

export type InventoryMovementType = 'entrada' | 'salida';

export interface InventoryMovementRecord {
  id: string;
  ownerId: string;
  itemId: string;
  itemName: string;
  itemSku: string;
  category: InventoryCategory;
  type: InventoryMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: 'compra' | 'ajuste_inventario' | 'consumo_orden' | 'merma_taller' | 'devolucion' | 'mantenimiento';
  orderRefNumber?: string; // Orden de trabajo asociada
  operatorName?: string;
  notes?: string;
  timestamp: string;
}

// ==========================================
// 4. PRODUCCIÓN Y ASIGNACIÓN DE TALLER
// ==========================================

export type ProductionTaskStatus =
  | 'programado'
  | 'en_proceso'
  | 'pausado'
  | 'control_calidad'
  | 'completado';

export interface MaterialUsageAllocation {
  materialName: string;
  quantity: string;
  stockItemId?: string;
  isDeducted: boolean;
}

export interface ProductionTaskRecord {
  id: string;
  ownerId: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  
  // Asignaciones requeridas:
  operatorName: string;
  operatorUid?: string;
  machineId: string;
  machineName: string;
  technique: string;
  
  scheduledDate: string; // Fecha de ejecución
  estimatedMinutes: number; // Tiempo estimado en minutos
  actualMinutes?: number; // Tiempo real registrado
  
  materials: MaterialUsageAllocation[]; // Materiales asignados
  status: ProductionTaskStatus;
  
  totalPieces: number;
  completedPieces: number;
  notes?: string;
  qualityPassed?: boolean;
  
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 5. REPORTES Y MÉTRICAS
// ==========================================

export interface WorkshopMetricsReport {
  pendingOrdersCount: number;
  finishedOrdersCount: number;
  totalOrdersCount: number;
  ordersInProductionCount: number;
  ordersInQualityControlCount: number;
  
  totalPiecesProducedMonth: number;
  totalRevenueMonth: number;
  
  availableMaterialsCount: number;
  materialsNeedingReplenishmentCount: number;
  lowStockItems: InventoryItemRecord[];
  
  activeMachinesCount: number;
  maintenanceMachinesCount: number;
  
  recentMovementsCount: number;
  activeOperatorsCount: number;
}

// ==========================================
// 6. CONTROL DE CALIDAD Y CERTIFICACIONES
// ==========================================

export interface QualityChecklistTest {
  id: string;
  name: string;
  description: string;
  category: 'curado' | 'estiramiento' | 'solidez' | 'tacto' | 'registro' | 'fibrilacion';
  status: 'passed' | 'failed' | 'warning';
  notes?: string;
}

export interface QualityInspectionRecord {
  id: string;
  ownerId: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  garmentName: string;
  techniqueName: string;
  totalPieces: number;
  inspectedPieces: number;
  rejectedPieces: number;
  rejectionRatePercent: number;
  tests: QualityChecklistTest[];
  inspectorName: string;
  status: 'aprobado' | 'aprobado_con_observaciones' | 'rechazado';
  observations: string;
  certificateNumber: string;
  createdAt: string;
}

