# 🚀 Guía Rápida - App Cocina

Guía de inicio rápido para comenzar a usar la aplicación.

## ⚡ Instalación Rápida

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Abrir en navegador
# http://localhost:5173
```

## 🎯 Primeros Pasos

### 1. Agregar Alimentos

1. Click en **"➕ Nuevo Alimento"**
2. Llenar el formulario:
   - Nombre: "Pechuga de Pollo"
   - Categoría: Proteína
   - Comidas: ✅ Almuerzo, ✅ Cena
   - Cantidad: 200
   - Unidad: gramos
3. Click en **"Crear Alimento"**
4. El alimento aparece en la lista

**Repite este proceso para crear:**
- Un carbohidrato (ej: Arroz)
- Una fruta/vegetal (ej: Brócoli)

### 2. Usar la Ruleta

1. Asegúrate de tener al menos 1 alimento de cada categoría con stock
2. Selecciona una comida en el desplegable: 🌅 Desayuno / ☀️ Almuerzo / 🌙 Cena
3. Click en **"🎰 Girar Ruleta"**
4. Disfruta la animación ✨
5. Revisa el resultado (proteína + carbohidrato + fruta/vegetal)
6. Click en **"✅ Confirmar y Decrementar Stock"**
7. El stock se reduce automáticamente

### 3. Gestionar Inventario

**Editar:**
- Click en **"✏️ Editar"** en cualquier alimento
- Modifica los datos
- Guarda los cambios

**Decrementar:**
- Click en **"➖ Stock"** para reducir cantidad manualmente

**Eliminar:**
- Click en **"🗑️ Eliminar"**
- Confirma la eliminación

**Filtrar:**
- Usa los selectores de "Filtrar por Comida" y "Filtrar por Categoría"
- Los filtros se combinan para resultados precisos

## 📊 Estadísticas

El dashboard muestra en tiempo real:

- **Total Alimentos**: Cantidad en tu inventario
- **Con Stock**: Alimentos disponibles (quantity > 0)
- **Sin Stock**: Alimentos agotados
- **Categorías**: Número de categorías diferentes

## 🧪 Tests

```bash
# Ejecutar todos los tests
npm run test

# Ver tests en UI visual
npm run test:ui

# Generar reporte de cobertura
npm run test:coverage
```

## 📥📤 Import/Export

### Exportar Inventario

1. Click en **"📥 Exportar"** en el header
2. Se descarga automáticamente: `alimentos_YYYYMMDD_HHMM.json`
3. El archivo contiene todos tus alimentos en formato JSON

### Importar Inventario

1. Click en **"📤 Importar"** en el header
2. Selecciona un archivo JSON
3. Si ya tienes alimentos, elige:
   - **🔀 Combinar**: Agregar los nuevos sin duplicar
   - **🔄 Reemplazar**: Eliminar todo e importar los nuevos
   - **❌ Cancelar**: No hacer nada
4. El inventario se actualiza automáticamente

### Formato del JSON

El archivo debe ser un array de objetos con esta estructura:

```json
[
  {
    "id": "unique-id",
    "name": "Nombre del Alimento",
    "category": "proteina",
    "meals": ["almuerzo", "cena"],
    "quantity": 100,
    "unit": "gramos",
    "notes": "Notas opcionales"
  }
]
```

**Validaciones automáticas:**
- ✅ Verifica que sea JSON válido
- ✅ Valida estructura de cada alimento
- ✅ Muestra errores específicos si hay problemas
- ✅ Permite importar solo los alimentos válidos

## 📦 Build y Deploy

### Build Local

```bash
# Build de producción
npm run build

# Preview del build
npm run preview
```

### Deploy a GitHub Pages

**Opción 1: Automático (Recomendado)**

El proyecto incluye GitHub Actions que despliegan automáticamente:

1. Sube tu código a GitHub
2. Cada push a `main` ejecuta el workflow
3. Se despliega automáticamente a GitHub Pages
4. Ver en: `https://tu-usuario.github.io/App-cocina/`

**Configuración necesaria:**
- Settings > Actions > General > "Read and write permissions"
- Settings > Pages > Source: "gh-pages" branch

**Opción 2: Manual**

```bash
npm run deploy
```

## 🔑 Conceptos Clave

### Categorías de Alimentos
- 🥩 **Proteína**: Carnes, pescados, huevos, legumbres
- 🍞 **Carbohidrato**: Arroz, pasta, pan, cereales
- 🥗 **Frutas/Vegetales**: Frutas y verduras

### Comidas del Día
- 🌅 **Desayuno**: Primera comida
- ☀️ **Almuerzo**: Comida del mediodía
- 🌙 **Cena**: Última comida

### Lógica de la Ruleta

La ruleta selecciona automáticamente:
1. **1 proteína** con stock para la comida seleccionada
2. **1 carbohidrato** con stock para la comida seleccionada
3. **1 fruta/vegetal** con stock para la comida seleccionada

**Criterios:**
- Solo alimentos con `quantity > 0`
- Solo alimentos que incluyan la comida en su array `meals`
- Selección completamente aleatoria

## 💡 Tips

### Para la Ruleta

✅ **Asegúrate de tener:**
- Al menos 1 proteína marcada para la comida deseada
- Al menos 1 carbohidrato marcado para la comida deseada
- Al menos 1 fruta/vegetal marcada para la comida deseada
- Que todos tengan stock (quantity > 0)

❌ **La ruleta NO funcionará si:**
- Falta alguna categoría
- Todos los alimentos de una categoría están sin stock
- Los alimentos no están marcados para la comida seleccionada

### Para Mejor Experiencia

1. **Agrupa por comidas**: Marca cada alimento con las comidas apropiadas
2. **Mantén stock**: Actualiza las cantidades regularmente
3. **Usa los filtros**: Para encontrar alimentos rápidamente
4. **Confirma recetas**: Para que el stock se actualice automáticamente

## 🎨 Personalización

### Cambiar Cantidad de Decremento

El botón "Confirmar" reduce el stock en 1 unidad por defecto. Para cambiar:

Edita `src/components/Home.tsx` línea ~100:
```typescript
quantity: Math.max(0, food.quantity - 5) // Decrementar en 5
```

### Modificar Colores

Los colores están en Tailwind CSS. Edita las clases directamente en los componentes.

### Añadir Más Categorías

1. Edita `src/types.ts` para agregar nueva categoría
2. Actualiza `CATEGORY_METADATA`
3. Modifica las funciones en `src/utils/randomPick.ts`

## ❓ Solución de Problemas

### "Faltan Alimentos" en la Ruleta

**Causa**: No hay alimentos de todas las categorías para la comida seleccionada.

**Solución**:
1. Verifica las estadísticas
2. Agrega alimentos faltantes
3. Marca las comidas correctas en cada alimento
4. Asegúrate de que tengan stock

### Los cambios no se guardan

**Causa**: Problema con localStorage.

**Solución**:
1. Abre DevTools → Application → Local Storage
2. Verifica que `foods-inventory` existe
3. Si no, recarga la página
4. Si persiste, limpia localStorage y recarga

### Tests fallan

**Solución**:
```bash
# Limpiar e instalar de nuevo
rm -rf node_modules
npm install

# Ejecutar tests
npm run test
```

## 📚 Más Información

- Ver [README.md](./README.md) para documentación completa
- Ver [FEATURES.md](./FEATURES.md) para características detalladas
- Ver `docs/` para guías de cada componente

## 🎉 ¡Listo!

Ya puedes empezar a usar App Cocina. Crea tu inventario, gira la ruleta y disfruta de menús aleatorios balanceados.

¿Preguntas? Revisa la documentación o los tests para ver ejemplos de uso.

