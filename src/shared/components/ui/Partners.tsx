import React from "react";
import { partners } from "@/features/landing/data/partners.tsx"; // Memastikan path sudah benar

const Partners: React.FC = () => {
  // Gandakan array untuk memastikan animasi scroll berjalan mulus tanpa jeda
  const extendedPartners = [...partners, ...partners];

  return (
    <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
      <ul
        className="flex items-center justify-center md:justify-start [&_li]:mx-10 animate-infinite-scroll"
        style={{ animationDuration: "60s" }} // Kecepatan scroll diperlambat
      >
        {extendedPartners.map((partner, index) => (
          <li
            key={`${partner.name}-${index}`}
            className="group flex flex-col items-center gap-3 cursor-pointer"
            title={partner.name}
          >
            <div
              className={`flex items-center justify-center h-16 w-16 bg-slate-800/50 border border-slate-700/50 rounded-full transition-all duration-300 group-hover:bg-slate-800 group-hover:border-cyan-500/50 ${
                partner.name === "Blibli" || partner.name === "Bukalapak"
                  ? "p-2" // Padding lebih kecil agar logo tampak lebih besar
                  : "p-3"
              }`}
            >
              <img
                src={partner.logo}
                alt={`${partner.name} logo`}
                className="h-full w-full object-contain filter grayscale opacity-70 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
              />
            </div>
            <span className="text-sm font-medium text-slate-400 transition-colors duration-300 group-hover:text-cyan-400">
              {partner.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Partners;
