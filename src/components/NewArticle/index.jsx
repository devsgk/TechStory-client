import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import TextEditor from "../TextEditor";
import { useUserStore } from "../../store/store";
import { addIndent, correctTags } from "../../utils/cleanContent";

export default function NewArticle() {
  const { user } = useUserStore();

  const [isEditing, setIsEditing] = useState(true);
  const [isSaveClicked, setIsSaveClicked] = useState(false);
  const [input, setInput] = useState("");
  const [articleId, setArticleId] = useState("");

  const ref = useRef("");
  const navigate = useNavigate();

  async function handleSaveButton() {
    const content = ref.current.innerHTML;
    const contentWithIndent = addIndent(content);
    const articleContent = correctTags(contentWithIndent);

    setInput(articleContent);
    setIsEditing((prev) => !prev);

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/articles`,
      {
        withCredentials: true,
        user,
        articleContent,
        articleId,
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

  useEffect(() => {
    if (isEditing && ref.current) {
      ref.current.innerHTML = input;
    }
  }, [isEditing, input]);

  return (
    <div className="flex flex-col justify-center mx-10">
      <div className="flex flex-col w-full mt-10">
        {!isSaveClicked ? (
          <>
            <TextEditor
              ref={ref}
              properties={{
                enableResize: true,
              }}
            />
            <button
              className="rounded-md bg-slate-300 px-5 py-1 mt-5 ml-auto"
              onClick={handleSaveButton}
            >
              Save
            </button>
          </>
        ) : (
          <>
            <div
              className="mt-[48px] w-full p-2"
              dangerouslySetInnerHTML={{ __html: input }}
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
