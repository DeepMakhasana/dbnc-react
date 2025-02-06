import { RouterProvider } from "react-router-dom";
import { router } from "./lib/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/auth/authProvider";
import { Toaster } from "./components/ui/toaster";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * (60 * 1000),
      gcTime: 60 * (60 * 1000),
      refetchOnWindowFocus: false, // Disable refetching on window focus
      refetchOnMount: false, // Disable refetching on mount
      retry: 3, // Retry failed requests up to 3 times
      retryDelay: 2000, // 2-second delay between retries
    },
  },
});

function App() {
  return (
    <>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Toaster />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </AuthProvider>
    </>
  );
}

export default App;
