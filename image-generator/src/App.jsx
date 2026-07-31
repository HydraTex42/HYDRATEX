import ImageGenerator from './components/ImageGenerator';
import './App.css';

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Bild Generator</h1>
        <p className="app-subtitle">
          Generative Kunst direkt im Browser — per Seed reproduzierbar, Export bis 4K.
        </p>
      </header>
      <main>
        <ImageGenerator />
      </main>
    </div>
  );
}
