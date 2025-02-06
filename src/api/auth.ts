import axiosInstance from "@/lib/axiosInstance";
import { endpoints } from "./endpoint";
import {
  sendVerificationOtpEmailPayload,
  sendVerificationOtpEmailResponse,
  storeOwnerUserOnboardPayload,
  storeOwnerUserOnboardResponse,
  verifyEmailPayload,
  verifyEmailResponse,
} from "@/types/auth";

// send-verification-email
export async function sendVerificationOtpEmail(
  payload: sendVerificationOtpEmailPayload
): Promise<sendVerificationOtpEmailResponse> {
  const { data } = await axiosInstance.post(endpoints.auth.sendVerifyOtpEmail, payload);
  return data;
}

// verify-email
export async function verifyEmailOtp(payload: verifyEmailPayload): Promise<verifyEmailResponse> {
  const { data } = await axiosInstance.post(endpoints.auth.verifyEmailOtp, payload);
  return data;
}

// onboard store owner user
export async function storeOwnerUserOnboard(
  payload: storeOwnerUserOnboardPayload
): Promise<storeOwnerUserOnboardResponse> {
  const { data } = await axiosInstance.post(endpoints.auth.ownerOnboard, payload);
  return data;
}
