import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  ShoppingBag, 
  CheckCircle2, 
  Package, 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  Calendar, 
  Download, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Printer, 
  Users, 
  Clock, 
  Eye, 
  Layers, 
  FileSpreadsheet
} from 'lucide-react';
import { adminProductionService } from '../../../services/admin/adminProductionService';
import { 
  OrderRecord, 
  InventoryItemRecord, 
  InventoryMovementRecord, 
  ProductionTaskRecord, 
  WorkshopMetricsReport, 
  ORDER_STATUSES 
} from '../../../types/adminProduction';
import { AdminHeaderNav } from './AdminHeaderNav';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';

export const ReportsAnalyticsView: React.FC = () => {
  const { currentUser } = useAuth();
  const { setActiveModuleId } = useApp();

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [inventory, setInventory] = useState<InventoryItemRecord[]>([]);
  const [movements, setMovements] = useState<InventoryMovementRecord[]>([]);
  const [tasks, setTasks] = useState<ProductionTaskRecord[]>([]);

  const [activeTab, setActiveTab] = useState<'resumen' | 'pendientes' | 'terminados' | 'materiales' | 'actividad'>('resumen');

  useEffect(() => {
    adminProductionService.setOwnerId(currentUser?.uid);
    setOrders(adminProductionService.getOrders());
    setInventory(adminProductionService.getInventory());
    setMovements(adminProductionService.getMovements());
    setTasks(adminProductionService.getProductionTasks());
  }, [currentUser]);

  const metrics: WorkshopMetricsReport = useMemo(() => {
    return adminProductionService.getWorkshopMetricsReport();
  }, [orders, inventory, tasks, movements]);

  // Desglose de Pedidos Pendientes
  const pendingOrders = useMemo(() => {
    return orders.filter(o => 
      ['recibido', 'pendiente_diseno', 'diseno_aprobado', 'preparacion', 'en_produccion', 'control_calidad'].includes(o.status)
    );
  }, [orders]);

  // Desglose de Pedidos Terminados
  const finishedOrders = useMemo(() => {
    return orders.filter(o => ['terminado', 'entregado'].includes(o.status));
  }, [orders]);

  // Materiales por Reponer
  const materialsToReplenish = useMemo(() => {
    return inventory.filter(i => i.currentStock <= i.minStockAlert);
  }, [inventory]);

  // Materiales Disponibles
  const availableMaterials = useMemo(() => {
    return inventory.filter(i => i.currentStock > i.minStockAlert);
  }, [inventory]);

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  // Exportar reporte a CSV
  const handleExportCSV = () => {
    const headers = 'OT,Cliente,Tecnica,Prendas,Estado,FechaEntrega,Total\n';
    const rows = orders.map(o => 
      `"${o.orderNumber}","${o.customerName}","${o.techniqueName}",${o.totalPieces},"${o.status}","${o.deliveryDate}",${o.totalAmount}`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_taller_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Navegador Común */}
      <AdminHeaderNav 
        currentTab="reportes" 
        lowStockCount={metrics.materialsNeedingReplenishmentCount}
        pendingOrdersCount={metrics.pendingOrdersCount}
        inProductionCount={metrics.ordersInProductionCount}
      />

      {/* Header del Módulo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Reportes de Negocio y Auditoría de Taller
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Métricas de Pedidos Pendientes, Terminados, Materiales Disponibles, Reposición y Actividad
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs shadow-xs hover:bg-slate-800 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Reporte CSV</span>
        </button>
      </div>

      {/* 5 TARJETAS KPI REQUERIDAS POR PROMPT 14 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* 1. Pedidos Pendientes */}
        <div 
          onClick={() => setActiveTab('pendientes')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs cursor-pointer hover:border-amber-500/60 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Pedidos Pendientes
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.pendingOrdersCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {pendingOrders.reduce((acc, o) => acc + o.totalPieces, 0)} prendas en flujo
          </p>
        </div>

        {/* 2. Pedidos Terminados */}
        <div 
          onClick={() => setActiveTab('terminados')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs cursor-pointer hover:border-emerald-500/60 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Pedidos Terminados
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.finishedOrdersCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {formatMoney(finishedOrders.reduce((acc, o) => acc + o.totalAmount, 0))} facturados
          </p>
        </div>

        {/* 3. Materiales Disponibles */}
        <div 
          onClick={() => setActiveTab('materiales')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs cursor-pointer hover:border-blue-500/60 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Materiales Disponibles
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-500">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.availableMaterialsCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Con stock sobre umbral de seguridad
          </p>
        </div>

        {/* 4. Materiales por Reponer */}
        <div 
          onClick={() => setActiveTab('materiales')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs cursor-pointer hover:border-rose-500/60 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Materiales por Reponer
            </span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {metrics.materialsNeedingReplenishmentCount}
          </div>
          <p className="text-[11px] text-rose-600/80 dark:text-rose-400/80 mt-1">
            Bajo existencias mínimas
          </p>
        </div>

        {/* 5. Actividad de Producción */}
        <div 
          onClick={() => setActiveTab('actividad')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs cursor-pointer hover:border-purple-500/60 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Actividad Taller
            </span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-500">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.activeMachinesCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Máquinas activas • {metrics.activeOperatorsCount} operarios
          </p>
        </div>
      </div>

      {/* Tabs de Detalle de Reportes */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none text-xs font-semibold">
        {[
          { id: 'resumen', label: 'Resumen Global' },
          { id: 'pendientes', label: `Pedidos Pendientes (${metrics.pendingOrdersCount})` },
          { id: 'terminados', label: `Pedidos Terminados (${metrics.finishedOrdersCount})` },
          { id: 'materiales', label: `Materiales y Reposición (${materialsToReplenish.length} alertas)` },
          { id: 'actividad', label: `Bitácora de Producción (${movements.length})` }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap ${
              activeTab === t.id
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: RESUMEN GLOBAL */}
      {activeTab === 'resumen' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribución por Estado */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-500" />
              <span>Carga de Trabajo por Fases de Taller</span>
            </h3>

            <div className="space-y-2 text-xs">
              {Object.values(ORDER_STATUSES).filter(s => s.id !== 'cancelado').map(st => {
                const count = orders.filter(o => o.status === st.id).length;
                const percent = Math.round((count / Math.max(1, orders.length)) * 100);

                return (
                  <div key={st.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 w-1/3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.badgeClass}`}>
                        {st.label}
                      </span>
                    </div>

                    <div className="flex-1 mx-3">
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 rounded-full" 
                          style={{ width: `${percent}%` }} 
                        />
                      </div>
                    </div>

                    <div className="w-16 text-right font-bold text-slate-900 dark:text-white">
                      {count} OT ({percent}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Insumos Críticos para Reposición Inmediata */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Materiales que Requieren Reposición Inmediata</span>
              </h3>
              <button
                onClick={() => setActiveModuleId('inventario')}
                className="text-xs font-semibold text-amber-500 hover:underline"
              >
                Ir a Inventario
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {materialsToReplenish.map(m => (
                <div 
                  key={m.id}
                  className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{m.name}</div>
                    <div className="text-[11px] text-slate-500">
                      SKU: <span className="font-mono">{m.sku}</span> • Ubicación: {m.storageLocation || 'Bodega'}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-black text-rose-600 dark:text-rose-400">
                      {m.currentStock} {m.unit}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Mínimo: {m.minStockAlert} {m.unit}
                    </div>
                  </div>
                </div>
              ))}

              {materialsToReplenish.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-xs">
                  Todos los insumos se encuentran en niveles óptimos de existencias.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PEDIDOS PENDIENTES */}
      {activeTab === 'pendientes' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Listado Detallado de Pedidos Pendientes ({pendingOrders.length})
            </h3>
            <button
              onClick={() => setActiveModuleId('pedidos')}
              className="text-xs font-semibold text-amber-500 hover:underline"
            >
              Abrir Tablero Kanban
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">OT</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Trabajo</th>
                  <th className="py-3 px-4">Técnica</th>
                  <th className="py-3 px-4">Prendas</th>
                  <th className="py-3 px-4">Fase Actual</th>
                  <th className="py-3 px-4">Fecha Entrega</th>
                  <th className="py-3 px-4 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {pendingOrders.map(ord => (
                  <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-amber-500">{ord.orderNumber}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{ord.customerName}</td>
                    <td className="py-3 px-4">{ord.title}</td>
                    <td className="py-3 px-4">{ord.techniqueName}</td>
                    <td className="py-3 px-4 font-bold">{ord.totalPieces} uds</td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ORDER_STATUSES[ord.status]?.badgeClass}`}>
                        {ORDER_STATUSES[ord.status]?.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{ord.deliveryDate}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                      {formatMoney(ord.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PEDIDOS TERMINADOS */}
      {activeTab === 'terminados' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Historial de Pedidos Terminados y Entregados ({finishedOrders.length})
            </h3>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Total: {formatMoney(finishedOrders.reduce((acc, o) => acc + o.totalAmount, 0))}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">OT</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Trabajo</th>
                  <th className="py-3 px-4">Técnica</th>
                  <th className="py-3 px-4">Prendas</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Facturado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {finishedOrders.map(ord => (
                  <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-amber-500">{ord.orderNumber}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{ord.customerName}</td>
                    <td className="py-3 px-4">{ord.title}</td>
                    <td className="py-3 px-4">{ord.techniqueName}</td>
                    <td className="py-3 px-4 font-bold">{ord.totalPieces} uds</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {ord.status === 'entregado' ? 'Entregado' : 'Terminado'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-black text-slate-900 dark:text-white">
                      {formatMoney(ord.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: MATERIALES DISPONIBLES VS POR REPONER */}
      {activeTab === 'materiales' && (
        <div className="space-y-6">
          {/* Materiales por Reponer */}
          <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 bg-rose-50/60 dark:bg-rose-950/30 border-b border-rose-200 dark:border-rose-900 flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Materiales por Reponer (Bajo Stock Mínimo: {materialsToReplenish.length})</span>
              </div>
              <button
                onClick={() => setActiveModuleId('inventario')}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Registrar Ingreso de Stock
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4">Material</th>
                    <th className="py-3 px-4">Categoría</th>
                    <th className="py-3 px-4">Stock Actual</th>
                    <th className="py-3 px-4">Stock Mínimo</th>
                    <th className="py-3 px-4">Faltante Sugerido</th>
                    <th className="py-3 px-4">Ubicación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {materialsToReplenish.map(m => {
                    const deficit = Math.max(0, m.minStockAlert * 2 - m.currentStock);
                    return (
                      <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-mono font-bold text-amber-500">{m.sku}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{m.name}</td>
                        <td className="py-3 px-4 uppercase text-[10px] text-slate-500">{m.category}</td>
                        <td className="py-3 px-4 font-black text-rose-600">{m.currentStock} {m.unit}</td>
                        <td className="py-3 px-4 text-slate-500">{m.minStockAlert} {m.unit}</td>
                        <td className="py-3 px-4 font-bold text-amber-600">+{deficit.toFixed(1)} {m.unit}</td>
                        <td className="py-3 px-4 text-slate-500">{m.storageLocation || 'Bodega'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Materiales Disponibles */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Materiales Disponibles con Stock Saludable ({availableMaterials.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4">Material / Insumo</th>
                    <th className="py-3 px-4">Categoría</th>
                    <th className="py-3 px-4">Stock Actual</th>
                    <th className="py-3 px-4">Ubicación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {availableMaterials.map(m => (
                    <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono font-bold text-amber-500">{m.sku}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{m.name}</td>
                      <td className="py-3 px-4 uppercase text-[10px] text-slate-500">{m.category}</td>
                      <td className="py-3 px-4 font-bold text-emerald-600">{m.currentStock} {m.unit}</td>
                      <td className="py-3 px-4 text-slate-500">{m.storageLocation || 'Bodega'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ACTIVIDAD DE PRODUCCIÓN */}
      {activeTab === 'actividad' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-500" />
              <span>Cronología de Movimientos e Intervenciones de Taller</span>
            </h3>
            <span className="text-xs text-slate-500">{movements.length} eventos registrados</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {movements.map(m => (
              <div key={m.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <span className={`p-2 rounded-xl mt-0.5 ${
                    m.type === 'entrada'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {m.type === 'entrada' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </span>

                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {m.itemName} <span className="font-mono text-amber-500 font-normal">({m.itemSku})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Operación: <strong>{m.reason.replace('_', ' ')}</strong> 
                      {m.orderRefNumber && <span> • Orden de Trabajo: <strong className="text-amber-500">{m.orderRefNumber}</strong></span>}
                      {m.operatorName && <span> • Operador: {m.operatorName}</span>}
                    </div>
                    {m.notes && (
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 italic">
                        &quot;{m.notes}&quot;
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className={`font-black text-sm ${m.type === 'entrada' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {m.type === 'entrada' ? '+' : '-'}{m.quantity}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Stock: {m.previousStock} → {m.newStock}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {new Date(m.timestamp).toLocaleDateString()} {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
