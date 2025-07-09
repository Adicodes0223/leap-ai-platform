import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { ComplianceResponse } from '../types';
import GoogleAttribution from './GoogleAttribution';

// Icons
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.016h-.008v-.016z" /></svg>;
const DocIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const TaxIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" /></svg>;
const PitchSafeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.143l2.25 2.143 4.5-4.286M12 21a9 9 0 100-18 9 9 0 000 18z" /></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>;

// Reusable Section Component
const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="relative rounded-2xl shadow-lg dark:shadow-slate-900/20 overflow-hidden mb-8 backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70 transition-all duration-300 hover:shadow-xl dark:hover:shadow-glow-white hover:-translate-y-1">
        <div className="p-6">
            <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-200/50 dark:bg-slate-800/50 flex items-center justify-center text-green-600 dark:text-green-400 ring-2 ring-slate-300 dark:ring-slate-700 shadow-inner">
                    {icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 ml-4">{title}</h3>
            </div>
            <div className="text-slate-600 dark:text-slate-300 space-y-4 prose prose-sm sm:prose-base max-w-none prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-li:text-slate-600 dark:prose-li:text-slate-300 prose-invert">
                {children}
            </div>
        </div>
    </div>
);

// Document Editor and Downloader
const DocumentEditor: React.FC<{ title: string; description: string; template: string }> = ({ title, description, template }) => {
    const [content, setContent] = useState(template);

    const downloadDocx = () => {
        const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
        const footer = "</body></html>";
        const sourceHTML = header + content.replace(/\n/g, '<br />') + footer;
        
        const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
        const fileDownload = document.createElement("a");
        document.body.appendChild(fileDownload);
        fileDownload.href = source;
        fileDownload.download = `${title.replace(/\s+/g, '-')}.doc`;
        fileDownload.click();
        document.body.removeChild(fileDownload);
    };

    const downloadPdf = () => {
        const doc = new jsPDF();
        const margin = 15;
        const pageHeight = doc.internal.pageSize.height;
        let y = margin;
        
        const lines = doc.splitTextToSize(content, doc.internal.pageSize.width - margin * 2);
        
        lines.forEach((line: string) => {
            if (y + 7 > pageHeight - margin) {
                doc.addPage();
                y = margin;
            }
            doc.text(line, margin, y);
            y += 7; // Line height
        });
        
        doc.save(`${title.replace(/\s+/g, '-')}.pdf`);
    };

    return (
        <div className="p-4 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-lg text-green-600 dark:text-green-400">{title}</h4>
            <p className="text-sm my-2">{description}</p>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-64 p-3 bg-white/50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-mono focus:ring-2 focus:ring-green-500"
            />
            <div className="mt-3 flex gap-3">
                <button onClick={downloadDocx} className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition">Download as .DOCX</button>
                <button onClick={downloadPdf} className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 transition">Download as .PDF</button>
            </div>
        </div>
    );
};

const ComplianceDisplay: React.FC<{ content: ComplianceResponse }> = ({ content }) => {
    return (
        <div className="animate-slide-up">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500">Your Startup Compliance Pack</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Here's your personalized guide to get your startup legal and ready.</p>
            </div>
            
            <Section title={content.registrationGuide.title} icon={<ShieldIcon />}>
                <p className="font-semibold text-slate-700 dark:text-slate-200">{content.registrationGuide.summary}</p>
                <div className="relative border-l-2 border-green-500/30 dark:border-green-400/30 pl-8 mt-6 space-y-6">
                    {content.registrationGuide.steps.map(step => (
                        <div key={step.step} className="relative">
                            <div className="absolute -left-9.5 top-1 w-3 h-3 rounded-full bg-green-500 dark:bg-green-400 ring-4 ring-slate-100 dark:ring-slate-900"></div>
                            <h4 className="font-bold text-lg text-slate-700 dark:text-slate-100">Step {step.step}: {step.title}</h4>
                            <p className="text-sm">{step.description}</p>
                            <p className="text-xs italic text-slate-500 mt-1">Note: {step.notes}</p>
                            <a href={step.link} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 mt-1">Visit Official Site <LinkIcon/></a>
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
                    <p>Estimated Time: <span className="font-bold text-green-600 dark:text-green-400">{content.registrationGuide.estimatedTime}</span></p>
                    <p>Estimated Cost: <span className="font-bold text-green-600 dark:text-green-400">{content.registrationGuide.estimatedCost}</span></p>
                </div>
            </Section>

            <Section title="Document Generators" icon={<DocIcon />}>
                <div className="space-y-6">
                    <DocumentEditor {...content.cofounderAgreement} />
                    <DocumentEditor {...content.nda} />
                </div>
            </Section>

            <Section title="GST & Tax Checklist" icon={<TaxIcon />}>
                 <div className="space-y-4">
                    {content.taxChecklist.items.map((item, i) => (
                        <div key={i} className="p-4 bg-slate-200/50 dark:bg-slate-900/70 rounded-lg border border-slate-300/50 dark:border-slate-700/50">
                             <p className="font-bold text-slate-700 dark:text-slate-100">{item.title}</p>
                             <p className="text-sm mt-1">{item.details}</p>
                              <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 mt-1">Learn More <LinkIcon/></a>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Pitch-Safe Deck Generator" icon={<PitchSafeIcon />}>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-slate-700 dark:text-slate-200">Confidentiality Footer Text:</h4>
                        <p className="p-2 text-xs font-mono bg-slate-200 dark:bg-slate-800 rounded-md border border-slate-300 dark:border-slate-700">"{content.pitchSafeDeck.footerText}"</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-slate-700 dark:text-slate-200">Legal Disclaimer:</h4>
                        <p className="p-2 text-xs italic bg-slate-200 dark:bg-slate-800 rounded-md border border-slate-300 dark:border-slate-700">{content.pitchSafeDeck.disclaimerText}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-slate-700 dark:text-slate-200">Best Sharing Practices:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            {content.pitchSafeDeck.sharingTips.map((tip, i) => <li key={i}>{tip}</li>)}
                        </ul>
                    </div>
                </div>
            </Section>

            <div className="text-center mt-12">
                 <p className="text-lg font-semibold text-slate-600 dark:text-slate-200">✅ Your compliance pack is ready. Build with peace of mind.</p>
                 <GoogleAttribution className="mt-4" />
            </div>

        </div>
    );
};

export default ComplianceDisplay;
