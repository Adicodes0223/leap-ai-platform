import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { FundraisingCopilotResponse, FundraisingFunnel, PDFOptions, PitchDeckSlide } from '../types';
import ReadinessGauge from './ReadinessGauge';
import GoogleAttribution from './GoogleAttribution';
import PDFExportModal from './PDFExportModal';

declare global {
    interface Window {
        PDFLib: any;
    }
}

const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    return (
        <button onClick={handleCopy} className="p-1.5 rounded-md text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700 transition-all">
            {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            )}
        </button>
    );
};


const FunnelVisualizer: React.FC<{ funnel: FundraisingFunnel }> = ({ funnel }) => {
    const stages = Object.entries(funnel);
    const maxVal = Math.max(...Object.values(funnel));

    return (
        <div className="space-y-2">
            {stages.map(([stage, value]) => (
                <div key={stage} className="flex items-center gap-3">
                    <p className="w-28 text-sm font-semibold text-right capitalize text-slate-600 dark:text-slate-300">{stage.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-8">
                        <div
                            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-8 rounded-full flex items-center justify-between px-3"
                            style={{ width: `${Math.max((value / maxVal) * 100, 5)}%` }}
                        >
                           <p className="text-sm font-bold text-white">{value}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const FundraisingCopilotDisplay: React.FC<{ data: FundraisingCopilotResponse }> = ({ data }) => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const tabs = ['Dashboard', 'Deck Diagnostics', 'Outreach Kit', 'Funding Sources'];

    const generatePdf = async (options: PDFOptions) => {
        setIsGeneratingPdf(true);
        try {
            const { PDFDocument, rgb } = window.PDFLib;
            const pdfDoc = await PDFDocument.create();
            const fontUrlRegular = 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrJJfecg.ttf';
            const fontUrlBold = 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJnecnFH.ttf';
            const [fontBytesRegular, fontBytesBold] = await Promise.all([
                fetch(fontUrlRegular).then(res => res.arrayBuffer()),
                fetch(fontUrlBold).then(res => res.arrayBuffer())
            ]);
            const poppinsRegular = await pdfDoc.embedFont(fontBytesRegular);
            const poppinsBold = await pdfDoc.embedFont(fontBytesBold);

            const accentColor = rgb(0.48, 0.44, 0.93); // Indigo
            const grayColor = rgb(0.3, 0.3, 0.3);

            data.enhancedDeck.forEach((slide, index) => {
                const page = pdfDoc.addPage([1280, 720]);
                const { width, height } = page.getSize();
                page.drawText(slide.title, { x: 60, y: height - 100, font: poppinsBold, size: 48, color: accentColor });
                page.drawLine({ start: { x: 60, y: height - 110 }, end: { x: width - 60, y: height - 110 }, thickness: 2, color: accentColor, opacity: 0.5 });
                
                let yPosition = height - 200;
                slide.content.forEach(point => {
                    const maxWidth = width - 180;
                    const lines = [];
                    const words = point.split(' ');
                    let line = '';

                    for (const word of words) {
                        const testLine = line + word + ' ';
                        const testWidth = poppinsRegular.widthOfTextAtSize(testLine, 24);
                        if (testWidth > maxWidth && line.length > 0) {
                            lines.push(line);
                            line = word + ' ';
                        } else {
                            line = testLine;
                        }
                    }
                    lines.push(line);

                    if (yPosition < 100 + (lines.length * 35)) return;
                    page.drawText('•', { x: 80, y: yPosition, font: poppinsBold, size: 24, color: accentColor });
                    for (const lineText of lines) {
                        page.drawText(lineText.trim(), { x: 110, y: yPosition, font: poppinsRegular, size: 24, color: grayColor });
                        yPosition -= 35;
                    }
                    yPosition -= 15;
                });
                page.drawText(`${options.companyName} | Confidential`, { x: 60, y: 40, font: poppinsRegular, size: 14, color: grayColor });
                page.drawText(`${index + 1}`, { x: width - 70, y: 40, font: poppinsRegular, size: 14, color: grayColor });
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${options.companyName.replace(/\s+/g, '-')}-enhanced-pitch-deck.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            console.error("PDF Generation Error", e);
        } finally {
            setIsGeneratingPdf(false);
        }
    };
    
     const handleConfirmExport = (options: PDFOptions) => {
        setIsModalOpen(false);
        generatePdf(options);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Dashboard':
                return (
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Fundraising Readiness</h3>
                            <div className="p-6 bg-white/50 dark:bg-slate-900/50 rounded-2xl"><ReadinessGauge score={data.readiness.score} /></div>
                            <div className="mt-4 p-4 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-800 dark:text-indigo-200 text-center font-semibold">{data.readiness.guidance}</div>
                        </div>
                        <div>
                             <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Typical Fundraising Funnel</h3>
                             <div className="p-6 bg-white/50 dark:bg-slate-900/50 rounded-2xl"><FunnelVisualizer funnel={data.fundraisingFunnel} /></div>
                        </div>
                    </div>
                );
            case 'Deck Diagnostics':
                return (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">AI-Enhanced Pitch Deck</h3>
                             <button onClick={() => setIsModalOpen(true)} disabled={isGeneratingPdf} className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50">
                                {isGeneratingPdf ? 'Generating...' : 'Export Enhanced Deck PDF'}
                            </button>
                        </div>
                        <div className="space-y-4">
                            {data.deckDiagnostics.map((diag, i) => (
                                <details key={i} className="p-4 bg-white/50 dark:bg-slate-900/50 rounded-xl">
                                    <summary className="font-semibold cursor-pointer flex justify-between items-center">
                                        <span>Slide: {diag.slide}</span>
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${diag.score > 7 ? 'bg-green-200 text-green-800' : diag.score > 4 ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'}`}>Score: {diag.score}/10</span>
                                    </summary>
                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700 pt-2">{diag.feedback}</p>
                                    <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-800/70 rounded-lg">
                                        <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Suggested Content:</h5>
                                        <ul className="list-disc list-inside text-sm mt-1">
                                            {data.enhancedDeck[i]?.content.map((c, j) => <li key={j}>{c}</li>)}
                                        </ul>
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                );
            case 'Outreach Kit':
                return (
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                             <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Investor Personas</h3>
                             <div className="space-y-4">
                                {data.investorPersonas.map((p, i) => (
                                    <div key={i} className="p-4 bg-white/50 dark:bg-slate-900/50 rounded-xl">
                                        <h4 className="font-bold text-indigo-600 dark:text-indigo-400">{p.type}</h4>
                                        <p className="text-sm mt-1">{p.description}</p>
                                        <p className="text-xs mt-2">e.g., {p.examples.join(', ')}</p>
                                    </div>
                                ))}
                             </div>
                        </div>
                        <div>
                             <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Email Templates</h3>
                             <div className="space-y-4">
                                {data.outreachTemplates.map((t, i) => (
                                    <div key={i} className="p-4 bg-white/50 dark:bg-slate-900/50 rounded-xl">
                                         <div className="flex justify-between items-center">
                                            <h4 className="font-bold text-indigo-600 dark:text-indigo-400">{t.type}</h4>
                                            <CopyButton textToCopy={`Subject: ${t.subject}\n\n${t.body}`} />
                                         </div>
                                         <p className="text-sm font-semibold mt-2">Subject: {t.subject}</p>
                                         <p className="text-sm mt-1 whitespace-pre-wrap border-t border-slate-200 dark:border-slate-700 pt-2">{t.body}</p>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                );
            case 'Funding Sources':
                 return (
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Recommended Funding Sources</h3>
                        <div className="space-y-4">
                            {data.fundingSources.map((s, i) => (
                                <div key={i} className="p-4 bg-white/50 dark:bg-slate-900/50 rounded-xl">
                                    <h4 className="font-bold text-indigo-600 dark:text-indigo-400">{s.name}</h4>
                                    <p className="text-sm mt-1">{s.description}</p>
                                    <p className="text-xs mt-2">e.g., {s.examples.join(', ')}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="animate-slide-up">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold"><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Your Fundraising Co-pilot</span></h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">This is your fundraising co-pilot — let’s close your round with precision and storytelling.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-6 p-2 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl">
                {tabs.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-900 shadow text-indigo-600' : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50'}`}>
                        {tab}
                    </button>
                ))}
            </div>
            
            <div className="p-6 rounded-2xl shadow-xl backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70">
                {renderTabContent()}
            </div>
            
            <div className="text-center mt-8 space-y-2">
                <p className="text-xs text-slate-500 dark:text-slate-400">Disclaimer: The analysis and suggestions provided are generated by AI and are for informational purposes only. They do not constitute financial or legal advice.</p>
                <GoogleAttribution />
            </div>

             {isModalOpen && (
                <PDFExportModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleConfirmExport}
                />
            )}
        </div>
    );
};

export default FundraisingCopilotDisplay;
