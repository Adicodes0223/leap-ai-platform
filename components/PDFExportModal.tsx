import React, { useState } from 'react';
import { PDFOptions } from '../types';

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

interface PDFExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (options: PDFOptions) => void;
}

const PDFExportModal: React.FC<PDFExportModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const [logo, setLogo] = useState<string | null>(null);
    const [logoName, setLogoName] = useState<string>('');
    const [accentColor, setAccentColor] = useState('#0ea5e9'); // Default: sky-500
    const [companyName, setCompanyName] = useState('');
    const [tagline, setTagline] = useState('');
    
    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogo(reader.result as string);
                setLogoName(file.name);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleConfirm = () => {
        if (companyName.trim()) {
            onConfirm({
                logo,
                accentColor,
                companyName,
                tagline,
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="w-full max-w-lg bg-slate-100 dark:bg-slate-900 rounded-2xl shadow-2xl animate-zoom-in border border-slate-300 dark:border-slate-700">
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Customize Your PDF</h3>
                    <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Your Startup Name"
                            className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-sky-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tagline (Optional)</label>
                        <input
                            type="text"
                            value={tagline}
                            onChange={(e) => setTagline(e.target.value)}
                            placeholder="e.g., The future of student collaboration"
                            className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-sky-500"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex-grow">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Brand Accent Color</label>
                             <input
                                type="color"
                                value={accentColor}
                                onChange={(e) => setAccentColor(e.target.value)}
                                className="w-full h-10 p-1 bg-white/50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-md cursor-pointer"
                            />
                        </div>
                        <div className="flex-grow">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Upload Logo (Optional)</label>
                            <label htmlFor="logo-upload" className="w-full h-10 flex items-center justify-center gap-2 px-3 py-2 bg-white/50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-md cursor-pointer hover:border-sky-500">
                                <UploadIcon />
                                <span className="text-sm truncate">{logoName || 'Choose file'}</span>
                            </label>
                            <input id="logo-upload" type="file" accept="image/*" className="sr-only" onChange={handleLogoUpload} />
                        </div>
                    </div>
                     {logo && (
                        <div className="text-center p-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-md">
                            <p className="text-xs text-slate-500 mb-2">Logo Preview:</p>
                            <img src={logo} alt="Logo Preview" className="max-h-16 mx-auto bg-slate-200 dark:bg-slate-700 p-1 rounded"/>
                        </div>
                     )}
                </div>
                <div className="p-4 bg-slate-200/50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                    <button
                        onClick={handleConfirm}
                        disabled={!companyName.trim()}
                        className="px-6 py-2.5 text-base font-semibold rounded-lg text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 transition-all duration-300 shadow-lg shadow-sky-500/20 hover:shadow-glow-blue disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                        Generate PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PDFExportModal;