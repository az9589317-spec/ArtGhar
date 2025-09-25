
"use client"
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Image as ImageIcon,
  Receipt,
  Package,
  Database,
  Share2,
} from "lucide-react"
import { Logo } from "@/components/logo"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user } = useUser()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
            <SidebarHeader>
              <Logo />
            </SidebarHeader>
            <SidebarContent>
              <ScrollArea className="h-full">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/admin"}
                      tooltip="Dashboard"
                    >
                      <Link href="/admin">
                        <LayoutDashboard />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith("/admin/orders")}
                      tooltip="Orders"
                    >
                      <Link href="/admin/orders">
                        <Package />
                        <span>Orders</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith("/admin/sales")}
                      tooltip="Sales"
                    >
                      <Link href="/admin/sales">
                        <Receipt />
                        <span>Sales</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith("/admin/products")}
                      tooltip="Products"
                    >
                      <Link href="/admin/products">
                        <ShoppingBag />
                        <span>Products</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith("/admin/artists")}
                      tooltip="Artists"
                    >
                      <Link href="/admin/artists">
                        <Users />
                        <span>Artists</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith("/admin/slider")}
                      tooltip="Homepage Slider"
                    >
                      <Link href="/admin/slider">
                        <ImageIcon />
                        <span>Homepage Slider</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith("/admin/social")}
                      tooltip="Social Media"
                    >
                      <Link href="/admin/social">
                        <Share2 />
                        <span>Social Media</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith("/admin/data")}
                      tooltip="Data Management"
                    >
                      <Link href="/admin/data">
                        <Database />
                        <span>Data</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </ScrollArea>
            </SidebarContent>
            <SidebarFooter>
                {user && (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                            <AvatarFallback>
                                {user.displayName?.charAt(0) || <Users className="h-4 w-4" />}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-sm overflow-hidden">
                            <span className="font-semibold text-sidebar-foreground truncate">{user.displayName}</span>
                            <span className="text-muted-foreground text-xs truncate">{user.email}</span>
                        </div>
                    </div>
                )}
            </SidebarFooter>
        </Sidebar>
        <div className="flex-1 flex flex-col">
            <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 sticky top-0 bg-background z-10">
                <SidebarTrigger className="md:hidden" />
                <div className="flex-1">
                    <h1 className="text-xl font-semibold">Admin Dashboard</h1>
                </div>
            </header>
            <main className="flex-1 p-6 overflow-auto bg-muted/40">
                {children}
            </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
