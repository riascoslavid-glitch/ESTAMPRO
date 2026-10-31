import React, { useState } from 'react';
import { CustomTechniqueSheet } from '../../../types/techniques';
import { 
  openPrintableTechnicalSheet, 
  exportSheetAsJson, 
  deleteCustomTechniqueSheet 
} from '../../../services/techniquesStorageService';
import { 
  Sparkles, 
  Printer, 
  Download, 
  Trash2, 
  Edit3, 
  Plus, 
  Thermometer, 
  Clock, 
  Gauge, 
  Calendar, 
  Building2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface CustomSheetsManagerProps {
  sheets: CustomTechniqueSheet[];
  onOpenCreateModal: () => void;
  onEditSheet: (sheet: CustomTechniqueSheet) => void;
  onRefreshList: () => void;
  onStartProjectWithCustomSheet: (sheet: CustomTechniqueSheet) => void;
}

export const CustomSheetsManager: React.FC<CustomSheetsManagerProps> = ({
  sheets,
  onOpenCreateModal,
  onEditSheet,
  onRefreshList,
  onStartProjectWithCustomSheet
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSheets = sheets.filter((s) => {
    const q = searchTerm.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.baseTechniqueName.toLowerCase().includes(q) ||
      (s.substrateFabric && s.substrateFabric.toLowerCase().includes(q)) ||
      (s.workshopName && s.workshopName.toLowerCase().includes(q))
    );
  });

  const handleDelete = async (sheetId: string) => {
    if (window.confirm('¿Seguro que deseas eliminar esta ficha técnica personalizada?')) {
      await deleteCustomTechniqueSheet(sheetId);
      onRefreshList();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
            <span>Mis Fichas Técnicas Personalizadas ({sheets.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Parámetros calibrados y guardados para tus propias máquinas, telas y operarios de taller.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreateModal}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 dark:bg-cyan-600 hover:bg-indigo-500 dark:hover:bg-cyan-500 rounded-lg shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Nueva Ficha de Taller</span>
        </button>
      </div>

      {/* Filter input */}
      {sheets.length > 0 && (
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar en mis fichas por nombre, tela, técnica o máquina..."
            className="w-full max-w-md px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>
      )}

      {/* Sheets List Grid */}
      {filteredSheets.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-3">
          <Sparkles className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No hay fichas personalizadas guardadas con ese criterio
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Puedes guardar cualquier técnica con tus valores ajustados de temperatura, tiempo y presión desde la pestaña de parámetros.
          </p>
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 dark:bg-cyan-600 rounded-lg hover:bg-indigo-500 transition-colors"
          >
            Crear Primera Ficha
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSheets.map((sheet) => (
            <div
              key={sheet.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs hover:border-indigo-400 dark:hover:border-cyan-500 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-cyan-950/40 text-indigo-700 dark:text-cyan-300 border border-indigo-200 dark:border-cyan-800/50">
                      {sheet.baseTechniqueName}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      {sheet.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEditSheet(sheet)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Editar ficha"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openPrintableTechnicalSheet(sheet)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Imprimir hoja de taller"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => exportSheetAsJson(sheet)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Descargar JSON"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(sheet.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Eliminar ficha"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Substrate and equipment */}
                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                  <div>
                    <strong>Sustrato textil:</strong> {sheet.substrateFabric}
                  </div>
                  <div>
                    <strong>Prensa térmica:</strong> {sheet.heatPressModel}
                  </div>
                  <div>
                    <strong>Consumible:</strong> {sheet.consumableBrand}
                  </div>
                  {sheet.workshopName && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-0.5">
                      <Building2 className="w-3 h-3" />
                      <span>{sheet.workshopName} {sheet.operatorName ? `(${sheet.operatorName})` : ''}</span>
                    </div>
                  )}
                </div>

                {/* Technical Parameters Badges */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono">
                    <span className="text-[10px] text-slate-500 block uppercase">Temperatura</span>
                    <strong className="text-slate-900 dark:text-white font-extrabold text-sm">
                      {sheet.tempCelsius}°C
                    </strong>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono">
                    <span className="text-[10px] text-slate-500 block uppercase">Tiempo</span>
                    <strong className="text-slate-900 dark:text-white font-extrabold text-sm">
                      {sheet.timeSeconds}s
                    </strong>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase">Presión</span>
                    <strong className="text-slate-900 dark:text-white font-bold text-xs truncate block">
                      {sheet.pressureLevel}
                    </strong>
                  </div>
                </div>

                {/* Notes */}
                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-2">
                  "{sheet.technicalNotes}"
                </p>
              </div>

              {/* Bottom Action */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  Lavados: {sheet.testedWashCycles}+ ciclos
                </span>
                <button
                  type="button"
                  onClick={() => onStartProjectWithCustomSheet(sheet)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:text-indigo-700 dark:hover:text-cyan-300 transition-colors"
                >
                  <span>Usar en Proyecto</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
