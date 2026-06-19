import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ShieldCheck, X, Loader2, LogOut, LayoutDashboard } from "lucide-react";
import { adminLogin, adminLogout, adminMe } from "@/lib/api/admin-auth.functions";

export const adminQueryKey = ["admin", "me"] as const;

export function useAdminSession() {
  const fetch = useServerFn(adminMe);
  const query = useQuery({
    queryKey: adminQueryKey,
    queryFn: () => fetch(),
    staleTime: 60_000,
    retry: false,
  });
  return {
    admin: query.data?.admin ?? null,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}

export function AdminButton() {
  const router = useRouter();
  const qc = useQueryClient();
  const { admin } = useAdminSession();
  const loginFn = useServerFn(adminLogin);
  const logoutFn = useServerFn(adminLogout);

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (admin) {
      window.dispatchEvent(new CustomEvent("admin:changed"));
    }
  }, [admin]);

  const loginMut = useMutation({
    mutationFn: (input: { email: string; password: string }) =>
      loginFn({ data: input }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: adminQueryKey });
      setOpen(false);
      setEmail("");
      setPw("");
      router.navigate({ to: "/admin" });
    },
    onError: (e: unknown) =>
      setErr(e instanceof Error ? e.message : "Sign-in failed"),
  });

  const logoutMut = useMutation({
    mutationFn: () => logoutFn(),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: adminQueryKey });
      router.navigate({ to: "/" });
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    loginMut.mutate({ email, password: pw });
  };

  const authed = !!admin;

  return (
    <>
      {authed ? (
        <div className="flex items-center gap-1">
          <button
            onClick={() => router.navigate({ to: "/admin" })}
            title="Admin dashboard"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/40 transition hover:bg-primary/25"
          >
            <LayoutDashboard className="h-4 w-4" />
          </button>
          <button
            onClick={() => logoutMut.mutate()}
            title="Sign out"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/60 text-muted-foreground transition hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          title="Admin"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/60 text-muted-foreground transition hover:bg-primary/15 hover:text-primary"
        >
          <ShieldCheck className="h-4 w-4" />
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-fade-up"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-primary/20 via-card to-card px-6 pt-6 pb-4">
              <button
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 ring-1 ring-primary/40">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h2 className="mt-3 font-display text-2xl font-bold">Admin sign-in</h2>
              <p className="text-sm text-muted-foreground">Manage channels and the Top 10 lineup.</p>
            </div>
            <form onSubmit={onSubmit} className="space-y-4 px-6 pb-6 pt-4">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email
                </span>
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Password
                </span>
                <input
                  type="password"
                  required
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </label>
              {err && (
                <div className="rounded-md border border-live/40 bg-live/10 px-3 py-2 text-xs text-live">
                  {err}
                </div>
              )}
              <button
                type="submit"
                disabled={loginMut.isPending}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-glow disabled:opacity-60"
              >
                {loginMut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Sign in
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
