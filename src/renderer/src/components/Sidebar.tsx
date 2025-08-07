/* eslint-disable prettier/prettier */
import { CalendarDays, Cog, House, LayoutDashboard } from 'lucide-react'
import { Link } from 'react-router-dom'

interface SidebarProps {
  isOpen: boolean
}

function Sidebar({ isOpen }: SidebarProps): React.JSX.Element {
  return (
    <aside className={`max-w-16 bg-white border-r transition-all duration-500 ease-in-out 
      ${isOpen ? 'w-16 opacity-100' : 'w-0 opacity-0'}`}>
      <ul className="w-full flex flex-col items-center">
        <li className='hover:bg-slate-200 p-3'>
          <Link to="/scheduling" className="text-blue-500"><CalendarDays /></Link>
        </li>
        <li className='hover:bg-slate-200 p-3'>
          <Link to="/rooms" className="text-blue-500"><House /></Link>
        </li>

        <li className='hover:bg-slate-200 p-3'>
          <Link to="/dashboard" className="text-blue-500"><LayoutDashboard /></Link>
        </li>
        <li className='hover:bg-slate-200 p-3'>
          <Link to="/login" className="text-blue-500"><Cog /></Link>
        </li>
        
      </ul>
    </aside>
  )
}

export default Sidebar
