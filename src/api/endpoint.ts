export const endpoints = {
  auth: {
    main: "/auth",
    sendVerifyOtpEmail: "/auth/send-verification-email",
    verifyEmailOtp: "/auth/verify-email-otp",
    ownerOnboard: "/auth/owner/onboard",
  },
  s3: {
    main: "/s3",
    putObjectPresignedUrl: "/s3/putObjectPresignedUrl",
    putMultipleObjectPresignedUrl: "/s3/putMultipleObjectPresignedUrl",
    deleteObject: "/s3/deleteObject",
  },
  utils: {
    main: "/utils",
    state: "/utils/state",
    city: "/utils/city",
  },
};
