import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  FileText, 
  ShoppingBag, 
  DollarSign, 
  Calendar, 
  Edit3, 
  Trash2, 
  Eye, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  X,
  CheckCircle2
} from 'lucide-react';
import { adminProductionService } from '../../../services/admin/adminProductionService';
import { CustomerRecord, OrderRecord } from '../../../types/adminProduction';
import { AdminHeaderNav } from './AdminHeaderNav';
import { useApp } from '../../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';

export const CustomersManagementView: React.FC = () => {
  const { setActiveModuleId } = useApp();
  const { currentUser } = useAuth();

  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');
  
  // Modales
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [customerForm, setCustomerForm] = useState<Partial<CustomerRecord>>({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    taxId: '',
    category: 'marca_ropa',
    observations: ''
  });

  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);

  // Carga inicial
  useEffect(() => {
    adminProductionService.setOwnerId(currentUser?.uid);
    setCustomers(adminProductionService.getCustomers());
    setOrders(adminProductionService.getOrders());
  }, [currentUser]);

  // Filtrado
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchesSearch = 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.city && c.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.taxId && c.taxId.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = categoryFilter === 'todos' || c.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [customers, searchQuery, categoryFilter]);

  const metrics = useMemo(() => {
    return adminProductionService.getWorkshopMetricsReport();
  }, [customers, orders]);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setCustomerForm({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      taxId: '',
      category: 'marca_ropa',
      observations: ''
    });
    setIsCustomerModalOpen(true);
  };

  const handleOpenEdit = (customer: CustomerRecord) => {
    setIsEditing(true);
    setCustomerForm(customer);
    setIsCustomerModalOpen(true);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerForm.name || !customerForm.email) {
      alert('Por favor completa al menos el nombre y el correo electrónico del cliente.');
      return;
    }

    const payload: CustomerRecord = {
      id: customerForm.id || `cust-${Date.now()}`,
      ownerId: currentUser?.uid || 'default',
      name: customerForm.name!,
      contactPerson: customerForm.contactPerson || customerForm.name!,
      phone: customerForm.phone || '',
      email: customerForm.email!,
      address: customerForm.address || '',
      city: customerForm.city || '',
      taxId: customerForm.taxId || '',
      category: (customerForm.category as any) || 'marca_ropa',
      observations: customerForm.observations || '',
      totalOrdersCount: customerForm.totalOrdersCount || 0,
      totalSpent: customerForm.totalSpent || 0,
      createdAt: customerForm.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await adminProductionService.saveCustomer(payload);
    setCustomers(adminProductionService.getCustomers());
    setIsCustomerModalOpen(false);
    if (selectedCustomer?.id === saved.id) {
      setSelectedCustomer(saved);
    }

    setAlertSuccess(isEditing ? 'Cliente actualizado con éxito' : 'Cliente registrado exitosamente');
    setTimeout(() => setAlertSuccess(null), 3000);
  };

  const handleDeleteCustomer = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente? Se mantendrán las órdenes registradas históricamente.')) {
      await adminProductionService.deleteCustomer(id);
      setCustomers(adminProductionService.getCustomers());
      if (selectedCustomer?.id === id) {
        setSelectedCustomer(null);
      }
    }
  };

  // Pedidos asociados al cliente seleccionado
  const customerOrders = useMemo(() => {
    if (!selectedCustomer) return [];
    return orders.filter(o => o.customerId === selectedCustomer.id);
  }, [selectedCustomer, orders]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Navegador entre los módulos administrativos */}
      <AdminHeaderNav 
        currentTab="clientes" 
        lowStockCount={metrics.materialsNeedingReplenishmentCount}
        pendingOrdersCount={metrics.pendingOrdersCount}
        inProductionCount={metrics.ordersInProductionCount}
      />

      {/* Alerta de éxito */}
      {alertSuccess && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-sm font-medium animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{alertSuccess}</span>
        </div>
      )}

      {/* Header del módulo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Gestión de Clientes (CRM Textil)
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Directorio comercial, fichas técnicas de cliente, historial de compras y preferencias de estampado
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-sm transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, contacto, correo, ciudad o RUT..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs text-slate-500 font-medium shrink-0">Categoría:</span>
          {(['todos', 'marca_ropa', 'corporativo', 'eventos', 'mayorista', 'minorista'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat === 'todos' ? 'Todos' :
               cat === 'marca_ropa' ? 'Marcas de Ropa' :
               cat === 'corporativo' ? 'Corporativo' :
               cat === 'eventos' ? 'Eventos' :
               cat === 'mayorista' ? 'Mayoristas' : 'Minoristas'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((cust) => {
          const associatedCount = orders.filter(o => o.customerId === cust.id).length;
          const totalSpentFormatted = new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0
          }).format(cust.totalSpent || 0);

          return (
            <div
              key={cust.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-amber-500/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 mb-1">
                      {cust.category === 'marca_ropa' ? 'Marca de Ropa' :
                       cust.category === 'corporativo' ? 'Corporativo' :
                       cust.category === 'eventos' ? 'Eventos / Bandas' :
                       cust.category === 'mayorista' ? 'Mayorista Textil' : 'Minorista'}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                      {cust.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEdit(cust)}
                      title="Editar cliente"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCustomer(cust.id)}
                      title="Eliminar cliente"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Contacto: <strong>{cust.contactPerson}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a href={`tel:${cust.phone}`} className="hover:underline">{cust.phone || 'Sin teléfono'}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a href={`mailto:${cust.email}`} className="hover:underline truncate">{cust.email}</a>
                  </div>
                  {cust.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{cust.address}{cust.city ? `, ${cust.city}` : ''}</span>
                    </div>
                  )}
                </div>

                {cust.observations && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Notas: </span>
                    {cust.observations}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Total facturado</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {totalSpentFormatted}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCustomer(cust)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver Ficha ({associatedCount})</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredCustomers.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
              No se encontraron clientes
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Prueba cambiando los términos de búsqueda o registra un nuevo cliente en el taller.
            </p>
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Registrar primer cliente</span>
            </button>
          </div>
        )}
      </div>

      {/* DRAWER / MODAL DE DETALLE DE CLIENTE CON HISTORIAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                  Ficha de Cliente # {selectedCustomer.id}
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  {selectedCustomer.name}
                </h2>
                <p className="text-xs text-slate-500">
                  Registrado el {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Datos de Contacto y Facturación */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <div>
                <span className="text-slate-400 block mb-0.5">Representante / Contacto:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedCustomer.contactPerson}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Identificación Tributaria (RUT/NIT):</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedCustomer.taxId || 'No registrada'}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Teléfono:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedCustomer.phone || 'No especificado'}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Correo Electrónico:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedCustomer.email}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 block mb-0.5">Dirección de Despacho:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {selectedCustomer.address ? `${selectedCustomer.address}, ${selectedCustomer.city || ''}` : 'No especificada'}
                </span>
              </div>
            </div>

            {/* Observaciones técnicas */}
            {selectedCustomer.observations && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400 mb-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>Observaciones y Preferencias del Cliente:</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedCustomer.observations}
                </p>
              </div>
            )}

            {/* Historial de Pedidos y Cotizaciones */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-500" />
                  <span>Historial de Pedidos ({customerOrders.length})</span>
                </h4>
                <button
                  onClick={() => {
                    setSelectedCustomer(null);
                    setActiveModuleId('pedidos');
                  }}
                  className="text-xs font-semibold text-amber-500 hover:underline flex items-center gap-1"
                >
                  <span>Ir al Tablero de Pedidos</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {customerOrders.length > 0 ? (
                <div className="space-y-2">
                  {customerOrders.map(ord => (
                    <div
                      key={ord.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-500">{ord.orderNumber}</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{ord.title}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {ord.totalPieces} unidades • Técnica: {ord.techniqueName} • Entrega: {ord.deliveryDate}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {ord.status.replace('_', ' ')}
                        </span>
                        <div className="font-bold text-slate-900 dark:text-white mt-1">
                          ${(ord.totalAmount || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-800 text-xs text-slate-400">
                  Este cliente aún no tiene órdenes de trabajo registradas.
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  handleOpenEdit(selectedCustomer);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold"
              >
                Editar Datos
              </button>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREAR / EDITAR CLIENTE */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveCustomer}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isEditing ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCustomerModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre o Razón Social *
                </label>
                <input
                  type="text"
                  required
                  value={customerForm.name || ''}
                  onChange={e => setCustomerForm({ ...customerForm, name: e.target.value })}
                  placeholder="ej: Urban District Apparel SpA"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/50 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Persona de Contacto
                  </label>
                  <input
                    type="text"
                    value={customerForm.contactPerson || ''}
                    onChange={e => setCustomerForm({ ...customerForm, contactPerson: e.target.value })}
                    placeholder="ej: Carlos Mendoza"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Categoría
                  </label>
                  <select
                    value={customerForm.category || 'marca_ropa'}
                    onChange={e => setCustomerForm({ ...customerForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="marca_ropa">Marca de Ropa</option>
                    <option value="corporativo">Corporativo / Empresa</option>
                    <option value="eventos">Eventos / Bandas</option>
                    <option value="mayorista">Mayorista Textil</option>
                    <option value="minorista">Cliente Particular</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerForm.email || ''}
                    onChange={e => setCustomerForm({ ...customerForm, email: e.target.value })}
                    placeholder="ej: contacto@marca.cl"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={customerForm.phone || ''}
                    onChange={e => setCustomerForm({ ...customerForm, phone: e.target.value })}
                    placeholder="ej: +56 9 8765 4321"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Dirección (cuando sea requerida para despacho)
                  </label>
                  <input
                    type="text"
                    value={customerForm.address || ''}
                    onChange={e => setCustomerForm({ ...customerForm, address: e.target.value })}
                    placeholder="ej: Av. Providencia 2140, Of. 602"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={customerForm.city || ''}
                    onChange={e => setCustomerForm({ ...customerForm, city: e.target.value })}
                    placeholder="ej: Santiago"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  RUT / Identificación Tributaria
                </label>
                <input
                  type="text"
                  value={customerForm.taxId || ''}
                  onChange={e => setCustomerForm({ ...customerForm, taxId: e.target.value })}
                  placeholder="ej: 76.432.189-5"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Observaciones Técnicas y Preferencias
                </label>
                <textarea
                  rows={3}
                  value={customerForm.observations || ''}
                  onChange={e => setCustomerForm({ ...customerForm, observations: e.target.value })}
                  placeholder="Detalles sobre tipos de tela preferidos, normas de empaque, acuerdos comerciales..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsCustomerModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm"
              >
                {isEditing ? 'Guardar Cambios' : 'Registrar Cliente'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
