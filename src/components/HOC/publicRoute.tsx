import useAuthContext from "@/context/auth/useAuthContext";
import { allowPath } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import { useLayoutEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const publicRoute = <P extends object>(WrappedComponent: React.ComponentType<P>): React.FC<P> => {
  const ProtectedComponent = (props: P) => {
    const navigate = useNavigate();
    const path = useLocation();
    const { isAuthenticated, isLoading } = useAuthContext(); // Replace with your auth logic
    console.log("protect route: ", isAuthenticated);

    useLayoutEffect(() => {
      if (isAuthenticated && !isLoading) {
        if (allowPath.includes(path.pathname)) {
          console.log("enter--", path);
          if (path?.state?.previous) {
            navigate(path?.state?.previous);
          } else {
            navigate("/profile");
          }
        }
      }
    }, [isAuthenticated, isLoading, navigate, path]);

    if (isLoading) {
      return (
        <div className="flex justify-center my-4">
          <Loader2 className="animate-spin w-6 h-6" />
        </div>
      ); // Show a spinner or skeleton while checking authentication
    }

    if (isAuthenticated && allowPath.includes(path.pathname)) {
      return null; // Render nothing or a loading spinner while redirecting
    }

    return <WrappedComponent {...props} />;
  };

  return ProtectedComponent;
};

export default publicRoute;
