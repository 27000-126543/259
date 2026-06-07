import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  FileText,
  Calendar,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge, getStatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store';

const statusFilters = [
  { id: 'all', label: '全部' },
  { id: 'active', label: '保障中' },
  { id: 'pending', label: '待生效' },
  { id: 'expired', label: '已过期' },
  { id: 'cancelled', label: '已取消' }
];

export default function PolicyManagement() {
  const { policies, isLoading, refreshData, currentUser } = useAppStore();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    if (currentUser && policies.length === 0) {
      refreshData();
    }
  }, [currentUser, policies.length, refreshData]);

  const filteredPolicies = policies.filter(p => {
    const matchStatus = selectedStatus === 'all' || p.status === selectedStatus;
    const matchSearch = p.productName.includes(searchTerm) || p.policyNo.includes(searchTerm);
    return matchStatus && matchSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'expired': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">保单管理</h1>
          <p className="text-gray-500 mt-1">查看和管理您的所有保单</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refreshData()} disabled={isLoading}>
            <svg className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            刷新
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            导出保单
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse" />
                  <div className="flex-1">
                    <div className="h-7 w-16 bg-gray-200 rounded animate-pulse mb-1" />
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          [
            { label: '全部保单', value: policies.length, color: 'bg-blue-100 text-blue-600' },
            { label: '保障中', value: policies.filter(p => p.status === 'active').length, color: 'bg-green-100 text-green-600' },
            { label: '即将到期', value: 2, color: 'bg-amber-100 text-amber-600' },
            { label: '总保障额', value: '500万+', color: 'bg-purple-100 text-purple-600' }
          ].map((stat, idx) => (
            <Card key={idx}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', stat.color)}>
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索保单号或产品名称..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {statusFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedStatus(filter.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedStatus === filter.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Policy List */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <Card key={idx}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gray-200 rounded-xl animate-pulse flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
                        <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                      </div>
                      <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="flex flex-wrap gap-4">
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 md:gap-8">
                    <div className="text-right">
                      <div className="h-4 w-8 bg-gray-200 rounded animate-pulse mb-1" />
                      <div className="h-7 w-20 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="text-right">
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-1" />
                      <div className="h-7 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="hidden md:flex gap-2">
                      <div className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse" />
                      <div className="h-9 w-16 bg-gray-200 rounded-lg animate-pulse" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredPolicies.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">暂无保单数据</p>
            </CardContent>
          </Card>
        ) : (
          filteredPolicies.map((policy) => {
            const status = getStatusBadge(policy.status);
            return (
              <Card key={policy.id} hover onClick={() => { setSelectedPolicy(policy); setShowDetail(true); }}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg text-gray-900">{policy.productName}</h3>
                          <Badge variant={status.variant}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(policy.status)}
                              {status.label}
                            </span>
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">保单号：{policy.policyNo}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {policy.startDate} 至 {policy.endDate}
                          </span>
                          <span>被保人：{policy.insuredName}</span>
                          <span>受益人：{policy.beneficiary}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 md:gap-8">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">保额</p>
                        <p className="text-xl font-bold text-gray-900">¥{(policy.amount / 10000).toFixed(0)}万</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">年缴保费</p>
                        <p className="text-xl font-bold text-blue-600">¥{policy.premium.toLocaleString()}</p>
                      </div>
                      <div className="hidden md:flex gap-2">
                        <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); }}>
                          <Eye className="w-4 h-4 mr-1" />
                          查看详情
                        </Button>
                        <Button size="sm">续保</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Policy Detail Modal */}
      {showDetail && selectedPolicy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">保单详情</h3>
              <button onClick={() => setShowDetail(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Policy Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold">{selectedPolicy.productName}</h4>
                    <p className="text-blue-100 mt-1">保单号：{selectedPolicy.policyNo}</p>
                  </div>
                  <Badge variant="success" className="bg-white/20 text-white">保障中</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
                  <div>
                    <p className="text-blue-200 text-sm">保额</p>
                    <p className="text-2xl font-bold">¥{(selectedPolicy.amount / 10000).toFixed(0)}万</p>
                  </div>
                  <div>
                    <p className="text-blue-200 text-sm">年缴保费</p>
                    <p className="text-2xl font-bold">¥{selectedPolicy.premium}</p>
                  </div>
                  <div>
                    <p className="text-blue-200 text-sm">保障期限</p>
                    <p className="text-lg font-bold">1年</p>
                  </div>
                </div>
              </div>

              {/* Policy Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">被保人</p>
                  <p className="font-medium text-gray-900">{selectedPolicy.insuredName}</p>
                  <p className="text-sm text-gray-500 mt-1">{selectedPolicy.insuredIdCard}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">受益人</p>
                  <p className="font-medium text-gray-900">{selectedPolicy.beneficiary}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">起保日期</p>
                  <p className="font-medium text-gray-900">{selectedPolicy.startDate}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">到期日期</p>
                  <p className="font-medium text-gray-900">{selectedPolicy.endDate}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  下载电子保单
                </Button>
                <Button className="flex-1">立即续保</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
