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
