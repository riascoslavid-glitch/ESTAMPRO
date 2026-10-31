import { LibraryResourceItem, LibraryFolder, LibraryCategory, LibraryPermission, LibraryFormat } from '../../types/library';
import { db, auth } from '../../lib/firebase';
import { collection, doc, setDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';

// SVG Helper to generate clean, lightweight, beautiful vectors
const svgDataUri = (svgContent: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
};

// 15 Curated Base Resources representing the 15 categories
export const INITIAL_CURATED_RESOURCES: LibraryResourceItem[] = [
  // 1. Camisetas
  {
    id: 'lib-res-cam-1',
    title: 'Streetwear Skull & Pistons Vintage',
    category: 'camisetas',
    format: 'SVG',
    tags: ['streetwear', 'vintage', 'cráneo', 'pistones', 'retro'],
    widthPx: 1200,
    heightPx: 1400,
    sizeBytes: 18450,
    previewUrl: svgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 450" width="100%" height="100%">
        <rect width="400" height="450" fill="#0f172a" rx="16"/>
        <circle cx="200" cy="210" r="140" fill="none" stroke="#f59e0b" stroke-width="4" stroke-dasharray="8 6"/>
        <path d="M120 160 L280 280 M280 160 L120 280" stroke="#64748b" stroke-width="14" stroke-linecap="round"/>
        <path d="M110 150 L130 170 M270 270 L290 290 M270 170 L290 150 M110 290 L130 270" stroke="#f59e0b" stroke-width="6"/>
        <circle cx="200" cy="200" r="65" fill="#f8fafc" stroke="#0f172a" stroke-width="6"/>
        <circle cx="180" cy="195" r="16" fill="#0f172a"/>
        <circle cx="220" cy="195" r="16" fill="#0f172a"/>
        <path d="M195 215 L205 215 L200 230 Z" fill="#0f172a"/>
        <rect x="180" y="245" width="40" height="20" rx="4" fill="#f8fafc" stroke="#0f172a" stroke-width="4"/>
        <line x1="190" y1="245" x2="190" y2="265" stroke="#0f172a" stroke-width="3"/>
        <line x1="200" y1="245" x2="200" y2="265" stroke="#0f172a" stroke-width="3"/>
        <line x1="210" y1="245" x2="210" y2="265" stroke="#0f172a" stroke-width="3"/>
        <text x="200" y="70" font-family="Impact, sans-serif" font-size="32" fill="#f59e0b" font-weight="bold" text-anchor="middle" letter-spacing="4">MOTORCYCLE CLUB</text>
        <text x="200" y="405" font-family="Arial, sans-serif" font-size="16" fill="#94a3b8" font-weight="bold" text-anchor="middle" letter-spacing="6">CUSTOM GARAGE · 1988</text>
      </svg>
    `),
    isFavorite: true,
    permission: 'publico',
    isCustom: false,
    recommendedTechnique: 'dtf',
    dpi: 300,
    colorCount: 4,
    createdAt: '2026-03-01'
  },
  // 2. Deportivos
  {
    id: 'lib-res-dep-1',
    title: 'Dorsal Deportivo Atletic 88 Pro',
    category: 'deportivos',
    format: 'SVG',
    tags: ['dorsal', 'deportivo', 'numero', 'jersey', 'atletico'],
    widthPx: 1000,
    heightPx: 1200,
    sizeBytes: 12200,
    previewUrl: svgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 450" width="100%" height="100%">
        <rect width="400" height="450" fill="#090d16" rx="16"/>
        <text x="200" y="75" font-family="'Arial Black', sans-serif" font-size="28" fill="#38bdf8" text-anchor="middle" letter-spacing="6">CHAMPIONS</text>
        <!-- Numero 88 con cortes deportivos -->
        <g fill="#f8fafc" stroke="#0284c7" stroke-width="8" stroke-linejoin="bevel">
          <text x="140" y="310" font-family="Impact, sans-serif" font-size="220" text-anchor="middle">8</text>
          <text x="260" y="310" font-family="Impact, sans-serif" font-size="220" text-anchor="middle">8</text>
        </g>
        <path d="M60 170 L340 170" stroke="#ef4444" stroke-width="4" stroke-dasharray="12 8"/>
        <text x="200" y="395" font-family="sans-serif" font-size="18" fill="#f8fafc" font-weight="900" text-anchor="middle" letter-spacing="4">ALL-STAR TOURNAMENT</text>
      </svg>
    `),
    isFavorite: false,
    permission: 'publico',
    isCustom: false,
    recommendedTechnique: 'vinilo_textil',
    dpi: 300,
    colorCount: 3,
    createdAt: '2026-03-02'
  },
  // 3. Logos
  {
    id: 'lib-res-log-1',
    title: 'Emblema Montaña & Brújula Aventura',
    category: 'logos',
    format: 'SVG',
    tags: ['logo', 'emblema', 'montaña', 'outdoor', 'aventura'],
    widthPx: 1000,
    heightPx: 1000,
    sizeBytes: 15300,
    previewUrl: svgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <rect width="400" height="400" fill="#0f172a" rx="16"/>
        <circle cx="200" cy="200" r="160" fill="none" stroke="#10b981" stroke-width="6"/>
        <circle cx="200" cy="200" r="145" fill="none" stroke="#334155" stroke-width="2"/>
        <polygon points="200,80 270,240 130,240" fill="#3b82f6" opacity="0.9"/>
        <polygon points="200,80 230,150 200,165 170,150" fill="#f8fafc"/>
        <polygon points="250,140 310,240 190,240" fill="#1d4ed8" opacity="0.8"/>
        <polygon points="150,140 210,240 90,240" fill="#1e40af" opacity="0.8"/>
        <path d="M130 240 L270 240 L290 280 L110 280 Z" fill="#059669"/>
        <text x="200" y="325" font-family="'Trebuchet MS', sans-serif" font-size="24" fill="#f8fafc" font-weight="bold" text-anchor="middle" letter-spacing="5">HIGH PEAKS</text>
        <text x="200" y="355" font-family="sans-serif" font-size="12" fill="#10b981" font-weight="600" text-anchor="middle" letter-spacing="3">EXPEDITIONS · EST. 2012</text>
      </svg>
    `),
    isFavorite: true,
    permission: 'publico',
    isCustom: false,
    recommendedTechnique: 'bordado',
    dpi: 300,
    colorCount: 5,
    createdAt: '2026-03-03'
  },
  // 4. Tipografías
  {
    id: 'lib-res-tip-1',
    title: 'Composición Tipográfica Urban Bronx',
    category: 'tipografias',
    format: 'SVG',
    tags: ['tipografia', 'urbano', 'graffiti', 'lettering', 'texto'],
    widthPx: 1200,
    heightPx: 800,
    sizeBytes: 11500,
    previewUrl: svgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 300" width="100%" height="100%">
        <rect width="450" height="300" fill="#111827" rx="16"/>
        <g transform="rotate(-6 225 150)">
          <text x="228" y="132" font-family="Impact, sans-serif" font-size="64" fill="#000000" text-anchor="middle" letter-spacing="2">AUTHENTIC</text>
          <text x="225" y="130" font-family="Impact, sans-serif" font-size="64" fill="#ec4899" text-anchor="middle" letter-spacing="2">AUTHENTIC</text>
          <text x="228" y="202" font-family="Impact, sans-serif" font-size="76" fill="#000000" text-anchor="middle" letter-spacing="4">STREETWEAR</text>
          <text x="225" y="200" font-family="Impact, sans-serif" font-size="76" fill="#06b6d4" text-anchor="middle" letter-spacing="4">STREETWEAR</text>
          <rect x="80" y="225" width="290" height="6" fill="#eab308"/>
        </g>
      </svg>
    `),
    isFavorite: false,
    permission: 'publico',
    isCustom: false,
    recommendedTechnique: 'serigrafia',
    dpi: 300,
    colorCount: 4,
    createdAt: '2026-03-04'
  },
  // 5. Plantillas
  {
    id: 'lib-res-plan-1',
    title: 'Plantilla Circular Insignia Universitaria',
    category: 'plantillas',
    format: 'SVG',
    tags: ['plantilla', 'universidad', 'escudo', 'insignia', 'circular'],
    widthPx: 1000,
    heightPx: 1000,
    sizeBytes: 14200,
    previewUrl: svgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <rect width="400" height="400" fill="#1e1b4b" rx="16"/>
        <circle cx="200" cy="200" r="160" fill="none" stroke="#fbbf24" stroke-width="8"/>
        <circle cx="200" cy="200" r="130" fill="none" stroke="#f8fafc" stroke-width="3" stroke-dasharray="6 4"/>
        <path id="curveTop" d="M 80,200 A 120,120 0 0,1 320,200" fill="none"/>
        <text font-family="'Times New Roman', serif" font-size="24" fill="#fbbf24" font-weight="bold" letter-spacing="4">
          <textPath href="#curveTop" startOffset="50%" text-anchor="middle">ACADEMY OF ARTS</textPath>
        </text>
        <path d="M 160 170 L 200 130 L 240 170 L 220 250 L 180 250 Z" fill="#6366f1" stroke="#fbbf24" stroke-width="4"/>
        <text x="200" y="220" font-family="serif" font-size="44" fill="#fbbf24" font-weight="bold" text-anchor="middle">A</text>
        <text x="200" y="320" font-family="sans-serif" font-size="16" fill="#f8fafc" font-weight="bold" text-anchor="middle" letter-spacing="3">EST. 1994 · VARSITY</text>
      </svg>
    `),
    isFavorite: false,
    permission: 'publico',
    isCustom: false,
    recommendedTechnique: 'dtf',
    dpi: 300,
    colorCount: 4,
    createdAt: '2026-03-05'
  },
  // 6. Ilustraciones
  {
    id: 'lib-res-ilus-1',
    title: 'Tigre Neón Cyberpunk Geométrico',
    category: 'ilustraciones',
    format: 'SVG',
    tags: ['ilustracion', 'tigre', 'geometrico', 'cyberpunk', 'neon'],
    widthPx: 1200,
    heightPx: 1200,
    sizeBytes: 24500,
    previewUrl: svgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <rect width="400" height="400" fill="#030712" rx="16"/>
        <!-- Cabeza de tigre vectorial poligonal -->
        <g stroke="#06b6d4" stroke-width="2.5" fill="#0f172a">
          <polygon points="200,60 140,110 200,140 260,110" fill="#0284c7" opacity="0.6"/>
          <polygon points="140,110 90,140 120,200 160,170" fill="#0e7490"/>
          <polygon points="260,110 310,140 280,200 240,170" fill="#0e7490"/>
          <polygon points="160,170 200,140 240,170 200,230" fill="#06b6d4" opacity="0.8"/>
          <!-- Ojos ambar -->
          <polygon points="145,180 175,185 155,195" fill="#f59e0b" stroke="#fbbf24"/>
          <polygon points="255,180 225,185 245,195" fill="#f59e0b" stroke="#fbbf24"/>
          <!-- Hocico y colmillos -->
          <polygon points="200,230 170,260 230,260" fill="#f43f5e" stroke="#fb7185"/>
          <polygon points="175,260 185,290 195,260" fill="#f8fafc"/>
          <polygon points="225,260 215,290 205,260" fill="#f8fafc"/>
          <polygon points="170,260 200,320 230,260" fill="#1e293b"/>
        </g>
        <text x="200" y="375" font-family="'Courier New', monospace" font-size="18" fill="#06b6d4" font-weight="bold" text-anchor="middle" letter-spacing="6">NEON PREDATOR</text>
      </svg>
    `),
    isFavorite: true,
    permission: 'publico',
    isCustom: false,
    recommendedTechnique: 'dtf',
    dpi: 300,
    colorCount: 6,
    createdAt: '2026-03-06'
  },
  // 7. Iconos
  {
    id: 'lib-res-ico-1',
    title: 'Set de Iconos Minimalistas Outdoor',
    category: 'iconos',
    format: 'SVG',
    tags: ['iconos', 'minimalista', 'outdoor', 'campamento', 'naturaleza'],
    widthPx: 800,
    heightPx: 800,
    sizeBytes: 8500,
    previewUrl: svgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <rect width="400" height="400" fill="#1e293b" rx="16"/>
        <g stroke="#38bdf8" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- Pino -->
          <path d="M100 130 L130 90 L160 130 L140 130 L170 180 L70 180 L100 130 Z M120 180 L120 200"/>
          <!-- Carpa -->
          <path d="M250 110 L310 190 L190 190 Z M250 110 L250 190 M230 190 L250 140 L270 190"/>
          <!-- Fogata -->
          <path d="M100 300 L140 280 M140 300 L100 280 M120 280 C110 260 130 240 120 220 C135 240 135 260 120 280 Z"/>
          <!-- Brújula -->
          <circle cx="260" cy="270" r="40"/>
          <polygon points="260,240 270,270 260,265 250,270" fill="#f43f5e" stroke="#f43f5e"/>
          <polygon points="260,300 270,270 260,275 250,270" fill="#94a3b8" stroke="#94a3b8"/>
        </g>
      </svg>
    `),
    isFavorite: false,
    permission: 'publico',
    isCustom: false,
    recommendedTechnique: 'bordado',
    dpi: 300,
    colorCount: 3,
    createdAt: '2026-03-07'
  },
  // 8. Fondos
  {
    id: 'lib-res-fon-1',
    title: 'Fondo Geométrico Onda Abstracta',
    category: 'fondos',
    format: 'SVG',
    tags: ['fondo', 'geometria', 'ondas', 'abstracto', 'degradado'],
    widthPx: 1600,
    heightPx: 1000,
    sizeBytes: 13800,
    previewUrl: svgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 350" width="100%" height="100%">
        <defs>
          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4f46e5"/>
            <stop offset="50%" stop-color="#06b6d4"/>
            <stop offset="100%" stop-color="#10b981"/>
          </linearGradient>
        </defs>
        <rect width="500" height="350" fill="#0f172a" rx="16"/>
        <path d="M0,150 C150,250 250,50 500,180 L500,350 L0,350 Z" fill="url(#waveGrad)" opacity="0.8"/>
        <path d="M0,220 C200,120 300,280 500,220 L500,350 L0,350 Z" fill="#06b6d4" opacity="0.4"/>
        <circle cx="420" cy="90" r="45" fill="#f59e0b" opacity="0.8"/>
      </svg>
    `),
    isFavorite: false,
    permission: 'publico',
    isCustom: false,
    recommendedTechnique: 'sublimacion',
    dpi: 300,
    colorCount: 4,
    createdAt: '2026-03-08'
  },
  // 9. Texturas
  {
    id: 'lib-res-tex-1',
    title: 'Textura Desgaste Vintage Grunge Halftone',
    category: 'texturas',
    format: 'SVG',
    tags: ['textura', 'desgaste', 'grunge', 'vintage', 'semitono'],
    widthPx: 1200,
    heightPx: 1200,
    sizeBytes: 16800,
    previewUrl: svgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <rect width="400" height="400" fill="#18181b" rx="16"/>
        <g fill="#f43f5e" opacity="0.85">
          <!-- Patrón de rasguños y manchas grunge vectoriales -->
          <circle cx="80" cy="90" r="3"/>
          <circle cx="120" cy="60" r="5"/>
          <circle cx="180" cy="110" r="4"/>
          <circle cx="260" cy="80" r="6"/>
          <circle cx="320" cy="130" r="4"/>
          <path d="M50,180 Q90,160 140,190 T240,170 T350,200" stroke="#f43f5e" stroke-width="4" fill="none" stroke-dasharray="8 12 4 16"/>
          <path d="M80,240 Q160,270 240,230 T360,260" stroke="#f43f5e" stroke-width="3" fill="none" stroke-dasharray="14 8 6 10"/>
          <circle cx="110" cy="320" r="8"/>
          <circle cx="210" cy="300" r="4"/>
          <circle cx="290" cy="340" r="7"/>
          <rect x="150" y="210" width="100" height="4" transform="rotate(25 200 210)"/>
          <rect x="220" y="100" width="60" height="3" transform="rotate(-35 250 100)"/>
        </g>
        <text x="200" y="380" font-family="monospace" font-size="14" fill="#a1a1aa" text-anchor="middle">DISTRESSED OVERLAY MASK</text>
      </svg>
    `),
    isFavorite: true,
    permission: 'publico',
    isCustom: false,
    recommendedTechnique: 'serigrafia',
    dpi: 300,
    colorCount: 2,
    createdAt: '2026-03-09'
  },
  // 10. Patrones
  {
    id: 'lib-res-pat-1',
    title: 'Patrón Repetitivo Botánico Tropical Seamless',
    category: 'patrones',
    format: 'SVG',
    tags: ['patron', 'botanico', 'tropical', 'hojas', 'seamless'],
    widthPx: 1200,
    heightPx: 1200,
    sizeBytes: 19200,
    previewUrl: svgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <rect width="400" height="400" fill="#064e3b" rx="16"/>
        <g fill="#10b981" opacity="0.9">
          <!-- Hojas de monstera estilizadas -->
          <path d="M60 80 C80 30 140 40 140 100 C140 140 80 150 60 80 Z"/>
          <path d="M260 80 C280 30 340 40 340 100 C340 140 280 150 260 80 Z"/>
          <path d="M160 220 C180 170 240 180 240 240 C240 280 180 290 160 220 Z"/>
          <path d="M60 320 C80 270 140 280 140 340 C140 380 80 390 60 320 Z"/>
          <path d="M280 320 C300 270 360 280 360 340 C360 380 300 390 280 320 Z"/>
        </g>
        <g stroke="#34d399" stroke-width="3" fill="none">
          <line x1="60" y1="80" x2="120" y2="120"/>
          <line x1="260" y1="80" x2="320" y2="120"/>
          <line x1="160" y1="220" x2="220" y2="260"/>
        </g>
        <circle cx="200" cy="100" r="14" fill="#f43f5e"/>
        <circle cx="100" cy="240" r="14" fill="#f59e0b"/>
        <circle cx="320" cy="240" r="14" fill="#f43f5e"/>
      </svg>
    `),
    isFavorite: false,
    permission: 'publico',
    isCustom: false,
    recommendedTechnique: 'sublimacion',
    dpi: 300,
    colorCount: 4,
    createdAt: '2026-03-10'
  },
  // 11. Mockups
  {
    id: 'lib-res-moc-1',
    title: 'Mockup Guía Silueta Camiseta Heavyweight',
    category: 'mockups',
    format: 'SVG',
    tags: ['mockup', 'camiseta', 'silueta', 'guia', 'heavyweight'],
    widthPx: 1200,
    heightPx: 1400,
    sizeBytes: 14500,
    previewUrl: svgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 450" width="100%" height="100%">
        <rect width="400" height="450" fill="#1e293b" rx="16"/>
        <!-- Silueta de playera con recuadro estampado -->
        <path d="M140 60 Q200 95 260 60 L350 120 L300 170 L260 145 L260 380 L140 380 L140 145 L100 170 L50 120 Z" fill="#334155" stroke="#64748b" stroke-width="4"/>
        <path d="M150 63 Q200 92 250 63" fill="none" stroke="#94a3b8" stroke-width="3"/>
        <!-- Área de estampado delimitada -->
        <rect x="160" y="160" width="80" height="110" fill="#38bdf8" fill-opacity="0.2" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6 4" rx="4"/>
        <text x="200" y="220" font-family="sans-serif" font-size="11" fill="#38bdf8" font-weight="bold" text-anchor="middle">ÁREA MÁX</text>
        <text x="200" y="235" font-family="sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">28 x 35 cm</text>
        <text x="200" y="420" font-family="sans-serif" font-size="14" fill="#f8fafc" font-weight="bold" text-anchor="middle">T-SHIRT BLANK PRO</text>
      </svg>
    `),
    isFavorite: false,
    permission: 'publico',
    isCustom: false,
    recommendedTechnique: 'dtf',
    dpi: 300,
    colorCount: 3,
    createdAt: '2026-03-11'
  },
  // 12. Infantiles
  {
    id: 'lib-res-inf-1',
    title: 'Dinosaurio Amigable Astronauta Espacial',
    category: 'infantiles',
    format: 'SVG',
    tags: ['infantil', 'dinosaurio', 'espacio', 'astronauta', 'niños'],
    widthPx: 1000,
    heightPx: 1000,
    sizeBytes: 17200,
    previewUrl: svgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <rect width="400" height="400" fill="#172554" rx="16"/>
        <!-- Planeta y estrellas -->
        <circle cx="320" cy="80" r="35" fill="#f59e0b"/>
        <ellipse cx="320" cy="80" rx="55" ry="12" fill="none" stroke="#fbbf24" stroke-width="3" transform="rotate(-20 320 80)"/>
        <circle cx="80" cy="70" r="4" fill="#f8fafc"/>
        <circle cx="60" cy="180" r="3" fill="#f8fafc"/>
        <circle cx="340" cy="280" r="3" fill="#f8fafc"/>
        <!-- Casco astronauta -->
        <circle cx="200" cy="180" r="80" fill="#ffffff" stroke="#93c5fd" stroke-width="6"/>
        <circle cx="200" cy="180" r="65" fill="#38bdf8" opacity="0.3"/>
        <!-- Cabeza dino -->
        <path d="M160 210 C140 140 220 120 230 180 C230 210 180 230 160 210 Z" fill="#22c55e"/>
        <circle cx="190" cy="165" r="8" fill="#0f172a"/>
        <circle cx="192" cy="163" r="3" fill="#ffffff"/>
        <path d="M190 195 Q210 205 220 190" stroke="#0f172a" stroke-width="4" fill="none" stroke-linecap="round"/>
        <!-- Dientes dino -->
        <polygon points="195,198 200,206 205,198" fill="#ffffff"/>
        <text x="200" y="330" font-family="'Comic Sans MS', cursive, sans-serif" font-size="24" fill="#38bdf8" font-weight="bold" text-anchor="middle">LITTLE EXPLORER</text>
      </svg>
    `),
    isFavorite: true,
    permission: 'publico',
    isCustom: false,
    recommendedTechnique: 'dtf',
    dpi: 300,
    colorCount: 6,
    createdAt: '2026-03-12'
  },
  // 13. Empresariales
  {
    id: 'lib-res-emp-1',
    title: 'Insignia Corporativa Hexagonal Tech',
    category: 'empresariales',
    format: 'SVG',
    tags: ['empresarial', 'corporativo', 'tech', 'empresa', 'uniformes'],
    widthPx: 1000,
    heightPx: 1000,
    sizeBytes: 12800,
    previewUrl: svgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <rect width="400" height="400" fill="#0f172a" rx="16"/>
        <polygon points="200,60 320,130 320,270 200,340 80,270 80,130" fill="none" stroke="#2563eb" stroke-width="8"/>
        <polygon points="200,85 295,140 295,255 200,310 105,255 105,140" fill="#1e293b"/>
        <path d="M150 170 L200 130 L250 170 L250 240 L150 240 Z" fill="#3b82f6"/>
        <circle cx="200" cy="180" r="22" fill="#f8fafc"/>
        <text x="200" y="285" font-family="sans-serif" font-size="16" fill="#f8fafc" font-weight="bold" text-anchor="middle" letter-spacing="4">NEXUS GLOBAL</text>
        <text x="200" y="305" font-family="sans-serif" font-size="10" fill="#60a5fa" text-anchor="middle" letter-spacing="2">SOLUTIONS · STAFF</text>
      </svg>
    `),
    isFavorite: false,
    permission: 'publico',
    isCustom: false,
    recommendedTechnique: 'bordado',
    dpi: 300,
    colorCount: 4,
    createdAt: '2026-03-13'
  },
  // 14. Promocionales
  {
    id: 'lib-res-pro-1',
    title: 'Distintivo Sello Festival de Música Verano',
    category: 'promocionales',
    format: 'SVG',
    tags: ['promocional', 'festival', 'evento', 'musica', 'merchandising'],
    widthPx: 1000,
    heightPx: 1000,
    sizeBytes: 16500,
    previewUrl: svgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <rect width="400" height="400" fill="#4c0519" rx="16"/>
        <circle cx="200" cy="200" r="160" fill="#881337" stroke="#fb7185" stroke-width="6"/>
        <!-- Ondas de sonido y guitarra/vinilo -->
        <circle cx="200" cy="200" r="80" fill="#0f172a" stroke="#fbbf24" stroke-width="4"/>
        <circle cx="200" cy="200" r="30" fill="#f43f5e"/>
        <circle cx="200" cy="200" r="10" fill="#ffffff"/>
        <text x="200" y="85" font-family="Impact, sans-serif" font-size="30" fill="#fbbf24" text-anchor="middle" letter-spacing="4">SUMMER FEST</text>
        <text x="200" y="340" font-family="sans-serif" font-size="18" fill="#f8fafc" font-weight="bold" text-anchor="middle" letter-spacing="6">LIVE TOUR 2026</text>
        <!-- Estrellas decorativas -->
        <polygon points="90,190 98,206 116,206 102,216 107,232 90,222 73,232 78,216 64,206 82,206" fill="#fbbf24"/>
        <polygon points="310,190 318,206 336,206 322,216 327,232 310,222 293,232 298,216 284,206 302,206" fill="#fbbf24"/>
      </svg>
    `),
    isFavorite: false,
    permission: 'publico',
    isCustom: false,
    recommendedTechnique: 'serigrafia',
    dpi: 300,
    colorCount: 5,
    createdAt: '2026-03-14'
  },
  // 15. Personalizados (Ejemplo inicial para taller)
  {
    id: 'lib-res-per-1',
    title: 'Monograma Taller Harmony Estampados',
    category: 'personalizados',
    format: 'SVG',
    tags: ['personalizado', 'monograma', 'taller', 'harmony', 'estampapro'],
    widthPx: 1000,
    heightPx: 1000,
    sizeBytes: 13900,
    previewUrl: svgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <rect width="400" height="400" fill="#020617" rx="16"/>
        <circle cx="200" cy="200" r="150" fill="none" stroke="#06b6d4" stroke-width="6"/>
        <circle cx="200" cy="200" r="135" fill="none" stroke="#3b82f6" stroke-width="2" stroke-dasharray="8 6"/>
        <g fill="#06b6d4">
          <path d="M140 120 L170 120 L170 180 L230 180 L230 120 L260 120 L260 280 L230 280 L230 210 L170 210 L170 280 L140 280 Z"/>
        </g>
        <circle cx="200" cy="90" r="8" fill="#f59e0b"/>
        <text x="200" y="330" font-family="sans-serif" font-size="14" fill="#f8fafc" font-weight="900" text-anchor="middle" letter-spacing="4">HARMONY ESTAMPADOS</text>
        <text x="200" y="355" font-family="monospace" font-size="11" fill="#38bdf8" text-anchor="middle">EDICIÓN MAESTRA</text>
      </svg>
    `),
    isFavorite: true,
    permission: 'taller',
    isCustom: true,
    recommendedTechnique: 'dtf',
    dpi: 300,
    colorCount: 4,
    createdAt: '2026-03-15'
  }
];

export const INITIAL_FOLDERS: LibraryFolder[] = [
  { id: 'fol-1', name: 'Artes Listos para Estampar', color: '#06b6d4', createdAt: '2026-03-01' },
  { id: 'fol-2', name: 'Colección Streetwear 2026', color: '#ec4899', createdAt: '2026-03-02' },
  { id: 'fol-3', name: 'Escudos y Números Deportivos', color: '#3b82f6', createdAt: '2026-03-03' },
  { id: 'fol-4', name: 'Logos Corporativos & Uniformes', color: '#10b981', createdAt: '2026-03-04' }
];

export class LibraryStorageService {
  private static STORAGE_KEY_RESOURCES = 'estampapro_library_resources';
  private static STORAGE_KEY_FOLDERS = 'estampapro_library_folders';

  /**
   * Obtiene todos los recursos de la biblioteca (base + usuario) con sincronización Firestore
   */
  static async getResources(): Promise<LibraryResourceItem[]> {
    let localItems: LibraryResourceItem[] = [];
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_RESOURCES);
      if (stored) {
        localItems = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading library from local storage:', e);
    }

    // Si está vacío, cargar los 15 recursos iniciales curados
    if (!localItems || localItems.length === 0) {
      localItems = [...INITIAL_CURATED_RESOURCES];
      this.saveLocalResources(localItems);
    }

    // Intentar sincronizar con Firestore si el usuario está autenticado
    if (auth.currentUser) {
      try {
        const snap = await getDocs(collection(db, 'libraryResources'));
        if (!snap.empty) {
          const remoteItems: LibraryResourceItem[] = [];
          snap.forEach((docSnap) => {
            remoteItems.push(docSnap.data() as LibraryResourceItem);
          });
          // Unir evitando duplicados
          const mergedMap = new Map<string, LibraryResourceItem>();
          localItems.forEach((item) => mergedMap.set(item.id, item));
          remoteItems.forEach((item) => mergedMap.set(item.id, item));
          const merged = Array.from(mergedMap.values());
          this.saveLocalResources(merged);
          return merged;
        }
      } catch (err) {
        console.warn('Firestore library fetch warning (using cache):', err);
      }
    }

    return localItems;
  }

  /**
   * Guarda o actualiza un recurso
   */
  static async saveResource(resource: LibraryResourceItem): Promise<void> {
    const all = await this.getResources();
    const index = all.findIndex((r) => r.id === resource.id);
    let updated: LibraryResourceItem[];
    if (index >= 0) {
      updated = [...all];
      updated[index] = { ...resource, updatedAt: new Date().toISOString() };
    } else {
      updated = [resource, ...all];
    }
    this.saveLocalResources(updated);

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'libraryResources', resource.id), resource);
      } catch (err) {
        console.warn('Firestore write resource warning:', err);
      }
    }
  }

  /**
   * Elimina un recurso con confirmación
   */
  static async deleteResource(resourceId: string): Promise<void> {
    const all = await this.getResources();
    const filtered = all.filter((r) => r.id !== resourceId);
    this.saveLocalResources(filtered);

    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, 'libraryResources', resourceId));
      } catch (err) {
        console.warn('Firestore delete resource warning:', err);
      }
    }
  }

  /**
   * Obtiene las carpetas creadas
   */
  static async getFolders(): Promise<LibraryFolder[]> {
    let localFolders: LibraryFolder[] = [];
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_FOLDERS);
      if (stored) {
        localFolders = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading folders:', e);
    }

    if (!localFolders || localFolders.length === 0) {
      localFolders = [...INITIAL_FOLDERS];
      localStorage.setItem(this.STORAGE_KEY_FOLDERS, JSON.stringify(localFolders));
    }

    if (auth.currentUser) {
      try {
        const snap = await getDocs(collection(db, 'libraryFolders'));
        if (!snap.empty) {
          const remote: LibraryFolder[] = [];
          snap.forEach((d) => remote.push(d.data() as LibraryFolder));
          const map = new Map<string, LibraryFolder>();
          localFolders.forEach((f) => map.set(f.id, f));
          remote.forEach((f) => map.set(f.id, f));
          const merged = Array.from(map.values());
          localStorage.setItem(this.STORAGE_KEY_FOLDERS, JSON.stringify(merged));
          return merged;
        }
      } catch (e) {
        console.warn('Firestore folders fetch notice:', e);
      }
    }

    return localFolders;
  }

  /**
   * Guarda o crea una carpeta
   */
  static async saveFolder(folder: LibraryFolder): Promise<void> {
    const folders = await this.getFolders();
    const idx = folders.findIndex((f) => f.id === folder.id);
    let updated: LibraryFolder[];
    if (idx >= 0) {
      updated = [...folders];
      updated[idx] = folder;
    } else {
      updated = [...folders, folder];
    }
    localStorage.setItem(this.STORAGE_KEY_FOLDERS, JSON.stringify(updated));

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'libraryFolders', folder.id), folder);
      } catch (err) {
        console.warn('Firestore write folder notice:', err);
      }
    }
  }

  /**
   * Elimina una carpeta
   */
  static async deleteFolder(folderId: string): Promise<void> {
    const folders = await this.getFolders();
    const updated = folders.filter((f) => f.id !== folderId);
    localStorage.setItem(this.STORAGE_KEY_FOLDERS, JSON.stringify(updated));

    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, 'libraryFolders', folderId));
      } catch (e) {
        console.warn('Firestore delete folder notice:', e);
      }
    }
  }

  /**
   * Descarga física del recurso
   */
  static downloadResource(resource: LibraryResourceItem) {
    const data = resource.dataUri || resource.previewUrl;
    const link = document.createElement('a');
    link.href = data;
    link.download = `${resource.title.toLowerCase().replace(/[^a-z0-9]/gi, '_')}.${resource.format.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private static saveLocalResources(items: LibraryResourceItem[]) {
    try {
      localStorage.setItem(this.STORAGE_KEY_RESOURCES, JSON.stringify(items));
    } catch (e) {
      console.warn('Error saving to localStorage (quota or disabled):', e);
    }
  }
}
