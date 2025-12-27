import type { Theme } from '../../types';
import BaseModal from './shared/BaseModal';

interface CookiePolicyModalProps {
  theme: Theme;
  onClose: () => void;
}

export default function CookiePolicyModal({ theme, onClose }: CookiePolicyModalProps) {

  return (
    <BaseModal
      theme={theme}
      onClose={onClose}
      title="Cookie Policy"
      subtitle="How we use cookies to improve your experience"
      showPattern={false}
    >
      <div className="space-y-6">
        {/* Introduction */}
        <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <p className="text-sm text-slate-400">
            Last updated: December 23, 2025
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-3 text-blue-400">
              1. What Are Cookies
            </h3>
            <p className="text-sm leading-relaxed text-slate-300">
              Cookies are small text files that are placed on your device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-blue-400">
              2. Types of Cookies We Use
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold mb-1 text-blue-300">
                  Essential Cookies
                </h4>
                <p className="text-sm leading-relaxed text-slate-300">
                  These cookies are necessary for the website to function properly. They enable basic features like page navigation and access to secure areas.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1 text-blue-300">
                  Performance Cookies
                </h4>
                <p className="text-sm leading-relaxed text-slate-300">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1 text-blue-300">
                  Functional Cookies
                </h4>
                <p className="text-sm leading-relaxed text-slate-300">
                  These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-blue-400">
              3. How We Use Cookies
            </h3>
            <ul className="text-sm space-y-1 ml-4 list-disc text-slate-400">
              <li>Remember your login information and preferences</li>
              <li>Analyze site traffic and usage patterns</li>
              <li>Personalize content and advertisements</li>
              <li>Improve website performance and user experience</li>
              <li>Enable social media features</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-blue-400">
              4. Managing Cookies
            </h3>
            <p className="text-sm leading-relaxed mb-2 text-slate-300">
              You can control and manage cookies in various ways:
            </p>
            <ul className="text-sm space-y-1 ml-4 list-disc text-slate-400">
              <li>Browser settings: Most browsers allow you to refuse or delete cookies</li>
              <li>Third-party tools: Use privacy-focused browser extensions</li>
              <li>Opt-out links: Many advertising networks provide opt-out options</li>
            </ul>
            <p className="text-sm leading-relaxed mt-2 text-slate-300">
              Please note that disabling cookies may affect the functionality of our website.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-blue-400">
              5. Third-Party Cookies
            </h3>
            <p className="text-sm leading-relaxed text-slate-300">
              We may use third-party services (like Google Analytics) that also set cookies. These cookies are governed by the respective third parties' privacy policies.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-blue-400">
              6. Contact Us
            </h3>
            <p className="text-sm leading-relaxed text-slate-300">
              If you have any questions about our use of cookies, please contact us at arlianto032@gmail.com
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
