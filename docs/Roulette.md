# Componente Roulette

Componente React animado que selecciona aleatoriamente alimentos de cada categoría (proteína, carbohidrato, frutas/vegetales) para una comida específica usando Framer Motion.

## 📋 Características

- ✅ **Selección aleatoria**: 1 proteína, 1 carbohidrato, 1 fruta/vegetal
- ✅ **Filtrado inteligente**: Solo alimentos con stock (quantity > 0) y para la comida seleccionada
- ✅ **Animaciones**: Efectos de "ruleta" con Framer Motion
- ✅ **Validación**: Verifica disponibilidad antes de girar
- ✅ **Callback**: Expone resultado mediante onResult
- ✅ **Type-safe**: Completamente tipado con TypeScript
- ✅ **40+ tests**: Suite completa de pruebas

## 🚀 Uso Básico

### Ejemplo Simple

```tsx
import { Roulette } from './components/Roulette'
import type { Food, RouletteResult } from './types'

function MiComponente() {
  const foods: Food[] = [...] // Tu lista de alimentos

  const handleResult = (result: RouletteResult) => {
    console.log('Proteína:', result.proteina)
    console.log('Carbohidrato:', result.carbohidrato)
    console.log('Fruta/Veg:', result.fruta_veg)
  }

  return (
    <Roulette
      foods={foods}
      meal="almuerzo"
      onResult={handleResult}
    />
  )
}
```

### Con Reset

```tsx
function RouletteDemo() {
  const [result, setResult] = useState<RouletteResult | null>(null)

  return (
    <Roulette
      foods={foods}
      meal="cena"
      onResult={setResult}
      onReset={() => setResult(null)}
    />
  )
}
```

## 📖 API

### Props

```typescript
interface RouletteProps {
  /** Lista de alimentos disponibles (requerido) */
  foods: Food[]
  
  /** Comida para la cual seleccionar (requerido) */
  meal: 'desayuno' | 'almuerzo' | 'cena'
  
  /** Callback cuando se completa la selección (opcional) */
  onResult?: (result: RouletteResult) => void
  
  /** Callback para reiniciar la ruleta (opcional) */
  onReset?: () => void
}
```

### Tipo RouletteResult

```typescript
interface RouletteResult {
  proteina: Food | null
  carbohidrato: Food | null
  fruta_veg: Food | null
}
```

- Cada categoría contiene un `Food` si se encontró uno disponible
- Si no hay alimentos disponibles para una categoría, será `null`

## 🔍 Lógica de Filtrado

El componente filtra los alimentos según tres criterios:

### 1. Categoría

Agrupa alimentos por su campo `category`:
- `'proteina'`
- `'carbohidrato'`
- `'fruta_veg'`

### 2. Stock Disponible

```typescript
food.quantity > 0
```
Solo considera alimentos con stock disponible.

### 3. Comida Apropiada

```typescript
food.meals.includes(meal)
```
Solo alimentos marcados para la comida seleccionada.

### Ejemplo de Filtrado

```typescript
// Para meal="almuerzo":
const alimentos = [
  { category: 'proteina', meals: ['almuerzo', 'cena'], quantity: 200 }, // ✅ Incluido
  { category: 'proteina', meals: ['desayuno'], quantity: 100 },         // ❌ Excluido (no incluye almuerzo)
  { category: 'proteina', meals: ['almuerzo'], quantity: 0 },           // ❌ Excluido (sin stock)
]
```

## 🎯 Selección Aleatoria

El componente selecciona UN alimento aleatorio de cada categoría:

```typescript
const selectRandomFood = (category: Category): Food | null => {
  const available = foods.filter(
    food =>
      food.category === category &&
      food.quantity > 0 &&
      food.meals.includes(meal)
  )
  
  if (available.length === 0) return null
  
  const randomIndex = Math.floor(Math.random() * available.length)
  return available[randomIndex]
}
```

## 🎬 Animaciones con Framer Motion

### Animación de Slots

Cada slot de categoría tiene animaciones durante el giro:

```tsx
// Escala y rotación mientras gira
animate={{
  scale: isSpinning ? [1, 1.05, 1] : 1,
  rotate: isSpinning ? [0, 5, -5, 0] : 0,
}}
```

### Efecto de "Shuffle"

Durante el giro, los alimentos cambian rápidamente:

```tsx
// Cambiar alimento cada 100ms
useEffect(() => {
  if (isSpinning) {
    const interval = setInterval(() => {
      setDisplayFood(randomFood)
    }, 100)
    return () => clearInterval(interval)
  }
}, [isSpinning])
```

### Animación del Resultado

El resultado final aparece con efecto de "spring":

```tsx
<motion.div
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ type: "spring", stiffness: 200, damping: 15 }}
>
  {food.name}
</motion.div>
```

### Secuencia de Animación

1. **Click en "Girar Ruleta"**
2. **Proteína**: Gira durante 1.5s → Selecciona
3. **Carbohidrato**: Gira durante 1.5s → Selecciona
4. **Fruta/Veg**: Gira durante 1.5s → Selecciona
5. **Resultado**: Aparece con animación (fade + slide)

**Tiempo total**: ~4.5 segundos

## ⚠️ Validaciones y Advertencias

### Verificación Previa

Antes de permitir girar, verifica que haya al menos un alimento disponible en cada categoría:

```tsx
const allCategoriesAvailable = 
  hasAvailableFoods('proteina') &&
  hasAvailableFoods('carbohidrato') &&
  hasAvailableFoods('fruta_veg')
```

### Advertencia Visual

Si falta alguna categoría, muestra un banner amarillo:

```tsx
⚠️ No hay suficientes alimentos disponibles en todas las categorías para almuerzo
• Falta proteína
• Falta frutas o vegetales
```

### Botón Deshabilitado

El botón "Girar Ruleta" se deshabilita si:
- Ya está girando (`isSpinning === true`)
- Falta alguna categoría (`!allCategoriesAvailable`)

## 🎨 Estados Visuales

### Slot Vacío (Inicial)

```tsx
border-gray-300 bg-gray-50
"Esperando... X disponibles"
```

### Slot Girando

```tsx
border-purple-500 bg-purple-50
Icono: 🎲 (rotando)
```

### Slot con Resultado

```tsx
border-green-500 bg-green-50
Muestra: nombre, cantidad, notas
```

## 📊 Callbacks

### onResult

Se ejecuta cuando termina la selección:

```typescript
const handleResult = (result: RouletteResult) => {
  // Guardar resultado
  setSelectedMeal(result)
  
  // Actualizar stock
  if (result.proteina) {
    decrementStock(result.proteina.id)
  }
  
  // Enviar a API
  await saveMealPlan(result)
}
```

### onReset

Se ejecuta al hacer click en "Volver a Girar":

```typescript
const handleReset = () => {
  console.log('Usuario decidió girar de nuevo')
  // Limpiar datos previos
  setSelectedMeal(null)
}
```

## 🧪 Tests

El componente incluye 40+ tests cubriendo:

### Ejecutar Tests

```bash
# Todos los tests
npm run test

# Solo Roulette
npm run test Roulette

# Con UI
npm run test:ui

# Con cobertura
npm run test:coverage
```

### Categorías de Tests

**1. Renderizado** (4 tests)
- Título y categorías
- Botones
- Contadores

**2. Filtrado** (3 tests)
- Por meal
- Por quantity > 0
- Por meals array

**3. Advertencias** (3 tests)
- Detección de categorías faltantes
- Mensajes específicos
- Botón deshabilitado

**4. Funcionalidad** (5 tests)
- Cambio de estado al girar
- Callback onResult
- Validación de selección
- Stock > 0
- Meal correcta

**5. Resultado** (3 tests)
- Visualización
- Botón reset
- Nombres mostrados

**6. Reset** (3 tests)
- Callback onReset
- Ocultar resultado
- Volver a estado inicial

**7. Casos Especiales** (3 tests)
- Sin alimentos
- Diferentes meals
- Categorías incompletas

**8. Accesibilidad** (2 tests)
- Textos descriptivos
- Estados deshabilitados

## 💡 Ejemplos de Uso

### Integración con FoodList

```tsx
function MealPlanner() {
  const [foods, setFoods] = useStorage<Food[]>('foods', [])
  const [selectedMeal, setSelectedMeal] = useState<'desayuno' | 'almuerzo' | 'cena'>('almuerzo')

  const handleResult = (result: RouletteResult) => {
    // Decrementar stock de alimentos seleccionados
    const updatedFoods = foods.map(food => {
      if (
        food.id === result.proteina?.id ||
        food.id === result.carbohidrato?.id ||
        food.id === result.fruta_veg?.id
      ) {
        return { ...food, quantity: food.quantity - 1 }
      }
      return food
    })
    setFoods(updatedFoods)
  }

  return (
    <div>
      <select value={selectedMeal} onChange={(e) => setSelectedMeal(e.target.value)}>
        <option value="desayuno">Desayuno</option>
        <option value="almuerzo">Almuerzo</option>
        <option value="cena">Cena</option>
      </select>

      <Roulette
        foods={foods}
        meal={selectedMeal}
        onResult={handleResult}
      />
    </div>
  )
}
```

### Guardar Historial

```tsx
function RouletteWithHistory() {
  const [history, setHistory] = useState<RouletteResult[]>([])

  const handleResult = (result: RouletteResult) => {
    setHistory(prev => [...prev, result])
    console.log('Historial completo:', history)
  }

  return (
    <>
      <Roulette
        foods={foods}
        meal="almuerzo"
        onResult={handleResult}
      />
      
      <div>
        <h3>Historial de Selecciones</h3>
        {history.map((item, index) => (
          <div key={index}>
            {item.proteina?.name} + {item.carbohidrato?.name} + {item.fruta_veg?.name}
          </div>
        ))}
      </div>
    </>
  )
}
```

### Con Restricciones Dietéticas

```tsx
function DietaryRoulette() {
  const [foods, setFoods] = useState<Food[]>([...])
  const [isVegetarian, setIsVegetarian] = useState(false)

  const filteredFoods = isVegetarian
    ? foods.filter(food => 
        food.category !== 'proteina' || 
        food.notes?.includes('vegetariano')
      )
    : foods

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isVegetarian}
          onChange={(e) => setIsVegetarian(e.target.checked)}
        />
        Vegetariano
      </label>

      <Roulette
        foods={filteredFoods}
        meal="almuerzo"
      />
    </>
  )
}
```

## 🎨 Personalización

### Cambiar Tiempos de Animación

```tsx
// En Roulette.tsx, modificar:
await new Promise(resolve => setTimeout(resolve, 1500))
// Cambiar 1500 a tu tiempo deseado (en ms)
```

### Añadir Más Categorías

Para extender a más categorías, modificar:

```typescript
const categories: Category[] = [
  'proteina', 
  'carbohidrato', 
  'fruta_veg',
  // 'lacteos', // Nueva categoría
]
```

### Cambiar Velocidad de Shuffle

```tsx
// En CategorySlot, modificar:
const interval = setInterval(() => {
  setDisplayFood(randomFood)
}, 100) // Cambiar 100 a tu velocidad deseada
```

## 🔧 Dependencias

### Framer Motion

```bash
npm install framer-motion
```

**Versión usada**: `^10.16.16`

### Importaciones

```tsx
import { motion, AnimatePresence } from 'framer-motion'
```

## 📚 Recursos Relacionados

- [Tipos TypeScript (Food, Meal, Category)](./types.md)
- [Componente FoodList](./FoodList.md)
- [Hook useStorage](./useStorage.md)
- [Framer Motion Docs](https://www.framer.com/motion/)

## 📄 Licencia

MIT

