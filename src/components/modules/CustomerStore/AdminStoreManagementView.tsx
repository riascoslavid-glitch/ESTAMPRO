import React, { useState, useEffect } from 'react';
import {
  StoreProduct,
  CatalogDesign,
  VolumePriceTier
} from '../../../types/store';
import { OrderRecord, ORDER_STATUSES } from '../../../types/adminProduction';
import { clientStoreService } from '../../../services/store/clientStoreService';
import { adminProductionService } from '../../../services/admin/adminProductionService';
import { useApp } from '../../../context/AppContext';
import {
  Store,
  Eye,
  EyeOff,
  DollarSign,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShoppingBag,
  Sparkles,
  Layers,
  Edit3,
  Calendar,
  X,
  User,
  Phone,
  Mail,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface AdminStoreManagementViewProps {
  products: StoreProduct[];
  catalogDesigns: CatalogDesign[];
  onRefreshData: () => void;
}

export const AdminStoreManagementView: React.FC<AdminStoreManagementViewProps> = ({
  products,
  catalogDesigns,
  onRefreshData
}) => {
  const { addNotification } = useApp();

  const [activeTab, setActiveTab] = useState<'productos' | 'disenos' | 'pedidos'>('productos');

  // Edit Product Pricing Modal
  const [editingProduct, setEditingProduct] = useState<StoreProduct | null>(null);
  const [newBasePrice, setNewBasePrice] = useState<number>(0);
  const [newTiers, setNewTiers] = useState<VolumePriceTier[]>([]);

  // Add Design Modal
  const [isNewDesignModalOpen, setIsNewDesignModalOpen] = useState(false);
  const [newDesignTitle, setNewDesignTitle] = useState('');
  const [newDesignCategory, setNewDesignCategory] = useState<CatalogDesign['category']>('urbano');
  const [newDesignTechnique, setNewDesignTechnique] = useState('DTF Textil HD');
  const [newDesignUrl, setNewDesignUrl] = useState('');

  // Orders and Requests
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState<OrderRecord | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState('');

  const loadOrders = () => {
    const list = adminProductionService.getOrders();
    setOrders(list);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Toggle Publication
  const handleTogglePublish = (productId: string, currentStatus: boolean) => {
    clientStoreService.toggleProductPublication(productId, !currentStatus);
    addNotification(
      !currentStatus ? 'Producto Publicado' : 'Producto Ocultado',
      `El producto ahora está ${!currentStatus ? 'visible' : 'oculto'} en la tienda comercial.`,
      'info'
    );
    onRefreshData();
  };

  // Open Edit Pricing Modal
  const handleOpenEditPricing = (product: StoreProduct) => {
    setEditingProduct(product);
    setNewBasePrice(product.basePrice);
    setNewTiers(JSON.parse(JSON.stringify(product.volumePricing)));
  };

  // Save Pricing
  const handleSavePricing = () => {
    if (!editingProduct) return;
    clientStoreService.updateProductPricing(editingProduct.id, newBasePrice, newTiers);
    addNotification('Precios Actualizados', `Configuración guardada para ${editingProduct.name}.`, 'success');
    setEditingProduct(null);
    onRefreshData();
  };

  // Add Catalog Design
  const handleCreateDesign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesignTitle || !newDesignUrl) {
      addNotification('Campos requeridos', 'Ingresa título y URL o imagen del arte.', 'warning');
      return;
    }

    const design: CatalogDesign = {
      id: `des-cat-${Date.now()}`,
      title: newDesignTitle,
      category: newDesignCategory,
      previewUrl: newDesignUrl,
      isPublic: true,
      recommendedTechnique: newDesignTechnique,
      tags: [newDesignCategory, 'Oficial Taller'],
      colorsCount: 4,
      createdAt: new Date().toISOString()
    };

    await clientStoreService.saveCatalogDesign(design);
    addNotification('Diseño Publicado', 'El diseño ahora está disponible en el catálogo de clientes.', 'success');
    setIsNewDesignModalOpen(false);
    setNewDesignTitle('');
    setNewDesignUrl('');
    onRefreshData();
  };

  // Delete Catalog Design
  const handleDeleteDesign = async (designId: string) => {
    if (window.confirm('¿Seguro que deseas eliminar este diseño del catálogo público?')) {
      await clientStoreService.deleteCatalogDesign(designId);
      addNotification('Diseño Eliminado', 'Se retiró del catálogo público.', 'info');
      onRefreshData();
    }
  };

  // Admin Review / Approval of Customer Design
  const handleAdminApproveOrder = async (orderId: string, approved: boolean) => {
    try {
      const targetStatus = approved ? 'diseno_aprobado' : 'pendiente_diseno';
      await adminProductionService.updateOrderStatus(orderId, targetStatus);

      // Also sync customization record if exists
      const allCust = clientStoreService.getAllCustomizations();
      const linked = allCust.find((c) => c.associatedOrderId === orderId || c.id === orderId);
      if (linked) {
        await clientStoreService.reviewDesignByAdmin(
          linked.id,
          approved,
          reviewFeedback || (approved ? 'Aprobado por el jefe de taller.' : 'Se requieren correcciones de resolución.')
        );
      }

      addNotification(
        approved ? 'Diseño Aprobado por Taller' : 'Observación Enviada al Cliente',
        `Orden actualizada a: ${ORDER_STATUSES[targetStatus].label}.`,
        approved ? 'success' : 'warning',
        'pedidos'
      );
      setSelectedOrderForReview(null);
      setReviewFeedback('');
      loadOrders();
    } catch (e) {
      console.error(e);
      addNotification('Error al revisar diseño', 'Intenta nuevamente.', 'alert');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Admin Business Header Banner */}
      <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Panel del Negocio Textil (Administración de Tienda)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Control de productos en vitrina, configuración de precios mayoristas, catálogo de artes y aprobación técnica de pedidos.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('productos')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'productos'
                ? 'bg-cyan-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Productos ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('disenos')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'disenos'
                ? 'bg-cyan-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Diseños ({catalogDesigns.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pedidos')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'pedidos'
                ? 'bg-cyan-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Pedidos de Clientes ({orders.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PRODUCTOS EN TIENDA */}
      {activeTab === 'productos' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="relative">
                    <img
                      src={product.photoUrl}
                      alt={product.name}
                      className="w-full h-44 object-cover"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md ${
                          product.isPublished
                            ? 'bg-emerald-500/80 text-white border border-emerald-400'
                            : 'bg-slate-900/80 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {product.isPublished ? 'Público en Tienda' : 'Oculto'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {product.name}
                      </h3>
                      <span className="text-xs font-extrabold text-cyan-600 dark:text-cyan-400 shrink-0">
                        ${product.basePrice.toLocaleString('es-CL')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {product.shortDescription}
                    </p>

                    <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                      <div>
                        <strong>Modelo 3D:</strong> {product.model3DType}
                      </div>
                      <div>
                        <strong>Stock físico:</strong> {product.totalStock} unidades
                      </div>
                    </div>

                    {/* Volume tiers summary */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px]">
                      <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Escalas de Descuento:
                      </span>
                      <div className="grid grid-cols-2 gap-1 text-slate-500 dark:text-slate-400">
                        {product.volumePricing.map((tier) => (
                          <div key={tier.minQty}>
                            ≥ {tier.minQty} u: <strong className="text-slate-800 dark:text-slate-200">${tier.unitPrice.toLocaleString('es-CL')}</strong> (-{tier.discountPercent}%)
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  {/* Toggle publish button */}
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(product.id, product.isPublished)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      product.isPublished
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                    }`}
                  >
                    {product.isPublished ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Ocultar</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Publicar</span>
                      </>
                    )}
                  </button>

                  {/* Configure Price button */}
                  <button
                    type="button"
                    onClick={() => handleOpenEditPricing(product)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Configurar Precios</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DISEÑOS DE CATÁLOGO DISPONIBLES */}
      {activeTab === 'disenos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Diseños Públicos Disponibles para Clientes
            </h3>
            <button
              type="button"
              onClick={() => setIsNewDesignModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Publicar Nuevo Diseño</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {catalogDesigns.map((des) => (
              <div
                key={des.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div>
                  <img
                    src={des.previewUrl}
                    alt={des.title}
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-3 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400">
                      {des.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {des.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {des.recommendedTechnique}
                    </p>
                  </div>
                </div>

                <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleDeleteDesign(des.id)}
                    className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Eliminar diseño del catálogo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PEDIDOS DE CLIENTES Y APROBACIÓN DE DISEÑOS */}
      {activeTab === 'pedidos' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-4">N° Orden</th>
                  <th className="py-3 px-4">Cliente / Contacto</th>
                  <th className="py-3 px-4">Prendas</th>
                  <th className="py-3 px-4">Técnica</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Revisión & Aprobación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {orders.map((ord) => {
                  const statusConf = ORDER_STATUSES[ord.status] || ORDER_STATUSES.recibido;
                  return (
                    <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {ord.customerName}
                        </div>
                        <div className="text-[11px] text-slate-400">{ord.customerEmail}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {ord.totalPieces} prendas
                        </span>
                        <div className="text-[11px] text-slate-400">
                          {ord.garments[0]?.garmentName || 'Prenda Textil'}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-cyan-600 dark:text-cyan-400">
                        {ord.techniqueName}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white font-mono">
                        ${ord.totalAmount.toLocaleString('es-CL')}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusConf.badgeClass}`}
                        >
                          {statusConf.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedOrderForReview(ord)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500 hover:text-white text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
                        >
                          Inspeccionar Arte
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: EDITAR PRECIOS & ESCALAS */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Configurar Precios: {editingProduct.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Precio Base por Unidad (1-9 u.) *
              </label>
              <input
                type="number"
                value={newBasePrice}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 0;
                  setNewBasePrice(val);
                  // Update first tier
                  const updated = [...newTiers];
                  if (updated[0]) updated[0].unitPrice = val;
                  setNewTiers(updated);
                }}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Escalas de Descuento por Volumen
              </h4>
              <div className="space-y-2">
                {newTiers.map((tier, idx) => (
                  <div
                    key={tier.minQty}
                    className="flex items-center gap-2 text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                  >
                    <span className="w-24 font-bold text-slate-700 dark:text-slate-300">
                      ≥ {tier.minQty} unidades
                    </span>
                    <input
                      type="number"
                      value={tier.discountPercent}
                      onChange={(e) => {
                        const disc = parseInt(e.target.value, 10) || 0;
                        const copy = [...newTiers];
                        copy[idx].discountPercent = disc;
                        copy[idx].unitPrice = Math.round(newBasePrice * (1 - disc / 100));
                        setNewTiers(copy);
                      }}
                      className="w-16 p-1 rounded-lg bg-white dark:bg-slate-900 border text-center font-bold"
                    />
                    <span className="text-slate-400">% off =</span>
                    <span className="font-mono font-extrabold text-cyan-600 dark:text-cyan-400">
                      ${tier.unitPrice.toLocaleString('es-CL')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSavePricing}
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Guardar Precios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PUBLICAR NUEVO DISEÑO DE CATÁLOGO */}
      {isNewDesignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
          <form
            onSubmit={handleCreateDesign}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Publicar Nuevo Diseño en Catálogo
              </h3>
              <button
                type="button"
                onClick={() => setIsNewDesignModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Título del Diseño *
              </label>
              <input
                type="text"
                required
                value={newDesignTitle}
                onChange={(e) => setNewDesignTitle(e.target.value)}
                placeholder="Ej: California Sunset 1984"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Categoría de Estilo
              </label>
              <select
                value={newDesignCategory}
                onChange={(e) => setNewDesignCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
              >
                <option value="urbano">Urbano / Streetwear</option>
                <option value="vintage">Vintage 80s/90s</option>
                <option value="deportivo">Deportivo / Gym</option>
                <option value="minimalista">Minimalista</option>
                <option value="anime">Anime / Cyber</option>
                <option value="empresarial">Corporativo</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Técnica Recomendada
              </label>
              <input
                type="text"
                value={newDesignTechnique}
                onChange={(e) => setNewDesignTechnique(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                URL o Archivo de Imagen del Arte *
              </label>
              <input
                type="text"
                required
                value={newDesignUrl}
                onChange={(e) => setNewDesignUrl(e.target.value)}
                placeholder="/src/assets/images/... o URL"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsNewDesignModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Publicar Arte
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: INSPECCIÓN DE ARTE Y APROBACIÓN TÉCNICA */}
      {selectedOrderForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Auditoría y Aprobación de Arte Textil
                </h3>
                <p className="text-xs text-slate-500">
                  Orden #{selectedOrderForReview.orderNumber} • Cliente: {selectedOrderForReview.customerName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderForReview(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Design Preview */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
              {selectedOrderForReview.designs[0]?.previewUrl && (
                <img
                  src={selectedOrderForReview.designs[0].previewUrl}
                  alt="Arte"
                  className="w-24 h-24 object-contain rounded-xl bg-black/5 dark:bg-white/5 border border-slate-300 dark:border-slate-700 p-1"
                />
              )}
              <div className="text-xs space-y-1">
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {selectedOrderForReview.designs[0]?.name || 'Arte de Cliente'}
                </div>
                <div className="text-slate-500">
                  Ubicación: <strong>{selectedOrderForReview.designs[0]?.placement}</strong>
                </div>
                <div className="text-slate-500">
                  Dimensiones de Estampado: <strong>{selectedOrderForReview.designs[0]?.dimensionsCm}</strong>
                </div>
                <div className="text-cyan-600 dark:text-cyan-400 font-semibold">
                  Técnica recomendada: {selectedOrderForReview.techniqueName}
                </div>
              </div>
            </div>

            {/* Feedback textarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Observaciones del Taller / Correcciones de Pre-Prensa
              </label>
              <textarea
                rows={3}
                value={reviewFeedback}
                onChange={(e) => setReviewFeedback(e.target.value)}
                placeholder="Ej: Arte verificado a 300 DPI. Se aplicará choke de 1.5px en base blanca DTF..."
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
              />
            </div>

            {/* Decision Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleAdminApproveOrder(selectedOrderForReview.id, false)}
                className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs hover:bg-amber-500/20"
              >
                Solicitar Ajuste al Cliente
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForReview(null)}
                  className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={() => handleAdminApproveOrder(selectedOrderForReview.id, true)}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Aprobar Diseño para Taller</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
