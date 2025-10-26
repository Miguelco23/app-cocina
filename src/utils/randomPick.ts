import type { Food, Meal, Category } from '../types'

/**
 * Selecciona un elemento aleatorio de un array
 * @template T - Tipo de elemento en el array
 * @param array - Array de elementos
 * @returns Elemento aleatorio o null si el array está vacío
 */
export function pickRandom<T>(array: T[]): T | null {
  if (!array || array.length === 0) {
    return null
  }
  
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}

/**
 * Resultado de la selección de alimentos para una comida
 */
export interface MealChoice {
  proteina: Food | null
  carbohidrato: Food | null
  fruta_veg: Food | null
}

/**
 * Filtra alimentos por categoría, meal y stock disponible
 * @param foods - Lista de alimentos
 * @param category - Categoría a filtrar
 * @param meal - Comida para la cual filtrar
 * @returns Array de alimentos filtrados
 */
export function filterFoodsForMeal(
  foods: Food[],
  category: Category,
  meal: Meal
): Food[] {
  return foods.filter(
    food =>
      food.category === category &&
      food.quantity > 0 &&
      food.meals.includes(meal)
  )
}

/**
 * Selecciona aleatoriamente un alimento de cada categoría para una comida específica
 * 
 * Criterios de selección:
 * - Solo alimentos con quantity > 0
 * - Solo alimentos que incluyan la meal especificada
 * - Agrupa por categoría (proteina, carbohidrato, fruta_veg)
 * - Selecciona 1 alimento aleatorio de cada categoría
 * 
 * @param foods - Lista de alimentos disponibles
 * @param meal - Comida para la cual seleccionar (desayuno, almuerzo, cena)
 * @returns Objeto con un alimento de cada categoría (o null si no hay disponibles)
 * 
 * @example
 * ```typescript
 * const foods = [
 *   { category: 'proteina', meals: ['almuerzo'], quantity: 200, ... },
 *   { category: 'carbohidrato', meals: ['almuerzo'], quantity: 100, ... }
 * ]
 * 
 * const result = chooseForMeal(foods, 'almuerzo')
 * // { proteina: Food, carbohidrato: Food, fruta_veg: null }
 * ```
 */
export function chooseForMeal(foods: Food[], meal: Meal): MealChoice {
  const categories: Category[] = ['proteina', 'carbohidrato', 'fruta_veg']
  
  const result: MealChoice = {
    proteina: null,
    carbohidrato: null,
    fruta_veg: null
  }

  for (const category of categories) {
    const availableFoods = filterFoodsForMeal(foods, category, meal)
    result[category] = pickRandom(availableFoods)
  }

  return result
}

/**
 * Verifica si hay alimentos disponibles de una categoría para una comida
 * @param foods - Lista de alimentos
 * @param category - Categoría a verificar
 * @param meal - Comida para verificar
 * @returns true si hay al menos un alimento disponible
 */
export function hasAvailableFoods(
  foods: Food[],
  category: Category,
  meal: Meal
): boolean {
  return filterFoodsForMeal(foods, category, meal).length > 0
}

/**
 * Verifica si hay alimentos disponibles en todas las categorías para una comida
 * @param foods - Lista de alimentos
 * @param meal - Comida para verificar
 * @returns true si hay alimentos en todas las categorías
 */
export function hasAllCategories(foods: Food[], meal: Meal): boolean {
  return (
    hasAvailableFoods(foods, 'proteina', meal) &&
    hasAvailableFoods(foods, 'carbohidrato', meal) &&
    hasAvailableFoods(foods, 'fruta_veg', meal)
  )
}

/**
 * Obtiene el conteo de alimentos disponibles por categoría para una comida
 * @param foods - Lista de alimentos
 * @param meal - Comida para contar
 * @returns Objeto con conteo por categoría
 */
export function getAvailableCount(foods: Food[], meal: Meal): Record<Category, number> {
  return {
    proteina: filterFoodsForMeal(foods, 'proteina', meal).length,
    carbohidrato: filterFoodsForMeal(foods, 'carbohidrato', meal).length,
    fruta_veg: filterFoodsForMeal(foods, 'fruta_veg', meal).length
  }
}

