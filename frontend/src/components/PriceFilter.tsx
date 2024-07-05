import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function PriceFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("maxPrice") === "") {
      searchParams.delete("maxPrice");
      setSearchParams(searchParams);
    }
  });

  const maxPrice = searchParams.get("maxPrice") || "";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    searchParams.set("maxPrice", e.target.value);
    setSearchParams(searchParams);
  }

  return (
    <div>
      <h4 className="text-md font-semibold mb-2">Max Price</h4>
      <select
        value={maxPrice}
        onChange={handleChange}
        className="p-2 border rounded-md w-full"
      >
        <option value="">Select Max Price</option>
        {[50, 100, 200, 300, 500].map((price) => (
          <option key={price} value={price}>
            {price}
          </option>
        ))}
      </select>
    </div>
  );
}

export default PriceFilter;
