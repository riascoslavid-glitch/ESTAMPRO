import React, { useState, useEffect, useRef } from 'react';
import {
  StoreProduct,
  CatalogDesign,
  ClientCustomization,
  PrintPlacementZone
} from '../../../types/store';
import {
  PRINT_PLACEMENTS,
  clientStoreService
} from '../../../services/store/clientStoreService';
import { CustomerStore3DViewer } from './CustomerStore3DViewer';
import { CustomerOrderModal } from './CustomerOrderModal';
import { GarmentSizesModal } from './GarmentSizesModal';
import { useApp } from '../../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';
import {
  Shirt,
  Palette,
  Upload,
  Type,
  Maximize2,
  RotateCw,
  Sliders,
  Sparkles,
  ShoppingBag,
  FileText,
  Search,
  Save,
  Plus,
  Minus,
  Check,
  Ruler,
  Layers,
  Wand2,
  Trash2,
  Eye,
  Info,
  Tag,
  ArrowRight
} from 'lucide-react';

interface CustomerCustomizerViewProps {
  products: StoreProduct[];
  catalogDesigns: CatalogDesign[];
  initialProduct?: StoreProduct;
  initialCustomization?: ClientCustomization | null;
  onCustomizationSaved?: () => void;
  onGoToMyOrders?: () => void;
}

const FONT_OPTIONS = [
  { id: 'Impact, sans-serif', name: 'Impact / Streetwear' },
  { id: "'Plus Jakarta Sans', sans-serif", name: 'Modern Sans' },
  { id: 'Georgia, serif', name: 'Classic Serif' },
  { id: "'JetBrains Mono', monospace", name: 'Tech Monospace' },
  { id: 'cursive', name: 'Handwritten Script' },
  { id: 'Arial Black, sans-serif', name: 'Athletic Block' }
];

const TEXT_COLOR_PALETTE = [
  { name: 'Blanco', hex: '#FFFFFF' },
  { name: 'Negro', hex: '#000000' },
  { name: 'Rojo Pasión', hex: '#EF4444' },
  { name: 'Amarillo Oro', hex: '#FACC15' },
  { name: 'Cyan Eléctrico', hex: '#06B6D4' },
  { name: 'Verde Neón', hex: '#22C55E' },
  { name: 'Naranja Taller', hex: '#F97316' },
  { name: 'Plateado', hex: '#CBD5E1' }
];

export const CustomerCustomizerView: React.FC<CustomerCustomizerViewProps> = ({
  products,
  catalogDesigns,
  initialProduct,
  initialCustomization,
  onCustomizationSaved,
  onGoToMyOrders
}) => {
  const { addNotification } = useApp();
  const { userProfile, currentUser } = useAuth();

  // Active Selected Product
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct>(
    initialProduct || products[0] || clientStoreService.getProducts()[0]
  );

  // Customization States
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string }>(
    selectedProduct.availableColors[0] || { name: 'Negro Profundo', hex: '#0a0a0c' }
  );
  const [selectedPlacement, setSelectedPlacement] = useState<PrintPlacementZone>('pecho_central');
  const [uploadedDesignUrl, setUploadedDesignUrl] = useState<string | undefined>(
    initialCustomization?.uploadedDesignUrl || undefined
  );
  const [selectedCatalogDesign, setSelectedCatalogDesign] = useState<CatalogDesign | null>(null);

  // Typography
  const [customText, setCustomText] = useState<string>(initialCustomization?.customText || '');
  const [textColor, setTextColor] = useState<string>(initialCustomization?.textColor || '#FFFFFF');
  const [textFont, setTextFont] = useState<string>(initialCustomization?.textFont || FONT_OPTIONS[0].id);
  const [textSize, setTextSize] = useState<number>(initialCustomization?.textSize || 32);
  const [textCurve, setTextCurve] = useState<number>(initialCustomization?.textCurve || 0);

  // Transform controls
  const [designScale, setDesignScale] = useState<number>(initialCustomization?.designScale || 1.0);
  const [designRotation, setDesignRotation] = useState<number>(initialCustomization?.designRotation || 0);
  const [designOffsetX, setDesignOffsetX] = useState<number>(initialCustomization?.designOffsetX || 0);
  const [designOffsetY, setDesignOffsetY] = useState<number>(initialCustomization?.designOffsetY || 0);

  // Size Quantities Breakdown
  const [sizesBreakdown, setSizesBreakdown] = useState<{ size: string; quantity: number }[]>(() => {
    if (initialCustomization?.sizesBreakdown?.length) {
      return initialCustomization.sizesBreakdown;
    }
    return selectedProduct.availableSizes.map((size, idx) => ({
      size,
      quantity: idx === 1 ? 15 : idx === 2 ? 20 : idx === 0 ? 10 : 5 // Default realistic order curve
    }));
  });

  // UI States
  const [activeTab, setActiveTab] = useState<'prendas' | 'colores' | 'posicion' | 'diseno' | 'texto' | 'tallas'>('prendas');
  const [catalogFilter, setCatalogFilter] = useState<string>('todos');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderModalRequestType, setOrderModalRequestType] = useState<'cotizacion' | 'pedido' | 'revision'>('pedido');
  const [isSizesGuideOpen, setIsSizesGuideOpen] = useState(false);
  const [capturedSnapshot, setCapturedSnapshot] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update sizes breakdown when switching garment
  useEffect(() => {
    if (selectedProduct) {
      setSizesBreakdown(
        selectedProduct.availableSizes.map((size) => ({
          size,
          quantity: 10
        }))
      );
      if (
        !selectedProduct.availableColors.some((c) => c.hex.toLowerCase() === selectedColor.hex.toLowerCase())
      ) {
        setSelectedColor(selectedProduct.availableColors[0]);
      }
    }
  }, [selectedProduct.id]);

  // Load from initial customization if provided
  useEffect(() => {
    if (initialCustomization) {
      const prod = products.find((p) => p.garmentId === initialCustomization.garmentId);
      if (prod) setSelectedProduct(prod);
      setSelectedColor({ name: initialCustomization.colorName, hex: initialCustomization.colorHex });
      setSelectedPlacement(initialCustomization.placement);
      setCustomText(initialCustomization.customText || '');
      setTextColor(initialCustomization.textColor || '#FFFFFF');
      setTextFont(initialCustomization.textFont || FONT_OPTIONS[0].id);
      setTextSize(initialCustomization.textSize || 32);
      setTextCurve(initialCustomization.textCurve || 0);
      setDesignScale(initialCustomization.designScale || 1.0);
      setDesignRotation(initialCustomization.designRotation || 0);
      setDesignOffsetX(initialCustomization.designOffsetX || 0);
      setDesignOffsetY(initialCustomization.designOffsetY || 0);
      if (initialCustomization.uploadedDesignUrl) setUploadedDesignUrl(initialCustomization.uploadedDesignUrl);
      if (initialCustomization.sizesBreakdown) setSizesBreakdown(initialCustomization.sizesBreakdown);
    }
  }, [initialCustomization]);

  // Calculations
  const totalQuantity = sizesBreakdown.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const pricing = clientStoreService.calculateVolumePricing(
    selectedProduct.basePrice,
    selectedProduct.volumePricing,
    totalQuantity
  );

  // Size quantity handlers
  const handleQuantityChange = (size: string, delta: number) => {
    setSizesBreakdown((prev) =>
      prev.map((item) => {
        if (item.size === size) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const handleManualQuantity = (size: string, val: string) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setSizesBreakdown((prev) =>
      prev.map((item) => (item.size === size ? { ...item, quantity: num } : item))
    );
  };

  // Image Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/image\/(png|jpeg|webp|svg\+xml)/)) {
      addNotification('Formato no válido', 'Por favor sube una imagen PNG, JPG o SVG.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      setUploadedDesignUrl(dataUri);
      setSelectedCatalogDesign(null);
      addNotification('Diseño subido', 'Arte cargado y proyectado sobre la prenda 3D.', 'success');
    };
    reader.readAsDataURL(file);
  };

  // Remove white background simulation
  const handleAutoRemoveWhiteBg = () => {
    if (!uploadedDesignUrl) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, c.width, c.height);
      const data = imgData.data;

      // Simple chroma threshold: clear pixels where R,G,B are all near white (>235)
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (r > 235 && g > 235 && b > 235) {
          data[i + 3] = 0; // Transparent
        }
      }
      ctx.putImageData(imgData, 0, 0);
      setUploadedDesignUrl(c.toDataURL('image/png'));
      addNotification('Fondo Aislado', 'Fondo blanco removido para transparencia óptima.', 'success');
    };
    img.src = uploadedDesignUrl;
  };

  // Build customization object
  const buildCurrentCustomization = (): ClientCustomization => {
    return {
      id: initialCustomization?.id || `cust-${Date.now()}`,
      clientId: userProfile?.uid || currentUser?.uid || 'cliente_portal',
      clientEmail: userProfile?.email || currentUser?.email || 'cliente@ejemplo.com',
      clientName: userProfile?.displayName || 'Cliente Textil',
      title: `${selectedProduct.name} - ${customText || selectedCatalogDesign?.title || 'Personalizado'}`,
      garmentId: selectedProduct.garmentId,
      garmentName: selectedProduct.name,
      garmentPhotoUrl: selectedProduct.photoUrl,
      model3DType: selectedProduct.model3DType,
      colorHex: selectedColor.hex,
      colorName: selectedColor.name,
      techniqueId: 'dtf_textil',
      placement: selectedPlacement,
      uploadedDesignUrl,
      selectedCatalogDesignId: selectedCatalogDesign?.id,
      customText,
      textColor,
      textFont,
      textSize,
      textCurve,
      designScale,
      designRotation,
      designOffsetX,
      designOffsetY,
      sizesBreakdown,
      totalUnits: totalQuantity,
      unitPrice: pricing.unitPrice,
      subtotal: pricing.subtotal,
      discountApplied: pricing.discountPercent,
      totalEstimated: pricing.total,
      status: initialCustomization?.status || 'borrador',
      createdAt: initialCustomization?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };

  // Save private customization
  const handleSaveDraft = async () => {
    const cust = buildCurrentCustomization();
    await clientStoreService.saveCustomization(cust);
    addNotification(
      'Proyecto Privado Guardado',
      'Tu diseño ha sido guardado exclusivamente en tu cuenta. Nadie más tiene acceso a él.',
      'success',
      'catalogos_comerciales'
    );
    if (onCustomizationSaved) onCustomizationSaved();
  };

  // Open Order Modal
  const handleOpenOrderModal = (type: 'cotizacion' | 'pedido' | 'revision') => {
    if (totalQuantity <= 0) {
      addNotification('Selecciona cantidades', 'Elige al menos 1 unidad en la tabla de tallas.', 'warning');
      setActiveTab('tallas');
      return;
    }
    setOrderModalRequestType(type);
    setIsOrderModalOpen(true);
  };

  // Filtered Catalog Designs
  const filteredCatalogDesigns = catalogDesigns.filter((d) => {
    if (catalogFilter === 'todos') return true;
    return d.category === catalogFilter;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12 animate-in fade-in duration-300">
      {/* LEFT COLUMN: 3D Studio WebGL Viewport */}
      <div className="lg:col-span-7 flex flex-col space-y-4">
        {/* Main 3D Canvas */}
        <div className="relative">
          <CustomerStore3DViewer
            modelType={selectedProduct.model3DType}
            colorHex={selectedColor.hex}
            colorName={selectedColor.name}
            placement={selectedPlacement}
            uploadedDesignUrl={uploadedDesignUrl}
            catalogDesignUrl={selectedCatalogDesign?.previewUrl}
            customText={customText}
            textColor={textColor}
            textFont={textFont}
            textSize={textSize}
            textCurve={textCurve}
            designScale={designScale}
            designRotation={designRotation}
            designOffsetX={designOffsetX}
            designOffsetY={designOffsetY}
            onSnapshotTaken={(dataUrl) => {
              setCapturedSnapshot(dataUrl);
              addNotification('Mockup Capturado', 'Vista 3D renderizada con éxito.', 'success');
            }}
            className="h-[480px] sm:h-[540px] w-full"
          />

          {/* Quick Garment Switcher Badge */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none">
            <div className="bg-slate-950/85 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-xs text-white shadow-lg pointer-events-auto">
              <div className="font-bold text-slate-100 flex items-center gap-2">
                <Shirt className="w-4 h-4 text-cyan-400" />
                {selectedProduct.name}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                <span>Color: {selectedColor.name}</span>
                <span>•</span>
                <span>{PRINT_PLACEMENTS[selectedPlacement]?.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Garment Details & Tech Specs Strip */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={selectedProduct.photoUrl}
              alt={selectedProduct.name}
              className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-xs"
            />
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {selectedProduct.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {selectedProduct.composition} • {selectedProduct.weightGsm}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  {selectedProduct.defaultTechnique}
                </span>
                <span className="text-[10px] text-slate-400">
                  Stock disponible: <strong className="text-slate-700 dark:text-slate-300">{selectedProduct.totalStock} u.</strong>
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSizesGuideOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
          >
            <Ruler className="w-4 h-4 text-cyan-500" />
            <span>Guía de Tallas & Medidas</span>
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Customization Toolbox & Order Engine */}
      <div className="lg:col-span-5 flex flex-col space-y-4">
        {/* Toolbox Header Tabs */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-1.5 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-6 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('prendas')}
            className={`flex flex-col items-center py-2 px-1 rounded-xl text-[10px] font-semibold transition-all ${
              activeTab === 'prendas'
                ? 'bg-slate-900 text-white dark:bg-cyan-500/20 dark:text-cyan-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Shirt className="w-4 h-4 mb-0.5" />
            <span>Prenda</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('colores')}
            className={`flex flex-col items-center py-2 px-1 rounded-xl text-[10px] font-semibold transition-all ${
              activeTab === 'colores'
                ? 'bg-slate-900 text-white dark:bg-cyan-500/20 dark:text-cyan-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Palette className="w-4 h-4 mb-0.5" />
            <span>Color</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('posicion')}
            className={`flex flex-col items-center py-2 px-1 rounded-xl text-[10px] font-semibold transition-all ${
              activeTab === 'posicion'
                ? 'bg-slate-900 text-white dark:bg-cyan-500/20 dark:text-cyan-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4 mb-0.5" />
            <span>Zona</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('diseno')}
            className={`flex flex-col items-center py-2 px-1 rounded-xl text-[10px] font-semibold transition-all ${
              activeTab === 'diseno'
                ? 'bg-slate-900 text-white dark:bg-cyan-500/20 dark:text-cyan-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Upload className="w-4 h-4 mb-0.5" />
            <span>Arte</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('texto')}
            className={`flex flex-col items-center py-2 px-1 rounded-xl text-[10px] font-semibold transition-all ${
              activeTab === 'texto'
                ? 'bg-slate-900 text-white dark:bg-cyan-500/20 dark:text-cyan-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Type className="w-4 h-4 mb-0.5" />
            <span>Texto</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tallas')}
            className={`flex flex-col items-center py-2 px-1 rounded-xl text-[10px] font-semibold transition-all ${
              activeTab === 'tallas'
                ? 'bg-slate-900 text-white dark:bg-cyan-500/20 dark:text-cyan-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Tag className="w-4 h-4 mb-0.5" />
            <span>Tallas</span>
          </button>
        </div>

        {/* Tab Panel Body */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex-1 min-h-[380px]">
          {/* TAB 1: PRENDAS */}
          {activeTab === 'prendas' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Selecciona la Prenda Base
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Prendas en blanco calibradas para el motor 3D y producción textil.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
                {products.map((prod) => {
                  const isSelected = prod.id === selectedProduct.id;
                  return (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => setSelectedProduct(prod)}
                      className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-500/5 ring-2 ring-cyan-500/20 dark:bg-cyan-500/10'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <img
                        src={prod.photoUrl}
                        alt={prod.name}
                        className="w-full h-24 object-cover rounded-lg mb-2"
                      />
                      <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {prod.name}
                      </span>
                      <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-extrabold mt-0.5">
                        Desde ${prod.basePrice.toLocaleString('es-CL')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: COLORES */}
          {activeTab === 'colores' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Color de la Prenda
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Actualiza el color en tiempo real sobre la geometría 3D.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {selectedProduct.availableColors.map((color) => {
                  const isSelected = selectedColor.hex.toLowerCase() === color.hex.toLowerCase();
                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-cyan-500 ring-2 ring-cyan-500/20 bg-slate-50 dark:bg-slate-800'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-full border border-slate-300 dark:border-slate-600 shadow-xs shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: color.hex }}
                      >
                        {isSelected && (
                          <Check className={`w-4 h-4 ${color.hex === '#ffffff' || color.hex === '#f4f3ef' ? 'text-black' : 'text-white'}`} />
                        )}
                      </div>
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                        {color.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: POSICIÓN DE ESTAMPADO */}
          {activeTab === 'posicion' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Zona Reglamentaria de Estampado
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Selecciona la ubicación anatómica para tu diseño.
                </p>
              </div>

              <div className="space-y-2">
                {(Object.keys(PRINT_PLACEMENTS) as PrintPlacementZone[]).map((zoneKey) => {
                  const pConfig = PRINT_PLACEMENTS[zoneKey];
                  const isSelected = selectedPlacement === zoneKey;
                  return (
                    <button
                      key={zoneKey}
                      type="button"
                      onClick={() => setSelectedPlacement(zoneKey)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-500/5 dark:bg-cyan-500/10 ring-1 ring-cyan-500'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {pConfig.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {pConfig.description}
                        </div>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                        {pConfig.dimensionsCm}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: DISEÑO Y ARTE */}
          {activeTab === 'diseno' && (
            <div className="space-y-5">
              {/* Upload Own Design */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Subir Tu Propio Diseño
                  </h3>
                  {uploadedDesignUrl && (
                    <button
                      type="button"
                      onClick={() => setUploadedDesignUrl(undefined)}
                      className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Quitar
                    </button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/30"
                >
                  <Upload className="w-6 h-6 mx-auto text-slate-400 mb-1.5" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Haz clic o arrastra tu archivo aquí
                  </p>
                  <p className="text-[11px] text-slate-500">
                    PNG transparente, JPG de alta resolución o SVG
                  </p>
                </div>

                {uploadedDesignUrl && (
                  <div className="mt-3 flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={uploadedDesignUrl}
                        alt="Preview"
                        className="w-10 h-10 object-contain rounded-lg bg-black/5 dark:bg-white/5 border border-slate-300 dark:border-slate-700 p-0.5"
                      />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Arte cargado
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleAutoRemoveWhiteBg}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                      title="Quitar fondo blanco para transparencia"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>Quitar Fondo Blanco</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Ready-to-print Catalog Designs */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Diseños Disponibles de Taller
                  </h3>
                  <select
                    value={catalogFilter}
                    onChange={(e) => setCatalogFilter(e.target.value)}
                    className="text-xs bg-slate-100 dark:bg-slate-800 border-none rounded-lg py-1 px-2 text-slate-700 dark:text-slate-300"
                  >
                    <option value="todos">Todos los Estilos</option>
                    <option value="urbano">Urbano</option>
                    <option value="vintage">Vintage 80s/90s</option>
                    <option value="deportivo">Deportivo / Gym</option>
                    <option value="minimalista">Minimal</option>
                    <option value="anime">Anime / Cyber</option>
                    <option value="empresarial">Corporativo</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
                  {filteredCatalogDesigns.map((des) => {
                    const isSelected = selectedCatalogDesign?.id === des.id;
                    return (
                      <button
                        key={des.id}
                        type="button"
                        onClick={() => {
                          setSelectedCatalogDesign(des);
                          setUploadedDesignUrl(des.previewUrl);
                        }}
                        className={`p-1.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-cyan-500 bg-cyan-500/10 ring-2 ring-cyan-500/20'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <img
                          src={des.previewUrl}
                          alt={des.title}
                          className="w-full h-16 object-cover rounded-lg mb-1"
                        />
                        <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate">
                          {des.title}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Transform controls (Scale, Rotation, Offsets) */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  Ajustes de Tamaño y Posición
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-500 mb-1">
                      <span>Escala</span>
                      <span>{Math.round(designScale * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.4}
                      max={1.6}
                      step={0.05}
                      value={designScale}
                      onChange={(e) => setDesignScale(parseFloat(e.target.value))}
                      className="w-full accent-cyan-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-500 mb-1">
                      <span>Rotación</span>
                      <span>{designRotation}°</span>
                    </div>
                    <input
                      type="range"
                      min={-180}
                      max={180}
                      step={5}
                      value={designRotation}
                      onChange={(e) => setDesignRotation(parseInt(e.target.value, 10))}
                      className="w-full accent-cyan-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-500 mb-1">
                      <span>Posición X</span>
                      <span>{designOffsetX}</span>
                    </div>
                    <input
                      type="range"
                      min={-40}
                      max={40}
                      step={2}
                      value={designOffsetX}
                      onChange={(e) => setDesignOffsetX(parseInt(e.target.value, 10))}
                      className="w-full accent-cyan-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-500 mb-1">
                      <span>Posición Y</span>
                      <span>{designOffsetY}</span>
                    </div>
                    <input
                      type="range"
                      min={-40}
                      max={40}
                      step={2}
                      value={designOffsetY}
                      onChange={(e) => setDesignOffsetY(parseInt(e.target.value, 10))}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TEXTOS */}
          {activeTab === 'texto' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Texto Personalizado
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Agrega tipografía profesional con curvatura y colores textiles.
                </p>
              </div>

              {/* Text Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tu Texto
                </label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Ej: URBAN DISTRICT, STAFF 2026..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              {/* Font Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tipografía
                </label>
                <select
                  value={textFont}
                  onChange={(e) => setTextFont(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Text Color Swatches */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Color del Texto
                </label>
                <div className="flex flex-wrap gap-2">
                  {TEXT_COLOR_PALETTE.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setTextColor(c.hex)}
                      title={c.name}
                      className={`w-7 h-7 rounded-full border border-slate-300 dark:border-slate-600 shadow-xs transition-transform ${
                        textColor.toLowerCase() === c.hex.toLowerCase()
                          ? 'ring-2 ring-cyan-500 scale-110'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Curvature Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Curvatura / Arco de Texto</span>
                  <span>{textCurve}%</span>
                </div>
                <input
                  type="range"
                  min={-80}
                  max={80}
                  step={5}
                  value={textCurve}
                  onChange={(e) => setTextCurve(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>Arco Inferior ↷</span>
                  <span>Recto</span>
                  <span>Arco Superior ↶</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: TALLAS Y CANTIDADES */}
          {activeTab === 'tallas' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Desglose de Curva de Tallas
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Distribuye tus unidades para acceder a descuentos por volumen.
                  </p>
                </div>
                <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-200 dark:border-cyan-800">
                  {totalQuantity} prendas en total
                </span>
              </div>

              {/* Size rows */}
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {sizesBreakdown.map((row) => (
                  <div
                    key={row.size}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                  >
                    <span className="text-xs font-bold text-slate-900 dark:text-white w-16">
                      Talla {row.size}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(row.size, -5)}
                        className="p-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                        title="-5 unidades"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <input
                        type="number"
                        min={0}
                        value={row.quantity}
                        onChange={(e) => handleManualQuantity(row.size, e.target.value)}
                        className="w-16 text-center py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold font-mono"
                      />

                      <button
                        type="button"
                        onClick={() => handleQuantityChange(row.size, 5)}
                        className="p-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                        title="+5 unidades"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Volume Discount Progress Note */}
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                <div>
                  <strong>Descuento Mayorista Aplicado: {pricing.discountPercent}%</strong>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Ahorras ${pricing.savings.toLocaleString('es-CL')} en este pedido.
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                    ${pricing.unitPrice.toLocaleString('es-CL')}
                  </span>
                  <span className="text-[10px] block text-slate-400">por prenda</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pricing Summary & Checkout Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                Total Estimado de Producción
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  ${pricing.total.toLocaleString('es-CL')}
                </span>
                <span className="text-xs text-slate-500">
                  ({totalQuantity} u. a ${pricing.unitPrice.toLocaleString('es-CL')})
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Guardar en mis proyectos privados"
            >
              <Save className="w-4 h-4 text-cyan-500" />
              <span>Guardar Proyecto</span>
            </button>
          </div>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => handleOpenOrderModal('cotizacion')}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-cyan-500" />
              <span>Cotizar</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenOrderModal('revision')}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 text-amber-500" />
              <span>Revisar Arte</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenOrderModal('pedido')}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Pedir Ahora</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CustomerOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        customization={buildCurrentCustomization()}
        defaultRequestType={orderModalRequestType}
        onOrderSuccess={(orderId) => {
          if (onGoToMyOrders) onGoToMyOrders();
        }}
      />

      <GarmentSizesModal
        isOpen={isSizesGuideOpen}
        onClose={() => setIsSizesGuideOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
};
