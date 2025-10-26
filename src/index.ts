/**
 * Punto de entrada principal para exportaciones
 */

// Exportar todos los tipos
export type { Food, Category, Meal, Unit, CreateFood, UpdateFood, CategoryMetadata, MealMetadata } from './types'

// Exportar constantes y metadata
export { CATEGORY_METADATA, MEAL_METADATA, CATEGORY_OPTIONS, MEAL_OPTIONS, UNIT_OPTIONS } from './types'

// Exportar hooks
export { useStorage } from './hooks/useStorage'

// Exportar utilidades
export {
  pickRandom,
  chooseForMeal,
  filterFoodsForMeal,
  hasAvailableFoods,
  hasAllCategories,
  getAvailableCount
} from './utils/randomPick'
export type { MealChoice } from './utils/randomPick'

export {
  isValidFood,
  validateFoodsArray,
  exportToJSON,
  importFromJSON,
  generateExportFilename,
  mergeFoods,
  replaceFoods
} from './utils/importExport'

// Exportar componentes
export { Home } from './components/Home'

export { FoodForm } from './components/FoodForm'
export type { FoodFormProps } from './components/FoodForm'

export { FoodList } from './components/FoodList'
export type { FoodListProps } from './components/FoodList'

export { Roulette } from './components/Roulette'
export type { RouletteProps, RouletteResult } from './components/Roulette'

