import { AiFillStar } from "react-icons/ai";
import { HotelType } from "../../../backend/src/shared/types";
import { formatCurrency } from "../util/helpers";
import { Link, useSearchParams } from "react-router-dom";

type Props = {
  hotel: HotelType;
};

function SearchResultCard({ hotel }: Props) {
  const [searchParams] = useSearchParams();

  return (
    <div
      className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-slate-300 rounded-lg p-8 gap-8"
      key={hotel._id}
    >
      <div className="w-full h-[300px]">
        <img
          src={hotel.imageUrls[0]}
          alt="hotel image"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="grid grid-rows-[1fr_2fr_1fr]">
        <div className="space-y-3">
          <div className="flex items-center">
            <span className="flex">
              {Array.from({ length: hotel.starRating }).map((_, i) => (
                <AiFillStar className="fill-yellow-400" key={i} />
              ))}
            </span>

            <p className="ml-1 text-sm">{hotel.type}</p>
          </div>

          <Link
            to={`/detail/${hotel._id}?${searchParams.toString()}`}
            className="text-2xl font-bold cursor-pointer block"
          >
            {hotel.name}
          </Link>
        </div>

        <div>
          <p className="line-clamp-4">{hotel.description}</p>
        </div>

        <div className="grid grid-cols-2 items-end whitespace-nowrap">
          <div className="flex gap-1 items-center">
            {hotel.facilities.slice(0, 3).map((facility) => (
              <span
                className="bg-slate-300 p-2 rounded-lg font-bold text-xs whitespace-nowrap"
                key={facility}
              >
                {facility}
              </span>
            ))}
            <p className="text-sm">
              {hotel.facilities.length > 3 &&
                `+${hotel.facilities.length - 3} more`}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <p className="font-bold">
              {formatCurrency(hotel.pricePerNight)} per night
            </p>
            <Link
              to={`/detail/${hotel._id}?${searchParams.toString()}`}
              className="bg-blue-600 text-white h-full p-2 font-bold text-xl max-w-fit hover:bg-blue-500"
            >
              View More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchResultCard;
