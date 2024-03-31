import { useState } from "react";

export default function ReviewForm({ onReviewFormSave, onReviewFormCancel }) {
  const [comment, setComment] = useState("");

  return (
    <div>
      <form
        className="bg-white p-2 rounded shadow-lg"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          className="w-full outline-none text-[15px]"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="2"
          autoFocus
          placeholder="Add a comment..."
          spellCheck="false"
        />
        <div className="flex space-x-2 mr-auto">
          <button
            className={`p-1 rounded text-[12px] ${
              comment.length > 0 ? "bg-blue-100" : "bg-gray-100"
            }`}
            onClick={() => onReviewFormSave(comment)}
            type="submit"
          >
            Submit
          </button>
          <button
            className="bg-gray-100 p-1 rounded text-[12px] hover:bg-red-100 hover:cursor-pointer"
            onClick={onReviewFormCancel}
            type="button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
