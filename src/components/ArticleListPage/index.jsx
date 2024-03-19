import React, { useEffect, useState } from "react";
import { useUserStore } from "../../store/store";
import axios from "axios";

import ArticleListTable from "../ArticleListTable";

export default function ArticleListPage() {
  const { user } = useUserStore();
  const [authoredArticles, setAuthoredArticles] = useState([]);
  const [reviewedArticles, setReviewedArticles] = useState([]);

  useEffect(() => {
    async function getMyArticles() {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/${user._id}/articles`,
      );

      const data = await response.data;
      if (data.result === "ok") {
        setAuthoredArticles(data.authoredArticles);
        setReviewedArticles(data.reviewedArticles);
      }
    }

    if (user._id) {
      getMyArticles();
    }
  }, [user]);

  return (
    <div
      className="flex flex-col mb-10"
      style={{ paddingLeft: "19%", paddingRight: "19%" }}
    >
      <ArticleListTable type={"Authored Articles"} list={authoredArticles} />
      <ArticleListTable type={"Reviewed Articles"} list={reviewedArticles} />
    </div>
  );
}
