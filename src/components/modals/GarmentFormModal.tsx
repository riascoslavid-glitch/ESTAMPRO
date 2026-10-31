import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { GarmentItem, GarmentMainCategory, GarmentSubcategory } from '../../types';
import { GARMENT_CATEGORIES_METADATA } from '../../constants/garmentsCatalog';
import { TEXTILE_MATERIALS } from '../../constants/materials';
import { PRINTING_TECHNIQUES } from '../../constants/techniques';
import { StorageService } from '../../services/storageService';
import { 
  X, 
  Save, 
  Plus, 
  Trash2, 
  Shirt, 
  Upload, 
  DollarSign, 
  Box, 
  Palette, 
  Check, 
  AlertCircle 
} from 'lucide-react';

interface GarmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  garmentToEdit: GarmentItem | null;
}

const AVAILABLE_SIZES_OPTIONS = [
  'Bebé 3M', 'Bebé 6M', 'Bebé 12M', 'Bebé 24M',
  'Infantil 2', 'Infantil 4', 'Infantil 6', 'Infantil 8', 'Infantil 10', 'Infantil 12', 'Infantil 14',
  'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL',
  'Única (Ajustable)'
];

const PRESET_PRINT_AREAS = [
  'Pecho Central (30x40 cm)',
  'Pecho Izquierdo Escudo (10x10 cm)',
  'Espalda Completa (35x45 cm)',
  'Espalda Superior (25x10 cm)',
  'Manga Izquierda (8x25 cm)',
  'Manga Derecha (8x25 cm)',
  'Capucha Lateral (12x12 cm)',
  'Bolsillo Canguro (20x15 cm)',
  'Frente Central Gorra (12x6.5 cm)',
  'Lateral Gorra (6x4 cm)'
];

export const GarmentFormModal: React.FC<GarmentFormModalProps> = ({
  isOpen,
  onClose,
  garmentToEdit
}) => {
  const { createGarment, updateGarment } = useApp();

  const [name, setName] = useState('');
  const [mainCategory, setMainCategory] = useState<GarmentMainCategory>('camisetas');
  const [subcategory, setSubcategory] = useState<GarmentSubcategory>('cuello_redondo');
  const [photoUrl, setPhotoUrl] = useState('');
  const [model3DName, setModel3DName] = useState('Modelo 3D Estándar (.GLB)');
  const [materialId, setMaterialId] = useState(TEXTILE_MATERIALS[0].id);
  const [composition, setComposition] = useState(TEXTILE_MATERIALS[0].composition);
  const [weightGsm, setWeightGsm] = useState('200 GSM');
  const [basePurchasePrice, setBasePurchasePrice] = useState<number>(5.50);
  const [notes, setNotes] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [selectedColors, setSelectedColors] = useState<{ name: string; hex: string }[]>([
    { name: 'Negro', hex: '#0a0a0c' },
    { name: 'Blanco', hex: '#ffffff' }
  ]);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#27272a');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([
    'Pecho Central (30x40 cm)',
    'Espalda Completa (35x45 cm)'
  ]);
  const [compatibleTechniques, setCompatibleTechniques] = useState<string[]>([
    'DTF', 'Serigrafía Plastisol'
  ]);
  const [customizableParts, setCustomizableParts] = useState<{ partId: string; partName: string; colorHex: string }[]>([
    { partId: 'cuerpo', partName: 'Cuerpo / Torso', colorHex: '#0a0a0c' },
    { partId: 'mangas', partName: 'Mangas', colorHex: '#0a0a0c' }
  ]);

  useEffect(() => {
    if (garmentToEdit) {
      setName(garmentToEdit.name);
      setMainCategory(garmentToEdit.mainCategory);
      setSubcategory(garmentToEdit.subcategory);
      setPhotoUrl(garmentToEdit.photoUrl);
      setModel3DName(garmentToEdit.model3DName || 'Modelo 3D (.GLB)');
      setMaterialId(garmentToEdit.materialId);
      setComposition(garmentToEdit.composition);
      setWeightGsm(garmentToEdit.weightGsm || '');
      setBasePurchasePrice(garmentToEdit.basePurchasePrice || 5.00);
      setNotes(garmentToEdit.notes || '');
      setSelectedSizes(garmentToEdit.sizes || ['S', 'M', 'L']);
      setSelectedColors(garmentToEdit.colors || [{ name: 'Negro', hex: '#0a0a0c' }]);
      setSelectedAreas(garmentToEdit.printableAreas || []);
      setCompatibleTechniques(garmentToEdit.compatibleTechniques || ['DTF']);
      setCustomizableParts(garmentToEdit.customizableParts || [
        { partId: 'cuerpo', partName: 'Cuerpo Principal', colorHex: '#0a0a0c' }
      ]);
    } else {
      setName('');
      setPhotoUrl('/src/assets/images/garment_tshirt_heavyweight_1793416398987.jpg');
    }
  }, [garmentToEdit, isOpen]);

  if (!isOpen) return null;

  const currentCategoryMeta =
    GARMENT_CATEGORIES_METADATA.find((c) => c.id === mainCategory) ||
    GARMENT_CATEGORIES_METADATA[0];

  const handleMaterialChange = (matId: string) => {
    setMaterialId(matId);
    const found = TEXTILE_MATERIALS.find((m) => m.id === matId);
    if (found) {
      setComposition(found.composition);
      setWeightGsm(found.typicalWeightGsm);
    }
  };

  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    setSelectedColors([...selectedColors, { name: newColorName.trim(), hex: newColorHex }]);
    setNewColorName('');
  };

  const handleRemoveColor = (index: number) => {
    setSelectedColors(selectedColors.filter((_, idx) => idx !== index));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const dataUri = await StorageService.readFileAsDataUri(files[0]);
      setPhotoUrl(dataUri);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const selectedMat = TEXTILE_MATERIALS.find((m) => m.id === materialId);

    const garmentPayload = {
      name: name.trim(),
      mainCategory,
      subcategory,
      photoUrl: photoUrl || '/src/assets/images/garment_tshirt_heavyweight_1793416398987.jpg',
      model3DId: `model_${mainCategory}_${subcategory}`,
      model3DName,
      materialId,
      materialName: selectedMat?.name || 'Material Textil',
      composition,
      weightGsm,
      sizes: selectedSizes,
      colors: selectedColors,
      printableAreas: selectedAreas,
      measurements: [
        { size: 'M', chestCm: 55, lengthCm: 72 }
      ],
      compatibleTechniques,
      basePurchasePrice: Number(basePurchasePrice) || 0,
      customizableParts,
      notes: notes.trim()
    };

    if (garmentToEdit) {
      updateGarment(garmentToEdit.id, garmentPayload);
    } else {
      createGarment(garmentPayload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Shirt className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {garmentToEdit ? 'Editar Prenda del Catálogo' : 'Crear Nueva Prenda en el Catálogo'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Nombre de la Prenda *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Camiseta Cuello V Algodón Ring-Spun"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Precio Base de Coste / Blank ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={basePurchasePrice}
                onChange={(e) => setBasePurchasePrice(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono tabular-nums rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Categorías (Section 1: Categorías y Subcategorías) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Categoría Principal
              </label>
              <select
                value={mainCategory}
                onChange={(e) => {
                  const newMain = e.target.value as GarmentMainCategory;
                  setMainCategory(newMain);
                  const meta = GARMENT_CATEGORIES_METADATA.find((c) => c.id === newMain);
                  if (meta && meta.subcategories.length > 0) {
                    setSubcategory(meta.subcategories[0].id);
                  }
                }}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {GARMENT_CATEGORIES_METADATA.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Tipo / Subcategoría
              </label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value as GarmentSubcategory)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {currentCategoryMeta.subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Material y Composición (Section 4: Materiales) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1 sm:col-span-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Material Base
              </label>
              <select
                value={materialId}
                onChange={(e) => handleMaterialChange(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {TEXTILE_MATERIALS.map((mat) => (
                  <option key={mat.id} value={mat.id}>
                    {mat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1 sm:col-span-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Composición Textil
              </label>
              <input
                type="text"
                value={composition}
                onChange={(e) => setComposition(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1 sm:col-span-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Peso / Gramaje (GSM)
              </label>
              <input
                type="text"
                placeholder="Ej. 240 GSM"
                value={weightGsm}
                onChange={(e) => setWeightGsm(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Modelo 3D Conexión (Section 2 & 5: Modelo 3D asociado) */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <Box className="w-4 h-4 text-cyan-500" />
              <span>Conexión de Modelo 3D Asociado (Para el Motor 3D Three.js)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-slate-500 block">Archivo / Identificador 3D (.GLB)</span>
                <input
                  type="text"
                  value={model3DName}
                  onChange={(e) => setModel3DName(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                />
              </div>
              <div className="flex items-center text-[11px] text-slate-500 dark:text-slate-400">
                Quedará enlazado al motor WebGL orbital 360° con mapeo UV en la siguiente etapa.
              </div>
            </div>
          </div>

          {/* Fotografía de la Prenda */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Fotografía del Producto
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl border border-slate-300 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center">
                {photoUrl ? (
                  <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Shirt className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Subir Imagen desde el Dispositivo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
                <input
                  type="text"
                  placeholder="O ingresa la URL de la imagen..."
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Tallas (Section 5: Agregar tallas) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Tallas Disponibles
            </label>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_SIZES_OPTIONS.map((sz) => {
                const isSelected = selectedSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedSizes(selectedSizes.filter((s) => s !== sz));
                      } else {
                        setSelectedSizes([...selectedSizes, sz]);
                      }
                    }}
                    className={`px-2.5 py-1 text-xs rounded-lg border font-mono transition-colors ${
                      isSelected
                        ? 'border-indigo-600 dark:border-cyan-400 bg-indigo-50 dark:bg-cyan-950/40 text-indigo-700 dark:text-cyan-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colores (Section 3 & 5: Colores y paleta de la prenda) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Colores de Tela Disponibles
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {selectedColors.map((col, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span className="font-medium text-slate-800 dark:text-slate-200">{col.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(idx)}
                    className="text-slate-400 hover:text-rose-500 ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick add color row */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 dark:border-slate-700"
              />
              <input
                type="text"
                placeholder="Nombre del nuevo color (ej. Verde Botella)"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Color</span>
              </button>
            </div>
          </div>

          {/* Áreas estampables */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Áreas Estampables Reglamentarias
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_PRINT_AREAS.map((area) => {
                const isSelected = selectedAreas.includes(area);
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedAreas(selectedAreas.filter((a) => a !== area));
                      } else {
                        setSelectedAreas([...selectedAreas, area]);
                      }
                    }}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                      isSelected
                        ? 'border-indigo-600 dark:border-cyan-400 bg-indigo-50 dark:bg-cyan-950/40 text-indigo-700 dark:text-cyan-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {area}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Técnicas compatibles */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Técnicas de Estampado Compatibles
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRINTING_TECHNIQUES.map((tech) => {
                const isSelected = compatibleTechniques.includes(tech.name);
                return (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setCompatibleTechniques(compatibleTechniques.filter((t) => t !== tech.name));
                      } else {
                        setCompatibleTechniques([...compatibleTechniques, tech.name]);
                      }
                    }}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                      isSelected
                        ? 'border-indigo-600 dark:border-cyan-400 bg-indigo-50 dark:bg-cyan-950/40 text-indigo-700 dark:text-cyan-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {tech.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Observaciones de taller */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Observaciones Técnicas de Confección
            </label>
            <textarea
              rows={2}
              placeholder="Instrucciones sobre acabados, costuras dobles, presillas o tipo de teñido..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
            />
          </div>

          {/* Submit & Cancel */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 dark:bg-cyan-600 dark:hover:bg-cyan-500 rounded-lg shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{garmentToEdit ? 'Guardar Cambios' : 'Crear Prenda'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
