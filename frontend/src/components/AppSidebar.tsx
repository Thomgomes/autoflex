import { LayoutDashboard, Package, Boxes, CircleQuestionMark } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Estoque", url: "/inventory", icon: Boxes },
  { title: "Produtos", url: "/products", icon: Package },
  { title: "Dúvidas", url: "/faq", icon: CircleQuestionMark },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-slate-700" data-testid="app-sidebar">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-2xl font-bold text-white leading-none">Autoflex</h1>
            <p className="text-md text-slate-500 mt-1">Gestão de Produção</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400 uppercase text-[10px] tracking-widest px-4 mb-2">
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-200/80 transition-colors hover:bg-gray-600/60 hover:text-gray-300"
                      activeClassName="bg-gray-600 text-white font-medium"
                      data-testid={`nav-${item.title.toLowerCase()}`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
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