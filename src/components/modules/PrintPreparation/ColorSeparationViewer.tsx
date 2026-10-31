import React, { useState } from 'react';
import { SeparationPlate, PrintPreparationConfig } from '../../../types/printPreparation';
import { Layers, Eye, Download, Sliders, Info, ShieldCheck, Film } from 'lucide-react';
import { downloadFile } from '../../../services/prepress/printPreparationEngine';

interface ColorSeparationViewerProps {
  plates: SeparationPlate[];
  config: PrintPreparationConfig;
  onConfigChange: (updates: Partial<PrintPreparationConfig>) => void;
  onRegenerate: () => void;
}

export const ColorSeparationViewer: React.FC<ColorSeparationViewerProps> = ({
  plates,
  config,
  onConfigChange,
  onRegenerate
}) => {
  const [invertAllToFotolito, setInvertAllToFotolito] = useState(false);
  const [activePlateId, setActivePlateId] = useState<string | null>(null);

  const handleDownloadPlate = (plate: SeparationPlate) => {
    downloadFile(plate.canvasDataUrl, `fotolito_${plate.channelKey}_300dpi.png`);
  };

  const handleDownloadAllPlates = () => {
    plates.forEach((plate, idx) => {
      setTimeout(() => {
        downloadFile(plate.canvasDataUrl, `fotolito_${plate.channelKey}_300dpi.png`);
      }, idx * 250);
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Separaciones de Color y Fotolitos</h3>
            <p className="text-xs text-slate-400">Canales CMYK y Base Blanca Underbase con Choke</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setInvertAllToFotolito(!invertAllToFotolito)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
              invertAllToFotolito
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Muestra las separaciones como fotolito positivo en 100% negro opaco para quemar pantallas de serigrafía"
          >
            <Film className="w-3.5 h-3.5" />
            {invertAllToFotolito ? 'Modo Película Fotolito' : 'Color Nominal'}
          </button>

          {plates.length > 0 && (
            <button
              type="button"
              onClick={handleDownloadAllPlates}
              className="px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Descargar pack completo de fotolitos"
            >
              <Download className="w-3.5 h-3.5" />
              Descargar Pack
            </button>
          )}
        </div>
      </div>

      {/* Controles de Base Blanca (Underbase & Choke) */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            Choke / Rebaje de Base Blanca:
          </span>
          <span className="font-mono text-cyan-400 font-bold">{config.whiteUnderbaseChokePx} px</span>
        </div>

        <input
          type="range"
          min={0}
          max={4}
          step={1}
          value={config.whiteUnderbaseChokePx}
          onChange={(e) => {
            onConfigChange({ whiteUnderbaseChokePx: Number(e.target.value) });
            onRegenerate();
          }}
          className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
        />

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>0 px (Sin recorte)</span>
          <span className="text-slate-300 font-medium">Recomendado: 1-2 px</span>
          <span>4 px (Erosión fuerte)</span>
        </div>

        <p className="text-[11px] text-slate-400 leading-normal">
          El <strong>choke</strong> encoge la base blanca 1-2 píxeles hacia adentro para que el color de la tinta superior la cubra por completo, impidiendo aureolas blancas por descalce en DTF o serigrafía.
        </p>
      </div>

      {/* Grid de canales / planchas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {plates.map((plate) => {
          const isWhite = plate.channelKey === 'white';
          return (
            <div
              key={plate.id}
              className={`border rounded-lg p-2.5 transition-all flex flex-col justify-between ${
                activePlateId === plate.id
                  ? 'border-indigo-500 bg-indigo-950/20 ring-1 ring-indigo-500/50'
                  : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
              }`}
            >
              {/* Info y Header de la Plancha */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-slate-600 shadow-sm"
                    style={{ backgroundColor: plate.colorHex }}
                  />
                  <span className="text-xs font-semibold text-slate-200 truncate max-w-[120px]">
                    {plate.name}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-medium text-slate-400">
                  {plate.coveragePercent}% tinta
                </span>
              </div>

              {/* Vista previa en miniatura */}
              <div
                className={`relative aspect-[4/3] rounded border border-slate-800 overflow-hidden flex items-center justify-center mb-2.5 cursor-pointer ${
                  invertAllToFotolito || isWhite ? 'bg-black' : 'bg-slate-900'
                }`}
                onClick={() => setActivePlateId(activePlateId === plate.id ? null : plate.id)}
              >
                <img
                  src={plate.canvasDataUrl}
                  alt={plate.name}
                  className={`w-full h-full object-contain ${
                    invertAllToFotolito ? 'filter contrast-200 invert' : ''
                  }`}
                />
                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-900/80 text-slate-300 font-mono">
                  {invertAllToFotolito ? 'DMax 100%' : plate.channelKey.toUpperCase()}
                </div>
              </div>

              {/* Botón de acción */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleDownloadPlate(plate)}
                  className="flex-1 py-1 rounded text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3 text-slate-400" />
                  Descargar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
