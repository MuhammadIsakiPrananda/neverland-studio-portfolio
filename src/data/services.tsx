import { Code, Smartphone, Palette, Globe, Video, Camera, Music, Film } from 'lucide-react';
import type { Service } from '../component/types';

export const services: Service[] = [
  {
    icon: <Code className="w-8 h-8" />,
    title: "Web Development",
    desc: "Modern, responsive websites built with cutting-edge technologies",
    features: ["React & Next.js", "Backend APIs", "Database Design"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "Mobile Apps",
    desc: "Native and cross-platform mobile applications",
    features: ["iOS & Android", "React Native", "Flutter"],
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: "UI/UX Design",
    desc: "Beautiful, intuitive interfaces that users love",
    features: ["User Research", "Wireframing", "Prototyping"],
    color: "from-pink-500 to-rose-500"
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Digital Marketing",
    desc: "Strategic campaigns to grow your online presence",
    features: ["SEO Optimization", "Social Media", "Content Strategy"],
    color: "from-orange-500 to-red-500"
  },
  {
    icon: <Video className="w-8 h-8" />,
    title: "Video Production",
    desc: "Professional video content that tells your story",
    features: ["Commercial Ads", "Product Videos", "Motion Graphics"],
    color: "from-green-500 to-teal-500"
  },
  {
    icon: <Camera className="w-8 h-8" />,
    title: "Brand Photography",
    desc: "Stunning visuals that capture your brand essence",
    features: ["Product Photography", "Lifestyle Shoots", "Post-Production"],
    color: "from-indigo-500 to-purple-500"
  },
  {
    icon: <Music className="w-8 h-8" />,
    title: "Sound Design",
    desc: "Custom audio that enhances user experience",
    features: ["Music Production", "Voice Overs", "Sound Effects"],
    color: "from-violet-500 to-purple-500"
  },
  {
    icon: <Film className="w-8 h-8" />,
    title: "Animation",
    desc: "Engaging animations that bring ideas to life",
    features: ["2D Animation", "3D Modeling", "Explainer Videos"],
    color: "from-yellow-500 to-orange-500"
  }
];