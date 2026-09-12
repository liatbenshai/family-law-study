export function SourcesList({ sources }: { sources: string }) {
  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <h2 className="mb-2 text-sm font-medium text-muted">מקורות</h2>
      <p className="whitespace-pre-wrap text-sm leading-6">{sources}</p>
    </section>
  );
}
