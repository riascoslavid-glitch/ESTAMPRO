import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CropRect } from '../../../types/imageEditor';
import { rgbToHex } from '../../../services/imageProcessing/canvasImageEngine';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Eye,
  Columns,
  SplitSquareVertical,
  Check,
  X,
  Pipette,
  Layers
} from 'lucide-react';

export type ComparisonMode = 'normal' | 'split' | 'side_by_side';

interface ImageEditorCanvasProps {
  currentCanvas: HTMLCanvasElement | null;
  originalCanvas: HTMLCanvasElement | null;
  comparisonVersionCanvas: HTMLCanvasElement | null;
  isCropping: boolean;
  cropRect: CropRect;
  onCropRectChange: (rect: CropRect) => void;
  isMaskDrawingActive: boolean;
  maskCanvas: HTMLCanvasElement | null;
  maskBrushRadius: number;
  onMaskCanvasUpdated: () => void;
  isEyedropperActive: boolean;
  onSampleColor: (hex: string) => void;
  comparisonMode: ComparisonMode;
  onComparisonModeChange: (mode: ComparisonMode) => void;
  isHoldingCompare: boolean;
  setIsHoldingCompare: (val: boolean) => void;
}

export const ImageEditorCanvas: React.FC<ImageEditorCanvasProps> = ({
  currentCanvas,
  originalCanvas,
  comparisonVersionCanvas,
  isCropping,
  cropRect,
  onCropRectChange,
  isMaskDrawingActive,
  maskCanvas,
  maskBrushRadius,
  onMaskCanvasUpdated,
  isEyedropperActive,
  onSampleColor,
  comparisonMode,
  onComparisonModeChange,
  isHoldingCompare,
  setIsHoldingCompare
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const maskDisplayCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Zoom y desplazamiento (Pan)
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Posición del divisor en modo Split (0 a 100%)
  const [splitPos, setSplitPos] = useState<number>(50);
  const [isDraggingSplit, setIsDraggingSplit] = useState<boolean>(false);

  // Arrastre de recorte
  const [activeCropHandle, setActiveCropHandle] = useState<string | null>(null);
  const [cropDragStart, setCropDragStart] = useState<{ x: number; y: number; rect: CropRect }>({
    x: 0,
    y: 0,
    rect: { x: 0, y: 0, width: 100, height: 100 }
  });

  // Pintar máscara para Inpainting
  const [isPaintingMask, setIsPaintingMask] = useState<boolean>(false);

  // El lienzo de referencia para comparar es el original o una versión específica
  const referenceCanvas = comparisonVersionCanvas || originalCanvas;

  // Renderizar sobre el lienzo de pantalla
  const renderDisplay = useCallback(() => {
    const disp = displayCanvasRef.current;
    if (!disp || !currentCanvas) return;

    disp.width = currentCanvas.width;
    disp.height = currentCanvas.height;
    const ctx = disp.getContext('2d')!;

    // Si el usuario mantiene presionado el botón "Ver original"
    if (isHoldingCompare && referenceCanvas) {
      ctx.clearRect(0, 0, disp.width, disp.height);
      ctx.drawImage(referenceCanvas, 0, 0, disp.width, disp.height);
      return;
    }

    if (comparisonMode === 'split' && referenceCanvas) {
      // Modo Split interactivo: Izquierda Original / Derecha Resultado
      const splitPx = Math.round((splitPos / 100) * disp.width);

      ctx.clearRect(0, 0, disp.width, disp.height);

      // 1. Dibujar referencia (Original) a la izquierda recortada
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, splitPx, disp.height);
      ctx.clip();
      ctx.drawImage(referenceCanvas, 0, 0, disp.width, disp.height);
      ctx.restore();

      // 2. Dibujar resultado actual a la derecha recortada
      ctx.save();
      ctx.beginPath();
      ctx.rect(splitPx, 0, disp.width - splitPx, disp.height);
      ctx.clip();
      ctx.drawImage(currentCanvas, 0, 0, disp.width, disp.height);
      ctx.restore();

      // 3. Línea divisoria y manija
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = Math.max(2, Math.round(disp.width / 500));
      ctx.beginPath();
      ctx.moveTo(splitPx, 0);
      ctx.lineTo(splitPx, disp.height);
      ctx.stroke();
    } else {
      // Modo Normal: Dibujar imagen activa
      ctx.clearRect(0, 0, disp.width, disp.height);
      ctx.drawImage(currentCanvas, 0, 0);
    }
  }, [currentCanvas, referenceCanvas, comparisonMode, splitPos, isHoldingCompare]);

  useEffect(() => {
    renderDisplay();
  }, [renderDisplay]);

  // Sincronizar dimensiones del canvas de máscara
  useEffect(() => {
    const maskDisp = maskDisplayCanvasRef.current;
    if (!maskDisp || !maskCanvas || !currentCanvas) return;
    maskDisp.width = currentCanvas.width;
    maskDisp.height = currentCanvas.height;
    const ctx = maskDisp.getContext('2d')!;
    ctx.clearRect(0, 0, maskDisp.width, maskDisp.height);
    ctx.drawImage(maskCanvas, 0, 0);
  }, [maskCanvas, currentCanvas]);

  // Manejo de eventos de ratón
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // 1. Muestreo de color con Cuentagotas
    if (isEyedropperActive && currentCanvas && displayCanvasRef.current) {
      const rect = displayCanvasRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const scaleX = currentCanvas.width / rect.width;
      const scaleY = currentCanvas.height / rect.height;

      const pxX = Math.floor(clickX * scaleX);
      const pxY = Math.floor(clickY * scaleY);

      if (pxX >= 0 && pxX < currentCanvas.width && pxY >= 0 && pxY < currentCanvas.height) {
        const ctx = currentCanvas.getContext('2d')!;
        const pixel = ctx.getImageData(pxX, pxY, 1, 1).data;
        const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
        onSampleColor(hex);
        return;
      }
    }

    // 2. Pintar máscara para Inpainting
    if (isMaskDrawingActive && maskCanvas && displayCanvasRef.current) {
      setIsPaintingMask(true);
      paintMaskPoint(e);
      return;
    }

    // 3. Arrastre del divisor en modo Split
    if (comparisonMode === 'split' && displayCanvasRef.current) {
      const rect = displayCanvasRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const currentSplitX = (splitPos / 100) * rect.width;

      if (Math.abs(clickX - currentSplitX) < 20) {
        setIsDraggingSplit(true);
        return;
      }
    }

    // 4. Pan cuando se hace clic central o con barra espaciadora
    if (e.button === 1 || e.altKey || (!isCropping && !isMaskDrawingActive && e.shiftKey)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDraggingSplit && displayCanvasRef.current) {
      const rect = displayCanvasRef.current.getBoundingClientRect();
      const clickX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const newPercent = (clickX / rect.width) * 100;
      setSplitPos(newPercent);
      return;
    }

    if (isPaintingMask && isMaskDrawingActive) {
      paintMaskPoint(e);
      return;
    }

    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
      return;
    }

    // Arrastre de manijas de recorte
    if (isCropping && activeCropHandle && displayCanvasRef.current) {
      const rect = displayCanvasRef.current.getBoundingClientRect();
      const deltaX = ((e.clientX - cropDragStart.x) / rect.width) * 100;
      const deltaY = ((e.clientY - cropDragStart.y) / rect.height) * 100;

      const orig = cropDragStart.rect;
      let nextX = orig.x;
      let nextY = orig.y;
      let nextW = orig.width;
      let nextH = orig.height;

      switch (activeCropHandle) {
        case 'se':
          nextW = Math.max(10, Math.min(100 - orig.x, orig.width + deltaX));
          nextH = Math.max(10, Math.min(100 - orig.y, orig.height + deltaY));
          break;
        case 'sw':
          nextX = Math.max(0, Math.min(orig.x + orig.width - 10, orig.x + deltaX));
          nextW = orig.width - (nextX - orig.x);
          nextH = Math.max(10, Math.min(100 - orig.y, orig.height + deltaY));
          break;
        case 'ne':
          nextY = Math.max(0, Math.min(orig.y + orig.height - 10, orig.y + deltaY));
          nextH = orig.height - (nextY - orig.y);
          nextW = Math.max(10, Math.min(100 - orig.x, orig.width + deltaX));
          break;
        case 'nw':
          nextX = Math.max(0, Math.min(orig.x + orig.width - 10, orig.x + deltaX));
          nextY = Math.max(0, Math.min(orig.y + orig.height - 10, orig.y + deltaY));
          nextW = orig.width - (nextX - orig.x);
          nextH = orig.height - (nextY - orig.y);
          break;
        case 'move':
          nextX = Math.max(0, Math.min(100 - orig.width, orig.x + deltaX));
          nextY = Math.max(0, Math.min(100 - orig.height, orig.y + deltaY));
          break;
      }

      onCropRectChange({
        x: Math.round(nextX),
        y: Math.round(nextY),
        width: Math.round(nextW),
        height: Math.round(nextH)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDraggingSplit(false);
    setIsPaintingMask(false);
    setIsPanning(false);
    setActiveCropHandle(null);
  };

  // Pintar punto de máscara en coordenadas de imagen
  const paintMaskPoint = (e: React.MouseEvent) => {
    if (!maskCanvas || !displayCanvasRef.current || !currentCanvas) return;
    const rect = displayCanvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const scaleX = currentCanvas.width / rect.width;
    const scaleY = currentCanvas.height / rect.height;

    const pxX = clickX * scaleX;
    const pxY = clickY * scaleY;

    const ctx = maskCanvas.getContext('2d')!;
    ctx.fillStyle = 'rgba(239, 68, 68, 0.75)'; // Rojo semi-transparente
    ctx.beginPath();
    ctx.arc(pxX, pxY, maskBrushRadius, 0, Math.PI * 2);
    ctx.fill();

    // Actualizar visualizador
    const maskDisp = maskDisplayCanvasRef.current;
    if (maskDisp) {
      const dispCtx = maskDisp.getContext('2d')!;
      dispCtx.clearRect(0, 0, maskDisp.width, maskDisp.height);
      dispCtx.drawImage(maskCanvas, 0, 0);
    }
    onMaskCanvasUpdated();
  };

  const startCropDrag = (handle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveCropHandle(handle);
    setCropDragStart({
      x: e.clientX,
      y: e.clientY,
      rect: { ...cropRect }
    });
  };

  // Zoom helpers
  const handleZoomIn = () => setZoom((z) => Math.min(4.0, z + 0.25));
  const handleZoomOut = () => setZoom((z) => Math.max(0.25, z - 0.25));
  const handleFitScreen = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full h-full min-h-[460px] bg-slate-950 flex items-center justify-center overflow-hidden select-none ${
        isEyedropperActive
          ? 'cursor-crosshair'
          : isMaskDrawingActive
          ? 'cursor-crosshair'
          : isDraggingSplit
          ? 'cursor-ew-resize'
          : isCropping
          ? 'cursor-default'
          : 'cursor-grab active:cursor-grabbing'
      }`}
    >
      {/* Fondo de Cuadrícula / Tablero de Ajedrez Textil para DTF (Muestra Transparencias) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #334155 25%, transparent 25%),
            linear-gradient(-45deg, #334155 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #334155 75%),
            linear-gradient(-45deg, transparent 75%, #334155 75%)
          `,
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px'
        }}
      />

      {/* CONTENEDOR DEL LIENZO CON TRANSFORMACIONES DE ZOOM Y PAN */}
      <div
        className="relative transition-transform duration-75"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center'
        }}
      >
        {/* Lienzo Principal de la Imagen */}
        <canvas
          ref={displayCanvasRef}
          className="max-w-[70vw] max-h-[62vh] w-auto h-auto shadow-2xl rounded border border-slate-700/50 block"
        />

        {/* Lienzo de Máscara de Inpainting Superpuesto */}
        <canvas
          ref={maskDisplayCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* MANIJA DEL DIVISOR SPLIT INTERACTIVO */}
        {comparisonMode === 'split' && (
          <div
            className="absolute top-0 bottom-0 pointer-events-none flex flex-col items-center"
            style={{ left: `${splitPos}%`, transform: 'translateX(-50%)' }}
          >
            <div className="w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-lg my-auto ring-2 ring-white">
              <SplitSquareVertical className="w-3.5 h-3.5" />
            </div>
            {/* Etiquetas de Original vs Resultado */}
            <span className="absolute top-2 right-3 px-2 py-0.5 rounded bg-slate-900/90 text-slate-300 font-mono text-[9px] font-bold border border-slate-700">
              RESULTADO
            </span>
            <span className="absolute top-2 left-3 px-2 py-0.5 rounded bg-slate-900/90 text-cyan-400 font-mono text-[9px] font-bold border border-slate-700">
              ORIGINAL
            </span>
          </div>
        )}

        {/* OVERLAY DE RECORTE INTERACTIVO (CROP GUIDES) */}
        {isCropping && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ width: '100%', height: '100%' }}
          >
            {/* Área atenuada exterior */}
            <div
              className="absolute pointer-events-auto border-2 border-indigo-500 shadow-2xl bg-indigo-500/10 cursor-move"
              onMouseDown={(e) => startCropDrag('move', e)}
              style={{
                left: `${cropRect.x}%`,
                top: `${cropRect.y}%`,
                width: `${cropRect.width}%`,
                height: `${cropRect.height}%`
              }}
            >
              {/* Regla de los tercios (Cuadrícula guía) */}
              <div className="w-full h-full relative pointer-events-none">
                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/40" />
                <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/40" />
                <div className="absolute top-1/3 left-0 right-0 h-px bg-white/40" />
                <div className="absolute top-2/3 left-0 right-0 h-px bg-white/40" />
              </div>

              {/* Manijas de las 4 esquinas */}
              <div
                onMouseDown={(e) => startCropDrag('nw', e)}
                className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-sm cursor-nwse-resize shadow-md"
              />
              <div
                onMouseDown={(e) => startCropDrag('ne', e)}
                className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-sm cursor-nesw-resize shadow-md"
              />
              <div
                onMouseDown={(e) => startCropDrag('sw', e)}
                className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-sm cursor-nesw-resize shadow-md"
              />
              <div
                onMouseDown={(e) => startCropDrag('se', e)}
                className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-sm cursor-nwse-resize shadow-md"
              />
            </div>
          </div>
        )}
      </div>

      {/* VISTA LADO A LADO (SIDE-BY-SIDE) SI ESTÁ ACTIVADO */}
      {comparisonMode === 'side_by_side' && referenceCanvas && (
        <div className="absolute bottom-16 right-4 z-20 w-48 p-2 bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-300">
            <span>Referencia Original</span>
            <button
              type="button"
              onClick={() => onComparisonModeChange('normal')}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <img
            src={referenceCanvas.toDataURL('image/jpeg', 0.8)}
            alt="Original"
            className="w-full h-28 object-contain rounded bg-slate-950 border border-slate-800"
          />
        </div>
      )}

      {/* BARRA FLOTANTE DE COMPARACIÓN (Comparar Original y Resultado) */}
      <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs shadow-lg">
        <span className="font-bold text-[11px] text-slate-400 mr-1 flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          Comparar:
        </span>

        {/* Botón Mantener Presionado */}
        <button
          type="button"
          onMouseDown={() => setIsHoldingCompare(true)}
          onMouseUp={() => setIsHoldingCompare(false)}
          onMouseLeave={() => setIsHoldingCompare(false)}
          onTouchStart={() => setIsHoldingCompare(true)}
          onTouchEnd={() => setIsHoldingCompare(false)}
          className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
            isHoldingCompare
              ? 'bg-amber-500 text-slate-950 shadow-md animate-pulse'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title="Mantén pulsado para ver el arte original"
        >
          {isHoldingCompare ? 'Viendo Original...' : 'Mantener para ver original'}
        </button>

        {/* Modo Split */}
        <button
          type="button"
          onClick={() => onComparisonModeChange(comparisonMode === 'split' ? 'normal' : 'split')}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            comparisonMode === 'split'
              ? 'bg-cyan-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Divisor de pantalla interactivo antes / después"
        >
          <SplitSquareVertical className="w-4 h-4" />
        </button>

        {/* Modo Lado a Lado */}
        <button
          type="button"
          onClick={() => onComparisonModeChange(comparisonMode === 'side_by_side' ? 'normal' : 'side_by_side')}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            comparisonMode === 'side_by_side'
              ? 'bg-cyan-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Miniatura de referencia lado a lado"
        >
          <Columns className="w-4 h-4" />
        </button>
      </div>

      {/* CONTROLES FLOTANTES DE ZOOM Y ENCAJAR */}
      <div className="absolute bottom-3 right-3 z-30 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 shadow-lg text-xs">
        <button
          type="button"
          onClick={handleZoomOut}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          title="Alejar"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="font-mono text-[11px] font-bold text-slate-300 px-1 min-w-[42px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={handleZoomIn}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          title="Acercar"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-slate-800 mx-0.5" />
        <button
          type="button"
          onClick={handleFitScreen}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          title="Restablecer encuadre y zoom"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
