import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppContextProvider } from "./contexts/AppContext";
import SignIn from "./pages/SignIn";
import ProtectedRoute from "./components/ProtectedRoute";
import AddHotel from "./pages/AddHotel";
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";
import SearchPage from "./pages/SearchPage";
import HotelDetail from "./components/HotelDetail";
import SearchBar from "./components/SearchBar";
import Booking from "./pages/Booking";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <div className="mb-10">
            <SearchBar />
            <p>test</p>
          </div>
        ),
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        path: "/detail/:hotelId",
        element: <HotelDetail />,
      },

      {
        element: <ProtectedRoute />,
        children: [
          { path: "add-hotel", element: <AddHotel /> },
          {
            path: "my-hotels",
            element: <MyHotels />,
          },
          { path: "hotel-detail/:hotelId", element: <EditHotel /> },
          {
            path: "/hotel/:hotelId/booking",
            element: <Booking />,
          },
        ],
      },
    ],
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <RouterProvider router={router} />
      </AppContextProvider>
    </QueryClientProvider>
  );
}

export default App;
