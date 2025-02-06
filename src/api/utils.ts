import axiosInstance from "@/lib/axiosInstance";
import { endpoints } from "./endpoint";
import { city, states } from "@/types/utils";

// states
export async function getStates(): Promise<states[]> {
  const { data } = await axiosInstance.get(endpoints.utils.state);
  return data;
}

// city
export async function getCities(stateId: string): Promise<city[]> {
  const { data } = await axiosInstance.get(`${endpoints.utils.city}/${stateId}`);
  return data;
}
