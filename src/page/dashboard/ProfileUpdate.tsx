import AddressInformation from "@/components/dashboard/profile/create/AddressInformation";
import CategoryServices from "@/components/dashboard/profile/create/CategoryServices";
import FeedbackUPIId from "@/components/dashboard/profile/create/FeedbackUPIId";
import ImpotentLink from "@/components/dashboard/profile/create/ImpotentLink";
import MainInformation from "@/components/dashboard/profile/create/MainInformation";
import Photos from "@/components/dashboard/profile/create/Photos";
import { Button } from "@/components/ui/button";
import { ActionType } from "@/types/profile";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const [queryParam] = useSearchParams();
  const id = queryParam.get("id");
  const slug = queryParam.get("slug");
  const formTitle: Record<string, string> = {
    "main-information": "Main Information",
    "address-information": "Address Information",
    "feedback-upi": "Feedback & UPI id",
    "category-service": "Category & Services",
    "impotent-links": "Impotent Links",
    photos: "Photos",
  };

  if (!id || !slug) return <p>Some thing wrong!</p>;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 my-4 sm:my-2">
      <div className="flex gap-4 items-center">
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <div>
          <h1 className="text-2xl font-medium line-clamp-1">{formTitle[slug]}</h1>
          <p className="text-sm text-muted-foreground sm:block">Update store {formTitle[slug].toLowerCase()}</p>
        </div>
      </div>

      {slug === "main-information" && <MainInformation action={ActionType.UPDATE} storeId={Number(id)} />}
      {slug === "address-information" && <AddressInformation action={ActionType.UPDATE} storeId={Number(id)} />}
      {slug === "feedback-upi" && <FeedbackUPIId action={ActionType.UPDATE} storeId={Number(id)} />}
      {slug === "category-service" && <CategoryServices action={ActionType.UPDATE} storeId={Number(id)} />}
      {slug === "impotent-links" && <ImpotentLink action={ActionType.UPDATE} storeId={Number(id)} />}
      {slug === "photos" && <Photos action={ActionType.UPDATE} storeId={Number(id)} />}
    </main>
  );
};

export default ProfileUpdate;
