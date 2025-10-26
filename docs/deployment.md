# Guía de Despliegue

Guía completa para desplegar App Cocina en GitHub Pages.

## 📋 Opciones de Despliegue

### 1. Despliegue Automático con GitHub Actions (Recomendado)

El proyecto incluye workflows de CI/CD configurados para despliegue automático.

#### Ventajas
- ✅ Despliegue automático en cada push a `main`
- ✅ Tests ejecutados antes de desplegar
- ✅ Build en entorno limpio
- ✅ Sin necesidad de ejecutar comandos localmente
- ✅ Historial de deploys en GitHub

#### Configuración Inicial

**Paso 1: Crear Repositorio**

```bash
# En GitHub, crea un repositorio llamado "App-cocina"
# Luego en tu terminal local:

git init
git add .
git commit -m "Initial commit: App Cocina completa"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/App-cocina.git
git push -u origin main
```

**Paso 2: Configurar Permisos**

1. Ve a tu repositorio en GitHub
2. Settings > Actions > General
3. En "Workflow permissions":
   - Selecciona **"Read and write permissions"**
   - ✅ "Allow GitHub Actions to create and approve pull requests"
4. Guarda los cambios

**Paso 3: Configurar GitHub Pages**

1. Settings > Pages
2. En "Build and deployment":
   - **Source**: Deploy from a branch
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
3. Guarda los cambios

**Paso 4: Primer Despliegue**

```bash
# El workflow se ejecuta automáticamente al hacer push
git push origin main

# Espera 2-3 minutos y visita:
# https://TU-USUARIO.github.io/App-cocina/
```

#### Workflows Incluidos

**`.github/workflows/deploy.yml`**

```yaml
# Se ejecuta en:
- Push a main
- Manualmente (workflow_dispatch)

# Pasos:
1. Checkout del código
2. Setup Node.js 20
3. npm ci (instalación limpia)
4. npm run test (ejecutar tests)
5. npm run build (compilar)
6. Deploy a gh-pages (peaceiris/actions-gh-pages@v3)
```

**`.github/workflows/test.yml`**

```yaml
# Se ejecuta en:
- Push a main/develop
- Pull requests a main/develop

# Matriz:
- Node 18 y 20

# Pasos:
1. Checkout
2. Setup Node.js
3. npm ci
4. Build (verificar que compila)
5. Tests
6. Coverage
```

#### Monitorear Despliegues

1. Ve a tu repositorio en GitHub
2. Pestaña "Actions"
3. Verás el historial de workflows
4. Click en cualquier run para ver detalles
5. Si falla, verás logs detallados

#### Disparar Manualmente

1. Pestaña "Actions"
2. Selecciona "Deploy to GitHub Pages"
3. Click en "Run workflow"
4. Selecciona la branch `main`
5. Click "Run workflow"

### 2. Despliegue Manual

Si prefieres desplegar manualmente desde tu máquina local.

#### Requisitos
- Node.js 18+ instalado
- Dependencias instaladas (`npm install`)
- Repositorio configurado en GitHub

#### Comandos

```bash
# Instalar gh-pages si no está
npm install

# Desplegar
npm run deploy
```

#### Proceso
1. Ejecuta `npm run build` (compila el proyecto)
2. Sube la carpeta `dist/` a la branch `gh-pages`
3. GitHub Pages detecta los cambios y actualiza

## 🔧 Personalización

### Cambiar Base Path

Si tu repositorio tiene otro nombre, actualiza `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/nombre-de-tu-repo/',
})
```

### Cambiar Branch de Deploy

En `.github/workflows/deploy.yml`:

```yaml
on:
  push:
    branches:
      - main  # Cambiar a tu branch principal
```

### Deshabilitar Tests en Deploy

Si quieres desplegar sin ejecutar tests (no recomendado):

En `.github/workflows/deploy.yml`, comenta:

```yaml
# - name: Run tests
#   run: npm run test -- --run
```

### Custom Domain

Si tienes un dominio personalizado:

1. Crea archivo `public/CNAME` con tu dominio:
   ```
   tudominio.com
   ```

2. En `.github/workflows/deploy.yml`:
   ```yaml
   - name: Deploy to GitHub Pages
     uses: peaceiris/actions-gh-pages@v3
     with:
       github_token: ${{ secrets.GITHUB_TOKEN }}
       publish_dir: ./dist
       cname: tudominio.com  # Agregar esta línea
   ```

## 🐛 Solución de Problemas

### Error: "Permission denied"

**Causa**: Falta permisos de escritura para GitHub Actions

**Solución**:
1. Settings > Actions > General
2. "Workflow permissions" > "Read and write permissions"
3. Guarda y vuelve a ejecutar el workflow

### Error: "npm run build failed"

**Causa**: Error de TypeScript o tests fallidos

**Solución**:
1. Ejecuta localmente: `npm run build`
2. Corrige los errores que aparezcan
3. Commit y push de nuevo

### Error: "404 Not Found" al visitar la URL

**Causa**: GitHub Pages no configurado correctamente

**Solución**:
1. Settings > Pages
2. Verifica que Source sea "gh-pages"
3. Espera 1-2 minutos
4. Recarga la página

### Workflow no se ejecuta

**Causa**: Workflows deshabilitados o branch incorrecta

**Solución**:
1. Settings > Actions > "Allow all actions"
2. Verifica que estés en branch `main`
3. Verifica que `.github/workflows/` exista en el repo

## 📊 Monitoreo

### Ver Estado de Despliegue

**Badge de Status:**

Agrega a tu README.md:

```markdown
[![Deploy](https://github.com/TU-USUARIO/App-cocina/actions/workflows/deploy.yml/badge.svg)](https://github.com/TU-USUARIO/App-cocina/actions/workflows/deploy.yml)
```

### Logs de Workflow

1. Actions > Workflow específico
2. Click en el run
3. Expande cada paso para ver logs
4. Útil para debugging

## 🚀 Mejores Prácticas

### Antes de Hacer Push

```bash
# 1. Verificar que compila
npm run build

# 2. Ejecutar tests
npm run test

# 3. Si todo pasa, hacer push
git push origin main
```

### Branch Protection

Para proyectos en equipo:

1. Settings > Branches
2. Add rule para `main`
3. Require status checks:
   - ✅ test (Node 18)
   - ✅ test (Node 20)
4. Require pull request reviews

### Versionado

```bash
# Usar tags para versiones
git tag v1.0.0
git push origin v1.0.0

# GitHub Actions puede detectar tags
```

## 📚 Recursos Adicionales

- [GitHub Pages Docs](https://docs.github.com/es/pages)
- [GitHub Actions Docs](https://docs.github.com/es/actions)
- [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

## 📄 Licencia

MIT

