# Guía de Linting y Formateo

Configuración de ESLint y Prettier para mantener calidad de código.

## 📋 Herramientas

- **ESLint** - Linter para TypeScript y React
- **Prettier** - Formateador de código
- **prettier-plugin-tailwindcss** - Ordenar clases de Tailwind

## 🚀 Scripts Disponibles

```bash
# Lint
npm run lint              # Verificar problemas
npm run lint:fix          # Corregir problemas automáticamente

# Format
npm run format            # Formatear todos los archivos
npm run format:check      # Verificar si está formateado

# Type Check
npm run type-check        # Verificar tipos de TypeScript

# Validación Completa
npm run validate          # type-check + lint + tests
```

## ⚙️ Configuración ESLint

### .eslintrc.cjs

```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'prettier'  // Desactiva reglas que conflict con Prettier
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', '@typescript-eslint', 'react'],
  rules: {
    'react-refresh/only-export-components': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_' 
    }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'react/prop-types': 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }]
  }
}
```

### Reglas Personalizadas

**no-console**
- Permite `console.warn` y `console.error`
- Advierte sobre `console.log`

**@typescript-eslint/no-unused-vars**
- Permite variables que empiecen con `_`
- Útil para parámetros de funciones no usados

**react-refresh/only-export-components**
- Asegura HMR (Hot Module Replacement)
- Solo warning, no error

### .eslintignore

```
node_modules
dist
build
coverage
*.config.js
*.config.ts
```

## 🎨 Configuración Prettier

### .prettierrc.json

```json
{
  "semi": false,                    // Sin punto y coma
  "singleQuote": true,             // Comillas simples
  "tabWidth": 2,                   // Indentación de 2 espacios
  "trailingComma": "es5",          // Comas finales
  "printWidth": 100,               // Ancho máximo de línea
  "arrowParens": "avoid",          // Sin paréntesis en arrows simples
  "endOfLine": "lf",               // Line endings Unix
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### prettier-plugin-tailwindcss

Ordena automáticamente las clases de Tailwind:

**Antes:**
```jsx
<div className="text-white bg-blue-500 p-4 rounded-lg">
```

**Después:**
```jsx
<div className="rounded-lg bg-blue-500 p-4 text-white">
```

### .prettierignore

```
node_modules
dist
coverage
*.md
package-lock.json
```

## 🔧 Integración con VSCode

### settings.json

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### Extensiones Recomendadas

1. **ESLint** (dbaeumer.vscode-eslint)
2. **Prettier** (esbenp.prettier-vscode)
3. **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss)

## 🎯 Uso en Desarrollo

### Antes de Commit

```bash
# Verificar todo
npm run validate

# O paso por paso:
npm run type-check    # TypeScript
npm run lint          # ESLint
npm run format:check  # Prettier
npm run test -- --run # Tests
```

### Corregir Problemas

```bash
# Auto-fix de ESLint
npm run lint:fix

# Auto-format con Prettier
npm run format
```

## 🔍 Comandos Útiles

### Ver Problemas de Lint

```bash
# Todos los archivos
npm run lint

# Con detalles
npm run lint -- --debug

# Solo advertencias
npm run lint -- --quiet
```

### Formatear Selectivo

```bash
# Un archivo específico
npx prettier --write src/components/Home.tsx

# Todos los componentes
npx prettier --write "src/components/**/*.tsx"

# Verificar sin modificar
npx prettier --check "src/**/*.{ts,tsx}"
```

## ⚠️ Errores Comunes

### "Parsing error: Cannot read file"

**Solución**: Actualizar tsconfig.json

```json
{
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### "Module is not defined"

**Solución**: Usar .eslintrc.cjs (no .js) para ESLint

### "Prettier y ESLint en conflicto"

**Solución**: Asegurar que `eslint-config-prettier` está en extends

## 🚦 CI/CD

### GitHub Actions

Los workflows ejecutan lint automáticamente:

```yaml
# deploy.yml
- name: Run lint
  run: npm run lint

# test.yml
- name: Run linter
  run: npm run lint
```

### Pre-commit Hooks (Opcional)

Instalar husky para ejecutar antes de commit:

```bash
npm install -D husky lint-staged

# package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## 📊 Métricas de Calidad

### Reglas Activas

- **ESLint**: 50+ reglas
- **TypeScript**: Strict mode
- **React**: Rules + Hooks
- **Prettier**: Auto-formateo

### Nivel de Warnings

- **Max warnings**: 0 en CI/CD
- **Warnings locales**: Permitidos
- **Errors**: Bloquean build

## 🎓 Best Practices

### TypeScript

```typescript
// ✅ Bueno - Tipos explícitos
const user: User = { name: 'John' }

// ❌ Evitar - any
const data: any = fetchData()
```

### React

```typescript
// ✅ Bueno - Props interface
interface Props {
  name: string
  age: number
}

// ✅ Bueno - Hooks en orden correcto
const [state, setState] = useState()
const effect = useEffect()
```

### Imports

```typescript
// ✅ Bueno - Imports agrupados
import { useState } from 'react'
import type { Food } from './types'
import { helper } from './utils'
```

## 📚 Recursos

- [ESLint Rules](https://eslint.org/docs/rules/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [React ESLint Plugin](https://github.com/jsx-eslint/eslint-plugin-react)

## 📄 Licencia

MIT

