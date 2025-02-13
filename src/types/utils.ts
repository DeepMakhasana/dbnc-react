export type states = {
  id: number;
  name: string;
};
export type city = {
  id: number;
  name: string;
};
export type category = {
  id: number;
  name: string;
};
export type service = {
  id: number;
  name: string;
};
export interface SuggestServicesPayload {
  name: string;
  categoryId: string;
}
export type SuggestServicesResponse = string[];

export interface SuggestBioPayload {
  name: string;
  categoryId: string;
  cityId: string;
  services: string[];
}
export interface SuggestBioResponse {
  bio: string;
}

export interface AddServicePayload {
  name: string;
  categoryId: number;
}
export interface AddServiceResponse {
  id: number;
  name: string;
}

export type SocialMediaPlatform = {
  id: number;
  name: string;
  icon: string;
};
