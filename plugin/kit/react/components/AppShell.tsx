import { LogOut } from "lucide-react";
import type { ReactNode } from "react";

/** Avatar initials: "a.smirnova" -> "AS". */
export function initials(user: string | null | undefined): string {
  if (!user) return "?";
  const parts = user.split(/[.\s_-]+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]!.toUpperCase()).join("");
}

interface AppShellProps {
  logo: ReactNode;
  nav: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

/** The page frame: a sidebar (logo, navigation, footer at the bottom) and the main area.
 * Narrower than 900px it becomes one column (components.css). */
export function AppShell({ logo, nav, footer, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="side">
        {logo}
        {nav}
        <div className="flex-1" />
        {footer}
      </aside>
      <main className="main" id="main">
        {children}
      </main>
    </div>
  );
}

/** Sidebar navigation. The items are the project's own links with className="nav-item"
 * (NavLink of react-router or a plain <a>): the shell does not depend on a router. */
export function NavList({ label, children }: { label: string; children: ReactNode }) {
  return (
    <nav className="flex flex-col gap-1" aria-label={label}>
      {children}
    </nav>
  );
}

interface UserRowProps {
  user: string | null | undefined;
  onLogout: () => void;
  logoutLabel?: string;
}

/** Sidebar footer: avatar with initials, the login, the logout button. */
export function UserRow({ user, onLogout, logoutLabel = "Выйти" }: UserRowProps) {
  return (
    <div className="user-row">
      <span className="avatar" aria-hidden="true">{initials(user)}</span>
      <span className="truncate">{user}</span>
      <button type="button" className="icon-plain" aria-label={logoutLabel} title={logoutLabel} onClick={onLogout}>
        <LogOut size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
