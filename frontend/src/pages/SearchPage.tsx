import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import * as apiClient from "../api-client";
import SearchResultCard from "../components/SearchResultCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypesFilter from "../components/HotelTypesFilter";
import FacilitiesFilter from "../components/FacilitiesFilter";
import PriceFilter from "../components/PriceFilter";
import SortByFilter from "../components/SortByFilter";

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;

  function handlePageChange(page: number) {
    searchParams.set("page", page.toString());

    const arr = ["star1", "star2", "star3", 4, 5];

    searchParams.set("filters", JSON.stringify({ star: arr.join(",") }));

    setSearchParams(searchParams);
  }

  const fetchSearchParams = {
    destination: searchParams.get("dest") as string,
    checkIn: searchParams.get("checkIn") as string,
    checkOut: searchParams.get("checkOut") as string,
    adultCount: searchParams.get("adultCount") as string,
    childCount: searchParams.get("childCount") as string,
    page: page.toString(),
    stars: searchParams
      .get("filters")
      ?.split(",")
      .filter((el) => el.startsWith("sr"))
      .map((el) => el.substring(2)),
    types: searchParams
      .get("filters")
      ?.split(",")
      .filter((el) => el.startsWith("type:"))
      .map((el) => el.substring(5)),
    facilities: searchParams
      .get("filters")
      ?.split(",")
      .filter((el) => el.startsWith("facility:"))
      .map((el) => el.substring(9)),
    maxPrice: searchParams.get("maxPrice") as string,
    sortedBy: searchParams.get("sortedBy") as string,
  };

  const { data: hotels, isPending } = useQuery({
    queryKey: ["searchHotels", fetchSearchParams],
    queryFn: () => apiClient.searchHotels(fetchSearchParams),
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-2">
        <div className="space-y-5">
          <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
            Filter by:
          </h3>
          <StarRatingFilter />
          <HotelTypesFilter />
          <FacilitiesFilter />
          <PriceFilter />
        </div>
      </div>

      {isPending ? (
        <div>Loading...</div>
      ) : !hotels?.pagination.total ? (
        <div>No hotels found</div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <p className="text-xl font-bold">
              {hotels?.pagination.total}{" "}
              {hotels?.pagination.total > 1 ? "Hotels" : "Hotel"} Found{" "}
              {searchParams.get("dest") !== "all" &&
                searchParams.get("dest") &&
                `in ${searchParams.get("dest")}`}
            </p>

            <SortByFilter />
          </div>

          {hotels?.data.hotels.map((hotel) => (
            <SearchResultCard hotel={hotel} key={hotel._id} />
          ))}

          <div>
            <Pagination
              page={page}
              pages={hotels?.pagination.pages || 1}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
