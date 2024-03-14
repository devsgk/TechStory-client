import axios from "axios";

export async function checkLoggedInStatus() {
  const loggedInStatusResponse = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/auth/check`,
    {
      withCredentials: true,
    },
  );
  const userData = await loggedInStatusResponse.data.user;

  return userData;
}

export async function checkUserIdentity(articleId, userData) {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/articles?articleId=${articleId}`,
    {
      withCredentials: true,
      articleId,
    },
  );

  const data = response.data;
  const isReviewer = data.article.reviewers.some(
    (el) => el.user === userData._id,
  );
  const isAuthor = data.article.author === userData._id;
  let identity;

  if (isReviewer) {
    identity = "reviewer";
  } else if (isAuthor) {
    identity = "author";
  } else {
    identity = "unAuthorized";
  }

  return identity;
}
