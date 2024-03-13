import React, { useEffect } from "react";
import axios from "axios";

export default function App() {
  useEffect(() => {
    async function getArticle() {
      await axios.get(`${import.meta.env.VITE_BASE_URL}/articles`);
    }
    getArticle();
  });
  return <div>Hello react</div>;
}
