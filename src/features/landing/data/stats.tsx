import { Users, Award, Star, Zap } from "lucide-react";
import type { Stat } from "@/shared/types";

export const stats: Stat[] = [
  {
    icon: <Users className="w-6 h-6" />,
    number: "200+",
    label: "Happy Clients",
  },
  {
    icon: <Award className="w-6 h-6" />,
    number: "350+",
    label: "Projects Completed",
  },
  {
    icon: <Star className="w-6 h-6" />,
    number: "4.9/5",
    label: "Client Rating",
  },
  { icon: <Zap className="w-6 h-6" />, number: "99%", label: "Success Rate" },
];
