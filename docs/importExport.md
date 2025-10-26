# Utilidades Import/Export

Funciones para importar y exportar la lista de alimentos en formato JSON con validación robusta.

## 📋 Características

- ✅ **Exportar a JSON**: Descarga inventario como archivo JSON
- ✅ **Importar desde JSON**: Carga alimentos desde archivo
- ✅ **Validación robusta**: Verifica estructura y campos requeridos
- ✅ **Merge inteligente**: Combina sin duplicados por ID
- ✅ **Reemplazo seguro**: Opción para reemplazar todo el inventario
- ✅ **Generación de nombres**: Timestamps automáticos en archivos
- ✅ **50+ tests**: Suite completa de validación

## 🚀 Funciones Principales

### exportToJSON

Exporta la lista de alimentos a un archivo JSON descargable.

```typescript
function exportToJSON(foods: Food[], filename?: string): void
```

**Parámetros:**
- `foods: Food[]` - Array de alimentos a exportar
- `filename?: string` - Nombre del archivo (default: 'alimentos.json')

**Ejemplo:**

```typescript
import { exportToJSON } from './utils/importExport'

const alimentos: Food[] = [...]

// Con nombre personalizado
exportToJSON(alimentos, 'mi-inventario.json')

// Con nombre por defecto
exportToJSON(alimentos)
```

**Comportamiento:**
1. Convierte el array a JSON con formato bonito (indent 2)
2. Crea un Blob con el contenido
3. Genera URL temporal
4. Simula click en link de descarga
5. Limpia recursos

### importFromJSON

Lee un archivo JSON y retorna los alimentos validados.

```typescript
function importFromJSON(file: File): Promise<{
  valid: boolean
  foods: Food[]
  errors: string[]
}>
```

**Parámetros:**
- `file: File` - Archivo JSON a importar

**Retorna:**
```typescript
{
  valid: boolean      // true si no hay errores
  foods: Food[]       // Alimentos válidos encontrados
  errors: string[]    // Lista de errores (vacía si valid = true)
}
```

**Ejemplo:**

```typescript
const handleFileSelect = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  const result = await importFromJSON(file)

  if (!result.valid) {
    console.error('Errores:', result.errors)
    return
  }

  console.log('Importados:', result.foods)
}
```

### isValidFood

Valida si un objeto tiene la estructura correcta de Food.

```typescript
function isValidFood(obj: any): obj is Food
```

**Validaciones:**
- ✅ `id` es string no vacío
- ✅ `name` es string no vacío
- ✅ `category` es una de las categorías válidas
- ✅ `meals` es array de Meal válidas
- ✅ `quantity` es número >= 0
- ✅ `unit` es string
- ✅ `notes` es string o undefined (opcional)

**Ejemplo:**

```typescript
const data = JSON.parse(jsonString)

if (isValidFood(data)) {
  // TypeScript sabe que data es Food
  console.log(data.name)
}
```

### validateFoodsArray

Valida un array completo de alimentos.

```typescript
function validateFoodsArray(data: any): {
  valid: boolean
  foods: Food[]
  errors: string[]
}
```

**Retorna:**
- `valid: true` - Si todos los alimentos son válidos
- `valid: false` - Si hay algún error
- `foods` - Alimentos válidos (aunque valid sea false)
- `errors` - Lista de errores encontrados

**Ejemplo:**

```typescript
const data = JSON.parse(fileContent)
const validation = validateFoodsArray(data)

if (validation.valid) {
  // Todos válidos
  setFoods(validation.foods)
} else {
  // Algunos inválidos
  console.error('Errores:', validation.errors)
  console.log('Válidos encontrados:', validation.foods.length)
}
```

### mergeFoods

Combina alimentos importados con existentes, evitando duplicados por ID.

```typescript
function mergeFoods(existing: Food[], imported: Food[]): Food[]
```

**Comportamiento:**
- Mantiene todos los alimentos existentes
- Agrega solo alimentos importados con IDs únicos
- No modifica alimentos existentes (aunque el importado tenga mismo ID)

**Ejemplo:**

```typescript
const existentes = [
  { id: '1', name: 'Pollo', ... },
  { id: '2', name: 'Arroz', ... }
]

const importados = [
  { id: '2', name: 'Arroz Modificado', ... }, // Se ignora (ID duplicado)
  { id: '3', name: 'Pasta', ... }              // Se agrega (ID nuevo)
]

const resultado = mergeFoods(existentes, importados)
// [
//   { id: '1', name: 'Pollo', ... },
//   { id: '2', name: 'Arroz', ... },      // Original sin modificar
//   { id: '3', name: 'Pasta', ... }
// ]
```

### replaceFoods

Reemplaza todos los alimentos con los importados.

```typescript
function replaceFoods(imported: Food[]): Food[]
```

**Ejemplo:**

```typescript
const nuevosAlimentos = [...]
const resultado = replaceFoods(nuevosAlimentos)
// Retorna copia de nuevosAlimentos
```

### generateExportFilename

Genera nombre de archivo con timestamp.

```typescript
function generateExportFilename(prefix?: string): string
```

**Formato:** `{prefix}_{YYYYMMDD}_{HHMM}.json`

**Ejemplo:**

```typescript
generateExportFilename('alimentos')
// 'alimentos_20251026_1430.json'

generateExportFilename()
// 'alimentos_20251026_1430.json' (default)
```

## 📖 Uso en Home Component

### Exportar

```tsx
import { exportToJSON, generateExportFilename } from './utils/importExport'

const handleExport = () => {
  const filename = generateExportFilename('mi-inventario')
  exportToJSON(foods, filename)
  alert(`Exportados: ${foods.length} alimentos`)
}

<button onClick={handleExport}>
  📥 Exportar
</button>
```

### Importar

```tsx
import { importFromJSON } from './utils/importExport'

const fileInputRef = useRef<HTMLInputElement>(null)

const handleImportClick = () => {
  fileInputRef.current?.click()
}

const handleFileSelect = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  const result = await importFromJSON(file)

  if (!result.valid) {
    alert(`Errores: ${result.errors.join(', ')}`)
    return
  }

  setFoods(result.foods)
  alert(`Importados: ${result.foods.length} alimentos`)
}

<>
  <button onClick={handleImportClick}>📤 Importar</button>
  <input
    ref={fileInputRef}
    type="file"
    accept=".json"
    onChange={handleFileSelect}
    className="hidden"
  />
</>
```

### Merge vs Replace

```tsx
const handleImport = async (file: File) => {
  const result = await importFromJSON(file)
  
  if (!result.valid) return

  if (foods.length > 0) {
    // Preguntar al usuario
    const action = confirm('¿Combinar (OK) o Reemplazar (Cancel)?')
    
    if (action) {
      // Combinar
      setFoods(mergeFoods(foods, result.foods))
    } else {
      // Reemplazar
      setFoods(replaceFoods(result.foods))
    }
  } else {
    // Si no hay alimentos, importar directamente
    setFoods(result.foods)
  }
}
```

## ✅ Validaciones

### Campos Requeridos

```typescript
// Cada alimento debe tener:
✅ id: string (no vacío)
✅ name: string (no vacío)
✅ category: 'proteina' | 'carbohidrato' | 'fruta_veg'
✅ meals: Array<'desayuno' | 'almuerzo' | 'cena'>
✅ quantity: number (>= 0)
✅ unit: string
⚪ notes: string (opcional)
```

### Mensajes de Error

```typescript
// Posibles errores:
- "El archivo JSON debe contener un array de alimentos"
- "El array de alimentos está vacío"
- "Alimento en posición X es inválido: {...}"
- "El archivo no contiene JSON válido"
```

### Ejemplo de JSON Válido

```json
[
  {
    "id": "food-001",
    "name": "Pechuga de Pollo",
    "category": "proteina",
    "meals": ["almuerzo", "cena"],
    "quantity": 200,
    "unit": "gramos",
    "notes": "Alto en proteína"
  },
  {
    "id": "food-002",
    "name": "Arroz Integral",
    "category": "carbohidrato",
    "meals": ["almuerzo"],
    "quantity": 150,
    "unit": "gramos"
  }
]
```

## 🧪 Tests

Las utilidades incluyen 50+ tests cubriendo:

### Ejecutar Tests

```bash
npm run test importExport
```

### Casos Testeados

**isValidFood (12 tests):**
- Alimento completo válido
- Alimento mínimo válido
- Rechazar null/undefined
- Rechazar campos faltantes
- Rechazar valores inválidos
- Casos edge (quantity 0, meals vacío)

**validateFoodsArray (5 tests):**
- Array válido completo
- Rechazar no-array
- Rechazar array vacío
- Filtrar inválidos pero retornar válidos
- Validar todos los campos

**exportToJSON (3 tests):**
- Exportar correctamente
- Filename por defecto
- Manejar array vacío

**importFromJSON (5 tests):**
- Importar JSON válido
- Rechazar JSON inválido
- Rechazar no-array
- Importar múltiples
- Filtrar inválidos

**generateExportFilename (3 tests):**
- Generar con timestamp
- Prefijo por defecto
- Nombres únicos

**mergeFoods (4 tests):**
- Combinar sin duplicados
- Agregar todos si únicos
- Listas vacías
- Mantener originales

**replaceFoods (2 tests):**
- Reemplazar completamente
- Copia independiente

## 💡 Ejemplos de Uso

### Exportar con Feedback

```typescript
const handleExport = () => {
  try {
    const filename = generateExportFilename('inventario')
    exportToJSON(foods, filename)
    toast.success(`✅ Exportados ${foods.length} alimentos`)
  } catch (error) {
    toast.error('❌ Error al exportar')
  }
}
```

### Importar con Modal de Confirmación

```typescript
const [showModal, setShowModal] = useState(false)
const [pending, setPending] = useState<Food[] | null>(null)

const handleImport = async (file: File) => {
  const result = await importFromJSON(file)

  if (!result.valid) {
    alert(`Errores:\n${result.errors.join('\n')}`)
    return
  }

  if (foods.length > 0) {
    setPending(result.foods)
    setShowModal(true)
  } else {
    setFoods(result.foods)
  }
}

// En el modal:
<Modal show={showModal}>
  <button onClick={() => setFoods(mergeFoods(foods, pending))}>
    Combinar
  </button>
  <button onClick={() => setFoods(replaceFoods(pending))}>
    Reemplazar
  </button>
</Modal>
```

### Validar Antes de Importar

```typescript
const handleImport = async (file: File) => {
  // Validar extensión
  if (!file.name.endsWith('.json')) {
    alert('Solo archivos .json')
    return
  }

  // Validar tamaño (5MB máx)
  if (file.size > 5 * 1024 * 1024) {
    alert('Archivo muy grande (máx 5MB)')
    return
  }

  const result = await importFromJSON(file)
  
  if (!result.valid) {
    console.error('Errores de validación:', result.errors)
    console.log('Alimentos válidos encontrados:', result.foods.length)
    
    // Opción: importar solo los válidos
    if (result.foods.length > 0) {
      const importar = confirm(
        `Se encontraron ${result.foods.length} alimentos válidos.\n` +
        `Hay ${result.errors.length} errores.\n` +
        `¿Importar solo los válidos?`
      )
      if (importar) {
        setFoods(result.foods)
      }
    }
  } else {
    setFoods(result.foods)
  }
}
```

## 🔧 Integración en Home

El componente Home incluye import/export completo:

### Botones en Header

```tsx
// Exportar (deshabilitado si no hay alimentos)
<button onClick={handleExport} disabled={foods.length === 0}>
  📥 Exportar
</button>

// Importar (siempre habilitado)
<button onClick={handleImportClick}>
  📤 Importar
</button>

// Input file oculto
<input
  ref={fileInputRef}
  type="file"
  accept="application/json,.json"
  onChange={handleFileSelect}
  className="hidden"
/>
```

### Modal de Importación

Cuando hay alimentos existentes, se muestra modal con opciones:

```tsx
🔀 Combinar (Agregar sin duplicar)
   - Mantiene alimentos existentes
   - Agrega nuevos sin duplicar IDs

🔄 Reemplazar Todo
   - Elimina alimentos existentes
   - Importa todos los nuevos

❌ Cancelar
   - No importa nada
```

### Mensajes de Feedback

```tsx
// Éxito
"✅ Exportado: 10 alimentos"
"✅ Importados: 15 alimentos"
"✅ Agregados: 5 alimentos (total: 15)"

// Error
"❌ Error al exportar"
"❌ Errores: El array está vacío"
"❌ Error al leer el archivo"
```

## 📊 Formato del Archivo JSON

### Estructura Esperada

El archivo JSON debe ser un array de objetos Food:

```json
[
  {
    "id": "food-001",
    "name": "Pechuga de Pollo",
    "category": "proteina",
    "meals": ["almuerzo", "cena"],
    "quantity": 200,
    "unit": "gramos",
    "notes": "Alto en proteína"
  },
  {
    "id": "food-002",
    "name": "Arroz Integral",
    "category": "carbohidrato",
    "meals": ["almuerzo"],
    "quantity": 150,
    "unit": "gramos"
  }
]
```

### Valores Válidos

**category:**
- `"proteina"`
- `"carbohidrato"`
- `"fruta_veg"`

**meals:**
- Array que puede contener: `"desayuno"`, `"almuerzo"`, `"cena"`
- Puede estar vacío: `[]`

**quantity:**
- Número >= 0
- Puede ser 0

**unit:**
- Cualquier string (preferiblemente de UNIT_OPTIONS)

## ⚠️ Errores Comunes

### JSON Inválido

```json
// ❌ MAL - Sin comillas en keys
{ name: "Pollo", category: "proteina" }

// ✅ BIEN
{ "name": "Pollo", "category": "proteina" }
```

### Categoría Inválida

```json
// ❌ MAL
{ "category": "carne" }

// ✅ BIEN
{ "category": "proteina" }
```

### Quantity Negativa

```json
// ❌ MAL
{ "quantity": -10 }

// ✅ BIEN
{ "quantity": 0 }
```

### Meals Inválido

```json
// ❌ MAL - String en vez de array
{ "meals": "almuerzo" }

// ❌ MAL - Meal inválido
{ "meals": ["comida"] }

// ✅ BIEN
{ "meals": ["almuerzo", "cena"] }
```

## 🧪 Tests

```bash
# Ejecutar tests
npm run test importExport

# Ver cobertura
npm run test:coverage
```

## 🔒 Seguridad

### Validación de Archivo

```typescript
// Solo aceptar .json
<input accept="application/json,.json" />

// Validar extensión
if (!file.name.endsWith('.json')) {
  alert('Solo archivos JSON')
  return
}
```

### Límites de Tamaño

```typescript
// Validar tamaño (ejemplo: 5MB máx)
if (file.size > 5 * 1024 * 1024) {
  alert('Archivo muy grande')
  return
}
```

### Sanitización

Todas las validaciones usan `isValidFood` que verifica:
- Tipos correctos
- Valores dentro de rangos permitidos
- Categorías y meals válidas según tipos

## 📚 Recursos Relacionados

- [Tipos TypeScript (Food)](./types.md)
- [Componente Home](./Home.md)
- [Utilidades randomPick](./randomPick.md)

## 📄 Licencia

MIT

