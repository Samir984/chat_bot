import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "@/components/Layout";
import Chat from "@/pages/Chat";

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [{ index: true, element: <Chat /> }],
  },
];

const router = createBrowserRouter(routes);

export default function App() {
  return <RouterProvider router={router} />;
}
