import { useNavigate, useLocation } from 'react-router-dom';
import { Home, PlusCircle, Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`h-screen bg-card border-r border-border transition-all duration-300 flex flex-col ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 flex items-center justify-between border-b border-border h-16">
        {!collapsed && <span className="font-bold text-lg bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Scrum AI</span>}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
          <Menu size={20} />
        </Button>
      </div>
      
      <div className="flex-1 p-4 space-y-2">
        <Button 
          variant={isActive('/') ? 'secondary' : 'ghost'} 
          className={`w-full justify-start gap-4 ${collapsed ? 'px-2 justify-center' : ''}`}
          onClick={() => navigate('/')}
        >
          <Home size={20} />
          {!collapsed && <span>Dashboard</span>}
        </Button>
        
        <Button 
          variant={isActive('/create') ? 'secondary' : 'ghost'} 
          className={`w-full justify-start gap-4 ${collapsed ? 'px-2 justify-center' : ''}`}
          onClick={() => navigate('/create')}
        >
          <PlusCircle size={20} />
          {!collapsed && <span>Create Meeting</span>}
        </Button>
      </div>

      <div className="p-4 border-t border-border">
         <Button 
          variant="ghost" 
          className={`w-full justify-start gap-4 ${collapsed ? 'px-2 justify-center' : ''} text-muted-foreground`}
        >
          <Settings size={20} />
          {!collapsed && <span>Settings</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
