import React from 'react';
import { ImageIcon, AlertTriangle, Download, Trash2 } from 'lucide-react';

const AdPreview = ({ campaign, isLoading, error, onDownload, onDelete, actionLoadingId }) => {
    if (isLoading) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-12 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-48 w-48 bg-gray-200 rounded-md mb-4"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                </div>
                <p className="mt-4 text-sm font-medium">AI is crafting your creative...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-red-500 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle className="h-8 w-8 mb-2" />
                <p>{error}</p>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-12 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed">
                <ImageIcon className="h-12 w-12 mb-2 opacity-20" />
                <p>No campaign generated yet.</p>
                <p className="text-sm">Enter a prompt to start.</p>
            </div>
        );
    }

    const backendUrl = 'http://localhost:5000';
    const imageUrl = campaign.imageUrl ? `${backendUrl}${campaign.imageUrl}` : null;
    const isDemo = campaign.status === 'demo-fallback';

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <div className="relative bg-gray-100 aspect-square md:aspect-video flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                    <img src={imageUrl} alt="Ad Creative" className="w-full h-full object-cover" />
                ) : (
                    <div className="flex flex-col items-center text-gray-400">
                        <ImageIcon className="h-10 w-10 mb-2" />
                        <span>No Image Available</span>
                    </div>
                )}

                {isDemo && (
                    <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full border border-yellow-200 shadow-sm flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Demo Mode
                    </div>
                )}
            </div>

            <div className="p-6">
                {isDemo && (
                    <div className="mb-4 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm p-3">
                        🟡 Demo Mode<br />
                        This demo currently supports product-based ad creatives (coffee, food, fashion, education).
                        Your prompt is outside this scope, so a demo creative is shown.
                    </div>
                )}

                <div className="mb-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Caption</h3>
                    <p className="text-gray-800 text-sm whitespace-pre-wrap">{campaign.caption}</p>
                </div>

                <div className="mb-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Hashtags</h3>
                    <div className="flex flex-wrap gap-1">
                        {campaign.hashtags?.map((tag, i) => (
                            <span key={i} className="text-indigo-600 text-sm">{tag}</span>
                        ))}
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                    <span>{campaign.platform} | {campaign.tone}</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onDownload && onDownload(campaign)}
                            className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                        >
                            <Download className="h-3 w-3" /> Download
                        </button>
                        <button
                            onClick={() => onDelete && onDelete(campaign)}
                            disabled={actionLoadingId === campaign._id}
                            className="flex items-center gap-1 hover:text-red-600 transition-colors disabled:opacity-50"
                        >
                            <Trash2 className="h-3 w-3" /> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdPreview;
