
import { FileText, Users, User, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Sidebar = ({ activeView, setActiveView }: SidebarProps) => {
  const { signOut, user } = useAuth();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: FileText,
    },
    {
      id: 'contacts',
      label: 'Contacts',
      icon: Users,
    },
  ];

  const handleGoHome = async () => {
    await signOut();
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      const names = user.user_metadata.full_name.split(' ');
      return names.map(name => name[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  // Get display name
  const getDisplayName = () => {
    return user?.user_metadata?.full_name || 'Creative Professional';
  };

  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border flex flex-col min-h-screen">
      {/* Editorial Header */}
      <div className="p-8 border-b border-sidebar-border/50">
        <div className="mb-8">
          <h1 className="text-2xl font-playfair font-semibold text-sidebar-foreground tracking-tight mb-2">
            CallTime
          </h1>
          <p className="text-sm text-sidebar-foreground/60 font-sans">
            Professional Production Management
          </p>
        </div>
        
        {/* Enhanced User Profile Section */}
        <div className="flex items-center space-x-4 p-4 rounded-2xl bg-sidebar-accent/30 border border-sidebar-border/30">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="text-sm bg-sidebar-primary text-sidebar-primary-foreground font-medium font-sans">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate font-sans">
              {getDisplayName()}
            </p>
            <p className="text-xs text-sidebar-foreground/60 font-sans">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Editorial Navigation */}
      <nav className="flex-1 p-6">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-left transition-all duration-300 font-sans",
                activeView === item.id
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Editorial Quick Actions */}
        <div className="mt-12">
          <p className="text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider mb-4 px-5 font-sans">
            Quick Actions
          </p>
          <Button 
            onClick={() => setActiveView('create')}
            className="w-full justify-start bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground mb-3 h-12 rounded-2xl font-sans font-medium shadow-lg"
          >
            <FileText className="w-5 h-5 mr-4" />
            New Production
          </Button>
        </div>

        {/* Editorial Settings Section */}
        <div className="mt-8">
          <p className="text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider mb-4 px-5 font-sans">
            Preferences
          </p>
          <div className="space-y-2">
            <Button
              variant="ghost"
              onClick={() => setActiveView('pdf-settings')}
              className="w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground h-12 rounded-2xl font-sans"
            >
              <FileText className="w-5 h-5 mr-4" />
              PDF Styling
            </Button>
            <div className="px-5 py-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Editorial Footer */}
      <div className="p-6 border-t border-sidebar-border/50">
        <div className="text-xs text-sidebar-foreground/40 text-center font-sans">
          © 2024 CallTime Studio
        </div>
      </div>
    </div>
  );
};
