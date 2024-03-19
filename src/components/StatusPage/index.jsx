import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUserStore } from "../../store/store";
import {
  checkLoggedInStatus,
  checkUserIdentity,
} from "../../utils/checkPermission";
import { handleLogIn } from "../../utils/handleLogin";

export default function StatusPage() {
  const { user, isLoggedIn, identity, setIsLoggedIn, setUser, setIdentity } =
    useUserStore();
  const [author, setAuthor] = useState(null);
  const [reviewers, setReviewers] = useState([]);
  const [reviewList, setReviewList] = useState([]);
  const [hasApproved, setHasApproved] = useState(false);
  const [canPublish, setCanPublish] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const { articleId } = useParams();
  const navigate = useNavigate();

  async function handleApprove() {
    const response = await axios.post(
      `${
        import.meta.env.VITE_BASE_URL
      }/articles/approve?articleId=${articleId}`,
      { withCredentials: true, user },
    );

    if (response.data.result === "ok") {
      setHasApproved((prev) => !prev);
    }
  }

  async function handlePublish() {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/articles/${articleId}/publish`,
      { withCredentials: true },
    );

    if (response.data.result === "ok") {
      setIsPublished((prev) => !prev);
    }
  }

  function handleBackClick() {
    navigate(-1);
  }

  async function handleCancelPublish() {
    window.alert("Are you sure you want to cancel publish?");
    const response = await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/articles/${articleId}/publish`,
      { withCredentials: true },
    );

    if (response.data.result === "ok") {
      setIsPublished((prev) => !prev);
    }
  }

  useEffect(() => {
    async function identifyUser(articleId) {
      const userData = await checkLoggedInStatus(articleId);

      if (userData) {
        const identity = await checkUserIdentity(articleId, userData);

        setIsLoggedIn(true);
        setUser(userData);
        setIdentity(identity);

        if (identity === "unAuthorized") {
          navigate("/");
        }
      } else {
        const userData = await handleLogIn();

        if (userData) {
          const identity = await checkUserIdentity(articleId, userData);

          setIsLoggedIn(true);
          setUser(userData);
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

      const data = await response.data;
      const approvalStatus = data.article.reviewers.every(
        (el) => el.status === "approved",
      );

      const userApprovalStatus = data.article.reviewers.find(
        (el) => el.email === user.email,
      );

      if (data.result === "ok") {
        setAuthor(data.article.author.email);
        setReviewers(data.article.reviewers);
        setReviewList(data.article.reviewList);
        setCanPublish(approvalStatus);
        setIsPublished(data.article.isPublished);

        setHasApproved(
          userApprovalStatus?.status === "approved" ? true : false,
        );
      }
    }

    getArticle();
  }, [user.email, hasApproved, isPublished]);

  return (
    <>
      {identity !== "unAuthorized" && (
        <div className="flex flex-col m-10 text-[14px]">
          <h1
            className="font-bold text-[20px] mb-5 cursor-pointer"
            onClick={handleBackClick}
          >
            Back
          </h1>
          <h1 className="font-bold text-[20px]">Article Description</h1>

          <div className="flex flex-col items-left my-3">
            <span className="font-bold">Author</span>
            <div className="flex my-2">
              <img
                className="rounded-full w-5 mx-4"
                src="/assets/authorIcon.png"
                alt="author icon"
              />
              {author}
            </div>
          </div>

          <div className="flex flex-col items-left my-3">
            <span className="font-bold">Reviewers:</span>
            <div className="flex flex-col my-2">
              {reviewers.map((el) => (
                <div className="flex mx-2 my-1" key={el.email}>
                  <img
                    className="rounded-full w-5 mx-2 mr-4"
                    src="/assets/reviewerIcon.png"
                    alt="reviewer icon"
                  />
                  <span key={el.email}>
                    <div className="flex items-center gap-3">
                      {el.email}
                      {el.status === "approved" ? (
                        <img
                          className="w-4 h-4"
                          src="/assets/resolveIcon1.png"
                          alt="approved icon"
                        />
                      ) : (
                        <img
                          className="w-4 h-4"
                          src="/assets/pending.png"
                          alt="pending"
                        />
                      )}
                    </div>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <span className="font-bold my-2">Published Status</span>
            {isPublished ? (
              <div className="mx-2 text-green-600">Published</div>
            ) : (
              <div className="mx-2 ml-4 text-gray-600">
                {isPublished ? "Pulished" : "Draft"}
              </div>
            )}
          </div>

          {reviewList.length > 0 && (
            <div className="mt-10 font-bold text-[18px]">
              Comments
              {reviewList.map((el, index) => (
                <p key={index} className="text-[14px] font-normal">
                  : {el.comment} ({el.creator.displayName})
                </p>
              ))}
            </div>
          )}

          {user.email === author && (
            <>
              {!isPublished && (
                <>
                  <div
                    className={`mt-10 mb-3 text-[15px] font-bold ${
                      canPublish ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {canPublish ? "You can publish!" : "Not approved yet..."}
                  </div>

                  <button
                    className={`border p-1 rounded-md w-[150px] text-[15px] text-white font-bold ${
                      canPublish ? "cursor-pointer" : ""
                    }
                ${canPublish ? "bg-green-600" : "bg-red-500"}
                `}
                    disabled={canPublish ? false : true}
                    onClick={handlePublish}
                    type="button"
                    disable="true"
                  >
                    {canPublish ? "Publish" : "Cannot publish"}
                  </button>
                </>
              )}

              {isPublished && (
                <>
                  <div
                    className="mt-10 mb-3 text-[15px] font-bold
                      text-green-600"
                  >
                    Undo publish?
                  </div>

                  <button
                    className="border p-1 rounded-md w-[150px] text-[15px] text-white font-bold cursor-pointer bg-green-600"
                    onClick={handleCancelPublish}
                    type="button"
                  >
                    Undo publish
                  </button>
                </>
              )}
            </>
          )}

          {reviewers.some((el) => el.email === user.email) && (
            <>
              {!isPublished && (
                <>
                  <div
                    className={`mt-10 mb-3 text-[15px] font-bold ${
                      hasApproved ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {hasApproved
                      ? "You have already approved!"
                      : "Approve your review"}
                  </div>
                  <button
                    className={`border p-1 rounded-md w-[150px] text-[15px] text-white font-bold ${
                      hasApproved
                        ? "bg-green-600 "
                        : "bg-red-500 hover:bg-green-600"
                    }`}
                    onClick={handleApprove}
                    type="button"
                    disabled={hasApproved ? true : false}
                  >
                    {hasApproved ? "Already approved" : "Approve"}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
