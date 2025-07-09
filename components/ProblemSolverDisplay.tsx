import React from 'react';
import { jsPDF } from 'jspdf';
import { ProblemSolverResponse } from '../types';
import GoogleAttribution from './GoogleAttribution';
import DecisionTree from './DecisionTree';

// Icons
const DiagnosisIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3s4.5 4.03 4.5 9-2.015 9-4.5 9z" /><path d="M12 8v4l3 3" /></svg>;
const StrategyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m0 10V7m0 0L9 4" /></svg>;
const TreeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>;
const BenchmarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12a9 9 0 0110.85-8.636M14.25 3.75a9 9 0 018.636 10.85m-19.486 0A9 9 0 013.75 3.75m16.5 0a9 9 0 01-10.85 8.636m10.85-8.636L12 12" /></svg>;
const CaseStudyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>;

const SectionCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="rounded-2xl shadow-lg dark:shadow-slate-900/20 overflow-hidden mb-8 backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70 transition-all duration-300 hover:shadow-xl dark:hover:shadow-glow-white hover:-translate-y-1">
        <div className="p-6">
            <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-200/50 dark:bg-slate-800/50 flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-400 ring-2 ring-slate-300 dark:ring-slate-700 shadow-inner">
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

interface ProblemSolverDisplayProps {
    problem: string;
    solution: ProblemSolverResponse;
    onSave: () => void;
    isSaved: boolean;
}

const ProblemSolverDisplay: React.FC<ProblemSolverDisplayProps> = ({ problem, solution, onSave, isSaved }) => {

    const exportToPdf = () => {
        const doc = new jsPDF();
        const margin = 15;
        const pageWidth = doc.internal.pageSize.getWidth();
        let y = 20;

        const addText = (text: string, size: number, style: 'bold' | 'normal' = 'normal', isListItem = false) => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
            doc.setFontSize(size);
            doc.setFont('helvetica', style);
            const textToPrint = isListItem ? `- ${text}` : text;
            const textLines = doc.splitTextToSize(textToPrint, pageWidth - (margin * (isListItem ? 3 : 2)));
            doc.text(textLines, margin + (isListItem ? 5 : 0), y);
            y += (textLines.length * (size / 2.5)) + 2;
        };

        const addSectionTitle = (title: string) => {
            y += 5;
            addText(title, 16, 'bold');
            y += 2;
        };
        
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text("Startup Problem-Solver Report", margin, y);
        y += 10;

        addSectionTitle("Problem Statement");
        addText(problem, 12, 'normal');

        addSectionTitle("Root Cause Diagnosis");
        addText(solution.rootCause.diagnosis, 12, 'normal');
        addText(`Basis: ${solution.rootCause.basedOn}`, 10, 'normal');
        
        addSectionTitle("Strategic Breakdown");
        addText("This Week:", 12, 'bold');
        solution.strategicBreakdown.thisWeek.forEach(task => addText(task, 11, 'normal', true));
        y += 3;
        addText("This Month:", 12, 'bold');
        solution.strategicBreakdown.thisMonth.forEach(task => addText(task, 11, 'normal', true));
        y += 3;
        addText("In 90 Days:", 12, 'bold');
        solution.strategicBreakdown.in90Days.forEach(task => addText(task, 11, 'normal', true));

        addSectionTitle("Benchmarks");
        solution.benchmarks.forEach(b => addText(`${b.metric}: ${b.value} (${b.source})`, 11, 'normal', true));

        addSectionTitle("Case Studies");
        solution.caseStudies.forEach(cs => addText(`${cs.title} (${cs.source}): ${cs.takeaway}`, 11, 'normal', true));

        doc.save("LEAP-Problem-Solver-Report.pdf");
    };

    return (
        <div className="animate-fade-in space-y-4">
            <SectionCard title="Root Cause Diagnosis" icon={<DiagnosisIcon />}>
                <p className="text-lg font-semibold text-slate-700 dark:text-slate-100">{solution.rootCause.diagnosis}</p>
                <p className="text-sm italic text-slate-500 dark:text-slate-400">Based on: {solution.rootCause.basedOn}</p>
            </SectionCard>
            
            <SectionCard title="Strategic Breakdown" icon={<StrategyIcon />}>
                <div className="grid md:grid-cols-3 gap-6">
                    <div>
                        <h4 className="font-bold text-lg text-fuchsia-600 dark:text-fuchsia-400">This Week →</h4>
                        <ul className="list-disc list-inside mt-2 space-y-1">{solution.strategicBreakdown.thisWeek.map((item, i) => <li key={i}>{item}</li>)}</ul>
                    </div>
                     <div>
                        <h4 className="font-bold text-lg text-fuchsia-600 dark:text-fuchsia-400">This Month →</h4>
                        <ul className="list-disc list-inside mt-2 space-y-1">{solution.strategicBreakdown.thisMonth.map((item, i) => <li key={i}>{item}</li>)}</ul>
                    </div>
                     <div>
                        <h4 className="font-bold text-lg text-fuchsia-600 dark:text-fuchsia-400">In 90 Days →</h4>
                        <ul className="list-disc list-inside mt-2 space-y-1">{solution.strategicBreakdown.in90Days.map((item, i) => <li key={i}>{item}</li>)}</ul>
                    </div>
                </div>
            </SectionCard>

            <SectionCard title="Live Decision Tree" icon={<TreeIcon />}>
                <DecisionTree nodes={solution.decisionTree} />
            </SectionCard>

            <div className="grid md:grid-cols-2 gap-8">
                <SectionCard title="Benchmarks & Comparison" icon={<BenchmarkIcon />}>
                    <ul className="list-none space-y-3">
                        {solution.benchmarks.map((b, i) => (
                            <li key={i} className="p-3 bg-slate-200/50 dark:bg-slate-900/70 rounded-lg border border-slate-300/50 dark:border-slate-700/50">
                                <p className="font-semibold text-slate-700 dark:text-slate-200">{b.metric}</p>
                                <p className="text-fuchsia-600 dark:text-fuchsia-400 text-lg font-bold">{b.value}</p>
                                <p className="text-xs text-slate-500">{b.source}</p>
                            </li>
                        ))}
                    </ul>
                </SectionCard>
                <SectionCard title="External Case Studies" icon={<CaseStudyIcon />}>
                    <ul className="list-none space-y-3">
                        {solution.caseStudies.map((cs, i) => (
                             <li key={i} className="p-3 bg-slate-200/50 dark:bg-slate-900/70 rounded-lg border border-slate-300/50 dark:border-slate-700/50">
                                <a href={cs.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-sky-600 dark:text-sky-400 hover:underline">{cs.title} <LinkIcon /></a>
                                <p className="text-xs text-slate-500 mb-1">{cs.source}</p>
                                <p className="text-sm italic">"{cs.takeaway}"</p>
                            </li>
                        ))}
                    </ul>
                </SectionCard>
            </div>
             <div className="flex flex-wrap gap-4 justify-center items-center mt-8 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                <button onClick={onSave} disabled={isSaved} className="px-5 py-2 font-semibold rounded-lg text-sm bg-purple-600 text-white hover:bg-purple-700 disabled:bg-slate-400 transition-colors">
                    {isSaved ? '✓ Saved' : 'Save Solution'}
                </button>
                 <button onClick={exportToPdf} className="px-5 py-2 font-semibold rounded-lg text-sm bg-red-500 text-white hover:bg-red-600 transition-colors">
                    Export as PDF
                </button>
                <GoogleAttribution />
            </div>
        </div>
    );
};

export default ProblemSolverDisplay;
