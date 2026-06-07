import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  FileText, 
  ClipboardList, 
  Heart, 
  Crown, 
  TrendingUp, 
  Bell,
  ChevronRight,
  AlertCircle,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge, getStatusBadge, getMemberLevelInfo } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const premiumTrend = [
  { month: '1月', premium: 12000, claims: 2000 },
  { month: '2月', premium: 15000, claims: 3500 },
  { month: '3月', premium: 13500, claims: 1800 },
  { month: '4月', premium: 18000, claims: 4200 },
  { month: '5月', premium: 16500, claims: 2800 },
  { month: '6月', premium: 20000, claims: 3200 }
];

export default function Home() {
  const navigate = useNavigate();
  const { currentUser, policies, claims, notifications, products, initApp, refreshData, markNotificationRead, isLoading: storeLoading, isInitialized } = useAppStore();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const memberInfo = getMemberLevelInfo(currentUser?.memberLevel || 'silver');
  
  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      try {
        if (!isInitialized) {
          await initApp();
        }
        if (currentUser && mounted) {
          await refreshData();
        }
        if (mounted) {
          setDataLoaded(true);
        }
      } catch (error) {
        console.error('加载数据失败:', error);
        if (mounted) {
          setDataLoaded(true);
        }
      } finally {
        if (mounted) {
          setIsPageLoading(false);
        }
      }
    };
    
    loadData();
    
    return () => {
      mounted = false;
    };
  }, [isInitialized, currentUser?.id]);

  const handleNotificationClick = async (notificationId: string) => {
    try {
      await markNotificationRead(notificationId);
    } catch (error) {
      console.error('标记通知已读失败:', error);
    }
  };
  
  const activePolicies = policies.filter(p => p.status === 'active');
  const pendingClaims = claims.filter(c => c.status === 'reviewing' || c.status === 'pending');
  const unreadNotifications = notifications.filter(n => !n.read);
  const totalCoverage = activePolicies.reduce((sum, p) => sum + p.amount, 0);
  
  const isLoading = isPageLoading || storeLoading || !dataLoaded;

  const quickActions = [
    { icon: Shield, label: '我要投保', path: '/insurance', color: 'bg-blue-500' },
    { icon: FileText, label: '我的保单', path: '/policies', color: 'bg-green-500' },
    { icon: ClipboardList, label: '申请理赔', path: '/claims', color: 'bg-amber-500' },
    { icon: Heart, label: '健康管理', path: '/health', color: 'bg-rose-500' }
  ];

  const recommendedProducts = products.filter(p => p.recommended).slice(0, 3);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl h-40 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl h-32 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl h-80 animate-pulse" />
            <div className="bg-white rounded-2xl h-80 animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl h-64 animate-pulse" />
            <div className="bg-white rounded-2xl h-64 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute right-20 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <CardContent className="p-8 relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-100">您好，欢迎回来</p>
              <h1 className="text-3xl font-bold mt-1">{currentUser?.name}</h1>
              <div className="flex items-center gap-3 mt-3">
                <span className={cn('px-3 py-1 rounded-full text-sm font-medium', memberInfo.bgColor, 'text-white')}>
                  {memberInfo.label}
                </span>
                <span className="text-blue-100 text-sm">
                  年缴保费 ¥{(currentUser?.annualPremium || 0).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">总保障额度</p>
              <p className="text-3xl font-bold">¥{(totalCoverage / 10000).toFixed(0)}万</p>
              <p className="text-blue-100 text-sm mt-1">{activePolicies.length} 份有效保单</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, idx) => (
          <Card key={idx} hover onClick={() => navigate(action.path)}>
            <CardContent className="p-6 text-center">
              <div className={cn('w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3', action.color)}>
                <action.icon className="w-7 h-7 text-white" />
              </div>
              <p className="font-medium text-gray-900">{action.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{activePolicies.length}</p>
                    <p className="text-sm text-gray-500">有效保单</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{pendingClaims.length}</p>
                    <p className="text-sm text-gray-500">待处理理赔</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{claims.filter(c => c.status === 'paid').length}</p>
                    <p className="text-sm text-gray-500">已赔付</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                    <Bell className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{unreadNotifications.length}</p>
                    <p className="text-sm text-gray-500">未读消息</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Premium Trend Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">保费与理赔趋势</h3>
                <p className="text-sm text-gray-500">近6个月数据</p>
              </div>
              <Badge variant="info">实时更新</Badge>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={premiumTrend}>
                    <defs>
                      <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: 'none', 
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Area type="monotone" dataKey="premium" stroke="#3B82F6" fillOpacity={1} fill="url(#colorPremium)" strokeWidth={2} />
                    <Line type="monotone" dataKey="claims" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B', r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">为您推荐</h3>
                <p className="text-sm text-gray-500">基于您的情况智能推荐</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/insurance')}>
                查看全部 <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedProducts.map((product) => (
                  <Card key={product.id} hover className="overflow-hidden" onClick={() => navigate('/insurance')}>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{product.name}</h4>
                        {product.hot && <Badge variant="danger">热销</Badge>}
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-blue-600 font-bold">
                          ¥{product.basePremium}
                          <span className="text-xs text-gray-400 font-normal">起/年</span>
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Recent Notifications */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">消息通知</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.slice(0, 4).map((notification) => {
                const typeColors: Record<string, string> = {
                  success: 'bg-green-500',
                  warning: 'bg-amber-500',
                  error: 'bg-red-500',
                  info: 'bg-blue-500'
                };
                return (
                  <div key={notification.id} className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => handleNotificationClick(notification.id)}>
                    <div className={cn('w-2 h-2 rounded-full mt-2 flex-shrink-0', typeColors[notification.type])} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">{notification.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{notification.content}</p>
                      <p className="text-xs text-gray-400 mt-1">{notification.createTime}</p>
                    </div>
                    {!notification.read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Upcoming Renewals */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">即将到期</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {policies.filter(p => p.status === 'active').slice(0, 2).map((policy) => {
                const status = getStatusBadge(policy.status);
                return (
                  <div key={policy.id} className="p-4 rounded-lg border border-gray-100">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-gray-900 text-sm">{policy.productName}</p>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    <p className="text-xs text-gray-500">保单号：{policy.policyNo}</p>
                    <div className="flex items-center gap-2 mt-2 text-amber-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-xs">到期日：{policy.endDate}</span>
                    </div>
                  </div>
                );
              })}
              <Button variant="outline" className="w-full" size="sm" onClick={() => navigate('/policies')}>
                查看全部保单
              </Button>
            </CardContent>
          </Card>

          {/* Member Benefits */}
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">会员权益</p>
                  <p className="text-xs text-gray-500">当前{memberInfo.label}</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                {['保费折扣优惠', '理赔优先通道', '免费道路救援'].map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    {benefit}
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full bg-white" size="sm" onClick={() => navigate('/member')}>
                查看更多权益
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
