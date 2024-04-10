import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import ArticlePreview from "../components/ArticlePreview";

vi.mock("axios");
vi.mock("react-router-dom", async () => {
  const originalModule = await vi.importActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: vi.fn(),
  };
});
vi.mock("../../store/store", () => ({
  useUserStore: vi.fn(() => ({
    user: { email: "author@example.com" },
  })),
}));
vi.mock("../../utils/deleteArticle", () => vi.fn());

const articles = [
  {
    _id: "1",
    title: "Test Article",
    textContent: "This is a test article content.",
    author: {
      displayName: "John Doe",
      photoURL: "http://example.com/photo.jpg",
      email: "author@example.com",
    },
    createdAt: "2023-01-01",
    isPublished: true,
  },
];

describe("ArticlePreview", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: { result: "ok", allArticles: articles },
    });
  });

  it("loads and displays articles", async () => {
    render(
      <MemoryRouter>
        <ArticlePreview onClick={() => {}} />
      </MemoryRouter>,
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    expect(screen.getByText("Test Article")).toBeInTheDocument();
  });
});
