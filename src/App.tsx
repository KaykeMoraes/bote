import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Login } from './pages/Login'
import { Register } from './pages/Register'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/register" Component={Register} />
          <Route path="/login" Component={Login} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
