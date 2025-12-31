import React, { useState } from 'react';
import PromptForm from '../components/PromptForm';
import AdPreview from '../components/AdPreview';
import { generateAd, deleteCampaign, downloadCampaign } from '../api/adsApi';
import { Sparkles } from 'lucide-react';

const GeneratePage = () => {
    const [campaign, setCampaign] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    const handleGenerate = async (formData) => {
        setIsLoading(true);
        setError(null);
        setCampaign(null);
        setToast(null);

        try {
            const result = await generateAd(formData);
            if (result.success) {
                setCampaign(result.data);
            } else {
                setError(result.error || 'Unknown error occurred');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (item) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this campaign?');
        if (!confirmDelete) return;
        setActionLoadingId(item._id);
        try {
            const result = await deleteCampaign(item._id);
            if (result.success) {
                setCampaign(null);
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

    const handleDownload = async (item) => {
        setActionLoadingId(item._id);
        try {
            const blob = await downloadCampaign(item._id);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${item._id}.png`);
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

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
                    <Sparkles className="text-indigo-600" /> AdVantage Gen
                </h1>
                <p className="text-gray-500 mt-2">Create professional ad creatives in seconds with AI.</p>
            </div>
            {toast && (
                <div className={`mb-4 p-3 rounded-md text-sm ${toast.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {toast.message}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Design Your Campaign</h2>
                    <PromptForm onSubmit={handleGenerate} isLoading={isLoading} />
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Preview</h2>
                    <div className="h-[600px]">
                        <AdPreview
                            campaign={campaign}
                            isLoading={isLoading}
                            error={error}
                            onDelete={handleDelete}
                            onDownload={handleDownload}
                            actionLoadingId={actionLoadingId}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeneratePage;
