import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Login } from '../pages/Login'
import { Register } from '../pages/Register'
import { ProtectedRoutes } from './ProtectedRoutes'
import { Home } from '../pages/Home'

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
