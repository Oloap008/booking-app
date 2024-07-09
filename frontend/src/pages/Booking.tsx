import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api-client";
import BookingForm from "../forms/BookingForm/BookingForm";
import { useLocation, useParams } from "react-router-dom";
import { differenceInDays } from "date-fns";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../contexts/AppContext";

function Booking() {
  const { hotelId } = useParams();
  const location = useLocation();
  const { stripePromise } = useAppContext();

  const searchParams = location.state.from
    .split("&")
    .reduce((state: Record<string, string>, searchParams: string) => {
      const [key, value] = searchParams.split("=");
      state[key] = value;

      return state;
    }, {});

  const numberOfNights = differenceInDays(
    searchParams.checkOut,
    searchParams.checkIn
  );

  const { isPending: isFetchingHotel, data: hotel } = useQuery({
    queryFn: () => apiClient.fetchHotelById(hotelId as string),
    queryKey: ["hotel"],
    enabled: !!hotelId,
  });

  const { isPending: isFetchingCurrentUser, data: currentUser } = useQuery({
    queryFn: apiClient.fetchCurrentUser,
    queryKey: ["currentUser"],
  });

  const { isPending: isFetchingPaymentIntentData, data: paymentIntentData } =
    useQuery({
      queryFn: () =>
        apiClient.createPaymentIntent(
          hotelId as string,
          numberOfNights.toString() as string
        ),
      queryKey: ["paymentIntent"],
      enabled: !!hotelId && numberOfNights > 0,
    });

  const isFetcingData =
    isFetchingHotel || isFetchingCurrentUser || isFetchingPaymentIntentData;
  const noData = !currentUser || !hotel || !paymentIntentData;

  if (isFetcingData || noData) return <div>Loading...</div>;

  return (
    <div className="grid md:grid-cols-[1fr_2fr]">
      <BookingDetailsSummary
        checkIn={searchParams.checkIn}
        checkOut={searchParams.checkOut}
        adultCount={searchParams.adultCount}
        childCount={searchParams.childCount}
        numOfNights={numberOfNights}
        hotel={hotel}
      />
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret: paymentIntentData.data.clientSecret,
        }}
      >
        <BookingForm
          currentUser={currentUser}
          paymentIntentData={paymentIntentData}
          searchParams={searchParams}
        />
      </Elements>
    </div>
  );
}

export default Booking;
