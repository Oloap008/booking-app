import { useFilterSearchParam } from "../hooks/useFilterSearchParam";

function StarRatingFilter() {
  const { allFilters, handleCheck } = useFilterSearchParam("sr");

  return (
    <div className="border-b border-slate-300 pb-5">
      <h4 className="text-md font-semibold mb-2">Property Rating</h4>
      {["5", "4", "3", "2", "1"].map((star) => (
        <label className="flex items-center space-x-2" key={star}>
          <input
            type="checkbox"
            className="rounded"
            value={star}
            checked={allFilters.includes(`sr${star}`)}
            onChange={handleCheck}
          />
          <p>{star} Stars</p>
        </label>
      ))}
    </div>
  );
}

export default StarRatingFilter;
