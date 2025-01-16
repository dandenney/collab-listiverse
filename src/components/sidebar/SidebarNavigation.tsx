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
  { path: "/recipes", title: "Recipe", icon: UtensilsCrossed },
];

interface SidebarNavigationProps {
  onNavigate?: () => void;
}

export function SidebarNavigation({ onNavigate }: SidebarNavigationProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sidebar-foreground/70">
        Lists
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarNavItem 
              key={item.title} 
              {...item} 
              onNavigate={onNavigate}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}