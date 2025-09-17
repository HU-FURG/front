/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
// Icones
import { CalendarDays, ClipboardList, Home, Users, LayoutDashboard, Key, UsersRound, LogOut, ChevronRight } from "lucide-react"
// React
import { useState, useRef, useEffect } from 'react'
// extra
import logo from '../assets/logo.png';
import AppInfo from './AppInfo';
// Types
import { SidebarProps } from '@renderer/types/InterfaceTypes';
import { Page } from '@renderer/types/globalType';


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

  const getItemClass = (pageName: Page) =>
    `px-3 py-2 my-2 flex w-[95%] mx-auto cursor-pointer items-center  ${
      activePage === pageName
        ? 'bg-gray-300 text-black'
        : 'hover:bg-gray-200 hover:-gray-50 text-black'
    }`

  return (
    <aside className="max-w-44 bg-gray-100 border-r border-gray-200 w-48 h-full flex flex-col justify-between">
      {/* Logo */}
      <div>
        <div className="p-3">
          <img src={logo} className='h-[100px] mx-auto' alt="hu-furg" />
        </div>

        {/* Menu */}
        <ul className="w-full flex flex-col">
          <li className={getItemClass('home')} onClick={() => onNavigate('home')} title="Home">
            <Home className="mr-2 w-[17px]" /> <span>Home</span>
          </li>
          <li className={getItemClass('scheduling')} onClick={() => onNavigate('scheduling')} title="Agendar">
            <CalendarDays className="mr-2 w-[17px]" /> <span>Agendar</span>
          </li>
          <li className={getItemClass('reservations')} onClick={() => onNavigate('reservations')} title="Reservas">
            <ClipboardList className="mr-2 w-[17px]" /> <span>Reservas</span>
          </li>
          <li className={getItemClass('rooms')} onClick={() => onNavigate('rooms')} title="Salas">
            <Users className="mr-2 w-[17px]" /> <span>Salas</span>
          </li>
          <li className={getItemClass('dashboard')} onClick={() => onNavigate('dashboard')} title="Dashboard">
            <LayoutDashboard className="mr-2 w-[17px]" /> <span>Dashboard</span>
          </li>
          <li className={getItemClass('accounts')} onClick={() => onNavigate('accounts')} title="Gerenciar Contas">
            <Key className="mr-2 w-[17px]" /> <span>G.Contas</span>
          </li>
        </ul>
      </div>

      {/* User dropdown */}
      <div className="relative text-black" ref={dropdownRef} onMouseLeave={() => setDropdownOpen(!dropdownOpen)}>
        <div className="border border-gray-200 bg-white relative m-2 rounded" >
          <button
            onMouseEnter={() => setDropdownOpen(!dropdownOpen)}
            
            className="w-full flex justify-center items-center p-2 rounded hover:bg-gray-200 hover:text-gray-600 transition"
          >
            <UsersRound className="mr-2 w-[16px]" />
            <span>Admin</span>
            <ChevronRight className="text-gray-500 ml-8 w-4"/>
          </button>
          {dropdownOpen && (
            <div 
            className="absolute left-full top-0 mb-2 ml-2 w-32 rounded bg-[var(--card)] border border-gray-200 shadow-lg z-50">
              <button
                onClick={handleLogout}
                className="flex justify-around w-full text-left px-3 py-2 hover:bg-gray-100 transition rounded"
              >
                <LogOut/>
                Logout
              </button>
            </div>
          )}
        </div>
        <AppInfo/>
      </div>
    </aside>
  )
}

export default Sidebar
