import { useState } from 'react';
import {
  Users,
  TrendingUp,
  DollarSign,
  Award,
  FileText,
  UserPlus,
  Phone,
  Calendar,
  ChevronRight,
  Download,
  Printer,
  BarChart3,
  PieChart,
  CheckCircle2,
  Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAppStore } from '@/store';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '@/lib/utils';

const commissionLevels = [
  { range: '月度保费 < 10万', rate: '15%', min: 0, max: 100000, color: 'bg-gray-100 text-gray-700' },
  { range: '10万 ≤ 月度保费 < 30万', rate: '20%', min: 100000, max: 300000, color: 'bg-blue-100 text-blue-700' },
  { range: '30万 ≤ 月度保费 < 50万', rate: '25%', min: 300000, max: 500000, color: 'bg-amber-100 text-amber-700' },
  { range: '月度保费 ≥ 50万', rate: '30%', min: 500000, max: Infinity, color: 'bg-green-100 text-green-700' }
];

const monthlyTrend = [
  { month: '1月', premium: 280000, commission: 56000 },
  { month: '2月', premium: 320000, commission: 64000 },
  { month: '3月', premium: 290000, commission: 58000 },
  { month: '4月', premium: 350000, commission: 87500 },
  { month: '5月', premium: 320000, commission: 64000 },
  { month: '6月', premium: 380000, commission: 95000 }
];

export default function AgentDashboard() {
  const { teamMembers, commissions, currentUser } = useAppStore();
  const [selectedMonth, setSelectedMonth] = useState('2024-06');
  const [showPayroll, setShowPayroll] = useState(false);

  const currentCommission = commissions.find(c => c.month === selectedMonth);
  const totalTeamPremium = teamMembers.reduce((sum, m) => sum + m.monthlyPremium, 0);
  const sortedMembers = [...teamMembers].sort((a, b) => b.monthlyPremium - a.monthlyPremium);

  const getCommissionLevel = (premium: number) => {
    if (premium < 100000) return { level: 1, rate: 0.15, label: '15%' };
    if (premium < 300000) return { level: 2, rate: 0.20, label: '20%' };
    if (premium < 500000) return { level: 3, rate: 0.25, label: '25%' };
    return { level: 4, rate: 0.30, label: '30%' };
  };

  const currentLevel = getCommissionLevel(totalTeamPremium);

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`;
  };

  const handleGeneratePayroll = () => {
    setShowPayroll(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">代理人工作台</h1>
          <p className="text-gray-500 mt-1">管理团队、查看业绩与佣金明细</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <UserPlus className="w-4 h-4 mr-1" />
            添加成员
          </Button>
          <Button size="sm" onClick={handleGeneratePayroll}>
            <FileText className="w-4 h-4 mr-1" />
            生成本月工资单
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
                <p className="text-sm text-gray-500">团队成员</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalTeamPremium)}</p>
                <p className="text-sm text-gray-500">本月团队保费</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">第{currentLevel.level}级</p>
                <p className="text-sm text-gray-500">佣金等级（{currentLevel.label}）</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentCommission?.commissionAmount || 0)}</p>
                <p className="text-sm text-gray-500">本月预计佣金</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">团队业绩趋势</h3>
                <p className="text-sm text-gray-500">近6个月保费与佣金</p>
              </div>
              <Badge variant="info">实时更新</Badge>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrend}>
                    <defs>
                      <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(value) => `${value / 10000}万`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="premium"
                      name="保费"
                      stroke="#3B82F6"
                      fillOpacity={1}
                      fill="url(#colorPremium)"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="commission"
                      name="佣金"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ fill: '#10B981', r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">团队成员业绩排行</h3>
                <p className="text-sm text-gray-500">本月保费业绩</p>
              </div>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sortedMembers} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis type="number" stroke="#9CA3AF" fontSize={12} tickFormatter={(value) => `${value / 10000}万`} />
                    <YAxis type="category" dataKey="name" stroke="#9CA3AF" fontSize={12} width={60} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Bar dataKey="monthlyPremium" name="月度保费" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">佣金明细</h3>
              <p className="text-sm text-gray-500 mt-1">
                {selectedMonth} 月佣金明细，共 {currentCommission?.details.length || 0} 笔
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">保单号</th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">客户姓名</th>
                      <th className="text-right py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">保费</th>
                      <th className="text-right py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">佣金</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {currentCommission?.details.map((detail, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <span className="text-sm font-medium text-gray-900">{detail.policyNo}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-gray-700">{detail.customerName}</span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="text-sm text-gray-700">{formatCurrency(detail.premium)}</span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="text-sm font-medium text-green-600">{formatCurrency(detail.commission)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between w-full">
                <div className="text-sm text-gray-500">
                  合计保费：<span className="font-medium text-gray-900">{formatCurrency(currentCommission?.totalPremium || 0)}</span>
                </div>
                <div className="text-sm text-gray-500">
                  合计佣金：<span className="font-bold text-green-600">{formatCurrency(currentCommission?.commissionAmount || 0)}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">佣金等级说明</h3>
              <p className="text-sm text-gray-500 mt-1">月度保费越高，佣金比例越高</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {commissionLevels.map((level, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'p-4 rounded-lg border-2 transition-all',
                    totalTeamPremium >= level.min && totalTeamPremium < level.max
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-100 bg-white'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{level.range}</span>
                    {totalTeamPremium >= level.min && totalTeamPremium < level.max && (
                      <Badge variant="info">当前</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn('px-3 py-1 rounded-full text-sm font-bold', level.color)}>
                      佣金 {level.rate}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="font-semibold text-gray-900">团队成员</h3>
              <PieChart className="w-5 h-5 text-gray-400" />
            </CardHeader>
            <CardContent className="space-y-3">
              {teamMembers.map((member) => {
                const memberLevel = getCommissionLevel(member.monthlyPremium);
                return (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 text-sm truncate">{member.name}</span>
                        {member.role === 'leader' && (
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span>{member.phone}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-gray-900">{formatCurrency(member.monthlyPremium)}</p>
                      <p className="text-xs text-gray-500">佣金 {memberLevel.label}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
            <CardFooter className="border-t border-gray-100">
              <Button variant="ghost" className="w-full text-blue-600">
                查看全部成员 <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {showPayroll && currentCommission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">工资单</h3>
                <p className="text-sm text-gray-500 mt-1">{selectedMonth} 月工资明细</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Printer className="w-4 h-4 mr-1" />
                  打印
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  下载
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">代理人姓名</p>
                  <p className="font-medium text-gray-900 mt-1">{currentUser?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">工号</p>
                  <p className="font-medium text-gray-900 mt-1">AG{currentUser?.id?.padStart(6, '0')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">所属团队</p>
                  <p className="font-medium text-gray-900 mt-1">金牌销售一组</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">发放日期</p>
                  <p className="font-medium text-gray-900 mt-1">{currentCommission.createTime}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">收入明细</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">月度总保费</span>
                    <span className="font-medium text-gray-900">{formatCurrency(currentCommission.totalPremium)}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">佣金等级</span>
                    <span className="font-medium text-gray-900">第{currentCommission.commissionLevel}级</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">佣金比例</span>
                    <span className="font-medium text-gray-900">{(currentCommission.commissionRate * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">保单佣金</span>
                    <span className="font-medium text-gray-900">{formatCurrency(currentCommission.commissionAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">团队管理津贴</span>
                    <span className="font-medium text-gray-900">{formatCurrency(5000)}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">业绩达标奖金</span>
                    <span className="font-medium text-gray-900">{formatCurrency(3000)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">扣除明细</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">个人所得税</span>
                    <span className="font-medium text-gray-900">{formatCurrency(Math.round(currentCommission.commissionAmount * 0.03))}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">社保公积金</span>
                    <span className="font-medium text-gray-900">{formatCurrency(1200)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700">实发工资</p>
                    <p className="text-3xl font-bold text-blue-900 mt-1">
                      {formatCurrency(currentCommission.commissionAmount + 5000 + 3000 - Math.round(currentCommission.commissionAmount * 0.03) - 1200)}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-100">
              <Button variant="outline" className="w-full" onClick={() => setShowPayroll(false)}>
                关闭
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
