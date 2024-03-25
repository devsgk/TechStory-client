import axios from "axios";

export default async function deleteComment(styleId, articleId) {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/articles/${articleId}/review`,
      {
        data: { articleId, styleId },
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
