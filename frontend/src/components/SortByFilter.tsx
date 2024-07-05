import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function SortByFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("sortedBy") === "") {
      searchParams.delete("sortedBy");
      setSearchParams(searchParams);
    }
  });

  function handleSortByOptions(e: React.ChangeEvent<HTMLSelectElement>) {
    searchParams.set("sortedBy", e.target.value);

    setSearchParams(searchParams);
  }

  return (
    <select
      value={searchParams.get("sortedBy") || ""}
      onChange={handleSortByOptions}
      className="p-2 border rounded-md"
    >
      <option value="">Sort By</option>
      <option value="starRating">Star Rating</option>
      <option value="pricePerNightAsc">Price Per Night (low to high)</option>
      <option value="pricePerNightDesc">Price Per Night (high to low)</option>
    </select>
  );
}

export default SortByFilter;
