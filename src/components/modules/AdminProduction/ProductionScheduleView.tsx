import React, { useState, useEffect, useMemo } from 'react';
import { 
  Workflow, 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  UserCheck, 
  Printer, 
  Layers, 
  Boxes, 
  CheckCircle2, 
  PauseCircle, 
  Play, 
  AlertCircle, 
  X, 
  Check, 
  Timer,
  ChevronRight,
  TrendingUp,
  Sliders
} from 'lucide-react';
import { adminProductionService } from '../../../services/admin/adminProductionService';
import { 
  ProductionTaskRecord, 
  ProductionTaskStatus, 
  OrderRecord, 
  InventoryItemRecord 
} from '../../../types/adminProduction';
import { AdminHeaderNav } from './AdminHeaderNav';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';

export const ProductionScheduleView: React.FC = () => {
  const { currentUser } = useAuth();
  const { setActiveModuleId } = useApp();

  const [tasks, setTasks] = useState<ProductionTaskRecord[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [inventory, setInventory] = useState<InventoryItemRecord[]>([]);
  
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Modales
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTaskForProgress, setSelectedTaskForProgress] = useState<ProductionTaskRecord | null>(null);
  const [additionalPieces, setAdditionalPieces] = useState<number>(10);

  // Formulario Asignación de Producción
  const [taskForm, setTaskForm] = useState<Partial<ProductionTaskRecord>>({
    orderId: '',
    orderNumber: '',
    customerName: '',
    operatorName: 'Rodrigo Alarcón (Maestro Prensa)',
    machineId: '',
    machineName: 'Impresora DTF Industrial 60cm',
    technique: 'DTF Textil',
    scheduledDate: new Date().toISOString().split('T')[0],
    estimatedMinutes: 180,
    actualMinutes: 0,
    status: 'programado',
    totalPieces: 50,
    completedPieces: 0,
    notes: '',
    materials: [
      { materialName: 'Film DTF 60cm', quantity: '25 metros', isDeducted: true },
      { materialName: 'Poliamida DTF Poliuretano', quantity: '1.2 kg', isDeducted: true },
      { materialName: 'Tinta DTF Blanca DMax', quantity: '800 ml', isDeducted: true }
    ]
  });

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    adminProductionService.setOwnerId(currentUser?.uid);
    setTasks(adminProductionService.getProductionTasks());
    setOrders(adminProductionService.getOrders());
    setInventory(adminProductionService.getInventory());
  }, [currentUser]);

  const metrics = useMemo(() => {
    return adminProductionService.getWorkshopMetricsReport();
  }, [tasks]);

  const machines = useMemo(() => {
    return inventory.filter(i => i.category === 'maquinas');
  }, [inventory]);

  // Filtrado
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchesSearch = 
        t.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.operatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.machineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.technique.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'todos' || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchQuery, statusFilter]);

  // Abrir Modal de Asignación
  const handleOpenAssignModal = () => {
    const firstActiveOrder = orders.find(o => o.status !== 'entregado' && o.status !== 'cancelado') || orders[0];
    const firstMachine = machines[0] || { id: 'm-01', name: 'Prensa Térmica Principal' };

    setTaskForm({
      id: `task-${Date.now()}`,
      orderId: firstActiveOrder ? firstActiveOrder.id : 'ord-01',
      orderNumber: firstActiveOrder ? firstActiveOrder.orderNumber : 'OT-2026-014',
      customerName: firstActiveOrder ? firstActiveOrder.customerName : 'Cliente General',
      operatorName: currentUser?.displayName || 'Rodrigo Alarcón (Maestro DTF)',
      machineId: firstMachine.id,
      machineName: firstMachine.name,
      technique: firstActiveOrder ? firstActiveOrder.techniqueName : 'DTF Textil',
      scheduledDate: new Date().toISOString().split('T')[0],
      estimatedMinutes: 180,
      actualMinutes: 0,
      status: 'programado',
      totalPieces: firstActiveOrder ? firstActiveOrder.totalPieces : 50,
      completedPieces: 0,
      notes: 'Verificar temperatura a 155°C y calibración de presión.',
      materials: [
        { materialName: 'Insumo Base', quantity: '1 unidad', isDeducted: true }
      ]
    });
    setIsTaskModalOpen(true);
  };

  // Guardar Asignación
  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.operatorName || !taskForm.machineName || !taskForm.technique) {
      alert('Por favor completa operador, máquina y técnica asignada.');
      return;
    }

    const payload: ProductionTaskRecord = {
      id: taskForm.id || `task-${Date.now()}`,
      ownerId: currentUser?.uid || 'default',
      orderId: taskForm.orderId || 'ord-general',
      orderNumber: taskForm.orderNumber || 'OT-2026-000',
      customerName: taskForm.customerName || 'Cliente',
      operatorName: taskForm.operatorName!,
      operatorUid: currentUser?.uid,
      machineId: taskForm.machineId || 'maq-general',
      machineName: taskForm.machineName!,
      technique: taskForm.technique!,
      scheduledDate: taskForm.scheduledDate || new Date().toISOString().split('T')[0],
      estimatedMinutes: Number(taskForm.estimatedMinutes) || 120,
      actualMinutes: Number(taskForm.actualMinutes) || 0,
      materials: taskForm.materials || [],
      status: (taskForm.status as ProductionTaskStatus) || 'programado',
      totalPieces: Number(taskForm.totalPieces) || 1,
      completedPieces: Number(taskForm.completedPieces) || 0,
      notes: taskForm.notes,
      createdAt: taskForm.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await adminProductionService.saveProductionTask(payload);
    setTasks(adminProductionService.getProductionTasks());
    setIsTaskModalOpen(false);
    setFeedbackMessage(`Tarea de producción asignada para ${payload.orderNumber}`);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  // Registrar Avance de Piezas
  const handleRegisterProgress = async () => {
    if (!selectedTaskForProgress) return;
    const newCompleted = Math.min(
      selectedTaskForProgress.totalPieces,
      selectedTaskForProgress.completedPieces + Number(additionalPieces)
    );

    const isDone = newCompleted >= selectedTaskForProgress.totalPieces;
    const nextStatus: ProductionTaskStatus = isDone ? 'control_calidad' : 'en_proceso';

    await adminProductionService.updateTaskProgress(
      selectedTaskForProgress.id,
      newCompleted,
      nextStatus
    );

    setTasks(adminProductionService.getProductionTasks());
    setSelectedTaskForProgress(null);
    setFeedbackMessage(
      `Avance registrado: ${newCompleted} de ${selectedTaskForProgress.totalPieces} piezas completadas${isDone ? ' ➜ Pasado a Control de Calidad' : ''}`
    );
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  // Cambiar estado rápido de tarea
  const handleQuickStatus = async (taskId: string, newStatus: ProductionTaskStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    await adminProductionService.saveProductionTask({
      ...task,
      status: newStatus,
      updatedAt: new Date().toISOString()
    });
    setTasks(adminProductionService.getProductionTasks());
  };

  const getStatusBadge = (status: ProductionTaskStatus) => {
    switch (status) {
      case 'programado':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300';
      case 'en_proceso':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 animate-pulse';
      case 'pausado':
        return 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300';
      case 'control_calidad':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-300';
      case 'completado':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Navegador Común */}
      <AdminHeaderNav 
        currentTab="produccion" 
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

      {/* Header del Módulo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Workflow className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Planificación y Asignación de Producción
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Asignación de Operador, Máquina, Técnica, Fecha, Tiempo Estimado y Materiales por cada Orden
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenAssignModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Asignar Nueva Tarea de Taller</span>
        </button>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por OT, operador asignado, máquina o técnica..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
          {(['todos', 'programado', 'en_proceso', 'pausado', 'control_calidad', 'completado'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {st === 'todos' ? 'Todas' :
               st === 'programado' ? 'Programadas' :
               st === 'en_proceso' ? 'En Proceso' :
               st === 'pausado' ? 'Pausadas' :
               st === 'control_calidad' ? 'Control Calidad' : 'Completadas'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Estaciones de Producción */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTasks.map((task) => {
          const percent = Math.min(100, Math.round((task.completedPieces / Math.max(1, task.totalPieces)) * 100));

          return (
            <div
              key={task.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-amber-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Cabecera de la tarea */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-500">
                      {task.orderNumber}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {task.customerName}
                    </h3>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(task.status)}`}>
                    {task.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                {/* Parámetros requeridos por especificación Prompt 14 */}
                <div className="space-y-2 text-xs bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800 mb-3">
                  {/* Operador */}
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400">Operador:</span>
                    <strong className="text-slate-900 dark:text-slate-100 truncate">{task.operatorName}</strong>
                  </div>

                  {/* Máquina */}
                  <div className="flex items-center gap-2">
                    <Printer className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400">Máquina:</span>
                    <strong className="text-slate-900 dark:text-slate-100 truncate">{task.machineName}</strong>
                  </div>

                  {/* Técnica */}
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400">Técnica:</span>
                    <strong className="text-slate-900 dark:text-slate-100">{task.technique}</strong>
                  </div>

                  {/* Fecha Programada */}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400">Fecha:</span>
                    <strong className="text-slate-900 dark:text-slate-100">{task.scheduledDate}</strong>
                  </div>

                  {/* Tiempo Estimado */}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400">Tiempo Estimado:</span>
                    <strong className="text-slate-900 dark:text-slate-100">
                      {task.estimatedMinutes} min ({Math.round(task.estimatedMinutes / 60 * 10) / 10}h)
                    </strong>
                  </div>
                </div>

                {/* Materiales Asignados */}
                <div className="mb-3">
                  <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                    <Boxes className="w-3 h-3 text-amber-500" />
                    <span>Materiales Asignados:</span>
                  </div>
                  <div className="space-y-1">
                    {task.materials.map((m, mIdx) => (
                      <div key={mIdx} className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
                        <span>• {m.materialName}</span>
                        <span className="font-semibold">{m.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Barra de Progreso de Piezas */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500">Progreso de Estampado:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {task.completedPieces} / {task.totalPieces} prendas ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full transition-all rounded-full ${
                        percent === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Botones de Acción Operativa */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  {task.status === 'programado' && (
                    <button
                      onClick={() => handleQuickStatus(task.id, 'en_proceso')}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Iniciar</span>
                    </button>
                  )}

                  {task.status === 'en_proceso' && (
                    <button
                      onClick={() => handleQuickStatus(task.id, 'pausado')}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1"
                    >
                      <PauseCircle className="w-3.5 h-3.5" />
                      <span>Pausar</span>
                    </button>
                  )}

                  {task.status === 'pausado' && (
                    <button
                      onClick={() => handleQuickStatus(task.id, 'en_proceso')}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Reanudar</span>
                    </button>
                  )}

                  {task.status === 'control_calidad' && (
                    <button
                      onClick={() => handleQuickStatus(task.id, 'completado')}
                      className="px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Aprobar CC</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSelectedTaskForProgress(task);
                    setAdditionalPieces(Math.min(10, task.totalPieces - task.completedPieces));
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Registrar Avance
                </button>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <Workflow className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
              No hay tareas de producción en esta vista
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Asigna operadores, máquinas y materiales a las órdenes de trabajo activas.
            </p>
            <button
              onClick={handleOpenAssignModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Asignar primera tarea</span>
            </button>
          </div>
        )}
      </div>

      {/* MODAL REGISTRAR AVANCE DE PIEZAS */}
      {selectedTaskForProgress && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Registrar Avance de Producción
              </h3>
              <button
                onClick={() => setSelectedTaskForProgress(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block">Orden de Trabajo:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedTaskForProgress.orderNumber} — {selectedTaskForProgress.customerName}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block">Prendas Actuales:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {selectedTaskForProgress.completedPieces} de {selectedTaskForProgress.totalPieces} prendas listas
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ¿Cuántas prendas estampadas sumas en esta tirada?
                </label>
                <input
                  type="number"
                  min={1}
                  max={selectedTaskForProgress.totalPieces - selectedTaskForProgress.completedPieces}
                  value={additionalPieces}
                  onChange={e => setAdditionalPieces(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold text-sm"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-300">
                Al llegar al 100% de la orden, la tarea pasará automáticamente a la fase de <strong>Control de Calidad</strong>.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedTaskForProgress(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleRegisterProgress}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs"
              >
                Confirmar Avance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ASIGNAR NUEVA TAREA */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveTask}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Asignación de Tarea de Producción
              </h3>
              <button
                type="button"
                onClick={() => setIsTaskModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Seleccionar Orden */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Orden de Trabajo (OT) *
                </label>
                <select
                  value={taskForm.orderId}
                  onChange={e => {
                    const ord = orders.find(o => o.id === e.target.value);
                    if (ord) {
                      setTaskForm({
                        ...taskForm,
                        orderId: ord.id,
                        orderNumber: ord.orderNumber,
                        customerName: ord.customerName,
                        technique: ord.techniqueName,
                        totalPieces: ord.totalPieces
                      });
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                >
                  {orders.map(o => (
                    <option key={o.id} value={o.id}>
                      {o.orderNumber} — {o.title} ({o.totalPieces} prendas)
                    </option>
                  ))}
                </select>
              </div>

              {/* Operador y Máquina */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Operador Asignado *
                  </label>
                  <input
                    type="text"
                    required
                    value={taskForm.operatorName || ''}
                    onChange={e => setTaskForm({ ...taskForm, operatorName: e.target.value })}
                    placeholder="ej: Rodrigo Alarcón"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Máquina Asignada *
                  </label>
                  <select
                    value={taskForm.machineId}
                    onChange={e => {
                      const m = machines.find(mac => mac.id === e.target.value);
                      if (m) {
                        setTaskForm({ ...taskForm, machineId: m.id, machineName: m.name });
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  >
                    {machines.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.machineStatus})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Técnica y Fecha */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Técnica Textil *
                  </label>
                  <input
                    type="text"
                    required
                    value={taskForm.technique || ''}
                    onChange={e => setTaskForm({ ...taskForm, technique: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha Programada *
                  </label>
                  <input
                    type="date"
                    required
                    value={taskForm.scheduledDate || ''}
                    onChange={e => setTaskForm({ ...taskForm, scheduledDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tiempo Estimado (min) *
                  </label>
                  <input
                    type="number"
                    min={15}
                    step={15}
                    value={taskForm.estimatedMinutes || 120}
                    onChange={e => setTaskForm({ ...taskForm, estimatedMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              {/* Estado y Piezas */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Estado Inicial
                  </label>
                  <select
                    value={taskForm.status || 'programado'}
                    onChange={e => setTaskForm({ ...taskForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="programado">Programado</option>
                    <option value="en_proceso">En Proceso</option>
                    <option value="pausado">Pausado</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Total Piezas a Estampar
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={taskForm.totalPieces || 25}
                    onChange={e => setTaskForm({ ...taskForm, totalPieces: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notas de Calibración / Instrucciones
                </label>
                <textarea
                  rows={2}
                  value={taskForm.notes || ''}
                  onChange={e => setTaskForm({ ...taskForm, notes: e.target.value })}
                  placeholder="Detalles de mallas, temperatura de curado, presión en bar..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsTaskModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs"
              >
                Guardar Asignación
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
