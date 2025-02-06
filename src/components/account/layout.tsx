import { Outlet } from "react-router-dom";
import publicRoute from "../HOC/publicRoute";

const AccountLayout = () => {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={"flex flex-col gap-6"}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <a href="#" className="flex flex-col items-center gap-2 font-medium">
                <div className="flex h-8 w-8 items-center justify-center rounded-md">
                  <img src="/bliveprofile.svg" alt="bliveprofile" />
                </div>
                <span className="sr-only">Bliveprofile</span>
              </a>
              <h1 className="text-2xl font-bold">Welcome to Bliveprofile</h1>
              <div className="text-center text-sm">Get started with your email</div>
            </div>
            <Outlet />
          </div>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
            By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </main>
  );
};

export default publicRoute(AccountLayout);
