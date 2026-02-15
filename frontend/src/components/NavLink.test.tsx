import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { NavLink } from "./NavLink";
import { Home } from "lucide-react";

describe("NavLink Component", () => {
  it("should render the link with children content", () => {
    render(
      <MemoryRouter>
        <NavLink to="/dashboard">
          <Home data-testid="home-icon" />
          <span>Dashboard</span>
        </NavLink>
      </MemoryRouter>,
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();

    expect(screen.getByTestId("home-icon")).toBeInTheDocument();

    const anchor = screen.getByRole("link");
    expect(anchor).toHaveAttribute("href", "/dashboard");
  });

  it("should apply activeClassName when the link is active", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <NavLink to="/dashboard" activeClassName="bg-blue-500">
          Dashboard
        </NavLink>
      </MemoryRouter>,
    );

    const anchor = screen.getByRole("link");

    expect(anchor).toHaveClass("bg-blue-500");
  });
});
