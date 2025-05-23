import { Header } from "@/components/header";
import { getToken } from "@/server/actions";

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getToken();

  return (
    <div>
      <Header token={token} />

      <main className="container mx-auto py-6">{children}</main>
    </div>
  );
}
