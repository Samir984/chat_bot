import { Button } from "@/components/ui/button";
import { Google } from "@ridemountainpig/svgl-react";
import { useGoogleLogin } from "@react-oauth/google";
import { fetchApi } from "@/services/api";
import { useAuth } from "@/context/AuthProvider";
import type { UserApiGoogleLogin200 } from "@/gen/types";
import { toast } from "sonner";
import UserProfile from "@/components/UserProfile";

export default function GoogleLoginButton() {
  const { setUser, setIsAuthenticate, isAuthenticate, user } = useAuth();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const { data, error } = await fetchApi<UserApiGoogleLogin200>(
        "/users/google-login/",
        "POST",
        JSON.stringify({
          credential: tokenResponse.access_token,
        })
      );

      if (data) {
        setUser(data);
        setIsAuthenticate(true);
        toast.success("Logged in successfully");
      }
      if (error) {
        toast.error(error || "Login failed");
        setIsAuthenticate(false);
        setUser(null);
      }
    },
    onError: () => {
      toast.error("Login Failed");
      setIsAuthenticate(false);
      setUser(null);
    },
  });

  if (isAuthenticate && user) {
    return <UserProfile user={user} />;
  }

  return (
    <Button variant="outline" onClick={() => login()}>
      <Google className="w-6 h-6 " />
    </Button>
  );
}
