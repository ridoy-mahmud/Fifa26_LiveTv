import { useRouter } from "@tanstack/react-router";
import { LayoutDashboard } from "lucide-react";

export function AdminButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.navigate({ to: "/admin" })}
      title="Admin dashboard"
      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/40 transition hover:bg-primary/25"
    >
      <LayoutDashboard className="h-4 w-4" />
    </button>
  );
}
