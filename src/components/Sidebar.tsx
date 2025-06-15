
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
  const { signOut } = useAuth();

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

  return (
    <div className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col min-h-screen">
      {/* Simpler Header */}
      <div className="p-6 border-b border-sidebar-border/50">
        <div className="flex items-center space-x-3 mb-6">
          <h1 className="text-xl font-medium text-sidebar-foreground tracking-tight">CallTime</h1>
        </div>
        
        {/* Simplified User Profile Section */}
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-sidebar-accent/40">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs bg-sidebar-primary text-sidebar-primary-foreground font-medium">
              FM
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Film Maker</p>
            <p className="text-xs text-sidebar-foreground/60">filmmaker@studio.com</p>
          </div>
        </div>
      </div>

      {/* Simplified Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 font-normal",
                activeView === item.id
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Simplified Quick Actions */}
        <div className="mt-8">
          <p className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider mb-3 px-4">
            Quick Actions
          </p>
          <Button 
            onClick={() => setActiveView('create')}
            className="w-full justify-start bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground mb-2 h-10 rounded-lg font-normal"
          >
            <FileText className="w-4 h-4 mr-3" />
            New Callsheet
          </Button>
          <Button 
            onClick={handleGoHome}
            variant="outline"
            className="w-full justify-start border-sidebar-border text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground h-10 rounded-lg font-normal"
          >
            <Home className="w-4 h-4 mr-3" />
            Go to Landing Page
          </Button>
        </div>

        {/* Simplified Settings Section */}
        <div className="mt-6">
          <p className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider mb-3 px-4">
            Settings
          </p>
          <div className="space-y-1">
            <Button
              variant="ghost"
              onClick={() => setActiveView('pdf-settings')}
              className="w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground h-10 rounded-lg font-normal"
            >
              <FileText className="w-4 h-4 mr-3" />
              PDF Appearance
            </Button>
            <div className="px-4 py-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Minimal Footer */}
      <div className="p-4 border-t border-sidebar-border/50">
        <div className="text-xs text-sidebar-foreground/50 text-center font-normal">
          © 2024 CallTime
        </div>
      </div>
    </div>
  );
};
