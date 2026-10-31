import React, { useState } from 'react';
import { ProductionJobRecord } from '../../../types/productionAssistant';
import { exportLogsToCsv } from '../../../services/productionAssistantService';
import { 
  X, 
  Download, 
  Search, 
  Calendar, 
  User, 
  Shirt, 
  CheckCircle2, 
  Layers, 
  Thermometer, 
  Clock, 
  Star,
  FileSpreadsheet
} from 'lucide-react';

interface ProductionAuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: ProductionJobRecord[];
}

export const ProductionAuditLogModal: React.FC<ProductionAuditLogModalProps> = ({
  isOpen,
  onClose,
  logs
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState<string>('todos');

  if (!isOpen) return null;

  const filteredLogs = logs.filter((log) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = 
      log.operatorName.toLowerCase().includes(q) ||
      (log.operatorRole && log.operatorRole.toLowerCase().includes(q)) ||
      log.garmentName.toLowerCase().includes(q) ||
      log.fabricComposition.toLowerCase().includes(q) ||
      log.techniqueName.toLowerCase().includes(q) ||
      (log.observations && log.observations.toLowerCase().includes(q));

    const matchesTech = selectedTech === 'todos' || log.techniqueId === selectedTech;

    return matchesSearch && matchesTech;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-cyan-950/60 text-indigo-700 dark:text-cyan-300">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Bitácora y Registro de Auditoría de Producción</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 dark:bg-cyan-950/40 text-indigo-700 dark:text-cyan-300">
                  {logs.length} trabajos registrados
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Historial inmutable de quién realizó cada trabajo, con qué parámetros calibrados y en qué fecha.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => exportLogsToCsv(filteredLogs)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-xs"
              title="Descargar reporte en formato CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por operador, prenda, técnica..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto text-slate-500">
            <span>Filtrar técnica:</span>
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium"
            >
              <option value="todos">Todas las técnicas</option>
              <option value="dtf">DTF</option>
              <option value="dtg">DTG</option>
              <option value="sublimacion">Sublimación</option>
              <option value="vinil_textil">Vinil Textil</option>
              <option value="serigrafia">Serigrafía</option>
              <option value="bordado">Bordado</option>
              <option value="estampado_descarga">Descarga</option>
              <option value="puff">Puff</option>
            </select>
          </div>
        </div>

        {/* Body Table / Cards */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Calendar className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No hay registros de producción con esos filtros
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-indigo-400 dark:hover:border-cyan-500 transition-all space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-50 dark:bg-cyan-950/60 text-indigo-700 dark:text-cyan-300 border border-indigo-200 dark:border-cyan-800/50">
                        {log.techniqueName}
                      </span>
                      <strong className="text-sm font-bold text-slate-900 dark:text-white">
                        {log.garmentName} ({log.quantityUnits} u.)
                      </strong>
                    </div>

                    <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                      <span className="flex items-center gap-1 font-medium">
                        <User className="w-3.5 h-3.5 text-indigo-500" />
                        <strong className="text-slate-800 dark:text-slate-200">{log.operatorName}</strong> ({log.operatorRole || 'Operador'})
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(log.createdAt).toLocaleString('es-ES')}</span>
                      </span>
                    </div>
                  </div>

                  {/* Applied Parameters Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <span className="text-[10px] text-slate-400 block uppercase">Temperatura</span>
                      <strong className="text-slate-900 dark:text-white font-mono font-bold">
                        {log.parametersApplied.temperatureC}°C
                      </strong>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <span className="text-[10px] text-slate-400 block uppercase">Tiempo</span>
                      <strong className="text-slate-900 dark:text-white font-mono font-bold">
                        {log.parametersApplied.timeSeconds} seg
                      </strong>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <span className="text-[10px] text-slate-400 block uppercase">Presión</span>
                      <strong className="text-slate-900 dark:text-white font-bold truncate block">
                        {log.parametersApplied.pressureBars}
                      </strong>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <span className="text-[10px] text-slate-400 block uppercase">Pelado</span>
                      <strong className="text-slate-900 dark:text-white font-bold truncate block text-[11px]">
                        {log.parametersApplied.peelingType}
                      </strong>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <span className="text-[10px] text-slate-400 block uppercase">Prensa Utilizada</span>
                      <strong className="text-slate-900 dark:text-white truncate block text-[11px]">
                        {log.heatPressUsed}
                      </strong>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <span className="text-[10px] text-slate-400 block uppercase">Calidad QC</span>
                      <div className="flex items-center gap-0.5 text-amber-500 font-bold mt-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < log.qualityRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Observations */}
                  {log.observations && (
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/30 p-2 rounded-lg italic">
                      Nota de auditoría: "{log.observations}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Registro con certificación de trazabilidad de taller</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Cerrar Bitácora
          </button>
        </div>
      </div>
    </div>
  );
};
