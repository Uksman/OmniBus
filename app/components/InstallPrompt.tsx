'use client';

import { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Update UI notify the user they can install the PWA
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  if (!isInstallable) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-800 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-5 sm:max-w-sm">
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
            <Download className="w-6 h-6 text-[#DA291C]" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white leading-tight">Install OmiBus</h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Get the app for a faster experience and easy access.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsInstallable(false)}
          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-1 -mr-1 -mt-1 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <button 
        onClick={handleInstallClick}
        className="w-full bg-[#DA291C] hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm shadow-sm"
      >
        Install App
      </button>
    </div>
  );
}
