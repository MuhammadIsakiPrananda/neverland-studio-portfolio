import React from 'react';
import { partners } from '../../data/partners'; // Memastikan path sudah benar

const Partners: React.FC = () => {
  // Gandakan array untuk memastikan animasi scroll berjalan mulus tanpa jeda
  const extendedPartners = [...partners, ...partners];

  return (
    <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
      <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 animate-infinite-scroll" style={{ animationDuration: '40s' }}>
        {extendedPartners.map((partner, index) => (
          <li key={index}>
            <div className="flex items-center gap-4 text-slate-500 hover:text-amber-400 transition-colors duration-300 cursor-pointer" title={partner.name}>
              {partner.icon}
              <span className="text-xl font-semibold tracking-wider whitespace-nowrap">{partner.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Partners;