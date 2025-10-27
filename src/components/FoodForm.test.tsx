import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FoodForm } from './FoodForm'
import type { Food, CreateFood } from '../types'

describe('FoodForm', () => {
  const mockOnSave = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    mockOnSave.mockClear()
    mockOnCancel.mockClear()
  })

  describe('Renderizado', () => {
    it('debe renderizar el formulario con todos los campos', () => {
      render(<FoodForm onSave={mockOnSave} />)

      // Verificar campos
      expect(screen.getByLabelText(/nombre del alimento/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/categoría/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/cantidad/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/unidad/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/notas/i)).toBeInTheDocument()

      // Verificar checkboxes de comidas
      expect(screen.getByText(/desayuno/i)).toBeInTheDocument()
      expect(screen.getByText(/almuerzo/i)).toBeInTheDocument()
      expect(screen.getByText(/cena/i)).toBeInTheDocument()

      // Verificar botón
      expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument()
    })

    it('debe mostrar título "Nuevo Alimento" en modo creación', () => {
      render(<FoodForm onSave={mockOnSave} />)
      expect(screen.getByText('Nuevo Alimento')).toBeInTheDocument()
    })

    it('debe mostrar título "Editar Alimento" en modo edición', () => {
      const food: Food = {
        id: '1',
        name: 'Pollo',
        category: 'proteina',
        meals: ['almuerzo'],
        quantity: 200,
        unit: 'gramos'
      }
      render(<FoodForm initialFood={food} onSave={mockOnSave} />)
      expect(screen.getByText('Editar Alimento')).toBeInTheDocument()
    })

    it('debe renderizar botón de cancelar si se proporciona onCancel', () => {
      render(<FoodForm onSave={mockOnSave} onCancel={mockOnCancel} />)
      expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
    })

    it('no debe renderizar botón de cancelar si no se proporciona onCancel', () => {
      render(<FoodForm onSave={mockOnSave} />)
      expect(screen.queryByRole('button', { name: /cancelar/i })).not.toBeInTheDocument()
    })
  })

  describe('Valores iniciales', () => {
    it('debe cargar datos del alimento al editar', () => {
      const food: Food = {
        id: '1',
        name: 'Pechuga de Pollo',
        category: 'proteina',
        meals: ['almuerzo', 'cena'],
        quantity: 200,
        unit: 'gramos',
        notes: 'Alto en proteína'
      }

      render(<FoodForm initialFood={food} onSave={mockOnSave} />)

      expect(screen.getByDisplayValue('Pechuga de Pollo')).toBeInTheDocument()
      const categorySelect = screen.getByLabelText(/categoría/i) as HTMLSelectElement
      expect(categorySelect.value).toBe('proteina')
      expect(screen.getByDisplayValue('200')).toBeInTheDocument()
      expect(screen.getByDisplayValue('gramos')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Alto en proteína')).toBeInTheDocument()
    })

    it('debe tener los valores por defecto correctos en modo creación', () => {
      render(<FoodForm onSave={mockOnSave} />)

      const nameInput = screen.getByLabelText(/nombre del alimento/i) as HTMLInputElement
      const categorySelect = screen.getByLabelText(/categoría/i) as HTMLSelectElement
      const quantityInput = screen.getByLabelText(/cantidad/i) as HTMLInputElement
      const unitSelect = screen.getByLabelText(/unidad/i) as HTMLSelectElement

      expect(nameInput.value).toBe('')
      expect(categorySelect.value).toBe('proteina')
      expect(quantityInput.value).toBe('0')
      expect(unitSelect.value).toBe('gramos')
    })
  })

  describe('Validación', () => {
    it('debe mostrar error si el nombre está vacío al hacer submit', async () => {
      render(<FoodForm onSave={mockOnSave} />)

      const submitButton = screen.getByRole('button', { name: /guardar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('El nombre es requerido')).toBeInTheDocument()
      })

      expect(mockOnSave).not.toHaveBeenCalled()
    })

    it('debe tener campo de cantidad', () => {
      render(<FoodForm onSave={mockOnSave} />)

      const quantityInput = screen.getByLabelText(/cantidad/i)
      expect(quantityInput).toBeInTheDocument()
      expect(quantityInput).toHaveAttribute('type', 'number')
    })

    it('debe tener validación en campo de nombre', async () => {
      const user = userEvent.setup()
      render(<FoodForm onSave={mockOnSave} />)

      const nameInput = screen.getByLabelText(/nombre del alimento/i)
      expect(nameInput).toBeInTheDocument()
      
      // Intentar submit sin nombre
      await user.click(screen.getByRole('button', { name: /guardar/i }))
      
      // No debe llamar onSave si hay errores de validación
      expect(mockOnSave).not.toHaveBeenCalled()
    })

    it('debe permitir cantidad igual a 0', async () => {
      const user = userEvent.setup()
      render(<FoodForm onSave={mockOnSave} />)

      const nameInput = screen.getByLabelText(/nombre del alimento/i)
      await user.type(nameInput, 'Agua')

      const quantityInput = screen.getByLabelText(/cantidad/i)
      expect(quantityInput).toHaveValue(0)

      const submitButton = screen.getByRole('button', { name: /guardar/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalled()
      })
    })
  })

  describe('Interacción con campos', () => {
    it('debe actualizar el campo de nombre', async () => {
      const user = userEvent.setup()
      render(<FoodForm onSave={mockOnSave} />)

      const nameInput = screen.getByLabelText(/nombre del alimento/i)
      await user.type(nameInput, 'Salmón')

      expect(nameInput).toHaveValue('Salmón')
    })

    it('debe cambiar la categoría', async () => {
      const user = userEvent.setup()
      render(<FoodForm onSave={mockOnSave} />)

      const categorySelect = screen.getByLabelText(/categoría/i)
      await user.selectOptions(categorySelect, 'carbohidrato')

      expect(categorySelect).toHaveValue('carbohidrato')
    })

    it('debe marcar y desmarcar checkboxes de comidas', async () => {
      const user = userEvent.setup()
      render(<FoodForm onSave={mockOnSave} />)

      const desayunoCheckbox = screen.getByRole('checkbox', { name: /desayuno/i })
      const almuerzocheckbox = screen.getByRole('checkbox', { name: /almuerzo/i })

      // Marcar
      await user.click(desayunoCheckbox)
      expect(desayunoCheckbox).toBeChecked()

      await user.click(almuerzocheckbox)
      expect(almuerzocheckbox).toBeChecked()

      // Desmarcar
      await user.click(desayunoCheckbox)
      expect(desayunoCheckbox).not.toBeChecked()
    })

    it('debe actualizar la cantidad', async () => {
      const user = userEvent.setup()
      render(<FoodForm onSave={mockOnSave} />)

      const quantityInput = screen.getByLabelText(/cantidad/i)
      await user.clear(quantityInput)
      await user.type(quantityInput, '150')

      expect(quantityInput).toHaveValue(150)
    })

    it('debe cambiar la unidad', async () => {
      const user = userEvent.setup()
      render(<FoodForm onSave={mockOnSave} />)

      const unitSelect = screen.getByLabelText(/unidad/i)
      await user.selectOptions(unitSelect, 'kilogramos')

      expect(unitSelect).toHaveValue('kilogramos')
    })

    it('debe actualizar las notas', async () => {
      const user = userEvent.setup()
      render(<FoodForm onSave={mockOnSave} />)

      const notesTextarea = screen.getByLabelText(/notas/i)
      await user.type(notesTextarea, 'Nota de prueba')

      expect(notesTextarea).toHaveValue('Nota de prueba')
    })
  })

  describe('Submit del formulario', () => {
    it('debe llamar onSave con los datos correctos en modo creación', async () => {
      const user = userEvent.setup()
      render(<FoodForm onSave={mockOnSave} />)

      // Llenar formulario
      await user.type(screen.getByLabelText(/nombre del alimento/i), 'Arroz')
      await user.selectOptions(screen.getByLabelText(/categoría/i), 'carbohidrato')
      await user.click(screen.getByRole('checkbox', { name: /almuerzo/i }))
      await user.clear(screen.getByLabelText(/cantidad/i))
      await user.type(screen.getByLabelText(/cantidad/i), '100')
      await user.selectOptions(screen.getByLabelText(/unidad/i), 'gramos')
      await user.type(screen.getByLabelText(/notas/i), 'Arroz integral')

      // Submit
      await user.click(screen.getByRole('button', { name: /guardar/i }))

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledTimes(1)
      })

      const savedData = mockOnSave.mock.calls[0][0] as CreateFood
      expect(savedData.name).toBe('Arroz')
      expect(savedData.category).toBe('carbohidrato')
      expect(savedData.meals).toContain('almuerzo')
      expect(savedData.quantity).toBe(100)
      expect(savedData.unit).toBe('gramos')
      expect(savedData.notes).toBe('Arroz integral')
    })

    it('debe llamar onSave con ID al editar', async () => {
      const user = userEvent.setup()
      const food: Food = {
        id: 'food-123',
        name: 'Pollo',
        category: 'proteina',
        meals: ['almuerzo'],
        quantity: 200,
        unit: 'gramos'
      }

      render(<FoodForm initialFood={food} onSave={mockOnSave} />)

      // Modificar nombre
      const nameInput = screen.getByLabelText(/nombre del alimento/i)
      await user.clear(nameInput)
      await user.type(nameInput, 'Pechuga de Pollo')

      // Submit
      await user.click(screen.getByRole('button', { name: /guardar/i }))

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledTimes(1)
      })

      const savedData = mockOnSave.mock.calls[0][0] as Food
      expect(savedData.id).toBe('food-123')
      expect(savedData.name).toBe('Pechuga de Pollo')
    })

    it('debe permitir crear alimento con múltiples comidas', async () => {
      const user = userEvent.setup()
      render(<FoodForm onSave={mockOnSave} />)

      await user.type(screen.getByLabelText(/nombre del alimento/i), 'Huevo')
      await user.click(screen.getByRole('checkbox', { name: /desayuno/i }))
      await user.click(screen.getByRole('checkbox', { name: /almuerzo/i }))
      await user.click(screen.getByRole('checkbox', { name: /cena/i }))

      await user.click(screen.getByRole('button', { name: /guardar/i }))

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalled()
      })

      const savedData = mockOnSave.mock.calls[0][0] as CreateFood
      expect(savedData.meals).toHaveLength(3)
      expect(savedData.meals).toContain('desayuno')
      expect(savedData.meals).toContain('almuerzo')
      expect(savedData.meals).toContain('cena')
    })

    it('debe permitir crear alimento sin comidas seleccionadas', async () => {
      const user = userEvent.setup()
      render(<FoodForm onSave={mockOnSave} />)

      await user.type(screen.getByLabelText(/nombre del alimento/i), 'Snack')

      await user.click(screen.getByRole('button', { name: /guardar/i }))

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalled()
      })

      const savedData = mockOnSave.mock.calls[0][0] as CreateFood
      expect(savedData.meals).toHaveLength(0)
    })
  })

  describe('Botón cancelar', () => {
    it('debe llamar onCancel al hacer click en cancelar', async () => {
      const user = userEvent.setup()
      render(<FoodForm onSave={mockOnSave} onCancel={mockOnCancel} />)

      const cancelButton = screen.getByRole('button', { name: /cancelar/i })
      await user.click(cancelButton)

      expect(mockOnCancel).toHaveBeenCalledTimes(1)
      expect(mockOnSave).not.toHaveBeenCalled()
    })
  })

  describe('Personalización', () => {
    it('debe mostrar texto personalizado en el botón de submit', () => {
      render(<FoodForm onSave={mockOnSave} submitButtonText="Crear Alimento" />)
      expect(screen.getByRole('button', { name: 'Crear Alimento' })).toBeInTheDocument()
    })
  })

  describe('Accesibilidad', () => {
    it('debe tener labels asociados a los inputs', () => {
      render(<FoodForm onSave={mockOnSave} />)

      expect(screen.getByLabelText(/nombre del alimento/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/categoría/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/cantidad/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/unidad/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/notas/i)).toBeInTheDocument()
    })

    it('debe marcar campos requeridos con asterisco', () => {
      render(<FoodForm onSave={mockOnSave} />)

      const nameLabel = screen.getByText(/nombre del alimento/i).parentElement
      const quantityLabel = screen.getByText(/cantidad/i).parentElement

      expect(nameLabel?.textContent).toContain('*')
      expect(quantityLabel?.textContent).toContain('*')
    })
  })
})

