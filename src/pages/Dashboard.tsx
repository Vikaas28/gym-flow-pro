import { Link } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  UserX, 
  ClipboardCheck, 
  UserPlus, 
  List, 
  CalendarCheck,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useMembers } from '@/contexts/MembersContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { members, getTodayAttendance, getActiveMembers, getInactiveMembers } = useMembers();

  const stats = [
    {
      icon: Users,
      label: 'Total Members',
      value: members.length,
      description: 'All registered members',
      color: 'primary',
    },
    {
      icon: UserCheck,
      label: 'Active Members',
      value: getActiveMembers(),
      description: 'Currently active',
      color: 'success',
    },
    {
      icon: UserX,
      label: 'Inactive Members',
      value: getInactiveMembers(),
      description: 'No longer active',
      color: 'warning',
    },
    {
      icon: ClipboardCheck,
      label: "Today's Attendance",
      value: getTodayAttendance(),
      description: 'Marked today',
      color: 'secondary',
    },
  ];

  const quickActions = [
    { to: '/members', icon: List, label: 'View Members', description: 'See all members' },
    { to: '/add-member', icon: UserPlus, label: 'Add Member', description: 'Register new member' },
    { to: '/attendance', icon: CalendarCheck, label: 'Mark Attendance', description: 'Check in members' },
  ];

  const colorMap: Record<string, string> = {
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    secondary: 'text-secondary',
  };

  const bgMap: Record<string, string> = {
    primary: 'bg-primary/10',
    success: 'bg-success/10',
    warning: 'bg-warning/10',
    secondary: 'bg-secondary/10',
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold">
                Welcome back, <span className="gradient-text">{user?.user_metadata?.full_name || user?.email || ''}</span>!
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Here's your gym management dashboard for today
              </p>
            </div>
            <div className="text-right text-muted-foreground">
              <p className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={stat.label} 
              className="stats-card animate-slide-up"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
                    <p className="text-4xl font-display font-bold mt-2 gradient-text">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${bgMap[stat.color]}`}>
                    <stat.icon className={`w-6 h-6 ${colorMap[stat.color]}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="animate-slide-up delay-400">
          <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link 
                key={action.to} 
                to={action.to}
                className="action-card animate-slide-up"
                style={{ animationDelay: `${(index + 5) * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-4 action-icon transition-transform duration-300">
                  <action.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground">{action.label}</h3>
                <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity Preview */}
        <div className="animate-slide-up delay-300">
          <Card className="p-6">
            <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-secondary" />
              Membership Distribution
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {['basic', 'premium', 'vip'].map((type) => {
                const count = members.filter(m => m.membership_type === type).length;
                const percentage = members.length > 0 ? Math.round((count / members.length) * 100) : 0;
                
                return (
                  <div key={type} className="text-center p-4 rounded-xl bg-muted/30">
                    <p className="text-2xl font-display font-bold gradient-text">{count}</p>
                    <p className="text-sm text-muted-foreground capitalize">{type}</p>
                    <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full gradient-primary transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
