import type { Theme } from '../../types';
import BaseModal from './shared/BaseModal';

interface PrivacyPolicyModalProps {
  theme: Theme;
  onClose: () => void;
}

export default function PrivacyPolicyModal({ theme, onClose }: PrivacyPolicyModalProps) {

  return (
    <BaseModal
      theme={theme}
      onClose={onClose}
      title="Privacy Policy"
      subtitle="How we collect, use, and protect your information"
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
              1. Information We Collect
            </h3>
            <p className="text-sm leading-relaxed mb-2 text-slate-300">
              We collect information you provide directly to us, including:
            </p>
            <ul className="text-sm space-y-1 ml-4 list-disc text-slate-400">
              <li>Name and contact information (email address)</li>
              <li>Account credentials (username and password)</li>
              <li>Profile information and portfolio content</li>
              <li>Communications with us</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-blue-400">
              2. How We Use Your Information
            </h3>
            <p className="text-sm leading-relaxed mb-2 text-slate-300">
              We use the information we collect to:
            </p>
            <ul className="text-sm space-y-1 ml-4 list-disc text-slate-400">
              <li>Provide, maintain, and improve our services</li>
              <li>Process and complete transactions</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Protect against fraudulent or illegal activity</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-blue-400">
              3. Information Sharing
            </h3>
            <p className="text-sm leading-relaxed text-slate-300">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances: 
              with your consent, to comply with legal obligations, or to protect our rights and safety.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-blue-400">
              4. Data Security
            </h3>
            <p className="text-sm leading-relaxed text-slate-300">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, 
              alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-blue-400">
              5. Cookies and Tracking
            </h3>
            <p className="text-sm leading-relaxed text-slate-300">
              We use cookies and similar tracking technologies to track activity on our service and hold certain information. 
              You can instruct your browser to refuse all cookies or indicate when a cookie is being sent.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-blue-400">
              6. Your Rights
            </h3>
            <p className="text-sm leading-relaxed mb-2 text-slate-300">
              You have the right to:
            </p>
            <ul className="text-sm space-y-1 ml-4 list-disc text-slate-400">
              <li>Access and receive a copy of your personal data</li>
              <li>Rectify inaccurate personal information</li>
              <li>Request deletion of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-blue-400">
              7. Contact Us
            </h3>
            <p className="text-sm leading-relaxed text-slate-300">
              If you have any questions about this Privacy Policy, please contact us at privacy@neverlandstudio.com
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
