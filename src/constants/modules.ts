import { AppModule } from '../types';

export const APP_MODULES: AppModule[] = [
  {
    id: 'inicio',
    orderNumber: 1,
    name: 'Inicio',
    shortName: 'Inicio',
    category: 'principal',
    categoryLabel: 'Principal',
    description: 'Tablero central de mando, proyectos recientes, accesos rápidos a estudios y métricas operativas del taller textil.',
    iconName: 'LayoutDashboard',
    status: 'active',
    plannedStagePrompt: 1,
    technicalCapabilities: [
      'Resumen integral de producción',
      'Acceso rápido a los 20 módulos',
      'Gestión de estados vacíos y datos reales',
      'Buscador global de herramientas (Ctrl+K)'
    ],
    deliverablesSummary: [
      'Tablero de bienvenida con métricas en tiempo real',
      'Panel de proyectos y diseños recientes',
      'Lanzador de herramientas rápidas y técnicas'
    ]
  },
  {
    id: 'estudio_diseno',
    orderNumber: 2,
    name: 'Estudio de diseño',
    shortName: 'Estudio de diseño',
    category: 'diseno_3d',
    categoryLabel: 'Diseño y 3D',
    description: 'Estudio profesional de diseño gráfico textil: lienzo multicapa, tipografías curvadas, formas vectoriales, gestión de proyectos y proyección 3D.',
    iconName: 'Palette',
    status: 'active',
    plannedStagePrompt: 2,
    technicalCapabilities: [
      'Lienzo interactivo con zoom, pan, cuadrícula y reglas en cm/mm',
      'Herramientas vectoriales completas: lápiz, pincel, borrador, formas y texto curvado',
      'Administrador de capas no destructivo con bloqueo y ordenamiento',
      'Guardado de proyectos editables en Firestore y Bóveda de Archivos',
      'Proyección directa sobre prendas en el Probador 3D'
    ],
    deliverablesSummary: [
      'Espacio de trabajo multicapa profesional para estampados textiles',
      'Conexión bidireccional con Bóveda de Archivos y Simulador 3D'
    ]
  },
  {
    id: 'probador_3d',
    orderNumber: 3,
    name: 'Probador 3D',
    shortName: 'Probador 3D',
    category: 'diseno_3d',
    categoryLabel: 'Diseño y 3D',
    description: 'Simulador 3D hiperrealista con Three.js, visualización orbital 360°, mapeo de texturas y drapeado de telas.',
    iconName: 'Box',
    status: 'active',
    plannedStagePrompt: 4,
    technicalCapabilities: [
      'Motor 3D WebGL con Three.js',
      'Mapeo UV dinámico y control de textura diffuse/normal/roughness',
      'Rotación orbital e iluminación de estudio textil',
      'Generación de renders y videos 360° para clientes'
    ],
    deliverablesSummary: [
      'Visor interactivo 360° de camisetas, hoodies y gorras',
      'Simulador de caída de tela según gramaje (180g, 240g, french terry)'
    ]
  },
  {
    id: 'disenador_grafico',
    orderNumber: 4,
    name: 'Diseñador gráfico',
    shortName: 'Diseñador gráfico',
    category: 'diseno_3d',
    categoryLabel: 'Diseño y 3D',
    description: 'Editor gráfico 2D especializado en serigrafía y DTF con soporte de capas, tipografías y edición vectorial.',
    iconName: 'PenTool',
    status: 'active',
    plannedStagePrompt: 6,
    technicalCapabilities: [
      'Lienzo interactivo Canvas HTML5 / SVG',
      'Capas independientes, modos de fusión y transparencias',
      'Motor tipográfico con curvatura de texto y kerning textil',
      'Filtros de tramado semitono (Halftone) para serigrafía'
    ],
    deliverablesSummary: [
      'Suite de herramientas de dibujo y vectorización textil',
      'Ajustes de resolución a 300 DPI reales para taller'
    ]
  },
  {
    id: 'editor_imagenes',
    orderNumber: 5,
    name: 'Editor y preparación de imágenes',
    shortName: 'Editor de imágenes',
    category: 'diseno_3d',
    categoryLabel: 'Diseño y 3D',
    description: 'Suite avanzada de preparación de fotografías y artes para serigrafía y DTF: recorte, eliminación de fondos por IA, resolución DPI, convolución, colorimetría y versiones no destructivas.',
    iconName: 'Sliders',
    status: 'active',
    plannedStagePrompt: 7,
    technicalCapabilities: [
      'Procesamiento real con Canvas 2D y manipulación de píxeles ImageData',
      'Recorte con proporciones fijas y redimensionado con cálculo DPI físico',
      'Rotación libre y fija con volteo simétrico horizontal y vertical',
      'Eliminación de fondo mediante IA y algoritmo inteligente de croma',
      'Borrador mágico / inpainting local y en la nube de elementos no deseados',
      'Super-resolución (Upscale 2x/4x) y advertencia visual de densidad para prendas',
      'Ajustes de brillo, contraste, saturación, nitidez (convolución) y temperatura',
      'Reemplazo selectivo de color preservando sombras y luces textiles',
      'Varita mágica de transparencia y canal alfa anti-fringe',
      'Efectos serigráficos: Semitono Halftone (LPI), Duotono, Desgaste vintage y Posterizado',
      'Filtros de imprenta (DTG, Serigrafía clásica, Sublimación pop, Cyberpunk, Sepia)',
      'Historial de versiones no destructivo, protección de original y comparador Split antes/después',
      'Integración directa con Diseñador Gráfico 2D, Probador 3D y Bóveda de Archivos'
    ],
    deliverablesSummary: [
      'Editor fotográfico profesional calibrado para taller textil',
      'Garantía de calidad con verificación en tiempo real de 300 DPI'
    ]
  },
  {
    id: 'ia_creativa',
    orderNumber: 6,
    name: 'IA creativa',
    shortName: 'IA creativa',
    category: 'diseno_3d',
    categoryLabel: 'Diseño y 3D',
    description: 'Centro de inteligencia artificial para generación, edición y preparación de diseños textiles con Gemini y motor vectorial 300 DPI.',
    iconName: 'Sparkles',
    status: 'active',
    plannedStagePrompt: 9,
    technicalCapabilities: [
      'Generación por texto libre con asistente de refinamiento de prompts para serigrafía/DTF',
      '10 categorías reglamentarias (Deportivos, Empresariales, Infantiles, Promocionales, etc.)',
      'Generador de 3 variaciones estilísticas y re-paletización de color en tiempo real',
      'Aislamiento perimetral y eliminación de fondo con máscara alpha suave sobre Canvas',
      'Filtro convolucional de super-nitidez y verificación estricta de 300 DPI físicos',
      'Conexión directa con Diseñador Gráfico 2D, Proyección sobre Prenda 3D y Editor de Fotos',
      'Historial persistente con favoritos, restaurador de originales y descarga de PNG transparente'
    ],
    deliverablesSummary: [
      'Suite creativa completa con Gemini API server-side, 8 estilos artísticos y 10 categorías textiles'
    ]
  },
  {
    id: 'catalogo_prendas',
    orderNumber: 6,
    name: 'Catálogo de prendas',
    shortName: 'Catálogo de prendas',
    category: 'taller_tecnica',
    categoryLabel: 'Taller y Técnica',
    description: 'Base de datos de poleras, polerones, gorras y accesorios con fichas técnicas, composición de telas y medidas.',
    iconName: 'Shirt',
    status: 'active',
    plannedStagePrompt: 3,
    technicalCapabilities: [
      'Clasificación en 4 categorías: Camisetas, Busos, Otras prendas y Accesorios',
      'Fichas técnicas con composición, peso GSM, medidas reales y áreas estampables',
      'Sistema de color profesional (HEX, RGB, HSL, CMYK) y coloración por partes',
      'Catálogo de materiales y fibras textiles con parámetros térmicos',
      'Preparación y enlace con el motor 3D WebGL'
    ],
    deliverablesSummary: [
      'Catálogo completo de prendas y materiales con personalización de color por piezas'
    ]
  },
  {
    id: 'tecnicas_estampado',
    orderNumber: 7,
    name: 'Técnicas de estampado',
    shortName: 'Técnicas de estampado',
    category: 'taller_tecnica',
    categoryLabel: 'Taller y Técnica',
    description: 'Centro técnico de consulta profesional para negocios de estampados: 17 técnicas industriales, parámetros configurables, diagnóstico de fallas, comparador y fichas personalizadas.',
    iconName: 'Layers',
    status: 'active',
    plannedStagePrompt: 10,
    technicalCapabilities: [
      '17 técnicas industriales completas (DTF, DTG, Sublimación, Vinilo textil, Serigrafía, Bordado, UV DTF, etc.)',
      'Parámetros configurables: Temperatura, Tiempo, Presión, Velocidad, Curado, Enfriamiento y Pelado',
      'Documentación técnica verificada de fabricantes (STAHLS, Epson, Brother, Siser, Forever)',
      'Buscador integral por técnica, materiales, procedimientos y síntomas de problemas',
      'Comparador interactivo de 2 a 4 técnicas por compatibilidad, durabilidad, cantidad, costo y complejidad',
      'Creación, persistencia en Firestore/LocalStorage e impresión de fichas técnicas de taller'
    ],
    deliverablesSummary: [
      'Enciclopedia técnica textil para impresores, operarios de prensa y jefes de producción'
    ]
  },
  {
    id: 'asistente_produccion',
    orderNumber: 8,
    name: 'Asistente de producción',
    shortName: 'Asistente de producción',
    category: 'taller_tecnica',
    categoryLabel: 'Taller y Técnica',
    description: 'Asistente técnico inteligente que acompaña al operador durante los 14 pasos de estampado con verificación de compatibilidad, perfiles de equipos, normas de seguridad y bitácora de auditoría.',
    iconName: 'Cpu',
    status: 'active',
    plannedStagePrompt: 11,
    technicalCapabilities: [
      'Flujo operativo guiado de 14 pasos: desde selección de prenda hasta registro de auditoría',
      'Motor de compatibilidad físico-química y térmica en tiempo real con alertas de sangrado',
      'Asistente de consulta técnica IA que distingue recomendaciones verificadas de sugerencias',
      'Perfiles guardados de máquinas y materiales con carga en 1 click',
      'Protocolos de seguridad industrial activa: calor extremo, ventilación forzada y electricidad',
      'Bitácora auditable de producciones completadas con trazabilidad de operador y exportación CSV'
    ],
    deliverablesSummary: [
      'Estación de trabajo y cockpit guiado para operarios de taller y prensas térmicas'
    ]
  },
  {
    id: 'archivos_disenos',
    orderNumber: 9,
    name: 'Archivos y diseños',
    shortName: 'Archivos y diseños',
    category: 'diseno_3d',
    categoryLabel: 'Diseño y 3D',
    description: 'Gestor digital de archivos de clientes, artes finales, capas maestras y versiones organizadas por etiquetas.',
    iconName: 'FolderArchive',
    status: 'active',
    plannedStagePrompt: 2,
    technicalCapabilities: [
      'Almacenamiento por carpetas y asociación a proyectos textiles',
      'Validación de formatos (.AI, .PSD, .SVG, .PNG, .PDF, .DST, .EMB)',
      'Subida, descarga y límites configurables por taller',
      'Control de acceso y aislamiento por propietario'
    ],
    deliverablesSummary: [
      'Bóveda digital de artes finales, fotolitos y mockups 3D con descarga directa'
    ]
  },
  {
    id: 'preparacion_impresion',
    orderNumber: 10,
    name: 'Preparación para impresión',
    shortName: 'Preparación para impresión',
    category: 'taller_tecnica',
    categoryLabel: 'Taller y Técnica',
    description: 'Centro profesional de pre-prensa, validación pre-vuelo (DPI, sangrado, límites de cama), separaciones CMYK, Base Blanca Underbase con choke y exportación multi-formato compatible con RIP.',
    iconName: 'Printer',
    status: 'active',
    plannedStagePrompt: 12,
    technicalCapabilities: [
      'Soporte multi-formato: PNG (300 DPI con canal alfa), JPG, SVG vectorial, PDF de producción, TIFF y EPS',
      'Configuración de cotas físicas en cm, mm, in y px con bloqueo de proporción de aspecto',
      'Resolución configurable (72, 150, 300, 600, 1200 DPI) con cálculo de densidad efectiva en tiempo real',
      'Gestión de perfiles de color ICC: sRGB, Adobe RGB 1998, CMYK FOGRA39, GRACoL 2006, Escala de Grises y Spot',
      'Generador de sangrado (bleed) y márgenes de seguridad con visualización de líneas Trim Box',
      'Control de espejado horizontal y vertical para técnicas de transferencia térmica (DTF, sublimación, vinil)',
      'Auditoría pre-vuelo en vivo: detección de resolución insuficiente, desborde de cama, incompatibilidad de canal alfa y formatos',
      'Separador de color y fotolitos: extracción de CMYK y Base Blanca con choke/rebaje perimetral de 1-4px',
      'Catálogo y configurador de máquinas industriales (Oric DTF, Epson F570, Brother GTX, ROQ, Roland GS-24, Mimaki, Tajima)',
      'Exportación estructurada en PDF, SVG con capas de corte, TIFF y descarga de pack de fotolitos DMax'
    ],
    deliverablesSummary: [
      'Estación de trabajo de pre-prensa con auditoría pre-vuelo automática, generador de fotolitos con choke y exportador de archivos para RIP'
    ]
  },
  {
    id: 'biblioteca',
    orderNumber: 11,
    name: 'Biblioteca',
    shortName: 'Biblioteca',
    category: 'diseno_3d',
    categoryLabel: 'Diseño y 3D',
    description: 'Colección de vectores listos para estampar, tipografías licenciadas, texturas vintage y tramas de semitono.',
    iconName: 'Library',
    status: 'active',
    plannedStagePrompt: 11,
    technicalCapabilities: [
      'Banco curado de ilustraciones vectoriales libres de regalías',
      'Texturas de desgaste (grunge/distressed) para artes retro',
      'Fuentes tipográficas con soporte de acentos y caracteres especiales',
      'Envío directo al Diseñador Gráfico y Simulador 3D'
    ],
    deliverablesSummary: [
      'Recursos de diseño de arrastrar y soltar listos para producción'
    ]
  },
  {
    id: 'cotizaciones',
    orderNumber: 12,
    name: 'Cotizaciones',
    shortName: 'Cotizaciones',
    category: 'negocio_comercial',
    categoryLabel: 'Negocio y Comercial',
    description: 'Sistema financiero profesional para negocios de estampados: cálculo paramétrico de costos directos e indirectos, precios de venta, márgenes de ganancia, escalas por volumen y cotizaciones con exportación a PDF.',
    iconName: 'Calculator',
    status: 'active',
    plannedStagePrompt: 13,
    technicalCapabilities: [
      'Costos directos detallados: prendas lisas, tintas, películas PET, papel transfer, vinilos térmicos, hilos y consumibles (poliamida/adhesivos)',
      'Costos operativos e indirectos: tarifa eléctrica kWh, tiempo y desgaste de máquina, mano de obra directa y puesta a punto (setup/revelado)',
      'Empaque protector individual, transporte flete por pedido y merma técnica reglamentaria por desperdicio textil',
      'Cálculo determinístico en tiempo real: costo unitario, costo por lote/pedido, costo por técnica, PVP sugerido, margen comercial y ganancia neta',
      'Simulador comparativo por volumen con economías de escala: 1, 5, 10, 25, 50, 100 y cantidad personalizada',
      'Generador de presupuestos comerciales profesionales con datos del taller, datos del cliente, desglose de prendas, vigencia y observaciones',
      'Exportación en PDF con diseño membretado estructurado e impresión directa',
      'Historial persistente de cotizaciones con sincronización Firestore y almacenamiento local'
    ],
    deliverablesSummary: [
      'Calculadora de costos y cotizador comercial con simulación de tiradas por volumen y exportación a PDF'
    ]
  },
  {
    id: 'clientes',
    orderNumber: 13,
    name: 'Clientes',
    shortName: 'Clientes',
    category: 'negocio_comercial',
    categoryLabel: 'Negocio y Comercial',
    description: 'CRM textil profesional: registro de clientes, personas de contacto, correo, dirección de despacho, historial de compras, cotizaciones y observaciones técnicas.',
    iconName: 'Users',
    status: 'active',
    plannedStagePrompt: 14,
    technicalCapabilities: [
      'Registro de nombre, contacto, correo, teléfono, ciudad y dirección de despacho',
      'Historial completo de órdenes de trabajo (OT) y cotizaciones vinculadas',
      'Observaciones técnicas de taller y preferencias de telas/tintas del cliente',
      'Métricas financieras acumuladas (total facturado y número de pedidos)'
    ],
    deliverablesSummary: [
      'Directorio CRM textil con fichas individuales, historial de compras y preferencias de estampado'
    ]
  },
  {
    id: 'pedidos',
    orderNumber: 14,
    name: 'Pedidos',
    shortName: 'Pedidos',
    category: 'negocio_comercial',
    categoryLabel: 'Negocio y Comercial',
    description: 'Sistema integral de órdenes de trabajo (OT) con flujo en 8 estados reglamentarios: Recibido, Pendiente de diseño, Diseño aprobado, Preparación, En producción, Control de calidad, Terminado y Entregado.',
    iconName: 'ShoppingBag',
    status: 'active',
    plannedStagePrompt: 14,
    technicalCapabilities: [
      '8 Estados secuenciales: Recibido, Pendiente de diseño, Diseño aprobado, Preparación, En producción, Control de calidad, Terminado y Entregado',
      'Operaciones completas: Crear, Editar, Duplicar en 1 click, Consultar y Filtrar',
      'Cancelación segura con confirmación explícita, auditoría de usuario y motivo obligatorio',
      'Asociación directa con artes y diseños de producción (medidas en cm, ubicación y técnica)',
      'Asociación con prendas del catálogo y desglose detallado de curvas de tallas (S, M, L, XL)',
      'Vinculación con cotizaciones aprobadas y control de anticipos/saldos',
      'Tablero Kanban visual interactivo y vista tabular de alta densidad'
    ],
    deliverablesSummary: [
      'Tablero Kanban y gestor de órdenes de trabajo con 8 estados, asociaciones y control de plazos'
    ]
  },
  {
    id: 'produccion',
    orderNumber: 15,
    name: 'Producción',
    shortName: 'Producción',
    category: 'negocio_comercial',
    categoryLabel: 'Negocio y Comercial',
    description: 'Cockpit de planta para asignación de tareas operativas: Operador, Máquina, Técnica, Fecha, Tiempo estimado, Materiales consumibles y Estado de avance.',
    iconName: 'Workflow',
    status: 'active',
    plannedStagePrompt: 14,
    technicalCapabilities: [
      'Asignación completa: Operador, Máquina de planta, Técnica textil, Fecha y Tiempo estimado en minutos/horas',
      'Asignación y reserva de materiales requeridos con deducción de stock',
      'Seguimiento de estados: Programado, En proceso, Pausado, Control de calidad y Completado',
      'Registro de avance de prendas terminadas en tiempo real con cálculo de porcentaje',
      'Transición automática a fase de Control de Calidad al alcanzar el 100% de la tirada'
    ],
    deliverablesSummary: [
      'Estación de despacho y asignación de tareas operativas de taller por operador y máquina'
    ]
  },
  {
    id: 'inventario',
    orderNumber: 16,
    name: 'Inventario',
    shortName: 'Inventario',
    category: 'negocio_comercial',
    categoryLabel: 'Negocio y Comercial',
    description: 'Control de existencias multi-categoría para 10 familias: Prendas, Tallas, Colores, Tintas, Vinilos, Películas, Papeles, Hilos, Consumibles y Máquinas con registro de entradas/salidas y alertas de stock mínimo.',
    iconName: 'Package',
    status: 'active',
    plannedStagePrompt: 14,
    technicalCapabilities: [
      '10 Categorías obligatorias: Prendas, Tallas, Colores, Tintas, Vinilos, Películas, Papeles, Hilos, Consumibles y Máquinas',
      'Registro de movimientos de Entrada (+) y Salida (-) con motivo, OT asociada y operador',
      'Alertas visuales de existencias mínimas cuando el stock es igual o inferior al umbral crítico',
      'Kardex auditable con historial completo de transacciones y marcas de tiempo',
      'Control del estado operativo de máquinas (Operativa, En Mantenimiento, Detenida) y calendario'
    ],
    deliverablesSummary: [
      'Control de almacén textil con alerta de quiebre de stock y registro de entradas/salidas'
    ]
  },
  {
    id: 'finanzas',
    orderNumber: 17,
    name: 'Reportes y Métricas',
    shortName: 'Reportes',
    category: 'negocio_comercial',
    categoryLabel: 'Negocio y Comercial',
    description: 'Centro de analítica y reportes de taller: Pedidos pendientes por fase, Pedidos terminados, Materiales disponibles, Materiales por reponer y Bitácora de actividad de producción.',
    iconName: 'BarChart3',
    status: 'active',
    plannedStagePrompt: 14,
    technicalCapabilities: [
      'Reporte consolidado de Pedidos Pendientes con desglose por fases de taller',
      'Reporte de Pedidos Terminados y Entregados con totales facturados',
      'Reporte de Materiales Disponibles vs Materiales por Reponer con cálculo de reposición sugerida',
      'Bitácora cronológica de actividad de producción y movimientos de stock',
      'Exportación estructurada de reportes en formato CSV compatible con Excel'
    ],
    deliverablesSummary: [
      'Tablero de analítica de negocio con 5 reportes estratégicos y exportación CSV'
    ]
  },
  {
    id: 'control_calidad',
    orderNumber: 18,
    name: 'Control de calidad',
    shortName: 'Control de calidad',
    category: 'taller_tecnica',
    categoryLabel: 'Taller y Técnica',
    description: 'Protocolos de inspección industrial de prendas estampadas: estiramiento cruzado, curado y polimerización, solidez al frote/lavado, registro anatómico, mano textil y emisión de certificados.',
    iconName: 'CheckCircle2',
    status: 'active',
    plannedStagePrompt: 16,
    technicalCapabilities: [
      'Checklist de 6 pruebas físico-mecánicas normadas (curado, elongación 100%, solidez crocking, registro, tacto, fibrilación)',
      'Registro auditable de piezas conformes vs piezas con merma/defecto con cálculo de tasa de rechazo',
      'Dictamen técnico formal: Aprobado, Aprobado con Observaciones o Rechazado para Reproceso',
      'Transición automática de órdenes de trabajo a Terminado y despacho final Entregado',
      'Generador e impresor de Certificados Oficiales de Control de Calidad de Taller Textil'
    ],
    deliverablesSummary: [
      'Estación de control de calidad y emisión de certificados de conformidad para clientes premium'
    ]
  },
  {
    id: 'catalogos_comerciales',
    orderNumber: 19,
    name: 'Tienda & Personalizador 3D',
    shortName: 'Tienda & 3D',
    category: 'negocio_comercial',
    categoryLabel: 'Negocio y Comercial',
    description: 'Portal comercial para clientes: catálogo de prendas fotográficas y 3D, personalizador en vivo con subida de artes, textos curvos, desglose de tallas, solicitud de cotizaciones, pedidos y panel de administración.',
    iconName: 'ShoppingBag',
    status: 'active',
    plannedStagePrompt: 15,
    technicalCapabilities: [
      'Catálogo visual de prendas con fotos, colores, tallas, fichas técnicas y precios por volumen',
      'Simulador 3D WebGL con mapeo de estampados y rotación orbital 360°',
      'Personalizador con subida de diseños, aislamiento de fondo, tipografías y textos curvos',
      'Flujo completo de cotizaciones, pedidos, revisión técnica y visto bueno formal de cliente',
      'Panel del negocio: publicar/ocultar productos, configurar precios y aprobar diseños de clientes',
      'Garantía estricta de privacidad: aislamiento de proyectos y pedidos por cliente'
    ],
    deliverablesSummary: [
      'Portal comercial y tienda de personalización 3D para clientes y marcas asociadas'
    ]
  },
  {
    id: 'centro_aprendizaje',
    orderNumber: 20,
    name: 'Centro de aprendizaje',
    shortName: 'Centro de aprendizaje',
    category: 'sistema',
    categoryLabel: 'Sistema',
    description: 'Manuales paso a paso, guías de resolución de problemas comunes (fibrilación, sangrado de color) y tutoriales.',
    iconName: 'GraduationCap',
    status: 'active',
    plannedStagePrompt: 20,
    technicalCapabilities: [
      'Base de conocimiento con solución de problemas frecuentes de taller',
      'Guías interactivas de calibración de temperatura y presión',
      'Glosario de términos textiles y serigráficos',
      'Cursos estructurados con lecciones de 10 puntos y exámenes de certificación'
    ],
    deliverablesSummary: [
      'Academia digital para entrenamiento de nuevos operarios'
    ]
  },
  {
    id: 'configuracion',
    orderNumber: 21,
    name: 'Configuración',
    shortName: 'Configuración',
    category: 'sistema',
    categoryLabel: 'Sistema',
    description: 'Ajustes del taller, perfiles de color ICC, unidades de medida, moneda, datos fiscales y personalización de interfaz.',
    iconName: 'Settings',
    status: 'active',
    plannedStagePrompt: 1,
    technicalCapabilities: [
      'Datos del taller y perfil de facturación',
      'Parámetros de diseño por defecto (DPI, perfiles CMYK/sRGB)',
      'Configuración de moneda, impuestos y margen base',
      'Alternancia de modo Claro / Oscuro con persistencia'
    ],
    deliverablesSummary: [
      'Panel de control maestro de configuración operativa y de software'
    ]
  }
];

export const MODULE_CATEGORIES: { id: AppModule['category']; label: string }[] = [
  { id: 'principal', label: 'Principal' },
  { id: 'diseno_3d', label: 'Diseño & 3D' },
  { id: 'taller_tecnica', label: 'Taller & Técnica' },
  { id: 'negocio_comercial', label: 'Gestión & Negocio' },
  { id: 'sistema', label: 'Sistema' }
];
