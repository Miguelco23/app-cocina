import { useState, useMemo } from 'react'
import type { Food, Meal, Category } from '../types'
import { CATEGORY_METADATA, MEAL_METADATA, CATEGORY_OPTIONS, MEAL_OPTIONS } from '../types'

export interface FoodListProps {
  /** Lista de alimentos a mostrar */
  foods: Food[]
  /** Callback al editar un alimento */
  onEdit?: (food: Food) => void
  /** Callback al eliminar un alimento */
  onDelete?: (id: string) => void
  /** Callback al decrementar stock */
  onDecrement?: (food: Food) => void
  /** Mostrar mensaje cuando no hay alimentos */
  emptyMessage?: string
}

export function FoodList({
  foods,
  onEdit,
  onDelete,
  onDecrement,
  emptyMessage = 'No hay alimentos para mostrar'
}: FoodListProps) {
  const [selectedMeal, setSelectedMeal] = useState<Meal | 'all'>('all')
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all')

  // Filtrar alimentos según los filtros seleccionados
  const filteredFoods = useMemo(() => {
    return foods.filter(food => {
      // Filtro por comida
      const mealMatch = selectedMeal === 'all' || food.meals.includes(selectedMeal)
      
      // Filtro por categoría
      const categoryMatch = selectedCategory === 'all' || food.category === selectedCategory
      
      return mealMatch && categoryMatch
    })
  }, [foods, selectedMeal, selectedCategory])

  // Manejar eliminación con confirmación
  const handleDelete = (food: Food) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${food.name}"?`)) {
      onDelete?.(food.id)
    }
  }

  // Manejar decremento de stock
  const handleDecrement = (food: Food) => {
    if (food.quantity > 0) {
      onDecrement?.(food)
    }
  }

  // Limpiar filtros
  const clearFilters = () => {
    setSelectedMeal('all')
    setSelectedCategory('all')
  }

  const hasActiveFilters = selectedMeal !== 'all' || selectedCategory !== 'all'

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Filtros
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Filtro por Comida */}
          <div>
            <label htmlFor="meal-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Comida
            </label>
            <select
              id="meal-filter"
              value={selectedMeal}
              onChange={(e) => setSelectedMeal(e.target.value as Meal | 'all')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="all">Todas las comidas</option>
              {MEAL_OPTIONS.map(meal => (
                <option key={meal} value={meal}>
                  {MEAL_METADATA[meal].icon} {MEAL_METADATA[meal].label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Categoría */}
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Categoría
            </label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as Category | 'all')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="all">Todas las categorías</option>
              {CATEGORY_OPTIONS.map(category => (
                <option key={category} value={category}>
                  {CATEGORY_METADATA[category].icon} {CATEGORY_METADATA[category].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Indicador de filtros activos */}
        {hasActiveFilters && (
          <div className="mt-4 flex items-center justify-between bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-700">
              Mostrando {filteredFoods.length} de {foods.length} alimentos
            </p>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium underline"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Lista de alimentos */}
      <div className="space-y-3">
        {filteredFoods.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-gray-500 text-lg">{emptyMessage}</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
              >
                Ver todos los alimentos
              </button>
            )}
          </div>
        ) : (
          filteredFoods.map(food => (
            <div
              key={food.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Información del alimento */}
                <div className="flex-1 space-y-2">
                  {/* Nombre y Categoría */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-lg font-bold text-gray-800">
                      {food.name}
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${CATEGORY_METADATA[food.category].color}`}>
                      {CATEGORY_METADATA[food.category].icon} {CATEGORY_METADATA[food.category].label}
                    </span>
                  </div>

                  {/* Cantidad */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Cantidad:
                    </span>
                    <span className={`text-sm font-bold ${food.quantity === 0 ? 'text-red-600' : 'text-gray-900'}`}>
                      {food.quantity} {food.unit}
                    </span>
                    {food.quantity === 0 && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        Sin stock
                      </span>
                    )}
                  </div>

                  {/* Comidas */}
                  {food.meals.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {food.meals.map(meal => (
                        <span
                          key={meal}
                          className={`text-xs px-2 py-1 rounded-full ${MEAL_METADATA[meal].color}`}
                        >
                          {MEAL_METADATA[meal].icon} {MEAL_METADATA[meal].label}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Notas */}
                  {food.notes && (
                    <p className="text-sm text-gray-600 italic">
                      "{food.notes}"
                    </p>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="flex md:flex-col gap-2">
                  {/* Decrementar stock */}
                  {onDecrement && (
                    <button
                      onClick={() => handleDecrement(food)}
                      disabled={food.quantity === 0}
                      className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
                        food.quantity === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                      }`}
                      title={food.quantity === 0 ? 'Sin stock para decrementar' : 'Decrementar cantidad'}
                    >
                      ➖ Stock
                    </button>
                  )}

                  {/* Editar */}
                  {onEdit && (
                    <button
                      onClick={() => onEdit(food)}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-medium text-sm"
                    >
                      ✏️ Editar
                    </button>
                  )}

                  {/* Eliminar */}
                  {onDelete && (
                    <button
                      onClick={() => handleDelete(food)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium text-sm"
                    >
                      🗑️ Eliminar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Resumen */}
      {foods.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600">
            Total de alimentos: <strong>{foods.length}</strong>
            {hasActiveFilters && ` • Filtrados: ${filteredFoods.length}`}
          </p>
        </div>
      )}
    </div>
  )
}

