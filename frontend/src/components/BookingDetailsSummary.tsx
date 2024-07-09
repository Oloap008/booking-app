import { HotelType } from "../../../backend/src/shared/types";

type Props = {
  checkIn: string;
  checkOut: string;
  adultCount: string;
  childCount: string;
  numOfNights: number;
  hotel: HotelType;
};

function BookingDetailsSummary({
  checkIn,
  checkOut,
  adultCount,
  childCount,
  numOfNights,
  hotel,
}: Props) {
  return (
    <div className="grid gap-4 rounded-lg border border-slate-300 p-5 h-fit">
      <h2 className="text-xl font-bold">Your Booking Details</h2>
      <div className="border-b py-2">
        Location:
        <p className="font-bold">{`${hotel.name}, ${hotel.city}, ${hotel.country}`}</p>
      </div>

      <div className="flex justify-between border-b">
        <div>
          Check-in
          <p className="font-bold">{new Date(checkIn).toDateString()}</p>
        </div>
        <div>
          Check-out
          <p className="font-bold">{new Date(checkOut).toDateString()}</p>
        </div>
      </div>

      <div className="border-b py-2">
        Total length of stay:
        <p className="font-bold">
          {numOfNights} Night{numOfNights > 1 ? "s" : ""}
        </p>
      </div>

      <div>
        Guests{" "}
        <p className="font-bold">
          {`${adultCount} adult${Number(adultCount) > 1 ? "s" : ""}`}
        </p>
        {Number(childCount) > 0 && (
          <span>
            & {childCount} childen{Number(childCount) > 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  );
}

export default BookingDetailsSummary;
