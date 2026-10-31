import {
  LearningCourse,
  LearningLesson,
  UserCourseProgress,
  UserEvaluationRecord,
  LearningCategory,
  CourseLevel
} from '../../types/learning';
import { db, auth } from '../../lib/firebase';
import { collection, doc, setDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';

export const INITIAL_COURSES: LearningCourse[] = [
  // 1. Introducción al Negocio
  {
    id: 'course-intro-1',
    title: 'Fundamentos y Modelo de Negocio de Estampado Textil',
    description: 'Aprende a estructurar tu taller de estampados, elegir tecnologías de impresión rentables y calcular puntos de equilibrio.',
    category: 'intro_estampados',
    level: 'Principiante',
    durationMinutes: 45,
    coverImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80',
    isPublished: true,
    createdAt: '2026-03-01',
    lessons: [
      {
        id: 'les-intro-1',
        order: 1,
        title: 'Análisis de Mercado y Selección de Técnicas',
        durationMinutes: 20,
        objective: 'Comprender qué técnica de estampado conviene para tiradas cortas (1-20), medianas (20-100) y de gran escala (100+).',
        materialsNeeded: ['Muestrarios de tejidos (100% algodón, poliéster, mezclas poly-cotton)', 'Fichas de costos de insumos'],
        toolsNeeded: ['Calculadora comercial', 'Catálogo de prendas base ESTAMPAPRO 360°'],
        procedureSummary: 'Evaluación comparativa entre DTF, Serigrafía, Sublimación y Vinilo según volumen y fibra del tejido.',
        stepByStep: [
          { stepNumber: 1, title: 'Identificar la fibra base', instruction: 'Determina si la prenda es fibra natural (algodón), sintética (poliéster) o mezcla.', tip: 'Sublimación solo ancla en poliéster blanco; DTF adhiere a casi cualquier fibra.' },
          { stepNumber: 2, title: 'Calcular el tiraje mínimo de rentabilidad', instruction: 'Serigrafía exige matrices y revelado (ideal 50+ unidades); DTF es rentable desde 1 pieza.', tip: 'No cobres lo mismo por 1 pieza unitaria que por un pedido corporativo de 200.' },
          { stepNumber: 3, title: 'Planificar el espacio del taller', instruction: 'Separa la zona de impresión, zona térmica de planchas y zona de embalaje/despacho.', tip: 'Mantén una buena ventilación cerca de hornos de poliamida.' }
        ],
        illustrativeImages: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'],
        safetyWarnings: [
          'Usa guantes térmicos al manipular prensas de calor.',
          'Instala extractor de humo en la zona de prensado y túnel de secado.'
        ],
        frequentMistakes: [
          {
            mistake: 'Comprar máquinas baratas sin control uniforme de presión.',
            cause: 'Planchas manuales sin ajuste micrométrico causan delaminación prematura en los bordes.',
            solution: 'Utiliza prensas con distribución uniforme de plato y lectura digital de temperatura.'
          }
        ],
        summary: 'La rentabilidad del taller depende de asignar la técnica correcta según el tipo de tela y cantidad de piezas del pedido.',
        relatedModuleAction: {
          moduleId: 'tecnicas_estampado',
          buttonLabel: 'Ver Comparador de Técnicas',
          contextId: 'dtf'
        }
      }
    ],
    quiz: {
      id: 'quiz-intro-1',
      title: 'Evaluación de Fundamentos de Taller',
      description: 'Valida tus conocimientos sobre selección de técnicas textiles.',
      passingScorePercent: 80,
      questions: [
        {
          id: 'q1',
          question: '¿Qué técnica permite estampar a todo color sobre algodón negro desde 1 sola prenda sin descarte manual?',
          options: ['Sublimación directa', 'DTF (Direct to Film)', 'Serigrafía en cuatricromía', 'Transfer claro'],
          correctIndex: 1,
          explanation: 'El DTF utiliza film PET y tinta blanca que permite estampar cualquier color y tela sin pelado.'
        },
        {
          id: 'q2',
          question: '¿Cuál es la fibra obligatoria para estampar mediante sublimación tradicional?',
          options: ['100% Algodón peinado', 'Poliéster claro / blanco', 'Lana virgen', 'Seda cruda'],
          correctIndex: 1,
          explanation: 'Las tintas de sublimación gasifican químicamente en cadenas poliméricas de poliéster.'
        }
      ]
    }
  },

  // 2. DTF (Direct to Film)
  {
    id: 'course-dtf-1',
    title: 'Masterclass de DTF Textil: Calibración, Poliamida y Curado',
    description: 'Protocolo industrial completo para impresión sobre film, espolvoreado de poliamida, curado en horno y transferencia térmica.',
    category: 'dtf',
    level: 'Intermedio',
    durationMinutes: 60,
    coverImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
    isPublished: true,
    createdAt: '2026-03-02',
    lessons: [
      {
        id: 'les-dtf-1',
        order: 1,
        title: 'Espolvoreado de Poliamida y Curado Térmico',
        durationMinutes: 25,
        objective: 'Lograr una polimerización uniforme del polvo de TPU en el horno sin quemar el film ni dejar grumos.',
        materialsNeeded: ['Film DTF impreso en espejo con tinta CMYK + White húmeda', 'Polvo de poliamida termofusible (TPU grano fino o medio)'],
        toolsNeeded: ['Horno túnel con sensor infrarrojo', 'Prensa térmica plana 40x50 cm', 'Termómetro infrarrojo láser'],
        procedureSummary: 'Aplicación de polvo termoplástico sobre la tinta fresca, eliminación de estática y horneado a 125°C por 90 segundos.',
        stepByStep: [
          { stepNumber: 1, title: 'Aplicar el polvo de poliamida', instruction: 'Cubre completamente la zona impresa con polvo TPU inmediatamente al salir de la impresora.', tip: 'No toques la tinta con los dedos para no provocar marcas de grasa.' },
          { stepNumber: 2, title: 'Sacudir el exceso (shaking)', instruction: 'Golpea suavemente el reverso del film para retirar todo el polvo que no esté sobre tinta.', tip: 'El film transparente debe quedar limpio sin residuos de polvo en las zonas sin diseño.' },
          { stepNumber: 3, title: 'Hornear hasta aspecto cáscara de naranja', instruction: 'Introduce al horno a 120°C - 130°C durante 90-120 segundos hasta que el polvo se funda y brille.', tip: 'Si queda arenoso, falta calor. Si humea profusamente o se deforma el film, hay exceso de temperatura.' }
        ],
        illustrativeImages: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80'],
        safetyWarnings: [
          'No inhales el polvo de poliamida en suspensión. Usa mascarilla N95 en la zona de shaker.',
          'Verifica la temperatura real del plato con pirómetro láser antes de iniciar la tirada.'
        ],
        frequentMistakes: [
          {
            mistake: 'Burbujas o desprendimiento del estampado tras el primer lavado.',
            cause: 'Poliamida subcurada o humedad residual en la prenda antes del planchado.',
            solution: 'Realiza siempre un preplanchado de 5 segundos a la prenda para evaporar la humedad textil antes de colocar el transfer.'
          }
        ],
        summary: 'Un buen curado de poliamida genera una membrana plástica flexible que garantiza más de 50 lavados.',
        technicalParameters: {
          temperatureC: '150°C - 160°C',
          timeSeconds: '12 - 15 s',
          pressure: 'Media-Alta (4 - 5 Bar)',
          peeling: 'Pelado en Frío (Cold Peel) o Tibio según film'
        },
        relatedModuleAction: {
          moduleId: 'asistente_produccion',
          buttonLabel: 'Abrir Asistente de Producción DTF',
          contextId: 'dtf'
        }
      },
      {
        id: 'les-dtf-2',
        order: 2,
        title: 'Transferencia Térmica y Reprensado Mate',
        durationMinutes: 20,
        objective: 'Aprender la técnica de pelado y el segundo prensado protector para integrar la tinta al tejido.',
        materialsNeeded: ['Prenda 100% algodón o mezcla', 'Papel siliconado / kraft antiadherente'],
        toolsNeeded: ['Prensa térmica plana calibrada', 'Bloque disipador de calor de aluminio'],
        procedureSummary: 'Prensado inicial, enfriamiento controlado, retiro del film y reprensado final de sellado.',
        stepByStep: [
          { stepNumber: 1, title: 'Preplanchar la prenda', instruction: 'Plancha la prenda sola durante 5 segundos para eliminar arrugas y humedad.', tip: 'Evita transferencias con humedad en la fibra.' },
          { stepNumber: 2, title: 'Prensado principal', instruction: 'Coloca el transfer con el diseño hacia la prenda, cubre con papel teflón y prensa 15 segundos a 155°C.', tip: 'Presión firme de 4 a 5 bar.' },
          { stepNumber: 3, title: 'Enfriamiento y pelado', instruction: 'Pasa una almohadilla o placa fría y retira el film de una sola pasada suave y rasante.', tip: 'No des tirones bruscos hacia arriba.' },
          { stepNumber: 4, title: 'Reprensado de sellado mate', instruction: 'Cubre con papel siliconado y prensa 5 a 8 segundos a la misma temperatura.', tip: 'Este paso ancla las fibras y deja un tacto suave y mate.' }
        ],
        illustrativeImages: ['https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&auto=format&fit=crop&q=80'],
        safetyWarnings: ['Prensa con ambas manos para evitar atrapamiento.'],
        frequentMistakes: [
          {
            mistake: 'Tinta levantada en los bordes durante el pelado.',
            cause: 'Pelar en caliente un film diseñado para pelado en frío.',
            solution: 'Espera a que el film alcance temperatura ambiente antes de retirarlo.'
          }
        ],
        summary: 'El reprensado final es el secreto para lograr máxima durabilidad y eliminar el brillo plástico del transfer.',
        technicalParameters: {
          temperatureC: '155°C',
          timeSeconds: 'Reprensado: 6 s',
          pressure: 'Media-Firme',
          peeling: 'Pelado en frío'
        },
        relatedModuleAction: {
          moduleId: 'tecnicas_estampado',
          buttonLabel: 'Consultar Ficha Técnica DTF'
        }
      }
    ],
    quiz: {
      id: 'quiz-dtf-1',
      title: 'Examen de Certificación DTF',
      description: 'Demuestra tu dominio técnico en la preparación y prensado DTF.',
      passingScorePercent: 80,
      questions: [
        {
          id: 'q1',
          question: '¿A qué temperatura recomendada se realiza la transferencia térmica de DTF estándar?',
          options: ['100°C - 110°C', '150°C - 160°C', '200°C - 210°C', '80°C - 90°C'],
          correctIndex: 1,
          explanation: 'La temperatura recomendada de activación del TPU termofusible en prensado plano es de 150°C a 160°C.'
        },
        {
          id: 'q2',
          question: '¿Por qué es indispensable el segundo prensado (reprensado) con papel kraft?',
          options: ['Para quemar el film', 'Para sellar la tinta en las fibras del tejido y dar acabado mate', 'Para enfriar la prenda', 'Para cambiar el color del arte'],
          correctIndex: 1,
          explanation: 'El reprensado de 5-8 segundos integra la tinta en los poros de la tela, asegurando resistencia al lavado.'
        }
      ]
    }
  },

  // 3. Serigrafía Textil
  {
    id: 'course-serig-1',
    title: 'Serigrafía Textil: Emulsionado, Insolado y Curado de Plastisol',
    description: 'Domina el revelado de bastidores, selección de lineatura de malla, registro de color y termofijación de tintas plastisol y base agua.',
    category: 'serigrafia',
    level: 'Avanzado',
    durationMinutes: 75,
    coverImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    isPublished: true,
    createdAt: '2026-03-03',
    lessons: [
      {
        id: 'les-ser-1',
        order: 1,
        title: 'Selección de Mallas y Emulsionado Fotográfico',
        durationMinutes: 30,
        objective: 'Elegir la malla adecuada (43T, 55T, 77T, 120T) y aplicar una capa uniforme de emulsión fotopolímera.',
        materialsNeeded: ['Mallas serigráficas tensadas (43T para plastisol cubriente, 77T para detalles)', 'Emulsión textil diazo o fotopolímero puro', 'Sensibilizador diazo'],
        toolsNeeded: ['Emulsionador de canal de aluminio con filo redondo y afilado', 'Insoladora UV de luz continua', 'Cuarto oscuro con luz amarilla'],
        procedureSummary: 'Preparación de la emulsión en luz ámbar, aplicación 1x1 o 2x1 y secado en horizontal.',
        stepByStep: [
          { stepNumber: 1, title: 'Limpiar y desengrasar la malla', instruction: 'Lava la pantalla con desengrasante biodegradable para eliminar grasa de huellas dactilares.', tip: 'El agua debe formar una película uniforme sin abrirse en gotas.' },
          { stepNumber: 2, title: 'Aplicar la emulsión con el canal de aluminio', instruction: 'Aplica 1 pasada por la cara exterior (contacto con prenda) y 1 por el interior.', tip: 'Mantén un ángulo de 45° con presión constante.' },
          { stepNumber: 3, title: 'Secado horizontal en cámara oscura', instruction: 'Coloca la pantalla con la cara de impresión hacia abajo a una temperatura de 30°C a 35°C.', tip: 'No superes los 40°C para no desensibilizar el polímero.' }
        ],
        illustrativeImages: ['https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80'],
        safetyWarnings: [
          'Usa guantes de nitrilo y gafas protectoras al manipular químicos serigráficos y recuperadores de emulsión.',
          'Trabaja bajo luz amarilla de seguridad para no velar la pantalla.'
        ],
        frequentMistakes: [
          {
            mistake: 'Pinhole o pequeños agujeros en la matriz durante el revelado.',
            cause: 'Partículas de polvo en el vidrio de la insoladora o burbujas en la emulsión.',
            solution: 'Limpia escrupulosamente el vidrio con alcohol isopropílico antes del contacto con el fotolito.'
          }
        ],
        summary: 'Una capa de emulsión lisa y calibrada garantiza bordes nítidos y evita el sangrado de tinta en prendas oscuras.',
        relatedModuleAction: {
          moduleId: 'preparacion_impresion',
          buttonLabel: 'Ir a Separador de Color RIP',
          contextId: 'serigrafia'
        }
      }
    ],
    quiz: {
      id: 'quiz-serig-1',
      title: 'Prueba de Conocimientos en Serigrafía',
      description: 'Valida los conceptos de mallas y curado de plastisol.',
      passingScorePercent: 80,
      questions: [
        {
          id: 'qs1',
          question: '¿Qué lineatura de malla se recomienda para estampar base blanca espesa de plastisol sobre prendas oscuras?',
          options: ['Malla 120T', 'Malla 43T a 55T', 'Malla 180T', 'Malla 15T'],
          correctIndex: 1,
          explanation: 'Las mallas abiertas de 43T a 55T permiten un mayor depósito de tinta blanca opaca con buena cobertura.'
        },
        {
          id: 'qs2',
          question: '¿A qué temperatura polimeriza completamente la tinta plastisol estándar en el túnel de secado?',
          options: ['90°C', '160°C - 165°C', '250°C', '120°C'],
          correctIndex: 1,
          explanation: 'El plastisol alcanza su curado y fusión total en todo su espesor entre 160°C y 165°C.'
        }
      ]
    }
  },

  // 4. Sublimación
  {
    id: 'course-sublim-1',
    title: 'Sublimación Textil y Rígidos: Perfiles ICC y Transferencia',
    description: 'Guía técnica para sublimación sobre camisetas de poliéster deportivo, tazas, placas de aluminio y mousepads.',
    category: 'sublimacion',
    level: 'Principiante',
    durationMinutes: 40,
    coverImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80',
    isPublished: true,
    createdAt: '2026-03-04',
    lessons: [
      {
        id: 'les-sub-1',
        order: 1,
        title: 'Calibración Térmica y Prensado de Poliéster',
        durationMinutes: 20,
        objective: 'Lograr colores negros intensos y gradientes limpios sin efecto fantasma (ghosting).',
        materialsNeeded: ['Papel de sublimación de secado rápido (100g/m²)', 'Tintas de sublimación originales', 'Prenda poliéster deportivo blanco'],
        toolsNeeded: ['Prensa térmica plana', 'Cinta térmica resistente a 220°C', 'Papel protector sulfito'],
        procedureSummary: 'Fijación con cinta térmica, prensado a 200°C por 45 segundos y retiro rápido en caliente.',
        stepByStep: [
          { stepNumber: 1, title: 'Imprimir en espejo con perfil ICC', instruction: 'Imprime el arte espejado utilizando el perfil de color calibrado para tu tinta y papel.', tip: 'No toques la impresión hasta que esté seca al 100%.' },
          { stepNumber: 2, title: 'Fijar con cinta térmica', instruction: 'Asegura el papel a la prenda con 4 puntos de cinta térmica para evitar movimientos.', tip: 'El más mínimo deslizamiento al abrir la prensa genera efecto fantasma.' },
          { stepNumber: 3, title: 'Prensado uniforme', instruction: 'Prensa a 200°C con presión media durante 45 segundos.', tip: 'Usa papel protector arriba y abajo para no manchar el teflón.' }
        ],
        illustrativeImages: ['https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80'],
        safetyWarnings: [
          'El papel y la prenda salen a 200°C. Manipula con guantes de desmoldeo.',
          'Evita inhalar los gases de gasificación de la tinta durante la apertura de la prensa.'
        ],
        frequentMistakes: [
          {
            mistake: 'Colores apagados o negro parduzco con tinte marrón.',
            cause: 'Exceso de tiempo o exceso de temperatura quemando el pigmento gaseoso.',
            solution: 'Reduce la temperatura a 195°C o baja 10 segundos el tiempo de exposición.'
          }
        ],
        summary: 'La sublimación integra el tinte en la fibra a nivel molecular, dejando un tacto completamente cero.',
        technicalParameters: {
          temperatureC: '200°C (392°F)',
          timeSeconds: '45 - 50 s',
          pressure: 'Media (3 - 4 Bar)',
          peeling: 'Retiro inmediato en caliente'
        },
        relatedModuleAction: {
          moduleId: 'tecnicas_estampado',
          buttonLabel: 'Ver Ficha Técnica Sublimación'
        }
      }
    ]
  },

  // 5. Vinilo Textil
  {
    id: 'course-vinil-1',
    title: 'Vinilo Térmico de Corte: Calibración de Cuchilla y Descarte',
    description: 'Corte vectorial preciso, profundidad de cuchilla, pelado fino y aplicación de vinilos metalizados, reflectantes y flock.',
    category: 'vinilo_textil',
    level: 'Principiante',
    durationMinutes: 35,
    coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    isPublished: true,
    createdAt: '2026-03-05',
    lessons: [
      {
        id: 'les-vin-1',
        order: 1,
        title: 'Calibración de la Cuchilla del Plotter y Test Cut',
        durationMinutes: 15,
        objective: 'Cortar únicamente la película de poliuretano sin traspasar el liner transportador transparente.',
        materialsNeeded: ['Rollo de vinil textil PU mate', 'Prenda de trabajo'],
        toolsNeeded: ['Plotter de corte vectorial', 'Pinzas o garfio de descarte (weeding tool)', 'Cuchilla de 45°'],
        procedureSummary: 'Ajuste de offset, prueba de corte triangular y descarte ergonómico.',
        stepByStep: [
          { stepNumber: 1, title: 'Ajustar la punta de la cuchilla', instruction: 'La punta debe asomar el grosor de media uña (0.5 mm).', tip: 'Menos es más: una cuchilla muy expuesta raya la tira de teflón del plotter.' },
          { stepNumber: 2, title: 'Ejecutar el Test Cut de prueba', instruction: 'Corta un cuadrado con un triángulo dentro.', tip: 'Debes poder pelar el cuadrado fácilmente sin que el triángulo se desplace.' },
          { stepNumber: 3, title: 'Descarte con pinza fina', instruction: 'Empieza por las esquinas y retira el excedente en ángulo oblicuo.', tip: 'Ten una buena iluminación directa sobre la mesa de pelado.' }
        ],
        illustrativeImages: ['https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=800&auto=format&fit=crop&q=80'],
        safetyWarnings: ['Cuidado con las puntas afiladas de las pinzas de descarte.'],
        frequentMistakes: [
          {
            mistake: 'Letras pequeñas se desprenden durante el corte.',
            cause: 'Velocidad de corte excesiva o cuchilla desafilada.',
            solution: 'Reduce la velocidad a 15-20 cm/s para tipografías menores a 1.5 cm.'
          }
        ],
        summary: 'El vinilo textil es insuperable para numeraciones deportivas, reflectantes de seguridad y detalles monocromáticos.',
        technicalParameters: {
          temperatureC: '150°C - 160°C',
          timeSeconds: '12 - 15 s',
          pressure: 'Media-Firme',
          peeling: 'Pelado en tibio o frío según fabricante'
        },
        relatedModuleAction: {
          moduleId: 'disenador_grafico',
          buttonLabel: 'Crear Arte Vectorial en Diseñador'
        }
      }
    ]
  },

  // 6. Preparación de Archivos
  {
    id: 'course-prep-1',
    title: 'Pre-prensa Textil: 300 DPI Reales, Underbase y Tramados RIP',
    description: 'Cómo entregar archivos impecables para imprenta textil: choke de base blanca, canales directos y perfiles CMYK.',
    category: 'preparacion_archivos',
    level: 'Intermedio',
    durationMinutes: 50,
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    isPublished: true,
    createdAt: '2026-03-06',
    lessons: [
      {
        id: 'les-prep-1',
        order: 1,
        title: 'Generación de Base Blanca con Rebaje (Choke) de 2px',
        durationMinutes: 20,
        objective: 'Evitar que la base blanca asome por fuera de los colores CMYK al estampar sobre prendas oscuras.',
        materialsNeeded: ['Arte final en PNG con transparencia de 300 DPI o vector SVG'],
        toolsNeeded: ['Módulo de Preparación de Impresión ESTAMPAPRO 360°'],
        procedureSummary: 'Generación del canal alfa, contracción perimetral y exportación con sangrado.',
        stepByStep: [
          { stepNumber: 1, title: 'Validar la densidad de píxeles', instruction: 'El arte debe tener al menos 300 DPI reales al tamaño de impresión física.', tip: 'No aumentes la escala en la pantalla sin verificar la resolución nativa.' },
          { stepNumber: 2, title: 'Aplicar el choke (rebaje perimetral)', instruction: 'Contrae la máscara blanca de 1 a 3 píxeles hacia adentro.', tip: 'Esto compensa las desviaciones milimétricas de registro de la máquina.' },
          { stepNumber: 3, title: 'Exportar para el software RIP', instruction: 'Descarga en formato TIFF o PDF con capas de color independientes.', tip: 'Conserva el perfil de color sRGB o FOGRA39 acordado.' }
        ],
        illustrativeImages: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80'],
        safetyWarnings: ['Revisa los bordes con zoom del 400% antes de enviar a producción.'],
        frequentMistakes: [
          {
            mistake: 'Borde blanco visible (halo blanco) alrededor del estampado.',
            cause: 'Falta de choke en la base blanca o desalineación de cabezales.',
            solution: 'Aumenta el choke a 2-3 píxeles en el panel de pre-prensa.'
          }
        ],
        summary: 'Un archivo bien preparado ahorra horas de calibración en máquina y evita mermas costosas.',
        relatedModuleAction: {
          moduleId: 'preparacion_impresion',
          buttonLabel: 'Abrir Centro de Preimpresión'
        }
      }
    ]
  }
];

export class LearningService {
  private static STORAGE_KEY_COURSES = 'estampapro_learning_courses';
  private static STORAGE_KEY_PROGRESS = 'estampapro_learning_progress';
  private static STORAGE_KEY_EVALUATIONS = 'estampapro_learning_evaluations';

  /**
   * Obtiene la lista completa de cursos
   */
  static async getCourses(): Promise<LearningCourse[]> {
    let courses: LearningCourse[] = [];
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_COURSES);
      if (stored) {
        courses = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading courses from localStorage:', e);
    }

    if (!courses || courses.length === 0) {
      courses = [...INITIAL_COURSES];
      this.saveLocalCourses(courses);
    }

    if (auth.currentUser) {
      try {
        const snap = await getDocs(collection(db, 'learningCourses'));
        if (!snap.empty) {
          const remote: LearningCourse[] = [];
          snap.forEach((d) => remote.push(d.data() as LearningCourse));
          const map = new Map<string, LearningCourse>();
          courses.forEach((c) => map.set(c.id, c));
          remote.forEach((c) => map.set(c.id, c));
          const merged = Array.from(map.values());
          this.saveLocalCourses(merged);
          return merged;
        }
      } catch (e) {
        console.warn('Firestore courses fetch notice:', e);
      }
    }

    return courses;
  }

  /**
   * Obtiene el progreso del usuario para un curso
   */
  static async getUserProgress(userId: string, courseId: string): Promise<UserCourseProgress> {
    const allProgress = await this.getAllProgress(userId);
    const existing = allProgress.find((p) => p.courseId === courseId);
    if (existing) return existing;

    const defaultProg: UserCourseProgress = {
      id: `prog-${userId}-${courseId}`,
      userId,
      courseId,
      completedLessonIds: [],
      isFavorite: false,
      quizCompleted: false,
      updatedAt: new Date().toISOString()
    };
    return defaultProg;
  }

  /**
   * Marca una lección como completada o alterna su estado
   */
  static async toggleLessonCompleted(userId: string, courseId: string, lessonId: string): Promise<UserCourseProgress> {
    const progress = await this.getUserProgress(userId, courseId);
    const isCompleted = progress.completedLessonIds.includes(lessonId);
    let updatedLessons: string[];

    if (isCompleted) {
      updatedLessons = progress.completedLessonIds.filter((id) => id !== lessonId);
    } else {
      updatedLessons = [...progress.completedLessonIds, lessonId];
    }

    const updatedProg: UserCourseProgress = {
      ...progress,
      completedLessonIds: updatedLessons,
      lastLessonId: lessonId,
      updatedAt: new Date().toISOString()
    };

    await this.saveProgress(updatedProg);
    return updatedProg;
  }

  /**
   * Alterna curso como favorito
   */
  static async toggleCourseFavorite(userId: string, courseId: string): Promise<boolean> {
    const progress = await this.getUserProgress(userId, courseId);
    const newFav = !progress.isFavorite;
    const updatedProg: UserCourseProgress = {
      ...progress,
      isFavorite: newFav,
      updatedAt: new Date().toISOString()
    };
    await this.saveProgress(updatedProg);
    return newFav;
  }

  /**
   * Guarda el resultado de un cuestionario
   */
  static async saveQuizResult(
    userId: string,
    courseId: string,
    courseTitle: string,
    scorePercent: number,
    passed: boolean
  ): Promise<void> {
    const progress = await this.getUserProgress(userId, courseId);
    const updatedProg: UserCourseProgress = {
      ...progress,
      quizCompleted: true,
      quizScore: scorePercent,
      updatedAt: new Date().toISOString()
    };
    await this.saveProgress(updatedProg);

    // Guardar en bitácora de evaluaciones
    const evalRecord: UserEvaluationRecord = {
      id: `eval-${Date.now()}`,
      userId,
      courseId,
      courseTitle,
      scorePercent,
      passed,
      createdAt: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    const allEvals = await this.getEvaluations(userId);
    const updatedEvals = [evalRecord, ...allEvals];
    localStorage.setItem(this.STORAGE_KEY_EVALUATIONS, JSON.stringify(updatedEvals));

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'learningEvaluations', evalRecord.id), evalRecord);
      } catch (e) {
        console.warn('Firestore write eval notice:', e);
      }
    }
  }

  /**
   * Obtiene el historial de evaluaciones del usuario
   */
  static async getEvaluations(userId: string): Promise<UserEvaluationRecord[]> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_EVALUATIONS);
      if (stored) {
        const evals: UserEvaluationRecord[] = JSON.parse(stored);
        return evals.filter((e) => e.userId === userId || !e.userId);
      }
    } catch (e) {
      console.warn('Error reading evaluations:', e);
    }
    return [];
  }

  /**
   * Panel de Administrador: Guardar o actualizar un curso
   */
  static async saveCourse(course: LearningCourse): Promise<void> {
    const courses = await this.getCourses();
    const idx = courses.findIndex((c) => c.id === course.id);
    let updated: LearningCourse[];
    if (idx >= 0) {
      updated = [...courses];
      updated[idx] = { ...course, updatedAt: new Date().toISOString() };
    } else {
      updated = [course, ...courses];
    }
    this.saveLocalCourses(updated);

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'learningCourses', course.id), course);
      } catch (e) {
        console.warn('Firestore save course notice:', e);
      }
    }
  }

  /**
   * Panel de Administrador: Eliminar curso
   */
  static async deleteCourse(courseId: string): Promise<void> {
    const courses = await this.getCourses();
    const filtered = courses.filter((c) => c.id !== courseId);
    this.saveLocalCourses(filtered);

    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, 'learningCourses', courseId));
      } catch (e) {
        console.warn('Firestore delete course notice:', e);
      }
    }
  }

  private static async getAllProgress(userId: string): Promise<UserCourseProgress[]> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_PROGRESS);
      if (stored) {
        const arr: UserCourseProgress[] = JSON.parse(stored);
        return arr.filter((p) => p.userId === userId || !p.userId);
      }
    } catch (e) {
      console.warn('Error reading progress:', e);
    }
    return [];
  }

  private static async saveProgress(prog: UserCourseProgress): Promise<void> {
    const all = await this.getAllProgress(prog.userId);
    const idx = all.findIndex((p) => p.courseId === prog.courseId);
    let updated: UserCourseProgress[];
    if (idx >= 0) {
      updated = [...all];
      updated[idx] = prog;
    } else {
      updated = [...all, prog];
    }
    localStorage.setItem(this.STORAGE_KEY_PROGRESS, JSON.stringify(updated));

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'learningProgress', prog.id), prog);
      } catch (e) {
        console.warn('Firestore write progress notice:', e);
      }
    }
  }

  private static saveLocalCourses(courses: LearningCourse[]) {
    try {
      localStorage.setItem(this.STORAGE_KEY_COURSES, JSON.stringify(courses));
    } catch (e) {
      console.warn('LocalStorage save courses notice:', e);
    }
  }
}
