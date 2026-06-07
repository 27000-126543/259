import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Shield, 
  FileText, 
  ClipboardList, 
  Heart, 
  Crown, 
  Users, 
  BarChart3, 
  User, 
  LogOut,
  Settings
} from 'lucide-react';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';
import { getMemberLevelInfo } from '@/components/ui/Badge';

interface SidebarProps {
  collapsed?: boolean;
}

const customerNavItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/insurance', icon: Shield, label: '投保中心' },
  { path: '/policies', icon: FileText, label: '保单管理' },
  { path: '/claims', icon: ClipboardList, label: '理赔中心' },
  { path: '/health', icon: Heart, label: '健康中心' },
  { path: '/member', icon: Crown, label: '会员中心' },
  { path: '/profile', icon: User, label: '个人中心' }
];

const agentNavItems = [
  { path: '/', icon: Home, label: '工作台' },
  { path: '/agent', icon: Users, label: '团队管理' },
  { path: '/profile', icon: User, label: '个人中心' }
];

const adminNavItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/admin', icon: BarChart3, label: '数据看板' },
  { path: '/profile', icon: User, label: '个人中心' }
];

export function Sidebar({ collapsed = false }: SidebarProps) {
  const { currentUser, logout } = useAppStore();
  const navigate = useNavigate();
  const memberInfo = getMemberLevelInfo(currentUser?.memberLevel || 'silver');

  const navItems = currentUser?.role === 'admin' 
    ? adminNavItems 
    : currentUser?.role === 'agent' 
      ? agentNavItems 
      : customerNavItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={cn(
      'h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col transition-all duration-300',
      collapsed ? 'w-20' : 'w-64'
    )}>
      <div className="p-6 border-b border-blue-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold">智慧保险</h1>
              <p className="text-xs text-blue-300">综合服务平台</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
              isActive 
                ? 'bg-white/20 text-white shadow-lg' 
                : 'text-blue-100 hover:bg-white/10 hover:text-white',
              collapsed && 'justify-center px-2'
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-blue-700/50 space-y-3">
        {currentUser && (
          <div className={cn(
            'flex items-center gap-3 p-3 rounded-lg bg-white/10',
            collapsed && 'justify-center'
          )}>
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm',
              memberInfo.bgColor
            )}>
              {currentUser.name.charAt(0)}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{currentUser.name}</p>
                <p className="text-xs text-blue-300 truncate">
                  {currentUser.role === 'admin' ? '管理员' : currentUser.role === 'agent' ? '代理人' : memberInfo.label}
                </p>
              </div>
            )}
          </div>
        )}
        
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 w-full px-4 py-3 rounded-lg text-blue-100 hover:bg-white/10 hover:text-white transition-colors',
            collapsed && 'justify-center px-2'
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>退出登录</span>}
        </button>
      </div>
    </div>
  );
}
