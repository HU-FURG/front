/* eslint-disable prettier/prettier */
import { AlignJustify, UsersRound } from 'lucide-react';

interface NavbarProps {
  toggleSidebar: () => void
}

function Navbar({ toggleSidebar }: NavbarProps): React.JSX.Element {
  return (
    <nav className="flex items-center justify-between px-6 py-2 bg-white text-black shadow-sm shadow-black-200 z-40">
       <button onClick={toggleSidebar} className="text-xl font-bold">
        <AlignJustify />
      </button>
      <div className="user"><UsersRound/></div>
    </nav>
  )
}

export default Navbar
