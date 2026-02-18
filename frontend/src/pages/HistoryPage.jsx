import React, { useEffect, useState } from 'react';
import CampaignCard from '../components/CampaignCard';
import { getHistory, deleteCampaign, downloadCampaign, remixCampaign } from '../api/adsApi';
import { History, RefreshCw, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const HistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [remixingId, setRemixingId] = useState(null);
    const [toast, setToast] = useState(null);

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const result = await getHistory();
            if (result.success) {
                setHistory(result.data);
            } else {
                setError('Failed to load history');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleDelete = async (campaign) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this campaign?');
        if (!confirmDelete) return;
        setActionLoadingId(campaign._id);
        try {
            const result = await deleteCampaign(campaign._id);
            if (result.success) {
                setHistory((prev) => prev.filter((c) => c._id !== campaign._id));
                setToast({ type: 'success', message: 'Campaign deleted successfully' });
            } else {
                setToast({ type: 'error', message: result.error || 'Failed to delete campaign' });
            }
        } catch (err) {
            setToast({ type: 'error', message: err.message });
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleDownload = async (campaign) => {
        setActionLoadingId(campaign._id);
        try {
            const blob = await downloadCampaign(campaign._id);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${campaign._id}.png`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            setToast({ type: 'success', message: 'Download started' });
        } catch (err) {
            setToast({ type: 'error', message: err.message });
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleRemix = async (campaign) => {
        setRemixingId(campaign._id);
        try {
            const result = await remixCampaign(campaign._id);
            if (result.success) {
                setHistory((prev) => [result.data, ...prev]);
                setToast({ type: 'success', message: '🎨 Campaign remixed!' });
            } else {
                setToast({ type: 'error', message: result.error || 'Failed to remix campaign' });
            }
        } catch (err) {
            setToast({ type: 'error', message: err.message });
        } finally {
            setRemixingId(null);
        }
    };

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 font-display">
                        <div className="bg-electric-100 p-2 rounded-lg text-electric-600">
                            <History className="h-6 w-6" />
                        </div>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700">Campaign Results</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-2 ml-1">Manage and download your generated ad creatives.</p>
                </div>
                <button
                    onClick={fetchHistory}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-electric-200 hover:text-electric-600 transition-all shadow-sm group disabled:opacity-50"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin text-electric-600' : 'group-hover:rotate-180 transition-transform duration-500 text-slate-400 group-hover:text-electric-600'}`} />
                    {isLoading ? 'Refreshing...' : 'Refresh History'}
                </button>
            </div>

            {toast && (
                <div className={`fixed bottom-8 right-8 z-50 animate-in slide-in-from-right-10 duration-500`}>
                    <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-premium border ${toast.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                        : 'bg-rose-50 text-rose-800 border-rose-100'
                        }`}>
                        <div className={`h-2 w-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                        <span className="text-sm font-bold tracking-wide">{toast.message}</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-rose-50 text-rose-700 px-6 py-4 rounded-2xl mb-8 border border-rose-100 font-semibold flex items-center gap-3">
                    <div className="bg-rose-100 p-1.5 rounded-full">
                        <AlertTriangle className="h-4 w-4" />
                    </div>
                    {error}
                </div>
            )}

            {isLoading && history.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white rounded-2xl h-[400px] border border-slate-100 animate-pulse shadow-sm">
                            <div className="h-48 bg-slate-50 rounded-t-2xl"></div>
                            <div className="p-5 space-y-4">
                                <div className="h-4 bg-slate-50 rounded w-1/4"></div>
                                <div className="h-4 bg-slate-50 rounded w-3/4"></div>
                                <div className="h-10 bg-slate-50 rounded-xl w-full"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    {history.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-electric-100 shadow-sm flex flex-col items-center">
                            <div className="bg-electric-50 p-8 rounded-full mb-6 text-electric-300">
                                <History className="h-16 w-16" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">No campaigns yet</h3>
                            <p className="text-slate-500 font-medium mt-2 mb-8 max-w-sm">
                                Your generated ad creatives will appear here once you create them.
                            </p>
                            <Link
                                to="/"
                                className="bg-gradient-to-r from-electric-600 to-electric-400 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-electric-500/30 hover:shadow-electric-500/50 hover:-translate-y-0.5 transition-all"
                            >
                                Start Generating
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 stagger-fade">
                            {history.map((campaign, index) => (
                                <div key={campaign._id} style={{ '--stagger-index': String(index) }}>
                                    <CampaignCard
                                        campaign={campaign}
                                        onDelete={handleDelete}
                                        onDownload={handleDownload}
                                        onRemix={handleRemix}
                                        isDeleting={actionLoadingId === campaign._id}
                                        isRemixing={remixingId === campaign._id}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default HistoryPage;
