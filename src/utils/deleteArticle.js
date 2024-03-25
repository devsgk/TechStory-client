import axios from "axios";

export default async function deleteArticle(articleId) {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/articles/${articleId}`,
      {
        data: { articleId },
      },
    );
  } catch (error) {
    console.log(error);
  }
}
