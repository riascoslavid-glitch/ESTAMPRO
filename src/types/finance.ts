import { PrintingTechniqueId } from './techniques';

export interface GarmentCostItem {
  id: string;
  name: string;
  category: string;
  unitCost: number; // Costo base de compra de la prenda lisa (blank)
  colorVariant: string;
  size: string;
}

export interface TechniqueCostFactors {
  techniqueId: PrintingTechniqueId;
  techniqueName: string;
  inkCostPerUnit: number; // Tintas (ml o g consumidos)
  filmCostPerUnit: number; // Película DTF / transfer film
  paperCostPerUnit: number; // Papel de sublimación / protector
  vinylCostPerUnit: number; // Vinilo textil
  threadCostPerUnit: number; // Hilos de bordado (por miles de puntadas)
  consumablesCostPerUnit: number; // Poliamida, teflón, pre-tratamiento, spray adhesivo
  machinePowerKw: number; // Potencia de máquina (prensa térmica, impresora, etc.)
  machineTimeMinutesPerUnit: number; // Minutos de uso de máquina por prenda
  setupFixedCost: number; // Costo fijo de puesta a punto (matrices, pantallas de serigrafía, ponchado)
}

export interface OperationalCostSettings {
  electricityKwhRate: number; // Costo por kWh de electricidad (ej: $0.15 USD o moneda local)
  laborHourlyRate: number; // Costo de mano de obra por hora operario (ej: $8.50)
  laborMinutesPerUnit: number; // Minutos de mano de obra directa dedicados por unidad
  packagingCostPerUnit: number; // Bolsa individual, hangtag, empaque protector
  transportCostPerOrder: number; // Envío o transporte por pedido completo
  wastePercentage: number; // Porcentaje de merma o desperdicio textil (ej: 4%)
  additionalExpensesPerOrder: number; // Gastos adicionales (fletes, diseño gráfico, imprevistos)
  defaultTargetMarginPercent: number; // Margen de ganancia comercial por defecto (ej: 45%)
  taxPercent: number; // IVA o impuesto local (ej: 19% o 16% o 0%)
  currencySymbol: string; // $, €, S/, etc.
}

export interface VolumeDiscountTier {
  minQuantity: number;
  label: string;
  discountPercentage: number; // Descuento porcentual sobre precio unitario
}

export interface CalculationSimulationRow {
  quantity: number;
  label: string;
  isCustom?: boolean;
  unitCost: number;
  batchCost: number;
  suggestedUnitPrice: number;
  discountPercent: number;
  finalUnitPrice: number;
  totalOrderPrice: number;
  totalProfit: number;
  marginPercent: number;
  wasteAmount: number;
}

export interface FullCostBreakdown {
  quantity: number;
  // Costos directos de materiales
  garmentCostUnit: number;
  garmentCostTotal: number;
  inksCostUnit: number;
  inksCostTotal: number;
  filmsCostUnit: number;
  filmsCostTotal: number;
  paperCostUnit: number;
  paperCostTotal: number;
  vinylCostUnit: number;
  vinylCostTotal: number;
  threadsCostUnit: number;
  threadsCostTotal: number;
  consumablesCostUnit: number;
  consumablesCostTotal: number;
  totalMaterialsCostUnit: number;
  totalMaterialsCostTotal: number;

  // Costos operativos y mano de obra
  laborCostUnit: number;
  laborCostTotal: number;
  electricityCostUnit: number;
  electricityCostTotal: number;
  machineTimeCostUnit: number;
  machineTimeCostTotal: number;
  setupCostAmortizedUnit: number;
  setupCostTotal: number;
  totalOperationsCostUnit: number;
  totalOperationsCostTotal: number;

  // Empaque, transporte, desperdicio y adicionales
  packagingCostUnit: number;
  packagingCostTotal: number;
  transportCostAmortizedUnit: number;
  transportCostTotal: number;
  wasteCostUnit: number;
  wasteCostTotal: number;
  additionalCostAmortizedUnit: number;
  additionalCostTotal: number;

  // Resumen final de costos
  totalUnitCost: number;
  totalBatchCost: number;

  // Precios y rentabilidad
  markupPercent: number;
  baseUnitPrice: number;
  volumeDiscountPercent: number;
  finalUnitPrice: number;
  subtotalOrder: number;
  taxAmount: number;
  totalOrderPrice: number;
  netProfitUnit: number;
  netProfitTotal: number;
  realMarginPercent: number;
}

export interface BusinessProfileInfo {
  businessName: string;
  taxId: string; // RUT / CIF / NIF / RFC
  email: string;
  phone: string;
  address: string;
  city: string;
  website?: string;
  logoUrl?: string;
  bankDetails?: string;
}

export interface CustomerInfo {
  id?: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  taxId?: string;
  address?: string;
  city?: string;
}

export interface QuoteItemLine {
  id: string;
  garmentName: string;
  garmentColor: string;
  garmentSize: string;
  techniqueId: PrintingTechniqueId;
  techniqueName: string;
  designDescription: string;
  designMockupUrl?: string;
  quantity: number;
  unitCost: number;
  markupPercent: number;
  unitBasePrice: number;
  discountPercent: number;
  finalUnitPrice: number;
  lineSubtotal: number;
  costBreakdownSnapshot: FullCostBreakdown;
}

export type QuoteStatus = 'borrador' | 'enviada' | 'aprobada' | 'rechazada' | 'facturada';

export interface ProfessionalQuote {
  id: string;
  quoteNumber: string; // Ej: COT-2026-001
  ownerId: string;
  createdAt: string;
  validUntil: string; // Fecha de vigencia
  status: QuoteStatus;
  business: BusinessProfileInfo;
  customer: CustomerInfo;
  items: QuoteItemLine[];
  subtotal: number;
  totalDiscounts: number;
  taxPercent: number;
  taxAmount: number;
  shippingAmount: number;
  grandTotal: number;
  notes: string; // Observaciones y condiciones comerciales
  paymentTerms: string; // Ej: 50% anticipo, 50% contra entrega
  deliveryTimeDays: number; // Días hábiles de producción
  currencySymbol: string;
  updatedAt?: string;
}
