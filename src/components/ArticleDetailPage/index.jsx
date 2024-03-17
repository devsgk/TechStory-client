import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import { useUserStore, useReviewListStore } from "../../store/store";
import TextEditor from "../TextEditor";
import ReviewFormContainer from "../ReviewFormContainer";
import ReviewForm from "../ReviewForm";
import ReviewModal from "../ReviewModal";
import AuthorActionsForm from "../AuthorActionsForm";
import Title from "../Title";
import CommentPopup from "../CommentPopup";

import { addIndent, correctTags } from "../../utils/cleanContent";
import { handleLogIn } from "../../utils/handleLogin";
import {
  checkUserIdentity,
  checkLoggedInStatus,
} from "../../utils/checkPermission";
import { createPopupModal, styleSelectedArea } from "../../utils/commentPopup";
import getArticle from "../../utils/getArticle";
import saveComment from "../../utils/saveComment";
import deleteComment from "../../utils/deleteComment";
import "../styles.css";
import validateReviewerEmail from "../../utils/validateReviewerEmail";

export default function ArticleDetailPage() {
  const { user, identity, setIsLoggedIn, setUser, setIdentity } =
    useUserStore();
  const { styleId, setStyleId } = useReviewListStore();

  const [articleContent, setArticleContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [reviewersList, setReviewersList] = useState([]);
  const [position, setPosition] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showPopupModal, setShowPopupModal] = useState(false);
  const [originalRange, setOriginalRange] = useState(null);
  const [reviewList, setReviewList] = useState([]);
  const [hoveredReviewId, setHoveredReviewId] = useState(null);
  const [title, setTitle] = useState("");
  const [showTitleError, setShowTitleError] = useState(false);
  const [isValidReviewer, setIsValidReviewer] = useState(true);

  const editorRef = useRef("");
  const previewRef = useRef("");
  const reviewRef = useRef("");

  const navigate = useNavigate();
  const { articleId } = useParams();

  async function handleAddButton(email) {
    const isRegistered = await validateReviewerEmail(email);

    if (!isRegistered) {
      setIsValidReviewer(false);
      return;
    }

    setIsValidReviewer(true);

    if (reviewersList.length < 5) {
      setReviewersList((prev) => [...prev, email]);
    } else {
      window.alert("Maximum 5 reviewers allowed!");
    }
  }

  function handleRemoveButton() {
    const newReviewersList = reviewersList.slice(0, reviewersList.length - 1);

    setReviewersList(newReviewersList);
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

    if (title.trim().length === 0) {
      setShowTitleError(true);

      return;
    }

    const content = editorRef.current.innerHTML;
    const textContent = editorRef.current.textContent;
    const contentWithIndent = addIndent(content);
    const articleContent = correctTags(contentWithIndent);

    setArticleContent(articleContent);
    setIsEditing(false);
    setShowTitleError(false);

    await axios.post(`${import.meta.env.VITE_BASE_URL}/articles`, {
      withCredentials: true,
      user,
      articleContent,
      articleId,
      textContent,
      title,
    });
  }

  async function handleMouseUp() {
    const selection = window.getSelection();
    const originalRange = selection.getRangeAt(0);

    if (originalRange.collapsed) {
      const updatedArticle = await getArticle(articleId);

      setArticleContent(updatedArticle.editorContent);
      setShowReviewForm(false);
      setShowPopupModal(false);

      return;
    }

    createPopupModal(selection, originalRange, setPosition, setShowPopupModal);
    setOriginalRange(originalRange);
  }

  function handlePopupClick() {
    const span = document.createElement("span");
    span.id = uuidv4();

    setStyleId(span.id);
    styleSelectedArea(originalRange, span);

    const styledArticle = previewRef.current.innerHTML;

    setArticleContent(styledArticle);
    setShowReviewForm(true);
    setShowPopupModal(false);
  }

  async function handleReviewFormCancel() {
    const fetchedArticle = await getArticle(articleId);

    setArticleContent(fetchedArticle.editorContent);
    setShowReviewForm(false);
    setShowPopupModal(false);

    return;
  }

  async function handleReviewFormSave(comment) {
    if (comment.trim().length === 0) {
      return null;
    }

    const content = previewRef.current.innerHTML;
    const contentWithIndent = addIndent(content);
    const articleContent = correctTags(contentWithIndent);
    const commentObj = {
      comment,
      styleId,
      position: { top: position.y },
      creator: user,
    };

    setArticleContent(articleContent);
    setShowReviewForm(false);

    await saveComment(articleContent, articleId, commentObj);

    const updatedArticle = await getArticle(articleId);
    const fetchedReviewList = updatedArticle.reviewList;

    setReviewList(fetchedReviewList);
  }

  function handleMouseEnter(e) {
    const styleId = e.currentTarget.id;
    const span = document.getElementById(styleId);

    if (span && span !== e.currentTarget) {
      span.style.backgroundColor = "#F8E473";
    } else {
      span.style.backgroundColor = "#FFCCCB";
    }

    setHoveredReviewId(styleId);
  }

  function handleMouseLeave(e) {
    const styleId = e.currentTarget.id;
    const span = document.getElementById(styleId);

    if (span && span !== e.currentTarget) {
      span.style.backgroundColor = "#FFFDD0";
    } else {
      span.style.backgroundColor = "#FFFFFF";
    }

    setHoveredReviewId(null);
  }

  async function handleResolveClick(e) {
    const styleId = e.target.id;

    const response = await deleteComment(styleId, articleId);

    setArticleContent(response.cleanedArticle);
    setReviewList(response.article.reviewList);
  }

  function handleFinishReview() {
    navigate(`/articles/${articleId}/status`);
  }

  function handleEmailRemoveClick(e) {
    const removedEmail = e.target.textContent;
    const newReviewersList = reviewersList.filter((el) => el !== removedEmail);

    setReviewersList(newReviewersList);
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
        setTitle(response.data.article.title);
        setArticleContent(response.data.article.previewContent);
        setReviewList(response.data.article.reviewList);

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
            <>
              <AuthorActionsForm
                onRequestReviewClick={handleRequestReviewButton}
                onSave={handleSaveButton}
                onModify={handleModifyButton}
                isEditing={isEditing}
                onAddReviewer={handleAddButton}
                onRemoveReviewer={handleRemoveButton}
                articleId={articleId}
                isValidReviewer={isValidReviewer}
              />
              <div className="flex text-sm font-bold ml-3 my-2 py-2 items-center">
                {<span className="my-4 py-3 text-[17px]">Reviewers:</span>}
                {reviewersList.length === 0 ? (
                  <div className="m-4 text-red-400">No reviewers added</div>
                ) : (
                  reviewersList.map((el, index) => (
                    <div
                      className="relative group m-4"
                      key={el}
                      onClick={handleEmailRemoveClick}
                    >
                      <span className="text-green-600 p-2 border border-transparent hover:border-red-500 hover:bg-red-50 rounded shake cursor-pointer inline-block">
                        {el}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {identity === "reviewer" && (
            <>
              <button
                className="px-2 py-1 mt-10 rounded-md border text-[13px] bg-green-600 hover:bg-green-500 text-white"
                type="button"
                onClick={handleFinishReview}
              >
                Finish Review
              </button>
            </>
          )}

          {isEditing ? (
            <>
              <Title
                title={title}
                onTitleChange={(e) => setTitle(e.target.value)}
                showTitleError={showTitleError}
              />
              <TextEditor
                ref={editorRef}
                properties={{
                  enableResize: true,
                }}
              />
            </>
          ) : (
            <>
              <Title
                title={title}
                onTitleChange={(e) => setTitle(e.target.value)}
                readOnly={true}
              />
              <div className="flex">
                <div
                  className="w-full p-2"
                  onMouseUp={handleMouseUp}
                  ref={previewRef}
                  dangerouslySetInnerHTML={{ __html: articleContent }}
                />
              </div>
            </>
          )}

          {showPopupModal && (
            <CommentPopup position={position} onPopupClick={handlePopupClick} />
          )}

          {showReviewForm && (
            <ReviewFormContainer position={position} ref={reviewRef}>
              <ReviewForm
                onReviewFormSave={(comment) => handleReviewFormSave(comment)}
                onReviewFormCancel={handleReviewFormCancel}
              />
            </ReviewFormContainer>
          )}

          {reviewList.map((el) => (
            <ReviewModal
              key={el.styleId}
              element={el}
              hoveredReviewId={hoveredReviewId}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onResolveClick={handleResolveClick}
            />
          ))}
        </div>
      )}
    </>
  );
}
