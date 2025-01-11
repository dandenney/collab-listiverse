import {
  ListTodo,
  ShoppingCart,
  Bookmark,
  Calendar,
  BookOpen,
  UtensilsCrossed,
  Archive
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";

const items = [
  { title: "Grocery List", icon: ListTodo, path: "/grocery" },
  { title: "Shopping List", icon: ShoppingCart, path: "/shopping" },
  { title: "Watch List", icon: Bookmark, path: "/watch" },
  { title: "Read List", icon: BookOpen, path: "/read" },
  { title: "Local List", icon: Calendar, path: "/local" },
  { title: "Recipes", icon: UtensilsCrossed, path: "/recipes" },
  { title: "Archive", icon: Archive, path: "/archive" },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Lists</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={location.pathname === item.path ? "bg-accent/10" : ""}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}