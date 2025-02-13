import { FC, ReactNode, useEffect, useState } from "react";
import MultiStepFormContext, { FormData, initialValueMultiStepForm } from "./multiStepFormContext";
import { useDebounce } from "@/hooks/useDebounce";
import { constants } from "@/lib/constants";

type MultiStepFormProviderProps = {
  children: ReactNode;
};

export const MultiStepFormProvider: FC<MultiStepFormProviderProps> = ({ children }) => {
  const [step, setStep] = useState(() => {
    const savedStep = localStorage.getItem(constants.FORMSTEP);
    return savedStep ? Number(savedStep) : 1;
  });
  const [formData, setFormData] = useState<FormData>(() => {
    const savedData = localStorage.getItem(constants.FORMDATA);
    return savedData ? JSON.parse(savedData) : initialValueMultiStepForm;
  });

  const nextStep = () => {
    setStep((prev) => {
      localStorage.setItem(constants.FORMSTEP, String(prev + 1));
      return prev + 1;
    });
  };

  const prevStep = () => setStep((prev) => prev - 1);
  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const clearFormData = () => {
    setFormData(initialValueMultiStepForm);
    setStep(1);
    localStorage.removeItem(constants.FORMDATA);
    localStorage.removeItem(constants.FORMSTEP);
  };

  // Apply debouncing
  const debouncedFormData = useDebounce(formData, 500);

  useEffect(() => {
    localStorage.setItem(constants.FORMDATA, JSON.stringify(debouncedFormData));
  }, [debouncedFormData]);

  return (
    <MultiStepFormContext.Provider value={{ step, formData, nextStep, prevStep, updateFormData, clearFormData }}>
      {children}
    </MultiStepFormContext.Provider>
  );
};
