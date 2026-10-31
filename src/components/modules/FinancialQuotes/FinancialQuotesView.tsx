import React, { useState, useEffect } from 'react';
import {
  TechniqueCostFactors,
  OperationalCostSettings,
  BusinessProfileInfo,
  ProfessionalQuote,
  QuoteStatus,
  QuoteItemLine
} from '../../../types/finance';
import {
  DEFAULT_TECHNIQUE_COSTS,
  DEFAULT_OPERATIONAL_SETTINGS,
  DEFAULT_BUSINESS_INFO
} from '../../../constants/financeDefaults';
import { GARMENTS_CATALOG } from '../../../constants/garmentsCatalog';
import {
  calculateFullCostBreakdown,
  generateVolumeSimulations,
  generateQuotePdf
} from '../../../services/finance/costCalculationEngine';
import {
  loadQuotesHistory,
  saveQuote,
  deleteQuote,
  loadOperationalSettings,
  saveOperationalSettings,
  loadBusinessProfile,
  saveBusinessProfile
} from '../../../services/finance/quotesStorageService';
import { VolumePricingMatrix } from './VolumePricingMatrix';
import { QuoteDetailModal } from './QuoteDetailModal';
import { BaseCostSettingsModal } from './BaseCostSettingsModal';
import { downloadFile } from '../../../services/prepress/printPreparationEngine';
import { useAuth } from '../../../context/AuthContext';
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Percent,
  Layers,
  FileText,
  Clock,
  Plus,
  Trash2,
  Download,
  Settings2,
  Building,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Package,
  Truck,
  Shirt,
  Sparkles,
  Search,
  Filter,
  Copy,
  Printer
} from 'lucide-react';

export const FinancialQuotesView: React.FC = () => {
  const { currentUser } = useAuth();

  // Pestaña activa
  const [activeTab, setActiveTab] = useState<'calculator' | 'builder' | 'history'>('calculator');

  // Parámetros y perfiles
  const [operations, setOperations] = useState<OperationalCostSettings>(loadOperationalSettings);
  const [business, setBusiness] = useState<BusinessProfileInfo>(loadBusinessProfile);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Parámetros de la Calculadora de Costos
  const [selectedGarmentId, setSelectedGarmentId] = useState<string>(GARMENTS_CATALOG[0].id);
  const [customGarmentCost, setCustomGarmentCost] = useState<number>(GARMENTS_CATALOG[0].basePurchasePrice || 3.5);
  const [selectedTechniqueId, setSelectedTechniqueId] = useState<string>('dtf');
  const [techniqueFactors, setTechniqueFactors] = useState<TechniqueCostFactors>(DEFAULT_TECHNIQUE_COSTS.dtf);
  const [calcQuantity, setCalcQuantity] = useState<number>(25);
  const [customQuantitySimulation, setCustomQuantitySimulation] = useState<number>(75);
  const [targetMarginPercent, setTargetMarginPercent] = useState<number>(operations.defaultTargetMarginPercent);

  // Historial de cotizaciones
  const [quotesList, setQuotesList] = useState<ProfessionalQuote[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [selectedQuoteForModal, setSelectedQuoteForModal] = useState<ProfessionalQuote | null>(null);

  // Formulario del Generador de Cotizaciones (Tab Builder)
  const [builderCustomer, setBuilderCustomer] = useState({
    name: 'Roberto Gómez',
    company: 'Distribuidora Textil Austral',
    email: 'rgomez@austral.cl',
    phone: '+56 9 8123 4567',
    city: 'Santiago'
  });
  const [builderDeliveryDays, setBuilderDeliveryDays] = useState<number>(6);
  const [builderPaymentTerms, setBuilderPaymentTerms] = useState<string>('50% anticipo al iniciar, 50% contra entrega');
  const [builderNotes, setBuilderNotes] = useState<string>(
    'Prendas de algodón peinado primera selección. Incluye control de calidad y planchado final.'
  );
  const [builderValidityDays, setBuilderValidityDays] = useState<number>(15);
  const [builderItems, setBuilderItems] = useState<QuoteItemLine[]>([]);

  // Sincronizar prenda seleccionada con costo
  useEffect(() => {
    const garment = GARMENTS_CATALOG.find((g) => g.id === selectedGarmentId);
    if (garment) {
      setCustomGarmentCost(garment.basePurchasePrice || 3.5);
    }
  }, [selectedGarmentId]);

  // Sincronizar técnica con factores
  useEffect(() => {
    if (DEFAULT_TECHNIQUE_COSTS[selectedTechniqueId]) {
      setTechniqueFactors({ ...DEFAULT_TECHNIQUE_COSTS[selectedTechniqueId] });
    }
  }, [selectedTechniqueId]);

  // Cargar historial de cotizaciones al iniciar
  useEffect(() => {
    loadQuotesHistory(currentUser?.uid).then((data) => {
      setQuotesList(data);
    });
  }, [currentUser?.uid]);

  // Cálculo financiero en tiempo real para la cantidad seleccionada en calculadora
  const currentBreakdown = calculateFullCostBreakdown(
    calcQuantity,
    customGarmentCost,
    techniqueFactors,
    operations,
    targetMarginPercent
  );

  // Matriz de simulaciones comparativas por volumen
  const volumeSimulations = generateVolumeSimulations(
    customGarmentCost,
    techniqueFactors,
    operations,
    customQuantitySimulation
  );

  // Transferir cálculo actual al generador de cotizaciones
  const handleTransferToQuoteBuilder = (qtyToUse?: number) => {
    const qty = qtyToUse || calcQuantity;
    const garment = GARMENTS_CATALOG.find((g) => g.id === selectedGarmentId);
    const breakdown = calculateFullCostBreakdown(
      qty,
      customGarmentCost,
      techniqueFactors,
      operations,
      targetMarginPercent
    );

    const newLine: QuoteItemLine = {
      id: `item_${Date.now()}`,
      garmentName: garment ? garment.name : 'Prenda Textil Confeccionada',
      garmentColor: garment && garment.colors?.length ? garment.colors[0].name : 'Negro',
      garmentSize: 'S, M, L, XL',
      techniqueId: techniqueFactors.techniqueId,
      techniqueName: techniqueFactors.techniqueName,
      designDescription: `Estampado ${techniqueFactors.techniqueName} con acabado suave y curado térmico`,
      quantity: qty,
      unitCost: breakdown.totalUnitCost,
      markupPercent: breakdown.markupPercent,
      unitBasePrice: breakdown.baseUnitPrice,
      discountPercent: breakdown.volumeDiscountPercent,
      finalUnitPrice: breakdown.finalUnitPrice,
      lineSubtotal: breakdown.subtotalOrder,
      costBreakdownSnapshot: breakdown
    };

    setBuilderItems([...builderItems, newLine]);
    setActiveTab('builder');
  };

  // Guardar nueva cotización desde el builder
  const handleSaveCreatedQuote = async () => {
    if (builderItems.length === 0 || !builderCustomer.name) return;

    const subtotal = builderItems.reduce((acc, item) => acc + item.lineSubtotal, 0);
    const totalDiscounts = builderItems.reduce(
      (acc, item) => acc + (item.unitBasePrice - item.finalUnitPrice) * item.quantity,
      0
    );
    const shipping = operations.transportCostPerOrder;
    const taxAmount = (subtotal + shipping) * (operations.taxPercent / 100);
    const grandTotal = subtotal + shipping + taxAmount;

    const newQuote: ProfessionalQuote = {
      id: `quote_${Date.now()}`,
      quoteNumber: `COT-${new Date().getFullYear()}-${String(quotesList.length + 1).padStart(4, '0')}`,
      ownerId: currentUser?.uid || 'demo-operator',
      createdAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + builderValidityDays * 86400000).toISOString(),
      status: 'enviada',
      business,
      customer: builderCustomer,
      items: builderItems,
      subtotal,
      totalDiscounts,
      taxPercent: operations.taxPercent,
      taxAmount,
      shippingAmount: shipping,
      grandTotal,
      notes: builderNotes,
      paymentTerms: builderPaymentTerms,
      deliveryTimeDays: builderDeliveryDays,
      currencySymbol: operations.currencySymbol
    };

    await saveQuote(newQuote);
    const updated = await loadQuotesHistory(currentUser?.uid);
    setQuotesList(updated);
    setSelectedQuoteForModal(newQuote);
  };

  // Eliminar cotización del historial
  const handleDeleteQuote = async (id: string) => {
    await deleteQuote(id, currentUser?.uid);
    const updated = await loadQuotesHistory(currentUser?.uid);
    setQuotesList(updated);
  };

  // Actualizar estado de cotización
  const handleUpdateQuoteStatus = async (quoteId: string, status: QuoteStatus) => {
    const q = quotesList.find((item) => item.id === quoteId);
    if (!q) return;
    const updatedQuote: ProfessionalQuote = { ...q, status };
    await saveQuote(updatedQuote);
    const updated = await loadQuotesHistory(currentUser?.uid);
    setQuotesList(updated);
    if (selectedQuoteForModal?.id === quoteId) {
      setSelectedQuoteForModal(updatedQuote);
    }
  };

  // Duplicar cotización para re-cotizar
  const handleDuplicateQuote = (q: ProfessionalQuote) => {
    setBuilderCustomer({
      name: q.customer.name,
      company: q.customer.company || '',
      email: q.customer.email,
      phone: q.customer.phone,
      city: q.customer.city || ''
    });
    setBuilderItems([...q.items]);
    setBuilderNotes(q.notes);
    setBuilderPaymentTerms(q.paymentTerms);
    setBuilderDeliveryDays(q.deliveryTimeDays);
    setActiveTab('builder');
  };

  // Filtrado de historial
  const filteredQuotes = quotesList.filter((q) => {
    const matchesSearch =
      q.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.customer.company && q.customer.company.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'todos' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const currency = operations.currencySymbol;

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Cockpit */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Calculator className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-slate-100">
                Calculadora Financiera & Cotizaciones
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Precios por Volumen & PDF
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Cálculo paramétrico de costos directos (prendas, tintas, films, vinilos, hilos, consumibles), costos operativos (energía kWh, mano de obra directa, amortización), desperdicio textil reglamentario y generación de cotizaciones comerciales profesionales.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsSettingsModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-2 cursor-pointer border border-slate-700 shadow-sm"
            >
              <Settings2 className="w-4 h-4 text-cyan-400" />
              Costos del Taller
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('builder');
                if (builderItems.length === 0) {
                  handleTransferToQuoteBuilder();
                }
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/40"
            >
              <Plus className="w-4 h-4" />
              Nueva Cotización
            </button>
          </div>
        </div>

        {/* Pestañas de navegación */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Calculadora de Costos & Simulación
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('builder')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'builder'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Generador de Cotización ({builderItems.length} items)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Historial de Cotizaciones ({quotesList.length})
          </button>
        </div>
      </div>

      {/* CONTENIDO SEGÚN PESTAÑA */}

      {/* PESTAÑA 1: CALCULADORA DE COSTOS & ESCALAS POR VOLUMEN */}
      {activeTab === 'calculator' && (
        <div className="space-y-6">
          {/* Tarjetas de Resumen KPI de la Tirada Actual */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Costo Unitario Total</span>
              <div className="text-xl font-bold font-mono text-slate-100 mt-1">
                {currency}{currentBreakdown.totalUnitCost.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                Para {calcQuantity} uds
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Costo Total Pedido</span>
              <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
                {currency}{currentBreakdown.totalBatchCost.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                Costo directo de producción
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Precio Venta Unit.</span>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                {currency}{currentBreakdown.finalUnitPrice.toFixed(2)}
              </div>
              <span className="text-[10px] text-emerald-500/80 font-mono mt-0.5">
                {currentBreakdown.volumeDiscountPercent > 0
                  ? `-${currentBreakdown.volumeDiscountPercent}% por volumen`
                  : 'Tarifa unitaria base'}
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Total Pedido (PVP)</span>
              <div className="text-xl font-bold font-mono text-slate-100 mt-1">
                {currency}{currentBreakdown.totalOrderPrice.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                Inc. {operations.taxPercent}% IVA
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Ganancia Neta</span>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                +{currency}{currentBreakdown.netProfitTotal.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                +{currency}{currentBreakdown.netProfitUnit.toFixed(2)} / ud
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Margen Real</span>
              <div className="text-xl font-bold font-mono text-amber-400 mt-1">
                {currentBreakdown.realMarginPercent.toFixed(1)}%
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                Merma: {currency}{currentBreakdown.wasteCostTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Grid de Configuración de Costos (Columna Izq: Parámetros | Columna Der: Desglose) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Panel de Entradas de Costos (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Shirt className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-semibold text-slate-100">
                      1. Prenda y Técnica de Estampado
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTransferToQuoteBuilder()}
                    className="px-3 py-1 rounded-md text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Agregar a Cotización
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Selector de Prenda */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Prenda Textil Base:
                    </label>
                    <select
                      value={selectedGarmentId}
                      onChange={(e) => setSelectedGarmentId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      {GARMENTS_CATALOG.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name} ({currency}{g.basePurchasePrice?.toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Costo de Compra de Prenda */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Costo Compra Prenda Lisa ({currency}):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={customGarmentCost}
                      onChange={(e) => setCustomGarmentCost(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Selector de Técnica */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Técnica de Estampado:
                    </label>
                    <select
                      value={selectedTechniqueId}
                      onChange={(e) => setSelectedTechniqueId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      {Object.keys(DEFAULT_TECHNIQUE_COSTS).map((techKey) => (
                        <option key={techKey} value={techKey}>
                          {DEFAULT_TECHNIQUE_COSTS[techKey].techniqueName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Cantidad del lote a calcular */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Cantidad del Pedido (uds):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="10000"
                        value={calcQuantity}
                        onChange={(e) => setCalcQuantity(Math.max(1, Number(e.target.value)))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-cyan-400 font-bold focus:outline-none focus:border-cyan-500"
                      />
                      {/* Accesos rápidos de tirada */}
                      <div className="flex gap-1">
                        {[1, 10, 25, 50, 100].map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => setCalcQuantity(q)}
                            className={`px-2 py-1 rounded text-[10px] font-mono border transition-colors cursor-pointer ${
                              calcQuantity === q
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                                : 'bg-slate-950 text-slate-400 border-slate-800'
                            }`}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-parámetros de Insumos según Técnica */}
                <div className="pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-200">
                      2. Insumos Directos de {techniqueFactors.techniqueName}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Costo unitario materiales: {currency}
                      {currentBreakdown.totalMaterialsCostUnit.toFixed(2)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Tintas ({currency}/ud):
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        value={techniqueFactors.inkCostPerUnit}
                        onChange={(e) =>
                          setTechniqueFactors({
                            ...techniqueFactors,
                            inkCostPerUnit: Number(e.target.value)
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Películas / Films ({currency}/ud):
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        value={techniqueFactors.filmCostPerUnit}
                        onChange={(e) =>
                          setTechniqueFactors({
                            ...techniqueFactors,
                            filmCostPerUnit: Number(e.target.value)
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Papel ({currency}/ud):
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        value={techniqueFactors.paperCostPerUnit}
                        onChange={(e) =>
                          setTechniqueFactors({
                            ...techniqueFactors,
                            paperCostPerUnit: Number(e.target.value)
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Vinilos ({currency}/ud):
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        value={techniqueFactors.vinylCostPerUnit}
                        onChange={(e) =>
                          setTechniqueFactors({
                            ...techniqueFactors,
                            vinylCostPerUnit: Number(e.target.value)
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Hilos ({currency}/ud):
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        value={techniqueFactors.threadCostPerUnit}
                        onChange={(e) =>
                          setTechniqueFactors({
                            ...techniqueFactors,
                            threadCostPerUnit: Number(e.target.value)
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Consumibles ({currency}/ud):
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        value={techniqueFactors.consumablesCostPerUnit}
                        onChange={(e) =>
                          setTechniqueFactors({
                            ...techniqueFactors,
                            consumablesCostPerUnit: Number(e.target.value)
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Sub-parámetros Operativos: Tiempo de máquina, setup y margen */}
                <div className="pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-200">
                      3. Tiempos, Puesta a Punto y Margen Comercial
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Tiempo Máq. (min):
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={techniqueFactors.machineTimeMinutesPerUnit}
                        onChange={(e) =>
                          setTechniqueFactors({
                            ...techniqueFactors,
                            machineTimeMinutesPerUnit: Number(e.target.value)
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Potencia Máq. (kW):
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={techniqueFactors.machinePowerKw}
                        onChange={(e) =>
                          setTechniqueFactors({
                            ...techniqueFactors,
                            machinePowerKw: Number(e.target.value)
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Setup Fijo ({currency}):
                      </label>
                      <input
                        type="number"
                        step="1"
                        value={techniqueFactors.setupFixedCost}
                        onChange={(e) =>
                          setTechniqueFactors({
                            ...techniqueFactors,
                            setupFixedCost: Number(e.target.value)
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                        title="Costo de revelado de pantallas serigráficas o ponchado de bordado"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Margen Comercial (%):
                      </label>
                      <input
                        type="number"
                        step="1"
                        value={targetMarginPercent}
                        onChange={(e) => setTargetMarginPercent(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-cyan-400 font-bold focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desglose Detallado de Costos (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    Desglose Estructurado del Costo ({calcQuantity} uds)
                  </h3>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  {/* Materiales Directos */}
                  <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-300">
                    <span className="font-sans">Prendas lisas (blanks):</span>
                    <span>{currency}{currentBreakdown.garmentCostTotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-300">
                    <span className="font-sans">Tintas & Pigmentos:</span>
                    <span>{currency}{currentBreakdown.inksCostTotal.toFixed(2)}</span>
                  </div>

                  {(currentBreakdown.filmsCostTotal > 0 || currentBreakdown.paperCostTotal > 0) && (
                    <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-300">
                      <span className="font-sans">Películas / Papeles transfer:</span>
                      <span>
                        {currency}
                        {(currentBreakdown.filmsCostTotal + currentBreakdown.paperCostTotal).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {(currentBreakdown.vinylCostTotal > 0 || currentBreakdown.threadsCostTotal > 0) && (
                    <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-300">
                      <span className="font-sans">Vinilos / Hilos:</span>
                      <span>
                        {currency}
                        {(currentBreakdown.vinylCostTotal + currentBreakdown.threadsCostTotal).toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-300">
                    <span className="font-sans">Consumibles (poliamida/adhesivos):</span>
                    <span>{currency}{currentBreakdown.consumablesCostTotal.toFixed(2)}</span>
                  </div>

                  {/* Operaciones */}
                  <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-300">
                    <span className="font-sans">Mano de obra directa operario:</span>
                    <span>{currency}{currentBreakdown.laborCostTotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-300">
                    <span className="font-sans">Electricidad & Desgaste de máquina:</span>
                    <span>
                      {currency}
                      {(
                        currentBreakdown.electricityCostTotal +
                        currentBreakdown.machineTimeCostTotal
                      ).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-300">
                    <span className="font-sans">Puesta a punto (setup amortizado):</span>
                    <span>{currency}{currentBreakdown.setupCostTotal.toFixed(2)}</span>
                  </div>

                  {/* Empaque, flete y desperdicio */}
                  <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-300">
                    <span className="font-sans">Empaque individual protector:</span>
                    <span>{currency}{currentBreakdown.packagingCostTotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-300">
                    <span className="font-sans">Transporte / Despacho flete:</span>
                    <span>{currency}{currentBreakdown.transportCostTotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-800/60 text-rose-400">
                    <span className="font-sans">Desperdicio textil / merma ({operations.wastePercentage}%):</span>
                    <span>+{currency}{currentBreakdown.wasteCostTotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-300">
                    <span className="font-sans">Gastos administrativos adicionales:</span>
                    <span>{currency}{currentBreakdown.additionalCostTotal.toFixed(2)}</span>
                  </div>

                  {/* Total de Costos */}
                  <div className="flex justify-between py-2 text-sm font-bold text-slate-100 border-t-2 border-slate-800">
                    <span className="font-sans">COSTO TOTAL DEL LOTE:</span>
                    <span className="text-cyan-400">{currency}{currentBreakdown.totalBatchCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Matriz Completa de Escalas por Volumen (1, 5, 10, 25, 50, 100 y personalizada) */}
          <VolumePricingMatrix
            rows={volumeSimulations}
            currencySymbol={currency}
            customQuantity={customQuantitySimulation}
            onCustomQuantityChange={setCustomQuantitySimulation}
            onSelectTier={(qty) => {
              setCalcQuantity(qty);
              handleTransferToQuoteBuilder(qty);
            }}
          />
        </div>
      )}

      {/* PESTAÑA 2: GENERADOR DE COTIZACIÓN PROFESIONAL */}
      {activeTab === 'builder' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Emisión de Presupuesto / Cotización Comercial
              </h2>
              <p className="text-xs text-slate-400">
                Confección de propuesta para cliente con desglose de prendas, técnicas y condiciones
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleTransferToQuoteBuilder()}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
                Agregar Otra Línea
              </button>
              <button
                type="button"
                onClick={handleSaveCreatedQuote}
                disabled={builderItems.length === 0}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/40 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                Guardar y Emitir Cotización
              </button>
            </div>
          </div>

          {/* Datos del Cliente y Condiciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cliente */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                Datos del Cliente
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Nombre Contacto:</label>
                  <input
                    type="text"
                    value={builderCustomer.name}
                    onChange={(e) =>
                      setBuilderCustomer({ ...builderCustomer, name: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Empresa / Marca:</label>
                  <input
                    type="text"
                    value={builderCustomer.company}
                    onChange={(e) =>
                      setBuilderCustomer({ ...builderCustomer, company: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Email:</label>
                  <input
                    type="email"
                    value={builderCustomer.email}
                    onChange={(e) =>
                      setBuilderCustomer({ ...builderCustomer, email: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Teléfono:</label>
                  <input
                    type="text"
                    value={builderCustomer.phone}
                    onChange={(e) =>
                      setBuilderCustomer({ ...builderCustomer, phone: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Condiciones Comerciales */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                Condiciones y Plazos
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Vigencia (Días):</label>
                  <input
                    type="number"
                    value={builderValidityDays}
                    onChange={(e) => setBuilderValidityDays(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Entrega (Días Háb.):</label>
                  <input
                    type="number"
                    value={builderDeliveryDays}
                    onChange={(e) => setBuilderDeliveryDays(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Forma de Pago:</label>
                <input
                  type="text"
                  value={builderPaymentTerms}
                  onChange={(e) => setBuilderPaymentTerms(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Tabla de Items de la Cotización */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              Prendas, Técnicas y Cantidades ({builderItems.length})
            </span>

            {builderItems.length === 0 ? (
              <div className="p-8 rounded-xl bg-slate-950/40 border border-dashed border-slate-800 text-center space-y-3">
                <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">
                  No hay ítems en la cotización aún. Vaya a la calculadora y pulse "Agregar a Cotización" o configure un ítem inicial.
                </p>
                <button
                  type="button"
                  onClick={() => handleTransferToQuoteBuilder()}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer"
                >
                  Agregar Ítem Actual de la Calculadora
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-950 text-[11px] text-slate-400 uppercase font-medium">
                    <tr>
                      <th className="py-2.5 px-3">Prenda & Detalle</th>
                      <th className="py-2.5 px-3">Técnica</th>
                      <th className="py-2.5 px-2 text-center">Cant.</th>
                      <th className="py-2.5 px-2 text-right">Unit. Base</th>
                      <th className="py-2.5 px-2 text-center">Desc. Vol.</th>
                      <th className="py-2.5 px-2 text-right">Unit. Final</th>
                      <th className="py-2.5 px-3 text-right font-bold text-slate-200">Subtotal</th>
                      <th className="py-2.5 px-2 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs">
                    {builderItems.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-800/30">
                        <td className="py-3 px-3">
                          <input
                            type="text"
                            value={item.garmentName}
                            onChange={(e) => {
                              const updated = [...builderItems];
                              updated[idx].garmentName = e.target.value;
                              setBuilderItems(updated);
                            }}
                            className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-cyan-500 text-slate-100 font-semibold text-xs w-full focus:outline-none"
                          />
                          <input
                            type="text"
                            value={item.designDescription}
                            onChange={(e) => {
                              const updated = [...builderItems];
                              updated[idx].designDescription = e.target.value;
                              setBuilderItems(updated);
                            }}
                            className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-cyan-500 text-[11px] text-slate-400 w-full focus:outline-none mt-0.5"
                          />
                        </td>
                        <td className="py-3 px-3 font-medium text-cyan-400 font-sans">
                          {item.techniqueName}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const newQty = Math.max(1, Number(e.target.value));
                              const updated = [...builderItems];
                              const newCalc = calculateFullCostBreakdown(
                                newQty,
                                customGarmentCost,
                                techniqueFactors,
                                operations,
                                item.markupPercent
                              );
                              updated[idx].quantity = newQty;
                              updated[idx].unitBasePrice = newCalc.baseUnitPrice;
                              updated[idx].discountPercent = newCalc.volumeDiscountPercent;
                              updated[idx].finalUnitPrice = newCalc.finalUnitPrice;
                              updated[idx].lineSubtotal = newCalc.subtotalOrder;
                              setBuilderItems(updated);
                            }}
                            className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center font-mono font-bold text-slate-100 focus:outline-none focus:border-cyan-500"
                          />
                        </td>
                        <td className="py-3 px-2 text-right font-mono text-slate-400">
                          {currency}{item.unitBasePrice.toFixed(2)}
                        </td>
                        <td className="py-3 px-2 text-center font-mono">
                          {item.discountPercent > 0 ? (
                            <span className="text-emerald-400 font-bold">-{item.discountPercent}%</span>
                          ) : (
                            <span className="text-slate-600">-</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-right font-mono font-semibold text-slate-200">
                          {currency}{item.finalUnitPrice.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-cyan-300">
                          {currency}{item.lineSubtotal.toFixed(2)}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              setBuilderItems(builderItems.filter((_, i) => i !== idx))
                            }
                            className="p-1 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-950/40 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Observaciones y Totales */}
          {builderItems.length > 0 && (
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 pt-4 border-t border-slate-800">
              <div className="flex-1 w-full space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Observaciones Técnicas y Condiciones de Garantía:
                </label>
                <textarea
                  rows={3}
                  value={builderNotes}
                  onChange={(e) => setBuilderNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="w-full md:w-80 bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal Neto:</span>
                  <span className="text-slate-200">
                    {currency}
                    {builderItems.reduce((acc, it) => acc + it.lineSubtotal, 0).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Flete / Transporte:</span>
                  <span className="text-slate-200">
                    {currency}{operations.transportCostPerOrder.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>IVA ({operations.taxPercent}%):</span>
                  <span className="text-slate-200">
                    {currency}
                    {(
                      (builderItems.reduce((acc, it) => acc + it.lineSubtotal, 0) +
                        operations.transportCostPerOrder) *
                      (operations.taxPercent / 100)
                    ).toFixed(2)}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-emerald-400">
                  <span className="font-sans">TOTAL PRESUPUESTO:</span>
                  <span>
                    {currency}
                    {(
                      (builderItems.reduce((acc, it) => acc + it.lineSubtotal, 0) +
                        operations.transportCostPerOrder) *
                      (1 + operations.taxPercent / 100)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PESTAÑA 3: HISTORIAL DE COTIZACIONES */}
      {activeTab === 'history' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Historial de Cotizaciones Emitidas
              </h2>
              <p className="text-xs text-slate-400">
                Presupuestos guardados, seguimiento de aprobaciones y exportación en PDF
              </p>
            </div>

            {/* Buscador y Filtro */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar por cliente o folio..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-56"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="todos">Todos los estados</option>
                <option value="enviada">Enviadas</option>
                <option value="aprobada">Aprobadas</option>
                <option value="facturada">Facturadas</option>
                <option value="borrador">Borradores</option>
                <option value="rechazada">Rechazadas</option>
              </select>
            </div>
          </div>

          {filteredQuotes.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No se encontraron cotizaciones con el filtro actual.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredQuotes.map((q) => (
                <div
                  key={q.id}
                  onClick={() => setSelectedQuoteForModal(q)}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-cyan-400">
                          {q.quoteNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            q.status === 'aprobada'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : q.status === 'enviada'
                              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {q.status}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-slate-200 mt-1">
                        {q.customer.name}
                      </div>
                      {q.customer.company && (
                        <div className="text-xs text-slate-400">{q.customer.company}</div>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-base font-bold font-mono text-emerald-400">
                        {currency}{q.grandTotal.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(q.createdAt).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between">
                    <span>
                      {q.items.length} {q.items.length === 1 ? 'ítem' : 'ítems'} • Total:{' '}
                      {q.items.reduce((acc, it) => acc + it.quantity, 0)} prendas
                    </span>
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleDuplicateQuote(q)}
                        className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800"
                        title="Duplicar para re-cotizar"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const blob = generateQuotePdf(q);
                          downloadFile(blob, `${q.quoteNumber}.html`);
                        }}
                        className="p-1 text-cyan-400 hover:text-cyan-300 rounded hover:bg-cyan-950/40"
                        title="Descargar PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteQuote(q.id)}
                        className="p-1 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-950/40"
                        title="Eliminar de historial"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modales */}
      <QuoteDetailModal
        quote={selectedQuoteForModal}
        onClose={() => setSelectedQuoteForModal(null)}
        onUpdateStatus={handleUpdateQuoteStatus}
      />

      <BaseCostSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={operations}
        business={business}
        onSave={(newSettings, newBusiness) => {
          setOperations(newSettings);
          setBusiness(newBusiness);
          saveOperationalSettings(newSettings);
          saveBusinessProfile(newBusiness);
        }}
      />
    </div>
  );
};
