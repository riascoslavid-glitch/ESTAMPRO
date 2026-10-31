import React from 'react';
import { useApp } from '../../context/AppContext';
import { PRINTING_TECHNIQUES } from '../../constants/techniques';
import { AppIcon } from '../common/AppIcon';
import { 
  Plus, 
  Box, 
  Palette, 
  Sparkles, 
  Layers, 
  ShoppingBag, 
  Users, 
  Package, 
  ArrowRight, 
  Search, 
  FolderPlus, 
  Clock, 
  Tag, 
  Shirt, 
  Sliders, 
  Trash2,
  FileCheck2,
  AlertCircle,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    projects,
    deleteProject,
    setActiveModuleId,
    setIsNewProjectModalOpen,
    setIsSearchPaletteOpen,
    setIsSettingsModalOpen,
    setSelectedProjectForDetails,
    workshopProfile
  } = useApp();

  // Greeting by time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-2 sm:py-4">
      {/* 1. Hero / Welcome Banner */}
      <section className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Text Column */}
          <div className="p-6 sm:p-8 lg:p-10 lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                <span className="uppercase tracking-wider">Centro de Control Textil 360°</span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-slate-500 dark:text-slate-400 font-normal">{workshopProfile.name}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                {greeting}, bienvenido a <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-indigo-600 dark:from-cyan-400 dark:to-indigo-400">ESTAMPAPRO 360°</span>
              </h1>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                Plataforma integral para gestión de talleres de serigrafía, DTF, sublimación y bordado. Diseña con precisión, simula en modelos tridimensionales y planifica la producción de cada prenda.
              </p>
            </div>

            {/* Quick Actions Strip */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsNewProjectModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 dark:bg-cyan-600 dark:hover:bg-cyan-500 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Nuevo Proyecto Textil</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModuleId('catalogos_comerciales')}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-cyan-200" />
                <span>Tienda & Personalizador 3D</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModuleId('probador_3d')}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-750 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <Box className="w-4 h-4 text-cyan-500" />
                <span>Estudio 3D</span>
              </button>

              <button
                type="button"
                onClick={() => setIsSearchPaletteOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span>Buscador de Herramientas</span>
              </button>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="relative lg:col-span-5 min-h-[220px] lg:min-h-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <img
              src="/src/assets/images/hero_textile_studio_1793415151404.jpg"
              alt="Taller de estampado textil profesional"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                // Graceful fallback container
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {/* Visual gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent lg:bg-gradient-to-r lg:from-slate-900/40 lg:to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 text-white text-[11px] font-medium flex items-center justify-between">
              <span className="backdrop-blur-md bg-black/40 px-2 py-1 rounded">
                Taller de Serigrafía & DTF
              </span>
              <span className="backdrop-blur-md bg-black/40 px-2 py-1 rounded font-mono">
                300 DPI · CMYK
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Studio Hub - Quick Access Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Estudios & Módulos Clave
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Accesos directos a las áreas principales del flujo de trabajo de estampado.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsSearchPaletteOpen(true)}
            className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
          >
            Ver los 21 módulos
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Estudio 3D */}
          <div
            onClick={() => setActiveModuleId('probador_3d')}
            className="group p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Box className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40">
                  Activo
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  Probador 3D
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  Simulación hiperrealista 360° en poleras, hoodies y gorras con mapeo de texturas.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-cyan-600 dark:text-cyan-400 font-medium">
              <span>Abrir simulador</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Diseñador Gráfico */}
          <div
            onClick={() => setActiveModuleId('disenador_grafico')}
            className="group p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Palette className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40">
                  Activo
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Diseñador Gráfico
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  Lienzo 2D multicapa para composición de artes, vectorización y tramados serigráficos.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-medium">
              <span>Abrir lienzo</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Editor y Preparación de Imágenes (Prompt 7) */}
          <div
            onClick={() => setActiveModuleId('editor_imagenes')}
            className="group p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Sliders className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40">
                  Activo · Prompt 7
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  Editor de Imágenes
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  Eliminación de fondo por IA, nitidez con convolución, control de 300 DPI, semitonos y recorte.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-cyan-600 dark:text-cyan-400 font-medium">
              <span>Abrir editor</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Técnicas de Estampado */}
          <div
            onClick={() => setActiveModuleId('tecnicas_estampado')}
            className="group p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-slate-600 dark:text-slate-300">
                  Fase 7
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Técnicas de Taller
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  Parámetros de curado, tiempos de planchado, hilaturas de malla y viscosidad de tintas.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <span>Consultar guía</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Secondary Hub Strip: Prendas, Pedidos, Clientes, Inventario */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          <button
            type="button"
            onClick={() => setActiveModuleId('catalogo_prendas')}
            className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-cyan-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Shirt className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                  Catálogo Prendas
                </div>
                <div className="text-[11px] text-slate-500">Blanks, cortes y materiales</div>
              </div>
            </div>
            <span className="text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40">
              Activo
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModuleId('pedidos')}
            className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">Gestión de Pedidos</div>
                <div className="text-[11px] text-slate-500">8 estados y órdenes taller</div>
              </div>
            </div>
            <span className="text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40">
              Activo
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModuleId('clientes')}
            className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">Directorio Clientes</div>
                <div className="text-[11px] text-slate-500">Marcas y empresas</div>
              </div>
            </div>
            <span className="text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40">
              Activo
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModuleId('inventario')}
            className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">Inventario Insumos</div>
                <div className="text-[11px] text-slate-500">10 familias y alertas</div>
              </div>
            </div>
            <span className="text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40">
              Activo
            </span>
          </button>
        </div>
      </section>

      {/* 3. Proyectos Recientes (Handling empty vs populated state strictly without fake stats) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Proyectos Recientes
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Órdenes de producción textil registradas en el sistema.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsNewProjectModalOpen(true)}
            className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Crear proyecto</span>
          </button>
        </div>

        {projects.length === 0 ? (
          /* Empty State for Projects */
          <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-cyan-950/40 text-indigo-600 dark:text-cyan-400 flex items-center justify-center">
              <Shirt className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                No hay proyectos registrados aún
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Empieza creando tu primer pedido de estampado textil para definir la prenda base, técnica de impresión (DTF, Serigrafía o Sublimación) y cantidades.
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => setIsNewProjectModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 dark:bg-cyan-600 dark:hover:bg-cyan-500 rounded-lg shadow-sm transition-all"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Registrar Primer Proyecto</span>
              </button>
            </div>
          </div>
        ) : (
          /* Populated State for Projects */
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/80">
            {projects.map((proj) => {
              const technique = PRINTING_TECHNIQUES.find((t) => t.id === proj.techniqueId);
              return (
                <div
                  key={proj.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    {/* Prenda swatch */}
                    <div
                      className="w-10 h-10 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center shadow-2xs shrink-0"
                      style={{ backgroundColor: proj.garmentColorHex }}
                    >
                      <Shirt className="w-5 h-5 text-white/90 drop-shadow-xs" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {proj.title}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-indigo-50 dark:bg-cyan-950/40 text-indigo-700 dark:text-cyan-300 border border-indigo-200 dark:border-cyan-800/50">
                          {technique?.name || proj.techniqueId.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span>Cliente: <strong className="font-semibold text-slate-700 dark:text-slate-300">{proj.clientName}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>{proj.garmentName}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{proj.quantity} unidades</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-[11px] text-slate-400">{proj.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center">
                    <button
                      type="button"
                      onClick={() => setSelectedProjectForDetails(proj)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Sliders className="w-3.5 h-3.5 text-indigo-500 dark:text-cyan-400" />
                      <span>Configurar & Capas</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveModuleId('probador_3d')}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Box className="w-3.5 h-3.5 text-cyan-500" />
                      <span>Ver 3D</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteProject(proj.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Eliminar proyecto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Split Grid: Diseños Recientes & Resumen de Actividad (Genuine Empty States) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Diseños Recientes */}
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Diseños & Artes Recientes
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Archivos vectoriales, separaciones y tramas de color.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveModuleId('archivos_disenos')}
              className="text-xs font-medium text-indigo-600 dark:text-cyan-400 hover:underline"
            >
              Bóveda de arte
            </button>
          </div>

          {/* Genuine Empty State */}
          <div className="p-8 rounded-lg bg-slate-50 dark:bg-slate-850/60 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Sin archivos de diseño activos
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                No se han importado archivos SVG, PNG a 300 DPI ni separaciones de color todavía.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveModuleId('disenador_grafico')}
              className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Abrir diseñador gráfico</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Resumen de Actividad de Taller */}
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Resumen de Actividad
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bitácora de producción, cambios de estado y entregas.
              </p>
            </div>
            <span className="text-[11px] text-slate-600 dark:text-slate-300 font-mono">
              En tiempo real
            </span>
          </div>

          {projects.length === 0 ? (
            /* Genuine Empty State */
            <div className="p-8 rounded-lg bg-slate-50 dark:bg-slate-850/60 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3">
              <div className="w-10 h-10 mx-auto rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Sin actividad reciente registrada
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  A medida que registres proyectos, modifiques órdenes de trabajo y calibres parámetros, tu historial operativo aparecerá aquí.
                </p>
              </div>
            </div>
          ) : (
            /* Real Activity List based on actual projects */
            <div className="space-y-2.5">
              {projects.slice(0, 3).map((p) => (
                <div key={p.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 flex items-start gap-2.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Proyecto "{p.title}"
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Asignado a cliente <strong className="font-medium text-slate-700 dark:text-slate-300">{p.clientName}</strong> con tirada de {p.quantity} prendas.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Guía Rápida de Técnicas Textiles */}
      <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Técnicas de Estampado Soportadas por la Plataforma
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Guía técnica de producción calibrada para el taller.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveModuleId('tecnicas_estampado')}
            className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            Ver fichas de curado completas
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRINTING_TECHNIQUES.slice(0, 3).map((tech) => (
            <div
              key={tech.id}
              onClick={() => setActiveModuleId('tecnicas_estampado')}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {tech.name}
                </span>
                <span className="text-[10px] font-medium text-indigo-600 dark:text-cyan-400">
                  Min. {tech.minQuantity} u.
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                {tech.shortDesc}
              </p>
              <div className="pt-2 flex flex-wrap gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                <span>{tech.recommendedFabrics.slice(0, 2).join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
