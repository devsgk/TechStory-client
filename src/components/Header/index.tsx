import { useEffect, useRef, useState } from "react";
import { signInWithPopup, signOut, User } from "firebase/auth";
import axios from "axios";
import { MdOutlineArticle } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";

import { useNavigate } from "react-router-dom";
import { auth, provider } from "../../config/firebase";
import { useUserStore } from "../../store/store";

export default function Header() {
  const { user, setUser, isLoggedIn, setIsLoggedIn } = useUserStore();
  const [isUserNameClicked, setIsUserNameClicked] = useState(false);
  const userNameRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  async function logIn(user: User) {
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

    setIsUserNameClicked(false);
  }

  function handleUserNameClick() {
    if (isLoggedIn) {
      setIsUserNameClicked((prev) => !prev);
    }
  }

  async function checkLogIn() {
    try {
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

      setIsUserNameClicked(false);

      return response.data.result;
    } catch (error) {
      console.log(error);
    }
  }

  async function handleWriteClick() {
    const isLoggedIn = await checkLogIn();

    if (isLoggedIn) {
      navigate("/articles/new");
    } else {
      handleLogIn();
    }

    setIsUserNameClicked(false);
  }

  function handleLogoClick() {
    setIsUserNameClicked(false);
    navigate("/");

    if (headerRef.current) {
      const elementTopPosition = headerRef.current.getBoundingClientRect().top;

      window.scrollTo({ top: elementTopPosition, behavior: "smooth" });
    }
  }

  function handleMyArticlesClick() {
    setIsUserNameClicked(false);
    navigate(`/users/${user!._id}/articles`);
  }

  useEffect(() => {
    checkLogIn();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userNameRef.current &&
        !userNameRef.current.contains(event.target as Node)
      ) {
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
      style={{ paddingLeft: "19%", paddingRight: "19%" }}
      ref={headerRef}
    >
      <button
        className="font-bold text-[25px] cursor-pointer"
        onClick={handleLogoClick}
      >
        Tech Story
      </button>
      <div className="flex ml-auto text-[15px] font-light">
        <button
          className="ml-10 px-10 bg-black text-white rounded-full"
          onClick={handleWriteClick}
        >
          Write
        </button>
        {isLoggedIn ? (
          <div ref={userNameRef}>
            <button
              className="ml-10 px-4 py-1 bg-black text-white rounded-full"
              onClick={handleUserNameClick}
            >
              {user!.displayName}
            </button>
            {isUserNameClicked && (
              <div className="absolute top-[65px] right-30 flex flex-col rounded  bg-white shadow-xl border">
                <div className="flex flex-col text-[15px]">
                  <div
                    className="flex items-center hover:bg-slate-100 hover:rounded-md cursor-pointer"
                    onClick={handleMyArticlesClick}
                  >
                    <div className="justify-center items-center m-3">
                      <MdOutlineArticle size={20} />
                    </div>
                    <button className="mx-4">My articles</button>
                  </div>
                  <div
                    className="flex items-center hover:bg-slate-100 hover:rounded-md cursor-pointer"
                    onClick={handleLogOut}
                  >
                    <div className="justify-center items-center m-3">
                      <IoLogOutOutline size={23} />
                    </div>
                    <button className="mx-4">Log Out</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            className="ml-10 px-10 py-1 bg-black text-white rounded-full"
            onClick={handleLogIn}
          >
            Get started
          </button>
        )}
      </div>
    </div>
  );
}
