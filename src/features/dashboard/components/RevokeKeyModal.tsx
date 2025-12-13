import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader, Trash2 } from 'lucide-react';

interface RevokeKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isRevoking: boolean;
  keyName?: string;
}

export const RevokeKeyModal: React.FC<RevokeKeyModalProps> = ({ isOpen, onClose, onConfirm, isRevoking, keyName }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[101] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full max-w-md bg-slate-950 rounded-2xl shadow-2xl shadow-black border border-white/10 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/10">
              <AlertTriangle className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Revoke API Key?</h2>
              <p className="text-slate-400 text-sm mt-1">This will permanently delete the key <strong className="text-white">{keyName}</strong>. This action cannot be undone.</p>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={onClose} disabled={isRevoking} className="py-2.5 px-5 rounded-xl bg-slate-950/50 border border-white/10 hover:bg-white/5 transition-colors text-sm font-semibold disabled:opacity-50 text-slate-300">Cancel</button>
            <button onClick={onConfirm} disabled={isRevoking} className="flex items-center gap-2 py-2.5 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all text-sm font-semibold text-white disabled:opacity-50 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40">
              {isRevoking ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {isRevoking ? 'Revoking...' : 'Revoke Key'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};