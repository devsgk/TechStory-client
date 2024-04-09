import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TextEditorTools from "../components/TextEditorTools";
import { COLORS } from "../constants/textEditorConstants";
import { FontDropDown } from "../components/TextEditorUtilsComponent";

const mockMethods = {
  bold: vi.fn(),
  italic: vi.fn(),
  underline: vi.fn(),
  alignLeft: vi.fn(),
  alignCenter: vi.fn(),
  alignRight: vi.fn(),
  bgColor: vi.fn(),
  color: vi.fn(),
};

vi.mock("../utils/TextEditorCommands", () => {
  return {
    default: vi.fn().mockImplementation(() => mockMethods),
  };
});

describe.skip("TextEditorTools component", () => {
  let user;

  beforeEach(() => {
    Object.values(mockMethods).forEach((mockFn) => mockFn.mockClear());
    user = userEvent.setup();

    render(<TextEditorTools />);
  });

  it("Should call the bold command on bold button click", async () => {
    const boldButton = screen.getByRole("button", { name: "Bold" });

    await user.click(boldButton);

    expect(mockMethods.bold).toHaveBeenCalled();
  });

  it("Should call the italic command on italic button click", async () => {
    const italicButton = screen.getByRole("button", { name: "Italic" });

    await user.click(italicButton);

    expect(mockMethods.italic).toHaveBeenCalled();
  });

  it("Should call the underline command on underline button click", async () => {
    const underlineButton = screen.getByRole("button", { name: "Underline" });

    await user.click(underlineButton);

    expect(mockMethods.underline).toHaveBeenCalled();
  });

  it("Should call the align left command on underline button click", async () => {
    const alignLeft = screen.getByRole("button", { name: "AlignLeft" });

    await user.click(alignLeft);

    expect(mockMethods.alignLeft).toHaveBeenCalled();
  });

  it("Should call the align center command on underline button click", async () => {
    const alignCenter = screen.getByRole("button", { name: "AlignCenter" });

    await user.click(alignCenter);

    expect(mockMethods.alignCenter).toHaveBeenCalled();
  });

  it("Should call the align right command on underline button click", async () => {
    const alignRight = screen.getByRole("button", { name: "AlignRight" });

    await user.click(alignRight);

    expect(mockMethods.alignRight).toHaveBeenCalled();
  });

  it("Should call the bgColor command when a color is selected from ColorPicker", async () => {
    const paintBackgroundButton = screen.getByRole("button", {
      name: "PaintBackground",
    });
    await user.click(paintBackgroundButton);

    const selectedColor = COLORS[0];
    const colorButtonStyle = `background: ${selectedColor};`;
    const colorButtons = document.querySelectorAll(
      'button[style^="background"]',
    );
    let colorButton;

    colorButtons.forEach((button) => {
      if (button.getAttribute("style") === colorButtonStyle) {
        colorButton = button;
      }
    });

    if (colorButton) {
      await user.click(colorButton);
    } else {
      throw new Error(
        `Color button with style '${colorButtonStyle}' not found.`,
      );
    }

    expect(mockMethods.bgColor).toHaveBeenCalled();
  });

  it("Should call the color command when a color is selected from ColorPicker", async () => {
    const paintTextButton = screen.getByRole("button", { name: "PaintText" });
    await user.click(paintTextButton);

    const selectedColor = COLORS[0];
    const colorButtons = document.querySelectorAll(
      'button[style^="background"]',
    );
    let colorButton;

    colorButtons.forEach((button) => {
      if (button.style.background.includes(selectedColor)) {
        colorButton = button;
      }
    });

    if (colorButton) {
      await user.click(colorButton);
    } else {
      throw new Error(
        `Color button with background '${selectedColor}' not found.`,
      );
    }

    expect(mockMethods.color).toHaveBeenCalledWith(selectedColor);
  });

  it("Prop function should be called on FontDropDown option click", async () => {
    const testFn = vi.fn();

    render(<FontDropDown fn={testFn} />);

    const fontSizeOption = screen.getByText("14");

    await user.click(fontSizeOption);

    expect(testFn).toHaveBeenCalledWith(14);
  });
});
