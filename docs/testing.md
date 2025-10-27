# Guía de Testing

Documentación completa del sistema de testing de App Cocina.

## 📋 Resumen

- **Framework**: Vitest
- **Testing Library**: @testing-library/react
- **Entorno**: jsdom
- **Total de tests**: 214+
- **Cobertura**: 100% en componentes principales

## 🚀 Scripts Disponibles

```bash
# Tests en modo watch (recomendado para desarrollo)
npm run test

# Ejecutar todos los tests una vez
npm run test -- --run

# Tests con UI visual
npm run test:ui

# Tests de integración
npm run test:integration

# Reporte de cobertura
npm run test:coverage

# Validación completa (type-check + lint + tests)
npm run validate
```

## 📁 Estructura de Tests

```
src/
├── __tests__/
│   └── integration/
│       └── app.integration.test.tsx   # Tests de flujos completos
├── components/
│   ├── Home.test.tsx                  # Tests del componente principal
│   ├── FoodForm.test.tsx              # Tests del formulario
│   ├── FoodList.test.tsx              # Tests de la lista
│   └── Roulette.test.tsx              # Tests de la ruleta
├── hooks/
│   └── useStorage.test.ts             # Tests del hook
├── utils/
│   ├── randomPick.test.ts             # Tests de selección aleatoria
│   └── importExport.test.ts           # Tests de import/export
├── types.test.ts                      # Tests de tipos
└── test/
    └── setup.ts                       # Configuración global
```

## 🧪 Tipos de Tests

### Tests Unitarios

Tests aislados de componentes, hooks y utilidades.

**Ejemplo:**
```typescript
describe('FoodForm', () => {
  it('debe renderizar el formulario', () => {
    render(<FoodForm onSave={mockFn} />)
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
  })
})
```

**Archivos:**
- `types.test.ts` - 15+ tests
- `useStorage.test.ts` - 15+ tests
- `randomPick.test.ts` - 60+ tests
- `importExport.test.ts` - 50+ tests
- `FoodForm.test.tsx` - 50+ tests
- `FoodList.test.tsx` - 60+ tests
- `Roulette.test.tsx` - 40+ tests
- `Home.test.tsx` - 30+ tests

### Tests de Integración

Tests de flujos completos end-to-end.

**Archivo:** `src/__tests__/integration/app.integration.test.tsx`

**Casos cubiertos:**
1. **Flujo completo**: Cargar → Filtrar → Ruleta → Persistencia
2. **CRUD**: Crear → Editar → Eliminar
3. **Import/Export**: Verificar botones y estado

## ⚙️ Configuración

### vitest.config.ts

```typescript
export default defineConfig({
  test: {
    globals: true,           // Variables globales (describe, it, expect)
    environment: 'jsdom',    // Simular navegador
    setupFiles: './src/test/setup.ts',
    css: true,               // Procesar archivos CSS
    testTimeout: 10000,      // Timeout para tests largos
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.{ts,tsx}',
        '**/*.config.{ts,js}',
        'dist/'
      ]
    }
  }
})
```

### setup.ts

```typescript
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extender matchers de jest-dom
expect.extend(matchers)

// Limpiar después de cada test
afterEach(() => {
  cleanup()
  localStorage.clear()
})
```

## 📝 Guía de Escritura de Tests

### Testing Library Best Practices

**1. Queries por Prioridad**

```typescript
// ✅ Mejor - Por rol accesible
screen.getByRole('button', { name: /guardar/i })

// ✅ Bueno - Por label
screen.getByLabelText(/nombre/i)

// ⚪ Aceptable - Por texto
screen.getByText(/título/i)

// ❌ Evitar - Por clase o ID
screen.getByClassName('button')
```

**2. User Events vs FireEvent**

```typescript
// ✅ Mejor - Simula interacción real del usuario
import userEvent from '@testing-library/user-event'

const user = userEvent.setup()
await user.click(button)
await user.type(input, 'texto')

// ⚪ Aceptable - Para eventos simples
import { fireEvent } from '@testing-library/react'
fireEvent.click(button)
```

**3. Esperas con waitFor**

```typescript
// ✅ Bueno - Esperar cambios asincrónicos
await waitFor(() => {
  expect(screen.getByText('Cargado')).toBeInTheDocument()
})

// ❌ Evitar - No usar setTimeout
await new Promise(resolve => setTimeout(resolve, 1000))
```

**4. Queries Condicionales**

```typescript
// Buscar elementos que pueden existir o no
const element = screen.queryByText('Opcional')
expect(element).not.toBeInTheDocument()

// Buscar múltiples
const buttons = screen.getAllByRole('button')
expect(buttons).toHaveLength(3)
```

### Patrones Comunes

**Mock de Callbacks:**

```typescript
import { vi } from 'vitest'

const mockOnSave = vi.fn()

it('debe llamar callback', () => {
  render(<Component onSave={mockOnSave} />)
  
  fireEvent.click(button)
  
  expect(mockOnSave).toHaveBeenCalled()
  expect(mockOnSave).toHaveBeenCalledWith(expectedData)
})
```

**LocalStorage:**

```typescript
beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  localStorage.clear()
})

it('debe persistir en localStorage', () => {
  // ...
  const stored = JSON.parse(localStorage.getItem('key') || '[]')
  expect(stored).toHaveLength(1)
})
```

**Timers:**

```typescript
beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

it('test con timers', () => {
  // ...
  vi.advanceTimersByTime(1000)
  // ...
})
```

## 📊 Cobertura de Tests

### Por Módulo

- **Tipos**: 100%
- **Hooks**: 100%
- **Utilidades**: 100%
- **Componentes**: 100%

### Generar Reporte

```bash
npm run test:coverage
```

Abre `coverage/index.html` en el navegador para ver reporte detallado.

## 🐛 Debugging Tests

### Ver UI de Tests

```bash
npm run test:ui
```

Abre interfaz visual en el navegador para:
- Ver tests en tiempo real
- Filtrar por archivo
- Ver coverage
- Inspeccionar fallos

### Ver Logs Detallados

```bash
# Modo verbose
npm run test -- --reporter=verbose

# Solo un archivo
npm run test FoodForm.test

# Solo un test específico
npm run test -- -t "debe renderizar"
```

### Debug en VSCode

Agregar breakpoint en el test y usar:

```json
// .vscode/launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "test", "--", "--run"],
  "console": "integratedTerminal"
}
```

## ✅ CI/CD

Los tests se ejecutan automáticamente en GitHub Actions:

### Deploy Workflow

```yaml
- name: Run tests
  run: npm run test -- --run
```

### Test Workflow

```yaml
- name: Run tests
  run: npm run test -- --run

- name: Run integration tests
  run: npm run test:integration

- name: Generate coverage
  run: npm run test:coverage -- --run
```

## 📚 Recursos

- [Vitest Docs](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 📄 Licencia

MIT

