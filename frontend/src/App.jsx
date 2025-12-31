import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import GeneratePage from './pages/GeneratePage';
import HistoryPage from './pages/HistoryPage';
import { Zap, Clock } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
                            <Zap className="h-6 w-6" />
                            <span>AdVantage Gen</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            Generate
                        </Link>
                        <Link
                            to="/history"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${isActive('/history') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            <Clock className="h-4 w-4" /> History
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
            <div className="min-h-screen bg-gray-50 font-sans">
                <Navbar />
                <main className="py-8 px-4">
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
