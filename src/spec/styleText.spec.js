import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  applyBackgroundColor,
  applyFontColor,
  applyFontSize,
  applyTextAlignment,
  toggleTextDecoration,
} from "../utils/styleText";

const mockGetSelection = () => {
  const selection = {
    rangeCount: 1,
    isCollapsed: false,
    getRangeAt: vi.fn(() => ({
      cloneContents: vi.fn(() => document.createElement("div")),
      deleteContents: vi.fn(),
      insertNode: vi.fn(),
      commonAncestorContainer: document.createElement("div"),
    })),
    removeAllRanges: vi.fn(),
    addRange: vi.fn(),
  };

  global.window.getSelection = vi.fn(() => selection);

  return selection;
};

describe("applyFontSize", () => {
  let getSelection;

  beforeEach(() => {
    getSelection = mockGetSelection();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("applies font size to selected text", () => {
    document.body.innerHTML = '<div id="test">Test Content</div>';
    const fontSize = 16;
    const fontColor = "red";
    const backgroundColor = "yellow";
    const alignLeft = "left";
    const alignCenter = "center";
    const alignRight = "right";

    applyFontSize(fontSize);
    applyFontColor(fontColor);
    applyBackgroundColor(backgroundColor);
    applyTextAlignment(alignLeft);
    applyTextAlignment(alignCenter);
    applyTextAlignment(alignRight);

    expect(getSelection.getRangeAt).toHaveBeenCalled();
  });
  it("applies font color to selected text", () => {
    document.body.innerHTML = '<div id="test">Test Content</div>';
    const color = "red";
    applyFontColor(color);
  });
});
