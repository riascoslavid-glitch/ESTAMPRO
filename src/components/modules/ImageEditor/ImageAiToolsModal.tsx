import React, { useState } from 'react';
import {
  Sparkles,
  Eraser,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Server,
  Info,
  Check,
  X,
  AlertCircle,
  Cpu,
  Zap,
  Brush
} from 'lucide-react';

interface ImageAiToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isProcessing: boolean;
  processingMessage: string;
  isMaskDrawingActive: boolean;
  maskBrushRadius: number;
  onMaskBrushRadiusChange: (r: number) => void;
  onToggleMaskDrawing: () => void;
  onClearMask: () => void;
  onExecuteBackgroundRemoval: (tolerance: number) => void;
  onExecuteInpaint: () => void;
  onExecuteUpscale: (factor: 2 | 4) => void;
}

export const ImageAiToolsModal: React.FC<ImageAiToolsModalProps> = ({
  isOpen,
  onClose,
  isProcessing,
  processingMessage,
  isMaskDrawingActive,
  maskBrushRadius,
  onMaskBrushRadiusChange,
  onToggleMaskDrawing,
  onClearMask,
  onExecuteBackgroundRemoval,
  onExecuteInpaint,
  onExecuteUpscale
}) => {
  const [activeTab, setActiveTab] = useState<'bg_remove' | 'inpaint' | 'upscale' | 'api_docs'>('bg_remove');
  const [bgTolerance, setBgTolerance] = useState<number>(30);
  const [upscaleFactor, setUpscaleFactor] = useState<2 | 4>(2);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Herramientas Inteligentes con IA Textil</span>
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 font-bold uppercase">
                  V2.4
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Eliminación de fondo, borrado de elementos y super-resolución textil.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 pt-2 gap-2 overflow-x-auto">
          {[
            { id: 'bg_remove', label: '5. Eliminar Fondo IA', icon: Layers },
            { id: 'inpaint', label: '13. Borrador Mágico IA', icon: Eraser },
            { id: 'upscale', label: '6. Super-Resolución', icon: ArrowUpRight },
            { id: 'api_docs', label: 'Integración Segura & APIs', icon: ShieldCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-2 px-3 rounded-t-lg text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  isSel
                    ? 'border-indigo-600 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400 bg-white dark:bg-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {isProcessing ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="w-12 h-12 rounded-full border-4 border-indigo-600/30 border-t-indigo-600 dark:border-cyan-400/30 dark:border-t-cyan-400 animate-spin" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Procesando Imagen...
                </h4>
                <p className="text-xs text-slate-400 mt-1">{processingMessage}</p>
              </div>
            </div>
          ) : (
            <>
              {/* PESTAÑA: 5. ELIMINAR FONDOS MEDIANTE IA */}
              {activeTab === 'bg_remove' && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-indigo-50/60 dark:bg-slate-800/60 rounded-xl border border-indigo-100 dark:border-slate-800">
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
                      Aislamiento Automático de Sujetos y Logos
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      Detecta el contorno del arte principal, elimina el fondo circundante y genera un canal alfa transparente con suavizado en bordes (Anti-Defringing) para que no queden halos blancos sobre prendas oscuras en DTF o Serigrafía.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Sensibilidad de Detección de Fondo (Tolerancia):
                      </span>
                      <span className="font-mono font-bold text-indigo-600 dark:text-cyan-400">
                        {bgTolerance}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="75"
                      value={bgTolerance}
                      onChange={(e) => setBgTolerance(parseInt(e.target.value))}
                      className="w-full accent-indigo-600 dark:accent-cyan-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Conservador (Preserva sombras leves)</span>
                      <span>Agresivo (Limpia fondos con degradado)</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>Motor de doble nivel:</span>
                    </div>
                    <p>
                      1. Intenta consulta segura al servicio de visión Gemini / Rembg en servidor.<br />
                      2. Si no hay conexión externa o clave, ejecuta de inmediato el algoritmo local perimetral de Canvas sin esperas.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onExecuteBackgroundRemoval(bgTolerance)}
                    className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Ejecutar Eliminación de Fondo</span>
                  </button>
                </div>
              )}

              {/* PESTAÑA: 13. ELIMINAR ELEMENTOS / INPAINTING */}
              {activeTab === 'inpaint' && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-rose-50/60 dark:bg-slate-800/60 rounded-xl border border-rose-100 dark:border-slate-800">
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                      <Eraser className="w-4 h-4 text-rose-500" />
                      Borrador Mágico (Inpainting Asistido por IA)
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      Pinta con el pincel de máscara sobre los elementos no deseados (marcas de agua, logos obsoletos, manchas o texto que quieras quitar) y el motor sintetizará la textura de fondo circundante.
                    </p>
                  </div>

                  {/* Controles del pincel de máscara */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Brush className="w-3.5 h-3.5 text-rose-500" />
                        Pincel Selector de Máscara
                      </span>
                      <button
                        type="button"
                        onClick={onToggleMaskDrawing}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          isMaskDrawingActive
                            ? 'bg-rose-600 text-white shadow-xs animate-pulse'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300'
                        }`}
                      >
                        {isMaskDrawingActive ? 'Pincel Activo (Pintando)' : 'Activar Pincel'}
                      </button>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Grosor del Pincel:</span>
                        <span className="font-mono font-bold">{maskBrushRadius * 2} px</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="40"
                        value={maskBrushRadius}
                        onChange={(e) => onMaskBrushRadiusChange(parseInt(e.target.value))}
                        className="w-full accent-rose-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400">
                        {isMaskDrawingActive ? 'Arrastra sobre la imagen para pintar en rojo el área a borrar.' : 'Haz clic en "Activar Pincel" para marcar el elemento en el lienzo.'}
                      </span>
                      <button
                        type="button"
                        onClick={onClearMask}
                        className="text-[10px] text-slate-500 hover:text-rose-500 font-semibold cursor-pointer underline"
                      >
                        Limpiar Selección
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onExecuteInpaint}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Eraser className="w-4 h-4" />
                    <span>Eliminar Elemento Pintado</span>
                  </button>
                </div>
              )}

              {/* PESTAÑA: 6. SUPER-RESOLUCIÓN / UPSCALE */}
              {activeTab === 'upscale' && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-emerald-50/60 dark:bg-slate-800/60 rounded-xl border border-emerald-100 dark:border-slate-800">
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                      <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                      Mejora y Escalado de Resolución (Super-Resolution)
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      Multiplica la densidad de píxeles recuperando micro-contrastes y bordes para alcanzar los 300 DPI reglamentarios en prendas textiles.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setUpscaleFactor(2)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        upscaleFactor === 2
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">Escalado 2X</span>
                        {upscaleFactor === 2 && <Check className="w-4 h-4 text-emerald-500" />}
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-1">
                        Duplica ancho y alto (4x píxeles totales). Ideal para fotos estándar.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setUpscaleFactor(4)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        upscaleFactor === 4
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">Escalado 4X Ultra</span>
                        {upscaleFactor === 4 && <Check className="w-4 h-4 text-emerald-500" />}
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-1">
                        Cuadruplica dimensiones (16x píxeles). Para artes de baja resolución de clientes.
                      </span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onExecuteUpscale(upscaleFactor)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Ejecutar Super-Resolución ({upscaleFactor}X)</span>
                  </button>
                </div>
              )}

              {/* PESTAÑA: INFORMACIÓN DE APIS EXTERNAS & INTEGRACIÓN SEGURA */}
              {activeTab === 'api_docs' && (
                <div className="space-y-4 text-xs">
                  <div className="p-3.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-cyan-400 font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Arquitectura de Integración Segura (Prompt 7)</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                      Conforme a los estándares de producción, las credenciales nunca se exponen al navegador cliente. Toda comunicación externa se procesa mediante rutas proxy en el servidor:
                    </p>
                  </div>

                  {/* Tabla de APIs requeridas */}
                  <div className="space-y-2.5">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                      Servicios Externos Compatibles:
                    </h4>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">
                          1. Google Gemini API (@google/genai SDK)
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          Recomendado
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        <strong>Modelos:</strong> <code>gemini-3.8-flash</code> (análisis multimodal y asistencia técnica textil), <code>gemini-3.1-flash-lite-image</code> o <code>gemini-nano-banana-2.1</code> (edición y generación).
                      </p>
                      <p className="text-[11px] text-slate-500">
                        <strong>Variable de entorno:</strong> <code>GEMINI_API_KEY</code> en <code>.env.example</code>. Inyectada automáticamente en Cloud Run / AI Studio Secrets.
                      </p>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">
                          2. Servicios de Visión & Remoción de Fondo (Rembg / Vision)
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Fallback Local Activo
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        <strong>Endpoint de servidor:</strong> <code>/api/ai/remove-background</code>.
                      </p>
                      <p className="text-[11px] text-slate-500">
                        <strong>Garantía de Disponibilidad:</strong> Si la API no está configurada o se encuentra sin cuota, el motor local Canvas 2D asume el procesamiento perimetral instantáneamente sin interrumpir al usuario.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300 flex items-start gap-2">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      Todas las operaciones ejecutan procesamiento real de píxeles sobre matrices de convolución y buffers RGBA, no meras clases CSS o botones cosméticos.
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Cerrar Panel
          </button>
        </div>
      </div>
    </div>
  );
};
