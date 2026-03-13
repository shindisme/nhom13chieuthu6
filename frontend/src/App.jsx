import { useState } from 'react'
import UserManage from './pages/UserManage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users-manager" element={<UserManage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
