import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoIosMore } from "react-icons/io";

import { useUserStore } from "../../store/store";
import deleteArticle from "../../utils/deleteArticle";

export default function ArticlePreview({ onClick }) {
  const { user } = useUserStore();
  const [articlesList, setArticlesList] = useState([]);
  const [moreModalIndex, setMoreModalIndex] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const buttonRefs = useRef([]);
  const modalRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    async function getAllArticles() {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/articles/all`,
      );

      if (response.data.result === "ok") {
        const data = response.data.allArticles;
        const publishedArticles = data.filter((el) => el.isPublished);

        setArticlesList(publishedArticles);
      }
    }

    getAllArticles();

    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setMoreModalIndex(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  function handleMoreClick(e, index) {
    e.stopPropagation();

    setMoreModalIndex(index === moreModalIndex ? null : index);

    const buttonPosition = buttonRefs.current[index].getBoundingClientRect();

    setModalPosition({ top: buttonPosition.buttom, left: buttonPosition.left });
  }

  function handleModifyButton(e, el) {
    e.stopPropagation();

    const articleId = el._id;

    navigate(`/articles/${articleId}`);
  }

  async function handleDeleteButton(e, el) {
    e.stopPropagation();
    const articleId = el._id;

    if (confirm("Are you sure you want to DELETE the article?")) {
      await deleteArticle(articleId);
      window.location.reload();
    }
  }

  return (
    <>
      {articlesList.length > 0 &&
        articlesList.map((el, index) => (
          <div
            className="ml-5 w-2/3 cursor-pointer"
            key={el._id}
            onClick={() => onClick(el)}
          >
            <div className="flex gap-2 items-center my-3">
              <img
                className="w-6 h-6 rounded-full"
                src={el.author.photoURL}
                alt="author's photoURL"
              />
              <span className="font-bold text-small">
                {el.author.displayName}
              </span>
            </div>
            <p className="font-bold text-2xl my-2">{el.title}</p>
            <p>{el.textContent.slice(0, 300)}...</p>
            <div className="flex text-[#717171] mt-5 gap-5 items-center">
              <span>{el.createdAt.slice(0, 10)}</span>
              <span>
                {Math.max(parseInt(el.textContent.split("").length / 250), 1) +
                  " min read"}
              </span>
              <span
                className="ml-auto text-gray-500 hover:text-black hover:bg-gray-200 rounded-md p-1"
                ref={(ref) => (buttonRefs.current[index] = ref)}
                onClick={(e) => handleMoreClick(e, index)}
              >
                {user.email === el.author.email && <IoIosMore size={30} />}
              </span>
            </div>
            {index === moreModalIndex && (
              <div
                ref={modalRef}
                className="absolute flex flex-col bg-white border rounded w-[130px]"
                style={{
                  top: modalPosition.top,
                  left: modalPosition.left - 50,
                }}
              >
                <button
                  className="hover:bg-gray-200 p-3"
                  onClick={(e) => handleModifyButton(e, el)}
                >
                  Modify
                </button>
                <button
                  className="hover:bg-gray-200 p-3 text-red-500"
                  onClick={(e) => handleDeleteButton(e, el)}
                >
                  Delete
                </button>
              </div>
            )}

            <hr className="bg-gray-100 h-[1px] my-10" />
          </div>
        ))}
    </>
  );
}
