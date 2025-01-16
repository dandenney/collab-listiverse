import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6 overflow-x-hidden">
          <div className="md:hidden mb-4 flex justify-end">
            <Drawer>
              <DrawerTrigger asChild>
                <button className="p-2">
                  <Menu className="h-6 w-6" />
                </button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="p-4">
                  <SidebarNavigation />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}