import AddressInformation from "@/components/dashboard/profile/create/AddressInformation";
import MainInformation from "@/components/dashboard/profile/create/MainInformation";
import Progressbar from "@/components/dashboard/profile/create/Progressbar";
import useMultiStepFormContext from "@/context/multi-step-form/useMultiStepFormContext";

const ProfileCreate = () => {
  const { step } = useMultiStepFormContext();
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <Progressbar step={step} />
      {step === 1 && <MainInformation />}
      {step === 2 && <AddressInformation />}
      {/*  {step === 3 && <Step3 />} */}
    </main>
  );
};

export default ProfileCreate;
