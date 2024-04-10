import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import PublishedArticle from "../components/PublishedArticle";

vi.mock("axios");
vi.mock("react-router-dom", async () => {
  const actualModule = await vi.importActual("react-router-dom");
  return {
    ...actualModule,
    useParams: () => ({ articleId: "test-article-id" }),
  };
});
vi.mock("dompurify", () => ({
  default: {
    sanitize: (input) => input,
  },
  __esModule: true,
}));

describe("PublishedArticle component", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    axios.get.mockResolvedValue({
      data: {
        result: "ok",
        article: {
          title: "Test Article Title",
          author: {
            displayName: "Author Name",
            photoURL: "https://example.com/photo.jpg",
          },
          textContent: "This is the article content.",
          cleanedArticle: "This is the cleaned article content.",
          createdAt: "2023-01-01T00:00:00.000Z",
        },
      },
    });

    render(
      <MemoryRouter>
        <PublishedArticle />
      </MemoryRouter>,
    );
  });

  it("fetches and displays the article data correctly", async () => {
    expect(screen.getByText(/min read/)).toBeInTheDocument();
  });
});
