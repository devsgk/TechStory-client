import { forwardRef, useState } from "react";

import PopupModal from "../PopupModal";

import { createPopupModal } from "../../utils/commentPopup";
import TextEditorCommands from "../../utils/TextEditorCommands";

import "./style.css";

const TextEditor = forwardRef((props, ref) => {
  const [position, setPosition] = useState(null);
  const [showPopupModal, setShowPopupModal] = useState(false);

  const { enableResize = false } = props.properties;

  function handleMouseUp() {
    const selection = window.getSelection();
    const originalRange = selection.getRangeAt(0);

    if (originalRange.collapsed) {
      setShowPopupModal(false);

      return;
    }

    createPopupModal(selection, originalRange, setPosition, setShowPopupModal);
  }

  function handlePopupClick() {
    console.log("popup clicked");
  }

  return (
    <div
      className={`TextEditor flex flex-col w-full h-[500px] overflow-hidden ${enableResize ? "resize-y" : "resize-none"}`}
    >
      <div
        className={`TextareaWrapper w-full h-screen overflow-y-auto ${enableResize ? "resize-y" : "resize-none"}`}
      >
        <div
          className="w-full outline-none p-2 pr-0 break-all h-full min-h-screen overflow-y-auto"
          ref={ref}
          contentEditable
          onMouseUp={handleMouseUp}
          spellCheck="false"
        />
      </div>
      {showPopupModal && (
        <PopupModal position={position} onPopupClick={handlePopupClick} />
      )}
    </div>
  );
});

export default TextEditor;
