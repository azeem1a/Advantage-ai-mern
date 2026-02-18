import React from 'react';
import { Calendar, Download, Trash2, RefreshCw } from 'lucide-react';

const CampaignCard = ({ campaign, onDelete, onDownload, onRemix, isDeleting, isRemixing }) => {
    const backendUrl = 'http://localhost:5000';
    const imageUrl = campaign.imageUrl ? `${backendUrl}${campaign.imageUrl}` : null;
    const date = new Date(campaign.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    const titlePrompt = campaign.basePrompt || campaign.originalPrompt;

    // Status badge styling
    const getStatusBadge = () => {
        if (campaign.status === 'success') {
            return (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1 uppercase tracking-tight">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    AI Generated
                </span>
            );
        } else {
            return (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100 flex items-center gap-1 uppercase tracking-tight">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    Fallback
                </span>
            );
        }
    };

    return (
        <div className="group bg-white rounded-2xl shadow-premium border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-electric-500/10 hover:-translate-y-1 transition-all duration-500">
            <div className="h-52 bg-slate-900 overflow-hidden relative">
                {imageUrl ? (
                    <img src={imageUrl} alt="Campaign" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-50 font-medium text-xs">Processing...</div>
                )}
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur shadow-sm text-slate-900 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                    {campaign.platform}
                </div>
            </div>
            <div className="p-5 flex flex-col h-[200px]">
                <div className="flex justify-between items-center mb-4">
                    {getStatusBadge()}
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wide">
                        <Calendar className="w-3.5 h-3.5" /> {date}
                    </span>
                </div>
                <p className="text-slate-800 text-sm font-semibold line-clamp-2 leading-relaxed mb-2" title={titlePrompt}>
                    {titlePrompt}
                </p>
                <div className="text-[10px] font-bold text-electric-600 uppercase tracking-widest mt-1 mb-4">
                    {campaign.tone} Tone
                </div>
                <div className="flex gap-2.5 mt-auto">
                    <button
                        onClick={() => onDownload(campaign)}
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 py-2.5 rounded-xl transition-all shadow-sm"
                    >
                        <Download className="w-3.5 h-3.5" /> Download
                    </button>
                    <button
                        onClick={() => onRemix(campaign)}
                        disabled={isRemixing}
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-electric-700 bg-electric-50 hover:bg-electric-100 border border-electric-100 py-2.5 rounded-xl disabled:opacity-50 transition-all shadow-sm"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${isRemixing ? 'animate-spin' : ''}`} /> Remix
                    </button>
                    <button
                        onClick={() => onDelete(campaign)}
                        disabled={isDeleting}
                        className="flex items-center justify-center text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 w-10 rounded-xl disabled:opacity-50 transition-all shadow-sm"
                        title="Delete"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CampaignCard;
