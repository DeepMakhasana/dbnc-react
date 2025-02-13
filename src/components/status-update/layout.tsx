import { Outlet } from "react-router-dom";

const StatusUpdateLayout = () => {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={"flex flex-col gap-6"}>
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default StatusUpdateLayout;
