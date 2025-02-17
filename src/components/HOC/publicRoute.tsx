import useAuthContext from "@/context/auth/useAuthContext";
import { allowPath } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import { useLayoutEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const publicRoute = <P extends object>(WrappedComponent: React.ComponentType<P>): React.FC<P> => {
  const PublicComponent = (props: P) => {
    const navigate = useNavigate();
    const path = useLocation();
    const { isAuthenticated, isLoading } = useAuthContext(); // Replace with your auth logic

    useLayoutEffect(() => {
      if (isAuthenticated && !isLoading) {
        if (allowPath.includes(path.pathname)) {
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

  // Add a display name for React Fast Refresh
  PublicComponent.displayName = `PublicRoute(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return PublicComponent;
};

export default publicRoute;
