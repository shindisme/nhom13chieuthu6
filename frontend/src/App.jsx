import UserManage from './pages/UserManage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Layout from './Layout.jsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users-manager" element={<UserManage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
