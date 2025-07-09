import React, { useState } from 'react';
import { DecisionTreeNode } from '../types';

interface DecisionTreeProps {
    nodes: DecisionTreeNode[];
}

const DecisionTree: React.FC<DecisionTreeProps> = ({ nodes }) => {
    const [activeNodeId, setActiveNodeId] = useState<string>('start');
    const [path, setPath] = useState<{ question: string; answer: string }[]>([]);
    const [finalAnswer, setFinalAnswer] = useState<string | null>(null);

    const activeNode = nodes.find(n => n.id === activeNodeId);

    const handleOptionClick = (option: { text: string; nextNodeId?: string; answer?: string }) => {
        if (!activeNode) return;

        setPath(prev => [...prev, { question: activeNode.question, answer: option.text }]);

        if (option.nextNodeId) {
            setActiveNodeId(option.nextNodeId);
        } else if (option.answer) {
            setFinalAnswer(option.answer);
            setActiveNodeId('end'); // End the tree traversal
        }
    };
    
    const handleRestart = () => {
        setActiveNodeId('start');
        setPath([]);
        setFinalAnswer(null);
    }

    return (
        <div className="p-4 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
            {path.map((step, index) => (
                <div key={index} className="mb-4 pb-2 border-b border-slate-300/50 dark:border-slate-700/50">
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{step.question}</p>
                    <p className="text-sm text-fuchsia-600 dark:text-fuchsia-400 pl-4">↪ {step.answer}</p>
                </div>
            ))}

            {activeNode && (
                <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mb-3">{activeNode.question}</p>
                    <div className="flex flex-wrap gap-3">
                        {activeNode.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleOptionClick(option)}
                                className="px-4 py-2 text-sm font-semibold rounded-lg bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                            >
                                {option.text}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            {finalAnswer && (
                 <div className="mt-4 p-3 bg-green-100/50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
                    <p className="font-semibold text-green-800 dark:text-green-300">💡 Recommendation:</p>
                    <p className="text-sm text-green-700 dark:text-green-300">{finalAnswer}</p>
                </div>
            )}

            {(finalAnswer || activeNodeId === 'end') && (
                 <button onClick={handleRestart} className="mt-4 text-xs font-semibold text-slate-500 hover:underline">Restart Tree</button>
            )}
        </div>
    );
};

export default DecisionTree;
