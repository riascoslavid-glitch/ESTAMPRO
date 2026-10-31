import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  ImageAdjustments,
  CropAspectRatio,
  CropRect,
  ColorSwapConfig,
  TransparencyWandConfig,
  TextileEffectConfig,
  TextileFilterPreset,
  ImageVersion,
  PrintDpiAnalysis
} from '../../../types/imageEditor';
import {
  loadImageToCanvas,
  cloneCanvas,
  cropCanvas,
  resizeCanvas,
  rotateAndFlipCanvas,
  applyAdjustments,
  replaceColorInCanvas,
  applyTransparencyWand,
  applyTextileEffects,
  applyFilterPreset,
  calculatePrintDpiAnalysis
} from '../../../services/imageProcessing/canvasImageEngine';
import {
  executeAiBackgroundRemoval,
  executeAiInpaint,
  executeAiUpscale,
  analyzeImageForPrinting
} from '../../../services/imageProcessing/aiImageService';
import { ImageEditorCanvas, ComparisonMode } from './ImageEditorCanvas';
import { ImageDpiWarningBanner, PRINT_AREAS } from './ImageDpiWarningBanner';
import { ImageGeometryPanel } from './ImageGeometryPanel';
import { ImageAdjustmentsPanel } from './ImageAdjustmentsPanel';
import { ImageEffectsPanel } from './ImageEffectsPanel';
import { ImageAiToolsModal } from './ImageAiToolsModal';
import { ImageVersionsDrawer } from './ImageVersionsDrawer';
import {
  Upload,
  Download,
  Box,
  Layers,
  Sparkles,
  History,
  Scissors,
  Sliders,
  Wand2,
  HelpCircle,
  FolderArchive,
  RefreshCw,
  Eye,
  CheckCircle,
  FileImage,
  ArrowRight,
  Shirt,
  ShieldAlert
} from 'lucide-react';

const DEFAULT_ADJUSTMENTS: ImageAdjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 100,
  sharpness: 0,
  hue: 0,
  temperature: 0,
  opacity: 100
};

const DEFAULT_EFFECTS: TextileEffectConfig = {
  bwMode: 'none',
  thresholdValue: 128,
  halftoneMode: 'none',
  halftoneDotSize: 6,
  halftoneAngle: 45,
  duotoneEnabled: false,
  duotoneColor1: '#09090b',
  duotoneColor2: '#06b6d4',
  vintageGrungeIntensity: 0,
  posterizeLevels: 0,
  neonGlow: false
};

const SAMPLE_PRESETS = [
  {
    id: 'hero_studio',
    name: 'Fotografía Estudio Textil',
    url: '/src/assets/images/hero_textile_studio_1793415151404.jpg'
  },
  {
    id: 'hoodie_sample',
    name: 'Fotografía Buzo Hoodie',
    url: '/src/assets/images/garment_hoodie_french_terry_1793416400113.jpg'
  },
  {
    id: 'printer_avatar',
    name: 'Retrato Maestro Impresor',
    url: '/src/assets/images/avatar_master_printer_1793415150877.jpg'
  }
];

export const ImageEditorView: React.FC = () => {
  const {
    addNotification,
    setActiveModuleId,
    setActiveGraphicTextureUri,
    setGraphicPrintPlacement,
    uploadStoredFile,
    imageEditorTargetUri,
    setImageEditorTargetUri,
    storedFiles
  } = useApp();

  // Estados de lienzos principales
  const [originalCanvas, setOriginalCanvas] = useState<HTMLCanvasElement | null>(null);
  const [currentCanvas, setCurrentCanvas] = useState<HTMLCanvasElement | null>(null);
  const [comparisonVersionCanvas, setComparisonVersionCanvas] = useState<HTMLCanvasElement | null>(null);
  const [maskCanvas, setMaskCanvas] = useState<HTMLCanvasElement | null>(null);

  // Dimensiones actuales
  const [imgWidth, setImgWidth] = useState<number>(800);
  const [imgHeight, setImgHeight] = useState<number>(800);

  // Pestaña activa del panel derecho
  const [activeSideTab, setActiveSideTab] = useState<'geometria' | 'ajustes' | 'efectos'>('ajustes');

  // Ajustes de parámetros
  const [adjustments, setAdjustments] = useState<ImageAdjustments>(DEFAULT_ADJUSTMENTS);
  const [colorSwap, setColorSwap] = useState<ColorSwapConfig>({
    active: false,
    sourceColor: '#000000',
    targetColor: '#06b6d4',
    tolerance: 35,
    preserveLuminosity: true
  });
  const [transparencyWand, setTransparencyWand] = useState<TransparencyWandConfig>({
    targetColor: '#ffffff',
    tolerance: 25,
    feather: 2
  });
  const [effects, setEffects] = useState<TextileEffectConfig>(DEFAULT_EFFECTS);
  const [activeFilterPreset, setActiveFilterPreset] = useState<TextileFilterPreset>('none');

  // Modos de Recorte
  const [isCropping, setIsCropping] = useState<boolean>(false);
  const [cropAspect, setCropAspect] = useState<CropAspectRatio>('free');
  const [cropRect, setCropRect] = useState<CropRect>({ x: 10, y: 10, width: 80, height: 80 });

  // Pincel de Máscara para Borrador Mágico
  const [isMaskDrawingActive, setIsMaskDrawingActive] = useState<boolean>(false);
  const [maskBrushRadius, setMaskBrushRadius] = useState<number>(15);

  // Cuentagotas de Color
  const [isEyedropperActive, setIsEyedropperActive] = useState<boolean>(false);
  const [eyedropperTarget, setEyedropperTarget] = useState<'swap_source' | 'transparency_color' | null>(null);

  // Comparación Antes / Después
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('normal');
  const [isHoldingCompare, setIsHoldingCompare] = useState<boolean>(false);

  // Modales y Cajones
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isVersionsDrawerOpen, setIsVersionsDrawerOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingMessage, setProcessingMessage] = useState<string>('');

  // Análisis DPI y Área de impresión textil
  const [targetPrintArea, setTargetPrintArea] = useState<string>('a4_pecho');
  const [dpiAnalysis, setDpiAnalysis] = useState<PrintDpiAnalysis>({
    widthPx: 800,
    heightPx: 800,
    targetWidthCm: 21,
    targetHeightCm: 29.7,
    calculatedDpi: 97,
    qualityLevel: 'insufficient',
    warningMessage: 'Calculando densidad de impresión...',
    maxRecommendedPrintWidthCm: 6.8,
    maxRecommendedPrintHeightCm: 6.8
  });

  // Historial de Versiones no destructivo
  const [versions, setVersions] = useState<ImageVersion[]>([]);
  const [activeVersionId, setActiveVersionId] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Función para registrar una nueva versión en el stack no destructivo
  const pushVersion = useCallback(
    (canvas: HTMLCanvasElement, actionName: string, customName?: string) => {
      const area = PRINT_AREAS[targetPrintArea] || PRINT_AREAS.a4_pecho;
      const analysis = calculatePrintDpiAnalysis(canvas.width, canvas.height, area.widthCm, area.heightCm);

      // Generar miniatura pequeña
      const thumbCanvas = document.createElement('canvas');
      thumbCanvas.width = 120;
      thumbCanvas.height = Math.round((120 * canvas.height) / canvas.width);
      thumbCanvas.getContext('2d')!.drawImage(canvas, 0, 0, thumbCanvas.width, thumbCanvas.height);
      const thumbUrl = thumbCanvas.toDataURL('image/jpeg', 0.7);

      const newVer: ImageVersion = {
        id: `ver-${Date.now()}`,
        name: customName || actionName,
        timestamp: Date.now(),
        dataUrl: canvas.toDataURL('image/png'),
        thumbnailUrl: thumbUrl,
        width: canvas.width,
        height: canvas.height,
        dpi: analysis.calculatedDpi,
        actionTaken: actionName
      };

      setVersions((prev) => [newVer, ...prev]);
      setActiveVersionId(newVer.id);
      setDpiAnalysis(analysis);
      setImgWidth(canvas.width);
      setImgHeight(canvas.height);
    },
    [targetPrintArea]
  );

  // Inicializar o cargar imagen desde URL/DataURL
  const loadInitialImage = useCallback(
    async (src: string, isOriginalSeed: boolean = true) => {
      try {
        setIsProcessing(true);
        setProcessingMessage('Cargando imagen en el motor Canvas 2D...');
        const loadedCanvas = await loadImageToCanvas(src);

        // Crear máscara del mismo tamaño
        const mCanvas = document.createElement('canvas');
        mCanvas.width = loadedCanvas.width;
        mCanvas.height = loadedCanvas.height;
        setMaskCanvas(mCanvas);

        if (isOriginalSeed) {
          // Conservar archivo original protegido
          const origClone = cloneCanvas(loadedCanvas);
          setOriginalCanvas(origClone);
          setVersions([]);
          pushVersion(loadedCanvas, 'Archivo Original Importado', 'Versión Original');
        }

        setCurrentCanvas(loadedCanvas);
        setImgWidth(loadedCanvas.width);
        setImgHeight(loadedCanvas.height);

        const area = PRINT_AREAS[targetPrintArea] || PRINT_AREAS.a4_pecho;
        setDpiAnalysis(
          calculatePrintDpiAnalysis(loadedCanvas.width, loadedCanvas.height, area.widthCm, area.heightCm)
        );
      } catch (err) {
        addNotification('Editor de Imágenes', 'No se pudo cargar la imagen seleccionada.', 'alert', 'editor_imagenes');
      } finally {
        setIsProcessing(false);
      }
    },
    [addNotification, pushVersion, targetPrintArea]
  );

  // Carga inicial o si viene una imagen desde otro módulo
  useEffect(() => {
    if (imageEditorTargetUri) {
      loadInitialImage(imageEditorTargetUri, true);
      // Limpiar objetivo para que no recargue en cada render
      setImageEditorTargetUri(null);
    } else if (!currentCanvas) {
      // Cargar primera imagen de muestra por defecto
      loadInitialImage(SAMPLE_PRESETS[0].url, true);
    }
  }, [imageEditorTargetUri, currentCanvas, loadInitialImage, setImageEditorTargetUri]);

  // Recalcular análisis DPI cuando cambia el área de estampado
  const handleTargetAreaChange = (areaKey: string) => {
    setTargetPrintArea(areaKey);
    if (currentCanvas) {
      const area = PRINT_AREAS[areaKey] || PRINT_AREAS.a4_pecho;
      setDpiAnalysis(
        calculatePrintDpiAnalysis(currentCanvas.width, currentCanvas.height, area.widthCm, area.heightCm)
      );
    }
  };

  // 1. SUBIR FOTOGRAFÍAS (File Input & Drag/Drop)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      loadInitialImage(dataUri, true);
      addNotification(
        'Editor de Imágenes',
        `Fotografía "${file.name}" cargada. Archivo original protegido en el historial.`,
        'success',
        'editor_imagenes'
      );
    };
    reader.readAsDataURL(file);
  };

  // 2. RECORTAR (CROP)
  const handleStartCrop = () => {
    setIsCropping(true);
    setCropRect({ x: 10, y: 10, width: 80, height: 80 });
  };

  const handleApplyCrop = () => {
    if (!currentCanvas) return;
    const cropped = cropCanvas(currentCanvas, cropRect);
    setCurrentCanvas(cropped);
    setIsCropping(false);

    // Ajustar máscara
    const mCanvas = document.createElement('canvas');
    mCanvas.width = cropped.width;
    mCanvas.height = cropped.height;
    setMaskCanvas(mCanvas);

    pushVersion(cropped, `Recorte aplicado (${cropAspect})`);
    addNotification('Editor de Imágenes', 'Imagen recortada correctamente.', 'success', 'editor_imagenes');
  };

  const handleCancelCrop = () => {
    setIsCropping(false);
  };

  const handleCropAspectChange = (aspect: CropAspectRatio) => {
    setCropAspect(aspect);
    // Ajustar relación si aplica
    if (aspect === '1:1') {
      setCropRect({ x: 15, y: 15, width: 70, height: 70 });
    } else if (aspect === '4:3') {
      setCropRect({ x: 10, y: 15, width: 80, height: 60 });
    } else if (aspect === '16:9') {
      setCropRect({ x: 10, y: 25, width: 80, height: 45 });
    } else if (aspect === 'a4_pecho') {
      setCropRect({ x: 15, y: 5, width: 70, height: 90 });
    }
  };

  // 3. REDIMENSIONAR (RESIZE)
  const handleResize = (targetW: number, targetH: number, mode: 'bicubic' | 'smooth' | 'pixelated') => {
    if (!currentCanvas) return;
    setIsProcessing(true);
    setProcessingMessage('Remuestreando imagen...');

    setTimeout(() => {
      const resized = resizeCanvas(currentCanvas, targetW, targetH, mode);
      setCurrentCanvas(resized);

      const mCanvas = document.createElement('canvas');
      mCanvas.width = resized.width;
      mCanvas.height = resized.height;
      setMaskCanvas(mCanvas);

      pushVersion(resized, `Redimensionado a ${targetW} × ${targetH} px`);
      setIsProcessing(false);
      addNotification('Editor de Imágenes', `Dimensiones actualizadas a ${targetW} × ${targetH} px.`, 'success', 'editor_imagenes');
    }, 50);
  };

  // 4. ROTAR Y VOLTEAR (ROTATE & FLIP)
  const handleRotateStep = (degrees: number) => {
    if (!currentCanvas) return;
    const rotated = rotateAndFlipCanvas(currentCanvas, degrees, false, false);
    setCurrentCanvas(rotated);
    pushVersion(rotated, `Rotación ${degrees > 0 ? '+' : ''}${degrees}°`);
  };

  const handleRotateAngle = (angle: number) => {
    // Si es ángulo arbitrario, aplicamos desde la versión activa
    if (!currentCanvas) return;
    const rotated = rotateAndFlipCanvas(currentCanvas, angle, false, false);
    setCurrentCanvas(rotated);
  };

  const handleFlip = (horizontal: boolean, vertical: boolean) => {
    if (!currentCanvas) return;
    const flipped = rotateAndFlipCanvas(currentCanvas, 0, horizontal, vertical);
    setCurrentCanvas(flipped);
    pushVersion(flipped, `Volteo ${horizontal ? 'Horizontal' : 'Vertical'}`);
  };

  // 7-10. AJUSTES FOTOGRÁFICOS EN TIEMPO REAL
  const handleAdjustmentsChange = (updates: Partial<ImageAdjustments>) => {
    const nextAdj = { ...adjustments, ...updates };
    setAdjustments(nextAdj);

    if (currentCanvas && versions.length > 0) {
      // Tomamos la base antes de los deslizadores para no degradar acumulativamente
      const baseCanvas = cloneCanvas(currentCanvas);
      const adjusted = applyAdjustments(baseCanvas, nextAdj);
      setCurrentCanvas(adjusted);
    }
  };

  const handleResetAdjustments = () => {
    setAdjustments(DEFAULT_ADJUSTMENTS);
    if (versions.length > 0) {
      // Restaurar última versión estable guardada
      const activeVer = versions.find((v) => v.id === activeVersionId) || versions[0];
      loadImageToCanvas(activeVer.dataUrl).then((c) => setCurrentCanvas(c));
    }
  };

  // 11. CAMBIAR COLORES
  const handleApplyColorSwap = () => {
    if (!currentCanvas) return;
    setIsProcessing(true);
    setProcessingMessage('Reemplazando tonalidad preservando volumen...');

    setTimeout(() => {
      const swapped = replaceColorInCanvas(currentCanvas, colorSwap);
      setCurrentCanvas(swapped);
      pushVersion(swapped, `Color ${colorSwap.sourceColor} cambiado a ${colorSwap.targetColor}`);
      setIsProcessing(false);
      addNotification('Editor de Imágenes', 'Colores reemplazados exitosamente.', 'success', 'editor_imagenes');
    }, 50);
  };

  // 12. CREAR TRANSPARENCIAS
  const handleApplyTransparencyWand = () => {
    if (!currentCanvas) return;
    setIsProcessing(true);
    setProcessingMessage('Creando canal alfa transparente...');

    setTimeout(() => {
      const transparentCanvas = applyTransparencyWand(currentCanvas, transparencyWand);
      setCurrentCanvas(transparentCanvas);
      pushVersion(transparentCanvas, `Transparencia aplicada sobre ${transparencyWand.targetColor}`);
      setIsProcessing(false);
      addNotification('Editor de Imágenes', 'Canal alfa generado correctamente.', 'success', 'editor_imagenes');
    }, 50);
  };

  // 5. ELIMINAR FONDOS MEDIANTE IA
  const handleExecuteBackgroundRemoval = async (tolerance: number) => {
    if (!currentCanvas) return;
    setIsProcessing(true);
    setProcessingMessage('Analizando bordes y eliminando fondo...');

    try {
      const result = await executeAiBackgroundRemoval(currentCanvas, tolerance);
      setCurrentCanvas(result.canvas);
      pushVersion(
        result.canvas,
        result.usedService === 'cloud_ai'
          ? 'Fondo eliminado mediante servicio IA Cloud'
          : 'Fondo eliminado mediante Croma Inteligente'
      );
      setIsAiModalOpen(false);
      addNotification(
        'Editor de Imágenes',
        result.usedService === 'cloud_ai'
          ? 'Fondo eliminado exitosamente con IA en la nube.'
          : 'Fondo eliminado con algoritmo inteligente de canal alfa.',
        'success',
        'editor_imagenes'
      );
    } catch (err) {
      addNotification('Editor de Imágenes', 'Error al procesar eliminación de fondo.', 'alert', 'editor_imagenes');
    } finally {
      setIsProcessing(false);
    }
  };

  // 13. ELIMINAR ELEMENTOS MEDIANTE IA (INPAINTING)
  const handleExecuteInpaint = async () => {
    if (!currentCanvas || !maskCanvas) return;
    setIsProcessing(true);
    setProcessingMessage('Sintetizando textura y eliminando elemento seleccionado...');

    try {
      const result = await executeAiInpaint(currentCanvas, maskCanvas);
      setCurrentCanvas(result.canvas);

      // Limpiar máscara
      const ctx = maskCanvas.getContext('2d')!;
      ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
      setIsMaskDrawingActive(false);

      pushVersion(result.canvas, 'Elemento eliminado con Borrador Mágico');
      setIsAiModalOpen(false);
      addNotification('Editor de Imágenes', 'Elemento eliminado y rellenado con textura circundante.', 'success', 'editor_imagenes');
    } catch (err) {
      addNotification('Editor de Imágenes', 'Error en el proceso de inpainting.', 'alert', 'editor_imagenes');
    } finally {
      setIsProcessing(false);
    }
  };

  // 6. MEJORAR RESOLUCIÓN MEDIANTE SERVICIO COMPATIBLE (UPSCALE)
  const handleExecuteUpscale = async (factor: 2 | 4) => {
    if (!currentCanvas) return;
    setIsProcessing(true);
    setProcessingMessage(`Multiplicando resolución ${factor}X con súper-muestreo...`);

    try {
      const result = await executeAiUpscale(currentCanvas, factor);
      setCurrentCanvas(result.canvas);

      // Actualizar máscara
      const mCanvas = document.createElement('canvas');
      mCanvas.width = result.canvas.width;
      mCanvas.height = result.canvas.height;
      setMaskCanvas(mCanvas);

      pushVersion(result.canvas, `Super-Resolución ${factor}X aplicada`);
      setIsAiModalOpen(false);
      addNotification(
        'Editor de Imágenes',
        `Resolución mejorada a ${result.canvas.width} × ${result.canvas.height} px (${factor}X).`,
        'success',
        'editor_imagenes'
      );
    } catch (err) {
      addNotification('Editor de Imágenes', 'Error al mejorar resolución.', 'alert', 'editor_imagenes');
    } finally {
      setIsProcessing(false);
    }
  };

  // 14-15. EFECTOS TEXTILES
  const handleApplyEffects = () => {
    if (!currentCanvas) return;
    setIsProcessing(true);
    setProcessingMessage('Renderizando efectos serigráficos...');

    setTimeout(() => {
      const processed = applyTextileEffects(currentCanvas, effects);
      setCurrentCanvas(processed);
      pushVersion(processed, 'Efectos serigráficos aplicados');
      setIsProcessing(false);
      addNotification('Editor de Imágenes', 'Efectos textiles aplicados a la imagen.', 'success', 'editor_imagenes');
    }, 50);
  };

  // 16. FILTROS PREESTABLECIDOS
  const handleSelectFilterPreset = (preset: TextileFilterPreset) => {
    setActiveFilterPreset(preset);
    if (!currentCanvas) return;

    if (preset === 'none') {
      const activeVer = versions.find((v) => v.id === activeVersionId) || versions[0];
      loadImageToCanvas(activeVer.dataUrl).then((c) => setCurrentCanvas(c));
      return;
    }

    const filtered = applyFilterPreset(currentCanvas, preset);
    setCurrentCanvas(filtered);
    pushVersion(filtered, `Filtro ${preset.replace('_', ' ')}`);
  };

  // CUENTAGOTAS
  const handleToggleEyedropper = (target: 'swap_source' | 'transparency_color') => {
    if (isEyedropperActive && eyedropperTarget === target) {
      setIsEyedropperActive(false);
      setEyedropperTarget(null);
    } else {
      setIsEyedropperActive(true);
      setEyedropperTarget(target);
      addNotification('Cuentagotas', 'Haz clic sobre cualquier parte de la imagen para tomar la muestra.', 'info', 'editor_imagenes');
    }
  };

  const handleSampleColor = (hex: string) => {
    if (eyedropperTarget === 'swap_source') {
      setColorSwap((prev) => ({ ...prev, sourceColor: hex }));
    } else if (eyedropperTarget === 'transparency_color') {
      setTransparencyWand((prev) => ({ ...prev, targetColor: hex }));
    }
    setIsEyedropperActive(false);
    setEyedropperTarget(null);
    addNotification('Cuentagotas', `Color ${hex.toUpperCase()} capturado correctamente.`, 'success', 'editor_imagenes');
  };

  // GESTIÓN DE VERSIONES Y RESTAURACIÓN
  const handleRestoreVersion = async (version: ImageVersion) => {
    setIsProcessing(true);
    setProcessingMessage(`Restaurando versión "${version.name}"...`);
    const c = await loadImageToCanvas(version.dataUrl);
    setCurrentCanvas(c);
    setActiveVersionId(version.id);

    const area = PRINT_AREAS[targetPrintArea] || PRINT_AREAS.a4_pecho;
    setDpiAnalysis(calculatePrintDpiAnalysis(c.width, c.height, area.widthCm, area.heightCm));
    setIsProcessing(false);
    addNotification('Historial', `Versión "${version.name}" restaurada.`, 'info', 'editor_imagenes');
  };

  const handleCompareWithVersion = async (version: ImageVersion) => {
    const c = await loadImageToCanvas(version.dataUrl);
    setComparisonVersionCanvas(c);
    setComparisonMode('split');
    setIsVersionsDrawerOpen(false);
    addNotification('Comparación', `Comparando resultado actual contra "${version.name}".`, 'info', 'editor_imagenes');
  };

  const handleRevertToOriginal = () => {
    if (!originalCanvas) return;
    const c = cloneCanvas(originalCanvas);
    setCurrentCanvas(c);
    pushVersion(c, 'Reversión al original');
    setIsVersionsDrawerOpen(false);
    addNotification('Historial', 'Imagen revertida al archivo original de forma segura.', 'success', 'editor_imagenes');
  };

  // ENVIAR AL DISEÑADOR GRÁFICO (2D)
  const handleSendToDesigner = () => {
    if (!currentCanvas) return;
    const dataUri = currentCanvas.toDataURL('image/png');

    // Pasar imagen al estado global
    setActiveGraphicTextureUri(dataUri);
    addNotification(
      'Diseñador Gráfico',
      'Imagen procesada enviada al Diseñador Gráfico 2D como capa de alta resolución.',
      'success',
      'disenador_grafico'
    );
    setActiveModuleId('disenador_grafico');
  };

  // ENVIAR AL SIMULADOR 3D (Probador 3D)
  const handleSendToStudio3D = () => {
    if (!currentCanvas) return;
    const dataUri = currentCanvas.toDataURL('image/png');

    const area = PRINT_AREAS[targetPrintArea] || PRINT_AREAS.a4_pecho;

    // Actualizar textura viva y medidas de estampado para Three.js
    setActiveGraphicTextureUri(dataUri);
    setGraphicPrintPlacement({
      position: 'pecho_frente',
      widthCm: area.widthCm,
      heightCm: area.heightCm,
      offsetY: 0
    });

    addNotification(
      'Estudio 3D',
      'Arte textil transferido y proyectado sobre la prenda 3D con simulación de caída de tela.',
      'success',
      'probador_3d'
    );
    setActiveModuleId('probador_3d');
  };

  // GUARDAR EN BÓVEDA DE ARCHIVOS (Files and Storage)
  const handleSaveToFiles = async () => {
    if (!currentCanvas) return;
    const dataUri = currentCanvas.toDataURL('image/png');
    const byteSize = Math.round((dataUri.length * 3) / 4);

    await uploadStoredFile({
      id: `file-img-${Date.now()}`,
      name: `arte_estampapro_${Date.now()}.png`,
      folder: 'artes_vectoriales',
      sizeBytes: byteSize,
      mimeType: 'image/png',
      extension: '.png',
      createdAt: new Date().toLocaleDateString('es-CL'),
      dataUri: dataUri,
      ownerId: 'sistema'
    });

    addNotification(
      'Archivos y Diseños',
      'Arte final archivado en la Bóveda Textil en formato PNG transparente.',
      'success',
      'archivos_disenos'
    );
  };

  // DESCARGAR PNG DE ALTA RESOLUCIÓN
  const handleDownloadPng = () => {
    if (!currentCanvas) return;
    const dataUri = currentCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.download = `estampapro_arte_${dpiAnalysis.calculatedDpi}dpi_${Date.now()}.png`;
    a.href = dataUri;
    a.click();
    addNotification('Descarga', 'Imagen descargada en formato PNG transparente de alta fidelidad.', 'success', 'editor_imagenes');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl select-none text-slate-900 dark:text-slate-100">
      {/* 1. BARRA SUPERIOR DE HERRAMIENTAS Y ACCIONES */}
      <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between z-30 shrink-0">
        {/* Lado izquierdo: Título y carga de fotos */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xs font-bold leading-tight flex items-center gap-2">
                <span>Editor y Preparación de Imágenes</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-indigo-500/10 text-indigo-500 dark:text-cyan-400 font-bold uppercase">
                  PROMPT 7
                </span>
              </h1>
              <span className="text-[10px] text-slate-500 font-mono">
                {imgWidth} × {imgHeight} px · {dpiAnalysis.calculatedDpi} DPI
              </span>
            </div>
          </div>

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          {/* 1. SUBIR FOTOGRAFÍAS */}
          <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">1. Subir Foto</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          {/* Selector de Fotografías de Muestra para Pruebas Inmediatas */}
          <div className="hidden lg:flex items-center gap-1">
            <span className="text-[10px] text-slate-400 mr-1">Ejemplos:</span>
            {SAMPLE_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => loadInitialImage(p.url, true)}
                className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-medium hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              >
                {p.name.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>

        {/* Lado derecho: Acciones de IA, Bóveda, 3D y Diseñador */}
        <div className="flex items-center gap-2">
          {/* Botón Herramientas IA & Integración */}
          <button
            type="button"
            onClick={() => setIsAiModalOpen(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Herramientas IA</span>
          </button>

          {/* Botón Historial de Versiones */}
          <button
            type="button"
            onClick={() => setIsVersionsDrawerOpen(true)}
            className="p-2 sm:px-2.5 sm:py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            title="17. Historial y Versiones Guardadas"
          >
            <History className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Versiones ({versions.length})</span>
          </button>

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />

          {/* ENVIAR AL DISEÑADOR GRÁFICO (2D) */}
          <button
            type="button"
            onClick={handleSendToDesigner}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            title="Enviar este arte directamente como capa en el Diseñador Gráfico 2D"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Enviar al Diseñador</span>
          </button>

          {/* ENVIAR AL SIMULADOR 3D */}
          <button
            type="button"
            onClick={handleSendToStudio3D}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            title="Proyectar arte textil directamente sobre la prenda 3D viva"
          >
            <Shirt className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Enviar al 3D</span>
          </button>

          {/* Guardar en Bóveda */}
          <button
            type="button"
            onClick={handleSaveToFiles}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
            title="Archivar en Bóveda de Archivos"
          >
            <FolderArchive className="w-4 h-4" />
          </button>

          {/* Descargar PNG */}
          <button
            type="button"
            onClick={handleDownloadPng}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
            title="Descargar PNG Transparente 300 DPI"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. ÁREA DE TRABAJO: LIENZO CENTRAL + PANEL LATERAL */}
      <div className="flex-1 flex overflow-hidden">
        {/* Lienzo y advertencias de DPI */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-900 overflow-hidden">
          {/* Banner de advertencia sobre resolución insuficiente para impresión textil */}
          <div className="p-3 bg-slate-950 border-b border-slate-800/80 shrink-0">
            <ImageDpiWarningBanner
              analysis={dpiAnalysis}
              targetArea={targetPrintArea}
              onTargetAreaChange={handleTargetAreaChange}
              onTriggerUpscale={() => {
                setIsAiModalOpen(true);
              }}
            />
          </div>

          {/* Lienzo de Edición interactivo con split compare */}
          <div className="flex-1 relative overflow-hidden">
            <ImageEditorCanvas
              currentCanvas={currentCanvas}
              originalCanvas={originalCanvas}
              comparisonVersionCanvas={comparisonVersionCanvas}
              isCropping={isCropping}
              cropRect={cropRect}
              onCropRectChange={setCropRect}
              isMaskDrawingActive={isMaskDrawingActive}
              maskCanvas={maskCanvas}
              maskBrushRadius={maskBrushRadius}
              onMaskCanvasUpdated={() => {}}
              isEyedropperActive={isEyedropperActive}
              onSampleColor={handleSampleColor}
              comparisonMode={comparisonMode}
              onComparisonModeChange={setComparisonMode}
              isHoldingCompare={isHoldingCompare}
              setIsHoldingCompare={setIsHoldingCompare}
            />
          </div>
        </div>

        {/* 3. PANEL LATERAL DERECHO DE HERRAMIENTAS Y CONTROL */}
        <aside className="w-80 sm:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col shrink-0 overflow-hidden">
          {/* Pestañas del Panel Lateral */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-1.5 gap-1">
            <button
              type="button"
              onClick={() => setActiveSideTab('ajustes')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold text-center transition-all ${
                activeSideTab === 'ajustes'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-cyan-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Ajustes & Color
            </button>
            <button
              type="button"
              onClick={() => setActiveSideTab('geometria')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold text-center transition-all ${
                activeSideTab === 'geometria'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-cyan-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Geometría & Giro
            </button>
            <button
              type="button"
              onClick={() => setActiveSideTab('efectos')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold text-center transition-all ${
                activeSideTab === 'efectos'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-cyan-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Efectos & Filtros
            </button>
          </div>

          {/* Contenido scrolleable del panel */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeSideTab === 'ajustes' && (
              <ImageAdjustmentsPanel
                adjustments={adjustments}
                colorSwap={colorSwap}
                transparencyWand={transparencyWand}
                isEyedropperActive={isEyedropperActive}
                eyedropperTarget={eyedropperTarget}
                onAdjustmentsChange={handleAdjustmentsChange}
                onResetAdjustments={handleResetAdjustments}
                onColorSwapChange={(u) => setColorSwap((p) => ({ ...p, ...u }))}
                onApplyColorSwap={handleApplyColorSwap}
                onTransparencyWandChange={(u) => setTransparencyWand((p) => ({ ...p, ...u }))}
                onApplyTransparencyWand={handleApplyTransparencyWand}
                onToggleEyedropper={handleToggleEyedropper}
              />
            )}

            {activeSideTab === 'geometria' && (
              <ImageGeometryPanel
                imageWidth={imgWidth}
                imageHeight={imgHeight}
                isCropping={isCropping}
                cropAspect={cropAspect}
                onCropAspectChange={handleCropAspectChange}
                onStartCrop={handleStartCrop}
                onApplyCrop={handleApplyCrop}
                onCancelCrop={handleCancelCrop}
                onResize={handleResize}
                onRotateAngle={handleRotateAngle}
                onRotateStep={handleRotateStep}
                onFlip={handleFlip}
              />
            )}

            {activeSideTab === 'efectos' && (
              <ImageEffectsPanel
                effects={effects}
                activeFilterPreset={activeFilterPreset}
                onEffectsChange={(u) => setEffects((p) => ({ ...p, ...u }))}
                onApplyEffects={handleApplyEffects}
                onResetEffects={() => setEffects(DEFAULT_EFFECTS)}
                onSelectFilterPreset={handleSelectFilterPreset}
              />
            )}
          </div>
        </aside>
      </div>

      {/* Modales y Cajones de Soporte */}
      <ImageAiToolsModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        isProcessing={isProcessing}
        processingMessage={processingMessage}
        isMaskDrawingActive={isMaskDrawingActive}
        maskBrushRadius={maskBrushRadius}
        onMaskBrushRadiusChange={setMaskBrushRadius}
        onToggleMaskDrawing={() => setIsMaskDrawingActive(!isMaskDrawingActive)}
        onClearMask={() => {
          if (maskCanvas) {
            const ctx = maskCanvas.getContext('2d')!;
            ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
          }
        }}
        onExecuteBackgroundRemoval={handleExecuteBackgroundRemoval}
        onExecuteInpaint={handleExecuteInpaint}
        onExecuteUpscale={handleExecuteUpscale}
      />

      <ImageVersionsDrawer
        isOpen={isVersionsDrawerOpen}
        onClose={() => setIsVersionsDrawerOpen(false)}
        versions={versions}
        activeVersionId={activeVersionId}
        onRestoreVersion={handleRestoreVersion}
        onCompareWithVersion={handleCompareWithVersion}
        onSaveCurrentAsVersion={(name) => {
          if (currentCanvas) {
            pushVersion(currentCanvas, 'Versión guardada manualmente', name);
            addNotification('Historial', `Instantánea "${name}" guardada.`, 'success', 'editor_imagenes');
          }
        }}
        onRevertToOriginal={handleRevertToOriginal}
      />
    </div>
  );
};
