"use client"
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarInset,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Image as ImageIcon,
} from "lucide-react"
import { Logo } from "@/components/logo"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SheetTitle } from "@/components/ui/sheet"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SheetTitle className="sr-only">Admin Menu</SheetTitle>
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
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          {/* User profile section can go here */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex justify-between items-center p-4 border-b">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </div>
        <div className="p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
