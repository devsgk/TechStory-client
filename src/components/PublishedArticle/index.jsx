import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";

import Title from "../Title";

export default function PublishedArticle() {
  const [title, setTitle] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [authorDisplayName, setAuthorDisplayName] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [readTime, setReadTime] = useState(0);
  const { articleId } = useParams();
  const [createdAt, setCreatedAt] = useState("");

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
        setReadTime(
          Math.max(parseInt(response.data.article.textContent.length / 250), 1),
        );
        setTitle(response.data.article.title);
        setPhotoURL(response.data.article.author.photoURL);
        setAuthorDisplayName(response.data.article.author.displayName);
        setArticleContent(response.data.cleanedArticle);
        setCreatedAt(response.data.article.createdAt);
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
          <span className="text-[#717171]">{readTime} min read</span>
        </div>
        <span className="ml-auto mt-auto text-[#717171]">
          {createdAt.slice(0, 10)}
        </span>
      </div>
      <Title
        title={title}
        onTitleChange={(e) => setTitle(e.target.value)}
        readOnly={true}
      />
      <div className="flex">
        <div
          className="w-full p-2"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(articleContent),
          }}
        />
      </div>
    </div>
  );
}
