import React, { useEffect, useRef, useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../../config/firebase";
import useUserStore from "../../store/store";

export default function Header() {
  const { user, setUser, isLoggedIn, setIsLoggedIn } = useUserStore();
  const [isUserNameClicked, setIsUserNameClicked] = useState(false);
  const userNameRef = useRef();
  const navigate = useNavigate();

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
        setIsLoggedIn(true);
        setUser(response.data.user);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleLogOut() {
    try {
      await signOut(auth);

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/auth/logOut`,
        { withCredentials: true },
      );

      if (response.data.result === "ok") {
        setIsLoggedIn(false);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleLogIn() {
    try {
      const response = await signInWithPopup(auth, provider);
      const { user } = response;

      if (user) {
        logIn(user);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleUserNameClick() {
    if (isLoggedIn) {
      setIsUserNameClicked((prev) => !prev);
    }
  }

  async function checkLogIn() {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/auth/check`,
      {
        withCredentials: true,
      },
    );

    if (response.data.result) {
      setIsLoggedIn(true);
      setUser(response.data.user);
    }

    return response.data.result;
  }

  async function handleWriteClick() {
    const isLoggedIn = await checkLogIn();

    if (isLoggedIn) {
      navigate("/articles/new");
    } else {
      handleLogIn();
    }
  }

  function handleLogoClick() {
    navigate("/");
  }

  function handleMyArticlesClick() {
    navigate(`/users/${user._id}/articles`);
  }

  useEffect(() => {
    checkLogIn();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userNameRef.current && !userNameRef.current.contains(event.target)) {
        setIsUserNameClicked(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userNameRef]);

  return (
    <div
      className="flex items-center py-5 pl-7 bg-[#ffbf16]
    ] border-b-[1px] border-black sticky top-0 z-10"
    >
      <button
        className="font-bold text-[25px] cursor-pointer"
        onClick={handleLogoClick}
      >
        Tech Story
      </button>
      <div className="flex ml-auto text-[15px] font-light">
        <button
          className="mr-10 px-10 bg-black text-white rounded-full"
          onClick={handleWriteClick}
        >
          Write
        </button>
        {isLoggedIn ? (
          <div ref={userNameRef}>
            <button
              className="mr-10 px-4 py-1 bg-black text-white rounded-full"
              onClick={handleUserNameClick}
            >
              {user.displayName}
            </button>
            {isUserNameClicked && (
              <div className="absolute top-[65px] right-10 flex flex-col rounded-md border-b shadow-md bg-yellow-100">
                <div className="flex flex-col text-[15px]">
                  <div className="flex items-center hover:bg-slate-100 hover:rounded-md cursor-pointer">
                    <img
                      className="w-4 justify-center items-center m-3"
                      src="/assets/articlesLogo.png"
                      alt="articles logo"
                    />
                    <button className="mx-4" onClick={handleMyArticlesClick}>
                      My articles
                    </button>
                  </div>
                  <div className="flex items-center hover:bg-slate-100 hover:rounded-md cursor-pointer">
                    <img
                      className="w-4 justify-center items-center  m-3"
                      src="/assets/logOutLogo.png"
                      alt="logOutLogo"
                    />
                    <button className="mx-4" onClick={handleLogOut}>
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            className="mr-10 px-6 py-2 bg-black text-white rounded-full"
            onClick={handleLogIn}
          >
            Get started
          </button>
        )}
      </div>
    </div>
  );
}
