import { DollarSign, Users, CreditCard, Activity } from 'lucide-react';
import StatsCard from './StatsCard';

const dashboardStats = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    icon: DollarSign,
    trend: 20.1,
    color: 'cyan' as const,
  },
  {
    title: 'Subscriptions',
    value: '+2350',
    icon: Users,
    trend: 180.1,
    color: 'purple' as const,
  },
  {
    title: 'Sales',
    value: '+12,234',
    icon: CreditCard,
    trend: 19,
    color: 'teal' as const,
  },
  {
    title: 'Active Now',
    value: '+573',
    icon: Activity,
    trend: -2.5,
    color: 'orange' as const,
  },
];

const DashboardPage = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-950 min-h-screen text-white">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome back! Here's a summary of your business.</p>
      </header>

      <main>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardStats.map((stat, index) => (
            <StatsCard key={stat.title} {...stat} delay={index * 0.1} />
          ))}
        </div>

        {/* Anda bisa menambahkan komponen lain di sini, seperti grafik atau tabel */}
      </main>
    </div>
  );
};

export default DashboardPage;