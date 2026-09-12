import { AppShell } from "@/components/app-shell";
import { ReviewSession } from "@/components/review-session";
import { requireUser } from "@/lib/auth";
import { getDueReviews } from "@/lib/db";

export default async function ReviewPage() {
  const user = await requireUser();
  const due = await getDueReviews(user.id);

  return (
    <AppShell user={user}>
      <h1 className="mb-6 text-3xl font-semibold">חזרה להיום</h1>
      <ReviewSession items={due} />
    </AppShell>
  );
}
