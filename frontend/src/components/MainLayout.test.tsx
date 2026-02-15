import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MainLayout } from "./MainLayout";

describe("MainLayout Component", () => {
  it("should render children content and the sidebar", () => {
    render(
      <MemoryRouter>
        <MainLayout>
          <div data-testid="test-content">Page Content</div>
        </MainLayout>
      </MemoryRouter>,
    );

    expect(screen.getByTestId("app-sidebar")).toBeInTheDocument();

    expect(screen.getByTestId("test-content")).toBeInTheDocument();
  });
});
