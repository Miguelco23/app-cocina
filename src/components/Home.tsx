import { useState, useRef } from 'react'
import { FoodForm } from './FoodForm'
import { FoodList } from './FoodList'
import { Roulette, RouletteResult } from './Roulette'
import { useStorage } from '../hooks/useStorage'
import type { Food, CreateFood, Meal } from '../types'
import { MEAL_METADATA, MEAL_OPTIONS } from '../types'
import { hasAllCategories } from '../utils/randomPick'
import { 
  exportToJSON, 
  importFromJSON, 
  generateExportFilename,
  mergeFoods,
  replaceFoods 
} from '../utils/importExport'

export function Home() {
  // Estado persistente de alimentos
  const [foods, setFoods] = useStorage<Food[]>('foods-inventory', [])
  
  // Estados locales de UI
  const [showForm, setShowForm] = useState(false)
  const [editingFood, setEditingFood] = useState<Food | null>(null)
  const [showRoulette, setShowRoulette] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState<Meal>('almuerzo')
  const [rouletteResult, setRouletteResult] = useState<RouletteResult | null>(null)
  const [importMessage, setImportMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const [pendingImport, setPendingImport] = useState<Food[] | null>(null)
  
  // Ref para el input de archivo
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Generar ID único para nuevos alimentos
  const generateId = (): string => {
    return `food-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Crear nuevo alimento
  const handleCreateFood = () => {
    setEditingFood(null)
    setShowForm(true)
    setShowRoulette(false)
  }

  // Guardar alimento (crear o editar)
  const handleSaveFood = (foodData: CreateFood | Food) => {
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

  // Cancelar formulario
  const handleCancelForm = () => {
    setShowForm(false)
    setEditingFood(null)
  }

  // Editar alimento
  const handleEditFood = (food: Food) => {
    setEditingFood(food)
    setShowForm(true)
    setShowRoulette(false)
  }

  // Eliminar alimento
  const handleDeleteFood = (id: string) => {
    setFoods(prev => prev.filter(f => f.id !== id))
  }

  // Decrementar stock de un alimento
  const handleDecrementFood = (food: Food) => {
    setFoods(prev => prev.map(f =>
      f.id === food.id
        ? { ...f, quantity: Math.max(0, f.quantity - 1) }
        : f
    ))
  }

  // Mostrar ruleta
  const handleShowRoulette = () => {
    setShowForm(false)
    setShowRoulette(true)
    setRouletteResult(null)
  }

  // Manejar resultado de ruleta
  const handleRouletteResult = (result: RouletteResult) => {
    setRouletteResult(result)
  }

  // Confirmar receta y decrementar stock
  const handleConfirmRecipe = () => {
    if (!rouletteResult) return

    setFoods(prev => prev.map(food => {
      // Decrementar stock de los alimentos seleccionados
      if (
        food.id === rouletteResult.proteina?.id ||
        food.id === rouletteResult.carbohidrato?.id ||
        food.id === rouletteResult.fruta_veg?.id
      ) {
        return { ...food, quantity: Math.max(0, food.quantity - 1) }
      }
      return food
    }))

    // Limpiar resultado y ocultar ruleta
    setRouletteResult(null)
    setShowRoulette(false)
  }

  // Resetear ruleta
  const handleResetRoulette = () => {
    setRouletteResult(null)
  }

  // Exportar alimentos a JSON
  const handleExport = () => {
    try {
      const filename = generateExportFilename('alimentos')
      exportToJSON(foods, filename)
      setImportMessage({ type: 'success', text: `✅ Exportado: ${foods.length} alimentos` })
      setTimeout(() => setImportMessage(null), 3000)
    } catch (error) {
      setImportMessage({ type: 'error', text: '❌ Error al exportar' })
      setTimeout(() => setImportMessage(null), 3000)
    }
  }

  // Trigger input file para importar
  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  // Manejar selección de archivo
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const result = await importFromJSON(file)

      if (!result.valid) {
        setImportMessage({ 
          type: 'error', 
          text: `❌ Errores: ${result.errors.join(', ')}` 
        })
        setTimeout(() => setImportMessage(null), 5000)
        return
      }

      // Si hay alimentos existentes, preguntar
      if (foods.length > 0) {
        setPendingImport(result.foods)
        setShowImportModal(true)
      } else {
        // Si no hay alimentos, importar directamente
        setFoods(result.foods)
        setImportMessage({ 
          type: 'success', 
          text: `✅ Importados: ${result.foods.length} alimentos` 
        })
        setTimeout(() => setImportMessage(null), 3000)
      }
    } catch (error) {
      setImportMessage({ 
        type: 'error', 
        text: '❌ Error al leer el archivo' 
      })
      setTimeout(() => setImportMessage(null), 3000)
    }

    // Limpiar input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Confirmar merge de alimentos
  const handleMergeImport = () => {
    if (pendingImport) {
      const merged = mergeFoods(foods, pendingImport)
      setFoods(merged)
      setImportMessage({ 
        type: 'success', 
        text: `✅ Agregados: ${pendingImport.length} alimentos (total: ${merged.length})` 
      })
      setTimeout(() => setImportMessage(null), 3000)
    }
    setPendingImport(null)
    setShowImportModal(false)
  }

  // Confirmar reemplazo de alimentos
  const handleReplaceImport = () => {
    if (pendingImport) {
      setFoods(replaceFoods(pendingImport))
      setImportMessage({ 
        type: 'success', 
        text: `✅ Reemplazados: ${pendingImport.length} alimentos` 
      })
      setTimeout(() => setImportMessage(null), 3000)
    }
    setPendingImport(null)
    setShowImportModal(false)
  }

  // Cancelar importación
  const handleCancelImport = () => {
    setPendingImport(null)
    setShowImportModal(false)
  }

  // Verificar si se puede girar la ruleta
  const canSpinRoulette = hasAllCategories(foods, selectedMeal)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="bg-white rounded-lg shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                🍽️ App Cocina
              </h1>
              <p className="text-gray-600">
                Gestiona tu inventario y genera menús aleatorios
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleCreateFood}
                className="px-4 md:px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition transform hover:scale-105 shadow-lg"
              >
                ➕ Nuevo
              </button>
              
              <button
                onClick={handleExport}
                disabled={foods.length === 0}
                className={`px-4 md:px-6 py-3 rounded-lg font-bold transition transform ${
                  foods.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 shadow-lg'
                }`}
                title="Exportar alimentos a JSON"
              >
                📥 Exportar
              </button>
              
              <button
                onClick={handleImportClick}
                className="px-4 md:px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition transform hover:scale-105 shadow-lg"
                title="Importar alimentos desde JSON"
              >
                📤 Importar
              </button>
              
              {/* Input file oculto */}
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>
          
          {/* Mensaje de import/export */}
          {importMessage && (
            <div className={`mt-4 p-3 rounded-lg ${
              importMessage.type === 'success' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {importMessage.text}
            </div>
          )}
        </header>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-3xl font-bold text-indigo-600">{foods.length}</p>
            <p className="text-sm text-gray-600">Total Alimentos</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-3xl font-bold text-green-600">
              {foods.filter(f => f.quantity > 0).length}
            </p>
            <p className="text-sm text-gray-600">Con Stock</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-3xl font-bold text-red-600">
              {foods.filter(f => f.quantity === 0).length}
            </p>
            <p className="text-sm text-gray-600">Sin Stock</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">
              {new Set(foods.map(f => f.category)).size}
            </p>
            <p className="text-sm text-gray-600">Categorías</p>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Formulario o Lista */}
          <div className="lg:col-span-2 space-y-8">
            {showForm ? (
              <FoodForm
                initialFood={editingFood}
                onSave={handleSaveFood}
                onCancel={handleCancelForm}
                submitButtonText={editingFood ? 'Actualizar' : 'Crear Alimento'}
              />
            ) : (
              <FoodList
                foods={foods}
                onEdit={handleEditFood}
                onDelete={handleDeleteFood}
                onDecrement={handleDecrementFood}
                emptyMessage="No hay alimentos en tu inventario. ¡Crea tu primer alimento!"
              />
            )}
          </div>

          {/* Columna derecha - Controles de Ruleta */}
          <div className="space-y-6">
            {/* Selector de comida */}
            <div className="bg-white rounded-lg shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                🎲 Generador de Menú
              </h2>
              
              <div className="mb-4">
                <label htmlFor="meal-selector" className="block text-sm font-medium text-gray-700 mb-2">
                  Selecciona la comida
                </label>
                <select
                  id="meal-selector"
                  value={selectedMeal}
                  onChange={(e) => setSelectedMeal(e.target.value as Meal)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                >
                  {MEAL_OPTIONS.map(meal => (
                    <option key={meal} value={meal}>
                      {MEAL_METADATA[meal].icon} {MEAL_METADATA[meal].label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleShowRoulette}
                disabled={!canSpinRoulette}
                className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition transform ${
                  canSpinRoulette
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {canSpinRoulette ? '🎰 Girar Ruleta' : '⚠️ Faltan Alimentos'}
              </button>

              {!canSpinRoulette && foods.length > 0 && (
                <p className="text-sm text-red-600 mt-2 text-center">
                  Necesitas al menos un alimento de cada categoría con stock para {selectedMeal}
                </p>
              )}
            </div>

            {/* Resultado de ruleta */}
            {rouletteResult && (
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-xl p-6 border-2 border-green-400">
                <h3 className="text-xl font-bold text-green-800 mb-4 text-center">
                  ✨ Menú Generado
                </h3>
                
                <div className="space-y-3 mb-4">
                  {rouletteResult.proteina && (
                    <div className="bg-white rounded-lg p-3 shadow">
                      <p className="text-xs font-semibold text-red-700 mb-1">🥩 Proteína</p>
                      <p className="font-bold text-gray-800">{rouletteResult.proteina.name}</p>
                      <p className="text-sm text-gray-600">
                        {rouletteResult.proteina.quantity} {rouletteResult.proteina.unit}
                      </p>
                    </div>
                  )}
                  
                  {rouletteResult.carbohidrato && (
                    <div className="bg-white rounded-lg p-3 shadow">
                      <p className="text-xs font-semibold text-yellow-700 mb-1">🍞 Carbohidrato</p>
                      <p className="font-bold text-gray-800">{rouletteResult.carbohidrato.name}</p>
                      <p className="text-sm text-gray-600">
                        {rouletteResult.carbohidrato.quantity} {rouletteResult.carbohidrato.unit}
                      </p>
                    </div>
                  )}
                  
                  {rouletteResult.fruta_veg && (
                    <div className="bg-white rounded-lg p-3 shadow">
                      <p className="text-xs font-semibold text-green-700 mb-1">🥗 Frutas/Vegetales</p>
                      <p className="font-bold text-gray-800">{rouletteResult.fruta_veg.name}</p>
                      <p className="text-sm text-gray-600">
                        {rouletteResult.fruta_veg.quantity} {rouletteResult.fruta_veg.unit}
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleConfirmRecipe}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition transform hover:scale-105 shadow-lg"
                >
                  ✅ Confirmar y Decrementar Stock
                </button>
                
                <p className="text-xs text-gray-600 text-center mt-2">
                  Al confirmar se reducirá el stock de cada ingrediente
                </p>
              </div>
            )}

            {/* Información */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-sm font-bold text-gray-700 mb-2">💡 Cómo usar</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Agrega alimentos con el botón "Nuevo Alimento"</li>
                <li>• Selecciona una comida (desayuno/almuerzo/cena)</li>
                <li>• Gira la ruleta para generar un menú aleatorio</li>
                <li>• Confirma para reducir el stock automáticamente</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal de Importación */}
        {showImportModal && pendingImport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                📤 Importar Alimentos
              </h3>
              
              <p className="text-gray-600 mb-4">
                Ya tienes <strong>{foods.length}</strong> alimentos en tu inventario.
                Se encontraron <strong>{pendingImport.length}</strong> alimentos en el archivo.
              </p>
              
              <p className="text-gray-600 mb-6">
                ¿Qué deseas hacer?
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleMergeImport}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition"
                >
                  🔀 Combinar (Agregar sin duplicar)
                </button>
                
                <button
                  onClick={handleReplaceImport}
                  className="w-full px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold transition"
                >
                  🔄 Reemplazar Todo
                </button>
                
                <button
                  onClick={handleCancelImport}
                  className="w-full px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-bold transition"
                >
                  ❌ Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Ruleta */}
        {showRoulette && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  🎰 Ruleta para {MEAL_METADATA[selectedMeal].label}
                </h2>
                <button
                  onClick={() => setShowRoulette(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6">
                <Roulette
                  foods={foods}
                  meal={selectedMeal}
                  onResult={handleRouletteResult}
                  onReset={handleResetRoulette}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

