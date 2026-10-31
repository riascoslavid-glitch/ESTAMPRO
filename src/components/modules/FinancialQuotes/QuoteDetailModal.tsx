import React, { useState } from 'react';
import { ProfessionalQuote, QuoteStatus } from '../../../types/finance';
import {
  X,
  Download,
  Printer,
  Calendar,
  Building,
  User,
  CheckCircle2,
  Clock,
  AlertOctagon,
  FileText,
  DollarSign
} from 'lucide-react';
import { generateQuotePdf } from '../../../services/finance/costCalculationEngine';
import { downloadFile } from '../../../services/prepress/printPreparationEngine';

interface QuoteDetailModalProps {
  quote: ProfessionalQuote | null;
  onClose: () => void;
  onUpdateStatus: (quoteId: string, status: QuoteStatus) => void;
}

export const QuoteDetailModal: React.FC<QuoteDetailModalProps> = ({
  quote,
  onClose,
  onUpdateStatus
}) => {
  const [isExporting, setIsExporting] = useState(false);

  if (!quote) return null;

  const currency = quote.currencySymbol || '$';

  const handleDownloadPdf = () => {
    setIsExporting(true);
    try {
      const pdfBlob = generateQuotePdf(quote);
      downloadFile(pdfBlob, `${quote.quoteNumber}_${quote.customer.name.replace(/\s+/g, '_')}.html`);
    } catch (err) {
      console.error('Error al exportar cotización:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    const pdfBlob = generateQuotePdf(quote);
    const blobUrl = URL.createObjectURL(pdfBlob);
    const printWindow = window.open(blobUrl, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const getStatusBadge = (status: QuoteStatus) => {
    switch (status) {
      case 'aprobada':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Aprobada
          </span>
        );
      case 'enviada':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
            <Clock className="w-3.5 h-3.5" /> Enviada
          </span>
        );
      case 'facturada':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <DollarSign className="w-3.5 h-3.5" /> Facturada
          </span>
        );
      case 'rechazada':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <AlertOctagon className="w-3.5 h-3.5" /> Rechazada
          </span>
        );
      case 'borrador':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            Borrador
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100 font-mono">
                  {quote.quoteNumber}
                </h2>
                {getStatusBadge(quote.status)}
              </div>
              <p className="text-xs text-slate-400">
                Cliente: <strong className="text-slate-200">{quote.customer.name}</strong> • Emisión:{' '}
                {new Date(quote.createdAt).toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              {isExporting ? 'Exportando...' : 'Descargar PDF'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Ficha Superior: Datos del negocio y cliente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Datos del Negocio */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-1.5 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                <Building className="w-3.5 h-3.5" /> Datos del Taller Emisor
              </span>
              <div className="text-sm font-bold text-slate-100">{quote.business.businessName}</div>
              <div className="text-slate-300">{quote.business.address} • {quote.business.city}</div>
              <div className="text-slate-400 font-mono">
                {quote.business.taxId} • {quote.business.phone} • {quote.business.email}
              </div>
            </div>

            {/* Datos del Cliente */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-1.5 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> Datos del Cliente
              </span>
              <div className="text-sm font-bold text-slate-100">{quote.customer.name}</div>
              {quote.customer.company && (
                <div className="text-slate-300 font-medium">{quote.customer.company}</div>
              )}
              <div className="text-slate-400 font-mono">
                {quote.customer.email} • {quote.customer.phone}
              </div>
              {quote.customer.city && (
                <div className="text-slate-400">Ciudad: {quote.customer.city}</div>
              )}
            </div>
          </div>

          {/* Plazo y vigencia */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>
                Vigencia del presupuesto:{' '}
                <strong className="text-rose-400 font-mono">
                  {new Date(quote.validUntil).toLocaleDateString('es-ES')}
                </strong>
              </span>
            </div>

            <div>
              Plazo de entrega:{' '}
              <strong className="text-slate-100">{quote.deliveryTimeDays} días hábiles</strong>
            </div>

            <div>
              Forma de pago: <strong className="text-slate-100">{quote.paymentTerms}</strong>
            </div>

            {/* Cambiador de Estado */}
            <div className="flex items-center gap-1.5">
              <label className="text-slate-400 text-[11px]">Estado:</label>
              <select
                value={quote.status}
                onChange={(e) => onUpdateStatus(quote.id, e.target.value as QuoteStatus)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="borrador">Borrador</option>
                <option value="enviada">Enviada</option>
                <option value="aprobada">Aprobada</option>
                <option value="facturada">Facturada</option>
                <option value="rechazada">Rechazada</option>
              </select>
            </div>
          </div>

          {/* Tabla de Items */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Detalle de Prendas, Diseños y Técnicas
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-950 text-[11px] text-slate-400 uppercase font-medium">
                  <tr>
                    <th className="py-2.5 px-3">Prenda & Color</th>
                    <th className="py-2.5 px-3">Técnica</th>
                    <th className="py-2.5 px-2 text-center">Cant.</th>
                    <th className="py-2.5 px-2 text-right">Unit. Base</th>
                    <th className="py-2.5 px-2 text-center">Desc.</th>
                    <th className="py-2.5 px-2 text-right">Unit. Final</th>
                    <th className="py-2.5 px-3 text-right font-bold text-slate-200">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {quote.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-200">
                          {item.garmentName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {item.garmentColor} • Tallas: {item.garmentSize}
                        </div>
                        <div className="text-[11px] text-cyan-400/80 mt-0.5">
                          {item.designDescription}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-medium text-cyan-300 font-sans">
                          {item.techniqueName}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center font-mono font-bold text-slate-200">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-2 text-right font-mono text-slate-400">
                        {currency}{item.unitBasePrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-2 text-center font-mono">
                        {item.discountPercent > 0 ? (
                          <span className="text-emerald-400 font-bold">-{item.discountPercent}%</span>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-right font-mono font-semibold text-slate-200">
                        {currency}{item.finalUnitPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-cyan-300">
                        {currency}{item.lineSubtotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totales y Liquidación */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 pt-2">
            {/* Observaciones */}
            <div className="flex-1 w-full bg-slate-950/40 border border-slate-800 rounded-xl p-3.5 space-y-1.5 text-xs text-slate-400">
              <span className="font-semibold text-slate-300 block">Observaciones y Condiciones:</span>
              <p className="leading-relaxed whitespace-pre-line text-slate-300">
                {quote.notes || 'Precios sujetos a confirmación de stock. No incluye vectorizado complejo.'}
              </p>
            </div>

            {/* Cuadro de Totales */}
            <div className="w-full md:w-80 bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal Neto:</span>
                <span className="text-slate-200">{currency}{quote.subtotal.toFixed(2)}</span>
              </div>

              {quote.totalDiscounts > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Descuentos aplicados:</span>
                  <span>-{currency}{quote.totalDiscounts.toFixed(2)}</span>
                </div>
              )}

              {quote.shippingAmount > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span>Flete / Envío:</span>
                  <span className="text-slate-200">{currency}{quote.shippingAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400">
                <span>IVA / Impuesto ({quote.taxPercent}%):</span>
                <span className="text-slate-200">{currency}{quote.taxAmount.toFixed(2)}</span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-cyan-400">
                <span className="font-sans">TOTAL PRESUPUESTO:</span>
                <span>{currency}{quote.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Cálculo verificado con motor financiero ESTAMPAPRO 360°
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
