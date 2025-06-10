import { AppSidebar } from "@/components/app-sidebar"
import { AccountCard } from "@/components/common/card"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Plus } from "lucide-react"

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex justify-between items-center"><h2 className="text-xl font-bold">Calendar Accounts</h2>        <Button variant={'outline'}><Plus /> Add Account</Button>
      </div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5 min-[2100px]:grid-cols-6">
        <AccountCard />
        <AccountCard />
        <AccountCard />
        <AccountCard />
        <AccountCard />
        {/* <div className=" rounded-xl bg-muted/50" >
      </div>
      <div className="aspect-video rounded-xl bg-muted/50" />
      <div className="aspect-video rounded-xl bg-muted/50" />
      <div className="aspect-video rounded-xl bg-muted/50" >

      </div> */}
      </div>
      {/* <div className="h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> */}
    </div>
  )
}
