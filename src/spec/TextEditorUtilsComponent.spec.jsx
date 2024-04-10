import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  FontDropDown,
  ColorPicker,
} from "../components/TextEditorUtilsComponent";
import { FONT_SIZES, COLORS } from "../constants/textEditorConstants";

describe("FontDropDown Component", () => {
  it("Should render all font size options", () => {
    render(<FontDropDown fn={vi.fn()} />);

    FONT_SIZES.forEach((size) => {
      expect(screen.getByText(size)).toBeInTheDocument();
    });
  });

  it("Should call fn with font size on font size option click", async () => {
    const mockFn = vi.fn();

    render(<FontDropDown fn={mockFn} />);

    await userEvent.click(screen.getByText(FONT_SIZES[0]));

    expect(mockFn).toHaveBeenCalledWith(FONT_SIZES[0]);
  });
});

describe("ColorPicker Component", () => {
  it("Should render all color options", () => {
    render(<ColorPicker fn={vi.fn()} />);

    COLORS.forEach((color) => {
      expect(screen.getByTestId(`color-${color}`)).toBeInTheDocument();
    });
  });

  it("Should call fn with color on color option click", async () => {
    const mockFn = vi.fn();
    render(<ColorPicker fn={mockFn} />);

    for (const color of COLORS) {
      await userEvent.click(screen.getByTestId(`color-${color}`));

      expect(mockFn).toHaveBeenCalledWith(color);

      mockFn.mockClear();
    }
  });
});
