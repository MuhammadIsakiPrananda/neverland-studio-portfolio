import React, { useEffect, useState } from 'react';
import { Wrench, Clock, Mail, ArrowRight, Sparkles } from 'lucide-react';

interface MaintenancePageProps {
  title?: string;
  message?: string;
  estimatedTime?: string;
}

const MaintenancePage: React.FC<MaintenancePageProps> = ({
  title = 'Website Under Maintenance',
  message = 'We are currently performing scheduled maintenance. We will be back soon!',
  estimatedTime
}) => {
  const [dots, setDots] = useState('.');

  // Animated dots for loading effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '.' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Main Content */}
      <div className="relative max-w-3xl w-full">
        {/* Card */}
        <div className="relative backdrop-blur-sm bg-slate-900/50 rounded-3xl border border-slate-800/50 p-8 md:p-12 shadow-2xl">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-3xl blur opacity-30"></div>

          <div className="relative">
            {/* Icon Section */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                {/* Outer Ring */}
                <div className="absolute inset-0 animate-spin-slow">
                  <div className="w-28 h-28 rounded-full border-2 border-dashed border-blue-500/30"></div>
                </div>

                {/* Inner Circle */}
                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-full border border-slate-700">
                  <Wrench className="w-12 h-12 text-blue-400" />
                </div>

                {/* Sparkle */}
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                {title}
              </span>
            </h1>

            {/* Loading Dots */}
            <div className="text-center mb-6">
              <span className="text-blue-400 text-2xl font-bold">{dots}</span>
            </div>

            {/* Message */}
            <p className="text-lg text-slate-400 text-center mb-8 leading-relaxed max-w-2xl mx-auto">
              {message}
            </p>

            {/* Estimated Time Badge */}
            {estimatedTime && (
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-500/10 border border-blue-500/30 rounded-full backdrop-blur-sm">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-300 font-medium">
                    Back in: <span className="font-bold">{estimatedTime}</span>
                  </span>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-slate-900 px-4 text-slate-600 text-sm">•••</span>
              </div>
            </div>

            {/* Info Section */}
            <div className="space-y-4">
              {/* Status Updates */}
              <div className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-xl border border-slate-800">
                <div className="mt-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <p className="text-slate-300 text-sm">
                    We're working hard to improve your experience
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="text-center">
                <p className="text-slate-500 text-sm mb-3">
                  Need immediate assistance?
                </p>
                <a
                  href="mailto:support@neverlandstudio.com"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl transition-all duration-300 group"
                >
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-300 font-medium">support@neverlandstudio.com</span>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </a>
              </div>
            </div>

            {/* Brand Footer */}
            <div className="mt-10 pt-8 border-t border-slate-800 text-center">
              <div className="inline-flex items-center gap-2 mb-2">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Neverland Studio
                </h2>
                <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
              </div>
              <p className="text-slate-500 text-sm">Creative Digital Solutions</p>
            </div>
          </div>
        </div>

        {/* Footer Copyright */}
        <div className="text-center mt-8">
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} Neverland Studio. All rights reserved.
          </p>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default MaintenancePage;
