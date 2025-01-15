import { LucideIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

interface SidebarNavItemProps {
  path: string;
  title: string;
  icon: LucideIcon;
}

export function SidebarNavItem({ path, title, icon: Icon }: SidebarNavItemProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { setOpenMobile } = useSidebar();
  const isActive = location.pathname === path;

  const handleClick = () => {
    navigate(path);
    setOpenMobile(false);
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className={`
          text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
          ${isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
        `}
        onClick={handleClick}
      >
        <Icon className="w-5 h-5" />
        <span>{title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}