import { StoredFile, FileCategoryFolder, StoredFileDimensions } from '../types';

export const ALLOWED_TEXTILE_EXTENSIONS = [
  '.ai',
  '.psd',
  '.svg',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.pdf',
  '.dst', // Tajima bordado
  '.emb', // Wilcom bordado
  '.pes', // Brother bordado
  '.eps',
  '.tiff',
  '.tif'
];

export const FOLDER_LABELS: Record<FileCategoryFolder, string> = {
  artes_vectoriales: 'Artes Vectoriales & Curvas (.AI, .SVG, .EPS)',
  fotolitos_rip: 'Fotolitos & Separaciones RIP (.PDF, .TIFF)',
  mockups_3d: 'Renders & Mockups 3D (.PNG, .JPG)',
  fichas_tecnicas: 'Fichas Técnicas & Curado (.PDF)',
  pedidos_clientes: 'Artes Recibidos de Clientes',
  documentos: 'Documentos & Presupuestos',
  disenos_recientes: 'Diseños Recientes de Taller',
  imagenes: 'Imágenes & Fotografías Base'
};

export class StorageService {
  /**
   * Valida un archivo contra los formatos textiles permitidos y el tamaño límite en MB.
   */
  static validateFile(file: File, maxSizeMb: number, allowedExtensions = ALLOWED_TEXTILE_EXTENSIONS): { valid: boolean; error?: string } {
    const fileName = file.name.toLowerCase();
    const extMatch = fileName.match(/\.[0-9a-z]+$/i);
    const ext = extMatch ? extMatch[0] : '';

    if (!allowedExtensions.includes(ext)) {
      return {
        valid: false,
        error: `Formato de archivo "${ext || 'desconocido'}" no permitido. Formatos textiles aceptados: ${allowedExtensions.join(', ')}`
      };
    }

    const maxSizeBytes = maxSizeMb * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        error: `El archivo supera el límite de ${maxSizeMb} MB (${(file.size / (1024 * 1024)).toFixed(1)} MB cargados).`
      };
    }

    return { valid: true };
  }

  /**
   * Convierte un File a Data URI para almacenamiento y previsualización segura
   */
  static readFileAsDataUri(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  /**
   * Extrae dimensiones físicas y en píxeles de un archivo de imagen o SVG
   */
  static extractDimensions(dataUri: string, extension: string): Promise<StoredFileDimensions> {
    return new Promise((resolve) => {
      const ext = extension.toLowerCase();

      // Para imágenes estándar raster
      if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext) || dataUri.startsWith('data:image')) {
        const img = new Image();
        img.onload = () => {
          const widthPx = img.naturalWidth || img.width;
          const heightPx = img.naturalHeight || img.height;
          // Calibrado a 300 DPI estándar de la industria textil
          const dpi = 300;
          const widthCm = Number(((widthPx / dpi) * 2.54).toFixed(1));
          const heightCm = Number(((heightPx / dpi) * 2.54).toFixed(1));

          resolve({
            widthPx,
            heightPx,
            widthCm,
            heightCm,
            dpi
          });
        };
        img.onerror = () => {
          resolve({ dpi: 300 });
        };
        img.src = dataUri;
        return;
      }

      // Para archivos SVG
      if (ext === '.svg' && dataUri.startsWith('data:image/svg+xml')) {
        try {
          const base64Content = dataUri.split(',')[1];
          const svgText = atob(base64Content);
          const parser = new DOMParser();
          const doc = parser.parseFromString(svgText, 'image/svg+xml');
          const svgEl = doc.querySelector('svg');
          if (svgEl) {
            const viewBox = svgEl.getAttribute('viewBox');
            if (viewBox) {
              const parts = viewBox.split(/[\s,]+/).map(Number);
              if (parts.length >= 4) {
                const widthPx = parts[2];
                const heightPx = parts[3];
                const widthCm = Number(((widthPx / 300) * 2.54).toFixed(1));
                const heightCm = Number(((heightPx / 300) * 2.54).toFixed(1));
                resolve({ widthPx, heightPx, widthCm, heightCm, dpi: 300 });
                return;
              }
            }
          }
        } catch (e) {
          console.warn('Error parsing SVG dimensions', e);
        }
      }

      // Fallback
      resolve({
        dpi: 300
      });
    });
  }

  /**
   * Descarga un archivo al dispositivo del usuario
   */
  static downloadStoredFile(file: StoredFile) {
    if (file.dataUri) {
      const link = document.createElement('a');
      link.href = file.dataUri;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (file.url) {
      window.open(file.url, '_blank');
    } else {
      // Fallback synthetic download
      const blob = new Blob([`Contenido del archivo textil: ${file.name}\nCarpeta: ${file.folder}\nFecha: ${file.createdAt}`], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }

  /**
   * Descarga múltiple secuencial
   */
  static downloadMultipleFiles(files: StoredFile[]) {
    files.forEach((file, index) => {
      setTimeout(() => {
        StorageService.downloadStoredFile(file);
      }, index * 200);
    });
  }

  /**
   * Determina la calidad textil según la resolución en DPI
   */
  static getDpiQuality(dpi?: number, widthPx?: number): { quality: 'alta' | 'media' | 'baja'; label: string; color: string } {
    if (!dpi && !widthPx) {
      return { quality: 'media', label: 'Resolución estándar (300 DPI)', color: 'text-cyan-500' };
    }

    const effectiveDpi = dpi || 300;
    if (effectiveDpi >= 300 || (widthPx && widthPx >= 2400)) {
      return { quality: 'alta', label: `${effectiveDpi} DPI · Óptimo para serigrafía/DTF`, color: 'text-emerald-500' };
    }
    if (effectiveDpi >= 150 || (widthPx && widthPx >= 1200)) {
      return { quality: 'media', label: `${effectiveDpi} DPI · Aceptable para prendas medianas`, color: 'text-amber-500' };
    }
    return { quality: 'baja', label: `${effectiveDpi} DPI · Calidad baja (pixelado en estampado)`, color: 'text-rose-500' };
  }
}

