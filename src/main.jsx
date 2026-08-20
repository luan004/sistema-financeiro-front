import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import moment from 'moment'
import 'moment/dist/locale/pt-br';
import './index.css'

moment.locale('pt-br')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
