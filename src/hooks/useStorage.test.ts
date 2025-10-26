import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useStorage } from './useStorage'

describe('useStorage', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear()
  })

  describe('Inicialización', () => {
    it('debe usar el valor inicial cuando localStorage está vacío', () => {
      const { result } = renderHook(() => useStorage('test-key', 'valor inicial'))
      
      expect(result.current[0]).toBe('valor inicial')
    })

    it('debe usar el valor de localStorage si existe', () => {
      localStorage.setItem('test-key', JSON.stringify('valor guardado'))
      
      const { result } = renderHook(() => useStorage('test-key', 'valor inicial'))
      
      expect(result.current[0]).toBe('valor guardado')
    })

    it('debe manejar objetos complejos', () => {
      const objetoComplejo = { nombre: 'Juan', edad: 30, activo: true }
      localStorage.setItem('user', JSON.stringify(objetoComplejo))
      
      const { result } = renderHook(() => useStorage('user', { nombre: '', edad: 0, activo: false }))
      
      expect(result.current[0]).toEqual(objetoComplejo)
    })

    it('debe manejar arrays', () => {
      const array = [1, 2, 3, 4, 5]
      localStorage.setItem('numeros', JSON.stringify(array))
      
      const { result } = renderHook(() => useStorage('numeros', [] as number[]))
      
      expect(result.current[0]).toEqual(array)
    })
  })

  describe('Escritura en localStorage', () => {
    it('debe actualizar el estado y localStorage', () => {
      const { result } = renderHook(() => useStorage('counter', 0))
      
      act(() => {
        result.current[1](10)
      })
      
      expect(result.current[0]).toBe(10)
      expect(localStorage.getItem('counter')).toBe('10')
    })

    it('debe permitir actualizaciones funcionales', () => {
      const { result } = renderHook(() => useStorage('counter', 0))
      
      act(() => {
        result.current[1](5)
      })
      
      act(() => {
        result.current[1]((prev) => prev + 10)
      })
      
      expect(result.current[0]).toBe(15)
      expect(localStorage.getItem('counter')).toBe('15')
    })

    it('debe guardar objetos complejos correctamente', () => {
      const { result } = renderHook(() => 
        useStorage('user', { nombre: '', edad: 0 })
      )
      
      const nuevoUsuario = { nombre: 'María', edad: 25 }
      
      act(() => {
        result.current[1](nuevoUsuario)
      })
      
      expect(result.current[0]).toEqual(nuevoUsuario)
      expect(JSON.parse(localStorage.getItem('user') || '{}')).toEqual(nuevoUsuario)
    })

    it('debe actualizar arrays correctamente', () => {
      const { result } = renderHook(() => useStorage<string[]>('lista', []))
      
      act(() => {
        result.current[1](['item1', 'item2'])
      })
      
      act(() => {
        result.current[1]((prev) => [...prev, 'item3'])
      })
      
      expect(result.current[0]).toEqual(['item1', 'item2', 'item3'])
    })
  })

  describe('Manejo de errores', () => {
    it('debe manejar JSON inválido en localStorage', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      // Guardar datos inválidos en localStorage
      localStorage.setItem('bad-data', 'esto no es JSON válido {')
      
      const { result } = renderHook(() => useStorage('bad-data', 'valor por defecto'))
      
      // Debe usar el valor inicial cuando hay error
      expect(result.current[0]).toBe('valor por defecto')
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockRestore()
    })

    it('debe manejar errores al guardar en localStorage', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      // Simular localStorage lleno
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError')
      })
      
      const { result } = renderHook(() => useStorage('test', 'inicial'))
      
      act(() => {
        result.current[1]('nuevo valor')
      })
      
      // El estado local debe actualizarse aunque localStorage falle
      expect(result.current[0]).toBe('nuevo valor')
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockRestore()
      vi.restoreAllMocks()
    })
  })

  describe('Sincronización entre pestañas', () => {
    it('debe sincronizar cambios desde otras pestañas', async () => {
      const { result } = renderHook(() => useStorage('shared-key', 'valor inicial'))
      
      expect(result.current[0]).toBe('valor inicial')
      
      // Simular cambio desde otra pestaña
      act(() => {
        const storageEvent = new StorageEvent('storage', {
          key: 'shared-key',
          newValue: JSON.stringify('valor desde otra pestaña'),
          oldValue: JSON.stringify('valor inicial'),
          storageArea: localStorage,
        })
        window.dispatchEvent(storageEvent)
      })
      
      await waitFor(() => {
        expect(result.current[0]).toBe('valor desde otra pestaña')
      })
    })

    it('debe ignorar cambios de otras claves', async () => {
      const { result } = renderHook(() => useStorage('my-key', 'mi valor'))
      
      const valorInicial = result.current[0]
      
      // Simular cambio de una clave diferente
      act(() => {
        const storageEvent = new StorageEvent('storage', {
          key: 'otra-key',
          newValue: JSON.stringify('otro valor'),
          storageArea: localStorage,
        })
        window.dispatchEvent(storageEvent)
      })
      
      // El valor no debe cambiar
      expect(result.current[0]).toBe(valorInicial)
    })
  })

  describe('Tipos TypeScript', () => {
    it('debe inferir tipos correctamente para primitivos', () => {
      const { result } = renderHook(() => useStorage('number', 42))
      
      // TypeScript debe inferir que result.current[0] es number
      const valor: number = result.current[0]
      expect(typeof valor).toBe('number')
    })

    it('debe soportar tipos personalizados', () => {
      interface Usuario {
        id: number
        nombre: string
        email: string
      }
      
      const usuarioInicial: Usuario = {
        id: 1,
        nombre: 'Test',
        email: 'test@example.com'
      }
      
      const { result } = renderHook(() => useStorage<Usuario>('usuario', usuarioInicial))
      
      expect(result.current[0]).toEqual(usuarioInicial)
      
      act(() => {
        result.current[1]({
          id: 2,
          nombre: 'Nuevo Usuario',
          email: 'nuevo@example.com'
        })
      })
      
      expect(result.current[0].id).toBe(2)
    })
  })

  describe('Casos especiales', () => {
    it('debe manejar valores null', () => {
      const { result } = renderHook(() => useStorage<string | null>('nullable', null))
      
      expect(result.current[0]).toBeNull()
      
      act(() => {
        result.current[1]('no null')
      })
      
      expect(result.current[0]).toBe('no null')
    })

    it('debe manejar valores booleanos', () => {
      const { result } = renderHook(() => useStorage('boolean', false))
      
      expect(result.current[0]).toBe(false)
      
      act(() => {
        result.current[1](true)
      })
      
      expect(result.current[0]).toBe(true)
      expect(localStorage.getItem('boolean')).toBe('true')
    })

    it('debe manejar cambios múltiples consecutivos', () => {
      const { result } = renderHook(() => useStorage('multi', 0))
      
      act(() => {
        result.current[1](1)
        result.current[1](2)
        result.current[1](3)
      })
      
      expect(result.current[0]).toBe(3)
    })
  })
})

