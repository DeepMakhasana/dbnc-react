import { getStoreByOwnerId } from "@/api/profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { imageBaseUrl } from "@/lib/constants";
import { formateDateTime } from "@/lib/utils";
import { StoresByOwner } from "@/types/profile";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  const { data: stores, isLoading: isStoresLoading } = useQuery({
    queryKey: ["stores"],
    queryFn: getStoreByOwnerId,
  });

  if (isStoresLoading) {
    return (
      <div className="flex gap-2 py-8 justify-center items-center">
        <Loader2 className="animate-spin" /> Loading...
      </div>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      {stores === undefined || stores?.length <= 0 ? (
        <NoProfile />
      ) : (
        <div>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-medium">Store profile</h1>
              <p className="text-sm hidden text-muted-foreground sm:block">View and manage store profile</p>
            </div>
            <div className="flex gap-2 items-center">
              <Link to={"/profile/create"}>
                <Button>
                  <Plus /> Add Profile
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid gap-4 my-8">
            {stores?.map((store) => (
              <CreatedStore key={store.id} store={store} />
            ))}
          </div>
        </div>
      )}
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

const CreatedStore = ({ store }: { store: StoresByOwner }) => {
  return (
    <Card className="flex flex-col md:flex-row">
      <CardHeader className="p-3 flex items-center justify-center h-full max-sm:py-6">
        <img src={`${imageBaseUrl}${store.logo}`} alt={store.name} className="max-w-52 object-cover rounded" />
      </CardHeader>
      <CardContent className="p-3 flex gap-3 justify-between w-full flex-col sm:flex-row sm:items-center">
        <div>
          <h2 className="mb-1 text-lg font-medium">{store?.name}</h2>
          <p className="mb-4 line-clamp-4 text-sm text-muted-foreground">{store.tagline}</p>
          <p className="mt-2 mb-4 line-clamp-4 text-sm text-muted-foreground">
            <b>Created at:</b> {formateDateTime(store.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to={`/profile/${store.id}`} className="max-sm:w-full">
            <Button variant={"default"} className="max-sm:w-full">
              <SlidersHorizontal />
              Manage
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;
