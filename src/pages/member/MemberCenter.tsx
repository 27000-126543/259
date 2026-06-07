import { useState, useEffect } from 'react';
import {
  Crown,
  ChevronLeft,
  ChevronRight,
  Percent,
  Clock,
  Car,
  Heart,
  Gift,
  Star,
  Shield,
  TrendingUp,
  CheckCircle2,
  Info,
  Phone,
  Calendar,
  Award,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge, getMemberLevelInfo } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';

const memberBenefits = [
  {
    icon: Percent,
    title: '保费折扣',
    description: '享受专属保费折扣优惠',
    levels: ['silver', 'gold', 'diamond'],
    discount: { silver: '95折', gold: '9折', diamond: '85折' }
  },
  {
    icon: Clock,
    title: '优先理赔',
    description: '理赔申请优先审核处理',
    levels: ['gold', 'diamond'],
    extra: { gold: '24小时内响应', diamond: '12小时内响应' }
  },
  {
    icon: Car,
    title: '免费救援',
    description: '全年免费道路救援服务',
    levels: ['gold', 'diamond'],
    extra: { gold: '3次/年', diamond: '无限次' }
  },
  {
    icon: Heart,
    title: '健康体检',
    description: '年度免费健康体检套餐',
    levels: ['diamond'],
    extra: { diamond: '价值1000元体检' }
  },
  {
    icon: Gift,
    title: '生日礼遇',
    description: '专属生日礼品和祝福',
    levels: ['gold', 'diamond'],
    extra: { gold: '精美礼品', diamond: '豪华礼包' }
  },
  {
    icon: Phone,
    title: '专属客服',
    description: '一对一专属客服顾问',
    levels: ['diamond'],
    extra: { diamond: '7x24小时服务' }
  },
  {
    icon: Calendar,
    title: '节日福利',
    description: '重要节日专属福利活动',
    levels: ['silver', 'gold', 'diamond'],
    extra: { silver: '精选优惠', gold: '专属活动', diamond: 'VIP专场' }
  },
  {
    icon: Shield,
    title: '意外保障',
    description: '额外赠送意外保险',
    levels: ['gold', 'diamond'],
    extra: { gold: '10万保额', diamond: '50万保额' }
  }
];

const exclusiveGifts = [
  {
    id: 1,
    title: '高端体检套餐',
    description: '钻石会员专享，价值1000元',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20health%20checkup%20package%20medical%20examination&image_size=landscape_16_9',
    requiredLevel: 'diamond'
  },
  {
    id: 2,
    title: '机场贵宾厅服务',
    description: '全年12次免费机场贵宾厅',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=airport%20vip%20lounge%20luxury%20comfortable&image_size=landscape_16_9',
    requiredLevel: 'diamond'
  },
  {
    id: 3,
    title: '专属理财顾问',
    description: '一对一专业理财咨询服务',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=financial%20advisor%20consulting%20professional%20meeting&image_size=landscape_16_9',
    requiredLevel: 'gold'
  },
  {
    id: 4,
    title: '节日专属礼盒',
    description: '中秋/春节定制精美礼盒',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20gift%20box%20festival%20celebration%20premium&image_size=landscape_16_9',
    requiredLevel: 'gold'
  },
  {
    id: 5,
    title: '会员专属活动',
    description: '线下高端沙龙、品鉴会',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=exclusive%20vip%20event%20gala%20dinner%20elegant&image_size=landscape_16_9',
    requiredLevel: 'diamond'
  }
];

const growthRules = [
  {
    icon: TrendingUp,
    title: '保费积累',
    description: '每缴纳1元保费获得1成长值',
    points: '1元 = 1成长值'
  },
  {
    icon: Award,
    title: '保单续保',
    description: '成功续保保单额外奖励成长值',
    points: '+500成长值/次'
  },
  {
    icon: Zap,
    title: '推荐好友',
    description: '推荐好友成功投保获得奖励',
    points: '+200成长值/人'
  },
  {
    icon: Star,
    title: '活动奖励',
    description: '参与平台活动获得额外成长值',
    points: '100-1000成长值'
  }
];

const levelThresholds = {
  silver: { min: 0, max: 9999, label: '银卡会员' },
  gold: { min: 10000, max: 49999, label: '金卡会员' },
  diamond: { min: 50000, max: Infinity, label: '钻石会员' }
};

export default function MemberCenter() {
  const { currentUser, getMemberUpgradeProgress } = useAppStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const [upgradeProgress, setUpgradeProgress] = useState<{
    current: string;
    next: string | null;
    progress: number;
    required: string;
  } | null>(null);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  const memberInfo = getMemberLevelInfo(currentUser?.memberLevel || 'silver');
  const currentGrowth = currentUser?.annualPremium || 0;

  const filteredGifts = exclusiveGifts.filter(gift => {
    const level = currentUser?.memberLevel || 'silver';
    if (gift.requiredLevel === 'diamond') return level === 'diamond';
    if (gift.requiredLevel === 'gold') return level === 'gold' || level === 'diamond';
    return true;
  });

  useEffect(() => {
    const fetchUpgradeProgress = async () => {
      setIsLoadingProgress(true);
      try {
        const progress = await getMemberUpgradeProgress();
        setUpgradeProgress(progress);
      } catch (error) {
        console.error('获取升级进度失败:', error);
      } finally {
        setIsLoadingProgress(false);
      }
    };

    fetchUpgradeProgress();
  }, [getMemberUpgradeProgress]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.max(filteredGifts.length, 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [filteredGifts.length]);

  const prevSlide = () => {
    setAnimationKey(prev => prev + 1);
    setCurrentSlide((prev) => (prev - 1 + filteredGifts.length) % filteredGifts.length);
  };

  const nextSlide = () => {
    setAnimationKey(prev => prev + 1);
    setCurrentSlide((prev) => (prev + 1) % filteredGifts.length);
  };

  const hasBenefit = (benefitLevels: string[]) => {
    const level = currentUser?.memberLevel || 'silver';
    return benefitLevels.includes(level);
  };

  const getBenefitDetail = (benefit: typeof memberBenefits[0]) => {
    const level = currentUser?.memberLevel || 'silver';
    if (benefit.discount) {
      return benefit.discount[level as keyof typeof benefit.discount];
    }
    if (benefit.extra) {
      return benefit.extra[level as keyof typeof benefit.extra];
    }
    return '';
  };

  const getLevelIconColor = (level: string) => {
    const colors: Record<string, string> = {
      silver: 'from-gray-300 to-gray-400',
      gold: 'from-amber-400 to-amber-500',
      diamond: 'from-blue-400 to-cyan-400'
    };
    return colors[level] || colors.silver;
  };

  return (
    <div className="space-y-6">
      {/* Member Level Card */}
      <Card className={cn(
        'border-0 overflow-hidden relative',
        currentUser?.memberLevel === 'diamond' ? 'bg-gradient-to-r from-blue-600 to-cyan-500' :
        currentUser?.memberLevel === 'gold' ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
        'bg-gradient-to-r from-gray-500 to-gray-600'
      )}>
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute right-40 bottom-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />
        <CardContent className="p-8 relative text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/80">尊敬的会员</p>
              <h1 className="text-3xl font-bold mt-1">{currentUser?.name}</h1>
              <div className="flex items-center gap-3 mt-4">
                <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br', getLevelIconColor(currentUser?.memberLevel || 'silver'))}>
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold">{memberInfo.label}</p>
                  <p className="text-white/70 text-sm">会员ID: {currentUser?.id}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">当前成长值</p>
              <p className="text-4xl font-bold mt-1">{currentGrowth.toLocaleString()}</p>
              <p className="text-white/70 text-sm mt-1">累计保费 ¥{currentGrowth.toLocaleString()}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80 text-sm">升级进度</span>
              {isLoadingProgress ? (
                <span className="text-white/80 text-sm">加载中...</span>
              ) : upgradeProgress?.next ? (
                <span className="text-white/80 text-sm">
                  {upgradeProgress.required}
                </span>
              ) : (
                <span className="text-white/80 text-sm">已达最高等级</span>
              )}
            </div>
            <div className="relative h-4 bg-white/20 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-white rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${isLoadingProgress ? 0 : upgradeProgress?.progress || 0}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-white drop-shadow">
                  {isLoadingProgress ? '加载中...' : `${(upgradeProgress?.progress || 0).toFixed(1)}%`}
                </span>
              </div>
            </div>

            {/* Level Markers */}
            <div className="flex justify-between mt-4">
              {Object.entries(levelThresholds).map(([key, threshold]) => {
                const isActive = currentUser?.memberLevel === key ||
                  (currentUser?.memberLevel === 'gold' && key === 'silver') ||
                  (currentUser?.memberLevel === 'diamond' && (key === 'silver' || key === 'gold'));
                const isCurrent = currentUser?.memberLevel === key;
                return (
                  <div key={key} className="flex flex-col items-center">
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center transition-all',
                      isCurrent ? 'bg-white scale-125' : isActive ? 'bg-white/60' : 'bg-white/30'
                    )}>
                      {isActive && <CheckCircle2 className="w-4 h-4 text-current" style={{ color: isCurrent ? '#10B981' : 'white' }} />}
                    </div>
                    <span className={cn('text-xs mt-1.5', isCurrent ? 'font-bold' : 'text-white/60')}>
                      {threshold.label}
                    </span>
                    <span className="text-xs text-white/50">
                      {threshold.max === Infinity ? '50000+' : `${threshold.min}-${threshold.max}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Member Benefits Grid */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">会员权益</h3>
            <p className="text-sm text-gray-500">当前等级可享受以下专属权益</p>
          </div>
          <Badge variant="info">共 {memberBenefits.filter(b => hasBenefit(b.levels)).length} 项</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {memberBenefits.map((benefit, idx) => {
              const available = hasBenefit(benefit.levels);
              return (
                <div
                  key={idx}
                  className={cn(
                    'p-5 rounded-xl border-2 transition-all duration-300',
                    available
                      ? 'border-blue-100 bg-gradient-to-br from-blue-50 to-white hover:border-blue-300 hover:shadow-md'
                      : 'border-gray-100 bg-gray-50 opacity-60'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                      available ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gray-300'
                    )}>
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{benefit.title}</h4>
                        {available ? (
                          <Badge variant="success" className="text-xs">已开通</Badge>
                        ) : (
                          <Badge variant="default" className="text-xs">未开通</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{benefit.description}</p>
                      {available && getBenefitDetail(benefit) && (
                        <p className="text-sm font-medium text-blue-600 mt-2">
                          {getBenefitDetail(benefit)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Exclusive Gifts Carousel */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">专属礼遇</h3>
            <p className="text-sm text-gray-500">为您精心挑选的会员专属礼品</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevSlide}
              disabled={filteredGifts.length <= 1}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextSlide}
              disabled={filteredGifts.length <= 1}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-hidden">
            {filteredGifts.length > 0 ? (
              <>
                <div
                  key={animationKey}
                  className="relative h-64 rounded-2xl overflow-hidden"
                  style={{ animation: 'fadeIn 0.5s ease-out' }}
                >
                  <img
                    src={filteredGifts[currentSlide].image}
                    alt={filteredGifts[currentSlide].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-white/20 text-white border-0">
                        {getMemberLevelInfo(filteredGifts[currentSlide].requiredLevel).label}专享
                      </Badge>
                    </div>
                    <h4 className="text-2xl font-bold">{filteredGifts[currentSlide].title}</h4>
                    <p className="text-white/80 mt-1">{filteredGifts[currentSlide].description}</p>
                    <Button variant="secondary" size="sm" className="mt-4">
                      <Gift className="w-4 h-4 mr-1.5" />
                      立即领取
                    </Button>
                  </div>
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-4">
                  {filteredGifts.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setAnimationKey(prev => prev + 1);
                        setCurrentSlide(idx);
                      }}
                      className={cn(
                        'w-2 h-2 rounded-full transition-all',
                        idx === currentSlide ? 'bg-blue-600 w-6' : 'bg-gray-300 hover:bg-gray-400'
                      )}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Gift className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>暂无可用礼遇</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Growth Rules */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Info className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">成长规则</h3>
              <p className="text-sm text-gray-500">了解如何获取成长值，升级会员等级</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {growthRules.map((rule, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-amber-200 hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <rule.icon className="w-6 h-6 text-amber-600" />
                </div>
                <h4 className="font-semibold text-gray-900">{rule.title}</h4>
                <p className="text-sm text-gray-500 mt-1.5">{rule.description}</p>
                <div className="mt-3 px-3 py-1.5 bg-amber-50 rounded-lg inline-block">
                  <span className="text-sm font-medium text-amber-700">{rule.points}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Level Thresholds Table */}
          <div className="mt-6 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-4">等级对照表</h4>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(levelThresholds).map(([key, threshold]) => (
                <div
                  key={key}
                  className={cn(
                    'p-4 rounded-xl text-center',
                    currentUser?.memberLevel === key
                      ? 'bg-white shadow-md ring-2 ring-blue-500'
                      : 'bg-white/60'
                  )}
                >
                  <div className={cn(
                    'w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 bg-gradient-to-br',
                    getLevelIconColor(key)
                  )}>
                    <Crown className="w-7 h-7 text-white" />
                  </div>
                  <h5 className="font-semibold text-gray-900">{threshold.label}</h5>
                  <p className="text-sm text-gray-500 mt-1">
                    成长值 {threshold.max === Infinity ? `${threshold.min}+` : `${threshold.min}-${threshold.max}`}
                  </p>
                  {currentUser?.memberLevel === key && (
                    <Badge variant="success" className="mt-2">当前等级</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
