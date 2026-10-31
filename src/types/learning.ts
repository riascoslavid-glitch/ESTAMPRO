export type LearningCategory =
  | 'intro_estampados'
  | 'dtf'
  | 'dtg'
  | 'sublimacion'
  | 'vinilo_textil'
  | 'serigrafia'
  | 'bordado'
  | 'uv_dtf'
  | 'transfer'
  | 'diseno_grafico'
  | 'preparacion_archivos'
  | 'uso_maquinas'
  | 'materiales_consumibles'
  | 'tecnicas_acabado'
  | 'control_calidad'
  | 'costos_administracion'
  | 'mantenimiento_equipos';

export interface LearningCategoryMeta {
  id: LearningCategory;
  name: string;
  description: string;
  iconName: string;
}

export const LEARNING_CATEGORIES_META: LearningCategoryMeta[] = [
  { id: 'intro_estampados', name: 'Introducción al negocio de estampados', description: 'Modelos de negocio, elección de técnicas y configuración del taller.', iconName: 'Compass' },
  { id: 'dtf', name: 'DTF (Direct to Film)', description: 'Impresión digital, curado de poliamida y transferencia térmica.', iconName: 'Layers' },
  { id: 'dtg', name: 'DTG (Direct to Garment)', description: 'Inyección directa sobre algodón, pretratamiento y curado continuo.', iconName: 'Printer' },
  { id: 'sublimacion', name: 'Sublimación', description: 'Gasificación de tintas sobre poliéster y sustratos polimerizados.', iconName: 'Flame' },
  { id: 'vinilo_textil', name: 'Vinilo textil', description: 'Plotter de corte, descarte (weeding) y prensado térmico.', iconName: 'Scissors' },
  { id: 'serigrafia', name: 'Serigrafía', description: 'Emulsiones, mallas, tintas plastisol/base agua y revelado.', iconName: 'Grid' },
  { id: 'bordado', name: 'Bordado', description: 'Ponchado, digitalización de puntadas, bastidores y tensiones.', iconName: 'Sparkles' },
  { id: 'uv_dtf', name: 'UV DTF', description: 'Transferencias rígidas polimerizadas por luz ultravioleta.', iconName: 'Sun' },
  { id: 'transfer', name: 'Transfer', description: 'Papeles transfer para prendas claras y oscuras con plancha plana.', iconName: 'Copy' },
  { id: 'diseno_grafico', name: 'Diseño gráfico', description: 'Composición textil, vectorización, tipografías y separación CMYK.', iconName: 'PenTool' },
  { id: 'preparacion_archivos', name: 'Preparación de archivos', description: 'Ajuste de 300 DPI, Base Blanca underbase, choke y formatos RIP.', iconName: 'FileCheck' },
  { id: 'uso_maquinas', name: 'Uso de máquinas', description: 'Operación segura de prensas térmicas, túneles y calandras.', iconName: 'Cpu' },
  { id: 'materiales_consumibles', name: 'Materiales y consumibles', description: 'Poliamidas, papeles, films PET, emulsiones y solventes ecológicos.', iconName: 'Package' },
  { id: 'tecnicas_acabado', name: 'Técnicas de acabado', description: 'Reprensado mate/brillo, tacto cero, foils metalizados y relieve.', iconName: 'Award' },
  { id: 'control_calidad', name: 'Control de calidad', description: 'Pruebas de solidez al lavado, crocking, elongación y dictamen.', iconName: 'CheckCircle2' },
  { id: 'costos_administracion', name: 'Costos y administración del negocio', description: 'Cálculo de mermas, tarifas eléctricas, mano de obra y cotizaciones.', iconName: 'Calculator' },
  { id: 'mantenimiento_equipos', name: 'Mantenimiento de equipos', description: 'Limpieza de dampers, lubricación de carros y purga de cabezales.', iconName: 'Wrench' }
];

export type CourseLevel = 'Principiante' | 'Intermedio' | 'Avanzado' | 'Maestro';

export interface StepInstruction {
  stepNumber: number;
  title: string;
  instruction: string;
  tip?: string;
}

export interface FrequentMistake {
  mistake: string;
  cause: string;
  solution: string;
}

export interface LearningLesson {
  id: string;
  order: number;
  title: string;
  durationMinutes: number;
  objective: string;
  materialsNeeded: string[];
  toolsNeeded: string[];
  procedureSummary: string;
  stepByStep: StepInstruction[];
  illustrativeImages: string[];
  safetyWarnings: string[];
  frequentMistakes: FrequentMistake[];
  summary: string;
  videoUrl?: string;
  technicalParameters?: {
    temperatureC?: string;
    timeSeconds?: string;
    pressure?: string;
    peeling?: string;
  };
  relatedModuleAction?: {
    moduleId: string;
    buttonLabel: string;
    contextId?: string;
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LearningQuiz {
  id: string;
  title: string;
  description: string;
  passingScorePercent: number;
  questions: QuizQuestion[];
}

export interface LearningCourse {
  id: string;
  title: string;
  description: string;
  category: LearningCategory;
  level: CourseLevel;
  durationMinutes: number;
  coverImage: string;
  lessons: LearningLesson[];
  quiz?: LearningQuiz;
  isPublished: boolean;
  isCustom?: boolean;
  author?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UserCourseProgress {
  id: string;
  userId: string;
  courseId: string;
  completedLessonIds: string[];
  isFavorite: boolean;
  lastLessonId?: string;
  quizCompleted: boolean;
  quizScore?: number;
  updatedAt: string;
}

export interface UserEvaluationRecord {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  scorePercent: number;
  passed: boolean;
  createdAt: string;
}
