import { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Upload,
  X,
  Calendar,
  MapPin,
  DollarSign,
  Shield,
  User,
  Camera,
  Check,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge, getStatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAppStore } from '@/store';
import type { Claim, Policy } from '@/types';

const statusFilters = [
  { id: 'all', label: '全部' },
  { id: 'pending', label: '待提交' },
  { id: 'reviewing', label: '审核中' },
  { id: 'approved', label: '已通过' },
  { id: 'rejected', label: '已拒绝' },
  { id: 'paid', label: '已赔付' }
];

const accidentTypes = [
  { id: 'medical', label: '医疗就诊' },
  { id: 'accident', label: '意外伤害' },
  { id: 'critical_illness', label: '重大疾病' },
  { id: 'hospital', label: '住院津贴' },
  { id: 'surgery', label: '手术费用' },
  { id: 'other', label: '其他' }
];

const approvalLevels = [
  { level: 0, name: '系统初审', description: '金额≤5000元自动通过' },
  { level: 1, name: '区域主管', description: '5000元<金额≤30000元' },
  { level: 2, name: '总监终审', description: '金额>30000元' }
];

export default function ClaimCenter() {
  const { claims, policies, createClaim, currentUser } = useAppStore();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [activeTab, setActiveTab] = useState<'policy' | 'info' | 'upload'>('policy');

  const [formData, setFormData] = useState({
    policyId: '',
    accidentType: '',
    accidentDate: '',
    accidentLocation: '',
    amount: '',
    description: '',
    materials: [] as string[]
  });

  const userPolicies = policies.filter(p => p.status === 'active' && p.userId === currentUser?.id);

  const filteredClaims = claims.filter(c => {
    const matchStatus = selectedStatus === 'all' || c.status === selectedStatus;
    const matchSearch = c.claimNo.includes(searchTerm) || c.policyNo.includes(searchTerm);
    const matchUser = c.userId === currentUser?.id;
    return matchStatus && matchSearch && matchUser;
  });

  const getClaimStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'reviewing': return <AlertCircle className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getAccidentTypeLabel = (type: string) => {
    const found = accidentTypes.find(a => a.id === type);
    return found?.label || type;
  };

  const handleFileUpload = () => {
    const mockFiles = ['证明材料_' + Date.now() + '.jpg'];
    setFormData(prev => ({
      ...prev,
      materials: [...prev.materials, ...mockFiles]
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }));
  };

  const getApprovalLevel = (amount: number) => {
    if (amount <= 5000) return 0;
    if (amount <= 30000) return 1;
    return 2;
  };

  const handleSubmitClaim = async () => {
    const selectedPolicy = policies.find(p => p.id === formData.policyId);
    if (!selectedPolicy) return;

    const amount = parseFloat(formData.amount);

    await createClaim(
      formData.policyId,
      amount,
      formData.accidentType,
      formData.accidentDate,
      formData.description,
      formData.materials
    );

    setShowCreateModal(false);
    setFormData({
      policyId: '',
      accidentType: '',
      accidentDate: '',
      accidentLocation: '',
      amount: '',
      description: '',
      materials: []
    });
    setActiveTab('policy');
  };

  const viewProgress = (claim: Claim) => {
    setSelectedClaim(claim);
    setShowProgressModal(true);
  };

  const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">理赔中心</h1>
          <p className="text-gray-500 mt-1">申请理赔、查看进度、管理您的理赔案件</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          新建理赔申请
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '全部申请', value: filteredClaims.length, color: 'bg-blue-100 text-blue-600', icon: FileText },
          { label: '审核中', value: filteredClaims.filter(c => c.status === 'reviewing').length, color: 'bg-amber-100 text-amber-600', icon: Clock },
          { label: '已赔付', value: filteredClaims.filter(c => c.status === 'paid').length, color: 'bg-green-100 text-green-600', icon: CheckCircle },
          { label: '累计赔付', value: '¥' + filteredClaims.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0).toLocaleString(), color: 'bg-purple-100 text-purple-600', icon: DollarSign }
        ].map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索理赔号或保单号..."
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
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                    selectedStatus === filter.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              理赔金额分级审批规则
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {approvalLevels.map((level, idx) => (
                <div key={level.level} className="bg-white rounded-lg p-3 flex items-center gap-3">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold',
                    idx === 0 ? 'bg-green-500' : idx === 1 ? 'bg-blue-500' : 'bg-purple-500'
                  )}>
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{level.name}</p>
                    <p className="text-xs text-gray-500">{level.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredClaims.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">暂无理赔申请记录</p>
              <Button className="mt-4" onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                发起第一笔理赔
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredClaims.map((claim) => {
            const status = getStatusBadge(claim.status);
            return (
              <Card key={claim.id} hover onClick={() => viewProgress(claim)}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg text-gray-900">{getAccidentTypeLabel(claim.accidentType)}</h3>
                          <Badge variant={status.variant}>
                            <span className="flex items-center gap-1">
                              {getClaimStatusIcon(claim.status)}
                              {status.label}
                            </span>
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">理赔号：{claim.claimNo} | 保单号：{claim.policyNo}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            事故日期：{claim.accidentDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            当前审批：{claim.currentApprover || '系统'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 md:gap-8">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">申请金额</p>
                        <p className="text-xl font-bold text-gray-900">¥{claim.amount.toLocaleString()}</p>
                      </div>
                      <div className="hidden md:flex items-center gap-2 text-blue-600">
                        <span className="text-sm font-medium">查看进度</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-900">新建理赔申请</h3>
              <button onClick={() => { setShowCreateModal(false); setActiveTab('policy'); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="px-6 pt-4">
              <div className="flex items-center justify-between mb-6">
                {['选择保单', '事故信息', '上传材料'].map((tab, idx) => (
                  <div key={tab} className="flex items-center">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                      (idx === 0 && activeTab === 'policy') || (idx === 1 && activeTab === 'info') || (idx === 2 && activeTab === 'upload')
                        ? 'bg-blue-600 text-white'
                        : (idx === 0 && activeTab !== 'policy') || (idx === 1 && activeTab === 'upload')
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                    )}>
                      {(idx === 0 && activeTab !== 'policy') || (idx === 1 && activeTab === 'upload') ? <Check className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span className={cn(
                      'ml-2 text-sm font-medium hidden sm:inline',
                      (idx === 0 && activeTab === 'policy') || (idx === 1 && activeTab === 'info') || (idx === 2 && activeTab === 'upload')
                        ? 'text-blue-600'
                        : 'text-gray-500'
                    )}>{tab}</span>
                    {idx < 2 && <div className={cn('w-8 sm:w-16 h-0.5 mx-2', idx === 0 && activeTab !== 'policy' ? 'bg-green-500' : idx === 1 && activeTab === 'upload' ? 'bg-green-500' : 'bg-gray-200')} />}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 pt-2">
              {activeTab === 'policy' && (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-4">请选择要理赔的保单（仅显示有效保单）</p>
                  {userPolicies.length === 0 ? (
                    <div className="text-center py-8">
                      <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">暂无有效保单</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {userPolicies.map((policy) => (
                        <div
                          key={policy.id}
                          onClick={() => setFormData(prev => ({ ...prev, policyId: policy.id }))}
                          className={cn(
                            'p-4 border-2 rounded-xl cursor-pointer transition-all',
                            formData.policyId === policy.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{policy.productName}</p>
                                <p className="text-sm text-gray-500">保单号：{policy.policyNo}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">¥{(policy.amount / 10000).toFixed(0)}万</p>
                              <p className="text-xs text-gray-500">保额</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'info' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">事故类型</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {accidentTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setFormData(prev => ({ ...prev, accidentType: type.id }))}
                          className={cn(
                            'p-3 border-2 rounded-lg text-sm font-medium transition-all',
                            formData.accidentType === type.id
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          )}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        事故日期
                      </label>
                      <input
                        type="date"
                        value={formData.accidentDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, accidentDate: e.target.value }))}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        事故地点
                      </label>
                      <input
                        type="text"
                        placeholder="请输入事故发生地点"
                        value={formData.accidentLocation}
                        onChange={(e) => setFormData(prev => ({ ...prev, accidentLocation: e.target.value }))}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      理赔金额（元）
                    </label>
                    <input
                      type="number"
                      placeholder="请输入申请理赔金额"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formData.amount && (
                      <p className="mt-2 text-sm text-gray-500">
                        审批级别：
                        <span className="font-medium text-blue-600">
                          {parseFloat(formData.amount) <= 5000 ? '系统自动审批（≤5000元）' :
                            parseFloat(formData.amount) <= 30000 ? '区域主管审批（5000-30000元）' :
                              '总监终审（>30000元）'}
                        </span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">事故详情描述</label>
                    <textarea
                      rows={4}
                      placeholder="请详细描述事故经过、诊断结果等信息..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'upload' && (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-4">请上传相关证明材料（如发票、诊断书、出院小结等）</p>

                  <div
                    onClick={handleFileUpload}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-700 font-medium">点击上传照片或证明材料</p>
                    <p className="text-sm text-gray-500 mt-1">支持 JPG、PNG、PDF 格式</p>
                  </div>

                  {formData.materials.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">已上传材料</p>
                      {formData.materials.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-700">{file}</span>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <X className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
                    <h4 className="font-medium text-amber-800 mb-2">温馨提示</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• 请确保上传的材料清晰可辨</li>
                      <li>• 医疗类理赔请上传：诊断证明、费用发票、费用清单</li>
                      <li>• 意外类理赔请上传：事故证明、伤残鉴定报告</li>
                      <li>• 材料越齐全，理赔速度越快</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              {activeTab !== 'policy' && (
                <Button
                  variant="outline"
                  onClick={() => setActiveTab(activeTab === 'info' ? 'policy' : 'info')}
                >
                  上一步
                </Button>
              )}
              <div className="flex-1" />
              {activeTab !== 'upload' ? (
                <Button
                  onClick={() => setActiveTab(activeTab === 'policy' ? 'info' : 'upload')}
                  disabled={activeTab === 'policy' && !formData.policyId}
                >
                  下一步
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmitClaim}
                  disabled={!formData.accidentType || !formData.accidentDate || !formData.amount}
                >
                  <Check className="w-4 h-4 mr-2" />
                  提交理赔申请
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {showProgressModal && selectedClaim && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-900">理赔进度详情</h3>
              <button onClick={() => setShowProgressModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold">{getAccidentTypeLabel(selectedClaim.accidentType)}</h4>
                    <p className="text-orange-100 mt-1">理赔号：{selectedClaim.claimNo}</p>
                  </div>
                  <Badge variant={selectedClaim.status === 'paid' ? 'success' : selectedClaim.status === 'rejected' ? 'danger' : 'warning'} className="bg-white/20 text-white">
                    {getStatusBadge(selectedClaim.status).label}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/20">
                  <div>
                    <p className="text-orange-200 text-sm">申请金额</p>
                    <p className="text-2xl font-bold">¥{selectedClaim.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-orange-200 text-sm">审批级别</p>
                    <p className="text-lg font-bold">
                      {selectedClaim.approvalLevel === 0 ? '系统自动审批' :
                        selectedClaim.approvalLevel === 1 ? '区域主管审批' : '总监终审'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">审批进度</h4>
                <div className="relative">
                  {approvalLevels.map((level, idx) => {
                    const isCompleted = selectedClaim.status === 'paid' || selectedClaim.status === 'approved'
                      ? idx <= selectedClaim.approvalLevel
                      : idx < selectedClaim.approvalLevel;
                    const isCurrent = idx === selectedClaim.approvalLevel && selectedClaim.status === 'reviewing';

                    return (
                      <div key={level.level} className="flex items-start gap-4 pb-6 last:pb-0">
                        <div className="relative flex flex-col items-center">
                          <div className={cn(
                            'w-10 h-10 rounded-full flex items-center justify-center z-10',
                            isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-gray-200'
                          )}>
                            {isCompleted ? (
                              <Check className="w-5 h-5 text-white" />
                            ) : (
                              <span className={cn('text-sm font-bold', isCurrent ? 'text-white' : 'text-gray-500')}>{idx + 1}</span>
                            )}
                          </div>
                          {idx < approvalLevels.length - 1 && (
                            <div className={cn(
                              'w-0.5 h-full absolute top-10',
                              isCompleted ? 'bg-green-500' : 'bg-gray-200'
                            )} />
                          )}
                        </div>
                        <div className="flex-1 pb-2">
                          <div className="flex items-center gap-2">
                            <h5 className={cn(
                              'font-medium',
                              isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'
                            )}>{level.name}</h5>
                            {isCurrent && <Badge variant="info">处理中</Badge>}
                          </div>
                          <p className={cn('text-sm mt-1', isCompleted || isCurrent ? 'text-gray-500' : 'text-gray-400')}>
                            {level.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">审批记录</h4>
                <div className="space-y-3">
                  {selectedClaim.approvalHistory.map((record, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-900">{record.approver}</span>
                        </div>
                        <Badge variant={record.status === 'approved' ? 'success' : record.status === 'rejected' ? 'danger' : 'warning'}>
                          {getStatusBadge(record.status).label}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{record.comment}</p>
                      <p className="text-xs text-gray-400 mt-2">{record.time}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">保单号</p>
                  <p className="font-medium text-gray-900">{selectedClaim.policyNo}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">事故日期</p>
                  <p className="font-medium text-gray-900">{selectedClaim.accidentDate}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl col-span-2">
                  <p className="text-sm text-gray-500 mb-1">事故描述</p>
                  <p className="font-medium text-gray-900">{selectedClaim.description}</p>
                </div>
              </div>

              {selectedClaim.materials.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">证明材料</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {selectedClaim.materials.map((material, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700 truncate">{material}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
