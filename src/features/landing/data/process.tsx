import {
  Target,
  BookOpen,
  Palette,
  Code,
  Rocket,
  TrendingUp,
} from "lucide-react";
import type { ProcessStep } from "@/shared/types";

export const process: ProcessStep[] = [
  {
    icon: <Target className="w-8 h-8" />,
    title: "Discovery",
    desc: "We learn about your business, goals, and target audience",
    step: "01",
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Strategy",
    desc: "Creating a detailed roadmap and action plan",
    step: "02",
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: "Design",
    desc: "Crafting beautiful, user-centered designs",
    step: "03",
  },
  {
    icon: <Code className="w-8 h-8" />,
    title: "Development",
    desc: "Building with clean, scalable code",
    step: "04",
  },
  {
    icon: <Rocket className="w-8 h-8" />,
    title: "Launch",
    desc: "Deploying your project to the world",
    step: "05",
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Growth",
    desc: "Ongoing optimization and support",
    step: "06",
  },
];
