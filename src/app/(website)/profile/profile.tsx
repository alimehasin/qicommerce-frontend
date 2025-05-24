"use client";

import { Button } from "@/components/ui/button";
import type { ProfileServerType } from "@/types/profile";
import { constructApiUrl } from "@/utils/helpers";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function Profile({
  token,
  profile,
}: {
  token: string;
  profile: ProfileServerType;
}) {
  const router = useRouter();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(constructApiUrl("/logout"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
    },

    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      toast.success("Logged out successfully");
      router.push("/");
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-700">
                {profile.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
              <p className="text-blue-100">{profile.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="px-6 py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Profile Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="block text-sm font-medium text-gray-500 mb-1">
                User ID
              </div>
              <p className="text-gray-900 font-medium">#{profile.id}</p>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-500 mb-1">
                Email Status
              </div>
              <div className="flex items-center space-x-2">
                {profile.email_verified_at ? (
                  <>
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-green-700 font-medium">Verified</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <span className="text-yellow-700 font-medium">
                      Pending Verification
                    </span>
                  </>
                )}
              </div>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-500 mb-1">
                Member Since
              </div>
              <p className="text-gray-900 font-medium">
                {formatDate(profile.created_at)}
              </p>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-500 mb-1">
                Last Updated
              </div>
              <p className="text-gray-900 font-medium">
                {formatDate(profile.updated_at)}
              </p>
            </div>
          </div>

          {profile.email_verified_at && (
            <div className="mt-6">
              <div className="block text-sm font-medium text-gray-500 mb-1">
                Email Verified On
              </div>
              <p className="text-gray-900 font-medium">
                {formatDate(profile.email_verified_at)}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <Button
            size="lg"
            className="w-full"
            variant="destructive"
            disabled={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate()}
          >
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </div>
  );
}
