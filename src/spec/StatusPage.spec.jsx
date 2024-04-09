import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import StatusPage from "../components/StatusPage";
import { useUserStore } from "../store/store";

vi.mock("axios");

vi.mock("../store/store", () => ({
  useUserStore: vi.fn(),
}));

const mockUserState = {
  user: { email: "author@example.com" },
  isLoggedIn: true,
  identity: "author",
  setIsLoggedIn: vi.fn(),
  setUser: vi.fn(),
  setIdentity: vi.fn(),
};

describe.skip("StatusPage Component", () => {
  beforeEach(() => {
    axios.get.mockClear();
    axios.post.mockClear();
    axios.delete.mockClear();
    useUserStore.mockImplementation(() => mockUserState);

    axios.get.mockResolvedValue({
      data: {
        result: "ok",
        article: {
          author: { email: "author@example.com" },
          reviewers: [{ email: "reviewer1@example.com", status: "approved" }],
          reviewList: [],
          isPublished: false,
        },
      },
    });

    axios.post.mockResolvedValue({ data: { result: "ok" } });
    axios.delete.mockResolvedValue({ data: { result: "ok" } });
  });

  it("Should render the article description and author info", async () => {
    render(
      <MemoryRouter initialEntries={["/articles/123/status"]}>
        <Routes>
          <Route path="/articles/:articleId/status" element={<StatusPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Article Description")).toBeInTheDocument();
    expect(screen.getByText("author@example.com")).toBeInTheDocument();
  });

  it("Should allow the author to publish the article", async () => {
    render(
      <MemoryRouter initialEntries={["/articles/123/status"]}>
        <Routes>
          <Route path="/articles/:articleId/status" element={<StatusPage />} />
        </Routes>
      </MemoryRouter>,
    );

    const publishButton = await screen.findByText("Publish");
    fireEvent.click(publishButton);

    expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
      withCredentials: true,
    });
  });

  it("Should not allow the author to publish the article if not all reviewers have approved", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        result: "ok",
        article: {
          author: { email: "author@example.com" },
          reviewers: [
            { email: "reviewer1@example.com", status: "approved" },
            { email: "reviewer2@example.com", status: "pending" },
          ],
          reviewList: [],
          isPublished: false,
        },
      },
    });

    render(
      <MemoryRouter initialEntries={["/articles/123/status"]}>
        <Routes>
          <Route path="/articles/:articleId/status" element={<StatusPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.queryByText("Publish")).not.toBeInTheDocument();
  });
});
