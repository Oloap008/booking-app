import { hotelTypes } from "../config/hotel-options-config";
import { useFilterSearchParam } from "../hooks/useFilterSearchParam";

function HotelTypesFilter() {
  const { allFilters, handleCheck } = useFilterSearchParam("type:");

  return (
    <div className="border-b border-slate-300 pb-5">
      <h4 className="text-md font-semibold mb-2">Hotel Type</h4>
      {hotelTypes.map((type) => (
        <label className="flex items-center space-x-2" key={type}>
          <input
            type="checkbox"
            className="rounded"
            checked={allFilters.includes(`type:${type}`)}
            value={type}
            onChange={handleCheck}
          />
          <p>{type}</p>
        </label>
      ))}
    </div>
  );
}

export default HotelTypesFilter;
