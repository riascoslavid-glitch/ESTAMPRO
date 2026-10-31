import { Garment3DModelType } from '../services/three/garmentGeometries';
import { GarmentMainCategory, GarmentMeasurement } from './index';

export interface VolumePriceTier {
  minQty: number;
  maxQty?: number;
  discountPercent: number;
  unitPrice: number;
}

export interface StoreProduct {
  id: string;
  garmentId: string;
  name: string;
  shortDescription: string;
  description: string;
  photoUrl: string;
  model3DType: Garment3DModelType;
  category: GarmentMainCategory;
  isPublished: boolean;
  featured: boolean;
  basePrice: number;
  volumePricing: VolumePriceTier[];
  availableColors: { name: string; hex: string }[];
  availableSizes: string[];
  measurements: GarmentMeasurement[];
  composition: string;
  weightGsm: string;
  defaultTechnique: string;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  totalStock: number;
  linkedInventoryId?: string;
  updatedAt: string;
}

export interface CatalogDesign {
  id: string;
  title: string;
  category: 'urbano' | 'deportivo' | 'tipografico' | 'minimalista' | 'vintage' | 'anime' | 'empresarial';
  previewUrl: string;
  isPublic: boolean;
  recommendedTechnique: string;
  tags: string[];
  colorsCount: number;
  createdAt: string;
}

export type PrintPlacementZone = 
  | 'pecho_central'
  | 'pecho_izquierdo'
  | 'espalda_completa'
  | 'manga_izquierda'
  | 'manga_derecha'
  | 'nuca';

export interface PrintPlacementConfig {
  id: PrintPlacementZone;
  name: string;
  dimensionsCm: string;
  maxDecalScale: number;
  description: string;
  defaultPosition3D: [number, number, number];
  defaultRotation3D: [number, number, number];
}

export interface ClientCustomization {
  id: string;
  clientId: string;
  clientEmail: string;
  clientName: string;
  title: string;
  garmentId: string;
  garmentName: string;
  garmentPhotoUrl: string;
  model3DType: Garment3DModelType;
  colorHex: string;
  colorName: string;
  techniqueId: string;
  placement: PrintPlacementZone;
  uploadedDesignUrl?: string;
  selectedCatalogDesignId?: string;
  customText: string;
  textColor: string;
  textFont: string;
  textSize: number;
  textCurve: number;
  designScale: number;
  designRotation: number;
  designOffsetX: number;
  designOffsetY: number;
  sizesBreakdown: { size: string; quantity: number }[];
  totalUnits: number;
  unitPrice: number;
  subtotal: number;
  discountApplied: number;
  totalEstimated: number;
  status: 
    | 'borrador' 
    | 'cotizacion_solicitada' 
    | 'pedido_solicitado' 
    | 'en_revision' 
    | 'diseno_aprobado' 
    | 'observaciones_taller'
    | 'en_produccion';
  reviewNotes?: string;
  adminFeedback?: string;
  associatedOrderId?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreOrderRequest {
  customization: ClientCustomization;
  requestType: 'cotizacion' | 'pedido' | 'revision';
  customerContact: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    deliveryDateRequested: string;
    notes?: string;
  };
}
