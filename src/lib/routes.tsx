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
import ErrorBoundary from "@/components/ErrorBoundary";
import NotFoundPage from "@/page/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <Home />
      </ErrorBoundary>
    ),
  },
  {
    path: "/status-update",
    element: (
      <ErrorBoundary>
        <StatusUpdateLayout />
      </ErrorBoundary>
    ),
    children: [
      {
        path: ":storeId",
        element: <StoreStatusChange />,
      },
      {
        path: "open",
        element: <StoreOpen />,
      },
      {
        path: "close",
        element: <StoreClose />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: "/account",
    element: (
      <ErrorBoundary>
        <AccountLayout />
      </ErrorBoundary>
    ),
    children: [
      {
        path: "",
        element: <Account />,
      },
      {
        path: "onboard",
        element: <Onboard />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: "/profile",
    element: (
      <ErrorBoundary>
        <DashboardLayout />
      </ErrorBoundary>
    ),
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
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
