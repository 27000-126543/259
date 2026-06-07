import { useState, useEffect } from 'react';
import {
  DollarSign,
  FileCheck,
  CheckCircle2,
  Clock,
  Users,
  UserCheck,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  Trophy,
  MessageSquareWarning,
  Download,
  Calendar,
  MapPin,
  ChevronDown,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { useAppStore } from '@/store';

const claimEfficiencyTrend = [
  { month: '1月', avgDays: 3.5, resolved: 98 },
  { month: '2月', avgDays: 3.2, resolved: 112 },
  { month: '3月', avgDays: 3.0, resolved: 125 },
  { month: '4月', avgDays: 2.9, resolved: 138 },
  { month: '5月', avgDays: 2.8, resolved: 156 },
  { month: '6月', avgDays: 2.6, resolved: 172 }
];

const complaintData = [
  { name: '已解决', value: 86, color: '#10B981' },
  { name: '处理中', value: 12, color: '#F59E0B' },
  { name: '待处理', value: 2, color: '#EF4444' }
];

const agentRanking = [
  { rank: 1, name: '李华', premium: 380000, customers: 156, approvalRate: 98.5 },
  { rank: 2, name: '张强', premium: 290000, customers: 128, approvalRate: 97.2 },
  { rank: 3, name: '王芳', premium: 245000, customers: 112, approvalRate: 96.8 },
  { rank: 4, name: '陈伟', premium: 180000, customers: 95, approvalRate: 95.5 },
  { rank: 5, name: '刘洋', premium: 156000, customers: 82, approvalRate: 94.8 }
];

const regions = ['全部区域', '华东区', '华南区', '华北区', '西南区', '西北区'];
const timeRanges = ['本月', '本季度', '本年度', '近半年', '自定义'];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export default function AdminDashboard() {
  const { getAdminStats, exportMonthlyReport, predictNextQuarter, products, policies, claims } = useAppStore();
  
  const [selectedRegion, setSelectedRegion] = useState('全部区域');
  const [selectedTimeRange, setSelectedTimeRange] = useState('本月');
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [adminStats, setAdminStats] = useState<any>(null);
  const [predictionData, setPredictionData] = useState<any[]>([]);
  const [monthlyReportData, setMonthlyReportData] = useState<any>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsData, predictionDataResult, reportData] = await Promise.all([
        getAdminStats(selectedRegion, selectedTimeRange),
        predictNextQuarter(),
        exportMonthlyReport(new Date().toISOString().slice(0, 7))
      ]);
      setAdminStats(statsData);
      setPredictionData(predictionDataResult);
      setMonthlyReportData(JSON.parse(reportData));
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedRegion, selectedTimeRange]);

  const productSalesData = products.map(product => {
    const productPolicies = policies.filter(p => p.productId === product.id);
    const premium = productPolicies.reduce((sum, p) => sum + p.premium, 0);
    return {
      productName: product.name,
      premium: premium || Math.round(product.basePremium * (30 + Math.random() * 50))
    };
  });

  const stats = adminStats ? [
    {
      title: '总保费',
      value: `¥${(adminStats.totalPremium / 10000).toFixed(0)}万`,
      icon: DollarSign,
      color: 'bg-blue-100 text-blue-600',
      trend: '+12.5%',
      trendUp: true
    },
    {
      title: '总理赔数',
      value: adminStats.totalClaims,
      icon: FileCheck,
      color: 'bg-green-100 text-green-600',
      trend: '+8.3%',
      trendUp: true
    },
    {
      title: '理赔通过率',
      value: `${adminStats.claimApprovalRate}%`,
      icon: CheckCircle2,
      color: 'bg-emerald-100 text-emerald-600',
      trend: '+2.1%',
      trendUp: true
    },
    {
      title: '平均理赔时效',
      value: `${adminStats.avgClaimTime}天`,
      icon: Clock,
      color: 'bg-amber-100 text-amber-600',
      trend: '-15.2%',
      trendUp: true
    },
    {
      title: '代理人数',
      value: adminStats.totalAgents,
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
      trend: '+5.8%',
      trendUp: true
    },
    {
      title: '客户数',
      value: adminStats.totalCustomers,
      icon: UserCheck,
      color: 'bg-cyan-100 text-cyan-600',
      trend: '+10.2%',
      trendUp: true
    },
    {
      title: '客诉率',
      value: `${adminStats.complaintRate}%`,
      icon: AlertTriangle,
      color: 'bg-rose-100 text-rose-600',
      trend: '-0.3%',
      trendUp: true
    }
  ] : [];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      
      let reportJson: string;
      if (typeof exportMonthlyReport === 'function') {
        reportJson = await exportMonthlyReport(currentMonth);
      } else {
        const store = useAppStore.getState();
        if (typeof store.exportMonthlyReport === 'function') {
          reportJson = await store.exportMonthlyReport(currentMonth);
        } else {
          throw new Error('报表导出功能暂不可用');
        }
      }
      
      const reportData = {
        ...JSON.parse(reportJson),
        exportTime: new Date().toLocaleString(),
        region: selectedRegion,
        timeRange: selectedTimeRange
      };
      
      const jsonStr = JSON.stringify(reportData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `月度运营报表_${currentMonth}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('导出报表失败:', error);
      alert('导出报表失败：' + (error as Error).message);
    } finally {
      setIsExporting(false);
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 10000) {
      return `${(value / 10000).toFixed(1)}万`;
    }
    return value.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">管理员看板</h1>
          <p className="text-gray-500 mt-1">实时监控业务运营数据</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowRegionDropdown(!showRegionDropdown);
                  setShowTimeDropdown(false);
                }}
                className="gap-2"
              >
                <MapPin className="w-4 h-4" />
                {selectedRegion}
                <ChevronDown className="w-4 h-4" />
              </Button>
              {showRegionDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                  {regions.map((region) => (
                    <div
                      key={region}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-50 text-sm ${
                        selectedRegion === region ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                      onClick={() => {
                        setSelectedRegion(region);
                        setShowRegionDropdown(false);
                      }}
                    >
                      {region}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowTimeDropdown(!showTimeDropdown);
                  setShowRegionDropdown(false);
                }}
                className="gap-2"
              >
                <Calendar className="w-4 h-4" />
                {selectedTimeRange}
                <ChevronDown className="w-4 h-4" />
              </Button>
              {showTimeDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                  {timeRanges.map((range) => (
                    <div
                      key={range}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-50 text-sm ${
                        selectedTimeRange === range ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                      onClick={() => {
                        setSelectedTimeRange(range);
                        setShowTimeDropdown(false);
                      }}
                    >
                      {range}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleExport}
            loading={isExporting}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            导出报表
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <Badge
                  variant={stat.trendUp ? 'success' : 'danger'}
                  className="text-xs"
                >
                  {stat.trend}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                各险种保费收入
              </h3>
              <p className="text-sm text-gray-500">按险种分类统计</p>
            </div>
            <Badge variant="info">单位：万元</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productSalesData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" stroke="#9CA3AF" fontSize={12} tickFormatter={(v) => `${(v / 10000).toFixed(0)}`} />
                  <YAxis dataKey="productName" type="category" stroke="#9CA3AF" fontSize={12} width={120} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value: number) => [`¥${formatCurrency(value)}`, '保费']}
                  />
                  <Bar dataKey="premium" radius={[0, 8, 8, 0]}>
                    {productSalesData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquareWarning className="w-5 h-5 text-amber-600" />
              客诉处理情况
            </h3>
            <p className="text-sm text-gray-500">客户投诉处理状态分布</p>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={complaintData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {complaintData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value: number) => [`${value}件`, '数量']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {complaintData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">客诉处理率</span>
                <span className="text-lg font-bold text-green-600">86.0%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                理赔时效趋势
              </h3>
              <p className="text-sm text-gray-500">近6个月平均理赔天数与结案数</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={claimEfficiencyTrend}>
                  <defs>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#9CA3AF" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="resolved"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#colorResolved)"
                    strokeWidth={2}
                    name="结案数"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="avgDays"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    dot={{ fill: '#F59E0B', r: 4 }}
                    name="平均天数"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              代理人绩效排行
            </h3>
            <p className="text-sm text-gray-500">本月保费业绩TOP5</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {agentRanking.map((agent) => (
              <div
                key={agent.rank}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  agent.rank <= 3 ? 'bg-gradient-to-r from-amber-50 to-orange-50' : 'bg-gray-50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    agent.rank === 1
                      ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white'
                      : agent.rank === 2
                      ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                      : agent.rank === 3
                      ? 'bg-gradient-to-br from-orange-300 to-orange-400 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {agent.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{agent.name}</p>
                  <p className="text-xs text-gray-500">
                    {agent.customers}位客户 · {agent.approvalRate}%通过率
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600 text-sm">¥{formatCurrency(agent.premium)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              下季度热销险种预测
            </h3>
            <p className="text-sm text-gray-500">基于历史数据与市场趋势智能预测</p>
          </div>
          <Badge variant="info">AI预测</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {predictionData.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <Badge variant="success" className="text-xs">
                    置信度 {item.confidence}%
                  </Badge>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{item.productName}</h4>
                <p className="text-2xl font-bold text-purple-600 mb-2">
                  ¥{formatCurrency(item.predictedSales)}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {item.reason}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">月度运营报表概览</h3>
            <p className="text-sm text-gray-500">{monthlyReportData?.month || new Date().toISOString().slice(0, 7)} 运营数据</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport} loading={isExporting} className="gap-2">
            <Download className="w-4 h-4" />
            下载完整报表
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-gray-600">总保费收入</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">¥{formatCurrency(monthlyReportData?.summary?.totalPremium || 0)}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl">
              <p className="text-sm text-gray-600">总理赔案件</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{monthlyReportData?.summary?.totalClaims || 0}件</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <p className="text-sm text-gray-600">客户满意度</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{monthlyReportData?.summary?.customerSatisfaction || 96.8}%</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl">
              <p className="text-sm text-gray-600">活跃代理人</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{adminStats?.totalAgents || 0}人</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">险种名称</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">保费收入</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">赔付率</th>
                </tr>
              </thead>
              <tbody>
                {(monthlyReportData?.productIncomes || productSalesData.map(p => ({ productName: p.productName, income: p.premium, claimRate: 5 + Math.random() * 15 }))).map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-700">{item.productName}</td>
                    <td className="py-3 px-4 text-right text-gray-900 font-medium">¥{formatCurrency(item.income)}</td>
                    <td className="py-3 px-4 text-right">
                      <Badge variant={item.claimRate < 10 ? 'success' : item.claimRate < 20 ? 'warning' : 'danger'}>
                        {typeof item.claimRate === 'number' ? item.claimRate.toFixed(1) : item.claimRate}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
