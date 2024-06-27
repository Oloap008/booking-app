import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as apiClient from "../api-client";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

export type SignInFormData = {
  email: string;
  password: string;
};

function SignIn() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInFormData>();
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: apiClient.signIn,
    async onSuccess() {
      showToast({ message: "Sign in successful", type: "SUCCESS" });
      await queryClient.invalidateQueries({
        queryKey: ["validateToken"],
      });
      navigate("/");
    },
    onError(error: Error) {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  function onSubmit(data: SignInFormData) {
    mutate(data);
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-3xl font-bold">Sign In</h2>

      <label className="text-gray-700 text-sm font-bold flex-1">
        Email
        <input
          disabled={isPending}
          type="email"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("email", {
            required: "This field is required",
          })}
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>

      <label className="text-gray-700 text-sm font-bold flex-1">
        Password
        <input
          disabled={isPending}
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 6,
              message: "Password must be atleast 6 characters",
            },
          })}
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>

      <span className="flex items-center justify-between">
        <span className="text-sm">
          No Registered?{" "}
          <Link to="/register" className="text-blue-600 underline">
            Create an account here
          </Link>
        </span>

        <button
          disabled={isPending}
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
        >
          Sign In
        </button>
      </span>
    </form>
  );
}

export default SignIn;
