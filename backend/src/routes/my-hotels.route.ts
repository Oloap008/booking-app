import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel.model";
import { HotelType } from "../shared/types";
import { verifyToken } from "../middleware/auth";
import { body } from "express-validator";
import console, { error } from "console";
import mongoose from "mongoose";

const router = express.Router();

async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");
    const dataUri = `data:${image.mimetype};base64,${b64}`;
    const res = await cloudinary.v2.uploader.upload(dataUri);

    return res.url;
  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight")
      .notEmpty()
      .withMessage("Price per night is required and must be a number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities is required"),
  ],
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;

      const imageUrls = await uploadImages(imageFiles);

      const hotel = await Hotel.create({
        ...newHotel,
        imageUrls: [...imageUrls],
        lastUpdated: new Date(),
        userId: req.userId,
      });

      res.status(201).json({ status: "success", data: hotel });
    } catch (error) {
      console.log("Error creating hotel: ", error);
      res
        .status(500)
        .json({ status: "error", message: "Something went wrong" });
    }
  }
);

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });

    res
      .status(200)
      .json({ status: "success", results: hotels.length, data: { hotels } });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error fetching hotels" });
  }
});

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const hotel = await Hotel.findOne({ _id: id, userId: req.userId });

    res.status(200).json({
      status: "success",
      data: {
        hotel,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error fetching the hotel" });
  }
});

router.put(
  "/:id",
  verifyToken,
  upload.array("imageFiles"),
  async (req: Request, res: Response) => {
    try {
      const hotel = await Hotel.findOne({
        _id: req.params.id,
        userId: req.userId,
      });

      if (!hotel)
        return res
          .status(404)
          .json({ status: "fail", message: "Hotel not found" });

      const updateHotelData: HotelType = req.body;
      updateHotelData.lastUpdated = new Date();

      const imageFiles = req.files as Express.Multer.File[];

      const uploadedImageUrls = await uploadImages(imageFiles);

      updateHotelData.imageUrls = [
        ...uploadedImageUrls,
        ...(updateHotelData.imageUrls || []),
      ];

      const updatedHotel = await Hotel.findOneAndUpdate(
        {
          _id: req.params.id,
          userId: req.userId,
        },
        updateHotelData,
        { new: true }
      );

      res.status(200).json({ status: "success", data: updatedHotel });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: "error", message: "Something went wrong" });
    }
  }
);

export default router;
