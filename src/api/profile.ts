import axiosInstance from "@/lib/axiosInstance";
import { endpoints } from "./endpoint";
import {
  StoreAddressPayload,
  StoreAddressResponse,
  StoreByIdForUpdateResponse,
  StoreLinksPayload,
  StoreLinksResponse,
  StorePayload,
  StorePhotosPayload,
  StorePhotosResponse,
  StoreResponse,
  StoresByOwner,
  StoreSecretPayload,
  StoreSecretResponse,
  StoreServicePayload,
  StoreServiceResponse,
  UpdateStoreOpenCloseStatusPayload,
  UpdateStoreOpenCloseStatusResponse,
} from "@/types/profile";

// store === profile //

// create profile
export async function createStore(payload: StorePayload): Promise<StoreResponse> {
  const { data } = await axiosInstance.post(endpoints.store.main, payload);
  return data;
}

// create profile address
export async function createStoreAddress(payload: StoreAddressPayload): Promise<StoreAddressResponse> {
  const { data } = await axiosInstance.post(endpoints.store.address, payload);
  return data;
}

// create profile service
export async function createStoreService(payload: StoreServicePayload[]): Promise<StoreServiceResponse[]> {
  const { data } = await axiosInstance.post(endpoints.store.service, payload);
  return data;
}

// create profile links
export async function createStoreLinks(payload: StoreLinksPayload[]): Promise<StoreLinksResponse[]> {
  const { data } = await axiosInstance.post(endpoints.store.link, payload);
  return data;
}

// create profile photos
export async function createStorePhotos(payload: StorePhotosPayload): Promise<StorePhotosResponse[]> {
  const { data } = await axiosInstance.post(endpoints.store.photo, payload);
  return data;
}

// get profiles by owner id
export async function getStoreByOwnerId(): Promise<StoresByOwner[]> {
  const { data } = await axiosInstance.get(endpoints.store.owner);
  return data;
}

// create and update profile secret
export async function createUpdateStoreSecret(payload: StoreSecretPayload): Promise<StoreSecretResponse> {
  const { data } = await axiosInstance.post(endpoints.store.secret, payload);
  return data;
}

// update store status
export async function updateStoreOpenCloseStatus(
  payload: UpdateStoreOpenCloseStatusPayload
): Promise<UpdateStoreOpenCloseStatusResponse> {
  const { data } = await axiosInstance.put(endpoints.store.status, payload);
  return data;
}

// for update store details ----------------------------------------------------------------------------------
// get store for update
export async function getStoreByIdForUpdate(storeId: number): Promise<StoreByIdForUpdateResponse> {
  const { data } = await axiosInstance.get(`${endpoints.store.main}?id=${storeId}&action=update`);
  return data;
}
