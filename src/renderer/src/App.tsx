import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Main from './components/Main'
import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

function App(): React.JSX.Element {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <Router>
      <div className="flex flex-col h-screen">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex flex-1">
          <Sidebar isOpen={sidebarOpen} />
          <Main />
        </div>
      </div>
    </Router>
  )
}

export default App
