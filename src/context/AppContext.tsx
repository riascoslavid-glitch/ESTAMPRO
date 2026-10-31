import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, AppNotification, WorkshopProfile, StoredFile, GarmentItem, DecalLayer3D, DecalPresetVersion, PrintZone3D } from '../types';
import { INITIAL_GARMENTS_CATALOG } from '../constants/garmentsCatalog';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where 
} from 'firebase/firestore';

interface AppContextType {
  activeModuleId: string;
  setActiveModuleId: (id: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  toggleDarkMode: () => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (val: boolean) => void;
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (val: boolean) => void;
  
  // Modals
  isNewProjectModalOpen: boolean;
  setIsNewProjectModalOpen: (val: boolean) => void;
  isSearchPaletteOpen: boolean;
  setIsSearchPaletteOpen: (val: boolean) => void;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (val: boolean) => void;
  isNotificationsDrawerOpen: boolean;
  setIsNotificationsDrawerOpen: (val: boolean) => void;
  selectedProjectForDetails: Project | null;
  setSelectedProjectForDetails: (p: Project | null) => void;

  // Garment Catalog Modal States
  selectedGarmentForDetail: GarmentItem | null;
  setSelectedGarmentForDetail: (g: GarmentItem | null) => void;
  isGarmentFormModalOpen: boolean;
  setIsGarmentFormModalOpen: (val: boolean) => void;
  garmentToEdit: GarmentItem | null;
  setGarmentToEdit: (g: GarmentItem | null) => void;
  
  // Projects
  projects: Project[];
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Garments Catalog (Prompt 3)
  garments: GarmentItem[];
  createGarment: (garment: Omit<GarmentItem, 'id' | 'createdAt'>) => Promise<GarmentItem>;
  updateGarment: (id: string, updates: Partial<GarmentItem>) => Promise<void>;
  deleteGarment: (id: string) => Promise<void>;
  duplicateGarment: (id: string) => Promise<GarmentItem>;

  // Color System
  favoriteColors: string[];
  recentColors: string[];
  addFavoriteColor: (hex: string) => void;
  removeFavoriteColor: (hex: string) => void;
  addRecentColor: (hex: string) => void;

  // Stored Files
  storedFiles: StoredFile[];
  uploadStoredFile: (file: StoredFile) => Promise<void>;
  deleteStoredFile: (id: string) => Promise<void>;
  
  // Notifications
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  addNotification: (title: string, message: string, type?: AppNotification['type'], moduleId?: string) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Workshop Profile
  workshopProfile: WorkshopProfile;
  updateWorkshopProfile: (data: Partial<WorkshopProfile>) => void;

  // Active Graphic Design Projection (Prompt 6)
  activeGraphicTextureUri: string | null;
  setActiveGraphicTextureUri: (uri: string | null) => void;
  graphicPrintPlacement: {
    position: 'pecho_frente' | 'espalda' | 'bolsillo' | 'manga';
    widthCm: number;
    heightCm: number;
    offsetY: number;
  };
  setGraphicPrintPlacement: React.Dispatch<React.SetStateAction<{
    position: 'pecho_frente' | 'espalda' | 'bolsillo' | 'manga';
    widthCm: number;
    heightCm: number;
    offsetY: number;
  }>>;

  // Image Editor Module (Prompt 7)
  imageEditorTargetUri: string | null;
  setImageEditorTargetUri: (uri: string | null) => void;
  openInImageEditor: (imageUri: string) => void;

  // 3D Decal Surface Integration (Prompt 8)
  decalLayers: DecalLayer3D[];
  setDecalLayers: React.Dispatch<React.SetStateAction<DecalLayer3D[]>>;
  activeDecalId: string | null;
  setActiveDecalId: (id: string | null) => void;
  addDecalLayer: (layerOrZone: Omit<DecalLayer3D, 'id'> | PrintZone3D) => string;
  updateDecalLayer: (id: string, updates: Partial<DecalLayer3D>) => void;
  removeDecalLayer: (id: string) => void;
  duplicateDecalLayer: (id: string) => string;
  decalVersions: DecalPresetVersion[];
  saveDecalVersion: (name: string, garmentModel?: string) => void;
  restoreDecalVersion: (version: DecalPresetVersion) => void;
  showCustomizedGarment: boolean;
  setShowCustomizedGarment: (val: boolean) => void;

  // Creative AI Integrations (Prompt 9)
  sendAIToGraphicEditor: (imageUrl: string, title?: string) => void;
  sendAITo3DGarment: (imageUrl: string, title?: string, zone?: PrintZone3D) => void;

  // Interconexión Estudio de Diseño & Archivos
  targetDesignStudioItem: {
    id?: string;
    name: string;
    dataUri?: string;
    url?: string;
    graphicStudioState?: any;
    widthCm?: number;
    heightCm?: number;
  } | null;
  setTargetDesignStudioItem: (item: any) => void;
  openInDesignStudio: (item: {
    id?: string;
    name: string;
    dataUri?: string;
    url?: string;
    graphicStudioState?: any;
    widthCm?: number;
    heightCm?: number;
  }) => void;
  sendToProbador3D: (config: {
    textureUri: string;
    name: string;
    zone?: PrintZone3D;
    widthCm?: number;
    heightCm?: number;
    garmentModel?: string;
  }) => void;
  updateStoredFile: (id: string, updates: Partial<StoredFile>) => Promise<void>;
  toggleFileFavorite: (id: string) => Promise<void>;
  moveStoredFile: (id: string, targetFolder: any, targetSubfolder?: string) => Promise<void>;
}

const DEFAULT_WORKSHOP_PROFILE: WorkshopProfile = {
  name: 'Harmony Estampados',
  tagline: 'Estudio de Diseño Textil & Producción 360°',
  ownerEmail: 'harmonyestampadosr@gmail.com',
  phone: '+56 9 8765 4321',
  city: 'Santiago',
  country: 'Chile',
  currency: 'USD',
  currencySymbol: '$',
  defaultDpi: 300,
  defaultColorProfile: 'CMYK FOGRA39 (Textil Estándar)',
  pricingMarginPercent: 45,
  taxPercent: 19,
  avatarUrl: '/src/assets/images/avatar_master_printer_1793415150877.jpg',
  maxFileUploadSizeMb: 25,
  allowedFileExtensions: ['.ai', '.psd', '.svg', '.png', '.jpg', '.pdf', '.dst', '.emb', '.eps', '.tiff']
};

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Catálogo Textil Calibrado',
    message: 'Prendas base clasificadas en 4 categorías con especificaciones de tejido y áreas de estampado.',
    timestamp: 'Hace 1 minuto',
    type: 'success',
    read: false,
    moduleId: 'catalogo_prendas'
  },
  {
    id: 'notif-2',
    title: 'Base de Datos & Auth Conectados',
    message: 'Firestore y Firebase Authentication aprovisionados con reglas de seguridad ABAC.',
    timestamp: 'Hace 5 minutos',
    type: 'info',
    read: false,
    moduleId: 'inicio'
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModuleId, setActiveModuleId] = useState<string>('inicio');
  
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('estampapro_theme');
    if (saved !== null) {
      return saved === 'dark';
    }
    return true;
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  // Modals
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState<boolean>(false);
  const [isSearchPaletteOpen, setIsSearchPaletteOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isNotificationsDrawerOpen, setIsNotificationsDrawerOpen] = useState<boolean>(false);
  const [selectedProjectForDetails, setSelectedProjectForDetails] = useState<Project | null>(null);

  // Garment Modals (Prompt 3)
  const [selectedGarmentForDetail, setSelectedGarmentForDetail] = useState<GarmentItem | null>(null);
  const [isGarmentFormModalOpen, setIsGarmentFormModalOpen] = useState<boolean>(false);
  const [garmentToEdit, setGarmentToEdit] = useState<GarmentItem | null>(null);

  // Projects State
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('estampapro_projects');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading projects', e);
    }
    return [];
  });

  // Garments State (Prompt 3: Catálogo Profesional de Prendas)
  const [garments, setGarments] = useState<GarmentItem[]>(() => {
    try {
      const saved = localStorage.getItem('estampapro_garments');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading garments', e);
    }
    return INITIAL_GARMENTS_CATALOG;
  });

  // Color System: Favorites and Recent History
  const [favoriteColors, setFavoriteColors] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('estampapro_fav_colors');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return ['#0a0a0c', '#ffffff', '#27272a', '#1d4ed8', '#dc2626', '#facc15'];
  });

  const [recentColors, setRecentColors] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('estampapro_recent_colors');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return ['#0a0a0c', '#f4f3ef', '#d5c7b3', '#3f4f34', '#18181b'];
  });

  // Stored Files State
  const [storedFiles, setStoredFiles] = useState<StoredFile[]>(() => {
    try {
      const saved = localStorage.getItem('estampapro_files');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading files', e);
    }
    return [
      {
        id: 'file-sample-01',
        name: 'Escudo_Textil_Harmony_Studio.png',
        sizeBytes: 482000,
        mimeType: 'image/png',
        extension: '.png',
        folder: 'artes_vectoriales',
        subfolder: 'Logotipos 2026',
        ownerId: 'default-owner',
        dataUri: '/src/assets/images/hero_textile_studio_1793415151404.jpg',
        createdAt: '28 oct 2026',
        dimensions: {
          widthCm: 22,
          heightCm: 26,
          widthPx: 2598,
          heightPx: 3071,
          dpi: 300
        },
        status: 'terminado',
        isFavorite: true,
        tags: ['logotipo', 'serigrafia', 'pecho']
      },
      {
        id: 'file-sample-02',
        name: 'Mockup_Hoodie_French_Terry_3D.jpg',
        sizeBytes: 894000,
        mimeType: 'image/jpeg',
        extension: '.jpg',
        folder: 'mockups_3d',
        subfolder: 'Catálogo Invierno',
        ownerId: 'default-owner',
        dataUri: '/src/assets/images/garment_hoodie_french_terry_1793416400113.jpg',
        createdAt: '29 oct 2026',
        dimensions: {
          widthCm: 28,
          heightCm: 35,
          widthPx: 3307,
          heightPx: 4134,
          dpi: 300
        },
        status: 'terminado',
        isFavorite: true,
        tags: ['hoodie', 'mockup', 'invierno']
      },
      {
        id: 'file-sample-03',
        name: 'Diseno_Gorra_Trucker_Vintage.jpg',
        sizeBytes: 345000,
        mimeType: 'image/jpeg',
        extension: '.jpg',
        folder: 'pedidos_clientes',
        subfolder: 'Bordados & DTF',
        ownerId: 'default-owner',
        dataUri: '/src/assets/images/garment_trucker_cap_1793416400133.jpg',
        createdAt: '30 oct 2026',
        dimensions: {
          widthCm: 12,
          heightCm: 6.5,
          widthPx: 1417,
          heightPx: 768,
          dpi: 300
        },
        status: 'en_progreso',
        isFavorite: false,
        tags: ['gorra', 'trucker', 'parche']
      }
    ];
  });

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('estampapro_notifications');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading notifications', e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Workshop Profile
  const [workshopProfile, setWorkshopProfile] = useState<WorkshopProfile>(() => {
    try {
      const saved = localStorage.getItem('estampapro_profile');
      if (saved) {
        return { ...DEFAULT_WORKSHOP_PROFILE, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Error loading profile', e);
    }
    return DEFAULT_WORKSHOP_PROFILE;
  });

  // Active Graphic Design Projection State (Prompt 6)
  const [activeGraphicTextureUri, setActiveGraphicTextureUri] = useState<string | null>(null);
  const [graphicPrintPlacement, setGraphicPrintPlacement] = useState<{
    position: 'pecho_frente' | 'espalda' | 'bolsillo' | 'manga';
    widthCm: number;
    heightCm: number;
    offsetY: number;
  }>({
    position: 'pecho_frente',
    widthCm: 22,
    heightCm: 28,
    offsetY: 0
  });

  // Image Editor Module (Prompt 7)
  const [imageEditorTargetUri, setImageEditorTargetUri] = useState<string | null>(null);

  const openInImageEditor = (imageUri: string) => {
    setImageEditorTargetUri(imageUri);
    setActiveModuleId('editor_imagenes');
  };

  // Interconexión Estudio de Diseño & Archivos
  const [targetDesignStudioItem, setTargetDesignStudioItem] = useState<{
    id?: string;
    name: string;
    dataUri?: string;
    url?: string;
    graphicStudioState?: any;
    widthCm?: number;
    heightCm?: number;
  } | null>(null);

  const openInDesignStudio = (item: {
    id?: string;
    name: string;
    dataUri?: string;
    url?: string;
    graphicStudioState?: any;
    widthCm?: number;
    heightCm?: number;
  }) => {
    setTargetDesignStudioItem(item);
    setActiveModuleId('estudio_diseno');
    addNotification(
      'Abriendo en Estudio de Diseño',
      `Se cargó "${item.name}" en el espacio interactivo de diseño.`,
      'success',
      'estudio_diseno'
    );
  };

  const sendToProbador3D = (config: {
    textureUri: string;
    name: string;
    zone?: PrintZone3D;
    widthCm?: number;
    heightCm?: number;
    garmentModel?: string;
  }) => {
    const zone = config.zone || 'centro_frontal';
    const newId = `decal-${Date.now()}`;
    const newDecal: DecalLayer3D = {
      id: newId,
      name: config.name || 'Estampado Personalizado',
      textureUri: config.textureUri,
      zone,
      widthCm: config.widthCm || 24,
      heightCm: config.heightCm || 28,
      offsetXCm: 0,
      offsetYCm: 0,
      rotationDeg: 0,
      scale: 1.0,
      visible: true,
      locked: false,
      finishStyle: 'dtf_suave',
      opacity: 1.0
    };

    setDecalLayers((prev) => [...prev, newDecal]);
    setActiveDecalId(newId);
    setActiveGraphicTextureUri(config.textureUri);
    setGraphicPrintPlacement({
      position: zone === 'espalda' ? 'espalda' : zone === 'pecho_izquierdo' ? 'bolsillo' : 'pecho_frente',
      widthCm: config.widthCm || 24,
      heightCm: config.heightCm || 28,
      offsetY: 0
    });
    setActiveModuleId('probador_3d');
    addNotification(
      'Mapeo 3D Realizado',
      `"${config.name}" fue enviado y proyectado sobre la prenda en el Estudio 3D.`,
      'success',
      'probador_3d'
    );
  };

  // 3D Decal Surface Integration (Prompt 8)
  const [decalLayers, setDecalLayers] = useState<DecalLayer3D[]>(() => {
    try {
      const saved = localStorage.getItem('estampapro_decals');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading decals', e);
    }
    return [
      {
        id: 'decal-hero-chest',
        name: 'Emblema Frontal Estudio',
        textureUri: '/src/assets/images/hero_textile_studio_1793415151404.jpg',
        zone: 'centro_frontal',
        widthCm: 24,
        heightCm: 28,
        offsetXCm: 0,
        offsetYCm: 0,
        rotationDeg: 0,
        scale: 1.0,
        visible: true,
        locked: false,
        finishStyle: 'dtf_suave',
        opacity: 1.0
      }
    ];
  });

  const [activeDecalId, setActiveDecalId] = useState<string | null>('decal-hero-chest');
  const [showCustomizedGarment, setShowCustomizedGarment] = useState<boolean>(true);

  const [decalVersions, setDecalVersions] = useState<DecalPresetVersion[]>(() => {
    try {
      const saved = localStorage.getItem('estampapro_decal_versions');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading decal versions', e);
    }
    return [
      {
        id: 'ver-initial',
        name: 'Estilo Inicial Minimal',
        timestamp: Date.now() - 3600000,
        garmentModel: 'camiseta_basica',
        decals: [
          {
            id: 'decal-hero-chest',
            name: 'Emblema Frontal Estudio',
            textureUri: '/src/assets/images/hero_textile_studio_1793415151404.jpg',
            zone: 'centro_frontal',
            widthCm: 24,
            heightCm: 28,
            offsetXCm: 0,
            offsetYCm: 0,
            rotationDeg: 0,
            scale: 1.0,
            visible: true,
            locked: false,
            finishStyle: 'dtf_suave',
            opacity: 1.0
          }
        ]
      }
    ];
  });

  // Guardar en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('estampapro_decals', JSON.stringify(decalLayers));
    } catch (e) {}
  }, [decalLayers]);

  useEffect(() => {
    try {
      localStorage.setItem('estampapro_decal_versions', JSON.stringify(decalVersions));
    } catch (e) {}
  }, [decalVersions]);

  // Sincronizar automáticamente arte 2D cuando se envía al 3D
  useEffect(() => {
    if (activeGraphicTextureUri) {
      setDecalLayers((prev) => {
        if (prev.length > 0 && activeDecalId) {
          return prev.map((d) => (d.id === activeDecalId ? { ...d, textureUri: activeGraphicTextureUri } : d));
        } else {
          const newId = `decal-${Date.now()}`;
          const newDecal: DecalLayer3D = {
            id: newId,
            name: 'Arte Importado 2D',
            textureUri: activeGraphicTextureUri,
            zone: 'centro_frontal',
            widthCm: graphicPrintPlacement?.widthCm || 24,
            heightCm: graphicPrintPlacement?.heightCm || 28,
            offsetXCm: 0,
            offsetYCm: 0,
            rotationDeg: 0,
            scale: 1.0,
            visible: true,
            locked: false,
            finishStyle: 'dtf_suave',
            opacity: 1.0
          };
          setActiveDecalId(newId);
          return [...prev, newDecal];
        }
      });
    }
  }, [activeGraphicTextureUri]);

  // Métodos de gestión de capas de estampados 3D
  const addDecalLayer = (layerOrZone: Omit<DecalLayer3D, 'id'> | PrintZone3D): string => {
    const id = `decal-${Date.now()}`;
    let newLayer: DecalLayer3D;
    if (typeof layerOrZone === 'string') {
      const zone = layerOrZone;
      newLayer = {
        id,
        name: `Estampado ${zone.replace('_', ' ')}`,
        textureUri: activeGraphicTextureUri || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
        zone,
        widthCm: 22,
        heightCm: 22,
        offsetXCm: 0,
        offsetYCm: 0,
        rotationDeg: 0,
        scale: 1.0,
        visible: true,
        locked: false,
        finishStyle: 'dtf_suave',
        opacity: 1.0
      };
    } else {
      newLayer = { ...layerOrZone, id };
    }
    setDecalLayers((prev) => [...prev, newLayer]);
    setActiveDecalId(id);
    return id;
  };

  const updateDecalLayer = (id: string, updates: Partial<DecalLayer3D>) => {
    setDecalLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
    );
  };

  const removeDecalLayer = (id: string) => {
    setDecalLayers((prev) => {
      const filtered = prev.filter((l) => l.id !== id);
      if (activeDecalId === id) {
        setActiveDecalId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  };

  const duplicateDecalLayer = (id: string): string => {
    const target = decalLayers.find((l) => l.id === id);
    if (!target) return id;
    const newId = `decal-${Date.now()}`;
    const copy: DecalLayer3D = {
      ...target,
      id: newId,
      name: `${target.name} (Copia)`,
      offsetXCm: target.offsetXCm + 2.0
    };
    setDecalLayers((prev) => [...prev, copy]);
    setActiveDecalId(newId);
    return newId;
  };

  const saveDecalVersion = (name: string, garmentModel?: string) => {
    const newVer: DecalPresetVersion = {
      id: `ver-${Date.now()}`,
      name,
      timestamp: Date.now(),
      garmentModel: garmentModel || 'camiseta_basica',
      decals: JSON.parse(JSON.stringify(decalLayers))
    };
    setDecalVersions((prev) => [newVer, ...prev]);
  };

  const restoreDecalVersion = (version: DecalPresetVersion) => {
    setDecalLayers(JSON.parse(JSON.stringify(version.decals)));
    if (version.decals.length > 0) {
      setActiveDecalId(version.decals[0].id);
    }
  };

  // Creative AI Integrations (Prompt 9)
  const sendAIToGraphicEditor = (imageUrl: string, title?: string) => {
    setActiveGraphicTextureUri(imageUrl);
    setActiveModuleId('disenador_grafico');
    addNotification(
      'Arte Enviado al Diseñador Gráfico',
      `El arte "${title || 'Diseño IA'}" se cargó en el editor gráfico 2D.`,
      'success',
      'disenador_grafico'
    );
  };

  const sendAITo3DGarment = (imageUrl: string, title?: string, zone: PrintZone3D = 'centro_frontal') => {
    const id = `decal-ai-${Date.now()}`;
    const newDecal: DecalLayer3D = {
      id,
      name: title ? `IA: ${title}` : 'Estampado IA Textil',
      textureUri: imageUrl,
      zone,
      widthCm: 24,
      heightCm: 28,
      offsetXCm: 0,
      offsetYCm: 0,
      rotationDeg: 0,
      scale: 1.0,
      visible: true,
      locked: false,
      finishStyle: 'dtf_suave',
      opacity: 1.0
    };
    setDecalLayers((prev) => [...prev, newDecal]);
    setActiveDecalId(id);
    setShowCustomizedGarment(true);
    setActiveModuleId('probador_3d');
    addNotification(
      'Arte Proyectado en Prenda 3D',
      `El diseño se aplicó a la zona "${zone.replace('_', ' ')}" en el simulador 3D.`,
      'success',
      'probador_3d'
    );
  };

  // Theme sync
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('estampapro_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('estampapro_theme', 'light');
    }
  }, [darkMode]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('estampapro_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('estampapro_garments', JSON.stringify(garments));
  }, [garments]);

  useEffect(() => {
    localStorage.setItem('estampapro_fav_colors', JSON.stringify(favoriteColors));
  }, [favoriteColors]);

  useEffect(() => {
    localStorage.setItem('estampapro_recent_colors', JSON.stringify(recentColors));
  }, [recentColors]);

  useEffect(() => {
    localStorage.setItem('estampapro_files', JSON.stringify(storedFiles));
  }, [storedFiles]);

  useEffect(() => {
    localStorage.setItem('estampapro_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('estampapro_profile', JSON.stringify(workshopProfile));
  }, [workshopProfile]);

  // Listen for keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Listen to Firestore real-time updates for garments
  useEffect(() => {
    const garmentsPath = 'garments';
    try {
      const unsubscribe = onSnapshot(
        collection(db, garmentsPath),
        (snapshot) => {
          if (!snapshot.empty) {
            const fetched: GarmentItem[] = [];
            snapshot.forEach((d) => {
              fetched.push(d.data() as GarmentItem);
            });
            if (fetched.length > 0) {
              setGarments(fetched);
            }
          }
        },
        (error) => {
          console.warn('Firestore onSnapshot garments notice (using local catalog):', error);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore connection notice:', e);
    }
  }, []);

  // Listen to Firestore real-time updates for files and projects with user persistence
  useEffect(() => {
    let unsubscribeFiles: (() => void) | undefined;
    let unsubscribeProjects: (() => void) | undefined;

    const setupListeners = () => {
      try {
        const user = auth.currentUser;
        const filesRef = collection(db, 'files');
        const projectsRef = collection(db, 'projects');

        const filesQuery = user ? query(filesRef, where('ownerId', '==', user.uid)) : filesRef;
        const projectsQuery = user ? query(projectsRef, where('ownerId', '==', user.uid)) : projectsRef;

        unsubscribeFiles = onSnapshot(filesQuery, (snapshot) => {
          if (!snapshot.empty) {
            const fetchedFiles: StoredFile[] = [];
            snapshot.forEach((docSnap) => {
              fetchedFiles.push({ id: docSnap.id, ...docSnap.data() } as StoredFile);
            });
            setStoredFiles((prev) => {
              const map = new Map<string, StoredFile>();
              prev.forEach((f) => map.set(f.id, f));
              fetchedFiles.forEach((f) => map.set(f.id, f));
              return Array.from(map.values());
            });
          }
        }, (err) => {
          console.warn('Firestore onSnapshot files notice:', err);
        });

        unsubscribeProjects = onSnapshot(projectsQuery, (snapshot) => {
          if (!snapshot.empty) {
            const fetchedProjects: Project[] = [];
            snapshot.forEach((docSnap) => {
              fetchedProjects.push({ id: docSnap.id, ...docSnap.data() } as Project);
            });
            setProjects((prev) => {
              const map = new Map<string, Project>();
              prev.forEach((p) => map.set(p.id, p));
              fetchedProjects.forEach((p) => map.set(p.id, p));
              return Array.from(map.values());
            });
          }
        }, (err) => {
          console.warn('Firestore onSnapshot projects notice:', err);
        });
      } catch (e) {
        console.warn('Firestore listeners error:', e);
      }
    };

    setupListeners();

    return () => {
      if (unsubscribeFiles) unsubscribeFiles();
      if (unsubscribeProjects) unsubscribeProjects();
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Garment Management Actions (Prompt 3 - Sección 5)
  const createGarment = async (garmentData: Omit<GarmentItem, 'id' | 'createdAt'>): Promise<GarmentItem> => {
    const newGarment: GarmentItem = {
      ...garmentData,
      id: `garm-${Date.now().toString(36)}`,
      createdAt: new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    };

    setGarments((prev) => [newGarment, ...prev]);

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'garments', newGarment.id), newGarment);
      } catch (err) {
        console.warn('Firestore write garment warning:', err);
      }
    }

    addNotification('Prenda Añadida al Catálogo', `Se registró "${newGarment.name}".`, 'success', 'catalogo_prendas');
    return newGarment;
  };

  const updateGarment = async (id: string, updates: Partial<GarmentItem>): Promise<void> => {
    setGarments((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
    );

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'garments', id), updates, { merge: true });
      } catch (err) {
        console.warn('Firestore update garment warning:', err);
      }
    }

    addNotification('Catálogo Actualizado', 'Los cambios en la prenda se guardaron exitosamente.', 'info', 'catalogo_prendas');
  };

  const deleteGarment = async (id: string): Promise<void> => {
    const target = garments.find((g) => g.id === id);
    setGarments((prev) => prev.filter((g) => g.id !== id));

    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, 'garments', id));
      } catch (err) {
        console.warn('Firestore delete garment warning:', err);
      }
    }

    addNotification('Prenda Eliminada', `"${target?.name || 'Prenda'}" fue removida del catálogo.`, 'info', 'catalogo_prendas');
  };

  const duplicateGarment = async (id: string): Promise<GarmentItem> => {
    const original = garments.find((g) => g.id === id);
    if (!original) throw new Error('Prenda no encontrada');

    const duplicated: GarmentItem = {
      ...original,
      id: `garm-${Date.now().toString(36)}`,
      name: `${original.name} (Copia)`,
      createdAt: new Date().toLocaleDateString('es-ES')
    };

    setGarments((prev) => [duplicated, ...prev]);

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'garments', duplicated.id), duplicated);
      } catch (err) {
        console.warn('Firestore duplicate garment warning:', err);
      }
    }

    addNotification('Prenda Duplicada', `Se creó una copia de "${original.name}".`, 'success', 'catalogo_prendas');
    return duplicated;
  };

  // Color System Actions
  const addFavoriteColor = (hex: string) => {
    const clean = hex.toLowerCase();
    if (!favoriteColors.includes(clean)) {
      setFavoriteColors([clean, ...favoriteColors]);
    }
  };

  const removeFavoriteColor = (hex: string) => {
    setFavoriteColors(favoriteColors.filter((c) => c !== hex.toLowerCase()));
  };

  const addRecentColor = (hex: string) => {
    const clean = hex.toLowerCase();
    const filtered = recentColors.filter((c) => c !== clean);
    setRecentColors([clean, ...filtered.slice(0, 11)]);
  };

  // Project Actions
  const createProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
    const nowStr = new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now().toString(36)}`,
      createdAt: nowStr,
      updatedAt: nowStr,
      layers: projectData.layers || [
        { id: 'layer-1', name: 'Arte Principal', type: 'vector', visible: true, locked: false, opacity: 1 },
        { id: 'layer-2', name: 'Base Blanca', type: 'raster', visible: true, locked: true, opacity: 1 }
      ],
      locations: projectData.locations || [
        { id: 'loc-1', areaName: 'Pecho Frente', widthCm: 28, heightCm: 35, offsetX: 0, offsetY: 0 }
      ],
      settings: projectData.settings || {
        dpi: 300,
        colorProfile: 'CMYK FOGRA39',
        underbaseWhite: true
      }
    };

    setProjects((prev) => [newProject, ...prev]);

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'projects', newProject.id), newProject);
      } catch (err) {
        console.warn('Firestore project store warning:', err);
      }
    }

    addNotification(
      'Nuevo proyecto registrado',
      `Se ha creado "${newProject.title}" para ${newProject.clientName}.`,
      'success',
      'inicio'
    );
    return newProject;
  };

  const updateProject = async (id: string, updates: Partial<Project>): Promise<void> => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toLocaleDateString('es-ES') } : p))
    );

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'projects', id), updates, { merge: true });
      } catch (err) {
        console.warn('Firestore update warning:', err);
      }
    }
  };

  const deleteProject = async (id: string): Promise<void> => {
    setProjects((prev) => prev.filter((p) => p.id !== id));

    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, 'projects', id));
      } catch (err) {
        console.warn('Firestore delete warning:', err);
      }
    }

    addNotification('Proyecto eliminado', 'El proyecto ha sido removido del sistema.', 'info', 'inicio');
  };

  // Storage Actions
  const uploadStoredFile = async (file: StoredFile): Promise<void> => {
    setStoredFiles((prev) => [file, ...prev]);

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'files', file.id), file);
      } catch (err) {
        console.warn('Firestore file store warning:', err);
      }
    }
  };

  const deleteStoredFile = async (id: string): Promise<void> => {
    setStoredFiles((prev) => prev.filter((f) => f.id !== id));

    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, 'files', id));
      } catch (err) {
        console.warn('Firestore file delete warning:', err);
      }
    }

    addNotification('Archivo eliminado', 'El archivo ha sido removido de la bóveda.', 'info', 'archivos_disenos');
  };

  const updateStoredFile = async (id: string, updates: Partial<StoredFile>): Promise<void> => {
    setStoredFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates, updatedAt: new Date().toLocaleDateString('es-ES') } : f))
    );

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'files', id), updates, { merge: true });
      } catch (err) {
        console.warn('Firestore file update warning:', err);
      }
    }
  };

  const toggleFileFavorite = async (id: string): Promise<void> => {
    const file = storedFiles.find((f) => f.id === id);
    if (!file) return;
    const newFav = !file.isFavorite;
    await updateStoredFile(id, { isFavorite: newFav });
    addNotification(
      newFav ? 'Marcado como Favorito' : 'Removido de Favoritos',
      `"${file.name}" se actualizó en la bóveda de archivos.`,
      'info',
      'archivos_disenos'
    );
  };

  const moveStoredFile = async (id: string, targetFolder: any, targetSubfolder?: string): Promise<void> => {
    const file = storedFiles.find((f) => f.id === id);
    if (!file) return;
    await updateStoredFile(id, { folder: targetFolder, subfolder: targetSubfolder || undefined });
    addNotification(
      'Archivo Movido',
      `"${file.name}" se movió a ${targetFolder}${targetSubfolder ? ` / ${targetSubfolder}` : ''}.`,
      'success',
      'archivos_disenos'
    );
  };

  const addNotification = (
    title: string,
    message: string,
    type: AppNotification['type'] = 'info',
    moduleId?: string
  ) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: 'Ahora mismo',
      type,
      read: false,
      moduleId
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const updateWorkshopProfile = (data: Partial<WorkshopProfile>) => {
    setWorkshopProfile((prev) => ({ ...prev, ...data }));
    addNotification('Configuración actualizada', 'Los parámetros del taller se guardaron exitosamente.', 'success', 'configuracion');
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        activeModuleId,
        setActiveModuleId,
        darkMode,
        setDarkMode,
        toggleDarkMode,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isMobileNavOpen,
        setIsMobileNavOpen,
        isNewProjectModalOpen,
        setIsNewProjectModalOpen,
        isSearchPaletteOpen,
        setIsSearchPaletteOpen,
        isSettingsModalOpen,
        setIsSettingsModalOpen,
        isNotificationsDrawerOpen,
        setIsNotificationsDrawerOpen,
        selectedProjectForDetails,
        setSelectedProjectForDetails,
        selectedGarmentForDetail,
        setSelectedGarmentForDetail,
        isGarmentFormModalOpen,
        setIsGarmentFormModalOpen,
        garmentToEdit,
        setGarmentToEdit,
        projects,
        createProject,
        updateProject,
        deleteProject,
        garments,
        createGarment,
        updateGarment,
        deleteGarment,
        duplicateGarment,
        favoriteColors,
        recentColors,
        addFavoriteColor,
        removeFavoriteColor,
        addRecentColor,
        storedFiles,
        uploadStoredFile,
        deleteStoredFile,
        notifications,
        unreadNotificationsCount,
        addNotification,
        markNotificationRead,
        clearAllNotifications,
        workshopProfile,
        updateWorkshopProfile,
        activeGraphicTextureUri,
        setActiveGraphicTextureUri,
        graphicPrintPlacement,
        setGraphicPrintPlacement,
        imageEditorTargetUri,
        setImageEditorTargetUri,
        openInImageEditor,
        decalLayers,
        setDecalLayers,
        activeDecalId,
        setActiveDecalId,
        addDecalLayer,
        updateDecalLayer,
        removeDecalLayer,
        duplicateDecalLayer,
        decalVersions,
        saveDecalVersion,
        restoreDecalVersion,
        showCustomizedGarment,
        setShowCustomizedGarment,
        sendAIToGraphicEditor,
        sendAITo3DGarment,
        targetDesignStudioItem,
        setTargetDesignStudioItem,
        openInDesignStudio,
        sendToProbador3D,
        updateStoredFile,
        toggleFileFavorite,
        moveStoredFile
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
