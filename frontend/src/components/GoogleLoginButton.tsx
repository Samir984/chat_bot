import { Button } from "@/components/ui/button";
import { Google } from "@ridemountainpig/svgl-react";
import { useGoogleLogin } from "@react-oauth/google";

export default function GoogleLoginButton() {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch(
          "http://localhost:8000/api/users/google-login/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ credential: tokenResponse.access_token }),
            credentials: "include",
          }
        );

        if (!res.ok) {
          throw new Error("Login failed");
        }

        await res.json();
        // Login successful, cookies set
        window.location.reload(); // Reload to update UI state
      } catch (error) {
        console.error("Login error:", error);
      }
    },
    onError: () => console.log("Login Failed"),
  });

  return (
    <Button variant="outline" onClick={() => login()}>
      <Google className="w-6 h-6" />
    </Button>
  );
}
