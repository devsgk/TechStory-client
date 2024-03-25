import { forwardRef } from "react";
import TextEditorTools from "../TextEditorTools";

const PopupModal = forwardRef((props, ref) => {
  const { position, onPopupClick } = props.properties;
  const modalStyle = {
    top: `${position.y}px`,
    left: `${position.x - 80}px`,
    position: "absolute",
    zIndex: 1000,
  };

  return (
    <>
      <div
        className="border-[1px] bg-white rounded shadow-md text-xs"
        style={modalStyle}
        onClick={onPopupClick}
      >
        <TextEditorTools ref={ref} />
      </div>
    </>
  );
});

export default PopupModal;
