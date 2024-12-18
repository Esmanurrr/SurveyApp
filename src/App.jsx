import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/navbar/Navbar'
import { AuthProvider } from './contexts/authContext'

function App() {

  return (
    <AuthProvider>
      <Navbar />
      <Outlet/>
    </AuthProvider>
  )
}

export default App
