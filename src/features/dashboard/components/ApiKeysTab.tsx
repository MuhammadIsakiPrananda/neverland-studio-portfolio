import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader,
  KeyRound,
  Copy,
  Trash2,
  PlusCircle,
  Check,
} from "lucide-react";
import { SettingsCard, useNotification } from "@/shared/components";
import { RevokeKeyModal } from "./RevokeKeyModal";

interface ApiKey {
  id: string;
  name: string;
  token: string;
  created: string;
  lastUsed: string;
}

const initialApiKeys = [
  {
    id: "key_1",
    name: "My Main App",
    token: "live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    created: "May 15, 2024",
    lastUsed: "June 1, 2024",
  },
  {
    id: "key_2",
    name: "Staging Environment",
    token: "test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    created: "April 20, 2024",
    lastUsed: "May 28, 2024",
  },
];

export const ApiKeysTabContent: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<ApiKey | null>(
    null
  );
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [keyToRevoke, setKeyToRevoke] = useState<ApiKey | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);
  const { addNotification } = useNotification();

  const generateRandomToken = () =>
    `sk_live_${[...Array(32)]
      .map(() => Math.random().toString(36)[2])
      .join("")}`;

  const handleGenerateKey = () => {
    setIsGenerating(true);
    setNewlyGeneratedKey(null); // Reset previous new key
    setTimeout(() => {
      const token = generateRandomToken();
      const newKey = {
        id: `key_${Date.now()}`,
        name: "New Key (Untitled)",
        token: token,
        created: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        lastUsed: "Never",
      };
      setApiKeys((prev) => [newKey, ...prev]);
      setNewlyGeneratedKey(newKey);
      setIsGenerating(false);
      addNotification(
        "API Key Generated",
        "Your new key has been created. Copy it now, you won't see it again!",
        "success"
      );
    }, 1500);
  };

  const handleRevokeClick = (key: ApiKey) => {
    setKeyToRevoke(key);
  };

  const handleConfirmRevoke = () => {
    if (!keyToRevoke) return;
    setIsRevoking(true);
    setTimeout(() => {
      setApiKeys((prev) => prev.filter((key) => key.id !== keyToRevoke.id));
      addNotification(
        "API Key Revoked",
        `The key "${keyToRevoke.name}" has been permanently deleted.`,
        "warning"
      );
      setIsRevoking(false);
      setKeyToRevoke(null);
    }, 1000);
  };

  const handleCopy = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(keyId);
    addNotification("Copied to Clipboard", "API key has been copied.", "info");
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const getMaskedToken = (token: string) => {
    return `${token.substring(0, 8)}************************${token.substring(
      token.length - 4
    )}`;
  };

  return (
    <>
      <SettingsCard
        title="API Keys"
        description="Manage your API keys for integrations. Keep them secret, keep them safe!"
        headerActions={
          <button
            onClick={handleGenerateKey}
            disabled={isGenerating}
            className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <PlusCircle className="w-4 h-4" />
            )}
            <span>{isGenerating ? "Generating..." : "Generate New Key"}</span>
          </button>
        }
      >
        <AnimatePresence>
          {newlyGeneratedKey && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, padding: 0, margin: 0 }}
              className="bg-amber-900/50 border border-amber-500/30 rounded-lg p-4 mb-6"
            >
              <h4 className="text-md font-bold text-amber-300">
                New API Key Generated
              </h4>
              <p className="text-sm text-amber-400/80 mt-1">
                Please copy this key and store it securely. You will not be able
                to see it again.
              </p>
              <div className="relative mt-3">
                <input
                  type="text"
                  readOnly
                  value={newlyGeneratedKey.token}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-3 pr-10 py-2 text-white font-mono text-sm"
                />
                <button
                  onClick={() =>
                    handleCopy(newlyGeneratedKey.token, newlyGeneratedKey.id)
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                >
                  {copiedKeyId === newlyGeneratedKey.id ? (
                    <Check className="w-5 h-5 text-amber-400" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <ul className="divide-y divide-slate-800 -mx-6">
          <AnimatePresence initial={false}>
            {apiKeys.map((key) => (
              <motion.li
                key={key.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
                className="px-6 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex items-center gap-4 py-4">
                  <div className="p-2 bg-slate-700/50 rounded-full">
                    <KeyRound className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{key.name}</p>
                    <p className="text-sm text-slate-400 font-mono">
                      {getMaskedToken(key.token)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Created: {key.created} &middot; Last used: {key.lastUsed}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleCopy(key.token, key.id)}
                    className="p-2 text-slate-400 hover:text-amber-400 transition-colors"
                    title="Copy Key"
                  >
                    {copiedKeyId === key.id ? (
                      <Check className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleRevokeClick(key)}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                    title="Revoke Key"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </SettingsCard>

      <RevokeKeyModal
        isOpen={!!keyToRevoke}
        onClose={() => setKeyToRevoke(null)}
        onConfirm={handleConfirmRevoke}
        isRevoking={isRevoking}
        keyName={keyToRevoke?.name}
      />
    </>
  );
};
