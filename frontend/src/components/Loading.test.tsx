import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Loading from "./Loading";

describe("Loading Component", () => {
  it("should render the default message and description", () => {
    render(<Loading />);

    const message = screen.getByText(/Sincronizando dados.../i);
    const description = screen.getByText(/Isso pode levar alguns segundos/i);

    expect(message).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  it("should render a custom message when props are provided", () => {
    render(
      <Loading
        message="Checking Stock..."
        description="Wait a moment please."
      />,
    );

    expect(screen.getByText("Checking Stock...")).toBeInTheDocument();
    expect(screen.getByText("Wait a moment please.")).toBeInTheDocument();

    expect(
      screen.queryByText("Sincronizando dados..."),
    ).not.toBeInTheDocument();
  });
});
