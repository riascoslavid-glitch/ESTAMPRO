/**
 * ESTAMPAPRO 360° - Definiciones de Tipos y Arquitectura Central
 * Plataforma integral de diseño, simulación 3D y producción textil.
 */

export type ModuleCategory =
  | 'principal'
  | 'diseno_3d'
  | 'taller_tecnica'
  | 'negocio_comercial'
  | 'sistema';

export type ModuleStatus =
  | 'active'
  | 'pending_implementation'
  | 'planned';

export interface AppModule {
  id: string;
  orderNumber: number;
  name: string;
  shortName: string;
  category: ModuleCategory;
  categoryLabel: string;
  description: string;
  iconName: string;
  status: ModuleStatus;
  plannedStagePrompt?: number;
  technicalCapabilities: string[];
  deliverablesSummary: string[];
}

import type { PrintingTechniqueId } from './techniques';
export * from './techniques';
export * from './productionAssistant';
export * from './printPreparation';
export * from './finance';
export * from './adminProduction';
export * from './store';
export * from './library';
export * from './learning';

export interface PrintingTechnique {
  id: PrintingTechniqueId;
  name: string;
  shortDesc: string;
  fullDesc: string;
  idealFor: string;
  recommendedFabrics: string[];
  minQuantity: number;
  durabilityRating: number;
  colorGamut: string;
  setupComplexity: 'Baja' | 'Media' | 'Alta';
  productionSpeed: 'Rápida' | 'Media' | 'Industrial';
  equipmentRequired: string[];
}

export type GarmentMainCategory = 'camisetas' | 'busos' | 'otras_prendas' | 'accesorios';

export type GarmentSubcategory =
  // Camisetas
  | 'cuello_redondo'
  | 'cuello_v'
  | 'oversize'
  | 'deportivas'
  | 'manga_corta'
  | 'manga_larga'
  | 'polo'
  | 'infantil'
  | 'bebe'
  // Busos
  | 'hoodie'
  | 'cremallera'
  | 'deportivos'
  // Otras prendas
  | 'camisas'
  | 'chaquetas'
  | 'chalecos'
  | 'uniformes'
  | 'pantalones'
  | 'pantalonetas'
  | 'shorts'
  | 'ropa_deportiva'
  | 'ropa_laboral'
  | 'delantales'
  // Accesorios
  | 'gorras'
  | 'sombreros'
  | 'bolsos'
  | 'morrales'
  | 'mochilas'
  | 'toallas'
  | 'cojines'
  | 'otros';

export interface GarmentPartColor {
  partId: string;
  partName: string;
  colorHex: string;
}

export interface GarmentMeasurement {
  size: string;
  chestCm: number;
  lengthCm: number;
  sleeveCm?: number;
}

export interface GarmentItem {
  id: string;
  ownerId?: string;
  name: string;
  mainCategory: GarmentMainCategory;
  subcategory: GarmentSubcategory;
  photoUrl: string;
  model3DId: string; // ID o archivo 3D vinculado para el motor Three.js (Prompt 4)
  model3DName: string;
  materialId: string;
  materialName: string;
  composition: string;
  weightGsm?: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  printableAreas: string[];
  measurements: GarmentMeasurement[];
  compatibleTechniques: string[];
  basePurchasePrice: number;
  customizableParts: GarmentPartColor[];
  notes?: string;
  createdAt?: string;
  // Compatibilidad hacia atrás
  category?: string;
  material?: string;
  availableColors?: { name: string; hex: string }[];
}

export type GarmentType = GarmentItem;

export type ProjectStatus =
  | 'borrador'
  | 'en_diseno'
  | 'aprobado_cliente'
  | 'en_preprensa'
  | 'en_produccion'
  | 'terminado';

// Roles del sistema (Prompt 2)
export type UserRole =
  | 'administrador'
  | 'disenador'
  | 'operador'
  | 'vendedor'
  | 'cliente';

export interface RolePermissions {
  role: UserRole;
  label: string;
  description: string;
  allowedModules: string[];
  canEditSettings: boolean;
  canManageUsers: boolean;
  canViewFinances: boolean;
  canExportFiles: boolean;
  canDeleteProjects: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface ProjectLayer {
  id: string;
  name: string;
  type: 'vector' | 'raster' | 'text' | 'shape';
  visible: boolean;
  locked: boolean;
  opacity: number;
  colorHex?: string;
  spotColorName?: string; // e.g. "Pantone 186 C"
}

export interface ProjectPrintLocation {
  id: string;
  areaName: string; // 'Pecho frente', 'Espalda completa', 'Manga derecha', etc.
  widthCm: number;
  heightCm: number;
  offsetX: number;
  offsetY: number;
}

// Integración Realista de Diseños 3D (Prompt 8 & Motor 3D Pacdora)
export type PrintZone3D =
  | 'pecho_izquierdo'
  | 'pecho_derecho'
  | 'centro_pecho'
  | 'centro_frontal'
  | 'espalda'
  | 'espalda_superior'
  | 'espalda_completa'
  | 'manga_izquierda'
  | 'manga_derecha'
  | 'cuello'
  | 'capucha'
  | 'bolsillos'
  | 'bolsillo_canguro'
  | 'pantalones'
  | 'pierna_izquierda'
  | 'pierna_derecha'
  | 'gorras'
  | 'corona_frontal'
  | 'pechera_delantal'
  | 'bolsillo_delantal'
  | 'falda_delantal'
  | 'bolso_frontal'
  | 'cojin_frontal'
  | 'toalla_completa'
  | 'otras_superficies';

export interface DecalLayer3D {
  id: string;
  name: string;
  textureUri: string;
  zone: PrintZone3D;
  widthCm: number;
  heightCm: number;
  offsetXCm: number;
  offsetYCm: number;
  rotationDeg: number;
  scale: number;
  visible: boolean;
  locked: boolean;
  finishStyle: 'plastisol_brillante' | 'base_agua_mate' | 'dtf_suave' | 'sublimado' | 'relieve_puff';
  opacity: number;
}

export interface DecalPresetVersion {
  id: string;
  name: string;
  timestamp: number;
  garmentModel: string;
  decals: DecalLayer3D[];
  notes?: string;
}

export interface ProjectSettings {
  dpi: number;
  colorProfile: string;
  underbaseWhite: boolean;
  halftoneFrequencyLpi?: number;
  chokeTrappingMm?: number;
}

export interface Project {
  id: string;
  title: string;
  ownerId: string; // Usuario propietario (Prompt 2: Seguridad y roles)
  ownerEmail?: string;
  clientName: string;
  clientId?: string;
  garmentName: string;
  garmentColor: string;
  garmentColorHex: string;
  techniqueId: PrintingTechniqueId;
  quantity: number;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  autoSavedAt?: string;
  deadline?: string;
  notes?: string;
  thumbnailUrl?: string;
  layers?: ProjectLayer[];
  locations?: ProjectPrintLocation[];
  designs?: Array<{
    id: string;
    name: string;
    url?: string;
    dataUri?: string;
    widthCm: number;
    heightCm: number;
  }>;
  settings?: ProjectSettings;
  mockup3DConfig?: {
    modelType: string;
    rotation: number;
    printPosition: 'pecho_frente' | 'espalda' | 'manga_izquierda' | 'manga_derecha';
  };
  graphicStudioState?: any;
}

// Almacenamiento de archivos (Prompt 2 - Sección 4)
export type FileCategoryFolder =
  | 'artes_vectoriales'
  | 'fotolitos_rip'
  | 'mockups_3d'
  | 'fichas_tecnicas'
  | 'pedidos_clientes'
  | 'documentos'
  | 'disenos_recientes'
  | 'imagenes';

export interface StoredFileDimensions {
  widthPx?: number;
  heightPx?: number;
  widthCm?: number;
  heightCm?: number;
  dpi?: number;
}

export interface StoredFile {
  id: string;
  name: string;
  sizeBytes: number;
  mimeType: string;
  extension: string;
  folder: FileCategoryFolder;
  subfolder?: string;
  projectId?: string;
  projectName?: string;
  ownerId: string;
  url?: string;
  dataUri?: string; // Almacenamiento local o base64
  createdAt: string;
  updatedAt?: string;
  tags?: string[];
  dimensions?: StoredFileDimensions;
  isFavorite?: boolean;
  status?: 'terminado' | 'en_progreso' | 'borrador' | 'revision';
  graphicStudioState?: any;
}

export interface Customer {
  id: string;
  ownerId: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  city: string;
  address?: string;
  ordersCount: number;
  totalSpent: number;
  createdAt: string;
}

export interface Order {
  id: string;
  ownerId: string;
  projectId?: string;
  projectTitle: string;
  customerName: string;
  techniqueId: PrintingTechniqueId;
  quantity: number;
  totalAmount: number;
  status: 'pendiente' | 'en_prensa' | 'control_calidad' | 'listo_entrega' | 'entregado';
  deadline: string;
  createdAt: string;
}

export interface QuoteItem {
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Quote {
  id: string;
  ownerId: string;
  quoteNumber: string;
  clientName: string;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'borrador' | 'enviada' | 'aprobada' | 'rechazada';
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  ownerId: string;
  sku: string;
  name: string;
  category: 'prendas_blanks' | 'tintas' | 'emulsiones' | 'peliculas_dtf' | 'viniles' | 'hilos';
  stock: number;
  minAlertStock: number;
  unit: string;
  unitCost: number;
  supplier?: string;
  updatedAt: string;
}

export interface Machine {
  id: string;
  ownerId: string;
  name: string;
  type: 'pulpo_serigrafico' | 'prensa_termica' | 'impresora_dtf' | 'tunel_secado' | 'plotter_corte' | 'bordadora';
  brand: string;
  status: 'operativa' | 'en_mantenimiento' | 'detenida';
  lastMaintenance: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  moduleId?: string;
}

export interface WorkshopProfile {
  name: string;
  tagline: string;
  ownerEmail: string;
  phone: string;
  city: string;
  country: string;
  currency: string;
  currencySymbol: string;
  defaultDpi: number;
  defaultColorProfile: string;
  pricingMarginPercent: number;
  taxPercent: number;
  avatarUrl: string;
  maxFileUploadSizeMb: number; // Configurable storage limit (Prompt 2)
  allowedFileExtensions: string[];
}

export interface QuickToolAction {
  id: string;
  title: string;
  description: string;
  category: string;
  moduleId: string;
  iconName: string;
  shortcut?: string;
}
