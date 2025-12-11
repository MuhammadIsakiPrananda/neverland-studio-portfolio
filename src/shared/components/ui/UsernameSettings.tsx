import React from "react";
import { useSecurityState } from "@/shared/components/ui/useSecurityState";

// Komponen UI dasar ini diasumsikan sudah ada dan di-style dengan Tailwind CSS.
// Anda bisa menggantinya dengan komponen dari library UI yang Anda gunakan.
const Card = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => (
  <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      {title}
    </h3>
    {children}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
  />
);

const Button = ({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {children}
  </button>
);

export const UsernameSettings = () => {
  const {
    username,
    newUsername,
    usernameError,
    usernameChangeInfo,
    handleUsernameInputChange,
    handleUsernameChangeSubmit,
  } = useSecurityState();

  const changesLeft = 3 - usernameChangeInfo.count;

  return (
    <Card title="Ubah Nama Pengguna">
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Nama pengguna Anda saat ini:{" "}
          <strong className="text-gray-900 dark:text-white">{username}</strong>
        </p>
        <form onSubmit={handleUsernameChangeSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="newUsername"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
            >
              Nama Pengguna Baru
            </label>
            <Input
              type="text"
              id="newUsername"
              name="newUsername"
              value={newUsername}
              onChange={handleUsernameInputChange}
              placeholder="Masukkan nama pengguna baru"
              aria-describedby="username-help"
            />
            {usernameError && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {usernameError}
              </p>
            )}
            <p
              className="mt-2 text-sm text-gray-500 dark:text-gray-400"
              id="username-help"
            >
              Anda dapat mengubah nama pengguna{" "}
              {changesLeft < 0 ? 0 : changesLeft} kali lagi bulan ini.
            </p>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={!newUsername || changesLeft <= 0}>
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};
