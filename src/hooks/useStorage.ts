import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react'

/**
 * Hook personalizado para persistir estado en localStorage
 * @template T - Tipo del valor a almacenar
 * @param {string} key - Clave para localStorage
 * @param {T} initialValue - Valor inicial si no existe en localStorage
 * @returns {[T, Dispatch<SetStateAction<T>>]} - Estado y función para actualizarlo
 */
export function useStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  // Función para obtener el valor inicial desde localStorage
  const getStoredValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      
      if (item === null) {
        return initialValue
      }

      // Intentar parsear el valor almacenado
      return JSON.parse(item) as T
    } catch (error) {
      console.error(`Error al leer del localStorage con la clave "${key}":`, error)
      return initialValue
    }
  }, [key, initialValue])

  // Estado local inicializado con el valor de localStorage
  const [storedValue, setStoredValue] = useState<T>(getStoredValue)

  // Función para actualizar el estado y localStorage
  const setValue: Dispatch<SetStateAction<T>> = useCallback(
    (value: SetStateAction<T>) => {
      try {
        // Permitir que value sea una función como en useState
        const valueToStore = value instanceof Function ? value(storedValue) : value

        // Actualizar estado local
        setStoredValue(valueToStore)

        // Guardar en localStorage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.error(`Error al guardar en localStorage con la clave "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  // Sincronizar con cambios en localStorage desde otras pestañas/ventanas
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue) as T)
        } catch (error) {
          console.error(`Error al sincronizar localStorage para la clave "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [key])

  return [storedValue, setValue]
}

