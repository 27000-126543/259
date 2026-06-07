import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Policy, Claim, Notification, HealthReport, TeamMember, Commission, InsuranceProduct } from '@/types';
import { mockUsers, mockPolicies, mockClaims, mockNotifications, mockHealthReports, mockTeamMembers, mockCommissions, mockProducts } from '@/mock';

interface AppState {
  currentUser: User | null;
  users: User[];
  policies: Policy[];
  claims: Claim[];
  notifications: Notification[];
  healthReports: HealthReport[];
  teamMembers: TeamMember[];
  commissions: Commission[];
  products: InsuranceProduct[];
  login: (phone: string, password: string) => User | null;
  register: (userData: Omit<User, 'id' | 'memberLevel' | 'annualPremium' | 'renewalCount' | 'createTime'>) => User;
  logout: () => void;
  addPolicy: (policy: Policy) => void;
  addClaim: (claim: Claim) => void;
  markNotificationRead: (id: string) => void;
  addHealthReport: (report: HealthReport) => void;
  updateUser: (user: User) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: mockUsers,
      policies: mockPolicies,
      claims: mockClaims,
      notifications: mockNotifications,
      healthReports: mockHealthReports,
      teamMembers: mockTeamMembers,
      commissions: mockCommissions,
      products: mockProducts,

      login: (phone: string, password: string) => {
        const user = get().users.find(u => u.phone === phone && u.password === password);
        if (user) {
          set({ currentUser: user });
          return user;
        }
        return null;
      },

      register: (userData) => {
        const newUser: User = {
          ...userData,
          id: Date.now().toString(),
          memberLevel: 'silver',
          annualPremium: 0,
          renewalCount: 0,
          createTime: new Date().toISOString().split('T')[0]
        };
        set(state => ({ users: [...state.users, newUser], currentUser: newUser }));
        return newUser;
      },

      logout: () => {
        set({ currentUser: null });
      },

      addPolicy: (policy) => {
        set(state => ({ policies: [...state.policies, policy] }));
      },

      addClaim: (claim) => {
        set(state => ({ claims: [...state.claims, claim] }));
      },

      markNotificationRead: (id) => {
        set(state => ({
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
          )
        }));
      },

      addHealthReport: (report) => {
        set(state => ({ healthReports: [...state.healthReports, report] }));
      },

      updateUser: (user) => {
        set(state => ({
          users: state.users.map(u => u.id === user.id ? user : u),
          currentUser: state.currentUser?.id === user.id ? user : state.currentUser
        }));
      }
    }),
    {
      name: 'insurance-app-storage'
    }
  )
);
