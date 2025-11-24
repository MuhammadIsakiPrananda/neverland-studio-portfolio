import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader, Trash2 } from 'lucide-react';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  const [confirmationInput, setConfirmationInput] = useState('');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full max-w-md bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Are you absolutely sure?</h2>
              <p className="text-slate-400 text-sm">This action cannot be undone.</p>
            </div>
          </div>
          <p className="text-slate-300 my-4">To confirm, please type <strong className="text-red-400">DELETE</strong> in the box below.</p>
          <input type="text" value={confirmationInput} onChange={(e) => setConfirmationInput(e.target.value)} className="w-full bg-gray-800/70 border border-gray-700 rounded-lg px-3 py-2 text-center text-white focus:border-red-500 focus:ring-red-500/50 outline-none" />
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={onClose} disabled={isDeleting} className="py-2 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-sm font-semibold disabled:opacity-50">Cancel</button>
            <button onClick={onConfirm} disabled={confirmationInput !== 'DELETE' || isDeleting} className="flex items-center gap-2 py-2 px-4 rounded-lg bg-red-600 hover:bg-red-500 transition-colors text-sm font-semibold text-white disabled:opacity-50 disabled:bg-red-600/50">
              {isDeleting ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};