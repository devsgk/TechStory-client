import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";

import TextEditor from "../TextEditor";
import { useUserStore } from "../../store/store";
import { addIndent, correctTags } from "../../utils/cleanContent";
import { CiCirclePlus } from "react-icons/ci";
import { FaImage } from "react-icons/fa";
import { handleFileUpload } from "../../utils/styleText";

export default function NewArticle() {
  const { user } = useUserStore();

  const [iconPosition, setIconPosition] = useState({ x: -10000, y: -10000 });
  const [isEditing, setIsEditing] = useState(true);
  const [isSaveClicked, setIsSaveClicked] = useState(false);
  const [input, setInput] = useState("");
  const [articleId, setArticleId] = useState("");
  const [title, setTitle] = useState("");
  const [showTitleError, setShowTitleError] = useState(false);
  const [isCircleClicked, setIsCircleClicked] = useState(false);

  const textEditorRef = useRef(null);
  const titleInputRef = useRef(null);
  const navigate = useNavigate();

  async function handleSaveButton() {
    if (title.trim().length === 0) {
      setShowTitleError(true);

      return;
    }

    const content = textEditorRef.current.innerHTML;
    const textContent = textEditorRef.current.textContent;
    const contentWithIndent = addIndent(content);
    const articleContent = correctTags(contentWithIndent);

    setInput(articleContent);
    setIsEditing((prev) => !prev);
    setShowTitleError(false);

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/articles`,
      {
        withCredentials: true,
        user,
        articleContent,
        articleId,
        textContent,
        title,
      },
    );

    if (response.data.result === "ok") {
      setIsSaveClicked(true);
      setArticleId(response.data.articleId);

      navigate(`/articles/${response.data.articleId}`);
    }
  }

  async function handleModifyButton() {
    setIsSaveClicked(false);

    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/articles?articleId=${articleId}`,
      {
        withCredentials: true,
        articleId,
      },
    );

    if (response.data.result === "ok") {
      const articleContent = response.data.article.content;

      setInput(articleContent);
      setIsEditing(true);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Tab" || e.key === "Enter") {
      e.preventDefault();
      if (textEditorRef.current) {
        textEditorRef.current.focus();
      }
    }
  }

  useEffect(() => {
    if (isEditing && textEditorRef.current) {
      textEditorRef.current.innerHTML = input;
    }
  }, [isEditing, input]);

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  function handleEditorEvents() {
    const position = getCaretPosition();

    setIconPosition(position);
  }

  function getCaretPosition() {
    const selection = window.getSelection();

    if (!selection.rangeCount) {
      return { x: -10000, y: -10000 };
    }

    const range = selection.getRangeAt(0).cloneRange();

    range.collapse(true);

    const dummySpan = document.createElement("span");

    dummySpan.textContent = "\u200B";
    range.insertNode(dummySpan);

    const rect = dummySpan.getBoundingClientRect();

    const editorOffsetLeft = textEditorRef.current.offsetLeft;

    const lineHeight = parseInt(
      window.getComputedStyle(dummySpan.parentNode).lineHeight,
    );
    const yPosition = rect.top + rect.height - lineHeight / 2 + window.scrollY;
    const position = { x: editorOffsetLeft, y: yPosition };

    if (parseInt(position.y) === 182) {
      position.y += 15;
    } else {
      position.y += 2;
    }

    dummySpan.parentNode.removeChild(dummySpan);

    return position;
  }

  function handleCircleClick() {
    setIsCircleClicked((prev) => !prev);
  }

  return (
    <div
      className="flex flex-col justify-center mx-10 mb-10 overflow-y-auto min-h-100vh"
      style={{ paddingLeft: "10%", paddingRight: "10%" }}
    >
      <div className="flex flex-col w-full mt-10 mb-10">
        {!isSaveClicked ? (
          <>
            <button
              className="rounded-md bg-red-500 text-white px-5 py-1 mt-5 ml-auto"
              onClick={handleSaveButton}
            >
              Save
            </button>
            <input
              className={`text-5xl outline-none ${title.trim().length === 0 && showTitleError ? "border-red-500 border-2 rounded-md" : ""} w-full mb-5`}
              placeholder="   Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              ref={titleInputRef}
              onFocus={handleEditorEvents}
              onKeyUp={handleEditorEvents}
              onClick={() => {
                handleEditorEvents();
                setIsCircleClicked(false);
              }}
              onKeyDown={handleKeyDown}
              spellCheck="false"
            />
            <TextEditor
              ref={textEditorRef}
              properties={{
                enableResize: true,
              }}
              onFocus={handleEditorEvents}
              onKeyUp={() => {
                handleEditorEvents();
                setIsCircleClicked(false);
              }}
              onClick={() => {
                handleEditorEvents();
                setIsCircleClicked(false);
              }}
            />

            <div className="flex">
              <div
                className="absolute mt-[-13px]"
                style={{
                  left: iconPosition.x - 35,
                  top: iconPosition.y,
                }}
              >
                <CiCirclePlus
                  className="cursor-pointer transition-transform duration-300 ease-in-out"
                  style={{
                    transform: `rotate(${isCircleClicked ? 45 : 0}deg)`,
                  }}
                  size={30}
                  onClick={handleCircleClick}
                />
              </div>
              {isCircleClicked && (
                <div
                  className="absolute hover:bg-gray-200 rounded-md p-1 h-[30px] items-center justify-center"
                  style={{
                    left: iconPosition.x - 36,
                    top: iconPosition.y + 20,
                  }}
                >
                  <button>
                    <label
                      className="rounded-md text-center m-auto cursor-pointer"
                      htmlFor="files"
                    >
                      <FaImage size={25} />
                    </label>
                    <input
                      id="files"
                      className="hidden"
                      type="file"
                      onChange={(e) => handleFileUpload(e, textEditorRef)}
                    />
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div
              className="mt-[48px] w-full p-2"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(input) }}
            />
            <button
              className="rounded-md bg-slate-300 px-5 py-1 mt-5 ml-auto"
              onClick={handleModifyButton}
            >
              Modify
            </button>
          </>
        )}
      </div>
    </div>
  );
}
