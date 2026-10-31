/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Wand2,
  Layers,
  Palette,
  Sliders,
  Maximize2,
  Download,
  Box,
  PenTool,
  RotateCcw,
  Trash2,
  Star,
  RefreshCw,
  Trophy,
  Briefcase,
  Smile,
  Megaphone,
  Music,
  Type,
  Compass,
  Feather,
  Printer,
  Grid
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import {
  AIDesignCategory,
  AITextileStyle,
  AIToolMode,
  AIGeneratedItem
} from '../../../types/creativeAI';
import {
  AI_CATEGORIES,
  AI_STYLES,
  removeBackgroundWithCanvas,
  enhanceImageQuality,
  generateSyntheticTextileSVG,
  generateDesignVariations
} from '../../../services/aiTextileEngine';
import { PrintZone3D } from '../../../types';

export const CreativeAIStudioView: React.FC = () => {
  const {
    sendAIToGraphicEditor,
    sendAITo3DGarment,
    openInImageEditor,
    addNotification
  } = useApp();

  // Selección de categoría y estilo
  const [activeCategory, setActiveCategory] = useState<AIDesignCategory>('deportivos');
  const [activeStyle, setActiveStyle] = useState<AITextileStyle>('vector_flat');
  const [activeTool, setActiveTool] = useState<AIToolMode>('generar');

  // Input de texto para la generación
  const [promptText, setPromptText] = useState<string>(
    'Crear un diseño moderno para una camiseta deportiva con un león, líneas geométricas y colores negro y dorado'
  );
  const [selectedPaletteIndex, setSelectedPaletteIndex] = useState<number>(0);
  const [customColors, setCustomColors] = useState<string[]>(['#000000', '#F59E0B', '#DC2626', '#FFFFFF']);

  // Parámetros de impresión y dimensión
  const [targetPrintZone, setTargetPrintZone] = useState<PrintZone3D>('centro_frontal');
  const [printWidthCm] = useState<number>(26);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '3:4' | '4:3'>('1:1');

  // Estado de conexión del servicio AI
  const [aiServiceStatus, setAiServiceStatus] = useState<{
    hasGeminiKey: boolean;
    activeEndpoint: string;
    safeArchitectureNote: string;
  }>({
    hasGeminiKey: false,
    activeEndpoint: 'Local Textile Engine',
    safeArchitectureNote: 'Conexión segura vía servidor proxy local'
  });

  // Estados de ejecución
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [isRemovingBg, setIsRemovingBg] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Parámetros de ajuste en tiempo real
  const [bgTolerance, setBgTolerance] = useState<number>(30);
  const [sharpnessLevel, setSharpnessLevel] = useState<number>(45);
  const [showTransparencyGrid, setShowTransparencyGrid] = useState<boolean>(true);
  const [isSplitCompareActive, setIsSplitCompareActive] = useState<boolean>(false);
  const [splitSliderPos, setSplitSliderPos] = useState<number>(50);

  // Historial de diseños generados
  const [designsHistory, setDesignsHistory] = useState<AIGeneratedItem[]>(() => {
    try {
      const saved = localStorage.getItem('estampapro_ai_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    const initialSvg = generateSyntheticTextileSVG(
      'León Deportivo Oro y Negro',
      'deportivos',
      'vector_flat',
      ['#000000', '#F59E0B', '#D97706', '#FFFFFF']
    );
    return [
      {
        id: 'ai-init-1',
        title: 'León Geométrico Campeón',
        prompt: 'Crear un diseño moderno para una camiseta deportiva con un león, líneas geométricas y colores negro y dorado',
        category: 'deportivos',
        style: 'vector_flat',
        paletteName: 'Negro & Oro Campeón',
        colors: ['#000000', '#F59E0B', '#D97706', '#FFFFFF'],
        imageUrl: initialSvg,
        hasTransparentBg: true,
        aspectRatio: '1:1',
        recommendedTechnique: 'DTF / Serigrafía',
        printWidthCm: 26,
        printHeightCm: 26,
        dpi: 300,
        createdAt: 'Hoy',
        timestamp: Date.now(),
        favorite: true,
        source: 'vector_engine',
        separationAdvice: 'Separación a 4 tintas con base blanca 100% opaca y trama de 55 LPI.'
      }
    ];
  });

  // Diseño actualmente seleccionado
  const [currentDesign, setCurrentDesign] = useState<AIGeneratedItem | null>(() => {
    return designsHistory.length > 0 ? designsHistory[0] : null;
  });
  const [originalBeforeEditUrl, setOriginalBeforeEditUrl] = useState<string | null>(() => {
    return designsHistory.length > 0 ? designsHistory[0].imageUrl : null;
  });

  // Filtro de historial
  const [historyCategoryFilter, setHistoryCategoryFilter] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);

  // Guardar historial en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('estampapro_ai_history', JSON.stringify(designsHistory));
    } catch (e) {}
  }, [designsHistory]);

  // Verificar estado del backend de IA al montar
  useEffect(() => {
    fetch('/api/ai/info')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.hasGeminiKey === 'boolean') {
          setAiServiceStatus({
            hasGeminiKey: data.hasGeminiKey,
            activeEndpoint: data.activeEndpoint,
            safeArchitectureNote: data.safeArchitectureNote
          });
        }
      })
      .catch((err) => {
        console.warn('API info notice:', err);
      });
  }, []);

  const currentCategoryConfig = AI_CATEGORIES.find((c) => c.id === activeCategory) || AI_CATEGORIES[0];

  useEffect(() => {
    const suggested = currentCategoryConfig.suggestedPalettes[0];
    if (suggested) {
      setCustomColors([...suggested.colors]);
      setSelectedPaletteIndex(0);
    }
  }, [activeCategory]);

  // Refinamiento de Prompt con Gemini
  const handleRefinePrompt = async () => {
    if (!promptText.trim()) return;
    setIsRefining(true);
    setStatusMessage('Refinando prompt con asistente experto en artes textiles...');

    try {
      const response = await fetch('/api/ai/refine-textile-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          category: activeCategory,
          style: activeStyle,
          technique: currentCategoryConfig.recommendedTechniques[0]
        })
      });

      const data = await response.json();
      if (data.refinedPrompt) {
        setPromptText(data.refinedPrompt);
        addNotification(
          'Prompt Textil Optimizado',
          'Se agregaron especificaciones de preprensa, separación de tintas y contornos de corte.',
          'success',
          'ia_creativa'
        );
      }
    } catch (err) {
      console.warn('Error refinando prompt:', err);
    } finally {
      setIsRefining(false);
      setStatusMessage(null);
    }
  };

  // Generación de Nuevo Diseño
  const handleGenerateDesign = async () => {
    if (!promptText.trim()) return;
    setIsGenerating(true);
    setStatusMessage('Generando ilustración textil calibrada...');

    try {
      const res = await fetch('/api/ai/generate-textile-art', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          category: activeCategory,
          style: activeStyle,
          palette: currentCategoryConfig.suggestedPalettes[selectedPaletteIndex]?.name || 'Personalizada',
          aspectRatio
        })
      });

      const data = await res.json();
      let finalImageUrl: string;
      let finalSource: AIGeneratedItem['source'] = 'vector_engine';

      if (data.success && data.imageUrl) {
        finalImageUrl = data.imageUrl;
        finalSource = 'gemini';
      } else {
        finalImageUrl = generateSyntheticTextileSVG(
          promptText,
          activeCategory,
          activeStyle,
          customColors
        );
      }

      const newItem: AIGeneratedItem = {
        id: `ai-gen-${Date.now()}`,
        title: promptText.slice(0, 32) + (promptText.length > 32 ? '...' : ''),
        prompt: promptText,
        category: activeCategory,
        style: activeStyle,
        paletteName: currentCategoryConfig.suggestedPalettes[selectedPaletteIndex]?.name || 'Paleta Activa',
        colors: [...customColors],
        imageUrl: finalImageUrl,
        hasTransparentBg: true,
        aspectRatio,
        recommendedTechnique: currentCategoryConfig.recommendedTechniques[0] || 'DTF / Serigrafía',
        printWidthCm,
        printHeightCm: Math.round(printWidthCm * (aspectRatio === '3:4' ? 1.33 : aspectRatio === '4:3' ? 0.75 : 1)),
        dpi: 300,
        createdAt: 'Ahora mismo',
        timestamp: Date.now(),
        favorite: false,
        source: finalSource,
        separationAdvice: `Técnica recomendada: ${currentCategoryConfig.recommendedTechniques[0]}. Trama recomendada 55 LPI.`
      };

      setCurrentDesign(newItem);
      setOriginalBeforeEditUrl(finalImageUrl);
      setDesignsHistory((prev) => [newItem, ...prev]);

      addNotification(
        'Nuevo Diseño IA Creado',
        `Diseño para categoría "${currentCategoryConfig.name}" generado exitosamente a 300 DPI.`,
        'success',
        'ia_creativa'
      );
    } catch (err) {
      console.error('Error generating design:', err);
      const fallbackSvg = generateSyntheticTextileSVG(
        promptText,
        activeCategory,
        activeStyle,
        customColors
      );

      const fallbackItem: AIGeneratedItem = {
        id: `ai-gen-${Date.now()}`,
        title: promptText.slice(0, 32),
        prompt: promptText,
        category: activeCategory,
        style: activeStyle,
        paletteName: 'Paleta Local',
        colors: [...customColors],
        imageUrl: fallbackSvg,
        hasTransparentBg: true,
        aspectRatio,
        recommendedTechnique: 'DTF / Serigrafía',
        printWidthCm,
        printHeightCm: printWidthCm,
        dpi: 300,
        createdAt: 'Ahora mismo',
        timestamp: Date.now(),
        favorite: false,
        source: 'vector_engine'
      };

      setCurrentDesign(fallbackItem);
      setOriginalBeforeEditUrl(fallbackSvg);
      setDesignsHistory((prev) => [fallbackItem, ...prev]);
    } finally {
      setIsGenerating(false);
      setStatusMessage(null);
    }
  };

  // Generar 3 Variaciones del diseño actual
  const handleGenerateVariations = () => {
    if (!currentDesign) return;
    setIsGenerating(true);
    setStatusMessage('Creando 3 variaciones estilísticas del diseño actual...');

    setTimeout(() => {
      const variations = generateDesignVariations(currentDesign);
      setDesignsHistory((prev) => [...variations, ...prev]);
      if (variations.length > 0) {
        setCurrentDesign(variations[0]);
      }
      setIsGenerating(false);
      setStatusMessage(null);
      addNotification(
        'Variaciones Generadas',
        'Se crearon 3 variantes de color y estilo para este diseño.',
        'success',
        'ia_creativa'
      );
    }, 600);
  };

  // Eliminar fondo en tiempo real mediante Canvas
  const handleRemoveBackground = async () => {
    if (!currentDesign) return;
    setIsRemovingBg(true);
    setStatusMessage('Aislando gráfico y eliminando fondo para estampado limpio...');

    try {
      const transparentDataUrl = await removeBackgroundWithCanvas(
        currentDesign.imageUrl,
        bgTolerance
      );

      const updated: AIGeneratedItem = {
        ...currentDesign,
        imageUrl: transparentDataUrl,
        transparentUrl: transparentDataUrl,
        hasTransparentBg: true,
        source: 'modified'
      };

      setCurrentDesign(updated);
      setDesignsHistory((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );

      addNotification(
        'Fondo Eliminado',
        'El arte ahora tiene fondo transparente listo para DTF o serigrafía sin recuadros opacos.',
        'success',
        'ia_creativa'
      );
    } catch (err) {
      console.warn('Error removing background:', err);
    } finally {
      setIsRemovingBg(false);
      setStatusMessage(null);
    }
  };

  // Mejorar resolución y nitidez
  const handleEnhanceQuality = async () => {
    if (!currentDesign) return;
    setIsEnhancing(true);
    setStatusMessage('Aplicando filtro de super nitidez 300 DPI y realce de contrastes...');

    try {
      const enhancedDataUrl = await enhanceImageQuality(
        currentDesign.imageUrl,
        sharpnessLevel,
        15
      );

      const updated: AIGeneratedItem = {
        ...currentDesign,
        imageUrl: enhancedDataUrl,
        dpi: 300,
        source: 'modified'
      };

      setCurrentDesign(updated);
      setDesignsHistory((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );

      addNotification(
        'Resolución Mejorada',
        'Arte procesado con filtro convolucional para máxima nitidez en prensa textil.',
        'success',
        'ia_creativa'
      );
    } catch (err) {
      console.warn('Error enhancing image:', err);
    } finally {
      setIsEnhancing(false);
      setStatusMessage(null);
    }
  };

  // Cambiar Estilo del diseño actual
  const handleApplyStyle = (newStyle: AITextileStyle) => {
    setActiveStyle(newStyle);
    if (!currentDesign) return;

    const newSvg = generateSyntheticTextileSVG(
      currentDesign.prompt,
      currentDesign.category,
      newStyle,
      currentDesign.colors
    );

    const updated: AIGeneratedItem = {
      ...currentDesign,
      style: newStyle,
      imageUrl: newSvg,
      source: 'modified'
    };

    setCurrentDesign(updated);
    setDesignsHistory((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  // Cambiar Paleta de Colores
  const handleApplyPalette = (palette: { name: string; colors: string[] }, index: number) => {
    setSelectedPaletteIndex(index);
    setCustomColors([...palette.colors]);

    if (!currentDesign) return;

    const newSvg = generateSyntheticTextileSVG(
      currentDesign.prompt,
      currentDesign.category,
      currentDesign.style,
      palette.colors
    );

    const updated: AIGeneratedItem = {
      ...currentDesign,
      paletteName: palette.name,
      colors: [...palette.colors],
      imageUrl: newSvg,
      source: 'modified'
    };

    setCurrentDesign(updated);
    setDesignsHistory((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  // Crear Elemento Aislado (Escudo, Mascota, Sello, etc.)
  const handleCreateElement = (elementType: 'escudo' | 'mascota' | 'sello' | 'emblema') => {
    const promptElementMap = {
      escudo: `Escudo heráldico deportivo de alta precisión con laureles y estrellas`,
      mascota: `Mascota agresiva de felino o águila en estilo vector para jersey deportivo`,
      sello: `Sello postal circular vintage con relieve perimetral y fecha de fundación`,
      emblema: `Emblema corporativo moderno con geometría poligonal y cinta de calidad`
    };

    setPromptText(promptElementMap[elementType]);
    handleGenerateDesign();
  };

  // Descargar PNG
  const handleDownloadPNG = () => {
    if (!currentDesign) return;
    const link = document.createElement('a');
    link.href = currentDesign.imageUrl;
    link.download = `estampapro-ai-${currentDesign.category}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification('Descarga Iniciada', 'Arte textil descargado en alta resolución.', 'info', 'ia_creativa');
  };

  // Toggle Favorito
  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDesignsHistory((prev) =>
      prev.map((d) => (d.id === id ? { ...d, favorite: !d.favorite } : d))
    );
    if (currentDesign && currentDesign.id === id) {
      setCurrentDesign((prev) => (prev ? { ...prev, favorite: !prev.favorite } : null));
    }
  };

  // Eliminar del historial
  const deleteFromHistory = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const remaining = designsHistory.filter((d) => d.id !== id);
    setDesignsHistory(remaining);
    if (currentDesign && currentDesign.id === id) {
      setCurrentDesign(remaining.length > 0 ? remaining[0] : null);
    }
  };

  // Restaurar original antes de filtros
  const handleRestoreOriginal = () => {
    if (originalBeforeEditUrl && currentDesign) {
      setCurrentDesign({
        ...currentDesign,
        imageUrl: originalBeforeEditUrl
      });
      addNotification('Diseño Restaurado', 'Se restableció el arte a su estado original.', 'info', 'ia_creativa');
    }
  };

  // Filtrado de historial
  const filteredHistory = designsHistory.filter((item) => {
    if (onlyFavorites && !item.favorite) return false;
    if (historyCategoryFilter !== 'all' && item.category !== historyCategoryFilter) return false;
    return true;
  });

  // Mapear icono de categoría
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trophy': return <Trophy className="w-4 h-4" />;
      case 'Briefcase': return <Briefcase className="w-4 h-4" />;
      case 'Smile': return <Smile className="w-4 h-4" />;
      case 'Megaphone': return <Megaphone className="w-4 h-4" />;
      case 'Music': return <Music className="w-4 h-4" />;
      case 'Type': return <Type className="w-4 h-4" />;
      case 'Compass': return <Compass className="w-4 h-4" />;
      case 'Feather': return <Feather className="w-4 h-4" />;
      default: return <Palette className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado Principal y Estado de Conexión */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-2xl border border-indigo-500/20 shadow-xl text-white">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-400/30 backdrop-blur-sm">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Centro de IA Creativa Textil</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  Prompt 9 • Gemini AI
                </span>
              </div>
              <p className="text-sm text-slate-300">
                Generación, estilización y aislamiento de diseños listos para serigrafía, DTF y catálogo 3D.
              </p>
            </div>
          </div>
        </div>

        {/* Indicador de Estado del Backend */}
        <div className="flex items-center gap-3 bg-slate-800/80 backdrop-blur px-4 py-2.5 rounded-xl border border-slate-700/60 text-xs">
          <div className={`w-2.5 h-2.5 rounded-full ${aiServiceStatus.hasGeminiKey ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'}`} />
          <div>
            <div className="font-semibold text-slate-200">
              {aiServiceStatus.hasGeminiKey ? 'Gemini 3.8 Flash & Imagen Activo' : 'Motor Textil Calibrado'}
            </div>
            <div className="text-slate-400">
              {aiServiceStatus.hasGeminiKey ? 'Credenciales seguras en servidor' : 'Listo para síntesis vectorial 300 DPI'}
            </div>
          </div>
        </div>
      </div>

      {/* Selector de 10 Categorías Reglamentarias */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <Grid className="w-4 h-4 text-indigo-500" />
            <span>Categorías Especializadas para Prendas (10)</span>
          </div>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
            Prendas sugeridas: {currentCategoryConfig.recommendedGarments.slice(0, 2).join(' • ')}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
          {AI_CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-center transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 ring-2 ring-indigo-500/40 font-semibold'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/40 text-xs'
                }`}
              >
                <div className={`p-1.5 rounded-lg mb-1.5 ${isSelected ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700/60 text-indigo-500'}`}>
                  {getCategoryIcon(cat.iconName)}
                </div>
                <span className="truncate w-full text-[11px] font-medium leading-tight">{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Chips de Prompts sugeridos para la categoría activa */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-medium whitespace-nowrap">Sugerencias:</span>
          {currentCategoryConfig.popularPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setPromptText(p)}
              className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 whitespace-nowrap transition-colors"
            >
              {p.slice(0, 48)}...
            </button>
          ))}
        </div>
      </div>

      {/* Grid Central: Área de Trabajo y Controles de IA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Panel de Herramientas & Prompts (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Barra de Herramientas de IA */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-indigo-500" />
                Suite de Herramientas IA
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                DPI: 300
              </span>
            </div>

            {/* Pestañas de Modos de Herramienta */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-medium">
              <button
                onClick={() => setActiveTool('generar')}
                className={`py-2 px-2.5 rounded-lg text-center transition-all ${
                  activeTool === 'generar'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                1. Generar
              </button>
              <button
                onClick={() => setActiveTool('estilos')}
                className={`py-2 px-2.5 rounded-lg text-center transition-all ${
                  activeTool === 'estilos'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                2. Estilos & Color
              </button>
              <button
                onClick={() => setActiveTool('eliminar_fondo')}
                className={`py-2 px-2.5 rounded-lg text-center transition-all ${
                  activeTool === 'eliminar_fondo'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                3. Aislamiento
              </button>
            </div>

            {/* Sub-panel según herramienta seleccionada */}
            {activeTool === 'generar' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Descripción del Arte Textil:
                    </label>
                    <button
                      onClick={handleRefinePrompt}
                      disabled={isRefining || !promptText.trim()}
                      className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 disabled:opacity-50"
                    >
                      <Sparkles className="w-3 h-3" />
                      {isRefining ? 'Refinando...' : 'Refinar con Gemini'}
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="Describe el estampado deseado (ej. León geométrico dorado con escudo de campeonato)..."
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all resize-none"
                  />
                </div>

                {/* Parámetros de Estilo y Proporción */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Estilo Visual Textil
                    </label>
                    <select
                      value={activeStyle}
                      onChange={(e) => setActiveStyle(e.target.value as AITextileStyle)}
                      className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                    >
                      {AI_STYLES.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Proporción de Arte
                    </label>
                    <div className="grid grid-cols-3 gap-1">
                      {(['1:1', '3:4', '4:3'] as const).map((r) => (
                        <button
                          key={r}
                          onClick={() => setAspectRatio(r)}
                          className={`py-1.5 rounded-lg border text-center font-medium ${
                            aspectRatio === r
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Acciones Rápidas: Crear Elementos Aislados */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Generar Elemento Específico:
                  </span>
                  <div className="grid grid-cols-4 gap-1.5 text-xs">
                    <button
                      onClick={() => handleCreateElement('escudo')}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-center font-medium"
                    >
                      🛡️ Escudo
                    </button>
                    <button
                      onClick={() => handleCreateElement('mascota')}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-center font-medium"
                    >
                      🦁 Mascota
                    </button>
                    <button
                      onClick={() => handleCreateElement('sello')}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-center font-medium"
                    >
                      ⭕ Sello
                    </button>
                    <button
                      onClick={() => handleCreateElement('emblema')}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-center font-medium"
                    >
                      ⭐ Emblema
                    </button>
                  </div>
                </div>

                {/* Botón Principal Generar */}
                <button
                  onClick={handleGenerateDesign}
                  disabled={isGenerating || !promptText.trim()}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{statusMessage || 'Generando Arte Textil...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Generar Arte Textil (300 DPI)</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {activeTool === 'estilos' && (
              <div className="space-y-4 text-xs">
                {/* Selector de Estilos Textil */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Estilos Artísticos Textil:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {AI_STYLES.map((st) => {
                      const isSt = activeStyle === st.id;
                      return (
                        <button
                          key={st.id}
                          onClick={() => handleApplyStyle(st.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all ${
                            isSt
                              ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 ring-2 ring-indigo-500/30'
                              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-900 dark:text-slate-100">{st.badge}</span>
                            <span className="text-[10px] text-indigo-500 font-mono">{st.idealTechnique}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2">{st.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Paletas de Color Curadas */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Paletas de Color Calibradas para Impresión:
                  </label>
                  <div className="space-y-2">
                    {currentCategoryConfig.suggestedPalettes.map((pal, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleApplyPalette(pal, idx)}
                        className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-all ${
                          selectedPaletteIndex === idx
                            ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <span className="font-medium text-slate-800 dark:text-slate-200">{pal.name}</span>
                        <div className="flex items-center gap-1">
                          {pal.colors.map((hex, i) => (
                            <span
                              key={i}
                              className="w-5 h-5 rounded-full border border-black/20 shadow-sm"
                              style={{ backgroundColor: hex }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botón de Generar Variaciones */}
                <button
                  onClick={handleGenerateVariations}
                  disabled={isGenerating || !currentDesign}
                  className="w-full py-2.5 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>Generar 3 Variaciones Estilísticas</span>
                </button>
              </div>
            )}

            {activeTool === 'eliminar_fondo' && (
              <div className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-indigo-900 dark:text-indigo-200">
                  <p className="font-semibold mb-1">Aislamiento Perimetral para Impresión</p>
                  <p className="text-[11px] opacity-80">
                    Convierte fondos blancos o sólidos en píxeles 100% transparentes con antialiasing suave, eliminando recuadros en DTF o serigrafía.
                  </p>
                </div>

                {/* Tolerancia de Fondo */}
                <div>
                  <div className="flex justify-between font-medium mb-1">
                    <span className="text-slate-700 dark:text-slate-300">Tolerancia de Fondo Alpha:</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">{bgTolerance}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="80"
                    value={bgTolerance}
                    onChange={(e) => setBgTolerance(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>Conservador (10%)</span>
                    <span>Agresivo (70%)</span>
                  </div>
                </div>

                {/* Filtro de Nitidez / Super-Resolución */}
                <div>
                  <div className="flex justify-between font-medium mb-1">
                    <span className="text-slate-700 dark:text-slate-300">Nivel de Nitidez Convolucional:</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">{sharpnessLevel}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sharpnessLevel}
                    onChange={(e) => setSharpnessLevel(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                {/* Botones de acción */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleRemoveBackground}
                    disabled={isRemovingBg || !currentDesign}
                    className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>{isRemovingBg ? 'Aislando...' : 'Eliminar Fondo'}</span>
                  </button>

                  <button
                    onClick={handleEnhanceQuality}
                    disabled={isEnhancing || !currentDesign}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <Maximize2 className="w-4 h-4 text-emerald-400" />
                    <span>{isEnhancing ? 'Mejorando...' : 'Super Nitidez'}</span>
                  </button>
                </div>

                {originalBeforeEditUrl && (
                  <button
                    onClick={handleRestoreOriginal}
                    className="w-full py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-1.5 text-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restaurar Archivo Original</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Ficha Técnica de Impresión */}
          {currentDesign && (
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Printer className="w-4 h-4 text-indigo-500" />
                  Especificación Técnica Textil
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                  Apto Impresión
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-400 block text-[10px]">Técnica Recomendada:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{currentDesign.recommendedTechnique}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-400 block text-[10px]">Resolución:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{currentDesign.dpi} DPI Reales</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-400 block text-[10px]">Tamaño Físico Estampado:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {currentDesign.printWidthCm} x {currentDesign.printHeightCm} cm
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-400 block text-[10px]">Base Blanca (Underbase):</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Requerida (85% Opacidad)</span>
                </div>
              </div>

              {currentDesign.separationAdvice && (
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px]">
                  <strong>Preprensa:</strong> {currentDesign.separationAdvice}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Columna Derecha: Visor Central del Arte y Handoffs (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Tarjeta del Visor de Alta Resolución */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden flex flex-col">
            {/* Toolbar Superior del Visor */}
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {currentDesign?.title || 'Lienzo de Diseño'}
                </span>
                {currentDesign?.favorite && (
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Cuadrícula de Transparencia Toggle */}
                <button
                  onClick={() => setShowTransparencyGrid(!showTransparencyGrid)}
                  title="Alternar cuadrícula de transparencia"
                  className={`p-1.5 rounded-lg border ${
                    showTransparencyGrid
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-400 text-indigo-600'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>

                {/* Comparar Original vs Resultado */}
                {originalBeforeEditUrl && (
                  <button
                    onClick={() => setIsSplitCompareActive(!isSplitCompareActive)}
                    className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 font-medium ${
                      isSplitCompareActive
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Comparar</span>
                  </button>
                )}
              </div>
            </div>

            {/* Lienzo de Visualización con Fondo de Transparencia */}
            <div className="relative min-h-[420px] max-h-[520px] flex items-center justify-center p-6 bg-slate-950/10 overflow-hidden">
              {showTransparencyGrid && (
                <div
                  className="absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: `linear-gradient(45deg, #cbd5e1 25%, transparent 25%), linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cbd5e1 75%), linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)`,
                    backgroundSize: '24px 24px',
                    backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px'
                  }}
                />
              )}

              {/* Imagen Central */}
              {currentDesign ? (
                <div className="relative z-10 max-w-full max-h-[460px] flex items-center justify-center">
                  {!isSplitCompareActive ? (
                    <img
                      src={currentDesign.imageUrl}
                      alt={currentDesign.title}
                      className="max-h-[440px] w-auto object-contain drop-shadow-2xl transition-all"
                    />
                  ) : (
                    <div className="relative overflow-hidden max-h-[440px]">
                      <img
                        src={currentDesign.imageUrl}
                        alt="Resultado"
                        className="max-h-[440px] w-auto object-contain"
                      />
                      <div
                        className="absolute inset-0 overflow-hidden border-r-2 border-indigo-500 shadow-[0_0_12px_#6366f1]"
                        style={{ width: `${splitSliderPos}%` }}
                      >
                        <img
                          src={originalBeforeEditUrl || currentDesign.imageUrl}
                          alt="Original"
                          className="max-h-[440px] w-auto object-contain max-w-none"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-bold">
                          ORIGINAL
                        </span>
                      </div>
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-indigo-600/80 text-white text-[10px] font-bold">
                        PROCESADO
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-8 text-slate-400">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-700 animate-pulse" />
                  <p className="font-semibold text-slate-600 dark:text-slate-300">Sin diseño seleccionado</p>
                  <p className="text-xs">Escribe una instrucción y pulsa "Generar Arte Textil".</p>
                </div>
              )}

              {isSplitCompareActive && (
                <div className="absolute bottom-4 inset-x-8 z-20 bg-slate-900/80 backdrop-blur px-4 py-2 rounded-xl flex items-center gap-3 text-white text-xs">
                  <span>Original</span>
                  <input
                    type="range"
                    min="5"
                    max="95"
                    value={splitSliderPos}
                    onChange={(e) => setSplitSliderPos(Number(e.target.value))}
                    className="flex-1 accent-indigo-500 cursor-pointer"
                  />
                  <span>Resultado</span>
                </div>
              )}
            </div>

            {/* Barra de Acciones de Integración (Prompt 9 - Sección 4) */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Conectar con Producción y Estudios:</span>
                <span className="text-slate-400 text-[11px]">Sincronización bidireccional</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* 1. Enviar a Diseñador Gráfico 2D */}
                <button
                  onClick={() => {
                    if (currentDesign) {
                      sendAIToGraphicEditor(currentDesign.imageUrl, currentDesign.title);
                    }
                  }}
                  disabled={!currentDesign}
                  className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 disabled:opacity-50 cursor-pointer transition-all"
                >
                  <PenTool className="w-4 h-4" />
                  <span>Enviar a Diseñador 2D</span>
                </button>

                {/* 2. Proyectar sobre Prenda 3D */}
                <button
                  onClick={() => {
                    if (currentDesign) {
                      sendAITo3DGarment(currentDesign.imageUrl, currentDesign.title, targetPrintZone);
                    }
                  }}
                  disabled={!currentDesign}
                  className="py-2.5 px-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-violet-600/20 disabled:opacity-50 cursor-pointer transition-all"
                >
                  <Box className="w-4 h-4" />
                  <span>Proyectar en Prenda 3D</span>
                </button>

                {/* 3. Abrir en Editor de Imágenes */}
                <button
                  onClick={() => {
                    if (currentDesign) {
                      openInImageEditor(currentDesign.imageUrl);
                    }
                  }}
                  disabled={!currentDesign}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer transition-all"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Editor de Fotos</span>
                </button>
              </div>

              {/* Selector de Zona 3D y Botón Descarga */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-slate-500 whitespace-nowrap">Zona 3D destino:</span>
                  <select
                    value={targetPrintZone}
                    onChange={(e) => setTargetPrintZone(e.target.value as PrintZone3D)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium"
                  >
                    <option value="centro_frontal">Centro Frontal (Pecho)</option>
                    <option value="espalda">Espalda Completa</option>
                    <option value="pecho_izquierdo">Pecho Izquierdo</option>
                    <option value="manga_izquierda">Manga Izquierda</option>
                    <option value="manga_derecha">Manga Derecha</option>
                    <option value="gorras">Gorra Frontal</option>
                  </select>
                </div>

                <button
                  onClick={handleDownloadPNG}
                  disabled={!currentDesign}
                  className="w-full sm:w-auto px-4 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar PNG Transparente</span>
                </button>
              </div>
            </div>
          </div>

          {/* Historial de Diseños Generados (Prompt 9 - Sección 6) */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  Historial de Generaciones ({designsHistory.length})
                </span>
                <span className="text-xs text-slate-400">Persistente con recuperación</span>
              </div>

              {/* Filtros de Historial */}
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setOnlyFavorites(!onlyFavorites)}
                  className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                    onlyFavorites
                      ? 'bg-amber-500/20 border-amber-500 text-amber-600 dark:text-amber-400 font-medium'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>Favoritos</span>
                </button>

                <select
                  value={historyCategoryFilter}
                  onChange={(e) => setHistoryCategoryFilter(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs"
                >
                  <option value="all">Todas las Categorías</option>
                  {AI_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid de Miniaturas de Historial */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-1">
              {filteredHistory.map((item) => {
                const isSelected = currentDesign?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setCurrentDesign(item);
                      setOriginalBeforeEditUrl(item.imageUrl);
                    }}
                    className={`group relative rounded-xl border p-2 cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-500 ring-2 ring-indigo-500/30 bg-indigo-50/40 dark:bg-indigo-950/30'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {/* Miniatura */}
                    <div className="relative aspect-square w-full rounded-lg bg-slate-900/10 flex items-center justify-center overflow-hidden mb-1.5">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="max-h-full max-w-full object-contain p-1"
                      />

                      {/* Botón de favorito flotante */}
                      <button
                        onClick={(e) => toggleFavorite(item.id, e)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white hover:text-amber-400 transition-colors"
                      >
                        <Star className={`w-3.5 h-3.5 ${item.favorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    </div>

                    {/* Metadatos */}
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {item.title}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="capitalize">{item.category}</span>
                        <span>{item.dpi} DPI</span>
                      </div>
                    </div>

                    {/* Botón eliminar al hacer hover */}
                    <button
                      onClick={(e) => deleteFromHistory(item.id, e)}
                      title="Eliminar diseño"
                      className="absolute bottom-1 right-1 p-1 rounded bg-rose-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>

            {filteredHistory.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs">
                No hay diseños en esta categoría o filtro de favoritos.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
