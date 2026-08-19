import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { serializeClient, clientInclude } from "@/lib/serialize";
import { PropertyCard } from "@/components/dashboard/PropertyCard";
import { AddPropertyForm } from "@/components/dashboard/AddPropertyForm";

export const dynamic = "force-dynamic";

export default async function ClientHomePage({
  params,
}: {
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
  const favorites = data.properties.filter((p) => p.isFavorite);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-charcoal">Favorites</h1>
        <p className="mt-1 text-sm text-warm-gray">
          Star a home from the list below to pin it here.
        </p>
        {favorites.length === 0 ? (
          <p className="mt-4 rounded-card border border-dashed border-line bg-white p-6 text-center text-sm text-warm-gray">
            No favorites yet.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((p) => (
              <PropertyCard key={p.id} token={data.shareToken} property={p} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-serif text-2xl font-semibold text-charcoal">Home List</h2>
        <p className="mt-1 text-sm text-warm-gray">
          Every home you&apos;re tracking. Star your favorites, or pick one to
          start an offer whenever you&apos;re ready.
        </p>

        {data.properties.length === 0 ? (
          <p className="mt-4 rounded-card border border-dashed border-line bg-white p-6 text-center text-sm text-warm-gray">
            No homes added yet &mdash; add your first listing below.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.properties.map((p) => (
              <PropertyCard key={p.id} token={data.shareToken} property={p} />
            ))}
          </div>
        )}
      </div>

      <AddPropertyForm token={data.shareToken} />
    </div>
  );
}
