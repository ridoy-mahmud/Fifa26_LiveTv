import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h3 className="font-display text-lg font-bold">WC 2026 Live</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Live scores, the full match schedule, and streaming for FIFA World Cup 2026 across the USA, Canada, and Mexico.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Navigate</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a className="transition hover:text-primary" href="/schedule">Full schedule</a></li>
            <li><a className="transition hover:text-primary" href="/live">Live TV</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">About</h4>
          <p className="mt-3 text-sm text-muted-foreground">
            Independent fan companion. Not affiliated with FIFA. All broadcasting rights belong to their respective licensed holders.
          </p>
        </div>
      </div>

      {/* Contributor + copyright */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} WC 2026 Live
          </p>
          <a
            href="https://github.com/ridoy-mahmud"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
          >
            <Github className="h-3.5 w-3.5 transition group-hover:text-primary" />
            <span>Built by</span>
            <span className="font-semibold text-foreground group-hover:text-primary">Ridoy</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
