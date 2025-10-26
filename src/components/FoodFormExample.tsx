import { useState } from 'react'
import { FoodForm } from './FoodForm'
import { FoodList } from './FoodList'
import { useStorage } from '../hooks/useStorage'
import type { Food, CreateFood } from '../types'

/**
 * Ejemplo completo de uso del componente FoodForm
 * Demuestra cómo crear, editar y listar alimentos
 */
export function FoodFormExample() {
  const [foods, setFoods] = useStorage<Food[]>('foods-list', [])
  const [editingFood, setEditingFood] = useState<Food | null>(null)
  const [showForm, setShowForm] = useState(false)

  // Generar ID único
  const generateId = (): string => {
    return `food-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Manejar creación/edición
  const handleSave = (foodData: CreateFood | Food) => {
    if ('id' in foodData) {
      // Modo edición
      setFoods(prev => prev.map(f => f.id === foodData.id ? foodData : f))
    } else {
      // Modo creación
      const newFood: Food = {
        ...foodData,
        id: generateId()
      }
      setFoods(prev => [...prev, newFood])
    }

    setShowForm(false)
    setEditingFood(null)
  }

  // Manejar cancelación
  const handleCancel = () => {
    setShowForm(false)
    setEditingFood(null)
  }

  // Editar alimento
  const handleEdit = (food: Food) => {
    setEditingFood(food)
    setShowForm(true)
  }

  // Eliminar alimento
  const handleDelete = (id: string) => {
    setFoods(prev => prev.filter(f => f.id !== id))
  }

  // Decrementar stock
  const handleDecrement = (food: Food) => {
    setFoods(prev => prev.map(f => 
      f.id === food.id 
        ? { ...f, quantity: Math.max(0, f.quantity - 1) } 
        : f
    ))
  }

  // Crear nuevo alimento
  const handleNew = () => {
    setEditingFood(null)
    setShowForm(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => window.location.reload()}
            className="mb-4 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            ← Volver al inicio
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
              Gestión de Alimentos 🍽️
            </h1>
            <p className="text-white text-lg">
              Ejemplo completo de uso del componente FoodForm
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario */}
          <div>
            {showForm ? (
              <FoodForm
                initialFood={editingFood}
                onSave={handleSave}
                onCancel={handleCancel}
                submitButtonText={editingFood ? 'Actualizar' : 'Crear Alimento'}
              />
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <div className="mb-6">
                  <div className="text-6xl mb-4">🍴</div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Agregar Nuevo Alimento
                  </h2>
                  <p className="text-gray-600">
                    Crea un nuevo alimento para tu registro
                  </p>
                </div>
                <button
                  onClick={handleNew}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  + Nuevo Alimento
                </button>

                {foods.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <p className="text-sm text-gray-600">
                      Total de alimentos: <strong>{foods.length}</strong>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Lista de alimentos */}
          <div>
            <FoodList
              foods={foods}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDecrement={handleDecrement}
              emptyMessage="No hay alimentos registrados. ¡Crea tu primer alimento!"
            />
          </div>
        </div>

        {/* Datos almacenados (debug) */}
        {foods.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Datos en localStorage (debug)
            </h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
              {JSON.stringify(foods, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

