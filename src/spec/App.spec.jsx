import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../components/App";

describe("App component routing", () => {
  it("renders MainPage for the root path", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByText(
        "Explore stories, insights, and experiences from experts in tech industry.",
      ),
    ).toBeInTheDocument();
  });

  it("renders ErrorPage for unmatched routes", () => {
    render(
      <MemoryRouter initialEntries={["/some/random/path"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText("404 Not Found!")).toBeInTheDocument();
  });
});
