import { AppSidebar } from "@/components/app-sidebar"
import { AccountCard } from "@/components/common/card"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Plus } from "lucide-react"

export default function CalendarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset className="pt-[--header-height]">
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider >
    </div >
  )
}
