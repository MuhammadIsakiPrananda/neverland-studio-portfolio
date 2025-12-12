import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Building,
  MessageSquare,
  Send,
  Loader,
  AlertCircle,
  Calendar,
  Clock,
  BookCopy,
} from "lucide-react";
import { useNotification } from "@/shared/components";

interface ConsultationFormProps {
  onClose: () => void;
}

const consultationTopics = [
  "Technical Strategy",
  "UI/UX Design Audit",
  "Project Scoping & Planning",
  "Digital Marketing Strategy",
  "Mobile App Consultation",
  "Other",
];

const ConsultationForm: React.FC<ConsultationFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    topic: "",
    otherTopic: "", // State untuk topik kustom
    date: "",
    time: "",
    details: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotification();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validasi baru: jika topik adalah 'Other', pastikan otherTopic tidak kosong
    const isOtherTopicInvalid =
      formData.topic === "Other" && !formData.otherTopic.trim();

    if (
      !formData.name ||
      !formData.email ||
      !formData.topic ||
      !formData.date ||
      !formData.time ||
      isOtherTopicInvalid
    ) {
      setError("Please fill all required fields.");
      return;
    }
    setError(null);
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      addNotification(
        "Consultation Scheduled!",
        "Our team will confirm your schedule via email shortly.",
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
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.h2
        variants={itemVariants}
        className="text-2xl font-bold text-white mb-6 text-center"
      >
        Schedule a Consultation
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
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cyan-500 focus:ring-cyan-500/30 focus:outline-none transition-colors"
              required
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cyan-500 focus:ring-cyan-500/30 focus:outline-none transition-colors"
              required
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="relative">
          <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            name="company"
            placeholder="Company Name (Optional)"
            value={formData.company}
            onChange={handleChange}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cyan-500 focus:ring-cyan-500/30 focus:outline-none transition-colors"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="relative">
          <BookCopy className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
          <select
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cyan-500 focus:ring-cyan-500/30 focus:outline-none transition-colors appearance-none"
            required
          >
            <option value="" disabled>
              Select Consultation Topic
            </option>
            {consultationTopics.map((s) => (
              <option key={s} value={s} className="bg-slate-900">
                {s}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Kolom input baru yang muncul saat "Other" dipilih */}
        <AnimatePresence>
          {formData.topic === "Other" && (
            <motion.div
              key="other-topic-input"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: "1rem" }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative overflow-hidden"
            >
              <div className="relative">
                <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="otherTopic"
                  placeholder="Please specify your topic"
                  value={formData.otherTopic}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cyan-500 focus:ring-cyan-500/30 focus:outline-none transition-colors"
                  required
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cyan-500 focus:ring-cyan-500/30 focus:outline-none transition-colors"
              required
            />
          </div>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cyan-500 focus:ring-cyan-500/30 focus:outline-none transition-colors"
              required
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="relative">
          <MessageSquare className="absolute left-3 top-4 w-5 h-5 text-slate-400" />
          <textarea
            name="details"
            placeholder="Additional details or questions... (Optional)"
            value={formData.details}
            onChange={handleChange}
            rows={3}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cyan-500 focus:ring-cyan-500/30 focus:outline-none transition-colors resize-none"
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
          {isLoading ? "Submitting..." : "Schedule Now"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ConsultationForm;
