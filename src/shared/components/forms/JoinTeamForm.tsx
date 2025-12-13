import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Link as LinkIcon,
  Briefcase,
  MessageSquare,
  Paperclip,
  Send,
  Loader,
  AlertCircle,
} from "lucide-react";
import { useNotification } from "../ui/useNotification";

interface JoinTeamFormProps {
  onClose: () => void;
}

const positions = [
  "Frontend Developer",
  "Backend Developer",
  "Full-stack Developer",
  "UI/UX Designer",
  "Project Manager",
  "Digital Marketer",
  "Other",
];

const JoinTeamForm: React.FC<JoinTeamFormProps> = ({ onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [position, setPosition] = useState("");
  const [otherPosition, setOtherPosition] = useState("");
  const [message, setMessage] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotification();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("File size should not exceed 5MB.");
        setResume(null);
      } else {
        setResume(file);
        setError(null);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !name ||
      !email ||
      !position ||
      (position === "Other" && !otherPosition) ||
      !message ||
      !resume
    ) {
      setError("Please fill all required fields and upload your resume.");
      return;
    }
    setError(null);
    setIsLoading(true);

    // Simulate API call for form submission with file upload
    setTimeout(() => {
      setIsLoading(false);
      addNotification(
        "Application Submitted!",
        "Thank you for your interest. We will get back to you soon.",
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
        Join Our Team
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
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-colors"
              required
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-colors"
              required
            />
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="url"
              placeholder="Portfolio/LinkedIn URL"
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-colors"
              required
            />
          </div>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-colors appearance-none"
             required
            >
              <option value="" disabled>
                Position Applying For
              </option>
              {positions.map((p) => (
                <option key={p} value={p} className="bg-zinc-900">
                  {p}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        <AnimatePresence>
          {position === "Other" && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="relative"
            >
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                placeholder="Please specify position"
                value={otherPosition}
                onChange={(e) => setOtherPosition(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-colors"
                required
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={itemVariants} className="relative">
          <MessageSquare className="absolute left-3 top-4 w-5 h-5 text-zinc-500" />
          <textarea
            placeholder="Why do you want to join us?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-colors resize-none"
            required
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium mb-2 text-zinc-400">
            Upload Resume/CV (PDF, max 5MB)
          </label>
          <div className="relative border-2 border-dashed border-zinc-800 rounded-lg p-6 text-center hover:border-amber-500 transition-colors bg-zinc-900/30">
             <Paperclip className="mx-auto h-8 w-8 text-zinc-500" />
            <p className="mt-2 text-sm text-zinc-400">
              {resume ? resume.name : "Drag and drop or click to upload"}
            </p>
            <input
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".pdf"
            />
          </div>
        </motion.div>

        <motion.button
          variants={itemVariants}
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/40 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          {isLoading ? "Submitting..." : "Submit Application"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default JoinTeamForm;
