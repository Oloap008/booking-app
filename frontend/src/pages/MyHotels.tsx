import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchMyHotels } from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";
import { formatCurrency } from "../util/helpers";

function MyHotels() {
  const { data: hotelData, error } = useQuery({
    queryFn: fetchMyHotels,
    queryKey: ["hotels"],
  });
  const { showToast } = useAppContext();

  if (error) showToast({ message: error.message, type: "ERROR" });

  return (
    <div className="space-y-5">
      <span className="flex justify-between">
        <h1 className="text-3xl font-bold">My Hotels</h1>
        <Link
          to="/add-hotel"
          className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
        >
          Add Hotel
        </Link>
      </span>

      {!hotelData ? (
        <span>No hotels for now. Might want to add one.</span>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {hotelData?.map((hotel) => (
            <div
              key={hotel._id}
              className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5"
            >
              <h2 className="text-2xl font-bold">{hotel.name}</h2>
              <p className="whitespace-pre-line">{hotel.description}</p>

              <div className="grid grid-cols-5 gap-2">
                <div className="border border-slate-300 rouded-sm p-3 flex items-center gap-1">
                  <BsMap />
                  {hotel.city}, {hotel.country}
                </div>
                <div className="border border-slate-300 rouded-sm p-3 flex items-center gap-1">
                  <BsBuilding />
                  {hotel.type}
                </div>
                <div className="border border-slate-300 rouded-sm p-3 flex items-center gap-1">
                  <BiMoney />
                  {formatCurrency(Number(hotel.pricePerNight))} per night
                </div>
                <div className="border border-slate-300 rouded-sm p-3 flex items-center gap-1">
                  <BiHotel />
                  {hotel.adultCount} adults, {hotel.childCount} children
                </div>
                <div className="border border-slate-300 rouded-sm p-3 flex items-center gap-1">
                  <BiStar />
                  {hotel.starRating} star rating
                </div>
              </div>

              <button className="flex justify-end">
                <Link
                  to={`/hotel-detail/${hotel._id}`}
                  className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
                >
                  View Details
                </Link>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyHotels;
