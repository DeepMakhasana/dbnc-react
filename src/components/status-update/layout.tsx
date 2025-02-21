import { MAIN_SITE } from "@/lib/constants";
import { Outlet } from "react-router-dom";

const StatusUpdateLayout = () => {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={"flex flex-col gap-10"}>
          <a href={MAIN_SITE} className="flex w-full justify-center items-center gap-2 font-bold">
            <img src="/liveyst.svg" alt="liveyst" className="h-8 w-8" />
            <span>liveyst</span>
          </a>
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default StatusUpdateLayout;
