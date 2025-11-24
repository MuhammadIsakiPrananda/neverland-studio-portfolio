// src/pages/dashboard/Collaborations.tsx
import { useState, useEffect } from 'react';
import type { Collaboration } from './types';
import { Eye, Phone, CheckSquare } from 'lucide-react';

// --- Fungsi Simulasi ---
const projectTypes: Collaboration['projectType'][] = ['Web Development', 'Mobile App', 'Branding', 'Consultation'];
const companies = ['Innovate Inc.', 'Tech Solutions', 'Creative Minds', 'Future Systems', 'NextGen Apps'];
const contacts = ['Bob Johnson', 'Alice Williams', 'Charlie Brown', 'Diana Miller', 'Ethan Jones'];

const generateRandomCollaboration = (): Collaboration => {
  const companyName = companies[Math.floor(Math.random() * companies.length)];
  const contactPerson = contacts[Math.floor(Math.random() * contacts.length)];
  return {
    id: crypto.randomUUID(),
    companyName,
    contactPerson,
    email: `${contactPerson.toLowerCase().replace(' ', '.')}@${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    projectType: projectTypes[Math.floor(Math.random() * projectTypes.length)],
    submittedAt: new Date(),
    status: 'New',
    message: 'We are interested in discussing a potential project. Please let us know your availability for a brief call.',
  };
};

const initialCollaborations: Collaboration[] = Array.from({ length: 4 }).map(generateRandomCollaboration);

// --- Komponen Utama ---
const Collaborations = () => {
  const [collaborations, setCollaborations] = useState<Collaboration[]>(initialCollaborations);

  useEffect(() => {
    // Simulasi permintaan kolaborasi baru masuk setiap 15 detik
    const intervalId = setInterval(() => {
      const newCollaboration = generateRandomCollaboration();
      setCollaborations(prevCollaborations => [newCollaboration, ...prevCollaborations]);
    }, 15000); // Setiap 15 detik

    return () => clearInterval(intervalId);
  }, []);

  const statusStyles: Record<Collaboration['status'], string> = {
    New: 'bg-sky-500/20 text-sky-400',
    Contacted: 'bg-blue-500/20 text-blue-400',
    'In Progress': 'bg-amber-500/20 text-amber-400',
    Closed: 'bg-slate-500/20 text-slate-400',
  };

  return (
    <div className="p-2 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Inbox: Collaborations</h1>
        <div className="flex items-center gap-2 text-emerald-400">
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
          <span>Real-time updates enabled</span>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs text-slate-400 uppercase">
              <tr>
                <th scope="col" className="py-3 px-6">Company / Contact</th>
                <th scope="col" className="py-3 px-6">Project Type</th>
                <th scope="col" className="py-3 px-6">Date Submitted</th>
                <th scope="col" className="py-3 px-6">Status</th>
                <th scope="col" className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {collaborations.map((collab) => (
                <tr key={collab.id} className="border-b border-slate-700 hover:bg-slate-700/20">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-md bg-slate-700 flex items-center justify-center font-bold text-white">
                        {collab.companyName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-white">{collab.companyName}</div>
                        <div className="text-xs text-slate-400">{collab.contactPerson}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">{collab.projectType}</td>
                  <td className="py-4 px-6">{collab.submittedAt.toLocaleDateString()}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[collab.status]}`}>
                      {collab.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-3">
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors" title="View Message">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-sky-400 hover:bg-slate-700 rounded-full transition-colors" title="Mark as Contacted">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-700 rounded-full transition-colors" title="Start Project">
                        <CheckSquare className="w-4 h-4" />
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

export default Collaborations;