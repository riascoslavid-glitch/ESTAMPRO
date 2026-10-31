/**
 * ESTAMPAPRO 360° - Servicio de Fichas Técnicas Personalizadas
 * Persistencia en Firestore (cuando hay sesión activa) y LocalStorage con exportación técnica.
 */

import { collection, doc, getDocs, setDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { CustomTechniqueSheet, DetailedTechniqueSheet } from '../types/techniques';

const LOCAL_STORAGE_KEY = 'estampapro_custom_technique_sheets';

const DEFAULT_SAMPLE_SHEETS: CustomTechniqueSheet[] = [
  {
    id: 'custom_dtf_french_terry_01',
    ownerId: 'default_system',
    title: 'Calibración DTF Hoodie French Terry 400g Taller Central',
    baseTechniqueId: 'dtf',
    baseTechniqueName: 'DTF (Direct-to-Film)',
    workshopName: 'EstampaPro Lab Principal',
    operatorName: 'Jefe de Producción Textil',
    equipmentBrandModel: 'Oric DTF 60cm Doble i3200 + Horno Shaker H650',
    heatPressModel: "STAHLS' Hotronix Fusion IQ 40x50",
    consumableBrand: 'Film KDX Double Matte 75u + Tintas DuPont Artistri + TPU Media 120u',
    substrateFabric: '80% Algodón / 20% Poliéster French Terry 400 GSM',
    tempCelsius: 152,
    timeSeconds: 14,
    pressureLevel: 'Media-Alta',
    pressureDetails: '4.5 Bares (Nivel 6 en escala Hotronix)',
    curingDetails: 'Horno túnel a 122°C durante 115 segundos hasta acabado piel de naranja.',
    coolingMethod: 'Disipador térmico de aluminio durante 20 segundos antes de pelar',
    peelingType: 'Pelado en Frío (Cold Peel: <28°C)',
    prePressSeconds: 5,
    postPressSeconds: 6,
    testedWashCycles: 55,
    technicalNotes: 'Obligatorio segundo prensado de 6s con papel siliconado mate para sellar el poro y eliminar brillo plástico. Para prendas negras, asegurar deshumificado previo de 5s.',
    sourceReference: 'Prueba de laboratorio interno EstampaPro #2026-F04',
    isFavorite: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'custom_serigrafia_discharge_02',
    ownerId: 'default_system',
    title: 'Fórmula Descarga (Discharge) Algodón Reactivo Negro',
    baseTechniqueId: 'estampado_descarga',
    baseTechniqueName: 'Estampado por Descarga (Discharge Printing)',
    workshopName: 'Taller Serigrafía Industrial',
    operatorName: 'Maestro Tintorero',
    equipmentBrandModel: 'Pulpo Serigráfico Automático ROQ NEXT + Túnel de Aire Forzado M&R',
    heatPressModel: 'Túnel de Convección M&R Gas',
    consumableBrand: 'MagnaPrint Discharge ULF White & Bases + Activator 6%',
    substrateFabric: '100% Algodón peinado reactivo 200 GSM',
    tempCelsius: 165,
    timeSeconds: 100,
    pressureLevel: 'Alta',
    pressureDetails: '5.0 Bares en racleta Shore 65/90/65 triple dureza',
    curingDetails: 'Túnel a 165°C por 100s con extracción máxima de vapores activada.',
    coolingMethod: 'Enfriamiento al aire inmediato al salir del túnel',
    peelingType: 'No aplica (Impresión directa o bordado)',
    prePressSeconds: 0,
    postPressSeconds: 0,
    testedWashCycles: 80,
    technicalNotes: 'Mezclar el 6% de activador en polvo justo antes de comenzar la tirada. Vida útil de la mezcla: 6 horas. La prenda debe lavarse una vez antes de su venta.',
    sourceReference: 'Ficha técnica MagnaColours ULF Discharge Calibrada',
    isFavorite: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const getCustomTechniqueSheets = async (userId?: string): Promise<CustomTechniqueSheet[]> => {
  // Try to load from Firestore if user is authenticated
  if (auth.currentUser || userId) {
    try {
      const targetUid = auth.currentUser?.uid || userId;
      const q = query(
        collection(db, 'customTechniqueSheets'),
        where('ownerId', 'in', [targetUid, 'default_system'])
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const firestoreList: CustomTechniqueSheet[] = [];
        snapshot.forEach((d) => {
          firestoreList.push({ id: d.id, ...d.data() } as CustomTechniqueSheet);
        });
        // Also sync to local storage for offline resilience
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(firestoreList));
        return firestoreList;
      }
    } catch (err) {
      console.warn('Firestore fetch failed, falling back to localStorage:', err);
    }
  }

  // Fallback to LocalStorage
  const local = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error('Error parsing custom sheets from localStorage', e);
    }
  }

  // Seed default sample sheets if none exist
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_SAMPLE_SHEETS));
  return DEFAULT_SAMPLE_SHEETS;
};

export const saveCustomTechniqueSheet = async (
  sheetData: Omit<CustomTechniqueSheet, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
): Promise<CustomTechniqueSheet> => {
  const currentUid = auth.currentUser?.uid || 'local_operator';
  const now = new Date().toISOString();
  const id = sheetData.id || `custom_sheet_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const finalSheet: CustomTechniqueSheet = {
    ...sheetData,
    id,
    ownerId: sheetData.ownerId || currentUid,
    createdAt: sheetData.id ? (sheetData as CustomTechniqueSheet).createdAt || now : now,
    updatedAt: now
  };

  // 1. Save to LocalStorage immediately
  const local = localStorage.getItem(LOCAL_STORAGE_KEY);
  let list: CustomTechniqueSheet[] = local ? JSON.parse(local) : [];
  const existingIdx = list.findIndex((s) => s.id === id);
  if (existingIdx >= 0) {
    list[existingIdx] = finalSheet;
  } else {
    list.unshift(finalSheet);
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));

  // 2. Save to Firestore if signed in
  if (auth.currentUser) {
    try {
      const docRef = doc(db, 'customTechniqueSheets', id);
      await setDoc(docRef, finalSheet, { merge: true });
    } catch (err) {
      console.warn('Could not sync custom sheet to Firestore:', err);
    }
  }

  return finalSheet;
};

export const deleteCustomTechniqueSheet = async (sheetId: string): Promise<void> => {
  // Remove from localStorage
  const local = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (local) {
    try {
      const list: CustomTechniqueSheet[] = JSON.parse(local);
      const filtered = list.filter((s) => s.id !== sheetId);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error(e);
    }
  }

  // Remove from Firestore if signed in
  if (auth.currentUser) {
    try {
      await deleteDoc(doc(db, 'customTechniqueSheets', sheetId));
    } catch (err) {
      console.warn('Could not delete custom sheet from Firestore:', err);
    }
  }
};

/**
 * Descarga una ficha técnica como archivo JSON para respaldar o compartir con otro taller
 */
export const exportSheetAsJson = (sheet: CustomTechniqueSheet | DetailedTechniqueSheet): void => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sheet, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const title = 'title' in sheet ? sheet.title : sheet.name;
  downloadAnchor.setAttribute('download', `Ficha_Tecnica_${title.replace(/\s+/g, '_')}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

export function isCustomSheet(sheet: CustomTechniqueSheet | DetailedTechniqueSheet): sheet is CustomTechniqueSheet {
  return 'baseTechniqueId' in sheet;
}

/**
 * Abre ventana de impresión profesional para ficha de taller (Hoja de Operación en Prensa)
 */
export const openPrintableTechnicalSheet = (sheet: CustomTechniqueSheet | DetailedTechniqueSheet): void => {
  const isCustom = isCustomSheet(sheet);
  const title = isCustom ? sheet.title : sheet.name;
  const techName = isCustom ? sheet.baseTechniqueName : sheet.name;
  const temp = isCustom
    ? `${sheet.tempCelsius}°C (${Math.round((sheet.tempCelsius * 9) / 5 + 32)}°F)`
    : `${sheet.defaultParameters.tempCelsiusMin}°C - ${sheet.defaultParameters.tempCelsiusMax}°C`;
  const time = isCustom
    ? `${sheet.timeSeconds} seg`
    : `${sheet.defaultParameters.timeSecondsMin} - ${sheet.defaultParameters.timeSecondsMax} seg`;
  const press = isCustom
    ? `${sheet.pressureLevel} ${sheet.pressureDetails ? `(${sheet.pressureDetails})` : ''}`
    : `${sheet.defaultParameters.pressureLevel} (${sheet.defaultParameters.pressureBars || ''})`;
  const machine = isCustom
    ? sheet.equipmentBrandModel
    : sheet.machines.map((m: any) => `${m.type}: ${m.recommendedBrandsModels.join(', ')}`).join('<br/>');
  const pressModel = isCustom ? sheet.heatPressModel : sheet.defaultParameters.machineModelReference;
  const consumable = isCustom ? sheet.consumableBrand : sheet.defaultParameters.consumableReference;
  const peeling = isCustom ? sheet.peelingType : sheet.defaultParameters.peeling;
  const cooling = isCustom ? sheet.coolingMethod : sheet.defaultParameters.cooling;
  const prePress = isCustom ? `${sheet.prePressSeconds} seg` : '4 - 6 seg para deshumificar';
  const postPress = isCustom ? `${sheet.postPressSeconds} seg` : '5 - 8 seg de sellado con papel protector';
  const notes = isCustom ? sheet.technicalNotes : sheet.fullDesc;
  const verified = isCustom
    ? (sheet.sourceReference || 'Calibración interna de taller')
    : `${sheet.defaultParameters.verifiedSource} (Verificado: ${sheet.defaultParameters.lastVerifiedDate})`;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <title>ESTAMPAPRO 360° | Ficha Técnica de Taller - ${title}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 24px; color: #0f172a; line-height: 1.4; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 18px; }
        .badge { background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
        h1 { margin: 4px 0; font-size: 20px; font-weight: 800; }
        .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 18px; }
        .card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; background: #f8fafc; }
        .card-label { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 600; display: block; }
        .card-value { font-size: 15px; font-weight: bold; color: #0f172a; margin-top: 2px; }
        .section-title { font-size: 12px; text-transform: uppercase; font-weight: bold; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin: 14px 0 8px; color: #334155; }
        .details-table { width: 100%; border-collapse: collapse; font-size: 12px; }
        .details-table td { padding: 6px 8px; border-bottom: 1px solid #f1f5f9; }
        .details-table td:first-child { font-weight: 600; color: #475569; width: 30%; }
        .notes-box { background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 12px; font-size: 12px; color: #92400e; margin-top: 14px; }
        .footer { margin-top: 30px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 8px; }
        @media print {
          body { margin: 12px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <span class="badge">ESTAMPAPRO 360° · Hoja de Operación en Taller</span>
          <h1>${title}</h1>
          <p style="margin: 2px 0; font-size: 12px; color: #475569;">Técnica base: <strong>${techName}</strong></p>
        </div>
        <div style="text-align: right; font-size: 11px; color: #64748b;">
          <div>Fecha: ${new Date().toLocaleDateString('es-ES')}</div>
          <div>Calibración industrial verificada</div>
        </div>
      </div>

      <div class="grid">
        <div class="card">
          <span class="card-label">Temperatura Prensa</span>
          <div class="card-value">${temp}</div>
        </div>
        <div class="card">
          <span class="card-label">Tiempo de Prensado</span>
          <div class="card-value">${time}</div>
        </div>
        <div class="card">
          <span class="card-label">Presión Requerida</span>
          <div class="card-value">${press}</div>
        </div>
        <div class="card">
          <span class="card-label">Tipo de Pelado</span>
          <div class="card-value" style="font-size: 12px;">${peeling}</div>
        </div>
      </div>

      <div class="section-title">Parámetros Operativos del Puesto de Planchado</div>
      <table class="details-table">
        <tr>
          <td>Pre-Prensado (Deshumificado)</td>
          <td>${prePress}</td>
        </tr>
        <tr>
          <td>Post-Prensado (Sellado Térmico)</td>
          <td>${postPress}</td>
        </tr>
        <tr>
          <td>Método de Enfriamiento</td>
          <td>${cooling}</td>
        </tr>
        <tr>
          <td>Prensa / Equipo Calefactor</td>
          <td>${pressModel}</td>
        </tr>
        <tr>
          <td>Maquinaria Implicada</td>
          <td>${machine}</td>
        </tr>
        <tr>
          <td>Consumibles y Materiales</td>
          <td>${consumable}</td>
        </tr>
        <tr>
          <td>Fuente y Fecha de Verificación</td>
          <td>${verified}</td>
        </tr>
      </table>

      <div class="section-title">Instrucciones Críticas y Notas Técnicas de Taller</div>
      <div class="notes-box">
        ${notes}
      </div>

      <div class="footer">
        <span>ESTAMPAPRO 360° · Centro Técnico Textil</span>
        <span>Colocar esta ficha visible en el puesto de trabajo del operario de prensa térmica</span>
      </div>

      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
};
