import TextEditorTools from "../TextEditorTools";

export default function PopupModal({ position, onPopupClick }) {
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
        <TextEditorTools />
      </div>
    </>
  );
}
