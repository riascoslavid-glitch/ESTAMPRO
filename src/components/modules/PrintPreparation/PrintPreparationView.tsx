import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  PrintFormat,
  ColorProfile,
  DimensionUnit,
  PrePressMachine,
  PreflightIssue,
  PrepressArtwork,
  PrintPreparationConfig,
  SeparationPlate
} from '../../../types/printPreparation';
import {
  PREPRESS_MACHINES,
  PREPRESS_COLOR_PROFILES
} from '../../../constants/prepressMachines';
import {
  auditPreflight,
  renderPrepressCanvas,
  generateColorSeparations,
  convertToMm,
  convertFromMm,
  downloadFile
} from '../../../services/prepress/printPreparationEngine';
import { PreflightValidationPanel } from './PreflightValidationPanel';
import { ColorSeparationViewer } from './ColorSeparationViewer';
import { PrepressExportModal } from './PrepressExportModal';
import { PrepressMachineModal } from './PrepressMachineModal';
import {
  Printer,
  Sliders,
  Sparkles,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  FlipHorizontal,
  FlipVertical,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Settings2,
  Undo2,
  Palette,
  Ruler,
  FileCheck
} from 'lucide-react';

// Artes de muestra precargados de alta calidad para probar el flujo de pre-prensa
const SAMPLE_ARTWORKS: PrepressArtwork[] = [
  {
    id: 'sample_heavy_dtf',
    name: 'Logo Textil Calavera Vintage & Rosas',
    originalUrl: '/src/assets/images/garment_hoodie_french_terry_1793416400113.jpg',
    currentUrl: '/src/assets/images/garment_hoodie_french_terry_1793416400113.jpg',
    originalFormat: 'PNG',
    originalWidthPx: 3600,
    originalHeightPx: 4200,
    naturalDpi: 300,
    fileSizeBytes: 4250000,
    hasAlpha: true,
    hasDirtyAlphaHalos: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample_athletic_crest',
    name: 'Emblema Deportivo MotorClub 1984',
    originalUrl: '/src/assets/images/garment_tshirt_heavyweight_1793416398987.jpg',
    currentUrl: '/src/assets/images/garment_tshirt_heavyweight_1793416398987.jpg',
    originalFormat: 'PNG',
    originalWidthPx: 2400,
    originalHeightPx: 2800,
    naturalDpi: 300,
    fileSizeBytes: 2180000,
    hasAlpha: true,
    hasDirtyAlphaHalos: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample_trucker_patch',
    name: 'Parche Cuadrado Trucker Cap',
    originalUrl: '/src/assets/images/garment_trucker_cap_1793416400133.jpg',
    currentUrl: '/src/assets/images/garment_trucker_cap_1793416400133.jpg',
    originalFormat: 'JPG',
    originalWidthPx: 1200,
    originalHeightPx: 1200,
    naturalDpi: 150,
    fileSizeBytes: 890000,
    hasAlpha: false,
    hasDirtyAlphaHalos: false,
    createdAt: new Date().toISOString()
  }
];

export const PrintPreparationView: React.FC = () => {
  // Parque de máquinas disponibles
  const [machines, setMachines] = useState<PrePressMachine[]>(() => {
    const saved = localStorage.getItem('estampapro_prepress_machines');
    return saved ? JSON.parse(saved) : PREPRESS_MACHINES;
  });

  const [selectedMachineId, setSelectedMachineId] = useState<string>(machines[0].id);
  const activeMachine = machines.find((m) => m.id === selectedMachineId) || machines[0];

  // Arte actual cargado
  const [artwork, setArtwork] = useState<PrepressArtwork | null>(SAMPLE_ARTWORKS[0]);
  const [originalArtwork, setOriginalArtwork] = useState<PrepressArtwork | null>(SAMPLE_ARTWORKS[0]);

  // Configuración de pre-prensa
  const [config, setConfig] = useState<PrintPreparationConfig>({
    targetMachineId: activeMachine.id,
    unit: 'cm',
    width: 28, // 28 cm de ancho por defecto
    height: 33, // 33 cm de alto
    lockAspectRatio: true,
    dpi: 300,
    transparencyEnabled: true,
    colorProfile: 'CMYK FOGRA39 (Coated)',
    bleedMm: activeMachine.defaultBleedMm,
    marginMm: activeMachine.defaultMarginMm,
    mirrorHorizontal: activeMachine.requiresMirror,
    mirrorVertical: false,
    showRegistrationMarks: true,
    showColorBars: true,
    showBleedAndMargins: true,
    showDimensionsOverlay: true,
    showMachineBounds: true,
    separationMethod: 'underbase_cmyk',
    whiteUnderbaseChokePx: 2,
    whiteUnderbaseDensity: 100,
    exportFormat: activeMachine.supportedFormats[0] || 'PNG'
  });

  // Planchas de separación de color
  const [plates, setPlates] = useState<SeparationPlate[]>([]);
  const [isSeparating, setIsSeparating] = useState(false);

  // Auditoría pre-vuelo en vivo
  const [preflightIssues, setPreflightIssues] = useState<PreflightIssue[]>([]);

  // Modales
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isMachineModalOpen, setIsMachineModalOpen] = useState(false);

  // Zoom y visualización
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeTab, setActiveTab] = useState<'preview' | 'separations' | 'preflight'>('preview');

  // Referencias a elementos
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const artworkImgRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Cargar imagen del arte en memoria
  useEffect(() => {
    if (!artwork) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = artwork.currentUrl;
    img.onload = () => {
      artworkImgRef.current = img;
      renderCanvas();
      handleGenerateSeparations();
    };
  }, [artwork?.currentUrl]);

  // Sincronizar máquina cuando cambia
  useEffect(() => {
    setConfig((prev) => ({
      ...prev,
      targetMachineId: activeMachine.id,
      bleedMm: activeMachine.defaultBleedMm,
      marginMm: activeMachine.defaultMarginMm,
      mirrorHorizontal: activeMachine.requiresMirror,
      exportFormat: activeMachine.supportedFormats[0] || prev.exportFormat
    }));
  }, [selectedMachineId]);

  // Re-auditar pre-vuelo cada vez que cambia el arte, configuración o máquina
  useEffect(() => {
    const issues = auditPreflight(artwork, config, activeMachine);
    setPreflightIssues(issues);
  }, [artwork, config, activeMachine]);

  // Re-renderizar canvas cuando cambian parámetros clave
  const renderCanvas = useCallback(async () => {
    if (!canvasRef.current || !artworkImgRef.current) return;
    await renderPrepressCanvas(artworkImgRef.current, config, activeMachine, canvasRef.current);
  }, [config, activeMachine]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Generar canales de separación
  const handleGenerateSeparations = async () => {
    if (!artworkImgRef.current) return;
    setIsSeparating(true);
    try {
      const result = await generateColorSeparations(artworkImgRef.current, config);
      setPlates(result);
    } catch (err) {
      console.error('Error calculando separaciones:', err);
    } finally {
      setIsSeparating(false);
    }
  };

  // Guardar máquinas en localStorage
  const handleSaveMachine = (newMachine: PrePressMachine) => {
    const updated = [...machines.filter((m) => m.id !== newMachine.id), newMachine];
    setMachines(updated);
    localStorage.setItem('estampapro_prepress_machines', JSON.stringify(updated));
  };

  const handleDeleteMachine = (id: string) => {
    const updated = machines.filter((m) => m.id !== id);
    setMachines(updated);
    localStorage.setItem('estampapro_prepress_machines', JSON.stringify(updated));
    if (selectedMachineId === id && updated.length > 0) {
      setSelectedMachineId(updated[0].id);
    }
  };

  // Cargar archivo propio del usuario
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        // Detectar si tiene canal alfa
        const testCanvas = document.createElement('canvas');
        testCanvas.width = Math.min(100, img.width);
        testCanvas.height = Math.min(100, img.height);
        const testCtx = testCanvas.getContext('2d');
        let hasAlpha = false;
        if (testCtx) {
          testCtx.drawImage(img, 0, 0, testCanvas.width, testCanvas.height);
          const data = testCtx.getImageData(0, 0, testCanvas.width, testCanvas.height).data;
          for (let i = 3; i < data.length; i += 4) {
            if (data[i] < 250) {
              hasAlpha = true;
              break;
            }
          }
        }

        const ext = file.name.split('.').pop()?.toUpperCase() as PrintFormat;
        const validExt: PrintFormat = ['PNG', 'JPG', 'SVG', 'PDF', 'TIFF', 'EPS'].includes(ext)
          ? ext
          : 'PNG';

        const newArtwork: PrepressArtwork = {
          id: `custom_art_${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          originalUrl: dataUri,
          currentUrl: dataUri,
          originalFormat: validExt,
          originalWidthPx: img.naturalWidth,
          originalHeightPx: img.naturalHeight,
          naturalDpi: 300,
          fileSizeBytes: file.size,
          hasAlpha,
          hasDirtyAlphaHalos: false,
          createdAt: new Date().toISOString()
        };

        setArtwork(newArtwork);
        setOriginalArtwork(newArtwork);

        // Ajustar medidas automáticamente manteniendo proporción
        const targetWidthCm = Math.min(30, Math.round((img.naturalWidth / 300) * 2.54));
        const aspect = img.naturalHeight / img.naturalWidth;
        const targetHeightCm = Math.round(targetWidthCm * aspect * 10) / 10;

        setConfig((prev) => ({
          ...prev,
          width: targetWidthCm,
          height: targetHeightCm
        }));
      };
      img.src = dataUri;
    };
    reader.readAsDataURL(file);
  };

  // Restaurar a versión original no destructiva
  const handleResetToOriginal = () => {
    if (originalArtwork) {
      setArtwork({ ...originalArtwork });
      setConfig((prev) => ({
        ...prev,
        width: 28,
        height: 33,
        dpi: 300,
        bleedMm: activeMachine.defaultBleedMm,
        marginMm: activeMachine.defaultMarginMm,
        mirrorHorizontal: activeMachine.requiresMirror,
        mirrorVertical: false,
        transparencyEnabled: true
      }));
    }
  };

  // Aplicar soluciones automáticas del auditor de pre-vuelo
  const handleApplyFix = (action: string) => {
    switch (action) {
      case 'reduce_dimension_for_300dpi': {
        if (!artwork) return;
        // Calcular ancho físico en la unidad actual para alcanzar 300 DPI exactos
        const widthInches = artwork.originalWidthPx / 300;
        const widthMm = widthInches * 25.4;
        const newWidth = convertFromMm(widthMm, config.unit, config.dpi);
        const aspect = artwork.originalHeightPx / artwork.originalWidthPx;
        const newHeight = Math.round(newWidth * aspect * 100) / 100;
        setConfig((prev) => ({
          ...prev,
          width: newWidth,
          height: newHeight,
          dpi: 300
        }));
        break;
      }
      case 'fit_to_machine_bed': {
        const maxSafeWidthMm = activeMachine.bedWidthMm - config.bleedMm * 2 - 10;
        const newWidth = convertFromMm(maxSafeWidthMm, config.unit, config.dpi);
        if (artwork) {
          const aspect = artwork.originalHeightPx / artwork.originalWidthPx;
          setConfig((prev) => ({
            ...prev,
            width: newWidth,
            height: Math.round(newWidth * aspect * 100) / 100
          }));
        }
        break;
      }
      case 'fit_to_machine_safe_margin': {
        const safeWidthMm =
          activeMachine.bedWidthMm - (activeMachine.defaultMarginMm * 2) - config.bleedMm * 2;
        const newWidth = convertFromMm(safeWidthMm, config.unit, config.dpi);
        if (artwork) {
          const aspect = artwork.originalHeightPx / artwork.originalWidthPx;
          setConfig((prev) => ({
            ...prev,
            width: newWidth,
            height: Math.round(newWidth * aspect * 100) / 100
          }));
        }
        break;
      }
      case 'switch_to_png': {
        setConfig((prev) => ({ ...prev, exportFormat: 'PNG', transparencyEnabled: true }));
        break;
      }
      case 'switch_to_recommended_format': {
        setConfig((prev) => ({
          ...prev,
          exportFormat: activeMachine.supportedFormats[0] || 'PDF'
        }));
        break;
      }
      case 'enable_horizontal_mirror': {
        setConfig((prev) => ({ ...prev, mirrorHorizontal: true }));
        break;
      }
      case 'disable_horizontal_mirror': {
        setConfig((prev) => ({ ...prev, mirrorHorizontal: false }));
        break;
      }
      case 'enable_white_underbase': {
        setConfig((prev) => ({
          ...prev,
          separationMethod: 'underbase_cmyk',
          whiteUnderbaseChokePx: 2
        }));
        handleGenerateSeparations();
        break;
      }
      case 'clean_alpha_choke': {
        setConfig((prev) => ({
          ...prev,
          whiteUnderbaseChokePx: 3
        }));
        handleGenerateSeparations();
        break;
      }
      default:
        break;
    }
  };

  // Manejo de cambio de cotas proporcionales
  const handleWidthChange = (val: number) => {
    if (config.lockAspectRatio && artwork) {
      const aspect = artwork.originalHeightPx / artwork.originalWidthPx;
      const newHeight = Math.round(val * aspect * 100) / 100;
      setConfig({ ...config, width: val, height: newHeight });
    } else {
      setConfig({ ...config, width: val });
    }
  };

  const handleHeightChange = (val: number) => {
    if (config.lockAspectRatio && artwork) {
      const aspect = artwork.originalWidthPx / artwork.originalHeightPx;
      const newWidth = Math.round(val * aspect * 100) / 100;
      setConfig({ ...config, height: val, width: newWidth });
    } else {
      setConfig({ ...config, height: val });
    }
  };

  // Convertir todas las cotas al cambiar unidad
  const handleUnitChange = (newUnit: DimensionUnit) => {
    const currentWidthMm = convertToMm(config.width, config.unit, config.dpi);
    const currentHeightMm = convertToMm(config.height, config.unit, config.dpi);
    setConfig({
      ...config,
      unit: newUnit,
      width: convertFromMm(currentWidthMm, newUnit, config.dpi),
      height: convertFromMm(currentHeightMm, newUnit, config.dpi)
    });
  };

  const currentWidthMm = convertToMm(config.width, config.unit, config.dpi);
  const currentHeightMm = convertToMm(config.height, config.unit, config.dpi);
  const effectiveDpi =
    artwork && currentWidthMm > 0
      ? Math.round(artwork.originalWidthPx / (currentWidthMm / 25.4))
      : 300;

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Cockpit */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Printer className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-slate-100">
                Centro Profesional de Preparación para Impresión
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Pre-Press & RIP Ready
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Auditoría técnica pre-vuelo (DPI, sangrado, cotas de cama, canal alfa), generación de base blanca con choke y exportación en alta fidelidad para RIPs industriales (Cadlink, Wasatch, Caldera, VersaWorks).
            </p>
          </div>

          {/* Botones de acción principal */}
          <div className="flex flex-wrap items-center gap-2.5">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/png,image/jpeg,image/svg+xml,image/tiff,application/pdf"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-2 cursor-pointer border border-slate-700 shadow-sm"
            >
              <Upload className="w-4 h-4 text-cyan-400" />
              Cargar Arte Propio
            </button>

            <button
              type="button"
              onClick={handleResetToOriginal}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-800 text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Restaurar a versión original no destructiva"
            >
              <Undo2 className="w-3.5 h-3.5" />
              Reset Original
            </button>

            <button
              type="button"
              onClick={() => setIsMachineModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Settings2 className="w-4 h-4" />
              Parque de Máquinas
            </button>

            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-950/40"
            >
              <Download className="w-4 h-4" />
              Exportar para Impresión
            </button>
          </div>
        </div>

        {/* Galería de muestras y selección de máquina activa */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Selector de máquina y RIP */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-300 shrink-0 flex items-center gap-1.5">
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              Máquina Destino:
            </label>
            <select
              value={selectedMachineId}
              onChange={(e) => setSelectedMachineId(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-medium focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {machines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.bedWidthMm}x{m.bedHeightMm}mm)
                </option>
              ))}
            </select>
            <span className="text-[11px] text-slate-400 font-mono hidden xl:inline">
              RIP: <strong className="text-slate-300">{activeMachine.recommendedRip}</strong>
            </span>
          </div>

          {/* Artes de muestra */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full">
            <span className="text-[11px] font-medium text-slate-400 shrink-0">Artes de Prueba:</span>
            {SAMPLE_ARTWORKS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => {
                  setArtwork(sample);
                  setOriginalArtwork(sample);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors truncate max-w-[180px] cursor-pointer ${
                  artwork?.id === sample.id
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {sample.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Principal: Panel de Control Izquierdo + Visor Central + Auditoría Derecha */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Columna Izquierda: Parámetros Técnicos de Pre-prensa (4 cols) */}
        <div className="xl:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-slate-100">Parámetros de Pre-impresión</h3>
              </div>
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                {(['cm', 'mm', 'in', 'px'] as DimensionUnit[]).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => handleUnitChange(u)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono uppercase transition-colors cursor-pointer ${
                      config.unit === u
                        ? 'bg-cyan-600 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Cotas Físicas (Ancho x Alto) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Dimensiones de Salida</span>
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, lockAspectRatio: !config.lockAspectRatio })}
                  className={`text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                    config.lockAspectRatio
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {config.lockAspectRatio ? '🔒 Proporción Bloqueada' : '🔓 Proporción Libre'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Ancho ({config.unit}):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={config.width}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Alto ({config.unit}):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={config.height}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Cotas milimétricas equivalentes */}
              <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>
                  Equiv: <strong className="text-slate-200">{Math.round(currentWidthMm)} x {Math.round(currentHeightMm)} mm</strong>
                </span>
                <span className="text-cyan-400 font-semibold">{effectiveDpi} DPI efectivos</span>
              </div>
            </div>

            {/* Resolución DPI */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Resolución de Salida:</label>
                <span className="text-xs font-mono text-cyan-400 font-bold">{config.dpi} DPI</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[72, 150, 300, 600, 1200].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setConfig({ ...config, dpi: val })}
                    className={`py-1 rounded text-[11px] font-mono transition-colors border cursor-pointer ${
                      config.dpi === val
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Perfil de Color y Espacio */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-cyan-400" />
                Perfil de Color ICC:
              </label>
              <select
                value={config.colorProfile}
                onChange={(e) => setConfig({ ...config, colorProfile: e.target.value as ColorProfile })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 font-medium focus:outline-none focus:border-cyan-500"
              >
                {PREPRESS_COLOR_PROFILES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sangrado (Bleed) y Márgenes de Seguridad */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Sangrado (Bleed mm):
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={config.bleedMm}
                  onChange={(e) => setConfig({ ...config, bleedMm: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Margen Seguridad (mm):
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={config.marginMm}
                  onChange={(e) => setConfig({ ...config, marginMm: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Transformaciones de Espejado y Transparencia */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <span className="text-xs font-semibold text-slate-300 block mb-1.5">
                Controles de Transfer & Transparencia:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, mirrorHorizontal: !config.mirrorHorizontal })}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    config.mirrorHorizontal
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  <FlipHorizontal className="w-3.5 h-3.5" />
                  Espejado (H) {config.mirrorHorizontal ? 'ON' : 'OFF'}
                </button>

                <button
                  type="button"
                  onClick={() => setConfig({ ...config, transparencyEnabled: !config.transparencyEnabled })}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    config.transparencyEnabled
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  {config.transparencyEnabled ? 'Alfa Transparente' : 'Fondo Blanco'}
                </button>
              </div>
            </div>

            {/* Guías visuales sobre el lienzo */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <span className="text-xs font-semibold text-slate-300 block mb-1">
                Guías de Producción Activas:
              </span>
              <div className="space-y-1.5 text-xs">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.showRegistrationMarks}
                    onChange={(e) => setConfig({ ...config, showRegistrationMarks: e.target.checked })}
                    className="accent-cyan-500 rounded"
                  />
                  Cruces de registro y marcas de corte
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.showColorBars}
                    onChange={(e) => setConfig({ ...config, showColorBars: e.target.checked })}
                    className="accent-cyan-500 rounded"
                  />
                  Barra de calibración CMYK y escala de grises
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.showBleedAndMargins}
                    onChange={(e) => setConfig({ ...config, showBleedAndMargins: e.target.checked })}
                    className="accent-cyan-500 rounded"
                  />
                  Caja de sangrado (Bleed Box) y Trim Line
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Central: Visor Canvas Interactivo & Separaciones (8 cols) */}
        <div className="xl:col-span-8 space-y-4">
          {/* Navegación por pestañas: Vista Previa vs Separaciones vs Diagnóstico */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Lienzo de Calibración
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('separations')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'separations'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Separaciones & Base Blanca ({plates.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('preflight')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'preflight'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                Auditoría Pre-vuelo ({preflightIssues.length})
              </button>
            </div>

            {/* Controles de Zoom */}
            {activeTab === 'preview' && (
              <div className="flex items-center gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setZoomLevel(Math.max(50, zoomLevel - 20))}
                  className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-slate-400 w-12 text-center">{zoomLevel}%</span>
                <button
                  type="button"
                  onClick={() => setZoomLevel(Math.min(200, zoomLevel + 20))}
                  className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(100)}
                  className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-white text-[11px]"
                >
                  100%
                </button>
              </div>
            )}
          </div>

          {/* Contenido según pestaña activa */}
          {activeTab === 'preview' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[520px] overflow-auto relative">
              {/* Lienzo con soporte de zoom */}
              <div
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.15s ease'
                }}
                className="shadow-2xl rounded-lg p-2 bg-slate-950/80 border border-slate-800"
              >
                <canvas
                  ref={canvasRef}
                  className="max-h-[580px] w-auto h-auto rounded border border-slate-800 shadow-inner"
                />
              </div>

              {/* Leyenda de Cotas Flotante */}
              <div className="absolute bottom-4 left-4 bg-slate-950/90 border border-slate-800 backdrop-blur-md rounded-lg px-3 py-1.5 text-xs font-mono text-slate-300 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Ruler className="w-3.5 h-3.5 text-cyan-400" />
                  {Math.round(currentWidthMm)} x {Math.round(currentHeightMm)} mm
                </span>
                <span className="text-slate-500">|</span>
                <span className="text-cyan-400">{effectiveDpi} DPI</span>
                <span className="text-slate-500">|</span>
                <span>{config.colorProfile.split(' ')[0]}</span>
              </div>
            </div>
          )}

          {activeTab === 'separations' && (
            <ColorSeparationViewer
              plates={plates}
              config={config}
              onConfigChange={(updates) => setConfig((prev) => ({ ...prev, ...updates }))}
              onRegenerate={handleGenerateSeparations}
            />
          )}

          {activeTab === 'preflight' && (
            <PreflightValidationPanel
              issues={preflightIssues}
              onApplyFix={handleApplyFix}
            />
          )}

          {/* Si estamos en preview, mostrar el resumen de pre-vuelo abajo */}
          {activeTab === 'preview' && (
            <PreflightValidationPanel
              issues={preflightIssues}
              onApplyFix={handleApplyFix}
            />
          )}
        </div>
      </div>

      {/* Modales */}
      <PrepressExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        config={config}
        machine={activeMachine}
        artwork={artwork}
        canvasRef={canvasRef}
        artworkImgRef={artworkImgRef}
      />

      <PrepressMachineModal
        isOpen={isMachineModalOpen}
        onClose={() => setIsMachineModalOpen(false)}
        machines={machines}
        onSaveMachine={handleSaveMachine}
        onDeleteMachine={handleDeleteMachine}
        selectedMachineId={selectedMachineId}
        onSelectMachine={setSelectedMachineId}
      />
    </div>
  );
};
