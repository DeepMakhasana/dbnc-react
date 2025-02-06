import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Profile = () => {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <NoProfile />
    </main>
  );
};

const NoProfile = () => {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">You have no created profile</h3>
        <p className="text-sm text-muted-foreground">You can create own profile as soon.</p>
        <Link to={"/profile/create"}>
          <Button className="mt-4">Create</Button>
        </Link>
      </div>
    </div>
  );
};

export default Profile;
