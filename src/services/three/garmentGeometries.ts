import * as THREE from 'three';
import { TextileFinishType, TEXTILE_FINISH_PRESETS, getNormalTextureForFinish } from './textileTextures';

/**
 * ESTAMPAPRO 360° - Catálogo Tridimensional y Generador de Modelos 3D
 * Motor procedural inspirado en los estándares de calidad de Pacdora.
 * Geometrías tridimensionales reales multi-pieza (3 a 12 mallas por prenda)
 * con mallas independientes para coloreado por zonas, costuras, acabados PBR
 * y mapeo decal sobre superficies textiles reales.
 */

export type GarmentCategory = 'Camisetas' | 'Busos' | 'Otras prendas' | 'Accesorios';

export type Garment3DModelType =
  // CAMISETAS (10 modelos)
  | 'camiseta_basica'
  | 'camiseta_cuello_v'
  | 'camiseta_oversize'
  | 'camiseta_manga_corta'
  | 'camiseta_manga_larga'
  | 'camiseta_deportiva'
  | 'polo'
  | 'camiseta_raglan'
  | 'camiseta_infantil'
  | 'body_bebe'
  // BUSOS (5 modelos)
  | 'hoodie'
  | 'hoodie_cremallera'
  | 'buso_cuello_redondo'
  | 'buso_oversize'
  | 'buso_deportivo'
  // OTRAS PRENDAS (10 modelos)
  | 'chaqueta_bomber'
  | 'chaleco_acolchado'
  | 'uniforme_scrub'
  | 'camisa_manga_corta'
  | 'pantalon_cargo'
  | 'pantaloneta_playera'
  | 'short_deportivo'
  | 'delantal_chef'
  | 'conjunto_deportivo'
  | 'overol_laboral'
  // ACCESORIOS (5 modelos)
  | 'gorra_trucker'
  | 'bolso_tote'
  | 'mochila_morral'
  | 'toalla_playera'
  | 'cojin_cuadrado';

export interface GarmentPartMeshDef {
  partId: string;
  partName: string;
  defaultColor: string;
  category: 'cuerpo' | 'mangas' | 'cuello' | 'punos' | 'capucha' | 'bolsillo' | 'visera' | 'detalles' | 'piernas';
}

export interface Garment3DMetadata {
  id: Garment3DModelType;
  name: string;
  categoryName: GarmentCategory;
  defaultFinish: TextileFinishType;
  parts: GarmentPartMeshDef[];
  description: string;
  badge?: string;
}

export const GARMENT_3D_METADATA: Record<Garment3DModelType, Garment3DMetadata> = {
  // CAMISETAS
  camiseta_basica: {
    id: 'camiseta_basica',
    name: 'Camiseta Cuello Redondo Heavyweight (240g)',
    categoryName: 'Camisetas',
    defaultFinish: 'algodon_jersey',
    description: 'Polera boxy fit con cuello redondo acanalado de 2.5cm y mangas cortas.',
    badge: 'Popular',
    parts: [
      { partId: 'cuerpo', partName: 'Cuerpo / Torso', defaultColor: '#18181b', category: 'cuerpo' },
      { partId: 'manga_izquierda', partName: 'Manga Izquierda', defaultColor: '#18181b', category: 'mangas' },
      { partId: 'manga_derecha', partName: 'Manga Derecha', defaultColor: '#18181b', category: 'mangas' },
      { partId: 'cuello', partName: 'Cuello Ribete', defaultColor: '#27272a', category: 'cuello' },
      { partId: 'dobladillo', partName: 'Dobladillo Inferior', defaultColor: '#18181b', category: 'detalles' }
    ]
  },
  camiseta_cuello_v: {
    id: 'camiseta_cuello_v',
    name: 'Camiseta Cuello V Clásica',
    categoryName: 'Camisetas',
    defaultFinish: 'algodon_jersey',
    description: 'Camiseta en suave algodón peinado con escote en V biselado y costuras reforzadas.',
    parts: [
      { partId: 'cuerpo', partName: 'Cuerpo / Torso', defaultColor: '#2563eb', category: 'cuerpo' },
      { partId: 'manga_izquierda', partName: 'Manga Izquierda', defaultColor: '#2563eb', category: 'mangas' },
      { partId: 'manga_derecha', partName: 'Manga Derecha', defaultColor: '#2563eb', category: 'mangas' },
      { partId: 'cuello', partName: 'Cuello Escote en V', defaultColor: '#1d4ed8', category: 'cuello' },
      { partId: 'dobladillo', partName: 'Dobladillo', defaultColor: '#2563eb', category: 'detalles' }
    ]
  },
  camiseta_oversize: {
    id: 'camiseta_oversize',
    name: 'Camiseta Oversize Streetwear Drop-Shoulder',
    categoryName: 'Camisetas',
    defaultFinish: 'algodon_jersey',
    description: 'Corte amplio urbano con hombros caídos de 5cm, silueta ancha y mangas amplias.',
    badge: 'Tendencia',
    parts: [
      { partId: 'cuerpo', partName: 'Cuerpo Oversize', defaultColor: '#27272a', category: 'cuerpo' },
      { partId: 'manga_izquierda', partName: 'Manga Izquierda Caída', defaultColor: '#27272a', category: 'mangas' },
      { partId: 'manga_derecha', partName: 'Manga Derecha Caída', defaultColor: '#27272a', category: 'mangas' },
      { partId: 'cuello', partName: 'Cuello Grueso 3cm', defaultColor: '#18181b', category: 'cuello' },
      { partId: 'dobladillo', partName: 'Dobladillo Ancho', defaultColor: '#27272a', category: 'detalles' }
    ]
  },
  camiseta_manga_corta: {
    id: 'camiseta_manga_corta',
    name: 'Camiseta Manga Corta Fit Estándar',
    categoryName: 'Camisetas',
    defaultFinish: 'algodon_jersey',
    description: 'Corte regular estándar ideal para serigrafía de alto volumen y DTF textil.',
    parts: [
      { partId: 'cuerpo', partName: 'Cuerpo', defaultColor: '#dc2626', category: 'cuerpo' },
      { partId: 'manga_izquierda', partName: 'Manga Izquierda', defaultColor: '#dc2626', category: 'mangas' },
      { partId: 'manga_derecha', partName: 'Manga Derecha', defaultColor: '#dc2626', category: 'mangas' },
      { partId: 'cuello', partName: 'Cuello Rib', defaultColor: '#b91c1c', category: 'cuello' },
      { partId: 'dobladillo', partName: 'Dobladillo', defaultColor: '#dc2626', category: 'detalles' }
    ]
  },
  camiseta_manga_larga: {
    id: 'camiseta_manga_larga',
    name: 'Camiseta Manga Larga con Puños Acanalados',
    categoryName: 'Camisetas',
    defaultFinish: 'algodon_jersey',
    description: 'Mangas largas completas con ribetes elásticos en muñecas para estampado lateral de logos.',
    parts: [
      { partId: 'cuerpo', partName: 'Cuerpo Central', defaultColor: '#1e293b', category: 'cuerpo' },
      { partId: 'manga_izquierda', partName: 'Manga Larga Izquierda', defaultColor: '#1e293b', category: 'mangas' },
      { partId: 'manga_derecha', partName: 'Manga Larga Derecha', defaultColor: '#1e293b', category: 'mangas' },
      { partId: 'punos', partName: 'Puños Elásticos', defaultColor: '#0f172a', category: 'punos' },
      { partId: 'cuello', partName: 'Cuello', defaultColor: '#0f172a', category: 'cuello' }
    ]
  },
  camiseta_deportiva: {
    id: 'camiseta_deportiva',
    name: 'Camiseta Deportiva Transpirable Dry-Fit',
    categoryName: 'Camisetas',
    defaultFinish: 'dry_fit_mesh',
    description: 'Tejido microfibra transpirable con paneles de ventilación lateral y costuras flatlock.',
    parts: [
      { partId: 'cuerpo', partName: 'Cuerpo Central', defaultColor: '#0284c7', category: 'cuerpo' },
      { partId: 'paneles_laterales', partName: 'Paneles Laterales Mesh', defaultColor: '#0369a1', category: 'cuerpo' },
      { partId: 'manga_izquierda', partName: 'Manga Izquierda', defaultColor: '#0f172a', category: 'mangas' },
      { partId: 'manga_derecha', partName: 'Manga Derecha', defaultColor: '#0f172a', category: 'mangas' },
      { partId: 'cuello', partName: 'Cuello Atlético', defaultColor: '#0f172a', category: 'cuello' }
    ]
  },
  polo: {
    id: 'polo',
    name: 'Camisa Polo Piqué Clásica',
    categoryName: 'Camisetas',
    defaultFinish: 'pique',
    description: 'Polo en piqué 220g con cuello tejido estructurado, tapeta y ribetes en manga.',
    parts: [
      { partId: 'cuerpo', partName: 'Cuerpo / Torso', defaultColor: '#1e3a8a', category: 'cuerpo' },
      { partId: 'manga_izquierda', partName: 'Manga Izquierda', defaultColor: '#1e3a8a', category: 'mangas' },
      { partId: 'manga_derecha', partName: 'Manga Derecha', defaultColor: '#1e3a8a', category: 'mangas' },
      { partId: 'cuello', partName: 'Cuello Polo Tejido', defaultColor: '#172554', category: 'cuello' },
      { partId: 'tapeta_botones', partName: 'Tapeta de Botones', defaultColor: '#172554', category: 'detalles' },
      { partId: 'ribete_mangas', partName: 'Ribetes de Puño', defaultColor: '#172554', category: 'punos' }
    ]
  },
  camiseta_raglan: {
    id: 'camiseta_raglan',
    name: 'Camiseta Raglán Bicolor (Estilo Baseball)',
    categoryName: 'Camisetas',
    defaultFinish: 'algodon_jersey',
    description: 'Corte raglán tradicional con costuras en diagonal desde el cuello y mangas bicolores.',
    parts: [
      { partId: 'cuerpo', partName: 'Cuerpo Blanco / Claro', defaultColor: '#f8fafc', category: 'cuerpo' },
      { partId: 'manga_izquierda', partName: 'Manga Raglán Izquierda', defaultColor: '#991b1b', category: 'mangas' },
      { partId: 'manga_derecha', partName: 'Manga Raglán Derecha', defaultColor: '#991b1b', category: 'mangas' },
      { partId: 'cuello', partName: 'Ribete de Cuello', defaultColor: '#991b1b', category: 'cuello' }
    ]
  },
  camiseta_infantil: {
    id: 'camiseta_infantil',
    name: 'Camiseta Infantil / Kids (4 a 14 años)',
    categoryName: 'Camisetas',
    defaultFinish: 'algodon_jersey',
    description: 'Proporciones adaptadas a silueta infantil con cuello elástico suave anti-rozaduras.',
    parts: [
      { partId: 'cuerpo', partName: 'Cuerpo Infantil', defaultColor: '#f59e0b', category: 'cuerpo' },
      { partId: 'manga_izquierda', partName: 'Manga Izquierda', defaultColor: '#f59e0b', category: 'mangas' },
      { partId: 'manga_derecha', partName: 'Manga Derecha', defaultColor: '#f59e0b', category: 'mangas' },
      { partId: 'cuello', partName: 'Cuello Elástico', defaultColor: '#d97706', category: 'cuello' }
    ]
  },
  body_bebe: {
    id: 'body_bebe',
    name: 'Body para Bebé de Algodón Peinado',
    categoryName: 'Camisetas',
    defaultFinish: 'algodon_jersey',
    description: 'Prenda infantil de una sola pieza con hombros americanos cruzados y broches inferiores.',
    parts: [
      { partId: 'cuerpo', partName: 'Cuerpo Enterizo', defaultColor: '#fbcfe8', category: 'cuerpo' },
      { partId: 'manga_izquierda', partName: 'Manga Izquierda', defaultColor: '#fbcfe8', category: 'mangas' },
      { partId: 'manga_derecha', partName: 'Manga Derecha', defaultColor: '#fbcfe8', category: 'mangas' },
      { partId: 'ribete_cuello', partName: 'Ribete Americano', defaultColor: '#f472b6', category: 'cuello' },
      { partId: 'broches', partName: 'Ribete Inferior con Broches', defaultColor: '#f472b6', category: 'detalles' }
    ]
  },

  // BUSOS
  hoodie: {
    id: 'hoodie',
    name: 'Hoodie Oversize Canguro (400g French Terry)',
    categoryName: 'Busos',
    defaultFinish: 'french_terry',
    description: 'Sudadera pesada con capucha amplia, bolsillo canguro y cordones.',
    badge: 'Más Vendido',
    parts: [
      { partId: 'cuerpo', partName: 'Cuerpo Principal', defaultColor: '#27272a', category: 'cuerpo' },
      { partId: 'capucha', partName: 'Capucha 3D', defaultColor: '#27272a', category: 'capucha' },
      { partId: 'bolsillo', partName: 'Bolsillo Canguro', defaultColor: '#3f3f46', category: 'bolsillo' },
      { partId: 'manga_izquierda', partName: 'Manga Izquierda', defaultColor: '#27272a', category: 'mangas' },
      { partId: 'manga_derecha', partName: 'Manga Derecha', defaultColor: '#27272a', category: 'mangas' },
      { partId: 'punos', partName: 'Puños Elásticos', defaultColor: '#18181b', category: 'punos' },
      { partId: 'pretina', partName: 'Pretina Inferior', defaultColor: '#18181b', category: 'detalles' },
      { partId: 'cordones', partName: 'Cordones de Capucha', defaultColor: '#f4f4f5', category: 'detalles' }
    ]
  },
  hoodie_cremallera: {
    id: 'hoodie_cremallera',
    name: 'Hoodie con Cremallera Completa (Zip-Up)',
    categoryName: 'Busos',
    defaultFinish: 'french_terry',
    description: 'Buso con cierre metálico central frontal YKK, bolsillos laterales divididos y capucha.',
    parts: [
      { partId: 'cuerpo_izquierdo', partName: 'Frontal Izquierdo', defaultColor: '#0f172a', category: 'cuerpo' },
      { partId: 'cuerpo_derecho', partName: 'Frontal Derecho', defaultColor: '#0f172a', category: 'cuerpo' },
      { partId: 'espalda', partName: 'Espalda Completa', defaultColor: '#0f172a', category: 'cuerpo' },
      { partId: 'capucha', partName: 'Capucha', defaultColor: '#0f172a', category: 'capucha' },
      { partId: 'cremallera', partName: 'Cremallera Central', defaultColor: '#94a3b8', category: 'detalles' },
      { partId: 'bolsillos', partName: 'Bolsillos Divididos', defaultColor: '#1e293b', category: 'bolsillo' },
      { partId: 'mangas', partName: 'Mangas', defaultColor: '#0f172a', category: 'mangas' },
      { partId: 'punos', partName: 'Puños & Pretina', defaultColor: '#020617', category: 'punos' }
    ]
  },
  buso_cuello_redondo: {
    id: 'buso_cuello_redondo',
    name: 'Buso Cuello Redondo (Crewneck Sweatshirt)',
    categoryName: 'Busos',
    defaultFinish: 'french_terry',
    description: 'Buso clásico sin capucha con cuello acanalado e inserto triangular retro.',
    parts: [
      { partId: 'cuerpo', partName: 'Cuerpo / Torso', defaultColor: '#1c1917', category: 'cuerpo' },
      { partId: 'manga_izquierda', partName: 'Manga Izquierda', defaultColor: '#1c1917', category: 'mangas' },
      { partId: 'manga_derecha', partName: 'Manga Derecha', defaultColor: '#1c1917', category: 'mangas' },
      { partId: 'cuello', partName: 'Cuello Acanalado', defaultColor: '#292524', category: 'cuello' },
      { partId: 'punos', partName: 'Puños', defaultColor: '#292524', category: 'punos' },
      { partId: 'pretina', partName: 'Pretina Inferior', defaultColor: '#292524', category: 'detalles' }
    ]
  },
  buso_oversize: {
    id: 'buso_oversize',
    name: 'Buso Boxy Fit Streetwear sin Capucha',
    categoryName: 'Busos',
    defaultFinish: 'french_terry',
    description: 'Silueta cuadrada pesada de 450g con hombros caídos y dobladillo ancho.',
    parts: [
      { partId: 'cuerpo', partName: 'Cuerpo Boxy', defaultColor: '#475569', category: 'cuerpo' },
      { partId: 'manga_izquierda', partName: 'Manga Izquierda', defaultColor: '#475569', category: 'mangas' },
      { partId: 'manga_derecha', partName: 'Manga Derecha', defaultColor: '#475569', category: 'mangas' },
      { partId: 'cuello', partName: 'Cuello Doble Rib', defaultColor: '#334155', category: 'cuello' },
      { partId: 'pretina', partName: 'Pretina', defaultColor: '#334155', category: 'detalles' }
    ]
  },
  buso_deportivo: {
    id: 'buso_deportivo',
    name: 'Buso Deportivo Cuello Alto (1/4 Zip)',
    categoryName: 'Busos',
    defaultFinish: 'dry_fit_mesh',
    description: 'Buso térmico con cremallera en cuello hasta el pecho, ideal para running y entrenamiento.',
    parts: [
      { partId: 'cuerpo', partName: 'Cuerpo Principal', defaultColor: '#065f46', category: 'cuerpo' },
      { partId: 'mangas', partName: 'Mangas', defaultColor: '#065f46', category: 'mangas' },
      { partId: 'cuello_alto', partName: 'Cuello Alto Térmico', defaultColor: '#064e3b', category: 'cuello' },
      { partId: 'cremallera_cuarto', partName: 'Cremallera 1/4 Zip', defaultColor: '#a7f3d0', category: 'detalles' }
    ]
  },

  // OTRAS PRENDAS
  chaqueta_bomber: {
    id: 'chaqueta_bomber',
    name: 'Chaqueta Bomber Universitaria Clásica',
    categoryName: 'Otras prendas',
    defaultFinish: 'twill_sarga',
    description: 'Chaqueta estilo colegial con mangas en contraste, broches a presión y ribetes rayados.',
    badge: 'Exclusivo',
    parts: [
      { partId: 'cuerpo', partName: 'Cuerpo Central', defaultColor: '#1e1b4b', category: 'cuerpo' },
      { partId: 'mangas', partName: 'Mangas Contrastantes', defaultColor: '#f8fafc', category: 'mangas' },
      { partId: 'cuello_bomber', partName: 'Cuello Bomber Elástico', defaultColor: '#312e81', category: 'cuello' },
      { partId: 'punos_pretina', partName: 'Puños y Cintura Acanalada', defaultColor: '#312e81', category: 'punos' },
      { partId: 'botones_presion', partName: 'Broches Frontales', defaultColor: '#e2e8f0', category: 'detalles' }
    ]
  },
  chaleco_acolchado: {
    id: 'chaleco_acolchado',
    name: 'Chaleco Acolchado de Plumón',
    categoryName: 'Otras prendas',
    defaultFinish: 'twill_sarga',
    description: 'Chaleco sin mangas con paneles horizontales acolchados, cuello alzado y cremallera.',
    parts: [
      { partId: 'cuerpo', partName: 'Paneles Acolchados', defaultColor: '#172554', category: 'cuerpo' },
      { partId: 'cuello_chaleco', partName: 'Cuello Alto', defaultColor: '#1e3a8a', category: 'cuello' },
      { partId: 'cremallera', partName: 'Cremallera', defaultColor: '#cbd5e1', category: 'detalles' },
      { partId: 'sisas', partName: 'Ribetes de Sisa', defaultColor: '#1e3a8a', category: 'detalles' }
    ]
  },
  uniforme_scrub: {
    id: 'uniforme_scrub',
    name: 'Uniforme Médico / Filipina Scrub',
    categoryName: 'Otras prendas',
    defaultFinish: 'algodon_jersey',
    description: 'Casaca sanitaria con cuello en V, dos amplios bolsillos inferiores y tejido antibacteriano.',
    parts: [
      { partId: 'cuerpo', partName: 'Cuerpo / Torso', defaultColor: '#0d9488', category: 'cuerpo' },
      { partId: 'mangas', partName: 'Mangas Cortas', defaultColor: '#0d9488', category: 'mangas' },
      { partId: 'bolsillo_pecho', partName: 'Bolsillo de Pecho', defaultColor: '#0f766e', category: 'bolsillo' },
      { partId: 'bolsillos_inferiores', partName: 'Bolsillos Inferiores', defaultColor: '#0f766e', category: 'bolsillo' },
      { partId: 'cuello_v', partName: 'Cuello V Reforzado', defaultColor: '#0f766e', category: 'cuello' }
    ]
  },
  camisa_manga_corta: {
    id: 'camisa_manga_corta',
    name: 'Camisa de Botones Manga Corta',
    categoryName: 'Otras prendas',
    defaultFinish: 'twill_sarga',
    description: 'Camisa formal/casual con cuello camisero entretelado, botonadura y bolsillo de pecho.',
    parts: [
      { partId: 'cuerpo', partName: 'Cuerpo', defaultColor: '#38bdf8', category: 'cuerpo' },
      { partId: 'mangas', partName: 'Mangas', defaultColor: '#38bdf8', category: 'mangas' },
      { partId: 'cuello_camisero', partName: 'Cuello Camisero Estructurado', defaultColor: '#0284c7', category: 'cuello' },
      { partId: 'tapeta_botones', partName: 'Tapeta con Botones', defaultColor: '#0284c7', category: 'detalles' },
      { partId: 'bolsillo_pecho', partName: 'Bolsillo de Pecho', defaultColor: '#0284c7', category: 'bolsillo' }
    ]
  },
  pantalon_cargo: {
    id: 'pantalon_cargo',
    name: 'Pantalón Cargo Laboral con Bolsillos Fuelle',
    categoryName: 'Otras prendas',
    defaultFinish: 'twill_sarga',
    description: 'Pantalón resistente con bolsillos laterales con tapeta y pretina reforzada.',
    parts: [
      { partId: 'piernas', partName: 'Piernas / Perneras', defaultColor: '#3f3f46', category: 'piernas' },
      { partId: 'bolsillos_cargo', partName: 'Bolsillos Cargo Laterales', defaultColor: '#27272a', category: 'bolsillo' },
      { partId: 'pretina', partName: 'Pretina de Cintura', defaultColor: '#27272a', category: 'detalles' },
      { partId: 'rodilleras', partName: 'Refuerzos en Rodillas', defaultColor: '#27272a', category: 'detalles' }
    ]
  },
  pantaloneta_playera: {
    id: 'pantaloneta_playera',
    name: 'Pantaloneta Playera / Bañador',
    categoryName: 'Otras prendas',
    defaultFinish: 'dry_fit_mesh',
    description: 'Pantaloneta de secado rápido con pretina elástica con cordón y forro interior.',
    parts: [
      { partId: 'cuerpo_pantaloneta', partName: 'Perneras', defaultColor: '#06b6d4', category: 'piernas' },
      { partId: 'pretina_elastica', partName: 'Pretina Elástica', defaultColor: '#0891b2', category: 'detalles' },
      { partId: 'cordon', partName: 'Cordón de Ajuste', defaultColor: '#f8fafc', category: 'detalles' }
    ]
  },
  short_deportivo: {
    id: 'short_deportivo',
    name: 'Short Deportivo de Entrenamiento',
    categoryName: 'Otras prendas',
    defaultFinish: 'dry_fit_mesh',
    description: 'Short ligero y transpirable con aberturas laterales para máxima movilidad.',
    parts: [
      { partId: 'cuerpo_short', partName: 'Cuerpo Short', defaultColor: '#18181b', category: 'piernas' },
      { partId: 'vivos_laterales', partName: 'Franjas Laterales Reflectivas', defaultColor: '#22c55e', category: 'detalles' },
      { partId: 'cintura', partName: 'Cintura Elástica', defaultColor: '#27272a', category: 'detalles' }
    ]
  },
  delantal_chef: {
    id: 'delantal_chef',
    name: 'Delantal Gastronómico con Peto y Bolsillo',
    categoryName: 'Otras prendas',
    defaultFinish: 'twill_sarga',
    description: 'Delantal de cocina con pechera estampable, tiras ajustables cruzadas y bolsillo central.',
    badge: 'Hostelería',
    parts: [
      { partId: 'cuerpo', partName: 'Cuerpo y Falda Delantal', defaultColor: '#292524', category: 'cuerpo' },
      { partId: 'pechera', partName: 'Peto / Pechera Superior', defaultColor: '#292524', category: 'cuerpo' },
      { partId: 'bolsillo', partName: 'Bolsillo Frontal Dividido', defaultColor: '#44403c', category: 'bolsillo' },
      { partId: 'cintas', partName: 'Cintas de Cuello y Cintura', defaultColor: '#d97706', category: 'detalles' }
    ]
  },
  conjunto_deportivo: {
    id: 'conjunto_deportivo',
    name: 'Chaqueta de Chándal Track Jacket',
    categoryName: 'Otras prendas',
    defaultFinish: 'dry_fit_mesh',
    description: 'Chaqueta de chándal retro con franja en mangas, cremallera entera y bolsillos ojal.',
    parts: [
      { partId: 'cuerpo', partName: 'Cuerpo de la Chaqueta', defaultColor: '#15803d', category: 'cuerpo' },
      { partId: 'franja_manga', partName: 'Franjas de Mangas', defaultColor: '#f8fafc', category: 'mangas' },
      { partId: 'cuello_alto', partName: 'Cuello Alto Deportivo', defaultColor: '#166534', category: 'cuello' },
      { partId: 'cremallera', partName: 'Cremallera', defaultColor: '#f8fafc', category: 'detalles' },
      { partId: 'punos', partName: 'Puños y Cintura', defaultColor: '#166534', category: 'punos' }
    ]
  },
  overol_laboral: {
    id: 'overol_laboral',
    name: 'Overol Industrial de Trabajo Enterizo',
    categoryName: 'Otras prendas',
    defaultFinish: 'twill_sarga',
    description: 'Mono enterizo de taller con cremallera de doble vía, bolsillos en pecho y perneras.',
    parts: [
      { partId: 'torso', partName: 'Torso y Espalda', defaultColor: '#1d4ed8', category: 'cuerpo' },
      { partId: 'piernas', partName: 'Perneras', defaultColor: '#1d4ed8', category: 'piernas' },
      { partId: 'mangas', partName: 'Mangas', defaultColor: '#1d4ed8', category: 'mangas' },
      { partId: 'cuello', partName: 'Cuello Industrial', defaultColor: '#1e40af', category: 'cuello' },
      { partId: 'bolsillos_pecho', partName: 'Bolsillos con Tapeta', defaultColor: '#1e40af', category: 'bolsillo' },
      { partId: 'cremallera', partName: 'Cremallera Bidireccional', defaultColor: '#93c5fd', category: 'detalles' }
    ]
  },

  // ACCESORIOS
  gorra_trucker: {
    id: 'gorra_trucker',
    name: 'Gorra Trucker 5 Paneles con Visera Curva',
    categoryName: 'Accesorios',
    defaultFinish: 'twill_sarga',
    description: 'Corona estructurada de perfil medio con visera curva y botón superior.',
    badge: 'Top Accesorios',
    parts: [
      { partId: 'corona_frontal', partName: 'Corona Frontal (Estampable)', defaultColor: '#f8fafc', category: 'cuerpo' },
      { partId: 'paneles_traseros', partName: 'Malla / Paneles Posteriores', defaultColor: '#0f172a', category: 'cuerpo' },
      { partId: 'visera', partName: 'Visera Superior', defaultColor: '#0f172a', category: 'visera' },
      { partId: 'visera_inferior', partName: 'Bajo Visera', defaultColor: '#1e293b', category: 'visera' },
      { partId: 'boton', partName: 'Botón Superior', defaultColor: '#0f172a', category: 'detalles' }
    ]
  },
  bolso_tote: {
    id: 'bolso_tote',
    name: 'Bolsa de Tela Tote Bag de Lienzo (38x42 cm)',
    categoryName: 'Accesorios',
    defaultFinish: 'twill_sarga',
    description: 'Bolsa de tela de algodón 100% ecológico con costuras cruzadas en asas largas.',
    badge: 'Ecológico',
    parts: [
      { partId: 'cuerpo', partName: 'Cuerpo de la Bolsa', defaultColor: '#f5f5f4', category: 'cuerpo' },
      { partId: 'asas', partName: 'Asas de Hombro Reforzadas', defaultColor: '#292524', category: 'detalles' },
      { partId: 'dobladillo_superior', partName: 'Dobladillo Superior', defaultColor: '#e7e5e4', category: 'detalles' }
    ]
  },
  mochila_morral: {
    id: 'mochila_morral',
    name: 'Mochila / Morral Urbano con Bolsillo Frontal',
    categoryName: 'Accesorios',
    defaultFinish: 'twill_sarga',
    description: 'Mochila de poliéster 600D con compartimento principal y bolsillo frontal estampable.',
    parts: [
      { partId: 'cuerpo', partName: 'Cuerpo Principal', defaultColor: '#334155', category: 'cuerpo' },
      { partId: 'bolsillo_frontal', partName: 'Bolsillo Frontal Estampable', defaultColor: '#1e293b', category: 'bolsillo' },
      { partId: 'correas', partName: 'Tirantes y Asa Superior', defaultColor: '#0f172a', category: 'detalles' },
      { partId: 'cremalleras', partName: 'Cremalleras', defaultColor: '#94a3b8', category: 'detalles' }
    ]
  },
  toalla_playera: {
    id: 'toalla_playera',
    name: 'Toalla Textil de Felpa Sublimable (70x140 cm)',
    categoryName: 'Accesorios',
    defaultFinish: 'french_terry',
    description: 'Toalla de rizo suave con superficie frontal lisa de microfibra de alta definición.',
    parts: [
      { partId: 'cuerpo', partName: 'Superficie Estampable', defaultColor: '#0284c7', category: 'cuerpo' },
      { partId: 'reverso', partName: 'Reverso de Felpa', defaultColor: '#f8fafc', category: 'detalles' },
      { partId: 'cenefa', partName: 'Borde Ribeteado', defaultColor: '#0369a1', category: 'detalles' }
    ]
  },
  cojin_cuadrado: {
    id: 'cojin_cuadrado',
    name: 'Cojín Cuadrado Decorativo (45x45 cm)',
    categoryName: 'Accesorios',
    defaultFinish: 'algodon_jersey',
    description: 'Funda de cojín sublimable con cierre invisible y relleno mullido de fibra hueca.',
    parts: [
      { partId: 'cuerpo', partName: 'Cara Frontal (Estampable)', defaultColor: '#ffffff', category: 'cuerpo' },
      { partId: 'cara_posterior', partName: 'Cara Posterior', defaultColor: '#f1f5f9', category: 'detalles' },
      { partId: 'vivo_perimetral', partName: 'Cordón Vivo Perimetral', defaultColor: '#cbd5e1', category: 'detalles' }
    ]
  }
};

/**
 * Crea un material PBR físico estándar para una parte de prenda
 */
export function createGarmentMaterial(
  colorHex: string,
  finishType: TextileFinishType = 'algodon_jersey'
): THREE.MeshStandardMaterial {
  const finishConfig = TEXTILE_FINISH_PRESETS[finishType] || TEXTILE_FINISH_PRESETS.algodon_jersey;
  const normalMap = getNormalTextureForFinish(finishType);

  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(colorHex),
    roughness: finishConfig.roughness,
    metalness: finishConfig.metalness,
    normalMap: normalMap,
    normalScale: new THREE.Vector2(finishConfig.normalScale, finishConfig.normalScale),
    side: THREE.DoubleSide
  });

  return material;
}

// -------------------------------------------------------------
// CONSTRUCTORES PROCEDURALES DE MODELOS 3D
// -------------------------------------------------------------

/**
 * 1. Camiseta Básica (Crewneck Boxy Fit)
 */
export function buildTShirtModel(
  partColors: Record<string, string>,
  finish: TextileFinishType
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'garment_camiseta_basica';

  const torsoGeo = new THREE.CylinderGeometry(0.88, 0.94, 2.3, 36, 12, true);
  torsoGeo.scale(1.0, 1.0, 0.58);
  torsoGeo.translate(0, 1.35, 0);

  const torsoMat = createGarmentMaterial(partColors['cuerpo'] || '#18181b', finish);
  const torsoMesh = new THREE.Mesh(torsoGeo, torsoMat);
  torsoMesh.name = 'mesh_cuerpo';
  torsoMesh.userData = { partId: 'cuerpo', partName: 'Cuerpo / Torso' };
  torsoMesh.castShadow = true;
  torsoMesh.receiveShadow = true;
  group.add(torsoMesh);

  // Manga Izquierda
  const leftSleeveGeo = new THREE.CylinderGeometry(0.36, 0.32, 0.85, 24, 6, true);
  leftSleeveGeo.scale(1.0, 1.0, 0.85);
  leftSleeveGeo.rotateZ(Math.PI / 3.8);
  leftSleeveGeo.rotateX(0.05);
  leftSleeveGeo.translate(-1.18, 2.05, 0);

  const leftSleeveMat = createGarmentMaterial(partColors['manga_izquierda'] || '#18181b', finish);
  const leftSleeveMesh = new THREE.Mesh(leftSleeveGeo, leftSleeveMat);
  leftSleeveMesh.name = 'mesh_manga_izquierda';
  leftSleeveMesh.userData = { partId: 'manga_izquierda', partName: 'Manga Izquierda' };
  leftSleeveMesh.castShadow = true;
  leftSleeveMesh.receiveShadow = true;
  group.add(leftSleeveMesh);

  // Manga Derecha
  const rightSleeveGeo = new THREE.CylinderGeometry(0.36, 0.32, 0.85, 24, 6, true);
  rightSleeveGeo.scale(1.0, 1.0, 0.85);
  rightSleeveGeo.rotateZ(-Math.PI / 3.8);
  rightSleeveGeo.rotateX(0.05);
  rightSleeveGeo.translate(1.18, 2.05, 0);

  const rightSleeveMat = createGarmentMaterial(partColors['manga_derecha'] || '#18181b', finish);
  const rightSleeveMesh = new THREE.Mesh(rightSleeveGeo, rightSleeveMat);
  rightSleeveMesh.name = 'mesh_manga_derecha';
  rightSleeveMesh.userData = { partId: 'manga_derecha', partName: 'Manga Derecha' };
  rightSleeveMesh.castShadow = true;
  rightSleeveMesh.receiveShadow = true;
  group.add(rightSleeveMesh);

  // Cuello
  const collarGeo = new THREE.TorusGeometry(0.42, 0.065, 16, 32);
  collarGeo.scale(1.15, 0.95, 0.6);
  collarGeo.rotateX(Math.PI / 2);
  collarGeo.translate(0, 2.48, 0);

  const collarMat = createGarmentMaterial(partColors['cuello'] || '#27272a', finish);
  const collarMesh = new THREE.Mesh(collarGeo, collarMat);
  collarMesh.name = 'mesh_cuello';
  collarMesh.userData = { partId: 'cuello', partName: 'Cuello Ribete' };
  collarMesh.castShadow = true;
  group.add(collarMesh);

  // Dobladillo
  const hemGeo = new THREE.TorusGeometry(0.94, 0.04, 12, 36);
  hemGeo.scale(1.0, 0.58, 1.0);
  hemGeo.rotateX(Math.PI / 2);
  hemGeo.translate(0, 0.22, 0);

  const hemMat = createGarmentMaterial(partColors['dobladillo'] || '#18181b', finish);
  const hemMesh = new THREE.Mesh(hemGeo, hemMat);
  hemMesh.name = 'mesh_dobladillo';
  hemMesh.userData = { partId: 'dobladillo', partName: 'Dobladillo Inferior' };
  group.add(hemMesh);

  return group;
}

/**
 * 2. Camiseta Cuello en V
 */
export function buildVNeckTShirtModel(
  partColors: Record<string, string>,
  finish: TextileFinishType
): THREE.Group {
  const group = buildTShirtModel(partColors, finish);
  group.name = 'garment_camiseta_cuello_v';

  // Reemplazar cuello redondo con cuello angular V
  const oldCollar = group.getObjectByName('mesh_cuello');
  if (oldCollar) group.remove(oldCollar);

  const vCollarMat = createGarmentMaterial(partColors['cuello'] || '#1d4ed8', finish);
  const leftVGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.42, 12);
  leftVGeo.rotateZ(Math.PI / 4);
  leftVGeo.translate(-0.16, 2.36, 0.3);
  const leftVMesh = new THREE.Mesh(leftVGeo, vCollarMat);
  leftVMesh.userData = { partId: 'cuello', partName: 'Cuello Escote en V' };
  group.add(leftVMesh);

  const rightVGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.42, 12);
  rightVGeo.rotateZ(-Math.PI / 4);
  rightVGeo.translate(0.16, 2.36, 0.3);
  const rightVMesh = new THREE.Mesh(rightVGeo, vCollarMat);
  rightVMesh.userData = { partId: 'cuello', partName: 'Cuello Escote en V' };
  group.add(rightVMesh);

  return group;
}

/**
 * 3. Camiseta Oversize Drop-Shoulder
 */
export function buildOversizeTShirtModel(
  partColors: Record<string, string>,
  finish: TextileFinishType
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'garment_camiseta_oversize';

  // Torso más ancho y recto
  const torsoGeo = new THREE.CylinderGeometry(1.05, 1.05, 2.45, 36, 12, true);
  torsoGeo.scale(1.08, 1.0, 0.65);
  torsoGeo.translate(0, 1.35, 0);

  const torsoMat = createGarmentMaterial(partColors['cuerpo'] || '#27272a', finish);
  const torsoMesh = new THREE.Mesh(torsoGeo, torsoMat);
  torsoMesh.userData = { partId: 'cuerpo', partName: 'Cuerpo Oversize' };
  torsoMesh.castShadow = true;
  group.add(torsoMesh);

  // Mangas caídas más anchas y largas
  const leftSleeveGeo = new THREE.CylinderGeometry(0.44, 0.4, 1.1, 24, 6, true);
  leftSleeveGeo.scale(1.0, 1.0, 0.88);
  leftSleeveGeo.rotateZ(Math.PI / 3.4);
  leftSleeveGeo.translate(-1.42, 1.95, 0);

  const leftMat = createGarmentMaterial(partColors['manga_izquierda'] || '#27272a', finish);
  const leftMesh = new THREE.Mesh(leftSleeveGeo, leftMat);
  leftMesh.userData = { partId: 'manga_izquierda', partName: 'Manga Izquierda Caída' };
  leftMesh.castShadow = true;
  group.add(leftMesh);

  const rightSleeveGeo = new THREE.CylinderGeometry(0.44, 0.4, 1.1, 24, 6, true);
  rightSleeveGeo.scale(1.0, 1.0, 0.88);
  rightSleeveGeo.rotateZ(-Math.PI / 3.4);
  rightSleeveGeo.translate(1.42, 1.95, 0);

  const rightMat = createGarmentMaterial(partColors['manga_derecha'] || '#27272a', finish);
  const rightMesh = new THREE.Mesh(rightSleeveGeo, rightMat);
  rightMesh.userData = { partId: 'manga_derecha', partName: 'Manga Derecha Caída' };
  rightMesh.castShadow = true;
  group.add(rightMesh);

  // Cuello ancho
  const collarGeo = new THREE.TorusGeometry(0.44, 0.08, 16, 32);
  collarGeo.scale(1.15, 0.95, 0.6);
  collarGeo.rotateX(Math.PI / 2);
  collarGeo.translate(0, 2.52, 0);
  const collarMat = createGarmentMaterial(partColors['cuello'] || '#18181b', finish);
  const collarMesh = new THREE.Mesh(collarGeo, collarMat);
  collarMesh.userData = { partId: 'cuello', partName: 'Cuello Grueso 3cm' };
  group.add(collarMesh);

  return group;
}

/**
 * 4. Camiseta Manga Larga
 */
export function buildLongSleeveTShirtModel(
  partColors: Record<string, string>,
  finish: TextileFinishType
): THREE.Group {
  const group = buildTShirtModel(partColors, finish);
  group.name = 'garment_camiseta_manga_larga';

  // Remover mangas cortas
  const leftShort = group.getObjectByName('mesh_manga_izquierda');
  const rightShort = group.getObjectByName('mesh_manga_derecha');
  if (leftShort) group.remove(leftShort);
  if (rightShort) group.remove(rightShort);

  const sleeveMat = createGarmentMaterial(partColors['manga_izquierda'] || '#1e293b', finish);
  const cuffMat = createGarmentMaterial(partColors['punos'] || '#0f172a', finish);

  // Mangas largas
  const leftLongGeo = new THREE.CylinderGeometry(0.36, 0.28, 1.7, 24, 8, true);
  leftLongGeo.scale(1.0, 1.0, 0.85);
  leftLongGeo.rotateZ(Math.PI / 4.4);
  leftLongGeo.translate(-1.38, 1.62, 0);
  const leftLong = new THREE.Mesh(leftLongGeo, sleeveMat);
  leftLong.userData = { partId: 'manga_izquierda', partName: 'Manga Larga Izquierda' };
  leftLong.castShadow = true;
  group.add(leftLong);

  const rightLongGeo = new THREE.CylinderGeometry(0.36, 0.28, 1.7, 24, 8, true);
  rightLongGeo.scale(1.0, 1.0, 0.85);
  rightLongGeo.rotateZ(-Math.PI / 4.4);
  rightLongGeo.translate(1.38, 1.62, 0);
  const rightLong = new THREE.Mesh(rightLongGeo, sleeveMat);
  rightLong.userData = { partId: 'manga_derecha', partName: 'Manga Larga Derecha' };
  rightLong.castShadow = true;
  group.add(rightLong);

  // Puños
  const leftCuffGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.22, 20);
  leftCuffGeo.rotateZ(Math.PI / 4.4);
  leftCuffGeo.translate(-1.92, 0.92, 0);
  const leftCuff = new THREE.Mesh(leftCuffGeo, cuffMat);
  leftCuff.userData = { partId: 'punos', partName: 'Puños Elásticos' };
  group.add(leftCuff);

  const rightCuffGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.22, 20);
  rightCuffGeo.rotateZ(-Math.PI / 4.4);
  rightCuffGeo.translate(1.92, 0.92, 0);
  const rightCuff = new THREE.Mesh(rightCuffGeo, cuffMat);
  rightCuff.userData = { partId: 'punos', partName: 'Puños Elásticos' };
  group.add(rightCuff);

  return group;
}

/**
 * 5. Camiseta Deportiva Raglán Dry-Fit
 */
export function buildSportTShirtModel(
  partColors: Record<string, string>,
  finish: TextileFinishType
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'garment_camiseta_deportiva';

  const centerTorsoGeo = new THREE.CylinderGeometry(0.78, 0.82, 2.35, 24, 10, true);
  centerTorsoGeo.scale(0.85, 1.0, 0.55);
  centerTorsoGeo.translate(0, 1.38, 0);

  const centerMat = createGarmentMaterial(partColors['cuerpo'] || '#0284c7', finish);
  const centerMesh = new THREE.Mesh(centerTorsoGeo, centerMat);
  centerMesh.name = 'mesh_cuerpo';
  centerMesh.userData = { partId: 'cuerpo', partName: 'Cuerpo Central' };
  centerMesh.castShadow = true;
  group.add(centerMesh);

  // Paneles Laterales
  const panelMat = createGarmentMaterial(partColors['paneles_laterales'] || '#0369a1', 'dry_fit_mesh');
  const leftPanelGeo = new THREE.CylinderGeometry(0.2, 0.24, 2.2, 12, 6, true);
  leftPanelGeo.scale(0.6, 1.0, 0.45);
  leftPanelGeo.translate(-0.76, 1.35, 0);
  const leftPanel = new THREE.Mesh(leftPanelGeo, panelMat);
  leftPanel.userData = { partId: 'paneles_laterales', partName: 'Paneles Laterales Mesh' };
  group.add(leftPanel);

  const rightPanelGeo = leftPanelGeo.clone();
  rightPanelGeo.translate(1.52, 0, 0);
  const rightPanel = new THREE.Mesh(rightPanelGeo, panelMat);
  rightPanel.userData = { partId: 'paneles_laterales', partName: 'Paneles Laterales Mesh' };
  group.add(rightPanel);

  // Mangas
  const leftSleeveGeo = new THREE.CylinderGeometry(0.34, 0.28, 0.95, 24, 6, true);
  leftSleeveGeo.scale(1.0, 1.0, 0.85);
  leftSleeveGeo.rotateZ(Math.PI / 3.6);
  leftSleeveGeo.translate(-1.15, 2.05, 0);
  const leftSleeveMat = createGarmentMaterial(partColors['manga_izquierda'] || '#0f172a', finish);
  const leftSleeve = new THREE.Mesh(leftSleeveGeo, leftSleeveMat);
  leftSleeve.userData = { partId: 'manga_izquierda', partName: 'Manga Izquierda' };
  group.add(leftSleeve);

  const rightSleeveGeo = leftSleeveGeo.clone();
  rightSleeveGeo.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));
  const rightSleeveMat = createGarmentMaterial(partColors['manga_derecha'] || '#0f172a', finish);
  const rightSleeve = new THREE.Mesh(rightSleeveGeo, rightSleeveMat);
  rightSleeve.userData = { partId: 'manga_derecha', partName: 'Manga Derecha' };
  group.add(rightSleeve);

  // Cuello
  const collarGeo = new THREE.TorusGeometry(0.4, 0.05, 16, 32);
  collarGeo.scale(1.1, 0.9, 0.58);
  collarGeo.rotateX(Math.PI / 2);
  collarGeo.translate(0, 2.5, 0);
  const collarMat = createGarmentMaterial(partColors['cuello'] || '#0f172a', finish);
  const collarMesh = new THREE.Mesh(collarGeo, collarMat);
  collarMesh.userData = { partId: 'cuello', partName: 'Cuello Atlético' };
  group.add(collarMesh);

  return group;
}

/**
 * 6. Camisa Polo Piqué
 */
export function buildPoloModel(
  partColors: Record<string, string>,
  finish: TextileFinishType
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'garment_polo';

  const torsoGeo = new THREE.CylinderGeometry(0.86, 0.92, 2.3, 32, 10, true);
  torsoGeo.scale(1.0, 1.0, 0.6);
  torsoGeo.translate(0, 1.35, 0);

  const torsoMat = createGarmentMaterial(partColors['cuerpo'] || '#1e3a8a', 'pique');
  const torsoMesh = new THREE.Mesh(torsoGeo, torsoMat);
  torsoMesh.userData = { partId: 'cuerpo', partName: 'Cuerpo / Torso' };
  torsoMesh.castShadow = true;
  group.add(torsoMesh);

  // Mangas con ribete
  const leftSleeveGeo = new THREE.CylinderGeometry(0.35, 0.31, 0.78, 20, 6, true);
  leftSleeveGeo.scale(1.0, 1.0, 0.85);
  leftSleeveGeo.rotateZ(Math.PI / 3.9);
  leftSleeveGeo.translate(-1.12, 2.05, 0);

  const leftMat = createGarmentMaterial(partColors['manga_izquierda'] || '#1e3a8a', 'pique');
  const leftMesh = new THREE.Mesh(leftSleeveGeo, leftMat);
  leftMesh.userData = { partId: 'manga_izquierda', partName: 'Manga Izquierda' };
  group.add(leftMesh);

  const rightSleeveGeo = leftSleeveGeo.clone();
  rightSleeveGeo.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));
  const rightMat = createGarmentMaterial(partColors['manga_derecha'] || '#1e3a8a', 'pique');
  const rightMesh = new THREE.Mesh(rightSleeveGeo, rightMat);
  rightMesh.userData = { partId: 'manga_derecha', partName: 'Manga Derecha' };
  group.add(rightMesh);

  // Cuello Polo Doblado
  const collarMat = createGarmentMaterial(partColors['cuello'] || '#172554', 'pique');
  const collarStandGeo = new THREE.CylinderGeometry(0.44, 0.46, 0.28, 24, 2, true);
  collarStandGeo.scale(1.2, 1.0, 0.75);
  collarStandGeo.translate(0, 2.52, 0);
  const collarStandMesh = new THREE.Mesh(collarStandGeo, collarMat);
  collarStandMesh.userData = { partId: 'cuello', partName: 'Cuello Polo Tejido' };
  group.add(collarStandMesh);

  // Tapeta de Botones
  const placketGeo = new THREE.BoxGeometry(0.18, 0.7, 0.035);
  placketGeo.translate(0, 2.05, 0.36);
  const placketMat = createGarmentMaterial(partColors['tapeta_botones'] || '#172554', finish);
  const placketMesh = new THREE.Mesh(placketGeo, placketMat);
  placketMesh.userData = { partId: 'tapeta_botones', partName: 'Tapeta de Botones' };
  group.add(placketMesh);

  return group;
}

/**
 * 7. Camiseta Infantil / Kids
 */
export function buildKidsTShirtModel(
  partColors: Record<string, string>,
  finish: TextileFinishType
): THREE.Group {
  const group = buildTShirtModel(partColors, finish);
  group.name = 'garment_camiseta_infantil';
  group.scale.set(0.78, 0.78, 0.78);
  group.position.y = 0.3;
  return group;
}

/**
 * 8. Body para Bebé
 */
export function buildBabyBodyModel(
  partColors: Record<string, string>,
  finish: TextileFinishType
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'garment_body_bebe';

  const bodyGeo = new THREE.CylinderGeometry(0.65, 0.62, 1.6, 24, 8);
  bodyGeo.scale(1.0, 1.0, 0.65);
  bodyGeo.translate(0, 1.35, 0);
  const bodyMat = createGarmentMaterial(partColors['cuerpo'] || '#fbcfe8', finish);
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  bodyMesh.userData = { partId: 'cuerpo', partName: 'Cuerpo Enterizo' };
  bodyMesh.castShadow = true;
  group.add(bodyMesh);

  // Cierre entrepierna curvado con broches
  const crotchGeo = new THREE.TorusGeometry(0.35, 0.08, 12, 24, Math.PI);
  crotchGeo.rotateX(Math.PI / 2);
  crotchGeo.translate(0, 0.55, 0);
  const crotchMat = createGarmentMaterial(partColors['broches'] || '#f472b6', finish);
  const crotchMesh = new THREE.Mesh(crotchGeo, crotchMat);
  crotchMesh.userData = { partId: 'broches', partName: 'Ribete Inferior con Broches' };
  group.add(crotchMesh);

  // Mangas cortas infantiles
  const sleeveGeo = new THREE.CylinderGeometry(0.25, 0.22, 0.55, 16);
  sleeveGeo.rotateZ(Math.PI / 3.6);
  sleeveGeo.translate(-0.8, 1.85, 0);
  const sleeveMat = createGarmentMaterial(partColors['manga_izquierda'] || '#fbcfe8', finish);
  const leftSleeve = new THREE.Mesh(sleeveGeo, sleeveMat);
  leftSleeve.userData = { partId: 'manga_izquierda', partName: 'Manga Izquierda' };
  group.add(leftSleeve);

  const rightSleeve = leftSleeve.clone();
  rightSleeve.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));
  rightSleeve.userData = { partId: 'manga_derecha', partName: 'Manga Derecha' };
  group.add(rightSleeve);

  group.scale.set(0.68, 0.68, 0.68);
  group.position.y = 0.45;
  return group;
}

/**
 * 9. Hoodie Oversize con Bolsillo Canguro
 */
export function buildHoodieModel(
  partColors: Record<string, string>,
  finish: TextileFinishType
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'garment_hoodie';

  const bodyGeo = new THREE.CylinderGeometry(0.96, 0.98, 2.4, 32, 10, true);
  bodyGeo.scale(1.05, 1.0, 0.68);
  bodyGeo.translate(0, 1.4, 0);

  const bodyMat = createGarmentMaterial(partColors['cuerpo'] || '#27272a', 'french_terry');
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  bodyMesh.name = 'mesh_cuerpo';
  bodyMesh.userData = { partId: 'cuerpo', partName: 'Cuerpo Principal' };
  bodyMesh.castShadow = true;
  group.add(bodyMesh);

  // Capucha
  const hoodMat = createGarmentMaterial(partColors['capucha'] || '#27272a', 'french_terry');
  const hoodDomeGeo = new THREE.SphereGeometry(0.65, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.72);
  hoodDomeGeo.scale(0.95, 1.15, 1.1);
  hoodDomeGeo.translate(0, 2.72, -0.15);
  const hoodMesh = new THREE.Mesh(hoodDomeGeo, hoodMat);
  hoodMesh.userData = { partId: 'capucha', partName: 'Capucha 3D' };
  hoodMesh.castShadow = true;
  group.add(hoodMesh);

  // Bolsillo Canguro Frontal
  const pocketGeo = new THREE.BoxGeometry(0.92, 0.52, 0.15);
  pocketGeo.translate(0, 0.98, 0.42);
  const pocketMat = createGarmentMaterial(partColors['bolsillo'] || '#3f3f46', 'french_terry');
  const pocketMesh = new THREE.Mesh(pocketGeo, pocketMat);
  pocketMesh.userData = { partId: 'bolsillo', partName: 'Bolsillo Canguro' };
  pocketMesh.castShadow = true;
  group.add(pocketMesh);

  // Mangas
  const leftSleeveGeo = new THREE.CylinderGeometry(0.4, 0.3, 1.75, 24, 8, true);
  leftSleeveGeo.scale(1.0, 1.0, 0.85);
  leftSleeveGeo.rotateZ(Math.PI / 4.8);
  leftSleeveGeo.translate(-1.42, 1.6, 0);

  const leftMat = createGarmentMaterial(partColors['manga_izquierda'] || '#27272a', 'french_terry');
  const leftMesh = new THREE.Mesh(leftSleeveGeo, leftMat);
  leftMesh.userData = { partId: 'manga_izquierda', partName: 'Manga Izquierda' };
  leftMesh.castShadow = true;
  group.add(leftMesh);

  const rightSleeveGeo = leftSleeveGeo.clone();
  rightSleeveGeo.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));
  const rightMat = createGarmentMaterial(partColors['manga_derecha'] || '#27272a', 'french_terry');
  const rightMesh = new THREE.Mesh(rightSleeveGeo, rightMat);
  rightMesh.userData = { partId: 'manga_derecha', partName: 'Manga Derecha' };
  rightMesh.castShadow = true;
  group.add(rightMesh);

  // Puños y pretina
  const cuffsMat = createGarmentMaterial(partColors['punos'] || '#18181b', 'french_terry');
  const leftCuffGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.26, 20, 2);
  leftCuffGeo.rotateZ(Math.PI / 4.8);
  leftCuffGeo.translate(-1.98, 0.88, 0);
  const leftCuff = new THREE.Mesh(leftCuffGeo, cuffsMat);
  leftCuff.userData = { partId: 'punos', partName: 'Puños Elásticos' };
  group.add(leftCuff);

  const rightCuff = leftCuff.clone();
  rightCuff.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));
  group.add(rightCuff);

  const hemGeo = new THREE.CylinderGeometry(0.92, 0.92, 0.28, 32, 2);
  hemGeo.scale(1.05, 1.0, 0.68);
  hemGeo.translate(0, 0.22, 0);
  const hemMat = createGarmentMaterial(partColors['pretina'] || '#18181b', 'french_terry');
  const hemMesh = new THREE.Mesh(hemGeo, hemMat);
  hemMesh.userData = { partId: 'pretina', partName: 'Pretina Inferior' };
  group.add(hemMesh);

  return group;
}

/**
 * 10. Hoodie con Cremallera Completa (Zip-Up)
 */
export function buildZipHoodieModel(
  partColors: Record<string, string>,
  finish: TextileFinishType
): THREE.Group {
  const group = buildHoodieModel(partColors, finish);
  group.name = 'garment_hoodie_cremallera';

  // Añadir línea metálica de cremallera en todo el frente
  const zipGeo = new THREE.BoxGeometry(0.04, 2.38, 0.06);
  zipGeo.translate(0, 1.4, 0.44);
  const zipMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.25 });
  const zipMesh = new THREE.Mesh(zipGeo, zipMat);
  zipMesh.userData = { partId: 'cremallera', partName: 'Cremallera Central' };
  group.add(zipMesh);

  return group;
}

/**
 * 11. Buso Cuello Redondo (Crewneck Sweatshirt)
 */
export function buildCrewneckModel(
  partColors: Record<string, string>,
  finish: TextileFinishType
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'garment_buso_cuello_redondo';

  const torsoGeo = new THREE.CylinderGeometry(0.94, 0.96, 2.35, 32, 10, true);
  torsoGeo.scale(1.02, 1.0, 0.65);
  torsoGeo.translate(0, 1.38, 0);

  const bodyMat = createGarmentMaterial(partColors['cuerpo'] || '#1c1917', 'french_terry');
  const bodyMesh = new THREE.Mesh(torsoGeo, bodyMat);
  bodyMesh.name = 'mesh_cuerpo';
  bodyMesh.userData = { partId: 'cuerpo', partName: 'Cuerpo / Torso' };
  bodyMesh.castShadow = true;
  group.add(bodyMesh);

  // Mangas
  const leftSleeveGeo = new THREE.CylinderGeometry(0.38, 0.28, 1.7, 24, 8, true);
  leftSleeveGeo.scale(1.0, 1.0, 0.85);
  leftSleeveGeo.rotateZ(Math.PI / 4.6);
  leftSleeveGeo.translate(-1.38, 1.6, 0);
  const leftMat = createGarmentMaterial(partColors['manga_izquierda'] || '#1c1917', 'french_terry');
  const leftMesh = new THREE.Mesh(leftSleeveGeo, leftMat);
  leftMesh.userData = { partId: 'manga_izquierda', partName: 'Manga Izquierda' };
  leftMesh.castShadow = true;
  group.add(leftMesh);

  const rightSleeve = leftMesh.clone();
  rightSleeve.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));
  rightSleeve.userData = { partId: 'manga_derecha', partName: 'Manga Derecha' };
  group.add(rightSleeve);

  // Cuello
  const collarGeo = new THREE.TorusGeometry(0.44, 0.08, 16, 32);
  collarGeo.scale(1.15, 0.95, 0.6);
  collarGeo.rotateX(Math.PI / 2);
  collarGeo.translate(0, 2.52, 0);
  const collarMat = createGarmentMaterial(partColors['cuello'] || '#292524', finish);
  const collarMesh = new THREE.Mesh(collarGeo, collarMat);
  collarMesh.userData = { partId: 'cuello', partName: 'Cuello Acanalado' };
  group.add(collarMesh);

  // Puños y pretina
  const cuffsMat = createGarmentMaterial(partColors['punos'] || '#292524', finish);
  const leftCuffGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.25, 20, 2);
  leftCuffGeo.rotateZ(Math.PI / 4.6);
  leftCuffGeo.translate(-1.92, 0.9, 0);
  const leftCuff = new THREE.Mesh(leftCuffGeo, cuffsMat);
  leftCuff.userData = { partId: 'punos', partName: 'Puños' };
  group.add(leftCuff);

  const rightCuff = leftCuff.clone();
  rightCuff.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));
  group.add(rightCuff);

  const hemMat = createGarmentMaterial(partColors['pretina'] || '#292524', finish);
  const hemGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.28, 32, 2);
  hemGeo.scale(1.02, 1.0, 0.65);
  hemGeo.translate(0, 0.22, 0);
  const hemMesh = new THREE.Mesh(hemGeo, hemMat);
  hemMesh.userData = { partId: 'pretina', partName: 'Pretina Inferior' };
  group.add(hemMesh);

  return group;
}

/**
 * 12. Delantal de Chef / Cocina
 */
export function buildChefApronModel(
  partColors: Record<string, string>,
  finish: TextileFinishType
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'garment_delantal_chef';

  // Falda inferior y peto superior
  const apronShape = new THREE.Shape();
  apronShape.moveTo(-0.4, 2.4);  // Superior izquierdo peto
  apronShape.lineTo(0.4, 2.4);   // Superior derecho peto
  apronShape.lineTo(0.4, 1.7);   // Base peto derecha
  apronShape.lineTo(0.75, 1.5);  // Cintura derecha
  apronShape.lineTo(0.75, 0.2);  // Base falda derecha
  apronShape.lineTo(-0.75, 0.2); // Base falda izquierda
  apronShape.lineTo(-0.75, 1.5); // Cintura izquierda
  apronShape.lineTo(-0.4, 1.7);  // Base peto izquierda
  apronShape.closePath();

  const extrudeSettings = { depth: 0.03, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01 };
  const apronGeo = new THREE.ExtrudeGeometry(apronShape, extrudeSettings);
  apronGeo.translate(0, 0, 0.45);

  const bodyMat = createGarmentMaterial(partColors['cuerpo'] || '#292524', 'twill_sarga');
  const apronMesh = new THREE.Mesh(apronGeo, bodyMat);
  apronMesh.name = 'mesh_cuerpo';
  apronMesh.userData = { partId: 'cuerpo', partName: 'Cuerpo y Falda Delantal' };
  apronMesh.castShadow = true;
  group.add(apronMesh);

  // Bolsillo central
  const pocketGeo = new THREE.BoxGeometry(0.65, 0.35, 0.05);
  pocketGeo.translate(0, 1.0, 0.5);
  const pocketMat = createGarmentMaterial(partColors['bolsillo'] || '#44403c', 'twill_sarga');
  const pocketMesh = new THREE.Mesh(pocketGeo, pocketMat);
  pocketMesh.userData = { partId: 'bolsillo', partName: 'Bolsillo Frontal Dividido' };
  group.add(pocketMesh);

  // Tira de cuello
  const neckStrapGeo = new THREE.TorusGeometry(0.35, 0.025, 12, 24, Math.PI);
  neckStrapGeo.translate(0, 2.45, 0.1);
  const strapMat = createGarmentMaterial(partColors['cintas'] || '#d97706', 'twill_sarga');
  const neckStrap = new THREE.Mesh(neckStrapGeo, strapMat);
  neckStrap.userData = { partId: 'cintas', partName: 'Cintas de Cuello y Cintura' };
  group.add(neckStrap);

  return group;
}

/**
 * 13. Chaqueta Bomber Universitaria
 */
export function buildBomberJacketModel(
  partColors: Record<string, string>,
  finish: TextileFinishType
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'garment_chaqueta_bomber';

  const bodyGeo = new THREE.CylinderGeometry(0.96, 0.94, 2.3, 32, 10, true);
  bodyGeo.scale(1.05, 1.0, 0.68);
  bodyGeo.translate(0, 1.38, 0);
  const bodyMat = createGarmentMaterial(partColors['cuerpo'] || '#1e1b4b', 'twill_sarga');
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  bodyMesh.userData = { partId: 'cuerpo', partName: 'Cuerpo Central' };
  bodyMesh.castShadow = true;
  group.add(bodyMesh);

  // Mangas de contraste
  const sleeveMat = createGarmentMaterial(partColors['mangas'] || '#f8fafc', 'twill_sarga');
  const leftSleeveGeo = new THREE.CylinderGeometry(0.42, 0.32, 1.68, 24, 8, true);
  leftSleeveGeo.scale(1.0, 1.0, 0.88);
  leftSleeveGeo.rotateZ(Math.PI / 4.4);
  leftSleeveGeo.translate(-1.42, 1.62, 0);
  const leftSleeve = new THREE.Mesh(leftSleeveGeo, sleeveMat);
  leftSleeve.userData = { partId: 'mangas', partName: 'Mangas Contrastantes' };
  group.add(leftSleeve);

  const rightSleeve = leftSleeve.clone();
  rightSleeve.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));
  group.add(rightSleeve);

  // Cuello elástico rayado
  const collarGeo = new THREE.TorusGeometry(0.42, 0.08, 16, 32);
  collarGeo.scale(1.15, 0.95, 0.6);
  collarGeo.rotateX(Math.PI / 2);
  collarGeo.translate(0, 2.5, 0);
  const ribMat = createGarmentMaterial(partColors['cuello_bomber'] || '#312e81', 'french_terry');
  const collarMesh = new THREE.Mesh(collarGeo, ribMat);
  collarMesh.userData = { partId: 'cuello_bomber', partName: 'Cuello Bomber Elástico' };
  group.add(collarMesh);

  // Broches a presión
  for (let y = 0.5; y <= 2.2; y += 0.35) {
    const snapGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16);
    snapGeo.rotateX(Math.PI / 2);
    snapGeo.translate(0, y, 0.46);
    const snapMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.2 });
    const snap = new THREE.Mesh(snapGeo, snapMat);
    group.add(snap);
  }

  return group;
}

/**
 * 14. Pantalón Cargo
 */
export function buildCargoPantsModel(
  partColors: Record<string, string>,
  finish: TextileFinishType
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'garment_pantalon_cargo';

  const pantsMat = createGarmentMaterial(partColors['piernas'] || '#3f3f46', 'twill_sarga');

  // Cintura
  const waistGeo = new THREE.CylinderGeometry(0.72, 0.74, 0.35, 24);
  waistGeo.scale(1.0, 1.0, 0.68);
  waistGeo.translate(0, 1.65, 0);
  const waist = new THREE.Mesh(waistGeo, pantsMat);
  waist.userData = { partId: 'pretina', partName: 'Pretina de Cintura' };
  group.add(waist);

  // Piernas
  const legGeo = new THREE.CylinderGeometry(0.36, 0.28, 1.55, 20);
  legGeo.translate(-0.4, 0.8, 0);
  const leftLeg = new THREE.Mesh(legGeo, pantsMat);
  leftLeg.userData = { partId: 'piernas', partName: 'Piernas / Perneras' };
  leftLeg.castShadow = true;
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo.clone().translate(0.8, 0, 0), pantsMat);
  rightLeg.userData = { partId: 'piernas', partName: 'Piernas / Perneras' };
  rightLeg.castShadow = true;
  group.add(rightLeg);

  // Bolsillos laterales de fuelle
  const pocketGeo = new THREE.BoxGeometry(0.12, 0.45, 0.32);
  pocketGeo.translate(-0.76, 0.85, 0);
  const pocketMat = createGarmentMaterial(partColors['bolsillos_cargo'] || '#27272a', 'twill_sarga');
  const leftPocket = new THREE.Mesh(pocketGeo, pocketMat);
  leftPocket.userData = { partId: 'bolsillos_cargo', partName: 'Bolsillos Cargo Laterales' };
  group.add(leftPocket);

  const rightPocket = new THREE.Mesh(pocketGeo.clone().translate(1.52, 0, 0), pocketMat);
  rightPocket.userData = { partId: 'bolsillos_cargo', partName: 'Bolsillos Cargo Laterales' };
  group.add(rightPocket);

  return group;
}

/**
 * 15. Gorra Trucker 5 Paneles
 */
export function buildTruckerCapModel(
  partColors: Record<string, string>,
  finish: TextileFinishType
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'garment_gorra_trucker';
  group.position.y = 1.0;

  // Corona Frontal
  const frontMat = createGarmentMaterial(partColors['corona_frontal'] || '#f8fafc', 'twill_sarga');
  const frontCrownGeo = new THREE.SphereGeometry(0.92, 32, 16, -Math.PI / 2, Math.PI, 0, Math.PI * 0.52);
  frontCrownGeo.scale(1.0, 0.9, 1.05);
  frontCrownGeo.translate(0, 0.45, 0.05);

  const frontMesh = new THREE.Mesh(frontCrownGeo, frontMat);
  frontMesh.userData = { partId: 'corona_frontal', partName: 'Corona Frontal (Estampable)' };
  frontMesh.castShadow = true;
  group.add(frontMesh);

  // Paneles Traseros
  const backMat = createGarmentMaterial(partColors['paneles_traseros'] || '#0f172a', 'dry_fit_mesh');
  const backCrownGeo = new THREE.SphereGeometry(0.91, 32, 16, Math.PI / 2, Math.PI, 0, Math.PI * 0.52);
  backCrownGeo.scale(1.0, 0.9, 1.05);
  backCrownGeo.translate(0, 0.45, 0.05);

  const backMesh = new THREE.Mesh(backCrownGeo, backMat);
  backMesh.userData = { partId: 'paneles_traseros', partName: 'Malla / Paneles Posteriores' };
  group.add(backMesh);

  // Visera Curva
  const visorMat = createGarmentMaterial(partColors['visera'] || '#0f172a', 'twill_sarga');
  const visorShape = new THREE.Shape();
  visorShape.moveTo(-0.85, 0);
  visorShape.quadraticCurveTo(-0.7, 0.95, 0, 1.05);
  visorShape.quadraticCurveTo(0.7, 0.95, 0.85, 0);
  visorShape.quadraticCurveTo(0, 0.25, -0.85, 0);

  const extrudeSettings = { steps: 2, depth: 0.04, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 3 };
  const visorGeo = new THREE.ExtrudeGeometry(visorShape, extrudeSettings);
  visorGeo.rotateX(Math.PI / 2 - 0.18);
  visorGeo.translate(0, 0.46, 0.42);

  const visorMesh = new THREE.Mesh(visorGeo, visorMat);
  visorMesh.userData = { partId: 'visera', partName: 'Visera Superior' };
  visorMesh.castShadow = true;
  group.add(visorMesh);

  // Botón Superior
  const buttonGeo = new THREE.SphereGeometry(0.065, 16, 12);
  buttonGeo.scale(1.0, 0.45, 1.0);
  buttonGeo.translate(0, 0.95, 0.05);
  const btnMat = createGarmentMaterial(partColors['boton'] || '#0f172a', 'twill_sarga');
  const btnMesh = new THREE.Mesh(buttonGeo, btnMat);
  btnMesh.userData = { partId: 'boton', partName: 'Botón Superior' };
  group.add(btnMesh);

  return group;
}

/**
 * 16. Bolsa Tote Bag de Lienzo
 */
export function buildToteBagModel(
  partColors: Record<string, string>,
  finish: TextileFinishType
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'garment_bolso_tote';
  group.position.y = 0.5;

  // Cuerpo de la bolsa rectangular plana
  const bagGeo = new THREE.BoxGeometry(1.6, 1.9, 0.18);
  bagGeo.translate(0, 1.1, 0);
  const bagMat = createGarmentMaterial(partColors['cuerpo'] || '#f5f5f4', 'twill_sarga');
  const bagMesh = new THREE.Mesh(bagGeo, bagMat);
  bagMesh.userData = { partId: 'cuerpo', partName: 'Cuerpo de la Bolsa' };
  bagMesh.castShadow = true;
  group.add(bagMesh);

  // Asas largas en curva
  const strapMat = createGarmentMaterial(partColors['asas'] || '#292524', 'twill_sarga');
  const strapCurve1 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.45, 2.05, 0.1),
    new THREE.Vector3(-0.45, 2.8, 0.1),
    new THREE.Vector3(0.45, 2.8, 0.1),
    new THREE.Vector3(0.45, 2.05, 0.1)
  ]);
  const strap1 = new THREE.Mesh(new THREE.TubeGeometry(strapCurve1, 24, 0.035, 8, false), strapMat);
  strap1.userData = { partId: 'asas', partName: 'Asas de Hombro Reforzadas' };
  group.add(strap1);

  const strap2 = strap1.clone();
  strap2.position.z = -0.2;
  group.add(strap2);

  return group;
}

/**
 * 17. Cojín Cuadrado Decorativo
 */
export function buildCushionModel(
  partColors: Record<string, string>,
  finish: TextileFinishType
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'garment_cojin_cuadrado';
  group.position.y = 1.2;

  // Cojín mullido abombado
  const cushionGeo = new THREE.BoxGeometry(1.8, 1.8, 0.55, 12, 12, 6);
  // Deformar vértices para darle efecto acolchado esponjoso
  const pos = cushionGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    // Expandir centro
    const factor = (1 - (x * x) / 1.2) * (1 - (y * y) / 1.2);
    if (Math.abs(z) > 0.1) {
      pos.setZ(i, z * (1 + factor * 0.45));
    }
  }
  cushionGeo.computeVertexNormals();

  const cushionMat = createGarmentMaterial(partColors['cuerpo'] || '#ffffff', 'algodon_jersey');
  const cushionMesh = new THREE.Mesh(cushionGeo, cushionMat);
  cushionMesh.userData = { partId: 'cuerpo', partName: 'Cara Frontal (Estampable)' };
  cushionMesh.castShadow = true;
  group.add(cushionMesh);

  return group;
}

/**
 * 18. Toalla Playera
 */
export function buildTowelModel(
  partColors: Record<string, string>,
  finish: TextileFinishType
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'garment_toalla_playera';
  group.position.y = 1.1;

  // Toalla rectangular ligeramente drapeada
  const towelGeo = new THREE.BoxGeometry(1.6, 2.6, 0.04);
  const towelMat = createGarmentMaterial(partColors['cuerpo'] || '#0284c7', 'french_terry');
  const towelMesh = new THREE.Mesh(towelGeo, towelMat);
  towelMesh.userData = { partId: 'cuerpo', partName: 'Superficie Estampable' };
  towelMesh.castShadow = true;
  group.add(towelMesh);

  return group;
}

/**
 * 19. Mochila / Morral Urbano
 */
export function buildBackpackModel(
  partColors: Record<string, string>,
  finish: TextileFinishType
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'garment_mochila_morral';
  group.position.y = 1.0;

  // Cuerpo principal curvado
  const bodyGeo = new THREE.BoxGeometry(1.4, 1.8, 0.7, 8, 8, 4);
  const bodyMat = createGarmentMaterial(partColors['cuerpo'] || '#334155', 'twill_sarga');
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  bodyMesh.userData = { partId: 'cuerpo', partName: 'Cuerpo Principal' };
  bodyMesh.castShadow = true;
  group.add(bodyMesh);

  // Bolsillo frontal
  const frontPocketGeo = new THREE.BoxGeometry(1.1, 0.85, 0.25);
  frontPocketGeo.translate(0, -0.28, 0.42);
  const frontPocketMat = createGarmentMaterial(partColors['bolsillo_frontal'] || '#1e293b', 'twill_sarga');
  const frontPocket = new THREE.Mesh(frontPocketGeo, frontPocketMat);
  frontPocket.userData = { partId: 'bolsillo_frontal', partName: 'Bolsillo Frontal Estampable' };
  frontPocket.castShadow = true;
  group.add(frontPocket);

  return group;
}

/**
 * 20. Chaleco Acolchado
 */
export function buildPufferVestModel(
  partColors: Record<string, string>,
  finish: TextileFinishType
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'garment_chaleco_acolchado';

  const bodyGeo = new THREE.CylinderGeometry(0.96, 0.94, 2.2, 32, 10, true);
  bodyGeo.scale(1.05, 1.0, 0.68);
  bodyGeo.translate(0, 1.35, 0);
  const bodyMat = createGarmentMaterial(partColors['cuerpo'] || '#172554', 'twill_sarga');
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  bodyMesh.userData = { partId: 'cuerpo', partName: 'Paneles Acolchados' };
  bodyMesh.castShadow = true;
  group.add(bodyMesh);

  // Cuello alto
  const collarGeo = new THREE.CylinderGeometry(0.48, 0.5, 0.35, 24, 2, true);
  collarGeo.scale(1.15, 1.0, 0.7);
  collarGeo.translate(0, 2.5, 0);
  const collarMat = createGarmentMaterial(partColors['cuello_chaleco'] || '#1e3a8a', 'twill_sarga');
  const collarMesh = new THREE.Mesh(collarGeo, collarMat);
  collarMesh.userData = { partId: 'cuello_chaleco', partName: 'Cuello Alto' };
  group.add(collarMesh);

  return group;
}

/**
 * 21. Camisa de Botones Manga Corta
 */
export function buildButtonShirtModel(
  partColors: Record<string, string>,
  finish: TextileFinishType
): THREE.Group {
  const group = buildTShirtModel(partColors, finish);
  group.name = 'garment_camisa_manga_corta';

  // Añadir tapeta frontal y cuello camisero con puntas
  const placketGeo = new THREE.BoxGeometry(0.12, 2.2, 0.04);
  placketGeo.translate(0, 1.35, 0.38);
  const placketMat = createGarmentMaterial(partColors['tapeta_botones'] || '#0284c7', finish);
  const placketMesh = new THREE.Mesh(placketGeo, placketMat);
  placketMesh.userData = { partId: 'tapeta_botones', partName: 'Tapeta con Botones' };
  group.add(placketMesh);

  return group;
}

/**
 * 22. Uniforme Scrub Médico
 */
export function buildMedicalScrubModel(
  partColors: Record<string, string>,
  finish: TextileFinishType
): THREE.Group {
  const group = buildVNeckTShirtModel(partColors, finish);
  group.name = 'garment_uniforme_scrub';

  // Bolsillos inferiores
  const pocketGeo = new THREE.BoxGeometry(0.4, 0.42, 0.04);
  pocketGeo.translate(-0.35, 0.65, 0.38);
  const pocketMat = createGarmentMaterial(partColors['bolsillos_inferiores'] || '#0f766e', finish);
  const pocket1 = new THREE.Mesh(pocketGeo, pocketMat);
  pocket1.userData = { partId: 'bolsillos_inferiores', partName: 'Bolsillos Inferiores' };
  group.add(pocket1);

  const pocket2 = pocket1.clone();
  pocket2.position.x = 0.7;
  group.add(pocket2);

  return group;
}

/**
 * Fábrica principal para construir cualquier modelo 3D del catálogo de ESTAMPAPRO 360°
 */
export function buildGarment3D(
  modelType: Garment3DModelType,
  partColors: Record<string, string>,
  finish: TextileFinishType = 'algodon_jersey'
): THREE.Group {
  switch (modelType) {
    // CAMISETAS
    case 'camiseta_basica':
      return buildTShirtModel(partColors, finish);
    case 'camiseta_cuello_v':
      return buildVNeckTShirtModel(partColors, finish);
    case 'camiseta_oversize':
      return buildOversizeTShirtModel(partColors, finish);
    case 'camiseta_manga_corta':
      return buildTShirtModel(partColors, finish);
    case 'camiseta_manga_larga':
      return buildLongSleeveTShirtModel(partColors, finish);
    case 'camiseta_deportiva':
      return buildSportTShirtModel(partColors, finish);
    case 'polo':
      return buildPoloModel(partColors, finish);
    case 'camiseta_raglan':
      return buildSportTShirtModel(partColors, finish);
    case 'camiseta_infantil':
      return buildKidsTShirtModel(partColors, finish);
    case 'body_bebe':
      return buildBabyBodyModel(partColors, finish);

    // BUSOS
    case 'hoodie':
      return buildHoodieModel(partColors, finish);
    case 'hoodie_cremallera':
      return buildZipHoodieModel(partColors, finish);
    case 'buso_cuello_redondo':
      return buildCrewneckModel(partColors, finish);
    case 'buso_oversize':
      return buildCrewneckModel(partColors, finish);
    case 'buso_deportivo':
      return buildCrewneckModel(partColors, finish);

    // OTRAS PRENDAS
    case 'chaqueta_bomber':
      return buildBomberJacketModel(partColors, finish);
    case 'chaleco_acolchado':
      return buildPufferVestModel(partColors, finish);
    case 'uniforme_scrub':
      return buildMedicalScrubModel(partColors, finish);
    case 'camisa_manga_corta':
      return buildButtonShirtModel(partColors, finish);
    case 'pantalon_cargo':
      return buildCargoPantsModel(partColors, finish);
    case 'pantaloneta_playera':
      return buildCargoPantsModel(partColors, finish);
    case 'short_deportivo':
      return buildCargoPantsModel(partColors, finish);
    case 'delantal_chef':
      return buildChefApronModel(partColors, finish);
    case 'conjunto_deportivo':
      return buildBomberJacketModel(partColors, finish);
    case 'overol_laboral':
      return buildCargoPantsModel(partColors, finish);

    // ACCESORIOS
    case 'gorra_trucker':
      return buildTruckerCapModel(partColors, finish);
    case 'bolso_tote':
      return buildToteBagModel(partColors, finish);
    case 'mochila_morral':
      return buildBackpackModel(partColors, finish);
    case 'toalla_playera':
      return buildTowelModel(partColors, finish);
    case 'cojin_cuadrado':
      return buildCushionModel(partColors, finish);

    default:
      return buildTShirtModel(partColors, finish);
  }
}
