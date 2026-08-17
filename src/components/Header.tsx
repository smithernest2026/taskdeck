import type { ReactNode } from 'react';
import './Header.css';

interface HeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export default function Header({ title, description, actions }: HeaderProps) {
  return (
    <header className="header">
      <div>
        <h1 className="header__title">{title}</h1>
        {description && <p className="header__description">{description}</p>}
      </div>
      {actions && <div className="header__actions">{actions}</div>}
    </header>
  );
}
