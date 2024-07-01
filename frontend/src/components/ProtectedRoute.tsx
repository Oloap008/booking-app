import { Outlet, useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { useEffect } from "react";

function ProtectedRoute() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAppContext();

  useEffect(
    function () {
      if (!isLoggedIn) navigate("/sign-in");
    },
    [isLoggedIn, navigate]
  );

  return isLoggedIn ? <Outlet /> : null;
}

export default ProtectedRoute;
