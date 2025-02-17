export interface sendVerificationOtpEmailPayload {
  email: string;
}

export interface sendVerificationOtpEmailResponse {
  email: string;
  message: string;
}

export interface verifyEmailPayload {
  email: string;
  otp: string;
  userType: string;
}

export interface verifyEmailResponse {
  email: string;
  message: string;
  isUserExist: null | { email: string; id: number; createdAt: Date };
  token?: string;
}

export type IIsEmailVerify = {
  email: string;
  isVerified: boolean;
};

export interface IUser {
  id: number;
  email: string;
  name: string | null;
  number: string | null;
  createdAt: Date;
  updatedAt: Date;
  roles: string[];
}

export interface storeOwnerUserOnboardPayload {
  email: string;
  name: string;
  number: string;
}

export interface storeOwnerUserOnboardResponse {
  token: string;
}
