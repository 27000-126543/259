import type {
  User,
  Policy,
  Claim,
  HealthReport,
  Notification,
  TeamMember,
  Commission,
  InsuranceProduct
} from '@/types';

const DB_NAME = 'InsurancePlatformDB';
const DB_VERSION = 1;

export interface DBSchema {
  users: User;
  products: InsuranceProduct;
  policies: Policy;
  claims: Claim;
  healthReports: HealthReport;
  notifications: Notification;
  teamMembers: TeamMember;
  commissions: Commission;
}

type StoreName = keyof DBSchema;

class Database {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<IDBDatabase> | null = null;

  async init(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('phone', 'phone', { unique: true });
          userStore.createIndex('email', 'email', { unique: true });
          userStore.createIndex('role', 'role', { unique: false });
        }

        if (!db.objectStoreNames.contains('products')) {
          const productStore = db.createObjectStore('products', { keyPath: 'id' });
          productStore.createIndex('category', 'category', { unique: false });
          productStore.createIndex('hot', 'hot', { unique: false });
          productStore.createIndex('recommended', 'recommended', { unique: false });
        }

        if (!db.objectStoreNames.contains('policies')) {
          const policyStore = db.createObjectStore('policies', { keyPath: 'id' });
          policyStore.createIndex('userId', 'userId', { unique: false });
          policyStore.createIndex('policyNo', 'policyNo', { unique: true });
          policyStore.createIndex('status', 'status', { unique: false });
          policyStore.createIndex('endDate', 'endDate', { unique: false });
        }

        if (!db.objectStoreNames.contains('claims')) {
          const claimStore = db.createObjectStore('claims', { keyPath: 'id' });
          claimStore.createIndex('userId', 'userId', { unique: false });
          claimStore.createIndex('claimNo', 'claimNo', { unique: true });
          claimStore.createIndex('policyId', 'policyId', { unique: false });
          claimStore.createIndex('status', 'status', { unique: false });
          claimStore.createIndex('approvalLevel', 'approvalLevel', { unique: false });
        }

        if (!db.objectStoreNames.contains('healthReports')) {
          const healthStore = db.createObjectStore('healthReports', { keyPath: 'id' });
          healthStore.createIndex('userId', 'userId', { unique: false });
          healthStore.createIndex('reportDate', 'reportDate', { unique: false });
        }

        if (!db.objectStoreNames.contains('notifications')) {
          const notifStore = db.createObjectStore('notifications', { keyPath: 'id' });
          notifStore.createIndex('userId', 'userId', { unique: false });
          notifStore.createIndex('read', 'read', { unique: false });
          notifStore.createIndex('createTime', 'createTime', { unique: false });
        }

        if (!db.objectStoreNames.contains('teamMembers')) {
          const teamStore = db.createObjectStore('teamMembers', { keyPath: 'id' });
          teamStore.createIndex('agentId', 'agentId', { unique: false });
          teamStore.createIndex('role', 'role', { unique: false });
        }

        if (!db.objectStoreNames.contains('commissions')) {
          const commissionStore = db.createObjectStore('commissions', { keyPath: 'id' });
          commissionStore.createIndex('agentId', 'agentId', { unique: false });
          commissionStore.createIndex('month', 'month', { unique: false });
        }
      };
    });

    return this.initPromise;
  }

  private async getStore<T extends StoreName>(
    storeName: T,
    mode: IDBTransactionMode = 'readonly'
  ): Promise<IDBObjectStore> {
    const db = await this.init();
    const transaction = db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }

  async getAll<T extends StoreName>(storeName: T, index?: string, value?: any): Promise<DBSchema[T][]> {
    const store = await this.getStore(storeName);
    
    return new Promise((resolve, reject) => {
      let request: IDBRequest;
      
      if (index && value !== undefined) {
        const idx = store.index(index);
        request = idx.getAll(value);
      } else {
        request = store.getAll();
      }

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getByKey<T extends StoreName>(storeName: T, key: string): Promise<DBSchema[T] | undefined> {
    const store = await this.getStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async add<T extends StoreName>(storeName: T, data: DBSchema[T]): Promise<string> {
    const store = await this.getStore(storeName, 'readwrite');
    
    return new Promise((resolve, reject) => {
      const request = store.add(data);
      request.onsuccess = () => resolve(request.result as string);
      request.onerror = () => reject(request.error);
    });
  }

  async update<T extends StoreName>(storeName: T, data: DBSchema[T]): Promise<void> {
    const store = await this.getStore(storeName, 'readwrite');
    
    return new Promise((resolve, reject) => {
      const request = store.put(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async delete<T extends StoreName>(storeName: T, key: string): Promise<void> {
    const store = await this.getStore(storeName, 'readwrite');
    
    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async count<T extends StoreName>(storeName: T, index?: string, value?: any): Promise<number> {
    const store = await this.getStore(storeName);
    
    return new Promise((resolve, reject) => {
      let request: IDBRequest;
      
      if (index && value !== undefined) {
        const idx = store.index(index);
        request = idx.count(value);
      } else {
        request = store.count();
      }

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async clearAll(): Promise<void> {
    const db = await this.init();
    const stores = Array.from(db.objectStoreNames);
    const transaction = db.transaction(stores, 'readwrite');
    
    await Promise.all(
      stores.map(store => 
        new Promise<void>((resolve, reject) => {
          const request = transaction.objectStore(store).clear();
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        })
      )
    );
  }
}

export const db = new Database();

export function generateId(prefix: string = ''): string {
  return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
}

export function generatePolicyNo(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `BA${year}${month}${random}`;
}

export function generateClaimNo(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CL${year}${month}${random}`;
}

export function formatDateTime(date?: Date): string {
  const d = date || new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function formatDate(date?: Date): string {
  const d = date || new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
}
