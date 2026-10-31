import React, { useState } from 'react';
import { OperationalCostSettings, BusinessProfileInfo } from '../../../types/finance';
import { X, Settings2, Building, DollarSign, Zap, Clock, Package, Truck, Percent, Save, Check } from 'lucide-react';

interface BaseCostSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: OperationalCostSettings;
  business: BusinessProfileInfo;
  onSave: (settings: OperationalCostSettings, business: BusinessProfileInfo) => void;
}

export const BaseCostSettingsModal: React.FC<BaseCostSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  business,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'costs' | 'business'>('costs');
  const [formSettings, setFormSettings] = useState<OperationalCostSettings>({ ...settings });
  const [formBusiness, setFormBusiness] = useState<BusinessProfileInfo>({ ...business });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(formSettings, formBusiness);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Settings2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Configuración de Parámetros de Costos del Taller
              </h2>
              <p className="text-xs text-slate-400">
                Tarifas de energía, mano de obra, merma y datos comerciales del negocio
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

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 px-6 pt-3 bg-slate-950/30 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('costs')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'costs'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> Tarifas Operativas & Desperdicio
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('business')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'business'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building className="w-3.5 h-3.5" /> Datos del Negocio & Emisor
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'costs' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Tarifa Eléctrica ({formSettings.currencySymbol}/kWh):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formSettings.electricityKwhRate}
                  onChange={(e) =>
                    setFormSettings({ ...formSettings, electricityKwhRate: Number(e.target.value) })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-500">Costo promedio de energía industrial</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  Mano de Obra ({formSettings.currencySymbol}/hora):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formSettings.laborHourlyRate}
                  onChange={(e) =>
                    setFormSettings({ ...formSettings, laborHourlyRate: Number(e.target.value) })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-500">Salario con cargas sociales por hora</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Minutos Operario por Prenda (promedio):
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formSettings.laborMinutesPerUnit}
                  onChange={(e) =>
                    setFormSettings({ ...formSettings, laborMinutesPerUnit: Number(e.target.value) })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-rose-400" />
                  Desperdicio / Merma Textil (%):
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formSettings.wastePercentage}
                  onChange={(e) =>
                    setFormSettings({ ...formSettings, wastePercentage: Number(e.target.value) })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-500">Mermas por prueba o fallas (típicamente 3-5%)</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-indigo-400" />
                  Empaque por Prenda ({formSettings.currencySymbol}):
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={formSettings.packagingCostPerUnit}
                  onChange={(e) =>
                    setFormSettings({ ...formSettings, packagingCostPerUnit: Number(e.target.value) })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  Transporte Base por Pedido ({formSettings.currencySymbol}):
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formSettings.transportCostPerOrder}
                  onChange={(e) =>
                    setFormSettings({ ...formSettings, transportCostPerOrder: Number(e.target.value) })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Margen de Ganancia Objetivo por Defecto (%):
                </label>
                <input
                  type="number"
                  step="1"
                  value={formSettings.defaultTargetMarginPercent}
                  onChange={(e) =>
                    setFormSettings({
                      ...formSettings,
                      defaultTargetMarginPercent: Number(e.target.value)
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-cyan-400 font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  IVA / Impuesto Comercial (%):
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formSettings.taxPercent}
                  onChange={(e) =>
                    setFormSettings({ ...formSettings, taxPercent: Number(e.target.value) })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Símbolo de Moneda:
                </label>
                <input
                  type="text"
                  value={formSettings.currencySymbol}
                  onChange={(e) =>
                    setFormSettings({ ...formSettings, currencySymbol: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Razón Social / Nombre del Negocio:
                </label>
                <input
                  type="text"
                  value={formBusiness.businessName}
                  onChange={(e) =>
                    setFormBusiness({ ...formBusiness, businessName: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    RUT / NIF / CIF / Tax ID:
                  </label>
                  <input
                    type="text"
                    value={formBusiness.taxId}
                    onChange={(e) => setFormBusiness({ ...formBusiness, taxId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Teléfono de Contacto:
                  </label>
                  <input
                    type="text"
                    value={formBusiness.phone}
                    onChange={(e) => setFormBusiness({ ...formBusiness, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Email de Cotizaciones:
                  </label>
                  <input
                    type="email"
                    value={formBusiness.email}
                    onChange={(e) => setFormBusiness({ ...formBusiness, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Ciudad / Región:
                  </label>
                  <input
                    type="text"
                    value={formBusiness.city}
                    onChange={(e) => setFormBusiness({ ...formBusiness, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Dirección del Taller / Local Comercial:
                </label>
                <input
                  type="text"
                  value={formBusiness.address}
                  onChange={(e) => setFormBusiness({ ...formBusiness, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Datos Bancarios para Transferencias:
                </label>
                <input
                  type="text"
                  value={formBusiness.bankDetails || ''}
                  onChange={(e) =>
                    setFormBusiness({ ...formBusiness, bankDetails: e.target.value })
                  }
                  placeholder="Banco, Tipo de cuenta, Número y Titular"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {savedSuccess && (
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <Check className="w-3.5 h-3.5" /> Parámetros guardados con éxito
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              Guardar Configuración
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
