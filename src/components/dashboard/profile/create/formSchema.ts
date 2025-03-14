import { z } from "zod";

// step 1
export const mainInformationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(40, "Name must be less then and equal to 40 characters"),
  tagline: z.string().min(3, "Tagline is required").max(70, "Tagline must be less then and equal to 70 characters"),
  logo: z.string().min(2, "Logo not uploaded"),
  slug: z.string(),
  number: z.string().min(10, "Enter a valid phone number").max(10, "Enter a valid phone number"),
  whatsappNumber: z.string().min(10, "Enter a valid WhatsApp number").max(10, "Enter a valid phone number"),
  email: z.string().email("Invalid email address"),
});

// step 2
export const storeAddressSchema = z.object({
  addressLine1: z
    .string()
    .min(1, "Shop number, building, near by/opposite is required")
    .max(255, "Shop number, building, near by/opposite must be at most 255 characters"),
  addressLine2: z
    .string()
    .min(1, "Main area, road is required")
    .max(255, "Main area, road must be at most 255 characters"),
  stateId: z.string().regex(/^\d+$/, "State ID must be a number"),
  cityId: z.string().regex(/^\d+$/, "City ID must be a number"),
  latitude: z.string().regex(/^(-?\d+(\.\d+)?)$/, "Invalid latitude"),
  longitude: z.string().regex(/^(-?\d+(\.\d+)?)$/, "Invalid longitude"),
  pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
  googleMapLink: z.string().url("Invalid Google Maps URL").max(255, "URL must be at most 255 characters"),
});

// step 3
export const feedbackUPIIdSchema = z.object({
  feedbackLink: z.string().url({ message: "Invalid URL format for feedback link" }).or(z.literal("")),
  upiId: z
    .string()
    .regex(/^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{3,}$/i, {
      message: "Invalid UPI ID format",
    })
    .or(z.literal("")),
});

// step 4
export const categoryServiceSchema = z.object({
  categoryId: z.string().regex(/^\d+$/, { message: "categoryId must be a number" }),
  services: z.array(z.string().regex(/^\d+$/, { message: "Each serviced item must be a number" })).default([]),
  bio: z.string().max(255, { message: "Bio must be at most 255 characters" }),
});
