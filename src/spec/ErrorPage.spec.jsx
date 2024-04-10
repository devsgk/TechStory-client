import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ErrorPage from "../components/ErrorPage";

describe("ErrorPage Component", () => {
  const testErrorMessage = "Test Error Message";

  it("Should display the passed error message", () => {
    render(
      <MemoryRouter>
        <ErrorPage errorMessage={testErrorMessage} />
      </MemoryRouter>,
    );

    expect(screen.getByText(testErrorMessage)).toBeInTheDocument();
  });

  it("Should contain a link that navigates back to the main page", () => {
    render(
      <MemoryRouter>
        <ErrorPage errorMessage={testErrorMessage} />
      </MemoryRouter>,
    );

    // Assuming "Go Back To Main Page" is unique text for the link
    const linkElement = screen.getByText("Go Back To Main Page");
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.closest("a")).toHaveAttribute("href", "/");
  });

  it('Should simulats click on "Go Back To Main Page" link and checks navigation', async () => {
    render(
      <MemoryRouter initialEntries={["/random-error-page"]}>
        <ErrorPage errorMessage={testErrorMessage} />
      </MemoryRouter>,
    );

    // Click the link
    await userEvent.click(screen.getByText("Go Back To Main Page"));

    // Check that we are redirected to the main page.
    // In a unit test environment, we can't actually navigate,
    // but we can ensure the link's destination is correct.
    expect(
      screen.getByText("Go Back To Main Page").closest("a"),
    ).toHaveAttribute("href", "/");
  });
});
