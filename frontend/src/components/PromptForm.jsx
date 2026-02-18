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
        <form
            onSubmit={handleSubmit}
            className="bg-white/80 p-8 rounded-2xl shadow-premium border border-slate-100 hover:shadow-premium-hover transition-all duration-500 backdrop-blur"
        >
            <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                    Brand/Product Description
                </label>
                <textarea
                    required
                    maxLength={300}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-electric-500/10 focus:border-electric-500 transition-all outline-none resize-none text-slate-800 placeholder:text-slate-400"
                    rows={4}
                    placeholder="e.g., A sleek coffee maker for busy professionals..."
                    value={formData.prompt}
                    onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                />
                <div className="flex justify-end mt-1 px-1">
                    <span className="text-[10px] text-slate-400 font-medium">
                        {formData.prompt.length}/300
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Tone</label>
                    <select
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-electric-500/10 focus:border-electric-500 transition-all outline-none text-slate-800 appearance-none cursor-pointer"
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
                    <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Platform</label>
                    <select
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-electric-500/10 focus:border-electric-500 transition-all outline-none text-slate-800 appearance-none cursor-pointer"
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
                className="w-full bg-gradient-to-r from-electric-600 to-electric-400 text-white py-4 px-6 rounded-xl font-bold shadow-lg shadow-electric-500/20 hover:shadow-electric-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 group"
            >
                {isLoading ? (
                    <Loader2 className="animate-spin h-5 w-5 text-electric-100" />
                ) : (
                    <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                )}
                <span className="tracking-wide">
                    {isLoading ? 'Generating Campaign...' : 'Generate Campaign'}
                </span>
            </button>
        </form>
    );
};

export default PromptForm;
