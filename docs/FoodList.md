# Componente FoodList

Componente React con TypeScript para mostrar una lista de alimentos con filtros avanzados y acciones de gestión (editar, eliminar, decrementar stock).

## 📋 Características

- ✅ **Lista visual**: Muestra alimentos con toda su información
- ✅ **Filtros**: Por comida y por categoría simultáneamente
- ✅ **Acciones**: Editar, eliminar y decrementar stock
- ✅ **Indicadores visuales**: Sin stock, badges de categorías y comidas
- ✅ **Type-safe**: Completamente tipado con TypeScript
- ✅ **Responsive**: Diseño adaptable móvil y desktop
- ✅ **60+ tests**: Suite completa de tests

## 🚀 Uso Básico

### Lista Simple

```tsx
import { FoodList } from './components/FoodList'
import type { Food } from './types'

function MiComponente() {
  const foods: Food[] = [
    {
      id: '1',
      name: 'Pollo',
      category: 'proteina',
      meals: ['almuerzo', 'cena'],
      quantity: 200,
      unit: 'gramos'
    },
    // más alimentos...
  ]

  return <FoodList foods={foods} />
}
```

### Con Todas las Acciones

```tsx
function GestionAlimentos() {
  const [foods, setFoods] = useState<Food[]>([...])

  const handleEdit = (food: Food) => {
    console.log('Editar:', food)
    // Abrir formulario de edición
  }

  const handleDelete = (id: string) => {
    setFoods(prev => prev.filter(f => f.id !== id))
  }

  const handleDecrement = (food: Food) => {
    setFoods(prev => prev.map(f => 
      f.id === food.id 
        ? { ...f, quantity: Math.max(0, f.quantity - 1) }
        : f
    ))
  }

  return (
    <FoodList
      foods={foods}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onDecrement={handleDecrement}
    />
  )
}
```

### Con Mensaje Personalizado

```tsx
<FoodList
  foods={foods}
  emptyMessage="Aún no has agregado alimentos a tu inventario"
/>
```

## 📖 API

### Props

```typescript
interface FoodListProps {
  /** Lista de alimentos a mostrar (requerido) */
  foods: Food[]
  
  /** Callback al editar un alimento (opcional) */
  onEdit?: (food: Food) => void
  
  /** Callback al eliminar un alimento (opcional) */
  onDelete?: (id: string) => void
  
  /** Callback al decrementar stock (opcional) */
  onDecrement?: (food: Food) => void
  
  /** Mensaje cuando no hay alimentos (opcional) */
  emptyMessage?: string  // default: 'No hay alimentos para mostrar'
}
```

### Comportamiento de Callbacks

**onEdit**
- Recibe el objeto `Food` completo
- Se debe implementar la lógica de edición en el componente padre
- Si no se proporciona, el botón "Editar" no aparece

**onDelete**
- Recibe solo el `id` del alimento
- Muestra confirmación automática antes de ejecutar
- Si el usuario cancela, no se ejecuta el callback
- Si no se proporciona, el botón "Eliminar" no aparece

**onDecrement**
- Recibe el objeto `Food` completo
- Se debe implementar la lógica de decremento en el padre
- El botón se deshabilita automáticamente cuando `quantity === 0`
- Si no se proporciona, el botón no aparece

## 🎯 Filtros

### Filtro por Comida

Permite filtrar alimentos según las comidas del día:
- **Todas las comidas** (opción por defecto)
- **Desayuno** 🌅
- **Almuerzo** ☀️
- **Cena** 🌙

**Comportamiento:**
- Muestra alimentos que incluyen la comida seleccionada en su array `meals`
- Un alimento puede aparecer en múltiples filtros si tiene varias comidas

```tsx
// Este alimento aparecerá en filtros: almuerzo y cena
const pollo: Food = {
  meals: ['almuerzo', 'cena'],
  // ...
}
```

### Filtro por Categoría

Permite filtrar alimentos por su categoría:
- **Todas las categorías** (opción por defecto)
- **Proteína** 🥩
- **Carbohidrato** 🍞
- **Frutas y Vegetales** 🥗

**Comportamiento:**
- Muestra solo alimentos de la categoría seleccionada
- Cada alimento tiene exactamente una categoría

### Filtros Combinados

Los filtros se aplican simultáneamente con lógica AND:

```tsx
// Ejemplo: Filtrar "proteínas para desayuno"
// Mostrará solo alimentos que sean proteínas Y que incluyan desayuno
selectedCategory = 'proteina'
selectedMeal = 'desayuno'
```

### Indicadores de Filtros

Cuando hay filtros activos:
- Se muestra un banner azul con el conteo: "Mostrando X de Y alimentos"
- Aparece un botón "Limpiar filtros"
- El resumen inferior muestra: "Total: X • Filtrados: Y"

### Limpiar Filtros

Hay dos formas de limpiar los filtros:
1. Botón "Limpiar filtros" en el banner de filtros activos
2. Botón "Ver todos los alimentos" cuando el filtro no tiene resultados

## 📦 Información Mostrada

Para cada alimento se muestra:

### Cabecera
- **Nombre** (texto grande y bold)
- **Badge de categoría** (con icono, color y label)

### Cantidad
- **Cantidad y unidad** (ej: "200 gramos")
- **Indicador "Sin stock"** si quantity === 0 (badge rojo)
- El texto de cantidad se colorea en rojo si no hay stock

### Comidas
- **Badges de comidas** (con iconos y colores)
- Solo se muestra si el array `meals` tiene elementos

### Notas
- **Texto en cursiva** entre comillas
- Solo se muestra si existe el campo `notes`

### Botones de Acción
- **➖ Stock** (decrementar, naranja, deshabilitado si quantity === 0)
- **✏️ Editar** (azul)
- **🗑️ Eliminar** (rojo)

## 🎨 Estilos y Diseño

### Colores de Categorías

```tsx
'proteina'     → bg-red-100 text-red-800 (🥩 Proteína)
'carbohidrato' → bg-yellow-100 text-yellow-800 (🍞 Carbohidrato)
'fruta_veg'    → bg-green-100 text-green-800 (🥗 Frutas y Vegetales)
```

### Colores de Comidas

```tsx
'desayuno' → bg-orange-100 text-orange-800 (🌅 Desayuno)
'almuerzo' → bg-blue-100 text-blue-800 (☀️ Almuerzo)
'cena'     → bg-purple-100 text-purple-800 (🌙 Cena)
```

### Estados de Botones

```tsx
// Botón normal
bg-blue-100 text-blue-700 hover:bg-blue-200

// Botón deshabilitado
bg-gray-100 text-gray-400 cursor-not-allowed

// Botón de eliminar
bg-red-100 text-red-700 hover:bg-red-200

// Botón de decrementar
bg-orange-100 text-orange-700 hover:bg-orange-200
```

### Responsive Design

**Mobile (< 768px):**
- Filtros en columna única
- Botones de acción en fila horizontal
- Información del alimento apilada verticalmente

**Desktop (>= 768px):**
- Filtros en dos columnas
- Botones de acción en columna vertical a la derecha
- Layout horizontal con flex

## 🧪 Tests

El componente incluye 60+ tests cubriendo:

### Ejecutar Tests

```bash
# Todos los tests
npm run test

# Solo FoodList
npm run test FoodList

# Con UI
npm run test:ui

# Con cobertura
npm run test:coverage
```

### Categorías de Tests

**1. Renderizado** (5 tests)
- Lista de alimentos
- Mensaje vacío (default y personalizado)
- Filtros
- Total de alimentos

**2. Información de Alimentos** (6 tests)
- Nombre y categoría
- Cantidad y unidad
- Badges de comidas
- Notas opcionales
- Indicador sin stock

**3. Filtros** (9 tests)
- Filtrar por cada comida
- Filtrar por cada categoría
- Filtros combinados
- Contador de filtrados
- Limpiar filtros
- Sin resultados

**4. Botones de Acción** (10 tests)
- Renderizado condicional
- Callbacks con datos correctos
- Confirmación de eliminación
- Botón decrementar deshabilitado
- No llamar callbacks cuando disabled

**5. Casos Especiales** (3 tests)
- Alimentos sin comidas
- Alimentos sin notas
- Actualización de lista

**6. Accesibilidad** (2 tests)
- Labels de filtros
- Títulos en botones deshabilitados

**7. UI y Responsive** (2 tests)
- Estilos sin stock
- Iconos de categorías

### Ejemplo de Test

```typescript
it('debe filtrar por comida y categoría simultáneamente', async () => {
  const user = userEvent.setup()
  render(<FoodList foods={mockFoods} />)

  await user.selectOptions(
    screen.getByLabelText(/filtrar por comida/i),
    'desayuno'
  )
  await user.selectOptions(
    screen.getByLabelText(/filtrar por categoría/i),
    'proteina'
  )

  // Solo debe aparecer "Huevos" (proteína + desayuno)
  expect(screen.getByText('Huevos')).toBeInTheDocument()
  expect(screen.queryByText('Manzana')).not.toBeInTheDocument()
})
```

## 💡 Ejemplos de Uso

### Integración con useStorage

```tsx
import { useState } from 'react'
import { useStorage } from './hooks/useStorage'
import { FoodList } from './components/FoodList'
import { FoodForm } from './components/FoodForm'
import type { Food } from './types'

function App() {
  const [foods, setFoods] = useStorage<Food[]>('foods', [])
  const [editing, setEditing] = useState<Food | null>(null)

  const handleDecrement = (food: Food) => {
    setFoods(prev => prev.map(f =>
      f.id === food.id
        ? { ...f, quantity: f.quantity - 1 }
        : f
    ))
  }

  return (
    <div>
      {editing ? (
        <FoodForm
          initialFood={editing}
          onSave={(updated) => {
            setFoods(prev => prev.map(f =>
              f.id === updated.id ? updated : f
            ))
            setEditing(null)
          }}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <FoodList
          foods={foods}
          onEdit={setEditing}
          onDelete={(id) => setFoods(prev => prev.filter(f => f.id !== id))}
          onDecrement={handleDecrement}
        />
      )}
    </div>
  )
}
```

### Solo Lectura (Sin Acciones)

```tsx
<FoodList foods={foods} />
// No se mostrarán botones de acción
```

### Solo con Editar

```tsx
<FoodList
  foods={foods}
  onEdit={handleEdit}
/>
// Solo se mostrará el botón "Editar"
```

### Decrementar con Lógica Personalizada

```tsx
const handleDecrement = (food: Food) => {
  // Decrementar en 10 unidades
  setFoods(prev => prev.map(f =>
    f.id === food.id
      ? { ...f, quantity: Math.max(0, f.quantity - 10) }
      : f
  ))
  
  // Notificar si llegó a 0
  if (food.quantity - 10 <= 0) {
    toast.warning(`${food.name} se quedó sin stock`)
  }
}
```

### Con Búsqueda Externa

```tsx
function FoodManagement() {
  const [foods] = useStorage<Food[]>('foods', [])
  const [searchTerm, setSearchTerm] = useState('')

  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar alimentos..."
      />
      <FoodList foods={filteredFoods} />
    </>
  )
}
```

## 🎯 Casos de Uso

### 1. Inventario de Cocina
```tsx
// Ver qué alimentos tienes y cuánto queda
<FoodList
  foods={inventory}
  onDecrement={reduceStock}
  emptyMessage="Tu inventario está vacío"
/>
```

### 2. Planificación de Comidas
```tsx
// Filtrar alimentos por comida para planear
<FoodList
  foods={availableFoods}
  // Los filtros internos permiten ver qué hay para cada comida
/>
```

### 3. Gestión de Despensa
```tsx
// CRUD completo de alimentos
<FoodList
  foods={pantry}
  onEdit={editFood}
  onDelete={removeFood}
  onDecrement={useFood}
/>
```

### 4. Vista de Solo Lectura
```tsx
// Mostrar receta sin permitir cambios
<FoodList
  foods={recipeIngredients}
  emptyMessage="Esta receta no tiene ingredientes"
/>
```

## 🔧 Personalización

### Cambiar Decremento

Por defecto, el componente solo llama el callback. El padre decide cuánto decrementar:

```tsx
// Decrementar de 1 en 1
const handleDecrement = (food: Food) => {
  setFoods(prev => prev.map(f =>
    f.id === food.id
      ? { ...f, quantity: f.quantity - 1 }
      : f
  ))
}

// Decrementar de 5 en 5
const handleDecrementBy5 = (food: Food) => {
  setFoods(prev => prev.map(f =>
    f.id === food.id
      ? { ...f, quantity: Math.max(0, f.quantity - 5) }
      : f
  ))
}

// Decrementar porcentaje
const handleDecrementPercent = (food: Food, percent: number) => {
  setFoods(prev => prev.map(f =>
    f.id === food.id
      ? { ...f, quantity: f.quantity * (1 - percent / 100) }
      : f
  ))
}
```

### Sin Confirmación al Eliminar

El componente usa `window.confirm` por defecto. Para usar una UI personalizada:

```tsx
// Crear wrapper personalizado
const MyFoodList = (props) => {
  const [foodToDelete, setFoodToDelete] = useState<string | null>(null)

  // Sobrescribir window.confirm temporalmente
  const handleDelete = (id: string) => {
    setFoodToDelete(id)
    // Mostrar tu modal personalizado
  }

  return <FoodList {...props} onDelete={handleDelete} />
}
```

## 📚 Recursos Relacionados

- [Tipos TypeScript (Food, Category)](./types.md)
- [Componente FoodForm](./FoodForm.md)
- [Hook useStorage](./useStorage.md)
- [Ejemplo Completo](../src/components/FoodFormExample.tsx)

## 📄 Licencia

MIT

