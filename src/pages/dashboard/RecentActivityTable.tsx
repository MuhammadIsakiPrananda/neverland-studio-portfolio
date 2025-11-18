import { motion } from 'framer-motion';
import { FiMessageSquare, FiUsers, FiBriefcase } from 'react-icons/fi';

type Submission = {
  id: string;
  name: string;
  type: 'Review' | 'Applicant' | 'Collaboration';
  timestamp: string;
  summary: string;
};

const submissions: Submission[] = [
  { id: 'REV001', name: 'Jane Doe', type: 'Review', timestamp: '2 min ago', summary: 'Gave 5 stars for "Project X"' },
  { id: 'APP001', name: 'John Smith', type: 'Applicant', timestamp: '15 min ago', summary: 'Applied for Frontend Developer' },
  { id: 'COL001', name: 'Innovate Corp', type: 'Collaboration', timestamp: '1 hour ago', summary: 'Partnership inquiry' },
  { id: 'REV002', name: 'Peter Jones', type: 'Review', timestamp: '3 hours ago', summary: 'Reported a bug on the contact page' },
  { id: 'APP002', name: 'Emily White', type: 'Applicant', timestamp: '1 day ago', summary: 'Applied for UI/UX Designer' },
];

const typeDetails = {
  Review: { icon: FiMessageSquare, color: 'text-sky-400' },
  Applicant: { icon: FiUsers, color: 'text-emerald-400' },
  Collaboration: { icon: FiBriefcase, color: 'text-amber-400' },
};

const RecentActivityTable = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }} // Adjusted delay
      transition={{ delay: 0.2, duration: 0.5 }}
      className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl col-span-1 lg:col-span-2"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Latest Submissions</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-400 uppercase">
            <tr>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Name / Subject</th>
              <th className="py-3 px-4">Summary</th>
              <th className="py-3 px-4">Time</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => {
              const details = typeDetails[submission.type];
              const Icon = details.icon;
              return (
                <tr key={submission.id} className="border-t border-slate-700 hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className={`flex items-center gap-2 font-medium ${details.color}`}>
                      <Icon className="w-4 h-4" />
                      <span>{submission.type}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium text-white">{submission.name}</td>
                  <td className="py-4 px-4 text-slate-300">{submission.summary}</td>
                  <td className="py-4 px-4 text-slate-400">{submission.timestamp}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default RecentActivityTable;