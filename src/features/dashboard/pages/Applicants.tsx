// src/pages/dashboard/Applicants.tsx
import { useState, useEffect } from "react";
import type { Applicant } from "./types";
import { Eye, CheckCircle, XCircle } from "lucide-react";

// --- Fungsi Simulasi ---
const roles: Applicant["role"][] = [
  "Frontend Developer",
  "Backend Developer",
  "UI/UX Designer",
  "Project Manager",
];
const names = [
  "John Doe",
  "Jane Smith",
  "Alex Johnson",
  "Emily Brown",
  "Michael Davis",
  "Sarah Wilson",
];

const generateRandomApplicant = (): Applicant => {
  const name = names[Math.floor(Math.random() * names.length)];
  return {
    id: crypto.randomUUID(),
    name,
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random`,
    email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
    role: roles[Math.floor(Math.random() * roles.length)],
    appliedAt: new Date(),
    status: "Pending",
    coverLetter:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  };
};

const initialApplicants: Applicant[] = Array.from({ length: 5 }).map(
  generateRandomApplicant
);

// --- Komponen Utama ---
const Applicants = () => {
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);

  useEffect(() => {
    // Simulasi pelamar baru masuk setiap 10 detik
    const intervalId = setInterval(() => {
      const newApplicant = generateRandomApplicant();
      setApplicants((prevApplicants) => [newApplicant, ...prevApplicants]);
    }, 10000); // Setiap 10 detik

    return () => clearInterval(intervalId);
  }, []);

  const statusStyles: Record<Applicant["status"], string> = {
    Pending: "bg-amber-500/20 text-amber-400",
    Reviewed: "bg-sky-500/20 text-sky-400",
    Accepted:
      "bg-premium-champagne-gold-500/20 text-premium-champagne-gold-400",
    Rejected: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="p-2 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Inbox: Applicants</h1>
        <div className="flex items-center gap-2 text-premium-champagne-gold-400">
          <div className="w-3 h-3 bg-premium-champagne-gold-400 rounded-full animate-pulse"></div>
          <span>Real-time updates enabled</span>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs text-slate-400 uppercase">
              <tr>
                <th scope="col" className="py-3 px-6">
                  Applicant
                </th>
                <th scope="col" className="py-3 px-6">
                  Role
                </th>
                <th scope="col" className="py-3 px-6">
                  Date Applied
                </th>
                <th scope="col" className="py-3 px-6">
                  Status
                </th>
                <th scope="col" className="py-3 px-6 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((applicant) => (
                <tr
                  key={applicant.id}
                  className="border-b border-slate-700 hover:bg-slate-700/20"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <img
                        className="w-10 h-10 rounded-full"
                        src={applicant.avatarUrl}
                        alt={`${applicant.name} avatar`}
                      />
                      <div>
                        <div className="font-medium text-white">
                          {applicant.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {applicant.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">{applicant.role}</td>
                  <td className="py-4 px-6">
                    {applicant.appliedAt.toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        statusStyles[applicant.status]
                      }`}
                    >
                      {applicant.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-slate-400 hover:text-premium-champagne-gold-400 hover:bg-slate-700 rounded-full transition-colors"
                        title="Accept"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-full transition-colors"
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Applicants;
