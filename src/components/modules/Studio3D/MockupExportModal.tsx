import React, { useState } from 'react';
import * as THREE from 'three';
import {
  X,
  Download,
  Camera,
  Layers,
  Sparkles,
  Check,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';

interface MockupExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  renderer: THREE.WebGLRenderer | null;
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  garmentName: string;
  onShowToast: (message: string, type: 'info' | 'success' | 'warning' | 'alert') => void;
}

export const MockupExportModal: React.FC<MockupExportModalProps> = ({
  isOpen,
  onClose,
  renderer,
  scene,
  camera,
  garmentName,
  onShowToast
}) => {
  const [exportFormat, setExportFormat] = useState<'png_transparent' | 'jpg_studio'>('png_transparent');
  const [resolution, setResolution] = useState<'1080p' | '2k' | '4k'>('2k');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewImages, setPreviewImages] = useState<{
    frontal?: string;
    trasera?: string;
    perspectiva?: string;
  }>({});

  if (!isOpen) return null;

  // Captura una vista con ángulos y configuración específica
  const captureAngle = async (
    camPos: [number, number, number],
    camTarget: [number, number, number],
    transparentBg: boolean
  ): Promise<string | null> => {
    if (!renderer || !scene || !camera) return null;

    const originalPos = camera.position.clone();
    const originalClearColor = new THREE.Color();
    renderer.getClearColor(originalClearColor);
    const originalClearAlpha = renderer.getClearAlpha();

    // Guardar visibilidad del piso para fondos transparentes
    const floor = scene.getObjectByName('studio_floor_group');
    const floorPrevVis = floor ? floor.visible : true;

    try {
      if (transparentBg) {
        renderer.setClearColor(0x000000, 0);
        if (floor) floor.visible = false;
      } else {
        renderer.setClearColor(0xf1f5f9, 1);
        if (floor) floor.visible = true;
      }

      camera.position.set(...camPos);
      camera.lookAt(...camTarget);

      // Renderizar frame
      renderer.render(scene, camera);

      const mimeType = transparentBg ? 'image/png' : 'image/jpeg';
      const dataUri = renderer.domElement.toDataURL(mimeType, 0.95);

      // Restaurar estado
      camera.position.copy(originalPos);
      renderer.setClearColor(originalClearColor, originalClearAlpha);
      if (floor) floor.visible = floorPrevVis;

      return dataUri;
    } catch (err) {
      console.error('Error capturando mockup:', err);
      return null;
    }
  };

  const generateAllPreviews = async () => {
    setIsGenerating(true);
    const isTransparent = exportFormat === 'png_transparent';

    const frontalUri = await captureAngle([0, 1.45, 3.4], [0, 1.4, 0], isTransparent);
    const traseraUri = await captureAngle([0, 1.45, -3.6], [0, 1.4, 0], isTransparent);
    const perspectivaUri = await captureAngle([2.2, 1.7, 2.8], [0, 1.4, 0], isTransparent);

    setPreviewImages({
      frontal: frontalUri || undefined,
      trasera: traseraUri || undefined,
      perspectiva: perspectivaUri || undefined
    });

    setIsGenerating(false);
    onShowToast('Mockups tridimensionales renderizados con éxito.', 'success');
  };

  const handleDownloadSingle = (dataUri?: string, angleName: string = 'render') => {
    if (!dataUri) return;
    const ext = exportFormat === 'png_transparent' ? 'png' : 'jpg';
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = `mockup_${garmentName.toLowerCase().replace(/\s+/g, '_')}_${angleName}_${Date.now()}.${ext}`;
    link.click();
    onShowToast(`Mockup (${angleName}) descargado en alta calidad.`, 'success');
  };

  const handleDownloadAll = () => {
    if (previewImages.frontal) handleDownloadSingle(previewImages.frontal, 'frontal');
    setTimeout(() => {
      if (previewImages.trasera) handleDownloadSingle(previewImages.trasera, 'trasera');
    }, 400);
    setTimeout(() => {
      if (previewImages.perspectiva) handleDownloadSingle(previewImages.perspectiva, 'perspectiva');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100 dark:bg-cyan-950/60 text-indigo-600 dark:text-cyan-400 rounded-xl">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Exportar Mockups Profesionales 3D
              </h2>
              <p className="text-xs text-slate-500">
                Renders de alta resolución inspirados en fotografía comercial y e-commerce (Pacdora Standard)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Configuración de Render */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Fondo y Formato de Salida:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setExportFormat('png_transparent')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    exportFormat === 'png_transparent'
                      ? 'border-indigo-600 dark:border-cyan-400 bg-indigo-50/70 dark:bg-cyan-950/40 font-bold'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <div className="text-xs text-slate-900 dark:text-white">PNG Transparente</div>
                  <div className="text-[10px] text-slate-400">Sin fondo (recorte alfa)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setExportFormat('jpg_studio')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    exportFormat === 'jpg_studio'
                      ? 'border-indigo-600 dark:border-cyan-400 bg-indigo-50/70 dark:bg-cyan-950/40 font-bold'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <div className="text-xs text-slate-900 dark:text-white">JPG con Estudio</div>
                  <div className="text-[10px] text-slate-400">Fondo e iluminación 3D</div>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Calidad de Renderizado:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '1080p', label: '1080p', desc: 'Rápido' },
                  { id: '2k', label: '2K QHD', desc: 'Recomendado' },
                  { id: '4k', label: '4K Ultra', desc: 'Impresión 300DPI' }
                ].map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setResolution(q.id as any)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      resolution === q.id
                        ? 'border-indigo-600 dark:border-cyan-400 bg-indigo-50/70 dark:bg-cyan-950/40 font-bold'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-xs text-slate-900 dark:text-white">{q.label}</div>
                    <div className="text-[9px] text-slate-400">{q.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Botón de Generación */}
          <div className="flex justify-center pt-2">
            <button
              type="button"
              disabled={isGenerating}
              onClick={generateAllPreviews}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white dark:bg-cyan-600 dark:hover:bg-cyan-500 font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Procesando ángulos 3D en WebGL...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Renderizar Vistas (Frente, Espalda y Perspectiva)</span>
                </>
              )}
            </button>
          </div>

          {/* Vistas previas renderizadas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Vistas Renderizadas:
              </span>
              {(previewImages.frontal || previewImages.trasera || previewImages.perspectiva) && (
                <button
                  type="button"
                  onClick={handleDownloadAll}
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:underline cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar Pack Completo (3 Renders)</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Vista Frontal */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 text-center">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Vista Frontal 0°
                </span>
                <div className="aspect-square bg-checkerboard rounded-lg flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
                  {previewImages.frontal ? (
                    <img src={previewImages.frontal} alt="Frontal" className="w-full h-full object-contain" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                {previewImages.frontal && (
                  <button
                    type="button"
                    onClick={() => handleDownloadSingle(previewImages.frontal, 'frontal')}
                    className="w-full py-1 text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:bg-indigo-50 dark:hover:bg-cyan-950/40 rounded-lg transition-colors cursor-pointer"
                  >
                    Descargar Vista
                  </button>
                )}
              </div>

              {/* Vista Trasera */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 text-center">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Vista Trasera 180°
                </span>
                <div className="aspect-square bg-checkerboard rounded-lg flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
                  {previewImages.trasera ? (
                    <img src={previewImages.trasera} alt="Trasera" className="w-full h-full object-contain" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                {previewImages.trasera && (
                  <button
                    type="button"
                    onClick={() => handleDownloadSingle(previewImages.trasera, 'trasera')}
                    className="w-full py-1 text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:bg-indigo-50 dark:hover:bg-cyan-950/40 rounded-lg transition-colors cursor-pointer"
                  >
                    Descargar Vista
                  </button>
                )}
              </div>

              {/* Vista Perspectiva */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 text-center">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Vista Lateral 3D
                </span>
                <div className="aspect-square bg-checkerboard rounded-lg flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
                  {previewImages.perspectiva ? (
                    <img src={previewImages.perspectiva} alt="Perspectiva" className="w-full h-full object-contain" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                {previewImages.perspectiva && (
                  <button
                    type="button"
                    onClick={() => handleDownloadSingle(previewImages.perspectiva, 'perspectiva')}
                    className="w-full py-1 text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:bg-indigo-50 dark:hover:bg-cyan-950/40 rounded-lg transition-colors cursor-pointer"
                  >
                    Descargar Vista
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pie */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
