export interface StorePayload {
  slug: string;
  name: string;
  tagline: string;
  logo: string;
  number: string;
  whatsappNumber: string;
  email: string;
  categoryId: number;
  bio: string;
  feedbackLink: string | null;
  upiId: string | null;
  storeOwnerUserId: number;
  isActive: boolean;
}
export interface StoreResponse extends StorePayload {
  id: number;
}

export interface StoreAddressPayload {
  storeId: number;
  addressLine1: string;
  addressLine2: string;
  stateId: number;
  cityId: number;
  latitude: number;
  longitude: number;
  googleMapLink: string;
  pincode: number;
}
export interface StoreAddressResponse extends StoreAddressPayload {
  id: number;
}

export interface StoreServicePayload {
  storeId: number;
  serviceId: number;
  index: number;
}
export interface StoreServiceResponse extends StoreServicePayload {
  id: number;
  service: {
    name: string;
  };
}

export interface StoreLinksPayload {
  link: string;
  SocialMediaId: number;
  storeId: number;
  index: number;
}
export interface StoreLinksResponse extends StoreLinksPayload {
  id: number;
}

export interface StorePhotosPayload {
  storeId: number;
  paths: string[];
}
export interface StorePhotosResponse {
  storeId: number;
  id: number;
  path: string;
  index: number;
}

export interface StoresByOwner {
  name: string;
  id: number;
  createdAt: Date;
  category: {
    name: string;
  };
  slug: string;
  tagline: string;
  logo: string;
}

export interface StoreSecretPayload {
  storeId: number;
  secret: string;
}
export interface StoreSecretResponse {
  message: string;
}

export interface UpdateStoreOpenCloseStatusPayload {
  storeId: number;
  secret: string;
}
export interface UpdateStoreOpenCloseStatusResponse {
  name: string;
  id: number;
  slug: string;
  isOpen: boolean;
}

export enum ActionType {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
}

// types for update store -----------------------------
export interface StoreByIdForUpdateResponse {
  number: string;
  name: string;
  id: number;
  email: string;
  slug: string;
  tagline: string;
  logo: string;
  whatsappNumber: string;
}

export interface StoreAddressByIdResponse {
  id: number;
  storeId: number;
  addressLine1: string;
  addressLine2: string;
  stateId: number;
  cityId: number;
  latitude: number;
  longitude: number;
  pincode: number;
  googleMapLink: string;
}

export interface StoreMainDetailUpdatePayload {
  number: string;
  name: string;
  email: string;
  tagline: string;
  logo: string;
  whatsappNumber: string;
}
export interface StoreCategoryBioUpdatePayload {
  categoryId: number;
  bio: string;
}
export interface StoreCategoryBioByIdResponse {
  category: {
    id: number;
    name?: string;
  };
  bio: string;
  name: string;
  storeAddresses: {
    cityId: number;
  };
}
export interface StoreFeedbackUpiUpdatePayload {
  feedbackLink: string | null;
  upiId: string | null;
}
export interface StoreUpdateResponse
  extends StoreMainDetailUpdatePayload,
    StoreCategoryBioUpdatePayload,
    StoreFeedbackUpiUpdatePayload {
  id: number;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export type DeleteStoreServicesPayload = number[];
export type DeleteStoreServicesResponse = { message: string };

export interface StoreLinks {
  link: string;
  id: number;
  storeId: number;
  SocialMediaId: number;
  index: number;
  socialMedia: {
    name: string;
    id: number;
    icon: string;
  };
}

export type UpdateStoreSocialLinkPayload = {
  link: string;
};
export type UpdateStoreSocialLinkResponse = {
  storeId: number;
  link: string;
  id: number;
  SocialMediaId: number;
  index: number;
};

export interface StorePhotos {
  id: number;
  storeId: number;
  index: number;
  path: string;
}
