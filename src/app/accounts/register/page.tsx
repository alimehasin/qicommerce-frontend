import { Register } from "./register";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 bg-primary/5 relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <h1 className="text-4xl font-bold">QiCommerce</h1>

          <p className="text-sm text-muted-foreground">
            Your one stop shop for all your ecommerce needs.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              Create an account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign up to your account to continue
            </p>
          </div>

          <Register />
        </div>
      </div>
    </div>
  );
}
