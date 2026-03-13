
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Admin from './pages/Admin';
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#020617] text-slate-100 font-sans">
        {/* Navigation - só visível para facilitar testes, pode ser removido depois */}
        <nav className="fixed bottom-4 right-4 z-50 flex gap-2 bg-black/50 p-2 rounded-full backdrop-blur-md border border-white/10">
          <Link to="/" className="text-xs px-3 py-1.5 rounded-full hover:bg-white/10 transition">Tabela</Link>
          <Link to="/admin" className="text-xs px-3 py-1.5 rounded-full hover:bg-white/10 transition">Admin</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Leaderboard />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
