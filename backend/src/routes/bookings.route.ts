import express, { Request, Response } from "express";
import Stripe from "stripe";
import { verifyToken } from "../middleware/auth";
import Hotel from "../models/hotel.model";
import { BookingType } from "../shared/types";
import Booking from "../models/booking.model";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {});

const router = express.Router({ mergeParams: true });

router.post(
  "/payment-intent",
  verifyToken,
  async (req: Request, res: Response) => {
    const { numberOfNights } = req.body;

    const { hotelId } = req.params;

    const hotel = await Hotel.findById(hotelId);

    if (!hotel)
      return res
        .status(400)
        .json({ status: "fail", message: "Hotel not found" });

    const totalCost = hotel.pricePerNight * Number(numberOfNights) * 100;

    console.log(totalCost);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCost,
      currency: "usd",
      metadata: {
        hotelId,
        userId: req.userId,
      },
    });

    if (!paymentIntent.client_secret)
      return res.status(500).json({
        status: "error",
        message: "Looks like there was an error creating a payment intent",
      });

    const response = {
      status: "success",
      data: {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        totalCost,
      },
    };

    res.status(200).json(response);
  }
);

router.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId as string
    );

    if (!paymentIntent)
      return res
        .status(400)
        .json({ status: "fail", message: "Payment intent not found" });

    if (
      paymentIntent.metadata.hotelId !== req.params.hotelId ||
      paymentIntent.metadata.userId !== req.userId
    )
      return res
        .status(400)
        .json({ status: "fail", message: "Payment intent mismatch" });

    if (paymentIntent.status !== "succeeded")
      return res.status(400).json({
        status: "fail",
        message: `Payment intent not succeded. Status: ${paymentIntent.status}`,
      });

    const hotel = await Hotel.findById(req.params.hotelId);

    if (!hotel)
      return res
        .status(400)
        .json({ status: "fail", message: "Hotel not found" });

    const newBooking: BookingType = await Booking.create({
      ...req.body,
      userId: req.userId,
      hotelId: req.params.hotelId,
    });

    res.status(201).json({ status: "success", data: { newBooking } });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Something went wrong" });
  }
});

export default router;
