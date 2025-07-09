import React, { useState, useCallback, useEffect } from 'react';
import { ProjectPlan, PitchGeneratorResponse, LearningPath, CollaboratorProfile, ReelsContentInput, ReelsContentResponse, User, ComplianceInput, ComplianceResponse, LiveNewsItem, View, FundraisingInput, FundraisingCopilotResponse } from './types';
import { generatePitchContent, generateLearningPath, generateProjectPlan, generateReelsContent, generateComplianceDocs, generateFundraisingAnalysis } from './services/geminiService';
import Header from './components/Header';
import InputForm from './components/InputForm';
import StudentBlueprint from './components/StudentBlueprint';
import CollabMatch from './components/CollabMatch';
import ChatWindow from './components/ChatWindow';
import AIStudioModal from './components/AIStudioModal';
import UtopianModeCTA from './components/UtopianModeCTA';
import PitchInputForm from './components/PitchInputForm';
import PitchDisplay from './components/PitchDisplay';
import LearningPathInputForm from './components/LearningPathInputForm';
import LearningPathDisplay from './components/LearningPathDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import FeatureLauncher from './components/FeatureLauncher';
import ReelsInputForm from './components/ReelsInputForm';
import ReelsDisplay from './components/ReelsDisplay';
import Hub from './components/Hub';
import ProfilePage from './components/ProfilePage';
import ComplianceInputForm from './components/ComplianceInputForm';
import ComplianceDisplay from './components/ComplianceDisplay';
import ExploreUsersPage from './components/ExploreUsersPage';
import LiveNewsFeed from './components/LiveNewsFeed';
import InterestSetupModal from './components/InterestSetupModal';
import NewsExplainerModal from './components/NewsExplainerModal';
import GrowthDashboard from './components/GrowthDashboard';
import AIExaminerPage from './components/AIExaminerPage';
import StartupSetupModal from './components/StartupSetupModal';
import StartupMirrorPage from './components/StartupMirrorPage';
import FundraisingInputForm from './components/FundraisingInputForm';
import FundraisingCopilotDisplay from './components/FundraisingCopilotDisplay';
import ProblemSolverPage from './components/ProblemSolverPage';

type AuthView = 'login' | 'signup';

const App: React.FC = () => {
  const { currentUser, users } = useAuth();
  const [authView, setAuthView] = useState<AuthView>('login');

  // State for all tools
  const [activeView, setActiveView] = useState<View>('home');
  const [viewingProfileId, setViewingProfileId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);
  const [isStartupSetupModalOpen, setIsStartupSetupModalOpen] = useState(false);

  // === Project Builder State ===
  const [idea, setIdea] = useState<string>('');
  const [projectPlan, setProjectPlan] = useState<ProjectPlan | null>(null);
  const [activeChatInfo, setActiveChatInfo] = useState<{ user: User, icebreaker: string } | null>(null);
  const [isStudioOpen, setIsStudioOpen] = useState<boolean>(false);
  const [showBlueprint, setShowBlueprint] = useState<boolean>(false);

  // === Pitch Generator State ===
  const [pitchContent, setPitchContent] = useState<PitchGeneratorResponse | null>(null);
  const [isPitchLoading, setIsPitchLoading] = useState<boolean>(false);

  // === Learning Path State ===
  const [learningPathContent, setLearningPathContent] = useState<LearningPath | null>(null);
  const [isLearningPathLoading, setIsLearningPathLoading] = useState<boolean>(false);

  // === Reels-to-Riches AI State ===
  const [reelsContent, setReelsContent] = useState<ReelsContentResponse | null>(null);
  const [isReelsLoading, setIsReelsLoading] = useState<boolean>(false);

  // === Startup Compliance AI State ===
  const [complianceContent, setComplianceContent] = useState<ComplianceResponse | null>(null);
  const [isComplianceLoading, setIsComplianceLoading] = useState<boolean>(false);
  
  // === News Explainer State ===
  const [selectedNews, setSelectedNews] = useState<LiveNewsItem | null>(null);

  // === Fundraising Co-pilot State ===
  const [fundraisingData, setFundraisingData] = useState<FundraisingCopilotResponse | null>(null);
  const [isFundraisingLoading, setIsFundraisingLoading] = useState<boolean>(false);


  useEffect(() => {
    // Open interest modal if user is logged in but has no interests set
    if (currentUser && (!currentUser.interests || currentUser.interests.trim() === '')) {
      setIsInterestModalOpen(true);
    }
    // Open startup setup modal if user is logged in but has no startup profile
    if (currentUser && !currentUser.startup) {
        setIsStartupSetupModalOpen(true);
    }
  }, [currentUser]);

  const handleNavigate = (view: View, profileId?: string) => {
    setActiveView(view);
    setViewingProfileId(profileId || null);

    // Reset states when switching tools to avoid showing stale data, unless navigating to profile
     if (view !== 'profile') {
        setProjectPlan(null);
        setShowBlueprint(false);
        setPitchContent(null);
        setLearningPathContent(null);
        setReelsContent(null);
        setComplianceContent(null);
        setFundraisingData(null);
     }
    setError(null);
  };
  
  // === Project Builder Functions ===
  const handleOpenStudio = useCallback(() => {
    if (!idea.trim()) {
      setError("Please enter an idea to get started!");
      return;
    }
    setProjectPlan(null);
    setShowBlueprint(false);
    setError(null);
    setActiveChatInfo(null);
    setIsStudioOpen(true);
  }, [idea]);

  const handleCloseStudio = () => setIsStudioOpen(false);
  
  const handleExportBlueprint = (plan: ProjectPlan) => {
    setProjectPlan(plan);
    setShowBlueprint(true);
    setIsStudioOpen(false);
  };
  
  const handleStartChatFromProfile = (userId: string) => {
      const userToChat = users.find(u => u.id === userId);
      if(userToChat) {
        setActiveChatInfo({ 
            user: userToChat, 
            icebreaker: `Hey! I saw your profile on LEAP and wanted to connect.`
        });
      }
  }

  const handleCloseChat = () => setActiveChatInfo(null);

  // === Pitch Generator Functions ===
  const handleGeneratePitch = async (inputs: { idea: string, targetUser: string, industry: string }) => {
    if (!currentUser?.startup) {
        setError("Please complete your startup profile first.");
        setIsStartupSetupModalOpen(true);
        return;
    }
    setIsPitchLoading(true);
    setPitchContent(null);
    setError(null);
    try {
        const result = await generatePitchContent(currentUser.startup);
        if ('clarificationNeeded' in result) {
            setError(`Let's refine your idea! ${result.clarificationNeeded}`);
        } else {
            setPitchContent(result);
        }
    } catch (e: any) {
        setError(e.message || "An unknown error occurred while generating the pitch.");
    } finally {
        setIsPitchLoading(false);
    }
  };

    // === Learning Path Functions ===
    const handleGenerateLearningPath = async (inputs: { idea: string; domain: string }) => {
        setIsLearningPathLoading(true);
        setLearningPathContent(null);
        setError(null);
        try {
            const result = await generateLearningPath(inputs.idea, inputs.domain);
            if ('clarificationNeeded' in result) {
                setError(`Let's refine your idea! ${result.clarificationNeeded}`);
            } else {
                setLearningPathContent(result);
            }
        } catch (e: any) {
            setError(e.message || "An unknown error occurred while generating the learning path.");
        } finally {
            setIsLearningPathLoading(false);
        }
    };
    
    // === Reels-to-Riches AI Functions ===
    const handleGenerateReelsContent = async (inputs: ReelsContentInput) => {
        setIsReelsLoading(true);
        setReelsContent(null);
        setError(null);
        try {
            const result = await generateReelsContent(inputs);
            if ('clarificationNeeded' in result) {
                setError(`Let's refine your idea! ${result.clarificationNeeded}`);
            } else {
                setReelsContent(result);
            }
        } catch (e: any) {
            setError(e.message || "An unknown error occurred while generating reels content.");
        } finally {
            setIsReelsLoading(false);
        }
    };

    // === Startup Compliance AI Functions ===
    const handleGenerateComplianceDocs = async (inputs: ComplianceInput) => {
        setIsComplianceLoading(true);
        setComplianceContent(null);
        setError(null);
        try {
            const result = await generateComplianceDocs(inputs);
            if ('clarificationNeeded' in result) {
                setError(`Let's refine your idea! ${result.clarificationNeeded}`);
            } else {
                setComplianceContent(result);
            }
        } catch (e: any) {
            setError(e.message || "An unknown error occurred while generating compliance documents.");
        } finally {
            setIsComplianceLoading(false);
        }
    };
    
    // === News Explainer Functions ===
    const handleNewsClick = (newsItem: LiveNewsItem) => {
        setSelectedNews(newsItem);
    };

    const handleCloseNewsModal = () => {
        setSelectedNews(null);
    };
    
    // === Fundraising Co-pilot Functions ===
    const handleGenerateFundraisingAnalysis = async (inputs: FundraisingInput) => {
        setIsFundraisingLoading(true);
        setFundraisingData(null);
        setError(null);
        try {
            const result = await generateFundraisingAnalysis(inputs);
            if ('clarificationNeeded' in result) {
                setError(`Let's refine the inputs! ${result.clarificationNeeded}`);
            } else {
                setFundraisingData(result);
            }
        } catch (e: any) {
            setError(e.message || "An unknown error occurred while generating the fundraising analysis.");
        } finally {
            setIsFundraisingLoading(false);
        }
    };


  const renderMainContent = () => {
    // If startup profile is not set, force user to stay on modal
    if (currentUser && !currentUser.startup && isStartupSetupModalOpen) {
        return <div className="text-center p-8">Please set up your startup profile to continue.</div>;
    }
    
    switch(activeView) {
      case 'home':
        return <FeatureLauncher onNavigate={handleNavigate} />;
      case 'hub':
        return <Hub onNavigate={handleNavigate} />;
      case 'explore':
        return <ExploreUsersPage onNavigate={handleNavigate} onStartChat={handleStartChatFromProfile} />;
      case 'examiner':
        return <AIExaminerPage onNavigate={handleNavigate} />;
      case 'mirror':
        return <StartupMirrorPage onNavigate={handleNavigate} />;
      case 'profile':
        if (viewingProfileId) {
            return <ProfilePage userId={viewingProfileId} onNavigate={handleNavigate} onStartChat={handleStartChatFromProfile} />;
        }
        // Fallback to home if no profile ID
        handleNavigate('home');
        return null;
      case 'growth':
        return <GrowthDashboard onNavigate={handleNavigate} />;
      case 'solver':
        return <ProblemSolverPage onNavigate={handleNavigate} />;
      case 'project':
      case 'pitch':
      case 'learning':
      case 'reels':
      case 'compliance':
      case 'fundraising':
        return (
          <>
            {/* Render correct input form based on active tool */}
            {activeView === 'project' && (
              <>
                <InputForm idea={idea} setIdea={setIdea} onOpenStudio={handleOpenStudio} />
              </>
            )}
            {activeView === 'pitch' && <PitchInputForm onSubmit={handleGeneratePitch} isLoading={isPitchLoading} />}
            {activeView === 'learning' && <LearningPathInputForm onSubmit={handleGenerateLearningPath} isLoading={isLearningPathLoading} />}
            {activeView === 'reels' && <ReelsInputForm onSubmit={handleGenerateReelsContent} isLoading={isReelsLoading} />}
            {activeView === 'compliance' && <ComplianceInputForm onSubmit={handleGenerateComplianceDocs} isLoading={isComplianceLoading} />}
            {activeView === 'fundraising' && <FundraisingInputForm onSubmit={handleGenerateFundraisingAnalysis} isLoading={isFundraisingLoading} />}

            {error && (
              <div className="mt-8 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-center animate-fade-in">
                <p className="font-bold">Oops! An error occurred.</p>
                <p>{error}</p>
              </div>
            )}

            {/* Project Builder Results */}
            {activeView === 'project' && showBlueprint && projectPlan && (
              <div className="mt-8 animate-zoom-in">
                  <StudentBlueprint plan={projectPlan} />
                  <CollabMatch plan={projectPlan} />
                  <UtopianModeCTA plan={projectPlan} onNavigate={handleNavigate} />
              </div>
            )}

            {/* Pitch Generator Results */}
            {activeView === 'pitch' && isPitchLoading && <LoadingSpinner />}
            {activeView === 'pitch' && pitchContent && (
              <div className="mt-8 animate-zoom-in">
                <PitchDisplay content={pitchContent} />
              </div>
            )}
            
            {/* Learning Path Results */}
            {activeView === 'learning' && isLearningPathLoading && <LoadingSpinner />}
            {activeView === 'learning' && learningPathContent && (
              <div className="mt-8 animate-zoom-in">
                <LearningPathDisplay content={learningPathContent} />
              </div>
            )}

            {/* Reels-to-Riches AI Results */}
            {activeView === 'reels' && isReelsLoading && <LoadingSpinner />}
            {activeView === 'reels' && reelsContent && (
              <div className="mt-8 animate-zoom-in">
                <ReelsDisplay content={reelsContent} />
              </div>
            )}

            {/* Startup Compliance AI Results */}
            {activeView === 'compliance' && isComplianceLoading && <LoadingSpinner />}
            {activeView === 'compliance' && complianceContent && (
                <div className="mt-8 animate-zoom-in">
                    <ComplianceDisplay content={complianceContent} />
                </div>
            )}
            
            {/* Fundraising Co-pilot Results */}
            {activeView === 'fundraising' && isFundraisingLoading && <LoadingSpinner />}
            {activeView === 'fundraising' && fundraisingData && (
                <div className="mt-8 animate-zoom-in">
                    <FundraisingCopilotDisplay data={fundraisingData} />
                </div>
            )}
          </>
        );
      default:
        return <FeatureLauncher onNavigate={handleNavigate} />;
    }
  };


  // Auth View
  if (!currentUser) {
      return authView === 'login' 
        ? <LoginPage onSwitchToSignup={() => setAuthView('signup')} />
        : <SignupPage onSwitchToLogin={() => setAuthView('login')} />;
  }

  // Main App View (Dashboard)
  return (
    <>
      <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl mx-auto">
          <Header onNavigate={handleNavigate} />
          <main className="animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}>
            {renderMainContent()}
          </main>
        </div>
      </div>

      {isStudioOpen && (
        <AIStudioModal 
          idea={idea}
          onClose={handleCloseStudio}
          onExport={handleExportBlueprint}
        />
      )}

      {activeChatInfo && (
        <ChatWindow 
          collaborator={{
            id: activeChatInfo.user.id,
            name: activeChatInfo.user.fullName,
            avatarUrl: activeChatInfo.user.profilePictureUrl,
            // These fields are not used if we simplify ChatWindow
            leapScore: 0, location: '', matchReason: '', matchType: 'Design Partner', topSkills: [],
            icebreaker: activeChatInfo.icebreaker
          }}
          onClose={handleCloseChat} 
        />
      )}

      {isInterestModalOpen && <InterestSetupModal onClose={() => setIsInterestModalOpen(false)} />}
      {isStartupSetupModalOpen && <StartupSetupModal onClose={() => setIsStartupSetupModalOpen(false)} />}
      
      <LiveNewsFeed currentUser={currentUser} onNewsClick={handleNewsClick} />
      
      {selectedNews && (
          <NewsExplainerModal
              newsItem={selectedNews}
              onClose={handleCloseNewsModal}
          />
      )}
    </>
  );
};

export default App;