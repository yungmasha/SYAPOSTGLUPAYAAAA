import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/header.jsx'
import Footer from './components/footer.jsx'
import Home from './pages/home.jsx'
import Catalog from './pages/catalog.jsx'
import ProductDetail from './pages/productdetail.jsx'
import Cart from './pages/cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Favorites from './pages/favorites.jsx'
import Login from './pages/login.jsx'
import Register from './pages/register.jsx'
import Contacts from './pages/contacts.jsx'
import About from './pages/About'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
