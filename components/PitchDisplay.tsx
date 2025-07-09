import React, { useState } from 'react';
import { PitchGeneratorResponse, PitchDeckSlide, PDFOptions } from '../types';
import PDFExportModal from './PDFExportModal';
import GoogleAttribution from './GoogleAttribution';

// Add this for pdf-lib
declare global {
    interface Window {
        PDFLib: any;
    }
}


// Reusable CopyButton Component
const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <button
            onClick={handleCopy}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-500 bg-slate-200/50 hover:bg-slate-300/80 dark:text-slate-400 dark:bg-slate-800/50 dark:hover:bg-slate-700/80 transition-all"
            aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
        >
            {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            )}
        </button>
    );
};

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode, textToCopy?: string }> = ({ title, icon, children, textToCopy }) => (
    <div className="relative rounded-2xl shadow-lg dark:shadow-slate-900/20 overflow-hidden mb-8 backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70 transition-all duration-300 hover:shadow-xl dark:hover:shadow-glow-white hover:-translate-y-1">
        <div className="p-6">
            <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-200/50 dark:bg-slate-800/50 flex items-center justify-center text-teal-600 dark:text-teal-400 ring-2 ring-slate-300 dark:ring-slate-700 shadow-inner">
                    {icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 ml-4">{title}</h3>
            </div>
            <div className="text-slate-600 dark:text-slate-300 space-y-4 prose prose-sm sm:prose-base max-w-none prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-li:text-slate-600 dark:prose-li:text-slate-300 prose-invert">
                {children}
            </div>
        </div>
        {textToCopy && <CopyButton textToCopy={textToCopy} />}
    </div>
);

// Icons
const NameIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10m16-5v5m-12-5v5m-4-5v5M9 7l3-3m0 0l3 3m-3-3v5" /></svg>;
const DeckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>;
const MarketingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-2.236 9.168-5.518" /></svg>;
const ExportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;


const PitchDisplay: React.FC<{ content: PitchGeneratorResponse }> = ({ content }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    
    const formatPitchDeckForCopy = (slides: PitchDeckSlide[]) => {
        return slides.map(slide => 
            `Slide ${slide.title}\n\n${slide.content.map(p => `- ${p}`).join('\n')}`
        ).join('\n\n---\n\n');
    };

    const generatePdf = async (options: PDFOptions) => {
        setIsGeneratingPdf(true);
        try {
            const { PDFDocument, rgb } = window.PDFLib;
            const pdfDoc = await PDFDocument.create();
            
            // Fetch and embed a font that supports the rupee symbol
            const fontUrlRegular = 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrJJfecg.ttf';
            const fontUrlBold = 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJnecnFH.ttf';

            const [fontBytesRegular, fontBytesBold] = await Promise.all([
                fetch(fontUrlRegular).then(res => res.arrayBuffer()),
                fetch(fontUrlBold).then(res => res.arrayBuffer())
            ]);

            const poppinsRegular = await pdfDoc.embedFont(fontBytesRegular);
            const poppinsBold = await pdfDoc.embedFont(fontBytesBold);

            const hexToRgb = (hex: string) => {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16) / 255,
                    g: parseInt(result[2], 16) / 255,
                    b: parseInt(result[3], 16) / 255,
                } : { r: 0.05, g: 0.64, b: 0.91 }; // Default to sky blue
            };
            const accentColor = rgb(hexToRgb(options.accentColor).r, hexToRgb(options.accentColor).g, hexToRgb(options.accentColor).b);
            const grayColor = rgb(0.3, 0.3, 0.3);
            const lightGrayColor = rgb(0.5, 0.5, 0.5);

            let logoImage: any = null;
            if (options.logo) {
                try {
                    const base64 = options.logo.split(',')[1];
                    if (options.logo.startsWith('data:image/png')) {
                        logoImage = await pdfDoc.embedPng(base64);
                    } else if (options.logo.startsWith('data:image/jpeg') || options.logo.startsWith('data:image/jpg')) {
                        logoImage = await pdfDoc.embedJpg(base64);
                    }
                } catch (e) {
                    console.error("Failed to embed logo:", e);
                    // Continue without logo if embedding fails
                }
            }

            // --- Cover Slide ---
            const coverPage = pdfDoc.addPage([1280, 720]);
            const { width: coverWidth, height: coverHeight } = coverPage.getSize();
            if (logoImage) {
                const logoDims = logoImage.scale(0.4);
                coverPage.drawImage(logoImage, {
                    x: coverWidth / 2 - logoDims.width / 2,
                    y: coverHeight - 300,
                    width: logoDims.width,
                    height: logoDims.height,
                });
            }
            coverPage.drawText(options.companyName, {
                x: 50,
                y: 360,
                font: poppinsBold,
                size: 80,
                color: accentColor,
                maxWidth: coverWidth - 100,
            });
             coverPage.drawText(options.tagline || content.oneLiner, {
                x: 50,
                y: 280,
                font: poppinsRegular,
                size: 36,
                color: grayColor,
                maxWidth: coverWidth - 100,
            });

            // --- Content Slides ---
            content.pitchDeck.forEach((slide, index) => {
                const page = pdfDoc.addPage([1280, 720]);
                const { width, height } = page.getSize();
                
                // Header
                page.drawText(slide.title, { x: 60, y: height - 100, font: poppinsBold, size: 48, color: accentColor });
                page.drawLine({ start: { x: 60, y: height - 110 }, end: { x: width - 60, y: height - 110 }, thickness: 2, color: accentColor, opacity: 0.5 });

                // Content
                let yPosition = height - 200;
                slide.content.forEach(point => {
                    const maxWidth = width - 180;
                    const words = point.split(' ');
                    let line = '';
                    const lines = [];
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

                    if (yPosition < 100 + (lines.length * 40)) return; // Prevent writing off-page

                    page.drawText('•', { x: 80, y: yPosition, font: poppinsBold, size: 24, color: accentColor });

                    for (const lineText of lines) {
                        page.drawText(lineText.trim(), { x: 110, y: yPosition, font: poppinsRegular, size: 24, color: grayColor });
                        yPosition -= 35; // Line height
                    }
                    yPosition -= 15; // Space between bullet points
                });

                // Footer
                page.drawText(`${options.companyName} | Confidential`, { x: 60, y: 40, font: poppinsRegular, size: 14, color: lightGrayColor });
                page.drawText(`${index + 2}`, { x: width - 70, y: 40, font: poppinsRegular, size: 14, color: lightGrayColor });
            });

            // --- Save and Download ---
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${options.companyName.replace(/\s+/g, '-')}-pitch-deck.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);

        } catch (error) {
            console.error("Failed to generate PDF:", error);
            // You can add an error state here to notify the user
        } finally {
            setIsGeneratingPdf(false);
        }
    };
    
    const handleConfirmExport = (options: PDFOptions) => {
        setIsModalOpen(false);
        generatePdf(options);
    };

    return (
        <div className="animate-slide-up">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-sky-600 to-purple-600 dark:from-teal-300 dark:via-sky-400 dark:to-purple-400">Your Pitch is Ready!</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Here are the assets to help you get started.</p>
            </div>
            
            {/* Branding Section */}
            <Section title="Branding & Identity" icon={<NameIcon />}>
                <h4 className="font-bold text-slate-700 dark:text-slate-100">Startup Name Suggestions</h4>
                {content.nameSuggestions.map((s, i) => (
                    <div key={i} className="p-3 my-2 bg-slate-200/50 dark:bg-slate-900/70 rounded-lg border border-slate-300/50 dark:border-slate-700/50">
                        <p><strong>{s.name}</strong> - <span className="text-sm">{s.rationale}</span></p>
                        <p className="text-xs font-mono text-green-600 dark:text-green-400 mt-1">Available Domains: {s.domains.join(', ')}</p>
                    </div>
                ))}
                <h4 className="font-bold text-slate-700 dark:text-slate-100 mt-4">One-Liner</h4>
                <p>"{content.oneLiner}"</p>
                <h4 className="font-bold text-slate-700 dark:text-slate-100 mt-4">Elevator Pitch</h4>
                <p>{content.elevatorPitch}</p>
            </Section>

            {/* Pitch Deck Section */}
            <Section title="Investor Pitch Deck" icon={<DeckIcon />} textToCopy={formatPitchDeckForCopy(content.pitchDeck)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {content.pitchDeck.map(slide => (
                        <div key={slide.title} className="p-4 bg-slate-200/50 dark:bg-slate-900/70 rounded-lg border border-slate-300/50 dark:border-slate-700/50">
                            <h5 className="font-bold text-teal-600 dark:text-teal-400">{slide.title}</h5>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                                {slide.content.map((point, i) => <li key={i}>{point}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Marketing Section */}
            <Section title="Marketing & Outreach" icon={<MarketingIcon />}>
                <h4 className="font-bold text-slate-700 dark:text-slate-100">LinkedIn Post Draft</h4>
                <div className="relative p-4 my-2 whitespace-pre-wrap bg-slate-200/50 dark:bg-slate-900/70 rounded-lg border border-slate-300/50 dark:border-slate-700/50">
                    {content.linkedInPost}
                    <CopyButton textToCopy={content.linkedInPost} />
                </div>

                <h4 className="font-bold text-slate-700 dark:text-slate-100 mt-4">1-Min Video Pitch Script</h4>
                 <div className="relative p-4 my-2 whitespace-pre-wrap bg-slate-200/50 dark:bg-slate-900/70 rounded-lg border border-slate-300/50 dark:border-slate-700/50">
                    {content.videoScript}
                    <CopyButton textToCopy={content.videoScript} />
                </div>
            </Section>
            
            <div className="text-center mt-12 backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70 rounded-lg p-6">
                <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">Ready to Impress?</h4>
                <p className="text-slate-500 dark:text-slate-400 mt-1 mb-4 text-sm">Export your pitch as a professional PDF, ready for investors.</p>
                <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={isGeneratingPdf}
                    className="flex items-center justify-center mx-auto px-6 py-3 text-base font-semibold rounded-lg text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 transition-all duration-300 shadow-lg shadow-sky-500/20 hover:shadow-glow-blue disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                    {isGeneratingPdf ? 'Generating PDF...' : <><ExportIcon /> Export to PDF</>}
                </button>
            </div>
            
             <div className="text-center mt-12">
                 <p className="text-lg font-semibold text-slate-600 dark:text-slate-200">✅ Your deck is ready to share. Pitch with confidence — you’ve built it on LEAP.</p>
                 <GoogleAttribution className="mt-4" />
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

export default PitchDisplay;
