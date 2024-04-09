import axios from "axios";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import NewArticle from "../components/NewArticle";

const mockedNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const originalModule = await vi.importActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

vi.mock("axios", () => {
  return {
    default: {
      post: vi.fn(() =>
        Promise.resolve({
          data: { result: "ok", articleId: "unique-article-id" },
        }),
      ),
      get: vi.fn(),
    },
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

describe.skip("NewArticle component", () => {
  beforeEach(() => {
    render(
      <Router>
        <NewArticle />
      </Router>,
    );
  });

  it("Should display the initial UI correctly", () => {
    expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("Should change the title input field border to red if the save button is clicked with an empty title", async () => {
    await userEvent.click(screen.getByText("Save"));
    const titleInput = screen.getByPlaceholderText("Title");
    expect(titleInput).toHaveClass("border-red-500");
  });

  it("Should navigate to the article page on successful save", async () => {
    axios.post.mockResolvedValueOnce({
      data: { result: "ok", articleId: "unique-article-id" },
    });

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("Title"), "Test Article Title");
    await user.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith(
        `/articles/unique-article-id`,
      );
    });
  });
});
