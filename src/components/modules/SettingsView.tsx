import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings, 
  User, 
  Printer, 
  DollarSign, 
  Palette, 
  Save, 
  Check, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Workflow 
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    workshopProfile,
    updateWorkshopProfile,
    darkMode,
    setDarkMode
  } = useApp();

  const [activeTab, setActiveTab] = useState<'taller' | 'preprensa' | 'costos' | 'arquitectura'>('taller');

  // Form states
  const [name, setName] = useState(workshopProfile.name);
  const [tagline, setTagline] = useState(workshopProfile.tagline);
  const [ownerEmail, setOwnerEmail] = useState(workshopProfile.ownerEmail);
  const [phone, setPhone] = useState(workshopProfile.phone);
  const [city, setCity] = useState(workshopProfile.city);
  const [country, setCountry] = useState(workshopProfile.country);
  const [currency, setCurrency] = useState(workshopProfile.currency);
  const [currencySymbol, setCurrencySymbol] = useState(workshopProfile.currencySymbol);
  const [defaultDpi, setDefaultDpi] = useState(workshopProfile.defaultDpi);
  const [defaultColorProfile, setDefaultColorProfile] = useState(workshopProfile.defaultColorProfile);
  const [pricingMarginPercent, setPricingMarginPercent] = useState(workshopProfile.pricingMarginPercent);
  const [taxPercent, setTaxPercent] = useState(workshopProfile.taxPercent);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateWorkshopProfile({
      name,
      tagline,
      ownerEmail,
      phone,
      city,
      country,
      currency,
      currencySymbol,
      defaultDpi,
      defaultColorProfile,
      pricingMarginPercent: Number(pricingMarginPercent),
      taxPercent: Number(taxPercent)
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-2 sm:py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Módulo 21 · Sistema
            </span>
            <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Activo
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-600 dark:text-cyan-400" />
            <span>Configuración del Taller & Parámetros Operativos</span>
          </h1>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <Check className="w-4 h-4" />
            <span>Ajustes guardados correctamente</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('taller')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'taller'
              ? 'bg-slate-900 text-white dark:bg-cyan-600'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Perfil del Taller</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preprensa')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'preprensa'
              ? 'bg-slate-900 text-white dark:bg-cyan-600'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>Pre-prensa & Color</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('costos')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'costos'
              ? 'bg-slate-900 text-white dark:bg-cyan-600'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Costos & Finanzas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('arquitectura')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'arquitectura'
              ? 'bg-slate-900 text-white dark:bg-cyan-600'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Arquitectura & Motores</span>
        </button>
      </div>

      {/* Main Settings Card */}
      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        {activeTab === 'taller' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <img
                src={workshopProfile.avatarUrl}
                alt={workshopProfile.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 dark:border-cyan-500 shadow-sm"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{workshopProfile.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{workshopProfile.tagline}</p>
                <p className="text-xs text-indigo-600 dark:text-cyan-400 mt-1 font-mono">{workshopProfile.ownerEmail}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Nombre Comercial del Taller
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Lema / Especialidad Textil
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Teléfono / WhatsApp de Pedidos
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Ciudad
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  País
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preprensa' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Resolución por defecto de salida (DPI)
              </label>
              <select
                value={defaultDpi}
                onChange={(e) => setDefaultDpi(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value={300}>300 DPI (Estándar recomendado para películas DTF y fotolitos)</option>
                <option value={600}>600 DPI (Micro-tramas y detalles de alta definición)</option>
                <option value={150}>150 DPI (Solo visualización rápida en pantalla)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Espacio de Color Primario
              </label>
              <select
                value={defaultColorProfile}
                onChange={(e) => setDefaultColorProfile(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="CMYK FOGRA39 (Textil Estándar)">CMYK Coated FOGRA39 (Textil Estándar Internacional)</option>
                <option value="sRGB IEC61966-2.1 (Para Mockups y Pantalla)">sRGB IEC61966-2.1 (Para Mockups y Pantalla)</option>
                <option value="Adobe RGB (1998) (Gama Amplia)">Adobe RGB (1998) (Gama Amplia para DTG)</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'costos' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Moneda de Facturación
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="USD">USD ($) Dólar Estadounidense</option>
                  <option value="CLP">CLP ($) Peso Chileno</option>
                  <option value="EUR">EUR (€) Euro</option>
                  <option value="MXN">MXN ($) Peso Mexicano</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Símbolo de Moneda
                </label>
                <input
                  type="text"
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Margen Sugerido de Utilidad (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="300"
                  value={pricingMarginPercent}
                  onChange={(e) => setPricingMarginPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-mono tabular-nums rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Impuesto de Venta / IVA (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-mono tabular-nums rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'arquitectura' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Especificaciones de la Plataforma ESTAMPAPRO 360°
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Diseñada con una arquitectura desacoplada para soportar las siguientes integraciones en las etapas consecutivas:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                  <span className="font-semibold text-slate-900 dark:text-white block">Motor Gráfico 2D</span>
                  <span className="text-[11px] text-slate-500">Canvas HTML5 / SVG con capas y filtros de semitono</span>
                </div>
                <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                  <span className="font-semibold text-slate-900 dark:text-white block">Motor 3D WebGL</span>
                  <span className="text-[11px] text-slate-500">Three.js con OrbitControls, texturas UV y drapeado</span>
                </div>
                <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                  <span className="font-semibold text-slate-900 dark:text-white block">IA Creativa Textil</span>
                  <span className="text-[11px] text-slate-500">@google/genai TypeScript SDK con modelos Gemini</span>
                </div>
                <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                  <span className="font-semibold text-slate-900 dark:text-white block">Base de Datos & Almacenamiento</span>
                  <span className="text-[11px] text-slate-500">Estructura preparada para persistencia en nube</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Bar */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 dark:bg-cyan-600 dark:hover:bg-cyan-500 rounded-lg shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Configuración de Taller</span>
          </button>
        </div>
      </form>
    </div>
  );
};
