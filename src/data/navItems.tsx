import { Home, Briefcase, BookOpen, Zap, Users, Star, Mail } from 'lucide-react';
import type { NavItem } from '../component/types';

export const navItems: NavItem[] = [
  { name: 'Home', href: '#Home', icon: <Home className="w-4 h-4" /> },
  { name: 'Services', href: '#Services', icon: <Briefcase className="w-4 h-4" /> },
  { name: 'Process', href: '#Process', icon: <Zap className="w-5 h-5" /> },
  { name: 'Portfolio', href: '#Portfolio', icon: <BookOpen className="w-4 h-4" /> },
  { name: 'Team', href: '#Team', icon: <Users className="w-5 h-5" /> },
  { name: 'Pricing', href: '#Pricing', icon: <Star className="w-5 h-5" /> },
  { name: 'Contact', href: '#Contact', icon: <Mail className="w-4 h-4" /> }
];