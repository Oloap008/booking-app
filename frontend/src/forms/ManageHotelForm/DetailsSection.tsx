import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

function DetailsSection() {
  const {
    register,
    formState: { errors },
    getValues,
  } = useFormContext<HotelFormData>();

  const isEditting = !!getValues("_id");

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold mb-3">
        {isEditting ? "Hotel Details" : "Add Hotel"}
      </h1>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Name
        <input
          // disabled={isPending}
          type="text"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("name", {
            required: "This field is required",
          })}
        />
        {errors.name && (
          <span className="text-red-500 text-sm font-bold">
            {errors.name.message}
          </span>
        )}
      </label>

      <div className="flex gap-4">
        <label className="text-gray-700 text-sm font-bold flex-1">
          City
          <input
            // disabled={isPending}
            type="text"
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("city", {
              required: "This field is required",
            })}
          />
          {errors.city && (
            <span className="text-red-500 text-sm font-bold">
              {errors.city.message}
            </span>
          )}
        </label>

        <label className="text-gray-700 text-sm font-bold flex-1">
          Country
          <input
            // disabled={isPending}
            type="text"
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("country", {
              required: "This field is required",
            })}
          />
          {errors.country && (
            <span className="text-red-500 text-sm font-bold">
              {errors.country.message}
            </span>
          )}
        </label>
      </div>

      <label className="text-gray-700 text-sm font-bold flex-1">
        Description
        <textarea
          // disabled={isPending}
          rows={10}
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("description", {
            required: "This field is required",
          })}
        />
        {errors.description && (
          <span className="text-red-500 text-sm font-bold">
            {errors.description.message}
          </span>
        )}
      </label>

      <label className="text-gray-700 text-sm font-bold max-w-[50%]">
        Price Per Night
        <input
          // disabled={isPending}
          type="number"
          min={1}
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("pricePerNight", {
            required: "This field is required",
          })}
        />
        {errors.pricePerNight && (
          <span className="text-red-500 text-sm font-bold">
            {errors.pricePerNight.message}
          </span>
        )}
      </label>

      <label className="text-gray-700 text-sm font-bold max-w-[50%]">
        Star Rating
        <select
          {...register("starRating", {
            required: "This field is required",
          })}
          className="border rounded w-full p-2 text-gray-700 font-normal"
        >
          <option value="" className="text-sm font-bold">
            Select a Rating
          </option>
          {Array.from({ length: 5 }, (_, i) => i + 1).map((el) => (
            <option value={el} key={el}>
              {el}
            </option>
          ))}
        </select>
        {errors.starRating && (
          <span className="text-red-500 text-sm font-bold">
            {errors.starRating.message}
          </span>
        )}
      </label>
    </div>
  );
}

export default DetailsSection;
