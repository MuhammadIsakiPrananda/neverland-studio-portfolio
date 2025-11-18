import { ArrowUpRight, DollarSign, Users, ShoppingBag } from 'lucide-react';
import { useMemo } from 'react';
import { User } from '../../utils/api';
import DashboardHeader from './DashboardHeader';
import KpiCard from './KpiCard';
import RecentActivityTable from './RecentActivityTable';

// Mock user data, in a real app this would come from an API/auth context
const mockUser: User = {
  id: '1',
  name: 'Rizky',
  email: 'rizky@example.com',
  role: 'Lead Developer',
  avatar: 'https://i.pravatar.cc/150?u=rizky',
};

const DashboardPage = () => {
  const kpiData = useMemo(() => [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      icon: <DollarSign className="w-5 h-5" />,
      trend: '+20.1% from last month',
      isPositive: true,
    },
    {
      title: 'Subscriptions',
      value: '+2350',
      icon: <Users className="w-5 h-5" />,
      trend: '+180.1% from last month',
      isPositive: true,
    },
    {
      title: 'Sales',
      value: '+12,234',
      icon: <ShoppingBag className="w-5 h-5" />,
      trend: '+19% from last month',
      isPositive: true,
    },
    {
      title: 'Active Now',
      value: '+573',
      icon: <ArrowUpRight className="w-5 h-5" />,
      trend: '+201 since last hour',
      isPositive: false, // Just for visual variety
    },
  ], []);

  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <DashboardHeader user={mockUser} title="Dashboard" />
      <main className="p-8">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          {kpiData.map((kpi, index) => (
            <KpiCard key={index} {...kpi} />
          ))}
        </div>
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <RecentActivityTable />
          {/* You can add chart components here */}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;