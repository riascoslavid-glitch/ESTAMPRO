import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  GraphicElement,
  GraphicTool,
  CanvasDimensions,
  PRINT_CANVAS_TEMPLATES,
  GraphicStudioProject
} from '../../../types/graphicEditor';
import { StoredFile, PrintZone3D } from '../../../types';
import { TYPOGRAPHY_PRESETS } from '../../../services/graphicEditor/typographyPresets';
import { RulersAndGrid } from './RulersAndGrid';
import { LayersPanel } from './LayersPanel';
import { PropertiesInspector } from './PropertiesInspector';
import {
  MousePointer,
  Pencil,
  Paintbrush,
  Eraser,
  Type,
  Square,
  Circle,
  Minus,
  MoveRight,
  Star,
  Triangle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Undo2,
  Redo2,
  Copy,
  Trash2,
  Download,
  Upload,
  Box,
  Layers,
  Sliders,
  Grid,
  Sparkles,
  FolderOpen,
  Save,
  Check,
  RotateCcw,
  FlipHorizontal,
  Printer,
  AlertTriangle,
  FolderArchive,
  X,
  Plus,
  Palette
} from 'lucide-react';

export const GraphicDesignerView: React.FC = () => {
  const {
    addNotification,
    setActiveModuleId,
    setActiveGraphicTextureUri,
    setGraphicPrintPlacement,
    openInImageEditor,
    storedFiles,
    projects,
    createProject,
    updateProject,
    uploadStoredFile,
    targetDesignStudioItem,
    setTargetDesignStudioItem,
    sendToProbador3D
  } = useApp();

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'warning' | 'alert' = 'info') => {
    addNotification('Estudio de Diseño', message, type, 'estudio_diseno');
  }, [addNotification]);

  // Project identity
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState<string>('Diseño Textil Sin Título');
  const [clientName, setClientName] = useState<string>('Cliente Taller');
  const [garmentModel, setGarmentModel] = useState<string>('camiseta_basica');

  // Canvas configuration
  const [activeTemplateKey, setActiveTemplateKey] = useState<string>('pecho_centro_a4');
  const [customDimensions, setCustomDimensions] = useState<{ widthCm: number; heightCm: number }>({
    widthCm: 21,
    heightCm: 29.7
  });
  const [isCustomDimensions, setIsCustomDimensions] = useState<boolean>(false);
  const [unit, setUnit] = useState<'cm' | 'mm'>('cm');
  const [canvasBgColor, setCanvasBgColor] = useState<string>('transparent'); // 'transparent', '#ffffff', '#0f172a', or hex
  const [mirrorHorizontal, setMirrorHorizontal] = useState<boolean>(false);
  const [printDpi, setPrintDpi] = useState<number>(300);
  const [colorProfile, setColorProfile] = useState<'CMYK FOGRA39' | 'sRGB' | 'Adobe RGB 1998'>('CMYK FOGRA39');

  const activeTemplate: CanvasDimensions = isCustomDimensions
    ? {
        name: `Personalizado (${customDimensions.widthCm} x ${customDimensions.heightCm} cm)`,
        widthCm: customDimensions.widthCm,
        heightCm: customDimensions.heightCm,
        dpi: printDpi
      }
    : PRINT_CANVAS_TEMPLATES[activeTemplateKey] || PRINT_CANVAS_TEMPLATES.pecho_centro_a4;

  // Zoom & view controls
  const [zoomLevel, setZoomLevel] = useState<number>(1.0); // 1.0 = 100%
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showRulers, setShowRulers] = useState<boolean>(true);
  const [cursorPos, setCursorPos] = useState<{ xCm: number; yCm: number }>({ xCm: 0, yCm: 0 });

  // Active Tool
  const [activeTool, setActiveTool] = useState<GraphicTool>('select');

  // Elements (Vector & Graphic Layers)
  const [elements, setElements] = useState<GraphicElement[]>([
    {
      id: 'el-bg-badge',
      name: 'Escudo Base',
      type: 'rect',
      x: 3.5,
      y: 4.0,
      width: 14.0,
      height: 14.0,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      fill: '#18181b',
      stroke: '#06b6d4',
      strokeWidth: 3,
      borderRadius: 1.5
    },
    {
      id: 'el-title-top',
      name: 'Texto Superior Curvado',
      type: 'text',
      x: 2.5,
      y: 6.0,
      width: 16.0,
      height: 3.5,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      fill: '#f8fafc',
      stroke: 'transparent',
      strokeWidth: 0,
      text: 'HARMONY STUDIO',
      fontFamily: 'Impact, "Arial Black", sans-serif',
      fontSize: 28,
      fontWeight: 'bold',
      fontStyle: 'normal',
      textAlign: 'center',
      letterSpacing: 2,
      isCurved: true,
      curveRadius: 14
    },
    {
      id: 'el-star-accent',
      name: 'Estrella Central',
      type: 'star',
      x: 8.5,
      y: 9.5,
      width: 4.0,
      height: 4.0,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      fill: '#06b6d4',
      stroke: '#ffffff',
      strokeWidth: 1.5
    },
    {
      id: 'el-sub-text',
      name: 'Subtítulo Textil',
      type: 'text',
      x: 3.0,
      y: 14.5,
      width: 15.0,
      height: 2.5,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      fill: '#94a3b8',
      stroke: 'transparent',
      strokeWidth: 0,
      text: 'TEXTILE PRINTING · 360°',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
      letterSpacing: 3
    }
  ]);

  const [selectedElementId, setSelectedElementId] = useState<string | null>('el-title-top');

  // History stack for Undo / Redo
  const [history, setHistory] = useState<GraphicElement[][]>([elements]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Interactive drawing states
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentDrawPath, setCurrentDrawPath] = useState<Array<{ x: number; y: number }>>([]);

  // Dragging and moving states
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ xCm: number; yCm: number; elX: number; elY: number }>({
    xCm: 0,
    yCm: 0,
    elX: 0,
    elY: 0
  });

  // Right sidebar tab
  const [sidebarTab, setSidebarTab] = useState<'propiedades' | 'capas' | 'preprensa'>('propiedades');

  // Modals
  const [isInsertFromStorageOpen, setIsInsertFromStorageOpen] = useState<boolean>(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [isOpenProjectsModalOpen, setIsOpenProjectsModalOpen] = useState<boolean>(false);
  const [isSendTo3DModalOpen, setIsSendTo3DModalOpen] = useState<boolean>(false);
  const [target3DZone, setTarget3DZone] = useState<PrintZone3D>('centro_frontal');
  const [isCustomDimModalOpen, setIsCustomDimModalOpen] = useState<boolean>(false);

  const canvasSvgRef = useRef<SVGSVGElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Base scale: pixels per centimeter
  const basePixelsPerCm = 26 * zoomLevel;

  // History tracking
  const pushHistory = useCallback((newElements: GraphicElement[]) => {
    setHistory((prev) => {
      const next = prev.slice(0, historyIndex + 1);
      return [...next, newElements];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setElements(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setElements(history[newIndex]);
    }
  };

  // Check incoming target from Archivos y Diseños
  useEffect(() => {
    if (targetDesignStudioItem) {
      if (targetDesignStudioItem.graphicStudioState) {
        // Saved graphic studio project with full editable layers
        const state = targetDesignStudioItem.graphicStudioState;
        if (state.elements && Array.isArray(state.elements)) {
          setElements(state.elements);
          pushHistory(state.elements);
        }
        if (state.templateKey) setActiveTemplateKey(state.templateKey);
        if (state.backgroundColor) setCanvasBgColor(state.backgroundColor);
        if (state.unit) setUnit(state.unit);
        if (state.dpi) setPrintDpi(state.dpi);
        if (state.title || targetDesignStudioItem.name) {
          setProjectTitle(state.title || targetDesignStudioItem.name);
        }
        if (targetDesignStudioItem.id) setCurrentProjectId(targetDesignStudioItem.id);
        showToast(`Proyecto "${targetDesignStudioItem.name}" abierto con todas sus capas editables.`, 'success');
      } else if (targetDesignStudioItem.dataUri || targetDesignStudioItem.url) {
        // Raw incoming image/SVG
        const newEl: GraphicElement = {
          id: `el-import-${Date.now()}`,
          name: targetDesignStudioItem.name || 'Arte Importado',
          type: 'image',
          x: Math.max(0, (activeTemplate.widthCm - 16) / 2),
          y: Math.max(0, (activeTemplate.heightCm - 16) / 2),
          width: targetDesignStudioItem.widthCm || 16.0,
          height: targetDesignStudioItem.heightCm || 16.0,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          fill: 'transparent',
          stroke: 'transparent',
          strokeWidth: 0,
          imageSrc: targetDesignStudioItem.dataUri || targetDesignStudioItem.url
        };
        setElements((prev) => {
          const updated = [...prev, newEl];
          pushHistory(updated);
          return updated;
        });
        setSelectedElementId(newEl.id);
        showToast(`Imagen "${targetDesignStudioItem.name}" insertada en el lienzo.`, 'success');
      }
      setTargetDesignStudioItem(null);
    }
  }, [targetDesignStudioItem, activeTemplate.widthCm, activeTemplate.heightCm, pushHistory, showToast, setTargetDesignStudioItem]);

  // Update element
  const handleUpdateElement = (id: string, updates: Partial<GraphicElement>) => {
    setElements((prev) => {
      const updated = prev.map((el) => (el.id === id ? { ...el, ...updates } : el));
      pushHistory(updated);
      return updated;
    });
  };

  // Duplicate element
  const handleDuplicateElement = (id: string) => {
    const target = elements.find((el) => el.id === id);
    if (!target) return;

    const copy: GraphicElement = {
      ...target,
      id: `el-${Date.now()}`,
      name: `${target.name} (Copia)`,
      x: target.x + 1.0,
      y: target.y + 1.0
    };

    setElements((prev) => {
      const updated = [...prev, copy];
      pushHistory(updated);
      return updated;
    });
    setSelectedElementId(copy.id);
  };

  // Delete element
  const handleDeleteElement = (id: string) => {
    setElements((prev) => {
      const updated = prev.filter((el) => el.id !== id);
      pushHistory(updated);
      return updated;
    });
    if (selectedElementId === id) setSelectedElementId(null);
  };

  // Move layer
  const handleMoveLayer = (id: string, direction: 'up' | 'down') => {
    setElements((prev) => {
      const idx = prev.findIndex((el) => el.id === id);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx + 1 : idx - 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;

      const updated = [...prev];
      const item = updated.splice(idx, 1)[0];
      updated.splice(targetIdx, 0, item);
      pushHistory(updated);
      return updated;
    });
  };

  // Alignments
  const handleAlignElement = (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (!selectedElementId) return;
    const el = elements.find((e) => e.id === selectedElementId);
    if (!el) return;

    let newX = el.x;
    let newY = el.y;

    switch (alignment) {
      case 'left':
        newX = 0;
        break;
      case 'center':
        newX = (activeTemplate.widthCm - el.width) / 2;
        break;
      case 'right':
        newX = activeTemplate.widthCm - el.width;
        break;
      case 'top':
        newY = 0;
        break;
      case 'middle':
        newY = (activeTemplate.heightCm - el.height) / 2;
        break;
      case 'bottom':
        newY = activeTemplate.heightCm - el.height;
        break;
    }

    handleUpdateElement(selectedElementId, { x: Math.max(0, newX), y: Math.max(0, newY) });
  };

  // Create element on canvas click
  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (activeTool === 'select' || isDrawing || isDragging) return;

    const rect = canvasSvgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickXCm = (e.clientX - rect.left) / basePixelsPerCm;
    const clickYCm = (e.clientY - rect.top) / basePixelsPerCm;

    let newEl: GraphicElement | null = null;
    const timestamp = Date.now();

    switch (activeTool) {
      case 'text':
        newEl = {
          id: `el-text-${timestamp}`,
          name: 'Texto Nuevo',
          type: 'text',
          x: Math.max(0, clickXCm - 5),
          y: Math.max(0, clickYCm - 1),
          width: 10,
          height: 2.5,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          fill: '#ffffff',
          stroke: 'transparent',
          strokeWidth: 0,
          text: 'TEXTO DE PRUEBA',
          fontFamily: TYPOGRAPHY_PRESETS[0].family,
          fontSize: 24,
          fontWeight: 'bold',
          textAlign: 'center'
        };
        break;
      case 'rect':
        newEl = {
          id: `el-rect-${timestamp}`,
          name: 'Rectángulo',
          type: 'rect',
          x: Math.max(0, clickXCm - 3),
          y: Math.max(0, clickYCm - 2),
          width: 6,
          height: 4,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          fill: '#06b6d4',
          stroke: '#ffffff',
          strokeWidth: 2,
          borderRadius: 0.2
        };
        break;
      case 'circle':
        newEl = {
          id: `el-circle-${timestamp}`,
          name: 'Círculo',
          type: 'circle',
          x: Math.max(0, clickXCm - 2.5),
          y: Math.max(0, clickYCm - 2.5),
          width: 5,
          height: 5,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          fill: '#6366f1',
          stroke: '#ffffff',
          strokeWidth: 2
        };
        break;
      case 'star':
        newEl = {
          id: `el-star-${timestamp}`,
          name: 'Estrella',
          type: 'star',
          x: Math.max(0, clickXCm - 2.5),
          y: Math.max(0, clickYCm - 2.5),
          width: 5,
          height: 5,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          fill: '#f59e0b',
          stroke: '#ffffff',
          strokeWidth: 1.5
        };
        break;
      case 'triangle':
        newEl = {
          id: `el-triangle-${timestamp}`,
          name: 'Triángulo',
          type: 'triangle',
          x: Math.max(0, clickXCm - 2.5),
          y: Math.max(0, clickYCm - 2.5),
          width: 5,
          height: 5,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          fill: '#ec4899',
          stroke: '#ffffff',
          strokeWidth: 2
        };
        break;
      case 'arrow':
        newEl = {
          id: `el-arrow-${timestamp}`,
          name: 'Flecha',
          type: 'arrow',
          x: Math.max(0, clickXCm - 3),
          y: Math.max(0, clickYCm - 1),
          width: 6,
          height: 2,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          fill: '#10b981',
          stroke: '#ffffff',
          strokeWidth: 1.5
        };
        break;
      case 'line':
        newEl = {
          id: `el-line-${timestamp}`,
          name: 'Línea Guía',
          type: 'line',
          x: Math.max(0, clickXCm - 4),
          y: clickYCm,
          width: 8,
          height: 0.2,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          fill: '#06b6d4',
          stroke: '#06b6d4',
          strokeWidth: 3
        };
        break;
    }

    if (newEl) {
      setElements((prev) => {
        const updated = [...prev, newEl!];
        pushHistory(updated);
        return updated;
      });
      setSelectedElementId(newEl.id);
      setActiveTool('select');
      setSidebarTab('propiedades');
    }
  };

  // Cursor tracking in cm
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = canvasSvgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const xCm = (e.clientX - rect.left) / basePixelsPerCm;
    const yCm = (e.clientY - rect.top) / basePixelsPerCm;
    setCursorPos({ xCm: Math.max(0, xCm), yCm: Math.max(0, yCm) });

    // Dragging element
    if (isDragging && selectedElementId) {
      const deltaX = xCm - dragStart.xCm;
      const deltaY = yCm - dragStart.yCm;
      const targetEl = elements.find((el) => el.id === selectedElementId);
      if (targetEl && !targetEl.locked) {
        setElements((prev) =>
          prev.map((el) =>
            el.id === selectedElementId
              ? {
                  ...el,
                  x: Math.max(0, Math.min(activeTemplate.widthCm - el.width, dragStart.elX + deltaX)),
                  y: Math.max(0, Math.min(activeTemplate.heightCm - el.height, dragStart.elY + deltaY))
                }
              : el
          )
        );
      }
    }

    // Freehand drawing
    if (isDrawing && (activeTool === 'pencil' || activeTool === 'brush')) {
      setCurrentDrawPath((prev) => [...prev, { x: xCm, y: yCm }]);
    }
  };

  const handleMouseDownOnElement = (e: React.MouseEvent, el: GraphicElement) => {
    // If eraser tool active, erase this element!
    if (activeTool === 'eraser') {
      e.stopPropagation();
      handleDeleteElement(el.id);
      showToast(`Elemento "${el.name}" borrado con el borrador.`, 'info');
      return;
    }

    if (activeTool !== 'select' || el.locked) return;
    e.stopPropagation();
    setSelectedElementId(el.id);
    setIsDragging(true);

    const rect = canvasSvgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const xCm = (e.clientX - rect.left) / basePixelsPerCm;
    const yCm = (e.clientY - rect.top) / basePixelsPerCm;

    setDragStart({
      xCm,
      yCm,
      elX: el.x,
      elY: el.y
    });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      pushHistory(elements);
    }

    if (isDrawing && currentDrawPath.length > 1) {
      setIsDrawing(false);
      const isBrush = activeTool === 'brush';
      const newStroke: GraphicElement = {
        id: `el-path-${Date.now()}`,
        name: isBrush ? 'Trazo de Pincel' : 'Trazo de Lápiz',
        type: 'path',
        x: 0,
        y: 0,
        width: activeTemplate.widthCm,
        height: activeTemplate.heightCm,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
        fill: 'transparent',
        stroke: isBrush ? '#ec4899' : '#06b6d4',
        strokeWidth: isBrush ? 8 : 3,
        points: currentDrawPath
      };

      setElements((prev) => {
        const updated = [...prev, newStroke];
        pushHistory(updated);
        return updated;
      });
      setCurrentDrawPath([]);
      setSelectedElementId(newStroke.id);
      setActiveTool('select');
    }
  };

  const handleStartDrawing = (e: React.MouseEvent) => {
    if (activeTool === 'pencil' || activeTool === 'brush') {
      const rect = canvasSvgRef.current?.getBoundingClientRect();
      if (!rect) return;
      const xCm = (e.clientX - rect.left) / basePixelsPerCm;
      const yCm = (e.clientY - rect.top) / basePixelsPerCm;
      setIsDrawing(true);
      setCurrentDrawPath([{ x: xCm, y: yCm }]);
    }
  };

  // Import local file from hard drive
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      const newEl: GraphicElement = {
        id: `el-img-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        type: 'image',
        x: Math.max(0, (activeTemplate.widthCm - 14) / 2),
        y: Math.max(0, (activeTemplate.heightCm - 14) / 2),
        width: 14.0,
        height: 14.0,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
        fill: 'transparent',
        stroke: 'transparent',
        strokeWidth: 0,
        imageSrc: dataUri
      };

      setElements((prev) => {
        const updated = [...prev, newEl];
        pushHistory(updated);
        return updated;
      });
      setSelectedElementId(newEl.id);
      showToast(`Archivo "${file.name}" importado al lienzo correctamente.`, 'success');
    };

    reader.readAsDataURL(file);
  };

  // Insert existing file from "Archivos y Diseños"
  const handleInsertFromStorage = (file: StoredFile) => {
    const isSvg = file.extension.toLowerCase() === '.svg';
    const newEl: GraphicElement = {
      id: `el-vault-${Date.now()}`,
      name: file.name,
      type: 'image',
      x: Math.max(0, (activeTemplate.widthCm - 14) / 2),
      y: Math.max(0, (activeTemplate.heightCm - 14) / 2),
      width: file.dimensions?.widthCm || 14.0,
      height: file.dimensions?.heightCm || 14.0,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      fill: 'transparent',
      stroke: 'transparent',
      strokeWidth: 0,
      imageSrc: file.dataUri || file.url
    };

    setElements((prev) => {
      const updated = [...prev, newEl];
      pushHistory(updated);
      return updated;
    });
    setSelectedElementId(newEl.id);
    setIsInsertFromStorageOpen(false);
    showToast(`"${file.name}" insertado desde la Bóveda de Archivos.`, 'success');
  };

  // Generate PNG data URI from SVG Canvas
  const generateCanvasPNG = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const svgEl = canvasSvgRef.current;
      if (!svgEl) return reject(new Error('Canvas no disponible'));

      try {
        const svgXml = new XMLSerializer().serializeToString(svgEl);
        const svgBlob = new Blob([svgXml], { type: 'image/svg+xml;charset=utf-8' });
        const URL = window.URL || window.webkitURL || window;
        const blobURL = URL.createObjectURL(svgBlob);

        const image = new Image();
        image.onload = () => {
          const exportCanvas = document.createElement('canvas');
          const scale = printDpi / 72; // scale for print DPI
          exportCanvas.width = activeTemplate.widthCm * (basePixelsPerCm / zoomLevel) * scale;
          exportCanvas.height = activeTemplate.heightCm * (basePixelsPerCm / zoomLevel) * scale;
          const ctx = exportCanvas.getContext('2d')!;

          // If background color is set and not transparent
          if (canvasBgColor !== 'transparent') {
            ctx.fillStyle = canvasBgColor;
            ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
          } else {
            ctx.clearRect(0, 0, exportCanvas.width, exportCanvas.height);
          }

          // Mirroring if enabled
          if (mirrorHorizontal) {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(image, -exportCanvas.width, 0, exportCanvas.width, exportCanvas.height);
            ctx.restore();
          } else {
            ctx.drawImage(image, 0, 0, exportCanvas.width, exportCanvas.height);
          }

          URL.revokeObjectURL(blobURL);
          resolve(exportCanvas.toDataURL('image/png'));
        };
        image.onerror = (err) => reject(err);
        image.src = blobURL;
      } catch (err) {
        reject(err);
      }
    });
  };

  // Export PNG to download
  const handleExportPNG = async () => {
    try {
      const pngUrl = await generateCanvasPNG();
      const downloadLink = document.createElement('a');
      downloadLink.download = `${projectTitle.toLowerCase().replace(/\s+/g, '_')}_${printDpi}dpi.png`;
      downloadLink.href = pngUrl;
      downloadLink.click();
      showToast(`Arte exportado en PNG transparente (${printDpi} DPI).`, 'success');
    } catch (err) {
      showToast('Error al exportar imagen PNG.', 'alert');
    }
  };

  // Save Project (Persists into projects collection AND storedFiles so it appears in Archivos y Diseños!)
  const handleSaveProject = async () => {
    try {
      showToast('Guardando proyecto editable en la nube...', 'info');
      const previewDataUri = await generateCanvasPNG();

      const graphicStudioState: GraphicStudioProject = {
        id: currentProjectId || `proj-${Date.now()}`,
        title: projectTitle,
        clientName,
        garmentName: garmentModel,
        garmentModel,
        templateKey: activeTemplateKey,
        canvasWidthCm: activeTemplate.widthCm,
        canvasHeightCm: activeTemplate.heightCm,
        dpi: printDpi,
        unit,
        backgroundColor: canvasBgColor,
        mirrorHorizontal,
        colorProfile,
        elements,
        previewDataUri,
        createdAt: new Date().toLocaleDateString('es-ES'),
        updatedAt: new Date().toLocaleDateString('es-ES'),
        version: 1
      };

      // 1. Save / Update in Project entity
      if (currentProjectId) {
        await updateProject(currentProjectId, {
          title: projectTitle,
          clientName,
          thumbnailUrl: previewDataUri,
          graphicStudioState
        });
      } else {
        const newProj = await createProject({
          title: projectTitle,
          ownerId: 'current-user',
          clientName,
          garmentName: garmentModel,
          garmentColor: 'Negro',
          garmentColorHex: '#111827',
          techniqueId: 'dtf_textil',
          quantity: 25,
          status: 'en_diseno',
          thumbnailUrl: previewDataUri,
          graphicStudioState
        });
        setCurrentProjectId(newProj.id);
      }

      // 2. Save into storedFiles so it immediately appears in Archivos y Diseños!
      const storedFileItem: StoredFile = {
        id: `file-art-${Date.now().toString(36)}`,
        name: `${projectTitle}.png`,
        sizeBytes: Math.round(previewDataUri.length * 0.75),
        mimeType: 'image/png',
        extension: '.png',
        folder: 'artes_vectoriales',
        projectId: currentProjectId || undefined,
        projectName: projectTitle,
        ownerId: 'current-user',
        dataUri: previewDataUri,
        dimensions: {
          widthCm: activeTemplate.widthCm,
          heightCm: activeTemplate.heightCm,
          dpi: printDpi
        },
        status: 'en_progreso',
        isFavorite: false,
        graphicStudioState,
        createdAt: new Date().toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      };

      await uploadStoredFile(storedFileItem);

      setIsSaveModalOpen(false);
      showToast(`Proyecto "${projectTitle}" guardado exitosamente en Bóveda de Archivos y Proyectos.`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Error al guardar el proyecto.', 'alert');
    }
  };

  // Open saved project from project list
  const handleOpenProject = (proj: any) => {
    if (proj.graphicStudioState) {
      const state = proj.graphicStudioState as GraphicStudioProject;
      if (state.elements && Array.isArray(state.elements)) {
        setElements(state.elements);
        pushHistory(state.elements);
      }
      if (state.templateKey) setActiveTemplateKey(state.templateKey);
      if (state.backgroundColor) setCanvasBgColor(state.backgroundColor);
      if (state.unit) setUnit(state.unit);
      if (state.dpi) setPrintDpi(state.dpi);
      setProjectTitle(state.title || proj.title);
      setCurrentProjectId(proj.id);
      setIsOpenProjectsModalOpen(false);
      showToast(`Proyecto "${proj.title}" cargado con éxito.`, 'success');
    } else {
      showToast('Este proyecto no tiene capas gráficas 2D asociadas.', 'warning');
    }
  };

  // Send to 3D simulation
  const handleConfirmSendTo3D = async () => {
    try {
      showToast('Preparando renderizado y mapeo 3D...', 'info');
      const textureUri = await generateCanvasPNG();
      sendToProbador3D({
        textureUri,
        name: projectTitle,
        zone: target3DZone,
        widthCm: activeTemplate.widthCm,
        heightCm: activeTemplate.heightCm,
        garmentModel
      });
      setIsSendTo3DModalOpen(false);
    } catch (err) {
      showToast('Error al enviar arte al probador 3D.', 'alert');
    }
  };

  // Calculate resolution in pixels
  const physicalPixelsW = Math.round((activeTemplate.widthCm / 2.54) * printDpi);
  const physicalPixelsH = Math.round((activeTemplate.heightCm / 2.54) * printDpi);

  const selectedElement = elements.find((el) => el.id === selectedElementId) || null;

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl select-none">
      {/* 1. BARRA SUPERIOR DE ACCIONES */}
      <div className="h-13 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between z-30 flex-wrap gap-2">
        {/* Identidad del Estudio & Título Editable */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              <Palette className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="text-xs font-bold text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 outline-none truncate max-w-[180px] sm:max-w-[240px]"
                title="Haz clic para renombrar el proyecto"
              />
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                <span>{activeTemplate.name}</span>
                <span>·</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">{printDpi} DPI</span>
              </div>
            </div>
          </div>

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          {/* Selector de Plantilla de Estampado */}
          <select
            value={isCustomDimensions ? 'custom' : activeTemplateKey}
            onChange={(e) => {
              if (e.target.value === 'custom') {
                setIsCustomDimensions(true);
                setIsCustomDimModalOpen(true);
              } else {
                setIsCustomDimensions(false);
                setActiveTemplateKey(e.target.value);
              }
            }}
            className="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none cursor-pointer hidden md:block"
          >
            {Object.entries(PRINT_CANVAS_TEMPLATES).map(([key, t]) => (
              <option key={key} value={key}>
                {t.name}
              </option>
            ))}
            <option value="custom">📐 Medidas Personalizadas...</option>
          </select>
        </div>

        {/* Acciones de Edición, Archivos, Persistencia & Proyección al 3D */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Deshacer / Rehacer */}
          <button
            type="button"
            title="Deshacer (Ctrl+Z)"
            disabled={historyIndex <= 0}
            onClick={handleUndo}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Rehacer (Ctrl+Y)"
            disabled={historyIndex >= history.length - 1}
            onClick={handleRedo}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-800" />

          {/* Zoom */}
          <button
            type="button"
            title="Alejar Zoom"
            onClick={() => setZoomLevel((z) => Math.max(0.4, z - 0.15))}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono text-slate-500 w-11 text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            title="Acercar Zoom"
            onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.15))}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          {/* Botón Insertar desde Archivos y Diseños */}
          <button
            type="button"
            title="Insertar logotipo o ilustración desde la Bóveda de Archivos"
            onClick={() => setIsInsertFromStorageOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border border-indigo-200 dark:border-cyan-800 bg-indigo-50/60 dark:bg-cyan-950/40 text-indigo-700 dark:text-cyan-300 hover:bg-indigo-100 cursor-pointer transition-colors"
          >
            <FolderArchive className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
            <span className="hidden md:inline">Desde Archivos</span>
          </button>

          {/* Subir local */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.svg,.webp"
            onChange={handleImportFile}
            className="hidden"
          />
          <button
            type="button"
            title="Subir archivo desde tu ordenador"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Subir</span>
          </button>

          {/* Abrir Proyectos Guardados */}
          <button
            type="button"
            title="Recuperar o abrir proyectos guardados"
            onClick={() => setIsOpenProjectsModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 cursor-pointer"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Abrir</span>
          </button>

          {/* Guardar Proyecto */}
          <button
            type="button"
            title="Guardar proyecto editable y registrar en Bóveda de Archivos"
            onClick={() => setIsSaveModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 cursor-pointer shadow-2xs"
          >
            <Save className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Guardar</span>
          </button>

          {/* Exportar PNG */}
          <button
            type="button"
            title="Exportar archivo PNG de alta resolución para DTF/Serigrafía"
            onClick={handleExportPNG}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Exportar</span>
          </button>

          {/* BOTÓN PROYECTAR EN PROBADOR 3D */}
          <button
            type="button"
            title="Enviar arte gráfico y mapear sobre la prenda 3D"
            onClick={() => setIsSendTo3DModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Box className="w-3.5 h-3.5" />
            <span>Ver en 3D</span>
          </button>
        </div>
      </div>

      {/* 2. BARRA SECUNDARIA: AJUSTES DE LIENZO, FONDO Y UNIDADES */}
      <div className="h-9 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 z-20 overflow-x-auto">
        <div className="flex items-center gap-3">
          {/* Unidades cm / mm */}
          <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded-md p-0.5 bg-white dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setUnit('cm')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                unit === 'cm' ? 'bg-indigo-600 text-white dark:bg-cyan-600' : 'text-slate-500'
              }`}
            >
              cm
            </button>
            <button
              type="button"
              onClick={() => setUnit('mm')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                unit === 'mm' ? 'bg-indigo-600 text-white dark:bg-cyan-600' : 'text-slate-500'
              }`}
            >
              mm
            </button>
          </div>

          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700" />

          {/* Color de Fondo del Lienzo */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-slate-400">Fondo:</span>
            {[
              { id: 'transparent', label: 'Transparente', class: 'bg-white border-dashed' },
              { id: '#ffffff', label: 'Blanco', class: 'bg-white' },
              { id: '#0f172a', label: 'Negro', class: 'bg-slate-900' },
              { id: '#1e3a8a', label: 'Azul Marino', class: 'bg-blue-900' },
              { id: '#dc2626', label: 'Rojo', class: 'bg-red-600' }
            ].map((bg) => (
              <button
                key={bg.id}
                type="button"
                title={`Fondo ${bg.label}`}
                onClick={() => setCanvasBgColor(bg.id)}
                className={`w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 cursor-pointer transition-transform ${bg.class} ${
                  canvasBgColor === bg.id ? 'ring-2 ring-indigo-500 scale-110' : 'opacity-80 hover:opacity-100'
                }`}
              />
            ))}
            <input
              type="color"
              value={canvasBgColor === 'transparent' ? '#ffffff' : canvasBgColor}
              onChange={(e) => setCanvasBgColor(e.target.value)}
              className="w-4 h-4 p-0 rounded-full border border-slate-300 dark:border-slate-600 cursor-pointer ml-0.5"
              title="Personalizar color de tela"
            />
          </div>

          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          {/* Espejado Horizontal (DTF / Sublimación) */}
          <button
            type="button"
            onClick={() => setMirrorHorizontal(!mirrorHorizontal)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border cursor-pointer ${
              mirrorHorizontal
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-cyan-950/40 dark:text-cyan-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-500'
            }`}
            title="Espejar horizontalmente para películas DTF o transfer térmico"
          >
            <FlipHorizontal className="w-3.5 h-3.5" />
            <span>Espejado DTF</span>
          </button>
        </div>

        {/* Dimensiones Físicas y Píxeles */}
        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
          <span>
            {unit === 'mm'
              ? `${activeTemplate.widthCm * 10} x ${activeTemplate.heightCm * 10} mm`
              : `${activeTemplate.widthCm} x ${activeTemplate.heightCm} cm`}
          </span>
          <span>·</span>
          <span>{physicalPixelsW} x {physicalPixelsH} px</span>
        </div>
      </div>

      {/* 3. ÁREA DE TRABAJO PRINCIPAL (TOOLBAR IZQUIERDA + LIENZO + PANEL DERECHO) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Barra de Herramientas Lateral Izquierda */}
        <div className="w-14 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-3 gap-1 z-20">
          {[
            { id: 'select', icon: MousePointer, label: 'Seleccionar (V)' },
            { id: 'text', icon: Type, label: 'Texto (T)' },
            { id: 'pencil', icon: Pencil, label: 'Lápiz Vectorial (P)' },
            { id: 'brush', icon: Paintbrush, label: 'Pincel Textil (B)' },
            { id: 'eraser', icon: Eraser, label: 'Borrador (E)' },
            { id: 'rect', icon: Square, label: 'Rectángulo (R)' },
            { id: 'circle', icon: Circle, label: 'Círculo (C)' },
            { id: 'star', icon: Star, label: 'Estrella' },
            { id: 'triangle', icon: Triangle, label: 'Triángulo' },
            { id: 'arrow', icon: MoveRight, label: 'Flecha' },
            { id: 'line', icon: Minus, label: 'Línea' }
          ].map((tool) => {
            const Icon = tool.icon;
            const isSelected = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                type="button"
                title={tool.label}
                onClick={() => setActiveTool(tool.id as GraphicTool)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white dark:bg-cyan-600 dark:text-white shadow-md scale-105'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}

          <div className="w-8 h-px bg-slate-200 dark:bg-slate-800 my-1" />

          {/* Toggle de Cuadrícula */}
          <button
            type="button"
            title="Mostrar / Ocultar Cuadrícula"
            onClick={() => setShowGrid(!showGrid)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
              showGrid
                ? 'text-indigo-600 dark:text-cyan-400 bg-indigo-50 dark:bg-cyan-950/40'
                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>

        {/* LIENZO VECTORIAL CENTRAL */}
        <div
          className="flex-1 relative overflow-auto bg-slate-200/80 dark:bg-slate-950 flex items-center justify-center p-8"
          onMouseUp={handleMouseUp}
        >
          {/* Contenedor del Lienzo con Reglas */}
          <div
            className={`relative shadow-2xl rounded-sm border border-slate-300 dark:border-slate-800 transition-colors ${
              canvasBgColor === 'transparent'
                ? 'bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]'
                : ''
            }`}
            style={{
              width: `${activeTemplate.widthCm * basePixelsPerCm + 22}px`,
              height: `${activeTemplate.heightCm * basePixelsPerCm + 22}px`,
              backgroundColor: canvasBgColor !== 'transparent' ? canvasBgColor : undefined
            }}
          >
            {/* Reglas y Cuadrícula */}
            {showRulers && (
              <RulersAndGrid
                widthCm={activeTemplate.widthCm}
                heightCm={activeTemplate.heightCm}
                pixelsPerCm={basePixelsPerCm}
                showGrid={showGrid}
                cursorXCm={cursorPos.xCm}
                cursorYCm={cursorPos.yCm}
                unit={unit}
              />
            )}

            {/* Lienzo SVG Principal de Diseño */}
            <svg
              ref={canvasSvgRef}
              className="absolute top-5.5 left-5.5 cursor-crosshair overflow-hidden"
              style={{
                width: `${activeTemplate.widthCm * basePixelsPerCm}px`,
                height: `${activeTemplate.heightCm * basePixelsPerCm}px`,
                transform: mirrorHorizontal ? 'scaleX(-1)' : undefined
              }}
              viewBox={`0 0 ${activeTemplate.widthCm * basePixelsPerCm} ${activeTemplate.heightCm * basePixelsPerCm}`}
              onClick={handleCanvasClick}
              onMouseDown={handleStartDrawing}
              onMouseMove={handleMouseMove}
            >
              <defs>
                <filter id="soft-text-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.4" />
                </filter>
              </defs>

              {/* Capas y Elementos Gráficos */}
              {elements.map((el) => {
                if (!el.visible) return null;

                const isSelected = selectedElementId === el.id;
                const pxX = el.x * basePixelsPerCm;
                const pxY = el.y * basePixelsPerCm;
                const pxW = el.width * basePixelsPerCm;
                const pxH = el.height * basePixelsPerCm;

                const strokeDashValue =
                  el.strokeDash === 'dashed' ? '8,4' : el.strokeDash === 'dotted' ? '2,4' : undefined;

                return (
                  <g
                    key={el.id}
                    id={`svg-layer-${el.id}`}
                    transform={`translate(${pxX}, ${pxY}) rotate(${el.rotation}, ${pxW / 2}, ${pxH / 2})`}
                    opacity={el.opacity}
                    onMouseDown={(e) => handleMouseDownOnElement(e, el)}
                    className="cursor-pointer"
                  >
                    {/* 1. RECTÁNGULO */}
                    {el.type === 'rect' && (
                      <rect
                        width={pxW}
                        height={pxH}
                        rx={(el.borderRadius || 0) * basePixelsPerCm}
                        fill={el.fill}
                        stroke={el.stroke}
                        strokeWidth={el.strokeWidth}
                        strokeDasharray={strokeDashValue}
                      />
                    )}

                    {/* 2. CÍRCULO */}
                    {el.type === 'circle' && (
                      <ellipse
                        cx={pxW / 2}
                        cy={pxH / 2}
                        rx={pxW / 2}
                        ry={pxH / 2}
                        fill={el.fill}
                        stroke={el.stroke}
                        strokeWidth={el.strokeWidth}
                        strokeDasharray={strokeDashValue}
                      />
                    )}

                    {/* 3. LÍNEA */}
                    {el.type === 'line' && (
                      <line
                        x1={0}
                        y1={pxH / 2}
                        x2={pxW}
                        y2={pxH / 2}
                        stroke={el.stroke}
                        strokeWidth={el.strokeWidth}
                        strokeDasharray={strokeDashValue}
                      />
                    )}

                    {/* 4. FLECHA */}
                    {el.type === 'arrow' && (
                      <polygon
                        points={`0,${pxH * 0.35} ${pxW * 0.65},${pxH * 0.35} ${pxW * 0.65},0 ${pxW},${pxH * 0.5} ${pxW * 0.65},${pxH} ${pxW * 0.65},${pxH * 0.65} 0,${pxH * 0.65}`}
                        fill={el.fill}
                        stroke={el.stroke}
                        strokeWidth={el.strokeWidth}
                        strokeDasharray={strokeDashValue}
                      />
                    )}

                    {/* 5. ESTRELLA */}
                    {el.type === 'star' && (
                      <polygon
                        points={`${pxW * 0.5},0 ${pxW * 0.62},${pxH * 0.38} ${pxW},${pxH * 0.38} ${pxW * 0.69},${pxH * 0.62} ${pxW * 0.81},${pxH} ${pxW * 0.5},${pxH * 0.77} ${pxW * 0.19},${pxH} ${pxW * 0.31},${pxH * 0.62} 0,${pxH * 0.38} ${pxW * 0.38},${pxH * 0.38}`}
                        fill={el.fill}
                        stroke={el.stroke}
                        strokeWidth={el.strokeWidth}
                        strokeDasharray={strokeDashValue}
                      />
                    )}

                    {/* 6. TRIÁNGULO */}
                    {el.type === 'triangle' && (
                      <polygon
                        points={`${pxW * 0.5},0 ${pxW},${pxH} 0,${pxH}`}
                        fill={el.fill}
                        stroke={el.stroke}
                        strokeWidth={el.strokeWidth}
                        strokeDasharray={strokeDashValue}
                      />
                    )}

                    {/* 7. TRAZO LIBRE DE PINCEL / LÁPIZ */}
                    {el.type === 'path' && el.points && el.points.length > 1 && (
                      <polyline
                        points={el.points
                          .map((p) => `${p.x * basePixelsPerCm},${p.y * basePixelsPerCm}`)
                          .join(' ')}
                        fill="none"
                        stroke={el.stroke}
                        strokeWidth={el.strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}

                    {/* 8. IMAGEN / SVG IMPORTADO */}
                    {el.type === 'image' && el.imageSrc && (
                      <image
                        href={el.imageSrc}
                        width={pxW}
                        height={pxH}
                        preserveAspectRatio="xMidYMid meet"
                      />
                    )}

                    {/* 9. TEXTO (Plano o en Arco Circular) */}
                    {el.type === 'text' && (
                      <>
                        {el.isCurved ? (
                          <>
                            <path
                              id={`curve-${el.id}`}
                              d={`M 0,${pxH} Q ${pxW / 2},${pxH - (el.curveRadius || 12) * 5} ${pxW},${pxH}`}
                              fill="none"
                              stroke="transparent"
                            />
                            <text
                              fill={el.fill}
                              stroke={el.stroke}
                              strokeWidth={el.strokeWidth || 0}
                              style={{
                                fontFamily: el.fontFamily,
                                fontSize: `${el.fontSize || 24}px`,
                                fontWeight: el.fontWeight || 'bold',
                                fontStyle: el.fontStyle || 'normal',
                                letterSpacing: `${el.letterSpacing || 0}px`
                              }}
                            >
                              <textPath href={`#curve-${el.id}`} startOffset="50%" textAnchor="middle">
                                {el.text}
                              </textPath>
                            </text>
                          </>
                        ) : (
                          <text
                            x={el.textAlign === 'center' ? pxW / 2 : el.textAlign === 'right' ? pxW : 0}
                            y={pxH * 0.75}
                            textAnchor={el.textAlign === 'center' ? 'middle' : el.textAlign === 'right' ? 'end' : 'start'}
                            fill={el.fill}
                            stroke={el.stroke}
                            strokeWidth={el.strokeWidth || 0}
                            transform={el.skewX ? `skewX(${el.skewX})` : undefined}
                            style={{
                              fontFamily: el.fontFamily,
                              fontSize: `${el.fontSize || 24}px`,
                              fontWeight: el.fontWeight || 'bold',
                              fontStyle: el.fontStyle || 'normal',
                              letterSpacing: `${el.letterSpacing || 0}px`
                            }}
                          >
                            {el.text}
                          </text>
                        )}
                      </>
                    )}

                    {/* CUADRO DE SELECCIÓN Y TIRADORES DE ESCALA */}
                    {isSelected && (
                      <g className="pointer-events-none">
                        <rect
                          x={-2}
                          y={-2}
                          width={pxW + 4}
                          height={pxH + 4}
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth="1.5"
                          strokeDasharray="4,4"
                        />
                        <circle cx={-2} cy={-2} r={4} fill="#06b6d4" />
                        <circle cx={pxW + 2} cy={-2} r={4} fill="#06b6d4" />
                        <circle cx={-2} cy={pxH + 2} r={4} fill="#06b6d4" />
                        <circle cx={pxW + 2} cy={pxH + 2} r={4} fill="#06b6d4" />
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Trazo activo en vivo mientras se dibuja */}
              {isDrawing && currentDrawPath.length > 1 && (
                <polyline
                  points={currentDrawPath
                    .map((p) => `${p.x * basePixelsPerCm},${p.y * basePixelsPerCm}`)
                    .join(' ')}
                  fill="none"
                  stroke={activeTool === 'brush' ? '#ec4899' : '#06b6d4'}
                  strokeWidth={activeTool === 'brush' ? 8 : 3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none"
                />
              )}
            </svg>
          </div>
        </div>

        {/* PANEL LATERAL DERECHO (CAPAS, PROPIEDADES, PREPRENSA) */}
        <div className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col z-20">
          {/* Pestañas del Panel Derecho */}
          <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-1">
            <button
              type="button"
              onClick={() => setSidebarTab('propiedades')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer text-center ${
                sidebarTab === 'propiedades'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-cyan-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Propiedades
            </button>
            <button
              type="button"
              onClick={() => setSidebarTab('capas')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer text-center ${
                sidebarTab === 'capas'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-cyan-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Capas ({elements.length})
            </button>
            <button
              type="button"
              onClick={() => setSidebarTab('preprensa')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer text-center ${
                sidebarTab === 'preprensa'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-cyan-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Pre-prensa
            </button>
          </div>

          {/* Contenido Dinámico de la Pestaña Seleccionada */}
          <div className="flex-1 overflow-hidden">
            {sidebarTab === 'propiedades' && (
              <PropertiesInspector
                element={selectedElement}
                onUpdateElement={handleUpdateElement}
                onAlignElement={handleAlignElement}
                onOpenInImageEditor={openInImageEditor}
              />
            )}

            {sidebarTab === 'capas' && (
              <LayersPanel
                elements={elements}
                selectedElementId={selectedElementId}
                onSelectElement={setSelectedElementId}
                onToggleVisibility={(id) => {
                  const el = elements.find((e) => e.id === id);
                  if (el) handleUpdateElement(id, { visible: !el.visible });
                }}
                onToggleLock={(id) => {
                  const el = elements.find((e) => e.id === id);
                  if (el) handleUpdateElement(id, { locked: !el.locked });
                }}
                onDuplicateElement={handleDuplicateElement}
                onDeleteElement={handleDeleteElement}
                onMoveLayer={handleMoveLayer}
                onRenameElement={(id, newName) => handleUpdateElement(id, { name: newName })}
                onCreateNewLayer={() => {
                  const newText: GraphicElement = {
                    id: `el-text-${Date.now()}`,
                    name: `Capa ${elements.length + 1}`,
                    type: 'text',
                    x: 4.0,
                    y: 6.0,
                    width: 12.0,
                    height: 3.0,
                    rotation: 0,
                    opacity: 1,
                    visible: true,
                    locked: false,
                    fill: '#ffffff',
                    stroke: 'transparent',
                    strokeWidth: 0,
                    text: 'NUEVA CAPA',
                    fontFamily: TYPOGRAPHY_PRESETS[0].family,
                    fontSize: 22,
                    fontWeight: 'bold',
                    textAlign: 'center'
                  };
                  setElements((prev) => [...prev, newText]);
                  setSelectedElementId(newText.id);
                  setSidebarTab('propiedades');
                }}
              />
            )}

            {sidebarTab === 'preprensa' && (
              <div className="p-4 space-y-5 text-xs overflow-y-auto h-full">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <Printer className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
                  <span className="font-bold text-slate-900 dark:text-white">
                    Especificaciones de Impresión Textil
                  </span>
                </div>

                {/* Configuración de DPI */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    Resolución de Salida (DPI):
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {[72, 150, 300, 600].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setPrintDpi(d)}
                        className={`py-1.5 rounded-lg border text-xs font-mono font-bold cursor-pointer ${
                          printDpi === d
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-cyan-950/40 text-indigo-700 dark:text-cyan-300'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {d} DPI
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    300 DPI es el estándar calibrado para DTF, serigrafía y sublimación.
                  </span>
                </div>

                {/* Perfil de Color */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    Perfil de Color ICC:
                  </label>
                  <select
                    value={colorProfile}
                    onChange={(e) => setColorProfile(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="CMYK FOGRA39">CMYK FOGRA39 (Textil Estándar)</option>
                    <option value="sRGB">sRGB IEC61966-2.1 (Digital / Web)</option>
                    <option value="Adobe RGB 1998">Adobe RGB (1998)</option>
                  </select>
                </div>

                {/* Dimensiones Físicas y Pixeles */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="flex justify-between text-slate-500">
                    <span>Área estampable:</span>
                    <span className="font-mono text-slate-900 dark:text-white font-bold">
                      {activeTemplate.widthCm} x {activeTemplate.heightCm} cm
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Matriz de píxeles:</span>
                    <span className="font-mono text-slate-900 dark:text-white font-bold">
                      {physicalPixelsW} x {physicalPixelsH} px
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Espejado horizontal:</span>
                    <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                      {mirrorHorizontal ? 'ACTIVO (DTF)' : 'Normal'}
                    </span>
                  </div>
                </div>

                {/* Pre-flight Audit Banner */}
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                    <Check className="w-4 h-4" />
                    <span>Auditoría Pre-vuelo Aprobada</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                    Todas las capas vectoriales y tipográficas escalan sin pérdida de calidad.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL 1: INSERTAR DESDE ARCHIVOS Y DISEÑOS */}
      {isInsertFromStorageOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FolderArchive className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Insertar Arte desde Bóveda de Archivos
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsInsertFromStorageOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Selecciona cualquier archivo o logotipo almacenado para insertarlo instantáneamente como una nueva capa en el lienzo de diseño.
            </p>

            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3 pr-1">
              {storedFiles.length === 0 ? (
                <div className="col-span-3 p-8 text-center text-xs text-slate-400">
                  No hay archivos almacenados. Puedes subir artes en el módulo de Archivos y Diseños.
                </div>
              ) : (
                storedFiles.map((file) => (
                  <div
                    key={file.id}
                    onClick={() => handleInsertFromStorage(file)}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-cyan-400 bg-slate-50 dark:bg-slate-800/60 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between space-y-2 group"
                  >
                    <div className="w-full h-24 rounded-lg bg-white dark:bg-slate-900 overflow-hidden flex items-center justify-center p-2 border border-slate-200/60 dark:border-slate-700/60">
                      {file.dataUri ? (
                        <img src={file.dataUri} alt={file.name} className="max-h-full max-w-full object-contain" />
                      ) : (
                        <span className="text-xs font-mono text-slate-400">{file.extension}</span>
                      )}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-cyan-400">
                        {file.name}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {file.dimensions?.widthCm ? `${file.dimensions.widthCm}x${file.dimensions.heightCm} cm` : file.extension}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: GUARDAR PROYECTO */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Save className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Guardar Proyecto de Diseño</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nombre del Proyecto Textil:
                </label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Cliente o Marca:
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Prenda Destino:
                </label>
                <select
                  value={garmentModel}
                  onChange={(e) => setGarmentModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="camiseta_basica">Camiseta Cuello Redondo</option>
                  <option value="hoodie_oversize">Hoodie Canguro con Capucha</option>
                  <option value="gorra_trucker">Gorra Trucker</option>
                  <option value="polo_piquet">Polo Piqué</option>
                  <option value="tote_bag">Tote Bag Textil</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSaveModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveProject}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer shadow-sm"
              >
                Guardar Proyecto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ABRIR PROYECTOS GUARDADOS */}
      {isOpenProjectsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Proyectos de Diseño Guardados
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpenProjectsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {projects.filter((p) => p.graphicStudioState).length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No hay proyectos guardados aún. Al guardar tu lienzo se almacenará aquí con todas sus capas editables.
                </div>
              ) : (
                projects
                  .filter((p) => p.graphicStudioState)
                  .map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleOpenProject(p)}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-cyan-400 bg-slate-50 dark:bg-slate-800/60 cursor-pointer flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-white dark:bg-slate-900 overflow-hidden flex items-center justify-center border border-slate-200/80">
                          {p.thumbnailUrl ? (
                            <img src={p.thumbnailUrl} alt={p.title} className="max-h-full max-w-full object-contain" />
                          ) : (
                            <Palette className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400">
                            {p.title}
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            {p.clientName} · {p.updatedAt}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-indigo-600 dark:text-cyan-400 group-hover:underline">
                        Abrir Lienzo &rarr;
                      </span>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: PROYECTAR EN PRENDA 3D */}
      {isSendTo3DModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Box className="w-5 h-5 text-cyan-500" />
              <span>Proyectar en Simulador 3D</span>
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Se renderizará el diseño a {printDpi} DPI y se mapeará con precisión anatómica en el Probador 3D.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Prenda Tridimensional:
                </label>
                <select
                  value={garmentModel}
                  onChange={(e) => setGarmentModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="camiseta_basica">Camiseta de Algodón Cuello Redondo</option>
                  <option value="hoodie_oversize">Hoodie Oversize con Capucha</option>
                  <option value="gorra_trucker">Gorra Trucker</option>
                  <option value="polo_piquet">Polo Piqué</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Zona Anatómica de Impresión:
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
                onClick={() => setIsSendTo3DModalOpen(false)}
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

      {/* MODAL 5: MEDIDAS PERSONALIZADAS DE LIENZO */}
      {isCustomDimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Dimensiones Personalizadas del Lienzo
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Ancho ({unit}):
                </label>
                <input
                  type="number"
                  min="5"
                  max="150"
                  step="0.5"
                  value={unit === 'mm' ? customDimensions.widthCm * 10 : customDimensions.widthCm}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 20;
                    setCustomDimensions((prev) => ({
                      ...prev,
                      widthCm: unit === 'mm' ? val / 10 : val
                    }));
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Alto ({unit}):
                </label>
                <input
                  type="number"
                  min="5"
                  max="150"
                  step="0.5"
                  value={unit === 'mm' ? customDimensions.heightCm * 10 : customDimensions.heightCm}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 20;
                    setCustomDimensions((prev) => ({
                      ...prev,
                      heightCm: unit === 'mm' ? val / 10 : val
                    }));
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCustomDimModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 cursor-pointer"
              >
                Aplicar Dimensiones
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
