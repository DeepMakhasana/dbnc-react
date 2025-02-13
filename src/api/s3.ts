import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";
import { endpoints } from "./endpoint";

export interface IS3PutObjectPayload {
  fileName: string;
  fileType: string;
}
export interface IS3PutObjectResponse {
  url: string;
}

export async function putObjectPresignedUrl(payload: IS3PutObjectPayload): Promise<IS3PutObjectResponse> {
  const { data } = await axiosInstance.post(endpoints.s3.putObjectPresignedUrl, payload);
  return data;
}

// ----------------------------------------------------------------------------------------------------------------------

export interface IS3PutMultipleObjectPayload {
  files: {
    fileName: string;
    key: string;
  }[];
}
export interface IS3PutMultipleObjectResponse {
  fileName: string;
  url: string;
}

export async function putMultipleObjectPresignedUrl(
  payload: IS3PutMultipleObjectPayload
): Promise<IS3PutMultipleObjectResponse[]> {
  const { data } = await axiosInstance.post(endpoints.s3.putMultipleObjectPresignedUrl, payload);
  return data;
}

// ----------------------------------------------------------------------------------------------------------------------

export interface IImageUploadPayload {
  url: string;
  payload: {
    file: File;
    fileType: string;
  };
}
export async function imageUpload({ url, payload }: IImageUploadPayload): Promise<any> {
  const { status } = await axios.put(url, payload.file, {
    headers: {
      "Content-Type": payload.fileType, // Required by S3 for correct file type
    },
  });
  return status;
}

// ----------------------------------------------------------------------------------------------------------------------
export interface IS3DeleteObjectPayload {
  key: string;
}
export interface IS3DeleteObjectResponse {
  message: string;
}

export async function deleteObject(payload: IS3DeleteObjectPayload): Promise<IS3DeleteObjectResponse> {
  const { data } = await axiosInstance.delete(endpoints.s3.deleteObject, { data: payload });
  return data;
}
