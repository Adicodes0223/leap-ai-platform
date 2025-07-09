
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Part } from "@google/genai";
import { useAuth } from '../contexts/AuthContext';
import { examinerQuestions } from './aiExaminerQuestions';
import { generateAIEvaluation } from '../services/geminiService';
import { AIEvaluation, Clarification, View } from '../types';
import AIExaminerResults from './AIExaminerResults';

// Type Guards
function isAIEvaluation(response: AIEvaluation | Clarification): response is AIEvaluation {
  return (response as AIEvaluation).overallScore !== undefined;
}

// Extend the Window interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type ExaminerStatus = 'idle' | 'requestingPermissions' | 'ready' | 'speaking' | 'listening' | 'analyzing' | 'finished' | 'error';

const AIExaminerPage: React.FC<{ onNavigate: (view: View) => void }> = ({ onNavigate }) => {
    const { currentUser } = useAuth();
    const [status, setStatus] = useState<ExaminerStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [transcript, setTranscript] = useState<{ speaker: 'AI' | 'Candidate'; text: string }[]>([]);
    const [evaluation, setEvaluation] = useState<AIEvaluation | null>(null);
    const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const speechRecognitionRef = useRef<any | null>(null);
    const capturedImagePartsRef = useRef<Part[]>([]);
    const synthRef = useRef(window.speechSynthesis);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = synthRef.current?.getVoices();
            if (availableVoices && availableVoices.length > 0) {
                setVoices(availableVoices);
                if (synthRef.current) {
                    synthRef.current.onvoiceschanged = null; // Stop listening once voices are loaded.
                }
            }
        };

        if (synthRef.current) {
            synthRef.current.onvoiceschanged = loadVoices;
        }
        loadVoices();
    }, []);

    const setupMedia = useCallback(async () => {
        try {
            setStatus('requestingPermissions');
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            // Setup MediaRecorder
            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
            const chunks: Blob[] = [];
            mediaRecorderRef.current.ondataavailable = (event) => {
                chunks.push(event.data);
            };
            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                setVideoBlobUrl(URL.createObjectURL(blob));
            };
            setStatus('ready');
        } catch (err) {
            console.error("Error accessing media devices.", err);
            setError("Camera and microphone access is required. Please enable permissions and refresh.");
            setStatus('error');
        }
    }, []);

    const speak = useCallback((text: string) => {
        return new Promise<void>((resolve, reject) => {
            if (!synthRef.current) {
                return reject("Speech synthesis is not supported in this browser.");
            }
            
            if (synthRef.current.speaking) {
                synthRef.current.cancel();
            }

            const utterance = new SpeechSynthesisUtterance(text);
            
            const googleUSEnglishVoice = voices.find(v => v.lang === 'en-US' && v.name.includes('Google'));
            const naturalUSEnglishVoice = voices.find(v => v.lang === 'en-US' && v.name.toLowerCase().includes('natural'));
            const fallbackUSEnglishVoice = voices.find(v => v.lang === 'en-US');

            utterance.voice = googleUSEnglishVoice || naturalUSEnglishVoice || fallbackUSEnglishVoice || null;
            utterance.volume = 1;
            utterance.rate = 0.95;
            utterance.pitch = 1;

            utterance.onend = () => resolve();
            utterance.onerror = (event) => {
                console.error("SpeechSynthesis Error", event);
                reject(`Speech synthesis error: ${event.error}`);
            };
            
            setStatus('speaking');
            synthRef.current.speak(utterance);
        });
    }, [voices]);

    const startListening = () => {
        return new Promise<string>((resolve, reject) => {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                reject("Speech recognition is not supported in this browser.");
                return;
            }
            
            speechRecognitionRef.current = new SpeechRecognition();
            speechRecognitionRef.current.continuous = false;
            speechRecognitionRef.current.interimResults = false;
            
            speechRecognitionRef.current.onstart = () => setStatus('listening');
            speechRecognitionRef.current.onend = () => setStatus('ready');
            speechRecognitionRef.current.onerror = (event: any) => reject(event.error);
            speechRecognitionRef.current.onresult = (event: any) => {
                const result = event.results[event.resultIndex][0].transcript;
                resolve(result);
            };
            
            speechRecognitionRef.current.start();
        });
    };

    const captureFrame = async (): Promise<Part | null> => {
        if (!videoRef.current || videoRef.current.readyState < 2) return null;

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');

        return {
            inlineData: {
                mimeType: 'image/jpeg',
                data: dataUrl.split(',')[1]
            }
        };
    };

    const runInterviewCycle = useCallback(async () => {
        if (currentQuestionIndex >= examinerQuestions.length) {
            mediaRecorderRef.current?.stop();
            setStatus('analyzing');
            try {
                const result = await generateAIEvaluation(transcript, capturedImagePartsRef.current);
                if (isAIEvaluation(result)) {
                    setEvaluation(result);
                    setStatus('finished');
                } else {
                    setError(result.clarificationNeeded);
                    setStatus('error');
                }
            } catch (e: any) {
                setError(e.message);
                setStatus('error');
            }
            return;
        }

        const question = examinerQuestions[currentQuestionIndex].question;
        setTranscript(prev => [...prev, { speaker: 'AI', text: question }]);

        try {
            await speak(question);
        } catch (err: any) {
            setError(err.toString());
            setStatus('error');
            mediaRecorderRef.current?.stop();
            return;
        }

        try {
            const answer = await startListening();
            setTranscript(prev => [...prev, { speaker: 'Candidate', text: answer }]);
            
            const frame = await captureFrame();
            if (frame) {
                capturedImagePartsRef.current.push(frame);
            }

            setCurrentQuestionIndex(prev => prev + 1);
        } catch (err) {
            console.error("Listening error:", err);
            setCurrentQuestionIndex(prev => prev + 1);
        }
    }, [currentQuestionIndex, transcript, speak]);
    
    useEffect(() => {
        if (status === 'ready' && currentQuestionIndex > 0 && currentQuestionIndex <= examinerQuestions.length) {
             runInterviewCycle();
        }
    }, [status, currentQuestionIndex, runInterviewCycle]);


    const startInterview = () => {
        if (status !== 'ready') return;
        mediaRecorderRef.current?.start();
        runInterviewCycle();
    };

    const renderContent = () => {
        if (status === 'finished' && evaluation && videoBlobUrl) {
            return <AIExaminerResults evaluation={evaluation} videoBlobUrl={videoBlobUrl} onRestart={() => window.location.reload()} />;
        }

        return (
             <div className="flex flex-col items-center justify-center h-full p-4">
                <div className="w-full max-w-4xl text-center">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">AI Mock Interview</h2>
                    <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">Practice your pitch with a conversational AI.</p>
                </div>
                
                <div className="w-full max-w-2xl my-8 p-4 rounded-2xl shadow-xl backdrop-blur-lg bg-white/40 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-700/70">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full rounded-lg aspect-video object-cover" />
                </div>

                <div className="min-h-[80px] text-center">
                    {status === 'idle' && <button onClick={setupMedia} className="btn-primary">Setup Camera & Mic</button>}
                    {status === 'requestingPermissions' && <p>Requesting permissions...</p>}
                    {status === 'ready' && <button onClick={startInterview} className="btn-primary">Start Interview</button>}
                    {status === 'speaking' && <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">AI is speaking...</p>}
                    {status === 'listening' && <p className="text-lg font-semibold text-teal-600 dark:text-teal-400 animate-pulse">Listening...</p>}
                    {status === 'analyzing' && <p className="text-lg font-semibold text-sky-600 dark:text-sky-400">Analyzing your performance...</p>}
                    {status === 'error' && <div className="text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg"><p className="font-bold">Error:</p><p>{error}</p></div>}
                </div>
                 <style>{`
                    .btn-primary {
                        padding: 12px 24px;
                        font-size: 1.125rem;
                        font-weight: 600;
                        border-radius: 0.75rem;
                        color: white;
                        background-image: linear-gradient(to right, #6d28d9, #4f46e5);
                        transition: all 0.3s;
                    }
                    .btn-primary:hover {
                        box-shadow: 0 0 20px rgba(109, 40, 217, 0.5);
                        transform: translateY(-2px);
                    }
                `}</style>
            </div>
        );
    };

    return <div className="min-h-[80vh] flex flex-col">{renderContent()}</div>;
};

export default AIExaminerPage;
