import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { serializeClient, clientInclude } from "@/lib/serialize";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PropertySidebar } from "@/components/dashboard/PropertySidebar";

export const dynamic = "force-dynamic";

export default async function ClientDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { token: string };
}) {
  const client = await prisma.client.findUnique({
    where: { shareToken: params.token },
    include: clientInclude,
  });

  if (!client) {
    notFound();
  }

  const data = serializeClient(client);

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="space-y-8">
          <DashboardHeader name={data.name} />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
            <PropertySidebar token={data.shareToken} properties={data.properties} />

            <div>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
