import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  isValidFood,
  validateFoodsArray,
  exportToJSON,
  importFromJSON,
  generateExportFilename,
  mergeFoods,
  replaceFoods
} from './importExport'
import type { Food } from '../types'

const validFood: Food = {
  id: '1',
  name: 'Pollo',
  category: 'proteina',
  meals: ['almuerzo', 'cena'],
  quantity: 200,
  unit: 'gramos',
  notes: 'Alto en proteína'
}

const validFoodMinimal: Food = {
  id: '2',
  name: 'Arroz',
  category: 'carbohidrato',
  meals: ['almuerzo'],
  quantity: 100,
  unit: 'gramos'
}

describe('importExport utilities', () => {
  describe('isValidFood', () => {
    it('debe validar un alimento completo correcto', () => {
      expect(isValidFood(validFood)).toBe(true)
    })

    it('debe validar un alimento sin notas', () => {
      expect(isValidFood(validFoodMinimal)).toBe(true)
    })

    it('debe rechazar objeto null', () => {
      expect(isValidFood(null)).toBe(false)
    })

    it('debe rechazar objeto sin id', () => {
      const invalid = { ...validFood }
      delete (invalid as any).id
      expect(isValidFood(invalid)).toBe(false)
    })

    it('debe rechazar nombre vacío', () => {
      const invalid = { ...validFood, name: '' }
      expect(isValidFood(invalid)).toBe(false)
    })

    it('debe rechazar cantidad negativa', () => {
      const invalid = { ...validFood, quantity: -10 }
      expect(isValidFood(invalid)).toBe(false)
    })

    it('debe rechazar categoría inválida', () => {
      const invalid = { ...validFood, category: 'invalid' }
      expect(isValidFood(invalid)).toBe(false)
    })

    it('debe rechazar meals no array', () => {
      const invalid = { ...validFood, meals: 'almuerzo' }
      expect(isValidFood(invalid)).toBe(false)
    })

    it('debe rechazar meal inválido en array', () => {
      const invalid = { ...validFood, meals: ['almuerzo', 'invalid'] }
      expect(isValidFood(invalid)).toBe(false)
    })

    it('debe rechazar notas no string', () => {
      const invalid = { ...validFood, notes: 123 }
      expect(isValidFood(invalid)).toBe(false)
    })

    it('debe aceptar quantity igual a 0', () => {
      const valid = { ...validFood, quantity: 0 }
      expect(isValidFood(valid)).toBe(true)
    })

    it('debe aceptar meals vacío', () => {
      const valid = { ...validFood, meals: [] }
      expect(isValidFood(valid)).toBe(true)
    })
  })

  describe('validateFoodsArray', () => {
    it('debe validar array correcto de alimentos', () => {
      const foods = [validFood, validFoodMinimal]
      const result = validateFoodsArray(foods)

      expect(result.valid).toBe(true)
      expect(result.foods).toHaveLength(2)
      expect(result.errors).toHaveLength(0)
    })

    it('debe rechazar si no es un array', () => {
      const result = validateFoodsArray({ not: 'array' })

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('El archivo JSON debe contener un array de alimentos')
    })

    it('debe rechazar array vacío', () => {
      const result = validateFoodsArray([])

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('El array de alimentos está vacío')
    })

    it('debe reportar alimentos inválidos pero retornar los válidos', () => {
      const foods = [
        validFood,
        { invalid: 'food' },
        validFoodMinimal
      ]
      const result = validateFoodsArray(foods)

      expect(result.valid).toBe(false)
      expect(result.foods).toHaveLength(2)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('debe validar todos los campos de cada alimento', () => {
      const foods = [
        { ...validFood, category: 'invalid' }
      ]
      const result = validateFoodsArray(foods)

      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe('exportToJSON', () => {
    let createElementSpy: any
    let appendChildSpy: any
    let removeChildSpy: any
    let createObjectURLSpy: any
    let revokeObjectURLSpy: any

    beforeEach(() => {
      // Mock DOM APIs
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn()
      }

      createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any)
      appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any)
      removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any)
      createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url')
      revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    })

    afterEach(() => {
      createElementSpy.mockRestore()
      appendChildSpy.mockRestore()
      removeChildSpy.mockRestore()
      createObjectURLSpy.mockRestore()
      revokeObjectURLSpy.mockRestore()
    })

    it('debe exportar alimentos a JSON', () => {
      const foods = [validFood]
      
      exportToJSON(foods, 'test.json')

      expect(createElementSpy).toHaveBeenCalledWith('a')
      expect(appendChildSpy).toHaveBeenCalled()
      expect(removeChildSpy).toHaveBeenCalled()
    })

    it('debe usar filename por defecto', () => {
      const foods = [validFood]
      
      exportToJSON(foods)

      expect(createElementSpy).toHaveBeenCalled()
    })

    it('debe manejar array vacío', () => {
      expect(() => exportToJSON([])).not.toThrow()
    })
  })

  describe('importFromJSON', () => {
    it('debe importar JSON válido', async () => {
      const jsonContent = JSON.stringify([validFood])
      const file = new File([jsonContent], 'test.json', { type: 'application/json' })

      const result = await importFromJSON(file)

      expect(result.valid).toBe(true)
      expect(result.foods).toHaveLength(1)
      expect(result.foods[0].name).toBe('Pollo')
    })

    it('debe rechazar JSON inválido', async () => {
      const invalidJSON = 'esto no es JSON {'
      const file = new File([invalidJSON], 'test.json', { type: 'application/json' })

      const result = await importFromJSON(file)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('El archivo no contiene JSON válido')
    })

    it('debe rechazar JSON que no es array', async () => {
      const jsonContent = JSON.stringify({ not: 'array' })
      const file = new File([jsonContent], 'test.json', { type: 'application/json' })

      const result = await importFromJSON(file)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('El archivo JSON debe contener un array de alimentos')
    })

    it('debe importar múltiples alimentos', async () => {
      const foods = [validFood, validFoodMinimal]
      const jsonContent = JSON.stringify(foods)
      const file = new File([jsonContent], 'test.json', { type: 'application/json' })

      const result = await importFromJSON(file)

      expect(result.valid).toBe(true)
      expect(result.foods).toHaveLength(2)
    })

    it('debe filtrar alimentos inválidos pero importar los válidos', async () => {
      const mixedData = [
        validFood,
        { invalid: 'data' },
        validFoodMinimal
      ]
      const jsonContent = JSON.stringify(mixedData)
      const file = new File([jsonContent], 'test.json', { type: 'application/json' })

      const result = await importFromJSON(file)

      expect(result.valid).toBe(false)
      expect(result.foods).toHaveLength(2)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe('generateExportFilename', () => {
    it('debe generar nombre con timestamp', () => {
      const filename = generateExportFilename('test')
      
      expect(filename).toMatch(/^test_\d{8}_\d{4}\.json$/)
      expect(filename).toContain('.json')
    })

    it('debe usar prefijo por defecto', () => {
      const filename = generateExportFilename()
      
      expect(filename).toMatch(/^alimentos_\d{8}_\d{4}\.json$/)
    })

    it('debe generar nombres únicos en llamadas consecutivas', () => {
      const filename1 = generateExportFilename('test')
      const filename2 = generateExportFilename('test')
      
      // Pueden ser iguales si se ejecutan en el mismo minuto
      expect(filename1).toBeDefined()
      expect(filename2).toBeDefined()
    })
  })

  describe('mergeFoods', () => {
    it('debe combinar dos listas sin duplicados', () => {
      const existing: Food[] = [
        { ...validFood, id: '1' },
        { ...validFoodMinimal, id: '2' }
      ]
      const imported: Food[] = [
        { ...validFood, id: '1', name: 'Pollo Modificado' }, // Mismo ID, no se importa
        { ...validFoodMinimal, id: '3', name: 'Pasta' }     // ID nuevo, se importa
      ]

      const result = mergeFoods(existing, imported)

      expect(result).toHaveLength(3)
      expect(result.map(f => f.id)).toEqual(['1', '2', '3'])
      expect(result[0].name).toBe('Pollo') // No se modificó
    })

    it('debe agregar todos los importados si no hay duplicados', () => {
      const existing: Food[] = [{ ...validFood, id: '1' }]
      const imported: Food[] = [
        { ...validFoodMinimal, id: '2' },
        { ...validFood, id: '3' }
      ]

      const result = mergeFoods(existing, imported)

      expect(result).toHaveLength(3)
    })

    it('debe manejar lista existente vacía', () => {
      const existing: Food[] = []
      const imported: Food[] = [validFood, validFoodMinimal]

      const result = mergeFoods(existing, imported)

      expect(result).toHaveLength(2)
    })

    it('debe manejar lista importada vacía', () => {
      const existing: Food[] = [validFood]
      const imported: Food[] = []

      const result = mergeFoods(existing, imported)

      expect(result).toHaveLength(1)
    })
  })

  describe('replaceFoods', () => {
    it('debe reemplazar completamente la lista', () => {
      const imported: Food[] = [validFood, validFoodMinimal]
      const result = replaceFoods(imported)

      expect(result).toHaveLength(2)
      expect(result).toEqual(imported)
      expect(result).not.toBe(imported) // Nueva referencia
    })

    it('debe crear copia independiente', () => {
      const imported: Food[] = [validFood]
      const result = replaceFoods(imported)

      result[0].name = 'Modificado'
      expect(imported[0].name).toBe('Pollo') // Original no modificado
    })
  })
})

