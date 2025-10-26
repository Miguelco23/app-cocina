/**
 * Tipos de categorías de alimentos disponibles
 */
export type Category = 'proteina' | 'carbohidrato' | 'fruta_veg'

/**
 * Tipos de comidas del día
 */
export type Meal = 'desayuno' | 'almuerzo' | 'cena'

/**
 * Unidades de medida para los alimentos
 */
export type Unit = 
  | 'gramos'
  | 'kilogramos'
  | 'litros'
  | 'mililitros'
  | 'unidades'
  | 'tazas'
  | 'cucharadas'
  | 'cucharaditas'
  | 'porciones'

/**
 * Interfaz principal para los alimentos
 */
export interface Food {
  /** Identificador único del alimento */
  id: string
  
  /** Nombre del alimento */
  name: string
  
  /** Categoría del alimento */
  category: Category
  
  /** Comidas en las que se puede consumir este alimento */
  meals: Meal[]
  
  /** Cantidad del alimento */
  quantity: number
  
  /** Unidad de medida */
  unit: Unit
  
  /** Notas adicionales sobre el alimento */
  notes?: string
}

/**
 * Tipo para crear un nuevo alimento (sin ID, se genera automáticamente)
 */
export type CreateFood = Omit<Food, 'id'>

/**
 * Tipo para actualizar un alimento (todos los campos opcionales excepto ID)
 */
export type UpdateFood = Partial<Omit<Food, 'id'>> & { id: string }

/**
 * Metadata de categorías para UI
 */
export interface CategoryMetadata {
  label: string
  color: string
  icon?: string
}

/**
 * Mapeo de categorías a metadata
 */
export const CATEGORY_METADATA: Record<Category, CategoryMetadata> = {
  proteina: {
    label: 'Proteína',
    color: 'bg-red-100 text-red-800',
    icon: '🥩'
  },
  carbohidrato: {
    label: 'Carbohidrato',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '🍞'
  },
  fruta_veg: {
    label: 'Frutas y Vegetales',
    color: 'bg-green-100 text-green-800',
    icon: '🥗'
  }
}

/**
 * Metadata de comidas para UI
 */
export interface MealMetadata {
  label: string
  color: string
  icon?: string
}

/**
 * Mapeo de comidas a metadata
 */
export const MEAL_METADATA: Record<Meal, MealMetadata> = {
  desayuno: {
    label: 'Desayuno',
    color: 'bg-orange-100 text-orange-800',
    icon: '🌅'
  },
  almuerzo: {
    label: 'Almuerzo',
    color: 'bg-blue-100 text-blue-800',
    icon: '☀️'
  },
  cena: {
    label: 'Cena',
    color: 'bg-purple-100 text-purple-800',
    icon: '🌙'
  }
}

/**
 * Opciones disponibles de unidades de medida
 */
export const UNIT_OPTIONS: readonly Unit[] = [
  'gramos',
  'kilogramos',
  'litros',
  'mililitros',
  'unidades',
  'tazas',
  'cucharadas',
  'cucharaditas',
  'porciones'
] as const

/**
 * Opciones disponibles de categorías
 */
export const CATEGORY_OPTIONS: readonly Category[] = [
  'proteina',
  'carbohidrato',
  'fruta_veg'
] as const

/**
 * Opciones disponibles de comidas
 */
export const MEAL_OPTIONS: readonly Meal[] = [
  'desayuno',
  'almuerzo',
  'cena'
] as const

