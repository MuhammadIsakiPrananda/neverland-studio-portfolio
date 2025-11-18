import { motion } from 'framer-motion';
import { Plus, FileText, Download, Upload } from 'lucide-react';

interface QuickActionsProps {
  onNewProject?: () => void;
}

const QuickActions = ({ onNewProject }: QuickActionsProps) => {
  const actions = [
    {
      icon: Plus,
      label: 'New Project',
      color: 'from-teal-500 to-cyan-500',
      onClick: onNewProject,
      testId: 'quick-action-new-project',
    },
    {
      icon: FileText,
      label: 'Generate Report',
      color: 'from-purple-500 to-pink-500',
      onClick: () => console.log('Generate Report'),
      testId: 'quick-action-report',
    },
    {
      icon: Download,
      label: 'Export Data',
      color: 'from-orange-500 to-red-500',
      onClick: () => console.log('Export Data'),
      testId: 'quick-action-export',
    },
    {
      icon: Upload,
      label: 'Import Data',
      color: 'from-blue-500 to-indigo-500',
      onClick: () => console.log('Import Data'),
      testId: 'quick-action-import',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-slate-900/50 border border-slate-800 rounded-xl p-6"
      data-testid="quick-actions"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Quick Actions</h3>
        <p className="text-slate-400 text-sm">Shortcuts to common tasks</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.05 }}
            onClick={action.onClick}
            data-testid={action.testId}
            className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-all group border border-slate-700/50 hover:border-slate-600"
          >
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickActions;