import axios from "axios";

export default async function getArticle(articleId) {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/articles?articleId=${articleId}`,
    {
      withCredentials: true,
    },
  );

  if (response.data.result === "ok") {
    return response.data.article;
  }
}
