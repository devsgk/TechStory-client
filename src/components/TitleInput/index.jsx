export default function TitleInput({
  title,
  showTitleError,
  onInputChange,
  titleInputRef,
  onFocus,
  onKeyUp,
  onClick,
  onKeyDown,
}) {
  return (
    <input
      className={`text-5xl outline-none ${title.trim().length === 0 && showTitleError ? "border-red-500 border-2 rounded-md" : ""} w-full mb-5`}
      placeholder="  Title"
      value={title}
      onChange={(e) => onInputChange(e.target.value)}
      ref={titleInputRef}
      onFocus={onFocus}
      onKeyUp={onKeyUp}
      onClick={onClick}
      onKeyDown={onKeyDown}
      spellCheck="false"
    />
  );
}
