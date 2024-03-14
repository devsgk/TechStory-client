import { Route, Routes } from "react-router-dom";
import Header from "../Header";
import MainPage from "../MainPage";
import ErrorPage from "../ErrorPage";
import NewArticle from "../NewArticle";
import ArticleDetailPage from "../ArticleDetailPage";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" exact element={<MainPage />} />
        <Route path="/articles/new" element={<NewArticle />} />
        <Route path="/articles/:articleId" element={<ArticleDetailPage />} />
        <Route path="*" element={<ErrorPage errorMessage="404 Not Found!" />} />
      </Routes>
    </>
  );
}

export default App;
