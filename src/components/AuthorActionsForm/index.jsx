import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import "../styles.css";

const AuthorActionsForm = ({
  onRequestReviewClick,
  onSave,
  onModify,
  isEditing,
  onAddReviewer,
  articleId,
  isValidReviewer,
  onDelete,
  requestStatus,
  reviewersList,
  onRemoveEmail,
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

  function handleStatusButton() {
    navigate(`/articles/${articleId}/status`);
  }

  return (
    <form
      className="my-2 mt-5 space-y-4 w-full"
      onSubmit={onRequestReviewClick}
    >
      <div className="flex items-center justify-between text-[15px]">
        <div className="flex items-center">
          <img src="/assets/gmail.png" alt="gmail icon" className="w-7 h-7" />
          <input
            className={`border-2 outline-none rounded ml-2 pl-2 ${isValidReviewer ? "" : "border-red-500"}`}
            placeholder="Enter reviewer's email"
            value={emailInput}
            onChange={handleEmailInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddButton(e);
              }
            }}
          />
        </div>
        <div className="flex text-sm font-bold ml-3 items-center">
          {reviewersList.length > 0 &&
            reviewersList.map((el, index) => (
              <div className="relative group" key={el} onClick={onRemoveEmail}>
                <span className="text-green-600 p-2 border border-transparent hover:border-red-500 hover:bg-red-50 rounded shake cursor-pointer inline-block">
                  {el}
                </span>
              </div>
            ))}
        </div>
        <div className="flex space-x-3 text-[14px]">
          <button
            className="p-2 rounded-md border hover:bg-gray-100"
            type="button"
            onClick={() => navigate(-1)}
          >
            <IoIosArrowBack />
          </button>
          <button
            className="px-2 py-1 w-[120px] rounded-md border hover:bg-green-400"
            type="submit"
          >
            {requestStatus === "idle" && "Request review"}
            {requestStatus === "loading" && "Sending..."}
          </button>
          <button
            className="p-2 rounded-md border hover:bg-gray-100"
            type="button"
            onClick={handleStatusButton}
          >
            <IoIosArrowForward />
          </button>
        </div>
      </div>
      <hr className="mb-10" />
      <div className="flex justify-end space-x-2">
        <p
          className={`ml-[40px] text-red-600 fade-out ${isValidReviewer ? "hidden" : "shake-alert"} mr-auto`}
        >
          {isValidReviewer ? "" : "Ask him to sign up first!"}
        </p>

        {isEditing ? (
          <button
            className="px-2 py-1 rounded-md border hover:bg-green-400 text-[14px]"
            onClick={onSave}
          >
            Save
          </button>
        ) : (
          <button
            className="px-2 py-1 rounded-md border hover:bg-gray-100 text-[14px]"
            onClick={onModify}
          >
            Modify
          </button>
        )}
        <button
          className="px-2 py-1 rounded-md border hover:bg-gray-100 text-[14px]"
          onClick={onDelete}
          type="button"
        >
          DELETE
        </button>
      </div>
    </form>
  );
};

export default AuthorActionsForm;
