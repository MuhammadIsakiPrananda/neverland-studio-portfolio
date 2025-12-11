import { motion } from "framer-motion";
import { FolderKanban, TrendingUp, Users, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RecentActivityProps {
  activities: any[];
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "project":
      return FolderKanban;
    case "milestone":
      return CheckCircle;
    case "client":
      return Users;
    default:
      return TrendingUp;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case "project":
      return "cyan";
    case "milestone":
      return "teal";
    case "client":
      return "purple";
    default:
      return "orange";
  }
};

const RecentActivity = ({ activities }: RecentActivityProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-slate-900/50 border border-slate-800 rounded-xl p-6"
      data-testid="recent-activity"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Recent Activity</h3>
        <p className="text-slate-400 text-sm">Latest updates and actions</p>
      </div>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-slate-500 text-center py-8">
            No recent activities
          </p>
        ) : (
          activities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            const color = getActivityColor(activity.type);
            const colorClasses = {
              cyan: "bg-cyan-500/20 text-cyan-400",
              teal: "bg-fresh-mint-500/20 text-fresh-mint-400",
              purple: "bg-purple-500/20 text-purple-400",
              orange: "bg-orange-500/20 text-orange-400",
            };

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
                data-testid={`activity-item-${index}`}
              >
                <div
                  className={`w-10 h-10 rounded-lg ${
                    colorClasses[color as keyof typeof colorClasses]
                  } flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium text-sm mb-1">
                    {activity.title}
                  </h4>
                  <p className="text-slate-400 text-xs mb-2">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>{activity.user}</span>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(activity.timestamp), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

export default RecentActivity;
