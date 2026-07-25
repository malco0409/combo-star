// main.jsx — yagona kirish nuqtasi
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './store/context/CartContext.jsx'
import './store/i18n.js'
import { initRemote } from './store/data/remote.js'

// Firestore bilan jonli bog'lanishni ilova ochilishida boshlaymiz
initRemote()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </StrictMode>,
)
