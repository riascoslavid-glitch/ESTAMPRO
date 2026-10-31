import React, { useState, useEffect } from 'react';
import { StoreProduct, CatalogDesign, ClientCustomization } from '../../../types/store';
import { clientStoreService } from '../../../services/store/clientStoreService';
import { CustomerCatalogView } from './CustomerCatalogView';
import { CustomerCustomizerView } from './CustomerCustomizerView';
import { ClientProjectsAndOrdersView } from './ClientProjectsAndOrdersView';
import { AdminStoreManagementView } from './AdminStoreManagementView';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import {
  ShoppingBag,
  Shirt,
  FolderLock,
  Store,
  Sparkles,
  ShieldCheck,
  User,
  SlidersHorizontal,
  Layers,
  ArrowRight
} from 'lucide-react';

export const CustomerStorePortalView: React.FC = () => {
  const { currentRole, setCurrentRole, userProfile } = useAuth();
  const { addNotification } = useApp();

  const [activePortalTab, setActivePortalTab] = useState<'catalogo' | 'personalizador' | 'mis_pedidos' | 'panel_negocio'>('catalogo');

  // Products and designs state
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [catalogDesigns, setCatalogDesigns] = useState<CatalogDesign[]>([]);

  // Selected item passed to customizer
  const [customizerProduct, setCustomizerProduct] = useState<StoreProduct | undefined>(undefined);
  const [customizerInitialProject, setCustomizerInitialProject] = useState<ClientCustomization | null>(null);

  const loadStoreData = () => {
    const prods = clientStoreService.getProducts();
    const designs = clientStoreService.getCatalogDesigns();
    setProducts(prods);
    setCatalogDesigns(designs);
  };

  useEffect(() => {
    loadStoreData();
    clientStoreService.syncProductsFromFirestore().then((loaded) => {
      if (loaded && loaded.length) setProducts(loaded);
    });
  }, []);

  const handleSelectProductForCustomizer = (product: StoreProduct) => {
    setCustomizerProduct(product);
    setCustomizerInitialProject(null);
    setActivePortalTab('personalizador');
  };

  const handleSelectDesignForCustomizer = (product: StoreProduct, design: CatalogDesign) => {
    setCustomizerProduct(product);
    setCustomizerInitialProject(null);
    setActivePortalTab('personalizador');
    addNotification('Diseño Seleccionado', `Arte "${design.title}" cargado para estampar.`, 'info');
  };

  const handleOpenCustomizerWithProject = (customization: ClientCustomization) => {
    const prod = products.find((p) => p.garmentId === customization.garmentId);
    if (prod) setCustomizerProduct(prod);
    setCustomizerInitialProject(customization);
    setActivePortalTab('personalizador');
  };

  const isAdminOrStaff = currentRole === 'administrador' || currentRole === 'vendedor';

  return (
    <div className="space-y-6">
      {/* Top Portal Navigation & Mode Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-3 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setActivePortalTab('catalogo')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              activePortalTab === 'catalogo'
                ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Catálogo de Prendas</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePortalTab('personalizador')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              activePortalTab === 'personalizador'
                ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Shirt className="w-4 h-4 text-cyan-400" />
            <span>Personalizador 3D</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePortalTab('mis_pedidos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              activePortalTab === 'mis_pedidos'
                ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FolderLock className="w-4 h-4" />
            <span>Mis Proyectos & Pedidos</span>
          </button>

          {/* Admin Panel Tab */}
          <button
            type="button"
            onClick={() => setActivePortalTab('panel_negocio')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              activePortalTab === 'panel_negocio'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Panel del Negocio</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
              Admin
            </span>
          </button>
        </div>

        {/* Quick Role Tester Switcher (Simulador de Experiencia) */}
        <div className="flex items-center gap-2 self-end md:self-auto bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs shrink-0">
          <span className="text-[11px] text-slate-500 font-medium">Modo activo:</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setCurrentRole('cliente');
                addNotification('Modo Cliente Activado', 'Experimenta la tienda y pedidos privados como un cliente.', 'info');
              }}
              className={`px-2.5 py-1 rounded-xl font-bold transition-colors ${
                currentRole === 'cliente'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Cliente
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentRole('administrador');
                addNotification('Modo Administrador Activado', 'Control total de publicación, precios y aprobación.', 'info');
              }}
              className={`px-2.5 py-1 rounded-xl font-bold transition-colors ${
                currentRole === 'administrador'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Administrador
            </button>
          </div>
        </div>
      </div>

      {/* Render Active View Tab */}
      {activePortalTab === 'catalogo' && (
        <CustomerCatalogView
          products={products}
          catalogDesigns={catalogDesigns}
          onSelectProductForCustomizer={handleSelectProductForCustomizer}
          onSelectDesignForCustomizer={handleSelectDesignForCustomizer}
        />
      )}

      {activePortalTab === 'personalizador' && (
        <CustomerCustomizerView
          products={products}
          catalogDesigns={catalogDesigns}
          initialProduct={customizerProduct}
          initialCustomization={customizerInitialProject}
          onCustomizationSaved={() => {
            setActivePortalTab('mis_pedidos');
          }}
          onGoToMyOrders={() => {
            setActivePortalTab('mis_pedidos');
          }}
        />
      )}

      {activePortalTab === 'mis_pedidos' && (
        <ClientProjectsAndOrdersView
          onOpenCustomizerWithProject={handleOpenCustomizerWithProject}
        />
      )}

      {activePortalTab === 'panel_negocio' && (
        <AdminStoreManagementView
          products={products}
          catalogDesigns={catalogDesigns}
          onRefreshData={loadStoreData}
        />
      )}
    </div>
  );
};
