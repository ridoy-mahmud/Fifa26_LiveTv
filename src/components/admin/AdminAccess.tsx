import { type ReactNode, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Database, Loader2, RefreshCw, ShieldCheck, ShieldAlert, LogOut, Lock } from "lucide-react";
import { getMongoStatus } from "@/lib/api/channels.functions";
import { seedIfEmpty } from "@/lib/api/seed.functions";
import { checkAuth, login, logout } from "@/lib/api/auth.functions";

const ADMIN_EMAIL = "mahamulhasan38@gmail.com";

function useAdminAuth() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showLogin, setShowLogin] = useState(true);

  const checkAuthFn = useServerFn(checkAuth);
  const loginFn = useServerFn(login);
  const logoutFn = useServerFn(logout);

  const authQuery = useQuery({
    queryKey: ["auth"],
    queryFn: () => checkAuthFn(),
    refetchInterval: 60_000, // Check every minute
    retry: false,
  });

  const loginMut = useMutation({
    mutationFn: (data: { email: string; password: string }) => loginFn({ data }),
    onSuccess: () => {
      authQuery.refetch();
      setEmail("");
      setPassword("");
    },
  });

  const logoutMut = useMutation({
    mutationFn: () => logoutFn(),
    onSuccess: () => {
      authQuery.refetch();
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMut.mutate({ email, password });
  };

  const handleLogout = () => {
    logoutMut.mutate();
  };

  return {
    user: authQuery.data?.user,
    isAdmin: authQuery.data?.isAdmin || false,
    loading: authQuery.isLoading,
    error: loginMut.error?.message || authQuery.error?.message,
    loginLoading: loginMut.isPending,
    logoutLoading: logoutMut.isPending,
    email,
    setEmail,
    password,
    setPassword,
    showLogin,
    setShowLogin,
    handleLogin,
    handleLogout,
  };
}

export function AdminAccessGate({ children }: { children: ReactNode }) {
  const { isAdmin, loading, error, loginLoading, email, setEmail, password, setPassword, handleLogin } = useAdminAuth();

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4 py-12">
        <div className="w-full rounded-2xl border border-border bg-card p-8 text-center shadow-card">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-primary" />
          <h2 className="mt-4 font-display text-2xl font-bold">Checking admin access</h2>
          <p className="mt-2 text-sm text-muted-foreground">Verifying authentication…</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4 py-12">
        <div className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <div className="bg-gradient-to-br from-primary/20 via-card to-card px-6 pt-6 pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 ring-1 ring-primary/40">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mt-3 font-display text-2xl font-bold">Admin sign in</h2>
            <p className="text-sm text-muted-foreground">
              Sign in with email <span className="font-semibold text-foreground">{ADMIN_EMAIL}</span> and your admin password.
            </p>
          </div>

          <div className="space-y-4 px-6 pb-6 pt-4">
            {error && (
              <div className="rounded-md border border-live/40 bg-live/10 px-3 py-2 text-xs text-live">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={ADMIN_EMAIL}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loginLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-glow disabled:opacity-60"
              >
                {loginLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                {loginLoading ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <p className="text-xs text-muted-foreground">
              Only the approved account can open the admin tools.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function MongoStatusBar() {
  const statusFn = useServerFn(getMongoStatus);
  const seedFn = useServerFn(seedIfEmpty);
  const qc = useQueryClient();

  const statusQuery = useQuery({
    queryKey: ["mongo", "status"],
    queryFn: () => statusFn(),
    staleTime: 30_000,
    retry: false,
  });

  const seedMut = useMutation({
    mutationFn: () => seedFn(),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["mongo", "status"] });
      await qc.invalidateQueries({ queryKey: ["channels"] });
    },
  });

  const connected = !!statusQuery.data?.ok;
  const empty = connected && (statusQuery.data?.channelCount ?? 0) === 0;
  const reason = statusQuery.data?.reason;

  const statusText = connected
    ? empty
      ? "Database is empty"
      : `MongoDB connected · ${statusQuery.data?.channelCount ?? 0} channels · ${statusQuery.data?.activeSessions ?? 0} active session${(statusQuery.data?.activeSessions ?? 0) === 1 ? "" : "s"}`
    : `MongoDB not reachable${reason ? `: ${reason}` : ""}`;

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 rounded-lg border px-3 py-2 text-xs ${connected
          ? empty
            ? "border-gold/40 bg-gold/10"
            : "border-emerald-500/40 bg-emerald-500/10"
          : "border-live/40 bg-live/10"
        }`}
    >
      <div className="flex items-center gap-2">
        {statusQuery.isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : connected ? (
          <Database className="h-3.5 w-3.5 text-emerald-400" />
        ) : (
          <ShieldAlert className="h-3.5 w-3.5 text-live" />
        )}
        <span>{statusText}</span>
      </div>
      <div className="flex items-center gap-2">
        {empty && (
          <button
            onClick={() => seedMut.mutate()}
            disabled={seedMut.isPending}
            className="inline-flex items-center gap-1.5 rounded-md bg-gold px-2.5 py-1 font-semibold text-background disabled:opacity-60"
          >
            {seedMut.isPending && <Loader2 className="h-3 w-3 animate-spin" />}
            Seed from defaults
          </button>
        )}
        <button
          onClick={() => void statusQuery.refetch()}
          title="Refresh"
          className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 font-semibold hover:bg-secondary"
        >
          <RefreshCw className="h-3 w-3" />
          Refresh
        </button>
      </div>
    </div>
  );
}

export function AdminLogout() {
  const { user, logoutLoading, handleLogout } = useAdminAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm">
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
          {user.email?.[0].toUpperCase()}
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{user.email}</span>
          <span className="text-xs text-muted-foreground">Admin</span>
        </div>
      </div>
      <button
        onClick={handleLogout}
        disabled={logoutLoading}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold transition hover:bg-secondary disabled:opacity-60"
      >
        {logoutLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="h-4 w-4" />
        )}
        Sign out
      </button>
    </div>
  );
}
