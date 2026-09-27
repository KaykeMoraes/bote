import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Login } from '../pages/Login'
import { Register } from '../pages/Register'
import { ProtectedRoutes } from './ProtectedRoutes'
import { Home } from '../pages/Home'
import { NotePage } from '../pages/NotePage'

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
        <Route
          path="/notes/new"
          element={
            <ProtectedRoutes>
              <NotePage />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/notes/:noteId"
          element={
            <ProtectedRoutes>
              <NotePage />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
