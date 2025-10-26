import { useState } from 'react'
import { Roulette, RouletteResult } from './Roulette'
import { useStorage } from '../hooks/useStorage'
import type { Food, Meal } from '../types'

/**
 * Ejemplo de uso del componente Roulette
 * Demuestra selección aleatoria de alimentos con animaciones
 */
export function RouletteExample() {
  const [foods] = useStorage<Food[]>('foods-list', [])
  const [selectedMeal, setSelectedMeal] = useState<Meal>('almuerzo')
  const [history, setHistory] = useState<Array<{ meal: Meal; result: RouletteResult; timestamp: Date }>>([])
  const [showRoulette, setShowRoulette] = useState(true)

  const handleResult = (result: RouletteResult) => {
    // Guardar en historial
    setHistory(prev => [
      ...prev,
      {
        meal: selectedMeal,
        result,
        timestamp: new Date()
      }
    ])
  }

  const handleReset = () => {
    setShowRoulette(false)
    setTimeout(() => setShowRoulette(true), 10)
  }

  const clearHistory = () => {
    if (confirm('¿Deseas limpiar todo el historial?')) {
      setHistory([])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-8">
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
              🎰 Ruleta de Alimentos
            </h1>
            <p className="text-white text-lg">
              Selección aleatoria de comidas completas con animaciones
            </p>
          </div>
        </div>

        {/* Selector de comida */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Selecciona la Comida
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {(['desayuno', 'almuerzo', 'cena'] as Meal[]).map((meal) => (
              <button
                key={meal}
                onClick={() => setSelectedMeal(meal)}
                className={`py-3 px-6 rounded-lg font-bold text-lg transition transform hover:scale-105 ${
                  selectedMeal === meal
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {meal === 'desayuno' && '🌅 Desayuno'}
                {meal === 'almuerzo' && '☀️ Almuerzo'}
                {meal === 'cena' && '🌙 Cena'}
              </button>
            ))}
          </div>
        </div>

        {/* Información de alimentos disponibles */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            📊 Alimentos Disponibles para {selectedMeal}
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            {['proteina', 'carbohidrato', 'fruta_veg'].map((category) => {
              const available = foods.filter(
                f => f.category === category && f.quantity > 0 && f.meals.includes(selectedMeal)
              ).length
              return (
                <div key={category} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-2xl font-bold text-gray-800">{available}</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {category === 'fruta_veg' ? 'Frutas/Veg' : category}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Componente Roulette */}
        {showRoulette && (
          <div className="mb-8">
            <Roulette
              foods={foods}
              meal={selectedMeal}
              onResult={handleResult}
              onReset={handleReset}
            />
          </div>
        )}

        {/* Historial de selecciones */}
        {history.length > 0 && (
          <div className="bg-white rounded-lg shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                📜 Historial de Selecciones
              </h3>
              <button
                onClick={clearHistory}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Limpiar Historial
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {history.slice().reverse().map((entry, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-bold text-gray-800 capitalize">
                      {entry.meal === 'desayuno' && '🌅 Desayuno'}
                      {entry.meal === 'almuerzo' && '☀️ Almuerzo'}
                      {entry.meal === 'cena' && '🌙 Cena'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {entry.timestamp.toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="bg-red-50 rounded p-2">
                      <p className="text-xs font-semibold text-red-700">🥩 Proteína</p>
                      <p className="font-medium text-gray-800">
                        {entry.result.proteina?.name || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-yellow-50 rounded p-2">
                      <p className="text-xs font-semibold text-yellow-700">🍞 Carbohidrato</p>
                      <p className="font-medium text-gray-800">
                        {entry.result.carbohidrato?.name || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded p-2">
                      <p className="text-xs font-semibold text-green-700">🥗 Fruta/Veg</p>
                      <p className="font-medium text-gray-800">
                        {entry.result.fruta_veg?.name || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t text-center">
              <p className="text-sm text-gray-600">
                Total de comidas generadas: <strong>{history.length}</strong>
              </p>
            </div>
          </div>
        )}

        {/* Mensaje si no hay alimentos */}
        {foods.length === 0 && (
          <div className="bg-white rounded-lg shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No hay alimentos registrados
            </h3>
            <p className="text-gray-600 mb-6">
              Primero necesitas agregar alimentos a tu inventario para usar la ruleta.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Ir a Gestión de Alimentos
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

