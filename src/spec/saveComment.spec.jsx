import { describe, it, expect, vi } from "vitest";
import axios from "axios";
import saveComment from "../utils/saveComment";

vi.mock("axios", () => ({
  default: { post: vi.fn() },
}));

describe("saveComment", () => {
  it("sends a POST request with the correct data", async () => {
    const articleContent = "Test Article Content";
    const articleId = "12345";
    const commentObj = {
      comment: "Test Comment",
      styleId: "67890",
      position: { top: 100 },
      creator: { email: "test@example.com" },
    };

    axios.post.mockResolvedValue({ data: {} });

    await saveComment(articleContent, articleId, commentObj);

    expect(axios.post).toHaveBeenCalledWith(
      `${import.meta.env.VITE_BASE_URL}/articles/${articleId}/review`,
      {
        withCredentials: true,
        articleContent,
        articleId,
        commentObj,
      },
    );
  });
});
