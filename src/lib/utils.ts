import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateImageSize(size: number) {
  const MAX_SIZE = 2 * 1024 * 1024; // 2 MB in bytes
  if (size <= MAX_SIZE) {
    return true; // Image size is valid
  } else {
    return false; // Image size exceeds 2 MB
  }
}
