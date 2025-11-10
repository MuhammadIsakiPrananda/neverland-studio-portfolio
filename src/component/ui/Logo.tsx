import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center space-x-3 flex-shrink-0 group">
      <div className="w-10 h-10 rounded-full overflow-hidden shadow-md group-hover:shadow-lg group-hover:shadow-sky-500/20 transition-all duration-300 transform group-hover:scale-110 border-2 border-slate-700 group-hover:border-sky-500/50">
        <img src="/images/Neverland Studio.webp" alt="Neverland Studio Logo" className="w-full h-full object-cover" />
      </div> 
      <div className="flex flex-col justify-center">
        <span className="block text-xl font-bold tracking-wider leading-none bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">Neverland</span>
        <span className="block text-sm font-medium tracking-widest leading-none text-slate-300">Studio</span>
      </div>
    </div>
  );
};

export default Logo;