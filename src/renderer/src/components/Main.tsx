/* eslint-disable prettier/prettier */
import { ReactElement } from 'react'
import Scheduling from '@renderer/routers/Scheduling'
import Rooms from '@renderer/routers/Rooms'
import Dashboard from '@renderer/routers/Dashboard'
import Accounts from '@renderer/routers/Account'

type Page = 'scheduling' | 'rooms' | 'dashboard' | 'home' | 'accounts'

interface MainProps {
  page: Page
}

function Main({ page }: MainProps): React.JSX.Element {

  function renderPage(): ReactElement {
    switch (page) {
      case 'scheduling':
        return <Scheduling />
      case 'rooms':
        return <Rooms />
      case 'dashboard':
        return <Dashboard />
      case 'accounts':
        return <Accounts />
      default:
        return <div>Selecione uma opção no menu.</div>
    }
  }

  return (
    <main className="flex-1 p-1 bg-gray-50 min-h-full flex">
      {/* Conteúdo principal */}
      <div className="flex-1 p-4">{renderPage()}</div>
    </main>
  )
}

export default Main

