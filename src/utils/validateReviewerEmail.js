import axios from "axios";

export default async function validateReviewerEmail(email) {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/users/check-email/`,
    {
      params: { email },
    },
  );

  if (response.data.result === "ok") {
    return true;
  } else {
    return false;
  }
}
