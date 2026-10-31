import React, { useState } from 'react';
import { ClientCustomization, StoreOrderRequest } from '../../../types/store';
import { PRINT_PLACEMENTS, clientStoreService } from '../../../services/store/clientStoreService';
import { useApp } from '../../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';
import {
  X,
  ShoppingBag,
  FileText,
  Search,
  CheckCircle2,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  Truck,
  ShieldCheck,
  AlertCircle,
  Tag,
  ArrowRight
} from 'lucide-react';

interface CustomerOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  customization: ClientCustomization;
  defaultRequestType?: 'cotizacion' | 'pedido' | 'revision';
  onOrderSuccess: (orderId: string, type: 'cotizacion' | 'pedido' | 'revision') => void;
}

export const CustomerOrderModal: React.FC<CustomerOrderModalProps> = ({
  isOpen,
  onClose,
  customization,
  defaultRequestType = 'pedido',
  onOrderSuccess
}) => {
  const { addNotification } = useApp();
  const { userProfile, currentUser } = useAuth();

  const [requestType, setRequestType] = useState<'cotizacion' | 'pedido' | 'revision'>(defaultRequestType);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState(customization.clientName || userProfile?.displayName || 'Cliente Textil');
  const [email, setEmail] = useState(customization.clientEmail || userProfile?.email || currentUser?.email || 'cliente@ejemplo.com');
  const [phone, setPhone] = useState('+56 9 8765 4321');
  const [city, setCity] = useState('Santiago');
  const [address, setAddress] = useState('Av. Providencia 1240, Dpto 402');
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 10);
    return d.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState(customization.reviewNotes || '');

  if (!isOpen) return null;

  const placementConfig = PRINT_PLACEMENTS[customization.placement] || PRINT_PLACEMENTS.pecho_central;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (customization.totalUnits <= 0) {
      addNotification('Cantidad requerida', 'Por favor selecciona al menos 1 unidad para continuar.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderRequest: StoreOrderRequest = {
        customization: {
          ...customization,
          clientId: userProfile?.uid || currentUser?.uid || customization.clientId,
          clientEmail: email,
          clientName: name,
          reviewNotes: notes
        },
        requestType,
        customerContact: {
          name,
          email,
          phone,
          address,
          city,
          deliveryDateRequested: deliveryDate,
          notes
        }
      };

      const result = await clientStoreService.submitStoreOrder(orderRequest);

      let successTitle = 'Pedido Solicitado con Éxito';
      let successMsg = `Tu orden #${result.orderId} ha sido registrada en el taller. Recibirás un correo de confirmación.`;
      if (requestType === 'cotizacion') {
        successTitle = 'Cotización Formal Generada';
        successMsg = `Tu presupuesto ha sido emitido con número #${result.orderId}. Revisa la pestaña Mis Pedidos.`;
      } else if (requestType === 'revision') {
        successTitle = 'Diseño Enviado a Revisión';
        successMsg = 'Nuestros impresores revisarán la resolución y adecuación técnica para DTF/Serigrafía.';
      }

      addNotification(successTitle, successMsg, 'success', 'pedidos');
      onOrderSuccess(result.orderId, requestType);
      onClose();
    } catch (err) {
      console.error(err);
      addNotification('Error al procesar solicitud', 'Ocurrió un problema. Intenta nuevamente.', 'alert');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              Solicitud de Producción Textil
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalización de {customization.garmentName} • {customization.totalUnits} unidades
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Request Type Selector Tabs */}
        <div className="grid grid-cols-3 p-2 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 gap-1.5">
          <button
            type="button"
            onClick={() => setRequestType('pedido')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
              requestType === 'pedido'
                ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Confirmar Pedido</span>
          </button>

          <button
            type="button"
            onClick={() => setRequestType('cotizacion')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
              requestType === 'cotizacion'
                ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Pedir Cotización</span>
          </button>

          <button
            type="button"
            onClick={() => setRequestType('revision')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
              requestType === 'revision'
                ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Revisión de Arte</span>
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Summary Box */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center border shadow-xs text-white font-bold shrink-0"
                style={{ backgroundColor: customization.colorHex }}
              >
                <span className="text-[10px] bg-black/40 px-1 py-0.5 rounded">
                  {customization.colorName.slice(0, 4)}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {customization.garmentName}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Color: <span className="font-medium text-slate-700 dark:text-slate-300">{customization.colorName}</span> • Posición: <span className="font-medium text-slate-700 dark:text-slate-300">{placementConfig.name}</span>
                </p>
                {/* Size breakdown badges */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {customization.sizesBreakdown
                    .filter((s) => s.quantity > 0)
                    .map((s) => (
                      <span
                        key={s.size}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300"
                      >
                        {s.size}: {s.quantity} u.
                      </span>
                    ))}
                </div>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-slate-200 dark:sm:border-slate-700 sm:pl-4 shrink-0">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Total Estimado</div>
              <div className="text-xl font-extrabold text-cyan-600 dark:text-cyan-400">
                ${customization.totalEstimated.toLocaleString('es-CL')}
              </div>
              <div className="text-[11px] text-slate-500">
                ${customization.unitPrice.toLocaleString('es-CL')} / u.
                {customization.discountApplied > 0 && (
                  <span className="ml-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    (-{customization.discountApplied}%)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nombre Completo o Empresa *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  placeholder="Ej: Carlos Mendoza"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Correo Electrónico *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  placeholder="correo@empresa.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Teléfono / WhatsApp de Contacto *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  placeholder="+56 9 8765 4321"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Fecha Deseada de Entrega
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Dirección y Ciudad de Despacho
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  placeholder="Calle, Número, Comuna / Ciudad"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Observaciones Técnicas o Indicaciones para el Taller
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none"
                placeholder="Ej: Centrar diseño a 3 dedos bajo el cuello, doblado individual en bolsa transparente..."
              />
            </div>
          </div>

          {/* Privacy & Guarantee note */}
          <div className="flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100/60 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              <strong>Garantía de Privacidad ESTAMPAPRO 360°:</strong> Tus artes, diseños subidos y datos de pedido son estrictamente privados y están aislados exclusivamente para tu cuenta de cliente.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>Procesando Solicitud...</>
              ) : requestType === 'pedido' ? (
                <>
                  <span>Confirmar y Enviar Pedido</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : requestType === 'cotizacion' ? (
                <>
                  <span>Emitir Cotización Formal</span>
                  <FileText className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Enviar a Revisión de Impresor</span>
                  <Search className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
