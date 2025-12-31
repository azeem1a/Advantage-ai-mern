import React from 'react';
import { Calendar, Download, Trash2, RefreshCw } from 'lucide-react';

const CampaignCard = ({ campaign, onDelete, onDownload, onRemix, isDeleting, isRemixing }) => {
    const backendUrl = 'http://localhost:5000';
    const imageUrl = campaign.imageUrl ? `${backendUrl}${campaign.imageUrl}` : null;
    const date = new Date(campaign.createdAt).toLocaleDateString();
    const titlePrompt = campaign.basePrompt || campaign.originalPrompt;

    // Status badge styling
    const getStatusBadge = () => {
        if (campaign.status === 'success') {
            return <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">AI Generated</span>;
        } else {
            return <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">Fallback Mode</span>;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-100 overflow-hidden relative">
                {imageUrl ? (
                    <img src={imageUrl} alt="Campaign" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                )}
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                    {campaign.platform}
                </div>
            </div>
            <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                    {getStatusBadge()}
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {date}
                    </span>
                </div>
                <p className="text-sm font-medium text-gray-800 line-clamp-2" title={titlePrompt}>
                    {titlePrompt}
                </p>
                <div className="text-xs text-gray-500 line-clamp-1">
                    {campaign.tone} Tone
                </div>
                <div className="flex gap-2 pt-2 flex-wrap">
                    <button
                        onClick={() => onDownload(campaign)}
                        className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 border border-indigo-100 px-3 py-1 rounded-md hover:bg-indigo-50 transition-colors"
                    >
                        <Download className="w-4 h-4" /> Download
                    </button>
                    <button
                        onClick={() => onRemix(campaign)}
                        disabled={isRemixing}
                        className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 border border-purple-100 px-3 py-1 rounded-md disabled:opacity-50 hover:bg-purple-50 transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRemixing ? 'animate-spin' : ''}`} /> Remix
                    </button>
                    <button
                        onClick={() => onDelete(campaign)}
                        disabled={isDeleting}
                        className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 border border-red-100 px-3 py-1 rounded-md disabled:opacity-50 hover:bg-red-50 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" /> Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CampaignCard;
