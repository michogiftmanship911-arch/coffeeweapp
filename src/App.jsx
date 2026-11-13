import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import AmbientBackground from './components/AmbientBackground'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ToastHost from './components/ToastHost'
import Page from './components/PageTransition'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import About from './pages/About'
import Contact from './pages/Contact'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import { initSmoothScroll, scrollToTop } from './lib/smoothScroll'

export default function App() {
  const location = useLocation()

  useEffect(() => initSmoothScroll(), [])

  return (
    <div className="relative min-h-screen">
      <AmbientBackground />
      <Navbar />
      <main>
        {/* SPA transitions: the old page fades out, scroll resets, the new page fades in */}
        <AnimatePresence mode="wait" onExitComplete={scrollToTop}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Page><Home /></Page>} />
            <Route path="/shop" element={<Page><Shop /></Page>} />
            <Route path="/product/:slug" element={<Page><Product /></Page>} />
            <Route path="/cart" element={<Page><Cart /></Page>} />
            <Route path="/checkout" element={<Page><Checkout /></Page>} />
            <Route path="/about" element={<Page><About /></Page>} />
            <Route path="/contact" element={<Page><Contact /></Page>} />
            <Route path="/auth" element={<Page><Auth /></Page>} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Page><Dashboard /></Page>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Page><NotFound /></Page>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <ToastHost />
    </div>
  )
}
