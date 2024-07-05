import { useForm } from "react-hook-form";
import { formatCurrency } from "../../util/helpers";
import DatePicker from "react-datepicker";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";

type Props = {
  hotelId: string;
  pricePerNight: number;
};

type GuestInfoFormData = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
};

function GuestInfoForm({ hotelId, pricePerNight }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoggedIn } = useAppContext();

  const {
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GuestInfoFormData>({
    defaultValues: {
      checkOut: new Date(searchParams.get("checkOut") || Date.now()),
      checkIn: new Date(
        searchParams.get("checkIn") || Date.now() + 24 * 60 * 60 * 1000
      ),
      adultCount: Number(searchParams.get("adultCount")) || 1,
      childCount: Number(searchParams.get("childCount")) || 0,
    },
  });

  function onSubmit() {
    navigate(`/hotel/${hotelId}/booking`);
  }

  function onSignInClick(formData: GuestInfoFormData) {
    searchParams.set("adultCount", formData.adultCount.toString());
    searchParams.set("childCount", formData.childCount.toString());
    searchParams.set("checkIn", formData.checkIn.toLocaleDateString("sv-SE"));
    searchParams.set("checkOut", formData.checkOut.toLocaleDateString("sv-SE"));

    setSearchParams(searchParams);

    navigate("/sign-in", {
      state: {
        from: {
          pathname: location.pathname,
          search: `?${searchParams.toString()}`,
        },
      },
    });
  }

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  return (
    <div className="flex flex-col p-4 bg-blue-200 gap-4">
      <h3 className="text-md font-bold">{formatCurrency(pricePerNight)}</h3>

      <form
        onSubmit={
          isLoggedIn ? handleSubmit(onSubmit) : handleSubmit(onSignInClick)
        }
      >
        <div className="grid grid-cols-1 gap-4 items-center">
          <div>
            <DatePicker
              required
              selected={checkIn}
              onChange={(date) => setValue("checkOut", date as Date)}
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
              required
              selected={checkOut}
              onChange={(date) => setValue("checkOut", date as Date)}
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

          <div className="flex bg-white px-2 py-1 gap-2">
            <label className="flex items-center">
              Adults:{" "}
              <input
                className="w-full p-1 focus:outline-none font-bold"
                type="number"
                min={1}
                max={20}
                {...register("adultCount", {
                  required: "This field is required",
                  min: {
                    value: 1,
                    message: "There must be atleast 1 adult",
                  },
                  max: {
                    value: 20,
                    message: "Maximum is only up to 20 adults",
                  },
                  valueAsNumber: true,
                })}
              />
            </label>

            <label className="flex items-center">
              Children:{" "}
              <input
                className="w-full p-1 focus:outline-none font-bold"
                type="number"
                min={0}
                max={20}
                {...register("childCount", {
                  valueAsNumber: true,
                })}
              />
            </label>
            {errors.adultCount && (
              <p className="text-red-500 font-semibold text-sm">
                {errors.adultCount?.message}
              </p>
            )}
          </div>
          {isLoggedIn ? (
            <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
              Book Now
            </button>
          ) : (
            <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
              Sign in to Book
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default GuestInfoForm;
