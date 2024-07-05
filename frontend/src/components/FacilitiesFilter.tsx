import { hotelFacilities } from "../config/hotel-options-config";
import { useFilterSearchParam } from "../hooks/useFilterSearchParam";

function FacilitiesFilter() {
  const { allFilters, handleCheck } = useFilterSearchParam("facility:");

  return (
    <div className="border-b border-slate-300 pb-5">
      <h4 className="text-md font-semibold mb-2">Property Rating</h4>
      {hotelFacilities.map((facility) => (
        <label className="flex items-center space-x-2" key={facility}>
          <input
            type="checkbox"
            className="rounded"
            value={facility}
            checked={allFilters.includes(`facility:${facility}`)}
            onChange={handleCheck}
          />
          <p>{facility}</p>
        </label>
      ))}
    </div>
  );
}

export default FacilitiesFilter;
