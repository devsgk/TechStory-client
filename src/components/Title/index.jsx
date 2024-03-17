export default function Title({
  title,
  onTitleChange,
  readOnly,
  showTitleError,
}) {
  function handleTitleChange(e) {
    onTitleChange(e);
  }

  return (
    <input
      className={`text-5xl outline-none ${title.trim().length === 0 && showTitleError ? "border-red-500 border-2 rounded-md" : ""} w-full mb-5 text-center ${!readOnly && "border rounded-md"}`}
      placeholder="Title"
      value={title}
      onChange={handleTitleChange}
      readOnly={readOnly}
    />
  );
}
