import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/header'
import Footer from './components/footer'
import ScrollToTop from './components/ScrollToTop'
import ScrollToTopButton from './components/ScrollToTopButton'
import Home from './pages/home'
import Catalog from './pages/catalog'
import ProductDetail from './pages/productdetail'
import Cart from './pages/cart'
import Checkout from './pages/Checkout'
import Favorites from './pages/favorites'
import Login from './pages/login'
import Register from './pages/register'
import Contacts from './pages/contacts'
import About from './pages/About'
import MyBookings from './pages/my-bookings'
import Compare from './pages/Compare'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app-shell">
        <a href="#main-content" className="skip-link">
          Перейти к содержимому
        </a>
        <Header />
        <main id="main-content" className="app-main" tabIndex={-1}>
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
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <ScrollToTopButton />
      </div>
    </BrowserRouter>
  )
}
