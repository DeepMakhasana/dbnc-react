import { Link, Outlet } from "react-router-dom";
import DashboardLGSideBar from "./sidebar/DashboardLGSideBar";
import DashboardSMSideBar from "./sidebar/DashboardSMSideBar";
import ProfileMenu from "./sidebar/ProfileMenu";
import useAuthContext from "@/context/auth/useAuthContext";
import routeProtection from "../HOC/routeProtection";

const DashboardLayout = () => {
  const { logout, user } = useAuthContext();
  return (
    <div className={`grid min-h-screen w-full lg:grid-cols-[250px_1fr]`}>
      <div className="hidden border-r bg-muted/40 lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2 lg:sticky lg:top-0">
          <div className="flex min-h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/profile" className="flex items-center gap-2 font-semibold">
              <img src="/liveyst.svg" alt="liveyst" className="w-8 h-8" />
              <span className="font-sans font-medium text-primary">liveyst</span>
            </Link>
          </div>
          <DashboardLGSideBar />
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex min-h-14 justify-between items-center z-10 gap-2 sm:gap-4 border-b bg-muted/40 px-4 lg:sticky lg:top-0 lg:h-[60px] lg:px-6">
          <DashboardSMSideBar />

          {/* Right side profile menu */}
          <ProfileMenu user={user} logout={logout} />
        </header>
        <Outlet />
      </div>
    </div>
  );
};

export default routeProtection(DashboardLayout);
