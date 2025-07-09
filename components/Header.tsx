import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { View } from '../types';

// Icons
const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>;
const TowerIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.375a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375H9a.375.375 0 01-.375-.375v-1.5A.375.375 0 019 6.75zM9 12.75h6.375a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375H9a.375.375 0 01-.375-.375v-1.5a.375.375 0 01.375-.375z" /></svg>;
const HamburgerIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>;
const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const ProfileIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
const LogoutIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>;


interface HeaderProps {
    onNavigate: (view: View, profileId?: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMobileNav = (view: View, profileId?: string) => {
      onNavigate(view, profileId);
      setIsMenuOpen(false);
  };

  const handleLogout = () => {
      logout();
      setIsMenuOpen(false);
  };

  return (
    <>
      <header className="flex justify-between items-center my-8 sm:my-12 animate-fade-in">
        {/* Left Side: Title */}
        <div className="flex-shrink-0">
          <h1 
            className="text-3xl sm:text-5xl font-extrabold tracking-tight [text-shadow:0_2px_10px_rgba(0,0,0,0.1)] dark:[text-shadow:none] cursor-pointer" 
            onClick={() => onNavigate('home')}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-sky-600 to-purple-600 dark:from-teal-300 dark:via-sky-400 dark:to-purple-400">LEAP</span>
          </h1>
          <p className="hidden sm:block mt-1 text-base text-slate-500 dark:text-slate-400">Your first step from idea to creation.</p>
        </div>

        {/* Right Side: Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-3">
            <button onClick={() => onNavigate('home')} title="Home" className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"><HomeIcon className="h-6 w-6" /></button>
            <button onClick={() => onNavigate('hub')} title="Community Hub" className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"><TowerIcon className="h-6 w-6" /></button>
            
            {currentUser && (
                <>
                    <button onClick={() => onNavigate('profile', currentUser.id)} title="My Profile">
                        <img src={currentUser.profilePictureUrl} alt={currentUser.fullName} className="w-10 h-10 rounded-full border-2 border-slate-300 hover:border-teal-400 dark:border-slate-600 dark:hover:border-teal-400 transition-all"/>
                    </button>
                    <button onClick={logout} className="text-sm font-medium text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition">Logout</button>
                </>
            )}
            <ThemeToggle />
        </nav>

        {/* Right Side: Mobile Hamburger Button */}
        <div className="sm:hidden">
            <button 
                onClick={() => setIsMenuOpen(true)} 
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                aria-label="Open menu"
            >
                <HamburgerIcon className="h-7 w-7" />
            </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-50 dark:bg-slate-900 z-50 animate-fade-in flex flex-col"
          role="dialog"
          aria-modal="true"
        >
            {/* Mobile Menu Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-bold">Menu</h2>
                <button 
                    onClick={() => setIsMenuOpen(false)} 
                    className="p-2 rounded-full text-slate-500 dark:text-slate-400"
                    aria-label="Close menu"
                >
                    <CloseIcon className="h-7 w-7" />
                </button>
            </div>
            
            {/* Mobile Menu Navigation */}
            <nav className="flex-grow flex flex-col p-4 space-y-2">
                <a onClick={() => handleMobileNav('home')} className="flex items-center gap-4 px-4 py-3 text-lg font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                    <HomeIcon className="h-6 w-6 text-slate-500" /> Home
                </a>
                <a onClick={() => handleMobileNav('hub')} className="flex items-center gap-4 px-4 py-3 text-lg font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                    <TowerIcon className="h-6 w-6 text-slate-500" /> Community Hub
                </a>
                
                {currentUser && (
                     <a onClick={() => handleMobileNav('profile', currentUser.id)} className="flex items-center gap-4 px-4 py-3 text-lg font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                        <ProfileIcon className="h-6 w-6 text-slate-500" /> My Profile
                    </a>
                )}
            </nav>

            {/* Mobile Menu Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Toggle Theme</span>
                    <ThemeToggle />
                </div>
                {currentUser && (
                    <a onClick={handleLogout} className="flex w-full items-center justify-center gap-3 px-4 py-3 text-lg font-medium rounded-lg bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900 transition-colors cursor-pointer">
                        <LogoutIcon className="h-6 w-6"/> Logout
                    </a>
                )}
            </div>
        </div>
      )}
    </>
  );
};

export default Header;