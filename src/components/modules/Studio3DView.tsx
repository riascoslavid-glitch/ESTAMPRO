import * as THREE from 'three';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  GarmentCategory,
  Garment3DModelType,
  GARMENT_3D_METADATA,
  buildGarment3D,
  createGarmentMaterial
} from '../../services/three/garmentGeometries';
import {
  TextileFinishType,
  TEXTILE_FINISH_PRESETS
} from '../../services/three/textileTextures';
import {
  HumanAvatarType,
  AVATAR_DEFINITIONS,
  SKIN_TONE_PRESETS,
  buildHumanAvatar
} from '../../services/three/humanAvatars';
import {
  VisualSize,
  VisualFit,
  VisualLength,
  BottomGarmentType,
  FittingConfig,
  buildBottomGarment,
  buildFittedTopGarment
} from '../../services/three/virtualFitter';
import {
  PRINT_ZONES_METADATA,
  getZonesForGarment,
  findTargetMeshForZone,
  createRealisticDecalMesh,
  createZoneHighlightMesh,
  raycastGarmentSurface,
  ZoneSurfaceDefinition
} from '../../services/three/decalSurfaceEngine';
import { PrintZone3D, DecalLayer3D, StoredFile } from '../../types';
import { useApp } from '../../context/AppContext';
import { ColorPickerModal } from '../common/ColorPickerModal';
import { MockupExportModal } from './Studio3D/MockupExportModal';
import {
  RotateCcw,
  Camera,
  Eye,
  EyeOff,
  Sun,
  Palette,
  Layers,
  Upload,
  ChevronDown,
  ChevronUp,
  Check,
  ZoomIn,
  ZoomOut,
  Shirt,
  Box,
  User,
  Scissors,
  Sparkles,
  Info,
  Maximize2,
  Crosshair,
  Search,
  Plus,
  Trash2,
  Copy,
  Lock,
  Unlock,
  Move,
  Sliders,
  FolderOpen,
  Save,
  Download,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  SlidersHorizontal,
  Compass
} from 'lucide-react';

export type StudioMode = 'prenda_aislada' | 'probador_virtual';

type LightingPreset = 'estudio_neutral' | 'pasarela_contraste' | 'taller_calido' | 'minimal_suave';
type StudioBackdrop = 'estudio_infinito' | 'loft_industrial' | 'pasarela_nocturna' | 'gris_fotometria';

interface LightingConfig {
  id: LightingPreset;
  name: string;
  ambientIntensity: number;
  keyLightColor: number;
  keyLightIntensity: number;
  fillLightColor: number;
  fillLightIntensity: number;
  rimLightColor: number;
  rimLightIntensity: number;
}

const LIGHTING_PRESETS: Record<LightingPreset, LightingConfig> = {
  estudio_neutral: {
    id: 'estudio_neutral',
    name: 'Estudio Fotográfico Neutral',
    ambientIntensity: 0.65,
    keyLightColor: 0xffffff,
    keyLightIntensity: 1.8,
    fillLightColor: 0xdbeafe,
    fillLightIntensity: 0.8,
    rimLightColor: 0xffedd5,
    rimLightIntensity: 0.6
  },
  pasarela_contraste: {
    id: 'pasarela_contraste',
    name: 'Pasarela & Alto Contraste',
    ambientIntensity: 0.35,
    keyLightColor: 0xffffff,
    keyLightIntensity: 2.4,
    fillLightColor: 0x38bdf8,
    fillLightIntensity: 0.6,
    rimLightColor: 0xf43f5e,
    rimLightIntensity: 1.2
  },
  taller_calido: {
    id: 'taller_calido',
    name: 'Luz de Taller Textil (Cálida)',
    ambientIntensity: 0.7,
    keyLightColor: 0xfff7ed,
    keyLightIntensity: 1.6,
    fillLightColor: 0xfef08a,
    fillLightIntensity: 0.75,
    rimLightColor: 0xfed7aa,
    rimLightIntensity: 0.5
  },
  minimal_suave: {
    id: 'minimal_suave',
    name: 'Exhibición Suave (Softbox)',
    ambientIntensity: 0.85,
    keyLightColor: 0xf8fafc,
    keyLightIntensity: 1.2,
    fillLightColor: 0xe2e8f0,
    fillLightIntensity: 0.9,
    rimLightColor: 0xffffff,
    rimLightIntensity: 0.4
  }
};

const BACKDROP_PRESETS: Record<StudioBackdrop, { name: string; bgClass: string; floorColor: number }> = {
  estudio_infinito: {
    name: 'Ciclorama Blanco Infinito',
    bgClass: 'bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950',
    floorColor: 0x94a3b8
  },
  loft_industrial: {
    name: 'Taller Textil Industrial',
    bgClass: 'bg-gradient-to-b from-zinc-800 to-zinc-950',
    floorColor: 0x3f3f46
  },
  pasarela_nocturna: {
    name: 'Pasarela & Escenario Oscuro',
    bgClass: 'bg-gradient-to-b from-slate-950 via-zinc-900 to-black',
    floorColor: 0x09090b
  },
  gris_fotometria: {
    name: 'Gris Neutro 18% (Fotometría)',
    bgClass: 'bg-zinc-600 dark:bg-zinc-700',
    floorColor: 0x52525b
  }
};

export const Studio3DView: React.FC = () => {
  const {
    addNotification,
    setActiveModuleId,
    activeGraphicTextureUri,
    setActiveGraphicTextureUri,
    decalLayers,
    setDecalLayers,
    activeDecalId,
    setActiveDecalId,
    addDecalLayer,
    updateDecalLayer,
    removeDecalLayer,
    duplicateDecalLayer,
    storedFiles,
    uploadStoredFile,
    openInDesignStudio,
    createProject
  } = useApp();

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'warning' | 'alert' = 'info') => {
    addNotification('Estudio 3D Pacdora', message, type, 'probador_3d');
  }, [addNotification]);

  // Contenedores y referencias Three.js
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const zoneFileInputRef = useRef<HTMLInputElement>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const currentGarmentGroupRef = useRef<THREE.Group | null>(null);
  const avatarGroupRef = useRef<THREE.Group | null>(null);
  const bottomGarmentGroupRef = useRef<THREE.Group | null>(null);
  const decalMeshesGroupRef = useRef<THREE.Group | null>(null);
  const zoneHighlightMeshRef = useRef<THREE.Mesh | null>(null);
  const textureCacheRef = useRef<Map<string, THREE.Texture>>(new Map());
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());

  // Estados de navegación y catálogo
  const [studioMode, setStudioMode] = useState<StudioMode>('prenda_aislada');
  const [selectedCategory, setSelectedCategory] = useState<GarmentCategory | 'Todas'>('Todas');
  const [searchCatalogQuery, setSearchCatalogQuery] = useState('');
  const [leftNavTab, setLeftNavTab] = useState<'catalogo' | 'zonas' | 'capas' | 'biblioteca'>('zonas');

  // Prenda seleccionada
  const [selectedModel, setSelectedModel] = useState<Garment3DModelType>('camiseta_basica');
  const [selectedFinish, setSelectedFinish] = useState<TextileFinishType>('algodon_jersey');
  const [selectedLighting, setSelectedLighting] = useState<LightingPreset>('estudio_neutral');
  const [selectedBackdrop, setSelectedBackdrop] = useState<StudioBackdrop>('estudio_infinito');
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(false);
  const [isRaycastPickActive, setIsRaycastPickActive] = useState<boolean>(false);
  const [isLockAspectRatio, setIsLockAspectRatio] = useState<boolean>(true);

  // Zona activa de personalización
  const [activeZone, setActiveZone] = useState<PrintZone3D>('centro_frontal');
  const [targetZoneForUpload, setTargetZoneForUpload] = useState<PrintZone3D | null>(null);

  // Modal de Exportación y Paleta de Color
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [activePartForColor, setActivePartForColor] = useState<{ id: string; name: string } | null>(null);

  // Avatar y Maniquí
  const [selectedAvatar, setSelectedAvatar] = useState<HumanAvatarType>('masculino_atletico');
  const [avatarSkinHex, setAvatarSkinHex] = useState<string>('#e2cfb7');
  const [fitting, setFitting] = useState<FittingConfig>({
    size: 'M',
    fit: 'regular',
    length: 'regular',
    bottomGarment: 'jogger_streetwear',
    bottomColorHex: '#18181b'
  });

  // Colores por parte de la prenda activa
  const [partColors, setPartColors] = useState<Record<string, string>>({
    cuerpo: '#18181b',
    manga_izquierda: '#18181b',
    manga_derecha: '#18181b',
    cuello: '#27272a',
    dobladillo: '#18181b',
    capucha: '#27272a',
    bolsillo: '#3f3f46',
    punos: '#18181b',
    pretina: '#18181b',
    cordones: '#f4f4f5',
    paneles_laterales: '#0369a1',
    tapeta_botones: '#172554',
    ribete_mangas: '#172554',
    corona_frontal: '#f8fafc',
    paneles_traseros: '#0f172a',
    visera: '#0f172a',
    visera_inferior: '#1e293b',
    boton: '#0f172a',
    pechera: '#292524',
    cintas: '#d97706',
    piernas: '#3f3f46',
    bolsillos_cargo: '#27272a',
    asas: '#292524',
    bolsillo_frontal: '#1e293b'
  });

  const currentMetadata = GARMENT_3D_METADATA[selectedModel];
  const availableZones = getZonesForGarment(selectedModel);
  const activeDecal = decalLayers.find((d) => d.id === activeDecalId) || decalLayers[0];

  // Actualiza los materiales vivos en Three.js cuando cambian los colores o el acabado
  const applyMaterialUpdates = useCallback(() => {
    if (!currentGarmentGroupRef.current) return;

    currentGarmentGroupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const partId = mesh.userData?.partId;

        if (partId && partColors[partId]) {
          const newColorHex = partColors[partId];
          if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).color) {
            const stdMat = mesh.material as THREE.MeshStandardMaterial;
            stdMat.color.set(newColorHex);
            const finishConfig = TEXTILE_FINISH_PRESETS[selectedFinish];
            stdMat.roughness = finishConfig.roughness;
            stdMat.metalness = finishConfig.metalness;
          }
        }
      }
    });

    if (bottomGarmentGroupRef.current) {
      bottomGarmentGroupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).color) {
            (mesh.material as THREE.MeshStandardMaterial).color.set(fitting.bottomColorHex);
          }
        }
      });
    }
  }, [partColors, selectedFinish, fitting.bottomColorHex]);

  // Proyección realista DecalGeometry sobre la superficie 3D
  const renderProjectedDecals = useCallback(() => {
    if (!sceneRef.current || !currentGarmentGroupRef.current) return;
    const decalGroup = decalMeshesGroupRef.current;
    if (!decalGroup) return;

    // Limpiar decals anteriores
    while (decalGroup.children.length > 0) {
      const obj = decalGroup.children[0] as THREE.Mesh;
      decalGroup.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
      else if (obj.material) obj.material.dispose();
    }

    const isAvatarMode = studioMode === 'probador_virtual';

    decalLayers.forEach((decal) => {
      if (decal.visible === false || !decal.textureUri) return;

      let targetMesh: THREE.Mesh | null = null;
      if (decal.zone === 'pantalones' && bottomGarmentGroupRef.current) {
        bottomGarmentGroupRef.current.traverse((c) => {
          if (!targetMesh && (c as THREE.Mesh).isMesh) targetMesh = c as THREE.Mesh;
        });
      }
      if (!targetMesh && currentGarmentGroupRef.current) {
        targetMesh = findTargetMeshForZone(currentGarmentGroupRef.current, decal.zone);
      }

      if (!targetMesh) return;

      const cached = textureCacheRef.current.get(decal.textureUri);
      if (cached) {
        const decalMesh = createRealisticDecalMesh(targetMesh, decal, cached, isAvatarMode);
        if (decalMesh) decalGroup.add(decalMesh);
      } else {
        const loader = new THREE.TextureLoader();
        loader.load(
          decal.textureUri,
          (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            textureCacheRef.current.set(decal.textureUri, tex);
            if (sceneRef.current && currentGarmentGroupRef.current) {
              const freshMesh = createRealisticDecalMesh(targetMesh!, decal, tex, isAvatarMode);
              if (freshMesh) decalGroup.add(freshMesh);
            }
          },
          undefined,
          (err) => console.error('Error cargando textura 3D:', err)
        );
      }
    });
  }, [studioMode, decalLayers]);

  // Resaltado de la zona activa en la malla 3D (Glowing Guide Mesh)
  const updateZoneHighlight = useCallback(() => {
    if (!sceneRef.current) return;

    if (zoneHighlightMeshRef.current) {
      sceneRef.current.remove(zoneHighlightMeshRef.current);
      if (zoneHighlightMeshRef.current.geometry) zoneHighlightMeshRef.current.geometry.dispose();
      zoneHighlightMeshRef.current = null;
    }

    const isAvatarMode = studioMode === 'probador_virtual';
    const highlightMesh = createZoneHighlightMesh(activeZone, isAvatarMode);
    sceneRef.current.add(highlightMesh);
    zoneHighlightMeshRef.current = highlightMesh;
  }, [activeZone, studioMode]);

  // Reconstruye los actores 3D de la escena (Prenda aislada o Maniquí)
  const rebuildSceneActors = useCallback(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    if (avatarGroupRef.current) {
      scene.remove(avatarGroupRef.current);
      avatarGroupRef.current = null;
    }
    if (bottomGarmentGroupRef.current) {
      scene.remove(bottomGarmentGroupRef.current);
      bottomGarmentGroupRef.current = null;
    }
    if (currentGarmentGroupRef.current) {
      scene.remove(currentGarmentGroupRef.current);
      currentGarmentGroupRef.current = null;
    }

    if (studioMode === 'probador_virtual') {
      const avatar = buildHumanAvatar(selectedAvatar, avatarSkinHex);
      scene.add(avatar);
      avatarGroupRef.current = avatar;

      if (selectedAvatar !== 'maniqui_sastre') {
        const bottom = buildBottomGarment(fitting.bottomGarment, fitting.bottomColorHex, 'french_terry');
        scene.add(bottom);
        bottomGarmentGroupRef.current = bottom;
      }

      const topGarment = buildFittedTopGarment(selectedModel, partColors, selectedFinish, fitting);
      scene.add(topGarment);
      currentGarmentGroupRef.current = topGarment;

      if (controlsRef.current) {
        controlsRef.current.target.set(0, 1.85, 0);
        controlsRef.current.update();
      }
    } else {
      const plainGarment = buildGarment3D(selectedModel, partColors, selectedFinish);
      scene.add(plainGarment);
      currentGarmentGroupRef.current = plainGarment;

      if (controlsRef.current) {
        const targetY = selectedModel === 'gorra_trucker' ? 1.6 : 1.35;
        controlsRef.current.target.set(0, targetY, 0);
        controlsRef.current.update();
      }
    }

    setTimeout(() => {
      renderProjectedDecals();
      updateZoneHighlight();
    }, 30);
  }, [
    studioMode,
    selectedAvatar,
    avatarSkinHex,
    selectedModel,
    partColors,
    selectedFinish,
    fitting,
    renderProjectedDecals,
    updateZoneHighlight
  ]);

  useEffect(() => {
    renderProjectedDecals();
  }, [renderProjectedDecals]);

  useEffect(() => {
    updateZoneHighlight();
  }, [updateZoneHighlight]);

  useEffect(() => {
    applyMaterialUpdates();
  }, [applyMaterialUpdates]);

  // Inicialización de la escena WebGL Three.js
  useEffect(() => {
    if (!canvasMountRef.current) return;
    const container = canvasMountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true,
      preserveDrawingBuffer: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.45, 3.8);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.0;
    controls.maxDistance = 8.5;
    controls.maxPolarAngle = Math.PI / 2 + 0.12;
    controls.target.set(0, 1.35, 0);
    controls.update();
    controlsRef.current = controls;

    // Piso de estudio con sombra de contacto radial
    const floorGroup = new THREE.Group();
    floorGroup.name = 'studio_floor_group';

    const shadowGeo = new THREE.PlaneGeometry(4.2, 4.2);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sctx = shadowCanvas.getContext('2d')!;
    const grad = sctx.createRadialGradient(128, 128, 10, 128, 128, 120);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.16)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.01;
    floorGroup.add(shadowMesh);

    const gridHelper = new THREE.GridHelper(7, 28, 0x64748b, 0x334155);
    gridHelper.position.y = 0.005;
    floorGroup.add(gridHelper);
    scene.add(floorGroup);

    // Sistema de Iluminación de 4 puntos
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x334155, 0.45);
    hemiLight.position.set(0, 8, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(2.8, 5.0, 4.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.8);
    fillLight.position.set(-3.5, 3.0, 2.5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffedd5, 0.65);
    rimLight.position.set(0, 4.2, -4.0);
    scene.add(rimLight);

    const decalGroup = new THREE.Group();
    decalGroup.name = 'decal_meshes_group';
    scene.add(decalGroup);
    decalMeshesGroupRef.current = decalGroup;

    rebuildSceneActors();

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.autoRotate = isAutoRotate;
        controlsRef.current.autoRotateSpeed = 2.0;
        controlsRef.current.update();
      }
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  // Recargar actores ante cambios estructurales
  useEffect(() => {
    rebuildSceneActors();
  }, [rebuildSceneActors]);

  // Controles de Cámara Preestablecidos
  const setCameraPreset = (preset: 'frontal' | 'trasera' | 'izquierda' | 'derecha' | 'arriba' | 'detalle' | 'reset') => {
    if (!cameraRef.current || !controlsRef.current) return;
    const targetY = studioMode === 'probador_virtual' ? 1.85 : 1.35;
    controlsRef.current.target.set(0, targetY, 0);

    switch (preset) {
      case 'frontal':
        cameraRef.current.position.set(0, targetY + 0.1, 3.6);
        break;
      case 'trasera':
        cameraRef.current.position.set(0, targetY + 0.1, -3.8);
        break;
      case 'izquierda':
        cameraRef.current.position.set(3.4, targetY + 0.2, 0.2);
        break;
      case 'derecha':
        cameraRef.current.position.set(-3.4, targetY + 0.2, 0.2);
        break;
      case 'arriba':
        cameraRef.current.position.set(0, targetY + 3.2, 0.8);
        break;
      case 'detalle':
        cameraRef.current.position.set(0, targetY + 0.15, 1.8);
        break;
      case 'reset':
      default:
        cameraRef.current.position.set(0, targetY + 0.2, 3.8);
        break;
    }
    controlsRef.current.update();
  };

  // Enfoque hacia una zona específica
  const handleFocusZone = (zone: PrintZone3D) => {
    setActiveZone(zone);
    const meta = PRINT_ZONES_METADATA[zone];
    if (!meta || !cameraRef.current || !controlsRef.current) return;

    const yDelta = studioMode === 'probador_virtual' ? 0.7 : 0;
    const [cx, cy, cz] = meta.cameraFocus.camPosition;
    const [tx, ty, tz] = meta.cameraFocus.camTarget;

    controlsRef.current.target.set(tx, ty + yDelta, tz);
    cameraRef.current.position.set(cx, cy + yDelta, cz);
    controlsRef.current.update();
    showToast(`Zona enfocada: ${meta.label}`, 'info');
  };

  // SUBIDA DE ARCHIVO (Flujo Prioritario)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetZone?: PrintZone3D) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const zoneToApply = targetZone || activeZone;
    const reader = new FileReader();

    reader.onload = async () => {
      const dataUri = reader.result as string;

      // 1. Guardar en la bóveda de archivos persistente
      const newFileId = `file-${Date.now()}`;
      const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
      const newStoredFile: StoredFile = {
        id: newFileId,
        name: file.name.replace(/\.[^/.]+$/, ''),
        extension: ext,
        mimeType: file.type || 'image/png',
        sizeBytes: file.size,
        folder: 'disenos_recientes',
        ownerId: 'usuario_actual',
        dataUri,
        createdAt: new Date().toLocaleDateString('es-ES'),
        dimensions: {
          widthCm: 24,
          heightCm: 28,
          widthPx: 1200,
          heightPx: 1400,
          dpi: 300
        },
        status: 'terminado',
        isFavorite: true,
        tags: [zoneToApply, selectedModel]
      };

      await uploadStoredFile(newStoredFile);

      // 2. Crear o actualizar DecalLayer en la zona seleccionada
      const existingDecalOnZone = decalLayers.find((d) => d.zone === zoneToApply);
      if (existingDecalOnZone) {
        updateDecalLayer(existingDecalOnZone.id, {
          textureUri: dataUri,
          name: newStoredFile.name,
          visible: true
        });
        setActiveDecalId(existingDecalOnZone.id);
      } else {
        const newDecalId = addDecalLayer({
          name: newStoredFile.name,
          textureUri: dataUri,
          zone: zoneToApply,
          widthCm: PRINT_ZONES_METADATA[zoneToApply]?.defaultWidthCm || 24,
          heightCm: PRINT_ZONES_METADATA[zoneToApply]?.defaultHeightCm || 28,
          offsetXCm: 0,
          offsetYCm: 0,
          rotationDeg: 0,
          scale: 1.0,
          visible: true,
          locked: false,
          finishStyle: 'dtf_suave',
          opacity: 1.0
        });
        setActiveDecalId(newDecalId);
      }

      setActiveZone(zoneToApply);
      showToast(`¡Diseño colocado exitosamente sobre ${PRINT_ZONES_METADATA[zoneToApply].label}!`, 'success');
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Clic interactivo en la tela para reubicar diseño
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isRaycastPickActive || !canvasMountRef.current || !currentGarmentGroupRef.current || !cameraRef.current) return;
    const rect = canvasMountRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);
    const hit = raycastGarmentSurface(currentGarmentGroupRef.current, raycasterRef.current);

    if (hit && activeDecalId) {
      updateDecalLayer(activeDecalId, {
        zone: hit.detectedZone,
        offsetXCm: 0,
        offsetYCm: 0
      });
      setActiveZone(hit.detectedZone);
      setIsRaycastPickActive(false);
      showToast(`Estampado reubicado sobre: ${PRINT_ZONES_METADATA[hit.detectedZone].label}`, 'success');
    }
  };

  // Guardar proyecto 3D completo en Firebase / LocalStorage
  const handleSave3DProject = async () => {
    try {
      await createProject({
        title: `${currentMetadata.name} - Personalización 3D`,
        ownerId: 'usuario_actual',
        clientName: 'Cliente Estudio 3D',
        garmentName: currentMetadata.name,
        garmentColor: 'Color Personalizado',
        garmentColorHex: partColors.cuerpo || '#18181b',
        techniqueId: 'dtf_textil',
        quantity: 1,
        thumbnailUrl: activeDecal?.textureUri || currentMetadata.defaultFinish,
        status: 'en_diseno',
        notes: `Configuración 3D con ${decalLayers.length} artes aplicados sobre modelo ${currentMetadata.name}.`
      });
      showToast('Proyecto 3D guardado permanentemente en la base de datos.', 'success');
    } catch (err) {
      showToast('Error al guardar el proyecto.', 'alert');
    }
  };

  // Abrir en Estudio de Diseño 2D
  const handleOpenIn2DStudio = () => {
    if (activeDecal?.textureUri) {
      openInDesignStudio({
        name: activeDecal.name,
        dataUri: activeDecal.textureUri,
        widthCm: activeDecal.widthCm,
        heightCm: activeDecal.heightCm
      });
    } else {
      setActiveModuleId('estudio_diseno');
    }
  };

  // Filtro de modelos en catálogo
  const filteredModels = Object.values(GARMENT_3D_METADATA).filter((g) => {
    const matchesCat = selectedCategory === 'Todas' || g.categoryName === selectedCategory;
    const matchesQuery = g.name.toLowerCase().includes(searchCatalogQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchCatalogQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const currentBackdropConfig = BACKDROP_PRESETS[selectedBackdrop];

  return (
    <div className={`relative w-full h-[calc(100vh-5.5rem)] flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 select-none shadow-2xl transition-all ${currentBackdropConfig.bgClass}`}>
      {/* Inputs ocultos de archivo */}
      <input
        ref={heroFileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => handleFileUpload(e, activeZone)}
      />
      <input
        ref={zoneFileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => handleFileUpload(e, targetZoneForUpload || activeZone)}
      />

      {/* 1. BARRA SUPERIOR PROFESIONAL (ESTILO PACDORA) */}
      <div className="z-30 flex items-center justify-between px-4 py-2.5 backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Lado izquierdo: Título de prenda & Modalidad */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 dark:bg-cyan-600 flex items-center justify-center text-white shadow-xs">
              <Shirt className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {currentMetadata.name}
                </h1>
                {currentMetadata.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 rounded">
                    {currentMetadata.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {currentMetadata.categoryName} · {currentMetadata.parts.length} partes personalizables · {availableZones.length} zonas
              </span>
            </div>
          </div>

          <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 hidden sm:block" />

          {/* Selector de Modalidad: Prenda Aislada vs Probador Avatar */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setStudioMode('prenda_aislada')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                studioMode === 'prenda_aislada'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-cyan-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              <span>Prenda Aislada 360°</span>
            </button>
            <button
              type="button"
              onClick={() => setStudioMode('probador_virtual')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                studioMode === 'probador_virtual'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-cyan-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Avatar Humano 3D</span>
            </button>
          </div>
        </div>

        {/* Lado derecho: Acciones de Guardar, Diseño 2D y Exportación Mockup */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenIn2DStudio}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title="Abrir diseño actual en el Estudio de Diseño 2D"
          >
            <ExternalLink className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
            <span className="hidden md:inline">Abrir en Estudio 2D</span>
          </button>

          <button
            type="button"
            onClick={handleSave3DProject}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title="Guardar proyecto completo en la base de datos"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Guardar Proyecto</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 dark:bg-cyan-600 dark:hover:bg-cyan-500 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Mockups HD</span>
          </button>
        </div>
      </div>

      {/* 2. ÁREA DE TRABAJO PRINCIPAL: 3 COLUMNAS (IZQUIERDA, CENTRO 3D, DERECHA) */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* PANEL IZQUIERDO: CATÁLOGO, ZONAS, CAPAS, BIBLIOTECA */}
        <div className="w-80 shrink-0 z-20 backdrop-blur-2xl bg-white/95 dark:bg-slate-900/95 border-r border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
          {/* Pestañas del Panel Izquierdo */}
          <div className="grid grid-cols-4 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setLeftNavTab('catalogo')}
              className={`py-2.5 text-center transition-colors cursor-pointer ${
                leftNavTab === 'catalogo'
                  ? 'border-b-2 border-indigo-600 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400 bg-indigo-50/50 dark:bg-cyan-950/20'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Prendas
            </button>
            <button
              type="button"
              onClick={() => setLeftNavTab('zonas')}
              className={`py-2.5 text-center transition-colors cursor-pointer ${
                leftNavTab === 'zonas'
                  ? 'border-b-2 border-indigo-600 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400 bg-indigo-50/50 dark:bg-cyan-950/20'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Zonas ({availableZones.length})
            </button>
            <button
              type="button"
              onClick={() => setLeftNavTab('capas')}
              className={`py-2.5 text-center transition-colors cursor-pointer ${
                leftNavTab === 'capas'
                  ? 'border-b-2 border-indigo-600 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400 bg-indigo-50/50 dark:bg-cyan-950/20'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Capas ({decalLayers.length})
            </button>
            <button
              type="button"
              onClick={() => setLeftNavTab('biblioteca')}
              className={`py-2.5 text-center transition-colors cursor-pointer ${
                leftNavTab === 'biblioteca'
                  ? 'border-b-2 border-indigo-600 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400 bg-indigo-50/50 dark:bg-cyan-950/20'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Archivos
            </button>
          </div>

          {/* CONTENIDO PESTAÑA: CATÁLOGO DE 30 PRENDAS */}
          {leftNavTab === 'catalogo' && (
            <div className="flex-1 flex flex-col overflow-hidden p-3 space-y-3">
              {/* Buscador */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar modelo 3D..."
                  value={searchCatalogQuery}
                  onChange={(e) => setSearchCatalogQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 rounded-lg outline-none border border-transparent focus:border-indigo-500 text-slate-900 dark:text-white"
                />
              </div>

              {/* Filtro por Categorías */}
              <div className="flex gap-1 overflow-x-auto pb-1 text-[10px]">
                {(['Todas', 'Camisetas', 'Busos', 'Otras prendas', 'Accesorios'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-1 rounded-md font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white dark:bg-cyan-600 dark:text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Lista de Modelos */}
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                {filteredModels.map((item) => {
                  const isSelected = selectedModel === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSelectedModel(item.id);
                        setSelectedFinish(item.defaultFinish);
                        const defaultZone = getZonesForGarment(item.id)[0]?.id || 'centro_frontal';
                        setActiveZone(defaultZone);
                        showToast(`Cargando modelo 3D: ${item.name}`, 'info');
                      }}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 dark:border-cyan-400 bg-indigo-50/70 dark:bg-cyan-950/40 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`text-xs font-bold block truncate ${isSelected ? 'text-indigo-600 dark:text-cyan-400' : 'text-slate-900 dark:text-white'}`}>
                          {item.name}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400 shrink-0" />}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mb-1">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-mono">
                        <span>{item.categoryName}</span>
                        <span>·</span>
                        <span>{item.parts.length} piezas</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* CONTENIDO PESTAÑA: ZONAS DE PERSONALIZACIÓN CON BOTÓN SUBIR ARCHIVO */}
          {leftNavTab === 'zonas' && (
            <div className="flex-1 flex flex-col overflow-hidden p-3 space-y-3">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Selecciona una zona de la prenda activa para resaltar en 3D o sube un diseño directamente:
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {availableZones.map((z) => {
                  const isCurrent = activeZone === z.id;
                  const decalsOnThisZone = decalLayers.filter((d) => d.zone === z.id && d.visible !== false);
                  const hasDecals = decalsOnThisZone.length > 0;

                  return (
                    <div
                      key={z.id}
                      onClick={() => handleFocusZone(z.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer space-y-2 ${
                        isCurrent
                          ? 'border-indigo-600 dark:border-cyan-400 bg-indigo-50/60 dark:bg-cyan-950/40 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className={`text-xs font-bold block ${isCurrent ? 'text-indigo-600 dark:text-cyan-400' : 'text-slate-900 dark:text-white'}`}>
                            {z.label}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Máx {z.maxWidthCm}×{z.maxHeightCm} cm
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                          hasDecals
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        }`}>
                          {hasDecals ? `${decalsOnThisZone.length} arte(s)` : 'Vía libre'}
                        </span>
                      </div>

                      {/* BOTÓN VISIBLE PRIORITARIO: SUBIR ARCHIVO */}
                      <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTargetZoneForUpload(z.id);
                            zoneFileInputRef.current?.click();
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white dark:bg-cyan-600 dark:hover:bg-cyan-500 rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>SUBIR ARCHIVO</span>
                        </button>

                        <button
                          type="button"
                          title="Enfocar cámara 3D en esta zona"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFocusZone(z.id);
                          }}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                        >
                          <Compass className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CONTENIDO PESTAÑA: CAPAS DE ESTAMPADOS */}
          {leftNavTab === 'capas' && (
            <div className="flex-1 flex flex-col overflow-hidden p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Capas Activas ({decalLayers.length})
                </span>
                <button
                  type="button"
                  onClick={() => addDecalLayer(activeZone)}
                  className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-cyan-400 hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nueva Capa</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {decalLayers.map((decal) => {
                  const isSel = decal.id === activeDecal?.id;
                  const zoneMeta = PRINT_ZONES_METADATA[decal.zone];

                  return (
                    <div
                      key={decal.id}
                      onClick={() => {
                        setActiveDecalId(decal.id);
                        setActiveZone(decal.zone);
                      }}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                        isSel
                          ? 'border-indigo-600 dark:border-cyan-400 bg-indigo-50/70 dark:bg-cyan-950/40 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-slate-900 overflow-hidden border border-slate-700 shrink-0 flex items-center justify-center">
                          <img src={decal.textureUri} alt={decal.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                            {decal.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono block truncate">
                            {zoneMeta?.label || decal.zone} · {decal.widthCm}×{decal.heightCm}cm
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateDecalLayer(decal.id, { visible: !decal.visible });
                          }}
                          className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                        >
                          {decal.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-rose-500" />}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateDecalLayer(decal.id);
                          }}
                          className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-cyan-400"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {decalLayers.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeDecalLayer(decal.id);
                            }}
                            className="p-1 text-slate-400 hover:text-rose-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CONTENIDO PESTAÑA: BIBLIOTECA DE DISEÑOS */}
          {leftNavTab === 'biblioteca' && (
            <div className="flex-1 flex flex-col overflow-hidden p-3 space-y-3">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Archivos en Bóveda ({storedFiles.length})
              </span>
              <p className="text-[11px] text-slate-500">
                Haz clic en cualquier diseño para aplicarlo directamente sobre la zona <span className="font-bold text-indigo-600 dark:text-cyan-400">{PRINT_ZONES_METADATA[activeZone]?.label}</span>.
              </p>

              <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-2 pr-1">
                {storedFiles.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      if (activeDecalId) {
                        updateDecalLayer(activeDecalId, {
                          textureUri: f.dataUri || f.url,
                          name: f.name
                        });
                      } else {
                        addDecalLayer({
                          name: f.name,
                          textureUri: f.dataUri || f.url || '',
                          zone: activeZone,
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
                        });
                      }
                      showToast(`"${f.name}" aplicado a ${PRINT_ZONES_METADATA[activeZone].label}`, 'success');
                    }}
                    className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-left transition-all cursor-pointer group"
                  >
                    <div className="aspect-square bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center mb-1.5 border border-slate-700">
                      <img src={f.dataUri || f.url} alt={f.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white block truncate">
                      {f.name}
                    </span>
                    <span className="text-[9px] text-slate-400 block font-mono">
                      {f.extension?.toUpperCase() || 'IMG'} · {f.dimensions?.widthCm}×{f.dimensions?.heightCm}cm
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CENTRO: VISOR WEBGL THREE.JS & BARRA FLOTANTE DE CÁMARA */}
        <div className="relative flex-1 flex flex-col overflow-hidden">
          {/* Barra Flotante de Ángulos de Cámara & Iluminación */}
          <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            {/* Presets de Cámara */}
            <div className="flex items-center gap-1 pointer-events-auto backdrop-blur-md bg-white/90 dark:bg-slate-900/90 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md">
              <button
                type="button"
                onClick={() => setCameraPreset('frontal')}
                className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Frente
              </button>
              <button
                type="button"
                onClick={() => setCameraPreset('trasera')}
                className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Espalda
              </button>
              <button
                type="button"
                onClick={() => setCameraPreset('izquierda')}
                className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Perfil Izq
              </button>
              <button
                type="button"
                onClick={() => setCameraPreset('derecha')}
                className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Perfil Der
              </button>
              <button
                type="button"
                onClick={() => setCameraPreset('arriba')}
                className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Arriba
              </button>
              <button
                type="button"
                onClick={() => setCameraPreset('detalle')}
                className="px-2.5 py-1 text-[11px] font-semibold text-indigo-600 dark:text-cyan-400 hover:bg-indigo-50 dark:hover:bg-cyan-950/40 rounded-lg transition-colors cursor-pointer"
              >
                Detalle
              </button>
              <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />
              <button
                type="button"
                onClick={() => setCameraPreset('reset')}
                title="Reiniciar Cámara"
                className="p-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Auto-Giro 360° y Escenarios */}
            <div className="flex items-center gap-2 pointer-events-auto backdrop-blur-md bg-white/90 dark:bg-slate-900/90 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md">
              <button
                type="button"
                onClick={() => setIsAutoRotate(!isAutoRotate)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                  isAutoRotate
                    ? 'bg-indigo-600 text-white dark:bg-cyan-500 dark:text-slate-950'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAutoRotate ? 'animate-spin' : ''}`} />
                <span>360°</span>
              </button>

              <div className="w-px h-4 bg-slate-300 dark:bg-slate-700" />

              <select
                value={selectedBackdrop}
                onChange={(e) => setSelectedBackdrop(e.target.value as StudioBackdrop)}
                className="text-[11px] font-bold text-slate-800 dark:text-slate-200 bg-transparent border-none outline-none cursor-pointer"
              >
                {Object.entries(BACKDROP_PRESETS).map(([key, b]) => (
                  <option key={key} value={key} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {b.name}
                  </option>
                ))}
              </select>

              <div className="w-px h-4 bg-slate-300 dark:bg-slate-700" />

              <select
                value={selectedLighting}
                onChange={(e) => setSelectedLighting(e.target.value as LightingPreset)}
                className="text-[11px] font-bold text-slate-800 dark:text-slate-200 bg-transparent border-none outline-none cursor-pointer"
              >
                {Object.entries(LIGHTING_PRESETS).map(([key, l]) => (
                  <option key={key} value={key} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Banner de Modo Ubicación con Clic 3D */}
          {isRaycastPickActive && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-cyan-500 text-white dark:text-slate-950 text-xs font-bold rounded-xl shadow-xl animate-pulse">
                <Crosshair className="w-4 h-4 animate-spin" />
                <span>Haz clic sobre cualquier parte de la prenda 3D para posicionar el estampado</span>
                <button
                  type="button"
                  onClick={() => setIsRaycastPickActive(false)}
                  className="ml-2 px-2 py-0.5 bg-black/20 hover:bg-black/30 rounded-md cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Canvas WebGL */}
          <div
            ref={canvasMountRef}
            onClick={handleCanvasClick}
            className={`relative w-full h-full flex-1 outline-none ${
              isRaycastPickActive ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'
            }`}
          />
        </div>

        {/* PANEL DERECHO: INSPECTOR, BOTÓN SUBIR ARCHIVO, COLORES POR PIEZA, MATERIALES */}
        <div className="w-84 shrink-0 z-20 backdrop-blur-2xl bg-white/95 dark:bg-slate-900/95 border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-y-auto p-4 space-y-5">
          {/* BOTÓN HERO PRIORITARIO: SUBIR ARCHIVO */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => heroFileInputRef.current?.click()}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white dark:bg-cyan-600 dark:hover:bg-cyan-500 font-extrabold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
            >
              <Upload className="w-4 h-4 stroke-[2.5]" />
              <span>SUBIR ARCHIVO</span>
            </button>
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span>Formatos: PNG, JPG, SVG, WEBP</span>
              <button
                type="button"
                onClick={() => setLeftNavTab('biblioteca')}
                className="text-indigo-600 dark:text-cyan-400 font-bold hover:underline cursor-pointer"
              >
                Elegir de Biblioteca
              </button>
            </div>
          </div>

          {/* INSPECTOR DE TRANSFORMACIONES DEL ESTAMPADO */}
          {activeDecal ? (
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Estampado en {PRINT_ZONES_METADATA[activeDecal.zone]?.label}
                </span>
                <button
                  type="button"
                  onClick={() => setIsRaycastPickActive(!isRaycastPickActive)}
                  className={`p-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                    isRaycastPickActive
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                  title="Posicionar con clic en la malla 3D"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Selector de Zona */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Zona de Aplicación:</label>
                <select
                  value={activeDecal.zone}
                  onChange={(e) => {
                    const z = e.target.value as PrintZone3D;
                    updateDecalLayer(activeDecal.id, { zone: z, offsetXCm: 0, offsetYCm: 0 });
                    handleFocusZone(z);
                  }}
                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none cursor-pointer text-slate-900 dark:text-white font-semibold"
                >
                  {availableZones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.label} (Máx {z.maxWidthCm}×{z.maxHeightCm}cm)
                    </option>
                  ))}
                </select>
              </div>

              {/* Dimensiones W x H en centímetros */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Tamaño (cm):</label>
                  <button
                    type="button"
                    onClick={() => setIsLockAspectRatio(!isLockAspectRatio)}
                    className={`flex items-center gap-1 text-[10px] font-bold ${
                      isLockAspectRatio ? 'text-indigo-600 dark:text-cyan-400' : 'text-slate-400'
                    }`}
                  >
                    {isLockAspectRatio ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    <span>Proporción</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[9px] text-slate-400 font-mono">Ancho:</span>
                    <input
                      type="number"
                      min={4}
                      max={PRINT_ZONES_METADATA[activeDecal.zone]?.maxWidthCm || 40}
                      step={0.5}
                      value={activeDecal.widthCm}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 10;
                        const ratio = activeDecal.heightCm / activeDecal.widthCm;
                        updateDecalLayer(activeDecal.id, {
                          widthCm: val,
                          heightCm: isLockAspectRatio ? Math.round(val * ratio * 10) / 10 : activeDecal.heightCm
                        });
                      }}
                      className="w-full px-2 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-mono">Alto:</span>
                    <input
                      type="number"
                      min={4}
                      max={PRINT_ZONES_METADATA[activeDecal.zone]?.maxHeightCm || 50}
                      step={0.5}
                      value={activeDecal.heightCm}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 10;
                        const ratio = activeDecal.widthCm / activeDecal.heightCm;
                        updateDecalLayer(activeDecal.id, {
                          heightCm: val,
                          widthCm: isLockAspectRatio ? Math.round(val * ratio * 10) / 10 : activeDecal.widthCm
                        });
                      }}
                      className="w-full px-2 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Posición Offset X & Y */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Posición (Offset cm):</label>
                  <button
                    type="button"
                    onClick={() => updateDecalLayer(activeDecal.id, { offsetXCm: 0, offsetYCm: 0 })}
                    className="text-[10px] text-indigo-600 dark:text-cyan-400 font-bold hover:underline cursor-pointer"
                  >
                    Centrar
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-mono">X:</span>
                    <input
                      type="range"
                      min={-8}
                      max={8}
                      step={0.2}
                      value={activeDecal.offsetXCm}
                      onChange={(e) => updateDecalLayer(activeDecal.id, { offsetXCm: parseFloat(e.target.value) })}
                      className="w-full accent-indigo-600 dark:accent-cyan-400 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-mono">Y:</span>
                    <input
                      type="range"
                      min={-8}
                      max={8}
                      step={0.2}
                      value={activeDecal.offsetYCm}
                      onChange={(e) => updateDecalLayer(activeDecal.id, { offsetYCm: parseFloat(e.target.value) })}
                      className="w-full accent-indigo-600 dark:accent-cyan-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Rotación */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold uppercase text-slate-400">Rotación:</span>
                  <span className="font-mono text-indigo-600 dark:text-cyan-400 font-bold">{activeDecal.rotationDeg}°</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={-180}
                    max={180}
                    step={1}
                    value={activeDecal.rotationDeg}
                    onChange={(e) => updateDecalLayer(activeDecal.id, { rotationDeg: parseInt(e.target.value) })}
                    className="flex-1 accent-indigo-600 dark:accent-cyan-400 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => updateDecalLayer(activeDecal.id, { rotationDeg: 0 })}
                    className="px-2 py-0.5 text-[10px] rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer"
                  >
                    0°
                  </button>
                </div>
              </div>

              {/* Acabado Textil de Impresión */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Técnica y Acabado Textil:</label>
                <select
                  value={activeDecal.finishStyle}
                  onChange={(e) => updateDecalLayer(activeDecal.id, { finishStyle: e.target.value as any })}
                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none cursor-pointer text-slate-900 dark:text-white"
                >
                  <option value="dtf_suave">DTF Textil Suave (Tacto elástico)</option>
                  <option value="plastisol_brillante">Serigrafía Plastisol Brillante</option>
                  <option value="base_agua_mate">Serigrafía Base Agua Mate / Discharge</option>
                  <option value="relieve_puff">Relieve Puff / Bordado 3D</option>
                  <option value="sublimado">Sublimación de Alta Definición</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
              No hay ningún estampado seleccionado. Haz clic en "SUBIR ARCHIVO" para colocar tu diseño en la prenda.
            </div>
          )}

          {/* COLORES POR PIEZA DE LA PRENDA */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Colores por Pieza ({currentMetadata.parts.length})
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const base = partColors.cuerpo || '#18181b';
                  const unified: Record<string, string> = {};
                  currentMetadata.parts.forEach((p) => {
                    unified[p.partId] = base;
                  });
                  setPartColors((prev) => ({ ...prev, ...unified }));
                  showToast('Color unificado aplicado a toda la prenda.', 'info');
                }}
                className="text-[10px] text-indigo-600 dark:text-cyan-400 font-bold hover:underline cursor-pointer"
              >
                Unificar Todo
              </button>
            </div>

            {/* Muestrario de partes */}
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {currentMetadata.parts.map((p) => {
                const col = partColors[p.partId] || p.defaultColor;
                return (
                  <button
                    key={p.partId}
                    type="button"
                    onClick={() => setActivePartForColor({ id: p.partId, name: p.partName })}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-indigo-500 flex items-center gap-2 cursor-pointer transition-all text-left"
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shrink-0 shadow-2xs"
                      style={{ backgroundColor: col }}
                    />
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold text-slate-900 dark:text-white block truncate">
                        {p.partName}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 block">
                        {col.toUpperCase()}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MATERIAL TEXTIL DE LA PRENDA */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Tejido Textil PBR
              </span>
            </div>
            <select
              value={selectedFinish}
              onChange={(e) => setSelectedFinish(e.target.value as TextileFinishType)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none cursor-pointer text-slate-900 dark:text-white font-semibold"
            >
              {Object.entries(TEXTILE_FINISH_PRESETS).map(([key, f]) => (
                <option key={key} value={key}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* AJUSTES DE PROBADOR VIRTUAL (CUANDO ESTÁ EN MODO AVATAR) */}
          {studioMode === 'probador_virtual' && (
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Avatar & Calce
                </span>
              </div>

              {/* Selector de Avatar */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Tipo de Maniquí:</label>
                <select
                  value={selectedAvatar}
                  onChange={(e) => setSelectedAvatar(e.target.value as HumanAvatarType)}
                  className="w-full px-2 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none cursor-pointer"
                >
                  {Object.values(AVATAR_DEFINITIONS).map((av) => (
                    <option key={av.id} value={av.id}>
                      {av.name} ({av.genderLabel})
                    </option>
                  ))}
                </select>
              </div>

              {/* Talla Visual */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Talla Visual:</label>
                <div className="grid grid-cols-5 gap-1">
                  {(['S', 'M', 'L', 'XL', 'XXL'] as VisualSize[]).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setFitting((prev) => ({ ...prev, size: sz }))}
                      className={`py-1 text-xs font-bold rounded-lg border cursor-pointer transition-all ${
                        fitting.size === sz
                          ? 'bg-indigo-600 text-white dark:bg-cyan-600 dark:text-white border-transparent'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Corte / Fit */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Holgura (Fit):</label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'slim', label: 'Slim' },
                    { id: 'regular', label: 'Regular' },
                    { id: 'oversize', label: 'Oversize' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFitting((prev) => ({ ...prev, fit: f.id as VisualFit }))}
                      className={`py-1 text-[11px] font-bold rounded-lg border cursor-pointer transition-all ${
                        fitting.fit === f.id
                          ? 'bg-indigo-600 text-white dark:bg-cyan-600 dark:text-white border-transparent'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL SELECTOR DE COLOR PARA PARTE ESPECÍFICA */}
      {activePartForColor && (
        <ColorPickerModal
          isOpen={true}
          currentColorHex={partColors[activePartForColor.id] || '#18181b'}
          title={`Color de ${activePartForColor.name}`}
          partName={activePartForColor.name}
          onSelectColor={(hex: string) => {
            setPartColors((prev) => ({ ...prev, [activePartForColor.id]: hex }));
          }}
          onClose={() => setActivePartForColor(null)}
        />
      )}

      {/* MODAL DE EXPORTACIÓN PROFESIONAL DE MOCKUPS */}
      <MockupExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        renderer={rendererRef.current}
        scene={sceneRef.current}
        camera={cameraRef.current}
        garmentName={currentMetadata.name}
        onShowToast={showToast}
      />
    </div>
  );
};
