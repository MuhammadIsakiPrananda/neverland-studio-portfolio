import { Users, Award, Star, Zap } from 'lucide-react';
import { Stat } from '../types';

export const stats: Stat[] = [
  { icon: <Users className="w-8 h-8" />, number: "200+", label: "Happy Clients" },
  { icon: <Award className="w-8 h-8" />, number: "350+", label: "Projects Completed" },
  { icon: <Star className="w-8 h-8" />, number: "4.9/5", label: "Client Rating" },
  { icon: <Zap className="w-8 h-8" />, number: "99%", label: "Success Rate" }
];