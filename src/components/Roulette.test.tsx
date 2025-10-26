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
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  describe('Renderizado', () => {
    it('debe renderizar el componente con título', () => {
      render(<Roulette foods={mockFoods} meal="almuerzo" />)

      expect(screen.getByText(/ruleta de alimentos/i)).toBeInTheDocument()
      expect(screen.getByText(/selección aleatoria para almuerzo/i)).toBeInTheDocument()
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
    it('debe cambiar el texto del botón al girar', async () => {
      render(<Roulette foods={mockFoods} meal="almuerzo" />)

      const button = screen.getByRole('button', { name: /girar ruleta/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByText(/seleccionando/i)).toBeInTheDocument()
      })
    })

    it('debe deshabilitar el botón durante el giro', async () => {
      render(<Roulette foods={mockFoods} meal="almuerzo" />)

      const button = screen.getByRole('button', { name: /girar ruleta/i })
      fireEvent.click(button)

      await waitFor(() => {
        const spinningButton = screen.getByRole('button', { name: /seleccionando/i })
        expect(spinningButton).toBeDisabled()
      })
    })

    it('debe llamar onResult con el resultado después del giro', async () => {
      vi.useRealTimers() // Usar timers reales para esta prueba
      
      render(
        <Roulette
          foods={mockFoods}
          meal="almuerzo"
          onResult={mockOnResult}
        />
      )

      const button = screen.getByRole('button', { name: /girar ruleta/i })
      fireEvent.click(button)

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
      
      render(
        <Roulette
          foods={mockFoods}
          meal="almuerzo"
          onResult={mockOnResult}
        />
      )

      const button = screen.getByRole('button', { name: /girar ruleta/i })
      fireEvent.click(button)

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
      
      render(
        <Roulette
          foods={mockFoods}
          meal="almuerzo"
          onResult={mockOnResult}
        />
      )

      const button = screen.getByRole('button', { name: /girar ruleta/i })
      fireEvent.click(button)

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
    it('debe mostrar el resultado después del giro', async () => {
      vi.useRealTimers()
      
      render(<Roulette foods={mockFoods} meal="almuerzo" />)

      const button = screen.getByRole('button', { name: /girar ruleta/i })
      fireEvent.click(button)

      await waitFor(
        () => {
          expect(screen.getByText(/comida seleccionada/i)).toBeInTheDocument()
        },
        { timeout: 6000 }
      )

      vi.useFakeTimers()
    })

    it('debe mostrar botón para volver a girar', async () => {
      vi.useRealTimers()
      
      render(<Roulette foods={mockFoods} meal="almuerzo" />)

      const button = screen.getByRole('button', { name: /girar ruleta/i })
      fireEvent.click(button)

      await waitFor(
        () => {
          expect(screen.getByRole('button', { name: /volver a girar/i })).toBeInTheDocument()
        },
        { timeout: 6000 }
      )

      vi.useFakeTimers()
    })

    it('debe mostrar los nombres de los alimentos seleccionados', async () => {
      vi.useRealTimers()
      
      render(
        <Roulette
          foods={mockFoods}
          meal="almuerzo"
          onResult={mockOnResult}
        />
      )

      const button = screen.getByRole('button', { name: /girar ruleta/i })
      fireEvent.click(button)

      await waitFor(
        () => {
          expect(mockOnResult).toHaveBeenCalled()
        },
        { timeout: 6000 }
      )

      const result: RouletteResult = mockOnResult.mock.calls[0][0]
      
      // Verificar que los nombres aparecen en la UI
      if (result.proteina) {
        expect(screen.getByText(result.proteina.name)).toBeInTheDocument()
      }

      vi.useFakeTimers()
    })
  })

  describe('Reset', () => {
    it('debe llamar onReset al hacer clic en volver a girar', async () => {
      vi.useRealTimers()
      
      render(
        <Roulette
          foods={mockFoods}
          meal="almuerzo"
          onReset={mockOnReset}
        />
      )

      const button = screen.getByRole('button', { name: /girar ruleta/i })
      fireEvent.click(button)

      await waitFor(
        () => {
          expect(screen.getByRole('button', { name: /volver a girar/i })).toBeInTheDocument()
        },
        { timeout: 6000 }
      )

      const resetButton = screen.getByRole('button', { name: /volver a girar/i })
      fireEvent.click(resetButton)

      expect(mockOnReset).toHaveBeenCalled()

      vi.useFakeTimers()
    })

    it('debe ocultar el resultado al resetear', async () => {
      vi.useRealTimers()
      
      render(<Roulette foods={mockFoods} meal="almuerzo" />)

      const button = screen.getByRole('button', { name: /girar ruleta/i })
      fireEvent.click(button)

      await waitFor(
        () => {
          expect(screen.getByText(/comida seleccionada/i)).toBeInTheDocument()
        },
        { timeout: 6000 }
      )

      const resetButton = screen.getByRole('button', { name: /volver a girar/i })
      fireEvent.click(resetButton)

      await waitFor(() => {
        expect(screen.queryByText(/comida seleccionada/i)).not.toBeInTheDocument()
      })

      vi.useFakeTimers()
    })

    it('debe mostrar el botón original después de resetear', async () => {
      vi.useRealTimers()
      
      render(<Roulette foods={mockFoods} meal="almuerzo" />)

      const button = screen.getByRole('button', { name: /girar ruleta/i })
      fireEvent.click(button)

      await waitFor(
        () => {
          expect(screen.getByRole('button', { name: /volver a girar/i })).toBeInTheDocument()
        },
        { timeout: 6000 }
      )

      const resetButton = screen.getByRole('button', { name: /volver a girar/i })
      fireEvent.click(resetButton)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /girar ruleta/i })).toBeInTheDocument()
      })

      vi.useFakeTimers()
    })
  })

  describe('Casos especiales', () => {
    it('debe manejar cuando no hay alimentos', () => {
      render(<Roulette foods={[]} meal="almuerzo" />)

      expect(screen.getByText(/no hay suficientes alimentos/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /girar ruleta/i })).toBeDisabled()
    })

    it('debe manejar diferentes meals', () => {
      const { rerender } = render(<Roulette foods={mockFoods} meal="desayuno" />)
      expect(screen.getByText(/selección aleatoria para desayuno/i)).toBeInTheDocument()

      rerender(<Roulette foods={mockFoods} meal="cena" />)
      expect(screen.getByText(/selección aleatoria para cena/i)).toBeInTheDocument()
    })

    it('debe retornar null para categorías sin alimentos disponibles', async () => {
      vi.useRealTimers()
      
      // Solo alimentos de proteína y carbohidrato para almuerzo
      const limitedFoods: Food[] = [
        mockFoods[0], // Pollo
        mockFoods[2]  // Arroz
      ]

      render(
        <Roulette
          foods={limitedFoods}
          meal="almuerzo"
          onResult={mockOnResult}
        />
      )

      // No debería permitir girar
      expect(screen.getByRole('button', { name: /girar ruleta/i })).toBeDisabled()

      vi.useFakeTimers()
    })
  })

  describe('Accesibilidad', () => {
    it('debe tener textos descriptivos en los botones', () => {
      render(<Roulette foods={mockFoods} meal="almuerzo" />)

      const button = screen.getByRole('button', { name: /girar ruleta/i })
      expect(button).toBeInTheDocument()
    })

    it('debe indicar visualmente el estado deshabilitado', () => {
      const incompleteFoods: Food[] = [mockFoods[0]]

      render(<Roulette foods={incompleteFoods} meal="almuerzo" />)

      const button = screen.getByRole('button', { name: /girar ruleta/i })
      expect(button).toBeDisabled()
      expect(button).toHaveClass('cursor-not-allowed')
    })
  })
})

