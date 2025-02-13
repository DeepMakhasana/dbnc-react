import { useContext } from "react";
import MultiStepFormContext, { FormContextType } from "./multiStepFormContext";

const useMultiStepFormContext = (): FormContextType => {
  const context = useContext(MultiStepFormContext);
  if (!context) {
    throw new Error("useMultiStepFormContext must be used within a MultiStepFormProvider");
  }
  return context;
};

export default useMultiStepFormContext;
