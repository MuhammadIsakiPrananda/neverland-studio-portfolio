import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Building,
  Briefcase,
  MessageSquare,
  DollarSign,
  Send,
  Loader,
  AlertCircle,
} from "lucide-react";
import { useNotification } from "../ui/useNotification";

interface QuoteRequestFormProps {
  onClose: () => void;
}

const services = [
  "Web Design & Development",
  "Web Application",
  "Mobile App Development",
  "UI/UX Design",
  "Branding & Logo",
  "Digital Marketing",
];

const QuoteRequestForm: React.FC<QuoteRequestFormProps> = ({ onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [service, setService] = useState("");
  const [budget, setBudget] = useState("");
  const [details, setDetails] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotification();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !service || !details) {
      setError("Please fill all required fields.");
      return;
    }
    setError(null);
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      addNotification(
        "Quote Request Sent!",
        "We will get back to you shortly.",
        "success"
      );
      onClose();
    }, 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.h2
        variants={itemVariants}
        className="text-2xl font-bold text-white mb-6 text-center"
      >
        Request a Quote
      </motion.h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </motion.div>
        )}

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cyan-500 focus:ring-cyan-500/30 focus:outline-none transition-colors"
              required
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cyan-500 focus:ring-cyan-500/30 focus:outline-none transition-colors"
              required
            />
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Company Name (Optional)"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cyan-500 focus:ring-cyan-500/30 focus:outline-none transition-colors"
            />
          </div>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cyan-500 focus:ring-cyan-500/30 focus:outline-none transition-colors appearance-none"
              required
            >
              <option value="" disabled>
                Service of Interest
              </option>
              {services.map((s) => (
                <option key={s} value={s} className="bg-slate-900">
                  {s}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Estimated Budget (Optional)"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cyan-500 focus:ring-cyan-500/30 focus:outline-none transition-colors"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="relative">
          <MessageSquare className="absolute left-3 top-4 w-5 h-5 text-slate-400" />
          <textarea
            placeholder="Tell us about your project..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={4}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cyan-500 focus:ring-cyan-500/30 focus:outline-none transition-colors resize-none"
            required
          />
        </motion.div>

        <motion.button
          variants={itemVariants}
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          {isLoading ? "Sending Request..." : "Get My Free Quote"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default QuoteRequestForm;
