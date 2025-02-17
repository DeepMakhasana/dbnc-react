import axiosInstance from "@/lib/axiosInstance";
import { endpoints } from "./endpoint";
import {
  DeleteStoreServicesPayload,
  DeleteStoreServicesResponse,
  StoreAddressByIdResponse,
  StoreAddressPayload,
  StoreAddressResponse,
  StoreByIdForUpdateResponse,
  StoreCategoryBioByIdResponse,
  StoreCategoryBioUpdatePayload,
  StoreFeedbackUpiUpdatePayload,
  StoreLinks,
  StoreLinksPayload,
  StoreLinksResponse,
  StoreMainDetailUpdatePayload,
  StorePayload,
  StorePhotos,
  StorePhotosPayload,
  StorePhotosResponse,
  StoreResponse,
  StoresByOwner,
  StoreSecretPayload,
  StoreSecretResponse,
  StoreServicePayload,
  StoreServiceResponse,
  StoreUpdateResponse,
  UpdateStoreOpenCloseStatusPayload,
  UpdateStoreOpenCloseStatusResponse,
  UpdateStoreSocialLinkPayload,
  UpdateStoreSocialLinkResponse,
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
  const { data } = await axiosInstance.get(`${endpoints.store.main}?id=${storeId}&type=main-information`);
  return data;
}

// get store address for update
export async function getStoreAddressById(storeId: number): Promise<StoreAddressByIdResponse> {
  const { data } = await axiosInstance.get(`${endpoints.store.address}/${storeId}`);
  return data;
}

// get store feedback and upi for update
export async function getStoreFeedbackUpiById(storeId: number): Promise<StoreFeedbackUpiUpdatePayload> {
  const { data } = await axiosInstance.get(`${endpoints.store.main}?id=${storeId}&type=feedback-upi`);
  return data;
}

// get store category and bio for update
export async function getStoreCategoryBioById(storeId: number): Promise<StoreCategoryBioByIdResponse> {
  const { data } = await axiosInstance.get(`${endpoints.store.main}?id=${storeId}&type=category-bio`);
  return data;
}

// get store category and bio for update
export async function getStoreServicesById(storeId: number): Promise<StoreServiceResponse[]> {
  const { data } = await axiosInstance.get(`${endpoints.store.service}/${storeId}`);
  return data;
}

// get store link for update
export async function getStoreLinksById(storeId: number): Promise<StoreLinks[]> {
  const { data } = await axiosInstance.get(`${endpoints.store.link}/${storeId}`);
  return data;
}

// get store link for update
export async function getStorePhotosById(storeId: number): Promise<StorePhotos[]> {
  const { data } = await axiosInstance.get(`${endpoints.store.photo}/${storeId}`);
  return data;
}

// update store main detail
export async function updateStoreMainInformation({
  payload,
  storeId,
}: {
  payload: StoreMainDetailUpdatePayload;
  storeId: string | number;
}): Promise<StoreUpdateResponse> {
  const { data } = await axiosInstance.put(`${endpoints.store.mainDetail}/${storeId}`, payload);
  return data;
}

export async function updateStoreCategoryBio({
  payload,
  storeId,
}: {
  payload: StoreCategoryBioUpdatePayload;
  storeId: string | number;
}): Promise<StoreUpdateResponse> {
  const { data } = await axiosInstance.put(`${endpoints.store.categoryBio}/${storeId}`, payload);
  return data;
}

export async function updateStoreFeedbackUpi({
  payload,
  storeId,
}: {
  payload: StoreFeedbackUpiUpdatePayload;
  storeId: string | number;
}): Promise<StoreUpdateResponse> {
  const { data } = await axiosInstance.put(`${endpoints.store.feedbackUpi}/${storeId}`, payload);
  return data;
}

// update store address detail
export async function updateStoreAddressInformation({
  payload,
  storeAddressId,
}: {
  payload: StoreAddressPayload;
  storeAddressId: string | number;
}): Promise<StoreAddressResponse> {
  const { data } = await axiosInstance.put(`${endpoints.store.address}/${storeAddressId}`, payload);
  return data;
}

// update store address detail
export async function updateStoreSocialLink({
  payload,
  storeSocialMediaId,
}: {
  payload: UpdateStoreSocialLinkPayload;
  storeSocialMediaId: string | number;
}): Promise<UpdateStoreSocialLinkResponse> {
  const { data } = await axiosInstance.put(`${endpoints.store.link}/${storeSocialMediaId}`, payload);
  return data;
}

// delete store services
export async function deleteStoreServices(payload: DeleteStoreServicesPayload): Promise<DeleteStoreServicesResponse> {
  const { data } = await axiosInstance.delete(endpoints.store.service, { data: { deleteIds: payload } });
  return data;
}

// delete store services
export async function deleteStoreLink(storeSocialMediaId: number): Promise<StoreLinksResponse> {
  const { data } = await axiosInstance.delete(`${endpoints.store.link}/${storeSocialMediaId}`);
  return data;
}

// delete store services
export async function deleteStorePhoto(storePhotoId: number): Promise<StorePhotos> {
  const { data } = await axiosInstance.delete(`${endpoints.store.photo}/${storePhotoId}`);
  return data;
}
