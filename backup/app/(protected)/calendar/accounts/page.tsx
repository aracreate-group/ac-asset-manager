"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { Calendars } from "@/components/calendars"
import { AccountCard } from "@/components/common/card"
import { CalendarSidebar } from "@/components/dashboard/nav-calendar"
import { DatePicker } from "@/components/date-picker"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { SidebarGroupLabel, SidebarInset, SidebarProvider, SidebarSeparator, useSidebar } from "@/components/ui/sidebar"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

const data1 = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  calendars: [
    {
      name: "gowtham@aracreate.com",
      items: ["Personal", "Work", "Family"],
    }
  ],
}
const data2 = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  calendars: [
    {
      name: "gowthamselvam809@gmail.com",
      items: ["Personal", "Work", "Family"],
    },
    {
      name: "chococookie13247@gmail.com",
      items: ["Holidays", "Birthdays"],
    },
    {
      name: "gowtham@aracreate.com",
      items: ["Travel", "Reminders", "Deadlines"],
    },
  ],
}

export default function Page() {
  const { open } = useSidebar();
  return (
    <div className="flex flex-1 flex-col lg:flex-row gap-4 ">

      <div
        className={`w-full lg:overflow-y-auto lg:w-96 ${open ? "lg:ml-[--sidebar-width]" : "lg:ml-[--sidebar-width-icon]"
          } lg:fixed lg:left-0 lg:top-[--header-height] lg:!h-[calc(100svh-var(--header-height))] shadow-lg p-4 transition-all duration-300`}
      >
        <div className="w-full flex flex-col">
          {/* <h1 className="font-bold text-2xl pt-3">Calendar Overview</h1> */}
          <DatePicker />
        </div>
        <SidebarGroupLabel className="text-sm">Target Calendar</SidebarGroupLabel>
        <SidebarSeparator className="mx-0" />
        <Calendars calendars={data1.calendars} />
        <SidebarGroupLabel className="text-sm">Source Calendar</SidebarGroupLabel>
        <SidebarSeparator className="mx-0" />
        <Calendars calendars={data2.calendars} />
      </div>

      <div className="flex flex-1 flex-col gap-4 lg:ml-96 overflow-y-auto p-4">
        <div className="grid auto-rows-min gap-4 lg:grid-cols-2">
          <div className="flex flex-col flex-start gap-3 rounded-xl bg-muted/50 p-4">
            <div className="flex justify-between">
              <h1 className="font-bold text-xl">Events</h1>
              <div className="flex gap-2 items-center">
                <Button className="p-2" variant={"outline"}>
                  <ChevronLeft />
                </Button>
                <Button variant={"ghost"}>7 March</Button>
                <Button className="p-2" variant={"outline"}>
                  <ChevronRight />
                </Button>
              </div>
            </div>

            {[...Array(10)].map((_, i) => (
              <Button key={i} className="text-md flex flex-row justify-start gap-5 border-0 " variant={"outline"}>
                <span>19:02</span>
                <p>Event {i + 1}</p>
              </Button>
            ))}
          </div>
          <div className="aspect-video rounded-xl bg-muted/50 p-4">
            <h1 className="font-bold text-xl">Recent Activity</h1>

          </div>
        </div>
      </div>
    </div>
  );
}

