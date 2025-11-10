import { Shield, Clock, Heart, Zap, Users, Award } from 'lucide-react';
import type { Benefit } from '../component/types';

export const benefits: Benefit[] = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Proven Track Record",
    desc: "We have a history of delivering over 350 successful projects to satisfied clients worldwide."
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "On-Time Delivery",
    desc: "Our efficient workflow ensures that 98% of our projects are delivered on or before the deadline."
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Client Satisfaction",
    desc: "We pride ourselves on a 4.9/5 average client rating, reflecting our commitment to quality."
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Fast Turnaround",
    desc: "Our agile development process allows for rapid iterations and quick, tangible results."
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Expert Team",
    desc: "Our team consists of over 30 dedicated specialists in design, development, and marketing."
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Award Winning",
    desc: "Our work has been recognized with multiple industry awards for design and innovation."
  }
];