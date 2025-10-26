import { describe, it, expect } from 'vitest'
import type { Food, Category, Meal, CreateFood, UpdateFood } from './types'
import { CATEGORY_METADATA, MEAL_METADATA, CATEGORY_OPTIONS, MEAL_OPTIONS, UNIT_OPTIONS } from './types'

describe('Types', () => {
  describe('Food', () => {
    it('debe crear un objeto Food válido', () => {
      const food: Food = {
        id: '123',
        name: 'Pollo',
        category: 'proteina',
        meals: ['almuerzo', 'cena'],
        quantity: 200,
        unit: 'gramos',
        notes: 'Pollo a la plancha'
      }

      expect(food.id).toBe('123')
      expect(food.name).toBe('Pollo')
      expect(food.category).toBe('proteina')
      expect(food.meals).toHaveLength(2)
    })

    it('debe permitir notes opcional', () => {
      const food: Food = {
        id: '456',
        name: 'Arroz',
        category: 'carbohidrato',
        meals: ['almuerzo'],
        quantity: 100,
        unit: 'gramos'
      }

      expect(food.notes).toBeUndefined()
    })

    it('debe aceptar todas las categorías válidas', () => {
      const categorias: Category[] = ['proteina', 'carbohidrato', 'fruta_veg']
      
      categorias.forEach(cat => {
        const food: Food = {
          id: '1',
          name: 'Test',
          category: cat,
          meals: ['desayuno'],
          quantity: 1,
          unit: 'unidades'
        }
        expect(food.category).toBe(cat)
      })
    })

    it('debe aceptar todas las comidas válidas', () => {
      const comidas: Meal[] = ['desayuno', 'almuerzo', 'cena']
      
      comidas.forEach(meal => {
        const food: Food = {
          id: '1',
          name: 'Test',
          category: 'proteina',
          meals: [meal],
          quantity: 1,
          unit: 'unidades'
        }
        expect(food.meals).toContain(meal)
      })
    })

    it('debe permitir múltiples comidas', () => {
      const food: Food = {
        id: '1',
        name: 'Huevos',
        category: 'proteina',
        meals: ['desayuno', 'almuerzo', 'cena'],
        quantity: 2,
        unit: 'unidades'
      }

      expect(food.meals).toHaveLength(3)
    })
  })

  describe('CreateFood', () => {
    it('debe crear un CreateFood sin ID', () => {
      const newFood: CreateFood = {
        name: 'Manzana',
        category: 'fruta_veg',
        meals: ['desayuno'],
        quantity: 1,
        unit: 'unidades',
        notes: 'Fruta fresca'
      }

      expect(newFood).not.toHaveProperty('id')
      expect(newFood.name).toBe('Manzana')
    })
  })

  describe('UpdateFood', () => {
    it('debe permitir actualizar campos parcialmente', () => {
      const update: UpdateFood = {
        id: '123',
        name: 'Pollo actualizado',
        quantity: 250
      }

      expect(update.id).toBe('123')
      expect(update.name).toBe('Pollo actualizado')
      expect(update.category).toBeUndefined()
    })

    it('debe requerir el ID', () => {
      const update: UpdateFood = {
        id: '456',
        notes: 'Nueva nota'
      }

      expect(update.id).toBeDefined()
    })
  })

  describe('CATEGORY_METADATA', () => {
    it('debe tener metadata para todas las categorías', () => {
      expect(CATEGORY_METADATA.proteina).toBeDefined()
      expect(CATEGORY_METADATA.carbohidrato).toBeDefined()
      expect(CATEGORY_METADATA.fruta_veg).toBeDefined()
    })

    it('debe tener label, color e icon para cada categoría', () => {
      Object.values(CATEGORY_METADATA).forEach(meta => {
        expect(meta.label).toBeDefined()
        expect(meta.color).toBeDefined()
        expect(meta.icon).toBeDefined()
      })
    })
  })

  describe('MEAL_METADATA', () => {
    it('debe tener metadata para todas las comidas', () => {
      expect(MEAL_METADATA.desayuno).toBeDefined()
      expect(MEAL_METADATA.almuerzo).toBeDefined()
      expect(MEAL_METADATA.cena).toBeDefined()
    })

    it('debe tener label, color e icon para cada comida', () => {
      Object.values(MEAL_METADATA).forEach(meta => {
        expect(meta.label).toBeDefined()
        expect(meta.color).toBeDefined()
        expect(meta.icon).toBeDefined()
      })
    })
  })

  describe('Opciones constantes', () => {
    it('CATEGORY_OPTIONS debe contener todas las categorías', () => {
      expect(CATEGORY_OPTIONS).toHaveLength(3)
      expect(CATEGORY_OPTIONS).toContain('proteina')
      expect(CATEGORY_OPTIONS).toContain('carbohidrato')
      expect(CATEGORY_OPTIONS).toContain('fruta_veg')
    })

    it('MEAL_OPTIONS debe contener todas las comidas', () => {
      expect(MEAL_OPTIONS).toHaveLength(3)
      expect(MEAL_OPTIONS).toContain('desayuno')
      expect(MEAL_OPTIONS).toContain('almuerzo')
      expect(MEAL_OPTIONS).toContain('cena')
    })

    it('UNIT_OPTIONS debe contener unidades válidas', () => {
      expect(UNIT_OPTIONS.length).toBeGreaterThan(0)
      expect(UNIT_OPTIONS).toContain('gramos')
      expect(UNIT_OPTIONS).toContain('kilogramos')
      expect(UNIT_OPTIONS).toContain('litros')
      expect(UNIT_OPTIONS).toContain('unidades')
    })
  })
})

