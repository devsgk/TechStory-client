import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { useUserStore } from "../../store/store";
import TextEditor from "../TextEditor";
import { addIndent, correctTags } from "../../utils/cleanContent";
import {
  checkUserIdentity,
  checkLoggedInStatus,
} from "../../utils/checkPermission";
import { handleLogIn } from "../../utils/handleLogin";

export default function ArticleDetailPage() {
  const { user, identity, setIsLoggedIn, setUser, setIdentity } =
    useUserStore();

  const [articleContent, setArticleContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [reviewersList, setReviewersList] = useState([]);

  const editorRef = useRef("");
  const previewRef = useRef("");

  const navigate = useNavigate();
  const { articleId } = useParams();

  function handleAddButton(e) {
    e.preventDefault();

    if (!emailInput.trim()) {
      return;
    }

    if (reviewersList.length < 5) {
      setReviewersList((prev) => [...prev, emailInput]);
    } else {
      window.alert("Maximum 5 reviewers allowed!");
    }

    setEmailInput("");
  }

  function handleRemoveButton(e) {
    e.preventDefault();

    const newReviewersList = reviewersList.slice(0, reviewersList.length - 1);

    setReviewersList(newReviewersList);
  }

  function handleEmailInputChange(e) {
    setEmailInput(e.target.value);
  }

  async function handleRequestReviewButton(e) {
    e.preventDefault();

    if (reviewersList.length === 0) {
      window.alert("Add reviewers!");
      return;
    }

    const url = window.location.href;
    const emailList = reviewersList;

    await axios.post(`${import.meta.env.VITE_BASE_URL}/articles/email`, {
      withCredentials: true,
      emailList,
      url,
      articleId,
    });
  }

  async function handleModifyButton(e) {
    e.preventDefault();

    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/articles?articleId=${articleId}`,
      {
        withCredentials: true,
      },
    );

    if (response.data.result === "ok") {
      const articleContent = response.data.article.editorContent;

      setArticleContent(articleContent);
      setIsEditing(true);
    }
  }

  async function handleSaveButton(e) {
    e.preventDefault();

    const content = editorRef.current.innerHTML;
    const contentWithIndent = addIndent(content);
    const articleContent = correctTags(contentWithIndent);

    setArticleContent(articleContent);
    setIsEditing(false);

    await axios.post(`${import.meta.env.VITE_BASE_URL}/articles`, {
      withCredentials: true,
      user,
      articleContent,
      articleId,
    });
  }

  useEffect(() => {
    async function identifyUser(articleId) {
      const userData = await checkLoggedInStatus(articleId);

      if (userData) {
        const identity = await checkUserIdentity(articleId, userData);

        setIdentity(identity);

        if (identity === "unAuthorized") {
          navigate("/");
        }
      } else {
        const userData = await handleLogIn();

        if (userData) {
          setIsLoggedIn(true);
          setUser(userData);

          const identity = await checkUserIdentity(articleId, userData);

          setIdentity(identity);

          if (identity === "unAuthorized") {
            navigate("/");
          }
        }
      }
    }

    identifyUser(articleId);

    async function getArticle() {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/articles?articleId=${articleId}`,
        {
          withCredentials: true,
          articleId,
        },
      );

      if (response.data.result === "ok") {
        setArticleContent(response.data.article.previewContent);

        const fetchedReviewersList = [];

        for (const reviewerObj of response.data.article.reviewers) {
          fetchedReviewersList.push(reviewerObj.email);
        }

        setReviewersList(fetchedReviewersList);
      }
    }

    getArticle();
  }, []);

  useEffect(() => {
    if (isEditing && editorRef.current) {
      editorRef.current.innerHTML = articleContent;
    }
  }, [isEditing, articleContent]);

  return (
    <>
      {identity !== "unAuthorized" && (
        <div className="ml-20 w-4/5">
          {identity === "author" && (
            <form
              className="mt-2 space-y-4 w-full min-h-[90px]"
              onSubmit={handleRequestReviewButton}
            >
              <div className="flex items-center justify-between text-[15px]">
                <div className="flex items-center">
                  <input
                    className="border-2 rounded ml-5 pl-2"
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
                </div>
                <div className="space-x-5 text-[14px]">
                  <button
                    className="px-2 py-1 rounded-md border bg-green-600 text-white"
                    type="submit"
                  >
                    Request review
                  </button>
                  <button
                    className="px-2 py-1 rounded-md border bg-green-600 text-white"
                    type="button"
                  >
                    Status
                  </button>
                  {isEditing ? (
                    <button
                      className="px-2 py-1 rounded-md border bg-green-600 text-white"
                      onClick={(e) => handleSaveButton(e)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="px-2 py-1 rounded-md border bg-green-600 text-white"
                      onClick={handleModifyButton}
                    >
                      Modify
                    </button>
                  )}
                </div>
              </div>
              <div className="flex text-[13px] font-bold ml-3">
                {reviewersList.length > 0 && <span>Reviewers:</span>}
                {reviewersList.map((el, index) => (
                  <span className="text-blue-700" key={el}>
                    <span className="ml-4 mr-4">
                      {index !== 0 && index !== reviewersList.length && "|"}
                    </span>
                    {el}
                  </span>
                ))}
              </div>
            </form>
          )}
        </div>
      )}
    </>
  );
}
