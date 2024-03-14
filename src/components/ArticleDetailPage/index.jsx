import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { useUserStore } from "../../store/store";
import {
  checkUserIdentity,
  checkLoggedInStatus,
} from "../../utils/checkPermission";
import { handleLogIn } from "../../utils/handleLogin";

export default function ArticleDetailPage() {
  const { identity, setIsLoggedIn, setUser, setIdentity } = useUserStore();

  const [articleContent, setArticleContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [reviewersList, setReviewersList] = useState([]);

  const editorRef = useRef("");

  const navigate = useNavigate();
  const { articleId } = useParams();

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
            <form className="mt-2 space-y-4 w-full min-h-[90px]">
              <div className="flex items-center justify-between text-[15px]">
                <div className="flex items-center">
                  <input
                    className="border-2 rounded ml-5 pl-2"
                    id="reviewer0"
                    name="reviewer0"
                    placeholder="Enter reviewer's email"
                  />
                  <button className="ml-3 font-bold text-[15px]">+</button>
                  <button className="ml-3 font-bold text-[20px]">-</button>
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
                    <button className="px-2 py-1 rounded-md border bg-green-600 text-white">
                      Save
                    </button>
                  ) : (
                    <button className="px-2 py-1 rounded-md border bg-green-600 text-white">
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
