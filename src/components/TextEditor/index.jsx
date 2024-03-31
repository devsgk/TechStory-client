import { forwardRef, useState } from "react";

import PopupModal from "../PopupModal";

import { createPopupModal } from "../../utils/commentPopup";

import "./style.css";

const TextEditor = forwardRef(({ onFocus, onKeyUp, onClick }, ref) => {
  const [position, setPosition] = useState(null);
  const [showPopupModal, setShowPopupModal] = useState(false);

  function handleMouseUp() {
    const selection = window.getSelection();
    const originalRange = selection.getRangeAt(0);

    if (originalRange.collapsed) {
      setShowPopupModal(false);

      return;
    }

    createPopupModal(selection, originalRange, setPosition, setShowPopupModal);
  }

  return (
    <div className={`flex flex-col w-full overflow-y-auto mb-10`}>
      {ref.current?.innerHTML === "" && (
        <span className="absolute pl-9 text-gray-300 z-[-10] text-[21px]">
          Tell me your story...
        </span>
      )}
      <div
        className="w-full outline-none pr-0 break-after-all"
        ref={ref}
        contentEditable
        onMouseUp={handleMouseUp}
        spellCheck="false"
        onKeyUp={onKeyUp}
        onFocus={onFocus}
        onClick={onClick}
        style={{ fontSize: "21px" }}
      />

      {showPopupModal && (
        <PopupModal
          properties={{
            position,
          }}
          ref={ref}
        />
      )}
    </div>
  );
});

export default TextEditor;
