/**
 * ESTAMPAPRO 360° - Enciclopedia Industrial de Técnicas de Estampado Textil
 * Datos técnicos de ingeniería textil, calibración de taller y estándares FESPA/SGIA.
 */

import { DetailedTechniqueSheet } from '../types/techniques';

export const TECHNIQUES_ENCYCLOPEDIA: DetailedTechniqueSheet[] = [
  // 1. DTF (Direct to Film)
  {
    id: 'dtf',
    name: 'DTF (Direct-to-Film)',
    shortDesc: 'Impresión digital por inyección sobre film PET transferible con poliamida termofusible.',
    fullDesc: 'La tecnología DTF revolucionó la personalización textil al permitir transferencias a todo color sin descarte manual (weeding) sobre prácticamente cualquier tejido, utilizando tintas acuosas pigmentadas CMYK + White combinadas con polvo termoplástico de poliuretano (TPU/poliamida).',
    functioning: 'El diseño se imprime en espejo sobre un film de poliéster (PET) tratado químicamente con una capa de desmoldeo. Primero se deposita la tinta CMYK y de inmediato una base de tinta blanca opaca. Aún húmeda, se aplica polvo de poliamida termofusible que se adhiere exclusivamente a la tinta. La película pasa por un horno túnel de curado (115°C - 130°C) donde el polvo polimeriza formando una membrana elástica gomosa. Finalmente, se transfiere a la prenda mediante calor y presión en una prensa térmica, donde el TPU se funde y ancla en los intersticios del tejido.',
    advantages: [
      'Sin descarte ni pelado manual de vinilo: imprime letras finas y tramas complejas al instante.',
      'Compatibilidad universal: adhiere sobre 100% algodón, poliéster, mezclas poly-cotton, lona, denim, nylon y cuero sintético.',
      'Colores vibrantes con base blanca ultra opaca en prendas oscuras o negras.',
      'Excelente elasticidad y resistencia a la tracción sin agrietamiento precoz.',
      'Rentabilidad insuperable desde 1 sola prenda hasta tiradas medianas de 100-300 unidades.',
      'Tacto suave y ligero comparado con vinilos térmicos tradicionales gruesos.'
    ],
    disadvantages: [
      'Menor transpirabilidad en artes de gran cobertura comparado con tintas base agua o sublimación.',
      'Requiere mantenimiento diario riguroso de cabezales (recirculación de tinta blanca para evitar sedimentación de dióxido de titanio).',
      'El acabado al tacto varía según el grano del polvo termofusible (grano fino vs medio).',
      'Sensible a condiciones de humedad relativa ambiental en el área de impresión (40-60% HR recomendada).'
    ],
    machines: [
      {
        type: 'Impresora DTF de doble/cuádruple cabezal Epson i3200-A1 / XP600',
        recommendedBrandsModels: ['Oric DTF 60cm Pro', 'Audley DTF 60', 'Epson SureColor SC-F2200 DTF Mode', 'DTFStation Prestige A3+ / Prestige XL2'],
        specsNotes: 'Cabezales piezoeléctricos con sistema de agitación y recirculación continua de tinta blanca.'
      },
      {
        type: 'Horno y Shaker automático de poliamida',
        recommendedBrandsModels: ['Horno shaker continuo H650 con recirculación', 'Horno estático A3 con control digital de temperatura'],
        specsNotes: 'Sensor infrarrojo de temperatura y zona de succión para evitar arrugas en el film.'
      },
      {
        type: 'Prensa térmica plana de accionamiento neumático o electromagnético',
        recommendedBrandsModels: ["STAHLS' Hotronix Fusion IQ 40x50", 'Insta 256 Manual/Swing', 'Secabo TC7 SMART', 'Microtec AP4050'],
        specsNotes: 'Presión uniforme certificada con display digital de temperatura y tiempo.'
      }
    ],
    tools: [
      'Prensa térmica de plato plano 40x50 cm',
      'Termómetro láser infrarrojo para verificación de plato térmico',
      'Papel siliconado protector (kraft mate o teflón antiadherente)',
      'Bloque disipador de calor (placa de aluminio o almohadilla fría para acelerar pelado)',
      'Termohigrómetro de taller para monitoreo de humedad ambiental',
      'Cuchilla de corte rotativa para corte de pliegos'
    ],
    consumables: [
      {
        name: 'Tintas DTF Pigmentadas Base Agua',
        category: 'tinta',
        recommendedBrands: ['DuPont Artistri P5000 / P6000', 'InkTec SubliNova DTF', 'Color Master Pro DTF', 'Oric HD Pigment Inks'],
        specifications: 'Pigmentos nano-molidos de alta fluidez, densidad óptica de blanco > 1.8.'
      },
      {
        name: 'Film DTF PET Tratado (Single / Double Matte)',
        category: 'film',
        recommendedBrands: ['STAHLS’ UltraChop Film', 'KDX Premium PET 75u', 'DTFStation Hot Peel Film', 'Audley Cold Peel PET'],
        specifications: 'Espesor 75 a 90 micras, recubrimiento de liberación antiestática de alta absorción.'
      },
      {
        name: 'Polvo Termofusible TPU (Poliamida)',
        category: 'adhesivo',
        recommendedBrands: ['Siser DTF Powder', 'Oric Fine TPU Powder 80-170um', 'STAHLS’ Low-Temp Hot Melt'],
        specifications: 'Poliuretano termoplástico de grano medio (80-170 micras) para algodón, grano fino (0-80 micras) para detalles extremos.'
      }
    ],
    materials: ['Film PET', 'Polvo adhesivo TPU', 'Tintas CMYK+W', 'Papel de acabado mate/brillo'],
    compatibleFabrics: [
      { fabric: '100% Algodón (peinado / cardado)', rating: 'Excelente', notes: 'Adherencia total, excelente solidez al lavado.' },
      { fabric: '100% Poliéster y Dry-Fit', rating: 'Compatible con ajuste', notes: 'Usar film y poliamida de baja temperatura (135°C) o polvo black blockout para evitar sangrado de tinte.' },
      { fabric: 'Mezclas Poly-Cotton 50/50 y 80/20', rating: 'Excelente', notes: 'Gran fijación en sudaderas y hoodies de felpa.' },
      { fabric: 'Nylon y Telas Impermeables', rating: 'Compatible con ajuste', notes: 'Requiere poliamida especial flexible y prueba de desmoldeo previo de silicona.' },
      { fabric: 'Denim, Lona y Cordura', rating: 'Excelente', notes: 'Se ancla en tramas pesadas con alta presión.' }
    ],
    designPreparation: {
      resolutionDpi: '300 DPI a escala real 1:1',
      colorModes: ['RGB (Adobe RGB 1998) para RIP digital', 'CMYK FOGRA39'],
      vectorRequired: false,
      minLineWeightMm: '0.4 mm (trazo mínimo imprimible y transferible)',
      whiteUnderbaseReq: 'Capa de blanco al 80-100% con rebaje (choke) de 1.5 a 2 píxeles para evitar halo blanco visible en contornos',
      fileFormats: ['PNG 300 DPI con transparencia alfa', 'TIFF 300 DPI', 'PDF vectorial / AI'],
      criticalTips: [
        'Eliminar sombras suaves transparentes menores al 10% de opacidad para evitar halos punteados sucios.',
        'Convertir todas las fuentes a curvas antes de enviar a software RIP (Cadlink Digital Factory o Photoprint).',
        'Comprobar que no existan píxeles fantasma semitransparentes en el fondo del lienzo.'
      ]
    },
    procedure: [
      {
        stepNumber: 1,
        phase: 'Pre-prensa / Preparación',
        title: 'Impresión en espejo y polimerizado del transfer',
        description: 'Imprimir el diseño invertido en film PET. Espolvorear polvo TPU de manera homogénea sobre la tinta fresca y retirar excedentes con vibración. Curar en horno a 120°C - 125°C durante 120 segundos hasta obtener apariencia brillante similar a cáscara de naranja (sin quemar el film).',
        durationOrTemp: '120°C - 125°C / 120 seg en horno'
      },
      {
        stepNumber: 2,
        phase: 'Pre-prensa / Preparación',
        title: 'Pre-planchado de la prenda textil',
        description: 'Colocar la prenda en la prensa térmica y aplicar presión durante 4 a 6 segundos para eliminar toda la humedad residual de la fibra de algodón y alisar arrugas.',
        durationOrTemp: '150°C / 5 seg',
        criticalWarning: 'Omitir el pre-planchado atrapa vapor que provoca burbujas y desprendimiento prematuro en el primer lavado.'
      },
      {
        stepNumber: 3,
        phase: 'Producción / Aplicación',
        title: 'Transferencia térmica principal',
        description: 'Ubicar el film DTF con el diseño centrado sobre la prenda. Proteger con hoja de papel teflón o papel sulfurizado. Cerrar la prensa con presión media-alta.',
        durationOrTemp: '150°C - 155°C / 12 - 15 seg / 4 - 5 Bares'
      },
      {
        stepNumber: 4,
        phase: 'Post-prensa / Acabado',
        title: 'Enfriamiento y pelado del film (Peeling)',
        description: 'Si es film Cold Peel, esperar a que el pliego esté completamente frío al tacto (<30°C) antes de tirar diagonalmente de forma continua y suave. Si es Hot Peel, retirar a los 3 segundos con movimiento fluido horizontal.',
        durationOrTemp: 'En frío (15-30 seg) o caliente según especificación del film'
      },
      {
        stepNumber: 5,
        phase: 'Post-prensa / Acabado',
        title: 'Segundo prensado de sellado y fijación final',
        description: 'Cubrir el estampado transferido con papel kraft siliconado o teflón texturizado y prensar nuevamente durante 5 a 8 segundos. Este paso sella la poliamida dentro de la urdimbre y proporciona un acabado suave mate.',
        durationOrTemp: '150°C / 6 - 8 seg / Presión Alta'
      }
    ],
    defaultParameters: {
      tempCelsiusMin: 145,
      tempCelsiusMax: 160,
      tempFahrenheitMin: 293,
      tempFahrenheitMax: 320,
      timeSecondsMin: 12,
      timeSecondsMax: 15,
      pressureLevel: 'Media-Alta',
      pressureBars: '4.0 - 5.0 Bar',
      pressurePsi: '55 - 65 PSI',
      speed: '2 a 5 m²/hora en impresora doble cabezal i3200; 120 transfers/hora en prensa manual',
      curingMethod: 'Horno túnel con calentadores infrarrojos o plancha suspendida a 2 cm',
      curingTempTime: '120°C a 125°C durante 110-130 segundos',
      cooling: 'Enfriamiento a temperatura ambiente (30-60 seg)',
      peeling: 'Pelado en Frío (Cold Peel: <30°C ambiente)',
      primaryMaterials: ['100% Algodón', 'Poliéster deportivo', 'Mezclas 50/50', 'Lona de algodón'],
      machineModelReference: "Prensa Térmica STAHLS' Hotronix Fusion IQ / Shaker Oric H650",
      consumableReference: 'Film KDX Double Matte 75u + Tintas DuPont Artistri P5000 + TPU Powder 120u',
      verifiedSource: "Manual Técnico de Parámetros STAHLS' Master Decorator & KDX Lab Report",
      lastVerifiedDate: '2026-03-20',
      isManufacturerVerified: true,
      manufacturerNotice: 'Los tiempos pueden variar ±2 segundos dependiendo de la densidad del gramaje de la prenda.'
    },
    manufacturerPresets: [
      {
        id: 'stahls_hotronix_dtf_cotton',
        presetName: "STAHLS' Hotronix - DTF Algodón 100% Pesado",
        brand: "STAHLS' Hotronix",
        equipmentModel: 'Fusion IQ Pneumatic',
        consumableUsed: 'UltraChop Film + Low-Temp TPU',
        substrate: 'Algodón peinado 220 - 260 GSM',
        tempC: 150,
        timeSec: 14,
        pressure: 'Presión 6 en escala Hotronix (50-60 PSI)',
        peeling: 'Pelado en Frío total (<28°C)',
        prePressSec: 5,
        postPressSec: 6,
        verifiedDate: '2026-02-14',
        sourceDoc: "Boletín de ingeniería STAHLS' 2026-A1"
      },
      {
        id: 'dtf_polyester_antimigration',
        presetName: 'Oric Lab - DTF Poliéster / Dry-Fit Anti-Migración',
        brand: 'Oric / Audley',
        equipmentModel: 'Prensa plana TC7 Smart',
        consumableUsed: 'Polvo TPU Black Carbon Blockout',
        substrate: '100% Poliéster deportivo sublimado oscuro',
        tempC: 135,
        timeSec: 15,
        pressure: 'Presión Media (3.5 Bar)',
        peeling: 'Pelado en Frío completo',
        prePressSec: 3,
        postPressSec: 8,
        verifiedDate: '2026-01-18',
        sourceDoc: 'Protocolo Oric Textile Color Bleed Prevention'
      }
    ],
    finishing: {
      touch: 'Mano Ultra Suave',
      gloss: 'Mate',
      elasticity: 'Muy Alta (Bi-stretch)',
      opacityDarkFabrics: 'Opacidad Total 100%',
      breathability: 'Media (Baja en áreas mayores a 30x40cm continuas)'
    },
    care: {
      washTempMaxC: 40,
      washCycle: 'Ciclo suave/delicado para prendas estampadas',
      turnInsideOut: true,
      bleachAllowed: false,
      tumbleDry: 'Baja temperatura ciclo delicado',
      ironing: 'Planchar del revés sin vapor',
      certifiedWashCycles: 50,
      curationTimeBeforeFirstWashHours: 24
    },
    commonProblems: [
      {
        id: 'dtf_peel_wash',
        symptom: 'El transfer se despega o levanta por los bordes en el primer o segundo lavado.',
        probableCause: 'Curado insuficiente del polvo en el horno (poliamida no fundió totalmente) o presión insuficiente en la prensa térmica.',
        technicalSolution: 'Asegurar que el polvo cure a 125°C hasta adquirir textura vítrea uniforme. Incrementar la presión de la prensa térmica a 5 Bares y realizar siempre un segundo planchado de 6 segundos con papel protector.',
        severity: 'Crítico'
      },
      {
        id: 'dtf_dye_migration',
        symptom: 'El blanco del estampado se tiñe de rojo, azul o amarillo al aplicarlo sobre camisetas de poliéster de color.',
        probableCause: 'Migración gaseosa de los tintes de dispersión del poliéster activados por el calor de la prensa.',
        technicalSolution: 'Reducir la temperatura a 130°C - 135°C e incorporar polvo de poliamida con carga de carbón negro (Antibleed / Subli-Stop blocker).',
        severity: 'Crítico'
      },
      {
        id: 'dtf_oil_spots',
        symptom: 'Aparición de gotas aceitosas o manchas brillantes sobre el estampado días después de prensar.',
        probableCause: 'Presencia de glicoles y solventes higroscópicos de la tinta blanca no evaporados adecuadamente durante el curado.',
        technicalSolution: 'Aumentar el tiempo de permanencia en el horno túnel o reducir la velocidad de avance del shaker para garantizar la evaporación completa de humedad antes del prensado.',
        severity: 'Moderado'
      }
    ],
    comparisonMetrics: {
      fabricCompatibilityScore: 9.5,
      durabilityScore: 8.5,
      quantityFlexibilityScore: 9.8,
      initialInvestmentCost: 'Medio ($1,000-$6,000 USD)',
      costPerUnitSmallRun: 'Económico',
      costPerUnitBulkRun: 'Medio',
      operationalComplexity: 'Media',
      spaceRequirement: 'Medio (30-60 m²)'
    }
  },

  // 2. DTG (Direct to Garment)
  {
    id: 'dtg',
    name: 'DTG (Direct-to-Garment)',
    shortDesc: 'Impresión digital por inyección directa de tinta textil pigmentada al interior de las fibras de algodón.',
    fullDesc: 'La tecnología DTG inyecta gotas microscópicas de tinta acuosa piezoeléctrica directamente sobre la prenda de algodón. Requiere la aplicación previa de un líquido de pretratamiento que reacciona químicamente con la tinta blanca para coagularla instantáneamente en superficie antes de imprimir los colores CMYK.',
    functioning: 'El tejido de algodón se rocía homogéneamente con una solución salina de pretratamiento catiónico y se plancha en seco. La impresora deposita cabezales de tinta blanca que se gelifican al contacto con las sales del pretratamiento. De inmediato, se rocía la tinta CMYK húmedo-sobre-húmedo. Finalmente, la prenda se fija en una prensa de calor o túnel de convección forzada para polimerizar la resina ligante dentro del lumen de la fibra.',
    advantages: [
      'El tacto más suave y transpirable de la industria en impresión directa a todo color.',
      'Degradados y matices fotográficos continuos sin efecto escalón ni rigidez.',
      'Excelente definición microscópica en detalles finos y artes tipográficos pequeños.',
      'Proceso 100% digital bajo demanda: sin pantallas ni planchas intermedias.'
    ],
    disadvantages: [
      'Exige 100% algodón peinado ring-spun de alto gramaje para resultados óptimos.',
      'Poco compatible con 100% poliéster sin pretratamientos químicos complejos especializados.',
      'Alto costo por mililitro de tinta original y pretratamiento.',
      'Riesgo de halos o marcas de líquido de pretratamiento si no se lava o aplica uniformemente.'
    ],
    machines: [
      {
        type: 'Impresora DTG Industrial de alta resolución',
        recommendedBrandsModels: ['Epson SureColor SC-F3000 / F2100', 'Brother GTXpro / GTXpro Bulk', 'Kornit Avalanche HD6 / Atlas Max', 'Ricoh Ri 2000'],
        specsNotes: 'Cabezales industriales PrecisionCore MicroTFP o cabezales piezoeléctricos Brother de recirculación.'
      },
      {
        type: 'Máquina automática de pretratamiento (Pretreatment Sprayer)',
        recommendedBrandsModels: ['Schulze Pretreatmaker IV', 'Lawson Silver-Jet', 'Spider Mini DTG Pretreater'],
        specsNotes: 'Boquillas intercambiables con control milimétrico de gramos por metro cuadrado.'
      }
    ],
    tools: [
      'Prensa térmica de vapor disipado o túnel de secado de aire caliente forzado',
      'Balanza de precisión digital para pesar gramos de pretratamiento',
      'Rodillo de espuma de alta densidad para asentar fibrilación tras pulverizar',
      'Láminas de papel de silicona de grado alimentario para secado'
    ],
    consumables: [
      {
        name: 'Tintas DTG Acuosas Pigmentadas',
        category: 'tinta',
        recommendedBrands: ['Epson UltraChrome DG Ink', 'Brother Innobella Textile Ink', 'DuPont Artistri P3500 Series'],
        specifications: 'Resinas acrílicas hidrosolubles y dióxido de titanio coloidal con certificación OEKO-TEX Eco Passport.'
      },
      {
        name: 'Líquido de Pretratamiento (Dark / Light Garment)',
        category: 'quimico',
        recommendedBrands: ['Epson Genuine Pretreatment Liquid', 'Brother Pretreat Solution', 'Image Armor ULTRA / Platinum', 'Firebird FBX-100'],
        specifications: 'Emulsión acuosa con sales de calcio multivalentes diseñadas para coagulación rápida de pigmentos.'
      }
    ],
    materials: ['Prendas de algodón peinado ring-spun', 'Líquido pretratamiento', 'Papel teflón microporoso'],
    compatibleFabrics: [
      { fabric: '100% Algodón Peinado Ring-Spun', rating: 'Excelente', notes: 'Sustrato perfecto. Fibras sin vellosidad producen máxima nitidez.' },
      { fabric: 'Algodón Cardado Open-End', rating: 'Compatible con ajuste', notes: 'Tiende a fibrilar, requiriendo mayor gramaje de pretratamiento.' },
      { fabric: 'Mezcla 80/20 Cotton-Poly', rating: 'Compatible con ajuste', notes: 'La tinta ancla en el algodón; las fibras de poliéster pueden perder solidez.' },
      { fabric: '100% Poliéster deportivo', rating: 'No recomendado', notes: 'Requiere químicos de fijación especiales para poliéster (Poly-Pretreat).' }
    ],
    designPreparation: {
      resolutionDpi: '300 DPI a tamaño real 100%',
      colorModes: ['RGB (sRGB o Adobe RGB 1998)', 'Lab Color'],
      vectorRequired: false,
      minLineWeightMm: '0.3 mm',
      whiteUnderbaseReq: 'Underbase blanco modulado dinámicamente según la luminosidad del arte y color de la prenda',
      fileFormats: ['PNG con transparencia 24-bit', 'TIFF sin compresión', 'PSD'],
      criticalTips: [
        'Aprovechar el negro natural de la camiseta para evitar imprimir tinta negra sobre prendas oscuras (Black Knockout).',
        'Mantener los degradados suaves con ruido sutil para evitar banding en pasadas de cabezal.'
      ]
    },
    procedure: [
      {
        stepNumber: 1,
        phase: 'Pre-prensa / Preparación',
        title: 'Aplicación homogénea del líquido de pretratamiento',
        description: 'Pulverizar entre 18g y 24g de pretratamiento para prendas oscuras en área de 35x40cm. Asentar las fibras en una sola dirección con rodillo de espuma suave.',
        durationOrTemp: '20g de pretratamiento calibrado'
      },
      {
        stepNumber: 2,
        phase: 'Pre-prensa / Preparación',
        title: 'Secado y aplanado de fibras en prensa térmica',
        description: 'Prensar a 160°C durante 35-45 segundos con papel protector para evaporar el agua y cristalizar las sales sin quemar el líquido.',
        durationOrTemp: '160°C / 40 seg / Presión Media-Alta'
      },
      {
        stepNumber: 3,
        phase: 'Producción / Aplicación',
        title: 'Montaje en bastidor e impresión directa DTG',
        description: 'Colocar la camiseta perfectamente tensa en el plato de la impresora. Ejecutar la impresión con pasada de base blanca y color según el perfil RIP.',
        durationOrTemp: '1 a 2.5 minutos según resolución de pasadas'
      },
      {
        stepNumber: 4,
        phase: 'Post-prensa / Acabado',
        title: 'Curado térmico final de la tinta',
        description: 'Fijar en prensa térmica con papel siliconado a presión muy ligera (hover o contacto suave) o en túnel de secado por aire caliente a 160°C durante 90 a 120 segundos.',
        durationOrTemp: '160°C / 90 seg / Presión Muy Ligera (1 Bar)'
      }
    ],
    defaultParameters: {
      tempCelsiusMin: 155,
      tempCelsiusMax: 165,
      tempFahrenheitMin: 311,
      tempFahrenheitMax: 329,
      timeSecondsMin: 85,
      timeSecondsMax: 120,
      pressureLevel: 'Baja',
      pressureBars: '1.0 - 1.5 Bar (presión de contacto suave)',
      pressurePsi: '15 - 20 PSI',
      speed: '25 a 45 camisetas oscuras por hora en equipo industrial',
      curingMethod: 'Túnel de convección forzada o prensa térmica con papel siliconado mate',
      curingTempTime: '160°C durante 90 a 120 segundos',
      cooling: 'Inmediato (sin enfriamiento)',
      peeling: 'No aplica (Impresión directa o bordado)',
      primaryMaterials: ['100% Algodón peinado ring-spun'],
      machineModelReference: 'Epson SureColor SC-F2100 / Brother GTXpro',
      consumableReference: 'Tintas Epson UltraChrome DG + Pretratamiento Genuine Epson',
      verifiedSource: 'Manual de Servicio y Operación Técnica Epson DTF/DTG Certified',
      lastVerifiedDate: '2026-02-10',
      isManufacturerVerified: true,
      manufacturerNotice: 'La cantidad exacta de pretratamiento debe calibrarse según el grosor del tejido (GSM).'
    },
    manufacturerPresets: [
      {
        id: 'brother_gtx_black_tee',
        presetName: 'Brother GTX - Camiseta Negra Algodón 200g',
        brand: 'Brother',
        equipmentModel: 'Brother GTXpro Industrial',
        consumableUsed: 'Innobella Textile Inks + Brother Dark Pretreat',
        substrate: '100% Algodón Peinado 180-220 GSM',
        tempC: 160,
        timeSec: 90,
        pressure: 'Prensa plana manual a 1.2 Bar (contacto flotante)',
        peeling: 'No aplica',
        prePressSec: 35,
        postPressSec: 90,
        verifiedDate: '2026-01-22',
        sourceDoc: 'Brother Industrial Garment Printing Guide 2026'
      }
    ],
    finishing: {
      touch: 'Tacto Cero (Inapreciable)',
      gloss: 'Mate',
      elasticity: 'Alta',
      opacityDarkFabrics: 'Alta',
      breathability: 'Muy Alta (Tejido respira)'
    },
    care: {
      washTempMaxC: 30,
      washCycle: 'Prenda invertida, agua fría, ciclo suave',
      turnInsideOut: true,
      bleachAllowed: false,
      tumbleDry: 'Prohibido secadora',
      ironing: 'Planchar del revés sin vapor',
      certifiedWashCycles: 45,
      curationTimeBeforeFirstWashHours: 48
    },
    commonProblems: [
      {
        id: 'dtg_fibrillation',
        symptom: 'El estampado luce lavado, descolorido o con pelusa blanca asomando a través de la tinta tras la primera lavada.',
        probableCause: 'Fibrilación del algodón: fibras cortas del hilo que no fueron asentadas durante el pretratamiento y perforaron la capa de tinta.',
        technicalSolution: 'Utilizar algodón peinado ring-spun de fibra larga; pasar rodillo con firmeza sobre el pretratamiento húmedo y asegurar pre-prensado plano a 160°C.',
        severity: 'Moderado'
      },
      {
        id: 'dtg_pretreat_box',
        symptom: 'Aparición de un cuadro o mancha amarillenta o brillante en la zona donde se roció el pretratamiento tras salir de la prensa.',
        probableCause: 'Exceso de líquido de pretratamiento o temperatura excesiva que caramelizó las sales y almidones de la tela.',
        technicalSolution: 'Reducir el gramaje de pretratamiento a 18g/m²; utilizar agua desionizada para diluciones y lavar la prenda antes de entregar al cliente.',
        severity: 'Moderado'
      }
    ],
    comparisonMetrics: {
      fabricCompatibilityScore: 6.0,
      durabilityScore: 8.0,
      quantityFlexibilityScore: 9.5,
      initialInvestmentCost: 'Industrial (>$20,000 USD)',
      costPerUnitSmallRun: 'Medio',
      costPerUnitBulkRun: 'Alto',
      operationalComplexity: 'Alta',
      spaceRequirement: 'Medio (30-60 m²)'
    }
  },

  // 3. Sublimación
  {
    id: 'sublimacion',
    name: 'Sublimación Textil',
    shortDesc: 'Termotransferencia química molecular de tintas dispersas que tiñen permanentemente fibras de poliéster.',
    fullDesc: 'La sublimación es el proceso físico por el cual un tinte sólido pasa directamente a fase gaseosa sin pasar por el estado líquido bajo la acción combinada de alta temperatura (190°C - 205°C) y presión. El gas de tinte penetra en la estructura polimérica abierta del poliéster, quedando atrapado molecularmente al enfriarse.',
    functioning: 'El diseño se imprime con tintas de dispersión sobre papel transfer microporoso especial en espejo. Al cerrarse la prensa térmica a 200°C, las moléculas de poliéster se expanden abriendo sus microporos, mientras la tinta sublima convirtiéndose en gas penetrante. Al retirar la prenda de la prensa y descender la temperatura, los poros del poliéster se sellan herméticamente encapsulando el color. El resultado no genera capa externa, espesor ni tacto en el textil.',
    advantages: [
      'Tacto cero absoluto: la tinta es parte integrante del hilo de la tela.',
      'Transpirabilidad y elasticidad 100% inalteradas: ideal para indumentaria deportiva técnica y de alto rendimiento.',
      'Durabilidad eterna: no se descascara, no se cuartea ni se decolora jamás con los lavados cotidianos.',
      'Colores fluorescentes, neón y cuatricromías ultra saturadas de máximo brillo.',
      'Costo de producción por metro cuadrado sumamente económico en papel e insumos.'
    ],
    disadvantages: [
      'Exclusivo para fibras sintéticas: requiere un mínimo de 70% de poliéster (idealmente 100%).',
      'Incompatible con 100% algodón puro: no reacciona químicamente con fibras celulósicas.',
      'Solo funciona sobre prendas de color blanco o tonos muy claros (los tintes de sublimación son transparentes y no existe tinta blanca de sublimación).'
    ],
    machines: [
      {
        type: 'Plotter o impresora de sublimación piezoeléctrica',
        recommendedBrandsModels: ['Epson SureColor SC-F570 / SC-F6300 / SC-F9400', 'Mimaki TS100-1600 / TS300P', 'Sawgrass Virtuoso SG500 / SG1000', 'Mutoh ValueJet 1638WX'],
        specsNotes: 'Cabezales Epson PrecisionCore con perfiles ICC calibrados para telas deportivas.'
      },
      {
        type: 'Calandra rotativa para rollos o prensa térmica de gran formato',
        recommendedBrandsModels: ['Calandra Transmatic 7360', 'Monti Antonio Mod. 75', 'Prensa STAHLS’ Maxx 40x50', 'Secabo C5 Clam'],
        specsNotes: 'Distribución calórica simétrica y constante sin gradientes en las esquinas.'
      }
    ],
    tools: [
      'Cinta térmica de poliamida resistente a 220°C (evita efecto fantasma / ghosting)',
      'Papel secante kraft absorbente de protección (papel protector superior e inferior)',
      'Rodillo quitapelusas adhesivo industrial',
      'Guantes térmicos de kevlar para manipulación a 200°C'
    ],
    consumables: [
      {
        name: 'Tintas de Sublimación Dispersas',
        category: 'tinta',
        recommendedBrands: ['Epson UltraChrome DS Ink', 'Kiian Hi-Pro Sublimation', 'J-Teck J-Next Subly', 'Sawgrass SubliJet-HD'],
        specifications: 'Colorantes dispersos de alta reactividad térmica y bajo residuo de cenizas.'
      },
      {
        name: 'Papel Transfer para Sublimación Tac / Adherente',
        category: 'papel',
        recommendedBrands: ['Felix Schoeller S-Race Allround 100g', 'TruePix Classic Transfer', 'Coldenhove Jet-X', 'TexPrint-R'],
        specifications: 'Papel tratado con recubrimiento de absorción rápida y adhesivo termofijable ligero (evita movimiento al abrir).'
      }
    ],
    materials: ['Papel de sublimación', 'Cinta térmica Kapton', 'Papel protector kraft sulfito'],
    compatibleFabrics: [
      { fabric: '100% Poliéster Dry-Fit / Microfibra', rating: 'Excelente', notes: 'Sustrato perfecto. Colores fluorescentes y solidez grado 5.' },
      { fabric: 'Poliamida / Spandex / Licra de Base Poliéster', rating: 'Excelente', notes: 'Ideal para calzas, trajes de baño y maillots de ciclismo.' },
      { fabric: 'Mezclas Poly-Cotton (mínimo 70% Poly)', rating: 'Compatible con ajuste', notes: 'Aspecto vintage/lavado. El porcentaje de algodón no retiene el tinte y se aclara.' },
      { fabric: '100% Algodón', rating: 'Incompatible', notes: 'La tinta se disuelve y desvanece por completo en la primera lavada.' }
    ],
    designPreparation: {
      resolutionDpi: '300 DPI a escala 1:1',
      colorModes: ['RGB con perfil ICC específico de la tinta y tela', 'CMYK SWOP v2'],
      vectorRequired: false,
      minLineWeightMm: '0.2 mm',
      whiteUnderbaseReq: 'No existe tinta blanca de sublimación. El blanco proviene del color del tejido de fondo.',
      fileFormats: ['TIFF LZW', 'PDF/X-1a', 'PNG alta resolución', 'EPS'],
      criticalTips: [
        'Imprimir siempre en imagen en espejo (flip horizontal).',
        'Cargar el perfil de color ICC adecuado para la marca de tinta y gramaje de tela específico.',
        'Dejar secar la hoja de papel impresa 10 minutos antes de prensar para evitar halo de evaporación húmeda.'
      ]
    },
    procedure: [
      {
        stepNumber: 1,
        phase: 'Pre-prensa / Preparación',
        title: 'Despeje de impurezas y pre-secado de tela',
        description: 'Pasar rodillo quitapelusas para eliminar micro-partículas azules de celulosa. Planchar la tela sola durante 4 segundos a 200°C para expulsar la humedad de la fibra sintética.',
        durationOrTemp: '200°C / 4 seg'
      },
      {
        stepNumber: 2,
        phase: 'Pre-prensa / Preparación',
        title: 'Fijación con cinta térmica anti-ghosting',
        description: 'Colocar el papel impreso boca abajo sobre la tela. Fijar las esquinas con cinta adhesiva térmica de poliamida para impedir cualquier microdesplazamiento al abrir la prensa.',
        durationOrTemp: 'Cinta Kapton en 4 puntos'
      },
      {
        stepNumber: 3,
        phase: 'Producción / Aplicación',
        title: 'Prensado a alta temperatura',
        description: 'Colocar papel kraft protector debajo y encima. Cerrar la prensa a 200°C con presión media constante durante 45 a 60 segundos.',
        durationOrTemp: '195°C - 205°C / 45 - 60 seg / 3.5 - 4.5 Bares'
      },
      {
        stepNumber: 4,
        phase: 'Post-prensa / Acabado',
        title: 'Retiro vertical e inmediato del papel transfer',
        description: 'Abrir la prensa suavemente y retirar el papel de forma vertical y decidida sin arrastrarlo sobre la prenda aún caliente para evitar duplicación del diseño (ghosting).',
        durationOrTemp: 'Retiro en caliente inmediato (<3 seg)'
      }
    ],
    defaultParameters: {
      tempCelsiusMin: 195,
      tempCelsiusMax: 205,
      tempFahrenheitMin: 383,
      tempFahrenheitMax: 401,
      timeSecondsMin: 45,
      timeSecondsMax: 60,
      pressureLevel: 'Media',
      pressureBars: '3.5 - 4.5 Bar',
      pressurePsi: '40 - 55 PSI',
      speed: '60 m²/hora en plotter industrial de 1.80m; 40 prendas/hora en prensa manual',
      curingMethod: 'Integración gaseosa instantánea en prensa térmica (sin horno posterior)',
      curingTempTime: '200°C por 50 segundos',
      cooling: 'Inmediato (sin enfriamiento)',
      peeling: 'Pelado en Caliente (Hot Peel: 2-4 seg)',
      primaryMaterials: ['100% Poliéster', 'Dry-Fit', 'Microfibra deportiva', 'Spandex/Poliéster'],
      machineModelReference: 'Plotter Epson SureColor SC-F570 / Prensa Insta 256',
      consumableReference: 'Tintas Epson UltraChrome DS + Papel S-Race Allround 100g',
      verifiedSource: 'Guía de Parámetros Oficial Epson Sublimation Technical Lab',
      lastVerifiedDate: '2026-03-01',
      isManufacturerVerified: true,
      manufacturerNotice: 'En mezclas 80/20 reducir a 190°C para no amarillear las fibras de algodón.'
    },
    manufacturerPresets: [
      {
        id: 's_race_dryfit_subli',
        presetName: 'S-Race Lab - Poliéster Deportivo Dry-Fit',
        brand: 'Felix Schoeller',
        equipmentModel: 'Prensa Térmica Plana STAHLS’ Fusion',
        consumableUsed: 'Papel S-Race 100g + Tinta Kiian Hi-Pro',
        substrate: '100% Poliéster interlock dry-fit 140 GSM',
        tempC: 200,
        timeSec: 50,
        pressure: 'Media (4 Bares)',
        peeling: 'Retiro vertical inmediato en caliente',
        prePressSec: 4,
        postPressSec: 0,
        verifiedDate: '2026-02-18',
        sourceDoc: 'Ficha Técnica de Calibración S-Race 2026'
      }
    ],
    finishing: {
      touch: 'Tacto Cero (Inapreciable)',
      gloss: 'Mate',
      elasticity: 'Muy Alta (Bi-stretch)',
      opacityDarkFabrics: 'Baja (Sólo prendas claras)',
      breathability: 'Muy Alta (Tejido respira)'
    },
    care: {
      washTempMaxC: 60,
      washCycle: 'Lavado estándar en lavadora automática',
      turnInsideOut: false,
      bleachAllowed: true,
      tumbleDry: 'Apto secadora industrial',
      ironing: 'Planchar normalmente a temperatura sintética',
      certifiedWashCycles: 90,
      curationTimeBeforeFirstWashHours: 0
    },
    commonProblems: [
      {
        id: 'subli_ghosting',
        symptom: 'Imagen con borde doble o sombra borrosa corrida (efecto fantasma).',
        probableCause: 'El papel transfer se movió al abrir o cerrar la prensa térmica mientras la tinta continuaba emitiendo gas sublimado.',
        technicalSolution: 'Utilizar papel adhesivo térmico (tacky paper) o asegurar el papel con cinta térmica Kapton en cuatro esquinas; abrir la prensa con suavidad.',
        severity: 'Moderado'
      },
      {
        id: 'subli_blue_flecks',
        symptom: 'Aparición de puntos microscópicos azules o rojos intensos dispersos en la prenda blanca.',
        probableCause: 'Pelusas sintéticas o fibras textiles contaminadas en el ambiente que se quemaron y sublimaron durante el prensado.',
        technicalSolution: 'Pasar rodillo adhesivo quitapelusas minuciosamente por toda la superficie de la prenda antes de prensar.',
        severity: 'Preventivo'
      }
    ],
    comparisonMetrics: {
      fabricCompatibilityScore: 4.5,
      durabilityScore: 10.0,
      quantityFlexibilityScore: 9.8,
      initialInvestmentCost: 'Bajo (<$1,000 USD)',
      costPerUnitSmallRun: 'Económico',
      costPerUnitBulkRun: 'Muy Económico',
      operationalComplexity: 'Baja',
      spaceRequirement: 'Escritorio / Taller chico'
    }
  },

  // 4. Vinilo textil (Heat Transfer Vinyl - HTV)
  {
    id: 'vinil_textil',
    name: 'Vinil Textil Termotransferible (HTV)',
    shortDesc: 'Corte vectorial de películas de poliuretano elástico de alta adherencia térmica.',
    fullDesc: 'El vinilo textil termotransferible (HTV - Heat Transfer Vinyl) consiste en una película flexible de poliuretano (PU) montada sobre un transportador adhesivo de poliéster. Se corta mediante un plotter de corte vectorial de cuchilla fina, se retira el material sobrante (weeding/pelado) y se termofija a la prenda con prensa de calor.',
    functioning: 'La cuchilla del plotter penetra con precisión milimétrica la capa de poliuretano de 80 a 95 micras sin cortar el soporte transportador transparente. Tras el descarte manual de los excesos de diseño, el transportador sostiene el arte colocado sobre la prenda. La prensa térmica activa el adhesivo termofusible de poliuretano de base reactiva, soldando la lámina a los poros de la tela.',
    advantages: [
      'Inmejorable opacidad y nitidez de bordes vectoriales con colores 100% sólidos.',
      'Cero inversión inicial en tintas, cabezales, emulsiones o químicos líquidos.',
      'Excelente elasticidad y memoria de forma (especialmente formulaciones PU stretch de alta gama).',
      'Especialmente rentable para dorsales, numeración deportiva, nombres individuales y logotipos monocromos de 1 a 20 unidades.',
      'Disponibilidad de acabados imposibles de lograr con tintas líquidas: metálicos, glitter, holográficos y fotoluminiscentes.'
    ],
    disadvantages: [
      'Trabajo manual de descarte (pelado) sumamente tedioso y costoso en diseños con mucho texto pequeño o tramas complejas.',
      'No permite degradados fotográficos continuos (solo colores planos por capas superpuestas).',
      'Puede sentirse gomoso o pesado al tacto si se aplican artes de gran tamaño.',
      'Las capas múltiples superpuestas aumentan el grosor total de la prenda.'
    ],
    machines: [
      {
        type: 'Plotter de corte tangencial o de arrastre de cuchilla',
        recommendedBrandsModels: ['Roland CAMM-1 GS-24', 'Graphtec CE7000-60 / FC9000', 'Summa S One D60', 'Silhouette Cameo 5 Pro'],
        specsNotes: 'Sensor óptico de marcas de registro y presión de corte ajustable de 20g a 500g.'
      },
      {
        type: 'Prensa térmica plana neumática o manual con presión regulable',
        recommendedBrandsModels: ["STAHLS' MAXX 38x38", 'Siser Digital Heat Press', 'Secabo TC5 SMART'],
        specsNotes: 'Termostato digital y plato con teflonado antiadherente.'
      }
    ],
    tools: [
      'Pinza o gancho pelador de precisión (weeding tool) con punta de acero quirúrgico',
      'Cuchilla giratoria de 45° (vinilos estándar) y 60° (vinilos gruesos o flock)',
      'Lámina de teflón protector reutilizable o papel vegetal sulfurizado',
      'Almohadilla de prensado térmica (heat press pillow) para salvar botones o costuras'
    ],
    consumables: [
      {
        name: 'Película de Poliuretano HTV Termotransferible',
        category: 'vinilo',
        recommendedBrands: ['Siser P.S. Film / EasyWeed', "STAHLS' CAD-CUT Premium Plus", 'Poli-Tape Poli-Flex Premium', 'Chemica QuickFlex'],
        specifications: 'Espesor 85 - 90 micras, soporte de poliéster adhesivo, certificación OEKO-TEX Standard 100 Clase 1.'
      }
    ],
    materials: ['Vinilo textil de poliuretano', 'Transportador de poliéster adhesivo'],
    compatibleFabrics: [
      { fabric: '100% Algodón', rating: 'Excelente', notes: 'Fusión perfecta con el adhesivo termofusible.' },
      { fabric: '100% Poliéster', rating: 'Excelente', notes: 'Utilizar vinilos low-temp (120°C - 130°C) para evitar marcas de quemado en tela.' },
      { fabric: 'Elastano / Spandex / Licra', rating: 'Excelente', notes: 'Requiere vinilo HTV formulación elástica (Siser Stretch o STAHLS’ Super Stretch).' },
      { fabric: 'Nylon / Cordura impermeable', rating: 'Compatible con ajuste', notes: 'Requiere vinilo formulado para poliamida resinada (Siser Extra o Poli-Tape Nylon).' }
    ],
    designPreparation: {
      resolutionDpi: 'Diseño 100% vectorial vectorial nativo en curvas',
      colorModes: ['Color plano vectorial'],
      vectorRequired: true,
      minLineWeightMm: '0.8 mm (trazos menores son sumamente difíciles de pelar a mano)',
      whiteUnderbaseReq: 'No aplica (los vinilos blancos son 100% opacos por naturaleza)',
      fileFormats: ['SVG vectorial', 'AI (Adobe Illustrator)', 'EPS', 'DXF'],
      criticalTips: [
        'Espejar siempre el diseño antes de mandar a cortar en el software del plotter.',
        'Realizar un corte de prueba de 2x2 cm con cuadrado y triángulo interior para calibrar fuerza y salida de cuchilla antes de cortar el pliego completo.',
        'Unir las líneas superpuestas con Pathfinder/Buscatrazos para evitar cortes dobles.'
      ]
    },
    procedure: [
      {
        stepNumber: 1,
        phase: 'Pre-prensa / Preparación',
        title: 'Corte en espejo en plotter vectorial',
        description: 'Colocar el vinilo con la cara brillante del transportador hacia abajo. Cortar en espejo asegurando que la cuchilla corte solo el vinilo de color sin atravesar el soporte plástico.',
        durationOrTemp: 'Cuerpos de cuchilla a 45°, presión 80-110g'
      },
      {
        stepNumber: 2,
        phase: 'Pre-prensa / Preparación',
        title: 'Pelado y descarte manual (Weeding)',
        description: 'Retirar con la pinza o punzón de acero todo el material sobrante que no forme parte del diseño gráfico.',
        durationOrTemp: 'Manual según complejidad del diseño'
      },
      {
        stepNumber: 3,
        phase: 'Producción / Aplicación',
        title: 'Pre-planchado y posicionamiento',
        description: 'Planchar la prenda textil durante 3 segundos para alisar y quitar humedad. Posicionar el diseño con el soporte adhesivo sobre la tela.',
        durationOrTemp: '150°C / 3 seg pre-planchado'
      },
      {
        stepNumber: 4,
        phase: 'Producción / Aplicación',
        title: 'Termofijación en prensa térmica',
        description: 'Cubrir con teflón y prensar a 150°C - 160°C con presión media-alta durante 10 a 15 segundos.',
        durationOrTemp: '150°C / 12 - 15 seg / 3.5 - 4.5 Bares'
      },
      {
        stepNumber: 5,
        phase: 'Post-prensa / Acabado',
        title: 'Pelado del transportador (según fabricante)',
        description: 'Retirar el plástico transportador en caliente o frío según la ficha de la marca (ej: Siser EasyWeed permite pelado en caliente inmediato; otros requieren tibio).',
        durationOrTemp: 'Pelado en caliente o tibio según ficha técnica'
      }
    ],
    defaultParameters: {
      tempCelsiusMin: 140,
      tempCelsiusMax: 160,
      tempFahrenheitMin: 284,
      tempFahrenheitMax: 320,
      timeSecondsMin: 10,
      timeSecondsMax: 15,
      pressureLevel: 'Media-Alta',
      pressureBars: '3.5 - 4.5 Bar',
      pressurePsi: '45 - 55 PSI',
      speed: '15 a 40 cm/s de velocidad de corte en plotter tangencial',
      curingMethod: 'Termo-fusión instantánea por calor en prensa plana',
      curingTempTime: '150°C por 15 segundos',
      cooling: 'Disipación rápida al aire',
      peeling: 'Pelado en Caliente (Hot Peel: 2-4 seg)',
      primaryMaterials: ['100% Algodón', 'Mezclas Poly-Cotton', 'Poliéster deportivo'],
      machineModelReference: 'Plotter Roland CAMM-1 GS-24 / Prensa Siser Digital',
      consumableReference: 'Siser P.S. Film / EasyWeed Poliuretano 90 micras',
      verifiedSource: "Ficha Técnica Oficial Siser Italy & STAHLS' CAD-CUT Spec Sheet",
      lastVerifiedDate: '2026-02-28',
      isManufacturerVerified: true,
      manufacturerNotice: 'Para poliéster 100% o prendas técnicas elásticas, usar la serie EasyWeed Stretch a 155°C por 15s con pelado en frío.'
    },
    manufacturerPresets: [
      {
        id: 'siser_easyweed_cotton',
        presetName: 'Siser EasyWeed - Algodón y Poliéster',
        brand: 'Siser Italy',
        equipmentModel: 'Prensa Plana Manual TS One',
        consumableUsed: 'Siser P.S. Film / EasyWeed PU 90u',
        substrate: '100% Algodón / Mezcla 50-50',
        tempC: 150,
        timeSec: 15,
        pressure: 'Media (3.5 Bares)',
        peeling: 'Pelado en Caliente o Frío indistintamente',
        prePressSec: 3,
        postPressSec: 2,
        verifiedDate: '2026-02-15',
        sourceDoc: 'Siser Technical Product Specification Sheet 2026'
      }
    ],
    finishing: {
      touch: 'Engomado Elástico',
      gloss: 'Satinado',
      elasticity: 'Alta',
      opacityDarkFabrics: 'Opacidad Total 100%',
      breathability: 'Baja (Efecto barrera)'
    },
    care: {
      washTempMaxC: 40,
      washCycle: 'Lavado al revés, ciclo estándar suave sin suavizantes agresivos',
      turnInsideOut: true,
      bleachAllowed: false,
      tumbleDry: 'Baja temperatura ciclo delicado',
      ironing: 'Planchar del revés sin vapor',
      certifiedWashCycles: 60,
      curationTimeBeforeFirstWashHours: 24
    },
    commonProblems: [
      {
        id: 'htv_lifting_corners',
        symptom: 'Las esquinas del vinilo se despegan tras el primer ciclo de lavado en lavadora.',
        probableCause: 'Presión insuficiente en la prensa térmica o no haber pre-planchado la prenda para retirar humedad antes de aplicar.',
        technicalSolution: 'Aumentar la presión de la prensa térmica a Media-Alta (4 Bares). Presionar con firmeza y hacer un segundo planchado de 3 segundos protegido con teflón.',
        severity: 'Crítico'
      },
      {
        id: 'htv_cracking',
        symptom: 'El vinilo se agrieta o raja horizontalmente cuando la prenda se estira en el cuerpo.',
        probableCause: 'Se utilizó vinilo de poliuretano rígido o PVC económico sobre una prenda con spandex o tejido acanalado elástico.',
        technicalSolution: 'Cambiar a formulación especial elástica de alto contenido de elastómero (ej: Siser Stretch o CAD-CUT Premium Plus).',
        severity: 'Moderado'
      }
    ],
    comparisonMetrics: {
      fabricCompatibilityScore: 8.5,
      durabilityScore: 8.5,
      quantityFlexibilityScore: 9.5,
      initialInvestmentCost: 'Bajo (<$1,000 USD)',
      costPerUnitSmallRun: 'Económico',
      costPerUnitBulkRun: 'Alto',
      operationalComplexity: 'Baja',
      spaceRequirement: 'Escritorio / Taller chico'
    }
  },

  // 5. Serigrafía (Marco y Malla Tradicional)
  {
    id: 'serigrafia',
    name: 'Serigrafía Textil Tradicional',
    shortDesc: 'Transferencia mecánica de tinta a través de pantallas tensadas con emulsión fotosensible fotograbada.',
    fullDesc: 'La serigrafía es la técnica industrial reina de la personalización textil a gran escala. Utiliza marcos tensados con malla de poliéster monofilamento emulsionada y expuesta a rayos UV. La tinta es forzada a través de las aperturas abiertas de la malla sobre el tejido mediante una racleta o rasqueta de poliuretano vulcanizado.',
    functioning: 'Cada color del diseño se separa en un fotolito monocromático tramado. El marco con malla emulsionada se expone a luz UV en una insoladora; las zonas transparentes del fotolito dejan pasar la luz endureciendo la emulsión, mientras las zonas negras bloquean la luz y se lavan con agua a presión. En el pulpo serigráfico, la racleta ejerce un ángulo de 45° a 75° depositando una película milimétrica controlada de tinta sobre la prenda. La tinta se pre-seca con un flash cure y se polimeriza en túnel de secado a 160°C.',
    advantages: [
      'El costo unitario más bajo del mercado para producciones medianas y masivas (de 50 a miles de unidades).',
      'Durabilidad legendaria: soporta más de 80 lavados manteniendo vivacidad de color.',
      'Compatibilidad con cualquier tipo de tinta y efecto especial (tintas plastisol, discharge, base agua, puff, metálicos, glitter, caviar).',
      'Reproducción exacta de colores corporativos certificados mediante fórmulas Pantone Matching System (PMS).',
      'Velocidad de producción inalcanzable por métodos digitales en talleres automatizados (500-1000 prendas/hora).'
    ],
    disadvantages: [
      'Costo y tiempo de preparación inicial elevados (fotolitos, grabado de pantallas, recuperación química y registro de colores).',
      'No es rentable económicamente para tiradas pequeñas (menos de 24-30 unidades por diseño).',
      'Requiere espacio de taller considerable para insolado, lavado, pulpo y túnel de secado con extracción de gases.',
      'Los degradados fotográficos requieren técnicas avanzadas de separación de color simulado o cuatricromía CMYK.'
    ],
    machines: [
      {
        type: 'Pulpo serigráfico manual o automático',
        recommendedBrandsModels: ['MHM S-Type Xtreme', 'ROQ NEXT / ROQ YOU', 'Anatol Titan', 'Vastex V-2000HD'],
        specsNotes: 'Microrregistro tridimensional en cabezales con sujeción neumática de pantallas.'
      },
      {
        type: 'Insoladora UV de vacío y túnel de secado infrarrojo/gas',
        recommendedBrandsModels: ['Insoladora LED Vastex E-2000', 'Túnel Vastex D-100 / LittleRed X3', 'M&R Sprint Gas Dryer'],
        specsNotes: 'Control digital de flujo de aire y temperatura constante en cámara de calor.'
      }
    ],
    tools: [
      'Racletas / rasquetas de serigrafía (gomas de 65, 75 o triple dureza 70/90/70 Shore A)',
      'Marcos de aluminio tensados neumáticamente con malla monofilamento (43T, 55T, 77T, 90T, 120T)',
      'Emulsionadora de canal de aluminio para aplicación bicapa de emulsión',
      'Espátulas de acero inoxidable para mezcla y carga de tintas',
      'Termómetro láser infrarrojo o tiras termosensibles de calibración Donut Probe'
    ],
    consumables: [
      {
        name: 'Tintas Plastisol o Tintas Base Agua Serigráficas',
        category: 'tinta',
        recommendedBrands: ['Rutland M3 Ink System', 'Wilflex Epic Series', 'MagnaColours MagnaPrint', 'Nazdar 7900 Series'],
        specifications: 'Resinas libres de ftalatos y metales pesados con alta tixotropía y cobertura.'
      },
      {
        name: 'Emulsión Fotosensible de Grabado',
        category: 'quimico',
        recommendedBrands: ['Ulano Prochem QX-1', 'Kiwo Polycol Uno', 'Murakami One Pot Sol', 'Saati Prochem'],
        specifications: 'Emulsión fotopolímera pura de rápida exposición resistente a solventes y agua.'
      }
    ],
    materials: ['Fotolitos en poliéster mate', 'Marcos de aluminio', 'Emulsión UV', 'Disolvente recuperador biodegradable'],
    compatibleFabrics: [
      { fabric: '100% Algodón Peinado', rating: 'Excelente', notes: 'Sustrato rey para plastisol, discharge y base agua.' },
      { fabric: 'Mezclas Poly-Cotton 50/50', rating: 'Excelente', notes: 'Requiere tinta plastisol low-bleed para bloquear sublimación del poliéster.' },
      { fabric: '100% Poliéster técnico', rating: 'Compatible con ajuste', notes: 'Obligatorio usar base gris de bloqueo anti-migración (Polyester Barrier Underbase).' },
      { fabric: 'Nailon impermeable y Cortavientos', rating: 'Compatible con ajuste', notes: 'Requiere aditivo catalizador promotor de adherencia (Nylon Bonding Catalyst).' }
    ],
    designPreparation: {
      resolutionDpi: '300 DPI a escala real con fotolitos de alta densidad óptica (Dmax > 3.5)',
      colorModes: ['Separación de color por canales Pantone o Simulado Spot Color'],
      vectorRequired: false,
      minLineWeightMm: '0.4 mm para mallas estándar 55T; 0.25 mm en mallas de alta definición 90T-120T',
      whiteUnderbaseReq: 'Base blanca con rebaje (choke) de 0.5 a 1 punto tipográfico para evitar desfasajes en el registro',
      fileFormats: ['Photoshop DCS 2.0 con canales de tintas planas', 'AI vectorial con capas Pantone', 'PDF de alta separación'],
      criticalTips: [
        'Agregar siempre cruces de registro micrométrico en las cuatro esquinas de cada fotolito.',
        'Usar tramas de semitono elípticas a 45-55 LPI (líneas por pulgada) con ángulo de 22.5° para evitar muaré.'
      ]
    },
    procedure: [
      {
        stepNumber: 1,
        phase: 'Pre-prensa / Preparación',
        title: 'Emulsionado, secado e insolado de pantallas',
        description: 'Aplicar emulsión fotopolímera 1x1 o 2x1 en la malla limpia y desengrasada. Secar en cámara oscura y exponer con los fotolitos en insoladora UV de vacío. Revelar con agua a presión suave hasta abrir el diseño.',
        durationOrTemp: 'Exposición UV 15-45 seg según fuente LED'
      },
      {
        stepNumber: 2,
        phase: 'Pre-prensa / Preparación',
        title: 'Montaje y microrregistro en pulpo serigráfico',
        description: 'Fijar las pantallas en el pulpo serigráfico y alinear perfectamente las cruces de registro de cada color sobre una prenda de prueba.',
        durationOrTemp: '10-25 minutos por batería de colores'
      },
      {
        stepNumber: 3,
        phase: 'Producción / Aplicación',
        title: 'Tirada de impresión con flash intermedio',
        description: 'Imprimir la base blanca con racleta en ángulo de 60°. Aplicar flash cure para gelatinizar la tinta (110°C por 4-6 segundos). Imprimir los colores superiores húmedo sobre seco.',
        durationOrTemp: 'Flash cure 110°C / 5 seg por estación'
      },
      {
        stepNumber: 4,
        phase: 'Post-prensa / Acabado',
        title: 'Polimerizado y curado completo en túnel de secado',
        description: 'Pasar las prendas a través del túnel de calor infrarrojo o convección a 160°C asegurando que toda la película de tinta alcance la temperatura de curado durante al menos 60 segundos continuos.',
        durationOrTemp: '160°C en masa de tinta / 60-90 seg en túnel'
      }
    ],
    defaultParameters: {
      tempCelsiusMin: 155,
      tempCelsiusMax: 165,
      tempFahrenheitMin: 311,
      tempFahrenheitMax: 329,
      timeSecondsMin: 60,
      timeSecondsMax: 90,
      pressureLevel: 'Alta',
      pressureBars: 'Presión manual firme de racleta o 4.5-6 Bares en pulpo automático',
      pressurePsi: '60 - 75 PSI neumático',
      speed: '80 a 150 prendas/hora en pulpo manual; 500 a 900 prendas/hora en pulpo automático ROQ/MHM',
      curingMethod: 'Túnel de secado infrarrojo de aire forzado continuo o túnel a gas',
      curingTempTime: '160°C garantizado en la superficie de la tinta por 60 segundos',
      cooling: 'Disipación rápida al aire',
      peeling: 'No aplica (Impresión directa o bordado)',
      primaryMaterials: ['100% Algodón', 'Mezclas Poly-Cotton', 'Algodón ring-spun'],
      machineModelReference: 'Pulpo ROQ NEXT Automático / Túnel Vastex LittleRed X3',
      consumableReference: 'Tintas Rutland M3 Plastisol + Emulsión Ulano QX-1',
      verifiedSource: 'Guía de Estándares FESPA Screen Printing Technical Compendium',
      lastVerifiedDate: '2026-03-10',
      isManufacturerVerified: true,
      manufacturerNotice: 'La temperatura debe medirse directamente sobre la capa de tinta con termómetro infrarrojo calibrado.'
    },
    manufacturerPresets: [
      {
        id: 'rutland_plastisol_cure',
        presetName: 'Rutland Ink Lab - Curado Completo Plastisol',
        brand: 'Rutland Plastic Technologies',
        equipmentModel: 'Túnel Infrarrojo Textil',
        consumableUsed: 'Rutland M3 Premium Mixing System',
        substrate: '100% Algodón 200 GSM',
        tempC: 160,
        timeSec: 60,
        pressure: 'Presión 5.0 Bar en rasqueta automática Shore 75',
        peeling: 'No aplica',
        prePressSec: 0,
        postPressSec: 0,
        verifiedDate: '2026-02-10',
        sourceDoc: 'Rutland Technical Bulletin Plastisol Curing 2026'
      }
    ],
    finishing: {
      touch: 'Mano Media',
      gloss: 'Satinado',
      elasticity: 'Alta',
      opacityDarkFabrics: 'Opacidad Total 100%',
      breathability: 'Media'
    },
    care: {
      washTempMaxC: 60,
      washCycle: 'Lavado industrial o doméstico con agua tibia',
      turnInsideOut: true,
      bleachAllowed: false,
      tumbleDry: 'Apto secadora industrial',
      ironing: 'Planchar del revés sin vapor (no planchar directamente sobre el plastisol)',
      certifiedWashCycles: 85,
      curationTimeBeforeFirstWashHours: 24
    },
    commonProblems: [
      {
        id: 'seri_under_cure',
        symptom: 'La tinta se cuartea, agrieta o se desprende parcialmente con el agua al primer lavado.',
        probableCause: 'Curado deficiente (sub-curado): la masa de tinta no alcanzó los 160°C en toda su profundidad en el túnel de secado.',
        technicalSolution: 'Aumentar la temperatura del túnel o reducir la velocidad de la cinta transportadora; verificar la temperatura con la sonda térmica Donut Probe.',
        severity: 'Crítico'
      },
      {
        id: 'seri_screen_clog',
        symptom: 'Pérdida de definición en detalles o zonas vacías donde la tinta no pasa hacia la tela.',
        probableCause: 'Secado de tinta en la malla (frecuente en tintas base agua) o emulsión mal expuesta que se desprendió.',
        technicalSolution: 'Mantener la pantalla inundada de tinta entre estampada y estampada (flood stroke); aplicar retardante de secado ecológico.',
        severity: 'Moderado'
      }
    ],
    comparisonMetrics: {
      fabricCompatibilityScore: 9.0,
      durabilityScore: 9.5,
      quantityFlexibilityScore: 3.0,
      initialInvestmentCost: 'Alto ($6,000-$20,000 USD)',
      costPerUnitSmallRun: 'No recomendado',
      costPerUnitBulkRun: 'Muy Económico',
      operationalComplexity: 'Alta',
      spaceRequirement: 'Industrial ventilado (>80 m²)'
    }
  },

  // 6. Bordado Computarizado
  {
    id: 'bordado',
    name: 'Bordado Computarizado Industrial',
    shortDesc: 'Matrices de digitalización vectorial ejecutadas por cabezales automáticos de alta velocidad con hilos de poliéster y viscosa.',
    fullDesc: 'El bordado computarizado es la técnica de mayor prestigio, elegancia y valor percibido en el mercado textil corporativo y de uniformes. Convierte gráficos vectoriales en instrucciones de puntadas mediante software de ponchado (Wilcom / Tajima DG/ML), las cuales son cosidas por agujas industriales sobre la prenda tensada con entretelas estabilizadoras.',
    functioning: 'El diseño se digitaliza calculando tipo de puntada (satín, tatami/relleno o pespunte), densidad de hilos y compensación de estiramiento (pull compensation). La máquina mueve un bastidor pantógrafo en los ejes X-Y a velocidades de 600 a 1000 puntadas por minuto mientras la aguja entrelaza el hilo superior de color con el hilo inferior de la canilla (bobbin thread). Las entretelas (backing) garantizan que la tela no se deforme ni frunza.',
    advantages: [
      'Máximo prestigio y durabilidad física: resiste lavados industriales a 90°C y uso extremo por años.',
      'Textura tridimensional real con brillo elegante de hilos trilobales.',
      'Excelente comportamiento en prendas pesadas, gorras estructuradas, polar, chaquetas softshell y camisas piqué.',
      'No se desgasta con la fricción ni se decolora con el sol (hilos 100% poliéster Polyneon).'
    ],
    disadvantages: [
      'No reproduce degradados continuos fotográficos complejos.',
      'Letras menores a 4.5 mm pierden legibilidad y saturan el tejido.',
      'Costo de digitalización/ponchado inicial de la matriz.',
      'En telas muy ligeras o delgadas (camisetas finas 120g) puede resultar pesado y arrugar la tela.'
    ],
    machines: [
      {
        type: 'Bordadora industrial multicabezal (1 a 12 cabezales con 12 a 15 agujas por cabezal)',
        recommendedBrandsModels: ['Tajima TMEZ-SC / TMARK', 'Barudan BEXY / BEKT', 'Brother PR1055X / BE-1204', 'HappyJapan HCD3 / HCR3'],
        specsNotes: 'Corte automático de hilo, cambio rápido de color y sistema de sensor inteligente de tensión.'
      }
    ],
    tools: [
      'Bastidores de tensión rápida magnéticos (Mighty Hoop)',
      'Tijeras de cigüeña / precisión para corte de saltos de hilo',
      'Aceite lubricante blanco de grado textil para garfio rotativo',
      'Pinzas enhebradoras de aguja de punta fina',
      'Pistola de vapor o plancha para disolver entretelas hidrosolubles'
    ],
    consumables: [
      {
        name: 'Hilos de Bordar 100% Poliéster Trilobal No. 40',
        category: 'hilo',
        recommendedBrands: ['Madeira Polyneon 40', 'Isacord Polyester 40', 'Gunold Poly 40', 'Marathon Embroidery Thread'],
        specifications: 'Resistencia a la rotura por tracción > 1200 cN, resistencia al cloro y lavado a 95°C.'
      },
      {
        name: 'Entretelas Estabilizadoras (Tear-Away / Cut-Away)',
        category: 'adhesivo',
        recommendedBrands: ['Vilene Freudenberg', 'Madeira E-Zee Backing', 'Gunold Stiffy 1640'],
        specifications: 'Entretela no-tejida de 40 a 80 GSM para soporte estructural dimensional.'
      }
    ],
    materials: ['Hilos superiores', 'Hilo de bobina 60wt', 'Entretela rasgable o de corte', 'Agujas Groz-Beckert DBxK5'],
    compatibleFabrics: [
      { fabric: 'Camisas Polo Piqué', rating: 'Excelente', notes: 'Sustrato corporativo por excelencia.' },
      { fabric: 'Gorras Trucker, Snapback y Flexfit', rating: 'Excelente', notes: 'Requiere bastidor de gorras rotativo de 270°.' },
      { fabric: 'Polar, Felpa y Hoodies Gruesos', rating: 'Excelente', notes: 'Utilizar entretela soluble superior (solvy topping) para evitar que las puntadas se hundan en el pelo.' },
      { fabric: 'Camisetas Ligeras (<140 GSM)', rating: 'Compatible con ajuste', notes: 'Reducir densidad de puntada y usar entretela cut-away suave para no romper el tejido.' }
    ],
    designPreparation: {
      resolutionDpi: 'Diseño vectorial o mapa de bits de referencia para ponchado en software de bordado',
      colorModes: ['Catálogos de hilos Madeira Polyneon / Isacord'],
      vectorRequired: true,
      minLineWeightMm: 'Grosor mínimo de columna satín: 1.0 mm; Altura mínima de letra: 4.5 a 5.0 mm',
      whiteUnderbaseReq: 'Puntadas de asiento (underlay / tatami base) para anclar la tela antes de las puntadas de cobertura',
      fileFormats: ['DST (Tajima estándar)', 'PES (Brother)', 'EMB (Wilcom nativo)', 'EXP (Melco)'],
      criticalTips: [
        'Ajustar la compensación de tiro (Pull Compensation) entre 0.20 mm y 0.40 mm para compensar la contracción del hilo.',
        'Incluir siempre puntada de remate al inicio y fin de cada corte de hilo para evitar deshilachado.'
      ]
    },
    procedure: [
      {
        stepNumber: 1,
        phase: 'Pre-prensa / Preparación',
        title: 'Digitalización y ponchado de matriz',
        description: 'Crear la matriz de puntadas en software especializado asignando secuencias lógicas de color y tipos de puntada.',
        durationOrTemp: 'Software Wilcom EmbroideryStudio'
      },
      {
        stepNumber: 2,
        phase: 'Pre-prensa / Preparación',
        title: 'Enbastorado con entretela estabilizadora',
        description: 'Tensar la prenda en el bastidor colocando una lámina de entretela no tejida por debajo para impedir deformaciones.',
        durationOrTemp: 'Bastidor magnético tenso como un tambor'
      },
      {
        stepNumber: 3,
        phase: 'Producción / Aplicación',
        title: 'Bordado en máquina industrial',
        description: 'Cargar el archivo en la bordadora, calibrar velocidad entre 700 y 850 RPM y ejecutar el ciclo automático.',
        durationOrTemp: '600 - 850 RPM según complejidad de puntadas'
      },
      {
        stepNumber: 4,
        phase: 'Post-prensa / Acabado',
        title: 'Limpieza de saltos y retiro de entretela',
        description: 'Recortar hilos sobrantes de saltos de aguja y retirar la entretela rasgable o cortar los excesos dejando 5 mm de borde.',
        durationOrTemp: 'Manual con tijera de precisión'
      }
    ],
    defaultParameters: {
      tempCelsiusMin: 0,
      tempCelsiusMax: 0,
      tempFahrenheitMin: 0,
      tempFahrenheitMax: 0,
      timeSecondsMin: 180,
      timeSecondsMax: 480,
      pressureLevel: 'No aplica',
      speed: '650 a 850 puntadas por minuto (SPM) en producción estándar; 600 SPM en gorras',
      curingMethod: 'Entrelazado mecánico de hilo (no requiere calor ni curado químico)',
      cooling: 'No aplica',
      peeling: 'No aplica (Impresión directa o bordado)',
      primaryMaterials: ['Piqué', 'Algodón pesado', 'Telas de gorra', 'Softshell', 'Polar'],
      machineModelReference: 'Tajima TMEZ-SC1501 / Barudan BEXY-S1501',
      consumableReference: 'Hilos Madeira Polyneon No. 40 + Agujas Groz-Beckert DBxK5 75/11',
      verifiedSource: 'Manual de Ponchado y Estandarización Técnica Tajima & Madeira Embroidery Guidelines',
      lastVerifiedDate: '2026-03-05',
      isManufacturerVerified: true,
      manufacturerNotice: 'La velocidad de la máquina debe reducirse a 600 RPM al bordar gorras armadas o hilos metálicos.'
    },
    manufacturerPresets: [
      {
        id: 'tajima_polo_piquet',
        presetName: 'Tajima Lab - Polo Piqué Algodón Corporativo',
        brand: 'Tajima Industries',
        equipmentModel: 'TMEZ-SC Single Head',
        consumableUsed: 'Madeira Polyneon 40 + Entretela Cut-Away 60g',
        substrate: 'Piqué de algodón peinado 220 GSM',
        tempC: 0,
        timeSec: 320,
        pressure: 'No aplica',
        peeling: 'No aplica',
        prePressSec: 0,
        postPressSec: 0,
        verifiedDate: '2026-02-12',
        sourceDoc: 'Tajima Technical Operations Manual 2026'
      }
    ],
    finishing: {
      touch: 'Puntadas Bordadas',
      gloss: 'Brillante',
      elasticity: 'Baja',
      opacityDarkFabrics: 'Opacidad Total 100%',
      breathability: 'Alta'
    },
    care: {
      washTempMaxC: 90,
      washCycle: 'Lavado industrial o doméstico de máxima resistencia',
      turnInsideOut: false,
      bleachAllowed: true,
      tumbleDry: 'Apto secadora industrial',
      ironing: 'Planchar con un paño sobre el bordado por el revés',
      certifiedWashCycles: 120,
      curationTimeBeforeFirstWashHours: 0
    },
    commonProblems: [
      {
        id: 'embroidery_puckering',
        symptom: 'La tela se arruga o frunce alrededor del logotipo formando bolsas antiestéticas.',
        probableCause: 'Tensión excesiva del hilo superior, entretela demasiado liviana o enbastorado deficiente con tela floja.',
        technicalSolution: 'Aflojar la tensión del hilo superior; usar entretela Cut-Away de al menos 70g y tensar la tela uniformemente en bastidor.',
        severity: 'Moderado'
      },
      {
        id: 'embroidery_thread_break',
        symptom: 'Roturas continuas de hilo superior durante la costura a alta velocidad.',
        probableCause: 'Aguja despuntada o rebabada, ojo de aguja demasiado pequeño para el hilo, o rebaba en el garfio rotativo.',
        technicalSolution: 'Cambiar aguja por Groz-Beckert nueva 75/11 o 80/12; lubricar el garfio con una gota de aceite blanco.',
        severity: 'Moderado'
      }
    ],
    comparisonMetrics: {
      fabricCompatibilityScore: 8.0,
      durabilityScore: 10.0,
      quantityFlexibilityScore: 7.5,
      initialInvestmentCost: 'Industrial (>$20,000 USD)',
      costPerUnitSmallRun: 'Medio',
      costPerUnitBulkRun: 'Económico',
      operationalComplexity: 'Alta',
      spaceRequirement: 'Medio (30-60 m²)'
    }
  },

  // 7. UV DTF (Direct to Film UV)
  {
    id: 'uv_dtf',
    name: 'UV DTF (Direct-to-Film Ultravioleta)',
    shortDesc: 'Impresión digital con curado UV instantáneo sobre film film A transferible a sustratos rígidos y merchandising textil.',
    fullDesc: 'UV DTF combina la impresión de tintas UV curables con barniz brillante sobre una película film A que luego se lamina con un film B transportador. Permite crear etiquetas y calcomanías permanentes de ultra alta adherencia con relieve táctil 3D (barniz localizado) aplicables en frío por frotado manual sobre termos, botellas, gorras rígidas, etiquetas colgantes y accesorios.',
    functioning: 'El cabezal deposita tintas UV CMYK + White + Varnish sobre el Film A. Lámparas LED UV integradas curan la tinta de forma instantánea al 100%. A continuación, el film A impreso pasa por una laminadora en frío que aplica el film B (adhesivo de transferencia de alta resistencia). Para transferir, se recorta el motivo, se retira el Film A, se aplica sobre el objeto mediante presión manual uniforme y se retira el film transportador B.',
    advantages: [
      'Sin prensa térmica: se aplica en frío 100% mediante presión manual en segundos.',
      'Capacidad de acabado tridimensional con barniz sectorizado brillante de gran impacto visual.',
      'Adherencia ultra potente en superficies difíciles: metal, cerámica, vidrio, madera lacada, cuero rígido y acrílicos.',
      'Resistencia extrema a los arañazos, intemperie exterior y agua.'
    ],
    disadvantages: [
      'No es apto para prendas textiles flexibles con estiramiento elástico (se quebraría al estirar).',
      'Costo relativamente elevado del conjunto de films dobles A y B.',
      'Requiere máquina laminadora con rodillos calibrados sin burbujas.'
    ],
    machines: [
      {
        type: 'Impresora UV Híbrida de bobina con curado LED UV',
        recommendedBrandsModels: ['Audley UV DTF 60', 'Roland VersaUV LEC2-330', 'DTFStation UV Prestige A3', 'Mimaki UJF-3042 MkII'],
        specsNotes: 'Lámparas LED UV refrigeradas por agua y cabezales piezoeléctricos con canal de barniz.'
      },
      {
        type: 'Laminadora continua de rodillos fríos/tibios',
        recommendedBrandsModels: ['Laminadora UV DTF integrada con control de tensión'],
        specsNotes: 'Rodillos de silicona antiestáticos con presión micrométrica.'
      }
    ],
    tools: [
      'Espátula de fieltro para aplicación manual (squeegee aplicador)',
      'Cúter de precisión o tijera bisturí para recorte de transfers',
      'Alcohol isopropílico para desengrase previo de sustratos rígidos'
    ],
    consumables: [
      {
        name: 'Tintas UV Curables Flexibles + Barniz UV',
        category: 'tinta',
        recommendedBrands: ['Audley UV Eco Inks', 'Roland ECO-UV 5', 'Nazdar 260 Series UV'],
        specifications: 'Fotoiniciadores de polimerización UV con longitud de onda 395nm.'
      },
      {
        name: 'Set de Films A (Base Adhesiva) y B (Transportador)',
        category: 'film',
        recommendedBrands: ['Film UV DTF Crystal Clear A+B 3M Grade'],
        specifications: 'Adhesivo acrílico de alta fuerza de cizallamiento con liberación controlada.'
      }
    ],
    materials: ['Film A', 'Film B', 'Tintas UV', 'Barniz brillante'],
    compatibleFabrics: [
      { fabric: 'Accesorios rígidos (Botellas, Termos, Mugs, Placas metálicas)', rating: 'Excelente', notes: 'Sustrato primario con adherencia permanente.' },
      { fabric: 'Cuero rígido, Maletines y Agendas', rating: 'Excelente', notes: 'Excelente presentación y brillo de barniz.' },
      { fabric: 'Viseras rígidas de gorras', rating: 'Compatible con ajuste', notes: 'En zonas donde no exista elasticidad de tela.' },
      { fabric: 'Camisetas de algodón flexible', rating: 'Incompatible', notes: 'No es para telas elásticas: la película se quiebra al estirarse.' }
    ],
    designPreparation: {
      resolutionDpi: '300 DPI a escala real 1:1',
      colorModes: ['CMYK con canales Spot para Blanco y Barniz (Varnish)'],
      vectorRequired: false,
      minLineWeightMm: '0.3 mm para barniz y líneas finas',
      whiteUnderbaseReq: 'Canal Spot dedicado para blanco base opaco',
      fileFormats: ['PDF con capas Spot', 'TIFF multicapa', 'AI con tintas directas'],
      criticalTips: [
        'El canal de barniz brillante (Gloss) debe tener un ligero rebase exterior para sellar los bordes de la tinta.',
        'Limpiar la superficie receptora con alcohol isopropílico al 70% antes de frotar la calcomanía.'
      ]
    },
    procedure: [
      {
        stepNumber: 1,
        phase: 'Pre-prensa / Preparación',
        title: 'Impresión y curado LED UV simultáneo en Film A',
        description: 'Imprimir primero el barniz, luego el color CMYK y la base blanca sobre el Film A, curándose inmediatamente bajo las lámparas LED UV.',
        durationOrTemp: 'Lámparas LED UV 395nm activas'
      },
      {
        stepNumber: 2,
        phase: 'Producción / Aplicación',
        title: 'Laminación continua con Film B',
        description: 'Hacer pasar el film A recién impreso por la laminadora de rodillo para montar el film transportador B sin burbujas.',
        durationOrTemp: 'Velocidad de laminado 1 m/min'
      },
      {
        stepNumber: 3,
        phase: 'Post-prensa / Acabado',
        title: 'Recorte y aplicación manual por frotado',
        description: 'Cortar la pegatina, separar el film A de soporte, adherir sobre el artículo rígido limpio, frotar firmemente con espátula y retirar el film B en ángulo cerrado.',
        durationOrTemp: 'Aplicación en frío manual en 10 segundos'
      }
    ],
    defaultParameters: {
      tempCelsiusMin: 0,
      tempCelsiusMax: 0,
      tempFahrenheitMin: 0,
      tempFahrenheitMax: 0,
      timeSecondsMin: 5,
      timeSecondsMax: 10,
      pressureLevel: 'Alta',
      pressureBars: 'Presión manual firme de espátula de fieltro',
      speed: '1 a 3 m²/hora en impresora UV DTF A3',
      curingMethod: 'Curado fotoquímico por radiación ultravioleta LED instantánea',
      cooling: 'Inmediato (sin enfriamiento)',
      peeling: 'Pelado en Caliente (Hot Peel: 2-4 seg)',
      primaryMaterials: ['Artículos rígidos', 'Cuero grueso', 'Plásticos', 'Metales'],
      machineModelReference: 'Audley UV DTF 60cm / Roland VersaUV',
      consumableReference: 'Film UV A+B Crystal Clear + Tintas UV Roland ECO-UV',
      verifiedSource: 'Manual de Aplicación UV DTF Roland DG Technical Guidelines',
      lastVerifiedDate: '2026-02-15',
      isManufacturerVerified: true,
      manufacturerNotice: 'No aplicar calor en prensa térmica. La adherencia química máxima se alcanza tras 24 horas de reposo.'
    },
    manufacturerPresets: [
      {
        id: 'uv_dtf_hard_goods',
        presetName: 'Audley Lab - Adhesivo Rígido de Alto Tráfico',
        brand: 'Audley',
        equipmentModel: 'UV DTF A3 Pro',
        consumableUsed: 'Film A+B 3M Grade + Tintas UV LED',
        substrate: 'Aluminio anodizado y acero inoxidable',
        tempC: 0,
        timeSec: 10,
        pressure: 'Frotado manual con espátula rígida',
        peeling: 'Retiro en frío inmediato del film transportador',
        prePressSec: 0,
        postPressSec: 0,
        verifiedDate: '2026-01-30',
        sourceDoc: 'Audley UV Application Note 2026'
      }
    ],
    finishing: {
      touch: 'Relieve 3D Texturizado',
      gloss: 'Brillante',
      elasticity: 'Rígido',
      opacityDarkFabrics: 'Opacidad Total 100%',
      breathability: 'Baja (Efecto barrera)'
    },
    care: {
      washTempMaxC: 50,
      washCycle: 'Lavado a mano con esponja suave para artículos rígidos',
      turnInsideOut: false,
      bleachAllowed: false,
      tumbleDry: 'Prohibido secadora',
      ironing: 'Prohibido planchar estampado',
      certifiedWashCycles: 50,
      curationTimeBeforeFirstWashHours: 24
    },
    commonProblems: [
      {
        id: 'uv_dtf_bubble',
        symptom: 'Burbujas de aire atrapadas entre el adhesivo y la superficie rígida.',
        probableCause: 'Frotado irregular o aplicación desde los bordes hacia el centro en lugar de un movimiento lineal uniforme.',
        technicalSolution: 'Aplicar desde el centro hacia los extremos con espátula de fieltro a 45°; limpiar la superficie con alcohol antes de pegar.',
        severity: 'Moderado'
      }
    ],
    comparisonMetrics: {
      fabricCompatibilityScore: 3.0,
      durabilityScore: 9.0,
      quantityFlexibilityScore: 9.5,
      initialInvestmentCost: 'Medio ($1,000-$6,000 USD)',
      costPerUnitSmallRun: 'Económico',
      costPerUnitBulkRun: 'Medio',
      operationalComplexity: 'Media',
      spaceRequirement: 'Escritorio / Taller chico'
    }
  },

  // 8. Transfer Láser
  {
    id: 'transfer_laser',
    name: 'Transfer Láser para Prendas Claras y Oscuras',
    shortDesc: 'Impresión electrostática de tóner seco en papel transfer termoplástico con recorte o contorneado.',
    fullDesc: 'El transfer láser emplea impresoras láser de oficina o copiadotas de color para imprimir sobre papeles transfer térmicos recubiertos de polímeros fusibles. Es uno de los métodos históricos de bajo costo inicial para personalización rápida de camisetas promocionales.',
    functioning: 'El tóner en polvo (resina termoplástica con pigmento) se funde electrostáticamente sobre el papel transfer. Al prensar sobre la tela a 170°C - 190°C, la capa de polímero del papel se funde arrastrando el tóner hacia el algodón. En papeles tradicionales para prendas oscuras se transfiere un fondo blanco completo que requiere recorte manual o con plotter de corte con marcas de registro.',
    advantages: [
      'Mínima inversión: se puede usar cualquier impresora láser color estándar de oficina.',
      'Velocidad de impresión instantánea de 20 a 30 páginas por minuto.',
      'Resolución fotográfica de texto muy legible.',
      'Excelente opción para eventos puntuales, despedidas o camisetas de 1 solo uso promocional.'
    ],
    disadvantages: [
      'Durabilidad muy limitada al lavado (15 a 25 lavados antes de empezar a agrietarse o perder color).',
      'Tacto acartonado o plástico en papeles oscuros (efecto ventana cuadrada si no se recorta milimétricamente).',
      'Sensible al calor de secadoras y planchas domésticas directas.'
    ],
    machines: [
      {
        type: 'Impresora láser color / Multifunción láser',
        recommendedBrandsModels: ['HP Color LaserJet Pro', 'Canon imageCLASS', 'Xerox VersaLink C400'],
        specsNotes: 'Alimentación manual bypass directa para papeles gruesos de 140-180g.'
      },
      {
        type: 'Prensa térmica plana estándar',
        recommendedBrandsModels: ['Prensa térmica plana manual 38x38 cm'],
        specsNotes: 'Presión uniforme y plato de fundición de aluminio.'
      }
    ],
    tools: ['Cúter o plotter de corte con sensor óptico', 'Hojas de papel protector sulfurizado'],
    consumables: [
      {
        name: 'Papel Transfer Láser (Light & Dark)',
        category: 'papel',
        recommendedBrands: ['Neenah TechniPrint EZP (claras)', 'Neenah Laser 1 Opaque (oscuras)', 'Forever Laser-Transparent'],
        specifications: 'Emulsión copolímera termofusible con base de papel soporte de 140g.'
      }
    ],
    materials: ['Papel transfer láser', 'Tóner láser color estándar'],
    compatibleFabrics: [
      { fabric: '100% Algodón', rating: 'Excelente', notes: 'Mejor fijación del polímero fundido.' },
      { fabric: 'Mezcla 50/50 Poly-Cotton', rating: 'Excelente', notes: 'Buena penetración en la urdimbre.' },
      { fabric: '100% Poliéster', rating: 'Compatible con ajuste', notes: 'Reducir temperatura a 160°C para no quemar la tela.' }
    ],
    designPreparation: {
      resolutionDpi: '300 DPI',
      colorModes: ['CMYK'],
      vectorRequired: false,
      minLineWeightMm: '0.8 mm',
      whiteUnderbaseReq: 'Papeles oscuros incluyen su propia base blanca integrada en toda la lámina',
      fileFormats: ['PDF', 'PNG', 'JPEG'],
      criticalTips: ['Imprimir en espejo para papel de prendas claras; imprimir al derecho para papel de prendas oscuras.']
    },
    procedure: [
      {
        stepNumber: 1,
        phase: 'Pre-prensa / Preparación',
        title: 'Impresión en bandeja directa bypass',
        description: 'Configurar la impresora en tipo de papel pesado/etiquetas para fundir correctamente el tóner.',
        durationOrTemp: 'Impresora láser color'
      },
      {
        stepNumber: 2,
        phase: 'Producción / Aplicación',
        title: 'Prensado térmico a alta presión',
        description: 'Planchar sobre la prenda a 180°C durante 20 a 25 segundos con presión alta y papel protector.',
        durationOrTemp: '180°C / 20 - 25 seg / 4 - 5 Bares'
      },
      {
        stepNumber: 3,
        phase: 'Post-prensa / Acabado',
        title: 'Pelado en caliente o frío según especificación',
        description: 'Retirar el papel soporte según la hoja técnica del papel transfer utilizado.',
        durationOrTemp: 'Pelado según fabricante (Neenah EZP en caliente)'
      }
    ],
    defaultParameters: {
      tempCelsiusMin: 175,
      tempCelsiusMax: 185,
      tempFahrenheitMin: 347,
      tempFahrenheitMax: 365,
      timeSecondsMin: 20,
      timeSecondsMax: 25,
      pressureLevel: 'Alta',
      pressureBars: '4.5 - 5.5 Bar',
      pressurePsi: '55 - 65 PSI',
      speed: '20 páginas/minuto en impresión; 40 prendas/hora en prensa',
      curingMethod: 'Fusión polimérica directa en prensa plana',
      cooling: 'Disipación rápida al aire',
      peeling: 'Pelado en Caliente (Hot Peel: 2-4 seg)',
      primaryMaterials: ['100% Algodón', 'Poly-Cotton'],
      machineModelReference: 'HP LaserJet Pro / Prensa Manual 38x38',
      consumableReference: 'Neenah TechniPrint EZP / Laser 1 Opaque',
      verifiedSource: 'Neenah Coldenhove Technical Data Sheet',
      lastVerifiedDate: '2026-01-10',
      isManufacturerVerified: true,
      manufacturerNotice: 'La durabilidad al lavado es moderada. No usar blanqueadores ni centrifugado violento.'
    },
    manufacturerPresets: [
      {
        id: 'neenah_ezp_light',
        presetName: 'Neenah TechniPrint EZP - Camisetas Claras',
        brand: 'Neenah Coldenhove',
        equipmentModel: 'Prensa Plana Manual',
        consumableUsed: 'TechniPrint EZP Laser Transfer Paper',
        substrate: '100% Algodón blanco',
        tempC: 185,
        timeSec: 25,
        pressure: 'Alta (5 Bares)',
        peeling: 'Pelado en Caliente inmediato (esperar 3 seg)',
        prePressSec: 5,
        postPressSec: 5,
        verifiedDate: '2026-01-15',
        sourceDoc: 'Neenah Paper User Guide 2026'
      }
    ],
    finishing: {
      touch: 'Mano Media',
      gloss: 'Satinado',
      elasticity: 'Baja',
      opacityDarkFabrics: 'Media',
      breathability: 'Baja (Efecto barrera)'
    },
    care: {
      washTempMaxC: 30,
      washCycle: 'Lavado con agua fría al revés ciclo delicado',
      turnInsideOut: true,
      bleachAllowed: false,
      tumbleDry: 'Prohibido secadora',
      ironing: 'Planchar del revés sin vapor',
      certifiedWashCycles: 20,
      curationTimeBeforeFirstWashHours: 24
    },
    commonProblems: [
      {
        id: 'laser_cracking_wash',
        symptom: 'El transfer se agrieta tras la primera lavada en lavadora doméstica.',
        probableCause: 'Temperatura o tiempo de prensado insuficiente que impidió la fusión completa del polímero dentro del tejido.',
        technicalSolution: 'Aumentar el tiempo a 25 segundos y garantizar 5 Bares de presión; lavar siempre con agua fría y del revés.',
        severity: 'Moderado'
      }
    ],
    comparisonMetrics: {
      fabricCompatibilityScore: 6.5,
      durabilityScore: 4.0,
      quantityFlexibilityScore: 9.0,
      initialInvestmentCost: 'Bajo (<$1,000 USD)',
      costPerUnitSmallRun: 'Económico',
      costPerUnitBulkRun: 'Medio',
      operationalComplexity: 'Baja',
      spaceRequirement: 'Escritorio / Taller chico'
    }
  },

  // 9. Transfer de Tóner Blanco (No-Cut White Toner / Forever)
  {
    id: 'transfer_toner',
    name: 'Transfer de Tóner Blanco (No-Cut Laser)',
    shortDesc: 'Impresión digital láser con tóner blanco CMYK+White y sistema de doble papel autodescartable A-Foil y B-Paper.',
    fullDesc: 'El sistema de transferencia de tóner blanco "No-Cut" utiliza impresoras láser con cartucho de tóner blanco opaco y un proceso patentado de dos papeles (A-Foil y B-Paper). Permite estampar prendas oscuras sin recortar ni pelar fondos, depositando adhesivo únicamente donde existe tóner.',
    functioning: 'El diseño se imprime en espejo sobre la película transparente A-Foil con tóner CMYK y una densa capa de tóner blanco. En la prensa térmica, se une la hoja A-Foil con la hoja B-Paper (que contiene adhesivo blanco termosensible). Al separar ambas hojas en caliente, el adhesivo del papel B se transfiere exclusivamente a las áreas cubiertas de tóner. La hoja A resultante se prensa sobre la prenda textil transfiriendo el diseño nítido sin rebabas.',
    advantages: [
      'Sin descarte ni pelado manual: letras sueltas y detalles milimétricos se recortan automáticamente.',
      'Tóner blanco ultrabrillante opaco sobre prendas 100% negras sin sangrado.',
      'Excelente solidez al lavado (hasta 40-50 lavados) superior al transfer láser convencional.',
      'Compatible con algodón, poliéster, cuero, fieltro y cartón rígido.'
    ],
    disadvantages: [
      'Paso crítico de "matrimonio" (unión A + B) requiere técnica manual precisa y temperatura exacta.',
      'Costo de consumibles por hoja relativamente alto (papeles A+B + tóner blanco original).',
      'Requiere impresoras láser especializadas con canal de tóner blanco (ej: OKI Pro White Toner o IColor).'
    ],
    machines: [
      {
        type: 'Impresora láser de tóner blanco (White Toner LED Printer)',
        recommendedBrandsModels: ['OKI Pro8432WT A3', 'OKI C711WT A4', 'UniNet IColor 560 / 650', 'Ghost White Toner HP converted'],
        specsNotes: 'Tecnología LED digital de un solo paso con tóner microfino blanco de alta densidad.'
      },
      {
        type: 'Prensa térmica neumática o basculante de alta precisión',
        recommendedBrandsModels: ["STAHLS' Hotronix Fusion IQ", 'Secabo TC7 SMART'],
        specsNotes: 'Control térmico uniforme ±1°C en todo el plato calefactor.'
      }
    ],
    tools: [
      'Termómetro de infrarrojos para comprobación de plato térmico',
      'Papel protector siliconado Forever Matte Economy / Glossy',
      'Almohadilla de silicona para distribución de calor'
    ],
    consumables: [
      {
        name: 'Set de Papeles No-Cut Laser-Dark (A-Foil + B-Paper)',
        category: 'papel',
        recommendedBrands: ['Forever Laser-Dark (No-Cut) LowTemp', 'Shockline No-Cut', 'UniNet IColor 2-Step Paper'],
        specifications: 'Película transparente de poliéster tratada A + Papel adhesivo termorreactivo B.'
      },
      {
        name: 'Tóner Blanco Microfino de Alta Opacidad',
        category: 'tinta',
        recommendedBrands: ['OKI Genuine White Toner Cartridge', 'UniNet Absolute White Toner'],
        specifications: 'Polímeros termoplásticos pigmentados con dióxido de titanio de alto rendimiento.'
      }
    ],
    materials: ['Forever Laser-Dark A-Foil', 'Forever Laser-Dark B-Paper', 'Tóner blanco'],
    compatibleFabrics: [
      { fabric: '100% Algodón oscuro y claro', rating: 'Excelente', notes: 'Gran penetración del adhesivo B.' },
      { fabric: '100% Poliéster y Nylon', rating: 'Excelente', notes: 'Temperatura baja de 135°C - 145°C previene migración y brillo en poliéster.' },
      { fabric: 'Cuero, Denim y Lona', rating: 'Excelente', notes: 'Se adapta a fibras texturizadas.' }
    ],
    designPreparation: {
      resolutionDpi: '300 DPI a tamaño real 1:1',
      colorModes: ['CMYK con control de cobertura de tóner blanco a través del software RIP (TransferRip / Digital Factory)'],
      vectorRequired: false,
      minLineWeightMm: '0.4 mm',
      whiteUnderbaseReq: '100% de tóner blanco depositado sobre los colores para atrapar el adhesivo B',
      fileFormats: ['PNG con transparencia', 'PDF vectorial', 'TIFF'],
      criticalTips: [
        'Imprimir siempre en imagen en espejo.',
        'Utilizar el tramado de semitono en el RIP para mejorar la flexibilidad y tacto de grandes masas sólidas.'
      ]
    },
    procedure: [
      {
        stepNumber: 1,
        phase: 'Pre-prensa / Preparación',
        title: 'Impresión en espejo en film A-Foil',
        description: 'Imprimir con tóner CMYK + White en el lado recubierto del film transparente A-Foil.',
        durationOrTemp: 'Impresora OKI White Toner'
      },
      {
        stepNumber: 2,
        phase: 'Pre-prensa / Preparación',
        title: 'Matrimonio de hojas A y B en prensa térmica',
        description: 'Colocar la hoja A impresa sobre la prensa y cubrir con la hoja B adhesiva. Prensar a 150°C durante 90 a 110 segundos con presión media (2 a 3 Bares).',
        durationOrTemp: '150°C / 90 - 110 seg / 2.5 Bares'
      },
      {
        stepNumber: 3,
        phase: 'Pre-prensa / Preparación',
        title: 'Pelado en caliente de hojas A y B (Peeling A-B)',
        description: 'Sin retirar las hojas del plato caliente de la prensa, frotar con un trapo suave durante 2 segundos y separar la hoja B de la hoja A en un movimiento horizontal rasante y fluido.',
        durationOrTemp: 'Pelado inmediatamente en caliente sobre el plato'
      },
      {
        stepNumber: 4,
        phase: 'Producción / Aplicación',
        title: 'Transferencia sobre la prenda textil',
        description: 'Ubicar la hoja A con adhesivo sobre la prenda. Prensar a 150°C durante 30 segundos con presión alta (4.5 a 5 Bares).',
        durationOrTemp: '150°C / 30 seg / 5 Bares'
      },
      {
        stepNumber: 5,
        phase: 'Post-prensa / Acabado',
        title: 'Enfriamiento absoluto y segundo planchado',
        description: 'Esperar a que la prenda se enfríe completamente antes de pelar el film A. Realizar un segundo prensado de 10 segundos con papel Forever Matte para fijar la solidez.',
        durationOrTemp: 'En frío total + 10 seg post-prensado'
      }
    ],
    defaultParameters: {
      tempCelsiusMin: 145,
      tempCelsiusMax: 155,
      tempFahrenheitMin: 293,
      tempFahrenheitMax: 311,
      timeSecondsMin: 25,
      timeSecondsMax: 35,
      pressureLevel: 'Alta',
      pressureBars: '4.5 - 5.5 Bar en prensado de prenda (2.5 Bar en unión A+B)',
      pressurePsi: '60 - 70 PSI',
      speed: '8 a 16 páginas por minuto en impresora; 25 transfers terminados/hora',
      curingMethod: 'Termo-fusión de polímeros acrílicos en prensa térmica',
      cooling: 'Enfriamiento a temperatura ambiente (30-60 seg)',
      peeling: 'Pelado en Frío (Cold Peel: <30°C ambiente)',
      primaryMaterials: ['100% Algodón negro', 'Poliéster', 'Nylon', 'Lona'],
      machineModelReference: "OKI Pro8432WT / Prensa STAHLS' Hotronix",
      consumableReference: 'Forever Laser-Dark (No-Cut) LowTemp A+B',
      verifiedSource: 'Forever Digital Transfer Applications Official German Standard',
      lastVerifiedDate: '2026-03-01',
      isManufacturerVerified: true,
      manufacturerNotice: 'El pelado del matrimonio A+B DEBE hacerse sobre el plato caliente de la prensa sin sacarlo.'
    },
    manufacturerPresets: [
      {
        id: 'forever_nocut_dark_lowtemp',
        presetName: 'Forever Lab - No-Cut LowTemp Algodón Negro',
        brand: 'Forever Transfer Papers Germany',
        equipmentModel: 'OKI Pro8432WT + Prensa Plana',
        consumableUsed: 'Laser-Dark (No-Cut) LowTemp A+B',
        substrate: '100% Algodón Peinado Negro 190 GSM',
        tempC: 150,
        timeSec: 30,
        pressure: 'Alta (5 Bares en prenda)',
        peeling: 'Frío absoluto para la prenda; caliente sobre plato para A-B',
        prePressSec: 5,
        postPressSec: 10,
        verifiedDate: '2026-02-05',
        sourceDoc: 'Forever No-Cut Official Instruction Sheet 2026'
      }
    ],
    finishing: {
      touch: 'Mano Suave',
      gloss: 'Mate',
      elasticity: 'Media',
      opacityDarkFabrics: 'Opacidad Total 100%',
      breathability: 'Media'
    },
    care: {
      washTempMaxC: 40,
      washCycle: 'Lavado al revés, agua tibia/fría ciclo suave',
      turnInsideOut: true,
      bleachAllowed: false,
      tumbleDry: 'Baja temperatura ciclo delicado',
      ironing: 'Planchar del revés sin vapor',
      certifiedWashCycles: 45,
      curationTimeBeforeFirstWashHours: 24
    },
    commonProblems: [
      {
        id: 'toner_b_not_sticking',
        symptom: 'Al separar las hojas A y B, quedan zonas vacías donde el adhesivo blanco no se transfirió al tóner.',
        probableCause: 'Temperatura del plato inferior demasiado baja o pelado vacilante con tirones irregulares.',
        technicalSolution: 'Precalentar el plato inferior de la prensa térmica cerrándola vacía durante 60 segundos; pelar con movimiento continuo y plano.',
        severity: 'Crítico'
      }
    ],
    comparisonMetrics: {
      fabricCompatibilityScore: 9.0,
      durabilityScore: 7.5,
      quantityFlexibilityScore: 9.5,
      initialInvestmentCost: 'Alto ($6,000-$20,000 USD)',
      costPerUnitSmallRun: 'Medio',
      costPerUnitBulkRun: 'Alto',
      operationalComplexity: 'Alta',
      spaceRequirement: 'Escritorio / Taller chico'
    }
  },

  // 10. Flock (Acabado Aterciopelado)
  {
    id: 'flock',
    name: 'Flock Textil (Acabado Terciopelo)',
    shortDesc: 'Fibras microscópicas de viscosa o poliamida orientadas electrostáticamente con tacto aterciopelado tridimensional.',
    fullDesc: 'El flock es una técnica textil caracterizada por su acabado suave al tacto con aspecto y textura de terciopelo o gamuza de 0.5 a 1.0 mm de pelo. Se presenta en dos variantes: vinilo termotransferible de flock pre-flocado cortado en plotter o flocado directo por electrostática serigráfica sobre pegamento termorreactivo.',
    functioning: 'En vinilo flock, millones de microfibras de rayón o poliamida se encuentran perpendicularmente ancladas en una película termosensible. Al prensarse a 160°C, el adhesivo se funde uniendo la base a la tela. En flocado directo serigráfico, se imprime un pegamento adhesivo serigráfico y se aplica una carga electrostática de alto voltaje (50-80 kV) que proyecta las microfibras cargadas positivamente, clavándolas de punta sobre el adhesivo antes de pasar al túnel de secado.',
    advantages: [
      'Tacto aterciopelado inconfundible de altísimo valor estético y vintage.',
      'Excelente opacidad sobre telas oscuras y absorbentes.',
      'Aporta relieve tridimensional tangible y absorción acústica/térmica.',
      'Ideal para escudos heráldicos, dorsales clásicos de fútbol europeo y marcas premium.'
    ],
    disadvantages: [
      'Tiende a retener pelusas del ambiente si no se cuida adecuadamente.',
      'El descarte (weeding) en vinilo flock requiere más presión de cuchilla debido a su grosor (300 a 450 micras).',
      'No permite tramas finas menores a 1 mm.'
    ],
    machines: [
      {
        type: 'Plotter de corte con cuchilla de 60° o Aplicador electrostático de flock',
        recommendedBrandsModels: ['Graphtec CE7000-60', 'Roland GS-24', 'Maan Electrostatic Flocking Machine'],
        specsNotes: 'Cuchilla de carburo cementado con ángulo de 60° de corte profundo.'
      },
      {
        type: 'Prensa térmica de alta presión neumática',
        recommendedBrandsModels: ["STAHLS' Hotronix Fusion", 'Secabo TC7'],
        specsNotes: 'Plato calefactor homogéneo.'
      }
    ],
    tools: ['Cuchilla de corte profundo de 60°', 'Pinzas de pelado de punta recta reforzada', 'Cepillo suave de cerdas naturales'],
    consumables: [
      {
        name: 'Vinilo Textil Flock Termotransferible 400 micras',
        category: 'vinilo',
        recommendedBrands: ['Siser Stripflock Pro', "STAHLS' CAD-CUT Flock", 'Poli-Tape Poli-Flock'],
        specifications: 'Fibras de viscosa aterciopeladas de alta densidad montadas sobre soporte adhesivo.'
      }
    ],
    materials: ['Vinilo flock', 'Fibras de viscosa 0.5mm', 'Cola serigráfica de flocado'],
    compatibleFabrics: [
      { fabric: '100% Algodón', rating: 'Excelente', notes: 'Fusión perfecta y máxima suavidad.' },
      { fabric: 'Mezcla 50/50 y Hoodies de Felpa', rating: 'Excelente', notes: 'Aspecto universitario clásico en sudaderas pesadas.' },
      { fabric: 'Poliéster y Lona', rating: 'Excelente', notes: 'Gran agarre mecánico.' }
    ],
    designPreparation: {
      resolutionDpi: 'Diseño vectorial en curvas',
      colorModes: ['Color plano vectorial'],
      vectorRequired: true,
      minLineWeightMm: '1.2 mm (debido al espesor de 400 micras del pelo)',
      whiteUnderbaseReq: 'No aplica (colores totalmente opacos)',
      fileFormats: ['SVG', 'AI', 'EPS'],
      criticalTips: ['Aumentar la presión de corte del plotter en un 40% respecto al vinilo estándar y reducir la velocidad a 15 cm/s.']
    },
    procedure: [
      {
        stepNumber: 1,
        phase: 'Pre-prensa / Preparación',
        title: 'Corte en espejo con cuchilla de 60°',
        description: 'Cortar el vinilo flock en espejo con cuchilla de ángulo agudo asegurando el corte limpio de las fibras.',
        durationOrTemp: 'Plotter a 15 cm/s, presión 140-180g'
      },
      {
        stepNumber: 2,
        phase: 'Pre-prensa / Preparación',
        title: 'Pelado del material sobrante',
        description: 'Descartar el vinilo sobrante utilizando pinza con cuidado de no tirar de los pelos adyacentes.',
        durationOrTemp: 'Pelado manual'
      },
      {
        stepNumber: 3,
        phase: 'Producción / Aplicación',
        title: 'Termofijación en prensa de calor',
        description: 'Prensar a 160°C durante 15 a 18 segundos con presión media-alta.',
        durationOrTemp: '160°C / 15 seg / 4 Bares'
      },
      {
        stepNumber: 4,
        phase: 'Post-prensa / Acabado',
        title: 'Pelado en caliente y cepillado',
        description: 'Retirar el transportador en caliente o tibio. Cepillar suavemente el pelo en una sola dirección para levantar el terciopelo.',
        durationOrTemp: 'Pelado en tibio + cepillado suave'
      }
    ],
    defaultParameters: {
      tempCelsiusMin: 155,
      tempCelsiusMax: 165,
      tempFahrenheitMin: 311,
      tempFahrenheitMax: 329,
      timeSecondsMin: 15,
      timeSecondsMax: 18,
      pressureLevel: 'Media-Alta',
      pressureBars: '3.5 - 4.5 Bar',
      pressurePsi: '50 - 60 PSI',
      speed: '15 cm/s en plotter de corte',
      curingMethod: 'Termo-fusión en prensa térmica',
      cooling: 'Disipación rápida al aire',
      peeling: 'Pelado en Tibio (Warm Peel: 8-12 seg)',
      primaryMaterials: ['100% Algodón', 'Sudaderas de felpa', 'Mezclas Poly-Cotton'],
      machineModelReference: 'Plotter Graphtec CE7000 / Prensa Secabo TC7',
      consumableReference: 'Siser Stripflock Pro 410 micras',
      verifiedSource: 'Siser Stripflock Pro Technical Application Guide',
      lastVerifiedDate: '2026-02-20',
      isManufacturerVerified: true,
      manufacturerNotice: 'Puede sobre-estamparse Stripflock sobre sí mismo o sobre vinilo liso previa prueba de anclaje.'
    },
    manufacturerPresets: [
      {
        id: 'siser_stripflock_cotton',
        presetName: 'Siser Stripflock Pro - Sudadera Algodón',
        brand: 'Siser Italy',
        equipmentModel: 'Prensa Plana TS One',
        consumableUsed: 'Siser Stripflock Pro',
        substrate: 'Algodón French Terry 350 GSM',
        tempC: 160,
        timeSec: 15,
        pressure: 'Media (3.5 Bares)',
        peeling: 'Pelado en Tibio (esperar 10 seg)',
        prePressSec: 3,
        postPressSec: 0,
        verifiedDate: '2026-02-18',
        sourceDoc: 'Siser Product Catalog Technical Specs 2026'
      }
    ],
    finishing: {
      touch: 'Aterciopelado',
      gloss: 'Mate',
      elasticity: 'Media',
      opacityDarkFabrics: 'Opacidad Total 100%',
      breathability: 'Media'
    },
    care: {
      washTempMaxC: 60,
      washCycle: 'Lavado al revés en ciclo estándar',
      turnInsideOut: true,
      bleachAllowed: false,
      tumbleDry: 'Baja temperatura ciclo delicado',
      ironing: 'Planchar del revés sin vapor',
      certifiedWashCycles: 60,
      curationTimeBeforeFirstWashHours: 24
    },
    commonProblems: [
      {
        id: 'flock_crushed_hair',
        symptom: 'El terciopelo luce aplastado, brillante y pierde su textura táctil afelpada.',
        probableCause: 'Presión excesiva o haber planchado directamente sobre el pelo sin teflón.',
        technicalSolution: 'Pasar vapor vertical a 2 cm de distancia y cepillar con un cepillo de cerdas suaves para reactivar el volumen del pelo.',
        severity: 'Moderado'
      }
    ],
    comparisonMetrics: {
      fabricCompatibilityScore: 8.5,
      durabilityScore: 8.5,
      quantityFlexibilityScore: 9.0,
      initialInvestmentCost: 'Bajo (<$1,000 USD)',
      costPerUnitSmallRun: 'Económico',
      costPerUnitBulkRun: 'Medio',
      operationalComplexity: 'Baja',
      spaceRequirement: 'Escritorio / Taller chico'
    }
  },

  // 11. Foil Textil (Láminas Metalizadas)
  {
    id: 'foil',
    name: 'Foil Textil Metalizado',
    shortDesc: 'Láminas de poliéster metalizado al vacío transferidas mediante calor sobre adhesivo serigráfico o vinilo.',
    fullDesc: 'El foil textil es la técnica definitiva para obtener acabados reflectantes metálicos tipo espejo (oro, plata, bronce, cobre y holográficos iridiscentes). Consiste en una finísima película de poliéster metalizada con vapor de aluminio al vacío, la cual se adhiere exclusivamente sobre un pegamento o base plástica pre-estampada.',
    functioning: 'Primero se estampa sobre la prenda una base de pegamento térmico (serigrafía con base Foil Adhesive plastisol o base agua, o bien un vinilo termotransferible transparente o del mismo color del foil). La base se pre-cura. Luego se cubre con la lámina de foil metálico con la cara brillante hacia arriba y se prensa a 150°C - 160°C. El calor funde el adhesivo atrapando el aluminio de la lámina; al enfriarse por completo, se retira el film de poliéster quedando el metal fijado con efecto espejo.',
    advantages: [
      'Brillo metálico tipo espejo insuperable e inalcanzable por ninguna tinta metalizada en polvo.',
      'Impacto visual de lujo para marcas de moda streetwear y colecciones de temporada.',
      'Gran variedad de tonalidades: oro amarillo, oro rosado, plata espejo, bronce, arcoíris holográfico y camaleón.'
    ],
    disadvantages: [
      'Técnica delicada al lavado: el brillo espejo pierde intensidad progresivamente si se frota violentamente.',
      'Prohibido el uso de secadora caliente o planchado directo.',
      'Requiere pelado estrictamente en frío absoluto para no dejar bordes dentados.'
    ],
    machines: [
      {
        type: 'Pulpo serigráfico (para base adhesiva) y Prensa térmica de calor plano',
        recommendedBrandsModels: ['Pulpo serigráfico manual + Prensa Hotronix Air Fusion'],
        specsNotes: 'Prensa con distribución de presión perfectamente horizontal.'
      }
    ],
    tools: ['Termómetro láser', 'Hoja de papel sulfurizado de acabado', 'Almohadilla de enfriamiento térmico'],
    consumables: [
      {
        name: 'Láminas de Foil Textil Termo-reactivo (Hot Stamping Foil)',
        category: 'film',
        recommendedBrands: ['Crown Roll Leaf Textile Foil', 'Infinity Foils Textile Grade', 'Kurz Alufin Textile'],
        specifications: 'Espesor 12 a 15 micras, capa de aluminio vaporizado y capa de desmoldeo de cera.'
      },
      {
        name: 'Pegamento Serigráfico de Foil (Foil Adhesive Plastisol / Waterbased)',
        category: 'adhesivo',
        recommendedBrands: ['Rutland Foil Adhesive WB0240', 'Wilflex Epic Foil Adhesive', 'MagnaPrint Foil Adhesive'],
        specifications: 'Resina termoplástica de alto tack con curado a 150°C.'
      }
    ],
    materials: ['Láminas de foil oro/plata', 'Pegamento serigráfico de foil', 'Papel teflón'],
    compatibleFabrics: [
      { fabric: '100% Algodón liso peinado', rating: 'Excelente', notes: 'Superficie lisa garantiza el mejor brillo espejo.' },
      { fabric: 'Mezcla Poly-Cotton', rating: 'Excelente', notes: 'Gran anclaje del adhesivo en la trama.' },
      { fabric: 'Telas muy rugosas o Piqué acanalado', rating: 'Compatible con ajuste', notes: 'El brillo se fragmenta siguiendo la textura de la tela.' }
    ],
    designPreparation: {
      resolutionDpi: '300 DPI en fotolito para serigrafía o curvas vectoriales',
      colorModes: ['Monocromo para pantalla de adhesivo'],
      vectorRequired: true,
      minLineWeightMm: '0.6 mm',
      whiteUnderbaseReq: 'No aplica (el foil es 100% reflectante opaco)',
      fileFormats: ['AI', 'PDF', 'PSD'],
      criticalTips: ['Evitar tramas muy finas menores a 0.5 mm donde el adhesivo no tenga suficiente área de anclaje mecánico.']
    },
    procedure: [
      {
        stepNumber: 1,
        phase: 'Pre-prensa / Preparación',
        title: 'Estampado de la base de adhesivo serigráfico',
        description: 'Estampar el adhesivo de foil a través de malla de 43T a 55T para depositar una película espesa y continua. Gelatinizar en flash cure a 110°C.',
        durationOrTemp: 'Flash cure 110°C / 6 seg'
      },
      {
        stepNumber: 2,
        phase: 'Producción / Aplicación',
        title: 'Prensado térmico con lámina de foil',
        description: 'Colocar la lámina de foil con la cara de color hacia arriba sobre la prenda estampada con pegamento. Proteger con teflón y prensar a 150°C - 160°C con presión alta durante 12 a 15 segundos.',
        durationOrTemp: '155°C / 12 - 15 seg / 5 Bares'
      },
      {
        stepNumber: 3,
        phase: 'Post-prensa / Acabado',
        title: 'Enfriamiento absoluto y pelado en frío (Cold Peel)',
        description: 'Retirar la prenda de la prensa y esperar a que la lámina esté totalmente fría al tacto (menos de 25°C). Frotar con un trapo suave y retirar la lámina de un tirón continuo.',
        durationOrTemp: 'Frío total (45-60 seg de enfriamiento)'
      }
    ],
    defaultParameters: {
      tempCelsiusMin: 150,
      tempCelsiusMax: 160,
      tempFahrenheitMin: 302,
      tempFahrenheitMax: 320,
      timeSecondsMin: 12,
      timeSecondsMax: 15,
      pressureLevel: 'Alta',
      pressureBars: '4.5 - 5.5 Bar',
      pressurePsi: '60 - 70 PSI',
      speed: '120 transfers/hora en prensa manual',
      curingMethod: 'Termo-adherencia por calor y enfriamiento de cristalización',
      cooling: 'Enfriamiento a temperatura ambiente (30-60 seg)',
      peeling: 'Pelado en Frío (Cold Peel: <30°C ambiente)',
      primaryMaterials: ['100% Algodón', 'Poly-Cotton'],
      machineModelReference: 'Pulpo Serigráfico + Prensa Hotronix Fusion IQ',
      consumableReference: 'Crown Roll Leaf Textile Foil + Rutland Foil Adhesive WB0240',
      verifiedSource: 'Crown Roll Leaf Textile Application Bulletin 2026',
      lastVerifiedDate: '2026-02-22',
      isManufacturerVerified: true,
      manufacturerNotice: 'NUNCA retirar la lámina de foil en caliente, o los bordes quedarán dentados e irregulares.'
    },
    manufacturerPresets: [
      {
        id: 'crown_gold_foil_cotton',
        presetName: 'Crown Roll Leaf - Oro Espejo sobre Algodón',
        brand: 'Crown Roll Leaf',
        equipmentModel: 'Prensa Plana Neumática',
        consumableUsed: 'Crown Textile Gold Foil + Rutland Plastisol Adhesive',
        substrate: '100% Algodón Ring-Spun Negro 200 GSM',
        tempC: 155,
        timeSec: 14,
        pressure: 'Alta (5 Bares)',
        peeling: 'Pelado en Frío total (<25°C)',
        prePressSec: 3,
        postPressSec: 0,
        verifiedDate: '2026-02-10',
        sourceDoc: 'Crown Roll Leaf Technical Data Sheet 2026'
      }
    ],
    finishing: {
      touch: 'Mano Suave',
      gloss: 'Metálico Espejo',
      elasticity: 'Media',
      opacityDarkFabrics: 'Opacidad Total 100%',
      breathability: 'Baja (Efecto barrera)'
    },
    care: {
      washTempMaxC: 30,
      washCycle: 'Lavado a mano o ciclo ultra delicado con agua fría',
      turnInsideOut: true,
      bleachAllowed: false,
      tumbleDry: 'Prohibido secadora',
      ironing: 'Prohibido planchar estampado',
      certifiedWashCycles: 30,
      curationTimeBeforeFirstWashHours: 48
    },
    commonProblems: [
      {
        id: 'foil_pinholes',
        symptom: 'Aparición de poros o áreas microscópicas donde el foil no pegó sobre el diseño.',
        probableCause: 'Depósito insuficiente de adhesivo serigráfico (malla demasiado cerrada) o presión desbalanceada en la prensa.',
        technicalSolution: 'Usar malla más abierta (36T a 43T) para dar mayor capa de adhesivo y elevar la presión a 5.5 Bares.',
        severity: 'Moderado'
      }
    ],
    comparisonMetrics: {
      fabricCompatibilityScore: 8.0,
      durabilityScore: 6.0,
      quantityFlexibilityScore: 7.0,
      initialInvestmentCost: 'Medio ($1,000-$6,000 USD)',
      costPerUnitSmallRun: 'Medio',
      costPerUnitBulkRun: 'Económico',
      operationalComplexity: 'Media',
      spaceRequirement: 'Medio (30-60 m²)'
    }
  },

  // 12. Vinilo Reflectivo (EN ISO 20471 Alta Visibilidad)
  {
    id: 'vinilo_reflectivo',
    name: 'Vinil Textil Reflectivo (Seguridad y Moda)',
    shortDesc: 'Película termotransferible con microesferas de vidrio retrorreflectantes que devuelven la luz en la dirección de incidencia.',
    fullDesc: 'El vinilo reflectivo textil está compuesto por millones de microesferas de vidrio catadióptricas de alto índice de refracción o microprismas aluminizados embutidos en una resina de poliuretano. Homologado bajo la norma europea e internacional EN ISO 20471 para ropa de trabajo de alta visibilidad, también es tendencia en indumentaria técnica, ciclismo y streetwear.',
    functioning: 'Cuando un haz de luz (faros de automóvil, linterna o flash de cámara) incide sobre las microesferas de vidrio, la luz se refracta, rebota en una capa reflectora interna de aluminio y se devuelve directamente hacia la fuente luminosa con una candela por lux metro cuadrado (R\' > 450 cd/lx·m²). Se termofija sobre prendas laborales o deportivas mediante prensa térmica.',
    advantages: [
      'Seguridad certificada: visibilidad nocturna superior a 200 metros bajo faros de vehículos.',
      'Excelente visibilidad tanto en aplicaciones de uniformes industriales como en detalles de moda reflectante.',
      'Resistente a lavados industriales exigentes.',
      'Disponible en plata clásico certificado, arcoíris holográfico reflectante y colores neón.'
    ],
    disadvantages: [
      'Requiere corte con cuchilla bien afilada debido a la abrasividad de las microesferas de vidrio.',
      'Menor elasticidad comparado con vinilos estándar de poliuretano fino.',
      'Costo superior al vinilo térmico monocolor básico.'
    ],
    machines: [
      {
        type: 'Plotter de corte tangencial o de arrastre',
        recommendedBrandsModels: ['Graphtec CE7000', 'SummaCut D60', 'Roland CAMM-1 GS-24'],
        specsNotes: 'Cuchilla de 45° o 60° con punta de diamante o carburo micrograno.'
      },
      {
        type: 'Prensa térmica de alta presión neumática',
        recommendedBrandsModels: ["STAHLS' Hotronix Fusion", 'Secabo TC7 SMART'],
        specsNotes: 'Control térmico uniforme y display digital de presión.'
      }
    ],
    tools: ['Cuchilla para materiales abrasivos', 'Pinzas de pelado de precisión', 'Lámina de teflón antiadherente'],
    consumables: [
      {
        name: 'Película Reflectiva Textil Termotransferible Certificada',
        category: 'vinilo',
        recommendedBrands: ['3M Scotchlite 8712 / 8725 High Gloss', "STAHLS' CAD-CUT Reflective", 'Siser Reflex', 'Poli-Tape Poli-Flex Reflex'],
        specifications: 'Coeficiente de retrorreflexión > 500 cd/lx·m², certificado EN ISO 20471 Clase 2.'
      }
    ],
    materials: ['Vinilo reflectivo con microesferas de vidrio', 'Transportador de poliéster'],
    compatibleFabrics: [
      { fabric: 'Chalecos de seguridad 100% Poliéster', rating: 'Excelente', notes: 'Sustrato estándar normado.' },
      { fabric: '100% Algodón y Mezclas', rating: 'Excelente', notes: 'Gran penetración en ropa laboral de faena.' },
      { fabric: 'Softshell y Chaquetas impermeables', rating: 'Compatible con ajuste', notes: 'Verificar si requiere formulación para tejidos técnicos con repelencia al agua.' }
    ],
    designPreparation: {
      resolutionDpi: 'Diseño vectorial en curvas',
      colorModes: ['Color plano vectorial'],
      vectorRequired: true,
      minLineWeightMm: '1.0 mm (evitar trazos hiperfinos que puedan desprenderse con el roce)',
      whiteUnderbaseReq: 'No aplica (el reflectivo es opaco con fondo de plata)',
      fileFormats: ['SVG', 'AI', 'EPS', 'DXF'],
      criticalTips: ['Cortar siempre en espejo. Aumentar ligeramente la compensación de offset de cuchilla si los ángulos quedan cerrados.']
    },
    procedure: [
      {
        stepNumber: 1,
        phase: 'Pre-prensa / Preparación',
        title: 'Corte vectorial en plotter',
        description: 'Cortar en espejo por la cara adhesiva termofusible con cuchilla afilada y velocidad moderada (15-20 cm/s).',
        durationOrTemp: 'Presión 120-160g / Cuchilla 45°-60°'
      },
      {
        stepNumber: 2,
        phase: 'Pre-prensa / Preparación',
        title: 'Pelado y descarte manual',
        description: 'Retirar los sobrantes con punzón de pelado.',
        durationOrTemp: 'Pelado manual'
      },
      {
        stepNumber: 3,
        phase: 'Producción / Aplicación',
        title: 'Prensado en prensa térmica',
        description: 'Prensar a 160°C durante 15 segundos con presión media-alta.',
        durationOrTemp: '160°C / 15 seg / 4 - 5 Bares'
      },
      {
        stepNumber: 4,
        phase: 'Post-prensa / Acabado',
        title: 'Pelado en frío del transportador',
        description: 'Dejar enfriar completamente la prenda antes de tirar del transportador de poliéster.',
        durationOrTemp: 'Pelado en frío (<25°C)'
      }
    ],
    defaultParameters: {
      tempCelsiusMin: 150,
      tempCelsiusMax: 165,
      tempFahrenheitMin: 302,
      tempFahrenheitMax: 329,
      timeSecondsMin: 12,
      timeSecondsMax: 15,
      pressureLevel: 'Alta',
      pressureBars: '4.0 - 5.0 Bar',
      pressurePsi: '55 - 65 PSI',
      speed: '15 a 25 cm/s de velocidad de corte en plotter',
      curingMethod: 'Termo-fusión en prensa térmica',
      cooling: 'Enfriamiento a temperatura ambiente (30-60 seg)',
      peeling: 'Pelado en Frío (Cold Peel: <30°C ambiente)',
      primaryMaterials: ['Poliéster fluorescente', 'Algodón laboral', 'Mezclas técnicas'],
      machineModelReference: 'Plotter Graphtec CE7000 / Prensa Hotronix Fusion',
      consumableReference: '3M Scotchlite 8712 / Siser Reflex Silver',
      verifiedSource: '3M Scotchlite Heat Transfer Film Technical Bulletin 8712',
      lastVerifiedDate: '2026-02-14',
      isManufacturerVerified: true,
      manufacturerNotice: 'Para mantener la certificación EN ISO 20471 no sobrepasar 60°C en los ciclos de lavado industrial.'
    },
    manufacturerPresets: [
      {
        id: '3m_scotchlite_workwear',
        presetName: '3M Lab - Chaleco de Seguridad EN ISO 20471',
        brand: '3M Scotchlite',
        equipmentModel: 'Prensa Plana Neumática',
        consumableUsed: '3M Scotchlite 8712 Heat Transfer Film',
        substrate: '100% Poliéster fluorescente amarillo alta visibilidad',
        tempC: 160,
        timeSec: 15,
        pressure: 'Media-Alta (4.5 Bares)',
        peeling: 'Pelado en Frío total (<25°C)',
        prePressSec: 4,
        postPressSec: 2,
        verifiedDate: '2026-02-01',
        sourceDoc: '3M Scotchlite Technical Specification Bulletin 2026'
      }
    ],
    finishing: {
      touch: 'Engomado Elástico',
      gloss: 'Reflectivo de Seguridad',
      elasticity: 'Media',
      opacityDarkFabrics: 'Opacidad Total 100%',
      breathability: 'Baja (Efecto barrera)'
    },
    care: {
      washTempMaxC: 60,
      washCycle: 'Lavado al revés, agua tibia ciclo suave para ropa laboral',
      turnInsideOut: true,
      bleachAllowed: false,
      tumbleDry: 'Baja temperatura ciclo delicado',
      ironing: 'Planchar del revés sin vapor',
      certifiedWashCycles: 50,
      curationTimeBeforeFirstWashHours: 24
    },
    commonProblems: [
      {
        id: 'reflective_loss_shine',
        symptom: 'El vinilo reflectivo pierde su capacidad de retro-reflexión tornándose opaco o gris mate.',
        probableCause: 'Uso de detergentes con blanqueadores ópticos abrasivos o calor excesivo en secadora que dañó las microesferas de vidrio.',
        technicalSolution: 'Instruir al cliente en el uso de detergentes neutros sin cloro y secado en tendedero.',
        severity: 'Moderado'
      }
    ],
    comparisonMetrics: {
      fabricCompatibilityScore: 8.5,
      durabilityScore: 8.5,
      quantityFlexibilityScore: 9.5,
      initialInvestmentCost: 'Bajo (<$1,000 USD)',
      costPerUnitSmallRun: 'Medio',
      costPerUnitBulkRun: 'Medio',
      operationalComplexity: 'Baja',
      spaceRequirement: 'Escritorio / Taller chico'
    }
  },

  // 13. Plastisol (Tintas Serigráficas Termoplásticas)
  {
    id: 'plastisol',
    name: 'Serigrafía con Tintas Plastisol',
    shortDesc: 'Tintas serigráficas termoplásticas 100% sólidas sin solventes de curado a 160°C con máxima cobertura y opacidad.',
    fullDesc: 'El plastisol es la tinta serigráfica textil más utilizada en el mundo desde hace décadas. Está formulada por partículas microscópicas de resina de PVC (o resinas acrílicas libres de ftalatos en formulaciones modernas) dispersas en un plastificante líquido. No se seca al aire en la pantalla, lo que permite trabajar indefinidamente sin que se tapen las mallas.',
    functioning: 'A temperatura ambiente, el plastisol permanece como una pasta fluida tixotrópica. Al ser forzada por la racleta a través de la malla, queda depositada sobre el tejido. Para transformarse en una película sólida elástica, debe calentarse a su temperatura de fusión y gelificación completa (155°C - 165°C), momento en el que el plastificante se disuelve dentro de las partículas de resina polimerizando en un termoplástico continuo e insoluble.',
    advantages: [
      'No se seca en la pantalla: se puede pausar la producción horas sin limpiar los marcos.',
      'Máxima opacidad y blancura sobre prendas 100% negras.',
      'Excelente elasticidad y resistencia mecánica al lavado industrial.',
      'Permite formular mezclas de color Pantone con total precisión repetitiva.',
      'Altísimo rendimiento por kilo de tinta con costo unitario mínimo en tiradas industriales.'
    ],
    disadvantages: [
      'Tacto con presencia física sobre la tela (mano media a pesada si se aplican muchas capas).',
      'Poca transpirabilidad en artes de gran cobertura sobre el pecho.',
      'Exige horno túnel de secado con control de temperatura preciso.',
      'No se puede planchar directamente con plancha doméstica (se derrite la resina).'
    ],
    machines: [
      {
        type: 'Pulpo serigráfico y Túnel de secado infrarrojo con extracción',
        recommendedBrandsModels: ['MHM Synchroprint 5000', 'ROQ ECO Automatic', 'Vastex BigRed D-54'],
        specsNotes: 'Flujo de aire forzado continuo y sensor infrarrojo de temperatura.'
      }
    ],
    tools: ['Racletas serigráficas Shore 70/90/70', 'Termómetro Donut Probe', 'Mallas de 43T a 90T'],
    consumables: [
      {
        name: 'Tintas Plastisol Libres de Ftalatos',
        category: 'tinta',
        recommendedBrands: ['Rutland M3 Mixing System', 'Wilflex Epic Top Score / Rio', 'Avient Print Solutions', 'Nazdar 7900'],
        specifications: 'Cumplimiento CPSIA y OEKO-TEX Standard 100 Clase 1 sin ftalatos regulados.'
      }
    ],
    materials: ['Tintas plastisol', 'Emulsión resistente a solventes', 'Limpiador de tinta ecológico'],
    compatibleFabrics: [
      { fabric: '100% Algodón', rating: 'Excelente', notes: 'Sustrato perfecto para plastisol.' },
      { fabric: 'Mezcla 50/50 Poly-Cotton', rating: 'Excelente', notes: 'Utilizar plastisol low-bleed para bloquear tinte.' },
      { fabric: '100% Poliéster', rating: 'Compatible con ajuste', notes: 'Requiere base de bloqueo gris/negra con barrera anti-sublimación.' }
    ],
    designPreparation: {
      resolutionDpi: '300 DPI a escala real en fotolito',
      colorModes: ['Pantone Solid Coated'],
      vectorRequired: false,
      minLineWeightMm: '0.4 mm',
      whiteUnderbaseReq: 'Base blanca con rebaje de 1 punto',
      fileFormats: ['AI', 'PSD con canales', 'PDF'],
      criticalTips: ['Mantener la temperatura del flash cure por debajo de 115°C para evitar sobrecurar la base blanca antes de los colores.']
    },
    procedure: [
      {
        stepNumber: 1,
        phase: 'Producción / Aplicación',
        title: 'Estampado de base blanca y flash cure',
        description: 'Imprimir la base blanca con racleta firme. Gelatinizar en flash cure durante 4-6 segundos a 110°C.',
        durationOrTemp: 'Flash cure 110°C / 5 seg'
      },
      {
        stepNumber: 2,
        phase: 'Producción / Aplicación',
        title: 'Estampado de colores de sobreimpresión',
        description: 'Imprimir los colores Pantone encima de la base pre-curada.',
        durationOrTemp: 'Estampado continuo'
      },
      {
        stepNumber: 3,
        phase: 'Post-prensa / Acabado',
        title: 'Polimerizado final en túnel de secado',
        description: 'Hacer pasar la prenda por el túnel asegurando que la tinta alcance 160°C en toda su profundidad durante 60 segundos.',
        durationOrTemp: '160°C / 60 - 75 seg en túnel'
      }
    ],
    defaultParameters: {
      tempCelsiusMin: 155,
      tempCelsiusMax: 165,
      tempFahrenheitMin: 311,
      tempFahrenheitMax: 329,
      timeSecondsMin: 60,
      timeSecondsMax: 90,
      pressureLevel: 'Alta',
      pressureBars: '4.5 - 5.5 Bar en racleta automática',
      speed: '500 a 800 prendas/hora en pulpo automático',
      curingMethod: 'Túnel de secado infrarrojo continuo con circulación de aire',
      cooling: 'Disipación rápida al aire',
      peeling: 'No aplica (Impresión directa o bordado)',
      primaryMaterials: ['100% Algodón', 'Poly-Cotton'],
      machineModelReference: 'Pulpo ROQ YOU / Túnel Vastex BigRed',
      consumableReference: 'Wilflex Epic Series / Rutland M3',
      verifiedSource: 'Avient Wilflex Official User Manual 2026',
      lastVerifiedDate: '2026-03-02',
      isManufacturerVerified: true,
      manufacturerNotice: 'Verificar la fusión completa estirando el estampado: si se quiebra como tiza, faltó temperatura o tiempo de curado.'
    },
    manufacturerPresets: [
      {
        id: 'wilflex_epic_cotton',
        presetName: 'Wilflex Epic - Algodón Estándar 160°C',
        brand: 'Avient Wilflex',
        equipmentModel: 'Túnel Infrarrojo Textil',
        consumableUsed: 'Wilflex Epic Top Score White + Colors',
        substrate: '100% Algodón Peinado 180 GSM',
        tempC: 160,
        timeSec: 60,
        pressure: 'Media-Alta en rasqueta',
        peeling: 'No aplica',
        prePressSec: 0,
        postPressSec: 0,
        verifiedDate: '2026-02-14',
        sourceDoc: 'Avient Wilflex Epic Technical Bulletin 2026'
      }
    ],
    finishing: {
      touch: 'Mano Media',
      gloss: 'Satinado',
      elasticity: 'Alta',
      opacityDarkFabrics: 'Opacidad Total 100%',
      breathability: 'Media'
    },
    care: {
      washTempMaxC: 60,
      washCycle: 'Lavado estándar en lavadora automática',
      turnInsideOut: true,
      bleachAllowed: false,
      tumbleDry: 'Apto secadora industrial',
      ironing: 'Planchar del revés sin vapor (no planchar directamente la tinta)',
      certifiedWashCycles: 80,
      curationTimeBeforeFirstWashHours: 24
    },
    commonProblems: [
      {
        id: 'plastisol_bleed',
        symptom: 'La tinta blanca sobre camiseta roja de poliéster se vuelve rosa días después de imprimir.',
        probableCause: 'Migración del tinte de dispersión del tejido hacia la tinta plastisol por exceso de calor.',
        technicalSolution: 'Utilizar plastisol especial Low-Bleed con barrera bloqueadora gris o reducir la temperatura del túnel a 140°C usando tintas de curado bajo (Low Cure).',
        severity: 'Crítico'
      }
    ],
    comparisonMetrics: {
      fabricCompatibilityScore: 8.5,
      durabilityScore: 9.5,
      quantityFlexibilityScore: 3.5,
      initialInvestmentCost: 'Industrial (>$20,000 USD)',
      costPerUnitSmallRun: 'No recomendado',
      costPerUnitBulkRun: 'Muy Económico',
      operationalComplexity: 'Alta',
      spaceRequirement: 'Industrial ventilado (>80 m²)'
    }
  },

  // 14. Tintas Base Agua (Water-Based Inks)
  {
    id: 'tintas_base_agua',
    name: 'Serigrafía con Tintas Base Agua (Eco-Friendly)',
    shortDesc: 'Tintas ecológicas formuladas en base acuosa libre de PVC con penetración en la fibra y tacto ultra suave o nulo.',
    fullDesc: 'Las tintas base agua representan el estándar de oro en sostenibilidad, moda de alto nivel y retail ecológico. Formuladas a base de dispersiones acuosas de resinas de poliuretano y acrílicas con pigmentos orgánicos biodegradables, tiñen y penetran en los capilares del algodón sin formar una capa plástica pesada en la superficie.',
    functioning: 'A diferencia del plastisol, el secado de la tinta base agua requiere dos fases obligatorias: 1) evaporación completa del vehículo acuoso (agua y codisolventes) y 2) reticulación térmica de la resina acrílica con la celulosa del algodón a 150°C - 160°C durante 90 a 120 segundos en túnel con potente extracción de aire húmedo.',
    advantages: [
      'Tacto ultra suave ("soft-hand" o tacto cero casi imperceptible).',
      'Máxima transpirabilidad: la tela continúa respirando libremente a través del estampado.',
      'Se puede planchar directamente por el derecho sin que la tinta se pegue ni se derrita.',
      'Sostenibilidad ambiental: libres de PVC, ftalatos y metales pesados con certificaciones GOTS y OEKO-TEX.'
    ],
    disadvantages: [
      'La tinta se seca en la malla si la pantalla se deja desatendida, obstruyendo los poros de la tela.',
      'Menor opacidad natural sobre prendas negras que el plastisol tradicional (requiere bases de alta opacidad o discharge).',
      'Requiere túnel de secado con gran capacidad de extracción y flujo de aire forzado para desalojar el vapor de agua.'
    ],
    machines: [
      {
        type: 'Pulpo serigráfico y Túnel de secado de convección forzada con alta extracción',
        recommendedBrandsModels: ['Túnel M&R Sprint Gas Dryer', 'ROQ Tunnel Forced Air'],
        specsNotes: 'Indispensable alto caudal de extracción de metros cúbicos por minuto de aire húmedo.'
      }
    ],
    tools: ['Racletas Shore 65/90/65', 'Pulverizador de agua fina para humectar pantallas', 'Mallas de 55T a 120T'],
    consumables: [
      {
        name: 'Tintas Base Agua de Alta Opacidad y Reticulación',
        category: 'tinta',
        recommendedBrands: ['MagnaColours MagnaPrint AquaFlex', 'Matsui 301 Series Eco', 'Virus Hydra Waterbased', 'Rutland WB Series'],
        specifications: 'Resinas acrílicas hidrosolubles certificadas GOTS y ZDHC Level 3.'
      }
    ],
    materials: ['Tintas base agua', 'Emulsión resistente al agua (Water-Resistant Emulsion)', 'Retardante de secado ecológico'],
    compatibleFabrics: [
      { fabric: '100% Algodón Peinado Orgánico', rating: 'Excelente', notes: 'El sustrato perfecto para tacto cero.' },
      { fabric: 'Mezclas Viscosa / Modal / Bambú', rating: 'Excelente', notes: 'Caída fluida de la prenda totalmente preservada.' },
      { fabric: '100% Poliéster', rating: 'Compatible con ajuste', notes: 'Requiere tintas base agua especiales con aditivos de baja temperatura.' }
    ],
    designPreparation: {
      resolutionDpi: '300 DPI a tamaño real',
      colorModes: ['Pantone Formula Guide'],
      vectorRequired: false,
      minLineWeightMm: '0.3 mm en mallas finas 77T-90T',
      whiteUnderbaseReq: 'Base de alta opacidad con rebaje fino',
      fileFormats: ['AI', 'PSD', 'PDF'],
      criticalTips: ['Inundar siempre la pantalla (flood stroke) con una capa generosa de tinta inmediatamente después de cada pasada de impresión para evitar que se seque en la malla.']
    },
    procedure: [
      {
        stepNumber: 1,
        phase: 'Pre-prensa / Preparación',
        title: 'Preparación de pantalla resistente al agua',
        description: 'Utilizar emulsión con diazo o fotopolímero resistente al agua y aplicar endurecedor químico post-exposición si la tirada supera las 200 prendas.',
        durationOrTemp: 'Emulsión Water-Resistant'
      },
      {
        stepNumber: 2,
        phase: 'Producción / Aplicación',
        title: 'Estampado con racleta suave y pasada de inundado constante',
        description: 'Imprimir con ángulo de 60° y presión firme para penetrar la fibra. Inundar la pantalla de inmediato con tinta fresca.',
        durationOrTemp: 'Pasada firme + inundación continua'
      },
      {
        stepNumber: 3,
        phase: 'Post-prensa / Acabado',
        title: 'Curado en túnel con extracción forzada',
        description: 'Hacer pasar la prenda por el túnel a 150°C - 160°C durante al menos 90 a 120 segundos para evaporar toda el agua y reticular la resina.',
        durationOrTemp: '155°C / 90 - 120 seg en túnel con ventilación forzada'
      }
    ],
    defaultParameters: {
      tempCelsiusMin: 150,
      tempCelsiusMax: 165,
      tempFahrenheitMin: 302,
      tempFahrenheitMax: 329,
      timeSecondsMin: 90,
      timeSecondsMax: 120,
      pressureLevel: 'Media-Alta',
      pressureBars: '4.0 - 5.0 Bar',
      speed: '400 a 700 prendas/hora en pulpo automático',
      curingMethod: 'Túnel de convección de aire forzado con extracción de humedad',
      curingTempTime: '155°C durante 120 segundos',
      cooling: 'Inmediato (sin enfriamiento)',
      peeling: 'No aplica (Impresión directa o bordado)',
      primaryMaterials: ['100% Algodón orgánico', 'Mezclas naturales'],
      machineModelReference: 'Pulpo ROQ Automatic + Túnel M&R Sprint Gas',
      consumableReference: 'MagnaColours MagnaPrint AquaFlex White & Clear',
      verifiedSource: 'MagnaColours Technical Processing Guidelines 2026',
      lastVerifiedDate: '2026-02-18',
      isManufacturerVerified: true,
      manufacturerNotice: 'Sin una adecuada evacuación del vapor de agua en el túnel, la tinta no reticulará y se lavará con el agua.'
    },
    manufacturerPresets: [
      {
        id: 'magnacolours_aquaflex_cotton',
        presetName: 'MagnaColours Lab - MagnaPrint Algodón Orgánico',
        brand: 'MagnaColours UK',
        equipmentModel: 'Túnel de Convección de Aire Forzado',
        consumableUsed: 'MagnaPrint AquaFlex White / Neutral Base',
        substrate: '100% Algodón Orgánico Peinado 180 GSM',
        tempC: 155,
        timeSec: 120,
        pressure: 'Media-Alta en rasqueta',
        peeling: 'No aplica',
        prePressSec: 0,
        postPressSec: 0,
        verifiedDate: '2026-02-12',
        sourceDoc: 'MagnaColours Technical Bulletin GOTS Certified 2026'
      }
    ],
    finishing: {
      touch: 'Tacto Cero (Inapreciable)',
      gloss: 'Mate',
      elasticity: 'Muy Alta (Bi-stretch)',
      opacityDarkFabrics: 'Alta',
      breathability: 'Muy Alta (Tejido respira)'
    },
    care: {
      washTempMaxC: 40,
      washCycle: 'Lavado con agua tibia o fría ciclo suave',
      turnInsideOut: false,
      bleachAllowed: false,
      tumbleDry: 'Apto secadora industrial',
      ironing: 'Se puede planchar directamente por el derecho',
      certifiedWashCycles: 75,
      curationTimeBeforeFirstWashHours: 48
    },
    commonProblems: [
      {
        id: 'waterbased_clogging',
        symptom: 'La malla se obstruye y la tinta deja de pasar en las esquinas del diseño tras unos minutos de uso.',
        probableCause: 'Evaporación prematura del agua en la pantalla por ambiente seco o falta de pasada de inundación.',
        technicalSolution: 'Añadir 2-3% de retardante de secado acuoso humectante a la tinta y mantener la pantalla siempre cubierta de tinta entre pasadas.',
        severity: 'Moderado'
      }
    ],
    comparisonMetrics: {
      fabricCompatibilityScore: 8.0,
      durabilityScore: 9.0,
      quantityFlexibilityScore: 4.0,
      initialInvestmentCost: 'Alto ($6,000-$20,000 USD)',
      costPerUnitSmallRun: 'No recomendado',
      costPerUnitBulkRun: 'Muy Económico',
      operationalComplexity: 'Alta',
      spaceRequirement: 'Industrial ventilado (>80 m²)'
    }
  },

  // 15. Puff (Tintas Serigráficas con Relieve 3D)
  {
    id: 'puff',
    name: 'Serigrafía Puff (Relieve Tridimensional 3D)',
    shortDesc: 'Tintas plastisol o base agua formuladas con agentes microencapsulados espumantes que expanden con calor.',
    fullDesc: 'El estampado Puff es una técnica icónica del streetwear y la moda urbana que produce un relieve tridimensional redondeado y esponjoso al tacto. Se logra añadiendo un aditivo espumante a base de microesferas de gas selladas en una cáscara polimérica termoplástica a la tinta plastisol o base agua.',
    functioning: 'A temperatura ambiente la tinta se imprime plana como cualquier serigrafía a través de mallas abiertas (32T a 43T). Al entrar al túnel de calor y superar los 145°C - 160°C, la cáscara de las microesferas se reblandece y el gas interior se dilata fuertemente multiplicando su volumen entre 5 y 10 veces su tamaño original, expandiendo la película de tinta hacia arriba antes de solidificarse permanentemente.',
    advantages: [
      'Auténtico volumen y relieve tridimensional táctil sin necesidad de matrices de alta frecuencia ni bordado.',
      'Aspecto retro y estético de gran tendencia en sudaderas y camisetas oversize.',
      'Se puede combinar con serigrafía plana para crear contrastes de texturas 2D y 3D en la misma prenda.'
    ],
    disadvantages: [
      'Los bordes del diseño se redondean y expanden ligeramente (pérdida de nitidez en trazos milimétricos hiperfinos).',
      'No permite letras huecas o espacios cerrados menores a 2 mm (se cierran al inflarse).',
      'Sensible al sobre-curado: si pasa demasiado tiempo en el túnel, las burbujas de gas pueden colapsar y desinflarse.'
    ],
    machines: [
      {
        type: 'Pulpo serigráfico y Túnel infrarrojo con control estricto de temperatura',
        recommendedBrandsModels: ['Pulpo serigráfico manual/automático + Túnel Vastex'],
        specsNotes: 'La temperatura del túnel debe estar perfectamente calibrada a ±2°C.'
      }
    ],
    tools: ['Racletas suaves Shore 65', 'Mallas abiertas de 32T a 43T', 'Galga de espesores'],
    consumables: [
      {
        name: 'Aditivo o Tinta Lista para Puff (Plastisol / Base Agua)',
        category: 'tinta',
        recommendedBrands: ['Rutland Puff Additive M00010', 'Wilflex Epic Puff Base', 'MagnaPrint Puff Ink'],
        specifications: 'Microesferas de hidrocarburo encapsulado al 10-20% de concentración en peso.'
      }
    ],
    materials: ['Tinta plastisol con aditivo puff', 'Mallas de baja densidad 32T-43T'],
    compatibleFabrics: [
      { fabric: '100% Algodón', rating: 'Excelente', notes: 'Sustrato ideal para absorber la expansión.' },
      { fabric: 'Hoodies y Sudaderas de Algodón/Poliéster', rating: 'Excelente', notes: 'El relieve 3D resalta con gran presencia en prendas pesadas.' },
      { fabric: 'Telas muy elásticas o lycra', rating: 'Compatible con ajuste', notes: 'El puff puede agrietarse si la tela se expande más del 40%.' }
    ],
    designPreparation: {
      resolutionDpi: '300 DPI vectorial',
      colorModes: ['Color plano directo'],
      vectorRequired: true,
      minLineWeightMm: '1.5 mm (trazos más finos no tienen volumen suficiente; espacios negativos deben medir al menos 2.5 mm)',
      whiteUnderbaseReq: 'No se requiere base blanca debajo del puff; la tinta puff es naturalmente muy opaca',
      fileFormats: ['AI', 'PDF', 'EPS'],
      criticalTips: ['Dejar al menos 2 mm de separación entre letras para que no se fundan al inflarse en el horno.']
    },
    procedure: [
      {
        stepNumber: 1,
        phase: 'Pre-prensa / Preparación',
        title: 'Mezcla homogénea y calibración de aditivo',
        description: 'Incorporar entre 10% y 15% de aditivo puff a la tinta plastisol base mezclando lentamente sin batir para no incorporar burbujas de aire.',
        durationOrTemp: '10-15% aditivo puff en peso'
      },
      {
        stepNumber: 2,
        phase: 'Producción / Aplicación',
        title: 'Estampado con racleta suave y malla abierta',
        description: 'Imprimir a través de malla 32T o 43T con racleta de 65 Shore aplicando una pasada generosa para dejar un depósito grueso de tinta.',
        durationOrTemp: 'Malla 32T a 43T'
      },
      {
        stepNumber: 3,
        phase: 'Post-prensa / Acabado',
        title: 'Expansión controlada en túnel térmico',
        description: 'Pasar la prenda por el túnel a 155°C - 160°C durante 60 segundos. Observar cómo la tinta se expande verticalmente formando el domo 3D.',
        durationOrTemp: '160°C / 60 seg en túnel'
      }
    ],
    defaultParameters: {
      tempCelsiusMin: 150,
      tempCelsiusMax: 165,
      tempFahrenheitMin: 302,
      tempFahrenheitMax: 329,
      timeSecondsMin: 50,
      timeSecondsMax: 70,
      pressureLevel: 'Media',
      pressureBars: '3.5 - 4.0 Bar',
      speed: '120 a 300 prendas/hora',
      curingMethod: 'Túnel de secado infrarrojo con calentamiento uniforme',
      curingTempTime: '155°C a 160°C por 60 segundos',
      cooling: 'Disipación rápida al aire',
      peeling: 'No aplica (Impresión directa o bordado)',
      primaryMaterials: ['100% Algodón', 'Sudaderas pesadas'],
      machineModelReference: 'Pulpo Serigráfico + Túnel Vastex D-100',
      consumableReference: 'Wilflex Epic Puff Base / Rutland Puff Additive',
      verifiedSource: 'Wilflex Epic Specialty Inks Technical Guide',
      lastVerifiedDate: '2026-02-15',
      isManufacturerVerified: true,
      manufacturerNotice: 'NUNCA prensar en plancha térmica con presión tras salir del horno, o el volumen 3D se aplastará irreversiblemente.'
    },
    manufacturerPresets: [
      {
        id: 'wilflex_puff_hoodie',
        presetName: 'Wilflex Lab - Epic Puff Hoodie 3D',
        brand: 'Avient Wilflex',
        equipmentModel: 'Túnel Infrarrojo Textil',
        consumableUsed: 'Wilflex Epic Puff Base + Color',
        substrate: 'Hoodie Algodón 80/20 French Terry 400 GSM',
        tempC: 160,
        timeSec: 60,
        pressure: 'Media en rasqueta manual Shore 65',
        peeling: 'No aplica',
        prePressSec: 0,
        postPressSec: 0,
        verifiedDate: '2026-02-01',
        sourceDoc: 'Wilflex Epic Specialty Application Bulletin 2026'
      }
    ],
    finishing: {
      touch: 'Relieve 3D Texturizado',
      gloss: 'Mate',
      elasticity: 'Media',
      opacityDarkFabrics: 'Opacidad Total 100%',
      breathability: 'Baja (Efecto barrera)'
    },
    care: {
      washTempMaxC: 40,
      washCycle: 'Lavado al revés en ciclo delicado',
      turnInsideOut: true,
      bleachAllowed: false,
      tumbleDry: 'Prohibido secadora caliente',
      ironing: 'Planchar estrictamente del revés sin vapor (no aplastar el domo 3D)',
      certifiedWashCycles: 50,
      curationTimeBeforeFirstWashHours: 24
    },
    commonProblems: [
      {
        id: 'puff_collapse',
        symptom: 'El relieve 3D se infló en el túnel pero luego colapsó arrugándose y desinflándose.',
        probableCause: 'Sobre-exposición calórica en el túnel: la temperatura superó los 175°C o permaneció demasiado tiempo, rompiendo las microcápsulas de gas.',
        technicalSolution: 'Reducir la temperatura del túnel a 155°C y calibrar el paso a exactamente 60 segundos.',
        severity: 'Moderado'
      }
    ],
    comparisonMetrics: {
      fabricCompatibilityScore: 8.0,
      durabilityScore: 7.5,
      quantityFlexibilityScore: 4.5,
      initialInvestmentCost: 'Alto ($6,000-$20,000 USD)',
      costPerUnitSmallRun: 'No recomendado',
      costPerUnitBulkRun: 'Económico',
      operationalComplexity: 'Media',
      spaceRequirement: 'Industrial ventilado (>80 m²)'
    }
  },

  // 16. Estampado por Descarga (Discharge Printing)
  {
    id: 'estampado_descarga',
    name: 'Estampado por Descarga (Discharge Printing)',
    shortDesc: 'Reacción química serigráfica que destruye el tinte reactivo original de la fibra de algodón reemplazándolo por color nuevo sin tacto.',
    fullDesc: 'El estampado por descarga (discharge) es el pináculo de la serigrafía en prendas oscuras de alta gama. En lugar de cubrir la tela negra con capas gruesas de tinta blanca como el plastisol, la tinta de descarga contiene un agente reductor químico (sulfoxilato de formaldehído de sodio / sal de rongalita o formulaciones modernas libres de formaldehído) que decolora químicamente los tintes reactivos de la fibra de algodón dejándola en su tono crudo natural, tiñéndola simultáneamente con pigmentos termorresistentes.',
    functioning: 'La tinta se mezcla con un 5-6% de polvo activador de descarga justo antes de imprimir. Al entrar al túnel de secado a 160°C - 170°C con aire forzado, el calor activa el agente reductor: las moléculas del tinte reactivo negro se fragmentan y pierden su cromóforo decolorando la tela. Los pigmentos de color de la tinta descargable sustituyen el tinte original uniéndose covalentemente al algodón.',
    advantages: [
      'Tacto cero absoluto en prendas oscuras: la prenda queda tan suave como si viniera teñida de fábrica.',
      'Transpirabilidad total: no existe película plástica sobre el pecho.',
      'Excelente elasticidad: no se quiebra ni se cuartea al estirar la tela.',
      'Ideal para streetwear de lujo, camisetas de conciertos y marcas de skate/surf.'
    ],
    disadvantages: [
      'EXCLUSIVO para 100% algodón teñido con tintes reactivos (Reactive Dyed Cotton). No funciona sobre poliéster ni en algodones teñidos con tintes directos o sulfurosos.',
      'La tinta activada tiene una vida útil corta en el pote (pot life de 6 a 8 horas antes de degradarse).',
      'Desprende olor acre durante el secado; exige ventilación y extracción industrial potente.',
      'El resultado final solo se aprecia tras salir del horno túnel (la tinta entra oscura y sale brillante del horno).'
    ],
    machines: [
      {
        type: 'Pulpo serigráfico y Túnel de secado a gas o eléctrico de alto flujo con extracción exterior obligatoria',
        recommendedBrandsModels: ['M&R Sprint Gas Dryer', 'ROQ Sahara Forced Air Dryer'],
        specsNotes: 'Túnel con renovación de aire exterior continua.'
      }
    ],
    tools: ['Báscula digital de precisión (pesaje de activador)', 'Mascara de respiración con filtro de carbón para vapores', 'Mallas de 43T a 77T'],
    consumables: [
      {
        name: 'Tinta Base de Descarga + Activador Químico (Zinc Free / Formaldehyde Free)',
        category: 'quimico',
        recommendedBrands: ['MagnaColours MagnaPrint Discharge ULF', 'Rutland Discharge Base', 'Matsui Discharge Clear & White'],
        specifications: 'Cumplimiento estricto OEKO-TEX Standard 100 y ZDHC MRSL.'
      }
    ],
    materials: ['Base de descarga', 'Polvo activador reductor', 'Prendas 100% algodón reactivo'],
    compatibleFabrics: [
      { fabric: '100% Algodón Teñido Reactivo (Reactive Dyed)', rating: 'Excelente', notes: 'Sustrato obligatorio. Descarga a blanco crudo perfecto.' },
      { fabric: 'Mezcla 50/50 Poly-Cotton', rating: 'Compatible con ajuste', notes: 'El algodón se decolora pero el poliéster conserva su color original, produciendo un efecto jaspeado/vintage.' },
      { fabric: '100% Poliéster o Telas sintéticas', rating: 'Incompatible', notes: 'El químico de descarga no reacciona con tintes dispersos sintéticos.' }
    ],
    designPreparation: {
      resolutionDpi: '300 DPI en fotolitos tramados',
      colorModes: ['Pantone Solid Coated'],
      vectorRequired: false,
      minLineWeightMm: '0.4 mm',
      whiteUnderbaseReq: 'No requiere base blanca: la propia descarga blanca limpia el tejido',
      fileFormats: ['AI', 'PSD con canales', 'PDF'],
      criticalTips: ['Realizar siempre una prueba de gota de blanqueador o prueba de descarga en el dobladillo interior de la prenda para verificar si el tinte es reactivo descargable.']
    },
    procedure: [
      {
        stepNumber: 1,
        phase: 'Pre-prensa / Preparación',
        title: 'Activación química de la tinta',
        description: 'Pesar la base de descarga e incorporar exactamente 5% a 6% de polvo activador agente reductor. Mezclar vigorosamente durante 3 minutos hasta disolver por completo.',
        durationOrTemp: '5% activador en peso (usar antes de 8 horas)'
      },
      {
        stepNumber: 2,
        phase: 'Producción / Aplicación',
        title: 'Estampado a través de malla de poliéster',
        description: 'Imprimir con pasada firme y ángulo cerrado para forzar la tinta al corazón del hilo. Inundar la pantalla entre prendas.',
        durationOrTemp: 'Malla 43T a 60T'
      },
      {
        stepNumber: 3,
        phase: 'Post-prensa / Acabado',
        title: 'Reacción química y evaporación en túnel',
        description: 'Pasar la prenda por el túnel a 160°C - 165°C durante 90 a 120 segundos continuos con extracción forzada encendida. La prenda sale del horno con el diseño revelado.',
        durationOrTemp: '165°C / 90 - 120 seg en túnel con extracción'
      }
    ],
    defaultParameters: {
      tempCelsiusMin: 160,
      tempCelsiusMax: 170,
      tempFahrenheitMin: 320,
      tempFahrenheitMax: 338,
      timeSecondsMin: 90,
      timeSecondsMax: 120,
      pressureLevel: 'Alta',
      pressureBars: '4.5 - 5.5 Bar en racleta',
      speed: '300 a 600 prendas/hora',
      curingMethod: 'Túnel de convección a gas o aire forzado con chimenea de extracción exterior',
      curingTempTime: '165°C durante 90 a 120 segundos',
      cooling: 'Inmediato (sin enfriamiento)',
      peeling: 'No aplica (Impresión directa o bordado)',
      primaryMaterials: ['100% Algodón teñido con tintes reactivos'],
      machineModelReference: 'Pulpo ROQ Automatic + Túnel M&R Sprint Gas',
      consumableReference: 'MagnaColours MagnaPrint Discharge ULF + Activator',
      verifiedSource: 'MagnaPrint Discharge System Technical Guidelines',
      lastVerifiedDate: '2026-02-25',
      isManufacturerVerified: true,
      manufacturerNotice: 'La prenda DEBE lavarse una vez antes de su uso final para eliminar los residuos químicos de sales reductoras.'
    },
    manufacturerPresets: [
      {
        id: 'magna_discharge_black_cotton',
        presetName: 'MagnaColours Lab - Descarga Total Algodón Negro',
        brand: 'MagnaColours UK',
        equipmentModel: 'Túnel de Convección a Gas M&R',
        consumableUsed: 'MagnaPrint Discharge ULF White & Bases',
        substrate: '100% Algodón Reactivo Peinado 200 GSM',
        tempC: 165,
        timeSec: 100,
        pressure: 'Media-Alta en rasqueta Shore 65',
        peeling: 'No aplica',
        prePressSec: 0,
        postPressSec: 0,
        verifiedDate: '2026-02-15',
        sourceDoc: 'MagnaColours Discharge Processing Bulletin 2026'
      }
    ],
    finishing: {
      touch: 'Tacto Cero (Inapreciable)',
      gloss: 'Mate',
      elasticity: 'Muy Alta (Bi-stretch)',
      opacityDarkFabrics: 'Opacidad Total 100%',
      breathability: 'Muy Alta (Tejido respira)'
    },
    care: {
      washTempMaxC: 40,
      washCycle: 'Lavado estándar en lavadora',
      turnInsideOut: false,
      bleachAllowed: false,
      tumbleDry: 'Apto secadora industrial',
      ironing: 'Se puede planchar directamente por el derecho sin ninguna restricción',
      certifiedWashCycles: 90,
      curationTimeBeforeFirstWashHours: 0
    },
    commonProblems: [
      {
        id: 'discharge_no_bleach',
        symptom: 'La tinta se imprime pero no decolora la tela; queda un tono marrón sucio y opaco tras salir del horno.',
        probableCause: 'La camiseta de algodón fue teñida con tintes directos o reactivos no descargables (común en prendas de procedencia asiática económica no certificadas).',
        technicalSolution: 'Asegurarse de adquirir prendas garantizadas como "100% Reactive Dyed Dischargeable Cotton" o cambiar a técnica DTF/Plastisol para ese lote.',
        severity: 'Crítico'
      }
    ],
    comparisonMetrics: {
      fabricCompatibilityScore: 5.0,
      durabilityScore: 10.0,
      quantityFlexibilityScore: 3.0,
      initialInvestmentCost: 'Industrial (>$20,000 USD)',
      costPerUnitSmallRun: 'No recomendado',
      costPerUnitBulkRun: 'Muy Económico',
      operationalComplexity: 'Muy Alta (Especialista)',
      spaceRequirement: 'Industrial ventilado (>80 m²)'
    }
  },

  // 17. Técnicas Especiales (Glitter, Caviar, Glow in the Dark, HF Embossing)
  {
    id: 'tecnicas_especiales',
    name: 'Técnicas Especiales (Glitter, Caviar, Fotoluminiscente y Alta Frecuencia)',
    shortDesc: 'Efectos especiales multisensoriales: microescamas diamantadas, microesferas de vidrio caviar, fotoluminiscencia y gofrado térmico 3D.',
    fullDesc: 'Las técnicas especiales agrupan los efectos decorativos de mayor valor agregado en la moda y el merchandising artístico textil. Incluye:\n1) Glitter diamantado (partículas hexagonales de poliéster metalizado en base transparente).\n2) Caviar Beads (microperlas de vidrio transparente aplicadas sobre pegamento serigráfico que crean textura de caviar).\n3) Glow-in-the-dark / Fotoluminiscente (cristales de aluminato de estroncio que absorben luz UV y emiten resplandor verde/azul en la oscuridad durante horas).\n4) Alta Frecuencia / High Frequency (HF) Embossing (termoformado tridimensional directo de la tela mediante electrodos de radiofrecuencia y moldes de aluminio CNC).',
    functioning: 'Cada técnica especial utiliza principios específicos:\n- Glitter: Partículas de poliéster metalizado suspendidas en plastisol cristalino traspasan mallas abiertas de 18T a 24T fijándose a 160°C.\n- Caviar Beads: Se imprime una base de adhesivo plastisol de alta densidad a través de 32T, se espolvorean microesferas de vidrio sólido de 0.4 a 0.6 mm y se termofijan en túnel.\n- Fotoluminiscente: Pigmentos inorgánicos no tóxicos de fosforescencia dopados con tierras raras capturan fotones diurnos liberándolos en la oscuridad por luminiscencia persistente.\n- HF Embossing: Campos electromagnéticos de alta frecuencia (27.12 MHz) calientan las moléculas poliméricas de la fibra textil entre un molde macho y hembra moldeando relieve permanente.',
    advantages: [
      'Diferenciación estética absoluta inalcanzable por cualquier método digital estándar.',
      'Justifica precios de venta retail hasta 3 veces superiores a una camiseta básica.',
      'Efectos nocturnos, interactivos, táctiles y reflectivos espectaculares.'
    ],
    disadvantages: [
      'Requiere insumos y mallas serigráficas extremadamente especializadas (mallas abiertas de hilo grueso 18T a 32T).',
      'El lavado requiere protocolos cuidadosos para evitar pérdida de perlas o microescamas.',
      'Costo de moldes CNC para Alta Frecuencia elevado para tiradas cortas.'
    ],
    machines: [
      {
        type: 'Pulpo serigráfico con túnel infrarrojo / Prensa térmica / Máquina de Alta Frecuencia HF',
        recommendedBrandsModels: ['Pulpo MHM / ROQ', 'Máquina HF Forsstrom / Geaf High Frequency', 'Prensa STAHLS’ Hotronix'],
        specsNotes: 'Equipos con control digital de presión y mallas monofilamento de 15T a 32T.'
      }
    ],
    tools: ['Tamizador de microperlas de caviar', 'Lámpara de luz UV negra para control de fotoluminiscencia', 'Moldes de aluminio grabados por CNC'],
    consumables: [
      {
        name: 'Insumos de Efectos Especiales Textil',
        category: 'otro',
        recommendedBrands: ['Rutland Special Effects Inks', 'Wilflex Epic Glitter / Caviar Adhesive', 'GlowTech Strontium Pigments'],
        specifications: 'Microescamas de PET de 0.008 a 0.015 pulgadas, perlas de vidrio óptico y aluminato de estroncio.'
      }
    ],
    materials: ['Glitter de poliéster', 'Perlas de vidrio caviar', 'Pigmento fotoluminiscente', 'Base transparente de alta densidad'],
    compatibleFabrics: [
      { fabric: '100% Algodón', rating: 'Excelente', notes: 'Gran soporte para adhesivos de alta densidad.' },
      { fabric: 'Sudaderas y Hoodies pesados', rating: 'Excelente', notes: 'Efectos 3D y texturas de gran impacto visual.' },
      { fabric: 'Telas sintéticas y cuero PU (Alta frecuencia)', rating: 'Excelente', notes: 'Termomoldeado permanente sin deformación.' }
    ],
    designPreparation: {
      resolutionDpi: '300 DPI vectorial o fotolitos de trazos gruesos',
      colorModes: ['Directo especial'],
      vectorRequired: true,
      minLineWeightMm: '1.5 mm para caviar y glitter grueso',
      whiteUnderbaseReq: 'Base blanca obligatoria para Glow-in-the-dark para maximizar la reflectividad de la luz',
      fileFormats: ['AI', 'PDF', 'EPS'],
      criticalTips: ['En tintas fotoluminiscentes, colocar siempre una base blanca reflectante debajo para duplicar la emisión de luz en la oscuridad.']
    },
    procedure: [
      {
        stepNumber: 1,
        phase: 'Pre-prensa / Preparación',
        title: 'Preparación de pantallas con mallas ultra abiertas',
        description: 'Tensar marcos con mallas de 18T a 32T para permitir el paso de partículas gruesas de glitter o pegamento de caviar.',
        durationOrTemp: 'Mallas 18T a 32T'
      },
      {
        stepNumber: 2,
        phase: 'Producción / Aplicación',
        title: 'Estampado y aplicación del efecto',
        description: 'Imprimir con racleta de dureza 70 Shore. Para caviar beads, espolvorear las perlas sobre la tinta húmeda y sacudir el excedente.',
        durationOrTemp: 'Estampado con racleta firme'
      },
      {
        stepNumber: 3,
        phase: 'Post-prensa / Acabado',
        title: 'Curado en túnel o sellado en prensa',
        description: 'Polimerizar en túnel a 160°C durante 90 segundos o sellar con prensa térmica a baja presión con papel siliconado.',
        durationOrTemp: '160°C / 90 seg'
      }
    ],
    defaultParameters: {
      tempCelsiusMin: 155,
      tempCelsiusMax: 165,
      tempFahrenheitMin: 311,
      tempFahrenheitMax: 329,
      timeSecondsMin: 70,
      timeSecondsMax: 90,
      pressureLevel: 'Media',
      pressureBars: '3.5 - 4.5 Bar',
      speed: '80 a 200 prendas/hora según efecto artesanal',
      curingMethod: 'Túnel de calor infrarrojo continuo o prensa térmica con papel protector',
      curingTempTime: '160°C durante 80 a 90 segundos',
      cooling: 'Disipación rápida al aire',
      peeling: 'No aplica (Impresión directa o bordado)',
      primaryMaterials: ['Algodón peinado', 'Sudaderas', 'Prendas de moda urbana'],
      machineModelReference: 'Pulpo Serigráfico MHM + Túnel Infrarrojo Vastex',
      consumableReference: 'Wilflex Epic Glitter Base / Rutland Caviar Adhesive / GlowTech Pigments',
      verifiedSource: 'Specialty Graphics Imaging Association (SGIA) Special Effects Guide',
      lastVerifiedDate: '2026-02-18',
      isManufacturerVerified: true,
      manufacturerNotice: 'Consultar siempre las instrucciones del fabricante del aditivo o pigmento específico para dosificaciones y seguridad.'
    },
    manufacturerPresets: [
      {
        id: 'wilflex_glitter_diamond',
        presetName: 'Wilflex Lab - Glitter Diamantado de Alto Brillo',
        brand: 'Avient Wilflex',
        equipmentModel: 'Pulpo Serigráfico + Túnel Infrarrojo',
        consumableUsed: 'Wilflex Epic Glitter Base + PET Hex Flakes',
        substrate: '100% Algodón Negro 190 GSM',
        tempC: 160,
        timeSec: 80,
        pressure: 'Media en rasqueta manual Shore 70',
        peeling: 'No aplica',
        prePressSec: 0,
        postPressSec: 0,
        verifiedDate: '2026-02-05',
        sourceDoc: 'Wilflex Epic Special Effects Compendium 2026'
      }
    ],
    finishing: {
      touch: 'Relieve 3D Texturizado',
      gloss: 'Brillante',
      elasticity: 'Media',
      opacityDarkFabrics: 'Opacidad Total 100%',
      breathability: 'Baja (Efecto barrera)'
    },
    care: {
      washTempMaxC: 30,
      washCycle: 'Lavado al revés en ciclo delicado dentro de bolsa de lavado',
      turnInsideOut: true,
      bleachAllowed: false,
      tumbleDry: 'Prohibido secadora',
      ironing: 'Planchar estrictamente del revés sin vapor',
      certifiedWashCycles: 40,
      curationTimeBeforeFirstWashHours: 48
    },
    commonProblems: [
      {
        id: 'glitter_shedding',
        symptom: 'Las partículas de glitter se desprenden de la prenda soltando brillo al frotar.',
        probableCause: 'Concentración excesiva de glitter en la mezcla respecto a la cantidad de resina ligante transparente, o sub-curado térmico.',
        technicalSolution: 'Añadir más base transparente ligante (máximo 15-20% de glitter por volumen) y verificar 160°C en toda la capa de tinta.',
        severity: 'Moderado'
      }
    ],
    comparisonMetrics: {
      fabricCompatibilityScore: 7.5,
      durabilityScore: 7.0,
      quantityFlexibilityScore: 5.0,
      initialInvestmentCost: 'Medio ($1,000-$6,000 USD)',
      costPerUnitSmallRun: 'Medio',
      costPerUnitBulkRun: 'Económico',
      operationalComplexity: 'Alta',
      spaceRequirement: 'Medio (30-60 m²)'
    }
  }
];
