import { Link } from "react-router-dom";

function ErrorPage({ errorMessage }) {
  return (
    <div className="mt-10 text-center text-4xl font-bold">
      <p>{errorMessage}</p>
      <Link to="/">
        <div className="mt-4">Go Back To Main Page</div>
      </Link>
    </div>
  );
}

export default ErrorPage;
