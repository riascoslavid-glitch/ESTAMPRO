import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Project, ProjectLayer, ProjectPrintLocation, PrintingTechniqueId } from '../../types';
import { PRINTING_TECHNIQUES, GARMENT_CATALOG } from '../../constants/techniques';
import { 
  X, 
  Save, 
  Layers, 
  MapPin, 
  Settings, 
  Shirt, 
  Clock, 
  User, 
  Check, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock,
  Sparkles
} from 'lucide-react';

interface ProjectDetailsModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ project, onClose }) => {
  const { updateProject, addNotification } = useApp();
  const { currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [garmentName, setGarmentName] = useState('');
  const [garmentColor, setGarmentColor] = useState('');
  const [techniqueId, setTechniqueId] = useState<PrintingTechniqueId>('dtf');
  const [quantity, setQuantity] = useState<number>(30);
  const [layers, setLayers] = useState<ProjectLayer[]>([]);
  const [locations, setLocations] = useState<ProjectPrintLocation[]>([]);
  const [underbaseWhite, setUnderbaseWhite] = useState(true);
  const [dpi, setDpi] = useState(300);
  const [autoSavedTime, setAutoSavedTime] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'capas' | 'ubicaciones' | 'preprensatecnica'>('general');

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setClientName(project.clientName);
      setGarmentName(project.garmentName);
      setGarmentColor(project.garmentColor);
      setTechniqueId(project.techniqueId);
      setQuantity(project.quantity);
      setLayers(project.layers || [
        { id: 'layer-1', name: 'Arte Principal (Vector)', type: 'vector', visible: true, locked: false, opacity: 1 },
        { id: 'layer-2', name: 'Base Blanca (Underbase)', type: 'raster', visible: true, locked: true, opacity: 1, spotColorName: 'White Mask' }
      ]);
      setLocations(project.locations || [
        { id: 'loc-1', areaName: 'Pecho Frente', widthCm: 28, heightCm: 35, offsetX: 0, offsetY: 0 }
      ]);
      setUnderbaseWhite(project.settings?.underbaseWhite ?? true);
      setDpi(project.settings?.dpi || 300);
    }
  }, [project]);

  // Section 5: Guardado Automático
  useEffect(() => {
    if (!project) return;

    const timer = setTimeout(() => {
      const now = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      updateProject(project.id, {
        title,
        clientName,
        garmentName,
        garmentColor,
        techniqueId,
        quantity,
        layers,
        locations,
        settings: {
          dpi,
          colorProfile: 'CMYK FOGRA39',
          underbaseWhite
        },
        autoSavedAt: now,
        updatedAt: new Date().toLocaleDateString('es-ES')
      });
      setAutoSavedTime(now);
    }, 2500); // Debounce auto-save after 2.5 seconds of modification

    return () => clearTimeout(timer);
  }, [title, clientName, garmentName, garmentColor, techniqueId, quantity, layers, locations, underbaseWhite, dpi]);

  if (!project) return null;

  // Manual save
  const handleManualSave = () => {
    const now = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    updateProject(project.id, {
      title,
      clientName,
      garmentName,
      garmentColor,
      techniqueId,
      quantity,
      layers,
      locations,
      settings: {
        dpi,
        colorProfile: 'CMYK FOGRA39',
        underbaseWhite
      },
      autoSavedAt: now,
      updatedAt: new Date().toLocaleDateString('es-ES')
    });
    setAutoSavedTime(now);
    addNotification('Proyecto Guardado', `Se guardaron todos los cambios de "${title}".`, 'success', 'inicio');
  };

  const handleAddLayer = () => {
    const newLayer: ProjectLayer = {
      id: `layer-${Date.now()}`,
      name: `Capa ${layers.length + 1} (Arte)`,
      type: 'vector',
      visible: true,
      locked: false,
      opacity: 1
    };
    setLayers([...layers, newLayer]);
  };

  const handleAddLocation = () => {
    const newLoc: ProjectPrintLocation = {
      id: `loc-${Date.now()}`,
      areaName: 'Espalda Completa',
      widthCm: 35,
      heightCm: 45,
      offsetX: 0,
      offsetY: 0
    };
    setLocations([...locations, newLoc]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                ID: {project.id} · Creado el {project.createdAt}
              </span>
              {autoSavedTime && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Auto-guardado {autoSavedTime}
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {title || project.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleManualSave}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 dark:bg-cyan-600 dark:hover:bg-cyan-500 rounded-lg shadow-sm transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar Manual</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-1 px-6 pt-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'general'
                ? 'border-indigo-600 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>Datos de Prenda & Cliente</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('capas')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'capas'
                ? 'border-indigo-600 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Capas de Impresión ({layers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ubicaciones')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'ubicaciones'
                ? 'border-indigo-600 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Ubicaciones & Medidas ({locations.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preprensatecnica')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'preprensatecnica'
                ? 'border-indigo-600 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Pre-prensa & RIP</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Nombre del Proyecto
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Cliente / Marca
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Prenda Base
                  </label>
                  <input
                    type="text"
                    value={garmentName}
                    onChange={(e) => setGarmentName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Color de Prenda
                  </label>
                  <input
                    type="text"
                    value={garmentColor}
                    onChange={(e) => setGarmentColor(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Técnica de Estampado
                  </label>
                  <select
                    value={techniqueId}
                    onChange={(e) => setTechniqueId(e.target.value as PrintingTechniqueId)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {PRINTING_TECHNIQUES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Cantidad de Prendas
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono tabular-nums rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Propietario info (Section 5 & 6: Usuario propietario & Seguridad) */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-500" />
                  <span>Propietario del Proyecto: <strong>{project.ownerEmail || currentUser?.email || 'harmonyestampadosr@gmail.com'}</strong></span>
                </div>
                <span className="font-mono text-[11px] text-slate-400">UID: {project.ownerId}</span>
              </div>
            </div>
          )}

          {activeTab === 'capas' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Control de capas de diseño vectorial y separaciones de taller.
                </span>
                <button
                  type="button"
                  onClick={handleAddLayer}
                  className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Capa</span>
                </button>
              </div>

              <div className="space-y-2">
                {layers.map((layer, idx) => (
                  <div
                    key={layer.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...layers];
                          updated[idx].visible = !updated[idx].visible;
                          setLayers(updated);
                        }}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
                        title={layer.visible ? 'Ocultar capa' : 'Mostrar capa'}
                      >
                        {layer.visible ? <Eye className="w-4 h-4 text-cyan-500" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...layers];
                          updated[idx].locked = !updated[idx].locked;
                          setLayers(updated);
                        }}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
                        title={layer.locked ? 'Desbloquear' : 'Bloquear'}
                      >
                        {layer.locked ? <Lock className="w-4 h-4 text-amber-500" /> : <Unlock className="w-4 h-4" />}
                      </button>

                      <input
                        type="text"
                        value={layer.name}
                        onChange={(e) => {
                          const updated = [...layers];
                          updated[idx].name = e.target.value;
                          setLayers(updated);
                        }}
                        className="bg-transparent font-medium text-slate-900 dark:text-white border-b border-transparent hover:border-slate-300 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-slate-400">
                        {layer.type.toUpperCase()}
                      </span>
                      {layers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setLayers(layers.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ubicaciones' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Zonas de estampado reglamentarias en la prenda.
                </span>
                <button
                  type="button"
                  onClick={handleAddLocation}
                  className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Ubicación</span>
                </button>
              </div>

              <div className="space-y-2">
                {locations.map((loc, idx) => (
                  <div
                    key={loc.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={loc.areaName}
                        onChange={(e) => {
                          const updated = [...locations];
                          updated[idx].areaName = e.target.value;
                          setLocations(updated);
                        }}
                        className="bg-transparent font-bold text-slate-900 dark:text-white border-b border-transparent hover:border-slate-300 focus:border-cyan-500 focus:outline-none"
                      />
                      {locations.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setLocations(locations.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[11px] text-slate-500 block">Ancho (cm)</span>
                        <input
                          type="number"
                          value={loc.widthCm}
                          onChange={(e) => {
                            const updated = [...locations];
                            updated[idx].widthCm = Number(e.target.value);
                            setLocations(updated);
                          }}
                          className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-500 block">Alto (cm)</span>
                        <input
                          type="number"
                          value={loc.heightCm}
                          onChange={(e) => {
                            const updated = [...locations];
                            updated[idx].heightCm = Number(e.target.value);
                            setLocations(updated);
                          }}
                          className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'preprensatecnica' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Resolución de Salida RIP (DPI)
                </label>
                <select
                  value={dpi}
                  onChange={(e) => setDpi(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value={300}>300 DPI (Estándar Profesional)</option>
                  <option value={600}>600 DPI (Alta Definición Fotográfica)</option>
                  <option value={150}>150 DPI (Borrador)</option>
                </select>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <input
                  type="checkbox"
                  id="underbase"
                  checked={underbaseWhite}
                  onChange={(e) => setUnderbaseWhite(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 dark:text-cyan-600 focus:ring-0"
                />
                <label htmlFor="underbase" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <span className="font-semibold block">Generar Base Blanca Automática (Underbase)</span>
                  <span className="text-[11px] text-slate-500 block">Necesaria para prendas oscuras en DTF y Serigrafía para opacidad 100%.</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">
            Los cambios se guardan automáticamente cada pocos segundos.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
  );
};
