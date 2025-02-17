import useAuthContext from "@/context/auth/useAuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile");
    } else {
      navigate("/account");
    }
  }, [isAuthenticated, navigate]);
  return <div></div>;
};

export default Home;
