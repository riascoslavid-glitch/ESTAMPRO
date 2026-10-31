import React, { useState, useEffect, useMemo } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  ArrowDownLeft, 
  ArrowUpRight, 
  AlertTriangle, 
  History, 
  Shirt, 
  Ruler, 
  Palette, 
  Droplet, 
  Layers, 
  Film, 
  FileText, 
  Sparkles, 
  Boxes, 
  Printer, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  X,
  Clock,
  Wrench,
  Check,
  TrendingDown
} from 'lucide-react';
import { adminProductionService } from '../../../services/admin/adminProductionService';
import { 
  InventoryItemRecord, 
  InventoryCategory, 
  INVENTORY_CATEGORIES, 
  InventoryMovementRecord, 
  InventoryMovementType 
} from '../../../types/adminProduction';
import { AdminHeaderNav } from './AdminHeaderNav';
import { useAuth } from '../../../context/AuthContext';

export const InventoryManagementView: React.FC = () => {
  const { currentUser } = useAuth();

  const [items, setItems] = useState<InventoryItemRecord[]>([]);
  const [movements, setMovements] = useState<InventoryMovementRecord[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  // Modales
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isMovementsHistoryOpen, setIsMovementsHistoryOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Formulario de Movimiento (Entrada / Salida)
  const [movementForm, setMovementForm] = useState<{
    itemId: string;
    type: InventoryMovementType;
    quantity: number;
    reason: InventoryMovementRecord['reason'];
    orderRefNumber: string;
    operatorName: string;
    notes: string;
  }>({
    itemId: '',
    type: 'entrada',
    quantity: 10,
    reason: 'compra',
    orderRefNumber: '',
    operatorName: 'Encargado de Bodega',
    notes: ''
  });

  // Formulario de Ítem de Inventario
  const [itemForm, setItemForm] = useState<Partial<InventoryItemRecord>>({
    name: '',
    category: 'prendas',
    sku: '',
    currentStock: 50,
    minStockAlert: 15,
    unit: 'unidades',
    unitCost: 5000,
    supplier: '',
    storageLocation: 'Estante A-1',
    notes: '',
    machineStatus: 'operativa'
  });

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    adminProductionService.setOwnerId(currentUser?.uid);
    setItems(adminProductionService.getInventory());
    setMovements(adminProductionService.getMovements());
  }, [currentUser]);

  const metrics = useMemo(() => {
    return adminProductionService.getWorkshopMetricsReport();
  }, [items]);

  // Filtrado de ítems
  const filteredItems = useMemo(() => {
    return items.filter(i => {
      const matchesSearch = 
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (i.brand && i.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (i.storageLocation && i.storageLocation.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === 'todos' || i.category === selectedCategory;
      const matchesLow = onlyLowStock ? i.currentStock <= i.minStockAlert : true;

      return matchesSearch && matchesCat && matchesLow;
    });
  }, [items, searchQuery, selectedCategory, onlyLowStock]);

  const categoryIcons: Record<InventoryCategory, React.ComponentType<{ className?: string }>> = {
    prendas: Shirt,
    tallas: Ruler,
    colores: Palette,
    tintas: Droplet,
    vinilos: Layers,
    peliculas: Film,
    papeles: FileText,
    hilos: Sparkles,
    consumibles: Boxes,
    maquinas: Printer
  };

  // Abrir Modal de Movimiento
  const handleOpenMovementModal = (targetItem?: InventoryItemRecord, type: InventoryMovementType = 'entrada') => {
    const item = targetItem || items[0];
    setMovementForm({
      itemId: item ? item.id : '',
      type,
      quantity: 1,
      reason: type === 'entrada' ? 'compra' : 'consumo_orden',
      orderRefNumber: '',
      operatorName: currentUser?.displayName || 'Operador de Turno',
      notes: ''
    });
    setIsMovementModalOpen(true);
  };

  // Guardar Movimiento (Entrada o Salida)
  const handleSaveMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movementForm.itemId || movementForm.quantity <= 0) {
      alert('Por favor selecciona un ítem y una cantidad válida mayor a 0');
      return;
    }

    try {
      const result = await adminProductionService.registerStockMovement({
        itemId: movementForm.itemId,
        type: movementForm.type,
        quantity: Number(movementForm.quantity),
        reason: movementForm.reason,
        orderRefNumber: movementForm.orderRefNumber || undefined,
        operatorName: movementForm.operatorName,
        notes: movementForm.notes
      });

      setItems(adminProductionService.getInventory());
      setMovements(adminProductionService.getMovements());
      setIsMovementModalOpen(false);

      const isCritical = result.updatedItem.currentStock <= result.updatedItem.minStockAlert;
      setFeedbackMessage(
        `${movementForm.type === 'entrada' ? 'Entrada' : 'Salida'} de ${movementForm.quantity} ${result.updatedItem.unit} registrada. Nuevo stock: ${result.updatedItem.currentStock} ${result.updatedItem.unit}${isCritical ? ' ⚠️ (BAJO EL MÍNIMO)' : ''}`
      );
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Error al registrar movimiento');
    }
  };

  // Abrir Creación de Ítem
  const handleOpenCreateItem = () => {
    setIsEditing(false);
    setItemForm({
      id: `inv-${Date.now()}`,
      name: '',
      category: 'prendas',
      sku: `SKU-${Date.now().toString().slice(-6)}`,
      currentStock: 50,
      minStockAlert: 15,
      unit: 'unidades',
      unitCost: 4500,
      supplier: '',
      storageLocation: 'Estante A-1',
      notes: '',
      machineStatus: 'operativa'
    });
    setIsItemModalOpen(true);
  };

  // Abrir Edición de Ítem
  const handleOpenEditItem = (item: InventoryItemRecord) => {
    setIsEditing(true);
    setItemForm({ ...item });
    setIsItemModalOpen(true);
  };

  // Guardar Ítem
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.name || !itemForm.sku) {
      alert('Por favor ingresa nombre y SKU para el ítem');
      return;
    }

    const payload: InventoryItemRecord = {
      id: itemForm.id || `inv-${Date.now()}`,
      ownerId: currentUser?.uid || 'default',
      sku: itemForm.sku!,
      name: itemForm.name!,
      category: (itemForm.category as InventoryCategory) || 'prendas',
      subcategory: itemForm.subcategory,
      brand: itemForm.brand,
      size: itemForm.size,
      colorName: itemForm.colorName,
      colorHex: itemForm.colorHex,
      currentStock: Number(itemForm.currentStock) || 0,
      minStockAlert: Number(itemForm.minStockAlert) || 0,
      unit: itemForm.unit || 'unidades',
      unitCost: Number(itemForm.unitCost) || 0,
      supplier: itemForm.supplier,
      storageLocation: itemForm.storageLocation,
      notes: itemForm.notes,
      machineModel: itemForm.machineModel,
      machineStatus: itemForm.machineStatus,
      lastMaintenanceDate: itemForm.lastMaintenanceDate,
      nextMaintenanceDate: itemForm.nextMaintenanceDate,
      createdAt: itemForm.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await adminProductionService.saveInventoryItem(payload);
    setItems(adminProductionService.getInventory());
    setIsItemModalOpen(false);
    setFeedbackMessage(isEditing ? 'Ítem actualizado exitosamente' : 'Ítem registrado en inventario');
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  // Eliminar Ítem
  const handleDeleteItem = async (id: string) => {
    if (window.confirm('¿Deseas eliminar este ítem del inventario?')) {
      await adminProductionService.deleteInventoryItem(id);
      setItems(adminProductionService.getInventory());
    }
  };

  // Alternar estado de máquina rápido
  const handleToggleMachineStatus = async (item: InventoryItemRecord) => {
    const nextStatus = item.machineStatus === 'operativa' 
      ? 'en_mantenimiento' 
      : item.machineStatus === 'en_mantenimiento' 
      ? 'detenida' 
      : 'operativa';

    const updated = { ...item, machineStatus: nextStatus as any, updatedAt: new Date().toISOString() };
    await adminProductionService.saveInventoryItem(updated);
    setItems(adminProductionService.getInventory());
  };

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Navegador Común */}
      <AdminHeaderNav 
        currentTab="inventario" 
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

      {/* Banner de Existencias Mínimas (Alertas Activas) */}
      {metrics.materialsNeedingReplenishmentCount > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-800 dark:text-rose-300">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-300 shrink-0">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-sm">
                Alerta de Existencias Mínimas: {metrics.materialsNeedingReplenishmentCount} insumos críticos
              </h4>
              <p className="text-xs text-rose-600 dark:text-rose-400">
                Hay materiales con stock igual o inferior al umbral configurado de seguridad para producción.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setOnlyLowStock(!onlyLowStock)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                onlyLowStock
                  ? 'bg-rose-600 text-white'
                  : 'bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
              }`}
            >
              {onlyLowStock ? 'Mostrar Todos los Ítems' : 'Filtrar Solo Críticos'}
            </button>
            <button
              onClick={() => handleOpenMovementModal(metrics.lowStockItems[0], 'entrada')}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-xs"
            >
              Registrar Compra/Entrada
            </button>
          </div>
        </div>
      )}

      {/* Header del Módulo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Control de Inventario Textil y Maquinaria
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                10 categorías técnicas: Prendas, Tallas, Colores, Tintas, Vinilos, Películas, Papeles, Hilos, Consumibles y Máquinas
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsMovementsHistoryOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
          >
            <History className="w-4 h-4" />
            <span>Kardex / Movimientos ({movements.length})</span>
          </button>

          <button
            onClick={() => handleOpenMovementModal(undefined, 'entrada')}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Entrada</span>
          </button>

          <button
            onClick={() => handleOpenMovementModal(undefined, 'salida')}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Salida</span>
          </button>

          <button
            onClick={handleOpenCreateItem}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Ítem</span>
          </button>
        </div>
      </div>

      {/* Selector de las 10 Categorías Solicitadas */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('todos')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'todos'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Todas ({items.length})
          </button>

          {(Object.keys(INVENTORY_CATEGORIES) as InventoryCategory[]).map(catKey => {
            const catInfo = INVENTORY_CATEGORIES[catKey];
            const Icon = categoryIcons[catKey] || Package;
            const count = items.filter(i => i.category === catKey).length;
            const hasAlert = items.some(i => i.category === catKey && i.currentStock <= i.minStockAlert);

            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === catKey
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{catInfo.label}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                  hasAlert 
                    ? 'bg-rose-500 text-white' 
                    : selectedCategory === catKey 
                    ? 'bg-amber-600 text-slate-950' 
                    : 'bg-slate-200 dark:bg-slate-800'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Barra de Búsqueda y Filtro de Alerta */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar insumo por nombre, código SKU, marca o ubicación en estante..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyLowStock}
              onChange={(e) => setOnlyLowStock(e.target.checked)}
              className="rounded-sm text-amber-500 focus:ring-amber-500 w-4 h-4"
            />
            <span>Solo existencias bajo el mínimo</span>
          </label>
        </div>
      </div>

      {/* Grid de Ítems de Inventario */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isLowStock = item.currentStock <= item.minStockAlert;
          const CategoryIcon = categoryIcons[item.category] || Package;
          const catInfo = INVENTORY_CATEGORIES[item.category];

          return (
            <div
              key={item.id}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 shadow-xs flex flex-col justify-between transition-all ${
                isLowStock
                  ? 'border-rose-300 dark:border-rose-900/80 bg-rose-50/20 dark:bg-rose-950/10'
                  : 'border-slate-200 dark:border-slate-800 hover:border-amber-500/50'
              }`}
            >
              <div>
                {/* Cabecera de la Tarjeta */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <CategoryIcon className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {catInfo.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {isLowStock && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>STOCK CRÍTICO</span>
                      </span>
                    )}
                    <button
                      onClick={() => handleOpenEditItem(item)}
                      title="Editar ítem"
                      className="p-1 rounded-md text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      title="Eliminar ítem"
                      className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="font-mono text-xs font-bold text-amber-500 mb-0.5">
                  {item.sku}
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2 line-clamp-2">
                  {item.name}
                </h3>

                {/* Si es máquina, mostrar estado operativo y mantenimiento */}
                {item.category === 'maquinas' ? (
                  <div className="space-y-1.5 text-xs bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Estado Máquina:</span>
                      <button
                        onClick={() => handleToggleMachineStatus(item)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                          item.machineStatus === 'operativa'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300'
                            : item.machineStatus === 'en_mantenimiento'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300'
                        }`}
                      >
                        {item.machineStatus === 'operativa' ? '✓ Operativa' :
                         item.machineStatus === 'en_mantenimiento' ? '⚙️ Mantenimiento' : '⛔ Detenida'}
                      </button>
                    </div>
                    {item.lastMaintenanceDate && (
                      <div className="text-[11px] text-slate-500">
                        Último mant.: {item.lastMaintenanceDate}
                      </div>
                    )}
                    {item.storageLocation && (
                      <div className="text-[11px] text-slate-500">
                        Ubicación: {item.storageLocation}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Atributos de insumo o prenda */
                  <div className="space-y-1 text-xs text-slate-500 mb-3">
                    {item.colorName && (
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full border" style={{ backgroundColor: item.colorHex || '#ccc' }} />
                        <span>Color: <strong>{item.colorName}</strong></span>
                      </div>
                    )}
                    {item.size && (
                      <div>Talla: <strong>{item.size}</strong></div>
                    )}
                    {item.storageLocation && (
                      <div>Ubicación: <strong>{item.storageLocation}</strong></div>
                    )}
                    {item.supplier && (
                      <div className="truncate">Proveedor: {item.supplier}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Pie de tarjeta con Stock y botones de Entrada/Salida rápida */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400">Stock Actual / Mínimo</div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-base font-black ${isLowStock ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                      {item.currentStock}
                    </span>
                    <span className="text-xs text-slate-500">
                      {item.unit} (mín: {item.minStockAlert})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenMovementModal(item, 'entrada')}
                    title="Registrar Entrada (+) a stock"
                    className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
                  >
                    <ArrowDownLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenMovementModal(item, 'salida')}
                    title="Registrar Salida (-) de stock"
                    className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900 transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
              No se encontraron insumos o prendas
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {onlyLowStock 
                ? '¡Buenas noticias! No hay materiales bajo el umbral mínimo de stock.'
                : 'Prueba cambiando los filtros o registra un nuevo ítem en inventario.'}
            </p>
            <button
              onClick={handleOpenCreateItem}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar primer insumo</span>
            </button>
          </div>
        )}
      </div>

      {/* MODAL REGISTRAR ENTRADA / SALIDA */}
      {isMovementModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveMovement}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className={`p-2 rounded-xl ${
                  movementForm.type === 'entrada'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  {movementForm.type === 'entrada' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Registrar {movementForm.type === 'entrada' ? 'Entrada de Stock' : 'Salida de Stock'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsMovementModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Selector de Tipo */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tipo de Movimiento *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMovementForm({ ...movementForm, type: 'entrada', reason: 'compra' })}
                    className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors ${
                      movementForm.type === 'entrada'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <ArrowDownLeft className="w-4 h-4" />
                    <span>Entrada (+)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMovementForm({ ...movementForm, type: 'salida', reason: 'consumo_orden' })}
                    className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors ${
                      movementForm.type === 'salida'
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Salida (-)</span>
                  </button>
                </div>
              </div>

              {/* Selector de Ítem */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Material o Prenda *
                </label>
                <select
                  required
                  value={movementForm.itemId}
                  onChange={e => setMovementForm({ ...movementForm, itemId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                >
                  {items.map(i => (
                    <option key={i.id} value={i.id}>
                      [{i.category.toUpperCase()}] {i.name} (Stock: {i.currentStock} {i.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Cantidad a {movementForm.type === 'entrada' ? 'Ingresar' : 'Retirar'} *
                  </label>
                  <input
                    type="number"
                    step="any"
                    min={0.1}
                    required
                    value={movementForm.quantity}
                    onChange={e => setMovementForm({ ...movementForm, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Motivo *
                  </label>
                  <select
                    value={movementForm.reason}
                    onChange={e => setMovementForm({ ...movementForm, reason: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="compra">Compra a Proveedor</option>
                    <option value="consumo_orden">Consumo por Orden de Trabajo (OT)</option>
                    <option value="ajuste_inventario">Ajuste de Conteo Físico</option>
                    <option value="merma_taller">Merma de Impresión / Error de Estampado</option>
                    <option value="devolucion">Devolución de Cliente</option>
                    <option value="mantenimiento">Repuesto para Mantenimiento</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    OT Asociada (opcional)
                  </label>
                  <input
                    type="text"
                    value={movementForm.orderRefNumber}
                    onChange={e => setMovementForm({ ...movementForm, orderRefNumber: e.target.value })}
                    placeholder="ej: OT-2026-014"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Operador Responsable
                  </label>
                  <input
                    type="text"
                    value={movementForm.operatorName}
                    onChange={e => setMovementForm({ ...movementForm, operatorName: e.target.value })}
                    placeholder="ej: Rodrigo Maestro"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notas / Observación
                </label>
                <textarea
                  rows={2}
                  value={movementForm.notes}
                  onChange={e => setMovementForm({ ...movementForm, notes: e.target.value })}
                  placeholder="Número de factura, detalle de la merma o remanente..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsMovementModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`px-5 py-2 rounded-xl font-bold text-xs shadow-xs text-white ${
                  movementForm.type === 'entrada'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                Confirmar {movementForm.type === 'entrada' ? 'Entrada' : 'Salida'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL CREAR / EDITAR ÍTEM DE INVENTARIO */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveItem}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isEditing ? 'Editar Ítem de Inventario' : 'Registrar Nuevo Ítem en Inventario'}
              </h3>
              <button
                type="button"
                onClick={() => setIsItemModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Categoría (10 Técnicas) *
                  </label>
                  <select
                    value={itemForm.category || 'prendas'}
                    onChange={e => {
                      const cat = e.target.value as InventoryCategory;
                      setItemForm({
                        ...itemForm,
                        category: cat,
                        unit: INVENTORY_CATEGORIES[cat].defaultUnit
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  >
                    {(Object.keys(INVENTORY_CATEGORIES) as InventoryCategory[]).map(catKey => (
                      <option key={catKey} value={catKey}>
                        {INVENTORY_CATEGORIES[catKey].label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Código SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={itemForm.sku || ''}
                    onChange={e => setItemForm({ ...itemForm, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre del Ítem / Insumo *
                </label>
                <input
                  type="text"
                  required
                  value={itemForm.name || ''}
                  onChange={e => setItemForm({ ...itemForm, name: e.target.value })}
                  placeholder="ej: Tinta Plastisol Blanco Super Flash 1kg"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Stock Actual *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={itemForm.currentStock ?? 0}
                    onChange={e => setItemForm({ ...itemForm, currentStock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Alerta de Stock Mínimo *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={itemForm.minStockAlert ?? 10}
                    onChange={e => setItemForm({ ...itemForm, minStockAlert: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-rose-600 dark:text-rose-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Unidad de Medida
                  </label>
                  <input
                    type="text"
                    value={itemForm.unit || 'unidades'}
                    onChange={e => setItemForm({ ...itemForm, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Costo Unitario ($)
                  </label>
                  <input
                    type="number"
                    value={itemForm.unitCost ?? 0}
                    onChange={e => setItemForm({ ...itemForm, unitCost: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ubicación en Bodega
                  </label>
                  <input
                    type="text"
                    value={itemForm.storageLocation || ''}
                    onChange={e => setItemForm({ ...itemForm, storageLocation: e.target.value })}
                    placeholder="ej: Estante B-2, Gaveta 4"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Si es máquina */}
              {itemForm.category === 'maquinas' && (
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    Datos Técnicos de Maquinaria
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Estado de Máquina</label>
                      <select
                        value={itemForm.machineStatus || 'operativa'}
                        onChange={e => setItemForm({ ...itemForm, machineStatus: e.target.value as any })}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                      >
                        <option value="operativa">Operativa</option>
                        <option value="en_mantenimiento">En Mantenimiento</option>
                        <option value="detenida">Detenida / Avería</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Próximo Mantenimiento</label>
                      <input
                        type="date"
                        value={itemForm.nextMaintenanceDate || ''}
                        onChange={e => setItemForm({ ...itemForm, nextMaintenanceDate: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsItemModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs"
              >
                {isEditing ? 'Guardar Cambios' : 'Registrar Ítem'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DRAWER / MODAL HISTORIAL DE MOVIMIENTOS (KARDEX) */}
      {isMovementsHistoryOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Historial de Movimientos de Inventario (Kardex)
                </h3>
              </div>
              <button
                onClick={() => setIsMovementsHistoryOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[500px] overflow-y-auto">
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
                        Motivo: <strong>{m.reason.replace('_', ' ')}</strong> 
                        {m.orderRefNumber && <span> • Orden: <strong className="text-amber-500">{m.orderRefNumber}</strong></span>}
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

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsMovementsHistoryOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-bold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
