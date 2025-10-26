# GitHub Workflows

Este directorio contiene los workflows de GitHub Actions para CI/CD.

## 📋 Workflows Disponibles

### deploy.yml - Despliegue a GitHub Pages

**Trigger:**
- Push a branch `main`
- Manual (workflow_dispatch)

**Pasos:**
1. Checkout del código
2. Setup Node.js 20
3. Instalar dependencias (`npm ci`)
4. Ejecutar tests (`npm run test -- --run`)
5. Compilar proyecto (`npm run build`)
6. Desplegar a GitHub Pages (peaceiris/actions-gh-pages@v3)

**Configuración requerida:**
- Settings > Actions > "Read and write permissions"
- Settings > Pages > Source: "gh-pages" branch

### test.yml - Tests Automáticos

**Trigger:**
- Push a `main` o `develop`
- Pull requests a `main` o `develop`

**Matrix:**
- Node 18
- Node 20

**Pasos:**
1. Checkout del código
2. Setup Node.js
3. Instalar dependencias
4. Build (verificar compilación)
5. Ejecutar tests
6. Generar reporte de cobertura

## 🚀 Uso

Los workflows se ejecutan automáticamente. No requieren acción manual.

### Ver Estado

1. Ve a la pestaña "Actions" en GitHub
2. Verás el historial de ejecuciones
3. Click en cualquier run para ver detalles

### Ejecutar Manualmente

**Deploy Workflow:**
1. Actions > "Deploy to GitHub Pages"
2. Click "Run workflow"
3. Selecciona branch `main`
4. Click "Run workflow"

## 🔧 Personalización

### Cambiar Branch de Deploy

En `deploy.yml`:
```yaml
on:
  push:
    branches:
      - tu-branch  # Cambiar aquí
```

### Deshabilitar Tests en Deploy

En `deploy.yml`, comenta:
```yaml
# - name: Run tests
#   run: npm run test -- --run
```

### Cambiar Versión de Node

En ambos workflows:
```yaml
with:
  node-version: '18'  # Cambiar versión
```

## 📚 Más Información

Ver [docs/deployment.md](../docs/deployment.md) para guía completa de despliegue.

