import React, { useEffect, useState } from 'react';
import CampaignCard from '../components/CampaignCard';
import { getHistory, deleteCampaign, downloadCampaign, remixCampaign } from '../api/adsApi';
import { History, RefreshCw } from 'lucide-react';

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
                // Add new remixed campaign to top of list
                setHistory((prev) => [result.data, ...prev]);
                setToast({ type: 'success', message: '🎨 Campaign remixed successfully!' });
            } else {
                setToast({ type: 'error', message: result.error || 'Failed to remix campaign' });
            }
        } catch (err) {
            setToast({ type: 'error', message: err.message });
        } finally {
            setRemixingId(null);
        }
    };

    // Auto-hide toast after 3 seconds
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <History className="text-indigo-600" /> Campaign History
                </h1>
                <button
                    onClick={fetchHistory}
                    className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
                </button>
            </div>

            {toast && (
                <div className={`mb-4 p-3 rounded-md text-sm ${toast.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {toast.message}
                </div>
            )}

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 border border-red-200">
                    {error}
                </div>
            )}

            {isLoading && history.length === 0 ? (
                <div className="text-center py-12 text-gray-400">Loading history...</div>
            ) : (
                <>
                    {history.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed text-gray-400">
                            No campaigns found. Generate your first ad!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {history.map((campaign) => (
                                <CampaignCard
                                    key={campaign._id}
                                    campaign={campaign}
                                    onDelete={handleDelete}
                                    onDownload={handleDownload}
                                    onRemix={handleRemix}
                                    isDeleting={actionLoadingId === campaign._id}
                                    isRemixing={remixingId === campaign._id}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default HistoryPage;
