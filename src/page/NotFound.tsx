import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="text-center py-6">
      404 NotFoundPage -{" "}
      <Link to={"/"} className="underline">
        Go to home
      </Link>
    </div>
  );
};

export default NotFoundPage;
