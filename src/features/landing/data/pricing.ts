import type { PricingPlan } from "@/shared/types";

export const pricing: PricingPlan[] = [
  {
    name: "Starter",
    price: "$2,999",
    desc: "Perfect for small businesses and startups",
    features: [
      "5-page website",
      "Responsive design",
      "Basic SEO",
      "Contact form",
      "3 months support",
      "Social media integration",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "$5,999",
    desc: "Ideal for growing businesses",
    features: [
      "10-page website",
      "Custom design",
      "Advanced SEO",
      "CMS integration",
      "E-commerce ready",
      "6 months support",
      "Analytics dashboard",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "Tailored solutions for large organizations",
    features: [
      "Unlimited pages",
      "Premium design",
      "Full SEO suite",
      "Custom features",
      "API integration",
      "12 months support",
      "Dedicated manager",
      "24/7 priority support",
      "Training included",
    ],
    popular: false,
  },
];
