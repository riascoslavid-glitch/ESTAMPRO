import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  LibraryResourceItem, 
  LibraryFolder, 
  LibraryCategory, 
  LIBRARY_CATEGORIES_META,
  LibraryFormat 
} from '../../../types/library';
import { LibraryStorageService } from '../../../services/library/libraryStorageService';
import { LibraryUploadModal } from './LibraryUploadModal';
import { LibraryFolderModal } from './LibraryFolderModal';
import { LibraryResourceDetailModal } from './LibraryResourceDetailModal';
import { 
  Search, 
  Plus, 
  Folder, 
  Grid, 
  List, 
  Heart, 
  Download, 
  PenTool, 
  Box, 
  Sparkles, 
  Clock, 
  Filter, 
  Upload, 
  Layers, 
  FolderOpen,
  ArrowRight
} from 'lucide-react';

export const LibraryView: React.FC = () => {
  const { 
    setActiveGraphicTextureUri, 
    setActiveModuleId, 
    sendAITo3DGarment, 
    addNotification 
  } = useApp();

  const [resources, setResources] = useState<LibraryResourceItem[]>([]);
  const [folders, setFolders] = useState<LibraryFolder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & View State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [onlyRecents, setOnlyRecents] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [selectedResourceForDetail, setSelectedResourceForDetail] = useState<LibraryResourceItem | null>(null);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [res, fols] = await Promise.all([
          LibraryStorageService.getResources(),
          LibraryStorageService.getFolders()
        ]);
        setResources(res);
        setFolders(fols);
      } catch (e) {
        console.error('Error loading library resources:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter logic
  const filteredResources = useMemo(() => {
    return resources.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Folder filter
      if (selectedFolderId !== 'all') {
        if (selectedFolderId === 'none' && item.folderId) return false;
        if (selectedFolderId !== 'none' && item.folderId !== selectedFolderId) return false;
      }
      // Format filter
      if (selectedFormat !== 'all' && item.format !== selectedFormat) {
        return false;
      }
      // Favorites filter
      if (onlyFavorites && !item.isFavorite) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(q));
        const matchesCategory = item.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesTags && !matchesCategory) return false;
      }
      return true;
    }).sort((a, b) => {
      if (onlyRecents) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });
  }, [resources, selectedCategory, selectedFolderId, selectedFormat, onlyFavorites, onlyRecents, searchQuery]);

  // Handlers
  const handleUploadSuccess = async (newRes: LibraryResourceItem) => {
    await LibraryStorageService.saveResource(newRes);
    setResources((prev) => [newRes, ...prev]);
    addNotification(
      'Recurso Añadido',
      `"${newRes.title}" se guardó en la categoría ${newRes.category}.`,
      'success',
      'biblioteca'
    );
  };

  const handleSaveFolder = async (folder: LibraryFolder) => {
    await LibraryStorageService.saveFolder(folder);
    setFolders((prev) => [...prev, folder]);
    addNotification('Carpeta Creada', `Se creó la carpeta "${folder.name}".`, 'success', 'biblioteca');
  };

  const handleDeleteFolder = async (folderId: string) => {
    await LibraryStorageService.deleteFolder(folderId);
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
    if (selectedFolderId === folderId) setSelectedFolderId('all');
    addNotification('Carpeta Eliminada', 'La carpeta fue removida.', 'info', 'biblioteca');
  };

  const handleToggleFavorite = async (resourceId: string) => {
    const target = resources.find((r) => r.id === resourceId);
    if (!target) return;
    const updated = { ...target, isFavorite: !target.isFavorite };
    await LibraryStorageService.saveResource(updated);
    setResources((prev) => prev.map((r) => (r.id === resourceId ? updated : r)));
    if (selectedResourceForDetail?.id === resourceId) {
      setSelectedResourceForDetail(updated);
    }
  };

  const handleDuplicate = async (resource: LibraryResourceItem) => {
    const duplicated: LibraryResourceItem = {
      ...resource,
      id: `lib-dup-${Date.now().toString(36)}`,
      title: `${resource.title} (Copia)`,
      isCustom: true,
      createdAt: new Date().toISOString()
    };
    await LibraryStorageService.saveResource(duplicated);
    setResources((prev) => [duplicated, ...prev]);
    addNotification(
      'Recurso Duplicado',
      `Se creó una copia de "${resource.title}".`,
      'success',
      'biblioteca'
    );
  };

  const handleDeleteResource = async (resourceId: string) => {
    await LibraryStorageService.deleteResource(resourceId);
    setResources((prev) => prev.filter((r) => r.id !== resourceId));
    addNotification('Recurso Eliminado', 'El archivo fue eliminado de la biblioteca.', 'info', 'biblioteca');
  };

  const handleUpdateResource = async (updated: LibraryResourceItem) => {
    await LibraryStorageService.saveResource(updated);
    setResources((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setSelectedResourceForDetail(updated);
    addNotification('Recurso Actualizado', 'Los cambios han sido guardados.', 'success', 'biblioteca');
  };

  // Integration: Send to Graphic Designer
  const handleSendToDesigner = (resource: LibraryResourceItem) => {
    const uri = resource.dataUri || resource.previewUrl;
    setActiveGraphicTextureUri(uri);
    setActiveModuleId('disenador_grafico');
    addNotification(
      'Arte Enviado al Diseñador Gráfico',
      `"${resource.title}" cargado en el lienzo de trabajo 2D.`,
      'success',
      'disenador_grafico'
    );
  };

  // Integration: Send to 3D Garment
  const handleSendTo3D = (resource: LibraryResourceItem) => {
    const uri = resource.dataUri || resource.previewUrl;
    sendAITo3DGarment(uri, resource.title, 'centro_frontal');
    addNotification(
      'Estampado Colocado en 3D',
      `"${resource.title}" proyectado en la prenda tridimensional.`,
      'success',
      'probador_3d'
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Módulo 11 · Diseño & Producción Textil
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              {resources.length} Recursos Listos
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1 flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
            <span>Biblioteca Profesional de Recursos Gráficos</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            Vectores para camisetas, dorsales deportivos, logos, texturas vintage y tramas optimizadas para DTF, serigrafía y sublimación. Envío directo al Diseñador y Simulador 3D.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsFolderModalOpen(true)}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Folder className="w-4 h-4 text-cyan-500" />
            <span>Carpetas ({folders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-2 transition-colors shadow-xs"
          >
            <Upload className="w-4 h-4" />
            <span>Subir Diseño</span>
          </button>
        </div>
      </div>

      {/* Search, Filter Bar and View Toggles */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, etiquetas (#vintage, #deportivo, #streetwear) o técnica..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Quick Filters: Favorites & Recents */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                onlyFavorites
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-rose-500' : ''}`} />
              <span>Favoritos</span>
            </button>

            <button
              type="button"
              onClick={() => setOnlyRecents(!onlyRecents)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                onlyRecents
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Recientes</span>
            </button>

            {/* Folder Filter dropdown */}
            <select
              value={selectedFolderId}
              onChange={(e) => setSelectedFolderId(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none"
            >
              <option value="all">Todas las carpetas</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  📁 {f.name}
                </option>
              ))}
              <option value="none">Sin carpeta</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden p-0.5 bg-slate-100 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-cyan-500 shadow-xs'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="Vista de cuadrícula"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-700 text-cyan-500 shadow-xs'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="Vista de lista"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 15 Categories Scrollable Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-colors ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950'
                : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            Todas las Categorías ({resources.length})
          </button>

          {LIBRARY_CATEGORIES_META.map((cat) => {
            const count = resources.filter((r) => r.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg shrink-0 flex items-center gap-1.5 transition-colors ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950 font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? 'bg-slate-800 dark:bg-cyan-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Cargando biblioteca de vectores y recursos...</p>
        </div>
      ) : filteredResources.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <FolderOpen className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No se encontraron recursos en esta selección
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {searchQuery
                ? `No hay diseños que coincidan con la búsqueda "${searchQuery}".`
                : 'Comienza subiendo tus propios artes o explorando las demás categorías técnicas.'}
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3">
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setOnlyFavorites(false);
                }}
                className="px-4 py-2 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Limpiar filtros
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 shadow-xs"
            >
              <Upload className="w-4 h-4" />
              <span>Subir Primer Diseño</span>
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredResources.map((res) => {
            const cat = LIBRARY_CATEGORIES_META.find((c) => c.id === res.category);

            return (
              <div
                key={res.id}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md hover:border-cyan-500/50 transition-all flex flex-col"
              >
                {/* Visual Preview Container */}
                <div
                  onClick={() => setSelectedResourceForDetail(res)}
                  className="w-full h-48 bg-slate-950 p-4 flex items-center justify-center cursor-pointer relative overflow-hidden group-hover:bg-slate-900 transition-colors"
                >
                  <img
                    src={res.dataUri || res.previewUrl}
                    alt={res.title}
                    className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-200"
                  />

                  {/* Format Pill Badge */}
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-slate-900/80 text-cyan-400 border border-cyan-500/30 backdrop-blur-xs">
                    .{res.format}
                  </span>

                  {/* Favorite Heart */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(res.id);
                    }}
                    className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg backdrop-blur-xs transition-colors ${
                      res.isFavorite
                        ? 'bg-rose-500/20 text-rose-500'
                        : 'bg-slate-900/60 text-slate-400 hover:text-rose-500'
                    }`}
                    title={res.isFavorite ? 'Quitar de favoritos' : 'Marcar favorito'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${res.isFavorite ? 'fill-rose-500' : ''}`} />
                  </button>

                  {/* Hover Overlay Prompt */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="text-[11px] font-semibold text-white bg-black/70 px-3 py-1 rounded-full border border-white/20">
                      Vista previa ampliada
                    </span>
                  </div>
                </div>

                {/* Info & Metadata */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider truncate">
                        {cat?.name || res.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {res.dpi || 300} DPI
                      </span>
                    </div>

                    <h3
                      onClick={() => setSelectedResourceForDetail(res)}
                      className="text-xs font-bold text-slate-900 dark:text-white mt-1 line-clamp-1 hover:text-cyan-500 cursor-pointer"
                      title={res.title}
                    >
                      {res.title}
                    </h3>
                  </div>

                  {/* Primary Direct Actions */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleSendToDesigner(res)}
                      className="py-1.5 px-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-600 dark:hover:bg-indigo-600 text-indigo-700 dark:text-indigo-300 hover:text-white text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
                      title="Enviar al Diseñador Gráfico 2D"
                    >
                      <PenTool className="w-3 h-3" />
                      <span>Diseñador</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSendTo3D(res)}
                      className="py-1.5 px-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 hover:bg-cyan-600 dark:hover:bg-cyan-600 text-cyan-700 dark:text-cyan-300 hover:text-white text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
                      title="Colocar sobre Prenda 3D"
                    >
                      <Box className="w-3 h-3" />
                      <span>Prenda 3D</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredResources.map((res) => {
              const cat = LIBRARY_CATEGORIES_META.find((c) => c.id === res.category);

              return (
                <div
                  key={res.id}
                  className="p-3 sm:p-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div
                    onClick={() => setSelectedResourceForDetail(res)}
                    className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-950 p-1 shrink-0 flex items-center justify-center border border-slate-800">
                      <img
                        src={res.dataUri || res.previewUrl}
                        alt={res.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {res.title}
                        </span>
                        <span className="px-1.5 py-0.2 text-[9px] font-mono rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">
                          {res.format}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                        <span>{cat?.name || res.category}</span>
                        <span>·</span>
                        <span>{(res.sizeBytes / 1024).toFixed(0)} KB</span>
                        <span>·</span>
                        <span>{res.widthPx}x{res.heightPx} px</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(res.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        res.isFavorite
                          ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                          : 'text-slate-400 hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${res.isFavorite ? 'fill-rose-500' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSendToDesigner(res)}
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Enviar al Diseñador Gráfico"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Diseñador</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSendTo3D(res)}
                      className="px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Colocar en 3D"
                    >
                      <Box className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Prenda 3D</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => LibraryStorageService.downloadResource(res)}
                      className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Descargar"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modals */}
      <LibraryUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        folders={folders}
        onUploadSuccess={handleUploadSuccess}
      />

      <LibraryFolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        folders={folders}
        onSaveFolder={handleSaveFolder}
        onDeleteFolder={handleDeleteFolder}
      />

      <LibraryResourceDetailModal
        isOpen={!!selectedResourceForDetail}
        resource={selectedResourceForDetail}
        onClose={() => setSelectedResourceForDetail(null)}
        onSendToDesigner={handleSendToDesigner}
        onSendTo3D={handleSendTo3D}
        onToggleFavorite={handleToggleFavorite}
        onDuplicate={handleDuplicate}
        onDelete={handleDeleteResource}
        onUpdateResource={handleUpdateResource}
      />
    </div>
  );
};
