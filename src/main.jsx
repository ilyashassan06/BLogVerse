import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './Context/ThemeContext.jsx'
import { AuthProvider } from './Context/AuthContext.jsx'
import { UserProvider } from './Context/UserNameContext.jsx'

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
  <BrowserRouter>
    <AuthProvider>
       <UserProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
      </UserProvider>
    </AuthProvider>
  </BrowserRouter>
</StrictMode>

)
