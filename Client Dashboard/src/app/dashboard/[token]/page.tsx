import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { serializeTransaction, transactionInclude } from "@/lib/serialize";
import { DashboardView } from "@/components/dashboard/DashboardView";

export const dynamic = "force-dynamic";

export default async function ClientDashboardPage({
  params,
}: {
  params: { token: string };
}) {
  const transaction = await prisma.transaction.findUnique({
    where: { shareToken: params.token },
    include: transactionInclude,
  });

  if (!transaction) {
    notFound();
  }

  return <DashboardView transaction={serializeTransaction(transaction)} />;
}
