import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Food, Meal, Category } from '../types'
import { CATEGORY_METADATA } from '../types'
import { 
  chooseForMeal, 
  filterFoodsForMeal, 
  hasAvailableFoods,
  pickRandom,
  type MealChoice 
} from '../utils/randomPick'

export type RouletteResult = MealChoice

export interface RouletteProps {
  /** Lista de alimentos disponibles */
  foods: Food[]
  /** Comida para la cual seleccionar (desayuno/almuerzo/cena) */
  meal: Meal
  /** Callback cuando se completa la selección */
  onResult?: (result: RouletteResult) => void
  /** Callback para reiniciar la ruleta */
  onReset?: () => void
}

export function Roulette({ foods, meal, onResult, onReset }: RouletteProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [result, setResult] = useState<RouletteResult>({
    proteina: null,
    carbohidrato: null,
    fruta_veg: null
  })
  const [showResult, setShowResult] = useState(false)

  // Filtrar alimentos disponibles por meal y con stock
  const getAvailableFoods = (category: Category): Food[] => {
    return filterFoodsForMeal(foods, category, meal)
  }

  // Seleccionar alimento aleatorio de una categoría
  const selectRandomFood = (category: Category): Food | null => {
    const available = getAvailableFoods(category)
    return pickRandom(available)
  }

  // Iniciar la ruleta
  const spin = async () => {
    setIsSpinning(true)
    setShowResult(false)
    setResult({
      proteina: null,
      carbohidrato: null,
      fruta_veg: null
    })

    const categories: Category[] = ['proteina', 'carbohidrato', 'fruta_veg']
    const newResult: RouletteResult = {
      proteina: null,
      carbohidrato: null,
      fruta_veg: null
    }

    // Seleccionar cada categoría con animación
    for (const category of categories) {
      setCurrentCategory(category)
      
      // Simular tiempo de "giro"
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const selected = selectRandomFood(category)
      newResult[category] = selected
      setResult({ ...newResult })
    }

    setCurrentCategory(null)
    setIsSpinning(false)
    setShowResult(true)

    // Llamar callback con resultado
    if (onResult) {
      onResult(newResult)
    }
  }

  // Reiniciar
  const reset = () => {
    setResult({
      proteina: null,
      carbohidrato: null,
      fruta_veg: null
    })
    setShowResult(false)
    setCurrentCategory(null)
    if (onReset) {
      onReset()
    }
  }

  // Verificar si hay alimentos disponibles
  const checkAvailability = (category: Category) => {
    return hasAvailableFoods(foods, category, meal)
  }

  const allCategoriesAvailable = 
    checkAvailability('proteina') &&
    checkAvailability('carbohidrato') &&
    checkAvailability('fruta_veg')

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl mx-auto">
      {/* Título */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          🎰 Ruleta de Alimentos
        </h2>
        <p className="text-gray-600">
          Selección aleatoria para <span className="font-bold capitalize">{meal}</span>
        </p>
      </div>

      {/* Advertencia si no hay alimentos */}
      {!allCategoriesAvailable && !isSpinning && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 text-center">
            ⚠️ No hay suficientes alimentos disponibles en todas las categorías para {meal}
          </p>
          <div className="mt-2 text-sm text-yellow-700 text-center space-y-1">
            {!checkAvailability('proteina') && <p>• Falta proteína</p>}
            {!checkAvailability('carbohidrato') && <p>• Falta carbohidrato</p>}
            {!checkAvailability('fruta_veg') && <p>• Falta frutas o vegetales</p>}
          </div>
        </div>
      )}

      {/* Slots de categorías */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {(['proteina', 'carbohidrato', 'fruta_veg'] as Category[]).map((category) => (
          <CategorySlot
            key={category}
            category={category}
            selectedFood={result[category]}
            isSpinning={isSpinning && currentCategory === category}
            availableFoods={getAvailableFoods(category)}
          />
        ))}
      </div>

      {/* Botones de acción */}
      <div className="flex gap-4 justify-center">
        {!showResult ? (
          <motion.button
            onClick={spin}
            disabled={isSpinning || !allCategoriesAvailable}
            whileHover={!isSpinning && allCategoriesAvailable ? { scale: 1.05 } : {}}
            whileTap={!isSpinning && allCategoriesAvailable ? { scale: 0.95 } : {}}
            className={`px-8 py-3 rounded-lg font-bold text-lg transition ${
              isSpinning || !allCategoriesAvailable
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg'
            }`}
          >
            {isSpinning ? '🎲 Seleccionando...' : '🎰 Girar Ruleta'}
          </motion.button>
        ) : (
          <div className="flex gap-4">
            <motion.button
              onClick={reset}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gray-600 text-white rounded-lg font-bold text-lg hover:bg-gray-700 transition shadow-lg"
            >
              🔄 Volver a Girar
            </motion.button>
          </div>
        )}
      </div>

      {/* Resultado final */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-300"
          >
            <h3 className="text-2xl font-bold text-center text-green-800 mb-4">
              ✨ ¡Comida Seleccionada! ✨
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['proteina', 'carbohidrato', 'fruta_veg'] as Category[]).map((category) => {
                const food = result[category]
                return (
                  <div key={category} className="bg-white rounded-lg p-4 shadow">
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      {CATEGORY_METADATA[category].icon} {CATEGORY_METADATA[category].label}
                    </p>
                    {food ? (
                      <>
                        <p className="font-bold text-gray-800">{food.name}</p>
                        <p className="text-sm text-gray-600">
                          {food.quantity} {food.unit}
                        </p>
                      </>
                    ) : (
                      <p className="text-red-600 text-sm">Sin disponibilidad</p>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Componente para cada slot de categoría
interface CategorySlotProps {
  category: Category
  selectedFood: Food | null
  isSpinning: boolean
  availableFoods: Food[]
}

function CategorySlot({ category, selectedFood, isSpinning, availableFoods }: CategorySlotProps) {
  const [displayFood, setDisplayFood] = useState<Food | null>(null)

  // Efecto de animación de "shuffle" durante el giro
  useEffect(() => {
    if (isSpinning && availableFoods.length > 0) {
      const interval = setInterval(() => {
        const randomFood = availableFoods[Math.floor(Math.random() * availableFoods.length)]
        setDisplayFood(randomFood)
      }, 100)

      return () => clearInterval(interval)
    } else if (!isSpinning && selectedFood) {
      setDisplayFood(selectedFood)
    } else if (!isSpinning && !selectedFood) {
      setDisplayFood(null)
    }
  }, [isSpinning, selectedFood, availableFoods])

  const metadata = CATEGORY_METADATA[category]

  return (
    <div className="relative">
      <motion.div
        animate={{
          scale: isSpinning ? [1, 1.05, 1] : 1,
          rotate: isSpinning ? [0, 5, -5, 0] : 0,
        }}
        transition={{
          duration: 0.3,
          repeat: isSpinning ? Infinity : 0,
        }}
        className={`border-4 rounded-lg p-6 min-h-[200px] flex flex-col items-center justify-center ${
          isSpinning
            ? 'border-purple-500 bg-purple-50'
            : selectedFood
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 bg-gray-50'
        }`}
      >
        {/* Icono de categoría */}
        <div className="text-5xl mb-3">{metadata.icon}</div>
        
        {/* Nombre de categoría */}
        <h3 className="text-lg font-bold text-gray-700 mb-4">
          {metadata.label}
        </h3>

        {/* Contenido del slot */}
        <AnimatePresence mode="wait">
          {isSpinning ? (
            <motion.div
              key="spinning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="text-4xl mb-2"
              >
                🎲
              </motion.div>
              {displayFood && (
                <motion.p
                  key={displayFood.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 0.7, y: 0 }}
                  className="font-medium text-gray-700"
                >
                  {displayFood.name}
                </motion.p>
              )}
            </motion.div>
          ) : displayFood ? (
            <motion.div
              key="result"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="text-center"
            >
              <p className="font-bold text-xl text-gray-800 mb-2">
                {displayFood.name}
              </p>
              <p className="text-sm text-gray-600">
                {displayFood.quantity} {displayFood.unit}
              </p>
              {displayFood.notes && (
                <p className="text-xs text-gray-500 mt-2 italic">
                  {displayFood.notes}
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-400"
            >
              <p className="text-sm">Esperando...</p>
              <p className="text-xs mt-1">
                {availableFoods.length} disponibles
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

