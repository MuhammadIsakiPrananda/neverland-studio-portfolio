// src/pages/dashboard/types.ts

export interface CpuHistoryPoint {
  time: string;
  usage: number;
}

export interface NetworkHistoryPoint {
  time: string;
  in: number; // KB/s
  out: number; // KB/s
}

export type ServiceStatus = 'Active' | 'Inactive' | 'Error';

export interface TopProcess {
  pid: number;
  user: string;
  cpu: number;
  mem: number;
  command: string;
}

export interface SuspiciousActivity {
  id: number;
  timestamp: string;
  level: 'Warning' | 'Critical' | 'Info';
  sourceIp: string;
  event: string;
}

export interface Applicant {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
  role: 'Frontend Developer' | 'Backend Developer' | 'UI/UX Designer' | 'Project Manager';
  appliedAt: Date;
  status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
  coverLetter: string;
}

export interface Collaboration {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  projectType: 'Web Development' | 'Mobile App' | 'Branding' | 'Consultation';
  submittedAt: Date;
  status: 'New' | 'Contacted' | 'In Progress' | 'Closed';
  message: string;
}

export interface ServerMetrics {
  websiteUptime: string;
  cpuUsage: number;
  ramUsage: number;
  diskUsage: number;
  networkIn: number;
  networkOut: number;
  loadAverage: { one: number; five: number; fifteen: number; };
  cpuHistory: CpuHistoryPoint[];
  systemInfo: {
    os: string;
    ip: string;
    uptime: string;
  };
  topProcesses: TopProcess[];
  services: {
    [key: string]: ServiceStatus;
  };
  networkHistory: NetworkHistoryPoint[];
  suspiciousActivities: SuspiciousActivity[];
}