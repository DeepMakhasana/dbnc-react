import axiosInstance from "@/lib/axiosInstance";
import { endpoints } from "./endpoint";
import {
  AddCategoryPayload,
  AddCategoryResponse,
  AddServicePayload,
  AddServiceResponse,
  category,
  city,
  service,
  SocialMediaPlatform,
  states,
  SuggestBioPayload,
  SuggestBioResponse,
  SuggestServicesPayload,
  SuggestServicesResponse,
} from "@/types/utils";

// states
export async function getStates(): Promise<states[]> {
  const { data } = await axiosInstance.get(endpoints.utils.state);
  return data;
}

// city
export async function getCities(stateId: string): Promise<city[]> {
  const { data } = await axiosInstance.get(`${endpoints.utils.city}/${stateId}`);
  return data;
}

// category
export async function getCategory(): Promise<category[]> {
  const { data } = await axiosInstance.get(endpoints.utils.category);
  return data;
}

// services
export async function getServices(categoryId: string): Promise<service[]> {
  const { data } = await axiosInstance.get(`${endpoints.utils.service}/${categoryId}`);
  return data;
}

// suggest services
export async function getSuggestServicesByCategory(payload: SuggestServicesPayload): Promise<SuggestServicesResponse> {
  const { data } = await axiosInstance.get(
    `${endpoints.utils.suggest.services}?name=${encodeURI(payload.name)}&categoryId=${encodeURI(payload.categoryId)}`
  );
  return data;
}

// suggest profile bio
export async function getSuggestProfileBio(payload: SuggestBioPayload): Promise<SuggestBioResponse> {
  const { data } = await axiosInstance.post(endpoints.utils.suggest.profileBio, payload);
  return data;
}

// add services
export async function addCategory(payload: AddCategoryPayload): Promise<AddCategoryResponse> {
  const { data } = await axiosInstance.post(endpoints.utils.category, payload);
  return data;
}

// add services
export async function addService(payload: AddServicePayload): Promise<AddServiceResponse> {
  const { data } = await axiosInstance.post(endpoints.utils.service, payload);
  return data;
}

// category
export async function getSocialMediaPlatforms(): Promise<SocialMediaPlatform[]> {
  const { data } = await axiosInstance.get(endpoints.utils.socialMedia);
  return data;
}
