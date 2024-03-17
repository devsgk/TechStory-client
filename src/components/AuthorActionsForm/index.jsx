import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles.css";

const AuthorActionsForm = ({
  onRequestReviewClick,
  onSave,
  onModify,
  isEditing,
  onAddReviewer,
  onRemoveReviewer,
  articleId,
  isValidReviewer,
}) => {
  const [emailInput, setEmailInput] = useState("");

  const navigate = useNavigate();

  function handleEmailInputChange(e) {
    setEmailInput(e.target.value);
  }

  function handleAddButton(e) {
    e.preventDefault();

    if (!emailInput.trim()) {
      return;
    }

    onAddReviewer(emailInput);
    setEmailInput("");
  }

  function handleRemoveButton(e) {
    e.preventDefault();

    onRemoveReviewer();
  }

  function handleStatusButton() {
    navigate(`/articles/${articleId}/status`);
  }

  return (
    <form className="my-2 space-y-4 w-full" onSubmit={onRequestReviewClick}>
      <div className="flex items-center justify-between text-[15px]">
        <div className="flex items-center">
          <input
            className={`border-2 outline-none rounded ml-5 pl-2 ${isValidReviewer ? "" : "border-red-500"}`}
            placeholder="Enter reviewer's email"
            value={emailInput}
            onChange={handleEmailInputChange}
          />
          <button
            className="ml-3 font-bold text-[15px]"
            onClick={handleAddButton}
          >
            +
          </button>
          <button
            className="ml-3 font-bold text-[20px]"
            onClick={handleRemoveButton}
          >
            -
          </button>
          <p
            className={`ml-5 text-red-600 fade-out ${isValidReviewer ? "" : "shake-alert"}`}
          >
            {isValidReviewer
              ? ""
              : "You can't add unregistered user as a reviewer!"}
          </p>
        </div>

        <div className="space-x-5 text-[14px]">
          <button
            className="px-2 py-1 rounded-md border bg-green-600 hover:bg-green-500 text-white"
            type="submit"
          >
            Request review
          </button>
          <button
            className="px-2 py-1 rounded-md border bg-green-600 hover:bg-green-500 text-white"
            type="button"
            onClick={handleStatusButton}
          >
            Status
          </button>
          {isEditing ? (
            <button
              className="px-2 py-1 rounded-md border bg-green-600 hover:bg-green-500 text-white"
              onClick={onSave}
            >
              Save
            </button>
          ) : (
            <button
              className="px-2 py-1 rounded-md border bg-green-600 hover:bg-green-500 text-white"
              onClick={onModify}
            >
              Modify
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default AuthorActionsForm;
