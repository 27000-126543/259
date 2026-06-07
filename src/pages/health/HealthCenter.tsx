import { useState } from 'react';
import {
  Heart,
  Activity,
  Upload,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  FileText,
  Droplets,
  Wind,
  Scale,
  Clock,
  ChevronRight,
  Plus,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import type { HealthIndicator, RiskLevel } from '@/types';

const getRiskLevelInfo = (level: RiskLevel) => {
  const levelMap: Record<RiskLevel, { label: string; color: string; bgColor: string; textColor: string }> = {
    low: { label: '低风险', color: 'text-green-600', bgColor: 'bg-green-100', textColor: 'text-green-700' },
    medium: { label: '中风险', color: 'text-amber-600', bgColor: 'bg-amber-100', textColor: 'text-amber-700' },
    high: { label: '高风险', color: 'text-red-600', bgColor: 'bg-red-100', textColor: 'text-red-700' }
  };
  return levelMap[level];
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-amber-600';
  return 'text-red-600';
};

const getScoreBgColor = (score: number) => {
  if (score >= 80) return 'from-green-500 to-emerald-500';
  if (score >= 60) return 'from-amber-500 to-orange-500';
  return 'from-red-500 to-rose-500';
};

const indicatorIcons: Record<string, typeof Heart> = {
  '血压': Activity,
  '血糖': Droplets,
  '胆固醇': Activity,
  'BMI': Scale,
  '心率': Wind
};

export default function HealthCenter() {
  const { currentUser, healthReports, addHealthReport } = useAppStore();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const latestReport = healthReports.find(r => r.userId === currentUser?.id) || null;
  const abnormalIndicators = latestReport?.indicators.filter(i => i.isAbnormal) || [];

  const radarData = latestReport?.indicators.map(indicator => {
    const normalizedValue = indicator.isAbnormal ? 60 : 90;
    return {
      subject: indicator.name,
      value: normalizedValue,
      fullMark: 100
    };
  }) || [];

  const handleUpload = async () => {
    setUploading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const newReport = {
      id: `hr${Date.now()}`,
      userId: currentUser?.id || '',
      reportDate: new Date().toISOString().split('T')[0],
      score: Math.floor(Math.random() * 30) + 70,
      riskLevel: 'medium' as RiskLevel,
      indicators: [
        { name: '血压', value: 128, unit: 'mmHg', normalRange: '90-140', isAbnormal: false },
        { name: '血糖', value: 5.9, unit: 'mmol/L', normalRange: '3.9-6.1', isAbnormal: false },
        { name: '胆固醇', value: 5.2, unit: 'mmol/L', normalRange: '<5.2', isAbnormal: false },
        { name: 'BMI', value: 24.8, unit: 'kg/m²', normalRange: '18.5-23.9', isAbnormal: true },
        { name: '心率', value: 75, unit: 'bpm', normalRange: '60-100', isAbnormal: false }
      ],
      suggestions: [
        '建议保持规律的作息时间，每天保证7-8小时睡眠',
        '增加蔬菜水果摄入，减少高油高盐食物',
        '每周进行至少150分钟的中等强度有氧运动',
        '建议每3个月复查一次BMI指标',
        '保持良好心态，避免过度焦虑和压力'
      ]
    };
    await addHealthReport(newReport);
    setUploading(false);
    setShowUploadModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">健康管理中心</h1>
          <p className="text-gray-500 mt-1">全面追踪您的健康状况，获取专业改善建议</p>
        </div>
        <Button onClick={() => setShowUploadModal(true)}>
          <Upload className="w-4 h-4 mr-2" />
          上传体检报告
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Health Score Dashboard */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">健康评分</h3>
              <p className="text-sm text-gray-500">基于最新体检报告综合评估</p>
            </CardHeader>
            <CardContent>
              {latestReport ? (
                <div className="flex items-center gap-8">
                  {/* Score Gauge */}
                  <div className="relative w-48 h-48 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="16"
                      />
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="url(#scoreGradient)"
                        strokeWidth="16"
                        strokeLinecap="round"
                        strokeDasharray={`${(latestReport.score / 100) * 502.4} 502.4`}
                      />
                      <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={latestReport.score >= 80 ? '#10B981' : latestReport.score >= 60 ? '#F59E0B' : '#EF4444'} />
                          <stop offset="100%" stopColor={latestReport.score >= 80 ? '#059669' : latestReport.score >= 60 ? '#D97706' : '#DC2626'} />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-5xl font-bold ${getScoreColor(latestReport.score)}`}>
                        {latestReport.score}
                      </span>
                      <span className="text-gray-500 text-sm mt-1">/100分</span>
                    </div>
                  </div>

                  {/* Score Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${getRiskLevelInfo(latestReport.riskLevel).bgColor} ${getRiskLevelInfo(latestReport.riskLevel).textColor}`}>
                        {getRiskLevelInfo(latestReport.riskLevel).label}
                      </span>
                      <span className="text-gray-500 text-sm">
                        报告日期：{latestReport.reportDate}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">异常指标</span>
                        <span className="font-medium text-red-600">{abnormalIndicators.length} 项</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">正常指标</span>
                        <span className="font-medium text-green-600">
                          {latestReport.indicators.length - abnormalIndicators.length} 项
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">健康建议</span>
                        <span className="font-medium text-blue-600">{latestReport.suggestions.length} 条</span>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-blue-900">健康趋势</p>
                          <p className="text-sm text-blue-700 mt-1">
                            相比上次体检，您的健康评分有所提升，继续保持良好的生活习惯！
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">暂无体检报告</p>
                  <Button onClick={() => setShowUploadModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    上传第一份报告
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Health Indicators Radar Chart */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">健康指标分析</h3>
              <p className="text-sm text-gray-500">各项健康指标雷达图展示</p>
            </CardHeader>
            <CardContent>
              {radarData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="#E5E7EB" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                      <Radar
                        name="健康指数"
                        dataKey="value"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center">
                  <p className="text-gray-400">暂无数据</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Health Indicators Cards */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">健康指标详情</h3>
              <p className="text-sm text-gray-500">点击查看详细说明</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {latestReport?.indicators.map((indicator, idx) => (
                  <IndicatorCard key={idx} indicator={indicator} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Abnormal Indicators Alert */}
          {abnormalIndicators.length > 0 && (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h3 className="font-semibold text-amber-900">异常指标提醒</h3>
                </div>
                <p className="text-sm text-amber-700">
                  共 {abnormalIndicators.length} 项指标需要关注
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {abnormalIndicators.map((indicator, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-3 border border-amber-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{indicator.name}</span>
                      <Badge variant="warning">偏高</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-red-600 font-medium">
                        {indicator.value} {indicator.unit}
                      </span>
                      <span className="text-gray-400">|</span>
                      <span className="text-gray-500">
                        正常：{indicator.normalRange}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Health Suggestions */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">健康改善建议</h3>
              <p className="text-sm text-gray-500">
                基于您的体检报告生成
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {latestReport?.suggestions.map((suggestion, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-medium">{idx + 1}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{suggestion}</p>
                </div>
              ))}
              {!latestReport && (
                <p className="text-gray-400 text-center py-4">上传体检报告后获取建议</p>
              )}
            </CardContent>
          </Card>

          {/* Report History */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">体检报告记录</h3>
              <p className="text-sm text-gray-500">历史报告列表</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {healthReports.filter(r => r.userId === currentUser?.id).map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">体检报告</p>
                      <p className="text-xs text-gray-500">{report.reportDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${getScoreColor(report.score)}`}>
                      {report.score}分
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
              {healthReports.filter(r => r.userId === currentUser?.id).length === 0 && (
                <p className="text-gray-400 text-center py-4">暂无报告记录</p>
              )}
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" className="w-full" onClick={() => setShowUploadModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                添加新报告
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">上传体检报告</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="font-medium text-gray-900 mb-1">点击或拖拽文件上传</p>
                <p className="text-sm text-gray-500">支持 PDF、JPG、PNG 格式</p>
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">智能分析</p>
                    <p className="text-xs text-gray-500 mt-1">
                      系统将自动识别报告内容，生成健康评分和改善建议
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
              <Button variant="ghost" onClick={() => setShowUploadModal(false)}>
                取消
              </Button>
              <Button onClick={handleUpload} loading={uploading}>
                {uploading ? '分析中...' : '开始上传'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function IndicatorCard({ indicator }: { indicator: HealthIndicator }) {
  const Icon = indicatorIcons[indicator.name] || Heart;

  return (
    <div className={`p-4 rounded-xl border transition-all hover:shadow-md ${
      indicator.isAbnormal 
        ? 'border-red-200 bg-red-50 hover:bg-red-100' 
        : 'border-gray-100 bg-white hover:bg-gray-50'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          indicator.isAbnormal ? 'bg-red-100' : 'bg-blue-100'
        }`}>
          <Icon className={`w-5 h-5 ${indicator.isAbnormal ? 'text-red-600' : 'text-blue-600'}`} />
        </div>
        {indicator.isAbnormal ? (
          <Badge variant="danger">异常</Badge>
        ) : (
          <Badge variant="success">正常</Badge>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-1">{indicator.name}</p>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-bold ${indicator.isAbnormal ? 'text-red-600' : 'text-gray-900'}`}>
          {indicator.value}
        </span>
        <span className="text-sm text-gray-500">{indicator.unit}</span>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        正常范围：{indicator.normalRange}
      </p>
    </div>
  );
}
