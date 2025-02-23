import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

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

export const generateUniqueId = () => uuidv4();

export function formateDateTime(isoDate: Date | string, onlyDate: boolean = false): string {
  const date = new Date(isoDate);

  if (onlyDate) {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  return formatter.format(date);
}

export function createSlug(str: string) {
  return str
    .toLowerCase()
    .trim() // Remove leading/trailing spaces
    .replace(/[^\w\s-]/g, "") // Remove special characters except hyphens
    .replace(/\s+/g, "-"); // Replace spaces with hyphens
}
