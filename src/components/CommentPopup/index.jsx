export default function CommentPopup({ position, onPopupClick }) {
  const modalStyle = {
    top: `${position.y}px`,
    left: `${position.x - 20}px`,
    position: "absolute",
    zIndex: 1000,
  };

  return (
    <>
      <div
        className="border bg-white hover:bg-gray-200 p-2 rounded shadow-md text-xs cursor-pointer"
        style={modalStyle}
        onClick={onPopupClick}
      >
        <h2>Comment</h2>
      </div>
    </>
  );
}
