import { useStorage } from '../hooks/useStorage'

interface FormData {
  nombre: string
  email: string
  preferencias: string[]
}

interface StorageDemoProps {
  onBack?: () => void
}

export function StorageDemo({ onBack }: StorageDemoProps = {}) {
  const [formData, setFormData] = useStorage<FormData>('form-data', {
    nombre: '',
    email: '',
    preferencias: []
  })

  const [contador, setContador] = useStorage('contador', 0)

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, nombre: e.target.value }))
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, email: e.target.value }))
  }

  const agregarPreferencia = () => {
    const preferencia = prompt('Ingresa una preferencia:')
    if (preferencia) {
      setFormData(prev => ({
        ...prev,
        preferencias: [...prev.preferencias, preferencia]
      }))
    }
  }

  const limpiarFormulario = () => {
    setFormData({ nombre: '', email: '', preferencias: [] })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              Demo: useStorage Hook
            </h1>
            {onBack && (
              <button
                onClick={onBack}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                ← Volver
              </button>
            )}
          </div>
          <p className="text-gray-600">
            Los datos se persisten automáticamente en localStorage. ¡Recarga la página para ver la magia! ✨
          </p>
        </div>

        {/* Contador Simple */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Contador Persistente</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setContador(c => c - 1)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              -
            </button>
            <span className="text-4xl font-bold text-gray-800 min-w-[100px] text-center">
              {contador}
            </span>
            <button
              onClick={() => setContador(c => c + 1)}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              +
            </button>
            <button
              onClick={() => setContador(0)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Formulario con Objeto Complejo */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Formulario Persistente</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={handleNombreChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingresa tu nombre"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={handleEmailChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferencias
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.preferencias.map((pref, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {pref}
                  </span>
                ))}
              </div>
              <button
                onClick={agregarPreferencia}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                Agregar Preferencia
              </button>
            </div>

            <button
              onClick={limpiarFormulario}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Limpiar Formulario
            </button>
          </div>
        </div>

        {/* Datos Actuales */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Datos en localStorage</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
            {JSON.stringify({ contador, formData }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}

