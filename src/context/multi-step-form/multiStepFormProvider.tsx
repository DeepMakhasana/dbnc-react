import { FC, ReactNode, useEffect, useState } from "react";
import MultiStepFormContext, { FormData, initialValueMultiStepForm } from "./MultiStepFormContext";
import { useDebounce } from "@/hooks/useDebounce";
import { constants } from "@/lib/constants";

type MultiStepFormProviderProps = {
  children: ReactNode;
};

export const MultiStepFormProvider: FC<MultiStepFormProviderProps> = ({ children }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(() => {
    const savedData = localStorage.getItem(constants.FORMDATA);
    return savedData ? JSON.parse(savedData) : initialValueMultiStepForm;
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);
  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // Apply debouncing
  const debouncedFormData = useDebounce(formData, 500);

  useEffect(() => {
    localStorage.setItem(constants.FORMDATA, JSON.stringify(debouncedFormData));
  }, [debouncedFormData]);

  return (
    <MultiStepFormContext.Provider value={{ step, formData, nextStep, prevStep, updateFormData }}>
      {children}
    </MultiStepFormContext.Provider>
  );
};
