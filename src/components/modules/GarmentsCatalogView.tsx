import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GarmentItem, GarmentMainCategory, GarmentSubcategory } from '../../types';
import { GARMENT_CATEGORIES_METADATA } from '../../constants/garmentsCatalog';
import { TEXTILE_MATERIALS } from '../../constants/materials';
import { GarmentDetailModal } from '../modals/GarmentDetailModal';
import { GarmentFormModal } from '../modals/GarmentFormModal';
import { ColorPickerModal } from '../common/ColorPickerModal';
import { 
  Shirt, 
  Plus, 
  Search, 
  Filter, 
  Box, 
  Layers, 
  Palette, 
  Copy, 
  Edit3, 
  Trash2, 
  Sliders, 
  Sparkles,
  Info,
  DollarSign
} from 'lucide-react';

export const GarmentsCatalogView: React.FC = () => {
  const {
    garments,
    selectedGarmentForDetail,
    setSelectedGarmentForDetail,
    isGarmentFormModalOpen,
    setIsGarmentFormModalOpen,
    garmentToEdit,
    setGarmentToEdit,
    duplicateGarment
  } = useApp();

  const [selectedMainCat, setSelectedMainCat] = useState<GarmentMainCategory | 'todas'>('todas');
  const [selectedSubcat, setSelectedSubcat] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCatalogTab, setActiveCatalogTab] = useState<'prendas' | 'materiales'>('prendas');
  const [isGlobalColorPaletteOpen, setIsGlobalColorPaletteOpen] = useState(false);

  // Filtered garments
  const filteredGarments = garments.filter((g) => {
    if (selectedMainCat !== 'todas' && g.mainCategory !== selectedMainCat) {
      return false;
    }
    if (selectedSubcat !== 'todas' && g.subcategory !== selectedSubcat) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = g.name.toLowerCase().includes(q);
      const matchMat = g.materialName.toLowerCase().includes(q);
      const matchComp = g.composition.toLowerCase().includes(q);
      if (!matchName && !matchMat && !matchComp) return false;
    }
    return true;
  });

  const activeMainCatMeta = GARMENT_CATEGORIES_METADATA.find((c) => c.id === selectedMainCat);

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-2 sm:py-4 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Módulo 6 · Taller & Técnica
            </span>
            <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Activo & Persistente
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            <Shirt className="w-6 h-6 text-indigo-600 dark:text-cyan-400" />
            <span>Catálogo Profesional de Prendas & Materiales</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Base de datos técnica de camisetas, busos, uniformes y accesorios textiles con tallas, composición y vinculación 3D.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsGlobalColorPaletteOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Palette className="w-4 h-4 text-cyan-500" />
            <span>Paleta de Color Textil</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setGarmentToEdit(null);
              setIsGarmentFormModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 dark:bg-cyan-600 dark:hover:bg-cyan-500 rounded-lg shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Crear Prenda</span>
          </button>
        </div>
      </div>

      {/* Main Mode Tabs: Prendas vs Materiales */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveCatalogTab('prendas')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeCatalogTab === 'prendas'
                ? 'bg-slate-900 text-white dark:bg-cyan-600'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Prendas Textiles ({garments.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveCatalogTab('materiales')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeCatalogTab === 'materiales'
                ? 'bg-slate-900 text-white dark:bg-cyan-600'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Catálogo de Fibras & Materiales ({TEXTILE_MATERIALS.length})
          </button>
        </div>

        {/* Live search input */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por prenda, tela o gramaje..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
      </div>

      {activeCatalogTab === 'prendas' && (
        <div className="space-y-5">
          {/* Main Category Bar (Section 1: Camisetas, Busos, Otras prendas, Accesorios) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => {
                setSelectedMainCat('todas');
                setSelectedSubcat('todas');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedMainCat === 'todas'
                  ? 'bg-indigo-600 dark:bg-cyan-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              Todas las Categorías
            </button>

            {GARMENT_CATEGORIES_METADATA.map((cat) => {
              const count = garments.filter((g) => g.mainCategory === cat.id).length;
              const isSelected = selectedMainCat === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedMainCat(cat.id);
                    setSelectedSubcat('todas');
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 dark:bg-cyan-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Subcategory secondary pills when a category is selected */}
          {activeMainCatMeta && (
            <div className="flex items-center gap-1.5 overflow-x-auto p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Subtipos:
              </span>
              <button
                type="button"
                onClick={() => setSelectedSubcat('todas')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedSubcat === 'todas'
                    ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-cyan-400'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Todos los subtipos
              </button>

              {activeMainCatMeta.subcategories.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSelectedSubcat(sub.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedSubcat === sub.id
                      ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-cyan-400 font-bold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}

          {/* Garments Grid */}
          {filteredGarments.length === 0 ? (
            <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <Shirt className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  No se encontraron prendas con los filtros seleccionados
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Prueba a limpiar la búsqueda o crea una nueva prenda personalizada.
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMainCat('todas');
                    setSelectedSubcat('todas');
                    setSearchQuery('');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:underline"
                >
                  Restablecer todos los filtros
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredGarments.map((garm) => (
                <div
                  key={garm.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between shadow-xs group"
                >
                  <div>
                    {/* Image Preview with Category badge and 3D badge */}
                    <div
                      onClick={() => setSelectedGarmentForDetail(garm)}
                      className="relative aspect-4/3 bg-slate-100 dark:bg-slate-850 overflow-hidden cursor-pointer"
                    >
                      <img
                        src={garm.photoUrl}
                        alt={garm.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-medium uppercase tracking-wider">
                        {garm.subcategory.replace('_', ' ')}
                      </div>
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-cyan-600/90 text-white text-[10px] font-mono flex items-center gap-1 shadow-sm">
                        <Box className="w-3 h-3" />
                        <span>3D Listo</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3
                          onClick={() => setSelectedGarmentForDetail(garm)}
                          className="text-sm font-bold text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer transition-colors"
                        >
                          {garm.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                          {garm.materialName} · {garm.weightGsm || garm.composition}
                        </p>
                      </div>

                      {/* Colors preview swatch strip */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          {garm.colors.slice(0, 5).map((col, idx) => (
                            <span
                              key={idx}
                              className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shadow-2xs"
                              style={{ backgroundColor: col.hex }}
                              title={col.name}
                            />
                          ))}
                          {garm.colors.length > 5 && (
                            <span className="text-[10px] text-slate-400 font-mono ml-0.5">
                              +{garm.colors.length - 5}
                            </span>
                          )}
                        </div>

                        {/* Cost Price */}
                        <div className="font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                          ${garm.basePurchasePrice.toFixed(2)} <span className="text-[10px] text-slate-400 font-normal">coste</span>
                        </div>
                      </div>

                      {/* Sizes badge strip */}
                      <div className="flex flex-wrap gap-1 text-[10px] font-mono text-slate-500">
                        {garm.sizes.slice(0, 5).map((s) => (
                          <span key={s} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-3 px-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedGarmentForDetail(garm)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:underline"
                    >
                      <Palette className="w-3.5 h-3.5" />
                      <span>Ficha & Colores</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => duplicateGarment(garm.id)}
                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded"
                        title="Duplicar prenda"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setGarmentToEdit(garm);
                          setIsGarmentFormModalOpen(true);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded"
                        title="Editar prenda"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Materials Encyclopedia View (Section 4: Catálogo de Materiales) */}
      {activeCatalogTab === 'materiales' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
            Guía técnica de fibras textiles para calibrar tiempos de termofijado, temperaturas de plancha y prevención de sangrado / migración de tinte.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEXTILE_MATERIALS.map((mat) => (
              <div
                key={mat.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {mat.name}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase">
                      {mat.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {mat.composition} · {mat.typicalWeightGsm}
                  </p>
                </div>

                {/* Thermal Specs */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Plancha Máx.</span>
                    <strong className="text-slate-900 dark:text-white font-mono">{mat.recommendedIronTempC} °C</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Tiempo Curado</span>
                    <strong className="text-slate-900 dark:text-white font-mono">{mat.pressTimeSeconds} seg</strong>
                  </div>
                </div>

                {/* Dye Migration Alert */}
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300">
                  <span className="font-bold block">Migración de Tinte: {mat.dyeMigrationRisk}</span>
                  <span className="text-slate-600 dark:text-slate-300 mt-0.5 block">{mat.technicalNotes}</span>
                </div>

                {/* Compatible techniques */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-400 text-[10px] block mb-1">Técnicas Aprobadas:</span>
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    {mat.compatibleTechniques.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <GarmentDetailModal
        garment={selectedGarmentForDetail}
        onClose={() => setSelectedGarmentForDetail(null)}
      />

      <GarmentFormModal
        isOpen={isGarmentFormModalOpen}
        onClose={() => setIsGarmentFormModalOpen(false)}
        garmentToEdit={garmentToEdit}
      />

      {/* Global color palette modal */}
      <ColorPickerModal
        isOpen={isGlobalColorPaletteOpen}
        onClose={() => setIsGlobalColorPaletteOpen(false)}
        currentColorHex="#0a0a0c"
        onSelectColor={() => {}}
        title="Explorador de Paletas & Modelos de Color (HEX / RGB / HSL / CMYK)"
      />
    </div>
  );
};
