export type UserRole = 'customer' | 'agent' | 'admin';

export type MemberLevel = 'silver' | 'gold' | 'diamond';

export type PolicyStatus = 'pending' | 'active' | 'expired' | 'cancelled';

export type ClaimStatus = 'pending' | 'reviewing' | 'approved' | 'rejected' | 'paid';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  idCard: string;
  password: string;
  role: UserRole;
  avatar?: string;
  memberLevel: MemberLevel;
  annualPremium: number;
  renewalCount: number;
  createTime: string;
}

export interface InsuranceProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  minAge: number;
  maxAge: number;
  minAmount: number;
  maxAmount: number;
  basePremium: number;
  features: string[];
  image: string;
  hot: boolean;
  recommended: boolean;
}

export interface Policy {
  id: string;
  policyNo: string;
  userId: string;
  productId: string;
  productName: string;
  insuredName: string;
  insuredIdCard: string;
  beneficiary: string;
  amount: number;
  premium: number;
  status: PolicyStatus;
  startDate: string;
  endDate: string;
  createTime: string;
}

export interface Claim {
  id: string;
  claimNo: string;
  policyId: string;
  userId: string;
  policyNo: string;
  amount: number;
  accidentType: string;
  accidentDate: string;
  description: string;
  materials: string[];
  status: ClaimStatus;
  approvalLevel: 0 | 1 | 2;
  currentApprover?: string;
  approvalHistory: {
    level: number;
    approver: string;
    status: ClaimStatus;
    time: string;
    comment?: string;
  }[];
  createTime: string;
}

export interface HealthIndicator {
  name: string;
  value: number;
  unit: string;
  normalRange: string;
  isAbnormal: boolean;
}

export interface HealthReport {
  id: string;
  userId: string;
  reportDate: string;
  score: number;
  riskLevel: RiskLevel;
  indicators: HealthIndicator[];
  suggestions: string[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createTime: string;
}

export interface TeamMember {
  id: string;
  agentId: string;
  name: string;
  phone: string;
  role: 'leader' | 'member';
  joinTime: string;
  monthlyPremium: number;
}

export interface CommissionDetail {
  policyId: string;
  policyNo: string;
  customerName: string;
  premium: number;
  commission: number;
}

export interface Commission {
  id: string;
  agentId: string;
  month: string;
  totalPremium: number;
  commissionLevel: number;
  commissionRate: number;
  commissionAmount: number;
  details: CommissionDetail[];
  createTime: string;
}

export interface AdminStats {
  totalPremium: number;
  totalClaims: number;
  claimApprovalRate: number;
  avgClaimTime: number;
  totalAgents: number;
  totalCustomers: number;
  complaintRate: number;
}

export interface ProductSalesData {
  productName: string;
  premium: number;
  count: number;
}

export interface PredictionData {
  productName: string;
  predictedSales: number;
  confidence: number;
  reason: string;
}

export interface MonthlyReport {
  month: string;
  productIncomes: {
    productName: string;
    income: number;
    claimRate: number;
  }[];
  agentActivity: {
    agentName: string;
    activeDays: number;
    premium: number;
  }[];
  customerSatisfaction: number;
  totalPremium: number;
  totalClaims: number;
}
