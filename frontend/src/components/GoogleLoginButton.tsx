import { Button } from "@/components/ui/button";
import { Google } from "@ridemountainpig/svgl-react";
import { useGoogleLogin } from "@react-oauth/google";
import { fetchApi } from "@/services/api";
import { useAuth } from "@/context/AuthProvider";

export default function GoogleLoginButton() {
  const { setUser, setIsAuthenticate } = useAuth();
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const { data, error } = await fetchApi(
        "/users/google-login/",
        "POST",
        JSON.stringify({
          credential: tokenResponse.access_token,
        })
      );

      if (data) {
        setUser(data);
        setIsAuthenticate(true);
      }
    },
    onError: () => console.log("Login Failed"),
  });

  return (
    <>
      <Button variant="outline" onClick={() => login()}>
        <Google className="w-6 h-6" />
      </Button>
    </>
  );
}
