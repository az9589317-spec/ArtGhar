
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
  SidebarInset,
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
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
          </SidebarContent>
          <SidebarFooter>
            {/* User profile section can go here */}
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
            <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 sticky top-0 bg-background z-10">
                <SidebarTrigger className="md:hidden" />
                <div className="flex-1">
                    <h1 className="text-xl font-semibold">Admin Dashboard</h1>
                </div>
            </header>
            <main className="flex-1 p-6 overflow-auto">
                {children}
            </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
