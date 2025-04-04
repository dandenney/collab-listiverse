import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";

export function AppSidebar() {
  return (
    <Sidebar className="bg-sidebar border-r border-sidebar-border">
      <SidebarContent>
        <SidebarNavigation />
      </SidebarContent>
    </Sidebar>
  );
}