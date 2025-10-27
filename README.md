# App Cocina

Aplicación web moderna construida con React, TypeScript, Vite y Tailwind CSS. Lista para desplegar en GitHub Pages.

## 🚀 Tecnologías

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server ultrarrápido
- **Tailwind CSS** - Framework de CSS utility-first
- **Framer Motion** - Biblioteca de animaciones
- **Vitest** - Framework de testing (214+ tests ✅)
- **Testing Library** - Herramientas para testing de componentes React
- **ESLint** - Linter para calidad de código
- **Prettier** - Formateador de código
- **GitHub Actions** - CI/CD automático
- **GitHub Pages** - Hosting estático

## 📦 Instalación

1. Instala las dependencias:
```bash
npm install
```

## 🛠️ Scripts Disponibles

### Desarrollo
```bash
npm run dev
```
Inicia el servidor de desarrollo en `http://localhost:5173`

### Build
```bash
npm run build
```
Compila TypeScript y genera el build optimizado en la carpeta `dist/`

### Preview
```bash
npm run preview
```
Previsualiza el build de producción localmente

### Tests
```bash
npm run test
```
Ejecuta los tests unitarios en modo watch (214+ tests)

```bash
npm run test:ui
```
Abre la interfaz visual de Vitest para ver los tests

```bash
npm run test:integration
```
Ejecuta tests de integración de flujos completos

```bash
npm run test:coverage
```
Genera reporte de cobertura de código

### Lint y Format
```bash
npm run lint
```
Verifica problemas de código con ESLint

```bash
npm run lint:fix
```
Corrige problemas de ESLint automáticamente

```bash
npm run format
```
Formatea código con Prettier

```bash
npm run validate
```
Ejecuta type-check + lint + tests (validación completa)

### Deploy a GitHub Pages
```bash
npm run deploy
```
Despliega automáticamente a GitHub Pages (requiere configuración previa del repositorio)

## 🌐 Configuración para GitHub Pages

### Opción 1: Despliegue Automático con GitHub Actions (Recomendado)

El proyecto incluye workflows de GitHub Actions que despliegan automáticamente.

**Configuración:**

1. Crea un repositorio en GitHub llamado `App-cocina`
2. Sube este proyecto al repositorio:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/App-cocina.git
   git push -u origin main
   ```

3. Ve a **Settings > Pages** en tu repositorio
4. En "Build and deployment", selecciona:
   - **Source**: Deploy from a branch
   - **Branch**: `gh-pages` / `root`
5. Guarda los cambios

6. **Importante**: Ve a **Settings > Actions > General**
   - En "Workflow permissions", selecciona "Read and write permissions"
   - Guarda los cambios

**Despliegue:**
- Cada push a `main` dispara el workflow automáticamente
- El workflow ejecuta tests, build y deploy
- En 2-3 minutos tu app estará actualizada

**Manual (si prefieres):**
```bash
npm run deploy
```

### Opción 2: Despliegue Manual

```bash
npm run deploy
```

### URL de tu Aplicación

Tu aplicación estará disponible en: `https://[tu-usuario].github.io/App-cocina/`

### Workflows Incluidos

**`.github/workflows/deploy.yml`**
- Ejecuta en cada push a `main`
- Instala dependencias (npm ci)
- Ejecuta tests
- Compila proyecto (npm run build)
- Despliega a GitHub Pages

**`.github/workflows/test.yml`**
- Ejecuta en push y pull requests
- Prueba con Node 18 y 20
- Ejecuta tests y cobertura
- Verifica que el código compile

## 🏠 Componente Home - Aplicación Principal

El componente `Home` es la aplicación completa que integra todos los features:

### Características

- ✅ **CRUD de alimentos**: Crear, editar, eliminar y decrementar stock
- ✅ **Generador de menú**: Ruleta animada para selección aleatoria
- ✅ **Estadísticas**: Total, con stock, sin stock, categorías
- ✅ **Filtros avanzados**: Por comida y categoría en la lista
- ✅ **Persistencia**: Todos los datos se guardan automáticamente
- ✅ **Modal interactivo**: Ruleta en modal con animaciones
- ✅ **Responsive**: Diseño adaptable para móvil y desktop

### Funcionalidades Principales

**Import/Export:**
- 📥 Exportar inventario a JSON con timestamp
- 📤 Importar alimentos desde JSON
- Validación robusta del JSON importado
- Opciones: Combinar (sin duplicar) o Reemplazar todo
- Mensajes de feedback en tiempo real

**Gestión de Inventario:**
- Crear nuevos alimentos con formulario completo
- Editar alimentos existentes
- Eliminar alimentos con confirmación
- Decrementar stock manualmente (➖ Stock)
- Ver lista con filtros por comida y categoría

**Generador de Menú:**
- Selector de comida (desayuno/almuerzo/cena)
- Botón "Girar Ruleta" (validación automática)
- Modal con animaciones de Framer Motion
- Resultado visual con 3 ingredientes
- Botón "Confirmar y Decrementar Stock"

**Validaciones:**
- Botón de ruleta deshabilitado si faltan categorías
- Mensaje claro: "Necesitas al menos un alimento de cada categoría"
- Verificación de stock antes de girar

Ver en acción:
```bash
npm run dev
# La aplicación se abre directamente en Home
```

## 📁 Estructura del Proyecto

```
App-cocina/
├── .github/
│   └── workflows/
│       ├── deploy.yml         # CI/CD para GitHub Pages
│       └── test.yml           # CI para tests automáticos
├── docs/
│   ├── Home.md                # Documentación del componente principal
│   ├── FoodForm.md            # Documentación del formulario
│   ├── FoodList.md            # Documentación de la lista
│   ├── Roulette.md            # Documentación de la ruleta
│   ├── types.md               # Documentación de tipos
│   └── useStorage.md          # Documentación del hook
├── src/
│   ├── components/
│   │   ├── Home.tsx           # ⭐ Aplicación principal integrada
│   │   ├── Home.test.tsx      # Tests de Home
│   │   ├── FoodForm.tsx       # Formulario de alimentos
│   │   ├── FoodForm.test.tsx  # Tests del formulario
│   │   ├── FoodList.tsx       # Lista con filtros
│   │   ├── FoodList.test.tsx  # Tests de la lista
│   │   ├── Roulette.tsx       # Ruleta animada
│   │   ├── Roulette.test.tsx  # Tests de ruleta
│   │   ├── FoodFormExample.tsx # Ejemplo CRUD
│   │   ├── RouletteExample.tsx # Ejemplo ruleta
│   │   ├── StorageDemo.tsx    # Demo del hook
│   │   └── index.ts           # Exportaciones
│   ├── hooks/
│   │   ├── useStorage.ts      # Hook de persistencia
│   │   ├── useStorage.test.ts # Tests del hook
│   │   └── index.ts           # Exportaciones
│   ├── utils/
│   │   ├── randomPick.ts      # Utilidades de selección
│   │   ├── randomPick.test.ts # Tests de utilidades
│   │   └── index.ts           # Exportaciones
│   ├── examples/
│   │   └── food-example.ts    # Ejemplos de tipos
│   ├── test/
│   │   └── setup.ts           # Setup de Vitest
│   ├── App.tsx                # Punto de entrada
│   ├── main.tsx               # Renderizado
│   ├── index.css              # Estilos globales
│   ├── index.ts               # Exportaciones principales
│   ├── types.ts               # Tipos TypeScript
│   ├── types.test.ts          # Tests de tipos
│   └── vite-env.d.ts          # Tipos de Vite
├── public/
│   └── vite.svg               # Favicon
├── index.html                 # HTML base
├── package.json               # Dependencias y scripts
├── vite.config.ts             # Configuración de Vite
├── vitest.config.ts           # Configuración de Vitest
├── tailwind.config.js         # Configuración de Tailwind
├── postcss.config.js          # Configuración de PostCSS
├── tsconfig.json              # Configuración de TypeScript
├── tsconfig.node.json         # Config de TypeScript para Node
├── .gitignore                 # Archivos ignorados
├── FEATURES.md                # Características detalladas
└── README.md                  # Este archivo
```

## 🎨 Personalización

### Cambiar el nombre base para GitHub Pages
Si cambias el nombre del repositorio, actualiza la propiedad `base` en `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/tu-nuevo-nombre-repo/',
})
```

### Modificar estilos
Los estilos están basados en Tailwind CSS. Puedes:
- Modificar `src/App.tsx` para cambiar las clases de utilidad
- Extender la configuración en `tailwind.config.js`
- Agregar estilos personalizados en `src/index.css`

## 📊 Tipos TypeScript: Food y Category

El proyecto incluye tipos TypeScript completos para modelar alimentos y categorías.

### Tipos Principales

```typescript
// Categorías de alimentos
export type Category = 'proteina' | 'carbohidrato' | 'fruta_veg'

// Comidas del día
export type Meal = 'desayuno' | 'almuerzo' | 'cena'

// Interfaz principal
export interface Food {
  id: string
  name: string
  category: Category
  meals: Meal[]
  quantity: number
  unit: Unit
  notes?: string
}
```

### Ejemplo de Uso

```typescript
import type { Food, CreateFood } from './types'

const pollo: Food = {
  id: 'food-001',
  name: 'Pechuga de Pollo',
  category: 'proteina',
  meals: ['almuerzo', 'cena'],
  quantity: 200,
  unit: 'gramos',
  notes: 'Alto en proteína'
}

// Para crear sin ID
const nuevoAlimento: CreateFood = {
  name: 'Arroz Integral',
  category: 'carbohidrato',
  meals: ['almuerzo'],
  quantity: 150,
  unit: 'gramos'
}
```

### Metadata y Constantes

El archivo de tipos incluye metadata útil para la UI:

```typescript
import { CATEGORY_METADATA, MEAL_METADATA } from './types'

// Obtener información de UI
const proteinaInfo = CATEGORY_METADATA.proteina
// { label: 'Proteína', color: 'bg-red-100 text-red-800', icon: '🥩' }
```

### Tests Incluidos

Los tipos incluyen tests completos que validan:
- ✅ Creación de objetos Food válidos
- ✅ Validación de categorías y comidas
- ✅ Tipos auxiliares (CreateFood, UpdateFood)
- ✅ Metadata y constantes

## 📝 Componente FoodForm

Componente React para crear y editar alimentos con validación completa y estilos Tailwind.

### Características

- ✅ **Crear y editar**: Soporta ambos modos
- ✅ **Validación**: name requerido, quantity >= 0
- ✅ **Type-safe**: Completamente tipado con TypeScript
- ✅ **Estilos modernos**: Tailwind CSS
- ✅ **Accesible**: Labels y campos requeridos marcados
- ✅ **50+ tests**: Suite completa de tests

### Campos del Formulario

- **Nombre** (requerido) - Input de texto
- **Categoría** - Select (proteína, carbohidrato, fruta_veg)
- **Comidas** - Checkboxes múltiples (desayuno, almuerzo, cena)
- **Cantidad** (requerido, >= 0) - Input numérico
- **Unidad** - Select (gramos, kilogramos, litros, etc.)
- **Notas** (opcional) - Textarea

### Uso Básico

```tsx
import { FoodForm } from './components/FoodForm'

function MiComponente() {
  const handleSave = (food) => {
    console.log('Alimento guardado:', food)
  }

  return <FoodForm onSave={handleSave} />
}
```

### Editar Alimento

```tsx
const alimento = {
  id: '1',
  name: 'Pollo',
  category: 'proteina',
  meals: ['almuerzo'],
  quantity: 200,
  unit: 'gramos'
}

<FoodForm 
  initialFood={alimento}
  onSave={handleSave}
  onCancel={handleCancel}
/>
```

Ver documentación completa en [`docs/FoodForm.md`](./docs/FoodForm.md)

## 📋 Componente FoodList

Componente para mostrar lista de alimentos con filtros avanzados y acciones.

### Características

- ✅ **Filtros**: Por comida y categoría (combinables)
- ✅ **Acciones**: Editar, eliminar, decrementar stock
- ✅ **Visual**: Badges coloridos, indicadores de stock
- ✅ **Responsive**: Diseño adaptable
- ✅ **60+ tests**: Suite completa

### Campos Mostrados

- **Nombre** y badge de categoría
- **Cantidad** y unidad (resaltado si sin stock)
- **Comidas** (badges con iconos)
- **Notas** (si existen)

### Uso Básico

```tsx
import { FoodList } from './components/FoodList'

<FoodList
  foods={alimentos}
  onEdit={(food) => handleEdit(food)}
  onDelete={(id) => handleDelete(id)}
  onDecrement={(food) => handleDecrement(food)}
/>
```

### Filtros

- **Por Comida**: Filtra alimentos disponibles para desayuno/almuerzo/cena
- **Por Categoría**: Filtra por proteína/carbohidrato/frutas y vegetales
- **Combinados**: Aplica ambos filtros simultáneamente con lógica AND
- **Indicador**: Muestra "X de Y alimentos" cuando hay filtros activos
- **Limpiar**: Botón para resetear todos los filtros

Ver documentación completa en [`docs/FoodList.md`](./docs/FoodList.md)

## 🎰 Componente Roulette

Componente animado para seleccionar aleatoriamente alimentos de cada categoría usando Framer Motion.

### Características

- ✅ **Selección aleatoria**: 1 proteína, 1 carbohidrato, 1 fruta/vegetal
- ✅ **Filtrado inteligente**: Solo alimentos con stock y para la comida especificada
- ✅ **Animaciones**: Efectos de ruleta con Framer Motion
- ✅ **Validación**: Verifica disponibilidad antes de girar
- ✅ **Callback**: onResult(result) con el resultado
- ✅ **40+ tests**: Suite completa

### Uso Básico

```tsx
import { Roulette } from './components/Roulette'

<Roulette
  foods={alimentos}
  meal="almuerzo"
  onResult={(result) => {
    console.log('Proteína:', result.proteina)
    console.log('Carbohidrato:', result.carbohidrato)
    console.log('Fruta/Veg:', result.fruta_veg)
  }}
  onReset={() => console.log('Reset')}
/>
```

### Lógica de Selección

1. Filtra alimentos por `meal` (desayuno/almuerzo/cena)
2. Filtra alimentos con `quantity > 0`
3. Agrupa por categoría (proteína, carbohidrato, fruta_veg)
4. Selecciona 1 alimento aleatorio de cada categoría
5. Anima el proceso con Framer Motion (1.5s por categoría)
6. Muestra resultado final con animación

Ver documentación completa en [`docs/Roulette.md`](./docs/Roulette.md)

## 📥📤 Utilidades: Import/Export

Funciones para importar y exportar inventario en formato JSON.

### Funciones Principales

**`exportToJSON(foods, filename)`**
- Exporta inventario a archivo JSON descargable
- Genera nombre con timestamp automático
- Formato JSON bonito (indentado)

**`importFromJSON(file): Promise<result>`**
- Importa alimentos desde archivo JSON
- Validación robusta de estructura
- Retorna alimentos válidos y lista de errores

**`isValidFood(obj): boolean`**
- Valida si un objeto es un Food válido
- Verifica todos los campos requeridos

**`mergeFoods(existing, imported): Food[]`**
- Combina alimentos sin duplicar por ID
- Mantiene alimentos existentes

**`replaceFoods(imported): Food[]`**
- Reemplaza todo el inventario

### Uso en Home

```typescript
// Exportar
const handleExport = () => {
  exportToJSON(foods, generateExportFilename('inventario'))
}

// Importar
const handleImport = async (file: File) => {
  const result = await importFromJSON(file)
  
  if (result.valid) {
    setFoods(result.foods)
  } else {
    console.error(result.errors)
  }
}
```

Ver documentación completa en [`docs/importExport.md`](./docs/importExport.md)

## 🛠️ Utilidades: randomPick

Funciones utilitarias para selección aleatoria de alimentos con filtrado inteligente.

### Funciones Principales

**`pickRandom<T>(array: T[]): T | null`**
- Selecciona un elemento aleatorio de un array
- Retorna `null` si el array está vacío
- Genérico, funciona con cualquier tipo

**`chooseForMeal(foods: Food[], meal: Meal): MealChoice`**
- Selecciona 1 proteína, 1 carbohidrato y 1 fruta/vegetal
- Filtra por `quantity > 0` y `meals.includes(meal)`
- Retorna objeto con las 3 categorías (o `null` si no hay disponibles)

**`filterFoodsForMeal(foods, category, meal): Food[]`**
- Filtra alimentos por categoría, meal y stock
- Útil para obtener opciones disponibles

**`hasAvailableFoods(foods, category, meal): boolean`**
- Verifica si hay alimentos disponibles de una categoría

**`hasAllCategories(foods, meal): boolean`**
- Verifica si hay alimentos en las 3 categorías

**`getAvailableCount(foods, meal): Record<Category, number>`**
- Retorna conteo de alimentos por categoría

### Ejemplo de Uso

```typescript
import { chooseForMeal, pickRandom } from './utils/randomPick'

// Selección completa para una comida
const result = chooseForMeal(alimentos, 'almuerzo')
console.log(result.proteina)     // Food | null
console.log(result.carbohidrato) // Food | null
console.log(result.fruta_veg)    // Food | null

// Selección aleatoria simple
const opciones = ['a', 'b', 'c']
const seleccionado = pickRandom(opciones) // 'a', 'b', o 'c'
```

### Tests

Las utilidades incluyen 60+ tests unitarios cubriendo:
- ✅ Selección aleatoria genérica
- ✅ Filtrado por meal y quantity
- ✅ Casos edge (arrays vacíos, sin stock)
- ✅ Integración entre funciones

```bash
npm run test randomPick
```

## 🔧 Hook Personalizado: useStorage

El proyecto incluye un hook personalizado `useStorage` que permite persistir estado en localStorage de forma sencilla y type-safe.

### Características:
- ✅ **Type-safe**: Completamente tipado con TypeScript
- ✅ **Manejo de errores**: Gestión automática de errores de lectura/escritura
- ✅ **Sincronización**: Detecta cambios en localStorage desde otras pestañas
- ✅ **API familiar**: Mismo uso que `useState`
- ✅ **Objetos complejos**: Soporta cualquier tipo serializable a JSON
- ✅ **100% testeado**: Suite completa de tests unitarios

### Uso básico:

```typescript
import { useStorage } from './hooks/useStorage'

function MiComponente() {
  // Contador simple
  const [count, setCount] = useStorage('counter', 0)

  // Objeto complejo
  const [user, setUser] = useStorage('user', {
    name: '',
    email: ''
  })

  // Array
  const [items, setItems] = useStorage<string[]>('items', [])

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Contador: {count}
      </button>
      
      {/* El estado persiste automáticamente */}
    </div>
  )
}
```

### Tests incluidos:
- ✅ Inicialización con valor por defecto
- ✅ Lectura desde localStorage existente
- ✅ Escritura y actualización
- ✅ Actualizaciones funcionales (como setState)
- ✅ Manejo de objetos y arrays complejos
- ✅ Manejo de errores (JSON inválido, quota excedida)
- ✅ Sincronización entre pestañas
- ✅ Soporte de tipos TypeScript

Para ejecutar los tests:
```bash
npm run test
```

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

