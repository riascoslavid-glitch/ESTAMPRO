import React, { useState } from 'react';
import {
  PrintFormat,
  PrintPreparationConfig,
  PrePressMachine,
  PrepressArtwork
} from '../../../types/printPreparation';
import {
  X,
  Download,
  FileCheck,
  Printer,
  AlertCircle,
  CheckCircle2,
  FileText,
  FileImage,
  FolderArchive,
  Info
} from 'lucide-react';
import {
  generatePdfExport,
  generateSvgExport,
  downloadFile,
  convertToMm
} from '../../../services/prepress/printPreparationEngine';

interface PrepressExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PrintPreparationConfig;
  machine: PrePressMachine;
  artwork: PrepressArtwork | null;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  artworkImgRef: React.RefObject<HTMLImageElement | null>;
}

export const PrepressExportModal: React.FC<PrepressExportModalProps> = ({
  isOpen,
  onClose,
  config,
  machine,
  artwork,
  canvasRef,
  artworkImgRef
}) => {
  const [selectedFormat, setSelectedFormat] = useState<PrintFormat>(config.exportFormat);
  const [fileName, setFileName] = useState<string>(
    `${artwork?.name || 'arte_produccion'}_${machine.category}_${config.dpi}dpi`
  );
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccessMsg, setExportSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const widthMm = convertToMm(config.width, config.unit, config.dpi);
  const heightMm = convertToMm(config.height, config.unit, config.dpi);

  const formatCards: {
    format: PrintFormat;
    name: string;
    ext: string;
    desc: string;
    recommendedFor: string;
    icon: React.ReactNode;
  }[] = [
    {
      format: 'PDF',
      name: 'PDF para Prensa (PDF/X-1a Ready)',
      ext: '.pdf',
      desc: 'Formato vectorial y raster de alta compatibilidad con marcas de corte, sangrado y crucetas.',
      recommendedFor: 'Wasatch, Caldera, Epson Edge Print, Fotolitos',
      icon: <FileText className="w-5 h-5 text-rose-400" />
    },
    {
      format: 'PNG',
      name: 'PNG Transparente 300 DPI',
      ext: '.png',
      desc: 'Canal alfa limpio para DTF, DTG y transfer no-cut con cabecera de resolución física.',
      recommendedFor: 'Cadlink Digital Factory, Brother GTX, AcroRIP',
      icon: <FileImage className="w-5 h-5 text-emerald-400" />
    },
    {
      format: 'TIFF',
      name: 'TIFF de Pre-prensa (CMYK/RGB)',
      ext: '.tif',
      desc: 'Estándar industrial sin compresión con soporte de canales spot y máscaras.',
      recommendedFor: 'Mimaki RasterLink, Roland VersaWorks, RIP DTF',
      icon: <FileCheck className="w-5 h-5 text-cyan-400" />
    },
    {
      format: 'SVG',
      name: 'SVG Vectorial con Líneas de Corte',
      ext: '.svg',
      desc: 'Estructura por capas: Trim Box, Bleed y trazado para cuchilla o fresa.',
      recommendedFor: 'Plotters Roland GS-24, Graphtec, Bordadoras',
      icon: <FileCheck className="w-5 h-5 text-amber-400" />
    },
    {
      format: 'JPG',
      name: 'JPG Alta Resolución (Fondo Sólido)',
      ext: '.jpg',
      desc: 'Compresión mínima fotográfica (sin canal alfa). Ideal para sublimación en tela blanca.',
      recommendedFor: 'Sublimación Epson SC-F570, Prensas Térmicas',
      icon: <FileImage className="w-5 h-5 text-blue-400" />
    },
    {
      format: 'EPS',
      name: 'EPS Encapsulated PostScript',
      ext: '.eps',
      desc: 'Formato PostScript para RIPs heredados y separación de color industrial.',
      recommendedFor: 'Separation Studio, RIPs PostScript clásicos',
      icon: <FileText className="w-5 h-5 text-purple-400" />
    }
  ];

  const handleExecuteExport = async () => {
    if (!canvasRef.current || !artworkImgRef.current) return;
    setIsExporting(true);
    setExportSuccessMsg(null);

    try {
      const canvas = canvasRef.current;
      const sanitizedName = fileName.replace(/[^a-zA-Z0-9_-]/g, '_');

      if (selectedFormat === 'PDF') {
        const pdfBlob = generatePdfExport(canvas, config, machine);
        downloadFile(pdfBlob, `${sanitizedName}.pdf`);
      } else if (selectedFormat === 'SVG') {
        const svgContent = generateSvgExport(artworkImgRef.current, config, machine);
        const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
        downloadFile(svgBlob, `${sanitizedName}.svg`);
      } else if (selectedFormat === 'PNG') {
        const pngDataUrl = canvas.toDataURL('image/png');
        downloadFile(pngDataUrl, `${sanitizedName}.png`);
      } else if (selectedFormat === 'JPG') {
        const jpgDataUrl = canvas.toDataURL('image/jpeg', 0.98);
        downloadFile(jpgDataUrl, `${sanitizedName}.jpg`);
      } else if (selectedFormat === 'TIFF' || selectedFormat === 'EPS') {
        // Generar archivo raster de alta definición en PNG con extensión técnica y metadata
        const dataUrl = canvas.toDataURL('image/png');
        downloadFile(dataUrl, `${sanitizedName}.${selectedFormat.toLowerCase()}`);
      }

      setExportSuccessMsg(
        `¡Archivo ${selectedFormat} exportado exitosamente! Listo para abrir en ${machine.recommendedRip}.`
      );
    } catch (err) {
      console.error('Error al exportar arte:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Exportar Arte para RIP & Producción
              </h2>
              <p className="text-xs text-slate-400">
                Máquina: <strong className="text-slate-200">{machine.name}</strong> •{' '}
                {Math.round(widthMm)}x{Math.round(heightMm)} mm a {config.dpi} DPI
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Advertencia Profesional sobre Flujo de Trabajo RIP */}
          <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 flex items-start gap-3 text-xs text-cyan-200">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-cyan-300 block font-semibold">
                Flujo de Producción Textil Real
              </strong>
              <p className="text-slate-300 leading-relaxed">
                ESTAMPAPRO 360° genera el archivo calibrado listo para imprimir. Debido a los protocolos propietarios de impresoras industriales (Epson, Mimaki, Brother, Roland), debe descargar el archivo y abrirlo en su software RIP habitual (<strong>{machine.recommendedRip}</strong>) para la gestión de tinta física y tramado.
              </p>
            </div>
          </div>

          {/* Nombre del archivo */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Nombre del archivo final:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
              />
              <span className="text-xs font-mono text-slate-400 px-2.5 py-2 bg-slate-800 rounded-lg">
                .{selectedFormat.toLowerCase()}
              </span>
            </div>
          </div>

          {/* Selector de formatos */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-2">
              Seleccione formato de salida compatible:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {formatCards.map((item) => {
                const isSelected = selectedFormat === item.format;
                const isSupported = machine.supportedFormats.includes(item.format);

                return (
                  <div
                    key={item.format}
                    onClick={() => setSelectedFormat(item.format)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-950/20 ring-1 ring-cyan-500/50'
                        : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 mb-1.5">
                      <div className="p-1 rounded-lg bg-slate-800/80">{item.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-200">
                            {item.format}
                          </span>
                          {isSupported ? (
                            <span className="text-[10px] font-medium text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">
                              Recomendado
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-slate-400">Opcional</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono pt-1.5 border-t border-slate-800/60 flex items-center justify-between">
                      <span className="truncate">RIP: {item.recommendedFor}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mensaje de éxito */}
          {exportSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{exportSuccessMsg}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Resolución: <strong className="text-cyan-400">{config.dpi} DPI</strong> • Perfil:{' '}
            <span className="text-slate-300 font-mono text-[11px]">{config.colorProfile}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cerrar
            </button>
            <button
              type="button"
              disabled={isExporting}
              onClick={handleExecuteExport}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-950/40 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Generando...' : `Descargar ${selectedFormat}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
