
import React, { useState, useEffect, useRef } from 'react';

// Icons for each stat
const UserGroupIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const StarIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.975-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
);

const BookOpenIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const RocketLaunchIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a16.95 16.95 0 00-2.58 3.59m2.58-3.59V6a2 2 0 00-2-2H9.52a2 2 0 00-1.95 1.584l-1.33 6.682a2 2 0 001.95 2.418h4.92a2 2 0 001.95-2.418l-1.33-6.682a2 2 0 00-1.95-1.584H6.52a2 2 0 00-1.95 1.584l-1.33 6.682a2 2 0 001.95 2.418h1.22" />
    </svg>
);


const statData = [
  { icon: <UserGroupIcon />, value: 300, suffix: '+', label: 'Students Active' },
  { icon: <StarIcon />, value: 4.4, suffix: '/5', label: 'Average Rating', decimals: 1 },
  { icon: <BookOpenIcon />, value: 9, suffix: '+', label: 'Learning Paths Created' },
  { icon: <RocketLaunchIcon />, value: 40, suffix: '+', label: 'MVPs Generated' },
];

interface AnimatedStatProps {
    stat: typeof statData[0];
}

const AnimatedStat: React.FC<AnimatedStatProps> = ({ stat }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    let start = 0;
                    const end = stat.value;
                    const duration = 2000; // 2 seconds animation
                    const startTime = performance.now();

                    const step = (timestamp: number) => {
                        const elapsed = timestamp - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const currentVal = progress * end;
                        
                        setCount(parseFloat(currentVal.toFixed(stat.decimals || 0)));

                        if (progress < 1) {
                            requestAnimationFrame(step);
                        } else {
                            setCount(end); // Ensure it ends on the exact value
                        }
                    };
                    requestAnimationFrame(step);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 } // Trigger when 50% of the element is visible
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [stat]);

    return (
        <div ref={ref} className="flex flex-col items-center">
            <div className="mx-auto w-20 h-20 mb-3 rounded-full flex items-center justify-center bg-teal-500/10 text-teal-500 dark:bg-teal-400/10 dark:text-teal-400 transform transition-transform duration-300 group-hover:scale-110">
                {stat.icon}
            </div>
            <p className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                {count}{stat.suffix}
            </p>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                {stat.label}
            </p>
        </div>
    );
};

const StatsCounter: React.FC = () => {
    return (
        <section className="my-16 sm:my-24 animate-fade-in">
            <div className="relative max-w-5xl mx-auto py-10 px-6 sm:py-12 sm:px-8 rounded-2xl shadow-2xl backdrop-blur-xl bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70 overflow-hidden">
                <div className="absolute inset-x-0 -top-1/2 h-full bg-gradient-to-b from-teal-400/20 to-transparent blur-3xl -z-10" aria-hidden="true"></div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-4 text-center">
                    {statData.map((stat, index) => (
                        <AnimatedStat key={index} stat={stat} />
                    ))}
                </div>

                <p className="text-center mt-12 text-lg font-medium text-slate-600 dark:text-slate-300">
                    Join India’s smartest student founders already building on LEAP.
                </p>
            </div>
        </section>
    );
};

export default StatsCounter;
