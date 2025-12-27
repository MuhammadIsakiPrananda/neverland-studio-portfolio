import type { Theme } from '../../types';
import BaseModal from './shared/BaseModal';

interface TermsModalProps {
  theme: Theme;
  onClose: () => void;
}

export default function TermsModal({ theme, onClose }: TermsModalProps) {

  return (
    <BaseModal
      theme={theme}
      onClose={onClose}
      title="Terms & Conditions"
      subtitle="Please read our terms and conditions carefully"
      showPattern={false}
    >
      <div className="space-y-6">
        {/* Introduction */}
        <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <p className="text-sm text-slate-400">
            Last updated: December 22, 2025
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-3 text-blue-400">
              1. Agreement to Terms
            </h3>
            <p className="text-sm leading-relaxed text-slate-300">
              By accessing and using Neverland Studio's portfolio platform, you agree to be bound by these Terms & Conditions. 
              If you disagree with any part of these terms, you may not access our services.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-blue-400">
              2. Use License
            </h3>
            <p className="text-sm leading-relaxed mb-2 text-slate-300">
              Permission is granted to temporarily access the materials on Neverland Studio's platform for personal, non-commercial use only. 
              This license shall automatically terminate if you violate any of these restrictions.
            </p>
            <ul className="text-sm space-y-1 ml-4 list-disc text-slate-400">
              <li>Modify or copy the materials</li>
              <li>Use the materials for commercial purposes</li>
              <li>Attempt to reverse engineer any software</li>
              <li>Remove any copyright or proprietary notations</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-blue-400">
              3. User Account
            </h3>
            <p className="text-sm leading-relaxed text-slate-300">
              You are responsible for maintaining the confidentiality of your account and password. 
              You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-blue-400">
              4. Intellectual Property
            </h3>
            <p className="text-sm leading-relaxed text-slate-300">
              All content, including but not limited to text, graphics, logos, and software, is the property of Neverland Studio 
              and is protected by international copyright laws.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-blue-400">
              5. Limitation of Liability
            </h3>
            <p className="text-sm leading-relaxed text-slate-300">
              Neverland Studio shall not be liable for any damages arising from the use or inability to use our services, 
              even if we have been notified of the possibility of such damages.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-blue-400">
              6. Changes to Terms
            </h3>
            <p className="text-sm leading-relaxed text-slate-300">
              We reserve the right to modify these terms at any time. We will notify users of any material changes 
              via email or through our platform.
            </p>
          </section>
        </div>

        {/* Accept Button */}
        <div className="pt-4 border-t border-slate-700/50">
          <button
            onClick={onClose}
            className="w-full py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all duration-200 active:scale-95"
          >
            I Understand
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
