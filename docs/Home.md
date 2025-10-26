# Componente Home

Componente principal que integra todos los features de la aplicación: gestión de alimentos (FoodForm + FoodList), generador de menú (Roulette) y persistencia con useStorage.

## 📋 Características

- ✅ **Integración completa**: FoodForm, FoodList y Roulette en un solo lugar
- ✅ **Persistencia**: useStorage para guardar inventario automáticamente
- ✅ **Estadísticas**: Total, con stock, sin stock, categorías
- ✅ **Gestión de inventario**: Crear, editar, eliminar y decrementar alimentos
- ✅ **Generador de menú**: Ruleta animada con selector de comida
- ✅ **Decrementar stock**: Confirma receta y reduce inventario automáticamente
- ✅ **Responsive**: Diseño adaptable para móvil y desktop

## 🚀 Uso

### Como Componente Principal

```tsx
import { Home } from './components/Home'

function App() {
  return <Home />
}
```

El componente es completamente autónomo y no requiere props ni configuración adicional.

## 📖 Funcionalidades

### 1. Import/Export

**Exportar Inventario:**
- Click en "📥 Exportar"
- Descarga archivo JSON con timestamp: `alimentos_YYYYMMDD_HHMM.json`
- Formato JSON bonito (indentado)
- Botón deshabilitado si no hay alimentos

**Importar Inventario:**
- Click en "📤 Importar"
- Seleccionar archivo JSON
- Validación automática del contenido
- Si hay alimentos existentes, elige:
  - 🔀 **Combinar**: Agregar sin duplicar (por ID)
  - 🔄 **Reemplazar**: Eliminar todo y cargar nuevos
  - ❌ **Cancelar**: No importar nada

**Validaciones:**
- Verifica que sea JSON válido
- Valida estructura de cada alimento
- Muestra errores específicos
- Permite importar solo alimentos válidos (ignora inválidos)

**Mensajes de Feedback:**
- ✅ "Exportado: X alimentos"
- ✅ "Importados: X alimentos"
- ✅ "Agregados: X alimentos (total: Y)"
- ❌ "Errores: [detalles]"

### 2. Gestión de Alimentos

**Crear Alimento:**
- Click en "➕ Nuevo Alimento"
- Llenar formulario
- Guardar automáticamente en localStorage

**Editar Alimento:**
- Click en "✏️ Editar" en cualquier alimento
- Modificar datos
- Actualizar

**Eliminar Alimento:**
- Click en "🗑️ Eliminar"
- Confirmar eliminación
- Se elimina del inventario

**Decrementar Stock:**
- Click en "➖ Stock" en cualquier alimento
- Reduce quantity en 1
- Se deshabilita si quantity === 0

### 3. Generador de Menú (Ruleta)

**Seleccionar Comida:**
```tsx
// Desplegable con 3 opciones
- 🌅 Desayuno
- ☀️ Almuerzo
- 🌙 Cena
```

**Girar Ruleta:**
1. Selecciona la comida deseada
2. Click en "🎰 Girar Ruleta"
3. Se abre modal con animación
4. La ruleta selecciona 1 proteína, 1 carbohidrato, 1 fruta/vegetal
5. Muestra resultado

**Confirmar Receta:**
1. Después de girar, aparece el resultado
2. Click en "✅ Confirmar y Decrementar Stock"
3. Reduce quantity de cada ingrediente seleccionado en 1
4. Cierra modal y actualiza lista

### 4. Estadísticas

El componente muestra 4 métricas en tiempo real:

```tsx
📊 Total Alimentos      // Cantidad total en inventario
✅ Con Stock           // Alimentos con quantity > 0
❌ Sin Stock          // Alimentos con quantity === 0
🏷️ Categorías        // Número de categorías únicas
```

## 🔄 Flujo de Uso Típico

### Flujo Completo

```
1. Usuario entra a la app (Home se carga)
   ↓
2. Click "Nuevo Alimento"
   ↓
3. Llena formulario (Pollo, 200g, proteína, almuerzo/cena)
   ↓
4. Guarda → Se persiste en localStorage
   ↓
5. Repite para más alimentos (Arroz, Brócoli, etc.)
   ↓
6. Selecciona "Almuerzo" en el desplegable
   ↓
7. Click "Girar Ruleta"
   ↓
8. Modal se abre → Animación → Resultado
   ↓
9. Click "Confirmar y Decrementar Stock"
   ↓
10. Stock se reduce, resultado se limpia
```

## 🎨 Diseño y UI

### Layout

**Desktop (>= 1024px):**
```
┌─────────────────────────────────────────────┐
│           Header (título + botones)         │
├─────────────────────────────────────────────┤
│          Estadísticas (4 cards)             │
├──────────────────────────┬──────────────────┤
│  Formulario/Lista        │   Controles      │
│  (2/3 ancho)             │   Ruleta         │
│                          │   (1/3 ancho)    │
└──────────────────────────┴──────────────────┘
```

**Mobile (<1024px):**
```
┌─────────────┐
│   Header    │
├─────────────┤
│ Estadísticas│
├─────────────┤
│ Form/Lista  │
├─────────────┤
│  Controles  │
└─────────────┘
```

### Colores

- **Header**: Fondo blanco
- **Background**: Gradiente indigo → purple → pink
- **Botón principal**: Verde (Nuevo Alimento)
- **Botón ruleta**: Gradiente purple → pink
- **Confirmar receta**: Verde
- **Estadísticas**: Cards blancos con números coloridos

### Modal de Ruleta

```tsx
// Modal full screen con overlay oscuro
position: fixed
background: rgba(0,0,0,0.5)
z-index: 50

// Contenido centrado con scroll
max-width: 5xl
max-height: 90vh
overflow-y: auto
```

## 🔧 Estado del Componente

### Estados Persistentes (useStorage)

```typescript
const [foods, setFoods] = useStorage<Food[]>('foods-inventory', [])
```

### Estados Locales (useState)

```typescript
const [showForm, setShowForm] = useState(false)           // Mostrar formulario
const [editingFood, setEditingFood] = useState<Food | null>(null)  // Alimento en edición
const [showRoulette, setShowRoulette] = useState(false)   // Mostrar modal ruleta
const [selectedMeal, setSelectedMeal] = useState<Meal>('almuerzo')  // Comida seleccionada
const [rouletteResult, setRouletteResult] = useState<RouletteResult | null>(null)  // Resultado ruleta
```

## 📊 Lógica de Negocio

### Crear/Editar Alimento

```typescript
const handleSaveFood = (foodData: CreateFood | Food) => {
  if ('id' in foodData) {
    // Editar: actualizar en el array
    setFoods(prev => prev.map(f => f.id === foodData.id ? foodData : f))
  } else {
    // Crear: agregar con ID generado
    const newFood: Food = { ...foodData, id: generateId() }
    setFoods(prev => [...prev, newFood])
  }
  setShowForm(false)
}
```

### Confirmar Receta

```typescript
const handleConfirmRecipe = () => {
  if (!rouletteResult) return

  // Decrementar stock de ingredientes seleccionados
  setFoods(prev => prev.map(food => {
    if (
      food.id === rouletteResult.proteina?.id ||
      food.id === rouletteResult.carbohidrato?.id ||
      food.id === rouletteResult.fruta_veg?.id
    ) {
      return { ...food, quantity: Math.max(0, food.quantity - 1) }
    }
    return food
  }))

  // Limpiar y cerrar
  setRouletteResult(null)
  setShowRoulette(false)
}
```

### Validación de Ruleta

```typescript
import { hasAllCategories } from '../utils/randomPick'

const canSpinRoulette = hasAllCategories(foods, selectedMeal)

// Deshabilitar botón si no se puede girar
<button disabled={!canSpinRoulette}>
  {canSpinRoulette ? 'Girar Ruleta' : 'Faltan Alimentos'}
</button>
```

## 🧪 Tests

El componente incluye 30+ tests cubriendo:

### Ejecutar Tests

```bash
npm run test Home
```

### Categorías de Tests

**1. Renderizado Inicial** (6 tests)
- Componente principal
- Botones
- Estadísticas
- Selector de comida
- Mensaje de ayuda

**2. Estadísticas** (2 tests)
- Actualización con alimentos
- Alimentos sin stock

**3. Crear Alimento** (3 tests)
- Mostrar formulario
- Ocultar lista
- Cancelar formulario

**4. Selector de Comida** (2 tests)
- Cambiar comida
- Todas las opciones

**5. Botón de Ruleta** (5 tests)
- Deshabilitado sin alimentos
- Deshabilitado con categorías incompletas
- Habilitado con todas las categorías
- Abrir modal
- Mensaje de advertencia

**6. Modal de Ruleta** (2 tests)
- Cerrar modal
- Mostrar comida en título

**7. Confirmar Receta** (1 test)
- Botón presente después de resultado

**8. Integración con FoodList** (3 tests)
- Mostrar lista
- Editar desde lista
- Persistencia en localStorage

**9. Accesibilidad** (3 tests)
- Labels asociados
- Textos descriptivos
- Estados visuales

**10. Persistencia** (2 tests)
- Cargar desde localStorage
- Guardar en localStorage

## 💡 Ejemplos de Uso

### Uso Básico

```tsx
import { Home } from './components/Home'

function App() {
  return <Home />
}

export default App
```

### Con Navegación

```tsx
import { useState } from 'react'
import { Home } from './components/Home'
import { Settings } from './components/Settings'

function App() {
  const [view, setView] = useState<'home' | 'settings'>('home')

  return (
    <>
      {view === 'home' && <Home />}
      {view === 'settings' && <Settings />}
    </>
  )
}
```

## 🔧 Personalización

### Cambiar Nombre de Storage

```tsx
// En Home.tsx, línea ~17:
const [foods, setFoods] = useStorage<Food[]>('mi-inventario-personalizado', [])
```

### Modificar Cantidad de Decremento

```tsx
// Por defecto decrementa en 1
quantity: Math.max(0, food.quantity - 1)

// Para decrementar más:
quantity: Math.max(0, food.quantity - 5)
```

### Añadir Confirmación al Decrementar Receta

```tsx
const handleConfirmRecipe = () => {
  if (!rouletteResult) return
  
  if (!confirm('¿Confirmar esta receta y actualizar el stock?')) {
    return
  }
  
  // ... resto del código
}
```

## 🎯 Features Destacadas

### 1. Integración Total
Un solo componente combina toda la funcionalidad de la app

### 2. Persistencia Automática
Todos los cambios se guardan automáticamente en localStorage

### 3. Modal Inteligente
El modal de ruleta solo aparece cuando se puede usar

### 4. Feedback Visual
Estadísticas en tiempo real, botones deshabilitados con mensajes claros

### 5. Responsive
Funciona perfectamente en móvil y desktop

## 📚 Componentes Usados

- **FoodForm** - Para crear/editar alimentos
- **FoodList** - Para mostrar inventario con filtros
- **Roulette** - Para generar menú aleatorio
- **useStorage** - Para persistencia automática
- **hasAllCategories** - Para validar disponibilidad

## 📊 Arquitectura

```
Home
├── Header
│   ├── Título
│   └── Botón "Nuevo Alimento"
├── Estadísticas (4 cards)
│   ├── Total Alimentos
│   ├── Con Stock
│   ├── Sin Stock
│   └── Categorías
├── Grid Principal
│   ├── Columna Izquierda (2/3)
│   │   ├── FoodForm (condicional)
│   │   └── FoodList (condicional)
│   └── Columna Derecha (1/3)
│       ├── Selector de Comida
│       ├── Botón Girar Ruleta
│       ├── Resultado (condicional)
│       ├── Botón Confirmar (condicional)
│       └── Información de ayuda
└── Modal Ruleta (condicional)
    ├── Botón cerrar
    └── Componente Roulette
```

## 🔒 Validaciones

### Antes de Girar Ruleta

```typescript
// Verificar que hay alimentos en todas las categorías
const canSpinRoulette = hasAllCategories(foods, selectedMeal)

// Si no se puede, mostrar mensaje
{!canSpinRoulette && foods.length > 0 && (
  <p>Necesitas al menos un alimento de cada categoría con stock</p>
)}
```

### Al Confirmar Receta

```typescript
// Solo si hay resultado
if (!rouletteResult) return

// Decrementar stock de forma segura
quantity: Math.max(0, food.quantity - 1)
```

## 📚 Recursos Relacionados

- [Componente FoodForm](./FoodForm.md)
- [Componente FoodList](./FoodList.md)
- [Componente Roulette](./Roulette.md)
- [Hook useStorage](./useStorage.md)
- [Utilidades randomPick](./randomPick.md)

## 📄 Licencia

MIT

