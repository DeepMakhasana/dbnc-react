import useAuthContext from "@/context/auth/useAuthContext";
import { Loader2 } from "lucide-react";
import { ComponentType, FC, useLayoutEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const routeProtection = <P extends object>(WrappedComponent: ComponentType<P>): FC<P> => {
  const ProtectedComponent = (props: P) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, isLoading } = useAuthContext(); // Replace with your auth logic
    console.log("----");
    console.log("protect route: ", location);

    useLayoutEffect(() => {
      if (!isLoading && !isAuthenticated) {
        navigate("/account");
      }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading) {
      return (
        <div className="flex justify-center my-4">
          <Loader2 className="animate-spin w-6 h-6" />
        </div>
      ); // Show a spinner or skeleton while checking authentication
    }

    if (!isAuthenticated) {
      return null; // Render nothing or a loading spinner while redirecting
    }

    return <WrappedComponent {...props} />;
  };

  // Add a display name for React Fast Refresh
  ProtectedComponent.displayName = `RouteProtected(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return ProtectedComponent;
};

export default routeProtection;
