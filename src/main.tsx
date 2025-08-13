import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App.jsx'
import axios from 'axios'

axios.defaults.withCredentials = true
axios.defaults.baseURL = '/api' // Adjust the base URL as needed{
    
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <StrictMode>
      <App />
  </StrictMode>,
)
