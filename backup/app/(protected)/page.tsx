import SpotlightCard from "@/components/animated/spotlight-card"
import StarBorder from "@/components/animated/star-border"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
// import ThemeToggle from "@/components/theme-toggle"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { User2 } from "lucide-react"

export default function Page() {
  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />

          <SidebarInset className="pt-[--header-height]">
            {/* <Aurora
              colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
              speed={0.5}
            /> */}
            {/* <ThemeToggle /> */}
            <div className="flex flex-1 flex-col gap-4 p-4">
              {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3 2xl:grid-cols-4">

                <SpotlightCard className="shadow-md rounded-xl" spotlightColor="rgba(0, 229, 255, 0.2)">
                  <div className="flex gap-3">
                    <div><User2 /> </div>
                    <h4>gowthamselvam809@gmail.com</h4>
                  </div>
                </SpotlightCard>

                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
              </div>
              <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" >
                <StarBorder
                  as="div"
                  className=""
                  color="gray"
                  speed="2s"
                >
                  <div className="rounded-xl w-10 " >
                    <h1>hello</h1>
                  </div>

                </StarBorder></div> */}
              <div className="flex-1 rounded-xl bg-muted/50 p-6 md:min-h-[500px] flex flex-col items-center justify-center">
                <div className="text-center max-w-md mx-auto">
                  <h2 className="text-2xl font-bold mb-4">Dashboard Under Construction</h2>
                  <p className="text-muted-foreground mb-8">
                    We're working hard to build an amazing dashboard experience for you.
                    Please check back soon for updates.
                  </p>

                  {/* Construction animation with StarBorder */}
                  <div className="relative w-full max-w-sm mx-auto h-48 mb-8">
                    <StarBorder
                      as="div"
                      className="absolute inset-0"
                      color="gray"
                      speed="3s"
                    >
                      <div className="h-full w-full flex items-center justify-center">
                        <div className="relative">
                          {/* Simple construction icon */}
                          <div className="w-16 h-16 border-4 border-primary rounded-full flex items-center justify-center">
                            <div className="w-8 h-8 bg-primary/20 rounded-full animate-ping"></div>
                          </div>
                          <div className="absolute top-0 right-0 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </StarBorder>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Coming Soon: Calander tracking, project management, and many team collaboration tools
                  </p>
                </div>
              </div>
            </div>


          </SidebarInset>
        </div>
      </SidebarProvider >
    </div >
  )
}

