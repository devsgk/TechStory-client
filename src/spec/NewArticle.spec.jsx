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

describe("NewArticle component", () => {
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

  it("Updates title state correctly upon user input", async () => {
    const user = userEvent.setup();
    const titleInput = screen.getByPlaceholderText("Title");
    await user.type(titleInput, "New Article Title");

    expect(titleInput.value).toBe("New Article Title");
  });

  it("validates title input and shows error on empty title save attempt", async () => {
    const saveButton = screen.getByText("Save");
    await userEvent.click(saveButton);

    const titleInput = screen.getByPlaceholderText("Title");
    expect(titleInput).toHaveClass("border-red-500");
    expect(mockedNavigate).toHaveBeenCalled();
  });

  it("navigates to the article page on successful save", async () => {
    axios.post.mockResolvedValueOnce({
      data: { result: "ok", articleId: "unique-article-id" },
    });

    const titleInput = screen.getByPlaceholderText("Title");
    await userEvent.type(titleInput, "Test Title");
    await userEvent.click(screen.getByText("Save"));

    expect(axios.post).toHaveBeenCalled();
    expect(mockedNavigate).toHaveBeenCalledWith("/articles/unique-article-id");
  });

  it("focuses on the title input on component mount", () => {
    const titleInput = screen.getByPlaceholderText("Title");
    expect(document.activeElement).toEqual(titleInput);
  });
});
