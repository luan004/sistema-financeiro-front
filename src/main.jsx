import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import moment from 'moment'
import 'moment/locale/pt-br'
import App from './App.jsx'

moment.locale('pt-br')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
