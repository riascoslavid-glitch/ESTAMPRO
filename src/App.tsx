/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { APP_MODULES } from './constants/modules';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { DashboardView } from './components/dashboard/DashboardView';
import { PendingModuleView } from './components/modules/PendingModuleView';
import { SettingsView } from './components/modules/SettingsView';
import { TechniquesView } from './components/modules/TechniquesView';
import { FilesAndStorageView } from './components/modules/FilesAndStorageView';
import { GarmentsCatalogView } from './components/modules/GarmentsCatalogView';
import { Studio3DView } from './components/modules/Studio3DView';
import { GraphicDesignerView } from './components/modules/GraphicDesigner/GraphicDesignerView';
import { ImageEditorView } from './components/modules/ImageEditor/ImageEditorView';
import { CreativeAIStudioView } from './components/modules/CreativeAI/CreativeAIStudioView';
import { ProductionAssistantView } from './components/modules/ProductionAssistant/ProductionAssistantView';
import { PrintPreparationView } from './components/modules/PrintPreparation/PrintPreparationView';
import { FinancialQuotesView } from './components/modules/FinancialQuotes/FinancialQuotesView';
import { CustomersManagementView } from './components/modules/AdminProduction/CustomersManagementView';
import { OrdersManagementView } from './components/modules/AdminProduction/OrdersManagementView';
import { InventoryManagementView } from './components/modules/AdminProduction/InventoryManagementView';
import { ProductionScheduleView } from './components/modules/AdminProduction/ProductionScheduleView';
import { ReportsAnalyticsView } from './components/modules/AdminProduction/ReportsAnalyticsView';
import { QualityControlView } from './components/modules/AdminProduction/QualityControlView';
import { NewProjectModal } from './components/modals/NewProjectModal';
import { CommandPaletteModal } from './components/modals/CommandPaletteModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { AuthModal } from './components/modals/AuthModal';
import { ProjectDetailsModal } from './components/modals/ProjectDetailsModal';
import { CustomerStorePortalView } from './components/modules/CustomerStore/CustomerStorePortalView';
import { LibraryView } from './components/modules/Library/LibraryView';
import { LearningCenterView } from './components/modules/Learning/LearningCenterView';

const AppShell: React.FC = () => {
  const { activeModuleId, selectedProjectForDetails, setSelectedProjectForDetails } = useApp();

  const currentModule = APP_MODULES.find((m) => m.id === activeModuleId) || APP_MODULES[0];

  const renderActiveModule = () => {
    switch (activeModuleId) {
      case 'inicio':
        return <DashboardView />;
      case 'configuracion':
        return <SettingsView />;
      case 'tecnicas_estampado':
        return <TechniquesView />;
      case 'archivos_disenos':
        return <FilesAndStorageView />;
      case 'catalogo_prendas':
        return <GarmentsCatalogView />;
      case 'probador_3d':
        return <Studio3DView />;
      case 'estudio_diseno':
      case 'disenador_grafico':
        return <GraphicDesignerView />;
      case 'editor_imagenes':
        return <ImageEditorView />;
      case 'ia_creativa':
        return <CreativeAIStudioView />;
      case 'asistente_produccion':
        return <ProductionAssistantView />;
      case 'preparacion_impresion':
        return <PrintPreparationView />;
      case 'cotizaciones':
        return <FinancialQuotesView />;
      case 'clientes':
        return <CustomersManagementView />;
      case 'pedidos':
        return <OrdersManagementView />;
      case 'inventario':
        return <InventoryManagementView />;
      case 'produccion':
        return <ProductionScheduleView />;
      case 'finanzas':
      case 'reportes':
        return <ReportsAnalyticsView />;
      case 'catalogos_comerciales':
        return <CustomerStorePortalView />;
      case 'control_calidad':
        return <QualityControlView />;
      case 'biblioteca':
        return <LibraryView />;
      case 'centro_aprendizaje':
        return <LearningCenterView />;
      default:
        return <PendingModuleView module={currentModule} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Header */}
      <TopBar />

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          {renderActiveModule()}
        </main>
      </div>

      {/* Modals & Overlays */}
      <NewProjectModal />
      <CommandPaletteModal />
      <SettingsModal />
      <NotificationDrawer />
      <MobileNav />
      <AuthModal />
      <ProjectDetailsModal
        project={selectedProjectForDetails}
        onClose={() => setSelectedProjectForDetails(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </AuthProvider>
  );
}
