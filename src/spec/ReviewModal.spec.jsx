import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import ReviewModal from "../components/ReviewModal";

vi.mock("../../store/store", () => ({
  useUserStore: () => ({
    user: { email: "creator@example.com" },
  }),
}));

describe("ReviewModal", () => {
  const mockElement = {
    creator: {
      displayName: "John Doe",
      email: "creator@example.com",
      photoURL: "http://example.com/photo.jpg",
    },
    styleId: "123",
    comment: "Great work!",
    position: { top: 100 },
  };

  it("displays the review comment and handles mouse events", () => {
    const handleMouseEnter = vi.fn();
    const handleMouseLeave = vi.fn();
    const handleResolveClick = vi.fn();

    render(
      <ReviewModal
        element={mockElement}
        hoveredReviewId="123"
        onMouseEnter={() => handleMouseEnter(mockElement.styleId)}
        onMouseLeave={() => handleMouseLeave(mockElement.styleId)}
        onResolveClick={() => handleResolveClick(mockElement.styleId)}
      />,
    );

    expect(screen.getByText(mockElement.comment)).toBeInTheDocument();
  });
});
