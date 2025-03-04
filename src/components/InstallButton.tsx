import React, { useEffect, useState } from 'react';

declare global {
  interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
    prompt(): Promise<void>;
  }
}

const InstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      if ('prompt' in event) {
        const customEvent = event as BeforeInstallPromptEvent;
        customEvent.preventDefault();
        setDeferredPrompt(customEvent);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Usuario aceptó la instalación');
        } else {
          console.log('Usuario rechazó la instalación');
        }
        setDeferredPrompt(null);
      });
    }
  };

  if (!deferredPrompt) {
    return null;
  }

  return (
    <button onClick={handleInstallClick}>
      Instalar la aplicación
    </button>
  );
};

export default InstallButton;
