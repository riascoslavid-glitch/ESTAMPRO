import React, { useState, useEffect } from 'react';
import { ClientCustomization } from '../../../types/store';
import { OrderRecord, ORDER_STATUSES } from '../../../types/adminProduction';
import { clientStoreService, PRINT_PLACEMENTS } from '../../../services/store/clientStoreService';
import { adminProductionService } from '../../../services/admin/adminProductionService';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import {
  FolderLock,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Trash2,
  Shirt,
  Calendar,
  FileCheck,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface ClientProjectsAndOrdersViewProps {
  onOpenCustomizerWithProject: (customization: ClientCustomization) => void;
}

export const ClientProjectsAndOrdersView: React.FC<ClientProjectsAndOrdersViewProps> = ({
  onOpenCustomizerWithProject
}) => {
  const { userProfile, currentUser } = useAuth();
  const { addNotification } = useApp();

  const [activeTab, setActiveTab] = useState<'proyectos' | 'pedidos'>('pedidos');
  const [customizations, setCustomizations] = useState<ClientCustomization[]>([]);
  const [clientOrders, setClientOrders] = useState<OrderRecord[]>([]);
  const [approvingCustId, setApprovingCustId] = useState<string | null>(null);
  const [approvalNotes, setApprovalNotes] = useState<string>('');

  const clientId = userProfile?.uid || currentUser?.uid || 'cliente_portal';
  const clientEmail = userProfile?.email || currentUser?.email || 'cliente@ejemplo.com';

  const loadData = () => {
    // 1. Load client's strictly private customizations
    const userCustomizations = clientStoreService.getClientCustomizations(clientId, clientEmail);
    setCustomizations(userCustomizations);

    // 2. Load client's strictly private orders
    const allOrders = adminProductionService.getOrders();
    const filteredOrders = allOrders.filter(
      (o) =>
        o.customerId === clientId ||
        (o.customerEmail && o.customerEmail.toLowerCase() === clientEmail.toLowerCase())
    );
    setClientOrders(filteredOrders);
  };

  useEffect(() => {
    loadData();
  }, [clientId, clientEmail]);

  const handleDeleteCustomization = async (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar este diseño privado?')) {
      await clientStoreService.deleteCustomization(id, clientId);
      addNotification('Proyecto eliminado', 'El diseño fue removido de tu cuenta.', 'info');
      loadData();
    }
  };

  const handleApproveDesign = async (customizationId: string) => {
    try {
      await clientStoreService.approveDesignByClient(customizationId, approvalNotes);
      addNotification(
        '¡Diseño Aprobado para Producción!',
        'Has dado el visto bueno formal. El taller iniciará la preparación de mallas/tintas.',
        'success',
        'pedidos'
      );
      setApprovingCustId(null);
      setApprovalNotes('');
      loadData();
    } catch (e) {
      console.error(e);
      addNotification('Error al aprobar diseño', 'Intenta nuevamente.', 'alert');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Privacy Notice Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 border border-indigo-900/50 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Bóveda Privada del Cliente
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Aislamiento Activo
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Conectado como <strong className="text-white">{userProfile?.displayName || 'Cliente'}</strong> ({clientEmail}). Tus diseños, artes subidos y pedidos son completamente confidenciales.
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('pedidos')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'pedidos'
                ? 'bg-cyan-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Mis Pedidos & Cotizaciones ({clientOrders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('proyectos')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'proyectos'
                ? 'bg-cyan-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FolderLock className="w-4 h-4" />
            <span>Diseños Guardados ({customizations.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MIS PEDIDOS Y COTIZACIONES */}
      {activeTab === 'pedidos' && (
        <div className="space-y-4">
          {clientOrders.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
              <ShoppingBag className="w-12 h-12 mx-auto text-slate-400 mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No tienes solicitudes de pedidos activas
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-4">
                Personaliza cualquier prenda de nuestro catálogo con tu diseño y solicita cotizaciones o pedidos de taller en minutos.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {clientOrders.map((order) => {
                const statusConf = ORDER_STATUSES[order.status] || ORDER_STATUSES.recibido;
                const linkedCustomization = customizations.find((c) => c.associatedOrderId === order.id);

                return (
                  <div
                    key={order.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700 space-y-4"
                  >
                    {/* Top Row: Order ID, status, date */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                          {order.orderNumber}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {order.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusConf.badgeClass}`}
                        >
                          {statusConf.label}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Entrega: {order.deliveryDate}
                        </span>
                      </div>
                    </div>

                    {/* Middle Row: Garments, artwork, breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Column 1: Garment & Color */}
                      <div className="space-y-1.5 text-xs">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                          Prendas & Tallas
                        </span>
                        {order.garments.map((g) => (
                          <div key={g.id} className="text-slate-700 dark:text-slate-300">
                            <strong>{g.garmentName}</strong> ({g.colorName})
                            <div className="flex flex-wrap gap-1 mt-1">
                              {g.sizes.map((s) => (
                                <span
                                  key={s.size}
                                  className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-semibold"
                                >
                                  {s.size}: {s.quantity} u.
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Column 2: Artwork & Placement */}
                      <div className="space-y-1.5 text-xs">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                          Técnica & Ubicación
                        </span>
                        <p className="font-semibold text-cyan-600 dark:text-cyan-400">
                          {order.techniqueName}
                        </p>
                        {order.designs.map((d) => (
                          <div key={d.id} className="flex items-center gap-2 mt-1">
                            {d.previewUrl && (
                              <img
                                src={d.previewUrl}
                                alt="Design"
                                className="w-10 h-10 object-contain rounded-lg border border-slate-200 dark:border-slate-700 bg-black/5 p-0.5"
                              />
                            )}
                            <div className="text-[11px] text-slate-600 dark:text-slate-300">
                              <div>{d.name}</div>
                              <div className="text-slate-400">{d.placement} • {d.dimensionsCm}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Column 3: Financials & Action */}
                      <div className="flex flex-col justify-between items-start md:items-end text-xs space-y-2">
                        <div className="text-left md:text-right">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                            Total Facturado
                          </span>
                          <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                            ${order.totalAmount.toLocaleString('es-CL')}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            {order.totalPieces} unidades
                          </span>
                        </div>

                        {/* Customer Design Approval Action */}
                        {(order.status === 'pendiente_diseno' ||
                          order.status === 'recibido' ||
                          linkedCustomization?.status === 'en_revision' ||
                          linkedCustomization?.status === 'observaciones_taller') && (
                          <div className="w-full md:w-auto">
                            {approvingCustId === (linkedCustomization?.id || order.id) ? (
                              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 space-y-2 text-left">
                                <label className="block text-xs font-semibold text-indigo-900 dark:text-indigo-200">
                                  Confirmar Aprobación de Diseño
                                </label>
                                <textarea
                                  rows={2}
                                  value={approvalNotes}
                                  onChange={(e) => setApprovalNotes(e.target.value)}
                                  placeholder="Notas u observaciones finales (opcional)..."
                                  className="w-full text-xs p-2 rounded-lg bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 focus:outline-none"
                                />
                                <div className="flex items-center gap-2 justify-end">
                                  <button
                                    type="button"
                                    onClick={() => setApprovingCustId(null)}
                                    className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700"
                                  >
                                    Cancelar
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleApproveDesign(linkedCustomization?.id || order.id)
                                    }
                                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs cursor-pointer"
                                  >
                                    Dar Visto Bueno Formal
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  setApprovingCustId(linkedCustomization?.id || order.id)
                                }
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                              >
                                <FileCheck className="w-4 h-4" />
                                <span>Aprobar Diseño para Producción</span>
                              </button>
                            )}
                          </div>
                        )}

                        {order.status === 'diseno_aprobado' && (
                          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Diseño Aprobado por Cliente</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MIS DISEÑOS Y PROYECTOS GUARDADOS */}
      {activeTab === 'proyectos' && (
        <div>
          {customizations.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
              <FolderLock className="w-12 h-12 mx-auto text-slate-400 mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No tienes proyectos guardados aún
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-4">
                Crea combinaciones personalizadas en el simulador 3D y guárdalas para editarlas más tarde.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {customizations.map((cust) => {
                const placementConfig = PRINT_PLACEMENTS[cust.placement] || PRINT_PLACEMENTS.pecho_central;
                return (
                  <div
                    key={cust.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between hover:border-cyan-500/50 transition-colors"
                  >
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 shadow-xs"
                            style={{ backgroundColor: cust.colorHex }}
                          />
                          <span className="text-xs font-semibold text-slate-500">
                            {cust.colorName}
                          </span>
                        </div>

                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                          {cust.totalUnits} u.
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {cust.title}
                      </h4>

                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                        <div className="text-slate-600 dark:text-slate-300">
                          <strong>Prenda:</strong> {cust.garmentName}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400">
                          <strong>Zona:</strong> {placementConfig.name}
                        </div>
                        {cust.customText && (
                          <div className="text-slate-500 dark:text-slate-400 truncate">
                            <strong>Texto:</strong> "{cust.customText}"
                          </div>
                        )}
                      </div>

                      <div className="flex items-baseline justify-between pt-1">
                        <span className="text-[11px] text-slate-400 font-semibold">Total Estimado</span>
                        <span className="text-base font-extrabold text-cyan-600 dark:text-cyan-400">
                          ${cust.totalEstimated.toLocaleString('es-CL')}
                        </span>
                      </div>
                    </div>

                    {/* Bottom actions */}
                    <div className="px-4 py-3 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomization(cust.id)}
                        className="text-xs text-rose-500 hover:text-rose-600 p-1 rounded-lg transition-colors"
                        title="Eliminar este proyecto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenCustomizerWithProject(cust)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Editar en 3D</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
