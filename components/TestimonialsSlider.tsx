import React, { useState, useEffect } from 'react';
import { testimonials } from '../mockDB';

const QuoteIcon = () => (
    <svg className="absolute top-0 left-0 w-16 h-16 text-slate-200/50 dark:text-slate-800/50 transform -translate-x-4 -translate-y-4" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M9.981 21.812a5.523 5.523 0 0 1-3.483-3.483A5.523 5.523 0 0 1 12.021 12a5.523 5.523 0 0 1-2.04 4.33A5.523 5.523 0 0 1 9.981 21.812zM21.981 21.812a5.523 5.523 0 0 1-3.483-3.483A5.523 5.523 0 0 1 24.021 12a5.523 5.523 0 0 1-2.04 4.33A5.523 5.523 0 0 1 21.981 21.812z" />
    </svg>
);


const ArrowButton: React.FC<{onClick: () => void, direction: 'left' | 'right'}> = ({ onClick, direction }) => (
    <button
        onClick={onClick}
        className={`absolute top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-lg hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all ${direction === 'left' ? 'left-0 sm:left-4' : 'right-0 sm:right-4'}`}
        aria-label={direction === 'left' ? 'Previous testimonial' : 'Next testimonial'}
    >
        {direction === 'left' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        )}
    </button>
);


const TestimonialsSlider: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
        }, 5000); // cycle every 5 seconds
        return () => clearInterval(timer);
    }, []);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? testimonials.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === testimonials.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    return (
        <section className="py-12 sm:py-16 w-full animate-fade-in" aria-labelledby="testimonials-heading">
            <div className="relative max-w-4xl mx-auto px-4">
                 <div className="absolute inset-0 -top-10 bg-gradient-to-tr from-purple-300/30 via-blue-300/30 to-teal-300/30 dark:from-purple-600/20 dark:via-blue-600/20 dark:to-teal-600/20 rounded-full blur-3xl opacity-50 -z-10"></div>
                <h2 id="testimonials-heading" className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-2">Voices of LEAP</h2>
                <p className="text-lg text-center text-slate-500 dark:text-slate-400 mb-12">See what our community of builders and experts are saying.</p>
                <div className="relative h-80 sm:h-64 md:h-56 overflow-hidden rounded-2xl">
                    <ArrowButton onClick={goToPrevious} direction="left" />
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out"
                            style={{ opacity: index === currentIndex ? 1 : 0, zIndex: index === currentIndex ? 1 : 0 }}
                            aria-hidden={index !== currentIndex}
                        >
                            <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 h-full backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70 rounded-2xl shadow-xl">
                                <QuoteIcon />
                                <img src={testimonial.avatarUrl} alt={testimonial.name} className="w-16 h-16 rounded-full mb-4 border-4 border-white/50 dark:border-slate-700/50 shadow-md" />
                                <blockquote className="max-w-2xl text-lg font-medium text-slate-700 dark:text-slate-200 mb-4">
                                    “{testimonial.quote}”
                                </blockquote>
                                <footer className="font-bold text-slate-800 dark:text-slate-100">
                                    {testimonial.name}
                                    <span className="block font-normal text-sm text-slate-500 dark:text-slate-400 mt-1">{testimonial.role}</span>
                                </footer>
                            </div>
                        </div>
                    ))}
                    <ArrowButton onClick={goToNext} direction="right" />
                </div>
                 <div className="flex justify-center mt-6 gap-2">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? 'bg-teal-500 scale-125' : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'}`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSlider;
