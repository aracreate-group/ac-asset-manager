import { Calendar } from "@/components/ui/calendar"
import {
    SidebarGroup,
    SidebarGroupContent,
} from "@/components/ui/sidebar"

export function DatePicker() {
    return (
        <SidebarGroup className="px-0 w-full">
            <SidebarGroupContent className="w-full">
                {/* <Calendar className="[&_[role=gridcell].bg-accent]:bg-sidebar-primary [&_[role=gridcell].bg-accent]:text-sidebar-primary-foreground [&_[role=gridcell]]:w-[33px]" /> */}
                <Calendar className="[&_[role=gridcell].bg-accent]:bg-sidebar-primary [&_[role=gridcell].bg-accent]:text-sidebar-primary-foreground " />
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
