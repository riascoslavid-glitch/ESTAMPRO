import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { StoredFile, FileCategoryFolder, PrintZone3D } from '../../types';
import { StorageService, FOLDER_LABELS, ALLOWED_TEXTILE_EXTENSIONS } from '../../services/storageService';
import { 
  FolderArchive, 
  Upload, 
  Download, 
  Trash2, 
  Folder, 
  FolderPlus,
  File, 
  FileText, 
  Image as ImageIcon, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  Filter, 
  HardDrive,
  Shirt,
  Plus,
  Star,
  Clock,
  Palette,
  Sliders,
  Box,
  Copy,
  Edit2,
  ExternalLink,
  ChevronRight,
  Eye,
  X,
  Share2,
  ArrowUpDown,
  LayoutGrid,
  List as ListIcon,
  Tag,
  Check,
  AlertTriangle
} from 'lucide-react';

type MainViewFilter = 'todos' | 'recientes' | 'favoritos' | 'proyectos' | 'imagenes' | 'pendientes';
type SortOption = 'fecha_desc' | 'fecha_asc' | 'nombre_asc' | 'nombre_desc' | 'tamano_desc';

export const FilesAndStorageView: React.FC = () => {
  const {
    storedFiles,
    uploadStoredFile,
    deleteStoredFile,
    updateStoredFile,
    toggleFileFavorite,
    moveStoredFile,
    projects,
    workshopProfile,
    addNotification,
    openInImageEditor,
    openInDesignStudio,
    sendToProbador3D
  } = useApp();

  const { currentUser, userProfile, currentRole } = useAuth();

  // Navigation & Filtering
  const [mainView, setMainView] = useState<MainViewFilter>('todos');
  const [selectedFolder, setSelectedFolder] = useState<FileCategoryFolder | 'todas'>('todas');
  const [selectedSubfolder, setSelectedSubfolder] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('fecha_desc');
  const [viewLayout, setViewLayout] = useState<'grid' | 'table'>('grid');

  // Multi-selection state
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);

  // Upload States
  const [selectedProjectId, setSelectedProjectId] = useState<string>('ninguno');
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Modals
  const [previewFile, setPreviewFile] = useState<StoredFile | null>(null);
  const [renamingFile, setRenamingFile] = useState<StoredFile | null>(null);
  const [renameInput, setRenameInput] = useState('');
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderCategory, setNewFolderCategory] = useState<FileCategoryFolder>('artes_vectoriales');
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [targetMoveFolder, setTargetMoveFolder] = useState<FileCategoryFolder>('artes_vectoriales');
  const [targetMoveSubfolder, setTargetMoveSubfolder] = useState<string>('');
  const [fileToDelete, setFileToDelete] = useState<StoredFile | null>(null);
  const [isBatchDeleteModalOpen, setIsBatchDeleteModalOpen] = useState(false);
  const [send3DFile, setSend3DFile] = useState<StoredFile | null>(null);
  const [target3DZone, setTarget3DZone] = useState<PrintZone3D>('centro_frontal');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Subfolders collected across files
  const existingSubfolders = Array.from(
    new Set(
      storedFiles
        .filter((f) => f.subfolder && (selectedFolder === 'todas' || f.folder === selectedFolder))
        .map((f) => f.subfolder!)
    )
  );

  // Filtering Logic
  const filteredFiles = storedFiles.filter((file) => {
    // Role & Ownership check
    if (currentRole !== 'administrador' && currentUser && file.ownerId !== currentUser.uid) {
      return false;
    }

    // Main View Filter
    if (mainView === 'favoritos' && !file.isFavorite) return false;
    if (mainView === 'proyectos' && !file.projectId && !file.graphicStudioState) return false;
    if (mainView === 'imagenes' && !['.png', '.jpg', '.jpeg', '.webp', '.svg'].includes(file.extension.toLowerCase())) return false;
    if (mainView === 'pendientes' && file.status !== 'en_progreso' && file.status !== 'borrador') return false;

    // Folder Filter
    if (selectedFolder !== 'todas' && file.folder !== selectedFolder) {
      return false;
    }

    // Subfolder Filter
    if (selectedSubfolder !== 'todas' && file.subfolder !== selectedSubfolder) {
      return false;
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = file.name.toLowerCase().includes(q);
      const matchProj = file.projectName?.toLowerCase().includes(q);
      const matchTags = file.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchProj && !matchTags) return false;
    }

    return true;
  });

  // Sorting Logic
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    switch (sortBy) {
      case 'nombre_asc':
        return a.name.localeCompare(b.name);
      case 'nombre_desc':
        return b.name.localeCompare(a.name);
      case 'tamano_desc':
        return b.sizeBytes - a.sizeBytes;
      case 'fecha_asc':
        return (a.createdAt || '').localeCompare(b.createdAt || '');
      case 'fecha_desc':
      default:
        return (b.createdAt || '').localeCompare(a.createdAt || '');
    }
  });

  // Upload handler for multiple files
  const handleProcessFiles = async (fileList: FileList | File[]) => {
    if (!fileList || fileList.length === 0) return;

    setUploadError('');
    setUploadSuccess('');
    setIsUploading(true);

    let uploadedCount = 0;
    const errors: string[] = [];

    const assocProject = projects.find((p) => p.id === selectedProjectId);
    const targetFolder: FileCategoryFolder =
      selectedFolder === 'todas' ? 'artes_vectoriales' : selectedFolder;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const validation = StorageService.validateFile(
        file,
        workshopProfile.maxFileUploadSizeMb || 25,
        ALLOWED_TEXTILE_EXTENSIONS
      );

      if (!validation.valid) {
        errors.push(`${file.name}: ${validation.error}`);
        continue;
      }

      try {
        const dataUri = await StorageService.readFileAsDataUri(file);
        const extMatch = file.name.toLowerCase().match(/\.[0-9a-z]+$/i);
        const extension = extMatch ? extMatch[0] : '';

        // Extract real dimensions and DPI
        const dimensions = await StorageService.extractDimensions(dataUri, extension);

        const newStoredFile: StoredFile = {
          id: `file-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
          name: file.name,
          sizeBytes: file.size,
          mimeType: file.type || 'application/octet-stream',
          extension,
          folder: targetFolder,
          subfolder: selectedSubfolder !== 'todas' ? selectedSubfolder : undefined,
          projectId: assocProject ? assocProject.id : undefined,
          projectName: assocProject ? assocProject.title : undefined,
          ownerId: currentUser?.uid || userProfile?.uid || 'anon-owner',
          dataUri,
          dimensions,
          status: 'en_progreso',
          isFavorite: false,
          createdAt: new Date().toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })
        };

        await uploadStoredFile(newStoredFile);
        uploadedCount++;
      } catch (err) {
        console.error(err);
        errors.push(`Error al procesar "${file.name}"`);
      }
    }

    setIsUploading(false);

    if (uploadedCount > 0) {
      setUploadSuccess(`Se cargaron ${uploadedCount} archivo(s) exitosamente en ${FOLDER_LABELS[targetFolder]}.`);
      addNotification('Archivos Almacenados', `Se procesaron y guardaron ${uploadedCount} archivo(s) correctamente.`, 'success', 'archivos_disenos');
    }

    if (errors.length > 0) {
      setUploadError(errors.join(' | '));
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleProcessFiles(e.dataTransfer.files);
    }
  };

  // Duplicate a file
  const handleDuplicateFile = async (file: StoredFile) => {
    const extParts = file.name.split('.');
    const nameWithoutExt = extParts.slice(0, -1).join('.') || file.name;
    const ext = extParts.length > 1 ? `.${extParts[extParts.length - 1]}` : file.extension;

    const duplicated: StoredFile = {
      ...file,
      id: `file-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      name: `${nameWithoutExt}_copia${ext}`,
      createdAt: new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    };

    await uploadStoredFile(duplicated);
    addNotification('Archivo Duplicado', `Se creó una copia de "${file.name}".`, 'success', 'archivos_disenos');
  };

  // Save renamed file
  const handleSaveRename = async () => {
    if (!renamingFile || !renameInput.trim()) return;
    await updateStoredFile(renamingFile.id, { name: renameInput.trim() });
    setRenamingFile(null);
    setRenameInput('');
  };

  // Create new folder / subfolder
  const handleCreateSubfolder = async () => {
    if (!newFolderName.trim()) return;
    const folderClean = newFolderName.trim();
    setSelectedFolder(newFolderCategory);
    setSelectedSubfolder(folderClean);
    setIsNewFolderModalOpen(false);
    setNewFolderName('');
    addNotification('Carpeta Creada', `Carpeta "${folderClean}" lista para organizar archivos.`, 'info', 'archivos_disenos');
  };

  // Batch Selection Helpers
  const toggleSelectAll = () => {
    if (selectedFileIds.length === sortedFiles.length) {
      setSelectedFileIds([]);
    } else {
      setSelectedFileIds(sortedFiles.map((f) => f.id));
    }
  };

  const toggleSelectFile = (id: string) => {
    setSelectedFileIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Batch Delete
  const handleConfirmBatchDelete = async () => {
    for (const id of selectedFileIds) {
      await deleteStoredFile(id);
    }
    setSelectedFileIds([]);
    setIsBatchDeleteModalOpen(false);
    addNotification('Archivos Eliminados', 'Los archivos seleccionados fueron eliminados de la bóveda.', 'info', 'archivos_disenos');
  };

  // Batch Download
  const handleBatchDownload = () => {
    const filesToDownload = storedFiles.filter((f) => selectedFileIds.includes(f.id));
    StorageService.downloadMultipleFiles(filesToDownload);
  };

  // Batch Move
  const handleConfirmBatchMove = async () => {
    for (const id of selectedFileIds) {
      await moveStoredFile(id, targetMoveFolder, targetMoveSubfolder || undefined);
    }
    setSelectedFileIds([]);
    setIsMoveModalOpen(false);
  };

  // Send to 3D simulation
  const handleConfirmSendTo3D = () => {
    if (!send3DFile) return;
    sendToProbador3D({
      textureUri: send3DFile.dataUri || send3DFile.url || '',
      name: send3DFile.name,
      zone: target3DZone,
      widthCm: send3DFile.dimensions?.widthCm || 24,
      heightCm: send3DFile.dimensions?.heightCm || 28
    });
    setSend3DFile(null);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (ext: string) => {
    const e = ext.toLowerCase();
    if (['.png', '.jpg', '.jpeg', '.webp'].includes(e)) {
      return <ImageIcon className="w-5 h-5 text-cyan-500 shrink-0" />;
    }
    if (e === '.svg') {
      return <Palette className="w-5 h-5 text-indigo-500 shrink-0" />;
    }
    if (['.pdf', '.ai', '.eps'].includes(e)) {
      return <FileText className="w-5 h-5 text-rose-500 shrink-0" />;
    }
    if (['.psd', '.tiff', '.tif'].includes(e)) {
      return <File className="w-5 h-5 text-purple-500 shrink-0" />;
    }
    return <File className="w-5 h-5 text-slate-400 shrink-0" />;
  };

  const getStatusBadge = (status?: StoredFile['status']) => {
    switch (status) {
      case 'terminado':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Terminado
          </span>
        );
      case 'en_progreso':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            En Progreso
          </span>
        );
      case 'borrador':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Borrador
          </span>
        );
      case 'revision':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            Revisión
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-2 sm:py-4">
      {/* 1. Header Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Módulo 9 · Almacenamiento & Diseño
            </span>
            <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Persistencia Cloud & Local
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1 flex items-center gap-2.5">
            <FolderArchive className="w-7 h-7 text-indigo-600 dark:text-cyan-400" />
            <span>Archivos y Diseños Textiles</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestor profesional de artes originales, fotolitos RIP, mockups 3D y proyectos editables con sincronización en tiempo real.
          </p>
        </div>

        {/* Acciones Rápidas del Header */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsNewFolderModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 shadow-2xs transition-all cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
            <span>Nueva Carpeta</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white shadow-sm transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Subir Archivos</span>
          </button>
        </div>
      </div>

      {/* 2. Zona de Arrastrar y Soltar / Subida Múltiple */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`p-6 rounded-2xl border-2 border-dashed transition-all space-y-4 ${
          isDraggingOver
            ? 'border-indigo-600 bg-indigo-50/80 dark:border-cyan-400 dark:bg-cyan-950/40 scale-[1.005]'
            : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-400 dark:hover:border-slate-700'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-cyan-950/60 border border-indigo-100 dark:border-cyan-800/60 flex items-center justify-center shrink-0">
              <Upload className="w-6 h-6 text-indigo-600 dark:text-cyan-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Arrastra y suelta tus artes textiles aquí o selecciona desde tu equipo
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Formatos compatibles: <strong>PNG, JPG, WEBP, SVG, PDF, TIFF, PSD, AI, EPS</strong>. Soporta selección múltiple (hasta {workshopProfile.maxFileUploadSizeMb || 25} MB c/u).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ALLOWED_TEXTILE_EXTENSIONS.join(',')}
              onChange={(e) => {
                if (e.target.files) handleProcessFiles(e.target.files);
                e.target.value = '';
              }}
              className="hidden"
            />
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer transition-colors"
            >
              {isUploading ? 'Procesando...' : 'Examinar Archivos'}
            </button>
          </div>
        </div>

        {/* Feedback Messages */}
        {uploadError && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {uploadSuccess && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-700 dark:text-emerald-300">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
        )}
      </div>

      {/* 3. Barra de Filtros Principales (Panel Principal) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {/* Vistas Principales (Todos, Recientes, Favoritos, Proyectos, Imágenes, Pendientes) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {[
            { id: 'todos', label: 'Todos los archivos', icon: FolderArchive, count: storedFiles.length },
            { id: 'recientes', label: 'Recientes', icon: Clock, count: storedFiles.length },
            { id: 'favoritos', label: 'Favoritos', icon: Star, count: storedFiles.filter((f) => f.isFavorite).length },
            { id: 'proyectos', label: 'Proyectos Guardados', icon: Palette, count: storedFiles.filter((f) => f.projectId || f.graphicStudioState).length },
            { id: 'imagenes', label: 'Imágenes', icon: ImageIcon, count: storedFiles.filter((f) => ['.png', '.jpg', '.jpeg', '.webp', '.svg'].includes(f.extension.toLowerCase())).length },
            { id: 'pendientes', label: 'Pendientes', icon: AlertTriangle, count: storedFiles.filter((f) => f.status === 'en_progreso' || f.status === 'borrador').length }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = mainView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMainView(item.id as MainViewFilter)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-cyan-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Layout Toggle (Grid / Lista) */}
        <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
          <button
            type="button"
            title="Vista de Cuadrícula"
            onClick={() => setViewLayout('grid')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewLayout === 'grid' ? 'bg-slate-100 dark:bg-slate-700 text-indigo-600 dark:text-cyan-400' : 'text-slate-400'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Vista de Tabla"
            onClick={() => setViewLayout('table')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewLayout === 'table' ? 'bg-slate-100 dark:bg-slate-700 text-indigo-600 dark:text-cyan-400' : 'text-slate-400'
            }`}
          >
            <ListIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. Barra de Carpetas, Búsqueda y Ordenamiento */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Selector de Carpeta */}
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Folder className="w-4 h-4 text-indigo-600 dark:text-cyan-400 shrink-0" />
          <select
            value={selectedFolder}
            onChange={(e) => {
              setSelectedFolder(e.target.value as FileCategoryFolder | 'todas');
              setSelectedSubfolder('todas');
            }}
            className="w-full text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
          >
            <option value="todas">Todas las categorías ({storedFiles.length})</option>
            {Object.entries(FOLDER_LABELS).map(([k, label]) => {
              const count = storedFiles.filter((f) => f.folder === k).length;
              return (
                <option key={k} value={k}>
                  {label} ({count})
                </option>
              );
            })}
          </select>
        </div>

        {/* Subcarpetas si existen */}
        {existingSubfolders.length > 0 && (
          <div className="flex items-center gap-2 min-w-[170px]">
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedSubfolder}
              onChange={(e) => setSelectedSubfolder(e.target.value)}
              className="w-full text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="todas">Todas las subcarpetas</option>
              {existingSubfolders.map((sf) => (
                <option key={sf} value={sf}>
                  📁 {sf}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Buscador */}
        <div className="relative min-w-[240px] flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por nombre, proyecto o etiqueta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Ordenar por */}
        <div className="flex items-center gap-2 shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
          >
            <option value="fecha_desc">Más reciente primero</option>
            <option value="fecha_asc">Más antiguo primero</option>
            <option value="nombre_asc">Nombre (A - Z)</option>
            <option value="nombre_desc">Nombre (Z - A)</option>
            <option value="tamano_desc">Mayor tamaño</option>
          </select>
        </div>
      </div>

      {/* 5. Barra de Selección Múltiple Flotante */}
      {selectedFileIds.length > 0 && (
        <div className="p-3 px-4 rounded-xl bg-slate-900 text-white dark:bg-indigo-950 dark:border dark:border-indigo-800 flex items-center justify-between gap-4 shadow-lg animate-in fade-in">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-cyan-400">
              {selectedFileIds.length} archivo(s) seleccionado(s)
            </span>
            <button
              type="button"
              onClick={toggleSelectAll}
              className="text-[11px] underline text-slate-300 hover:text-white cursor-pointer"
            >
              {selectedFileIds.length === sortedFiles.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMoveModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
            >
              <Folder className="w-3.5 h-3.5 text-cyan-400" />
              <span>Mover</span>
            </button>

            <button
              type="button"
              onClick={handleBatchDownload}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Descargar</span>
            </button>

            <button
              type="button"
              onClick={() => setIsBatchDeleteModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Eliminar</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. Contenido Principal: Grilla o Tabla */}
      {sortedFiles.length === 0 ? (
        <div className="p-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-cyan-950/40 border border-indigo-100 dark:border-cyan-800 flex items-center justify-center text-indigo-600 dark:text-cyan-400">
            <FolderArchive className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No se encontraron archivos en esta vista
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sube tus ilustraciones textiles, fotolitos o fichas técnicas arrastrándolos a la zona superior para almacenarlos de forma persistente.
            </p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer shadow-sm transition-all"
          >
            Subir Archivo Ahora
          </button>
        </div>
      ) : viewLayout === 'grid' ? (
        /* VISTA DE CUADRÍCULA */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedFiles.map((file) => {
            const isSelected = selectedFileIds.includes(file.id);
            const isImage = file.dataUri && (file.dataUri.startsWith('data:image') || ['.png', '.jpg', '.jpeg', '.webp'].includes(file.extension.toLowerCase()));

            return (
              <div
                key={file.id}
                className={`p-3.5 rounded-2xl bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between space-y-3 group hover:shadow-md ${
                  isSelected
                    ? 'border-indigo-600 dark:border-cyan-400 ring-2 ring-indigo-500/20 bg-indigo-50/20 dark:bg-cyan-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="space-y-2.5">
                  {/* Top line: Selection checkbox, favorite star and options */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectFile(file.id)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => toggleFileFavorite(file.id)}
                        className={`p-1 rounded-md transition-colors cursor-pointer ${
                          file.isFavorite ? 'text-amber-400' : 'text-slate-300 hover:text-amber-400'
                        }`}
                        title={file.isFavorite ? 'Quitar de favoritos' : 'Marcar como favorito'}
                      >
                        <Star className={`w-3.5 h-3.5 ${file.isFavorite ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {getStatusBadge(file.status)}
                      <span className="text-[10px] font-mono text-slate-400">
                        {file.createdAt}
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail / Image Preview */}
                  <div
                    onClick={() => setPreviewFile(file)}
                    className="relative w-full h-36 rounded-xl bg-slate-100 dark:bg-slate-800/80 overflow-hidden border border-slate-200/80 dark:border-slate-750 flex items-center justify-center cursor-pointer group/thumb"
                  >
                    {isImage ? (
                      <img
                        src={file.dataUri || file.url}
                        alt={file.name}
                        className="max-h-full max-w-full object-contain p-2 group-hover/thumb:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-slate-400">
                        {getFileIcon(file.extension)}
                        <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
                          {file.extension.replace('.', '') || 'DOC'}
                        </span>
                      </div>
                    )}

                    {/* Hover Inspection Overlay */}
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                      <Eye className="w-4 h-4" />
                      <span className="text-[11px] font-bold">Ver Detalles</span>
                    </div>
                  </div>

                  {/* Title & Metadata */}
                  <div>
                    <h4
                      className="text-xs font-bold text-slate-900 dark:text-white truncate"
                      title={file.name}
                    >
                      {file.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400 font-mono">
                      <span>{file.extension.toUpperCase()}</span>
                      <span>·</span>
                      <span>{formatBytes(file.sizeBytes)}</span>
                      {file.dimensions?.widthCm && file.dimensions?.heightCm && (
                        <>
                          <span>·</span>
                          <span>{file.dimensions.widthCm}x{file.dimensions.heightCm} cm</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Folder & Subfolder Tags */}
                  <div className="flex flex-wrap items-center gap-1 text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 truncate max-w-[140px]">
                      📁 {FOLDER_LABELS[file.folder]?.split(' ')[0] || file.folder}
                    </span>
                    {file.subfolder && (
                      <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/50 truncate max-w-[110px]">
                        📂 {file.subfolder}
                      </span>
                    )}
                    {file.projectName && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50 truncate max-w-[120px]">
                        🏷 {file.projectName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-1">
                  {/* Action 1: Open in Design Studio */}
                  <button
                    type="button"
                    onClick={() => openInDesignStudio(file)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold text-indigo-600 dark:text-cyan-400 hover:bg-indigo-50 dark:hover:bg-cyan-950/40 transition-colors cursor-pointer"
                    title="Abrir este arte en el Estudio de Diseño con todas sus capas editables"
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>Estudio</span>
                  </button>

                  {/* Action 2: Send to 3D */}
                  <button
                    type="button"
                    onClick={() => setSend3DFile(file)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Enviar y proyectar como estampado en el Probador 3D"
                  >
                    <Box className="w-3.5 h-3.5 text-cyan-500" />
                    <span>3D</span>
                  </button>

                  {/* Action 3: Photo Editor (if image) */}
                  {isImage && (
                    <button
                      type="button"
                      onClick={() => openInImageEditor(file.dataUri || file.url || '')}
                      className="p-1 rounded-lg text-slate-500 hover:text-indigo-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Editar foto (eliminar fondo IA, nitidez, convolución)"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Action 4: Download */}
                  <button
                    type="button"
                    onClick={() => StorageService.downloadStoredFile(file)}
                    className="p-1 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Descargar archivo al dispositivo"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  {/* Action 5: Duplicate */}
                  <button
                    type="button"
                    onClick={() => handleDuplicateFile(file)}
                    className="p-1 rounded-lg text-slate-500 hover:text-indigo-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Duplicar archivo"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {/* Action 6: Delete */}
                  <button
                    type="button"
                    onClick={() => setFileToDelete(file)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Eliminar archivo con confirmación"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VISTA DE TABLA */
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="p-3 w-10">
                    <input
                      type="checkbox"
                      checked={selectedFileIds.length === sortedFiles.length && sortedFiles.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                    />
                  </th>
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Carpeta</th>
                  <th className="p-3">Dimensiones / DPI</th>
                  <th className="p-3">Tamaño</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Fecha</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {sortedFiles.map((file) => {
                  const isSelected = selectedFileIds.includes(file.id);
                  return (
                    <tr
                      key={file.id}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                        isSelected ? 'bg-indigo-50/20 dark:bg-cyan-950/20' : ''
                      }`}
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectFile(file.id)}
                          className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          {getFileIcon(file.extension)}
                          <div className="truncate max-w-[200px] sm:max-w-[280px]">
                            <button
                              type="button"
                              onClick={() => setPreviewFile(file)}
                              className="font-bold text-slate-900 dark:text-white hover:underline text-left truncate block"
                            >
                              {file.name}
                            </button>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {file.extension.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-slate-600 dark:text-slate-400 text-[11px]">
                          {FOLDER_LABELS[file.folder]?.split(' ')[0] || file.folder}
                          {file.subfolder ? ` / ${file.subfolder}` : ''}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        {file.dimensions?.widthCm && file.dimensions?.heightCm
                          ? `${file.dimensions.widthCm} x ${file.dimensions.heightCm} cm (${file.dimensions.dpi || 300} DPI)`
                          : 'Estándar'}
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        {formatBytes(file.sizeBytes)}
                      </td>
                      <td className="p-3">{getStatusBadge(file.status)}</td>
                      <td className="p-3 font-mono text-[11px] text-slate-500">
                        {file.createdAt}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openInDesignStudio(file)}
                            className="p-1.5 text-indigo-600 dark:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                            title="Abrir en Estudio de Diseño"
                          >
                            <Palette className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setSend3DFile(file)}
                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                            title="Enviar a 3D"
                          >
                            <Box className="w-4 h-4 text-cyan-500" />
                          </button>
                          <button
                            type="button"
                            onClick={() => StorageService.downloadStoredFile(file)}
                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                            title="Descargar"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setFileToDelete(file)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* MODAL 1: VISTA PREVIA & DETALLES DEL ARCHIVO */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {getFileIcon(previewFile.extension)}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-md">
                    {previewFile.name}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {previewFile.extension.toUpperCase()} · {formatBytes(previewFile.sizeBytes)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Image Preview + Metadata Grid */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Preview Box */}
              <div className="w-full h-72 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden p-4">
                {previewFile.dataUri && (previewFile.dataUri.startsWith('data:image') || ['.png', '.jpg', '.jpeg', '.webp', '.svg'].includes(previewFile.extension.toLowerCase())) ? (
                  <img
                    src={previewFile.dataUri || previewFile.url}
                    alt={previewFile.name}
                    className="max-h-full max-w-full object-contain shadow-sm"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <FileText className="w-12 h-12" />
                    <span className="text-xs font-semibold">
                      Archivo {previewFile.extension.toUpperCase()} listo para producción
                    </span>
                  </div>
                )}
              </div>

              {/* Metadata Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Ubicación</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {FOLDER_LABELS[previewFile.folder]?.split(' ')[0]}
                    {previewFile.subfolder ? ` / ${previewFile.subfolder}` : ''}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Dimensiones Físicas</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                    {previewFile.dimensions?.widthCm && previewFile.dimensions?.heightCm
                      ? `${previewFile.dimensions.widthCm} x ${previewFile.dimensions.heightCm} cm`
                      : 'No especificado'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Densidad / Calidad</span>
                  <span className="font-semibold text-emerald-600 dark:text-cyan-400 font-mono">
                    {previewFile.dimensions?.dpi || 300} DPI (Óptimo)
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Estado</span>
                  <select
                    value={previewFile.status || 'en_progreso'}
                    onChange={(e) => {
                      const updatedStatus = e.target.value as StoredFile['status'];
                      updateStoredFile(previewFile.id, { status: updatedStatus });
                      setPreviewFile((prev) => (prev ? { ...prev, status: updatedStatus } : null));
                    }}
                    className="mt-0.5 text-xs font-bold px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="terminado">Terminado</option>
                    <option value="en_progreso">En Progreso</option>
                    <option value="borrador">Borrador</option>
                    <option value="revision">Revisión</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const target = previewFile;
                    setPreviewFile(null);
                    setRenamingFile(target);
                    setRenameInput(target.name);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Renombrar</span>
                </button>

                <button
                  type="button"
                  onClick={() => StorageService.downloadStoredFile(previewFile)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const target = previewFile;
                    setPreviewFile(null);
                    setSend3DFile(target);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
                >
                  <Box className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Proyectar en 3D</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const target = previewFile;
                    setPreviewFile(null);
                    openInDesignStudio(target);
                  }}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Abrir en Estudio de Diseño</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CREAR CARPETA / SUBCARPETA */}
      {isNewFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
              <span>Crear Nueva Carpeta Textil</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Categoría Principal:
                </label>
                <select
                  value={newFolderCategory}
                  onChange={(e) => setNewFolderCategory(e.target.value as FileCategoryFolder)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {Object.entries(FOLDER_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nombre de la Subcarpeta o Colección:
                </label>
                <input
                  type="text"
                  placeholder="Ej: Colección Verano 2026, Estampados DTF..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsNewFolderModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCreateSubfolder}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 cursor-pointer"
              >
                Crear Carpeta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: MOVER ARCHIVOS SELECCIONADOS */}
      {isMoveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Folder className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
              <span>Mover {selectedFileIds.length} Archivo(s) Seleccionado(s)</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Carpeta de Destino:
                </label>
                <select
                  value={targetMoveFolder}
                  onChange={(e) => setTargetMoveFolder(e.target.value as FileCategoryFolder)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {Object.entries(FOLDER_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Subcarpeta (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ej: Temporada 1, Artes Finales..."
                  value={targetMoveSubfolder}
                  onChange={(e) => setTargetMoveSubfolder(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsMoveModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmBatchMove}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 cursor-pointer"
              >
                Mover Ahora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: RENOMBRAR ARCHIVO */}
      {renamingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
              <span>Renombrar Archivo</span>
            </h3>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">
                Nuevo nombre:
              </label>
              <input
                type="text"
                value={renameInput}
                onChange={(e) => setRenameInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRenamingFile(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveRename}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 cursor-pointer"
              >
                Guardar Nombre
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: ENVIAR AL PROBADOR 3D */}
      {send3DFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Box className="w-5 h-5 text-cyan-500" />
              <span>Proyectar en Simulador 3D</span>
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Selecciona la zona donde deseas posicionar el arte "{send3DFile.name}" sobre la prenda tridimensional.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Zona de Estampado:
                </label>
                <select
                  value={target3DZone}
                  onChange={(e) => setTarget3DZone(e.target.value as PrintZone3D)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="centro_frontal">Centro Frontal (Pecho)</option>
                  <option value="pecho_izquierdo">Pecho Izquierdo (Bolsillo / Escudo)</option>
                  <option value="pecho_derecho">Pecho Derecho</option>
                  <option value="espalda">Espalda Completa</option>
                  <option value="manga_izquierda">Manga Izquierda</option>
                  <option value="manga_derecha">Manga Derecha</option>
                  <option value="gorras">Frente de Gorra</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSend3DFile(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmSendTo3D}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-xs font-bold hover:from-indigo-500 hover:to-cyan-500 cursor-pointer shadow-sm"
              >
                Proyectar y Abrir 3D
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: CONFIRMACIÓN DE ELIMINAR ARCHIVO INDIVIDUAL */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                ¿Eliminar este archivo?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Se eliminará permanentemente "{fileToDelete.name}". Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={async () => {
                  await deleteStoredFile(fileToDelete.id);
                  setFileToDelete(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: CONFIRMACIÓN DE ELIMINACIÓN POR LOTE */}
      {isBatchDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                ¿Eliminar {selectedFileIds.length} archivos?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Se eliminarán permanentemente todos los archivos seleccionados de la bóveda de almacenamiento.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsBatchDeleteModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmBatchDelete}
                className="px-4 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 cursor-pointer"
              >
                Eliminar Todos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
