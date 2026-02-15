import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import "@testing-library/jest-dom";

describe("AppSidebar Component", () => {
  it("should render the sidebar with brand title", () => {
    render(
      <SidebarProvider>
        <MemoryRouter>
          <AppSidebar />
        </MemoryRouter>
      </SidebarProvider>,
    );

    expect(screen.getByText("Autoflex")).toBeInTheDocument();
    expect(screen.getByText("Gestão de Produção")).toBeInTheDocument();
  });

  it("should render all navigation items correctly", () => {
    render(
      <SidebarProvider>
        <MemoryRouter>
          <AppSidebar />
        </MemoryRouter>
      </SidebarProvider>,
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Materiais")).toBeInTheDocument();
    expect(screen.getByText("Produtos")).toBeInTheDocument();
  });

  it("should have correct links for each nav item", () => {
    render(
      <SidebarProvider>
        <MemoryRouter>
          <AppSidebar />
        </MemoryRouter>
      </SidebarProvider>,
    );

    expect(screen.getByTestId("nav-dashboard")).toHaveAttribute("href", "/");
    expect(screen.getByTestId("nav-materiais")).toHaveAttribute(
      "href",
      "/materials",
    );
    expect(screen.getByTestId("nav-produtos")).toHaveAttribute(
      "href",
      "/products",
    );
  });
});
