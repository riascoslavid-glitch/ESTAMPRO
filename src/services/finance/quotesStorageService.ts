import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import {
  ProfessionalQuote,
  OperationalCostSettings,
  TechniqueCostFactors,
  BusinessProfileInfo
} from '../../types/finance';
import {
  DEFAULT_OPERATIONAL_SETTINGS,
  DEFAULT_TECHNIQUE_COSTS,
  DEFAULT_BUSINESS_INFO
} from '../../constants/financeDefaults';
import { calculateFullCostBreakdown } from './costCalculationEngine';

const LOCAL_STORAGE_QUOTES_KEY = 'estampapro_financial_quotes_history';
const LOCAL_STORAGE_SETTINGS_KEY = 'estampapro_financial_operational_settings';
const LOCAL_STORAGE_BUSINESS_KEY = 'estampapro_financial_business_profile';

// Cotizaciones de prueba preconfiguradas con datos reales
const SEED_SAMPLE_QUOTES: ProfessionalQuote[] = [
  {
    id: 'quote_seed_001',
    quoteNumber: 'COT-2026-0042',
    ownerId: 'demo-operator-01',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    validUntil: new Date(Date.now() + 86400000 * 13).toISOString(),
    status: 'aprobada',
    business: DEFAULT_BUSINESS_INFO,
    customer: {
      name: 'Andrés Valenzuela',
      company: 'CrossFit Titanium Club',
      email: 'contacto@crossfittitanium.cl',
      phone: '+56 9 7654 3210',
      city: 'Santiago'
    },
    items: [
      {
        id: 'item_01',
        garmentName: 'Camiseta Heavyweight Algodón Peinado 200 GSM',
        garmentColor: 'Negro Azabache',
        garmentSize: 'M, L, XL surtidas',
        techniqueId: 'dtf',
        techniqueName: 'DTF (Direct to Film)',
        designDescription: 'Logo frontal titanio 28x32cm a 4 colores + texto en espalda',
        quantity: 50,
        unitCost: 5.68,
        markupPercent: 50,
        unitBasePrice: 11.36,
        discountPercent: 30,
        finalUnitPrice: 7.95,
        lineSubtotal: 397.5,
        costBreakdownSnapshot: calculateFullCostBreakdown(
          50,
          3.2,
          DEFAULT_TECHNIQUE_COSTS.dtf,
          DEFAULT_OPERATIONAL_SETTINGS
        )
      }
    ],
    subtotal: 397.5,
    totalDiscounts: 170.5,
    taxPercent: 19,
    taxAmount: 75.53,
    shippingAmount: 6.0,
    grandTotal: 479.03,
    notes: 'Prendas 100% algodón ring-spun preencogido. Lavado con agua fría, no planchar directamente sobre el estampado.',
    paymentTerms: '50% anticipo al aprobar muestra, 50% al despacho',
    deliveryTimeDays: 5,
    currencySymbol: '$'
  },
  {
    id: 'quote_seed_002',
    quoteNumber: 'COT-2026-0043',
    ownerId: 'demo-operator-01',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    validUntil: new Date(Date.now() + 86400000 * 14).toISOString(),
    status: 'enviada',
    business: DEFAULT_BUSINESS_INFO,
    customer: {
      name: 'Mariana Silva',
      company: 'Brewing Co. Cervecería Artesanal',
      email: 'mariana@brewingco.cl',
      phone: '+56 9 9123 4567',
      city: 'Valparaíso'
    },
    items: [
      {
        id: 'item_02',
        garmentName: 'Hoodie French Terry Pesado con Capucha 360 GSM',
        garmentColor: 'Gris Melange',
        garmentSize: 'S, M, L, XL',
        techniqueId: 'serigrafia',
        techniqueName: 'Serigrafía Textil (Plastisol)',
        designDescription: 'Ilustración cervecera vintage en espalda 35x42cm 3 tintas',
        quantity: 100,
        unitCost: 11.45,
        markupPercent: 48,
        unitBasePrice: 22.02,
        discountPercent: 38,
        finalUnitPrice: 13.65,
        lineSubtotal: 1365.0,
        costBreakdownSnapshot: calculateFullCostBreakdown(
          100,
          9.5,
          DEFAULT_TECHNIQUE_COSTS.serigrafia,
          DEFAULT_OPERATIONAL_SETTINGS
        )
      }
    ],
    subtotal: 1365.0,
    totalDiscounts: 837.0,
    taxPercent: 19,
    taxAmount: 259.35,
    shippingAmount: 12.0,
    grandTotal: 1636.35,
    notes: 'Incluye revelado de 3 pantallas serigráficas de 64 hilos. Muestra física aprobada en taller.',
    paymentTerms: 'Transferencia bancaria a 30 días contra orden de compra',
    deliveryTimeDays: 8,
    currencySymbol: '$'
  }
];

export async function loadQuotesHistory(ownerId?: string): Promise<ProfessionalQuote[]> {
  try {
    if (ownerId && db) {
      const quotesRef = collection(db, 'quotes');
      const q = query(quotesRef, where('ownerId', '==', ownerId), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const firestoreQuotes: ProfessionalQuote[] = [];
        snapshot.forEach((docSnap) => {
          firestoreQuotes.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        return firestoreQuotes;
      }
    }
  } catch (err) {
    console.warn('No se pudo sincronizar cotizaciones con Firestore, recurriendo a almacenamiento local:', err);
  }

  // Fallback a localStorage
  const local = localStorage.getItem(LOCAL_STORAGE_QUOTES_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      // Continuar con seeds
    }
  }

  // Inicializar con cotizaciones de prueba y guardar
  localStorage.setItem(LOCAL_STORAGE_QUOTES_KEY, JSON.stringify(SEED_SAMPLE_QUOTES));
  return SEED_SAMPLE_QUOTES;
}

export async function saveQuote(quote: ProfessionalQuote): Promise<void> {
  // Guardar en localStorage
  const currentQuotes = await loadQuotesHistory(quote.ownerId);
  const exists = currentQuotes.some((q) => q.id === quote.id);
  const updated = exists
    ? currentQuotes.map((q) => (q.id === quote.id ? quote : q))
    : [quote, ...currentQuotes];

  localStorage.setItem(LOCAL_STORAGE_QUOTES_KEY, JSON.stringify(updated));

  // Guardar en Firestore si está conectado
  if (db && quote.ownerId) {
    try {
      const docRef = doc(db, 'quotes', quote.id);
      await setDoc(docRef, {
        ...quote,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Error guardando cotización en Firestore:', err);
    }
  }
}

export async function deleteQuote(quoteId: string, ownerId?: string): Promise<void> {
  const currentQuotes = await loadQuotesHistory(ownerId);
  const updated = currentQuotes.filter((q) => q.id !== quoteId);
  localStorage.setItem(LOCAL_STORAGE_QUOTES_KEY, JSON.stringify(updated));

  if (db && ownerId) {
    try {
      const docRef = doc(db, 'quotes', quoteId);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Error eliminando cotización en Firestore:', err);
    }
  }
}

export function loadOperationalSettings(): OperationalCostSettings {
  const saved = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
  if (saved) {
    try {
      return { ...DEFAULT_OPERATIONAL_SETTINGS, ...JSON.parse(saved) };
    } catch {
      return DEFAULT_OPERATIONAL_SETTINGS;
    }
  }
  return DEFAULT_OPERATIONAL_SETTINGS;
}

export function saveOperationalSettings(settings: OperationalCostSettings): void {
  localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
}

export function loadBusinessProfile(): BusinessProfileInfo {
  const saved = localStorage.getItem(LOCAL_STORAGE_BUSINESS_KEY);
  if (saved) {
    try {
      return { ...DEFAULT_BUSINESS_INFO, ...JSON.parse(saved) };
    } catch {
      return DEFAULT_BUSINESS_INFO;
    }
  }
  return DEFAULT_BUSINESS_INFO;
}

export function saveBusinessProfile(profile: BusinessProfileInfo): void {
  localStorage.setItem(LOCAL_STORAGE_BUSINESS_KEY, JSON.stringify(profile));
}
