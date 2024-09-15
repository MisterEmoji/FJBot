import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./styles/build.css";
import "./styles/style.css";

import landingLoader from "./loaders/landingLoader";
import LandingPage from "./pages/LandingPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    loader: landingLoader,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
