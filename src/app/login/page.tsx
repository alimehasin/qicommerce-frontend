import Image from "next/image";
import { Login } from "./login";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 bg-primary/5 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/login-illustration.svg"
            alt="Login illustration"
            width={500}
            height={500}
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <Login />
        </div>
      </div>
    </div>
  );
}
