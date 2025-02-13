import AddressInformation from "@/components/dashboard/profile/create/AddressInformation";
import CategoryServices from "@/components/dashboard/profile/create/CategoryServices";
import FeedbackUPIId from "@/components/dashboard/profile/create/FeedbackUPIId";
import ImpotentLink from "@/components/dashboard/profile/create/ImpotentLink";
import MainInformation from "@/components/dashboard/profile/create/MainInformation";
import Photos from "@/components/dashboard/profile/create/Photos";
import Progressbar from "@/components/dashboard/profile/create/Progressbar";
import useMultiStepFormContext from "@/context/multi-step-form/useMultiStepFormContext";

const ProfileCreate = () => {
  const { step } = useMultiStepFormContext();
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 my-6 sm:my-2">
      <Progressbar step={step} />
      {step === 1 && <MainInformation />}
      {step === 2 && <AddressInformation />}
      {step === 3 && <FeedbackUPIId />}
      {step === 4 && <CategoryServices />}
      {step === 5 && <ImpotentLink />}
      {step === 6 && <Photos />}
    </main>
  );
};

export default ProfileCreate;
