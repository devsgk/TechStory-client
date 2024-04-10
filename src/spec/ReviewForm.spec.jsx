import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReviewForm from "../components/ReviewForm";

describe("ReviewForm", () => {
  it("allows entering a comment and handles submit and cancel", async () => {
    const handleSave = vi.fn();
    const handleCancel = vi.fn();

    render(
      <ReviewForm
        onReviewFormSave={handleSave}
        onReviewFormCancel={handleCancel}
      />,
    );

    const commentInput = screen.getByPlaceholderText("Add a comment...");
    await userEvent.type(commentInput, "Great article!");

    expect(commentInput).toHaveValue("Great article!");

    const submitButton = screen.getByText("Submit");

    fireEvent.click(submitButton);

    expect(handleSave).toHaveBeenCalledWith("Great article!");

    const cancelButton = screen.getByText("Cancel");

    fireEvent.click(cancelButton);

    expect(handleCancel).toHaveBeenCalled();
  });
});
