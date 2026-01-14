export default function DecorativeBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Subtle Animated Gradient Orbs */}
      <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-blue-500/8 rounded-full blur-[140px] animate-pulse" 
           style={{ animationDuration: '8s' }} />
      <div className="absolute top-1/3 right-1/4 w-[550px] h-[550px] bg-cyan-500/6 rounded-full blur-[130px] animate-pulse" 
           style={{ animationDuration: '10s', animationDelay: '1.5s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-[120px] animate-pulse" 
           style={{ animationDuration: '12s', animationDelay: '2.5s' }} />
      <div className="absolute top-1/2 right-1/3 w-[450px] h-[450px] bg-indigo-400/4 rounded-full blur-[110px] animate-pulse" 
           style={{ animationDuration: '9s', animationDelay: '3.5s' }} />
      
      {/* Minimal Grid Pattern Overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Subtle Animated Lines */}
      <svg className="absolute top-0 left-0 w-full h-full opacity-5">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path 
          d="M0,200 Q400,100 800,200 T1600,200" 
          stroke="url(#lineGradient)" 
          strokeWidth="1.5" 
          fill="none"
          className="animate-draw"
        />
        <path 
          d="M0,400 Q400,300 800,400 T1600,400" 
          stroke="url(#lineGradient2)" 
          strokeWidth="1.5" 
          fill="none"
          className="animate-draw-delayed"
        />
      </svg>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
          50% {
            transform: translateY(-40px) rotate(-180deg) scale(1.2);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(20px);
          }
        }

        @keyframes draw {
          0% {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
          }
          100% {
            stroke-dasharray: 1000;
            stroke-dashoffset: 0;
          }
        }

        .animate-draw {
          animation: draw 12s ease-in-out infinite;
        }

        .animate-draw-delayed {
          animation: draw 14s ease-in-out infinite;
          animation-delay: 3s;
        }
      `}</style>
    </div>
  );
}
