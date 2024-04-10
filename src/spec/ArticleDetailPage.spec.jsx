import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import ArticleDetailPage from "../components/ArticleDetailPage";

vi.mock("axios");
vi.mock("../store/store", () => ({
  useUserStore: vi.fn(() => ({
    user: { _id: "123", name: "Test User" },
    identity: "author",
    isLoggedIn: true,
    setIdentity: vi.fn(),
    setIsLoggedIn: vi.fn(),
    setUser: vi.fn(),
  })),
  useReviewListStore: vi.fn(() => ({
    styleId: "",
    reviewList: [],
    setStyleId: vi.fn(),
    setReviewList: vi.fn(),
  })),
}));

vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: () => vi.fn(),
  useParams: () => ({
    articleId: "test-article-id",
  }),
}));

describe("ArticleDetailPage", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        result: "ok",
        article: {
          title: "Mocked Title",
          previewContent: "Mocked Content",
          reviewers: [{ email: "reviewer1@example.com" }],
          reviewList: [],
        },
      },
    });
  });

  it("Should render correctly for an author", async () => {
    render(<ArticleDetailPage />);

    expect(screen.getByText("Request review")).toBeInTheDocument();
    expect(screen.getByText("Modify")).toBeInTheDocument();
    expect(screen.getByText("DELETE")).toBeInTheDocument();
  });

  it("Should render an input for adding reviewer emails", () => {
    render(<ArticleDetailPage />);
    expect(
      screen.getByPlaceholderText("Enter reviewer's email"),
    ).toBeInTheDocument();
  });

  it("Should call the modify function when Modify button is clicked", async () => {
    const handleModify = vi.fn();

    render(<ArticleDetailPage />);

    const modifyButton = screen.getByText("Modify");

    modifyButton.onclick = handleModify;

    fireEvent.click(modifyButton);

    expect(handleModify).toHaveBeenCalled();
  });

  it("Should call the delete function when DELETE button is clicked", async () => {
    window.confirm = vi.fn(() => true);
    const handleDelete = vi.fn();

    render(<ArticleDetailPage />);

    const deleteButton = screen.getByText("DELETE");

    deleteButton.onclick = handleDelete;

    fireEvent.click(deleteButton);

    expect(handleDelete).toHaveBeenCalled();
  });
});
