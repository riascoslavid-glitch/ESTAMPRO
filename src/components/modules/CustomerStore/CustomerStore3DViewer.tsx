import * as THREE from 'three';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Garment3DModelType,
  buildGarment3D
} from '../../../services/three/garmentGeometries';
import { PrintPlacementZone } from '../../../types/store';
import { PRINT_PLACEMENTS } from '../../../services/store/clientStoreService';
import {
  RotateCcw,
  Camera,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Play,
  Pause,
  Box,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';

interface CustomerStore3DViewerProps {
  modelType: Garment3DModelType;
  colorHex: string;
  colorName: string;
  placement: PrintPlacementZone;
  uploadedDesignUrl?: string;
  catalogDesignUrl?: string;
  customText: string;
  textColor: string;
  textFont: string;
  textSize: number;
  textCurve: number;
  designScale: number;
  designRotation: number;
  designOffsetX: number;
  designOffsetY: number;
  onSnapshotTaken?: (dataUrl: string) => void;
  className?: string;
}

export const CustomerStore3DViewer: React.FC<CustomerStore3DViewerProps> = ({
  modelType,
  colorHex,
  colorName,
  placement,
  uploadedDesignUrl,
  catalogDesignUrl,
  customText,
  textColor,
  textFont,
  textSize,
  textCurve,
  designScale,
  designRotation,
  designOffsetX,
  designOffsetY,
  onSnapshotTaken,
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const garmentGroupRef = useRef<THREE.Group | null>(null);
  const decalMeshRef = useRef<THREE.Mesh | null>(null);
  const decalTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [activeViewPreset, setActiveViewPreset] = useState<'frente' | 'espalda' | 'izq' | 'der' | 'perspectiva'>('frente');
  const [isRenderReady, setIsRenderReady] = useState(false);

  // Initialize Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = null; // Transparent canvas
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 4.2);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1.35, 0);
    controls.maxDistance = 6.0;
    controls.minDistance = 1.5;
    controls.maxPolarAngle = Math.PI / 2 + 0.15; // Don't look from extreme bottom
    controls.minPolarAngle = 0.1;
    controlsRef.current = controls;

    // 5. Lighting Setup (Photographic Textile Studio)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(3, 4, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.9);
    fillLight.position.set(-3.5, 2.5, 2.5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xfef08a, 0.75);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // Soft Studio Ground Shadow plane
    const shadowGeo = new THREE.PlaneGeometry(6, 6);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.05;
    shadowMesh.receiveShadow = true;
    scene.add(shadowMesh);

    // 6. Animation loop
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      if (controlsRef.current) {
        if (isAutoRotating && garmentGroupRef.current) {
          garmentGroupRef.current.rotation.y += 0.006;
        }
        controlsRef.current.update();
      }
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();
    setIsRenderReady(true);

    // Handle Resize
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
        if (rendererRef.current.domElement.parentElement) {
          rendererRef.current.domElement.parentElement.removeChild(rendererRef.current.domElement);
        }
      }
    };
  }, []);

  // Update Garment 3D Model and Colors
  useEffect(() => {
    if (!sceneRef.current) return;

    // Remove old garment
    if (garmentGroupRef.current) {
      sceneRef.current.remove(garmentGroupRef.current);
      garmentGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material?.dispose();
          }
        }
      });
      garmentGroupRef.current = null;
    }

    // Build new garment
    const partColors: Record<string, string> = {
      cuerpo: colorHex,
      manga_izquierda: colorHex,
      manga_derecha: colorHex,
      cuello: colorHex,
      dobladillo: colorHex,
      capucha: colorHex,
      bolsillo: colorHex,
      pretina: colorHex,
      punos: colorHex,
      corona_frontal: colorHex,
      visera: colorHex,
      boton: colorHex
    };

    const finishType = modelType === 'hoodie' || modelType === 'buso_cuello_redondo' 
      ? 'french_terry' 
      : modelType === 'camiseta_deportiva' 
      ? 'dry_fit_mesh' 
      : modelType === 'polo' 
      ? 'pique' 
      : 'algodon_jersey';

    const newGarment = buildGarment3D(modelType, partColors, finishType);
    newGarment.position.set(0, 0, 0);
    newGarment.castShadow = true;
    newGarment.receiveShadow = true;
    sceneRef.current.add(newGarment);
    garmentGroupRef.current = newGarment;

    // Re-create decal mesh on the new garment
    createOrUpdateDecal();
  }, [modelType, colorHex]);

  // Update Decal Texture & Mesh placement
  const createOrUpdateDecal = useCallback(() => {
    if (!sceneRef.current || !garmentGroupRef.current) return;

    // Remove old decal
    if (decalMeshRef.current) {
      garmentGroupRef.current.remove(decalMeshRef.current);
      decalMeshRef.current.geometry?.dispose();
      if (decalMeshRef.current.material instanceof THREE.Material) {
        decalMeshRef.current.material.dispose();
      }
      decalMeshRef.current = null;
    }

    const activeArtUrl = uploadedDesignUrl || catalogDesignUrl;
    const hasText = customText && customText.trim().length > 0;

    if (!activeArtUrl && !hasText) {
      return; // Nothing to print
    }

    // Create high-res dynamic 2D canvas for the print composite
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const renderComposite = (img?: HTMLImageElement) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      const centerX = canvas.width / 2 + (designOffsetX * 4);
      const centerY = canvas.height / 2 + (designOffsetY * 4);

      ctx.translate(centerX, centerY);
      ctx.rotate((designRotation * Math.PI) / 180);
      ctx.scale(designScale, designScale);

      // Draw Artwork Image
      if (img) {
        const imgAspect = img.width / img.height;
        let drawW = 600;
        let drawH = 600 / imgAspect;
        if (drawH > 600) {
          drawH = 600;
          drawW = 600 * imgAspect;
        }
        ctx.drawImage(img, -drawW / 2, -drawH / 2 - (hasText ? 40 : 0), drawW, drawH);
      }

      // Draw Styled Text with Curvature Support
      if (hasText) {
        ctx.save();
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `bold ${textSize * 2.2}px ${textFont}`;
        ctx.shadowColor = 'rgba(0,0,0,0.45)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 4;

        const textY = img ? 260 : 0;

        if (textCurve !== 0) {
          // Curved / Arc Text Mathematics
          const radius = Math.max(160, 800 - Math.abs(textCurve) * 6);
          const characters = customText.split('');
          const totalAngle = (characters.length * (textSize * 1.5)) / radius;
          let currentAngle = -totalAngle / 2;

          characters.forEach((char) => {
            ctx.save();
            ctx.translate(0, textY + (textCurve > 0 ? radius : -radius));
            ctx.rotate(textCurve > 0 ? currentAngle : -currentAngle);
            ctx.fillText(char, 0, textCurve > 0 ? -radius : radius);
            ctx.restore();
            currentAngle += totalAngle / characters.length;
          });
        } else {
          // Straight text
          ctx.fillText(customText, 0, textY);
        }
        ctx.restore();
      }

      ctx.restore();

      // Create or update texture
      if (decalTextureRef.current) {
        decalTextureRef.current.dispose();
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
      decalTextureRef.current = texture;

      // Positioning based on placement zone
      const placementConfig = PRINT_PLACEMENTS[placement] || PRINT_PLACEMENTS.pecho_central;
      const basePos = placementConfig.defaultPosition3D;
      const baseRot = placementConfig.defaultRotation3D;

      // Adjust decal dimensions based on placement
      let planeW = 0.72;
      let planeH = 0.72;
      if (placement === 'pecho_izquierdo') {
        planeW = 0.32;
        planeH = 0.32;
      } else if (placement === 'espalda_completa') {
        planeW = 0.82;
        planeH = 0.95;
      } else if (placement === 'manga_izquierda' || placement === 'manga_derecha') {
        planeW = 0.28;
        planeH = 0.38;
      } else if (placement === 'nuca') {
        planeW = 0.24;
        planeH = 0.20;
      }

      const decalGeo = new THREE.PlaneGeometry(planeW, planeH);
      const decalMat = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        roughness: 0.7,
        metalness: 0.05,
        depthTest: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -3,
        side: THREE.FrontSide
      });

      const decalMesh = new THREE.Mesh(decalGeo, decalMat);
      decalMesh.position.set(basePos[0], basePos[1] + 0.95, basePos[2]);
      decalMesh.rotation.set(baseRot[0], baseRot[1], baseRot[2]);
      decalMesh.renderOrder = 10;

      if (garmentGroupRef.current) {
        garmentGroupRef.current.add(decalMesh);
        decalMeshRef.current = decalMesh;
      }
    };

    if (activeArtUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => renderComposite(img);
      img.onerror = () => renderComposite();
      img.src = activeArtUrl;
    } else {
      renderComposite();
    }
  }, [
    uploadedDesignUrl,
    catalogDesignUrl,
    customText,
    textColor,
    textFont,
    textSize,
    textCurve,
    designScale,
    designRotation,
    designOffsetX,
    designOffsetY,
    placement
  ]);

  useEffect(() => {
    createOrUpdateDecal();
  }, [createOrUpdateDecal]);

  // Camera Presets
  const setCameraPreset = (preset: 'frente' | 'espalda' | 'izq' | 'der' | 'perspectiva') => {
    if (!cameraRef.current || !controlsRef.current) return;
    setActiveViewPreset(preset);

    const target = new THREE.Vector3(0, 1.35, 0);
    controlsRef.current.target.copy(target);

    switch (preset) {
      case 'frente':
        cameraRef.current.position.set(0, 1.35, 4.0);
        break;
      case 'espalda':
        cameraRef.current.position.set(0, 1.35, -4.0);
        break;
      case 'izq':
        cameraRef.current.position.set(-3.8, 1.35, 0);
        break;
      case 'der':
        cameraRef.current.position.set(3.8, 1.35, 0);
        break;
      case 'perspectiva':
        cameraRef.current.position.set(2.4, 2.1, 3.2);
        break;
    }
    controlsRef.current.update();
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current || !controlsRef.current) return;
    const factor = direction === 'in' ? 0.8 : 1.25;
    const offset = cameraRef.current.position.clone().sub(controlsRef.current.target);
    offset.multiplyScalar(factor);
    cameraRef.current.position.copy(controlsRef.current.target).add(offset);
    controlsRef.current.update();
  };

  const takeSnapshot = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
    if (onSnapshotTaken) {
      onSnapshotTaken(dataUrl);
    } else {
      // Trigger instant download
      const link = document.createElement('a');
      link.download = `mockup-3d-${modelType}-${colorName.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className={`relative flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl ${className}`}>
      {/* 3D WebGL Canvas Container */}
      <div 
        ref={mountRef} 
        className="w-full h-full min-h-[460px] cursor-grab active:cursor-grabbing flex items-center justify-center relative touch-none"
      >
        {/* Floating Watermark & Badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 text-xs font-medium text-slate-300">
          <Box className="w-3.5 h-3.5 text-cyan-400" />
          <span>Visor 3D WebGL</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* View Angle Presets Pill */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-slate-950/80 backdrop-blur-md p-1 rounded-xl border border-slate-800 text-[11px]">
          <button
            type="button"
            onClick={() => setCameraPreset('frente')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              activeViewPreset === 'frente'
                ? 'bg-cyan-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Frente
          </button>
          <button
            type="button"
            onClick={() => setCameraPreset('espalda')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              activeViewPreset === 'espalda'
                ? 'bg-cyan-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Espalda
          </button>
          <button
            type="button"
            onClick={() => setCameraPreset('izq')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              activeViewPreset === 'izq'
                ? 'bg-cyan-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            L. Izq
          </button>
          <button
            type="button"
            onClick={() => setCameraPreset('der')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              activeViewPreset === 'der'
                ? 'bg-cyan-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            L. Der
          </button>
          <button
            type="button"
            onClick={() => setCameraPreset('perspectiva')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              activeViewPreset === 'perspectiva'
                ? 'bg-cyan-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Perspectiva
          </button>
        </div>

        {/* Floating Instruction */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 pointer-events-none z-10 text-[11px] text-slate-400/80 bg-slate-950/60 backdrop-blur-xs px-3 py-1 rounded-full border border-slate-800/60 hidden sm:block">
          Arrastra para rotar 360° • Pellizca o rueda para zoom
        </div>
      </div>

      {/* Bottom Utility Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950/90 border-t border-slate-800 z-10">
        <div className="flex items-center gap-2">
          {/* Auto Rotate Toggle */}
          <button
            type="button"
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isAutoRotating
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
            title="Giro continuo 360°"
          >
            {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>Giro 360°</span>
          </button>

          {/* Reset Camera */}
          <button
            type="button"
            onClick={() => setCameraPreset('frente')}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800 transition-colors"
            title="Reiniciar Cámara"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom & Snapshot */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleZoom('in')}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800 transition-colors"
            title="Acercar Zoom"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom('out')}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800 transition-colors"
            title="Alejar Zoom"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Capture Snapshot */}
          <button
            type="button"
            onClick={takeSnapshot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 text-white text-xs font-semibold hover:from-cyan-500 hover:to-indigo-500 shadow-md shadow-cyan-500/20 transition-all ml-1"
            title="Descargar Foto Mockup 3D en Alta Resolución"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Capturar Mockup</span>
          </button>
        </div>
      </div>
    </div>
  );
};
