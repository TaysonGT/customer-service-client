import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css'
import { AuthProvider } from './context/AuthContext';
import AuthRoutes from './routes/AuthRoutes';
import ProtectedRoutes from './routes/ProtectedRoutes';
import LoginClientPage from './pages/Auth/Client';
import LoginAgentPage from './pages/Auth/Agent';
import DataManagementPage from './pages/DataManagement';
import NewClientPage from './pages/NewClient';
import AdminDashboard from './pages/AdminDashboard';
import ClientPortal from './pages/ClientPortal';
import NotFoundPage from './pages/404/NotFoundPage';
import TicketChat from './features/tickets/TicketChat';
import RedirectRoute from './routes/RedirectRoute';
import ChatSector from './pages/CRM/ChatSector';
import ClientSector from './pages/CRM/ClientSector';
import TicketSector from './pages/CRM/TicketSector';
import KnowledgeSector from './pages/CRM/KnowledgeSector';
import { AdminRole } from './types/types';
import TicketPage from './features/tickets/TicketPage';
import ProfilePage from './pages/Profile';

function App() {
  return (
    <>
      <AuthProvider>
      <BrowserRouter>
      <Toaster position='top-left' containerStyle={
        { zIndex: 9999, marginTop: '80px', userSelect: "none"} 
      }/>
        <Routes>
          <Route path='/' element={<RedirectRoute />} />
          <Route path='/profile' element={<ProtectedRoutes roles={[...Object.values(AdminRole), 'client']} />} >
            <Route path='/profile/:userId' element={<ProfilePage />} />
          </Route>
          <Route path='/support' element={<ProtectedRoutes roles={[...Object.values(AdminRole)]}/>}>
            <Route index element={<AdminDashboard />}/>
            <Route path='/support/chats' element={<ChatSector />}/>
            <Route path='/support/tickets' element={<TicketSector/>}/>
            <Route path='/support/clients' element={<ClientSector />}/>
            <Route path='/support/knowledge' element={<KnowledgeSector />}/>
            <Route path='/support/my-data' element={<DataManagementPage />}/>
            <Route path='/support/new-client' element={<NewClientPage />}/>
          </Route>
          <Route path='/client' element={<ProtectedRoutes roles={['client']}/>}>
            <Route index element={<ClientPortal />}/>
          </Route>
          <Route path='/tickets' element={<ProtectedRoutes roles={[...Object.values(AdminRole), 'client']}/>}>
            <Route path=':ticketId' element={<TicketPage withHeader/>}/>
            <Route path=':ticketId/chat' element={<TicketChat withHeader/>}/>
          </Route>
          <Route path='/auth' element={<AuthRoutes/>}>
            <Route index path='/auth/login/client' element={<LoginClientPage />}/>
            <Route path='/auth/login/support' element={<LoginAgentPage />}/>
          </Route>
          <Route path='*' element={<NotFoundPage />}/>
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
