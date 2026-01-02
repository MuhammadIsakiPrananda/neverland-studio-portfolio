import React from 'react';
import { Wrench, Clock, RefreshCw } from 'lucide-react';

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Main Content */}
        <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8 md:p-12 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"></div>
              <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-full">
                <Wrench className="w-12 h-12 text-white animate-bounce" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {title}
          </h1>

          {/* Message */}
          <p className="text-lg text-slate-300 mb-6 leading-relaxed">
            {message}
          </p>

          {/* Estimated Time */}
          {estimatedTime && (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-300 mb-8">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Estimated time: {estimatedTime}</span>
            </div>
          )}

          {/* Divider */}
          <div className="my-8 border-t border-slate-700"></div>

          {/* Additional Info */}
          <div className="space-y-4 text-slate-400">
            <p className="flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Please check back later</span>
            </p>
            
            <p className="text-sm">
              If you need immediate assistance, please contact us at{' '}
              <a 
                href="mailto:support@neverlandstudio.com" 
                className="text-blue-400 hover:text-blue-300 underline"
              >
                support@neverlandstudio.com
              </a>
            </p>
          </div>

          {/* Logo/Brand */}
          <div className="mt-8 pt-8 border-t border-slate-700">
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Neverland Studio
            </p>
            <p className="text-sm text-slate-500 mt-2">Creative Digital Solutions</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Neverland Studio. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
