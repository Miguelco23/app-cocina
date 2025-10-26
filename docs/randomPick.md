# Utilidades randomPick

Funciones utilitarias para selección aleatoria de alimentos con filtrado inteligente basado en criterios de comida y disponibilidad de stock.

## 📋 Características

- ✅ **Selección aleatoria genérica**: `pickRandom<T>` funciona con cualquier tipo
- ✅ **Selección de comida completa**: `chooseForMeal` para menús balanceados
- ✅ **Filtrado inteligente**: Por categoría, meal y stock
- ✅ **Validación**: Verifica disponibilidad antes de seleccionar
- ✅ **Conteo**: Obtén estadísticas de alimentos disponibles
- ✅ **Type-safe**: Completamente tipado con TypeScript
- ✅ **60+ tests**: Suite exhaustiva de tests

## 🚀 Funciones Principales

### pickRandom

Selecciona un elemento aleatorio de un array.

```typescript
function pickRandom<T>(array: T[]): T | null
```

**Parámetros:**
- `array: T[]` - Array de elementos de cualquier tipo

**Retorna:**
- Elemento aleatorio del array
- `null` si el array está vacío o es undefined

**Ejemplos:**

```typescript
// Con strings
const frutas = ['manzana', 'banana', 'naranja']
const fruta = pickRandom(frutas) // 'manzana' | 'banana' | 'naranja' | null

// Con números
const numeros = [1, 2, 3, 4, 5]
const numero = pickRandom(numeros) // 1 | 2 | 3 | 4 | 5 | null

// Con objetos
const alimentos: Food[] = [...]
const alimento = pickRandom(alimentos) // Food | null

// Array vacío
const vacio: string[] = []
const resultado = pickRandom(vacio) // null
```

### chooseForMeal

Selecciona un alimento de cada categoría para una comida específica.

```typescript
function chooseForMeal(foods: Food[], meal: Meal): MealChoice
```

**Parámetros:**
- `foods: Food[]` - Lista de alimentos disponibles
- `meal: Meal` - Comida para la cual seleccionar ('desayuno' | 'almuerzo' | 'cena')

**Retorna:**
```typescript
interface MealChoice {
  proteina: Food | null
  carbohidrato: Food | null
  fruta_veg: Food | null
}
```

**Criterios de Selección:**
- Solo alimentos con `quantity > 0`
- Solo alimentos que incluyan `meal` en su array `meals`
- Agrupa por categoría
- Selecciona 1 aleatorio de cada categoría

**Ejemplo:**

```typescript
const alimentos: Food[] = [
  { category: 'proteina', meals: ['almuerzo'], quantity: 200, ... },
  { category: 'carbohidrato', meals: ['almuerzo'], quantity: 100, ... },
  { category: 'fruta_veg', meals: ['almuerzo'], quantity: 50, ... }
]

const resultado = chooseForMeal(alimentos, 'almuerzo')
// {
//   proteina: { name: 'Pollo', ... },
//   carbohidrato: { name: 'Arroz', ... },
//   fruta_veg: { name: 'Brócoli', ... }
// }
```

### filterFoodsForMeal

Filtra alimentos por categoría, meal y stock.

```typescript
function filterFoodsForMeal(
  foods: Food[],
  category: Category,
  meal: Meal
): Food[]
```

**Parámetros:**
- `foods: Food[]` - Lista de alimentos
- `category: Category` - Categoría a filtrar
- `meal: Meal` - Comida a filtrar

**Retorna:**
- Array de alimentos que cumplen todos los criterios

**Ejemplo:**

```typescript
const proteinas = filterFoodsForMeal(alimentos, 'proteina', 'cena')
// Retorna solo proteínas con stock para la cena
```

### hasAvailableFoods

Verifica si hay alimentos disponibles de una categoría para una comida.

```typescript
function hasAvailableFoods(
  foods: Food[],
  category: Category,
  meal: Meal
): boolean
```

**Ejemplo:**

```typescript
if (hasAvailableFoods(alimentos, 'proteina', 'desayuno')) {
  console.log('Hay proteínas disponibles para el desayuno')
}
```

### hasAllCategories

Verifica si hay alimentos disponibles en TODAS las categorías para una comida.

```typescript
function hasAllCategories(foods: Food[], meal: Meal): boolean
```

**Ejemplo:**

```typescript
const puedoGirarRuleta = hasAllCategories(alimentos, 'almuerzo')

if (puedoGirarRuleta) {
  const resultado = chooseForMeal(alimentos, 'almuerzo')
  // ✅ Garantizado que tendrá las 3 categorías
}
```

### getAvailableCount

Obtiene el conteo de alimentos disponibles por categoría.

```typescript
function getAvailableCount(
  foods: Food[],
  meal: Meal
): Record<Category, number>
```

**Retorna:**
```typescript
{
  proteina: number
  carbohidrato: number
  fruta_veg: number
}
```

**Ejemplo:**

```typescript
const conteo = getAvailableCount(alimentos, 'cena')
console.log(`Proteínas: ${conteo.proteina}`)
console.log(`Carbohidratos: ${conteo.carbohidrato}`)
console.log(`Frutas/Veg: ${conteo.fruta_veg}`)
```

## 📖 Casos de Uso

### Caso 1: Generador de Menú Aleatorio

```typescript
import { chooseForMeal, hasAllCategories } from './utils/randomPick'

function GeneradorMenu({ alimentos }: { alimentos: Food[] }) {
  const generarMenu = (meal: Meal) => {
    if (!hasAllCategories(alimentos, meal)) {
      alert(`No hay suficientes alimentos para ${meal}`)
      return
    }

    const menu = chooseForMeal(alimentos, meal)
    console.log('Menú generado:', menu)
  }

  return (
    <button onClick={() => generarMenu('almuerzo')}>
      Generar Menú para Almuerzo
    </button>
  )
}
```

### Caso 2: Planificador Semanal

```typescript
function planificarSemana(alimentos: Food[]) {
  const semana = []

  for (let dia = 0; dia < 7; dia++) {
    const dia = {
      desayuno: chooseForMeal(alimentos, 'desayuno'),
      almuerzo: chooseForMeal(alimentos, 'almuerzo'),
      cena: chooseForMeal(alimentos, 'cena')
    }
    semana.push(dia)
  }

  return semana
}
```

### Caso 3: Verificador de Inventario

```typescript
function verificarInventario(alimentos: Food[]) {
  const meals: Meal[] = ['desayuno', 'almuerzo', 'cena']

  return meals.map(meal => ({
    meal,
    disponible: hasAllCategories(alimentos, meal),
    conteo: getAvailableCount(alimentos, meal)
  }))
}

// Uso
const reporte = verificarInventario(misAlimentos)
reporte.forEach(({ meal, disponible, conteo }) => {
  console.log(`${meal}: ${disponible ? '✅' : '❌'}`)
  console.log(`  Proteínas: ${conteo.proteina}`)
  console.log(`  Carbohidratos: ${conteo.carbohidrato}`)
  console.log(`  Frutas/Veg: ${conteo.fruta_veg}`)
})
```

### Caso 4: Selección Condicional

```typescript
function seleccionarConRestriccion(alimentos: Food[], meal: Meal) {
  // Primero verificar disponibilidad
  const conteo = getAvailableCount(alimentos, meal)
  
  if (conteo.proteina === 0) {
    console.warn('No hay proteínas disponibles')
    return null
  }

  // Si hay opciones, seleccionar
  const resultado = chooseForMeal(alimentos, meal)
  return resultado
}
```

## 🔧 Implementación Interna

### Algoritmo de chooseForMeal

```typescript
export function chooseForMeal(foods: Food[], meal: Meal): MealChoice {
  const categories: Category[] = ['proteina', 'carbohidrato', 'fruta_veg']
  
  const result: MealChoice = {
    proteina: null,
    carbohidrato: null,
    fruta_veg: null
  }

  // Para cada categoría
  for (const category of categories) {
    // 1. Filtrar alimentos válidos
    const availableFoods = foods.filter(
      food =>
        food.category === category &&
        food.quantity > 0 &&
        food.meals.includes(meal)
    )
    
    // 2. Seleccionar uno aleatorio
    result[category] = pickRandom(availableFoods)
  }

  return result
}
```

### Algoritmo de pickRandom

```typescript
export function pickRandom<T>(array: T[]): T | null {
  if (!array || array.length === 0) {
    return null
  }
  
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}
```

## 🧪 Tests

Las utilidades incluyen 60+ tests cubriendo:

### Ejecutar Tests

```bash
npm run test randomPick
```

### Casos Testeados

**pickRandom (6 tests):**
- Array vacío → null
- Array undefined → null
- 1 elemento → ese elemento
- Múltiples → elemento del array
- Aleatoriedad verificada
- Objetos complejos

**filterFoodsForMeal (5 tests):**
- Filtrado correcto
- Excluye sin stock
- Excluye sin meal
- Array vacío
- Diferentes meals

**chooseForMeal (8 tests):**
- Retorna 3 categorías
- Alimentos válidos
- Null para categorías faltantes
- Array vacío
- Diferentes meals
- Solo quantity > 0
- Aleatoriedad

**hasAvailableFoods (4 tests):**
- True/false correctamente
- Array vacío
- Cada categoría

**hasAllCategories (5 tests):**
- True cuando completo
- False cuando falta
- Array vacío
- Considera stock

**getAvailableCount (5 tests):**
- Conteo correcto
- Ceros para vacío
- Excluye sin stock

**Integración (3 tests):**
- Consistencia entre funciones
- chooseForMeal usa filterFoodsForMeal
- getAvailableCount refleja opciones

## 💡 Best Practices

### 1. Verificar antes de seleccionar

```typescript
// ✅ Bueno
if (hasAllCategories(foods, meal)) {
  const result = chooseForMeal(foods, meal)
}

// ❌ Evitar
const result = chooseForMeal(foods, meal)
// Podría retornar nulls si faltan categorías
```

### 2. Usar filtrado antes de mostrar opciones

```typescript
// ✅ Bueno
const opciones = filterFoodsForMeal(foods, 'proteina', 'cena')
if (opciones.length > 0) {
  // Mostrar opciones al usuario
}
```

### 3. Mostrar conteos al usuario

```typescript
// ✅ Bueno
const conteo = getAvailableCount(foods, 'desayuno')
console.log(`Tienes ${conteo.proteina} proteínas disponibles`)
```

## 📚 Recursos Relacionados

- [Tipos TypeScript (Food, Meal, Category)](./types.md)
- [Componente Roulette](./Roulette.md)
- [Componente Home](./Home.md)

## 📄 Licencia

MIT

