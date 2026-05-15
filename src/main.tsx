import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { CartProvider } from './contexts/cartcontext'
import { BookingProvider } from './contexts/bookingcontext'
import { CompareProvider } from './contexts/comparecontext'
import { FavoritesProvider } from './contexts/favoritescontext'
import { AuthProvider } from './contexts/authcontext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ToastProvider } from './contexts/toastcontext'
import './index.css'

const rootEl = document.getElementById('root')
if (!rootEl) {
  throw new Error('Root element #root not found')
}
ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BookingProvider>
            <CompareProvider>
              <CartProvider>
                <FavoritesProvider>
                  <App />
                </FavoritesProvider>
              </CartProvider>
            </CompareProvider>
          </BookingProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
