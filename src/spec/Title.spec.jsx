import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Title from "../components/Title";

describe.skip("Title Component", () => {
  const mockOnTitleChange = vi.fn();

  it("Should render with initial title and without error", () => {
    render(
      <Title
        title="Initial Title"
        onTitleChange={mockOnTitleChange}
        readOnly={false}
        showTitleError={false}
      />,
    );

    const inputElement = screen.getByPlaceholderText("Title");
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue("Initial Title");
    expect(inputElement).not.toHaveClass("border-red-500");
  });

  it("Should call onTitleChange when the input changes", async () => {
    render(
      <Title title="" onTitleChange={mockOnTitleChange} readOnly={false} />,
    );
    const inputElement = screen.getByPlaceholderText("Title");

    await userEvent.type(inputElement, "New Title");
    expect(mockOnTitleChange).toHaveBeenCalledTimes(9);
  });

  it("Should be read-only when readOnly prop is true", () => {
    render(
      <Title
        title="Read Only Title"
        onTitleChange={mockOnTitleChange}
        readOnly={true}
      />,
    );
    const inputElement = screen.getByPlaceholderText("Title");

    expect(inputElement).toHaveAttribute("readOnly");
  });

  it("Should set border red when showTitleError prop is true", () => {
    render(
      <Title
        title=""
        onTitleChange={mockOnTitleChange}
        showTitleError={true}
      />,
    );
    const inputElement = screen.getByPlaceholderText("Title");

    expect(inputElement).toHaveClass("border-red-500");
  });
});
