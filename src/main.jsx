import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './Context/ThemeContext.jsx'
import { AuthProvider } from './Context/AuthContext.jsx'
import { UserProvider } from './Context/UserNameContext.jsx'
import { store } from './features/store.js'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
  <BrowserRouter>
    <AuthProvider>
       <UserProvider>
          <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
      </Provider>
      </UserProvider>
    </AuthProvider>
  </BrowserRouter>
</StrictMode>

)
