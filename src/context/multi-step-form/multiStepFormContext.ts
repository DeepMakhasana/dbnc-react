import { createContext } from "react";

export interface FormData {
  name: string;
  tagline: string;
  logo: string;
  slug: string;
  number: string;
  whatsappNumber: string;
  email: string;
  categoryId: string;
  bio: string;
  feedbackLink: string;
  upiId: string;
  addressLine: string;
  stateId: string;
  cityId: string;
  pincode: string;
  latitude: string;
  longitude: string;
  googleMapLink: string;
  services: (string | undefined)[];
  links: { socialMediaId: string; link: string; index: number }[];
  photos: string[];
}

export interface FormContextType {
  step: number;
  formData: FormData;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<FormData>) => void;
  clearFormData: () => void;
}

export const initialValueMultiStepForm = {
  name: "",
  tagline: "",
  logo: "",
  slug: "",
  number: "",
  whatsappNumber: "",
  email: "",
  categoryId: "",
  bio: "",
  feedbackLink: "",
  upiId: "",
  addressLine: "",
  stateId: "",
  cityId: "",
  pincode: "",
  latitude: "",
  longitude: "",
  googleMapLink: "",
  services: [],
  links: [],
  photos: [],
};

const defaultValue: FormContextType = {
  step: 1,
  formData: initialValueMultiStepForm,
  nextStep: () => {},
  prevStep: () => {},
  updateFormData: () => {},
  clearFormData: () => {},
};

// auth context
const MultiStepFormContext = createContext<FormContextType>(defaultValue);

export default MultiStepFormContext;
