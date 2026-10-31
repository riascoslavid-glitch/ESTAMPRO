export type LibraryCategory =
  | 'camisetas'
  | 'deportivos'
  | 'logos'
  | 'tipografias'
  | 'plantillas'
  | 'ilustraciones'
  | 'iconos'
  | 'fondos'
  | 'texturas'
  | 'patrones'
  | 'mockups'
  | 'infantiles'
  | 'empresariales'
  | 'promocionales'
  | 'personalizados';

export interface LibraryCategoryMeta {
  id: LibraryCategory;
  name: string;
  description: string;
  iconName: string;
}

export const LIBRARY_CATEGORIES_META: LibraryCategoryMeta[] = [
  { id: 'camisetas', name: 'Diseños para camisetas', description: 'Composiciones frontales y dorsales listas para estampar.', iconName: 'Shirt' },
  { id: 'deportivos', name: 'Diseños deportivos', description: 'Números, dorsales, escudos y motivos atléticos.', iconName: 'Trophy' },
  { id: 'logos', name: 'Logos', description: 'Emblemas vectoriales y marcas gráficas configurables.', iconName: 'BadgeCheck' },
  { id: 'tipografias', name: 'Tipografías', description: 'Composiciones de texto con kerning y efectos curvos.', iconName: 'Type' },
  { id: 'plantillas', name: 'Plantillas', description: 'Esquemas compositivos listos para personalizar.', iconName: 'Layout' },
  { id: 'ilustraciones', name: 'Ilustraciones', description: 'Artes artísticos de autor, vintage y contemporáneos.', iconName: 'Palette' },
  { id: 'iconos', name: 'Iconos', description: 'Pictogramas minimalistas para detalles y bordados.', iconName: 'Sparkles' },
  { id: 'fondos', name: 'Fondos', description: 'Bases geométricas, degradados y efectos de atmósfera.', iconName: 'Layers' },
  { id: 'texturas', name: 'Texturas', description: 'Desgastes vintage, grunge, semitonos y tramas de malla.', iconName: 'Sliders' },
  { id: 'patrones', name: 'Patrones', description: 'Diseños repetitivos (seamless) para sublimación full print.', iconName: 'Grid' },
  { id: 'mockups', name: 'Mockups', description: 'Plantillas de presentación comercial sobre prendas reales.', iconName: 'Box' },
  { id: 'infantiles', name: 'Diseños infantiles', description: 'Personajes, temáticas divertidas y colores vivos.', iconName: 'Smile' },
  { id: 'empresariales', name: 'Diseños empresariales', description: 'Gráficos corporativos, uniformes y eventos B2B.', iconName: 'Briefcase' },
  { id: 'promocionales', name: 'Diseños promocionales', description: 'Publicidad de eventos, ferias y merchandising.', iconName: 'Megaphone' },
  { id: 'personalizados', name: 'Recursos personalizados', description: 'Archivos subidos y adaptados por el taller.', iconName: 'FolderPlus' }
];

export type LibraryFormat = 'SVG' | 'PNG' | 'JPG' | 'AI' | 'EPS' | 'PSD' | 'PDF';

export type LibraryPermission = 'publico' | 'taller' | 'privado' | 'cliente';

export interface LibraryFolder {
  id: string;
  name: string;
  color?: string;
  ownerId?: string;
  createdAt: string;
}

export interface LibraryResourceItem {
  id: string;
  title: string;
  category: LibraryCategory;
  format: LibraryFormat;
  tags: string[];
  widthPx: number;
  heightPx: number;
  sizeBytes: number;
  previewUrl: string;
  dataUri?: string;
  folderId?: string;
  isFavorite: boolean;
  permission: LibraryPermission;
  ownerId?: string;
  isCustom: boolean; // false for curated base resources, true for user uploaded
  recommendedTechnique?: string;
  dpi?: number;
  colorCount?: number;
  createdAt: string;
  updatedAt?: string;
}
