import AccountLayout from "@/components/account/layout";
import DashboardLayout from "@/components/dashboard/layout";
import Account from "@/page/Account";
import Profile from "@/page/dashboard/Profile";
import Home from "@/page/Home";
import Onboard from "@/page/Onboard";
import ProfileCreate from "@/page/dashboard/ProfileCreate";
import { createBrowserRouter } from "react-router-dom";
import { MultiStepFormProvider } from "@/context/multi-step-form/multiStepFormProvider";
import StoreStatusChange from "@/page/StoreStatusChange";
import SingleProfile from "@/page/dashboard/SingleProfile";
import StoreSecret from "@/page/dashboard/StoreSecret";
import StatusUpdateLayout from "@/components/status-update/layout";
import StoreOpen from "@/page/StoreOpen";
import StoreClose from "@/page/StoreClose";
import ProfileUpdate from "@/page/dashboard/ProfileUpdate";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/status-update",
    element: <StatusUpdateLayout />,
    children: [
      {
        path: ":storeId",
        element: <StoreStatusChange />,
      },
      {
        path: "open/:slug",
        element: <StoreOpen />,
      },
      {
        path: "close/:slug",
        element: <StoreClose />,
      },
    ],
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
      {
        path: "update",
        element: (
          <MultiStepFormProvider>
            <ProfileUpdate />
          </MultiStepFormProvider>
        ),
      },
      {
        path: ":storeId",
        element: <SingleProfile />,
      },
      {
        path: "secret/:storeId",
        element: <StoreSecret />,
      },
    ],
  },
]);
