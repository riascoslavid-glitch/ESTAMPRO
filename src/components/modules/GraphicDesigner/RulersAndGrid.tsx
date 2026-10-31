import React from 'react';

interface RulersAndGridProps {
  widthCm: number;
  heightCm: number;
  pixelsPerCm: number;
  showGrid: boolean;
  cursorXCm: number;
  cursorYCm: number;
  unit?: 'cm' | 'mm';
}

export const RulersAndGrid: React.FC<RulersAndGridProps> = ({
  widthCm,
  heightCm,
  pixelsPerCm,
  showGrid,
  cursorXCm,
  cursorYCm,
  unit = 'cm'
}) => {
  const rulerThickness = 22; // px

  // Marcadores horizontales
  const xCount = Math.ceil(widthCm);
  const xMarkers = Array.from({ length: xCount + 1 }, (_, i) => i);
  // Marcadores verticales
  const yCount = Math.ceil(heightCm);
  const yMarkers = Array.from({ length: yCount + 1 }, (_, i) => i);

  return (
    <>
      {/* 1. Regla Horizontal Superior */}
      <div
        className="absolute top-0 left-6 right-0 h-5.5 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-end select-none pointer-events-none z-20 text-[9px] font-mono text-slate-500 overflow-hidden"
        style={{ left: `${rulerThickness}px`, width: `${widthCm * pixelsPerCm}px` }}
      >
        {xMarkers.map((cm) => (
          <div
            key={`x-${cm}`}
            className="absolute bottom-0 border-l border-slate-300 dark:border-slate-700 h-2 flex flex-col justify-between"
            style={{ left: `${cm * pixelsPerCm}px` }}
          >
            <span className="text-[8px] pl-0.5 leading-none">
              {unit === 'mm' ? cm * 10 : cm}
            </span>
          </div>
        ))}

        {/* Indicador de cursor X */}
        <div
          className="absolute top-0 bottom-0 w-px bg-indigo-500 dark:bg-cyan-400 z-30"
          style={{ left: `${cursorXCm * pixelsPerCm}px` }}
        />
      </div>

      {/* 2. Regla Vertical Lateral */}
      <div
        className="absolute top-5.5 left-0 w-5.5 bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-end select-none pointer-events-none z-20 text-[9px] font-mono text-slate-500 overflow-hidden"
        style={{ top: `${rulerThickness}px`, height: `${heightCm * pixelsPerCm}px` }}
      >
        {yMarkers.map((cm) => (
          <div
            key={`y-${cm}`}
            className="absolute right-0 border-t border-slate-300 dark:border-slate-700 w-2 flex items-center justify-end"
            style={{ top: `${cm * pixelsPerCm}px` }}
          >
            <span className="text-[8px] pr-0.5 leading-none">
              {unit === 'mm' ? cm * 10 : cm}
            </span>
          </div>
        ))}

        {/* Indicador de cursor Y */}
        <div
          className="absolute left-0 right-0 h-px bg-indigo-500 dark:bg-cyan-400 z-30"
          style={{ top: `${cursorYCm * pixelsPerCm}px` }}
        />
      </div>

      {/* Esquina origen (0,0) */}
      <div
        className="absolute top-0 left-0 bg-slate-200 dark:bg-slate-800 border-r border-b border-slate-300 dark:border-slate-700 z-30 flex items-center justify-center text-[8px] font-mono font-bold text-slate-600 dark:text-slate-300"
        style={{ width: `${rulerThickness}px`, height: `${rulerThickness}px` }}
      >
        {unit}
      </div>

      {/* 3. Cuadrícula Milimétrica de Fondo en el Lienzo */}
      {showGrid && (
        <svg
          className="absolute inset-0 pointer-events-none z-0"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Patrón de 1 cm */}
            <pattern
              id="grid-cm"
              width={pixelsPerCm}
              height={pixelsPerCm}
              patternUnits="userSpaceOnUse"
            >
              <rect
                width={pixelsPerCm}
                height={pixelsPerCm}
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-slate-300 dark:text-slate-800"
                strokeDasharray="2,2"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-cm)" opacity="0.65" />
        </svg>
      )}
    </>
  );
};
