import { useNavigate } from "react-router-dom";

import ArticlePreview from "../ArticlePreview";
import { useRef } from "react";

export default function MainPage() {
  const navigate = useNavigate();
  const mainRef = useRef(null);

  function handleClick() {
    if (mainRef.current) {
      const elementTopPosition =
        mainRef.current.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementTopPosition - 100;

      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  }

  function handlePreviewClick(el) {
    navigate(`/articles/${el._id}/published`);
  }
  return (
    <>
      <div
        className="flex flex-col justify-center pl-7 bg-[#ffbf16]
    border-b-[1px] border-black"
        style={{ paddingLeft: "19%" }}
      >
        <h1 className="mt-[100px] mb-[20px] text-[106px]">
          <p className="font-serif">Stay hungry.</p>
        </h1>
        <div className="mt-3 text-2xl w-[500px]">
          Explore stories, insights, and experiences from experts in tech
          industry.
        </div>
        <button
          className="rounded-full mt-10 mb-[100px] mr-auto text-xl font-light py-2 px-12 bg-black text-white"
          onClick={handleClick}
        >
          Start reading
        </button>
      </div>
      <div
        className="mt-[100px] mb-[150px]"
        ref={mainRef}
        style={{ paddingLeft: "19%", paddingRight: "19%" }}
      >
        <ArticlePreview onClick={handlePreviewClick} />
      </div>
    </>
  );
}
