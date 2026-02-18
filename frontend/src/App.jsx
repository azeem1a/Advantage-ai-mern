import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import GeneratePage from './pages/GeneratePage';
import HistoryPage from './pages/HistoryPage';
import { Clock } from 'lucide-react';

import Logo from './components/Logo';

const Navbar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="glass-morphism sticky top-0 z-50 border-b border-slate-200/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2.5 group">
                            <div className="bg-gradient-to-br from-electric-600 to-electric-300 p-1.5 rounded-lg text-white group-hover:scale-110 shadow-lg shadow-electric-500/20 transition-all duration-300">
                                <Logo className="h-6 w-6" />
                            </div>
                            <span className="font-extrabold text-xl tracking-tight text-slate-900 font-display">
                                AdVantage
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-600 to-electric-300">Gen</span>
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-4">
                        <Link
                            to="/"
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive('/')
                                ? 'bg-electric-50 text-electric-700 shadow-sm shadow-electric-100'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                        >
                            Generate
                        </Link>
                        <Link
                            to="/history"
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${isActive('/history')
                                ? 'bg-electric-50 text-electric-700 shadow-sm shadow-electric-100'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                        >
                            <Clock className="h-4 w-4" />
                            <span className="hidden sm:inline">History</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

function App() {
    return (
        <Router>
            <div className="min-h-screen font-body text-slate-900 relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-electric-200/40 blur-3xl"></div>
                    <div className="absolute top-40 -left-24 h-80 w-80 rounded-full bg-electric-100/50 blur-3xl"></div>
                    <div
                        className="absolute inset-0 opacity-[0.08]"
                        style={{
                            backgroundImage:
                                'linear-gradient(to right, #0b1526 1px, transparent 1px), linear-gradient(to bottom, #0b1526 1px, transparent 1px)',
                            backgroundSize: '48px 48px',
                        }}
                    ></div>
                </div>
                <Navbar />
                <main className="py-8 px-4 page-fade">
                    <Routes>
                        <Route path="/" element={<GeneratePage />} />
                        <Route path="/history" element={<HistoryPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
