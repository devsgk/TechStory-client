import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import ArticleListTable from "../components/ArticleListTable";

vi.mock("react-router-dom", async () => {
  const originalModule = await vi.importActual("react-router-dom");

  return {
    __esModule: true,
    ...originalModule,
    useNavigate: () => vi.fn(),
  };
});

describe("ArticleListTable", () => {
  const mockList = [
    {
      _id: "1",
      title: "Article 1",
      textContent: "This is the content of article 1",
      reviewers: [{ email: "reviewer1@example.com", status: "approved" }],
      isPublished: true,
    },
  ];

  beforeEach(() => {
    render(
      <MemoryRouter>
        <Routes>
          <Route
            path="/"
            element={<ArticleListTable type="Test Type" list={mockList} />}
          />
          <Route
            path="/articles/:id"
            element={<div>Article Detail Page</div>}
          />
        </Routes>
      </MemoryRouter>,
    );
  });

  it("Should render without crashing", () => {
    expect(screen.getByText("Test Type")).toBeInTheDocument();
    expect(screen.getByText("Article 1")).toBeInTheDocument();
    expect(
      screen.getByText("This is the content of article 1".slice(0, 15) + "..."),
    ).toBeInTheDocument();
  });

  it("Should display the correct status for an article", () => {
    const statusElement = screen.getByText("Published");
    expect(statusElement).toBeInTheDocument();
    expect(statusElement).toHaveClass("bg-blue-200");
  });
});
