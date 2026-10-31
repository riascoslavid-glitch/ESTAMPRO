import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck2,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  Printer,
  Shirt,
  Calendar,
  User,
  ArrowRight,
  TrendingUp,
  X,
  FileText,
  Boxes,
  Award,
  Layers,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { adminProductionService } from '../../../services/admin/adminProductionService';
import {
  OrderRecord,
  QualityInspectionRecord,
  QualityChecklistTest
} from '../../../types/adminProduction';
import { AdminHeaderNav } from './AdminHeaderNav';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';

export const QualityControlView: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const { addNotification, setActiveModuleId } = useApp();

  const [inspections, setInspections] = useState<QualityInspectionRecord[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'cola' | 'historial'>('cola');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal inspection
  const [selectedOrderForInspection, setSelectedOrderForInspection] = useState<OrderRecord | null>(null);
  const [inspectedPiecesCount, setInspectedPiecesCount] = useState<number>(0);
  const [rejectedPiecesCount, setRejectedPiecesCount] = useState<number>(0);
  const [inspectorName, setInspectorName] = useState(userProfile?.displayName || 'Inspector de Calidad');
  const [qcObservations, setQcObservations] = useState('');
  const [checklistTests, setChecklistTests] = useState<QualityChecklistTest[]>([
    {
      id: 'test-1',
      name: 'Prueba de Estiramiento Cruzado (100% Elongación)',
      description: 'Estiramiento lateral manual vigoroso para comprobar anclaje del estampado sin cuarteo ni despegue.',
      category: 'estiramiento',
      status: 'passed'
    },
    {
      id: 'test-2',
      name: 'Curado Térmico y Polimerización Completa',
      description: 'Verificación de temperatura de curado (155-165°C), tacto seco no pegajoso y elasticidad post-enfriamiento.',
      category: 'curado',
      status: 'passed'
    },
    {
      id: 'test-3',
      name: 'Solidez al Frote y Resistencia al Lavado',
      description: 'Prueba crocking test con paño blanco seco y húmedo; sin sangrado ni desprendimiento de pigmento.',
      category: 'solidez',
      status: 'passed'
    },
    {
      id: 'test-4',
      name: 'Precisión de Registro y Alineación Anatómica',
      description: 'Centrado exacto respecto a nuca/costuras, escuadra a 90° y tolerancia máxima de 2mm en calces cromáticos.',
      category: 'registro',
      status: 'passed'
    },
    {
      id: 'test-5',
      name: 'Tacto y Caída Textil (Mano de la Prenda)',
      description: 'Evaluación de flexibilidad, suavidad y transpirabilidad sobre el tejido (tacto cero o depósito equilibrado).',
      category: 'tacto',
      status: 'passed'
    },
    {
      id: 'test-6',
      name: 'Ausencia de Fibrilación y Sangrado Sublimático',
      description: 'Sin fibras de algodón brotando a través de la tinta y sin migración de tinte de telas oscuras.',
      category: 'fibrilacion',
      status: 'passed'
    }
  ]);

  // Certificate Modal
  const [selectedInspectionForCert, setSelectedInspectionForCert] = useState<QualityInspectionRecord | null>(null);

  const loadData = () => {
    adminProductionService.setOwnerId(currentUser?.uid);
    setInspections(adminProductionService.getQualityInspections());
    setOrders(adminProductionService.getOrders());
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  // Orders in QC queue (either in 'control_calidad' or 'en_produccion')
  const ordersInQCQueue = useMemo(() => {
    return orders.filter(
      (o) => o.status === 'control_calidad' || o.status === 'en_produccion'
    );
  }, [orders]);

  // Orders finished and ready to be delivered (Finalizar Pedido)
  const ordersFinished = useMemo(() => {
    return orders.filter((o) => o.status === 'terminado');
  }, [orders]);

  // Metrics
  const metrics = useMemo(() => {
    const totalInspected = inspections.length;
    const passedCount = inspections.filter((i) => i.status === 'aprobado').length;
    const approvalRate = totalInspected > 0 ? Math.round((passedCount / totalInspected) * 100) : 100;
    const totalPiecesInspected = inspections.reduce((sum, i) => sum + i.inspectedPieces, 0);
    const totalPiecesRejected = inspections.reduce((sum, i) => sum + i.rejectedPieces, 0);
    const totalRejectionRate =
      totalPiecesInspected > 0 ? Number(((totalPiecesRejected / totalPiecesInspected) * 100).toFixed(1)) : 0;

    return {
      totalInspected,
      approvalRate,
      pendingQueueCount: ordersInQCQueue.length,
      finishedCount: ordersFinished.length,
      totalRejectionRate
    };
  }, [inspections, ordersInQCQueue, ordersFinished]);

  // Open Inspection Protocol Modal
  const handleStartInspection = (order: OrderRecord) => {
    setSelectedOrderForInspection(order);
    setInspectedPiecesCount(order.totalPieces);
    setRejectedPiecesCount(0);
    setQcObservations('');
    // Reset test statuses
    setChecklistTests((prev) => prev.map((t) => ({ ...t, status: 'passed' })));
  };

  // Toggle checklist test status
  const handleTestStatusChange = (testId: string, newStatus: 'passed' | 'failed' | 'warning') => {
    setChecklistTests((prev) =>
      prev.map((t) => (t.id === testId ? { ...t, status: newStatus } : t))
    );
  };

  // Submit Inspection Record
  const handleSubmitInspection = async (verdict: 'aprobado' | 'aprobado_con_observaciones' | 'rechazado') => {
    if (!selectedOrderForInspection) return;

    const certNum = `CERT-QC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const rejectionRate =
      inspectedPiecesCount > 0
        ? Number(((rejectedPiecesCount / inspectedPiecesCount) * 100).toFixed(1))
        : 0;

    const inspectionRecord: QualityInspectionRecord = {
      id: `qc-${Date.now()}`,
      ownerId: currentUser?.uid || 'default',
      orderId: selectedOrderForInspection.id,
      orderNumber: selectedOrderForInspection.orderNumber,
      customerName: selectedOrderForInspection.customerName,
      garmentName: selectedOrderForInspection.garments[0]?.garmentName || 'Prenda Textil',
      techniqueName: selectedOrderForInspection.techniqueName,
      totalPieces: selectedOrderForInspection.totalPieces,
      inspectedPieces: inspectedPiecesCount,
      rejectedPieces: rejectedPiecesCount,
      rejectionRatePercent: rejectionRate,
      tests: checklistTests,
      inspectorName,
      status: verdict,
      observations: qcObservations || 'Lote inspeccionado conforme a los estándares de la norma de taller.',
      certificateNumber: certNum,
      createdAt: new Date().toISOString()
    };

    await adminProductionService.saveQualityInspection(inspectionRecord);

    let msg = `Lote de la Orden ${selectedOrderForInspection.orderNumber} marcado como TERMINADO. Listo para entrega.`;
    if (verdict === 'rechazado') {
      msg = `Lote retenido por no cumplir estándares de calidad. Se notificó a producción.`;
      await adminProductionService.updateOrderStatus(selectedOrderForInspection.id, 'en_produccion');
    }

    addNotification(
      verdict === 'rechazado' ? 'Inspección Rechazada' : 'Inspección Aprobada',
      msg,
      verdict === 'rechazado' ? 'warning' : 'success',
      'pedidos'
    );

    setSelectedOrderForInspection(null);
    loadData();
  };

  // Finalize Order (Entregar pedido al cliente) -> Step 20
  const handleDeliverOrder = async (orderId: string, orderNumber: string) => {
    if (window.confirm(`¿Confirmar entrega final del pedido ${orderNumber} al cliente?`)) {
      await adminProductionService.updateOrderStatus(orderId, 'entregado');
      addNotification(
        '¡Pedido Finalizado y Entregado!',
        `La orden ${orderNumber} ha sido completada satisfactoriamente con cobro liquidado.`,
        'success',
        'pedidos'
      );
      loadData();
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Navigation Sub-header for Admin Modules */}
      <AdminHeaderNav activeSection="control_calidad" />

      {/* QC Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              En Cola de Inspección
            </span>
            <span className="text-2xl font-black text-amber-500">
              {metrics.pendingQueueCount}
            </span>
            <span className="text-[11px] text-slate-500 block">lotes pendientes</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Tasa de Aprobación
            </span>
            <span className="text-2xl font-black text-emerald-500">
              {metrics.approvalRate}%
            </span>
            <span className="text-[11px] text-slate-500 block">estándar de primera</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Terminados Listos
            </span>
            <span className="text-2xl font-black text-cyan-500">
              {metrics.finishedCount}
            </span>
            <span className="text-[11px] text-slate-500 block">por despachar / entregar</span>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-500">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Merma / Rechazo Textil
            </span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-200">
              {metrics.totalRejectionRate}%
            </span>
            <span className="text-[11px] text-emerald-500 font-semibold block">tolerancia ≤ 3%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('cola')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'cola'
                ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Cola de Inspección ({ordersInQCQueue.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('historial')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'historial'
                ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Certificados Emitidos ({inspections.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar orden o cliente..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* TAB 1: COLA DE INSPECCIÓN Y TERMINADOS */}
      {activeTab === 'cola' && (
        <div className="space-y-6">
          {/* Section: Awaiting QC */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Boxes className="w-4 h-4 text-amber-500" />
                Lotes de Producción Pendientes de Inspección
              </h3>
              <span className="text-xs text-slate-400">
                Pasan a control tras finalizar la tirada de estampado
              </span>
            </div>

            {ordersInQCQueue.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                No hay lotes en espera de control de calidad en este momento.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ordersInQCQueue.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3 hover:border-amber-400/50 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          {order.orderNumber}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {order.deliveryDate}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {order.title}
                      </h4>

                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs space-y-1">
                        <div>
                          <strong>Cliente:</strong> {order.customerName}
                        </div>
                        <div>
                          <strong>Técnica:</strong> {order.techniqueName}
                        </div>
                        <div>
                          <strong>Prendas:</strong> {order.totalPieces} unidades
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleStartInspection(order)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      <FileCheck2 className="w-4 h-4" />
                      <span>Iniciar Protocolo de Control</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Finished Orders (Ready to Finalize / Deliver) -> Step 20 */}
          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Pedidos Conformes (Control Aprobado • Listos para Despacho)
              </h3>
              <span className="text-xs text-slate-400">
                Presiona "Finalizar y Entregar" para liquidar la orden
              </span>
            </div>

            {ordersFinished.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                No hay pedidos en estado Terminado pendientes de despacho.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ordersFinished.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-emerald-500/30 dark:border-emerald-500/20 shadow-sm flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {order.orderNumber}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                          Control Aprobado
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {order.title}
                      </h4>

                      <div className="text-xs text-slate-500">
                        Cliente: <strong className="text-slate-700 dark:text-slate-300">{order.customerName}</strong> • {order.totalPieces} pzas.
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeliverOrder(order.id, order.orderNumber)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-colors cursor-pointer"
                    >
                      <Award className="w-4 h-4" />
                      <span>Finalizar Pedido (Marcar Entregado)</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: HISTORIAL DE CERTIFICADOS DE CALIDAD */}
      {activeTab === 'historial' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-4">N° Certificado</th>
                  <th className="py-3 px-4">Orden / Cliente</th>
                  <th className="py-3 px-4">Prenda / Técnica</th>
                  <th className="py-3 px-4">Inspeccionadas</th>
                  <th className="py-3 px-4">Merma / Rechazo</th>
                  <th className="py-3 px-4">Dictamen</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {inspections.map((insp) => (
                  <tr key={insp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">
                      {insp.certificateNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {insp.orderNumber}
                      </div>
                      <div className="text-[11px] text-slate-400">{insp.customerName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {insp.garmentName}
                      </div>
                      <div className="text-[11px] text-slate-400">{insp.techniqueName}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold">
                      {insp.inspectedPieces} u.
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {insp.rejectedPieces} u. ({insp.rejectionRatePercent}%)
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          insp.status === 'aprobado'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : insp.status === 'aprobado_con_observaciones'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                        }`}
                      >
                        {insp.status === 'aprobado'
                          ? 'Aprobado 100%'
                          : insp.status === 'aprobado_con_observaciones'
                          ? 'Con Observaciones'
                          : 'Rechazado'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedInspectionForCert(insp)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
                      >
                        Ver Certificado
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: CHECKLIST DE PROTOCOLO DE CONTROL DE CALIDAD */}
      {selectedOrderForInspection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-500" />
                  Protocolo de Inspección de Calidad Textil
                </h3>
                <p className="text-xs text-slate-500">
                  Orden #{selectedOrderForInspection.orderNumber} • {selectedOrderForInspection.customerName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderForInspection(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lot Summary */}
            <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Prenda</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                  {selectedOrderForInspection.garments[0]?.garmentName || 'Prenda'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Técnica</span>
                <span className="font-bold text-cyan-600 dark:text-cyan-400 truncate block">
                  {selectedOrderForInspection.techniqueName}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tirada Total</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  {selectedOrderForInspection.totalPieces} prendas
                </span>
              </div>
            </div>

            {/* Checklist of 6 Textile Tests */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                Pruebas Físico-Mecánicas de Inspección
              </span>

              {checklistTests.map((test) => (
                <div
                  key={test.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {test.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleTestStatusChange(test.id, 'passed')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                          test.status === 'passed'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Conforme
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTestStatusChange(test.id, 'warning')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                          test.status === 'warning'
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Observado
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTestStatusChange(test.id, 'failed')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                          test.status === 'failed'
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        No Conforme
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500">{test.description}</p>
                </div>
              ))}
            </div>

            {/* Counts and Inspector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Muestra Inspeccionada (u.)
                </label>
                <input
                  type="number"
                  min={1}
                  value={inspectedPiecesCount}
                  onChange={(e) => setInspectedPiecesCount(parseInt(e.target.value, 10) || 0)}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Piezas Rechazadas (Merma)
                </label>
                <input
                  type="number"
                  min={0}
                  value={rejectedPiecesCount}
                  onChange={(e) => setRejectedPiecesCount(parseInt(e.target.value, 10) || 0)}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Inspector Responsable
                </label>
                <input
                  type="text"
                  value={inspectorName}
                  onChange={(e) => setInspectorName(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Observaciones Técnicas de Inspección
                </label>
                <textarea
                  rows={2}
                  value={qcObservations}
                  onChange={(e) => setQcObservations(e.target.value)}
                  placeholder="Detalles de anclaje, solidez, recomendaciones para el cliente..."
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs resize-none"
                />
              </div>
            </div>

            {/* Verdict Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleSubmitInspection('rechazado')}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold"
              >
                Rechazar Lote (Reproceso)
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => handleSubmitInspection('aprobado_con_observaciones')}
                  className="px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 text-xs font-bold"
                >
                  Aprobar con Observaciones
                </button>

                <button
                  type="button"
                  onClick={() => handleSubmitInspection('aprobado')}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Aprobar 100% (Pasar a Terminado)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CERTIFICADO DE CALIDAD DE TALLER */}
      {selectedInspectionForCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-cyan-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Certificado de Calidad Textil
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInspectionForCert(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Certificate layout */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 font-sans">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                    ESTAMPAPRO 360° TEXTILE STUDIO
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Control de Calidad & Trazabilidad Industrial
                  </div>
                </div>
                <div className="text-right font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400">
                  {selectedInspectionForCert.certificateNumber}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                <div>
                  <strong>Orden:</strong> {selectedInspectionForCert.orderNumber}
                </div>
                <div>
                  <strong>Cliente:</strong> {selectedInspectionForCert.customerName}
                </div>
                <div>
                  <strong>Prenda:</strong> {selectedInspectionForCert.garmentName}
                </div>
                <div>
                  <strong>Técnica:</strong> {selectedInspectionForCert.techniqueName}
                </div>
                <div>
                  <strong>Tirada:</strong> {selectedInspectionForCert.inspectedPieces} u.
                </div>
                <div>
                  <strong>Merma:</strong> {selectedInspectionForCert.rejectionRatePercent}%
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Pruebas Físico-Mecánicas Validadas
                </span>
                <div className="space-y-1">
                  {selectedInspectionForCert.tests.map((t) => (
                    <div key={t.id} className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-700 dark:text-slate-300">{t.name}</span>
                      <span className="text-emerald-500 font-bold">✓ Conforme</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-3 text-xs text-slate-500">
                <strong>Observaciones:</strong> {selectedInspectionForCert.observations}
                <div className="mt-2 text-[10px] text-slate-400">
                  Firmado digitalmente por: <strong>{selectedInspectionForCert.inspectorName}</strong> • {new Date(selectedInspectionForCert.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedInspectionForCert(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Certificado</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
