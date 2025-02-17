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
    category: "/utils/category",
    service: "/utils/service",
    suggest: {
      services: "/utils/suggestServicesByCategory",
      profileBio: "/utils/suggestProfileBio",
    },
    socialMedia: "/utils/social-media",
  },
  store: {
    main: "/store",
    mainDetail: "/store/main-detail",
    categoryBio: "/store/category-bio",
    feedbackUpi: "/store/feedback-upi",
    address: "/store/address",
    service: "/store/service",
    link: "/store/link",
    photo: "/store/photo",
    owner: "/store/owner",
    secret: "/store/secret",
    status: "/store/status",
  },
};
