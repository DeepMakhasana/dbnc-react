import MainInformation from "@/components/dashboard/profile/create/MainInformation";
import { Button } from "@/components/ui/button";
import { ActionType } from "@/types/profile";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileUpdate = () => {
  const navigate = useNavigate();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 my-4 sm:my-2">
      <div className="flex gap-4 items-center">
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <div>
          <h1 className="text-2xl font-medium line-clamp-1">Main Information</h1>
          <p className="text-sm text-muted-foreground sm:block">Update store main information</p>
        </div>
      </div>
      <MainInformation action={ActionType.UPDATE} storeId={5} />
    </main>
  );
};

export default ProfileUpdate;
