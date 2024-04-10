import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import Header from "../components/Header";

const mockedNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const originalModule = await vi.importActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

vi.mock("../store/store", () => ({
  useUserStore: vi.fn(() => ({
    identity: "authorized",
    isLoggedIn: true,
    user: { displayName: "Kim" },
    setIdentity: vi.fn(),
    setIsLoggedIn: vi.fn(),
    setUser: vi.fn(),
  })),
}));

describe("header component", () => {
  beforeEach(() => {
    render(
      <Router>
        <Header />
      </Router>,
    );
  });

  it("Should render the project name 'Tech Story'", () => {
    expect(screen.getByText("Tech Story")).toBeInTheDocument();
  });

  it("Should render user's displayName when logged in", () => {
    expect(screen.getByText("Kim")).toBeInTheDocument();
  });

  it("Should displays 'My Articles' and 'Log Out' buttons when user name is clicked", async () => {
    await userEvent.click(screen.getByText("Kim"));

    expect(screen.getByText("My articles")).toBeVisible();
    expect(screen.getByText("Log Out")).toBeVisible();
  });

  it("Should navigate to the home page when the logo is clicked", async () => {
    await userEvent.click(screen.getByText("Tech Story"));

    expect(mockedNavigate).toHaveBeenCalledWith("/");
  });
});
