import { useNavigate } from "react-router-dom";

export default function ArticleListTable({ type, list }) {
  const navigate = useNavigate();

  function handleArticleListClick(e) {
    const articleId = e.currentTarget.id;

    navigate(`/articles/${articleId}`);
  }
  return (
    <>
      <h1 className="text-left font-bold text-[15px] my-5 border w-fit px-2 py-1 bg-green-700 rounded-md text-white">
        {type}
      </h1>
      <div className="overflow-hidden rounded-lg border p-1">
        <table className="text-center w-full border-collapse">
          <thead>
            <tr>
              <th scope="col" className="w-2/12">
                Title
              </th>
              <th scope="col" className="w-4/12">
                Preview
              </th>
              <th scope="col" className="w-4/12">
                Reviewers
              </th>
              <th scope="col" className="w-2/12">
                Status
              </th>
            </tr>
          </thead>

          {list.length > 0 ? (
            <tbody className="rounded-md">
              {list.map((el, index) => (
                <tr
                  className="h-[70px] hover:bg-gray-200 cursor-pointer"
                  key={el._id}
                  id={el._id}
                  onClick={handleArticleListClick}
                >
                  <td>{el.title}</td>
                  <td>{el.textContent.slice(0, 15)}...</td>
                  <td>
                    {el.reviewers.length === 0
                      ? "None"
                      : el.reviewers.map((reviewer, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 justify-center"
                          >
                            <p className="mb-0">{reviewer.email}</p>
                            <img
                              className="w-3 h-3"
                              src={
                                reviewer.status === "approved"
                                  ? "/assets/resolveIcon1.png"
                                  : "/assets/pending.png"
                              }
                              alt={
                                reviewer.status === "approved"
                                  ? "approved status icon"
                                  : "pending status icon"
                              }
                            />
                          </div>
                        ))}
                  </td>

                  <td className="py-2">
                    <div className="flex items-center justify-center h-full w-full">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold text-gray-700 ${el.isPublished ? "bg-blue-200" : "bg-red-200"}`}
                      >
                        {el.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan="5" className="text-center h-[100px]">
                  No articles to review
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </>
  );
}
