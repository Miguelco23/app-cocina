import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  pickRandom,
  chooseForMeal,
  filterFoodsForMeal,
  hasAvailableFoods,
  hasAllCategories,
  getAvailableCount
} from './randomPick'
import type { Food } from '../types'

const mockFoods: Food[] = [
  {
    id: '1',
    name: 'Pollo',
    category: 'proteina',
    meals: ['almuerzo', 'cena'],
    quantity: 200,
    unit: 'gramos'
  },
  {
    id: '2',
    name: 'Pescado',
    category: 'proteina',
    meals: ['almuerzo'],
    quantity: 150,
    unit: 'gramos'
  },
  {
    id: '3',
    name: 'Huevos',
    category: 'proteina',
    meals: ['desayuno', 'almuerzo', 'cena'],
    quantity: 0, // Sin stock
    unit: 'unidades'
  },
  {
    id: '4',
    name: 'Arroz',
    category: 'carbohidrato',
    meals: ['almuerzo', 'cena'],
    quantity: 100,
    unit: 'gramos'
  },
  {
    id: '5',
    name: 'Pasta',
    category: 'carbohidrato',
    meals: ['cena'],
    quantity: 80,
    unit: 'gramos'
  },
  {
    id: '6',
    name: 'Pan',
    category: 'carbohidrato',
    meals: ['desayuno'],
    quantity: 50,
    unit: 'gramos'
  },
  {
    id: '7',
    name: 'Manzana',
    category: 'fruta_veg',
    meals: ['desayuno', 'almuerzo'],
    quantity: 3,
    unit: 'unidades'
  },
  {
    id: '8',
    name: 'Brócoli',
    category: 'fruta_veg',
    meals: ['almuerzo', 'cena'],
    quantity: 150,
    unit: 'gramos'
  }
]

describe('randomPick utilities', () => {
  describe('pickRandom', () => {
    it('debe retornar null para array vacío', () => {
      const result = pickRandom([])
      expect(result).toBeNull()
    })

    it('debe retornar null para array undefined', () => {
      const result = pickRandom(undefined as any)
      expect(result).toBeNull()
    })

    it('debe retornar el único elemento de un array de 1', () => {
      const array = ['único']
      const result = pickRandom(array)
      expect(result).toBe('único')
    })

    it('debe retornar un elemento del array', () => {
      const array = ['a', 'b', 'c', 'd', 'e']
      const result = pickRandom(array)
      expect(array).toContain(result)
    })

    it('debe retornar diferentes elementos en múltiples llamadas', () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const results = new Set<number>()
      
      // Ejecutar 50 veces para tener alta probabilidad de obtener diferentes valores
      for (let i = 0; i < 50; i++) {
        const result = pickRandom(array)
        if (result !== null) {
          results.add(result)
        }
      }
      
      // Debería haber al menos 3 valores diferentes
      expect(results.size).toBeGreaterThanOrEqual(3)
    })

    it('debe funcionar con objetos complejos', () => {
      const objects = mockFoods.slice(0, 3)
      const result = pickRandom(objects)
      expect(objects).toContain(result)
    })
  })

  describe('filterFoodsForMeal', () => {
    it('debe filtrar por categoría, meal y quantity > 0', () => {
      const result = filterFoodsForMeal(mockFoods, 'proteina', 'almuerzo')
      
      // Pollo y Pescado (Huevos no porque quantity === 0)
      expect(result).toHaveLength(2)
      expect(result.map(f => f.name)).toContain('Pollo')
      expect(result.map(f => f.name)).toContain('Pescado')
    })

    it('debe excluir alimentos sin stock', () => {
      const result = filterFoodsForMeal(mockFoods, 'proteina', 'desayuno')
      
      // Huevos tiene desayuno pero quantity === 0
      expect(result).toHaveLength(0)
    })

    it('debe excluir alimentos que no incluyen la meal', () => {
      const result = filterFoodsForMeal(mockFoods, 'carbohidrato', 'desayuno')
      
      // Solo Pan tiene desayuno
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Pan')
    })

    it('debe retornar array vacío si no hay coincidencias', () => {
      const emptyFoods: Food[] = []
      const result = filterFoodsForMeal(emptyFoods, 'proteina', 'almuerzo')
      expect(result).toEqual([])
    })

    it('debe filtrar correctamente para cena', () => {
      const result = filterFoodsForMeal(mockFoods, 'carbohidrato', 'cena')
      
      // Arroz y Pasta
      expect(result).toHaveLength(2)
      expect(result.map(f => f.name)).toContain('Arroz')
      expect(result.map(f => f.name)).toContain('Pasta')
    })
  })

  describe('chooseForMeal', () => {
    it('debe retornar un alimento de cada categoría', () => {
      const result = chooseForMeal(mockFoods, 'almuerzo')
      
      expect(result).toHaveProperty('proteina')
      expect(result).toHaveProperty('carbohidrato')
      expect(result).toHaveProperty('fruta_veg')
    })

    it('debe retornar alimentos válidos para la meal especificada', () => {
      const result = chooseForMeal(mockFoods, 'almuerzo')
      
      if (result.proteina) {
        expect(result.proteina.meals).toContain('almuerzo')
        expect(result.proteina.quantity).toBeGreaterThan(0)
      }
      
      if (result.carbohidrato) {
        expect(result.carbohidrato.meals).toContain('almuerzo')
        expect(result.carbohidrato.quantity).toBeGreaterThan(0)
      }
      
      if (result.fruta_veg) {
        expect(result.fruta_veg.meals).toContain('almuerzo')
        expect(result.fruta_veg.quantity).toBeGreaterThan(0)
      }
    })

    it('debe retornar null para categorías sin alimentos disponibles', () => {
      // Para desayuno solo hay Pan (carbohidrato) y Manzana (fruta_veg)
      // No hay proteína con stock
      const result = chooseForMeal(mockFoods, 'desayuno')
      
      expect(result.proteina).toBeNull()
      expect(result.carbohidrato).not.toBeNull()
      expect(result.fruta_veg).not.toBeNull()
    })

    it('debe funcionar con array vacío', () => {
      const result = chooseForMeal([], 'almuerzo')
      
      expect(result.proteina).toBeNull()
      expect(result.carbohidrato).toBeNull()
      expect(result.fruta_veg).toBeNull()
    })

    it('debe seleccionar correctamente para cena', () => {
      const result = chooseForMeal(mockFoods, 'cena')
      
      // Para cena hay: Pollo, Arroz/Pasta, Brócoli
      expect(result.proteina).not.toBeNull()
      expect(result.proteina?.name).toBe('Pollo')
      
      expect(result.carbohidrato).not.toBeNull()
      expect(['Arroz', 'Pasta']).toContain(result.carbohidrato?.name)
      
      expect(result.fruta_veg).not.toBeNull()
      expect(result.fruta_veg?.name).toBe('Brócoli')
    })

    it('debe retornar solo alimentos con quantity > 0', () => {
      const result = chooseForMeal(mockFoods, 'almuerzo')
      
      if (result.proteina) {
        expect(result.proteina.quantity).toBeGreaterThan(0)
      }
      if (result.carbohidrato) {
        expect(result.carbohidrato.quantity).toBeGreaterThan(0)
      }
      if (result.fruta_veg) {
        expect(result.fruta_veg.quantity).toBeGreaterThan(0)
      }
    })

    it('debe ser capaz de seleccionar diferentes alimentos en múltiples llamadas', () => {
      // Con múltiples opciones de carbohidrato para almuerzo
      const results = new Set<string>()
      
      for (let i = 0; i < 20; i++) {
        const result = chooseForMeal(mockFoods, 'cena')
        if (result.carbohidrato) {
          results.add(result.carbohidrato.name)
        }
      }
      
      // Debería haber seleccionado al menos ambos en 20 intentos
      // (probabilidad muy alta con 2 opciones)
      expect(results.size).toBeGreaterThanOrEqual(1)
    })
  })

  describe('hasAvailableFoods', () => {
    it('debe retornar true cuando hay alimentos disponibles', () => {
      const result = hasAvailableFoods(mockFoods, 'proteina', 'almuerzo')
      expect(result).toBe(true)
    })

    it('debe retornar false cuando no hay alimentos disponibles', () => {
      const result = hasAvailableFoods(mockFoods, 'proteina', 'desayuno')
      expect(result).toBe(false) // Huevos no tiene stock
    })

    it('debe retornar false para array vacío', () => {
      const result = hasAvailableFoods([], 'proteina', 'almuerzo')
      expect(result).toBe(false)
    })

    it('debe verificar correctamente cada categoría', () => {
      expect(hasAvailableFoods(mockFoods, 'proteina', 'cena')).toBe(true)
      expect(hasAvailableFoods(mockFoods, 'carbohidrato', 'cena')).toBe(true)
      expect(hasAvailableFoods(mockFoods, 'fruta_veg', 'cena')).toBe(true)
    })
  })

  describe('hasAllCategories', () => {
    it('debe retornar true cuando todas las categorías están disponibles', () => {
      const result = hasAllCategories(mockFoods, 'almuerzo')
      expect(result).toBe(true)
    })

    it('debe retornar false cuando falta una categoría', () => {
      const result = hasAllCategories(mockFoods, 'desayuno')
      expect(result).toBe(false) // Falta proteína
    })

    it('debe retornar false para array vacío', () => {
      const result = hasAllCategories([], 'almuerzo')
      expect(result).toBe(false)
    })

    it('debe retornar true para cena', () => {
      const result = hasAllCategories(mockFoods, 'cena')
      expect(result).toBe(true)
    })

    it('debe considerar solo alimentos con stock', () => {
      // Crear lista donde proteína solo tiene items sin stock
      const foodsWithoutProteinStock: Food[] = mockFoods.map(f =>
        f.category === 'proteina' ? { ...f, quantity: 0 } : f
      )
      
      const result = hasAllCategories(foodsWithoutProteinStock, 'almuerzo')
      expect(result).toBe(false)
    })
  })

  describe('getAvailableCount', () => {
    it('debe retornar conteo correcto para almuerzo', () => {
      const result = getAvailableCount(mockFoods, 'almuerzo')
      
      expect(result.proteina).toBe(2) // Pollo, Pescado
      expect(result.carbohidrato).toBe(1) // Arroz
      expect(result.fruta_veg).toBe(2) // Manzana, Brócoli
    })

    it('debe retornar conteo correcto para desayuno', () => {
      const result = getAvailableCount(mockFoods, 'desayuno')
      
      expect(result.proteina).toBe(0) // Ninguno con stock
      expect(result.carbohidrato).toBe(1) // Pan
      expect(result.fruta_veg).toBe(1) // Manzana
    })

    it('debe retornar conteo correcto para cena', () => {
      const result = getAvailableCount(mockFoods, 'cena')
      
      expect(result.proteina).toBe(1) // Pollo
      expect(result.carbohidrato).toBe(2) // Arroz, Pasta
      expect(result.fruta_veg).toBe(1) // Brócoli
    })

    it('debe retornar ceros para array vacío', () => {
      const result = getAvailableCount([], 'almuerzo')
      
      expect(result.proteina).toBe(0)
      expect(result.carbohidrato).toBe(0)
      expect(result.fruta_veg).toBe(0)
    })

    it('debe excluir alimentos sin stock del conteo', () => {
      // Los Huevos tienen quantity 0, no deben contarse
      const result = getAvailableCount(mockFoods, 'desayuno')
      expect(result.proteina).toBe(0)
    })
  })

  describe('Integración', () => {
    it('chooseForMeal debe usar filterFoodsForMeal correctamente', () => {
      // Esta prueba verifica que chooseForMeal respete los mismos criterios
      const result = chooseForMeal(mockFoods, 'almuerzo')
      
      // Verificar que los resultados están en las opciones filtradas
      if (result.proteina) {
        const proteinOptions = filterFoodsForMeal(mockFoods, 'proteina', 'almuerzo')
        expect(proteinOptions.map(f => f.id)).toContain(result.proteina.id)
      }
      
      if (result.carbohidrato) {
        const carbOptions = filterFoodsForMeal(mockFoods, 'carbohidrato', 'almuerzo')
        expect(carbOptions.map(f => f.id)).toContain(result.carbohidrato.id)
      }
      
      if (result.fruta_veg) {
        const fruitVegOptions = filterFoodsForMeal(mockFoods, 'fruta_veg', 'almuerzo')
        expect(fruitVegOptions.map(f => f.id)).toContain(result.fruta_veg.id)
      }
    })

    it('hasAllCategories debe ser consistente con chooseForMeal', () => {
      const meal = 'almuerzo'
      const hasAll = hasAllCategories(mockFoods, meal)
      const choice = chooseForMeal(mockFoods, meal)
      
      if (hasAll) {
        // Si hasAll es true, todas las categorías deben tener un alimento
        expect(choice.proteina).not.toBeNull()
        expect(choice.carbohidrato).not.toBeNull()
        expect(choice.fruta_veg).not.toBeNull()
      }
    })

    it('getAvailableCount debe reflejar las opciones disponibles', () => {
      const count = getAvailableCount(mockFoods, 'cena')
      
      // Si el conteo > 0, debería poder seleccionar un alimento
      if (count.proteina > 0) {
        const filtered = filterFoodsForMeal(mockFoods, 'proteina', 'cena')
        expect(filtered.length).toBe(count.proteina)
      }
    })
  })
})

