/* eslint-disable prettier/prettier */
import { Routes, Route } from 'react-router-dom'
import Scheduling from '@renderer/routers/Scheduling'
import Rooms from '@renderer/routers/Rooms'
import Login from '@renderer/routers/Login'
import Dashboard from '@renderer/routers/Dashboard'

function Main(): React.JSX.Element {
  return (
    <main className="flex-1 p-1 bg-gray-50 min-h-full">
      <Routes>
        <Route path="/scheduling" element={<Scheduling />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<div>Selecione uma opção no menu.</div>} />
      </Routes>
    </main>
  )
}

export default Main
