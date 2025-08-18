import { Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [loadingText, setLoadingText] = useState('Initializing SecureHome...');
  const [progress, setProgress] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    const loadingSteps = [
      { text: 'Connecting to security system...', delay: 500 },
      { text: 'Synchronizing sensor data...', delay: 800 },
      { text: 'Establishing secure connection...', delay: 600 },
      { text: 'Loading dashboard...', delay: 400 },
    ];

    let currentStep = 0;
    const totalSteps = loadingSteps.length;

    const runLoadingStep = () => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];
        setLoadingText(step.text);
        setProgress(((currentStep + 1) / totalSteps) * 100);
        
        setTimeout(() => {
          currentStep++;
          runLoadingStep();
        }, step.delay);
      } else {
        // Complete loading
        setLoadingText('Welcome to SecureHome!');
        setTimeout(() => {
          setIsCompleting(true);
          setTimeout(() => {
            onComplete();
          }, 500);
        }, 300);
      }
    };

    runLoadingStep();
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 gradient-bg flex items-center justify-center z-50 transition-opacity duration-500 ${
      isCompleting ? 'opacity-0' : 'opacity-100'
    } loading-fade-in`}>
      <div className="glass-dark rounded-2xl p-8 max-w-sm w-full mx-4 text-center loading-scale">
        {/* Logo and title */}
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Shield className="w-16 h-16 text-blue-400 animate-pulse" data-testid="loading-logo" />
              <div className="absolute inset-0 w-16 h-16 border-2 border-blue-400/30 rounded-full loading-spinner" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2" data-testid="loading-title">
            SecureHome
          </h1>
          <p className="text-slate-400 text-sm">Home Security System</p>
        </div>

        {/* Loading progress */}
        <div className="mb-6">
          <div className="w-full bg-slate-700/50 rounded-full h-2 mb-3">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-500 ease-out glow-blue"
              style={{ width: `${progress}%` }}
              data-testid="loading-progress"
            />
          </div>
          <p className="text-blue-400 text-sm font-medium animate-pulse" data-testid="loading-text">
            {loadingText}
          </p>
        </div>

        {/* Security indicators */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Encryption', status: progress > 25 },
            { label: 'Authentication', status: progress > 50 },
            { label: 'Monitoring', status: progress > 75 },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div 
                className={`w-2 h-2 rounded-full mx-auto mb-1 transition-all duration-300 ${
                  item.status ? 'bg-green-400 animate-pulse' : 'bg-slate-600'
                }`}
                data-testid={`indicator-${item.label.toLowerCase()}`}
              />
              <span className={`text-xs transition-colors ${
                item.status ? 'text-green-400' : 'text-slate-500'
              }`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}