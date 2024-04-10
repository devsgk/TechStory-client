import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import TextEditor from "../components/TextEditor";

vi.mock("../utils/commentPopup", () => ({
  createPopupModal: vi.fn(
    (selection, originalRange, setPosition, setShowPopupModal) => {
      setPosition({ x: 0, y: 0 });
      setShowPopupModal(true);
    },
  ),
}));

vi.mock("../components/TextEditorTools", () => {
  return {
    __esModule: true,
    default: vi.fn(() => (
      <div data-testid="mock-text-editor-tools">Mock Tools</div>
    )),
  };
});

describe("TextEditor component", () => {
  it("Should render placeholder when ref's current innerHTML is empty", () => {
    const mockRef = {
      current: {
        innerHTML: "",
      },
    };

    render(<TextEditor ref={mockRef} />);
    expect(screen.getByText("Tell me your story...")).toBeInTheDocument();
  });

  it("Should show the TextEditorTools on text selection", () => {
    const mockRef = {
      current: {
        innerHTML: "test",
      },
    };

    const getSelectionMock = vi.fn().mockReturnValue({
      getRangeAt: vi.fn().mockReturnValue({
        collapsed: false,
      }),
    });

    global.window.getSelection = getSelectionMock;

    const { container } = render(<TextEditor ref={mockRef} />);
    const editor = container.querySelector('[contentEditable="true"]');

    fireEvent.mouseUp(editor);

    expect(screen.getByTestId("mock-text-editor-tools")).toBeInTheDocument();
  });
});
