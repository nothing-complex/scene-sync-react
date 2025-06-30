
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Users, 
  Settings, 
  Home,
  Shield
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
    },
    {
      id: 'contacts',
      label: 'Contacts',
      icon: Users,
    },
    {
      id: 'pdf-settings',
      label: 'PDF Settings',
      icon: Settings,
    },
    {
      id: 'privacy',
      label: 'Privacy',
      icon: Shield,
    },
  ];

  return (
    <div className="w-64 bg-card border-r border-border/30 p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-foreground flex items-center">
          <FileText className="w-6 h-6 mr-2" />
          Callsheet Pro
        </h1>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeView === item.id ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start',
                activeView === item.id && 'bg-primary text-primary-foreground'
              )}
              onClick={() => setActiveView(item.id)}
            >
              <Icon className="w-4 h-4 mr-2" />
              {item.label}
            </Button>
          );
        })}
      </nav>
    </div>
  );
};
