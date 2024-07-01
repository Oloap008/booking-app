import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppContextProvider } from "./contexts/AppContext";
import SignIn from "./pages/SignIn";
import ProtectedRoute from "./components/ProtectedRoute";
import AddHotel from "./pages/AddHotel";
import MyHotels from "./pages/MyHotels";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <>Test</>,
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
        element: <ProtectedRoute />,
        children: [
          { path: "add-hotel", element: <AddHotel /> },
          { path: "my-hotels", element: <MyHotels /> },
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
