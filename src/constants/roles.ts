import { RolePermissions, UserRole } from '../types';

export const USER_ROLES: Record<UserRole, RolePermissions> = {
  administrador: {
    role: 'administrador',
    label: 'Administrador Maestro',
    description: 'Acceso total a todos los módulos, gestión de usuarios, finanzas y configuración de taller.',
    allowedModules: [
      'inicio', 'estudio_diseno', 'probador_3d', 'disenador_grafico', 'editor_imagenes', 'ia_creativa',
      'catalogo_prendas', 'tecnicas_estampado', 'asistente_produccion', 'archivos_disenos',
      'preparacion_impresion', 'biblioteca', 'cotizaciones', 'clientes', 'pedidos',
      'produccion', 'inventario', 'finanzas', 'control_calidad', 'catalogos_comerciales',
      'centro_aprendizaje', 'configuracion'
    ],
    canEditSettings: true,
    canManageUsers: true,
    canViewFinances: true,
    canExportFiles: true,
    canDeleteProjects: true
  },
  disenador: {
    role: 'disenador',
    label: 'Diseñador Textil',
    description: 'Enfocado en creación de artes, simulación 3D, IA generativa, biblioteca y separación de color.',
    allowedModules: [
      'inicio', 'estudio_diseno', 'probador_3d', 'disenador_grafico', 'editor_imagenes', 'ia_creativa',
      'catalogo_prendas', 'tecnicas_estampado', 'archivos_disenos', 'preparacion_impresion',
      'biblioteca', 'centro_aprendizaje'
    ],
    canEditSettings: false,
    canManageUsers: false,
    canViewFinances: false,
    canExportFiles: true,
    canDeleteProjects: false
  },
  operador: {
    role: 'operador',
    label: 'Operador de Prensa & Carrusel',
    description: 'Acceso al flujo de taller, preparación RIP, control de calidad, máquinas e inventario de tintas.',
    allowedModules: [
      'inicio', 'catalogo_prendas', 'tecnicas_estampado', 'asistente_produccion',
      'preparacion_impresion', 'pedidos', 'produccion', 'inventario', 'control_calidad',
      'centro_aprendizaje'
    ],
    canEditSettings: false,
    canManageUsers: false,
    canViewFinances: false,
    canExportFiles: true,
    canDeleteProjects: false
  },
  vendedor: {
    role: 'vendedor',
    label: 'Ejecutivo Comercial',
    description: 'Emisión de presupuestos, gestión de clientes, seguimiento de pedidos y catálogos de prendas.',
    allowedModules: [
      'inicio', 'probador_3d', 'catalogo_prendas', 'tecnicas_estampado',
      'cotizaciones', 'clientes', 'pedidos', 'control_calidad', 'catalogos_comerciales',
      'centro_aprendizaje'
    ],
    canEditSettings: false,
    canManageUsers: false,
    canViewFinances: false,
    canExportFiles: false,
    canDeleteProjects: false
  },
  cliente: {
    role: 'cliente',
    label: 'Cliente / Marca Asociada',
    description: 'Visualización de sus pedidos, cotizaciones aprobadas, archivos propios y simulador 3D.',
    allowedModules: [
      'inicio', 'probador_3d', 'archivos_disenos', 'cotizaciones', 'pedidos',
      'catalogos_comerciales'
    ],
    canEditSettings: false,
    canManageUsers: false,
    canViewFinances: false,
    canExportFiles: true,
    canDeleteProjects: false
  }
};
