import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Login } from '../pages/Login'
import { Register } from '../pages/Register'
import { ProtectedRoutes } from './ProtectedRoutes'
import { Notes } from '../pages/Notes'

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Notes />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/notes"
          element={
            <ProtectedRoutes>
              <Notes />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
