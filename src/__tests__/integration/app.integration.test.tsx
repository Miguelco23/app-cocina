import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Home } from '../../components/Home'
import type { Food } from '../../types'

describe('App Integration Tests - Flujo Completo', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('Flujo completo: Cargar alimentos → Filtrar → Verificar ruleta → Persistencia', async () => {
    const user = userEvent.setup()

    // ========== PASO 1: Pre-cargar alimentos en localStorage ==========
    const mockFoods: Food[] = [
      {
        id: '1',
        name: 'Pechuga de Pollo',
        category: 'proteina',
        meals: ['almuerzo', 'cena'],
        quantity: 200,
        unit: 'gramos'
      },
      {
        id: '2',
        name: 'Arroz Integral',
        category: 'carbohidrato',
        meals: ['almuerzo'],
        quantity: 150,
        unit: 'gramos'
      },
      {
        id: '3',
        name: 'Brócoli',
        category: 'fruta_veg',
        meals: ['almuerzo', 'cena'],
        quantity: 100,
        unit: 'gramos'
      }
    ]

    localStorage.setItem('foods-inventory', JSON.stringify(mockFoods))

    // Renderizar la aplicación
    render(<Home />)

    // Verificar que se cargaron
    await waitFor(() => {
      expect(screen.getByText('Pechuga de Pollo')).toBeInTheDocument()
      expect(screen.getByText('Arroz Integral')).toBeInTheDocument()
      expect(screen.getByText('Brócoli')).toBeInTheDocument()
    })

    // ========== PASO 2: Filtrar por Comida (Almuerzo) ==========
    const mealFilter = screen.getByLabelText(/filtrar por comida/i)
    await user.selectOptions(mealFilter, 'almuerzo')

    // Verificar que los 3 alimentos están visibles (todos tienen almuerzo)
    expect(screen.getByText('Pechuga de Pollo')).toBeInTheDocument()
    expect(screen.getByText('Arroz Integral')).toBeInTheDocument()
    expect(screen.getByText('Brócoli')).toBeInTheDocument()

    // ========== PASO 3: Filtrar por Categoría (Proteína) ==========
    const categoryFilter = screen.getByLabelText(/filtrar por categoría/i)
    await user.selectOptions(categoryFilter, 'proteina')

    // Solo debería ver el Pollo
    expect(screen.getByText('Pechuga de Pollo')).toBeInTheDocument()
    expect(screen.queryByText('Arroz Integral')).not.toBeInTheDocument()
    expect(screen.queryByText('Brócoli')).not.toBeInTheDocument()

    // Limpiar filtros
    await user.selectOptions(categoryFilter, 'all')
    await user.selectOptions(mealFilter, 'all')

    // Todos visibles de nuevo
    expect(screen.getByText('Pechuga de Pollo')).toBeInTheDocument()
    expect(screen.getByText('Arroz Integral')).toBeInTheDocument()
    expect(screen.getByText('Brócoli')).toBeInTheDocument()

    // ========== PASO 4: Verificar Ruleta Habilitada ==========
    // Verificar que el botón de ruleta está habilitado
    const rouletteButton = screen.getByRole('button', { name: /girar ruleta/i })
    expect(rouletteButton).not.toBeDisabled()

    // ========== PASO 5: Verificar Persistencia ==========
    const stored = JSON.parse(localStorage.getItem('foods-inventory') || '[]')
    expect(stored).toHaveLength(3)
    expect(stored.map((f: any) => f.name)).toContain('Pechuga de Pollo')
    expect(stored.map((f: any) => f.name)).toContain('Arroz Integral')
    expect(stored.map((f: any) => f.name)).toContain('Brócoli')
  })

  it('Flujo: Cargar alimentos → Editar → Verificar cambios', async () => {
    const user = userEvent.setup()

    // Pre-cargar un alimento
    const initialFood: Food = {
      id: '1',
      name: 'Manzana',
      category: 'fruta_veg',
      meals: ['desayuno'],
      quantity: 5,
      unit: 'unidades'
    }

    localStorage.setItem('foods-inventory', JSON.stringify([initialFood]))

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText('Manzana')).toBeInTheDocument()
    })

    // ========== Editar Alimento ==========
    const editButtons = screen.getAllByRole('button', { name: /editar/i })
    await user.click(editButtons[0])

    expect(screen.getByText('Editar Alimento')).toBeInTheDocument()
    
    const nameInput = screen.getByLabelText(/nombre del alimento/i)
    await user.clear(nameInput)
    await user.type(nameInput, 'Manzana Verde')
    await user.click(screen.getByRole('button', { name: /actualizar/i }))

    await waitFor(() => {
      expect(screen.getByText('Manzana Verde')).toBeInTheDocument()
    })

    // Verificar localStorage actualizado
    const stored = JSON.parse(localStorage.getItem('foods-inventory') || '[]')
    expect(stored).toHaveLength(1)
    expect(stored[0].name).toBe('Manzana Verde')
  })

  it('Flujo: Verificar botones de Import/Export con datos', () => {
    // Pre-cargar un alimento
    const food: Food = {
      id: '1',
      name: 'Pescado',
      category: 'proteina',
      meals: ['cena'],
      quantity: 180,
      unit: 'gramos'
    }

    localStorage.setItem('foods-inventory', JSON.stringify([food]))

    render(<Home />)

    // Verificar que el alimento se cargó
    expect(screen.getByText('Pescado')).toBeInTheDocument()

    // ========== Verificar que el botón de exportar está habilitado ==========
    const exportButton = screen.getByRole('button', { name: /exportar/i })
    expect(exportButton).not.toBeDisabled()

    // El botón de importar siempre está habilitado
    const importButton = screen.getByRole('button', { name: /importar/i })
    expect(importButton).not.toBeDisabled()

    // Verificar persistencia
    const stored = JSON.parse(localStorage.getItem('foods-inventory') || '[]')
    expect(stored).toHaveLength(1)
    expect(stored[0].name).toBe('Pescado')
  })
})

