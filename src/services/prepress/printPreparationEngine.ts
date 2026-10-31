import {
  PrepressArtwork,
  PrintPreparationConfig,
  PrePressMachine,
  PreflightIssue,
  SeparationPlate,
  PrintFormat
} from '../../types/printPreparation';

/**
 * Utility to convert dimensions to millimeters
 */
export function convertToMm(value: number, unit: 'cm' | 'mm' | 'in' | 'px', dpi: number): number {
  switch (unit) {
    case 'mm':
      return value;
    case 'cm':
      return value * 10;
    case 'in':
      return value * 25.4;
    case 'px':
      return (value / dpi) * 25.4;
    default:
      return value;
  }
}

/**
 * Convert millimeters to target unit
 */
export function convertFromMm(mm: number, targetUnit: 'cm' | 'mm' | 'in' | 'px', dpi: number): number {
  switch (targetUnit) {
    case 'mm':
      return Math.round(mm * 100) / 100;
    case 'cm':
      return Math.round((mm / 10) * 100) / 100;
    case 'in':
      return Math.round((mm / 25.4) * 100) / 100;
    case 'px':
      return Math.round((mm / 25.4) * dpi);
    default:
      return mm;
  }
}

/**
 * Realiza la auditoría técnica pre-vuelo (Preflight Check)
 */
export function auditPreflight(
  artwork: PrepressArtwork | null,
  config: PrintPreparationConfig,
  machine: PrePressMachine
): PreflightIssue[] {
  const issues: PreflightIssue[] = [];

  // 1. Verificación de imagen cargada
  if (!artwork) {
    issues.push({
      id: 'missing-artwork',
      rule: 'missing_artwork',
      severity: 'error',
      title: 'Arte de impresión no cargado',
      description: 'Debe cargar un archivo de diseño (PNG, SVG, TIFF, JPG) para iniciar la preparación.',
      autoFixAvailable: false
    });
    return issues;
  }

  const widthMm = convertToMm(config.width, config.unit, config.dpi);
  const heightMm = convertToMm(config.height, config.unit, config.dpi);

  // 2. Cálculo estricto de DPI real efectivo
  const widthInches = widthMm / 25.4;
  const effectiveDpi = widthInches > 0 ? Math.round(artwork.originalWidthPx / widthInches) : 0;

  if (effectiveDpi < 150) {
    issues.push({
      id: 'dpi-critical',
      rule: 'dpi',
      severity: 'error',
      title: 'Resolución insuficiente (< 150 DPI)',
      description: `El arte tiene ${artwork.originalWidthPx}px de ancho impreso a ${Math.round(widthMm / 10)}cm, dando solo ${effectiveDpi} DPI. Provocará pixelado y bordes dentados visibles.`,
      metricValue: `${effectiveDpi} DPI`,
      recommendedValue: '≥ 300 DPI',
      autoFixAvailable: true,
      autoFixAction: 'reduce_dimension_for_300dpi'
    });
  } else if (effectiveDpi < 290) {
    issues.push({
      id: 'dpi-warning',
      rule: 'dpi',
      severity: 'warning',
      title: 'Resolución sub-óptima (150 - 290 DPI)',
      description: `La resolución efectiva es de ${effectiveDpi} DPI. Aceptable para prendas a distancia, pero inferior al estándar industrial de 300 DPI para serigrafía o DTF de alta nitidez.`,
      metricValue: `${effectiveDpi} DPI`,
      recommendedValue: '300 DPI',
      autoFixAvailable: true,
      autoFixAction: 'reduce_dimension_for_300dpi'
    });
  } else {
    issues.push({
      id: 'dpi-pass',
      rule: 'dpi',
      severity: 'pass',
      title: 'Resolución óptima (≥ 300 DPI)',
      description: `Resolución efectiva de ${effectiveDpi} DPI. Cumple con el estándar de nitidez fotográfica para RIP y tramas finas.`,
      metricValue: `${effectiveDpi} DPI`
    });
  }

  // 3. Verificación de dimensiones vs cama de impresión de la máquina
  const totalWidthMmWithBleed = widthMm + config.bleedMm * 2;
  const totalHeightMmWithBleed = heightMm + config.bleedMm * 2;

  if (totalWidthMmWithBleed > machine.bedWidthMm || totalHeightMmWithBleed > machine.bedHeightMm) {
    issues.push({
      id: 'bed-overflow',
      rule: 'dimensions',
      severity: 'error',
      title: 'Dimensiones sobrepasan la cama de impresión',
      description: `El diseño con sangrado (${Math.round(totalWidthMmWithBleed)} x ${Math.round(totalHeightMmWithBleed)} mm) excede el área máxima útil de ${machine.name} (${machine.bedWidthMm} x ${machine.bedHeightMm} mm).`,
      metricValue: `${Math.round(totalWidthMmWithBleed)}x${Math.round(totalHeightMmWithBleed)} mm`,
      recommendedValue: `Máx: ${machine.bedWidthMm}x${machine.bedHeightMm} mm`,
      autoFixAvailable: true,
      autoFixAction: 'fit_to_machine_bed'
    });
  } else {
    // Verificar si invade el margen de seguridad
    const safeWidth = machine.bedWidthMm - machine.defaultMarginMm * 2;
    const safeHeight = machine.bedHeightMm - machine.defaultMarginMm * 2;
    if (totalWidthMmWithBleed > safeWidth || totalHeightMmWithBleed > safeHeight) {
      issues.push({
        id: 'margin-warning',
        rule: 'out_of_bounds',
        severity: 'warning',
        title: 'Diseño muy próximo al borde físico de la máquina',
        description: `El diseño se encuentra a menos de ${machine.defaultMarginMm} mm del borde de corte o arrastre del carro.`,
        autoFixAvailable: true,
        autoFixAction: 'fit_to_machine_safe_margin'
      });
    } else {
      issues.push({
        id: 'dimensions-pass',
        rule: 'dimensions',
        severity: 'pass',
        title: 'Dimensiones válidas para la máquina seleccionada',
        description: `El arte (${Math.round(widthMm)} x ${Math.round(heightMm)} mm) se adapta holgadamente a la cama de ${machine.name}.`,
        metricValue: `${Math.round(widthMm)}x${Math.round(heightMm)} mm`
      });
    }
  }

  // 4. Verificación de canal alfa y transparencia
  if (config.exportFormat === 'JPG' && artwork.hasAlpha) {
    issues.push({
      id: 'transparency-jpg-error',
      rule: 'transparency',
      severity: 'error',
      title: 'Formato JPG elimina la transparencia',
      description: 'El diseño contiene fondo transparente pero el formato seleccionado es JPG. La imagen se exportará con fondo blanco sólido no deseado en DTF/DTG.',
      recommendedValue: 'Exportar en PNG o TIFF',
      autoFixAvailable: true,
      autoFixAction: 'switch_to_png'
    });
  } else if (artwork.hasDirtyAlphaHalos && (machine.category === 'dtf' || machine.category === 'dtg')) {
    issues.push({
      id: 'transparency-halos',
      rule: 'transparency',
      severity: 'warning',
      title: 'Aureolas o semitransparencias detectadas en contorno',
      description: 'Se detectaron píxeles de opacidad intermedia (alpha entre 15% y 85%) en los bordes. En DTF esto genera halo de poliamida blanca indeseado.',
      autoFixAvailable: true,
      autoFixAction: 'clean_alpha_choke'
    });
  } else {
    issues.push({
      id: 'transparency-pass',
      rule: 'transparency',
      severity: 'pass',
      title: 'Transparencia y canal alfa limpios',
      description: artwork.hasAlpha ? 'Fondo 100% transparente aislado correctamente.' : 'Gráfico sólido listo para encuadre.'
    });
  }

  // 5. Verificación de compatibilidad de formato con el RIP de la máquina
  if (!machine.supportedFormats.includes(config.exportFormat)) {
    issues.push({
      id: 'format-unsupported',
      rule: 'format',
      severity: 'error',
      title: `Formato ${config.exportFormat} no recomendado por ${machine.recommendedRip}`,
      description: `El flujo de trabajo óptimo para ${machine.name} admite: ${machine.supportedFormats.join(', ')}.`,
      recommendedValue: machine.supportedFormats[0],
      autoFixAvailable: true,
      autoFixAction: 'switch_to_recommended_format'
    });
  } else {
    issues.push({
      id: 'format-pass',
      rule: 'format',
      severity: 'pass',
      title: `Formato ${config.exportFormat} 100% compatible`,
      description: `Aceptado directamente por el motor RIP ${machine.recommendedRip}.`
    });
  }

  // 6. Verificación de Espejado (Mirroring)
  if (machine.requiresMirror && !config.mirrorHorizontal) {
    issues.push({
      id: 'mirror-missing',
      rule: 'out_of_bounds',
      severity: 'warning',
      title: 'Espejado horizontal desactivado para técnica transfer',
      description: `${machine.categoryLabel} requiere habitualmente que el arte esté espejado horizontalmente para que al planchar quede al derecho.`,
      recommendedValue: 'Activar espejado horizontal',
      autoFixAvailable: true,
      autoFixAction: 'enable_horizontal_mirror'
    });
  } else if (!machine.requiresMirror && config.mirrorHorizontal) {
    issues.push({
      id: 'mirror-unexpected',
      rule: 'out_of_bounds',
      severity: 'info',
      title: 'Espejado activo en técnica de impresión directa',
      description: `La máquina ${machine.name} no requiere espejado salvo que el diseño contenga tipografía invertida a propósito.`,
      autoFixAvailable: true,
      autoFixAction: 'disable_horizontal_mirror'
    });
  }

  // 7. Verificación de Base Blanca (White Underbase)
  if (machine.requiresWhiteUnderbase && config.separationMethod === 'none') {
    issues.push({
      id: 'underbase-notice',
      rule: 'color_space',
      severity: 'info',
      title: 'Recomendación: Configurar canal de tinta blanca',
      description: 'Para prendas oscuras en DTF/DTG/Serigrafía, active el canal de Base Blanca con choke de 2px para evitar descalces.',
      autoFixAvailable: true,
      autoFixAction: 'enable_white_underbase'
    });
  }

  return issues;
}

/**
 * Renderiza el arte con parámetros de pre-prensa sobre un canvas de alta fidelidad
 */
export async function renderPrepressCanvas(
  artworkImg: HTMLImageElement,
  config: PrintPreparationConfig,
  machine: PrePressMachine,
  targetCanvas: HTMLCanvasElement
): Promise<void> {
  const widthMm = convertToMm(config.width, config.unit, config.dpi);
  const heightMm = convertToMm(config.height, config.unit, config.dpi);

  // Dimensiones físicas en píxeles según el DPI seleccionado
  const pxWidth = Math.max(10, Math.round((widthMm / 25.4) * config.dpi));
  const pxHeight = Math.max(10, Math.round((heightMm / 25.4) * config.dpi));

  const bleedPx = Math.round((config.bleedMm / 25.4) * config.dpi);
  const marginPx = Math.round((config.marginMm / 25.4) * config.dpi);

  // Espacio extra para marcas de registro y slug técnico (si están activas)
  const slugSpacePx = config.showRegistrationMarks ? Math.max(60, Math.round((15 / 25.4) * config.dpi)) : 0;
  
  const totalCanvasWidth = pxWidth + (bleedPx * 2) + (slugSpacePx * 2);
  const totalCanvasHeight = pxHeight + (bleedPx * 2) + (slugSpacePx * 2);

  // Ajustar tamaño del canvas objetivo (limitado por seguridad si la resolución es extrema)
  const MAX_CANVAS_DIM = 4096;
  const scaleRatio = Math.min(1, MAX_CANVAS_DIM / Math.max(totalCanvasWidth, totalCanvasHeight));

  targetCanvas.width = Math.round(totalCanvasWidth * scaleRatio);
  targetCanvas.height = Math.round(totalCanvasHeight * scaleRatio);

  const ctx = targetCanvas.getContext('2d');
  if (!ctx) return;

  ctx.save();
  ctx.scale(scaleRatio, scaleRatio);
  ctx.clearRect(0, 0, totalCanvasWidth, totalCanvasHeight);

  // Si no hay transparencia, fondo blanco
  if (!config.transparencyEnabled) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, totalCanvasWidth, totalCanvasHeight);
  }

  const artOriginX = slugSpacePx + bleedPx;
  const artOriginY = slugSpacePx + bleedPx;

  // Dibujar el sangrado (bleed area background) si está activado
  if (config.bleedMm > 0 && config.showBleedAndMargins) {
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)'; // Rojo suave para el límite de sangrado
    ctx.lineWidth = 1 / scaleRatio;
    ctx.strokeRect(slugSpacePx, slugSpacePx, pxWidth + bleedPx * 2, pxHeight + bleedPx * 2);
  }

  // Dibujar el arte principal con transformaciones de espejado
  ctx.save();
  ctx.translate(artOriginX + pxWidth / 2, artOriginY + pxHeight / 2);

  const scaleX = config.mirrorHorizontal ? -1 : 1;
  const scaleY = config.mirrorVertical ? -1 : 1;
  ctx.scale(scaleX, scaleY);

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Si tiene sangrado, expandir ligeramente el arte para cubrir el sangrado
  const drawWidth = config.bleedMm > 0 ? pxWidth + (bleedPx * 2) : pxWidth;
  const drawHeight = config.bleedMm > 0 ? pxHeight + (bleedPx * 2) : pxHeight;

  ctx.drawImage(
    artworkImg,
    -drawWidth / 2,
    -drawHeight / 2,
    drawWidth,
    drawHeight
  );

  ctx.restore();

  // Guías visuales: Línea de corte (Trim box) y Línea de seguridad (Margin box)
  if (config.showBleedAndMargins) {
    // Línea de corte real (Trim Box) en azul cian
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.7)';
    ctx.lineWidth = 1.5 / scaleRatio;
    ctx.setLineDash([6 / scaleRatio, 4 / scaleRatio]);
    ctx.strokeRect(artOriginX, artOriginY, pxWidth, pxHeight);
    ctx.setLineDash([]);

    // Línea de seguridad (Safety Margin Box) en verde esmeralda
    if (marginPx > 0) {
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
      ctx.lineWidth = 1 / scaleRatio;
      ctx.strokeRect(
        artOriginX + marginPx,
        artOriginY + marginPx,
        Math.max(1, pxWidth - marginPx * 2),
        Math.max(1, pxHeight - marginPx * 2)
      );
    }
  }

  // Marcas de registro industriales micrométricas y cruces de calce
  if (config.showRegistrationMarks && slugSpacePx > 0) {
    drawRegistrationMarks(ctx, artOriginX, artOriginY, pxWidth, pxHeight, slugSpacePx / 2, scaleRatio);
  }

  // Barra de calibración de color (CMYK / Grayscale density wedge)
  if (config.showColorBars && slugSpacePx > 0) {
    drawColorCalibrationBars(ctx, artOriginX, artOriginY, pxWidth, pxHeight, slugSpacePx, scaleRatio);
  }

  // Slug técnico de pre-prensa
  drawTechnicalSlug(ctx, config, machine, artworkImg, totalCanvasWidth, totalCanvasHeight, scaleRatio);

  ctx.restore();
}

/**
 * Dibuja cruces de registro industriales micrométricas
 */
function drawRegistrationMarks(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  offset: number,
  scaleRatio: number
) {
  const points = [
    { x: x + w / 2, y: y - offset }, // Superior central
    { x: x + w / 2, y: y + h + offset }, // Inferior central
    { x: x - offset, y: y + h / 2 }, // Izquierda central
    { x: x + w + offset, y: y + h / 2 } // Derecha central
  ];

  ctx.strokeStyle = '#000000';
  ctx.fillStyle = '#000000';
  ctx.lineWidth = 1 / scaleRatio;

  points.forEach((pt) => {
    const radius = 10 / scaleRatio;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Cruz interna
    ctx.beginPath();
    ctx.moveTo(pt.x - radius * 1.6, pt.y);
    ctx.lineTo(pt.x + radius * 1.6, pt.y);
    ctx.moveTo(pt.x, pt.y - radius * 1.6);
    ctx.lineTo(pt.x, pt.y + radius * 1.6);
    ctx.stroke();

    // Cuadrantes rellenos para calce perfecto
    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y);
    ctx.arc(pt.x, pt.y, radius, 0, Math.PI / 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y);
    ctx.arc(pt.x, pt.y, radius, Math.PI, (3 * Math.PI) / 2);
    ctx.fill();
  });

  // Marcas de corte en las 4 esquinas (Crop marks)
  const cropLen = 14 / scaleRatio;
  const corners = [
    { x, y, dx: -1, dy: -1 },
    { x: x + w, y, dx: 1, dy: -1 },
    { x, y: y + h, dx: -1, dy: 1 },
    { x: x + w, y: y + h, dx: 1, dy: 1 }
  ];

  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1 / scaleRatio;
  corners.forEach((c) => {
    ctx.beginPath();
    ctx.moveTo(c.x, c.y + c.dy * 4 / scaleRatio);
    ctx.lineTo(c.x, c.y + c.dy * (4 + cropLen) / scaleRatio);
    ctx.moveTo(c.x + c.dx * 4 / scaleRatio, c.y);
    ctx.lineTo(c.x + c.dx * (4 + cropLen) / scaleRatio, c.y);
    ctx.stroke();
  });
}

/**
 * Dibuja barra de calibración y parches CMYK + grises
 */
function drawColorCalibrationBars(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  _h: number,
  _slugSpace: number,
  scaleRatio: number
) {
  const patches = [
    '#00FFFF', '#FF00FF', '#FFFF00', '#000000', // C, M, Y, K
    '#1e293b', '#64748b', '#94a3b8', '#cbd5e1', '#ffffff' // Escala de grises
  ];

  const patchWidth = Math.min(18 / scaleRatio, w / patches.length);
  const patchHeight = 8 / scaleRatio;
  const startX = x + (w - patches.length * patchWidth) / 2;
  const startY = y - 24 / scaleRatio;

  patches.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(startX + i * patchWidth, startY, patchWidth, patchHeight);
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 0.5 / scaleRatio;
    ctx.strokeRect(startX + i * patchWidth, startY, patchWidth, patchHeight);
  });
}

/**
 * Agrega información técnica de pre-impresión al pie del lienzo
 */
function drawTechnicalSlug(
  ctx: CanvasRenderingContext2D,
  config: PrintPreparationConfig,
  machine: PrePressMachine,
  _artworkImg: HTMLImageElement,
  totalWidth: number,
  totalHeight: number,
  scaleRatio: number
) {
  const widthMm = convertToMm(config.width, config.unit, config.dpi);
  const heightMm = convertToMm(config.height, config.unit, config.dpi);

  const text = `ESTAMPAPRO 360° PRE-PRESS | MÁQUINA: ${machine.name} | TAMAÑO: ${Math.round(widthMm)}x${Math.round(heightMm)}mm | DPI: ${config.dpi} | PERFIL: ${config.colorProfile} | ESPEJADO: ${config.mirrorHorizontal ? 'SÍ (H)' : 'NO'} | SANGRADO: ${config.bleedMm}mm`;

  ctx.fillStyle = '#64748b';
  ctx.font = `500 ${Math.max(9, Math.round(11 / scaleRatio))}px 'JetBrains Mono', monospace`;
  ctx.textAlign = 'center';
  ctx.fillText(text, totalWidth / 2, totalHeight - (8 / scaleRatio));
}

/**
 * Genera canales de separación de color (White Underbase con choke, CMYK, o Monocromo)
 */
export async function generateColorSeparations(
  artworkImg: HTMLImageElement,
  config: PrintPreparationConfig
): Promise<SeparationPlate[]> {
  const canvas = document.createElement('canvas');
  // Usar resolución de análisis optimizada
  const maxDim = 800;
  const ratio = Math.min(1, maxDim / Math.max(artworkImg.naturalWidth, artworkImg.naturalHeight));
  const w = Math.round(artworkImg.naturalWidth * ratio);
  const h = Math.round(artworkImg.naturalHeight * ratio);

  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];

  ctx.drawImage(artworkImg, 0, 0, w, h);
  const imgData = ctx.getImageData(0, 0, w, h);
  const pixels = imgData.data;
  const totalPixels = w * h;

  // 1. Canal Base Blanca (White Underbase) con choke/rebaje de 1-4 px
  const whiteCanvas = document.createElement('canvas');
  whiteCanvas.width = w;
  whiteCanvas.height = h;
  const whiteCtx = whiteCanvas.getContext('2d');
  const whiteImgData = whiteCtx ? whiteCtx.createImageData(w, h) : null;

  let whitePixelCount = 0;
  let cyanDensitySum = 0;
  let magentaDensitySum = 0;
  let yellowDensitySum = 0;
  let blackDensitySum = 0;

  // Matrices para Cyan, Magenta, Yellow, Black
  const cyanCanvas = document.createElement('canvas');
  cyanCanvas.width = w;
  cyanCanvas.height = h;
  const cyanCtx = cyanCanvas.getContext('2d');
  const cyanImgData = cyanCtx?.createImageData(w, h);

  const magentaCanvas = document.createElement('canvas');
  magentaCanvas.width = w;
  magentaCanvas.height = h;
  const magCtx = magentaCanvas.getContext('2d');
  const magImgData = magCtx?.createImageData(w, h);

  const yellowCanvas = document.createElement('canvas');
  yellowCanvas.width = w;
  yellowCanvas.height = h;
  const yelCtx = yellowCanvas.getContext('2d');
  const yelImgData = yelCtx?.createImageData(w, h);

  const blackCanvas = document.createElement('canvas');
  blackCanvas.width = w;
  blackCanvas.height = h;
  const kCtx = blackCanvas.getContext('2d');
  const kImgData = kCtx?.createImageData(w, h);

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];

    if (a > 20) {
      whitePixelCount++;
      // RGB a CMYK aproximación para separación textil
      const rNorm = r / 255;
      const gNorm = g / 255;
      const bNorm = b / 255;
      const k = 1 - Math.max(rNorm, gNorm, bNorm);
      const c = k < 1 ? (1 - rNorm - k) / (1 - k) : 0;
      const m = k < 1 ? (1 - gNorm - k) / (1 - k) : 0;
      const y = k < 1 ? (1 - bNorm - k) / (1 - k) : 0;

      cyanDensitySum += c;
      magentaDensitySum += m;
      yellowDensitySum += y;
      blackDensitySum += k;

      // Base blanca (sólida con opacidad)
      if (whiteImgData) {
        whiteImgData.data[i] = 255;
        whiteImgData.data[i + 1] = 255;
        whiteImgData.data[i + 2] = 255;
        whiteImgData.data[i + 3] = Math.round(a * (config.whiteUnderbaseDensity / 100));
      }

      // Cyan
      if (cyanImgData) {
        cyanImgData.data[i] = 0;
        cyanImgData.data[i + 1] = 160;
        cyanImgData.data[i + 2] = 230;
        cyanImgData.data[i + 3] = Math.round(c * 255 * (a / 255));
      }

      // Magenta
      if (magImgData) {
        magImgData.data[i] = 230;
        magImgData.data[i + 1] = 0;
        magImgData.data[i + 2] = 130;
        magImgData.data[i + 3] = Math.round(m * 255 * (a / 255));
      }

      // Yellow
      if (yelImgData) {
        yelImgData.data[i] = 255;
        yelImgData.data[i + 1] = 220;
        yelImgData.data[i + 2] = 0;
        yelImgData.data[i + 3] = Math.round(y * 255 * (a / 255));
      }

      // Black
      if (kImgData) {
        kImgData.data[i] = 20;
        kImgData.data[i + 1] = 20;
        kImgData.data[i + 2] = 20;
        kImgData.data[i + 3] = Math.round(k * 255 * (a / 255));
      }
    }
  }

  // Aplicar choke (rebaje perimetral) a la base blanca
  if (whiteImgData && config.whiteUnderbaseChokePx > 0) {
    applyChokeToAlpha(whiteImgData, w, h, config.whiteUnderbaseChokePx);
  }

  if (whiteCtx && whiteImgData) whiteCtx.putImageData(whiteImgData, 0, 0);
  if (cyanCtx && cyanImgData) cyanCtx.putImageData(cyanImgData, 0, 0);
  if (magCtx && magImgData) magCtx.putImageData(magImgData, 0, 0);
  if (yelCtx && yelImgData) yelCtx.putImageData(yelImgData, 0, 0);
  if (kCtx && kImgData) kCtx.putImageData(kImgData, 0, 0);

  const whiteCoverage = totalPixels > 0 ? Math.round((whitePixelCount / totalPixels) * 100) : 0;
  const cyanCoverage = totalPixels > 0 ? Math.round((cyanDensitySum / totalPixels) * 100) : 0;
  const magCoverage = totalPixels > 0 ? Math.round((magentaDensitySum / totalPixels) * 100) : 0;
  const yelCoverage = totalPixels > 0 ? Math.round((yellowDensitySum / totalPixels) * 100) : 0;
  const kCoverage = totalPixels > 0 ? Math.round((blackDensitySum / totalPixels) * 100) : 0;

  const plates: SeparationPlate[] = [
    {
      id: 'plate-white',
      name: `Base Blanca (Underbase ${config.whiteUnderbaseChokePx}px Choke)`,
      channelKey: 'white',
      colorHex: '#ffffff',
      coveragePercent: whiteCoverage,
      canvasDataUrl: whiteCanvas.toDataURL('image/png'),
      invertFotolito: false
    },
    {
      id: 'plate-cyan',
      name: 'Cyan (C)',
      channelKey: 'cyan',
      colorHex: '#00a0e6',
      coveragePercent: cyanCoverage,
      canvasDataUrl: cyanCanvas.toDataURL('image/png'),
      invertFotolito: false
    },
    {
      id: 'plate-magenta',
      name: 'Magenta (M)',
      channelKey: 'magenta',
      colorHex: '#e60082',
      coveragePercent: magCoverage,
      canvasDataUrl: magentaCanvas.toDataURL('image/png'),
      invertFotolito: false
    },
    {
      id: 'plate-yellow',
      name: 'Amarillo (Y)',
      channelKey: 'yellow',
      colorHex: '#ffdc00',
      coveragePercent: yelCoverage,
      canvasDataUrl: yellowCanvas.toDataURL('image/png'),
      invertFotolito: false
    },
    {
      id: 'plate-black',
      name: 'Negro (K)',
      channelKey: 'black',
      colorHex: '#141414',
      coveragePercent: kCoverage,
      canvasDataUrl: blackCanvas.toDataURL('image/png'),
      invertFotolito: false
    }
  ];

  return plates;
}

/**
 * Algoritmo morfológico de erosión / choke para la máscara alpha
 */
function applyChokeToAlpha(imgData: ImageData, width: number, height: number, chokePx: number) {
  const originalAlpha = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i++) {
    originalAlpha[i] = imgData.data[i * 4 + 3];
  }

  const radius = Math.min(chokePx, 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (originalAlpha[idx] === 0) continue;

      let minA = originalAlpha[idx];
      // Inspeccionar vecindario
      for (let dy = -radius; dy <= radius; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) continue;
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= width) continue;
          if (dx * dx + dy * dy <= radius * radius) {
            const neighborA = originalAlpha[ny * width + nx];
            if (neighborA < minA) {
              minA = neighborA;
            }
          }
        }
      }

      imgData.data[idx * 4 + 3] = minA;
    }
  }
}

/**
 * Descarga de archivo generado en el formato seleccionado
 */
export function downloadFile(dataUrlOrBlob: string | Blob, filename: string) {
  const link = document.createElement('a');
  if (typeof dataUrlOrBlob === 'string') {
    link.href = dataUrlOrBlob;
  } else {
    link.href = URL.createObjectURL(dataUrlOrBlob);
  }
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Genera exportación en formato SVG con capas de corte, marcas y diseño
 */
export function generateSvgExport(
  artworkImg: HTMLImageElement,
  config: PrintPreparationConfig,
  machine: PrePressMachine
): string {
  const widthMm = convertToMm(config.width, config.unit, config.dpi);
  const heightMm = convertToMm(config.height, config.unit, config.dpi);
  const totalW = widthMm + config.bleedMm * 2;
  const totalH = heightMm + config.bleedMm * 2;

  const mirrorTransform = config.mirrorHorizontal
    ? `transform="scale(-1, 1) translate(${-totalW}, 0)"`
    : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     viewBox="0 0 ${totalW} ${totalH}" width="${totalW}mm" height="${totalH}mm">
  <desc>ESTAMPAPRO 360° | Máquina: ${machine.name} | RIP: ${machine.recommendedRip}</desc>
  <!-- Capa 1: Guías y Líneas de Sangrado -->
  <g id="Bleed_Box" stroke="#ef4444" stroke-width="0.2" fill="none">
    <rect x="0" y="0" width="${totalW}" height="${totalH}" />
  </g>
  <!-- Capa 2: Línea de Corte (Trim Box) -->
  <g id="Trim_Cutline" stroke="#06b6d4" stroke-width="0.25" stroke-dasharray="2,2" fill="none">
    <rect x="${config.bleedMm}" y="${config.bleedMm}" width="${widthMm}" height="${heightMm}" />
  </g>
  <!-- Capa 3: Diseño Gráfico Raster/Vectorial -->
  <g id="Artwork_Layer" ${mirrorTransform}>
    <image x="${config.bleedMm}" y="${config.bleedMm}" width="${widthMm}" height="${heightMm}"
           xlink:href="${artworkImg.src}" />
  </g>
</svg>`;
}

/**
 * Genera un PDF estructurado de producción con encabezados estándar PDF-1.4
 */
export function generatePdfExport(
  canvas: HTMLCanvasElement,
  config: PrintPreparationConfig,
  machine: PrePressMachine
): Blob {
  const widthMm = convertToMm(config.width, config.unit, config.dpi);
  const heightMm = convertToMm(config.height, config.unit, config.dpi);
  // Puntos tipográficos estándar (72 pt por pulgada)
  const ptWidth = Math.round((widthMm / 25.4) * 72);
  const ptHeight = Math.round((heightMm / 25.4) * 72);

  const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
  const base64Data = dataUrl.split(',')[1];
  const binaryImg = atob(base64Data);
  const imgLen = binaryImg.length;

  const title = `ESTAMPAPRO_PREPRESS_${machine.category.toUpperCase()}`;
  
  // Construcción de PDF básico válido autónomo
  const pdfHeader = `%PDF-1.4\n%âãÏÓ\n`;
  const obj1 = `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`;
  const obj2 = `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`;
  const obj3 = `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${ptWidth} ${ptHeight}] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`;
  const obj4Header = `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgLen} >>\nstream\n`;
  const obj4Footer = `\nendstream\nendobj\n`;
  const contentStream = `q\n${ptWidth} 0 0 ${ptHeight} 0 0 cm\n/Im1 Do\nQ\n`;
  const obj5 = `5 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}endstream\nendobj\n`;
  const obj6 = `6 0 obj\n<< /Title (${title}) /Creator (ESTAMPAPRO 360 Studio) /Producer (Prepress Engine) >>\nendobj\n`;

  // Compilar blobs
  const parts: BlobPart[] = [
    pdfHeader,
    obj1,
    obj2,
    obj3,
    obj4Header
  ];

  const imgBytes = new Uint8Array(imgLen);
  for (let i = 0; i < imgLen; i++) {
    imgBytes[i] = binaryImg.charCodeAt(i);
  }
  parts.push(imgBytes.buffer as ArrayBuffer);
  parts.push(obj4Footer);
  parts.push(obj5);
  parts.push(obj6);

  return new Blob(parts, { type: 'application/pdf' });
}
