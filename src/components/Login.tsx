import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { validateEmail, validatePassword } from "@/utils/validators";
import { useAuth } from "@/context/useAuth";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const { login } = useAuth();

  async function handleLogin(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Invalid email");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long and include 1 uppercase, 1 lowercase, 1 number, and 1 special character"
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData.message);

        setError(errorData.message);
        return;
      }

      const data = await response.json();
      console.log("Success:", data);
      setMessage("Logged in successfully. Redirecting....");
      login(data.accessToken);
    } catch (err) {
      console.error("Network error:", err);
      setError("Could not complete action. Please try again later.");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-xs text-gray-500 hover:text-gray-700 px-2 py-0"
              >
                {showPassword ? "Hide Password" : "Show Password"}
              </button>
            </div>
            <Button className="w-full" type="submit">
              Sign in
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-sm text-gray-500 justify-center">
          Don&apos;t have an account?{" "}
          <a href="/register" className="ml-1 underline">
            Sign up
          </a>
        </CardFooter>
        {error && <p className="text-red-500 text-sm m-2 mt-1">{error}</p>}
        {message && (
          <p className="text-green-700 text-sm m-2 mt-1">{message}</p>
        )}
      </Card>
    </div>
  );
};

export default Login;
