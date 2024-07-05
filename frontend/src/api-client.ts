import { RegisterFromData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import { HotelSearchResponse, HotelType } from "../../backend/src/shared/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function register(formData: RegisterFromData) {
  const res = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await res.json();

  if (!res.ok) throw new Error(responseBody.message);
}

export async function validateToken() {
  const res = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Token invalid");

  return res.json();
}

export async function signIn(formData: SignInFormData) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const resposeBody = await res.json();

  if (!res.ok) throw new Error(resposeBody.message);

  return resposeBody;
}

export async function signOut() {
  const res = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Error during sign out");
}

export async function addMyHotel(hotelFormData: FormData) {
  const res = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    method: "POST",
    credentials: "include",
    body: hotelFormData,
  });

  if (!res.ok) throw new Error("Failed to add hotel");

  return res.json();
}

export async function fetchMyHotels(): Promise<HotelType[]> {
  const res = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("There was an error fetching hotels");

  const data = await res.json();

  return data.data.hotels;
}

export async function fetchMyHotelById(hotelId: string): Promise<HotelType> {
  const res = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Error fetching hotel");

  const data = await res.json();

  return data.data.hotel;
}

export async function updateMyHotelById(hotelFormData: FormData) {
  const res = await fetch(
    `${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`,
    {
      method: "PUT",
      credentials: "include",
      body: hotelFormData,
    }
  );

  if (!res.ok) throw new Error("Failed to update Hotel");

  const data = await res.json();

  return data.data.updatedHotel;
}

export type SearchParams = {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  adultCount?: string;
  childCount?: string;
  page?: string;
  facilities?: string[];
  types?: string[];
  stars?: string[];
  maxPrice?: string;
  sortedBy?: string;
};

export async function searchHotels(
  searchParams: SearchParams
): Promise<HotelSearchResponse> {
  const queryParams = new URLSearchParams();
  queryParams.append("destination", searchParams.destination || "");
  queryParams.append("checkIn", searchParams.checkIn || "");
  queryParams.append("checkOut", searchParams.checkOut || "");
  queryParams.append("adultCount", searchParams.adultCount || "");
  queryParams.append("childCount", searchParams.childCount || "");
  queryParams.append("page", searchParams.page || "");

  queryParams.append("maxPrice", searchParams.maxPrice || "");
  queryParams.append("sortedBy", searchParams.sortedBy || "");

  searchParams.facilities?.forEach((facility) =>
    queryParams.append("facilities", facility)
  );

  searchParams.types?.forEach((type) => queryParams.append("types", type));

  searchParams.stars?.forEach((star) => queryParams.append(`stars`, star));

  const res = await fetch(`${API_BASE_URL}/api/hotels/search?${queryParams}`);

  if (!res.ok) throw new Error("Error fetching hotels");

  const data = await res.json();

  return data;
}
