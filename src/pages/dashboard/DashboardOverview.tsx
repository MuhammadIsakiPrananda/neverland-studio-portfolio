import { MessageSquare, Users, Briefcase, BarChart } from 'lucide-react';
import { useMemo } from 'react';
import KpiCard from './KpiCard';
import RecentActivityTable from './RecentActivityTable';

const DashboardOverview = () => {
  const kpiData = useMemo(() => [
    {
      title: 'Pending Reviews',
      value: '12',
      icon: <MessageSquare className="w-6 h-6" />,
      trend: '+3 from yesterday',
      isPositive: true,
      color: 'text-sky-400',
    },
    {
      title: 'New Applicants',
      value: '8',
      icon: <Users className="w-5 h-5" />,
      trend: '+2 this week',
      isPositive: true,
      color: 'text-emerald-400',
    },
    {
      title: 'Collaborations',
      value: '4',
      icon: <Briefcase className="w-5 h-5" />,
      trend: '1 new lead',
      isPositive: true,
      color: 'text-amber-400',
    },
    {
      title: 'Website Uptime',
      value: '99.98%',
      icon: <BarChart className="w-5 h-5" />,
      trend: 'All systems operational',
      isPositive: true,
      color: 'text-violet-400',
    },
  ], []);

  return (
    <div className="p-2 sm:p-6">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        {kpiData.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>
      <RecentActivityTable />
    </div>
  );
};

export default DashboardOverview;