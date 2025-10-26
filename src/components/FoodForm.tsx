import { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import type { Food, CreateFood, Category, Meal, Unit } from '../types'
import { 
  CATEGORY_OPTIONS, 
  MEAL_OPTIONS, 
  UNIT_OPTIONS, 
  CATEGORY_METADATA, 
  MEAL_METADATA 
} from '../types'

export interface FoodFormProps {
  /** Alimento a editar (si existe) */
  initialFood?: Food | null
  /** Callback al guardar el alimento */
  onSave: (food: CreateFood | Food) => void
  /** Callback al cancelar */
  onCancel?: () => void
  /** Texto del botón de guardar */
  submitButtonText?: string
}

interface FormErrors {
  name?: string
  quantity?: string
}

export function FoodForm({ 
  initialFood, 
  onSave, 
  onCancel,
  submitButtonText = 'Guardar'
}: FoodFormProps) {
  const [formData, setFormData] = useState<CreateFood>({
    name: '',
    category: 'proteina',
    meals: [],
    quantity: 0,
    unit: 'gramos',
    notes: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Cargar datos iniciales si se está editando
  useEffect(() => {
    if (initialFood) {
      setFormData({
        name: initialFood.name,
        category: initialFood.category,
        meals: initialFood.meals,
        quantity: initialFood.quantity,
        unit: initialFood.unit,
        notes: initialFood.notes || ''
      })
    }
  }, [initialFood])

  // Validación
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    // Validar cantidad
    if (formData.quantity < 0) {
      newErrors.quantity = 'La cantidad debe ser mayor o igual a 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Validar campo individual
  const validateField = (field: keyof FormErrors, value: any) => {
    const newErrors = { ...errors }

    if (field === 'name') {
      if (!value.trim()) {
        newErrors.name = 'El nombre es requerido'
      } else {
        delete newErrors.name
      }
    }

    if (field === 'quantity') {
      if (value < 0) {
        newErrors.quantity = 'La cantidad debe ser mayor o igual a 0'
      } else {
        delete newErrors.quantity
      }
    }

    setErrors(newErrors)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (touched[name]) {
      validateField(name as keyof FormErrors, value)
    }
  }

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0
    setFormData(prev => ({ ...prev, quantity: value }))
    
    if (touched.quantity) {
      validateField('quantity', value)
    }
  }

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleMealToggle = (meal: Meal) => {
    setFormData(prev => {
      const meals = prev.meals.includes(meal)
        ? prev.meals.filter(m => m !== meal)
        : [...prev.meals, meal]
      return { ...prev, meals }
    })
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    // Marcar todos los campos como tocados
    setTouched({ name: true, quantity: true })

    if (validateForm()) {
      if (initialFood) {
        // Modo edición: incluir el ID
        onSave({ ...initialFood, ...formData })
      } else {
        // Modo creación: sin ID
        onSave(formData)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {initialFood ? 'Editar Alimento' : 'Nuevo Alimento'}
        </h2>
      </div>

      {/* Nombre */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nombre del Alimento <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          onBlur={() => handleBlur('name')}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
            errors.name && touched.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ej: Pechuga de Pollo"
        />
        {errors.name && touched.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Categoría */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Categoría
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleSelectChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        >
          {CATEGORY_OPTIONS.map(cat => (
            <option key={cat} value={cat}>
              {CATEGORY_METADATA[cat].icon} {CATEGORY_METADATA[cat].label}
            </option>
          ))}
        </select>
      </div>

      {/* Comidas (Checkboxes) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comidas
        </label>
        <div className="space-y-2">
          {MEAL_OPTIONS.map(meal => (
            <label
              key={meal}
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
            >
              <input
                type="checkbox"
                checked={formData.meals.includes(meal)}
                onChange={() => handleMealToggle(meal)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="flex items-center space-x-2">
                <span>{MEAL_METADATA[meal].icon}</span>
                <span className="text-gray-700">{MEAL_METADATA[meal].label}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Cantidad y Unidad */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
            Cantidad <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleNumberChange}
            onBlur={() => handleBlur('quantity')}
            min="0"
            step="0.1"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors.quantity && touched.quantity ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0"
          />
          {errors.quantity && touched.quantity && (
            <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
          )}
        </div>

        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-2">
            Unidad
          </label>
          <select
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleSelectChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            {UNIT_OPTIONS.map(unit => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notas */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Notas (opcional)
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
          placeholder="Información adicional sobre el alimento..."
        />
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4 border-t">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {submitButtonText}
        </button>
      </div>
    </form>
  )
}

