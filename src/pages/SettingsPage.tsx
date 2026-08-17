import Header from '../components/Header';
import { useThemeContext } from '../hooks/ThemeContext';
import './SettingsPage.css';

export default function SettingsPage() {
  const { theme, toggleTheme } = useThemeContext();
  const isDark = theme === 'dark';

  return (
    <>
      <Header title="Settings" description="Personalize TaskDeck." />
      <div className="settings__panel">
        <div className="settings__row">
          <div>
            <p className="settings__label">Dark theme</p>
            <p className="settings__hint">
              Switch between the light and dark color themes.
            </p>
          </div>
          <button
            type="button"
            className="settings__switch"
            role="switch"
            aria-checked={isDark}
            aria-label="Dark theme"
            onClick={toggleTheme}
          >
            <span className="settings__switch-thumb" />
          </button>
        </div>
      </div>
    </>
  );
}
