import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FoodList } from './FoodList'
import type { Food } from '../types'

const mockFoods: Food[] = [
  {
    id: '1',
    name: 'Pechuga de Pollo',
    category: 'proteina',
    meals: ['almuerzo', 'cena'],
    quantity: 200,
    unit: 'gramos',
    notes: 'Alto en proteína'
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
    name: 'Manzana',
    category: 'fruta_veg',
    meals: ['desayuno'],
    quantity: 3,
    unit: 'unidades',
    notes: 'Fruta fresca'
  },
  {
    id: '4',
    name: 'Huevos',
    category: 'proteina',
    meals: ['desayuno', 'almuerzo', 'cena'],
    quantity: 0,
    unit: 'unidades'
  }
]

describe('FoodList', () => {
  const mockOnEdit = vi.fn()
  const mockOnDelete = vi.fn()
  const mockOnDecrement = vi.fn()

  beforeEach(() => {
    mockOnEdit.mockClear()
    mockOnDelete.mockClear()
    mockOnDecrement.mockClear()
    vi.clearAllMocks()
  })

  describe('Renderizado', () => {
    it('debe renderizar la lista de alimentos', () => {
      render(<FoodList foods={mockFoods} />)

      expect(screen.getByText('Pechuga de Pollo')).toBeInTheDocument()
      expect(screen.getByText('Arroz Integral')).toBeInTheDocument()
      expect(screen.getByText('Manzana')).toBeInTheDocument()
      expect(screen.getByText('Huevos')).toBeInTheDocument()
    })

    it('debe mostrar mensaje cuando no hay alimentos', () => {
      render(<FoodList foods={[]} />)

      expect(screen.getByText('No hay alimentos para mostrar')).toBeInTheDocument()
    })

    it('debe mostrar mensaje personalizado cuando no hay alimentos', () => {
      render(<FoodList foods={[]} emptyMessage="Lista vacía" />)

      expect(screen.getByText('Lista vacía')).toBeInTheDocument()
    })

    it('debe renderizar filtros', () => {
      render(<FoodList foods={mockFoods} />)

      expect(screen.getByLabelText(/filtrar por comida/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/filtrar por categoría/i)).toBeInTheDocument()
    })

    it('debe mostrar el total de alimentos', () => {
      render(<FoodList foods={mockFoods} />)

      expect(screen.getByText(/total de alimentos:/i)).toBeInTheDocument()
      expect(screen.getByText(/4/)).toBeInTheDocument()
    })
  })

  describe('Información de alimentos', () => {
    it('debe mostrar nombre y categoría', () => {
      render(<FoodList foods={mockFoods} />)

      expect(screen.getByText('Pechuga de Pollo')).toBeInTheDocument()
      expect(screen.getAllByText(/proteína/i).length).toBeGreaterThan(0)
    })

    it('debe mostrar cantidad y unidad', () => {
      render(<FoodList foods={mockFoods} />)

      expect(screen.getByText(/200 gramos/)).toBeInTheDocument()
      expect(screen.getByText(/150 gramos/)).toBeInTheDocument()
    })

    it('debe mostrar comidas como badges', () => {
      render(<FoodList foods={mockFoods} />)

      expect(screen.getAllByText(/almuerzo/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/cena/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/desayuno/i).length).toBeGreaterThan(0)
    })

    it('debe mostrar notas si existen', () => {
      render(<FoodList foods={mockFoods} />)

      expect(screen.getByText(/"Alto en proteína"/)).toBeInTheDocument()
      expect(screen.getByText(/"Fruta fresca"/)).toBeInTheDocument()
    })

    it('debe marcar alimentos sin stock', () => {
      render(<FoodList foods={mockFoods} />)

      expect(screen.getByText('Sin stock')).toBeInTheDocument()
      expect(screen.getByText(/0 unidades/)).toBeInTheDocument()
    })
  })

  describe('Filtros', () => {
    it('debe filtrar por comida (desayuno)', async () => {
      const user = userEvent.setup()
      render(<FoodList foods={mockFoods} />)

      const mealFilter = screen.getByLabelText(/filtrar por comida/i)
      await user.selectOptions(mealFilter, 'desayuno')

      // Solo deben aparecer los que tienen desayuno
      expect(screen.getByText('Manzana')).toBeInTheDocument()
      expect(screen.getByText('Huevos')).toBeInTheDocument()
      expect(screen.queryByText('Arroz Integral')).not.toBeInTheDocument()
    })

    it('debe filtrar por comida (almuerzo)', async () => {
      const user = userEvent.setup()
      render(<FoodList foods={mockFoods} />)

      const mealFilter = screen.getByLabelText(/filtrar por comida/i)
      await user.selectOptions(mealFilter, 'almuerzo')

      expect(screen.getByText('Pechuga de Pollo')).toBeInTheDocument()
      expect(screen.getByText('Arroz Integral')).toBeInTheDocument()
      expect(screen.getByText('Huevos')).toBeInTheDocument()
      expect(screen.queryByText('Manzana')).not.toBeInTheDocument()
    })

    it('debe filtrar por categoría (proteína)', async () => {
      const user = userEvent.setup()
      render(<FoodList foods={mockFoods} />)

      const categoryFilter = screen.getByLabelText(/filtrar por categoría/i)
      await user.selectOptions(categoryFilter, 'proteina')

      expect(screen.getByText('Pechuga de Pollo')).toBeInTheDocument()
      expect(screen.getByText('Huevos')).toBeInTheDocument()
      expect(screen.queryByText('Arroz Integral')).not.toBeInTheDocument()
      expect(screen.queryByText('Manzana')).not.toBeInTheDocument()
    })

    it('debe filtrar por categoría (carbohidrato)', async () => {
      const user = userEvent.setup()
      render(<FoodList foods={mockFoods} />)

      const categoryFilter = screen.getByLabelText(/filtrar por categoría/i)
      await user.selectOptions(categoryFilter, 'carbohidrato')

      expect(screen.getByText('Arroz Integral')).toBeInTheDocument()
      expect(screen.queryByText('Pechuga de Pollo')).not.toBeInTheDocument()
    })

    it('debe aplicar múltiples filtros simultáneamente', async () => {
      const user = userEvent.setup()
      render(<FoodList foods={mockFoods} />)

      const mealFilter = screen.getByLabelText(/filtrar por comida/i)
      const categoryFilter = screen.getByLabelText(/filtrar por categoría/i)

      await user.selectOptions(mealFilter, 'desayuno')
      await user.selectOptions(categoryFilter, 'proteina')

      // Solo Huevos cumple ambos criterios
      expect(screen.getByText('Huevos')).toBeInTheDocument()
      expect(screen.queryByText('Manzana')).not.toBeInTheDocument()
      expect(screen.queryByText('Pechuga de Pollo')).not.toBeInTheDocument()
    })

    it('debe mostrar contador de filtrados', async () => {
      const user = userEvent.setup()
      render(<FoodList foods={mockFoods} />)

      const categoryFilter = screen.getByLabelText(/filtrar por categoría/i)
      await user.selectOptions(categoryFilter, 'proteina')

      expect(screen.getByText(/mostrando 2 de 4 alimentos/i)).toBeInTheDocument()
    })

    it('debe limpiar filtros al hacer clic en "Limpiar filtros"', async () => {
      const user = userEvent.setup()
      render(<FoodList foods={mockFoods} />)

      const categoryFilter = screen.getByLabelText(/filtrar por categoría/i)
      await user.selectOptions(categoryFilter, 'proteina')

      // Debe haber menos alimentos
      expect(screen.queryByText('Manzana')).not.toBeInTheDocument()

      // Limpiar filtros
      const clearButton = screen.getByText(/limpiar filtros/i)
      await user.click(clearButton)

      // Ahora deben aparecer todos
      expect(screen.getByText('Manzana')).toBeInTheDocument()
      expect(screen.getByText('Arroz Integral')).toBeInTheDocument()
    })

    it('debe mostrar mensaje cuando el filtro no tiene resultados', async () => {
      const user = userEvent.setup()
      const foodsWithoutFruits: Food[] = mockFoods.filter(f => f.category !== 'fruta_veg')
      render(<FoodList foods={foodsWithoutFruits} />)

      const categoryFilter = screen.getByLabelText(/filtrar por categoría/i)
      await user.selectOptions(categoryFilter, 'fruta_veg')

      expect(screen.getByText('No hay alimentos para mostrar')).toBeInTheDocument()
    })
  })

  describe('Botones de acción', () => {
    it('debe renderizar botón de editar si se proporciona onEdit', () => {
      render(<FoodList foods={mockFoods} onEdit={mockOnEdit} />)

      const editButtons = screen.getAllByText(/editar/i)
      expect(editButtons).toHaveLength(mockFoods.length)
    })

    it('no debe renderizar botón de editar si no se proporciona onEdit', () => {
      render(<FoodList foods={mockFoods} />)

      expect(screen.queryByText(/editar/i)).not.toBeInTheDocument()
    })

    it('debe llamar onEdit con el alimento correcto', async () => {
      const user = userEvent.setup()
      render(<FoodList foods={mockFoods} onEdit={mockOnEdit} />)

      const editButtons = screen.getAllByText(/editar/i)
      await user.click(editButtons[0])

      expect(mockOnEdit).toHaveBeenCalledTimes(1)
      expect(mockOnEdit).toHaveBeenCalledWith(mockFoods[0])
    })

    it('debe renderizar botón de eliminar si se proporciona onDelete', () => {
      render(<FoodList foods={mockFoods} onDelete={mockOnDelete} />)

      const deleteButtons = screen.getAllByText(/eliminar/i)
      expect(deleteButtons).toHaveLength(mockFoods.length)
    })

    it('debe llamar onDelete con confirmación', async () => {
      const user = userEvent.setup()
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
      
      render(<FoodList foods={mockFoods} onDelete={mockOnDelete} />)

      const deleteButtons = screen.getAllByText(/eliminar/i)
      await user.click(deleteButtons[0])

      expect(confirmSpy).toHaveBeenCalled()
      expect(mockOnDelete).toHaveBeenCalledTimes(1)
      expect(mockOnDelete).toHaveBeenCalledWith('1')

      confirmSpy.mockRestore()
    })

    it('no debe llamar onDelete si se cancela la confirmación', async () => {
      const user = userEvent.setup()
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
      
      render(<FoodList foods={mockFoods} onDelete={mockOnDelete} />)

      const deleteButtons = screen.getAllByText(/eliminar/i)
      await user.click(deleteButtons[0])

      expect(confirmSpy).toHaveBeenCalled()
      expect(mockOnDelete).not.toHaveBeenCalled()

      confirmSpy.mockRestore()
    })

    it('debe renderizar botón de decrementar si se proporciona onDecrement', () => {
      render(<FoodList foods={mockFoods} onDecrement={mockOnDecrement} />)

      const decrementButtons = screen.getAllByText(/stock/i)
      expect(decrementButtons.length).toBeGreaterThan(0)
    })

    it('debe llamar onDecrement con el alimento correcto', async () => {
      const user = userEvent.setup()
      render(<FoodList foods={mockFoods} onDecrement={mockOnDecrement} />)

      const decrementButtons = screen.getAllByText(/stock/i)
      await user.click(decrementButtons[0])

      expect(mockOnDecrement).toHaveBeenCalledTimes(1)
      expect(mockOnDecrement).toHaveBeenCalledWith(mockFoods[0])
    })

    it('debe deshabilitar botón de decrementar cuando quantity es 0', () => {
      render(<FoodList foods={mockFoods} onDecrement={mockOnDecrement} />)

      const decrementButtons = screen.getAllByText(/stock/i)
      const lastButton = decrementButtons[decrementButtons.length - 1]

      expect(lastButton).toBeDisabled()
    })

    it('no debe llamar onDecrement cuando quantity es 0', async () => {
      const user = userEvent.setup()
      render(<FoodList foods={mockFoods} onDecrement={mockOnDecrement} />)

      const decrementButtons = screen.getAllByText(/stock/i)
      const disabledButton = decrementButtons[decrementButtons.length - 1]

      // Intentar hacer clic en botón deshabilitado
      await user.click(disabledButton)

      expect(mockOnDecrement).not.toHaveBeenCalled()
    })
  })

  describe('Casos especiales', () => {
    it('debe manejar alimentos sin comidas asignadas', () => {
      const foodWithoutMeals: Food = {
        id: '5',
        name: 'Snack',
        category: 'proteina',
        meals: [],
        quantity: 10,
        unit: 'unidades'
      }

      render(<FoodList foods={[foodWithoutMeals]} />)

      expect(screen.getByText('Snack')).toBeInTheDocument()
      // No buscar por texto de desayuno ya que también está en los filtros
    })

    it('debe manejar alimentos sin notas', () => {
      const foodWithoutNotes: Food = {
        id: '6',
        name: 'Agua',
        category: 'fruta_veg',
        meals: ['almuerzo'],
        quantity: 1,
        unit: 'litros'
      }

      render(<FoodList foods={[foodWithoutNotes]} />)

      expect(screen.getByText('Agua')).toBeInTheDocument()
      // No debe renderizar comillas si no hay notas
      const quotes = screen.queryAllByText(/".*"/)
      expect(quotes.length).toBe(0)
    })

    it('debe actualizar la lista cuando cambian los alimentos', () => {
      const { rerender } = render(<FoodList foods={[mockFoods[0]]} />)

      expect(screen.getByText('Pechuga de Pollo')).toBeInTheDocument()
      expect(screen.queryByText('Manzana')).not.toBeInTheDocument()

      rerender(<FoodList foods={[mockFoods[0], mockFoods[2]]} />)

      expect(screen.getByText('Pechuga de Pollo')).toBeInTheDocument()
      expect(screen.getByText('Manzana')).toBeInTheDocument()
    })
  })

  describe('Accesibilidad', () => {
    it('debe tener labels asociados a los filtros', () => {
      render(<FoodList foods={mockFoods} />)

      expect(screen.getByLabelText(/filtrar por comida/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/filtrar por categoría/i)).toBeInTheDocument()
    })

    it('debe tener títulos descriptivos en los botones deshabilitados', () => {
      render(<FoodList foods={mockFoods} onDecrement={mockOnDecrement} />)

      const decrementButtons = screen.getAllByText(/stock/i)
      const disabledButton = decrementButtons[decrementButtons.length - 1]

      expect(disabledButton).toHaveAttribute('title', 'Sin stock para decrementar')
    })
  })

  describe('Responsive y UI', () => {
    it('debe aplicar estilos diferentes para alimentos sin stock', () => {
      render(<FoodList foods={mockFoods} />)

      const sinStock = screen.getByText('Sin stock')
      expect(sinStock).toHaveClass('bg-red-100', 'text-red-800')
    })

    it('debe mostrar iconos de categorías', () => {
      render(<FoodList foods={mockFoods} />)

      // Verificar que los emojis están presentes (por sus labels)
      expect(screen.getAllByText(/proteína/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/carbohidrato/i).length).toBeGreaterThan(0)
    })
  })
})

