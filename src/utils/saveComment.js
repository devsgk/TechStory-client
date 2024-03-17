import axios from "axios";

export default async function saveComment(
  articleContent,
  articleId,
  commentObj,
) {
  await axios.post(`${import.meta.env.VITE_BASE_URL}/articles/review`, {
    withCredentials: true,
    articleContent,
    articleId,
    commentObj,
  });
}
