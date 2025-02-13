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
  addressLine: string;
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
