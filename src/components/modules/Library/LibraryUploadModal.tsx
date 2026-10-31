import React, { useState, useRef } from 'react';
import {
  LibraryResourceItem,
  LibraryFolder,
  LibraryCategory,
  LibraryPermission,
  LIBRARY_CATEGORIES_META,
  LibraryFormat
} from '../../../types/library';
import { X, Upload, Link2, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface LibraryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: LibraryFolder[];
  onUploadSuccess: (resource: LibraryResourceItem) => void;
}

export const LibraryUploadModal: React.FC<LibraryUploadModalProps> = ({
  isOpen,
  onClose,
  folders,
  onUploadSuccess
}) => {
  const [tab, setTab] = useState<'file' | 'url'>('file');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<LibraryCategory>('camisetas');
  const [folderId, setFolderId] = useState<string>('');
  const [permission, setPermission] = useState<LibraryPermission>('taller');
  const [tagsInput, setTagsInput] = useState('');
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [detectedFormat, setDetectedFormat] = useState<LibraryFormat>('PNG');
  const [fileSizeBytes, setFileSizeBytes] = useState<number>(0);
  const [urlInput, setUrlInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setFileSizeBytes(file.size);

    // Auto title if empty
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }

    // Detect format
    const nameLower = file.name.toLowerCase();
    if (nameLower.endsWith('.svg')) setDetectedFormat('SVG');
    else if (nameLower.endsWith('.png')) setDetectedFormat('PNG');
    else if (nameLower.endsWith('.jpg') || nameLower.endsWith('.jpeg')) setDetectedFormat('JPG');
    else if (nameLower.endsWith('.ai')) setDetectedFormat('AI');
    else if (nameLower.endsWith('.eps')) setDetectedFormat('EPS');
    else if (nameLower.endsWith('.psd')) setDetectedFormat('PSD');
    else if (nameLower.endsWith('.pdf')) setDetectedFormat('PDF');
    else setDetectedFormat('PNG');

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUri(reader.result as string);
    };
    reader.onerror = () => {
      setErrorMessage('No se pudo leer el archivo seleccionado.');
    };
    reader.readAsDataURL(file);
  };

  const handleUrlLoad = () => {
    if (!urlInput.trim()) return;
    setErrorMessage(null);
    setPreviewUri(urlInput.trim());
    if (!title) {
      setTitle('Recurso Importado Web');
    }
    setDetectedFormat('PNG');
    setFileSizeBytes(45000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Ingresa un título para el diseño.');
      return;
    }
    if (!previewUri) {
      setErrorMessage('Selecciona un archivo o ingresa una URL válida.');
      return;
    }

    setIsProcessing(true);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const newResource: LibraryResourceItem = {
      id: `lib-user-${Date.now().toString(36)}`,
      title: title.trim(),
      category,
      format: detectedFormat,
      tags: tags.length > 0 ? tags : [category, 'personalizado'],
      widthPx: 1200,
      heightPx: 1200,
      sizeBytes: fileSizeBytes || 25000,
      previewUrl: previewUri,
      dataUri: previewUri,
      folderId: folderId || undefined,
      isFavorite: false,
      permission,
      isCustom: true,
      recommendedTechnique: 'dtf',
      dpi: 300,
      colorCount: 4,
      createdAt: new Date().toISOString()
    };

    onUploadSuccess(newResource);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-cyan-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Subir Recurso a la Biblioteca
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher: Archivo vs URL */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 px-4 pt-2">
          <button
            type="button"
            onClick={() => setTab('file')}
            className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
              tab === 'file'
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Subir Archivo Local (SVG, PNG, AI, PSD)</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('url')}
            className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
              tab === 'url'
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Importar desde URL</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Source Input */}
          {tab === 'file' ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-cyan-500 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 text-center cursor-pointer transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".svg,.png,.jpg,.jpeg,.ai,.eps,.psd,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              {previewUri ? (
                <div className="flex items-center justify-center gap-4">
                  <div className="w-20 h-20 rounded-lg bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center p-1">
                    <img src={previewUri} alt="Preview" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="text-left text-xs">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Archivo cargado
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 block mt-0.5">
                      Formato detectado: <strong className="text-slate-800 dark:text-slate-200">{detectedFormat}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="mt-1.5 text-cyan-500 hover:underline text-[11px]"
                    >
                      Cambiar archivo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Upload className="w-8 h-8 mx-auto text-slate-400 dark:text-slate-500" />
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Haz clic para examinar o arrastra tu archivo aquí
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Soporta SVG vectorial, PNG transparente, AI, EPS, PSD y JPG a 300 DPI
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                URL directa de la imagen
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://ejemplo.com/diseno-textil.png"
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleUrlLoad}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                >
                  Cargar
                </button>
              </div>
              {previewUri && (
                <div className="p-2 rounded-lg bg-slate-900 flex items-center gap-3">
                  <img src={previewUri} alt="Preview" className="w-12 h-12 object-contain" />
                  <span className="text-xs text-emerald-400">Vista previa lista</span>
                </div>
              )}
            </div>
          )}

          {/* Title input */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Nombre del Diseño *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Escudo Deportivo Águila Imperial"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>

          {/* Category & Folder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Categoría (15 Secciones)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as LibraryCategory)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                {LIBRARY_CATEGORIES_META.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Carpeta Organizativa
              </label>
              <select
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                <option value="">(Sin carpeta / Raíz)</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Permissions & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Nivel de Permisos
              </label>
              <select
                value={permission}
                onChange={(e) => setPermission(e.target.value as LibraryPermission)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                <option value="taller">Equipo del Taller (Interno)</option>
                <option value="publico">Público (Clientes & Catálogo)</option>
                <option value="privado">Privado (Solo Administrador)</option>
                <option value="cliente">Exclusivo de Cliente</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Etiquetas (separadas por coma)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="retro, serigrafia, vector, 2026"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isProcessing || !previewUri || !title.trim()}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Upload className="w-4 h-4" />
              <span>Guardar en Biblioteca</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
