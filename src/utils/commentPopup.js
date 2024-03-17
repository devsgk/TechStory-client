import COMMENT_STYLE from "../constants/commentStyleConstants";

export function createPopupModal(
  selection,
  originalRange,
  setPosition,
  setShowPopupModal,
) {
  const marker = document.createElement("span");
  const clonedRange = originalRange.cloneRange();

  clonedRange.collapse(false);
  clonedRange.insertNode(marker);

  const rect = marker.getBoundingClientRect();

  setPosition({
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY - 40,
  });

  setShowPopupModal(true);

  marker.remove();
  selection.removeAllRanges();
  selection.addRange(originalRange);
}

export function styleSelectedArea(originalRange, span) {
  Object.assign(span.style, COMMENT_STYLE);

  try {
    originalRange.surroundContents(span);
  } catch (error) {
    console.log(error);
  }

  window.getSelection().removeAllRanges();
}
