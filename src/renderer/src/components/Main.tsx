/* eslint-disable prettier/prettier */
import { ReactElement } from 'react'
import Scheduling from '@renderer/routers/Scheduling'
import Rooms from '@renderer/routers/Rooms'
import Dashboard from '@renderer/routers/Dashboard'
import Accounts from '@renderer/routers/Account'
import Home from '@renderer/routers/Home'
import Reservations from '@renderer/routers/Reservations'

type Page = 'scheduling' | 'rooms' | 'dashboard' | 'home' | 'accounts' | 'reservations'

interface MainProps {
  page: Page
}

function Main({ page }: MainProps): React.JSX.Element {

  function renderPage(): ReactElement {
    switch (page) {
      case 'scheduling':
        return <Scheduling />
      case 'home':
        return <Home />
      case 'rooms':
        return <Rooms />
      case 'dashboard':
        return <Dashboard />
      case 'accounts':
        return <Accounts />
      case 'reservations':
        return <Reservations />
      default:
        return <div>Selecione uma opção no menu.</div>
    }
  }

  return (
    <main className="flex-1 bg-gray-50 min-h-full flex justify-center">
      <div className="flex-1 p-4 max-w-[1270px]">{renderPage()}</div>
    </main>
  )
}

export default Main

