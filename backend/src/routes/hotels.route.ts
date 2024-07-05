import express, { Request, Response, query } from "express";
import Hotel from "../models/hotel.model";
import { HotelSearchResponse } from "../shared/types";

const router = express.Router();

function constructSearchQuery(queryParams: any) {
  let constructedQuery: any = {};

  if (queryParams.destination && queryParams.destination !== "all") {
    constructedQuery.$or = [
      { city: { $regex: new RegExp(queryParams.destination, "i") } },
      { country: { $regex: new RegExp(queryParams.destination, "i") } },
    ];
  }

  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? [...queryParams.facilities]
        : queryParams.facilities,
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? [...queryParams.types]
        : queryParams.types,
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => Number(star))
      : Number(queryParams.stars);

    constructedQuery.starRating = {
      $in: starRatings,
    };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: Number(queryParams.maxPrice),
    };
  }
  return constructedQuery;
}

router.get("/search", async (req: Request, res: Response) => {
  try {
    const query = constructSearchQuery(req.query);

    let sortOptions = {};

    switch (req.query.sortedBy) {
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      case "pricePerNightAsc":
        sortOptions = { pricePerNight: 1 };
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 };
        break;
    }

    const pageSize = parseInt(
      req.query.limit ? req.query.limit.toString() : "5"
    );
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );
    const skip = (pageNumber - 1) * pageSize;

    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    const totalHotels = await Hotel.countDocuments(query);

    const response: HotelSearchResponse = {
      status: "success",
      data: { hotels },
      pagination: {
        total: totalHotels,
        page: pageNumber,
        pages: Math.ceil(totalHotels / pageSize),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ status: "error", message: "Something went wrong" });
  }
});

export default router;
