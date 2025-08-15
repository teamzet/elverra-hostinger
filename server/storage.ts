import { eq, and, desc, like } from "drizzle-orm";
import { db } from "./db";
import { 
  users, userRoles, agents, jobs, jobApplications, competitions, competitionParticipants,
  products, merchants, cmsPages, loanApplications, paymentPlans, companies, affiliateWithdrawals,
  type User, type InsertUser, type Agent, type Job, type JobApplication, type Competition, 
  type Product, type LoanApplication, type CmsPage
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // User roles
  getUserRoles(userId: string): Promise<string[]>;
  assignRole(userId: string, role: string): Promise<void>;
  
  // Agent operations
  getAgent(userId: string): Promise<Agent | undefined>;
  createAgent(agent: any): Promise<Agent>;
  updateAgentCommissions(agentId: string, commissions: any): Promise<void>;
  
  // Job operations
  getJobs(): Promise<Job[]>;
  getJob(id: string): Promise<Job | undefined>;
  createJob(job: any): Promise<Job>;
  updateJob(id: string, job: any): Promise<Job | undefined>;
  
  // Job applications
  getJobApplications(jobId?: string): Promise<JobApplication[]>;
  createJobApplication(application: any): Promise<JobApplication>;
  updateJobApplicationStatus(id: string, status: string): Promise<void>;
  
  // Competition operations
  getCompetitions(): Promise<Competition[]>;
  getCompetition(id: string): Promise<Competition | undefined>;
  createCompetition(competition: any): Promise<Competition>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  createProduct(product: any): Promise<Product>;
  updateProduct(id: string, product: any): Promise<Product | undefined>;
  
  // Loan operations
  createLoanApplication(loan: any): Promise<LoanApplication>;
  getLoanApplications(userId?: string): Promise<LoanApplication[]>;
  updateLoanApplication(id: string, loan: any): Promise<LoanApplication | undefined>;
  
  // CMS operations
  getCmsPages(): Promise<CmsPage[]>;
  getCmsPage(slug: string): Promise<CmsPage | undefined>;
  createCmsPage(page: any): Promise<CmsPage>;
  updateCmsPage(id: string, page: any): Promise<CmsPage | undefined>;
  
  // Profile operations
  getUserProfile(userId: string): Promise<any>;
  updateUserProfile(userId: string, profile: any): Promise<any>;
  
  // Additional user data
  getUserApplications(userId: string): Promise<any[]>;
  getUserBookmarks(userId: string): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users).set(user).where(eq(users.id, id)).returning();
    return result[0];
  }

  // User roles
  async getUserRoles(userId: string): Promise<string[]> {
    const result = await db.select().from(userRoles).where(eq(userRoles.userId, userId));
    return result.map(role => role.role);
  }

  async assignRole(userId: string, role: string): Promise<void> {
    await db.insert(userRoles).values({ userId, role });
  }

  // Agent operations
  async getAgent(userId: string): Promise<Agent | undefined> {
    const result = await db.select().from(agents).where(eq(agents.userId, userId));
    return result[0];
  }

  async createAgent(agent: any): Promise<Agent> {
    const result = await db.insert(agents).values(agent).returning();
    return result[0];
  }

  async updateAgentCommissions(agentId: string, commissions: any): Promise<void> {
    await db.update(agents).set(commissions).where(eq(agents.id, agentId));
  }

  // Job operations
  async getJobs(): Promise<Job[]> {
    return await db.select().from(jobs).orderBy(desc(jobs.createdAt));
  }

  async getJob(id: string): Promise<Job | undefined> {
    const result = await db.select().from(jobs).where(eq(jobs.id, id));
    return result[0];
  }

  async createJob(job: any): Promise<Job> {
    const result = await db.insert(jobs).values(job).returning();
    return result[0];
  }

  async updateJob(id: string, job: any): Promise<Job | undefined> {
    const result = await db.update(jobs).set(job).where(eq(jobs.id, id)).returning();
    return result[0];
  }

  // Job applications
  async getJobApplications(jobId?: string): Promise<JobApplication[]> {
    if (jobId) {
      return await db.select().from(jobApplications).where(eq(jobApplications.jobId, jobId));
    }
    return await db.select().from(jobApplications);
  }

  async createJobApplication(application: any): Promise<JobApplication> {
    const result = await db.insert(jobApplications).values(application).returning();
    return result[0];
  }

  async updateJobApplicationStatus(id: string, status: string): Promise<void> {
    await db.update(jobApplications).set({ status }).where(eq(jobApplications.id, id));
  }

  // Competition operations
  async getCompetitions(): Promise<Competition[]> {
    return await db.select().from(competitions).orderBy(desc(competitions.createdAt));
  }

  async getCompetition(id: string): Promise<Competition | undefined> {
    const result = await db.select().from(competitions).where(eq(competitions.id, id));
    return result[0];
  }

  async createCompetition(competition: any): Promise<Competition> {
    const result = await db.insert(competitions).values(competition).returning();
    return result[0];
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.isActive, true)).orderBy(desc(products.createdAt));
  }

  async createProduct(product: any): Promise<Product> {
    const result = await db.insert(products).values(product).returning();
    return result[0];
  }

  async updateProduct(id: string, product: any): Promise<Product | undefined> {
    const result = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return result[0];
  }

  // Loan operations
  async createLoanApplication(loan: any): Promise<LoanApplication> {
    const result = await db.insert(loanApplications).values(loan).returning();
    return result[0];
  }

  async getLoanApplications(userId?: string): Promise<LoanApplication[]> {
    if (userId) {
      return await db.select().from(loanApplications).where(eq(loanApplications.userId, userId));
    }
    return await db.select().from(loanApplications);
  }

  async updateLoanApplication(id: string, loan: any): Promise<LoanApplication | undefined> {
    const result = await db.update(loanApplications).set(loan).where(eq(loanApplications.id, id)).returning();
    return result[0];
  }

  // CMS operations
  async getCmsPages(): Promise<CmsPage[]> {
    return await db.select().from(cmsPages).where(eq(cmsPages.status, 'published')).orderBy(desc(cmsPages.createdAt));
  }

  async getCmsPage(slug: string): Promise<CmsPage | undefined> {
    const result = await db.select().from(cmsPages).where(eq(cmsPages.slug, slug));
    return result[0];
  }

  async createCmsPage(page: any): Promise<CmsPage> {
    const result = await db.insert(cmsPages).values(page).returning();
    return result[0];
  }

  async updateCmsPage(id: string, page: any): Promise<CmsPage | undefined> {
    const result = await db.update(cmsPages).set(page).where(eq(cmsPages.id, id)).returning();
    return result[0];
  }

  // Profile operations
  async getUserProfile(userId: string): Promise<any> {
    try {
      const result = await db.select().from(users).where(eq(users.id, userId));
      if (result[0]) {
        const { password, ...profile } = result[0];
        return profile;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  async updateUserProfile(userId: string, profile: any): Promise<any> {
    try {
      const result = await db.update(users).set(profile).where(eq(users.id, userId)).returning();
      if (result[0]) {
        const { password, ...updatedProfile } = result[0];
        return updatedProfile;
      }
      return null;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
  }

  // Additional user data
  async getUserApplications(userId: string): Promise<any[]> {
    try {
      const result = await db.select().from(jobApplications).where(eq(jobApplications.applicantId, userId));
      return result || [];
    } catch (error) {
      console.error('Error getting user applications:', error);
      return [];
    }
  }

  async getUserBookmarks(userId: string): Promise<any[]> {
    try {
      // For now, return empty array as bookmarks table may not exist
      return [];
    } catch (error) {
      console.error('Error getting user bookmarks:', error);
      return [];
    }
  }
}

export const storage = new DatabaseStorage();
