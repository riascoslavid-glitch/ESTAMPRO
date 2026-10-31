import React, { useState } from 'react';
import { StoreProduct, CatalogDesign } from '../../../types/store';
import { GarmentSizesModal } from './GarmentSizesModal';
import { CustomerStore3DViewer } from './CustomerStore3DViewer';
import {
  Search,
  SlidersHorizontal,
  Shirt,
  Box,
  Palette,
  Sparkles,
  Ruler,
  ChevronRight,
  ArrowRight,
  Layers,
  Tag,
  Check,
  Eye,
  X
} from 'lucide-react';

interface CustomerCatalogViewProps {
  products: StoreProduct[];
  catalogDesigns: CatalogDesign[];
  onSelectProductForCustomizer: (product: StoreProduct) => void;
  onSelectDesignForCustomizer: (product: StoreProduct, design: CatalogDesign) => void;
}

export const CustomerCatalogView: React.FC<CustomerCatalogViewProps> = ({
  products,
  catalogDesigns,
  onSelectProductForCustomizer,
  onSelectDesignForCustomizer
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedProductForSizes, setSelectedProductForSizes] = useState<StoreProduct | null>(null);
  const [quick3DProduct, setQuick3DProduct] = useState<StoreProduct | null>(null);

  // Active published products
  const publishedProducts = products.filter((p) => p.isPublished);

  // Filtering
  const filteredProducts = publishedProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.composition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Hero Visual Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Estudio Textil Digital & Personalizador 360°</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Crea Prendas Únicas con Previsualización 3D Real
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Selecciona camisetas heavyweight, hoodies french terry o gorras retro. Cambia colores, sube tu arte a 300 DPI, agrega textos curvos y solicita cotizaciones mayoristas al instante.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onSelectProductForCustomizer(publishedProducts[0] || products[0])}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
            >
              <span>Personalizar Prenda en 3D</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Visual Mockup Thumbnail */}
        <div className="relative z-10 shrink-0 w-full md:w-72 h-48 rounded-2xl overflow-hidden border border-slate-700/60 shadow-xl group">
          <img
            src="/src/assets/images/hero_textile_studio_1793415151404.jpg"
            alt="Textile Studio"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
            <span className="text-[11px] font-semibold text-slate-200 flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-cyan-400" />
              Simulación WebGL en Vivo
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'todos', label: 'Todas las Prendas' },
            { id: 'camisetas', label: 'Camisetas (T-Shirts)' },
            { id: 'busos', label: 'Hoodies & Busos' },
            { id: 'accesorios', label: 'Gorras & Accesorios' }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por prenda, tela..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const minPriceTier = product.volumePricing[product.volumePricing.length - 1];

          return (
            <div
              key={product.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Product Photo with Quick 3D trigger */}
                <div className="relative h-60 bg-slate-100 dark:bg-slate-800/60 overflow-hidden">
                  <img
                    src={product.photoUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* 3D badge button */}
                  <button
                    type="button"
                    onClick={() => setQuick3DProduct(product)}
                    className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-xs font-semibold border border-slate-700/60 hover:bg-cyan-600 transition-colors shadow-md"
                    title="Ver modelo 3D interactivo"
                  >
                    <Box className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Ver 3D</span>
                  </button>

                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-cyan-300 border border-slate-700">
                      {product.weightGsm}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-300 border border-slate-700">
                      {product.defaultTechnique}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  {/* Colors swatches preview */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                      {product.availableColors.length} Colores Disponibles:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {product.availableColors.map((color) => (
                        <div
                          key={color.name}
                          title={color.name}
                          className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700 shadow-xs cursor-pointer hover:scale-110 transition-transform"
                          style={{ backgroundColor: color.hex }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Sizes badges */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Tallas:
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedProductForSizes(product)}
                        className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        <Ruler className="w-3 h-3" />
                        Ver medidas
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {product.availableSizes.map((size) => (
                        <span
                          key={size}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing and Volume tiers teaser */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Precio por menor:</span>
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        ${product.basePrice.toLocaleString('es-CL')}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-bold">
                        Mayorista desde:
                      </span>
                      <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                        ${minPriceTier ? minPriceTier.unitPrice.toLocaleString('es-CL') : product.basePrice.toLocaleString('es-CL')}
                      </span>
                      <span className="text-[10px] text-slate-400 block">/ u. (+100 pzas)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => onSelectProductForCustomizer(product)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-cyan-600 dark:hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md group-hover:bg-cyan-600 cursor-pointer"
                >
                  <Shirt className="w-4 h-4 text-cyan-400 group-hover:text-white transition-colors" />
                  <span>Personalizar en Simulador 3D</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Curated Catalog Designs Showcase */}
      <div className="mt-12 bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Diseños Listos para Estampar (Catálogo Oficial del Taller)
            </h3>
            <p className="text-xs text-slate-400">
              Artes vectoriales curados y optimizados a 300 DPI por nuestros diseñadores. Elige uno y pruébalo en cualquier prenda.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {catalogDesigns.map((design) => (
            <div
              key={design.id}
              className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden hover:border-cyan-500/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <img
                  src={design.previewUrl}
                  alt={design.title}
                  className="w-full h-28 object-cover group-hover:scale-105 transition-transform"
                />
                <div className="p-2.5">
                  <span className="text-[9px] uppercase font-bold text-cyan-400">
                    {design.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-100 truncate mt-0.5">
                    {design.title}
                  </h4>
                </div>
              </div>

              <div className="p-2 pt-0">
                <button
                  type="button"
                  onClick={() =>
                    onSelectDesignForCustomizer(publishedProducts[0] || products[0], design)
                  }
                  className="w-full py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-cyan-500 text-white text-[11px] font-bold transition-colors cursor-pointer text-center"
                >
                  Estampar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick 3D Modal */}
      {quick3DProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Box className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  Visor 3D Interactivo: {quick3DProduct.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setQuick3DProduct(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <CustomerStore3DViewer
              modelType={quick3DProduct.model3DType}
              colorHex={quick3DProduct.availableColors[0]?.hex || '#000000'}
              colorName={quick3DProduct.availableColors[0]?.name || 'Negro'}
              placement="pecho_central"
              customText="ESTAMPAPRO 360"
              textColor="#FFFFFF"
              textFont="Impact, sans-serif"
              textSize={28}
              textCurve={0}
              designScale={1.0}
              designRotation={0}
              designOffsetX={0}
              designOffsetY={0}
              className="h-[380px] w-full"
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                Gira en 360° para ver costuras y caída de tela.
              </span>
              <button
                type="button"
                onClick={() => {
                  const p = quick3DProduct;
                  setQuick3DProduct(null);
                  onSelectProductForCustomizer(p);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                <span>Abrir en el Personalizador Completo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Garment Sizes Modal */}
      {selectedProductForSizes && (
        <GarmentSizesModal
          isOpen={!!selectedProductForSizes}
          onClose={() => setSelectedProductForSizes(null)}
          product={selectedProductForSizes}
        />
      )}
    </div>
  );
};
