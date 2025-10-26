# Hook useStorage

Hook personalizado de React para persistir estado en `localStorage` con TypeScript.

## 📋 Características

- ✅ **Type-safe**: Completamente tipado con TypeScript genéricos
- ✅ **API familiar**: Mismo uso que `useState`
- ✅ **Manejo de errores**: Gestión robusta de errores en lectura/escritura
- ✅ **Sincronización**: Detecta y sincroniza cambios entre pestañas
- ✅ **Objetos complejos**: Soporta cualquier tipo serializable a JSON
- ✅ **SSR-friendly**: Verifica disponibilidad de `window`
- ✅ **100% testeado**: Suite completa de tests con Vitest

## 🚀 Uso Básico

```typescript
import { useStorage } from './hooks/useStorage'

function MiComponente() {
  const [value, setValue] = useStorage('mi-clave', valorInicial)
  
  return (
    <div>
      <button onClick={() => setValue(nuevoValor)}>
        Actualizar
      </button>
    </div>
  )
}
```

## 📖 Ejemplos

### Contador Simple

```typescript
function Contador() {
  const [count, setCount] = useStorage('contador', 0)
  
  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Incrementar
      </button>
    </div>
  )
}
```

### Objeto Complejo

```typescript
interface Usuario {
  nombre: string
  email: string
  edad: number
}

function PerfilUsuario() {
  const [usuario, setUsuario] = useStorage<Usuario>('usuario', {
    nombre: '',
    email: '',
    edad: 0
  })
  
  const actualizarNombre = (nombre: string) => {
    setUsuario(prev => ({ ...prev, nombre }))
  }
  
  return (
    <div>
      <input 
        value={usuario.nombre}
        onChange={(e) => actualizarNombre(e.target.value)}
      />
    </div>
  )
}
```

### Array

```typescript
function ListaTareas() {
  const [tareas, setTareas] = useStorage<string[]>('tareas', [])
  
  const agregarTarea = (tarea: string) => {
    setTareas(prev => [...prev, tarea])
  }
  
  const eliminarTarea = (index: number) => {
    setTareas(prev => prev.filter((_, i) => i !== index))
  }
  
  return (
    <ul>
      {tareas.map((tarea, index) => (
        <li key={index}>
          {tarea}
          <button onClick={() => eliminarTarea(index)}>
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  )
}
```

### Actualizaciones Funcionales

```typescript
function MiComponente() {
  const [counter, setCounter] = useStorage('counter', 0)
  
  // Actualización directa
  setCounter(10)
  
  // Actualización funcional (recomendado para valores basados en el anterior)
  setCounter(prev => prev + 1)
  
  // También funciona con objetos
  const [user, setUser] = useStorage('user', { name: '', age: 0 })
  setUser(prev => ({ ...prev, age: prev.age + 1 }))
}
```

## 🔧 API

### Parámetros

```typescript
useStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>]
```

- **`key`** (string): Clave única para almacenar el valor en localStorage
- **`initialValue`** (T): Valor inicial si no existe en localStorage
- **`T`**: Tipo genérico del valor a almacenar

### Retorno

Retorna una tupla similar a `useState`:
- **`[0]`**: Valor actual del estado
- **`[1]`**: Función para actualizar el estado

## 🛡️ Manejo de Errores

El hook maneja automáticamente varios escenarios de error:

### JSON Inválido

Si el valor en localStorage no es JSON válido, usa el valor inicial:

```typescript
// localStorage tiene: 'esto no es JSON válido {'
const [data, setData] = useStorage('mi-clave', 'valor por defecto')
// data será 'valor por defecto'
```

### Quota Excedida

Si localStorage está lleno, el estado local se actualiza pero muestra un error en consola:

```typescript
const [data, setData] = useStorage('mi-clave', 'inicial')
setData('nuevo valor muy grande que excede quota')
// El estado local se actualiza, pero no se guarda en localStorage
```

### SSR (Server-Side Rendering)

El hook verifica la disponibilidad de `window` antes de acceder a localStorage:

```typescript
// Funciona correctamente en entornos SSR como Next.js
const [data, setData] = useStorage('mi-clave', 'inicial')
```

## 🔄 Sincronización Entre Pestañas

El hook automáticamente sincroniza cambios cuando otra pestaña modifica el mismo valor:

```typescript
// Pestaña 1
const [count, setCount] = useStorage('contador', 0)
setCount(10)

// Pestaña 2 (se actualiza automáticamente)
const [count, setCount] = useStorage('contador', 0)
// count cambiará a 10 automáticamente
```

## 🧪 Tests

El hook incluye una suite completa de tests:

### Ejecutar Tests

```bash
# Modo watch
npm run test

# Con UI
npm run test:ui

# Con cobertura
npm run test:coverage
```

### Casos Testeados

- ✅ Inicialización con valor por defecto
- ✅ Lectura desde localStorage existente
- ✅ Escritura y actualización
- ✅ Actualizaciones funcionales
- ✅ Manejo de objetos y arrays complejos
- ✅ Manejo de JSON inválido
- ✅ Manejo de quota excedida
- ✅ Sincronización entre pestañas
- ✅ Tipos TypeScript
- ✅ Valores especiales (null, boolean)

## 💡 Tips y Mejores Prácticas

### 1. Usar claves descriptivas y únicas

```typescript
// ✅ Bueno
const [user, setUser] = useStorage('app-user-profile', initialUser)

// ❌ Malo (puede colisionar con otros valores)
const [user, setUser] = useStorage('user', initialUser)
```

### 2. Definir tipos explícitamente para objetos complejos

```typescript
interface Config {
  tema: 'claro' | 'oscuro'
  idioma: string
}

// ✅ Bueno - tipo explícito
const [config, setConfig] = useStorage<Config>('app-config', {
  tema: 'claro',
  idioma: 'es'
})
```

### 3. Usar actualizaciones funcionales para valores basados en el anterior

```typescript
// ✅ Bueno
setCount(prev => prev + 1)

// ❌ Puede causar problemas en actualizaciones rápidas
setCount(count + 1)
```

### 4. Considerar el tamaño de los datos

localStorage tiene un límite típico de 5-10MB. Para datos grandes, considera:
- Comprimir datos
- Usar IndexedDB en su lugar
- Limpiar datos antiguos regularmente

## 🔒 Limitaciones

1. **Solo tipos serializables**: No puede guardar funciones, símbolos o referencias circulares
2. **Límite de tamaño**: localStorage tiene límites de almacenamiento (~5-10MB)
3. **Síncrono**: Las operaciones de localStorage son síncronas y pueden bloquear el UI con datos muy grandes
4. **Solo strings**: Internamente todo se serializa a string mediante JSON

## 📚 Recursos Adicionales

- [MDN: Window.localStorage](https://developer.mozilla.org/es/docs/Web/API/Window/localStorage)
- [React Hooks](https://es.react.dev/reference/react)
- [TypeScript Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)

## 📄 Licencia

MIT

