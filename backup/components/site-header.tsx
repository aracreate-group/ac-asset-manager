"use client"

import { Plus, SidebarIcon } from "lucide-react"

import { SearchForm } from "@/components/search-form"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"

declare global {
  interface Window {
    electron?: any;
  }
}

export function SiteHeader({ isCalendar }: { isCalendar?: boolean }) {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="flex fixed top-0 z-50 w-full items-center border-b bg-background dragger" >
      <div className="flex h-[--header-height] w-full items-center gap-2 px-4 dragger">
        <Button
          className={`h-8 w-8 ${window && window.electron ? 'ms-20' : ''}  child-no-drag`}
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4 child-no-drag" />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList className="child-no-drag">
            <BreadcrumbItem>
              <BreadcrumbLink href="#">
                Building Your Application
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <SearchForm className="w-full sm:ml-auto sm:w-auto child-no-drag" />
      </div>
    </header>
  )
}
