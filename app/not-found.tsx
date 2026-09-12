import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-full max-w-3xl flex-col justify-center px-4">
      <h1 className="text-3xl font-semibold">העמוד לא נמצא</h1>
      <p className="mt-3 text-muted">ייתכן שהשיעור עדיין בטיוטה, או שהקישור שגוי.</p>
      <Link href="/" className="mt-6 text-accent">
        חזרה לבית
      </Link>
    </div>
  );
}
