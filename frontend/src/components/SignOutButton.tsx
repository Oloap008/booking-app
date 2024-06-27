import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";

function SignOutButton() {
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const { isPending, mutate } = useMutation({
    mutationFn: apiClient.signOut,
    async onSuccess() {
      showToast({ message: "Signed Out", type: "SUCCESS" });
      await queryClient.invalidateQueries({
        queryKey: ["validateToken"],
      });
    },
    onError(error: Error) {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  return (
    <button
      className="text-blue-600 px-3 font-bold bg-white hover:bg-gray-100"
      disabled={isPending}
      onClick={() => mutate()}
    >
      Sign out
    </button>
  );
}

export default SignOutButton;
