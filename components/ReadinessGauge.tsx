import React, { useEffect, useState } from 'react';

interface ReadinessGaugeProps {
    score: number;
}

const ReadinessGauge: React.FC<ReadinessGaugeProps> = ({ score }) => {
    const [animatedScore, setAnimatedScore] = useState(0);
    const radius = 85;
    const circumference = 2 * Math.PI * radius;
    const initialOffset = circumference;
    const [offset, setOffset] = useState(initialOffset);

    useEffect(() => {
        const progress = score / 100;
        setOffset(initialOffset - progress * circumference * 0.75); // 0.75 for 3/4 circle
        
        // Animate score number
        let start = 0;
        const end = score;
        const duration = 1500;
        const startTime = performance.now();
        
        const step = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setAnimatedScore(Math.floor(progress * end));
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);

    }, [score, circumference, initialOffset]);

    const getColor = (s: number) => {
        if (s < 40) return "text-red-500";
        if (s < 75) return "text-yellow-500";
        return "text-green-500";
    };

    const getStrokeColorClass = (s: number) => {
        if (s < 40) return "stroke-red-500";
        if (s < 75) return "stroke-yellow-500";
        return "stroke-green-500";
    };

    return (
        <div className="relative flex flex-col items-center justify-center">
            <svg className="w-64 h-48" viewBox="0 0 200 150">
                {/* Background arc */}
                <path
                    d="M 15 135 A 85 85 0 0 1 185 135"
                    fill="none"
                    strokeWidth="20"
                    className="stroke-slate-200 dark:stroke-slate-700"
                />
                {/* Foreground arc */}
                <path
                    d="M 15 135 A 85 85 0 0 1 185 135"
                    fill="none"
                    strokeWidth="20"
                    strokeLinecap="round"
                    className={`${getStrokeColorClass(score)} transition-all duration-1000 ease-out`}
                    style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: offset,
                        transition: 'stroke-dashoffset 1.5s ease-in-out'
                    }}
                />
            </svg>
            <div className="absolute bottom-0 flex flex-col items-center">
                 <span className={`text-6xl font-extrabold ${getColor(score)}`}>
                    {animatedScore}%
                </span>
                <span className="font-semibold text-slate-600 dark:text-slate-400">Readiness Score</span>
            </div>
        </div>
    );
};

export default ReadinessGauge;
