import { IconMoon, IconPalm, IconSun } from './Icons';

export default function Header({ isDark, onToggleTheme }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">
          <span className="brand-badge" aria-hidden="true">
            <IconPalm width={18} height={18} />
          </span>
          <span className="brand-text">
            <strong>StayScout</strong>
            <span className="brand-sub">Hotels &amp; resorts</span>
          </span>
        </div>

        <button
          type="button"
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          title={isDark ? 'Light theme' : 'Dark theme'}
        >
          {isDark ? <IconSun width={18} height={18} /> : <IconMoon width={18} height={18} />}
        </button>
      </div>
    </header>
  );
}
