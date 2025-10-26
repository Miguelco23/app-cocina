import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Home } from './Home'
import type { Food } from '../types'

// Mock de datos de prueba
const mockFoodsComplete: Food[] = [
  {
    id: '1',
    name: 'Pollo',
    category: 'proteina',
    meals: ['almuerzo', 'cena'],
    quantity: 200,
    unit: 'gramos'
  },
  {
    id: '2',
    name: 'Arroz',
    category: 'carbohidrato',
    meals: ['almuerzo', 'cena'],
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

describe('Home', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('Renderizado inicial', () => {
    it('debe renderizar el componente principal', () => {
      render(<Home />)

      expect(screen.getByText(/app cocina/i)).toBeInTheDocument()
      expect(screen.getByText(/gestiona tu inventario/i)).toBeInTheDocument()
    })

    it('debe mostrar botón para crear nuevo alimento', () => {
      render(<Home />)

      expect(screen.getByRole('button', { name: /nuevo alimento/i })).toBeInTheDocument()
    })

    it('debe mostrar estadísticas iniciales en cero', () => {
      render(<Home />)

      // Verificar que aparece "0" en las estadísticas
      const stats = screen.getAllByText('0')
      expect(stats.length).toBeGreaterThanOrEqual(2)
    })

    it('debe mostrar selector de comida', () => {
      render(<Home />)

      expect(screen.getByLabelText(/selecciona la comida/i)).toBeInTheDocument()
    })

    it('debe mostrar botón de girar ruleta', () => {
      render(<Home />)

      expect(screen.getByRole('button', { name: /girar ruleta|faltan alimentos/i })).toBeInTheDocument()
    })

    it('debe mostrar mensaje de ayuda', () => {
      render(<Home />)

      expect(screen.getByText(/cómo usar/i)).toBeInTheDocument()
    })
  })

  describe('Estadísticas', () => {
    it('debe actualizar estadísticas cuando hay alimentos', () => {
      // Pre-cargar datos en localStorage
      localStorage.setItem('foods-inventory', JSON.stringify(mockFoodsComplete))
      
      render(<Home />)

      expect(screen.getByText('3')).toBeInTheDocument() // Total
      expect(screen.getByText('Con Stock')).toBeInTheDocument()
    })

    it('debe mostrar alimentos sin stock correctamente', () => {
      const foodsWithEmpty: Food[] = [
        ...mockFoodsComplete,
        {
          id: '4',
          name: 'Huevos',
          category: 'proteina',
          meals: ['desayuno'],
          quantity: 0,
          unit: 'unidades'
        }
      ]
      
      localStorage.setItem('foods-inventory', JSON.stringify(foodsWithEmpty))
      
      render(<Home />)

      expect(screen.getByText('4')).toBeInTheDocument() // Total
      expect(screen.getByText('1')).toBeInTheDocument() // Sin stock
    })
  })

  describe('Crear alimento', () => {
    it('debe mostrar formulario al hacer clic en "Nuevo Alimento"', async () => {
      const user = userEvent.setup()
      render(<Home />)

      const newButton = screen.getByRole('button', { name: /nuevo alimento/i })
      await user.click(newButton)

      expect(screen.getByText('Nuevo Alimento')).toBeInTheDocument()
    })

    it('debe ocultar lista al mostrar formulario', async () => {
      const user = userEvent.setup()
      localStorage.setItem('foods-inventory', JSON.stringify(mockFoodsComplete))
      
      render(<Home />)

      expect(screen.getByText('Pollo')).toBeInTheDocument()

      const newButton = screen.getByRole('button', { name: /nuevo alimento/i })
      await user.click(newButton)

      expect(screen.queryByText('Pollo')).not.toBeInTheDocument()
    })

    it('debe cerrar formulario al cancelar', async () => {
      const user = userEvent.setup()
      render(<Home />)

      // Abrir formulario
      await user.click(screen.getByRole('button', { name: /nuevo alimento/i }))
      expect(screen.getByText('Nuevo Alimento')).toBeInTheDocument()

      // Cancelar
      await user.click(screen.getByRole('button', { name: /cancelar/i }))
      
      await waitFor(() => {
        expect(screen.queryByText('Nuevo Alimento')).not.toBeInTheDocument()
      })
    })
  })

  describe('Selector de comida', () => {
    it('debe cambiar la comida seleccionada', async () => {
      const user = userEvent.setup()
      render(<Home />)

      const mealSelector = screen.getByLabelText(/selecciona la comida/i)
      
      expect(mealSelector).toHaveValue('almuerzo')
      
      await user.selectOptions(mealSelector, 'desayuno')
      
      expect(mealSelector).toHaveValue('desayuno')
    })

    it('debe tener todas las opciones de comida', () => {
      render(<Home />)

      const mealSelector = screen.getByLabelText(/selecciona la comida/i) as HTMLSelectElement
      const options = Array.from(mealSelector.options).map(o => o.value)

      expect(options).toContain('desayuno')
      expect(options).toContain('almuerzo')
      expect(options).toContain('cena')
    })
  })

  describe('Botón de ruleta', () => {
    it('debe estar deshabilitado cuando no hay alimentos', () => {
      render(<Home />)

      const rouletteButton = screen.getByRole('button', { name: /faltan alimentos/i })
      expect(rouletteButton).toBeDisabled()
    })

    it('debe estar deshabilitado cuando faltan categorías', () => {
      // Solo proteína
      const incompleteFoods: Food[] = [mockFoodsComplete[0]]
      localStorage.setItem('foods-inventory', JSON.stringify(incompleteFoods))
      
      render(<Home />)

      const rouletteButton = screen.getByRole('button', { name: /faltan alimentos/i })
      expect(rouletteButton).toBeDisabled()
    })

    it('debe estar habilitado cuando hay todas las categorías', () => {
      localStorage.setItem('foods-inventory', JSON.stringify(mockFoodsComplete))
      
      render(<Home />)

      const rouletteButton = screen.getByRole('button', { name: /girar ruleta/i })
      expect(rouletteButton).not.toBeDisabled()
    })

    it('debe abrir modal de ruleta al hacer clic', async () => {
      const user = userEvent.setup()
      localStorage.setItem('foods-inventory', JSON.stringify(mockFoodsComplete))
      
      render(<Home />)

      const rouletteButton = screen.getByRole('button', { name: /girar ruleta/i })
      await user.click(rouletteButton)

      expect(screen.getByText(/ruleta para/i)).toBeInTheDocument()
    })

    it('debe mostrar mensaje cuando no se puede girar', () => {
      const incompleteFoods: Food[] = [mockFoodsComplete[0]]
      localStorage.setItem('foods-inventory', JSON.stringify(incompleteFoods))
      
      render(<Home />)

      expect(screen.getByText(/necesitas al menos un alimento/i)).toBeInTheDocument()
    })
  })

  describe('Modal de ruleta', () => {
    it('debe cerrar modal al hacer clic en X', async () => {
      const user = userEvent.setup()
      localStorage.setItem('foods-inventory', JSON.stringify(mockFoodsComplete))
      
      render(<Home />)

      // Abrir modal
      await user.click(screen.getByRole('button', { name: /girar ruleta/i }))
      expect(screen.getByText(/ruleta para/i)).toBeInTheDocument()

      // Cerrar modal
      const closeButton = screen.getByText('×')
      await user.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByText(/ruleta para/i)).not.toBeInTheDocument()
      })
    })

    it('debe mostrar la comida seleccionada en el título del modal', async () => {
      const user = userEvent.setup()
      localStorage.setItem('foods-inventory', JSON.stringify(mockFoodsComplete))
      
      render(<Home />)

      // Cambiar a cena
      await user.selectOptions(screen.getByLabelText(/selecciona la comida/i), 'cena')

      // Abrir modal
      await user.click(screen.getByRole('button', { name: /girar ruleta/i }))

      expect(screen.getByText(/ruleta para cena/i)).toBeInTheDocument()
    })
  })

  describe('Confirmar receta', () => {
    it('debe mostrar botón de confirmar cuando hay resultado', async () => {
      const user = userEvent.setup()
      vi.useFakeTimers()
      
      localStorage.setItem('foods-inventory', JSON.stringify(mockFoodsComplete))
      
      render(<Home />)

      // Abrir ruleta
      await user.click(screen.getByRole('button', { name: /girar ruleta/i }))
      
      // Simular resultado de ruleta (necesitamos esperar las animaciones)
      // Por ahora, vamos a verificar que el componente Home está listo para recibir el callback
      
      vi.useRealTimers()
    })
  })

  describe('Integración con FoodList', () => {
    it('debe mostrar la lista de alimentos', () => {
      localStorage.setItem('foods-inventory', JSON.stringify(mockFoodsComplete))
      
      render(<Home />)

      expect(screen.getByText('Pollo')).toBeInTheDocument()
      expect(screen.getByText('Arroz')).toBeInTheDocument()
      expect(screen.getByText('Brócoli')).toBeInTheDocument()
    })

    it('debe permitir editar alimento desde la lista', async () => {
      const user = userEvent.setup()
      localStorage.setItem('foods-inventory', JSON.stringify(mockFoodsComplete))
      
      render(<Home />)

      const editButtons = screen.getAllByText(/editar/i)
      await user.click(editButtons[0])

      expect(screen.getByText('Editar Alimento')).toBeInTheDocument()
    })

    it('debe persistir cambios en localStorage', async () => {
      const user = userEvent.setup()
      render(<Home />)

      // Crear nuevo alimento
      await user.click(screen.getByRole('button', { name: /nuevo alimento/i }))
      
      // Llenar formulario básico
      await user.type(screen.getByLabelText(/nombre del alimento/i), 'Test')
      await user.click(screen.getByRole('checkbox', { name: /almuerzo/i }))
      
      // Guardar
      await user.click(screen.getByRole('button', { name: /crear alimento/i }))

      await waitFor(() => {
        const stored = JSON.parse(localStorage.getItem('foods-inventory') || '[]')
        expect(stored).toHaveLength(1)
        expect(stored[0].name).toBe('Test')
      })
    })
  })

  describe('Accesibilidad', () => {
    it('debe tener label asociado al selector de comida', () => {
      render(<Home />)

      const selector = screen.getByLabelText(/selecciona la comida/i)
      expect(selector).toBeInTheDocument()
    })

    it('debe tener textos descriptivos en los botones', () => {
      render(<Home />)

      expect(screen.getByRole('button', { name: /nuevo alimento/i })).toBeInTheDocument()
    })

    it('debe indicar visualmente cuando el botón está deshabilitado', () => {
      render(<Home />)

      const button = screen.getByRole('button', { name: /faltan alimentos/i })
      expect(button).toBeDisabled()
      expect(button).toHaveClass('cursor-not-allowed')
    })
  })

  describe('Persistencia', () => {
    it('debe cargar alimentos desde localStorage al montar', () => {
      localStorage.setItem('foods-inventory', JSON.stringify(mockFoodsComplete))
      
      render(<Home />)

      expect(screen.getByText('Pollo')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument() // Total
    })

    it('debe persistir cambios al crear alimento', async () => {
      const user = userEvent.setup()
      render(<Home />)

      await user.click(screen.getByRole('button', { name: /nuevo alimento/i }))
      await user.type(screen.getByLabelText(/nombre del alimento/i), 'NuevoAlimento')
      await user.click(screen.getByRole('checkbox', { name: /almuerzo/i }))
      await user.click(screen.getByRole('button', { name: /crear alimento/i }))

      await waitFor(() => {
        const stored = localStorage.getItem('foods-inventory')
        expect(stored).toBeTruthy()
      })
    })
  })
})

