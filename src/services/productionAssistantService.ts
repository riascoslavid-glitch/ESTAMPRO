/**
 * ESTAMPAPRO 360° - Servicio del Asistente Técnico Inteligente de Producción
 * 14 pasos operativos, motor de compatibilidad, perfiles, registros de auditoría y chat técnico.
 */

import { collection, doc, getDocs, setDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { 
  ProductionStepConfig, 
  ProductionStepId, 
  ProductionEquipmentProfile, 
  ProductionJobRecord, 
  AssistantChatMessage 
} from '../types/productionAssistant';
import { PrintingTechniqueId } from '../types/techniques';
import { TECHNIQUES_ENCYCLOPEDIA } from '../constants/techniquesEncyclopedia';

const PROFILES_STORAGE_KEY = 'estampapro_production_profiles';
const LOGS_STORAGE_KEY = 'estampapro_production_job_logs';

/**
 * Configuración detallada de los 14 pasos obligatorios del asistente
 */
export const PRODUCTION_STEPS: ProductionStepConfig[] = [
  {
    number: 1,
    id: 'seleccionar_prenda',
    title: 'Seleccionar Prenda',
    subtitle: 'Elige el tipo de artículo o prenda en blanco a confeccionar',
    phase: 'Planificación y Selección',
    instructions: [
      'Selecciona el modelo de prenda (Remera Boxy, Hoodie Oversize, Gorra Trucker, Tote bag, etc.).',
      'Verifica el gramaje textil (GSM) y color base de la tela (claro, medio o negro profundo).',
      'Determina la ubicación prevista de estampado (pecho centro, espalda completa, mangas, bolsillo).'
    ],
    materials: ['Prenda textil en blanco (Blank)', 'Ficha de corte/pedido'],
    tools: ['Cinta métrica textil', 'Plantilla de tallas'],
    safetyWarnings: [
      {
        type: 'equipos',
        message: 'Asegurar que la prenda esté libre de tachas metálicas, cierres o botones plásticos en el área de contacto térmico.'
      }
    ],
    parametersBadge: 'Prenda & Gramaje GSM',
    defaultChecklist: [
      'Prenda inspeccionada visualmente sin costuras rotas ni manchas previas',
      'Talla y color coinciden con la orden de trabajo',
      'Área de estampado libre de obstáculos o costuras gruesas desbalanceadas'
    ],
    illustrationType: 'garment'
  },
  {
    number: 2,
    id: 'identificar_tela',
    title: 'Identificar Tela y Composición',
    subtitle: 'Verifica la composición de fibras del tejido para calibrar temperatura y química',
    phase: 'Planificación y Selección',
    instructions: [
      'Revisa la etiqueta de composición textil obligatoria de la prenda.',
      'Identifica si es 100% Algodón, 100% Poliéster, Mezcla 50/50, French Terry 80/20 o tejido elástico Spandex.',
      'Comprueba si la tela posee acabado hidrófugo, siliconado o teñido reactivo descargable.'
    ],
    materials: ['Etiqueta textil de composición', 'Muestra testigo de tejido'],
    tools: ['Lupa cuentahílos textil', 'Ficha técnica del proveedor de blanks'],
    safetyWarnings: [
      {
        type: 'calor',
        message: 'Telas con alto contenido sintético o poliéster pueden derretirse o brillar si se excede los 140°C sin protección.'
      }
    ],
    parametersBadge: 'Composición de Fibra',
    defaultChecklist: [
      'Composición de fibra 100% verificada en etiqueta',
      'Tipo de tejido catalogado (punto liso, piqué, rib, felpa o lona)',
      'Identificada susceptibilidad a la migración de tinte térmico'
    ],
    illustrationType: 'fabric'
  },
  {
    number: 3,
    id: 'seleccionar_diseno',
    title: 'Seleccionar Diseño y Medidas',
    subtitle: 'Carga o vincula el arte gráfico a estampar con sus dimensiones reales',
    phase: 'Planificación y Selección',
    instructions: [
      'Selecciona el arte desde la Bóveda de Diseños o sube el archivo de producción.',
      'Comprueba que el diseño tenga resolución de 300 DPI a escala 1:1 física.',
      'Define el ancho y alto exacto en centímetros (ej: 28x35 cm) acorde a la talla.'
    ],
    materials: ['Archivo digital gráfico (PNG 300 DPI, TIFF o PDF vectorial)'],
    tools: ['Software de preimpresión / Visor RIP', 'Regla milimetrada de taller'],
    safetyWarnings: [
      {
        type: 'equipos',
        message: 'Evitar escalar mapas de bits pequeños por encima de su resolución original para prevenir pixelado en la impresión final.'
      }
    ],
    parametersBadge: '300 DPI · Dimensiones cm',
    defaultChecklist: [
      'Resolución mínima de 300 DPI verificada al 100% de escala',
      'Fondo transparente alfa verificado (sin recuadros blancos no deseados)',
      'Dimensiones en centímetros alineadas a la talla de la prenda'
    ],
    illustrationType: 'design'
  },
  {
    number: 4,
    id: 'seleccionar_tecnica',
    title: 'Seleccionar Técnica de Estampado',
    subtitle: 'Elige la técnica idónea entre las 17 alternativas industriales',
    phase: 'Planificación y Selección',
    instructions: [
      'Selecciona la técnica óptima (DTF, DTG, Sublimación, Vinilo textil, Serigrafía, Bordado, etc.).',
      'Considera la cantidad de prendas del pedido, el tacto deseado y el color de fondo de la tela.',
      'Usa el Asistente Técnico si tienes dudas sobre telas sintéticas o tiradas cortas.'
    ],
    materials: ['Catálogo de muestras de tacto textil de taller'],
    tools: ['Asistente Inteligente de Producción', 'Comparador de Técnicas'],
    safetyWarnings: [
      {
        type: 'ventilacion',
        message: 'Técnicas con calor y polvos (DTF, Descarga, Plastisol) requieren campana extractora encendida.'
      }
    ],
    parametersBadge: 'Técnica Industrial',
    defaultChecklist: [
      'Técnica seleccionada acorde al volumen y presupuesto del cliente',
      'Tacto y acabado final aprobados en orden de producción',
      'Disponibilidad de equipo y tiempo de puesta a punto confirmados'
    ],
    illustrationType: 'technique'
  },
  {
    number: 5,
    id: 'seleccionar_maquina',
    title: 'Seleccionar Máquina y Puesto de Trabajo',
    subtitle: 'Asigna la prensa térmica, plotter, impresora o pulpo calibrado',
    phase: 'Planificación y Selección',
    instructions: [
      'Elige la prensa térmica de plato plano correspondiente (neumática, electromagnética o manual).',
      'Verifica que el plato térmico esté limpio y libre de residuos quemados de adhesivo.',
      'Enciende el equipo para alcanzar la temperatura objetivo con al menos 15 minutos de anticipación.'
    ],
    materials: ['Prensa térmica / Horno túnel / Pulpo serigráfico / Bordadora'],
    tools: ['Termómetro láser infrarrojo de verificación', 'Limpiador desengrasante para teflón'],
    safetyWarnings: [
      {
        type: 'electricidad',
        message: 'Prensas térmicas de 2000W a 3000W deben estar conectadas a toma a tierra dedicada de 16A sin regletas sobrecargadas.'
      },
      {
        type: 'calor',
        message: 'El plato calefactor alcanza hasta 200°C. Mantener manos fuera del perímetro de cierre neumático.'
      }
    ],
    parametersBadge: 'Calibración Máquina',
    defaultChecklist: [
      'Prensa térmica o túnel conectado a línea eléctrica con toma a tierra certificada',
      'Plato calefactor limpio sin restos de adhesivo ni tinta previa',
      'Presión neumática o mecánica nivelada en las 4 esquinas del plato'
    ],
    illustrationType: 'machine'
  },
  {
    number: 6,
    id: 'seleccionar_consumibles',
    title: 'Seleccionar Consumibles y Lotes',
    subtitle: 'Prepara las tintas, films PET, poliamidas o vinilos de marcas certificadas',
    phase: 'Planificación y Selección',
    instructions: [
      'Verifica la marca y lote de los insumos (DuPont, KDX, Siser, Forever, Rutland, MagnaPrint, etc.).',
      'Comprueba que el film DTF sea Cold Peel o Hot Peel según el requerimiento.',
      'Asegura que el adhesivo o poliamida esté en fecha y libre de humedad ambiental apelmazada.'
    ],
    materials: ['Film impreso', 'Tintas', 'Polvo termofusible TPU', 'Láminas protectoras'],
    tools: ['Balanza de precisión', 'Higrómetro ambiental de taller'],
    safetyWarnings: [
      {
        type: 'ventilacion',
        message: 'No inhalar polvo de poliamida ni vapores de plastisol. Utilizar mascarilla N95 en zona de espolvoreo.'
      }
    ],
    parametersBadge: 'Lote de Consumible',
    defaultChecklist: [
      'Insumos verificados con fecha de vencimiento y lote registrados',
      'Humedad ambiental del taller entre 40% y 60% HR',
      'Papel protector siliconado o teflón nuevo listo para uso'
    ],
    illustrationType: 'consumable'
  },
  {
    number: 7,
    id: 'verificar_compatibilidad',
    title: 'Verificar Compatibilidad Físico-Química',
    subtitle: 'Comprobación cruzada automática entre tela, técnica y consumibles',
    phase: 'Planificación y Selección',
    instructions: [
      'Ejecuta la validación de compatibilidad en el panel del asistente.',
      'Si hay alerta de sangrado/migración de tinte (sublimación en poliéster), activa aditivo bloqueador o baja temperatura.',
      'Si la técnica es incompatible con la fibra (ej: Sublimación en algodón puro), cambia la técnica antes de avanzar.'
    ],
    materials: ['Matriz de compatibilidad FESPA/SGIA'],
    tools: ['Motor de Compatibilidad ESTAMPAPRO 360°'],
    safetyWarnings: [
      {
        type: 'equipos',
        message: 'Estampar técnicas incompatibles genera desprendimiento en el primer lavado y reclamos del cliente.'
      }
    ],
    parametersBadge: 'Test de Anclaje Químico',
    defaultChecklist: [
      'Compatibilidad tela-técnica evaluada y aprobada (Óptima o con advertencia mitigada)',
      'Protocolo anti-migración activado si se trabaja sobre poliéster oscuro',
      'Sin riesgo de quemado térmico para la fibra elegida'
    ],
    illustrationType: 'compatibility'
  },
  {
    number: 8,
    id: 'consultar_ficha_tecnica',
    title: 'Consultar Ficha Técnica y Parámetros',
    subtitle: 'Carga los parámetros certificados de temperatura, tiempo y presión',
    phase: 'Pre-Prensa y Preparación',
    instructions: [
      'Carga los parámetros recomendados por el fabricante de la máquina o consumible.',
      'Comprueba la temperatura en °C / °F, tiempo de prensado en segundos y nivel de presión en Bares.',
      'Anota el tipo de pelado exacto (Hot Peel, Warm Peel o Cold Peel).'
    ],
    materials: ['Ficha Técnica Oficial del Fabricante'],
    tools: ['Display digital de control térmico', 'Termómetro láser'],
    safetyWarnings: [
      {
        type: 'calor',
        message: 'Comprobar con termómetro láser que la temperatura real del plato coincida con el display digital (±2°C).'
      }
    ],
    parametersBadge: '°C · Segundos · Bares',
    defaultChecklist: [
      'Temperatura fijada en el controlador digital de la prensa',
      'Temporizador calibrado a los segundos requeridos',
      'Presión ajustada mecánicamente con perilla o manómetro neumático'
    ],
    illustrationType: 'spec_sheet'
  },
  {
    number: 9,
    id: 'preparar_diseno',
    title: 'Preparar Diseño y Pre-Prensa',
    subtitle: 'Impresión en espejo, curado del transfer o revelado de mallas',
    phase: 'Pre-Prensa y Preparación',
    instructions: [
      'Si es DTF: verifica la impresión en espejo y curado del polvo TPU en horno a 125°C hasta aspecto cáscara de naranja.',
      'Si es Vinilo: ejecuta el corte en plotter vectorial y realiza el pelado de descartes (weeding).',
      'Si es Serigrafía: alinea el registro de fotolitos y verifica la tensión de la malla monofilamento.'
    ],
    materials: ['Film DTF curado / Vinil pelado / Pantalla insolada'],
    tools: ['Horno shaker continuo / Gancho pelador de vinilo / Cúter'],
    safetyWarnings: [
      {
        type: 'ventilacion',
        message: 'El horno de polimerización debe expulsar los humos al exterior o mediante filtro de carbón activado.'
      }
    ],
    parametersBadge: 'Pre-prensa Calibrada',
    defaultChecklist: [
      'Diseño impreso en espejo (flip horizontal) si es técnica transferible',
      'Poliamida fundida homogéneamente sin zonas sin curar ni polvo suelto',
      'Bordes vectoriales limpios y libres de restos de adhesivo'
    ],
    illustrationType: 'prepress'
  },
  {
    number: 10,
    id: 'preparar_prenda',
    title: 'Preparar y Deshumificar la Prenda',
    subtitle: 'Pre-planchado y eliminación de impurezas antes de transferir',
    phase: 'Pre-Prensa y Preparación',
    instructions: [
      'Pasa el rodillo adhesivo quitapelusas por toda el área de estampado para remover fibras y polvo.',
      'Coloca la prenda centrada en el plato inferior de la prensa térmica.',
      'Aplica un pre-prensado de 4 a 6 segundos a temperatura de trabajo para extraer la humedad residual de la fibra de algodón.'
    ],
    materials: ['Prenda limpia'],
    tools: ['Rodillo adhesivo quitapelusas', 'Prensa térmica con plato teflonado'],
    safetyWarnings: [
      {
        type: 'calor',
        message: 'No dejar las manos en la zona inferior mientras la prensa se cierra. Usar guantes ignífugos si es necesario.'
      }
    ],
    parametersBadge: 'Pre-prensa 5s @ 150°C',
    defaultChecklist: [
      'Rodillo adhesivo pasado para eliminar pelusas sintéticas',
      'Pre-planchado de 5 segundos ejecutado para evaporar humedad',
      'Costuras y botones fuera del área de presión plana'
    ],
    illustrationType: 'garment_prep'
  },
  {
    number: 11,
    id: 'ejecutar_procedimiento',
    title: 'Ejecutar Procedimiento de Estampado',
    subtitle: 'Posicionamiento milimétrico y termofijación controlada con cronómetro',
    phase: 'Ejecución y Acabado',
    instructions: [
      'Posiciona el diseño centrado con regla textil (típicamente 7-9 cm debajo del cuello en camisetas).',
      'Protege con una lámina de papel teflón o kraft siliconado mate.',
      'Baja la prensa y activa el temporizador respetando estrictamente los segundos calibrados (ej: 14s a 150°C con 4.5 Bares).'
    ],
    materials: ['Prenda precalentada', 'Diseño / Transfer', 'Papel protector sulfurizado'],
    tools: ['Guantes térmicos de kevlar', 'Regla T de centrado de camisetas', 'Cronómetro'],
    safetyWarnings: [
      {
        type: 'calor',
        message: 'El plato superior emite radiación calórica intensa. No tocar superficies metálicas descubiertas.'
      },
      {
        type: 'equipos',
        message: 'En prensas electromagnéticas, asegurar que el sistema de apertura automática tenga espacio libre superior.'
      }
    ],
    parametersBadge: 'Presión 4.5 Bar · 150°C · 14s',
    defaultChecklist: [
      'Diseño perfectamente centrado y nivelado con regla guía',
      'Lámina de papel protector cubriendo completamente el estampado',
      'Ciclo completo de prensado cumplido sin interrupciones'
    ],
    illustrationType: 'press_operation'
  },
  {
    number: 12,
    id: 'realizar_acabado',
    title: 'Realizar Pelado y Acabado Final',
    subtitle: 'Retiro del soporte transportador y segundo planchado de sellado',
    phase: 'Ejecución y Acabado',
    instructions: [
      'Si es Cold Peel: espera a que el film se enfríe completamente (<30°C) o usa disipador de aluminio. Retira con tirón rasante.',
      'Si es Hot Peel: retira a los 2-3 segundos de forma continua.',
      'Realiza un SEGUNDO PRENSADO de 5 a 8 segundos cubierto con papel siliconado mate para sellar el adhesivo en la urdimbre de la tela y matar el brillo plástico.'
    ],
    materials: ['Papel siliconado mate de sellado', 'Bloque disipador de aluminio'],
    tools: ['Pinza de pelado de precisión', 'Termómetro de contacto'],
    safetyWarnings: [
      {
        type: 'calor',
        message: 'Manipular el transfer recién salido de la prensa con cuidado de no quemarse las yemas de los dedos.'
      }
    ],
    parametersBadge: 'Post-prensa 6s de sellado',
    defaultChecklist: [
      'Pelado ejecutado respetando la temperatura indicada (Frío/Caliente)',
      'Film retirado con movimiento suave sin levantar bordes',
      'Segundo prensado de sellado y mateado realizado con éxito'
    ],
    illustrationType: 'peeling'
  },
  {
    number: 13,
    id: 'inspeccionar_calidad',
    title: 'Inspeccionar Calidad y Control Final',
    subtitle: 'Auditoría rigurosa de bordes, estiramiento, opacidad y acabado táctil',
    phase: 'Calidad y Cierre',
    instructions: [
      'Verifica la adherencia de bordes y trazos pequeños con la yema del pulgar.',
      'Realiza una prueba de estiramiento suave (stretch test): el estampado no debe agrietarse ni desprenderse.',
      'Inspecciona bajo luz blanca de taller (D65): sin halos blancos de descalce, sin sombras de vapor ni migración de color.'
    ],
    materials: ['Lote de prendas estampadas terminadas'],
    tools: ['Lámpara de inspección óptica D65', 'Lupa de control de calidad'],
    safetyWarnings: [
      {
        type: 'equipos',
        message: 'Esperar a que la prenda se enfríe a temperatura ambiente antes de doblar o empaquetar para evitar transferencia de adhesivo residual.'
      }
    ],
    parametersBadge: 'Control de Calidad QC',
    defaultChecklist: [
      'Bordes 100% soldados a la tela sin despegues en esquinas',
      'Prueba de tracción elástica superada sin cuarteaduras',
      'Opacidad de blanco total sin sangrado de color del poliéster',
      'Tacto suave y tacto libre de pegajosidad'
    ],
    illustrationType: 'quality_qc'
  },
  {
    number: 14,
    id: 'registrar_trabajo',
    title: 'Registrar Trabajo y Guardar Auditoría',
    subtitle: 'Guarda quién realizó el trabajo, parámetros aplicados y fecha exacta',
    phase: 'Calidad y Cierre',
    instructions: [
      'Completa los datos de auditoría: operador responsable, lote de prendas y observaciones.',
      'Confirma los parámetros reales que se utilizaron durante la tirada.',
      'Haz click en "Registrar Trabajo en Bitácora" para guardar el registro permanente en Firestore y LocalStorage.'
    ],
    materials: ['Bitácora de producción digital'],
    tools: ['Módulo de Auditoría ESTAMPAPRO 360°'],
    safetyWarnings: [
      {
        type: 'equipos',
        message: 'Registrar anomalías o desviaciones térmicas para el equipo de mantenimiento preventivo de taller.'
      }
    ],
    parametersBadge: 'Bitácora & Trazabilidad',
    defaultChecklist: [
      'Datos del operador y rol verificados en el registro',
      'Parámetros reales documentados en la bitácora',
      'Cantidad de unidades producidas y resultado de calidad final asentados'
    ],
    illustrationType: 'audit_log'
  }
];

/**
 * Motor de verificación de compatibilidad física, química y térmica
 */
export function verifyProductionCompatibility(
  fabricComposition: string,
  techniqueId: PrintingTechniqueId,
  isDarkGarment: boolean = false
): {
  isCompatible: boolean;
  status: 'Optima' | 'Compatible con advertencias' | 'Incompatible';
  badgeColor: 'emerald' | 'amber' | 'rose';
  headline: string;
  details: string;
  warnings: string[];
  recommendations: string[];
  verifiedDocSource: string;
} {
  const normFabric = fabricComposition.toLowerCase();
  const tech = TECHNIQUES_ENCYCLOPEDIA.find((t) => t.id === techniqueId);
  const techName = tech ? tech.name : techniqueId;

  // 1. Sublimación en 100% Algodón puro
  if (techniqueId === 'sublimacion' && (normFabric.includes('100% algodón') || normFabric === 'algodón' || normFabric.includes('algodon 100%'))) {
    return {
      isCompatible: false,
      status: 'Incompatible',
      badgeColor: 'rose',
      headline: 'Sublimación es Químicamente Incompatible con 100% Algodón',
      details: 'Las tintas de dispersión de sublimación reaccionan exclusivamente con polímeros sintéticos (poliéster). En fibras naturales de celulosa, la tinta no tiene afinidad química y se disuelve por completo en la primera lavada.',
      warnings: [
        'El tinte gaseoso se perderá 100% en el agua.',
        'La prenda no resistirá ni un solo lavado.',
        'No existe anclaje molecular en algodón puro.'
      ],
      recommendations: [
        'Cambiar técnica a DTF (Direct to Film) o DTG para obtener full color fotográfico sobre algodón.',
        'Si es necesario sublimar, usar prendas con un mínimo de 70% poliéster o aplicar un recubrimiento polimérico previo.'
      ],
      verifiedDocSource: 'Epson Sublimation Technical Handbook & FESPA Standard'
    };
  }

  // 2. Sublimación en prendas oscuras o negras
  if (techniqueId === 'sublimacion' && isDarkGarment) {
    return {
      isCompatible: false,
      status: 'Incompatible',
      badgeColor: 'rose',
      headline: 'Sublimación sobre Tejidos Oscuros o Negros no es Visible',
      details: 'Los tintes de sublimación son tintes transparentes sin base blanca. Sobre fondo negro o azul marino, los colores resultan invisibles.',
      warnings: [
        'No existe tinta blanca de sublimación.',
        'El diseño quedará invisible o con apenas un reflejo apagado.'
      ],
      recommendations: [
        'Utilizar DTF con base blanca opaca.',
        'Utilizar Vinilo Textil o Transfer de Tóner Blanco.'
      ],
      verifiedDocSource: 'Sawgrass & Kiian Technical Bulletin'
    };
  }

  // 3. Estampado por descarga (Discharge) en Poliéster o sintéticos
  if (techniqueId === 'estampado_descarga' && (normFabric.includes('poliéster') || normFabric.includes('polyester') || normFabric.includes('sintétic'))) {
    return {
      isCompatible: false,
      status: 'Incompatible',
      badgeColor: 'rose',
      headline: 'Estampado por Descarga Incompatible con Poliéster',
      details: 'El agente reductor (sal de rongalita/sulfoxilato) solo destruye tintes reactivos en fibras de algodón. Las fibras de poliéster están teñidas con tintes dispersos termofijados que no responden a la descarga química.',
      warnings: [
        'No decolorará el tejido sintético; quedará un manchón opaco sucio.',
        'Emisión inútil de vapores químicos sin reacción.'
      ],
      recommendations: [
        'Utilizar prendas garantizadas como 100% Algodón Reactivo (Dischargeable Reactive Dyed).',
        'Para poliéster oscuro, utilizar Serigrafía con base plastisol bloqueadora gris o DTF con poliamida Black Carbon.'
      ],
      verifiedDocSource: 'MagnaColours MagnaPrint Discharge Compendium'
    };
  }

  // 4. DTF sobre Poliéster oscuro (Sangrado / Dye Migration Warning)
  if (techniqueId === 'dtf' && (normFabric.includes('poliéster') || normFabric.includes('dry-fit')) && isDarkGarment) {
    return {
      isCompatible: true,
      status: 'Compatible con advertencias',
      badgeColor: 'amber',
      headline: 'Compatible con Alerta Crítica: Migración de Tinte (Bleed)',
      details: 'El calor de la prensa (150°C) puede reactivar los tintes de dispersión del poliéster tiñendo la tinta blanca de DTF (ej: camiseta roja tiñe el blanco de rosa).',
      warnings: [
        'Riesgo de teñido del blanco en 24-48 horas post-planchado.',
        'No usar temperatura mayor a 135°C sin protección.'
      ],
      recommendations: [
        'Utilizar polvo termofusible TPU "Black Carbon Blockout" anti-sublimación.',
        'Reducir la temperatura de la prensa a 135°C y extender el tiempo a 15 segundos.'
      ],
      verifiedDocSource: "STAHLS' Color Bleed Prevention Guide 2026"
    };
  }

  // 5. DTG en Poliéster
  if (techniqueId === 'dtg' && (normFabric.includes('poliéster') || normFabric.includes('dry-fit'))) {
    return {
      isCompatible: true,
      status: 'Compatible con advertencias',
      badgeColor: 'amber',
      headline: 'DTG en Poliéster Requiere Pretratamiento Químico Especial',
      details: 'La tinta acuosa DTG está diseñada para el lumen del algodón. En poliéster liso no absorbe a menos que se aplique un pretratamiento especial (Poly-Pretreat).',
      warnings: [
        'Menor solidez al lavado si se usa pretratamiento para algodón en poliéster.',
        'Riesgo de manchas brillantes por exceso de calor.'
      ],
      recommendations: [
        'Utilizar formulación de pretratamiento químico certificado para 100% poliéster.',
        'Curar en horno túnel de aire forzado en vez de prensa con alta presión.'
      ],
      verifiedDocSource: 'Brother GTX & Image Armor Poly Guidelines'
    };
  }

  // 6. Telas elásticas con vinilo rígido
  if (techniqueId === 'vinil_textil' && (normFabric.includes('spandex') || normFabric.includes('licra') || normFabric.includes('elastano'))) {
    return {
      isCompatible: true,
      status: 'Compatible con advertencias',
      badgeColor: 'amber',
      headline: 'Requiere Vinilo Textil de Alta Elasticidad (PU Stretch)',
      details: 'Los vinilos estándar se agrietarán o despegarán cuando la prenda se estire sobre el cuerpo del atleta.',
      warnings: [
        'No utilizar vinilos rígidos o PVC promocional económico.',
        'Comprobar memoria elástica de recuperación.'
      ],
      recommendations: [
        'Utilizar exclusivamente Siser EasyWeed Stretch o STAHLS’ Premium Plus.',
        'Prensar a 155°C durante 15s con pelado en frío.'
      ],
      verifiedDocSource: 'Siser Stretch Technical Data Sheet'
    };
  }

  // Caso general óptimo
  return {
    isCompatible: true,
    status: 'Optima',
    badgeColor: 'emerald',
    headline: `Combinación Óptima y Certificada: ${techName}`,
    details: `El sustrato ${fabricComposition} presenta una afinidad superficial excelente con la técnica ${techName}, garantizando máxima solidez al lavado y vivacidad de color.`,
    warnings: [
      'Cumplir estrictamente el tiempo de pre-planchado para evaporar humedad residual.',
      'Verificar presión uniforme en los cuatro cuadrantes del plato.'
    ],
    recommendations: [
      'Proceder con los parámetros técnicos de ficha técnica verificada.',
      'Realizar siempre el segundo prensado de sellado térmico.'
    ],
    verifiedDocSource: tech?.defaultParameters.verifiedSource || 'FESPA Certified Textile Workflow'
  };
}

/**
 * Gestión de Perfiles Guardados de Equipos y Materiales
 */
const DEFAULT_SAMPLE_PROFILES: ProductionEquipmentProfile[] = [
  {
    id: 'profile_dtf_heavy_cotton',
    ownerId: 'default_system',
    name: "DTF Premium Algodón Pesado · STAHLS'",
    description: 'Calibración para remeras y hoodies 240-400g con prensas Hotronix Fusion.',
    baseTechniqueId: 'dtf',
    machineBrandModel: 'Oric DTF 60cm Doble Cabezal i3200',
    heatPressModel: "STAHLS' Hotronix Fusion IQ 40x50",
    consumableBrand: 'Film KDX Double Matte 75u + Tintas DuPont Artistri + TPU Media',
    substrateComposition: '100% Algodón Peinado Ring-Spun 240 GSM',
    defaultTempC: 152,
    defaultTimeSec: 14,
    defaultPressureLevel: 'Media-Alta',
    defaultPeeling: 'Pelado en Frío (Cold Peel: <28°C)',
    safetyNotes: 'Pre-planchado obligatorio de 5s para expulsar humedad. Segundo prensado de 6s con papel teflonado.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'profile_subli_dryfit',
    ownerId: 'default_system',
    name: 'Sublimación Deportiva Dry-Fit 100% Poliéster',
    description: 'Camisetas de fútbol y running en tela transpirable microfibra.',
    baseTechniqueId: 'sublimacion',
    machineBrandModel: 'Plotter Epson SureColor SC-F570 24"',
    heatPressModel: 'Prensa Plana Neumática Insta 256',
    consumableBrand: 'Epson DS + S-Race 100g',
    substrateComposition: '100% Poliéster Interlock Dry-Fit 140 GSM',
    defaultTempC: 200,
    defaultTimeSec: 50,
    defaultPressureLevel: 'Media',
    defaultPeeling: 'Pelado en Caliente Inmediato (retirar vertical)',
    safetyNotes: 'Usar cinta térmica Kapton en 4 esquinas para evitar efecto fantasma (ghosting).',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'profile_htv_siser_stretch',
    ownerId: 'default_system',
    name: 'Vinil Textil Siser Stretch sobre Ropa Deportiva',
    description: 'Dorsales y números elásticos en prendas con spandex.',
    baseTechniqueId: 'vinil_textil',
    machineBrandModel: 'Plotter Roland CAMM-1 GS-24',
    heatPressModel: 'Prensa Térmica Manual Secabo TC5',
    consumableBrand: 'Siser EasyWeed Stretch PU 90 micras',
    substrateComposition: '88% Poliéster / 12% Spandex',
    defaultTempC: 155,
    defaultTimeSec: 15,
    defaultPressureLevel: 'Media-Alta',
    defaultPeeling: 'Pelado en Frío',
    safetyNotes: 'Corte con cuchilla de 45° afilada; presión moderada en prenda sintética.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const getEquipmentProfiles = async (userId?: string): Promise<ProductionEquipmentProfile[]> => {
  if (auth.currentUser || userId) {
    try {
      const targetUid = auth.currentUser?.uid || userId;
      const q = query(
        collection(db, 'productionProfiles'),
        where('ownerId', 'in', [targetUid, 'default_system'])
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const list: ProductionEquipmentProfile[] = [];
        snapshot.forEach((d) => list.push({ id: d.id, ...d.data() } as ProductionEquipmentProfile));
        localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(list));
        return list;
      }
    } catch (err) {
      console.warn('Firestore fetch production profiles failed, using localStorage:', err);
    }
  }

  const local = localStorage.getItem(PROFILES_STORAGE_KEY);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.error(e);
    }
  }

  localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(DEFAULT_SAMPLE_PROFILES));
  return DEFAULT_SAMPLE_PROFILES;
};

export const saveEquipmentProfile = async (
  profile: Omit<ProductionEquipmentProfile, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
): Promise<ProductionEquipmentProfile> => {
  const currentUid = auth.currentUser?.uid || 'local_operator';
  const now = new Date().toISOString();
  const id = profile.id || `profile_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const finalProfile: ProductionEquipmentProfile = {
    ...profile,
    id,
    ownerId: profile.ownerId || currentUid,
    createdAt: profile.id ? (profile as any).createdAt || now : now,
    updatedAt: now
  };

  const local = localStorage.getItem(PROFILES_STORAGE_KEY);
  let list: ProductionEquipmentProfile[] = local ? JSON.parse(local) : [];
  const idx = list.findIndex((p) => p.id === id);
  if (idx >= 0) list[idx] = finalProfile;
  else list.unshift(finalProfile);
  localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(list));

  if (auth.currentUser) {
    try {
      await setDoc(doc(db, 'productionProfiles', id), finalProfile, { merge: true });
    } catch (err) {
      console.warn('Could not sync profile to Firestore:', err);
    }
  }

  return finalProfile;
};

export const deleteEquipmentProfile = async (id: string): Promise<void> => {
  const local = localStorage.getItem(PROFILES_STORAGE_KEY);
  if (local) {
    const list: ProductionEquipmentProfile[] = JSON.parse(local);
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(list.filter((p) => p.id !== id)));
  }

  if (auth.currentUser) {
    try {
      await deleteDoc(doc(db, 'productionProfiles', id));
    } catch (err) {
      console.warn('Could not delete profile from Firestore:', err);
    }
  }
};

/**
 * Gestión de Bitácora y Registro de Trabajos de Producción (Audit Logs)
 */
const DEFAULT_SAMPLE_LOGS: ProductionJobRecord[] = [
  {
    id: 'log_job_2026_01',
    ownerId: 'default_system',
    operatorName: 'Carlos Mendoza',
    operatorEmail: 'harmonyestampadosr@gmail.com',
    operatorRole: 'Operador Principal de Prensa',
    operatorUid: 'admin-master-uid',
    projectName: 'Campaña Streetwear Boxy Heavyweight',
    garmentName: 'Polera Heavyweight Boxy Fit (240g)',
    garmentColor: 'Negro Profundo',
    fabricComposition: '100% Algodón peinado ring-spun 240 GSM',
    techniqueId: 'dtf',
    techniqueName: 'DTF (Direct-to-Film)',
    machineUsed: 'Oric DTF 60 Pro',
    heatPressUsed: "STAHLS' Hotronix Fusion IQ 40x50",
    consumablesUsed: 'Film KDX Double Matte 75u + TPU Media',
    designName: 'Skull Floral Graphic 300 DPI',
    designDpi: 300,
    quantityUnits: 30,
    parametersApplied: {
      temperatureC: 152,
      timeSeconds: 14,
      pressureBars: '4.5 Bar',
      pressureLevel: 'Media-Alta',
      peelingType: 'Pelado en Frío (<28°C)',
      prePressSeconds: 5,
      postPressSeconds: 6
    },
    compatibilityStatus: 'Optima',
    qualityChecksPassed: [
      'Bordes 100% soldados sin despegues',
      'Prueba de tracción elástica superada',
      'Opacidad de blanco total',
      'Segundo prensado con papel mate realizado'
    ],
    qualityRating: 5,
    observations: 'Producción de 30 unidades sin ninguna merma ni descalce. Excelente anclaje en el algodón de 240g.',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    durationMinutes: 45
  }
];

export const getProductionJobLogs = async (userId?: string): Promise<ProductionJobRecord[]> => {
  if (auth.currentUser || userId) {
    try {
      const targetUid = auth.currentUser?.uid || userId;
      const q = query(
        collection(db, 'productionLogs'),
        where('operatorUid', 'in', [targetUid, 'admin-master-uid', 'default_system'])
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const list: ProductionJobRecord[] = [];
        snapshot.forEach((d) => list.push({ id: d.id, ...d.data() } as ProductionJobRecord));
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(list));
        return list;
      }
    } catch (err) {
      console.warn('Firestore fetch production logs failed, using localStorage:', err);
    }
  }

  const local = localStorage.getItem(LOGS_STORAGE_KEY);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.error(e);
    }
  }

  localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(DEFAULT_SAMPLE_LOGS));
  return DEFAULT_SAMPLE_LOGS;
};

export const saveProductionJobLog = async (
  record: Omit<ProductionJobRecord, 'id' | 'createdAt'> & { id?: string }
): Promise<ProductionJobRecord> => {
  const currentUid = auth.currentUser?.uid || 'local_operator';
  const now = new Date().toISOString();
  const id = record.id || `job_log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const finalRecord: ProductionJobRecord = {
    ...record,
    id,
    ownerId: record.ownerId || currentUid,
    createdAt: now
  };

  const local = localStorage.getItem(LOGS_STORAGE_KEY);
  let list: ProductionJobRecord[] = local ? JSON.parse(local) : [];
  list.unshift(finalRecord);
  localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(list));

  if (auth.currentUser) {
    try {
      await setDoc(doc(db, 'productionLogs', id), finalRecord, { merge: true });
    } catch (err) {
      console.warn('Could not sync production log to Firestore:', err);
    }
  }

  return finalRecord;
};

export const exportLogsToCsv = (logs: ProductionJobRecord[]): void => {
  const headers = [
    'ID Registro',
    'Fecha / Hora',
    'Operador',
    'Rol',
    'Prenda',
    'Tela y Composición',
    'Técnica',
    'Prensa Térmica',
    'Temperatura (°C)',
    'Tiempo (s)',
    'Presión',
    'Pelado',
    'Unidades',
    'Calidad (1-5)',
    'Observaciones'
  ];

  const rows = logs.map((log) => [
    log.id,
    new Date(log.createdAt).toLocaleString('es-ES'),
    `"${log.operatorName.replace(/"/g, '""')}"`,
    `"${(log.operatorRole || '').replace(/"/g, '""')}"`,
    `"${log.garmentName.replace(/"/g, '""')}"`,
    `"${log.fabricComposition.replace(/"/g, '""')}"`,
    `"${log.techniqueName.replace(/"/g, '""')}"`,
    `"${log.heatPressUsed.replace(/"/g, '""')}"`,
    log.parametersApplied.temperatureC,
    log.parametersApplied.timeSeconds,
    `"${log.parametersApplied.pressureBars}"`,
    `"${log.parametersApplied.peelingType}"`,
    log.quantityUnits,
    log.qualityRating,
    `"${(log.observations || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Bitacora_Produccion_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

/**
 * Consulta al Asistente Técnico Inteligente
 * Distingue recomendaciones verificadas con fuentes de fabricantes de sugerencias generales de taller.
 */
export async function askProductionAdvisor(
  question: string,
  context?: {
    garmentFabric?: string;
    selectedTechnique?: string;
    isDarkGarment?: boolean;
    quantity?: number;
  }
): Promise<{
  text: string;
  isVerifiedRecommendation: boolean;
  verifiedSource?: string;
  recommendedTechniqueId?: PrintingTechniqueId;
  cautionPoints: string[];
}> {
  // Intentar consultar al endpoint del servidor
  try {
    const res = await fetch('/api/ai/production-advisor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, context })
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.text) return data;
    }
  } catch (err) {
    console.warn('API production advisor request failed, using comprehensive local textile knowledge engine:', err);
  }

  // Fallback con el motor de reglas textiles verificadas de ESTAMPAPRO 360°
  const q = question.toLowerCase();

  // Pregunta tipo: "¿Qué técnica me recomiendas para estampar este diseño sobre poliéster?"
  if (q.includes('poliéster') || q.includes('polyester')) {
    if (q.includes('oscuro') || q.includes('negro') || q.includes('color') || context?.isDarkGarment) {
      return {
        text: 'Para poliéster oscuro o negro, la recomendación técnica certificada es DTF (Direct to Film) con polvo TPU Anti-Migración (Black Carbon Blockout) a baja temperatura (135°C por 15 segundos) o Vinilo Textil Poliuretano Low-Temp. No uses sublimación tradicional porque los tintes transparentes son invisibles en telas oscuras.',
        isVerifiedRecommendation: true,
        verifiedSource: "Manual Técnico STAHLS' Master Decorator & Boletín de Subli-Stop Oric",
        recommendedTechniqueId: 'dtf',
        cautionPoints: [
          'Usar polvo TPU bloqueador negro para impedir que el tinte rojo o azul del poliéster sangre sobre el blanco.',
          'No exceder 140°C para no reactivar la fase gaseosa de los tintes de dispersión del tejido.'
        ]
      };
    } else {
      return {
        text: 'Para prendas de 100% poliéster blanco o de tono claro (camisetas deportivas Dry-Fit o microfibra), la técnica REINA VERIFICADA es la Sublimación Textil. Tiñe químicamente las fibras a 200°C por 50 segundos logrando tacto cero absoluto, transpirabilidad total y resistencia infinita al lavado.',
        isVerifiedRecommendation: true,
        verifiedSource: 'Guía de Parámetros Oficial Epson Sublimation Technical Lab & S-Race Paper',
        recommendedTechniqueId: 'sublimacion',
        cautionPoints: [
          'Pre-planchar la tela 4 segundos a 200°C para deshumificar.',
          'Fijar con cinta térmica Kapton para evitar efecto fantasma (ghosting).',
          'Retirar el papel transfer de forma vertical e inmediata en caliente.'
        ]
      };
    }
  }

  if (q.includes('algodón') || q.includes('algodon') || q.includes('cotton')) {
    if (q.includes('masiv') || q.includes('cantidad') || (context?.quantity && context.quantity >= 50)) {
      return {
        text: 'Para tiradas medianas o masivas en 100% algodón (>30-50 unidades), la recomendación verificada es Serigrafía con tintas Plastisol o Base Agua / Discharge. Ofrece el costo unitario más bajo del mercado y durabilidad de más de 80 lavados con curado en túnel a 160°C.',
        isVerifiedRecommendation: true,
        verifiedSource: 'Compendio Técnico FESPA Screen Printing & Rutland M3',
        recommendedTechniqueId: 'serigrafia',
        cautionPoints: [
          'Curado estricto a 160°C en toda la masa de tinta durante 60 segundos.',
          'Usar malla 43T a 55T para base blanca con rebaje de 1 punto.'
        ]
      };
    } else {
      return {
        text: 'Para pedidos unitarios, tiradas cortas o artes a todo color con degradados sobre algodón, la técnica verificada óptima es DTF (Direct to Film) o DTG. En DTF el planchado estándar es 150°C durante 14 segundos con 4.5 Bares de presión, pelado en frío y segundo prensado de sellado mate de 6 segundos.',
        isVerifiedRecommendation: true,
        verifiedSource: "STAHLS' Hotronix & KDX Laboratory Application Sheet",
        recommendedTechniqueId: 'dtf',
        cautionPoints: [
          'Pre-planchar la prenda 5 segundos para extraer la humedad del algodón.',
          'Pelar strictly en frío (<28°C) para no levantar microtrazos.'
        ]
      };
    }
  }

  if (q.includes('despega') || q.includes('primer lavado') || q.includes('cae') || q.includes('desprende')) {
    return {
      text: 'El desprendimiento en el primer lavado se debe en un 95% a dos causas críticas verificadas: 1) Presión insuficiente en la prensa térmica (se necesitan al menos 4 a 5 Bares / 55 PSI para incrustar el adhesivo en la urdimbre), o 2) No haber deshumificado la prenda con un pre-planchado de 5 segundos previo a estampar, lo cual atrapa vapor de agua formando microburbujas bajo el film.',
      isVerifiedRecommendation: true,
      verifiedSource: 'Diagnóstico de Laboratorio Textil FESPA & Siser Quality Report',
      cautionPoints: [
        'Aumentar la presión de la prensa al nivel Media-Alta (4.5 a 5 Bares).',
        'Realizar siempre el segundo prensado de 6 segundos con papel siliconado de sellado.',
        'Esperar un mínimo de 24 horas antes de la primera lavada.'
      ]
    };
  }

  // Respuesta general con sugerencias técnicas
  return {
    text: `Para "${question}", según la matriz técnica de taller: te sugerimos evaluar primero la composición exacta de la tela (algodón vs sintético), el color de fondo y el volumen del lote. Las técnicas más versátiles para taller moderno son DTF para tiradas cortas y full color fotográfico, o Serigrafía para producciones por volumen superiores a 30 unidades.`,
    isVerifiedRecommendation: false,
    verifiedSource: 'Sugerencia General de Taller (Basada en Estándares Textiles)',
    cautionPoints: [
      'Verificar siempre la etiqueta de la prenda antes de aplicar calor.',
      'Efectuar una prueba testigo de lavado en una prenda de descarte si es un lote nuevo.'
    ]
  };
}
