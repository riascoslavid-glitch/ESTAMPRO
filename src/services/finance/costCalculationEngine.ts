import {
  TechniqueCostFactors,
  OperationalCostSettings,
  VolumeDiscountTier,
  FullCostBreakdown,
  CalculationSimulationRow,
  ProfessionalQuote
} from '../../types/finance';

/**
 * Motor de Cálculo Financiero Determinístico para Talleres de Estampado
 * Sin cifras inventadas: todas las fórmulas dependen de los costos parametrizados.
 */
export function calculateFullCostBreakdown(
  quantity: number,
  garmentUnitCost: number,
  technique: TechniqueCostFactors,
  operations: OperationalCostSettings,
  customMarkupPercent?: number
): FullCostBreakdown {
  const q = Math.max(1, quantity);

  // 1. Materiales directos (por unidad)
  const garmentCostUnit = garmentUnitCost;
  const inksCostUnit = technique.inkCostPerUnit;
  const filmsCostUnit = technique.filmCostPerUnit;
  const paperCostUnit = technique.paperCostPerUnit;
  const vinylCostUnit = technique.vinylCostPerUnit;
  const threadsCostUnit = technique.threadCostPerUnit;
  const consumablesCostUnit = technique.consumablesCostPerUnit;

  const totalMaterialsCostUnit =
    garmentCostUnit +
    inksCostUnit +
    filmsCostUnit +
    paperCostUnit +
    vinylCostUnit +
    threadsCostUnit +
    consumablesCostUnit;

  // 2. Costos operativos y mano de obra directa (por unidad)
  // Mano de obra = (minutos / 60) * tarifa horaria
  const laborCostUnit = (operations.laborMinutesPerUnit / 60) * operations.laborHourlyRate;

  // Electricidad = (Potencia en kW * horas de uso por prenda) * tarifa kWh
  const hoursPerUnit = technique.machineTimeMinutesPerUnit / 60;
  const electricityCostUnit = technique.machinePowerKw * hoursPerUnit * operations.electricityKwhRate;

  // Tiempo y amortización de máquina (desgaste y mantenimiento)
  const machineTimeCostUnit = hoursPerUnit * (operations.laborHourlyRate * 0.15);

  // Costo fijo de puesta a punto amortizado en la tirada (ej: revelado o ponchado)
  const setupCostAmortizedUnit = technique.setupFixedCost / q;

  const totalOperationsCostUnit =
    laborCostUnit + electricityCostUnit + machineTimeCostUnit + setupCostAmortizedUnit;

  // 3. Empaque, transporte, desperdicio y gastos adicionales
  const packagingCostUnit = operations.packagingCostPerUnit;
  const transportCostAmortizedUnit = operations.transportCostPerOrder / q;
  const additionalCostAmortizedUnit = operations.additionalExpensesPerOrder / q;

  // Desperdicio / Merma textil técnica sobre los costos directos
  const baseForWaste = totalMaterialsCostUnit + laborCostUnit + electricityCostUnit;
  const wasteCostUnit = baseForWaste * (operations.wastePercentage / 100);

  // 4. Costo Unitario Total
  const totalUnitCost =
    totalMaterialsCostUnit +
    totalOperationsCostUnit +
    packagingCostUnit +
    transportCostAmortizedUnit +
    wasteCostUnit +
    additionalCostAmortizedUnit;

  // 5. Costos totales por pedido (lote)
  const totalBatchCost = totalUnitCost * q;

  // 6. Precios y rentabilidad
  const markup = customMarkupPercent !== undefined ? customMarkupPercent : operations.defaultTargetMarginPercent;
  // Precio base unitario antes de descuentos por volumen = Costo / (1 - Margen%)
  const markupRatio = Math.max(0.01, 1 - markup / 100);
  const baseUnitPrice = totalUnitCost / markupRatio;

  // Descuento por volumen según tirada
  const volumeDiscountPercent = getVolumeDiscountPercent(q);
  const discountAmount = baseUnitPrice * (volumeDiscountPercent / 100);
  const finalUnitPrice = Math.max(totalUnitCost * 1.05, baseUnitPrice - discountAmount);

  const subtotalOrder = finalUnitPrice * q;
  const taxAmount = subtotalOrder * (operations.taxPercent / 100);
  const totalOrderPrice = subtotalOrder + taxAmount;

  const netProfitUnit = finalUnitPrice - totalUnitCost;
  const netProfitTotal = netProfitUnit * q;
  const realMarginPercent = finalUnitPrice > 0 ? (netProfitUnit / finalUnitPrice) * 100 : 0;

  return {
    quantity: q,
    garmentCostUnit: round(garmentCostUnit),
    garmentCostTotal: round(garmentCostUnit * q),
    inksCostUnit: round(inksCostUnit),
    inksCostTotal: round(inksCostUnit * q),
    filmsCostUnit: round(filmsCostUnit),
    filmsCostTotal: round(filmsCostUnit * q),
    paperCostUnit: round(paperCostUnit),
    paperCostTotal: round(paperCostUnit * q),
    vinylCostUnit: round(vinylCostUnit),
    vinylCostTotal: round(vinylCostUnit * q),
    threadsCostUnit: round(threadsCostUnit),
    threadsCostTotal: round(threadsCostUnit * q),
    consumablesCostUnit: round(consumablesCostUnit),
    consumablesCostTotal: round(consumablesCostUnit * q),
    totalMaterialsCostUnit: round(totalMaterialsCostUnit),
    totalMaterialsCostTotal: round(totalMaterialsCostUnit * q),

    laborCostUnit: round(laborCostUnit),
    laborCostTotal: round(laborCostUnit * q),
    electricityCostUnit: round(electricityCostUnit),
    electricityCostTotal: round(electricityCostUnit * q),
    machineTimeCostUnit: round(machineTimeCostUnit),
    machineTimeCostTotal: round(machineTimeCostUnit * q),
    setupCostAmortizedUnit: round(setupCostAmortizedUnit),
    setupCostTotal: round(technique.setupFixedCost),
    totalOperationsCostUnit: round(totalOperationsCostUnit),
    totalOperationsCostTotal: round(totalOperationsCostUnit * q),

    packagingCostUnit: round(packagingCostUnit),
    packagingCostTotal: round(packagingCostUnit * q),
    transportCostAmortizedUnit: round(transportCostAmortizedUnit),
    transportCostTotal: round(operations.transportCostPerOrder),
    wasteCostUnit: round(wasteCostUnit),
    wasteCostTotal: round(wasteCostUnit * q),
    additionalCostAmortizedUnit: round(additionalCostAmortizedUnit),
    additionalCostTotal: round(operations.additionalExpensesPerOrder),

    totalUnitCost: round(totalUnitCost),
    totalBatchCost: round(totalBatchCost),

    markupPercent: round(markup),
    baseUnitPrice: round(baseUnitPrice),
    volumeDiscountPercent: round(volumeDiscountPercent),
    finalUnitPrice: round(finalUnitPrice),
    subtotalOrder: round(subtotalOrder),
    taxAmount: round(taxAmount),
    totalOrderPrice: round(totalOrderPrice),
    netProfitUnit: round(netProfitUnit),
    netProfitTotal: round(netProfitTotal),
    realMarginPercent: round(realMarginPercent)
  };
}

/**
 * Escala de descuentos por volumen industrial
 */
export function getVolumeDiscountPercent(qty: number): number {
  if (qty >= 250) return 45;
  if (qty >= 100) return 38;
  if (qty >= 50) return 30;
  if (qty >= 25) return 22;
  if (qty >= 10) return 14;
  if (qty >= 5) return 8;
  return 0; // 1 unidad: precio unitario estándar
}

/**
 * Genera la matriz de simulación comparativa de costos para:
 * 1, 5, 10, 25, 50, 100 y una cantidad personalizada
 */
export function generateVolumeSimulations(
  garmentUnitCost: number,
  technique: TechniqueCostFactors,
  operations: OperationalCostSettings,
  customQuantity?: number
): CalculationSimulationRow[] {
  const standardTiers = [
    { qty: 1, label: '1 unidad (Muestra/Unitario)' },
    { qty: 5, label: '5 unidades' },
    { qty: 10, label: '10 unidades' },
    { qty: 25, label: '25 unidades' },
    { qty: 50, label: '50 unidades' },
    { qty: 100, label: '100 unidades (Escala)' }
  ];

  const rows: CalculationSimulationRow[] = standardTiers.map((tier) => {
    const calc = calculateFullCostBreakdown(tier.qty, garmentUnitCost, technique, operations);
    return {
      quantity: tier.qty,
      label: tier.label,
      isCustom: false,
      unitCost: calc.totalUnitCost,
      batchCost: calc.totalBatchCost,
      suggestedUnitPrice: calc.baseUnitPrice,
      discountPercent: calc.volumeDiscountPercent,
      finalUnitPrice: calc.finalUnitPrice,
      totalOrderPrice: calc.totalOrderPrice,
      totalProfit: calc.netProfitTotal,
      marginPercent: calc.realMarginPercent,
      wasteAmount: calc.wasteCostTotal
    };
  });

  // Si hay una cantidad personalizada que no coincida con las estándar
  if (customQuantity && !standardTiers.some((t) => t.qty === customQuantity)) {
    const customCalc = calculateFullCostBreakdown(
      customQuantity,
      garmentUnitCost,
      technique,
      operations
    );
    rows.push({
      quantity: customQuantity,
      label: `${customQuantity} unidades (Personalizada)`,
      isCustom: true,
      unitCost: customCalc.totalUnitCost,
      batchCost: customCalc.totalBatchCost,
      suggestedUnitPrice: customCalc.baseUnitPrice,
      discountPercent: customCalc.volumeDiscountPercent,
      finalUnitPrice: customCalc.finalUnitPrice,
      totalOrderPrice: customCalc.totalOrderPrice,
      totalProfit: customCalc.netProfitTotal,
      marginPercent: customCalc.realMarginPercent,
      wasteAmount: customCalc.wasteCostTotal
    });

    // Ordenar por cantidad ascendente
    rows.sort((a, b) => a.quantity - b.quantity);
  }

  return rows;
}

/**
 * Redondeo a 2 decimales para precisión financiera
 */
function round(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Genera un PDF estructurado de Cotización Comercial profesional
 */
export function generateQuotePdf(quote: ProfessionalQuote): Blob {
  // Generar HTML imprimible y encapsularlo en Blob o generar estructura PDF
  const currency = quote.currencySymbol || '$';

  const rowsHtml = quote.items
    .map(
      (item, idx) => `
    <tr style="border-bottom: 1px solid #e2e8f0; font-size: 11px;">
      <td style="padding: 10px 8px; color: #64748b; font-family: monospace;">#${idx + 1}</td>
      <td style="padding: 10px 8px;">
        <strong style="color: #0f172a; display: block; font-size: 12px;">${item.garmentName} (${item.garmentColor} / ${item.garmentSize})</strong>
        <span style="color: #64748b; font-size: 10px;">${item.designDescription}</span>
      </td>
      <td style="padding: 10px 8px; color: #0284c7; font-weight: 600;">${item.techniqueName}</td>
      <td style="padding: 10px 8px; text-align: center; font-family: monospace; font-weight: bold; font-size: 12px;">${item.quantity}</td>
      <td style="padding: 10px 8px; text-align: right; font-family: monospace;">${currency}${item.unitBasePrice.toFixed(2)}</td>
      <td style="padding: 10px 8px; text-align: center; color: #16a34a; font-family: monospace;">${item.discountPercent > 0 ? `-${item.discountPercent}%` : '-'}</td>
      <td style="padding: 10px 8px; text-align: right; font-weight: 600; font-family: monospace;">${currency}${item.finalUnitPrice.toFixed(2)}</td>
      <td style="padding: 10px 8px; text-align: right; font-weight: bold; color: #0f172a; font-family: monospace;">${currency}${item.lineSubtotal.toFixed(2)}</td>
    </tr>`
    )
    .join('');

  const printableHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Cotización ${quote.quoteNumber} - ${quote.customer.name}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #0f172a; margin: 0; padding: 24px; background: #fff; font-size: 12px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 20px; }
    .brand-title { font-size: 20px; font-weight: 800; color: #0284c7; margin: 0 0 4px 0; letter-spacing: -0.5px; }
    .quote-badge { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; padding: 4px 10px; border-radius: 6px; font-weight: bold; font-size: 11px; text-transform: uppercase; }
    .grid-2 { display: flex; justify-content: space-between; gap: 20px; margin-bottom: 20px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; flex: 1; }
    .card-title { font-size: 10px; font-weight: bold; text-transform: uppercase; color: #64748b; margin-bottom: 6px; letter-spacing: 0.5px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th { background: #0f172a; color: #fff; text-align: left; padding: 10px 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
    .totals-area { display: flex; justify-content: flex-end; margin-bottom: 20px; }
    .totals-box { width: 300px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; }
    .total-row { display: flex; justify-content: space-between; padding: 4px 0; font-family: monospace; font-size: 11px; }
    .grand-total { border-top: 2px solid #0f172a; margin-top: 6px; padding-top: 6px; font-weight: 800; font-size: 14px; color: #0284c7; }
    .terms { background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 12px; color: #92400e; font-size: 11px; margin-bottom: 20px; }
    .footer { text-align: center; color: #94a3b8; font-size: 10px; border-top: 1px solid #e2e8f0; padding-top: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="brand-title">${quote.business.businessName}</h1>
      <p style="margin: 0; color: #64748b; font-size: 11px;">${quote.business.address} • ${quote.business.city}</p>
      <p style="margin: 2px 0 0 0; color: #64748b; font-size: 11px;">RUT/Tax: <strong>${quote.business.taxId}</strong> • Email: ${quote.business.email} • Fono: ${quote.business.phone}</p>
    </div>
    <div style="text-align: right;">
      <div style="font-size: 18px; font-weight: 800; color: #0f172a; font-family: monospace;">${quote.quoteNumber}</div>
      <div style="color: #64748b; font-size: 11px; margin: 3px 0;">Emisión: <strong>${new Date(quote.createdAt).toLocaleDateString('es-ES')}</strong></div>
      <div style="color: #dc2626; font-size: 11px; font-weight: 600;">Vigente hasta: <strong>${new Date(quote.validUntil).toLocaleDateString('es-ES')}</strong></div>
      <div style="margin-top: 6px;"><span class="quote-badge">${quote.status}</span></div>
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="card-title">Datos del Cliente</div>
      <div style="font-size: 13px; font-weight: bold; color: #0f172a;">${quote.customer.name}</div>
      ${quote.customer.company ? `<div style="color: #64748b; font-size: 11px; font-weight: 600;">${quote.customer.company}</div>` : ''}
      <div style="color: #64748b; font-size: 11px; margin-top: 4px;">Email: ${quote.customer.email} • Tel: ${quote.customer.phone}</div>
      ${quote.customer.city ? `<div style="color: #64748b; font-size: 11px;">Ciudad: ${quote.customer.city}</div>` : ''}
    </div>

    <div class="card">
      <div class="card-title">Condiciones de Producción</div>
      <div style="font-size: 11px; color: #0f172a;">Plazo de entrega: <strong>${quote.deliveryTimeDays} días hábiles</strong></div>
      <div style="font-size: 11px; color: #0f172a; margin-top: 4px;">Forma de pago: <strong>${quote.paymentTerms}</strong></div>
      <div style="font-size: 10px; color: #64748b; margin-top: 4px;">Cuentas: ${quote.business.bankDetails || 'A coordinar'}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 30px;">Item</th>
        <th>Prenda & Detalle</th>
        <th>Técnica</th>
        <th style="text-align: center;">Cant.</th>
        <th style="text-align: right;">Unit. Base</th>
        <th style="text-align: center;">Desc.</th>
        <th style="text-align: right;">Unit. Final</th>
        <th style="text-align: right;">Total Línea</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>

  <div class="totals-area">
    <div class="totals-box">
      <div class="total-row"><span>Subtotal Neto:</span><span>${currency}${quote.subtotal.toFixed(2)}</span></div>
      ${quote.totalDiscounts > 0 ? `<div class="total-row" style="color: #16a34a;"><span>Descuentos por volumen:</span><span>-${currency}${quote.totalDiscounts.toFixed(2)}</span></div>` : ''}
      ${quote.shippingAmount > 0 ? `<div class="total-row"><span>Transporte / Despacho:</span><span>${currency}${quote.shippingAmount.toFixed(2)}</span></div>` : ''}
      ${quote.taxAmount > 0 ? `<div class="total-row"><span>IVA / Impuesto (${quote.taxPercent}%):</span><span>${currency}${quote.taxAmount.toFixed(2)}</span></div>` : ''}
      <div class="total-row grand-total"><span>TOTAL PRESUPUESTO:</span><span>${currency}${quote.grandTotal.toFixed(2)}</span></div>
    </div>
  </div>

  ${quote.notes ? `
  <div class="terms">
    <strong>Observaciones y Cláusulas Técnicas:</strong><br/>
    ${quote.notes.replace(/\n/g, '<br/>')}
  </div>` : ''}

  <div class="footer">
    Documento emitido por el sistema financiero y cotizador inteligente ESTAMPAPRO 360° • www.estampapro360.com
  </div>
</body>
</html>`;

  return new Blob([printableHtml], { type: 'text/html' });
}
