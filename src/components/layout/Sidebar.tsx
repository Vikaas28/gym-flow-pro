import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  ClipboardCheck, 
  LogOut,
  Dumbbell,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/members', icon: Users, label: 'Members' },
  { to: '/add-member', icon: UserPlus, label: 'Add Member' },
  { to: '/attendance', icon: ClipboardCheck, label: 'Attendance' },
];

export function Sidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen glass-card border-r border-border/50 z-50 transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-primary">
            <Dumbbell className="w-6 h-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="font-display font-bold text-lg gradient-text">GymPro</h1>
              <p className="text-xs text-muted-foreground">Management System</p>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border/50"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </Button>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-primary/10 text-primary border-l-2 border-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform duration-200",
                isActive && "text-primary",
                "group-hover:scale-110"
              )} />
              {!collapsed && (
                <span className="font-medium animate-fade-in">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border/50">
        {!collapsed && user && (
          <div className="mb-4 px-4 animate-fade-in">
            <p className="text-sm font-medium text-foreground">{user.username}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        )}
        <button
          onClick={logout}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg w-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group"
          )}
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
