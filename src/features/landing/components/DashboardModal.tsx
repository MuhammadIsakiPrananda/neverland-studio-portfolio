import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  X,
  User,
  Mail,
  Save,
  Loader,
  Shield,
  KeyRound,
  Smartphone,
  QrCode,
} from "lucide-react";
import {
  useState,
  useRef,
  useEffect,
  type ReactNode,
  type FormEvent,
} from "react";
import { useNotification } from "@/shared/components";

type UserProfile = {
  name: string;
  username: string;
  email: string;
  avatar: string | null;
};

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

type Tab = "profile" | "security";

const DashboardModal: React.FC<DashboardModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onProfileUpdate,
}) => {
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [username, setUsername] = useState(userProfile.username);
  const [avatar, setAvatar] = useState<string | null>(userProfile.avatar);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [is2faEnabled, setIs2faEnabled] = useState(false); // Mock state

  const { addNotification } = useNotification();

  useEffect(() => {
    setName(userProfile.name);
    setEmail(userProfile.email);
    setUsername(userProfile.username);
    setAvatar(userProfile.avatar);
  }, [userProfile, isOpen]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onProfileUpdate({ name, email, username, avatar });
      setIsLoading(false);
      addNotification(
        "Profile Updated",
        "Your profile has been successfully updated.",
        "success"
      );
      onClose();
    }, 1500);
  };

  const handleEnable2FA = () => {
    setIsSettingUp2FA(true);
  };

  const handleVerify2FA = (e: FormEvent) => {
    e.preventDefault();
    // Mock verification
    addNotification(
      "2FA Enabled",
      "Two-factor authentication has been successfully enabled.",
      "success"
    );
    setIs2faEnabled(true);
    setIsSettingUp2FA(false);
  };

  const backdropVariants: Variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants: Variants = {
    hidden: { y: "100vh", opacity: 0 },
    visible: {
      y: "0",
      opacity: 1,
      transition: { type: "spring", damping: 25, stiffness: 200 },
    },
    exit: { y: "100vh", opacity: 0, transition: { duration: 0.3 } },
  };

  const contentVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2, ease: "easeIn" } },
  };

  const TabButton = ({
    tab,
    currentTab,
    setTab,
    icon,
    children,
  }: {
    tab: Tab;
    currentTab: Tab;
    setTab: (tab: Tab) => void;
    icon: ReactNode;
    children: ReactNode;
  }) => (
    <button
      onClick={() => setTab(tab)}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        currentTab === tab
          ? "bg-amber-500/10 text-white"
          : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
      }`}
    >
      <span className={currentTab === tab ? "text-amber-400" : ""}>{icon}</span>
      {children}
    </button>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose} // This should close the modal
        >
          <motion.div
            className="bg-slate-900/80 border border-slate-700/50 rounded-2xl shadow-2xl shadow-cyan-900/20 w-full max-w-4xl h-[70vh] flex relative overflow-hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-20"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Sidebar */}
            <div className="w-1/4 bg-slate-900/50 border-r border-slate-800 p-6 flex flex-col">
              <h2 className="text-xl font-bold text-white mb-8">Settings</h2>
              <div className="space-y-2">
                <TabButton
                  tab="profile"
                  currentTab={activeTab}
                  setTab={setActiveTab}
                  icon={<User className="w-5 h-5" />}
                >
                  Profile
                </TabButton>
                <TabButton
                  tab="security"
                  currentTab={activeTab}
                  setTab={setActiveTab}
                  icon={<Shield className="w-5 h-5" />}
                >
                  Security
                </TabButton>
              </div>
              <div className="mt-auto text-xs text-slate-500" />
            </div>

            {/* Content */}
            <div className="w-3/4 p-8 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {activeTab === "profile" && (
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-6">
                        Public Profile
                      </h3>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex items-center gap-6">
                          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-slate-600 flex-shrink-0">
                            {avatar ? (
                              <img
                                src={avatar}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                                <User className="w-12 h-12 text-slate-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleAvatarChange}
                              accept="image/*"
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
                            >
                              Change Photo
                            </button>
                            <p className="text-xs text-slate-500 mt-2">
                              JPG, GIF or PNG. 1MB max.
                            </p>
                          </div>
                        </div>
                        <div className="relative">
                          <label className="block text-sm font-medium mb-2 text-slate-300">
                            Full Name
                          </label>
                          <User className="absolute left-3 bottom-3.5 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-amber-500 focus:ring-amber-500/30 focus:outline-none transition-colors"
                            required
                          />
                        </div>
                        <div className="relative">
                          <label className="block text-sm font-medium mb-2 text-slate-300">
                            Email Address
                          </label>
                          <Mail className="absolute left-3 bottom-3.5 w-5 h-5 text-slate-400" />
                          <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-amber-500 focus:ring-amber-500/30 focus:outline-none transition-colors"
                            required
                          />
                        </div>
                        <div className="flex justify-end pt-4 border-t border-slate-800">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition-all transform hover:scale-105 disabled:opacity-50"
                          >
                            {isLoading ? (
                              <Loader className="w-5 h-5 animate-spin" />
                            ) : (
                              <Save className="w-5 h-5" />
                            )}
                            {isLoading ? "Saving..." : "Save Changes"}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                  {activeTab === "security" && (
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-6">
                        Security Settings
                      </h3>
                      <div className="space-y-8">
                        {/* Password Section */}
                        <div>
                          <h4 className="text-lg font-semibold text-slate-200 mb-4">
                            Password
                          </h4>
                          <form className="space-y-4 p-6 bg-slate-800/30 rounded-lg border border-slate-700/50">
                            <div className="relative">
                              <label className="block text-sm font-medium mb-2 text-slate-300">
                                Current Password
                              </label>
                              <KeyRound className="absolute left-3 bottom-3.5 w-5 h-5 text-slate-400" />
                              <input
                                type="password"
                                placeholder="Enter current password"
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-amber-500 focus:ring-amber-500/30 focus:outline-none transition-colors"
                              />
                            </div>
                            <div className="relative">
                              <label className="block text-sm font-medium mb-2 text-slate-300">
                                New Password
                              </label>
                              <KeyRound className="absolute left-3 bottom-3.5 w-5 h-5 text-slate-400" />
                              <input
                                type="password"
                                placeholder="Enter new password"
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-amber-500 focus:ring-amber-500/30 focus:outline-none transition-colors"
                              />
                            </div>
                            <div className="flex justify-end pt-2">
                              <button
                                type="submit"
                                className="bg-amber-600 text-white px-5 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-amber-500 transition-colors disabled:opacity-50 text-sm"
                              >
                                Update Password
                              </button>
                            </div>
                          </form>
                        </div>

                        {/* 2FA Section */}
                        <div>
                          <h4 className="text-lg font-semibold text-slate-200 mb-4">
                            Two-Factor Authentication
                          </h4>
                          <div className="p-6 bg-slate-800/30 rounded-lg border border-slate-700/50">
                            {!isSettingUp2FA ? (
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-white">
                                    Status:{" "}
                                    <span
                                      className={
                                        is2faEnabled
                                          ? "text-green-400"
                                          : "text-red-400"
                                      }
                                    >
                                      {is2faEnabled ? "Enabled" : "Disabled"}
                                    </span>
                                  </p>
                                  <p className="text-sm text-slate-400">
                                    Add an extra layer of security to your
                                    account.
                                  </p>
                                </div>
                                {is2faEnabled ? (
                                  <button
                                    onClick={() => setIs2faEnabled(false)}
                                    className="bg-red-500/20 text-red-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-500/30 transition-colors"
                                  >
                                    Disable
                                  </button>
                                ) : (
                                  <button
                                    onClick={handleEnable2FA}
                                    className="bg-amber-500/10 text-amber-300 border border-amber-500/50 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-500/20 transition-colors"
                                  >
                                    Enable
                                  </button>
                                )}
                              </div>
                            ) : (
                              <AnimatePresence>
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                >
                                  <p className="text-sm text-slate-300 mb-4">
                                    Scan the QR code with your authenticator app
                                    (e.g., Google Authenticator, Authy).
                                  </p>
                                  <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <div className="p-3 bg-white rounded-lg">
                                      <QrCode className="w-32 h-32 text-black" />
                                    </div>
                                    <form
                                      onSubmit={handleVerify2FA}
                                      className="space-y-4 w-full"
                                    >
                                      <p className="text-sm text-slate-300">
                                        Then, enter the 6-digit code from your
                                        app to verify.
                                      </p>
                                      <div className="relative">
                                        <Smartphone className="absolute left-3 bottom-3.5 w-5 h-5 text-slate-400" />
                                        <input
                                          type="text"
                                          placeholder="6-digit code"
                                          value={twoFactorCode}
                                          onChange={(e) =>
                                            setTwoFactorCode(e.target.value)
                                          }
                                          maxLength={6}
                                          className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white tracking-[0.5em] text-center focus:border-amber-500 focus:ring-amber-500/30 focus:outline-none transition-colors"
                                        />
                                      </div>
                                      <div className="flex gap-2">
                                        <button
                                          type="submit"
                                          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 rounded-lg font-semibold"
                                        >
                                          Verify
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setIsSettingUp2FA(false)
                                          }
                                          className="w-full bg-slate-700 text-slate-300 py-2 rounded-lg font-semibold hover:bg-slate-600"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </form>
                                  </div>
                                </motion.div>
                              </AnimatePresence>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DashboardModal;
