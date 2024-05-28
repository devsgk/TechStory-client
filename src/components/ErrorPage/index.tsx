import { Link } from "react-router-dom";

type ErrorMessageProps = {
  errorMessage: string;
};

function ErrorPage({ errorMessage }: ErrorMessageProps) {
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
