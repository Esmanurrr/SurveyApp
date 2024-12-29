import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/navbar/Navbar'
import { AuthProvider } from './contexts/authContext'
import { ToastContainer } from 'react-toastify'

function App() {

  return (
    <AuthProvider>
      <Outlet/>
      <ToastContainer />
    </AuthProvider>
  )
}

export default App
