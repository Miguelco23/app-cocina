# Tipos TypeScript - Sistema de Alimentos

Documentación completa de los tipos TypeScript para el sistema de gestión de alimentos de App Cocina.

## 📋 Índice

- [Tipos Principales](#tipos-principales)
- [Tipos Auxiliares](#tipos-auxiliares)
- [Constantes y Metadata](#constantes-y-metadata)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Funciones Helper](#funciones-helper)
- [Validación](#validación)

## Tipos Principales

### Category

Define las categorías de alimentos disponibles en la aplicación.

```typescript
export type Category = 'proteina' | 'carbohidrato' | 'fruta_veg'
```

**Valores:**
- `proteina` - Alimentos ricos en proteínas (carnes, pescados, huevos, legumbres)
- `carbohidrato` - Alimentos ricos en carbohidratos (arroz, pasta, pan, cereales)
- `fruta_veg` - Frutas y vegetales

### Meal

Define las comidas del día en las que se puede consumir un alimento.

```typescript
export type Meal = 'desayuno' | 'almuerzo' | 'cena'
```

**Valores:**
- `desayuno` - Primera comida del día
- `almuerzo` - Comida del mediodía
- `cena` - Última comida del día

### Unit

Define las unidades de medida disponibles para los alimentos.

```typescript
export type Unit = 
  | 'gramos'
  | 'kilogramos'
  | 'litros'
  | 'mililitros'
  | 'unidades'
  | 'tazas'
  | 'cucharadas'
  | 'cucharaditas'
  | 'porciones'
```

### Food

Interfaz principal que representa un alimento en el sistema.

```typescript
export interface Food {
  id: string           // Identificador único
  name: string         // Nombre del alimento
  category: Category   // Categoría del alimento
  meals: Meal[]        // Comidas en las que se puede consumir
  quantity: number     // Cantidad
  unit: Unit          // Unidad de medida
  notes?: string      // Notas adicionales (opcional)
}
```

**Ejemplo:**
```typescript
const pollo: Food = {
  id: 'food-001',
  name: 'Pechuga de Pollo',
  category: 'proteina',
  meals: ['almuerzo', 'cena'],
  quantity: 200,
  unit: 'gramos',
  notes: 'Pollo a la plancha sin piel'
}
```

## Tipos Auxiliares

### CreateFood

Tipo para crear un nuevo alimento. Es igual a `Food` pero sin el campo `id` (se genera automáticamente).

```typescript
export type CreateFood = Omit<Food, 'id'>
```

**Ejemplo:**
```typescript
const nuevoAlimento: CreateFood = {
  name: 'Salmón',
  category: 'proteina',
  meals: ['almuerzo', 'cena'],
  quantity: 180,
  unit: 'gramos',
  notes: 'Rico en Omega-3'
}
```

### UpdateFood

Tipo para actualizar un alimento existente. Todos los campos son opcionales excepto el `id`.

```typescript
export type UpdateFood = Partial<Omit<Food, 'id'>> & { id: string }
```

**Ejemplo:**
```typescript
const actualizacion: UpdateFood = {
  id: 'food-001',
  quantity: 250,  // Solo actualizar la cantidad
  notes: 'Nueva nota'
}
```

## Constantes y Metadata

### CATEGORY_METADATA

Metadata de las categorías para uso en la interfaz de usuario.

```typescript
export const CATEGORY_METADATA: Record<Category, CategoryMetadata> = {
  proteina: {
    label: 'Proteína',
    color: 'bg-red-100 text-red-800',
    icon: '🥩'
  },
  carbohidrato: {
    label: 'Carbohidrato',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '🍞'
  },
  fruta_veg: {
    label: 'Frutas y Vegetales',
    color: 'bg-green-100 text-green-800',
    icon: '🥗'
  }
}
```

**Uso:**
```typescript
const categoria = 'proteina'
const { label, color, icon } = CATEGORY_METADATA[categoria]
// label: 'Proteína'
// color: 'bg-red-100 text-red-800'
// icon: '🥩'
```

### MEAL_METADATA

Metadata de las comidas para uso en la interfaz de usuario.

```typescript
export const MEAL_METADATA: Record<Meal, MealMetadata> = {
  desayuno: {
    label: 'Desayuno',
    color: 'bg-orange-100 text-orange-800',
    icon: '🌅'
  },
  almuerzo: {
    label: 'Almuerzo',
    color: 'bg-blue-100 text-blue-800',
    icon: '☀️'
  },
  cena: {
    label: 'Cena',
    color: 'bg-purple-100 text-purple-800',
    icon: '🌙'
  }
}
```

### Constantes de Opciones

Arrays de solo lectura con todas las opciones disponibles:

```typescript
// Todas las categorías
export const CATEGORY_OPTIONS: readonly Category[] = [
  'proteina',
  'carbohidrato',
  'fruta_veg'
]

// Todas las comidas
export const MEAL_OPTIONS: readonly Meal[] = [
  'desayuno',
  'almuerzo',
  'cena'
]

// Todas las unidades
export const UNIT_OPTIONS: readonly Unit[] = [
  'gramos',
  'kilogramos',
  'litros',
  'mililitros',
  'unidades',
  'tazas',
  'cucharadas',
  'cucharaditas',
  'porciones'
]
```

## Ejemplos de Uso

### Ejemplo 1: Crear Alimento Completo

```typescript
import type { Food } from './types'

const huevo: Food = {
  id: 'food-003',
  name: 'Huevo',
  category: 'proteina',
  meals: ['desayuno', 'almuerzo', 'cena'],
  quantity: 2,
  unit: 'unidades',
  notes: 'Puede prepararse cocido, revuelto o en tortilla'
}
```

### Ejemplo 2: Usar con React Component

```typescript
import { useState } from 'react'
import type { Food, CreateFood } from './types'
import { CATEGORY_METADATA } from './types'

function FoodForm() {
  const [food, setFood] = useState<CreateFood>({
    name: '',
    category: 'proteina',
    meals: [],
    quantity: 0,
    unit: 'gramos'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Crear el alimento con ID
    const newFood: Food = {
      ...food,
      id: generateId()
    }
    // Guardar...
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={food.name}
        onChange={(e) => setFood({ ...food, name: e.target.value })}
      />
      {/* Más campos... */}
    </form>
  )
}
```

### Ejemplo 3: Filtrar Alimentos

```typescript
import type { Food, Category, Meal } from './types'

function filtrarPorCategoria(alimentos: Food[], category: Category): Food[] {
  return alimentos.filter(food => food.category === category)
}

function filtrarPorComida(alimentos: Food[], meal: Meal): Food[] {
  return alimentos.filter(food => food.meals.includes(meal))
}

// Uso
const todosLosAlimentos: Food[] = [...] // lista de alimentos
const proteinas = filtrarPorCategoria(todosLosAlimentos, 'proteina')
const paraDesayuno = filtrarPorComida(todosLosAlimentos, 'desayuno')
```

### Ejemplo 4: Usar con useStorage Hook

```typescript
import { useStorage } from './hooks/useStorage'
import type { Food } from './types'

function FoodList() {
  const [foods, setFoods] = useStorage<Food[]>('foods-list', [])

  const agregarAlimento = (newFood: Food) => {
    setFoods(prev => [...prev, newFood])
  }

  const eliminarAlimento = (id: string) => {
    setFoods(prev => prev.filter(food => food.id !== id))
  }

  return (
    <div>
      {foods.map(food => (
        <div key={food.id}>{food.name}</div>
      ))}
    </div>
  )
}
```

## Funciones Helper

Ejemplos de funciones útiles para trabajar con los tipos (ver `src/examples/food-example.ts`):

### Generar ID Único

```typescript
export function generarIdAlimento(): string {
  return `food-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
```

### Crear Alimento con ID

```typescript
export function crearAlimento(datos: CreateFood): Food {
  return {
    ...datos,
    id: generarIdAlimento()
  }
}
```

### Obtener Labels

```typescript
export function obtenerLabelCategoria(category: Category): string {
  return CATEGORY_METADATA[category].label
}

export function obtenerLabelComida(meal: Meal): string {
  return MEAL_METADATA[meal].label
}
```

## Validación

### Validar Objeto Food

```typescript
export function esAlimentoValido(food: unknown): food is Food {
  if (!food || typeof food !== 'object') return false
  
  const f = food as Food
  
  return (
    typeof f.id === 'string' &&
    typeof f.name === 'string' &&
    ['proteina', 'carbohidrato', 'fruta_veg'].includes(f.category) &&
    Array.isArray(f.meals) &&
    f.meals.every(m => ['desayuno', 'almuerzo', 'cena'].includes(m)) &&
    typeof f.quantity === 'number' &&
    typeof f.unit === 'string' &&
    (f.notes === undefined || typeof f.notes === 'string')
  )
}

// Uso
const data: unknown = JSON.parse(localStorage.getItem('food') || '{}')
if (esAlimentoValido(data)) {
  // TypeScript sabe que data es Food
  console.log(data.name)
}
```

## 🧪 Tests

Los tipos incluyen tests completos en `src/types.test.ts`:

```bash
npm run test types.test
```

### Casos Testeados

- ✅ Creación de objetos Food válidos
- ✅ Validación de todas las categorías
- ✅ Validación de todas las comidas
- ✅ Múltiples comidas por alimento
- ✅ Tipo CreateFood sin ID
- ✅ Tipo UpdateFood parcial
- ✅ Metadata de categorías y comidas
- ✅ Constantes exportadas

## 💡 Mejores Prácticas

### 1. Usar tipos explícitos

```typescript
// ✅ Bueno
const food: Food = { ... }

// ❌ Evitar
const food = { ... }  // Sin tipo
```

### 2. Usar CreateFood al crear nuevos alimentos

```typescript
// ✅ Bueno
const newFood: CreateFood = {
  name: 'Arroz',
  category: 'carbohidrato',
  // ...
}

// ❌ Evitar (no incluir ID manualmente)
const newFood: Food = {
  id: '???',  // El ID debe generarse
  // ...
}
```

### 3. Usar UpdateFood al actualizar

```typescript
// ✅ Bueno
const update: UpdateFood = {
  id: 'food-001',
  quantity: 300  // Solo lo que cambia
}

// ❌ Evitar (actualizar objeto completo)
const update: Food = { ... }  // Todos los campos
```

### 4. Usar metadata para UI

```typescript
// ✅ Bueno - usar metadata
const { label, color, icon } = CATEGORY_METADATA[food.category]

// ❌ Evitar - hardcodear strings
const label = food.category === 'proteina' ? 'Proteína' : '...'
```

## 📚 Recursos

- Ver ejemplos completos en `src/examples/food-example.ts`
- Tests en `src/types.test.ts`
- Documentación del hook useStorage en `docs/useStorage.md`

## 📄 Licencia

MIT

