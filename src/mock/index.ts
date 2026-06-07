import type {
  User,
  InsuranceProduct,
  Policy,
  Claim,
  HealthReport,
  Notification,
  TeamMember,
  Commission,
  AdminStats,
  ProductSalesData,
  PredictionData,
  MonthlyReport
} from '@/types';

export const mockUsers: User[] = [
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
    createTime: '2024-01-15'
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
    createTime: '2023-06-20'
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
    createTime: '2023-01-01'
  }
];

export const mockProducts: InsuranceProduct[] = [
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

export const mockPolicies: Policy[] = [
  {
    id: 'pol1',
    policyNo: 'BA20240100001',
    userId: '1',
    productId: 'p1',
    productName: '安心百万医疗险',
    insuredName: '张明',
    insuredIdCard: '110101199001011234',
    beneficiary: '张小明（儿子）',
    amount: 4000000,
    premium: 299,
    status: 'active',
    startDate: '2024-01-20',
    endDate: '2025-01-19',
    createTime: '2024-01-15'
  },
  {
    id: 'pol2',
    policyNo: 'BA20240200002',
    userId: '1',
    productId: 'p3',
    productName: '驾乘无忧意外险',
    insuredName: '张明',
    insuredIdCard: '110101199001011234',
    beneficiary: '李芳（配偶）',
    amount: 500000,
    premium: 199,
    status: 'active',
    startDate: '2024-03-01',
    endDate: '2025-02-28',
    createTime: '2024-02-25'
  },
  {
    id: 'pol3',
    policyNo: 'BA20230500003',
    userId: '1',
    productId: 'p2',
    productName: '守护重疾险',
    insuredName: '张明',
    insuredIdCard: '110101199001011234',
    beneficiary: '张小明（儿子）',
    amount: 500000,
    premium: 3500,
    status: 'active',
    startDate: '2023-05-10',
    endDate: '2053-05-09',
    createTime: '2023-05-05'
  }
];

export const mockClaims: Claim[] = [
  {
    id: 'cl1',
    claimNo: 'CL2024050001',
    policyId: 'pol1',
    userId: '1',
    policyNo: 'BA20240100001',
    amount: 3500,
    accidentType: 'medical',
    accidentDate: '2024-05-10',
    description: '因急性阑尾炎住院手术治疗',
    materials: ['invoice1.jpg', 'discharge_summary.pdf', 'diagnosis.jpg'],
    status: 'paid',
    approvalLevel: 0,
    approvalHistory: [
      { level: 0, approver: '系统', status: 'approved', time: '2024-05-12 10:30:00', comment: '材料齐全，金额在自动审批范围内' }
    ],
    createTime: '2024-05-11'
  },
  {
    id: 'cl2',
    claimNo: 'CL2024060002',
    policyId: 'pol1',
    userId: '1',
    policyNo: 'BA20240100001',
    amount: 15000,
    accidentType: 'medical',
    accidentDate: '2024-06-15',
    description: '因交通事故导致骨折住院治疗',
    materials: ['police_report.jpg', 'hospital_bill.pdf', 'xray.jpg'],
    status: 'reviewing',
    approvalLevel: 1,
    currentApprover: '区域主管-王刚',
    approvalHistory: [
      { level: 0, approver: '系统', status: 'reviewing', time: '2024-06-16 09:00:00', comment: '金额超过5000元，需区域主管审批' }
    ],
    createTime: '2024-06-16'
  },
  {
    id: 'cl3',
    claimNo: 'CL2024040003',
    policyId: 'pol2',
    userId: '1',
    policyNo: 'BA20240200002',
    amount: 45000,
    accidentType: 'accident',
    accidentDate: '2024-04-05',
    description: '自驾车发生交通事故，造成车辆损坏和人员受伤',
    materials: ['accident_photo1.jpg', 'accident_photo2.jpg', 'repair_bill.pdf'],
    status: 'reviewing',
    approvalLevel: 2,
    currentApprover: '总监-陈总',
    approvalHistory: [
      { level: 0, approver: '系统', status: 'reviewing', time: '2024-04-06 14:00:00', comment: '金额超过30000元，需总监终审' },
      { level: 1, approver: '区域主管-王刚', status: 'reviewing', time: '2024-04-07 10:00:00', comment: '材料属实，建议通过，提请总监审批' }
    ],
    createTime: '2024-04-06'
  }
];

export const mockHealthReports: HealthReport[] = [
  {
    id: 'hr1',
    userId: '1',
    reportDate: '2024-06-01',
    score: 78,
    riskLevel: 'medium',
    indicators: [
      { name: '血压', value: 135, unit: 'mmHg', normalRange: '90-140', isAbnormal: false },
      { name: '血糖', value: 6.8, unit: 'mmol/L', normalRange: '3.9-6.1', isAbnormal: true },
      { name: '胆固醇', value: 5.8, unit: 'mmol/L', normalRange: '<5.2', isAbnormal: true },
      { name: 'BMI', value: 26.5, unit: 'kg/m²', normalRange: '18.5-23.9', isAbnormal: true },
      { name: '心率', value: 72, unit: 'bpm', normalRange: '60-100', isAbnormal: false }
    ],
    suggestions: [
      '建议减少高糖食物摄入，控制每日碳水化合物摄入量',
      '增加有氧运动，每周至少3次，每次30分钟以上',
      '减少油炸食品和动物内脏的摄入，增加膳食纤维',
      '建议每月监测血糖和胆固醇变化',
      '保持规律作息，避免熬夜'
    ]
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: '1',
    title: '承保通知',
    content: '您投保的【驾乘无忧意外险】已成功承保，保单号：BA20240200002',
    type: 'success',
    read: false,
    createTime: '2024-02-25 10:30:00'
  },
  {
    id: 'n2',
    userId: '1',
    title: '理赔到账通知',
    content: '您的理赔申请（CL2024050001）已赔付到账，金额：3,500.00元',
    type: 'success',
    read: true,
    createTime: '2024-05-13 09:15:00'
  },
  {
    id: 'n3',
    userId: '1',
    title: '续期提醒',
    content: '您的保单【安心百万医疗险】将在30天后到期，请及时续保',
    type: 'warning',
    read: false,
    createTime: '2024-12-20 08:00:00'
  },
  {
    id: 'n4',
    userId: '1',
    title: '健康提醒',
    content: '您的体检报告显示血糖偏高，建议注意饮食并定期监测',
    type: 'warning',
    read: false,
    createTime: '2024-06-02 14:00:00'
  },
  {
    id: 'n5',
    userId: '1',
    title: '会员升级通知',
    content: '恭喜您升级为金卡会员，享受更多专属权益！',
    type: 'info',
    read: true,
    createTime: '2024-04-01 16:00:00'
  }
];

export const mockTeamMembers: TeamMember[] = [
  {
    id: 'tm1',
    agentId: '2',
    name: '李华',
    phone: '13900139002',
    role: 'leader',
    joinTime: '2023-06-20',
    monthlyPremium: 150000
  },
  {
    id: 'tm2',
    agentId: '2',
    name: '王芳',
    phone: '13800138010',
    role: 'member',
    joinTime: '2023-08-15',
    monthlyPremium: 85000
  },
  {
    id: 'tm3',
    agentId: '2',
    name: '陈伟',
    phone: '13700137020',
    role: 'member',
    joinTime: '2023-10-01',
    monthlyPremium: 62000
  },
  {
    id: 'tm4',
    agentId: '2',
    name: '刘洋',
    phone: '13600136030',
    role: 'member',
    joinTime: '2024-01-10',
    monthlyPremium: 45000
  },
  {
    id: 'tm5',
    agentId: '2',
    name: '赵雪',
    phone: '13500135040',
    role: 'member',
    joinTime: '2024-03-05',
    monthlyPremium: 38000
  }
];

export const mockCommissions: Commission[] = [
  {
    id: 'com1',
    agentId: '2',
    month: '2024-06',
    totalPremium: 380000,
    commissionLevel: 3,
    commissionRate: 0.25,
    commissionAmount: 95000,
    details: [
      { policyId: 'polx1', policyNo: 'BA20240600101', customerName: '张先生', premium: 15000, commission: 3750 },
      { policyId: 'polx2', policyNo: 'BA20240600102', customerName: '李女士', premium: 8000, commission: 2000 },
      { policyId: 'polx3', policyNo: 'BA20240600103', customerName: '王先生', premium: 25000, commission: 6250 },
      { policyId: 'polx4', policyNo: 'BA20240600104', customerName: '赵女士', premium: 5000, commission: 1250 }
    ],
    createTime: '2024-07-01'
  },
  {
    id: 'com2',
    agentId: '2',
    month: '2024-05',
    totalPremium: 320000,
    commissionLevel: 2,
    commissionRate: 0.20,
    commissionAmount: 64000,
    details: [
      { policyId: 'poly1', policyNo: 'BA20240500081', customerName: '孙先生', premium: 12000, commission: 2400 },
      { policyId: 'poly2', policyNo: 'BA20240500082', customerName: '周女士', premium: 18000, commission: 3600 }
    ],
    createTime: '2024-06-01'
  }
];

export const mockAdminStats: AdminStats = {
  totalPremium: 25800000,
  totalClaims: 1256,
  claimApprovalRate: 92.5,
  avgClaimTime: 2.8,
  totalAgents: 156,
  totalCustomers: 8926,
  complaintRate: 1.2
};

export const mockProductSalesData: ProductSalesData[] = [
  { productName: '安心百万医疗险', premium: 8560000, count: 28560 },
  { productName: '守护重疾险', premium: 6240000, count: 4160 },
  { productName: '驾乘无忧意外险', premium: 3120000, count: 15680 },
  { productName: '幸福人寿终身寿险', premium: 4500000, count: 1500 },
  { productName: '少儿成长教育金', premium: 1880000, count: 376 },
  { productName: '安心养老年金险', premium: 1500000, count: 150 }
];

export const mockPredictionData: PredictionData[] = [
  { productName: '安心百万医疗险', predictedSales: 9500000, confidence: 92, reason: '夏季高温疾病高发，医疗需求增加' },
  { productName: '驾乘无忧意外险', predictedSales: 3800000, confidence: 88, reason: '暑期出行旺季，驾乘需求上升' },
  { productName: '少儿成长教育金', predictedSales: 2200000, confidence: 85, reason: '开学季临近，教育规划需求增加' },
  { productName: '守护重疾险', predictedSales: 5800000, confidence: 78, reason: '健康意识提升，重疾保障需求稳定' }
];

export const mockMonthlyReport: MonthlyReport = {
  month: '2024-06',
  productIncomes: [
    { productName: '安心百万医疗险', income: 8560000, claimRate: 18.5 },
    { productName: '守护重疾险', income: 6240000, claimRate: 12.3 },
    { productName: '驾乘无忧意外险', income: 3120000, claimRate: 8.7 },
    { productName: '幸福人寿终身寿险', income: 4500000, claimRate: 2.1 },
    { productName: '少儿成长教育金', income: 1880000, claimRate: 0.5 },
    { productName: '安心养老年金险', income: 1500000, claimRate: 0.3 }
  ],
  agentActivity: [
    { agentName: '李华', activeDays: 28, premium: 380000 },
    { agentName: '张强', activeDays: 26, premium: 290000 },
    { agentName: '王芳', activeDays: 25, premium: 245000 },
    { agentName: '陈伟', activeDays: 22, premium: 180000 },
    { agentName: '刘洋', activeDays: 20, premium: 156000 }
  ],
  customerSatisfaction: 96.8,
  totalPremium: 25800000,
  totalClaims: 1256
};
