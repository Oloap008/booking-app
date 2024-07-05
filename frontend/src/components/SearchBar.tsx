import { FormEvent, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdTravelExplore } from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router-dom";

function SearchBar() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [destination, setDestination] = useState<string>(
    searchParams.get("dest") || ""
  );
  const [checkIn, setCheckIn] = useState<Date>(
    new Date(searchParams.get("checkIn") || Date.now())
  );
  const [checkOut, setCheckOut] = useState<Date>(
    new Date(searchParams.get("checkOut") || Date.now() + 24 * 60 * 60 * 1000)
  );
  const [adultCount, setAdultCount] = useState<number>(
    Number(searchParams.get("adultCount")) || 1
  );
  const [childCount, setChildCount] = useState<number>(
    Number(searchParams.get("childCount"))
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    searchParams.set("dest", destination || "all");
    searchParams.set("checkIn", checkIn.toLocaleDateString("sv-SE"));
    searchParams.set("checkOut", checkOut.toLocaleDateString("sv-SE"));
    searchParams.set("adultCount", `${adultCount}`);
    searchParams.set("childCount", `${childCount}`);

    setSearchParams(searchParams);

    navigate(`/search?${searchParams.toString()}`);
  }

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  return (
    <form
      onSubmit={handleSubmit}
      className="-mt-8 p-3 bg-orange-400 rounded shadow-md grid gril-cols-2 lg:grid-cols-3 2xl:grid-cols-5 items-center gap-4"
    >
      <div className="flex items-center flex-1 bg-white p-2">
        <MdTravelExplore size={25} className="mr-2" />
        <input
          type="text"
          placeholder="Where are you going?"
          className="text-md w-full focus:outline-none"
          value={destination === "all" ? "" : destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>

      <div className="flex bg-white px-2 py-1 gap-2">
        <label className="flex items-center">
          Adults:{" "}
          <input
            className="w-full p-1 focus:outline-none font-bold"
            type="number"
            min={1}
            max={20}
            value={adultCount}
            onChange={(e) => setAdultCount(Number(e.target.value))}
          />
        </label>
        <label className="flex items-center">
          Children:{" "}
          <input
            className="w-full p-1 focus:outline-none font-bold"
            type="number"
            min={0}
            max={20}
            value={childCount}
            onChange={(e) => setChildCount(Number(e.target.value))}
          />
        </label>
      </div>

      <div>
        <DatePicker
          selected={checkIn}
          onChange={(date) => setCheckIn(date as Date)}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText="Check-in Date"
          className="min-w-full bg-white p-2 focus:outline-none"
          wrapperClassName="min-w-full"
        />
      </div>

      <div>
        <DatePicker
          selected={checkOut}
          onChange={(date) => setCheckOut(date as Date)}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText="Check-in Date"
          className="min-w-full bg-white p-2 focus:outline-none"
          wrapperClassName="min-w-full"
        />
      </div>

      <div className="flex gap-1">
        <button className="w-2/3 bg-blue-600 text-white h-full p-2 font-bold text-xl hover:bg-blue-500">
          Search
        </button>
        <button className="w-1/3 bg-red-600 text-white h-full p-2 font-bold text-xl hover:bg-red-500">
          Clear
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
