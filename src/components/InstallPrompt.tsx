"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if already installed (standalone mode)
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    setIsStandalone(standalone);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check if user has dismissed the prompt before
    const dismissed = localStorage.getItem("install-prompt-dismissed");
    if (
      dismissed &&
      Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000
    ) {
      // 7 days
      setShowInstallPrompt(false);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
      setShowInstallPrompt(false);
    } else {
      console.log("User dismissed the install prompt");
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem("install-prompt-dismissed", Date.now().toString());
  };

  // Don't show if already installed or if user dismissed recently
  if (isStandalone || !showInstallPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Install DUIT
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
              {isIOS
                ? "Tap the share button and select 'Add to Home Screen'"
                : "Install this app for a better experience"}
            </p>

            {isIOS && (
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <Smartphone className="w-3 h-3" />
                <span>Works offline • No app store needed</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDismiss}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>

            {!isIOS && (
              <Button
                size="sm"
                onClick={handleInstallClick}
                className="h-8 text-xs"
              >
                Install
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
