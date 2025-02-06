import AccountLayout from "@/components/account/layout";
import DashboardLayout from "@/components/dashboard/layout";
import Account from "@/page/Account";
import Profile from "@/page/Profile";
import Home from "@/page/Home";
import Onboard from "@/page/Onboard";
import ProfileCreate from "@/page/ProfileCreate";
import { createBrowserRouter } from "react-router-dom";
import { MultiStepFormProvider } from "@/context/multi-step-form/multiStepFormProvider";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/account",
    element: <AccountLayout />,
    children: [
      {
        path: "",
        element: <Account />,
      },
      {
        path: "onboard",
        element: <Onboard />,
      },
    ],
  },
  {
    path: "/profile",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <Profile />,
      },
      {
        path: "create",
        element: (
          <MultiStepFormProvider>
            <ProfileCreate />
          </MultiStepFormProvider>
        ),
      },
    ],
  },
]);
