import { useForm } from "react-hook-form";
import {
  PaymentIntentResponse,
  UserType,
} from "../../../../backend/src/shared/types";
import { formatCurrency } from "../../util/helpers";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";

type Props = {
  currentUser: UserType;
  paymentIntentData: PaymentIntentResponse;
  searchParams: {
    dest: string;
    checkIn: string;
    checkOut: string;
    adultCount: string;
    childCount: string;
  };
};

export type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  adultCount: string;
  childCount: string;
  checkIn: string;
  checkOut: string;
  hotelId: string;
  totalCost: number;
  paymentIntentId: string;
};

function BookingForm({ currentUser, paymentIntentData, searchParams }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const { hotelId } = useParams();
  const { showToast } = useAppContext();

  const { data: paymentIntent } = paymentIntentData;

  const { handleSubmit, register } = useForm<BookingFormData>({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      adultCount: searchParams.adultCount,
      childCount: searchParams.childCount,
      checkIn: searchParams.checkIn,
      checkOut: searchParams.checkOut,
      hotelId,
      totalCost: paymentIntent.totalCost / 100,
    },
  });

  const { isPending, mutate: bookRoom } = useMutation({
    mutationFn: apiClient.createRoomBooking,
    onSuccess() {
      showToast({ message: "Booking saved!", type: "SUCCESS" });
    },
    onError() {
      showToast({ message: "Error saving bookind", type: "ERROR" });
    },
  });

  async function onSubmit(formData: BookingFormData) {
    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement) as StripeCardElement,
      },
    });

    if (result.paymentIntent?.status === "succeeded") {
      bookRoom({ ...formData, paymentIntentId: result.paymentIntent.id });
    }
  }

  return (
    <form
      className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <p className="text-3xl font-bold">Confirm Your Details</p>

      <div className="grid grid-cols-2 gap-6">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            type="text"
            readOnly
            disabled
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal cursor-not-allowed"
            {...register("firstName")}
          />
        </label>

        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            type="text"
            readOnly
            disabled
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal cursor-not-allowed"
            {...register("lastName")}
          />
        </label>
      </div>

      <label className="text-gray-700 text-sm font-bold flex-1">
        Email
        <input
          type="text"
          readOnly
          disabled
          className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal cursor-not-allowed"
          {...register("email")}
        />
      </label>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Your price summary</h2>

        <div className="bg-blue-200 p-4 rounded-md">
          <div className="font-semibold text-lg">
            Total Cost: {formatCurrency(paymentIntent.totalCost / 100)}
          </div>
          <p className="text-xs">Includes taxes and charges</p>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Payment Details</h3>

        <CardElement
          id="payment-element"
          className="border rounded-md p-2 text-sm"
        />
      </div>

      <div className="flex justify-end">
        <button
          disabled={isPending}
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md disabled:bg-gray-500"
        >
          {isPending ? "Booking" : "Confirm Booking"}
        </button>
      </div>
    </form>
  );
}

export default BookingForm;
