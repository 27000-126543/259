import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Policy, Claim, Notification, HealthReport, TeamMember, Commission, InsuranceProduct, HealthIndicator } from '@/types';
import { db } from '@/db';
import { InsuranceService } from '@/services/insuranceService';

interface AppState {
  currentUser: User | null;
  policies: Policy[];
  claims: Claim[];
  notifications: Notification[];
  healthReports: HealthReport[];
  teamMembers: TeamMember[];
  commissions: Commission[];
  products: InsuranceProduct[];
  isInitialized: boolean;
  isLoading: boolean;
  
  initApp: () => Promise<void>;
  loadUserData: (userId: string) => Promise<void>;
  refreshData: () => Promise<void>;
  
  login: (phone: string, password: string) => Promise<User | null>;
  register: (userData: Omit<User, 'id' | 'memberLevel' | 'annualPremium' | 'renewalCount' | 'createTime'>) => Promise<User>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<User | null>;
  
  createPolicy: (productId: string, insuredName: string, insuredIdCard: string, beneficiary: string, amount: number) => Promise<Policy>;
  autoUnderwrite: (productId: string, insuredAge: number) => Promise<{ passed: boolean; reason?: string }>;
  
  createClaim: (policyId: string, amount: number, accidentType: string, accidentDate: string, description: string, materials: string[]) => Promise<Claim>;
  approveClaim: (claimId: string, approver: string, approved: boolean, comment?: string) => Promise<Claim | null>;
  
  analyzeHealthReport: (indicators: Omit<HealthIndicator, 'isAbnormal'>[]) => Promise<HealthReport>;
  addHealthReport: (report: HealthReport) => Promise<void>;
  
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  
  createTeamMember: (name: string, phone: string, role: 'leader' | 'member') => Promise<TeamMember>;
  calculateCommission: (month: string) => Promise<Commission>;
  
  checkRenewalReminders: () => Promise<void>;
  getMemberUpgradeProgress: () => Promise<{ current: string; next: string | null; progress: number; required: string }>;
  getAdminStats: (region?: string, timeRange?: string) => Promise<any>;
  exportMonthlyReport: (month: string) => Promise<string>;
  predictNextQuarter: () => Promise<any[]>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      policies: [],
      claims: [],
      notifications: [],
      healthReports: [],
      teamMembers: [],
      commissions: [],
      products: [],
      isInitialized: false,
      isLoading: false,

      initApp: async () => {
        if (get().isInitialized) return;
        
        try {
          await InsuranceService.initData();
          const products = await db.getAll('products');
          set({ products, isInitialized: true });
          
          const currentUser = get().currentUser;
          if (currentUser) {
            await get().loadUserData(currentUser.id);
          }
          
          await get().checkRenewalReminders();
        } catch (error) {
          console.error('初始化失败:', error);
        }
      },

      loadUserData: async (userId: string) => {
        set({ isLoading: true });
        try {
          const [policies, claims, notifications, healthReports, teamMembers, commissions] = await Promise.all([
            db.getAll('policies', 'userId', userId),
            db.getAll('claims', 'userId', userId),
            db.getAll('notifications', 'userId', userId),
            db.getAll('healthReports', 'userId', userId),
            db.getAll('teamMembers', 'agentId', userId),
            db.getAll('commissions', 'agentId', userId)
          ]);
          
          set({
            policies,
            claims,
            notifications: notifications.sort((a, b) => 
              new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
            ),
            healthReports: healthReports.sort((a, b) => 
              new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime()
            ),
            teamMembers,
            commissions,
            isLoading: false
          });
        } catch (error) {
          console.error('加载用户数据失败:', error);
          set({ isLoading: false });
        }
      },

      refreshData: async () => {
        const currentUser = get().currentUser;
        if (currentUser) {
          await get().loadUserData(currentUser.id);
        }
        const products = await db.getAll('products');
        set({ products });
      },

      login: async (phone: string, password: string) => {
        const user = await InsuranceService.login(phone, password);
        if (user) {
          set({ currentUser: user });
          await get().loadUserData(user.id);
          return user;
        }
        return null;
      },

      register: async (userData) => {
        const newUser = await InsuranceService.createUser(userData);
        set({ currentUser: newUser });
        await get().loadUserData(newUser.id);
        return newUser;
      },

      logout: () => {
        set({
          currentUser: null,
          policies: [],
          claims: [],
          notifications: [],
          healthReports: [],
          teamMembers: [],
          commissions: []
        });
      },

      updateUser: async (updates) => {
        const currentUser = get().currentUser;
        if (!currentUser) return null;
        
        const updated = await InsuranceService.updateUser(currentUser.id, updates);
        if (updated) {
          set({ currentUser: updated });
        }
        return updated;
      },

      createPolicy: async (productId, insuredName, insuredIdCard, beneficiary, amount) => {
        const currentUser = get().currentUser;
        if (!currentUser) throw new Error('未登录');
        
        const policy = await InsuranceService.createPolicy(
          currentUser.id,
          productId,
          insuredName,
          insuredIdCard,
          beneficiary,
          amount
        );
        
        await get().refreshData();
        return policy;
      },

      autoUnderwrite: async (productId, insuredAge) => {
        const currentUser = get().currentUser;
        if (!currentUser) return { passed: false, reason: '未登录' };
        
        return await InsuranceService.autoUnderwrite(currentUser.id, productId, insuredAge);
      },

      createClaim: async (policyId, amount, accidentType, accidentDate, description, materials) => {
        const currentUser = get().currentUser;
        if (!currentUser) throw new Error('未登录');
        
        const claim = await InsuranceService.createClaim(
          currentUser.id,
          policyId,
          amount,
          accidentType,
          accidentDate,
          description,
          materials
        );
        
        await get().refreshData();
        return claim;
      },

      approveClaim: async (claimId, approver, approved, comment) => {
        const result = await InsuranceService.approveClaim(claimId, approver, approved, comment);
        await get().refreshData();
        return result;
      },

      analyzeHealthReport: async (indicators) => {
        const currentUser = get().currentUser;
        if (!currentUser) throw new Error('未登录');
        
        const report = await InsuranceService.analyzeHealthReport(currentUser.id, indicators);
        await get().refreshData();
        return report;
      },

      addHealthReport: async (report) => {
        await db.add('healthReports', report);
        await get().refreshData();
      },

      markNotificationRead: async (id) => {
        await InsuranceService.markNotificationRead(id);
        set(state => ({
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
          )
        }));
      },

      markAllNotificationsRead: async () => {
        const notifications = get().notifications;
        for (const n of notifications) {
          if (!n.read) {
            await InsuranceService.markNotificationRead(n.id);
          }
        }
        set(state => ({
          notifications: state.notifications.map(n => ({ ...n, read: true }))
        }));
      },

      createTeamMember: async (name, phone, role) => {
        const currentUser = get().currentUser;
        if (!currentUser) throw new Error('未登录');
        
        const member = await InsuranceService.createTeamMember(currentUser.id, name, phone, role);
        await get().refreshData();
        return member;
      },

      calculateCommission: async (month) => {
        const currentUser = get().currentUser;
        if (!currentUser) throw new Error('未登录');
        
        const commission = await InsuranceService.calculateCommission(currentUser.id, month);
        await get().refreshData();
        return commission;
      },

      checkRenewalReminders: async () => {
        await InsuranceService.checkRenewalReminders();
        const currentUser = get().currentUser;
        if (currentUser) {
          const notifications = await db.getAll('notifications', 'userId', currentUser.id);
          set({
            notifications: notifications.sort((a, b) => 
              new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
            )
          });
        }
      },

      getMemberUpgradeProgress: async () => {
        const currentUser = get().currentUser;
        if (!currentUser) return { current: 'silver', next: 'gold', progress: 0, required: '年保费满20,000元' };
        
        return await InsuranceService.getMemberUpgradeProgress(currentUser.id);
      },

      getAdminStats: async (region, timeRange) => {
        return await InsuranceService.getAdminStats(region, timeRange);
      },

      exportMonthlyReport: async (month) => {
        return await InsuranceService.exportMonthlyReport(month);
      },

      predictNextQuarter: async () => {
        return await InsuranceService.predictNextQuarter();
      }
    }),
    {
      name: 'insurance-app-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isInitialized: state.isInitialized
      })
    }
  )
);
