import React, { useState } from 'react';
import { 
  DetailedTechniqueSheet, 
  TechnicalParameters, 
  ManufacturerCalibrationPreset 
} from '../../../types/techniques';
import { 
  Thermometer, 
  Clock, 
  Gauge, 
  Wind, 
  Hand, 
  Flame, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Save, 
  RotateCcw, 
  Info,
  ShieldCheck,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';

interface TechniqueParametersPanelProps {
  technique: DetailedTechniqueSheet;
  onOpenCustomSheetModal: (initialParams: Partial<TechnicalParameters>) => void;
}

export const TechniqueParametersPanel: React.FC<TechniqueParametersPanelProps> = ({
  technique,
  onOpenCustomSheetModal
}) => {
  // Configurable parameter states initialized from technique default
  const [tempC, setTempC] = useState<number>(technique.defaultParameters.tempCelsiusMin);
  const [timeSec, setTimeSec] = useState<number>(technique.defaultParameters.timeSecondsMin);
  const [pressureLevel, setPressureLevel] = useState(technique.defaultParameters.pressureLevel);
  const [pressureBars, setPressureBars] = useState(technique.defaultParameters.pressureBars || '4.0 Bar');
  const [peeling, setPeeling] = useState(technique.defaultParameters.peeling);
  const [cooling, setCooling] = useState(technique.defaultParameters.cooling);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('default');
  const [selectedSubstrate, setSelectedSubstrate] = useState<string>(
    technique.defaultParameters.primaryMaterials[0] || '100% Algodón'
  );

  // Derived temperature in Fahrenheit
  const tempF = Math.round((tempC * 9) / 5 + 32);

  // Handle Preset Selection
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    if (presetId === 'default') {
      setTempC(technique.defaultParameters.tempCelsiusMin);
      setTimeSec(technique.defaultParameters.timeSecondsMin);
      setPressureLevel(technique.defaultParameters.pressureLevel);
      setPressureBars(technique.defaultParameters.pressureBars || '4.0 Bar');
      setPeeling(technique.defaultParameters.peeling);
      setCooling(technique.defaultParameters.cooling);
      return;
    }

    const preset = technique.manufacturerPresets.find((p: ManufacturerCalibrationPreset) => p.id === presetId);
    if (preset) {
      if (preset.tempC > 0) setTempC(preset.tempC);
      if (preset.timeSec > 0) setTimeSec(preset.timeSec);
      if (preset.pressure) setPressureBars(preset.pressure);
      setSelectedSubstrate(preset.substrate);
    }
  };

  const handleResetToDefault = () => {
    setSelectedPresetId('default');
    setTempC(technique.defaultParameters.tempCelsiusMin);
    setTimeSec(technique.defaultParameters.timeSecondsMin);
    setPressureLevel(technique.defaultParameters.pressureLevel);
    setPressureBars(technique.defaultParameters.pressureBars || '4.0 Bar');
    setPeeling(technique.defaultParameters.peeling);
    setCooling(technique.defaultParameters.cooling);
  };

  const selectedPreset = technique.manufacturerPresets.find((p: ManufacturerCalibrationPreset) => p.id === selectedPresetId);

  return (
    <div className="space-y-6">
      {/* Top Banner: Verification Status & Presets */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {technique.defaultParameters.isManufacturerVerified ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Parámetros Verificados por Fabricante</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Consultar Instrucciones Específicas del Fabricante</span>
              </span>
            )}
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Actualizado: {technique.defaultParameters.lastVerifiedDate}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer</span>
            </button>
            <button
              type="button"
              onClick={() =>
                onOpenCustomSheetModal({
                  tempCelsiusMin: tempC,
                  tempCelsiusMax: tempC,
                  timeSecondsMin: timeSec,
                  timeSecondsMax: timeSec,
                  pressureLevel,
                  pressureBars,
                  peeling,
                  cooling,
                  primaryMaterials: [selectedSubstrate]
                })
              }
              className="text-xs font-semibold text-white bg-indigo-600 dark:bg-cyan-600 hover:bg-indigo-500 dark:hover:bg-cyan-500 flex items-center gap-1.5 px-3 py-1.5 rounded-lg shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar Calibración para mi Taller</span>
            </button>
          </div>
        </div>

        {/* Source info */}
        <div className="text-xs text-slate-600 dark:text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1">
          <div>
            <strong className="text-slate-700 dark:text-slate-200">Fuente Técnica:</strong>{' '}
            {selectedPreset ? selectedPreset.sourceDoc : technique.defaultParameters.verifiedSource}
          </div>
          <div>
            <strong className="text-slate-700 dark:text-slate-200">Equipo Referencia:</strong>{' '}
            {selectedPreset ? `${selectedPreset.brand} (${selectedPreset.equipmentModel})` : technique.defaultParameters.machineModelReference}
          </div>
        </div>

        {technique.defaultParameters.manufacturerNotice && (
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{technique.defaultParameters.manufacturerNotice}</span>
          </div>
        )}
      </div>

      {/* Preset Selector */}
      {technique.manufacturerPresets.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="font-semibold text-slate-500 shrink-0 uppercase tracking-wider text-[11px]">
            Perfiles de Fabricante:
          </span>
          <button
            type="button"
            onClick={() => handleSelectPreset('default')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedPresetId === 'default'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Estándar FESPA / SGIA
          </button>
          {technique.manufacturerPresets.map((preset: ManufacturerCalibrationPreset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
                selectedPresetId === preset.id
                  ? 'bg-indigo-600 dark:bg-cyan-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {preset.presetName}
            </button>
          ))}
        </div>
      )}

      {/* Configurable Interactive Sliders and Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Temperatura */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-rose-500" />
              <span>Temperatura</span>
            </span>
            <div className="text-right font-mono">
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                {tempC > 0 ? `${tempC}°C` : 'Ambiente'}
              </span>
              {tempC > 0 && (
                <span className="text-xs text-slate-500 block">({tempF}°F)</span>
              )}
            </div>
          </div>

          {tempC > 0 ? (
            <>
              <input
                type="range"
                min={Math.max(100, technique.defaultParameters.tempCelsiusMin - 20)}
                max={Math.min(220, technique.defaultParameters.tempCelsiusMax + 20)}
                value={tempC}
                onChange={(e) => setTempC(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Rango recomendado:</span>
                <span>{technique.defaultParameters.tempCelsiusMin}°C - {technique.defaultParameters.tempCelsiusMax}°C</span>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-500 italic">
              Esta técnica no requiere aporte de calor térmico en prensa.
            </p>
          )}
        </div>

        {/* 2. Tiempo */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Tiempo de Prensa</span>
            </span>
            <div className="text-right font-mono">
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                {timeSec} seg
              </span>
              <span className="text-xs text-slate-500 block">
                {(timeSec / 60).toFixed(1)} min
              </span>
            </div>
          </div>

          <input
            type="range"
            min={Math.max(3, technique.defaultParameters.timeSecondsMin - 10)}
            max={Math.min(300, technique.defaultParameters.timeSecondsMax + 30)}
            value={timeSec}
            onChange={(e) => setTimeSec(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>Rango recomendado:</span>
            <span>{technique.defaultParameters.timeSecondsMin}s - {technique.defaultParameters.timeSecondsMax}s</span>
          </div>
        </div>

        {/* 3. Presión */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-cyan-500" />
              <span>Presión</span>
            </span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white">
              {pressureLevel}
            </span>
          </div>

          <select
            value={pressureLevel}
            onChange={(e) => setPressureLevel(e.target.value as any)}
            className="w-full text-xs font-medium px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="Baja">Baja (1.0 - 2.0 Bar / 15-25 PSI)</option>
            <option value="Media">Media (3.0 - 4.0 Bar / 35-45 PSI)</option>
            <option value="Media-Alta">Media-Alta (4.0 - 5.0 Bar / 50-60 PSI)</option>
            <option value="Alta">Alta (5.0 - 6.0 Bar / 65-75 PSI)</option>
            <option value="Muy Alta">Muy Alta (&gt;6.0 Bar / &gt;80 PSI)</option>
            <option value="No aplica">No aplica</option>
          </select>

          <div className="text-[11px] text-slate-500">
            Detalle: <strong>{pressureBars}</strong>
          </div>
        </div>

        {/* 4. Pelado (Peeling) */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Hand className="w-4 h-4 text-indigo-500" />
              <span>Pelado</span>
            </span>
          </div>

          <select
            value={peeling}
            onChange={(e) => setPeeling(e.target.value as any)}
            className="w-full text-xs font-medium px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="Pelado en Caliente (Hot Peel: 2-4 seg)">En Caliente (2-4 seg)</option>
            <option value="Pelado en Tibio (Warm Peel: 8-12 seg)">En Tibio (8-12 seg)</option>
            <option value="Pelado en Frío (Cold Peel: <30°C ambiente)">En Frío (&lt;30°C)</option>
            <option value="Pelado Instantáneo o Tibio según film">Instantáneo o Tibio</option>
            <option value="No aplica (Impresión directa o bordado)">No aplica (Directo)</option>
          </select>

          <div className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
            <Wind className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span className="truncate">{cooling}</span>
          </div>
        </div>
      </div>

      {/* Advanced Technical Operational Details */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Velocidad Operativa
          </span>
          <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
            {technique.defaultParameters.speed}
          </p>
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Método de Curado
          </span>
          <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span>{technique.defaultParameters.curingMethod}</span>
          </p>
          {technique.defaultParameters.curingTempTime && (
            <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
              {technique.defaultParameters.curingTempTime}
            </span>
          )}
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Enfriamiento Recomendado
          </span>
          <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span>{cooling}</span>
          </p>
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Sustrato Seleccionado
          </span>
          <select
            value={selectedSubstrate}
            onChange={(e) => setSelectedSubstrate(e.target.value)}
            className="w-full text-xs font-semibold px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            {technique.defaultParameters.primaryMaterials.map((mat: string) => (
              <option key={mat} value={mat}>
                {mat}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
