import type { ReactNode } from "react";
import { AppearancePopover } from "./AppearancePopover";

interface PageHeaderProps {
  title: ReactNode;
  crumb?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({ title, crumb, children }: PageHeaderProps) {
  return (
    <header className="page-header">
      {crumb && <nav className="crumb" aria-label="Путь">{crumb}</nav>}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="page-title">{title}</h1>
        <div className="flex items-center gap-2.5 flex-wrap">
          {children}
          <AppearancePopover />
        </div>
      </div>
    </header>
  );
}
