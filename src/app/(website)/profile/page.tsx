import { getToken } from "@/server/actions";
import type { ProfileServerType } from "@/types/profile";
import { constructApiUrl } from "@/utils/helpers";
import { redirect } from "next/navigation";
import { Profile } from "./profile";

export default async function ProfilePage() {
  const token = await getToken();

  if (!token) {
    redirect("/accounts/login?redirect=/profile");
  }

  const profileRes = await fetch(constructApiUrl("/profile"), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!profileRes.ok) {
    redirect("/accounts/login?redirect=/profile");
  }

  const profile: ProfileServerType = await profileRes.json();

  return <Profile profile={profile} token={token} />;
}
