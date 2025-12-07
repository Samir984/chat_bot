import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Layout from "@/components/Layout";
import Chat from "@/pages/Chat";
import Collections from "@/pages/Collections";
import { AuthProvider } from "@/context/AuthProvider";
import { Toaster } from "sonner";

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Chat /> },
      { path: "collections", element: <Collections /> },
    ],
  },
];

const router = createBrowserRouter(routes);

export default function App() {
  return (
    <AuthProvider>
      <GoogleOAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}
      >
        <RouterProvider router={router} />
        <Toaster />
      </GoogleOAuthProvider>
    </AuthProvider>
  );
}
