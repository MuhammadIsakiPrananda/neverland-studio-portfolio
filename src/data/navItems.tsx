import { Home, Briefcase, BookOpen, Zap, Users, Star, Mail } from 'lucide-react';
import { NavItem } from '../types';

export const navItems: NavItem[] = [
  { name: 'Home', icon: <Home className="w-4 h-4" /> },
  { name: 'Services', icon: <Briefcase className="w-4 h-4" /> },
  { name: 'Process', icon: <Zap className="w-5 h-5" /> },
  { name: 'Portfolio', icon: <BookOpen className="w-4 h-4" /> },
  { name: 'Team', icon: <Users className="w-5 h-5" /> },
  { name: 'Pricing', icon: <Star className="w-5 h-5" /> },
  { name: 'Contact', icon: <Mail className="w-4 h-4" /> }
];