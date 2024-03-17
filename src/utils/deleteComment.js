import axios from "axios";

export default async function deleteComment(styleId, articleId) {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/articles/review?articleId=${articleId}`,
      {
        data: { styleId },
      },
    );

    if (response.data.result === "ok") {
      return {
        article: response.data.article,
        cleanedArticle: response.data.cleanedArticle,
      };
    }
  } catch (error) {
    console.log(error);
  }
}
