import { Route, Routes } from "react-router-dom";
import Header from "../Header";
import MainPage from "../MainPage";
import ErrorPage from "../ErrorPage";
import NewArticle from "../NewArticle";
import ArticleDetailPage from "../ArticleDetailPage";
import StatusPage from "../StatusPage";
import ArticleListPage from "../ArticleListPage";
import PublishedArticle from "../PublishedArticle";

const App: React.FC = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/articles/new" element={<NewArticle />} />
        <Route path="/articles/:articleId" element={<ArticleDetailPage />} />
        <Route path="/articles/:articleId/status" element={<StatusPage />} />
        <Route
          path="/articles/:articleId/published"
          element={<PublishedArticle />}
        />
        <Route path="/users/:userId/articles" element={<ArticleListPage />} />
        <Route path="*" element={<ErrorPage errorMessage="404 Not Found!" />} />
      </Routes>
    </>
  );
};

export default App;
