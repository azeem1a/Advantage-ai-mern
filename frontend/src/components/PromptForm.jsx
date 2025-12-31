import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

const PromptForm = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({
        prompt: '',
        tone: 'Professional',
        platform: 'Instagram'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand/Product Description</label>
                <textarea
                    required
                    maxLength={300}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={3}
                    placeholder="e.g., A sleek coffee maker for busy professionals..."
                    value={formData.prompt}
                    onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={formData.tone}
                        onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                    >
                        <option>Professional</option>
                        <option>Witty</option>
                        <option>Urgent</option>
                        <option>Inspirational</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={formData.platform}
                        onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    >
                        <option>Instagram</option>
                        <option>LinkedIn</option>
                        <option>Facebook</option>
                        <option>Twitter</option>
                    </select>
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading || !formData.prompt.trim()}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <Send className="h-5 w-5" />}
                {isLoading ? 'Generating Campaign...' : 'Generate Campaign'}
            </button>
        </form>
    );
};

export default PromptForm;
