import { useMutation } from "@tanstack/react-query";
import { useAppContext } from "../contexts/AppContext";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";

import * as apiClient from "../api-client";
import { useNavigate } from "react-router-dom";

function AddHotel() {
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const { mutate, isPending } = useMutation({
    mutationFn: apiClient.addMyHotel,
    onSuccess() {
      navigate("/my-hotels");
      showToast({ message: "Hotel saved", type: "SUCCESS" });
    },
    onError() {
      showToast({ message: "Error saving hotel", type: "ERROR" });
    },
  });

  function handleSave(formData: FormData) {
    mutate(formData);
  }

  return <ManageHotelForm onSave={handleSave} isPending={isPending} />;
}

export default AddHotel;
