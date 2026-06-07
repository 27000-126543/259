import { db, generateId, generatePolicyNo, generateClaimNo, formatDate, formatDateTime, addYears, addDays, daysBetween } from '@/db';
import type {
  User,
  Policy,
  Claim,
  HealthReport,
  Notification,
  TeamMember,
  Commission,
  InsuranceProduct,
  HealthIndicator,
  MemberLevel
} from '@/types';

export const COMMISSION_TIERS = [
  { minPremium: 0, maxPremium: 100000, rate: 0.15, label: '一级' },
  { minPremium: 100000, maxPremium: 300000, rate: 0.20, label: '二级' },
  { minPremium: 300000, maxPremium: 500000, rate: 0.25, label: '三级' },
  { minPremium: 500000, maxPremium: Infinity, rate: 0.30, label: '四级' }
];

export const MEMBER_LEVEL_RULES: { level: MemberLevel; minAnnualPremium: number; minRenewalCount: number }[] = [
  { level: 'silver', minAnnualPremium: 5000, minRenewalCount: 2 },
  { level: 'gold', minAnnualPremium: 20000, minRenewalCount: 5 },
  { level: 'diamond', minAnnualPremium: 50000, minRenewalCount: 10 }
];

export const CLAIM_APPROVAL_RULES = [
  { maxAmount: 5000, level: 0 as const, approver: '系统', autoApprove: true },
  { maxAmount: 30000, level: 1 as const, approver: '区域主管', autoApprove: false },
  { maxAmount: Infinity, level: 2 as const, approver: '总监', autoApprove: false }
];

export class InsuranceService {
  static async initData(): Promise<void> {
    const productCount = await db.count('products');
    if (productCount === 0) {
      const defaultProducts: InsuranceProduct[] = [
        {
          id: 'p1',
          name: '安心百万医疗险',
          category: 'health',
          description: '最高400万医疗保障，涵盖住院、手术、特殊门诊等全方位医疗费用',
          minAge: 0,
          maxAge: 65,
          minAmount: 1000000,
          maxAmount: 4000000,
          basePremium: 299,
          features: ['400万保额', '1万免赔额', '住院垫付', '绿通服务'],
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=medical%20health%20insurance%20blue%20card%20professional&image_size=square',
          hot: true,
          recommended: true
        },
        {
          id: 'p2',
          name: '守护重疾险',
          category: 'health',
          description: '覆盖120种重疾+30种轻症，确诊即赔，提供多次赔付保障',
          minAge: 0,
          maxAge: 55,
          minAmount: 100000,
          maxAmount: 1000000,
          basePremium: 1500,
          features: ['120种重疾', '30种轻症', '多次赔付', '豁免保费'],
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=critical%20illness%20insurance%20shield%20protection&image_size=square',
          hot: false,
          recommended: true
        },
        {
          id: 'p3',
          name: '驾乘无忧意外险',
          category: 'accident',
          description: '驾乘人员专属保障，覆盖自驾、乘坐各类交通工具的意外风险',
          minAge: 18,
          maxAge: 70,
          minAmount: 100000,
          maxAmount: 500000,
          basePremium: 199,
          features: ['50万意外身故', '10万意外医疗', '住院津贴', '紧急救援'],
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=car%20accident%20insurance%20safety%20driving&image_size=square',
          hot: true,
          recommended: false
        },
        {
          id: 'p4',
          name: '幸福人寿终身寿险',
          category: 'life',
          description: '终身保障，财富传承，合理规划家庭资产，保障家人未来',
          minAge: 0,
          maxAge: 70,
          minAmount: 100000,
          maxAmount: 5000000,
          basePremium: 3000,
          features: ['终身保障', '财富传承', '灵活领取', '保单贷款'],
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=life%20insurance%20family%20protection%20golden%20shield&image_size=square',
          hot: false,
          recommended: true
        },
        {
          id: 'p5',
          name: '少儿成长教育金',
          category: 'education',
          description: '专款专用，为孩子的教育提前规划，强制储蓄，稳健增值',
          minAge: 0,
          maxAge: 12,
          minAmount: 50000,
          maxAmount: 500000,
          basePremium: 5000,
          features: ['教育专款', '固定领取', '分红收益', '保费豁免'],
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=children%20education%20fund%20piggy%20bank%20books&image_size=square',
          hot: true,
          recommended: false
        },
        {
          id: 'p6',
          name: '安心养老年金险',
          category: 'pension',
          description: '提前规划养老生活，保证领取20年，与生命等长的现金流',
          minAge: 18,
          maxAge: 60,
          minAmount: 100000,
          maxAmount: 1000000,
          basePremium: 10000,
          features: ['终身领取', '保证20年', '灵活领取', '身故保障'],
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pension%20retirement%20insurance%20golden%20years&image_size=square',
          hot: false,
          recommended: true
        }
      ];

      for (const product of defaultProducts) {
        await db.add('products', product);
      }
    }

    const userCount = await db.count('users');
    if (userCount === 0) {
      const defaultUsers: User[] = [
        {
          id: '1',
          name: '张明',
          phone: '13800138001',
          email: 'zhangming@example.com',
          idCard: '110101199001011234',
          password: '123456',
          role: 'customer',
          memberLevel: 'gold',
          annualPremium: 25000,
          renewalCount: 3,
          createTime: formatDate(new Date())
        },
        {
          id: '2',
          name: '李华',
          phone: '13900139002',
          email: 'lihua@example.com',
          idCard: '310101198505055678',
          password: '123456',
          role: 'agent',
          memberLevel: 'diamond',
          annualPremium: 80000,
          renewalCount: 8,
          createTime: formatDate(new Date())
        },
        {
          id: '3',
          name: '王管',
          phone: '13700137003',
          email: 'admin@insurance.com',
          idCard: '110101198001010000',
          password: 'admin123',
          role: 'admin',
          memberLevel: 'diamond',
          annualPremium: 0,
          renewalCount: 0,
          createTime: formatDate(new Date())
        }
      ];

      for (const user of defaultUsers) {
        await db.add('users', user);
      }
    }
  }

  static async createUser(userData: Omit<User, 'id' | 'memberLevel' | 'annualPremium' | 'renewalCount' | 'createTime'>): Promise<User> {
    const newUser: User = {
      ...userData,
      id: generateId('u_'),
      memberLevel: 'silver',
      annualPremium: 0,
      renewalCount: 0,
      createTime: formatDate()
    };
    await db.add('users', newUser);
    return newUser;
  }

  static async login(phone: string, password: string): Promise<User | null> {
    const users = await db.getAll('users');
    const user = users.find(u => u.phone === phone && u.password === password);
    return user || null;
  }

  static async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const user = await db.getByKey('users', userId);
    if (!user) return null;
    
    const updated = { ...user, ...updates };
    await db.update('users', updated);
    return updated;
  }

  static async calculateMemberLevel(userId: string): Promise<MemberLevel> {
    const user = await db.getByKey('users', userId);
    if (!user) return 'silver';

    const policies = await db.getAll('policies', 'userId', userId);
    const activePolicies = policies.filter(p => p.status === 'active');
    const annualPremium = activePolicies.reduce((sum, p) => sum + p.premium, 0);
    const renewalCount = user.renewalCount;

    let level: MemberLevel = 'silver';
    for (const rule of MEMBER_LEVEL_RULES) {
      if (annualPremium >= rule.minAnnualPremium || renewalCount >= rule.minRenewalCount) {
        level = rule.level;
      }
    }

    if (user.memberLevel !== level) {
      await this.updateUser(userId, { memberLevel: level, annualPremium });
      await this.createNotification(userId, '会员升级通知', `恭喜您升级为${level === 'gold' ? '金卡' : level === 'diamond' ? '钻石' : '银卡'}会员，享受更多专属权益！`, 'success');
    }

    return level;
  }

  static async getMemberUpgradeProgress(userId: string): Promise<{ current: MemberLevel; next: MemberLevel | null; progress: number; required: string }> {
    const user = await db.getByKey('users', userId);
    if (!user) return { current: 'silver', next: 'gold', progress: 0, required: '年保费满20,000元' };

    const currentIdx = MEMBER_LEVEL_RULES.findIndex(r => r.level === user.memberLevel);
    const nextRule = MEMBER_LEVEL_RULES[currentIdx + 1];

    if (!nextRule) {
      return { current: user.memberLevel, next: null, progress: 100, required: '已达最高等级' };
    }

    const policies = await db.getAll('policies', 'userId', userId);
    const activePolicies = policies.filter(p => p.status === 'active');
    const annualPremium = activePolicies.reduce((sum, p) => sum + p.premium, 0);

    const progress = Math.min(100, (annualPremium / nextRule.minAnnualPremium) * 100);
    const required = `年保费满${nextRule.minAnnualPremium.toLocaleString()}元 或 续保${nextRule.minRenewalCount}次`;

    return { current: user.memberLevel, next: nextRule.level, progress, required };
  }

  static async createPolicy(
    userId: string,
    productId: string,
    insuredName: string,
    insuredIdCard: string,
    beneficiary: string,
    amount: number
  ): Promise<Policy> {
    const products = await db.getAll('products');
    const product = products.find(p => p.id === productId);
    if (!product) throw new Error('产品不存在');

    const premium = Math.round(product.basePremium * (amount / product.minAmount));
    const startDate = formatDate();
    const endDate = formatDate(addYears(new Date(), 1));

    const policy: Policy = {
      id: generateId('pol_'),
      policyNo: generatePolicyNo(),
      userId,
      productId,
      productName: product.name,
      insuredName,
      insuredIdCard,
      beneficiary,
      amount,
      premium,
      status: 'active',
      startDate,
      endDate,
      createTime: formatDate()
    };

    await db.add('policies', policy);
    await this.calculateMemberLevel(userId);
    await this.createNotification(userId, '承保通知', `您投保的【${product.name}】已成功承保，保单号：${policy.policyNo}`, 'success');

    return policy;
  }

  static async autoUnderwrite(
    userId: string,
    productId: string,
    insuredAge: number
  ): Promise<{ passed: boolean; reason?: string }> {
    const products = await db.getAll('products');
    const product = products.find(p => p.id === productId);
    if (!product) return { passed: false, reason: '产品不存在' };

    if (insuredAge < product.minAge || insuredAge > product.maxAge) {
      return { passed: false, reason: `被保人年龄不在承保范围内（${product.minAge}-${product.maxAge}岁）` };
    }

    return { passed: true };
  }

  static async createClaim(
    userId: string,
    policyId: string,
    amount: number,
    accidentType: string,
    accidentDate: string,
    description: string,
    materials: string[]
  ): Promise<Claim> {
    const policy = await db.getByKey('policies', policyId);
    if (!policy) throw new Error('保单不存在');

    let initialLevel: 0 | 1 | 2 = 0;
    let initialApprover = '系统';
    let initialStatus: 'reviewing' | 'approved' = 'reviewing';
    let initialComment = '';

    if (amount <= 5000) {
      initialLevel = 0;
      initialApprover = '系统';
      initialStatus = 'approved';
      initialComment = '材料齐全，金额在自动审批范围内，系统自动通过';
    } else if (amount <= 30000) {
      initialLevel = 1;
      initialApprover = '区域主管';
      initialStatus = 'reviewing';
      initialComment = '金额超过5,000元，需区域主管审批';
    } else {
      initialLevel = 1;
      initialApprover = '区域主管';
      initialStatus = 'reviewing';
      initialComment = '金额超过5,000元，先由区域主管审批，通过后将升级至总监终审';
    }

    const claim: Claim = {
      id: generateId('cl_'),
      claimNo: generateClaimNo(),
      policyId,
      userId,
      policyNo: policy.policyNo,
      amount,
      accidentType,
      accidentDate,
      description,
      materials,
      status: initialStatus,
      approvalLevel: initialLevel,
      currentApprover: initialStatus === 'approved' ? undefined : initialApprover,
      approvalHistory: [
        {
          level: 0,
          approver: '系统',
          status: 'approved',
          time: formatDateTime(),
          comment: '材料初审通过'
        }
      ],
      createTime: formatDate()
    };

    if (initialStatus === 'reviewing') {
      claim.approvalHistory.push({
        level: initialLevel,
        approver: initialApprover,
        status: 'reviewing',
        time: formatDateTime(),
        comment: initialComment
      });
    }

    await db.add('claims', claim);

    if (initialStatus === 'approved') {
      setTimeout(async () => {
        const paidClaim = { ...claim, status: 'paid' as const };
        await db.update('claims', paidClaim);
        await this.createNotification(userId, '理赔到账通知', `您的理赔申请（${claim.claimNo}）已赔付到账，金额：¥${amount.toLocaleString()}`, 'success');
      }, 2000);
    } else {
      await this.createNotification(userId, '理赔申请提交成功', `您的理赔申请（${claim.claimNo}）已提交，当前由${initialApprover}审批中`, 'info');
    }

    return claim;
  }

  static async approveClaim(claimId: string, approver: string, approved: boolean, comment?: string): Promise<Claim | null> {
    const claim = await db.getByKey('claims', claimId);
    if (!claim) return null;

    const currentLevel = claim.approvalLevel;
    const amount = claim.amount;

    const updatedClaim: Claim = {
      ...claim,
      approvalHistory: claim.approvalHistory.map(h => 
        h.level === currentLevel && h.status === 'reviewing'
          ? { ...h, status: approved ? 'approved' : 'rejected', approver, comment, time: formatDateTime() }
          : h
      )
    };

    if (!approved) {
      updatedClaim.status = 'rejected';
      updatedClaim.currentApprover = undefined;
      await db.update('claims', updatedClaim);
      await this.createNotification(claim.userId, '理赔申请被拒绝', `您的理赔申请（${claim.claimNo}）未通过审批，原因：${comment || '不符合理赔条件'}`, 'error');
      return updatedClaim;
    }

    let shouldUpgrade = false;
    let nextLevel: 0 | 1 | 2 = currentLevel;
    let nextApprover = '';

    if (currentLevel === 1 && amount > 30000) {
      shouldUpgrade = true;
      nextLevel = 2;
      nextApprover = '总监';
    }

    if (shouldUpgrade) {
      updatedClaim.approvalLevel = nextLevel;
      updatedClaim.currentApprover = nextApprover;
      updatedClaim.status = 'reviewing';
      updatedClaim.approvalHistory.push({
        level: nextLevel,
        approver: nextApprover,
        status: 'reviewing',
        time: formatDateTime(),
        comment: `金额超过30,000元，升级至${nextApprover}终审`
      });
      await this.createNotification(claim.userId, '理赔审批升级', `您的理赔申请（${claim.claimNo}）已通过区域主管审批，因金额超过30,000元，已升级至总监终审`, 'info');
    } else {
      updatedClaim.status = 'approved';
      updatedClaim.currentApprover = undefined;
      
      setTimeout(async () => {
        const paidClaim = { ...updatedClaim, status: 'paid' as const };
        await db.update('claims', paidClaim);
        await this.createNotification(claim.userId, '理赔到账通知', `您的理赔申请（${claim.claimNo}）已赔付到账，金额：¥${claim.amount.toLocaleString()}`, 'success');
      }, 3000);
    }

    await db.update('claims', updatedClaim);
    return updatedClaim;
  }

  static async analyzeHealthReport(
    userId: string,
    indicators: Omit<HealthIndicator, 'isAbnormal'>[]
  ): Promise<HealthReport> {
    const normalRanges: Record<string, { min: number; max: number }> = {
      '血压': { min: 90, max: 140 },
      '血糖': { min: 3.9, max: 6.1 },
      '胆固醇': { min: 2.8, max: 5.2 },
      'BMI': { min: 18.5, max: 23.9 },
      '心率': { min: 60, max: 100 }
    };

    const processedIndicators: HealthIndicator[] = indicators.map(ind => {
      const range = normalRanges[ind.name];
      const isAbnormal = range ? (ind.value < range.min || ind.value > range.max) : false;
      return { ...ind, isAbnormal };
    });

    const normalCount = processedIndicators.filter(i => !i.isAbnormal).length;
    const score = Math.round((normalCount / processedIndicators.length) * 100);
    
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (score < 60) riskLevel = 'high';
    else if (score < 80) riskLevel = 'medium';

    const suggestions: string[] = [];
    const abnormal = processedIndicators.filter(i => i.isAbnormal);

    abnormal.forEach(ind => {
      switch (ind.name) {
        case '血压':
          suggestions.push(ind.value > 140 
            ? '建议减少盐分摄入，保持规律作息，避免情绪激动' 
            : '建议适当增加营养，避免快速站立');
          break;
        case '血糖':
          suggestions.push(ind.value > 6.1 
            ? '建议减少高糖食物摄入，控制每日碳水化合物摄入量' 
            : '建议随身携带糖果，避免低血糖症状');
          break;
        case '胆固醇':
          suggestions.push('建议减少油炸食品和动物内脏的摄入，增加膳食纤维');
          break;
        case 'BMI':
          suggestions.push(ind.value > 23.9 
            ? '建议控制饮食，增加有氧运动，每周至少3次，每次30分钟以上' 
            : '建议适当增加营养摄入，进行适度力量训练');
          break;
        case '心率':
          suggestions.push('建议保持规律作息，避免熬夜和过度劳累，适当运动');
          break;
      }
    });

    if (suggestions.length === 0) {
      suggestions.push('各项指标正常，请继续保持健康的生活方式');
    }
    suggestions.push('建议每月监测相关指标变化，如有异常及时就医');
    suggestions.push('保持规律作息，保证充足睡眠');
    suggestions.push('均衡饮食，多吃新鲜蔬菜水果');

    const report: HealthReport = {
      id: generateId('hr_'),
      userId,
      reportDate: formatDate(),
      score,
      riskLevel,
      indicators: processedIndicators,
      suggestions
    };

    await db.add('healthReports', report);

    if (abnormal.length > 0) {
      await this.createNotification(
        userId, 
        '健康提醒', 
        `您的体检报告显示${abnormal.length}项指标异常，请注意关注并及时复查`, 
        'warning'
      );
    }

    return report;
  }

  static async createNotification(
    userId: string,
    title: string,
    content: string,
    type: 'info' | 'warning' | 'success' | 'error' = 'info'
  ): Promise<Notification> {
    const notification: Notification = {
      id: generateId('n_'),
      userId,
      title,
      content,
      type,
      read: false,
      createTime: formatDateTime()
    };
    await db.add('notifications', notification);
    return notification;
  }

  static async markNotificationRead(notificationId: string): Promise<void> {
    const notif = await db.getByKey('notifications', notificationId);
    if (notif) {
      await db.update('notifications', { ...notif, read: true });
    }
  }

  static async checkRenewalReminders(): Promise<void> {
    const policies = await db.getAll('policies');
    const today = new Date();

    for (const policy of policies) {
      if (policy.status !== 'active') continue;

      const endDate = new Date(policy.endDate);
      const daysUntilExpiry = daysBetween(today, endDate);

      if (daysUntilExpiry === 30 || daysUntilExpiry === 7) {
        const existingNotifs = await db.getAll('notifications', 'userId', policy.userId);
        const alreadySent = existingNotifs.some(n => 
          n.title === '续期提醒' && 
          n.content.includes(policy.policyNo) &&
          daysBetween(new Date(n.createTime), today) < 2
        );

        if (!alreadySent) {
          await this.createNotification(
            policy.userId,
            '续期提醒',
            `您的保单【${policy.productName}】（${policy.policyNo}）将在${daysUntilExpiry}天后到期，请及时续保`,
            'warning'
          );
        }
      }

      if (daysUntilExpiry < 0 && policy.status === 'active') {
        await db.update('policies', { ...policy, status: 'expired' });
        await this.createNotification(
          policy.userId,
          '保障冻结通知',
          `您的保单【${policy.productName}】（${policy.policyNo}）已过期，保障已冻结，请尽快续保`,
          'error'
        );
      }
    }
  }

  static async createTeamMember(
    agentId: string,
    name: string,
    phone: string,
    role: 'leader' | 'member'
  ): Promise<TeamMember> {
    const member: TeamMember = {
      id: generateId('tm_'),
      agentId,
      name,
      phone,
      role,
      joinTime: formatDate(),
      monthlyPremium: 0
    };
    await db.add('teamMembers', member);
    return member;
  }

  static async calculateCommission(agentId: string, month: string): Promise<Commission> {
    const teamMembers = await db.getAll('teamMembers', 'agentId', agentId);
    const memberIds = [agentId, ...teamMembers.map(m => m.id)];
    
    const [year, monthNum] = month.split('-').map(Number);
    const monthStart = new Date(year, monthNum - 1, 1);
    const monthEnd = new Date(year, monthNum, 0);

    const allPolicies = await db.getAll('policies');
    const monthPolicies = allPolicies.filter(p => {
      const createDate = new Date(p.createTime);
      return createDate >= monthStart && createDate <= monthEnd;
    });

    const totalPremium = monthPolicies.reduce((sum, p) => sum + p.premium, 0);
    
    const tier = COMMISSION_TIERS.find(t => totalPremium >= t.minPremium && totalPremium < t.maxPremium) || COMMISSION_TIERS[COMMISSION_TIERS.length - 1];
    const commissionRate = tier.rate;
    const commissionAmount = Math.round(totalPremium * commissionRate);

    const details = monthPolicies.map(p => ({
      policyId: p.id,
      policyNo: p.policyNo,
      customerName: p.insuredName,
      premium: p.premium,
      commission: Math.round(p.premium * commissionRate)
    }));

    const commission: Commission = {
      id: generateId('com_'),
      agentId,
      month,
      totalPremium,
      commissionLevel: COMMISSION_TIERS.indexOf(tier) + 1,
      commissionRate,
      commissionAmount,
      details,
      createTime: formatDate()
    };

    await db.add('commissions', commission);
    return commission;
  }

  static async getAdminStats(region?: string, timeRange?: string): Promise<{
    totalPremium: number;
    totalClaims: number;
    claimApprovalRate: number;
    avgClaimTime: number;
    totalAgents: number;
    totalCustomers: number;
    complaintRate: number;
  }> {
    const [allPolicies, allClaims, allUsers] = await Promise.all([
      db.getAll('policies'),
      db.getAll('claims'),
      db.getAll('users')
    ]);

    const totalPremium = allPolicies.reduce((sum, p) => sum + p.premium, 0);
    const totalClaims = allClaims.length;
    const approvedClaims = allClaims.filter(c => c.status === 'approved' || c.status === 'paid');
    const claimApprovalRate = totalClaims > 0 ? Math.round((approvedClaims.length / totalClaims) * 1000) / 10 : 0;
    
    const agents = allUsers.filter(u => u.role === 'agent');
    const customers = allUsers.filter(u => u.role === 'customer');

    return {
      totalPremium,
      totalClaims,
      claimApprovalRate,
      avgClaimTime: 2.8,
      totalAgents: agents.length,
      totalCustomers: customers.length,
      complaintRate: 1.2
    };
  }

  static async exportMonthlyReport(month: string): Promise<string> {
    const [year, monthNum] = month.split('-').map(Number);
    const monthStart = new Date(year, monthNum - 1, 1);
    const monthEnd = new Date(year, monthNum, 0);

    const allPolicies = await db.getAll('policies');
    const monthPolicies = allPolicies.filter(p => {
      const createDate = new Date(p.createTime);
      return createDate >= monthStart && createDate <= monthEnd;
    });

    const allClaims = await db.getAll('claims');
    const monthClaims = allClaims.filter(c => {
      const createDate = new Date(c.createTime);
      return createDate >= monthStart && createDate <= monthEnd;
    });

    const products = await db.getAll('products');
    const productIncomes = products.map(p => {
      const productPolicies = monthPolicies.filter(pol => pol.productId === p.id);
      const income = productPolicies.reduce((sum, pol) => sum + pol.premium, 0);
      const productClaims = monthClaims.filter(c => {
        const policy = allPolicies.find(pol => pol.id === c.policyId);
        return policy?.productId === p.id;
      });
      const claimRate = productPolicies.length > 0 ? Math.round((productClaims.length / productPolicies.length) * 100) / 10 : 0;
      
      return { productName: p.name, income, claimRate };
    });

    const report = {
      month,
      exportTime: formatDateTime(),
      summary: {
        totalPremium: monthPolicies.reduce((sum, p) => sum + p.premium, 0),
        totalPolicies: monthPolicies.length,
        totalClaims: monthClaims.length,
        customerSatisfaction: 96.8
      },
      productIncomes,
      generatedAt: new Date().toISOString()
    };

    return JSON.stringify(report, null, 2);
  }

  static async predictNextQuarter(): Promise<{ productName: string; predictedSales: number; confidence: number; reason: string }[]> {
    const products = await db.getAll('products');
    const month = new Date().getMonth();
    
    const seasonalFactors: Record<number, string[]> = {
      0: ['驾乘无忧意外险', '安心百万医疗险'],
      1: ['守护重疾险', '幸福人寿终身寿险'],
      2: ['少儿成长教育金'],
      3: ['驾乘无忧意外险', '安心百万医疗险'],
      4: ['驾乘无忧意外险', '安心百万医疗险'],
      5: ['驾乘无忧意外险', '安心百万医疗险'],
      6: ['少儿成长教育金', '驾乘无忧意外险'],
      7: ['驾乘无忧意外险', '安心百万医疗险'],
      8: ['安心养老年金险', '少儿成长教育金'],
      9: ['安心百万医疗险', '守护重疾险'],
      10: ['守护重疾险', '幸福人寿终身寿险'],
      11: ['安心养老年金险', '幸福人寿终身寿险']
    };

    const reasons: Record<string, string> = {
      '安心百万医疗险': '季节变换，疾病高发，医疗需求增加',
      '驾乘无忧意外险': '出行旺季，交通意外风险上升',
      '守护重疾险': '健康意识提升，重疾保障需求稳定',
      '幸福人寿终身寿险': '年末家庭资产规划需求',
      '少儿成长教育金': '开学季临近，教育规划需求增加',
      '安心养老年金险': '退休规划，养老储备意识提升'
    };

    const hotProducts = seasonalFactors[month] || [];

    return products
      .filter(p => hotProducts.includes(p.name))
      .map(p => ({
        productName: p.name,
        predictedSales: Math.round(p.basePremium * (100 + Math.random() * 50)),
        confidence: Math.round(75 + Math.random() * 20),
        reason: reasons[p.name] || '市场需求稳定增长'
      }));
  }
}
