import { 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu 
} from "@/components/ui/sidebar";
import { SidebarNavItem } from "./SidebarNavItem";
import { 
  ShoppingCart, 
  BookOpen, 
  Film, 
  MapPin, 
  ShoppingBag,
  UtensilsCrossed 
} from "lucide-react";

const navigationItems = [
  { path: "/grocery", title: "Grocery", icon: ShoppingCart },
  { path: "/shopping", title: "Shopping", icon: ShoppingBag },
  { path: "/watch", title: "Watch", icon: Film },
  { path: "/read", title: "Read", icon: BookOpen },
  { path: "/local", title: "Local", icon: MapPin },
  { path: "/recipes", title: "Recipe", icon: UtensilsCrossed }, // Updated path to match App.tsx
];

export function SidebarNavigation() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sidebar-foreground/70">
        Lists
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarNavItem key={item.title} {...item} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}