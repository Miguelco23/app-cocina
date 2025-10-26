import { useState } from 'react'
import { Home } from './components/Home'
import { StorageDemo } from './components/StorageDemo'
import { FoodFormExample } from './components/FoodFormExample'
import { RouletteExample } from './components/RouletteExample'

type View = 'home' | 'storage-demo' | 'food-form-demo' | 'roulette-demo'

function App() {
  const [currentView, setCurrentView] = useState<View>('home')

  if (currentView === 'storage-demo') {
    return <StorageDemo onBack={() => setCurrentView('home')} />
  }

  if (currentView === 'food-form-demo') {
    return <FoodFormExample />
  }

  if (currentView === 'roulette-demo') {
    return <RouletteExample />
  }

  // Vista principal usando Home
  return <Home />
}

export default App

