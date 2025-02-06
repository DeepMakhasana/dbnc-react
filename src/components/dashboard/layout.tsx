import { MAIN_COURSES_PAGE } from "@/lib/constants";
import { Outlet } from "react-router-dom";
import DashboardLGSideBar from "./sidebar/DashboardLGSideBar";
import DashboardSMSideBar from "./sidebar/DashboardSMSideBar";
import ProfileMenu from "./sidebar/ProfileMenu";
import useAuthContext from "@/context/auth/useAuthContext";

const DashboardLayout = () => {
  const { logout, user } = useAuthContext();
  return (
    <div className={`grid min-h-screen w-full lg:grid-cols-[250px_1fr]`}>
      <div className="hidden border-r bg-muted/40 lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2 lg:sticky lg:top-0">
          <div className="flex min-h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <a href={MAIN_COURSES_PAGE} className="flex items-center gap-2 font-semibold">
              <div className="w-8 h-8">
                <img src="/bliveprofile.svg" alt="bliveprofile" className="w-full" />
              </div>
              <span className="font-sans font-medium">
                Blive<span className="text-primary">profile</span>
              </span>
            </a>
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

export default DashboardLayout;
