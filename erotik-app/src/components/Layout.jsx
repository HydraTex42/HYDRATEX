import { NavLink, useLocation } from 'react-router-dom';
import Icon from './Icon.jsx';

const NAV = [
  { to: '/', label: 'Start', icon: 'home' },
  { to: '/karten', label: 'Karten', icon: 'cards' },
  { to: '/wuerfel', label: 'Würfel', icon: 'dice' },
  { to: '/wunschliste', label: 'Wünsche', icon: 'heart' },
  { to: '/geschichten', label: 'Lesen', icon: 'book' },
  { to: '/ideen', label: 'Ideen', icon: 'sparkle' },
];

const TITEL = {
  '/': 'Zweisam',
  '/karten': 'Wahrheit oder Pflicht',
  '/wuerfel': 'Würfelspiel',
  '/wunschliste': 'Wunschliste',
  '/geschichten': 'Geschichten',
  '/ideen': 'Ideen für zu zweit',
  '/einstellungen': 'Einstellungen',
};

export default function Layout({ children }) {
  const { pathname } = useLocation();

  return (
    <div className="app">
      <header className="topbar">
        <span className="topbar-title">{TITEL[pathname] ?? 'Zweisam'}</span>
        <NavLink
          to="/einstellungen"
          className="topbar-settings"
          aria-label="Einstellungen"
        >
          <Icon name="settings" size={21} />
        </NavLink>
      </header>

      <main className="content">{children}</main>

      <nav className="tabbar" aria-label="Hauptnavigation">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `tab${isActive ? ' active' : ''}`}
          >
            <Icon name={item.icon} size={21} className="tab-icon" />
            <span className="tab-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
