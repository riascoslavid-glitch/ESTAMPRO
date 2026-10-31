import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GarmentPartMeshDef } from './garmentGeometries';

/**
 * ESTAMPAPRO 360° - Importador de Modelos GLB y glTF
 * Carga modelos 3D externos creados en Blender, CLO3D, Marvelous Designer o Browzwear,
 * analiza su jerarquía de mallas, extrae partes coloreables y normaliza la escala de escena.
 */

export interface ImportedGLBResult {
  group: THREE.Group;
  parts: GarmentPartMeshDef[];
  originalColors: Record<string, string>;
  fileName: string;
}

export function loadGLBModelFromArrayBuffer(
  buffer: ArrayBuffer,
  fileName: string
): Promise<ImportedGLBResult> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();

    loader.parse(
      buffer,
      '',
      (gltf) => {
        const rootScene = gltf.scene || gltf.scenes[0];
        const group = new THREE.Group();
        group.name = `imported_${fileName.replace(/\.[^/.]+$/, '')}`;

        const parts: GarmentPartMeshDef[] = [];
        const originalColors: Record<string, string> = {};
        let partIndex = 1;

        // Recorrer y preparar mallas
        rootScene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // Asegurar que el material soporte modificación de color PBR
            if (mesh.material) {
              const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

              mats.forEach((mat) => {
                if ((mat as THREE.MeshStandardMaterial).isMeshStandardMaterial || (mat as THREE.Material).type) {
                  const stdMat = mat as THREE.MeshStandardMaterial;
                  const partId = `part_${mesh.name || partIndex}`;
                  const partName = mesh.name ? mesh.name.replace(/_/g, ' ') : `Pieza 3D #${partIndex}`;

                  let hexColor = '#cccccc';
                  if (stdMat.color) {
                    hexColor = `#${stdMat.color.getHexString()}`;
                  }

                  mesh.userData = {
                    partId,
                    partName,
                    isImportedPart: true
                  };

                  parts.push({
                    partId,
                    partName,
                    defaultColor: hexColor,
                    category: 'cuerpo'
                  });

                  originalColors[partId] = hexColor;
                  partIndex++;
                }
              });
            }
          }
        });

        // Calcular caja envolvente y normalizar escala a ~2.5 unidades de altura
        const box = new THREE.Box3().setFromObject(rootScene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const targetHeight = 2.4;
        const scale = size.y > 0 ? targetHeight / size.y : 1.0;
        rootScene.scale.setScalar(scale);

        // Centrar en X y Z, y asentar la base en Y = 0
        rootScene.position.x = -center.x * scale;
        rootScene.position.z = -center.z * scale;
        rootScene.position.y = -box.min.y * scale;

        group.add(rootScene);

        resolve({
          group,
          parts,
          originalColors,
          fileName
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
}
