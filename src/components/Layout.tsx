import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Menu } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { useState } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6 overflow-x-hidden">
          <div className="md:hidden mb-4 flex justify-end">
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
              <DrawerTrigger asChild>
                <button className="p-2">
                  <Menu className="h-6 w-6" />
                </button>
              </DrawerTrigger>
              <DrawerContent className="bg-background">
                <div className="p-4">
                  <SidebarNavigation onNavigate={() => setIsOpen(false)} />
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