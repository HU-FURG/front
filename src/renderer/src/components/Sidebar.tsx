/* eslint-disable prettier/prettier */
import { CalendarDays, Cog, House, LayoutDashboard } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onNavigate: (page: 'scheduling' | 'rooms' | 'login' | 'dashboard') => void
}

function Sidebar({ isOpen, onNavigate }: SidebarProps): React.JSX.Element {
  return (
    <aside
      className={`max-w-16 bg-white border-r transition-all duration-500 ease-in-out 
      ${isOpen ? 'w-16 opacity-100' : 'w-0 opacity-0'}`}
    >
      <ul className="w-full flex flex-col items-center">
        <li
          className="hover:bg-slate-200 p-3 cursor-pointer"
          onClick={() => onNavigate('scheduling')}
          title="Agendamento"
        >
          <CalendarDays className="text-blue-500" />
        </li>
        <li
          className="hover:bg-slate-200 p-3 cursor-pointer"
          onClick={() => onNavigate('rooms')}
          title="Salas"
        >
          <House className="text-blue-500" />
        </li>
        <li
          className="hover:bg-slate-200 p-3 cursor-pointer"
          onClick={() => onNavigate('dashboard')}
          title="Dashboard"
        >
          <LayoutDashboard className="text-blue-500" />
        </li>
        <li
          className="hover:bg-slate-200 p-3 cursor-pointer"
          onClick={() => onNavigate('login')}
          title="Login"
        >
          <Cog className="text-blue-500" />
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar
