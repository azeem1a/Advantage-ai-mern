import React from 'react';
import { ImageIcon, AlertTriangle, Download, Trash2 } from 'lucide-react';

const AdPreview = ({ campaign, isLoading, error, onDownload, onDelete, actionLoadingId }) => {
    if (isLoading) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-12 text-slate-400 bg-white rounded-2xl border-2 border-dashed border-slate-200 shadow-premium">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-64 w-64 bg-slate-100 rounded-xl mb-6 shadow-inner"></div>
                    <div className="h-4 w-48 bg-slate-100 rounded-full mb-3"></div>
                    <div className="h-4 w-32 bg-slate-100 rounded-full"></div>
                </div>
                <p className="mt-8 text-sm font-semibold text-slate-500 animate-pulse uppercase tracking-widest">
                    Crafting your creative...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-rose-500 bg-rose-50/50 rounded-2xl border border-rose-100 backdrop-blur-sm">
                <div className="bg-rose-100 p-3 rounded-full mb-4">
                    <AlertTriangle className="h-8 w-8" />
                </div>
                <p className="font-semibold text-center leading-relaxed">{error}</p>
            </div>
        );
    }

    if (!campaign && !isLoading && !error) {
        return (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-12 text-slate-400 bg-white rounded-2xl border border-dashed border-electric-100 shadow-sm group hover:border-electric-200 transition-colors">
                <div className="bg-electric-50 p-6 rounded-full mb-6 group-hover:scale-110 group-hover:bg-electric-100 transition-all duration-300 shadow-inner">
                    <ImageIcon className="h-12 w-12 text-electric-400 group-hover:text-electric-600 transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-2">Ready to Create?</h3>
                <p className="max-w-xs text-center text-sm">
                    Enter your brand details on the left and watch the magic happen here.
                </p>
            </div>
        );
    }

    const backendUrl = 'http://localhost:5000';
    const imageUrl = campaign.imageUrl ? `${backendUrl}${campaign.imageUrl}` : null;
    const isFallback = campaign.status === 'fallback';

    return (
        <div className="bg-white rounded-2xl shadow-premium border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-electric-500/10 transition-all duration-500 flex flex-col h-full relative">
            <div className="relative bg-slate-900 aspect-square md:aspect-video flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="Ad Creative"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                    />
                ) : (
                    <div className="flex flex-col items-center text-slate-500">
                        <ImageIcon className="h-12 w-12 mb-3 opacity-20" />
                        <span className="text-sm font-medium tracking-wide">Image Processing</span>
                    </div>
                )}

                {isFallback && (
                    <div className="absolute top-4 right-4 bg-amber-400/90 backdrop-blur text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 border border-amber-300">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        FALLBACK MODE
                    </div>
                )}
            </div>

            <div className="p-8 flex flex-col flex-grow">
                {isFallback && (
                    <div className="mb-6 rounded-xl bg-amber-50 border border-amber-100 text-amber-800 text-xs p-4 leading-relaxed font-medium">
                        <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span className="font-bold">Information</span>
                        </div>
                        One or more AI providers were unavailable, so a fallback image was used.
                    </div>
                )}

                <div className="mb-6">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Suggested Caption</h3>
                    <p className="text-slate-700 text-base leading-relaxed font-medium bg-slate-50 p-4 rounded-xl border border-slate-100/50 italic">
                        "{campaign.caption}"
                    </p>
                </div>

                <div className="mb-8">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Trending Hashtags</h3>
                    <div className="flex flex-wrap gap-2">
                        {campaign.hashtags?.map((tag, i) => (
                            <span key={i} className="text-electric-700 bg-electric-50/60 hover:bg-electric-50 border border-electric-100/60 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Settings</span>
                        <span className="text-sm font-bold text-slate-600">{campaign.platform} • {campaign.tone}</span>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => onDownload && onDownload(campaign)}
                            className="flex items-center gap-2 bg-electric-50 text-electric-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-electric-100 transition-all shadow-sm"
                        >
                            <Download className="h-4 w-4" /> Download
                        </button>
                        <button
                            onClick={() => onDelete && onDelete(campaign)}
                            disabled={actionLoadingId === campaign._id}
                            className="flex items-center justify-center bg-rose-50 text-rose-600 h-10 w-10 rounded-xl hover:bg-rose-100 transition-all disabled:opacity-50 shadow-sm group"
                            title="Delete Campaign"
                        >
                            <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdPreview;
