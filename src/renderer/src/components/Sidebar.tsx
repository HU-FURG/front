/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { CalendarDays, House, LayoutDashboard, UsersRound } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface SidebarProps {
  handleLogout: () => void
  onNavigate: (page: 'scheduling' | 'rooms' | 'dashboard') => void
  activePage: 'scheduling' | 'rooms' | 'dashboard' | 'home'
}

function Sidebar({ handleLogout, onNavigate, activePage }: SidebarProps): React.JSX.Element {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getItemClass = (pageName: 'scheduling' | 'rooms' | 'dashboard') =>
    `px-3 py-2 my-2 flex w-[80%] mx-auto cursor-pointer items-center  ${
      activePage === pageName
        ? 'bg-[var(--sidebar-accent)] text-[var(--sidebar-primary-foreground)]'
        : 'hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-foreground)] text-[var(--sidebar-foreground)]'
    }`

  return (
    <aside className="max-w-44 bg-[var(--sidebar)] border-[var(--sidebar-border)] w-48 h-full flex flex-col justify-between">
      {/* Logo */}
      <div>
        <div className="p-6 border-b border-[var(--sidebar-border)]">
          <h2 className="text-lg font-bold text-[var(--sidebar-foreground)] text-center">HU_FURG</h2>
        </div>

        {/* Menu */}
        <ul className="w-full flex flex-col">
          <li className={getItemClass('scheduling')} onClick={() => onNavigate('scheduling')} title="Agendamento">
            <CalendarDays className="mr-4" /> <span>Reservas</span>
          </li>
          <li className={getItemClass('rooms')} onClick={() => onNavigate('rooms')} title="Salas">
            <House className="mr-4" /> <span>Salas</span>
          </li>
          <li className={getItemClass('dashboard')} onClick={() => onNavigate('dashboard')} title="Dashboard">
            <LayoutDashboard className="mr-4" /> <span>Dashboard</span>
          </li>
        </ul>
      </div>

      {/* User dropdown */}
      <div className="relative border-t border-[var(--sidebar-border)] text-[var(--sidebar-foreground)]" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex justify-center items-center p-3 rounded hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-foreground)] transition"
        >
          <UsersRound className="mr-2" />
          <span>Admin</span>
        </button>

        {dropdownOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-36 bg-[var(--card)] border border-[var(--sidebar-border)] rounded shadow-lg z-50">
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 hover:bg-red-500 hover:text-white transition rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
