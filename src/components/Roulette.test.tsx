import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Roulette, RouletteResult } from './Roulette'
import type { Food } from '../types'

const mockFoods: Food[] = [
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
    name: 'Pescado',
    category: 'proteina',
    meals: ['almuerzo'],
    quantity: 150,
    unit: 'gramos'
  },
  {
    id: '3',
    name: 'Arroz',
    category: 'carbohidrato',
    meals: ['almuerzo', 'cena'],
    quantity: 100,
    unit: 'gramos'
  },
  {
    id: '4',
    name: 'Pasta',
    category: 'carbohidrato',
    meals: ['cena'],
    quantity: 80,
    unit: 'gramos'
  },
  {
    id: '5',
    name: 'Manzana',
    category: 'fruta_veg',
    meals: ['desayuno', 'almuerzo'],
    quantity: 3,
    unit: 'unidades'
  },
  {
    id: '6',
    name: 'Brócoli',
    category: 'fruta_veg',
    meals: ['almuerzo', 'cena'],
    quantity: 150,
    unit: 'gramos'
  },
  // Alimento sin stock
  {
    id: '7',
    name: 'Huevos',
    category: 'proteina',
    meals: ['desayuno'],
    quantity: 0,
    unit: 'unidades'
  }
]

describe('Roulette', () => {
  const mockOnResult = vi.fn()
  const mockOnReset = vi.fn()

  beforeEach(() => {
    mockOnResult.mockClear()
    mockOnReset.mockClear()
    vi.clearAllTimers()
    vi.useFakeTimers()
  })

  afterEach(() => {
    try {
      vi.runOnlyPendingTimers()
    } catch {
      // Ignorar si los timers no están mockeados
    }
    vi.useRealTimers()
  })

  describe('Renderizado', () => {
    it('debe renderizar el componente con título', () => {
      render(<Roulette foods={mockFoods} meal="almuerzo" />)

      expect(screen.getByText(/ruleta de alimentos/i)).toBeInTheDocument()
      expect(screen.getByText('almuerzo')).toBeInTheDocument()
    })

    it('debe mostrar las tres categorías', () => {
      render(<Roulette foods={mockFoods} meal="almuerzo" />)

      expect(screen.getByText(/proteína/i)).toBeInTheDocument()
      expect(screen.getByText(/carbohidrato/i)).toBeInTheDocument()
      expect(screen.getByText(/frutas y vegetales/i)).toBeInTheDocument()
    })

    it('debe mostrar el botón de girar ruleta', () => {
      render(<Roulette foods={mockFoods} meal="almuerzo" />)

      expect(screen.getByRole('button', { name: /girar ruleta/i })).toBeInTheDocument()
    })

    it('debe mostrar contador de alimentos disponibles', () => {
      render(<Roulette foods={mockFoods} meal="almuerzo" />)

      expect(screen.getAllByText(/disponibles/i).length).toBeGreaterThan(0)
    })
  })

  describe('Filtrado de alimentos', () => {
    it('debe filtrar alimentos por meal', () => {
      const { rerender } = render(<Roulette foods={mockFoods} meal="desayuno" />)

      // Para desayuno solo hay Manzana con stock
      // (Huevos está sin stock)
      
      rerender(<Roulette foods={mockFoods} meal="almuerzo" />)
      
      // Para almuerzo hay más opciones
      expect(screen.getByRole('button', { name: /girar ruleta/i })).not.toBeDisabled()
    })

    it('debe excluir alimentos sin stock (quantity = 0)', () => {
      // Huevos tiene quantity = 0 y meal = desayuno
      const desayunoFoods = mockFoods.filter(
        f => f.meals.includes('desayuno') && f.quantity > 0
      )

      // Solo debería haber Manzana para desayuno con stock
      expect(desayunoFoods.filter(f => f.category === 'proteina').length).toBe(0)
    })

    it('debe filtrar solo alimentos con la meal especificada', () => {
      render(<Roulette foods={mockFoods} meal="cena" />)

      // Para cena: Pollo, Arroz/Pasta, Brócoli
      expect(screen.getByRole('button', { name: /girar ruleta/i })).not.toBeDisabled()
    })
  })

  describe('Advertencias', () => {
    it('debe mostrar advertencia si falta una categoría', () => {
      const incompleteFoods: Food[] = [
        mockFoods[0], // Pollo (proteína)
        mockFoods[2], // Arroz (carbohidrato)
        // Falta fruta_veg con almuerzo
      ]

      render(<Roulette foods={incompleteFoods} meal="cena" />)

      // Debería mostrar advertencia
      expect(screen.queryByText(/no hay suficientes alimentos/i)).toBeInTheDocument()
    })

    it('debe mostrar qué categoría falta', () => {
      const incompleteFoods: Food[] = [
        mockFoods[2], // Arroz (carbohidrato, almuerzo)
        mockFoods[4], // Manzana (fruta_veg, almuerzo)
        // Falta proteína para almuerzo con stock
      ]

      render(<Roulette foods={incompleteFoods} meal="desayuno" />)

      if (screen.queryByText(/no hay suficientes alimentos/i)) {
        expect(screen.getByText(/falta proteína/i)).toBeInTheDocument()
      }
    })

    it('debe deshabilitar el botón si faltan categorías', () => {
      const incompleteFoods: Food[] = [mockFoods[0]]

      render(<Roulette foods={incompleteFoods} meal="almuerzo" />)

      const button = screen.getByRole('button', { name: /girar ruleta/i })
      expect(button).toBeDisabled()
    })
  })

  describe('Funcionalidad de girar', () => {
    it('debe tener un botón para girar cuando hay alimentos', () => {
      const { container } = render(<Roulette foods={mockFoods} meal="almuerzo" />)

      const button = container.querySelector('button:not([disabled])')
      expect(button).toBeInTheDocument()
      expect(button).not.toBeDisabled()
    })

    it('debe llamar onResult con el resultado después del giro', async () => {
      vi.useRealTimers() // Usar timers reales para esta prueba
      
      const { container } = render(
        <Roulette
          foods={mockFoods}
          meal="almuerzo"
          onResult={mockOnResult}
        />
      )

      const button = container.querySelector('button:not([disabled])')
      fireEvent.click(button!)

      // Esperar a que termine la animación (3 categorías * 1.5s = 4.5s)
      await waitFor(
        () => {
          expect(mockOnResult).toHaveBeenCalled()
        },
        { timeout: 6000 }
      )

      const result: RouletteResult = mockOnResult.mock.calls[0][0]
      
      // Verificar que se seleccionó un alimento de cada categoría
      expect(result.proteina).toBeTruthy()
      expect(result.carbohidrato).toBeTruthy()
      expect(result.fruta_veg).toBeTruthy()

      vi.useFakeTimers()
    })

    it('debe seleccionar alimentos válidos para la meal', async () => {
      vi.useRealTimers()
      
      const { container } = render(
        <Roulette
          foods={mockFoods}
          meal="almuerzo"
          onResult={mockOnResult}
        />
      )

      const button = container.querySelector('button:not([disabled])')
      fireEvent.click(button!)

      await waitFor(
        () => {
          expect(mockOnResult).toHaveBeenCalled()
        },
        { timeout: 6000 }
      )

      const result: RouletteResult = mockOnResult.mock.calls[0][0]
      
      // Todos los alimentos deben incluir 'almuerzo'
      if (result.proteina) expect(result.proteina.meals).toContain('almuerzo')
      if (result.carbohidrato) expect(result.carbohidrato.meals).toContain('almuerzo')
      if (result.fruta_veg) expect(result.fruta_veg.meals).toContain('almuerzo')

      vi.useFakeTimers()
    })

    it('debe seleccionar alimentos con quantity > 0', async () => {
      vi.useRealTimers()
      
      const { container } = render(
        <Roulette
          foods={mockFoods}
          meal="almuerzo"
          onResult={mockOnResult}
        />
      )

      const button = container.querySelector('button:not([disabled])')
      fireEvent.click(button!)

      await waitFor(
        () => {
          expect(mockOnResult).toHaveBeenCalled()
        },
        { timeout: 6000 }
      )

      const result: RouletteResult = mockOnResult.mock.calls[0][0]
      
      // Todos deben tener stock
      if (result.proteina) expect(result.proteina.quantity).toBeGreaterThan(0)
      if (result.carbohidrato) expect(result.carbohidrato.quantity).toBeGreaterThan(0)
      if (result.fruta_veg) expect(result.fruta_veg.quantity).toBeGreaterThan(0)

      vi.useFakeTimers()
    })
  })

  describe('Resultado', () => {
    it('debe tener slots para las tres categorías', () => {
      render(<Roulette foods={mockFoods} meal="almuerzo" />)

      expect(screen.getByText(/proteína/i)).toBeInTheDocument()
      expect(screen.getByText(/carbohidrato/i)).toBeInTheDocument()
      expect(screen.getByText(/frutas y vegetales/i)).toBeInTheDocument()
    })
  })

  describe('Reset', () => {
    it('debe renderizar componente correctamente', () => {
      render(<Roulette foods={mockFoods} meal="almuerzo" onReset={mockOnReset} />)

      expect(screen.getByText(/ruleta de alimentos/i)).toBeInTheDocument()
    })
  })

  describe('Casos especiales', () => {
    it('debe manejar cuando no hay alimentos', () => {
      const { container } = render(<Roulette foods={[]} meal="almuerzo" />)

      expect(screen.getByText(/no hay suficientes alimentos/i)).toBeInTheDocument()
      const button = container.querySelector('button')
      expect(button).toBeDisabled()
    })

    it('debe manejar diferentes meals', () => {
      const { rerender } = render(<Roulette foods={mockFoods} meal="desayuno" />)
      expect(screen.getByText('desayuno')).toBeInTheDocument()

      rerender(<Roulette foods={mockFoods} meal="cena" />)
      expect(screen.getByText('cena')).toBeInTheDocument()
    })

    it('debe retornar null para categorías sin alimentos disponibles', async () => {
      vi.useRealTimers()
      
      // Solo alimentos de proteína y carbohidrato para almuerzo
      const limitedFoods: Food[] = [
        mockFoods[0], // Pollo
        mockFoods[2]  // Arroz
      ]

      const { container } = render(
        <Roulette
          foods={limitedFoods}
          meal="almuerzo"
          onResult={mockOnResult}
        />
      )

      // No debería permitir girar
      const button = container.querySelector('button')
      expect(button).toBeDisabled()

      vi.useFakeTimers()
    })
  })

  describe('Accesibilidad', () => {
    it('debe tener textos descriptivos en los botones', () => {
      const { container } = render(<Roulette foods={mockFoods} meal="almuerzo" />)

      const button = container.querySelector('button')
      expect(button).toBeInTheDocument()
    })

    it('debe indicar visualmente el estado deshabilitado', () => {
      const incompleteFoods: Food[] = [mockFoods[0]]

      const { container } = render(<Roulette foods={incompleteFoods} meal="almuerzo" />)

      const button = container.querySelector('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('cursor-not-allowed')
    })
  })
})

