import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css'
import { AuthProvider } from './context/AuthContext';
import AuthRoutes from './routes/AuthRoutes';
import ProtectedRoutes from './routes/ProtectedRoutes';
import HomePage from './pages/Home/update';
import LoginClientPage from './pages/Auth/Client';
import LoginAgentPage from './pages/Auth/Agent';
import DataManagementPage from './pages/DataManagement';
import NewClientPage from './pages/NewClient';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <>
      <AuthProvider>
      <BrowserRouter>
      <Toaster position='top-left' containerStyle={
        { zIndex: 9999, marginTop: '80px', userSelect: "none"} 
      }/>
        <Routes>
          <Route path='/' element={<ProtectedRoutes roles={['admin', 'support', 'client']}/>}>
            <Route index path='/' element={<AdminDashboard />}/>
            <Route index path='/agents' element={<HomePage />}/>
            <Route index path='/my-data' element={<DataManagementPage />}/>
            <Route index path='/new-client' element={<NewClientPage />}/>
          </Route>
          <Route path='/auth' element={<AuthRoutes/>}>
            <Route index path='/auth/login/client' element={<LoginClientPage />}/>
            <Route path='/auth/login/support' element={<LoginAgentPage />}/>
          </Route>
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
