
import { Film, FileText, Users, User, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from './ThemeToggle';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Sidebar = ({ activeView, setActiveView }: SidebarProps) => {
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

  return (
    <div className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col min-h-screen">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 gradient-sand rounded-xl flex items-center justify-center shadow-sm">
            <Film className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-sidebar-foreground tracking-tight">CallTime</h1>
            <p className="text-xs text-sidebar-foreground/60 font-light">Production Manager</p>
          </div>
        </div>
        
        {/* User Profile Section */}
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-sidebar-accent/50">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs bg-sidebar-primary text-sidebar-primary-foreground">
              FM
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Film Maker</p>
            <p className="text-xs text-sidebar-foreground/60">filmmaker@studio.com</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200",
                activeView === item.id
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <p className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider mb-3 px-4">
            Quick Actions
          </p>
          <Button 
            onClick={() => setActiveView('create')}
            className="w-full justify-start bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground shadow-sm mb-2"
          >
            <FileText className="w-4 h-4 mr-2" />
            New Callsheet
          </Button>
        </div>

        {/* Theme Toggle */}
        <div className="mt-6">
          <p className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider mb-3 px-4">
            Appearance
          </p>
          <ThemeToggle />
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/50 text-center font-light">
          © 2024 CallTime Studio Tools
        </div>
      </div>
    </div>
  );
};
