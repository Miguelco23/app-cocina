import type { Food, Category, Meal } from '../types'
import { CATEGORY_OPTIONS, MEAL_OPTIONS, UNIT_OPTIONS } from '../types'

/**
 * Valida si un objeto tiene la estructura de un Food
 */
export function isValidFood(obj: any): obj is Food {
  if (!obj || typeof obj !== 'object') return false

  // Verificar campos requeridos
  if (typeof obj.id !== 'string') return false
  if (typeof obj.name !== 'string' || obj.name.trim() === '') return false
  if (typeof obj.quantity !== 'number' || obj.quantity < 0) return false
  if (typeof obj.unit !== 'string') return false

  // Verificar categoría válida
  if (!CATEGORY_OPTIONS.includes(obj.category)) return false

  // Verificar meals array
  if (!Array.isArray(obj.meals)) return false
  if (!obj.meals.every((meal: any) => MEAL_OPTIONS.includes(meal))) return false

  // Verificar notes (opcional)
  if (obj.notes !== undefined && typeof obj.notes !== 'string') return false

  return true
}

/**
 * Valida un array de alimentos
 */
export function validateFoodsArray(data: any): { valid: boolean; foods: Food[]; errors: string[] } {
  const errors: string[] = []

  // Verificar que sea un array
  if (!Array.isArray(data)) {
    errors.push('El archivo JSON debe contener un array de alimentos')
    return { valid: false, foods: [], errors }
  }

  // Verificar que no esté vacío
  if (data.length === 0) {
    errors.push('El array de alimentos está vacío')
    return { valid: false, foods: [], errors }
  }

  // Validar cada alimento
  const validFoods: Food[] = []
  data.forEach((item, index) => {
    if (!isValidFood(item)) {
      errors.push(`Alimento en posición ${index} es inválido: ${JSON.stringify(item)}`)
    } else {
      validFoods.push(item)
    }
  })

  return {
    valid: errors.length === 0,
    foods: validFoods,
    errors
  }
}

/**
 * Exporta la lista de alimentos a un archivo JSON
 */
export function exportToJSON(foods: Food[], filename: string = 'alimentos.json'): void {
  try {
    // Convertir a JSON con formato bonito
    const jsonString = JSON.stringify(foods, null, 2)

    // Crear blob
    const blob = new Blob([jsonString], { type: 'application/json' })

    // Crear enlace de descarga
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename

    // Simular click para descargar
    document.body.appendChild(link)
    link.click()

    // Limpiar
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error al exportar JSON:', error)
    throw new Error('No se pudo exportar el archivo')
  }
}

/**
 * Lee un archivo JSON y retorna los alimentos validados
 */
export function importFromJSON(file: File): Promise<{ valid: boolean; foods: Food[]; errors: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        
        // Parsear JSON
        let data: any
        try {
          data = JSON.parse(content)
        } catch (parseError) {
          resolve({
            valid: false,
            foods: [],
            errors: ['El archivo no contiene JSON válido']
          })
          return
        }

        // Validar estructura
        const validation = validateFoodsArray(data)
        resolve(validation)
      } catch (error) {
        reject(new Error('Error al leer el archivo'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'))
    }

    reader.readAsText(file)
  })
}

/**
 * Genera un nombre de archivo con timestamp
 */
export function generateExportFilename(prefix: string = 'alimentos'): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')

  return `${prefix}_${year}${month}${day}_${hours}${minutes}.json`
}

/**
 * Combina alimentos importados con existentes
 * Evita duplicados por ID
 */
export function mergeFoods(existing: Food[], imported: Food[]): Food[] {
  const existingIds = new Set(existing.map(f => f.id))
  const uniqueImported = imported.filter(f => !existingIds.has(f.id))
  
  return [...existing, ...uniqueImported]
}

/**
 * Reemplaza todos los alimentos con los importados
 */
export function replaceFoods(imported: Food[]): Food[] {
  // Crear copia profunda para evitar mutaciones
  return imported.map(food => ({ ...food }))
}

