import { ArrowLeftRight, ChevronsUpDown, LayoutDashboard, LogOut, Wallet } from 'lucide-react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { useSession } from '../../context/SessionContext'

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Contas', to: '/accounts', icon: Wallet },
  { label: 'Movimentações', to: '/movements', icon: ArrowLeftRight },
]

function SidebarNavigation() {
  const { pathname } = useLocation()
  const { isMobile, setOpenMobile } = useSidebar()
  const { session, logout } = useSession()
  const navigate = useNavigate()

  const username = (session?.mail || '').split('@')[0] || 'Usuário'

  const isActive = (route) => pathname === route

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="mx-auto flex h-svh w-full max-w-[100rem] overflow-hidden border-x">
      <Sidebar collapsible={isMobile ? 'offcanvas' : 'none'} className={isMobile ? '' : 'border-e'}>
        <SidebarHeader>
          <span className="flex h-9 items-center px-2 text-sm font-semibold">Sistema Financeiro</span>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton className={isActive(item.to) ? 'bg-black': ''} size='lg' asChild isActive={isActive(item.to)}>
                      <NavLink to={item.to} onClick={() => isMobile && setOpenMobile(false)}>
                        <item.icon />
                        <span>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="size-8 rounded-lg">
                      <AvatarImage src={`https://ui-avatars.com/api/?background=random&bold=true&name=${username}`} alt={username} />
                      <AvatarFallback className="rounded-lg">{username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="truncate font-semibold">{username}</span>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side="bottom" sideOffset={4} className="rounded-lg">
                  <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                    <LogOut />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="overflow-hidden">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1 md:hidden" />
          <span className="text-sm font-medium">{navItems.find((item) => item.to === pathname)?.label || ''}</span>
        </header>
        <main className="mx-auto w-full min-h-0 flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </div>
  )
}

export default function AppLayout() {
  return (
    <SidebarProvider>
      <SidebarNavigation />
    </SidebarProvider>
  )
}