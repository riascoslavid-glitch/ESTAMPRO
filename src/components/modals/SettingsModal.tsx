import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Settings, 
  User, 
  Printer, 
  DollarSign, 
  Sun, 
  Moon, 
  Check, 
  ShieldCheck, 
  Save,
  Palette
} from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    workshopProfile,
    updateWorkshopProfile,
    darkMode,
    setDarkMode
  } = useApp();

  const [activeTab, setActiveTab] = useState<'perfil' | 'impresion' | 'costos' | 'apariencia'>('perfil');

  // Form states initialized from workshopProfile
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

  if (!isSettingsModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
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
    setIsSettingsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSettingsModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-cyan-950/40 text-indigo-600 dark:text-cyan-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Ajustes & Perfil de Taller
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Parámetros de producción, perfiles de color y facturación.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsSettingsModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('perfil')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'perfil'
                ? 'border-indigo-600 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Perfil del Taller</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('impresion')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'impresion'
                ? 'border-indigo-600 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Pre-prensa & Color</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('costos')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'costos'
                ? 'border-indigo-600 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Costos & Moneda</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('apariencia')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'apariencia'
                ? 'border-indigo-600 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Apariencia</span>
          </button>
        </div>

        {/* Tab Content Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'perfil' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                <img
                  src={workshopProfile.avatarUrl}
                  alt={workshopProfile.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500 dark:border-cyan-500 shadow-sm"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{workshopProfile.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{workshopProfile.ownerEmail}</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
                    Cuenta Maestra · Taller Textil Activo
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Nombre del Negocio / Taller
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Lema o Especialidad
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Correo de Contacto
                  </label>
                  <input
                    type="email"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Teléfono / WhatsApp de Taller
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    País
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'impresion' && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-xs text-blue-800 dark:text-blue-300">
                Los parámetros de pre-prensa aseguran que los archivos exportados a DTF o fotolitos mantengan la nitidez y el registro cromático óptimo.
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Resolución Raster por Defecto (DPI)
                </label>
                <select
                  value={defaultDpi}
                  onChange={(e) => setDefaultDpi(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value={300}>300 DPI (Estándar Profesional de Impresión)</option>
                  <option value={600}>600 DPI (Ultra Alta Definición / Microtextos)</option>
                  <option value={150}>150 DPI (Borrador de Visualización)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Perfil de Color Primario
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
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Moneda Operativa
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => {
                      setCurrency(e.target.value);
                      if (e.target.value === 'USD') setCurrencySymbol('$');
                      if (e.target.value === 'CLP') setCurrencySymbol('$');
                      if (e.target.value === 'EUR') setCurrencySymbol('€');
                      if (e.target.value === 'MXN') setCurrencySymbol('$');
                    }}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="USD">USD ($) Dólar Estadounidense</option>
                    <option value="CLP">CLP ($) Peso Chileno</option>
                    <option value="EUR">EUR (€) Euro</option>
                    <option value="MXN">MXN ($) Peso Mexicano</option>
                  </select>
                </div>

                <div className="space-y-1">
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

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Margen Base de Ganancia (%)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={pricingMarginPercent}
                    onChange={(e) => setPricingMarginPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono tabular-nums rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Impuesto / IVA (%)
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

          {activeTab === 'apariencia' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Tema Visual de la Plataforma
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDarkMode(true)}
                    className={`p-4 rounded-xl border flex items-center gap-3 text-left transition-all ${
                      darkMode
                        ? 'border-indigo-600 dark:border-cyan-400 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700'
                    }`}
                  >
                    <Moon className="w-5 h-5 text-cyan-400" />
                    <div>
                      <div className="text-xs font-bold">Modo Oscuro (Studio)</div>
                      <div className="text-[11px] text-slate-400">Ambiente de contraste y fidelidad de color</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDarkMode(false)}
                    className={`p-4 rounded-xl border flex items-center gap-3 text-left transition-all ${
                      !darkMode
                        ? 'border-indigo-600 dark:border-cyan-400 bg-white text-slate-900 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <Sun className="w-5 h-5 text-amber-500" />
                    <div>
                      <div className="text-xs font-bold">Modo Claro</div>
                      <div className="text-[11px] text-slate-400">Ambiente luminoso de alta legibilidad</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer Save Button */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsSettingsModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
            >
              Cerrar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 dark:bg-cyan-600 dark:hover:bg-cyan-500 rounded-lg shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
