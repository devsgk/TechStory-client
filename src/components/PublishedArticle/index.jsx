import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";
import Title from "../Title";

export default function PublishedArticle() {
  const [title, setTitle] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [authorDisplayName, setAuthorDisplayName] = useState("");
  const [articleContent, setArticleContent] = useState("");

  const { articleId } = useParams();

  useEffect(() => {
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
        setPhotoURL(response.data.article.author.photoURL);
        setAuthorDisplayName(response.data.article.author.displayName);
        setArticleContent(response.data.cleanedArticle);
      }
    }

    getArticle(articleId);
  }, []);

  return (
    <div className="my-10" style={{ paddingLeft: "19%", paddingRight: "19%" }}>
      <div className="flex gap-2 items-center my-3 mb-[100px]">
        <img
          className="w-12 h-12 rounded-full"
          src={photoURL}
          alt="author's photoURL"
        />
        <div className="flex flex-col ml-2">
          <span>{authorDisplayName}</span>
          <span className="text-[#717171]">5 min read</span>
        </div>
      </div>
      <Title
        title={title}
        onTitleChange={(e) => setTitle(e.target.value)}
        readOnly={true}
      />
      <div className="flex">
        <div
          className="w-full p-2"
          dangerouslySetInnerHTML={{ __html: articleContent }}
        />
      </div>
    </div>
  );
}
