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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-12 text-center max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-50 text-electric-700 text-xs font-bold mb-4 border border-electric-100 uppercase tracking-widest shadow-sm">
                    <Sparkles className="h-3 w-3 text-electric-600" /> AI-Powered Ad Generation
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4 font-display">
                    Create Ads that <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-600 to-electric-300">Convert.</span>
                </h1>
                <p className="text-slate-500 text-lg font-medium leading-relaxed">
                    Transform your brand description into professional ad creatives in seconds with our advanced AI engine.
                </p>
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                <div className="lg:col-span-5 sticky top-24">
                    <div className="flex items-center justify-between mb-6 px-1">
                        <h2 className="text-lg font-bold text-slate-800">Campaign Details</h2>
                    </div>
                    <PromptForm onSubmit={handleGenerate} isLoading={isLoading} />
                </div>
                <div className="lg:col-span-7">
                    <div className="flex items-center justify-between mb-6 px-1">
                        <h2 className="text-lg font-bold text-slate-800">Preview Result</h2>
                        <div className="h-0.5 flex-grow mx-4 bg-slate-100 rounded-full hidden sm:block"></div>
                    </div>
                    <div className="min-h-[600px] lg:h-[calc(100vh-320px)] lg:sticky lg:top-24">
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
