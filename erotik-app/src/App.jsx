import { Route, Routes } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext.jsx';
import AgeGate from './components/AgeGate.jsx';
import PinLock from './components/PinLock.jsx';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import CardsPage from './pages/CardsPage.jsx';
import DicePage from './pages/DicePage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';
import StoriesPage from './pages/StoriesPage.jsx';
import DatesPage from './pages/DatesPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

function Shell() {
  const { ageOk, pinRecord, unlocked } = useApp();

  if (!ageOk) return <AgeGate />;
  if (pinRecord && !unlocked) return <PinLock />;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/karten" element={<CardsPage />} />
        <Route path="/wuerfel" element={<DicePage />} />
        <Route path="/wunschliste" element={<WishlistPage />} />
        <Route path="/geschichten" element={<StoriesPage />} />
        <Route path="/ideen" element={<DatesPage />} />
        <Route path="/einstellungen" element={<SettingsPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
