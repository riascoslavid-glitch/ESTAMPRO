import {
  TechniqueCostFactors,
  OperationalCostSettings,
  VolumeDiscountTier,
  BusinessProfileInfo
} from '../types/finance';

export const DEFAULT_TECHNIQUE_COSTS: Record<string, TechniqueCostFactors> = {
  dtf: {
    techniqueId: 'dtf',
    techniqueName: 'DTF (Direct to Film)',
    inkCostPerUnit: 0.65, // Tinta CMYK + Tinta Blanca de alta cobertura por impresión A3
    filmCostPerUnit: 0.55, // Película PET transfer de 30cm x 40cm
    paperCostPerUnit: 0.05, // Papel protector siliconado / teflón
    vinylCostPerUnit: 0.0,
    threadCostPerUnit: 0.0,
    consumablesCostPerUnit: 0.35, // Polvo adhesivo termofusible de poliamida
    machinePowerKw: 1.8, // Prensa térmica neumática (1800W)
    machineTimeMinutesPerUnit: 0.75, // 45 segundos (bajado de plancha + pelado tibio + sellado)
    setupFixedCost: 2.0 // Calibración de cabezal y limpieza de línea
  },
  dtg: {
    techniqueId: 'dtg',
    techniqueName: 'DTG (Direct to Garment)',
    inkCostPerUnit: 1.45, // Tintas textiles DuPont / Brother con base blanca densa
    filmCostPerUnit: 0.0,
    paperCostPerUnit: 0.05,
    vinylCostPerUnit: 0.0,
    threadCostPerUnit: 0.0,
    consumablesCostPerUnit: 0.85, // Líquido de pretratamiento fijador para algodón
    machinePowerKw: 2.2,
    machineTimeMinutesPerUnit: 2.0, // Pretratamiento + plancha de fijado
    setupFixedCost: 3.5
  },
  sublimacion: {
    techniqueId: 'sublimacion',
    techniqueName: 'Sublimación Digital',
    inkCostPerUnit: 0.38, // Tintas de sublimación de alta densidad
    filmCostPerUnit: 0.0,
    paperCostPerUnit: 0.28, // Papel transfer de sublimación con secado rápido
    vinylCostPerUnit: 0.0,
    threadCostPerUnit: 0.0,
    consumablesCostPerUnit: 0.12, // Cinta térmica y teflón protector
    machinePowerKw: 1.8,
    machineTimeMinutesPerUnit: 0.8, // 40-50 segundos a 200°C
    setupFixedCost: 1.5
  },
  vinil_textil: {
    techniqueId: 'vinil_textil',
    techniqueName: 'Vinilo Textil Térmico',
    inkCostPerUnit: 0.0,
    filmCostPerUnit: 0.0,
    paperCostPerUnit: 0.05,
    vinylCostPerUnit: 1.25, // Vinilo de poliuretano de alta elasticidad por pieza
    threadCostPerUnit: 0.0,
    consumablesCostPerUnit: 0.2, // Cuchillas de corte y transportador (carrier)
    machinePowerKw: 1.6,
    machineTimeMinutesPerUnit: 2.5, // Corte en plotter + pelado/descarte manual + prensado
    setupFixedCost: 2.5
  },
  serigrafia: {
    techniqueId: 'serigrafia',
    techniqueName: 'Serigrafía Textil (Plastisol / Base Agua)',
    inkCostPerUnit: 0.22, // Tinta plastisol por pasada (muy bajo costo unitario a escala)
    filmCostPerUnit: 0.15, // Fotolito positivo
    paperCostPerUnit: 0.0,
    vinylCostPerUnit: 0.0,
    threadCostPerUnit: 0.0,
    consumablesCostPerUnit: 0.3, // Emulsión fotosensible, recuperador y adhesivo de mesa
    machinePowerKw: 3.5, // Horno túnel de curado continuo
    machineTimeMinutesPerUnit: 0.35, // Alta velocidad de producción en carrusel
    setupFixedCost: 18.0 // Revelado de pantallas, registros y armado de pulpo (fijo por diseño)
  },
  bordado: {
    techniqueId: 'bordado',
    techniqueName: 'Bordado Computarizado',
    inkCostPerUnit: 0.0,
    filmCostPerUnit: 0.0,
    paperCostPerUnit: 0.0,
    vinylCostPerUnit: 0.0,
    threadCostPerUnit: 0.65, // Conos de hilo de poliéster 40wt (promedio 6,000 puntadas)
    consumablesCostPerUnit: 0.35, // Entretela hidrosoluble o rasgable (backing/pellón) y agujas
    machinePowerKw: 0.8, // Motor bordadora multicabezal
    machineTimeMinutesPerUnit: 4.5, // Tiempo de puntada de máquina
    setupFixedCost: 12.0 // Matriz de ponchado y digitalización de puntadas
  },
  uv_dtf: {
    techniqueId: 'uv_dtf',
    techniqueName: 'UV DTF (Transfers Rígidos & Curvos)',
    inkCostPerUnit: 0.85,
    filmCostPerUnit: 0.65, // Film A impreso + Film B de laminación
    paperCostPerUnit: 0.0,
    vinylCostPerUnit: 0.0,
    threadCostPerUnit: 0.0,
    consumablesCostPerUnit: 0.4, // Barniz UV brillante + lámpara LED UV
    machinePowerKw: 1.2,
    machineTimeMinutesPerUnit: 1.0,
    setupFixedCost: 3.0
  },
  transfer_laser: {
    techniqueId: 'transfer_laser',
    techniqueName: 'Transfer Láser / No-Cut Tóner',
    inkCostPerUnit: 0.95, // Tóner CMYK + Tóner Blanco OKI
    filmCostPerUnit: 0.0,
    paperCostPerUnit: 1.2, // Papel transfer de 2 hojas A/B (Forever Laser Dark)
    vinylCostPerUnit: 0.0,
    threadCostPerUnit: 0.0,
    consumablesCostPerUnit: 0.25,
    machinePowerKw: 1.8,
    machineTimeMinutesPerUnit: 1.5, // Prensado A/B + prensado en prenda
    setupFixedCost: 2.0
  }
};

export const DEFAULT_OPERATIONAL_SETTINGS: OperationalCostSettings = {
  electricityKwhRate: 0.18, // $0.18 USD por kWh
  laborHourlyRate: 9.5, // $9.50 USD por hora de operario textil
  laborMinutesPerUnit: 3.0, // 3 minutos promedio de manipulación de prenda
  packagingCostPerUnit: 0.35, // Bolsa de celofán individual con adhesivo + doblado
  transportCostPerOrder: 6.0, // Flete o reparto local por pedido completo
  wastePercentage: 4.0, // 4% de merma técnica reglamentaria por desperdicio de tela/tinta
  additionalExpensesPerOrder: 5.0, // Gastos administrativos y preparación de archivos
  defaultTargetMarginPercent: 50.0, // 50% de margen de rentabilidad sobre el costo
  taxPercent: 19.0, // 19% IVA estándar
  currencySymbol: '$'
};

export const DEFAULT_VOLUME_TIERS: VolumeDiscountTier[] = [
  { minQuantity: 1, label: '1 unidad (Muestra/Unitario)', discountPercentage: 0 },
  { minQuantity: 5, label: '5 unidades (Pequeño lote)', discountPercentage: 8 },
  { minQuantity: 10, label: '10 unidades (Tirada inicial)', discountPercentage: 14 },
  { minQuantity: 25, label: '25 unidades (Medio lote)', discountPercentage: 22 },
  { minQuantity: 50, label: '50 unidades (Lote comercial)', discountPercentage: 30 },
  { minQuantity: 100, label: '100 unidades (Producción escala)', discountPercentage: 38 },
  { minQuantity: 250, label: '250 unidades (Gran volumen)', discountPercentage: 45 }
];

export const DEFAULT_BUSINESS_INFO: BusinessProfileInfo = {
  businessName: 'ESTAMPAPRO 360° TEXTIL STUDIO',
  taxId: 'RUT 76.942.810-K',
  email: 'contacto@estampapro360.com',
  phone: '+56 9 8412 9054',
  address: 'Av. Providencia 1450, Piso 4, Distrito Textil',
  city: 'Santiago, Chile',
  website: 'www.estampapro360.com',
  logoUrl: '',
  bankDetails: 'Banco Santander - Cta Cte: 78-91284-0 | RUT: 76.942.810-K'
};
