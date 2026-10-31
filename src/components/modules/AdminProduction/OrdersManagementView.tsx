import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Copy, 
  Edit3, 
  Ban, 
  Eye, 
  Layers, 
  Shirt, 
  FileText, 
  Calendar, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Filter, 
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Workflow
} from 'lucide-react';
import { adminProductionService } from '../../../services/admin/adminProductionService';
import { 
  OrderRecord, 
  OrderStatus, 
  ORDER_STATUSES, 
  CustomerRecord,
  OrderGarmentLine,
  OrderDesignLink
} from '../../../types/adminProduction';
import { AdminHeaderNav } from './AdminHeaderNav';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';

export const OrdersManagementView: React.FC = () => {
  const { currentUser } = useAuth();
  const { setActiveModuleId } = useApp();

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  
  // Filtros y Búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [priorityFilter, setPriorityFilter] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  // Modales
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<OrderRecord | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');

  // Formulario de Pedido
  const [orderForm, setOrderForm] = useState<Partial<OrderRecord>>({
    title: '',
    customerId: '',
    customerName: '',
    associatedQuoteNumber: '',
    techniqueName: 'DTF Textil',
    status: 'recibido',
    priority: 'normal',
    deliveryDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    totalPieces: 25,
    totalAmount: 350000,
    depositPaid: 150000,
    balanceDue: 200000,
    productionNotes: '',
    garments: [],
    designs: []
  });

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    adminProductionService.setOwnerId(currentUser?.uid);
    setOrders(adminProductionService.getOrders());
    setCustomers(adminProductionService.getCustomers());
  }, [currentUser]);

  const metrics = useMemo(() => {
    return adminProductionService.getWorkshopMetricsReport();
  }, [orders]);

  // Lista de estados para el tablero Kanban
  const KANBAN_COLUMNS: OrderStatus[] = [
    'recibido',
    'pendiente_diseno',
    'diseno_aprobado',
    'preparacion',
    'en_produccion',
    'control_calidad',
    'terminado',
    'entregado'
  ];

  // Filtrado de órdenes
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = 
        o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.associatedQuoteNumber && o.associatedQuoteNumber.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'todos' || o.status === statusFilter;
      const matchesPriority = priorityFilter === 'todos' || o.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [orders, searchQuery, statusFilter, priorityFilter]);

  // Abrir Modal de Creación
  const handleOpenCreate = () => {
    setIsEditing(false);
    const defaultCust = customers[0] || { id: 'cust-new', name: 'Cliente General' };
    
    setOrderForm({
      id: `ord-${Date.now()}`,
      orderNumber: `OT-2026-${String(orders.length + 15).padStart(3, '0')}`,
      title: 'Nueva Tirada de Estampado',
      customerId: defaultCust.id,
      customerName: defaultCust.name,
      customerContact: defaultCust.contactPerson,
      customerEmail: defaultCust.email,
      customerPhone: defaultCust.phone,
      associatedQuoteNumber: '',
      techniqueName: 'DTF Textil',
      status: 'recibido',
      priority: 'normal',
      deliveryDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      totalPieces: 25,
      totalAmount: 350000,
      depositPaid: 175000,
      balanceDue: 175000,
      productionNotes: 'Verificar temperatura de prensa a 155°C y pelado en caliente.',
      garments: [
        {
          id: `gline-${Date.now()}`,
          garmentName: 'Camiseta Cuello Redondo Heavyweight 240g',
          colorName: 'Negro Profundo',
          colorHex: '#121212',
          sizes: [
            { size: 'M', quantity: 15 },
            { size: 'L', quantity: 10 }
          ],
          totalUnits: 25,
          unitPrice: 14000,
          subtotal: 350000
        }
      ],
      designs: [
        {
          id: `des-${Date.now()}`,
          name: 'Arte Gráfico Principal Pecho',
          previewUrl: '/src/assets/images/garment_tshirt_heavyweight_1793416398987.jpg',
          placement: 'Pecho frontal',
          dimensionsCm: '28 x 35 cm',
          technique: 'DTF Textil',
          colorsCount: 4
        }
      ]
    });
    setIsOrderModalOpen(true);
  };

  // Abrir Modal de Edición
  const handleOpenEdit = (order: OrderRecord) => {
    setIsEditing(true);
    setOrderForm({ ...order });
    setIsOrderModalOpen(true);
  };

  // Duplicar Pedido
  const handleDuplicate = async (orderId: string) => {
    try {
      const duplicated = await adminProductionService.duplicateOrder(orderId);
      setOrders(adminProductionService.getOrders());
      setFeedbackMessage(`Orden duplicada con éxito como ${duplicated.orderNumber}`);
      setTimeout(() => setFeedbackMessage(null), 3000);
    } catch (e) {
      alert('Error al duplicar orden');
    }
  };

  // Guardar Pedido (Crear o Editar)
  const handleSaveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderForm.title || !orderForm.customerName) {
      alert('Por favor completa el título de la orden y el cliente');
      return;
    }

    const payload: OrderRecord = {
      id: orderForm.id || `ord-${Date.now()}`,
      ownerId: currentUser?.uid || 'default',
      orderNumber: orderForm.orderNumber || `OT-2026-${String(orders.length + 15).padStart(3, '0')}`,
      title: orderForm.title!,
      customerId: orderForm.customerId || 'cust-general',
      customerName: orderForm.customerName!,
      customerContact: orderForm.customerContact,
      customerEmail: orderForm.customerEmail,
      customerPhone: orderForm.customerPhone,
      associatedQuoteId: orderForm.associatedQuoteId,
      associatedQuoteNumber: orderForm.associatedQuoteNumber,
      techniqueName: orderForm.techniqueName || 'DTF Textil',
      status: (orderForm.status as OrderStatus) || 'recibido',
      priority: orderForm.priority || 'normal',
      totalPieces: Number(orderForm.totalPieces) || 0,
      totalAmount: Number(orderForm.totalAmount) || 0,
      depositPaid: Number(orderForm.depositPaid) || 0,
      balanceDue: Math.max(0, (Number(orderForm.totalAmount) || 0) - (Number(orderForm.depositPaid) || 0)),
      deliveryDate: orderForm.deliveryDate || new Date().toISOString().split('T')[0],
      productionNotes: orderForm.productionNotes || '',
      garments: orderForm.garments || [],
      designs: orderForm.designs || [],
      createdAt: orderForm.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await adminProductionService.saveOrder(payload);
    setOrders(adminProductionService.getOrders());
    setIsOrderModalOpen(false);
    if (selectedOrder?.id === saved.id) {
      setSelectedOrder(saved);
    }
    setFeedbackMessage(isEditing ? 'Orden actualizada exitosamente' : `Orden ${saved.orderNumber} creada con éxito`);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  // Confirmar Cancelación
  const handleConfirmCancel = async () => {
    if (!orderToCancel) return;
    if (!cancellationReason.trim()) {
      alert('Por favor ingresa el motivo de la cancelación de la orden.');
      return;
    }

    await adminProductionService.cancelOrder(orderToCancel.id, cancellationReason);
    setOrders(adminProductionService.getOrders());
    setOrderToCancel(null);
    setCancellationReason('');
    setFeedbackMessage('Orden cancelada correctamente.');
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  // Cambiar estado rápido
  const handleQuickStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await adminProductionService.updateOrderStatus(orderId, newStatus);
    setOrders(adminProductionService.getOrders());
  };

  // Formato Moneda
  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Navegación común */}
      <AdminHeaderNav 
        currentTab="pedidos" 
        lowStockCount={metrics.materialsNeedingReplenishmentCount}
        pendingOrdersCount={metrics.pendingOrdersCount}
        inProductionCount={metrics.ordersInProductionCount}
      />

      {/* Alerta de Feedback */}
      {feedbackMessage && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-sm font-medium animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Header del Módulo de Pedidos */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Gestión de Pedidos y Órdenes de Trabajo (OT)
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Flujo de producción en 8 estados: Recibido → Diseño → Preparación → Producción → Calidad → Entrega
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Alternador de vista Kanban / Tabla */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Tablero Kanban
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Lista Tabular
            </button>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Orden (OT)</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros, Búsqueda y Estados */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por número de OT (ej: OT-2026-014), título, cliente o cotización..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
            >
              <option value="todos">Todos los Estados ({orders.length})</option>
              {Object.values(ORDER_STATUSES).map(s => (
                <option key={s.id} value={s.id}>
                  {s.label} ({orders.filter(o => o.status === s.id).length})
                </option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
            >
              <option value="todos">Todas las Prioridades</option>
              <option value="normal">Normal</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente 🔥</option>
            </select>
          </div>
        </div>

        {/* Resumen numérico en píldoras */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none border-t border-slate-100 dark:border-slate-800/60 pt-2.5">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0 mr-1">Filtro rápido:</span>
          <button
            onClick={() => setStatusFilter('todos')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0 transition-colors ${
              statusFilter === 'todos'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            Todas ({orders.length})
          </button>
          {KANBAN_COLUMNS.map(col => {
            const count = orders.filter(o => o.status === col).length;
            const config = ORDER_STATUSES[col];
            return (
              <button
                key={col}
                onClick={() => setStatusFilter(col)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0 transition-colors flex items-center gap-1 ${
                  statusFilter === col
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                <span>{config.label}</span>
                <span className="text-[10px] px-1 rounded-md bg-slate-200 dark:bg-slate-700/80">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* VISTA 1: TABLERO KANBAN DE LOS 8 ESTADOS */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-6">
          {KANBAN_COLUMNS.map((columnId) => {
            const columnConfig = ORDER_STATUSES[columnId];
            const columnOrders = filteredOrders.filter(o => o.status === columnId);

            return (
              <div
                key={columnId}
                className="bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-3 flex flex-col min-w-[280px]"
              >
                {/* Header de la columna */}
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      {columnConfig.label}
                    </h3>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs">
                    {columnOrders.length}
                  </span>
                </div>

                {/* Tarjetas de órdenes en la columna */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[650px] pr-1">
                  {columnOrders.map((order) => {
                    return (
                      <div
                        key={order.id}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs hover:border-amber-500/60 hover:shadow-sm transition-all group flex flex-col justify-between"
                      >
                        <div>
                          {/* Top Card Info */}
                          <div className="flex items-start justify-between gap-1 mb-2">
                            <span className="font-mono text-xs font-bold text-amber-500">
                              {order.orderNumber}
                            </span>
                            <div className="flex items-center gap-1">
                              {order.priority === 'urgente' && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400 animate-pulse">
                                  URGENTE
                                </span>
                              )}
                              {order.priority === 'alta' && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                                  ALTA
                                </span>
                              )}
                            </div>
                          </div>

                          <h4 
                            onClick={() => setSelectedOrder(order)}
                            className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 cursor-pointer hover:text-amber-500 transition-colors mb-1"
                          >
                            {order.title}
                          </h4>

                          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-3">
                            Cliente: <span className="text-slate-900 dark:text-slate-200 font-semibold">{order.customerName}</span>
                          </p>

                          {/* Prenda / Diseños asociados */}
                          <div className="space-y-1 mb-3 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                                <Shirt className="w-3 h-3 text-amber-500" />
                                {order.totalPieces} prendas
                              </span>
                              <span className="font-semibold text-slate-800 dark:text-slate-200">
                                {order.techniqueName}
                              </span>
                            </div>

                            {order.associatedQuoteNumber && (
                              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                <FileText className="w-3 h-3" />
                                <span>Cotiz: <strong>{order.associatedQuoteNumber}</strong></span>
                              </div>
                            )}

                            <div className="flex items-center gap-1 text-[10px] text-slate-400">
                              <Calendar className="w-3 h-3" />
                              <span>Entrega: {order.deliveryDate}</span>
                            </div>
                          </div>
                        </div>

                        {/* Pie de tarjeta con acciones */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {formatMoney(order.totalAmount)}
                          </span>

                          <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100">
                            <button
                              onClick={() => handleDuplicate(order.id)}
                              title="Duplicar orden"
                              className="p-1 rounded-md text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(order)}
                              title="Editar orden"
                              className="p-1 rounded-md text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setSelectedOrder(order)}
                              title="Ver detalles"
                              className="p-1 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setOrderToCancel(order)}
                              title="Cancelar orden"
                              className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {columnOrders.length === 0 && (
                    <div className="py-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                      Sin órdenes en esta fase
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VISTA 2: LISTA TABULAR */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">OT #</th>
                  <th className="py-3 px-4">Título / Trabajo</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Técnica</th>
                  <th className="py-3 px-4">Prendas</th>
                  <th className="py-3 px-4">Fecha Entrega</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Total</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredOrders.map((ord) => {
                  const statusInfo = ORDER_STATUSES[ord.status] || ORDER_STATUSES.recibido;
                  return (
                    <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-amber-500">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div 
                          onClick={() => setSelectedOrder(ord)}
                          className="font-bold text-slate-900 dark:text-white hover:text-amber-500 cursor-pointer"
                        >
                          {ord.title}
                        </div>
                        {ord.associatedQuoteNumber && (
                          <span className="text-[10px] text-slate-400">Cotiz: {ord.associatedQuoteNumber}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                        {ord.customerName}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {ord.techniqueName}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {ord.totalPieces} uds
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {ord.deliveryDate}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={ord.status}
                          onChange={(e) => handleQuickStatusChange(ord.id, e.target.value as OrderStatus)}
                          className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:ring-1 outline-hidden ${statusInfo.badgeClass}`}
                        >
                          {Object.values(ORDER_STATUSES).map(s => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white text-right">
                        {formatMoney(ord.totalAmount)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            title="Ver detalle"
                            className="p-1 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(ord.id)}
                            title="Duplicar"
                            className="p-1 rounded-md text-slate-400 hover:text-amber-500"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(ord)}
                            title="Editar"
                            className="p-1 rounded-md text-slate-400 hover:text-indigo-500"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setOrderToCancel(ord)}
                            title="Cancelar orden"
                            className="p-1 rounded-md text-slate-400 hover:text-rose-500"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL DETALLE DE LA ORDEN DE TRABAJO */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-black text-amber-500">
                    {selectedOrder.orderNumber}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${ORDER_STATUSES[selectedOrder.status]?.badgeClass}`}>
                    {ORDER_STATUSES[selectedOrder.status]?.label}
                  </span>
                  {selectedOrder.priority === 'urgente' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                      URGENTE
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {selectedOrder.title}
                </h2>
                <p className="text-xs text-slate-500">
                  Creado el {new Date(selectedOrder.createdAt).toLocaleDateString()} • Entrega pactada: {selectedOrder.deliveryDate}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ficha Cliente & Cotización */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <div>
                <span className="text-slate-400 block mb-0.5">Cliente Asociado:</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">{selectedOrder.customerName}</span>
                {selectedOrder.customerContact && (
                  <div className="text-slate-500 mt-0.5">Contacto: {selectedOrder.customerContact}</div>
                )}
                {selectedOrder.customerPhone && (
                  <div className="text-slate-500">Tel: {selectedOrder.customerPhone}</div>
                )}
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Cotización Asociada:</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {selectedOrder.associatedQuoteNumber || 'Sin cotización vinculada'}
                </span>
                <div className="text-slate-500 mt-0.5">Técnica: {selectedOrder.techniqueName}</div>
                <div className="text-slate-500">Total unidades: {selectedOrder.totalPieces} prendas</div>
              </div>
            </div>

            {/* Desglose de Prendas y Tallas */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <Shirt className="w-4 h-4 text-amber-500" />
                <span>Prendas y Desglose de Tallas Asociadas</span>
              </h4>
              <div className="space-y-2">
                {selectedOrder.garments.map((gline, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-700 shrink-0" 
                          style={{ backgroundColor: gline.colorHex }} 
                        />
                        <span className="font-bold text-slate-900 dark:text-white">{gline.garmentName}</span>
                        <span className="text-slate-400">({gline.colorName})</span>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {gline.totalUnits} unidades • {formatMoney(gline.subtotal)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {gline.sizes.map((s, sIdx) => (
                        <span key={sIdx} className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold">
                          Talla <strong>{s.size}</strong>: {s.quantity} uds
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Diseños Asociados */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-500" />
                <span>Diseños y Artes de Producción Asociados</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedOrder.designs.map((des, dIdx) => (
                  <div key={dIdx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-3 text-xs">
                    <img
                      src={des.previewUrl}
                      alt={des.name}
                      className="w-14 h-14 rounded-lg object-cover bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0"
                    />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{des.name}</div>
                      <div className="text-[11px] text-slate-500">Ubicación: {des.placement}</div>
                      <div className="text-[11px] text-slate-500">Medidas: {des.dimensionsCm}</div>
                      <div className="text-[10px] font-semibold text-amber-500 mt-0.5">{des.technique}</div>
                    </div>
                  </div>
                ))}
                {selectedOrder.designs.length === 0 && (
                  <div className="col-span-full p-4 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    No hay artes gráficos cargados aún. El pedido está en fase preliminar.
                  </div>
                )}
              </div>
            </div>

            {/* Notas de Producción */}
            {selectedOrder.productionNotes && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
                <span className="font-bold text-amber-700 dark:text-amber-400 block mb-1">
                  Instrucciones Técnicas de Taller:
                </span>
                <p className="text-slate-700 dark:text-slate-300">
                  {selectedOrder.productionNotes}
                </p>
              </div>
            )}

            {/* Si está cancelado */}
            {selectedOrder.status === 'cancelado' && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300">
                <span className="font-bold block mb-1">Orden Cancelada:</span>
                <p>Motivo: {selectedOrder.cancellationReason}</p>
                <p className="text-[11px] mt-1 text-rose-600 dark:text-rose-400">
                  Cancelado por: {selectedOrder.cancelledBy || 'Administrador'} el {new Date(selectedOrder.cancelledAt || '').toLocaleString()}
                </p>
              </div>
            )}

            {/* Resumen Financiero */}
            <div className="p-4 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block">Total de la Orden:</span>
                <span className="text-xl font-black">{formatMoney(selectedOrder.totalAmount)}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Abono Inicial:</span>
                <span className="font-bold text-emerald-400">{formatMoney(selectedOrder.depositPaid)}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Saldo Pendiente:</span>
                <span className="font-bold text-amber-400">{formatMoney(selectedOrder.balanceDue)}</span>
              </div>
            </div>

            {/* Botones de acción del Modal */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleDuplicate(selectedOrder.id);
                    setSelectedOrder(null);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Duplicar OT</span>
                </button>
                <button
                  onClick={() => {
                    setOrderToCancel(selectedOrder);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Cancelar con confirmación</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleOpenEdit(selectedOrder);
                    setSelectedOrder(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Editar Orden
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold text-xs"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREAR / EDITAR ORDEN */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveOrder}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isEditing ? `Editar Orden de Trabajo (${orderForm.orderNumber})` : 'Crear Nueva Orden de Trabajo'}
              </h3>
              <button
                type="button"
                onClick={() => setIsOrderModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Título o Nombre del Trabajo *
                  </label>
                  <input
                    type="text"
                    required
                    value={orderForm.title || ''}
                    onChange={e => setOrderForm({ ...orderForm, title: e.target.value })}
                    placeholder="ej: Polerones Oversize Tour Banda 2026"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Número de OT
                  </label>
                  <input
                    type="text"
                    value={orderForm.orderNumber || ''}
                    onChange={e => setOrderForm({ ...orderForm, orderNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              {/* Cliente y Cotización */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Asociar Cliente *
                  </label>
                  <select
                    value={orderForm.customerId || ''}
                    onChange={e => {
                      const cust = customers.find(c => c.id === e.target.value);
                      if (cust) {
                        setOrderForm({
                          ...orderForm,
                          customerId: cust.id,
                          customerName: cust.name,
                          customerContact: cust.contactPerson,
                          customerEmail: cust.email,
                          customerPhone: cust.phone
                        });
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  >
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Asociar Cotización (opcional)
                  </label>
                  <input
                    type="text"
                    value={orderForm.associatedQuoteNumber || ''}
                    onChange={e => setOrderForm({ ...orderForm, associatedQuoteNumber: e.target.value })}
                    placeholder="ej: COT-2026-004"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* Técnica, Estado y Prioridad */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Técnica Textil
                  </label>
                  <select
                    value={orderForm.techniqueName || 'DTF Textil'}
                    onChange={e => setOrderForm({ ...orderForm, techniqueName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="DTF Textil">DTF Textil</option>
                    <option value="DTG">DTG Directo a Prenda</option>
                    <option value="Sublimación">Sublimación</option>
                    <option value="Vinilo textil">Vinilo Textil</option>
                    <option value="Serigrafía">Serigrafía Plastisol</option>
                    <option value="Bordado">Bordado Industrial</option>
                    <option value="UV DTF">UV DTF</option>
                    <option value="Plastisol Puff">Puff en Relieve</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Estado Actual (8 Fases)
                  </label>
                  <select
                    value={orderForm.status || 'recibido'}
                    onChange={e => setOrderForm({ ...orderForm, status: e.target.value as OrderStatus })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-semibold"
                  >
                    {Object.values(ORDER_STATUSES).map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Prioridad
                  </label>
                  <select
                    value={orderForm.priority || 'normal'}
                    onChange={e => setOrderForm({ ...orderForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="normal">Normal</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente 🔥</option>
                  </select>
                </div>
              </div>

              {/* Cantidad, Monto y Fecha */}
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Total Prendas *
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={orderForm.totalPieces || 25}
                    onChange={e => setOrderForm({ ...orderForm, totalPieces: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Total a Cobrar ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={orderForm.totalAmount || 0}
                    onChange={e => {
                      const tot = Number(e.target.value);
                      const dep = orderForm.depositPaid || 0;
                      setOrderForm({ ...orderForm, totalAmount: tot, balanceDue: Math.max(0, tot - dep) });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Abono Pagado ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={orderForm.depositPaid || 0}
                    onChange={e => {
                      const dep = Number(e.target.value);
                      const tot = orderForm.totalAmount || 0;
                      setOrderForm({ ...orderForm, depositPaid: dep, balanceDue: Math.max(0, tot - dep) });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha de Entrega
                  </label>
                  <input
                    type="date"
                    value={orderForm.deliveryDate || ''}
                    onChange={e => setOrderForm({ ...orderForm, deliveryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notas de Producción y Parámetros Técnicos
                </label>
                <textarea
                  rows={2}
                  value={orderForm.productionNotes || ''}
                  onChange={e => setOrderForm({ ...orderForm, productionNotes: e.target.value })}
                  placeholder="Instrucciones para prensista, tiempos de secado, cuidado especial de tela..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsOrderModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm"
              >
                {isEditing ? 'Guardar Cambios' : 'Crear Orden'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL DE CANCELACIÓN CON CONFIRMACIÓN */}
      {orderToCancel && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="p-3 bg-rose-100 dark:bg-rose-950 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Cancelar Orden {orderToCancel.orderNumber}
                </h3>
                <p className="text-xs text-slate-500">
                  Esta acción registrará la cancelación con auditoría.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              ¿Estás seguro de que deseas cancelar el trabajo <strong>&quot;{orderToCancel.title}&quot;</strong> para el cliente <strong>{orderToCancel.customerName}</strong>?
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Motivo de cancelación (Requerido) *
              </label>
              <textarea
                rows={3}
                required
                value={cancellationReason}
                onChange={e => setCancellationReason(e.target.value)}
                placeholder="ej: Desistimiento por parte del cliente antes de impresión, cambio de presupuesto, etc."
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setOrderToCancel(null);
                  setCancellationReason('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm"
              >
                Confirmar Cancelación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
