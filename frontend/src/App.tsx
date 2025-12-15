import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Layout from "@/components/Layout";
import Chat from "@/pages/Chat";
import Collections from "@/pages/Collections";
import { AuthProvider } from "@/contexts/AuthProvider";
import { CollectionsProvider } from "@/contexts/CollectionsProvider";
import { Toaster } from "sonner";
import { useEffect } from "react";

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Chat /> },
      { path: "collections", element: <Collections /> },
      { path: "/conversation/:id", element: <Chat /> },
    ],
  },
];

const router = createBrowserRouter(routes);

export default function App() {
  // clear globacl catch on refresh
  useEffect(() => {
    localStorage.clear();
  }, []);
  return (
    <AuthProvider>
      <GoogleOAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}
      >
        <CollectionsProvider>
          <RouterProvider router={router} />
          <Toaster />
        </CollectionsProvider>
      </GoogleOAuthProvider>
    </AuthProvider>
  );
}
