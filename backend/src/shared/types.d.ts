import { LargeNumberLike } from "crypto";
import mongoose from "mongoose";

export type HotelType = {
  _id: string;
  userId: mongoose.Schema.ObjectId;
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  adultCount: number;
  childCount: number;
  facilities: string[];
  pricePerNight: number;
  starRating: number;
  imageUrls: string[];
  lastUpdated: Date;
};

export type UserType = {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type BookingType = {
  _id: string;
  userId: mongoose.Schema.ObjectId;
  hotelId: mongoose.Schema.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childCount: number;
  checkIn: Date;
  checkOut: Date;
  totalCost: number;
};

export type HotelSearchResponse = {
  status: string;
  data: { hotels: HotelType[] };
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};

export type PaymentIntentResponse = {
  status: string;
  data: {
    paymentIntentId: string;
    clientSecret: string;
    totalCost: number;
  };
};
