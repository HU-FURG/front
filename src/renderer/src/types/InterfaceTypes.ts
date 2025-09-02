/* eslint-disable prettier/prettier */
import { Page } from "./globalType"


export interface SidebarProps {
  handleLogout: () => void
  onNavigate: (page: Page) => void
  activePage: Page
}