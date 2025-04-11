
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  BarChart, 
  FileText, 
  Home, 
  Settings, 
  Users, 
  ThumbsUp,
  Database
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Tickets",
    href: "/tickets",
    icon: FileText,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart,
  },
  {
    title: "Knowledge Base",
    href: "/knowledge-base",
    icon: Database,
  },
  {
    title: "Feedback",
    href: "/feedback",
    icon: ThumbsUp,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function AppNav() {
  const location = useLocation();
  
  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href || 
          (item.href !== "/" && location.pathname.startsWith(item.href));
          
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md group",
              isActive 
                ? "bg-primary text-primary-foreground" 
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <item.icon
              className={cn(
                "mr-3 h-5 w-5",
                isActive 
                  ? "text-primary-foreground" 
                  : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground"
              )}
            />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
