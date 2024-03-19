import { useEffect, useState } from "react";
import axios from "axios";

export default function ArticlePreview({ onClick }) {
  const [articlesList, setArticlesList] = useState([]);

  useEffect(() => {
    async function getAllArticles() {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/articles/all`,
      );
      const data = response.data.allArticles;
      const publishedArticles = data.filter((el) => el.isPublished);

      setArticlesList(publishedArticles);
    }

    getAllArticles();
  }, []);

  return (
    <>
      {articlesList.length > 0 &&
        articlesList.map((el) => (
          <div
            className="ml-5 my-20 w-2/3 cursor-pointer"
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
            <div className="flex text-[#717171] mt-5 gap-5">
              <span>Mar 15, 2024</span>
              <span>
                {el.textContent.split("").length < 650
                  ? "Less than 5 min read"
                  : "More than 5 min read"}
              </span>
            </div>
          </div>
        ))}
    </>
  );
}
