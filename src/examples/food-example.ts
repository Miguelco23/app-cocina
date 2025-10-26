/**
 * Ejemplos de uso de los tipos Food y Category
 */

import type { Food, CreateFood, UpdateFood } from '../types'
import { CATEGORY_METADATA, MEAL_METADATA } from '../types'

// Ejemplo 1: Crear un alimento completo con ID
export const ejemploPollo: Food = {
  id: 'food-001',
  name: 'Pechuga de Pollo',
  category: 'proteina',
  meals: ['almuerzo', 'cena'],
  quantity: 200,
  unit: 'gramos',
  notes: 'Pollo a la plancha sin piel, alto en proteína'
}

// Ejemplo 2: Crear un alimento sin notas
export const ejemploArroz: Food = {
  id: 'food-002',
  name: 'Arroz Integral',
  category: 'carbohidrato',
  meals: ['almuerzo', 'cena'],
  quantity: 150,
  unit: 'gramos'
}

// Ejemplo 3: Crear un alimento con todas las comidas
export const ejemploHuevo: Food = {
  id: 'food-003',
  name: 'Huevo',
  category: 'proteina',
  meals: ['desayuno', 'almuerzo', 'cena'],
  quantity: 2,
  unit: 'unidades',
  notes: 'Puede prepararse cocido, revuelto o en tortilla'
}

// Ejemplo 4: Frutas y vegetales
export const ejemploManzana: Food = {
  id: 'food-004',
  name: 'Manzana Verde',
  category: 'fruta_veg',
  meals: ['desayuno'],
  quantity: 1,
  unit: 'unidades',
  notes: 'Rica en fibra y vitaminas'
}

export const ejemploBrocoli: Food = {
  id: 'food-005',
  name: 'Brócoli',
  category: 'fruta_veg',
  meals: ['almuerzo', 'cena'],
  quantity: 150,
  unit: 'gramos',
  notes: 'Cocido al vapor para mantener nutrientes'
}

// Ejemplo 5: Usando CreateFood (para crear nuevo alimento sin ID)
export const nuevoAlimento: CreateFood = {
  name: 'Salmón',
  category: 'proteina',
  meals: ['almuerzo', 'cena'],
  quantity: 180,
  unit: 'gramos',
  notes: 'Rico en Omega-3'
}

// Ejemplo 6: Usando UpdateFood (para actualizar parcialmente)
export const actualizarAlimento: UpdateFood = {
  id: 'food-001',
  quantity: 250, // Solo actualizar la cantidad
  notes: 'Pollo a la plancha sin piel, alto en proteína. Actualizado.'
}

// Ejemplo 7: Lista de alimentos
export const listaAlimentos: Food[] = [
  ejemploPollo,
  ejemploArroz,
  ejemploHuevo,
  ejemploManzana,
  ejemploBrocoli
]

// Función helper: Generar ID único para alimentos
export function generarIdAlimento(): string {
  return `food-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Función helper: Crear alimento con ID generado
export function crearAlimento(datos: CreateFood): Food {
  return {
    ...datos,
    id: generarIdAlimento()
  }
}

// Función helper: Obtener label de categoría
export function obtenerLabelCategoria(category: Food['category']): string {
  return CATEGORY_METADATA[category].label
}

// Función helper: Obtener label de comida
export function obtenerLabelComida(meal: Food['meals'][0]): string {
  return MEAL_METADATA[meal].label
}

// Función helper: Filtrar alimentos por categoría
export function filtrarPorCategoria(alimentos: Food[], category: Food['category']): Food[] {
  return alimentos.filter(food => food.category === category)
}

// Función helper: Filtrar alimentos por comida
export function filtrarPorComida(alimentos: Food[], meal: Food['meals'][0]): Food[] {
  return alimentos.filter(food => food.meals.includes(meal))
}

// Función helper: Validar objeto Food
export function esAlimentoValido(food: unknown): food is Food {
  if (!food || typeof food !== 'object') return false
  
  const f = food as Food
  
  return (
    typeof f.id === 'string' &&
    typeof f.name === 'string' &&
    ['proteina', 'carbohidrato', 'fruta_veg'].includes(f.category) &&
    Array.isArray(f.meals) &&
    f.meals.every(m => ['desayuno', 'almuerzo', 'cena'].includes(m)) &&
    typeof f.quantity === 'number' &&
    typeof f.unit === 'string' &&
    (f.notes === undefined || typeof f.notes === 'string')
  )
}

// Ejemplos de uso de los helpers
console.log('Ejemplos de uso:')
console.log('1. Alimentos de proteína:', filtrarPorCategoria(listaAlimentos, 'proteina'))
console.log('2. Alimentos para desayuno:', filtrarPorComida(listaAlimentos, 'desayuno'))
console.log('3. Nuevo alimento creado:', crearAlimento(nuevoAlimento))
console.log('4. Label de categoría proteína:', obtenerLabelCategoria('proteina'))

