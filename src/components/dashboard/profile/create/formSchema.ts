import { z } from "zod";

// step 1
export const mainInformationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(40, "Name must be less then and equal to 40 characters"),
  tagLine: z.string().min(3, "Tagline is required").max(70, "Tagline must be less then and equal to 70 characters"),
  logo: z.string().min(2, "Logo not uploaded"),
  slug: z.string(),
  number: z.string().min(10, "Enter a valid phone number").max(10, "Enter a valid phone number"),
  whatsappNumber: z.string().min(10, "Enter a valid WhatsApp number").max(10, "Enter a valid phone number"),
  email: z.string().email("Invalid email address"),
});

// step 2
export const storeAddressSchema = z.object({
  addressLine: z.string().min(1, "Address is required").max(255, "Address must be at most 255 characters"),
  stateId: z.string().regex(/^\d+$/, "State ID must be a number"),
  cityId: z.string().regex(/^\d+$/, "City ID must be a number"),
  latitude: z.string().regex(/^(-?\d+(\.\d+)?)$/, "Invalid latitude"),
  longitude: z.string().regex(/^(-?\d+(\.\d+)?)$/, "Invalid longitude"),
  pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
  googleMapLink: z.string().url("Invalid Google Maps URL").max(255, "URL must be at most 255 characters"),
});
