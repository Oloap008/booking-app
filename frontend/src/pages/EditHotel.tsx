import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";

function EditHotel() {
  const { showToast } = useAppContext();
  const { hotelId } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isPending: isFetching, data: hotel } = useQuery({
    queryFn: () => apiClient.fetchMyHotelById(hotelId || ""),
    queryKey: ["myHotel"],
    enabled: !!hotelId,
  });

  const { isPending: isUpdating, mutate } = useMutation({
    mutationFn: apiClient.updateMyHotelById,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["myHotel"],
      });
      showToast({ message: "Hotel successfully updated", type: "SUCCESS" });
      navigate("/my-hotels");
    },
    onError: () => {
      showToast({ message: "Error updating hotel", type: "ERROR" });
    },
  });

  function handleSave(hotelFormData: FormData) {
    mutate(hotelFormData);
  }

  if (isFetching || isUpdating) return <div>Loading...</div>;

  return (
    <ManageHotelForm
      hotel={hotel}
      onSave={handleSave}
      isPending={isFetching || isUpdating}
    />
  );
}

export default EditHotel;
