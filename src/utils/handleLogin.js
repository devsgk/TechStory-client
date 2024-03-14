import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../config/firebase";
import axios from "axios";

async function logIn(user) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/auth/logIn`,
      user,
      {
        headers: {
          "content-Type": "application/json",
        },
        withCredentials: true,
      },
    );

    if (response.data.result === "ok") {
      return response.data.user;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function handleLogIn() {
  try {
    const response = await signInWithPopup(auth, provider);
    const { user } = response;

    if (user) {
      return await logIn(user);
    }
  } catch (error) {
    console.log(error);
  }
}
