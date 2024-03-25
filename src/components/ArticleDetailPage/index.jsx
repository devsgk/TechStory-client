import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import DOMPurify from "dompurify";

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
import deleteArticle from "../../utils/deleteArticle";
import { CiCirclePlus } from "react-icons/ci";
import { FaImage } from "react-icons/fa";
import { handleFileUpload } from "../../utils/styleText";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import SavedModal from "../SavedModal";
import ModifyingModal from "../ModifyingModal";

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
  const [requestStatus, setRequestStatus] = useState("idle");
  const [iconPosition, setIconPosition] = useState({ x: -10000, y: -10000 });
  const [isCircleClicked, setIsCircleClicked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isModifying, setIsModifying] = useState(false);

  const editorRef = useRef("");
  const previewRef = useRef("");
  const reviewRef = useRef("");
  const titleInputRef = useRef();

  const navigate = useNavigate();
  const { articleId } = useParams();

  async function handleAddButton(email) {
    const isRegistered = await validateReviewerEmail(email);

    if (!isRegistered) {
      setIsValidReviewer(false);
      return;
    }

    setIsValidReviewer(true);

    if (reviewersList.length < 3) {
      setReviewersList((prev) => [...prev, email]);
    } else {
      window.alert("Maximum 2 reviewers allowed!");
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

    setRequestStatus("loading");

    const url = window.location.href;
    const emailList = reviewersList;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/articles/email`,
        {
          withCredentials: true,
          emailList,
          url,
          articleId,
        },
      );

      if (response.data.result === "ok") {
        setRequestStatus("idle");
        window.alert("Request sent successfully!");
      }
    } catch (error) {
      console.log(error);
    }
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
      setIsSaved(false);
      setIsModifying(true);
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
    setIsSaved(true);
    setIsModifying(false);

    await axios.post(`${import.meta.env.VITE_BASE_URL}/articles`, {
      withCredentials: true,
      user,
      articleContent,
      articleId,
      textContent,
      title,
    });
  }

  async function handleDeleteButton(e) {
    e.stopPropagation();

    if (confirm("Are you sure you want to DELETE the article?")) {
      await deleteArticle(articleId);

      navigate(`/users/${user._id}/articles`);
    }
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

    const editorOffsetLeft = editorRef.current.offsetLeft;

    const lineHeight = parseInt(
      window.getComputedStyle(dummySpan.parentNode).lineHeight,
    );
    const yPosition = rect.top + rect.height - lineHeight / 2 + window.scrollY;
    const position = { x: editorOffsetLeft, y: yPosition };

    if (parseInt(position.y) === 182) {
      position.y += 15;
    } else if (parseInt(position.y) === 347) {
      position.y -= 10;
    } else {
    }
    dummySpan.parentNode.removeChild(dummySpan);

    return position;
  }

  function handleCircleClick() {
    setIsCircleClicked((prev) => !prev);
  }

  function handleKeyDown(e) {
    if (e.key === "Tab" || e.key === "Enter") {
      e.preventDefault();

      if (editorRef.current) {
        editorRef.current.focus();
      }
    }
  }

  return (
    <>
      {identity !== "unAuthorized" && (
        <div
          className="mx-10"
          style={{ paddingLeft: "10%", paddingRight: "10%" }}
        >
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
                onDelete={handleDeleteButton}
                requestStatus={requestStatus}
                reviewersList={reviewersList}
                onRemoveEmail={handleRemoveButton}
              />
            </>
          )}

          {identity === "reviewer" && (
            <div className="flex my-5 justify-end space-x-3 mb-[80px]">
              <button
                className="p-2 rounded-md border hover:bg-gray-100"
                type="button"
                onClick={() => navigate(-1)}
              >
                <IoIosArrowBack />
              </button>
              <button
                className="px-2 py-1 rounded-md border text-[13px] hover:bg-gray-100"
                type="button"
                onClick={handleFinishReview}
              >
                Finish Review
              </button>
              <button
                className="p-2 rounded-md border hover:bg-gray-100"
                type="button"
                onClick={handleFinishReview}
              >
                <IoIosArrowForward />
              </button>
            </div>
          )}

          <SavedModal isOpen={isSaved} />
          <ModifyingModal isOpen={isModifying} />

          {isEditing ? (
            <>
              <input
                className={`text-5xl outline-none ${title.trim().length === 0 && showTitleError ? "border-red-500 border-2 rounded-md" : ""} w-full mb-5`}
                placeholder="  Title"
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
                ref={editorRef}
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
                    left: iconPosition.x - 40,
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
                      left: iconPosition.x - 32,
                      top: iconPosition.y + 30,
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
                        onChange={(e) => handleFileUpload(e, editorRef)}
                      />
                    </button>
                  </div>
                )}
              </div>
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
                  className="w-full mb-10 break-after-all"
                  style={{ fontSize: "21px" }}
                  onMouseUp={handleMouseUp}
                  ref={previewRef}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(articleContent),
                  }}
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
