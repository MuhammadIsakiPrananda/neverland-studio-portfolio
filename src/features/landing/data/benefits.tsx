import { BrainCircuit, Gem, Rocket, ShieldCheck } from "lucide-react";

export interface Benefit {
  icon: React.ReactNode;
  title: string;
  spotlightColor: string;
  borderColor: string;
  description: string;
  details: string[];
}

export const benefits: Benefit[] = [
  {
    icon: <Rocket className="w-8 h-8 text-premium-champagne-gold-400" />,
    title: "Future-Forward Solutions",
    spotlightColor: "rgba(250, 204, 21, 0.1)", // Champagne Gold
    borderColor: "border-premium-champagne-gold-500/50",
    description:
      "We engineer future-proof digital platforms by leveraging next-generation technology, ensuring your brand not only competes but leads.",
    details: [
      "Built on a robust Next.js & TypeScript foundation.",
      "Captivating animations that enhance user delight.",
      "Scalable architecture designed to evolve with your business.",
    ],
  },
  {
    icon: <Gem className="w-8 h-8 text-premium-rich-gold-400" />,
    title: "Uncompromising Quality",
    spotlightColor: "rgba(212, 175, 55, 0.1)", // Rich Gold
    borderColor: "border-premium-rich-gold-500/50",
    description:
      "From pixel-perfect UIs to robust back-end logic, our commitment to quality is absolute and evident in every detail.",
    details: [
      "Meticulous testing across all devices and browsers.",
      "Clean, well-documented code for easy maintenance.",
      "Optimized for Core Web Vitals and speed.",
    ],
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-cyan-400" />,
    title: "A True Partnership",
    spotlightColor: "rgba(34, 211, 238, 0.1)", // Cyan
    borderColor: "border-cyan-500/50",
    description:
      "We integrate with your team, fostering transparent communication and a shared commitment to your goals.",
    details: [
      "Proactive communication and regular updates.",
      "Flexible and adaptive agile methodology.",
      "Post-launch support and maintenance.",
    ],
  },
  {
    icon: <BrainCircuit className="w-8 h-8 text-sky-400" />,
    title: "Strategic Approach",
    spotlightColor: "rgba(56, 189, 248, 0.1)", // Sky
    borderColor: "border-sky-500/50",
    description:
      "Our data-driven strategy ensures every design and development choice is purposeful and aligned with your business objectives.",
    details: [
      "In-depth discovery and analysis.",
      "User-centric design and journey mapping.",
      "Focus on measurable business goals.",
    ],
  },
];
