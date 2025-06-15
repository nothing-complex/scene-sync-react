
import { Film, FileText, Users, User, Sun, Moon, Home } from 'lucide-react';
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
    <div className="w-80 bg-sidebar border-r border-sidebar-border flex flex-col min-h-screen shadow-lg">
      {/* Enhanced Header */}
      <div className="p-8 border-b border-sidebar-border/60">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 gradient-sand rounded-2xl flex items-center justify-center shadow-lg">
            <Film className="w-7 h-7 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-sidebar-foreground tracking-tight">CallTime</h1>
            <p className="text-sm text-sidebar-foreground/60 font-medium">Production Manager</p>
          </div>
        </div>
        
        {/* Enhanced User Profile Section */}
        <div className="flex items-center space-x-4 p-4 rounded-2xl bg-sidebar-accent/60 border border-sidebar-border/30">
          <Avatar className="w-10 h-10 shadow-md">
            <AvatarFallback className="text-sm bg-sidebar-primary text-sidebar-primary-foreground font-bold">
              FM
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-sidebar-foreground truncate">Film Maker</p>
            <p className="text-xs text-sidebar-foreground/60">filmmaker@studio.com</p>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation */}
      <nav className="flex-1 p-6">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-left transition-all duration-200 font-medium",
                activeView === item.id
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg transform scale-[1.02]"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground hover:transform hover:scale-[1.01]"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Enhanced Quick Actions */}
        <div className="mt-12">
          <p className="text-xs font-bold text-sidebar-foreground/60 uppercase tracking-wider mb-4 px-6">
            Quick Actions
          </p>
          <Button 
            onClick={() => setActiveView('create')}
            className="w-full justify-start bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground shadow-lg mb-3 h-12 rounded-2xl font-semibold"
          >
            <FileText className="w-5 h-5 mr-3" />
            New Callsheet
          </Button>
          <Button 
            onClick={handleGoHome}
            variant="outline"
            className="w-full justify-start border-sidebar-border text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground h-12 rounded-2xl font-medium"
          >
            <Home className="w-5 h-5 mr-3" />
            Go to Landing Page
          </Button>
        </div>

        {/* Enhanced Appearance Section */}
        <div className="mt-8">
          <p className="text-xs font-bold text-sidebar-foreground/60 uppercase tracking-wider mb-4 px-6">
            Appearance
          </p>
          <div className="space-y-2">
            <Button
              variant="ghost"
              onClick={() => setActiveView('pdf-settings')}
              className="w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground h-12 rounded-2xl font-medium"
            >
              <FileText className="w-5 h-5 mr-3" />
              PDF Appearance
            </Button>
            <div className="px-6">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Footer */}
      <div className="p-6 border-t border-sidebar-border/60">
        <div className="text-xs text-sidebar-foreground/50 text-center font-medium">
          © 2024 CallTime Studio Tools
        </div>
      </div>
    </div>
  );
};
