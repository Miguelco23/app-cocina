# Componente FoodForm

Componente React con TypeScript para crear y editar alimentos. Incluye validación, estilos con Tailwind CSS y tests completos.

## 📋 Características

- ✅ **Crear y editar**: Soporta ambos modos de operación
- ✅ **Validación en tiempo real**: name requerido, quantity >= 0
- ✅ **Type-safe**: Completamente tipado con TypeScript
- ✅ **Estilos modernos**: Diseñado con Tailwind CSS
- ✅ **Accesible**: Labels correctos y campos marcados como requeridos
- ✅ **100% testeado**: Suite completa de tests con Vitest y Testing Library

## 🚀 Uso Básico

### Crear un nuevo alimento

```tsx
import { FoodForm } from './components/FoodForm'
import type { CreateFood } from './types'

function MiComponente() {
  const handleSave = (food: CreateFood) => {
    // Guardar el alimento (sin ID)
    const newFood = {
      ...food,
      id: generarId()
    }
    console.log('Nuevo alimento:', newFood)
  }

  return <FoodForm onSave={handleSave} />
}
```

### Editar un alimento existente

```tsx
import { FoodForm } from './components/FoodForm'
import type { Food } from './types'

function EditarAlimento() {
  const alimentoExistente: Food = {
    id: 'food-001',
    name: 'Pollo',
    category: 'proteina',
    meals: ['almuerzo', 'cena'],
    quantity: 200,
    unit: 'gramos',
    notes: 'Pollo a la plancha'
  }

  const handleSave = (food: Food | CreateFood) => {
    // En modo edición, food incluirá el ID
    console.log('Alimento actualizado:', food)
  }

  return (
    <FoodForm 
      initialFood={alimentoExistente}
      onSave={handleSave}
    />
  )
}
```

### Con botón de cancelar

```tsx
function FormularioCompleto() {
  const [showForm, setShowForm] = useState(false)

  const handleSave = (food) => {
    // Guardar...
    setShowForm(false)
  }

  const handleCancel = () => {
    setShowForm(false)
  }

  return (
    <FoodForm
      onSave={handleSave}
      onCancel={handleCancel}
      submitButtonText="Crear Alimento"
    />
  )
}
```

## 📖 API

### Props

```typescript
interface FoodFormProps {
  /** Alimento a editar (opcional) */
  initialFood?: Food | null
  
  /** Callback al guardar el alimento (requerido) */
  onSave: (food: CreateFood | Food) => void
  
  /** Callback al cancelar (opcional) */
  onCancel?: () => void
  
  /** Texto del botón de guardar (opcional, default: 'Guardar') */
  submitButtonText?: string
}
```

### Comportamiento del callback `onSave`

**Modo Creación** (sin `initialFood`):
- Retorna un objeto `CreateFood` (sin campo `id`)
- Debes generar el ID antes de guardarlo

**Modo Edición** (con `initialFood`):
- Retorna un objeto `Food` completo (con campo `id` incluido)
- El ID se mantiene del alimento original

## 📝 Campos del Formulario

### Nombre (requerido)
- **Tipo**: Text input
- **Validación**: No puede estar vacío
- **Placeholder**: "Ej: Pechuga de Pollo"

### Categoría
- **Tipo**: Select dropdown
- **Opciones**: 
  - 🥩 Proteína
  - 🍞 Carbohidrato
  - 🥗 Frutas y Vegetales
- **Default**: Proteína

### Comidas
- **Tipo**: Checkboxes múltiples
- **Opciones**:
  - 🌅 Desayuno
  - ☀️ Almuerzo
  - 🌙 Cena
- **Puede quedar vacío**

### Cantidad (requerido)
- **Tipo**: Number input
- **Validación**: Debe ser >= 0
- **Min**: 0
- **Step**: 0.1

### Unidad
- **Tipo**: Select dropdown
- **Opciones**: gramos, kilogramos, litros, mililitros, unidades, tazas, cucharadas, cucharaditas, porciones
- **Default**: gramos

### Notas (opcional)
- **Tipo**: Textarea
- **Placeholder**: "Información adicional sobre el alimento..."
- **Rows**: 3

## ✅ Validación

### Reglas de Validación

1. **Nombre requerido**
   - Se valida al hacer blur del campo
   - Se valida al hacer submit
   - Mensaje: "El nombre es requerido"

2. **Cantidad >= 0**
   - Se valida al cambiar el valor
   - Se valida al hacer submit
   - Mensaje: "La cantidad debe ser mayor o igual a 0"

### Estados de Validación

El formulario maneja tres estados:
- **Limpio**: Campo no tocado, sin errores mostrados
- **Tocado**: Campo ha recibido blur, muestra errores si existen
- **Error**: Validación falló, muestra mensaje de error

### Ejemplo de Validación

```tsx
// Estado interno del componente
const [errors, setErrors] = useState<FormErrors>({})
const [touched, setTouched] = useState<Record<string, boolean>>({})

// Los errores solo se muestran si el campo ha sido tocado
{errors.name && touched.name && (
  <p className="text-red-600">{errors.name}</p>
)}
```

## 🎨 Estilos

El componente usa **Tailwind CSS** con las siguientes características:

### Colores
- **Primary**: Blue (botones principales)
- **Error**: Red (mensajes de error)
- **Success**: Green (estados válidos)

### Estados Interactivos
- **Hover**: Cambio de color en botones y checkboxes
- **Focus**: Ring azul en inputs activos
- **Error**: Borde rojo en campos con errores

### Responsive
- **Mobile-first**: Funciona bien en móviles
- **Grid adaptativo**: Cantidad y unidad en columnas en desktop

### Clases Personalizables

Para personalizar los estilos, puedes modificar las clases de Tailwind directamente en el componente:

```tsx
// Ejemplo: Cambiar color del botón principal
<button
  type="submit"
  className="bg-green-600 hover:bg-green-700" // Cambiar de blue a green
>
  Guardar
</button>
```

## 🧪 Tests

El componente incluye una suite completa de tests (50+ casos).

### Ejecutar Tests

```bash
# Todos los tests
npm run test

# Solo tests de FoodForm
npm run test FoodForm

# Con UI
npm run test:ui

# Con cobertura
npm run test:coverage
```

### Categorías de Tests

**1. Renderizado** (7 tests)
- Renderiza todos los campos
- Muestra título correcto según modo
- Renderiza botón cancelar condicionalmente

**2. Valores Iniciales** (2 tests)
- Carga datos al editar
- Valores por defecto en modo creación

**3. Validación** (5 tests)
- Valida nombre vacío
- Valida cantidad negativa
- Validación en tiempo real
- Permite cantidad = 0

**4. Interacción con Campos** (7 tests)
- Actualiza cada campo correctamente
- Marca/desmarca checkboxes
- Cambia selects

**5. Submit del Formulario** (4 tests)
- Envía datos correctos en creación
- Envía datos con ID en edición
- Maneja múltiples comidas
- Permite arrays vacíos

**6. Botón Cancelar** (1 test)
- Llama callback correctamente

**7. Personalización** (1 test)
- Texto de botón personalizado

**8. Accesibilidad** (2 tests)
- Labels asociados
- Campos requeridos marcados

### Ejemplo de Test

```typescript
it('debe validar nombre vacío al submit', async () => {
  const mockOnSave = vi.fn()
  render(<FoodForm onSave={mockOnSave} />)

  const submitButton = screen.getByRole('button', { name: /guardar/i })
  fireEvent.click(submitButton)

  await waitFor(() => {
    expect(screen.getByText('El nombre es requerido')).toBeInTheDocument()
  })

  expect(mockOnSave).not.toHaveBeenCalled()
})
```

## 💡 Ejemplo Completo

Ver `src/components/FoodFormExample.tsx` para un ejemplo completo funcional que incluye:

- ✅ Crear nuevos alimentos
- ✅ Editar alimentos existentes
- ✅ Eliminar alimentos
- ✅ Lista de alimentos
- ✅ Persistencia con useStorage
- ✅ UI completa con Tailwind

```bash
# Ver en el navegador
npm run dev
# Navegar a "Gestión de Alimentos"
```

## 🔧 Integración con useStorage

Ejemplo de cómo integrar con el hook `useStorage`:

```tsx
import { useState } from 'react'
import { useStorage } from './hooks/useStorage'
import { FoodForm } from './components/FoodForm'
import type { Food, CreateFood } from './types'

function GestionAlimentos() {
  const [foods, setFoods] = useStorage<Food[]>('foods-list', [])
  const [editingFood, setEditingFood] = useState<Food | null>(null)
  const [showForm, setShowForm] = useState(false)

  const generateId = () => `food-${Date.now()}`

  const handleSave = (foodData: CreateFood | Food) => {
    if ('id' in foodData) {
      // Editar existente
      setFoods(prev => prev.map(f => 
        f.id === foodData.id ? foodData : f
      ))
    } else {
      // Crear nuevo
      setFoods(prev => [...prev, { ...foodData, id: generateId() }])
    }
    setShowForm(false)
    setEditingFood(null)
  }

  const handleEdit = (food: Food) => {
    setEditingFood(food)
    setShowForm(true)
  }

  return (
    <div>
      {showForm ? (
        <FoodForm
          initialFood={editingFood}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <button onClick={() => setShowForm(true)}>
          Nuevo Alimento
        </button>
      )}
      
      {/* Lista de alimentos */}
      {foods.map(food => (
        <div key={food.id}>
          <span>{food.name}</span>
          <button onClick={() => handleEdit(food)}>Editar</button>
        </div>
      ))}
    </div>
  )
}
```

## 🎯 Mejores Prácticas

### 1. Generar IDs únicos

```typescript
// ✅ Bueno
const generateId = () => `food-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// ❌ Evitar IDs predecibles
const generateId = () => foods.length + 1
```

### 2. Validar antes de guardar

```typescript
const handleSave = (food: CreateFood | Food) => {
  // Validaciones adicionales si es necesario
  if (!food.meals.length) {
    console.warn('No se seleccionaron comidas')
  }
  
  // Guardar...
}
```

### 3. Feedback al usuario

```typescript
const handleSave = async (food: CreateFood | Food) => {
  try {
    // Guardar...
    toast.success('Alimento guardado correctamente')
  } catch (error) {
    toast.error('Error al guardar el alimento')
  }
}
```

### 4. Reset del formulario

```typescript
// El formulario se resetea automáticamente al cambiar initialFood
setEditingFood(null) // Para crear nuevo
setEditingFood(nuevoAlimento) // Para editar otro
```

## 📚 Recursos Relacionados

- [Tipos TypeScript (Food, Category)](./types.md)
- [Hook useStorage](./useStorage.md)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📄 Licencia

MIT

