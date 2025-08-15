var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import dotenv from "dotenv";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { eq, desc } from "drizzle-orm";

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  affiliateWithdrawals: () => affiliateWithdrawals,
  agentTypeEnum: () => agentTypeEnum,
  agents: () => agents,
  cmsPages: () => cmsPages,
  companies: () => companies,
  competitionParticipants: () => competitionParticipants,
  competitionStatusEnum: () => competitionStatusEnum,
  competitionVotes: () => competitionVotes,
  competitions: () => competitions,
  discountUsage: () => discountUsage,
  distributors: () => distributors,
  insertAgentSchema: () => insertAgentSchema,
  insertCmsPageSchema: () => insertCmsPageSchema,
  insertCompetitionSchema: () => insertCompetitionSchema,
  insertJobApplicationSchema: () => insertJobApplicationSchema,
  insertJobSchema: () => insertJobSchema,
  insertLoanApplicationSchema: () => insertLoanApplicationSchema,
  insertProductSchema: () => insertProductSchema,
  insertUserSchema: () => insertUserSchema,
  jobApplications: () => jobApplications,
  jobs: () => jobs,
  loanApplications: () => loanApplications,
  merchants: () => merchants,
  paymentPlans: () => paymentPlans,
  products: () => products,
  userRoles: () => userRoles,
  users: () => users
});
import { pgTable, text, integer, boolean, timestamp, uuid, numeric, json, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var agentTypeEnum = pgEnum("agent_type", ["affiliate", "distributor"]);
var competitionStatusEnum = pgEnum("competition_status", ["active", "completed", "cancelled"]);
var users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  country: text("country"),
  dateOfBirth: timestamp("date_of_birth"),
  profilePictureUrl: text("profile_picture_url"),
  isEmailVerified: boolean("is_email_verified").default(false),
  isPhoneVerified: boolean("is_phone_verified").default(false),
  membershipTier: text("membership_tier").default("basic"),
  totalCreditsEarned: numeric("total_credits_earned").default("0"),
  totalCreditsSpent: numeric("total_credits_spent").default("0"),
  currentCredits: numeric("current_credits").default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var userRoles = pgTable("user_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var agents = pgTable("agents", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  agentType: agentTypeEnum("agent_type").default("affiliate"),
  referralCode: text("referral_code").notNull().unique(),
  qrCode: text("qr_code"),
  totalCommissions: numeric("total_commissions").default("0"),
  commissionsPending: numeric("commissions_pending").default("0"),
  commissionsWithdrawn: numeric("commissions_withdrawn").default("0"),
  isActive: boolean("is_active").default(true),
  approvalStatus: text("approval_status").default("pending"),
  approvedAt: timestamp("approved_at"),
  approvedBy: uuid("approved_by"),
  rejectionReason: text("rejection_reason"),
  applicationNotes: text("application_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var affiliateWithdrawals = pgTable("affiliate_withdrawals", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id").notNull().references(() => agents.id),
  withdrawalAmount: numeric("withdrawal_amount").notNull(),
  withdrawalMethod: text("withdrawal_method").notNull(),
  accountDetails: json("account_details"),
  status: text("status").default("pending"),
  requestedAt: timestamp("requested_at").defaultNow(),
  processedAt: timestamp("processed_at"),
  processedBy: uuid("processed_by"),
  transactionReference: text("transaction_reference"),
  processingNotes: text("processing_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  website: text("website"),
  logoUrl: text("logo_url"),
  industry: text("industry"),
  size: text("size"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").notNull().references(() => companies.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements"),
  benefits: text("benefits"),
  salaryMin: numeric("salary_min"),
  salaryMax: numeric("salary_max"),
  location: text("location"),
  jobType: text("job_type"),
  experienceLevel: text("experience_level"),
  skills: text("skills").array(),
  isRemote: boolean("is_remote").default(false),
  isActive: boolean("is_active").default(true),
  applicationDeadline: timestamp("application_deadline"),
  postedBy: uuid("posted_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var jobApplications = pgTable("job_applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id").notNull().references(() => jobs.id),
  applicantId: uuid("applicant_id").notNull().references(() => users.id),
  fullName: text("full_name"),
  email: text("email"),
  phone: text("phone"),
  resumeUrl: text("resume_url"),
  coverLetter: text("cover_letter"),
  skills: text("skills").array(),
  experienceYears: integer("experience_years"),
  education: text("education"),
  workExperience: text("work_experience"),
  portfolioUrl: text("portfolio_url"),
  expectedSalary: numeric("expected_salary"),
  availableFrom: timestamp("available_from"),
  status: text("status").default("pending"),
  appliedAt: timestamp("applied_at").defaultNow()
});
var competitions = pgTable("competitions", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  prize: text("prize"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  maxEntries: integer("max_entries"),
  currentEntries: integer("current_entries").default(0),
  location: text("location"),
  status: competitionStatusEnum("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var competitionParticipants = pgTable("competition_participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  competitionId: uuid("competition_id").notNull().references(() => competitions.id),
  userId: uuid("user_id").notNull().references(() => users.id),
  participantName: text("participant_name").notNull(),
  participantPhone: text("participant_phone").notNull(),
  profilePictureUrl: text("profile_picture_url"),
  voteCount: integer("vote_count").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var competitionVotes = pgTable("competition_votes", {
  id: uuid("id").primaryKey().defaultRandom(),
  competitionId: uuid("competition_id").notNull().references(() => competitions.id),
  participantId: uuid("participant_id").notNull().references(() => competitionParticipants.id),
  voterId: uuid("voter_id").notNull().references(() => users.id),
  voteDate: timestamp("vote_date").defaultNow(),
  votedAt: timestamp("voted_at").defaultNow()
});
var merchants = pgTable("merchants", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessName: text("business_name").notNull(),
  contactPerson: text("contact_person"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  country: text("country"),
  businessType: text("business_type"),
  discountPercentage: numeric("discount_percentage"),
  logoUrl: text("logo_url"),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  sellerId: uuid("seller_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  price: numeric("price").notNull(),
  category: text("category"),
  condition: text("condition"),
  location: text("location"),
  images: text("images").array(),
  contactInfo: text("contact_info"),
  isActive: boolean("is_active").default(true),
  featured: boolean("featured").default(false),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var discountUsage = pgTable("discount_usage", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  merchantId: uuid("merchant_id").notNull().references(() => merchants.id),
  discountPercentage: numeric("discount_percentage"),
  amountSaved: numeric("amount_saved"),
  usedAt: timestamp("used_at").defaultNow()
});
var cmsPages = pgTable("cms_pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  pageType: text("page_type").default("page"),
  status: text("status").default("draft"),
  authorId: uuid("author_id").references(() => users.id),
  lastModifiedBy: uuid("last_modified_by").references(() => users.id),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),
  featuredImageUrl: text("featured_image_url"),
  isFeatured: boolean("is_featured").default(false),
  viewCount: integer("view_count").default(0),
  publishDate: timestamp("publish_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var loanApplications = pgTable("loan_applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  loanType: text("loan_type").notNull(),
  requestedAmount: numeric("requested_amount").notNull(),
  monthlyIncome: numeric("monthly_income"),
  employmentStatus: text("employment_status"),
  employmentDuration: text("employment_duration"),
  purpose: text("purpose"),
  collateral: text("collateral"),
  status: text("status").default("pending"),
  applicationDate: timestamp("application_date").defaultNow(),
  processingNotes: text("processing_notes"),
  approvedAmount: numeric("approved_amount"),
  interestRate: numeric("interest_rate"),
  termMonths: integer("term_months"),
  approvedAt: timestamp("approved_at"),
  approvedBy: uuid("approved_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var paymentPlans = pgTable("payment_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  productName: text("product_name").notNull(),
  totalAmount: numeric("total_amount").notNull(),
  downPayment: numeric("down_payment").default("0"),
  monthlyPayment: numeric("monthly_payment").notNull(),
  numberOfPayments: integer("number_of_payments").notNull(),
  interestRate: numeric("interest_rate").default("0"),
  status: text("status").default("active"),
  startDate: timestamp("start_date").defaultNow(),
  nextPaymentDate: timestamp("next_payment_date"),
  completedPayments: integer("completed_payments").default(0),
  totalPaid: numeric("total_paid").default("0"),
  remainingBalance: numeric("remaining_balance"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var distributors = pgTable("distributors", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  businessName: text("business_name"),
  businessRegistrationNumber: text("business_registration_number"),
  distributorType: text("distributor_type").notNull(),
  contactPerson: text("contact_person"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  country: text("country"),
  territoryCoverage: text("territory_coverage"),
  productsDistributed: text("products_distributed").array(),
  commissionRate: numeric("commission_rate"),
  totalSales: numeric("total_sales").default("0"),
  totalCommissionEarned: numeric("total_commission_earned").default("0"),
  commissionPending: numeric("commission_pending").default("0"),
  commissionWithdrawn: numeric("commission_withdrawn").default("0"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertAgentSchema = createInsertSchema(agents).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertJobApplicationSchema = createInsertSchema(jobApplications).omit({
  id: true,
  appliedAt: true
});
var insertCompetitionSchema = createInsertSchema(competitions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertLoanApplicationSchema = createInsertSchema(loanApplications).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertCmsPageSchema = createInsertSchema(cmsPages).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// server/db.ts
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
var DatabaseStorage = class {
  // User operations
  async getUser(id) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }
  async getUserByEmail(email) {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }
  async createUser(user) {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }
  async updateUser(id, user) {
    const result = await db.update(users).set(user).where(eq(users.id, id)).returning();
    return result[0];
  }
  // User roles
  async getUserRoles(userId) {
    const result = await db.select().from(userRoles).where(eq(userRoles.userId, userId));
    return result.map((role) => role.role);
  }
  async assignRole(userId, role) {
    await db.insert(userRoles).values({ userId, role });
  }
  // Agent operations
  async getAgent(userId) {
    const result = await db.select().from(agents).where(eq(agents.userId, userId));
    return result[0];
  }
  async createAgent(agent) {
    const result = await db.insert(agents).values(agent).returning();
    return result[0];
  }
  async updateAgentCommissions(agentId, commissions) {
    await db.update(agents).set(commissions).where(eq(agents.id, agentId));
  }
  // Job operations
  async getJobs() {
    return await db.select().from(jobs).orderBy(desc(jobs.createdAt));
  }
  async getJob(id) {
    const result = await db.select().from(jobs).where(eq(jobs.id, id));
    return result[0];
  }
  async createJob(job) {
    const result = await db.insert(jobs).values(job).returning();
    return result[0];
  }
  async updateJob(id, job) {
    const result = await db.update(jobs).set(job).where(eq(jobs.id, id)).returning();
    return result[0];
  }
  // Job applications
  async getJobApplications(jobId) {
    if (jobId) {
      return await db.select().from(jobApplications).where(eq(jobApplications.jobId, jobId));
    }
    return await db.select().from(jobApplications);
  }
  async createJobApplication(application) {
    const result = await db.insert(jobApplications).values(application).returning();
    return result[0];
  }
  async updateJobApplicationStatus(id, status) {
    await db.update(jobApplications).set({ status }).where(eq(jobApplications.id, id));
  }
  // Competition operations
  async getCompetitions() {
    return await db.select().from(competitions).orderBy(desc(competitions.createdAt));
  }
  async getCompetition(id) {
    const result = await db.select().from(competitions).where(eq(competitions.id, id));
    return result[0];
  }
  async createCompetition(competition) {
    const result = await db.insert(competitions).values(competition).returning();
    return result[0];
  }
  // Product operations
  async getProducts() {
    return await db.select().from(products).where(eq(products.isActive, true)).orderBy(desc(products.createdAt));
  }
  async createProduct(product) {
    const result = await db.insert(products).values(product).returning();
    return result[0];
  }
  async updateProduct(id, product) {
    const result = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return result[0];
  }
  // Loan operations
  async createLoanApplication(loan) {
    const result = await db.insert(loanApplications).values(loan).returning();
    return result[0];
  }
  async getLoanApplications(userId) {
    if (userId) {
      return await db.select().from(loanApplications).where(eq(loanApplications.userId, userId));
    }
    return await db.select().from(loanApplications);
  }
  async updateLoanApplication(id, loan) {
    const result = await db.update(loanApplications).set(loan).where(eq(loanApplications.id, id)).returning();
    return result[0];
  }
  // CMS operations
  async getCmsPages() {
    return await db.select().from(cmsPages).where(eq(cmsPages.status, "published")).orderBy(desc(cmsPages.createdAt));
  }
  async getCmsPage(slug) {
    const result = await db.select().from(cmsPages).where(eq(cmsPages.slug, slug));
    return result[0];
  }
  async createCmsPage(page) {
    const result = await db.insert(cmsPages).values(page).returning();
    return result[0];
  }
  async updateCmsPage(id, page) {
    const result = await db.update(cmsPages).set(page).where(eq(cmsPages.id, id)).returning();
    return result[0];
  }
  // Profile operations
  async getUserProfile(userId) {
    try {
      const result = await db.select().from(users).where(eq(users.id, userId));
      if (result[0]) {
        const { password, ...profile } = result[0];
        return profile;
      }
      return null;
    } catch (error) {
      console.error("Error getting user profile:", error);
      return null;
    }
  }
  async updateUserProfile(userId, profile) {
    try {
      const result = await db.update(users).set(profile).where(eq(users.id, userId)).returning();
      if (result[0]) {
        const { password, ...updatedProfile } = result[0];
        return updatedProfile;
      }
      return null;
    } catch (error) {
      console.error("Error updating user profile:", error);
      return null;
    }
  }
  // Additional user data
  async getUserApplications(userId) {
    try {
      const result = await db.select().from(jobApplications).where(eq(jobApplications.applicantId, userId));
      return result || [];
    } catch (error) {
      console.error("Error getting user applications:", error);
      return [];
    }
  }
  async getUserBookmarks(userId) {
    try {
      return [];
    } catch (error) {
      console.error("Error getting user bookmarks:", error);
      return [];
    }
  }
};
var storage = new DatabaseStorage();

// server/routes/projects.ts
import { Router } from "express";
var router = Router();
var mockProjects = [
  {
    id: "1",
    title: "Clean Water Initiative",
    description: "Providing clean water access to rural communities",
    category: "Community Development",
    targetAmount: 5e4,
    currentAmount: 12500,
    location: "Bamako, Mali",
    status: "active",
    submitterId: "user1",
    submitterName: "Community Leader",
    createdAt: (/* @__PURE__ */ new Date("2024-01-15")).toISOString(),
    supporters: 25,
    beneficiaries: "Rural families in Bamako outskirts",
    expectedImpact: "Improved health and quality of life for 500+ families",
    projectPlan: "Install 5 water wells with filtration systems over 6 months"
  },
  {
    id: "2",
    title: "School Library Project",
    description: "Building a digital library for primary schools",
    category: "Education",
    targetAmount: 3e4,
    currentAmount: 8500,
    location: "Dakar, Senegal",
    status: "active",
    submitterId: "user2",
    submitterName: "Teacher Association",
    createdAt: (/* @__PURE__ */ new Date("2024-02-01")).toISOString(),
    supporters: 18,
    beneficiaries: "Students and teachers in rural schools",
    expectedImpact: "Enhanced learning opportunities for 800+ students",
    projectPlan: "Setup digital library with tablets and educational content"
  }
];
router.get("/", (req, res) => {
  try {
    res.json(mockProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});
router.get("/:id", (req, res) => {
  try {
    const project = mockProjects.find((p) => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Failed to fetch project" });
  }
});
router.post("/", (req, res) => {
  try {
    const newProject = {
      id: `project_${Date.now()}`,
      ...req.body,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      currentAmount: 0,
      supporters: 0,
      status: "pending_review"
    };
    mockProjects.push(newProject);
    console.log("New project submitted:", newProject.title);
    res.status(201).json({
      success: true,
      message: "Project submitted successfully",
      project: newProject
    });
  } catch (error) {
    console.error("Error submitting project:", error);
    res.status(500).json({ error: "Failed to submit project" });
  }
});
var projects_default = router;

// server/routes.ts
async function registerRoutes(app2) {
  app2.use("/api/projects", projects_default);
  app2.get("/api/discounts/sectors", async (req, res) => {
    try {
      const sectors = [
        { id: "1", name: "Food & Drink", description: "Restaurants, cafes, and food delivery" },
        { id: "2", name: "Technology", description: "Electronics, gadgets, and tech services" },
        { id: "3", name: "Travel & Tourism", description: "Hotels, flights, and travel packages" },
        { id: "4", name: "Fashion & Beauty", description: "Clothing, accessories, and beauty services" },
        { id: "5", name: "Health & Wellness", description: "Medical services, fitness, and wellness" },
        { id: "6", name: "Education", description: "Courses, books, and educational services" },
        { id: "7", name: "Entertainment", description: "Movies, games, and recreational activities" },
        { id: "8", name: "Home & Garden", description: "Furniture, appliances, and home improvement" },
        { id: "9", name: "Automotive", description: "Car services, parts, and transportation" },
        { id: "10", name: "Professional Services", description: "Business services, consulting, and legal" }
      ];
      res.json(sectors);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch discount sectors" });
    }
  });
  app2.get("/api/discounts/featured", async (req, res) => {
    try {
      const featuredDiscounts = [
        {
          id: "f1",
          title: "ZENIKA Card Special - Premium Dining",
          merchant: "Restaurant Le Palmier",
          sector: "Food & Drink",
          discount_percentage: 25,
          description: "Exclusive 25% off all meals with your ZENIKA card. Valid for premium dining experiences.",
          location: "Bamako, Mali",
          image_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600",
          featured: true,
          valid_until: "2025-12-31",
          terms: "Valid for dine-in only. Cannot be combined with other offers.",
          rating: 4.8,
          reviews_count: 156
        },
        {
          id: "f2",
          title: "Tech Hub Discount - Electronics",
          merchant: "Digital World Electronics",
          sector: "Technology",
          discount_percentage: 30,
          description: "Get 30% off on all smartphones, laptops, and accessories. Special pricing for Elverra clients.",
          location: "Dakar, Senegal",
          image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600",
          featured: true,
          valid_until: "2025-11-30",
          terms: "Valid on purchases above 100,000 CFA. Warranty included.",
          rating: 4.6,
          reviews_count: 89
        },
        {
          id: "f3",
          title: "Travel Paradise - Hotel Stays",
          merchant: "Paradise Resort & Spa",
          sector: "Travel & Tourism",
          discount_percentage: 40,
          description: "Luxury accommodation with 40% off weekend stays. Includes breakfast and spa access.",
          location: "Abidjan, Ivory Coast",
          image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
          featured: true,
          valid_until: "2025-10-31",
          terms: "Weekend bookings only. Minimum 2 nights stay required.",
          rating: 4.9,
          reviews_count: 203
        }
      ];
      res.json(featuredDiscounts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured discounts" });
    }
  });
  app2.get("/api/discounts", async (req, res) => {
    try {
      const { sector, location, search } = req.query;
      let allDiscounts = [
        // Food & Drink
        {
          id: "d1",
          title: "Coffee Corner Special",
          merchant: "Caf\xE9 Bella Vista",
          sector: "Food & Drink",
          discount_percentage: 15,
          description: "Fresh coffee and pastries with 15% client discount every morning.",
          location: "Bamako, Mali",
          image_url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400",
          rating: 4.3,
          featured: false
        },
        {
          id: "d2",
          title: "Family Feast Deal",
          merchant: "Mama Africa Restaurant",
          sector: "Food & Drink",
          discount_percentage: 20,
          description: "Traditional West African cuisine with family-style portions at 20% off.",
          location: "Dakar, Senegal",
          image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
          rating: 4.7,
          featured: false
        },
        // Technology
        {
          id: "d3",
          title: "Mobile Repair Service",
          merchant: "TechFix Solutions",
          sector: "Technology",
          discount_percentage: 25,
          description: "Professional mobile phone and tablet repair services with parts warranty.",
          location: "Abidjan, Ivory Coast",
          image_url: "https://images.unsplash.com/photo-1621768216002-5ac171876625?w=400",
          rating: 4.4,
          featured: false
        },
        {
          id: "d4",
          title: "Computer Training Course",
          merchant: "Digital Skills Academy",
          sector: "Technology",
          discount_percentage: 35,
          description: "Comprehensive computer literacy and Microsoft Office training programs.",
          location: "Ouagadougou, Burkina Faso",
          image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
          rating: 4.5,
          featured: false
        },
        // Travel & Tourism
        {
          id: "d5",
          title: "City Tour Package",
          merchant: "Explore Mali Tours",
          sector: "Travel & Tourism",
          discount_percentage: 30,
          description: "Guided city tours with transportation and refreshments included.",
          location: "Bamako, Mali",
          image_url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
          rating: 4.6,
          featured: false
        },
        // Fashion & Beauty
        {
          id: "d6",
          title: "African Print Fashion",
          merchant: "Kente Style Boutique",
          sector: "Fashion & Beauty",
          discount_percentage: 20,
          description: "Authentic African prints and modern fashion designs for all occasions.",
          location: "Accra, Ghana",
          image_url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400",
          rating: 4.4,
          featured: false
        },
        {
          id: "d7",
          title: "Beauty Salon Package",
          merchant: "Elegant Beauty Spa",
          sector: "Fashion & Beauty",
          discount_percentage: 25,
          description: "Complete beauty treatments including hair styling, manicure, and facial services.",
          location: "Dakar, Senegal",
          image_url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400",
          rating: 4.8,
          featured: false
        },
        // Health & Wellness
        {
          id: "d8",
          title: "Fitness Center Membership",
          merchant: "Active Life Gym",
          sector: "Health & Wellness",
          discount_percentage: 30,
          description: "Monthly gym membership with access to all equipment and group classes.",
          location: "Abidjan, Ivory Coast",
          image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
          rating: 4.5,
          featured: false
        },
        // Education
        {
          id: "d9",
          title: "Language Learning Course",
          merchant: "Polyglot Institute",
          sector: "Education",
          discount_percentage: 40,
          description: "English, French, and local language courses with certified instructors.",
          location: "Bamako, Mali",
          image_url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400",
          rating: 4.7,
          featured: false
        }
      ];
      if (sector && sector !== "all") {
        allDiscounts = allDiscounts.filter((d) => d.sector === sector);
      }
      if (location && location !== "all") {
        allDiscounts = allDiscounts.filter((d) => d.location.includes(location));
      }
      if (search) {
        const searchLower = search.toString().toLowerCase();
        allDiscounts = allDiscounts.filter(
          (d) => d.title.toLowerCase().includes(searchLower) || d.merchant.toLowerCase().includes(searchLower) || d.description.toLowerCase().includes(searchLower)
        );
      }
      res.json(allDiscounts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch discounts" });
    }
  });
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
      const user = await storage.createUser(userData);
      res.json({ user: { id: user.id, email: user.email, fullName: user.fullName } });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Registration failed" });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const roles = await storage.getUserRoles(user.id);
      res.json({ user: { id: user.id, email: user.email, fullName: user.fullName }, roles });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });
  app2.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user" });
    }
  });
  app2.put("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.updateUser(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });
  app2.post("/api/admin/operations", async (req, res) => {
    try {
      const { operation, email, password } = req.body;
      switch (operation) {
        case "check_admin_exists": {
          if (!email) {
            return res.status(400).json({ error: "Email is required" });
          }
          const user = await storage.getUserByEmail(email);
          if (!user) {
            return res.json({ exists: false, hasAdminRole: false });
          }
          const roles = await storage.getUserRoles(user.id);
          const hasAdminRole = roles.includes("admin");
          res.json({
            exists: true,
            hasAdminRole,
            userId: user.id
          });
          break;
        }
        case "create_admin": {
          if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
          }
          const existingUser = await storage.getUserByEmail(email);
          if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
          }
          const user = await storage.createUser({
            email,
            password,
            fullName: "Admin User",
            isEmailVerified: true
          });
          await storage.assignRole(user.id, "admin");
          res.json({
            success: true,
            userId: user.id,
            email: user.email
          });
          break;
        }
        case "assign_admin_role": {
          if (!email) {
            return res.status(400).json({ error: "Email is required" });
          }
          const user = await storage.getUserByEmail(email);
          if (!user) {
            return res.status(404).json({ error: "User not found" });
          }
          await storage.assignRole(user.id, "admin");
          res.json({ success: true });
          break;
        }
        default:
          res.status(400).json({ error: "Invalid operation" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.get("/api/jobs", async (req, res) => {
    try {
      const jobs2 = await storage.getJobs();
      res.json(jobs2);
    } catch (error) {
      res.status(500).json({ error: "Failed to get jobs" });
    }
  });
  app2.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      res.status(500).json({ error: "Failed to get job" });
    }
  });
  app2.post("/api/jobs", async (req, res) => {
    try {
      const jobData = insertJobSchema.parse(req.body);
      const job = await storage.createJob(jobData);
      res.json(job);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to create job" });
    }
  });
  app2.get("/api/job-applications", async (req, res) => {
    try {
      const jobId = req.query.jobId;
      const applications = await storage.getJobApplications(jobId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ error: "Failed to get job applications" });
    }
  });
  app2.post("/api/job-applications", async (req, res) => {
    try {
      const applicationData = insertJobApplicationSchema.parse(req.body);
      const application = await storage.createJobApplication(applicationData);
      res.json(application);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to create application" });
    }
  });
  app2.put("/api/job-applications/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      await storage.updateJobApplicationStatus(req.params.id, status);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update application status" });
    }
  });
  app2.get("/api/competitions", async (req, res) => {
    try {
      const competitions2 = await storage.getCompetitions();
      res.json(competitions2);
    } catch (error) {
      res.status(500).json({ error: "Failed to get competitions" });
    }
  });
  app2.get("/api/competitions/:id", async (req, res) => {
    try {
      const competition = await storage.getCompetition(req.params.id);
      if (!competition) {
        return res.status(404).json({ error: "Competition not found" });
      }
      res.json(competition);
    } catch (error) {
      res.status(500).json({ error: "Failed to get competition" });
    }
  });
  app2.post("/api/competitions", async (req, res) => {
    try {
      const competition = await storage.createCompetition(req.body);
      res.json(competition);
    } catch (error) {
      res.status(400).json({ error: "Failed to create competition" });
    }
  });
  app2.get("/api/products", async (req, res) => {
    try {
      const products2 = await storage.getProducts();
      res.json(products2);
    } catch (error) {
      res.status(500).json({ error: "Failed to get products" });
    }
  });
  app2.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to create product" });
    }
  });
  app2.put("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to update product" });
    }
  });
  app2.get("/api/loan-applications", async (req, res) => {
    try {
      const userId = req.query.userId;
      const loans = await storage.getLoanApplications(userId);
      res.json(loans);
    } catch (error) {
      res.status(500).json({ error: "Failed to get loan applications" });
    }
  });
  app2.post("/api/loan-applications", async (req, res) => {
    try {
      const loanData = insertLoanApplicationSchema.parse(req.body);
      const loan = await storage.createLoanApplication(loanData);
      res.json(loan);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to create loan application" });
    }
  });
  app2.put("/api/loan-applications/:id", async (req, res) => {
    try {
      const loan = await storage.updateLoanApplication(req.params.id, req.body);
      if (!loan) {
        return res.status(404).json({ error: "Loan application not found" });
      }
      res.json(loan);
    } catch (error) {
      res.status(500).json({ error: "Failed to update loan application" });
    }
  });
  app2.get("/api/cms-pages", async (req, res) => {
    try {
      const pages = await storage.getCmsPages();
      res.json(pages);
    } catch (error) {
      res.status(500).json({ error: "Failed to get CMS pages" });
    }
  });
  app2.get("/api/cms-pages/:slug", async (req, res) => {
    try {
      const page = await storage.getCmsPage(req.params.slug);
      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      res.status(500).json({ error: "Failed to get page" });
    }
  });
  app2.post("/api/cms-pages", async (req, res) => {
    try {
      const page = await storage.createCmsPage(req.body);
      res.json(page);
    } catch (error) {
      res.status(400).json({ error: "Failed to create page" });
    }
  });
  app2.put("/api/cms-pages/:id", async (req, res) => {
    try {
      const page = await storage.updateCmsPage(req.params.id, req.body);
      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      res.status(500).json({ error: "Failed to update page" });
    }
  });
  app2.post("/api/cms-pages/:id/views", async (req, res) => {
    try {
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update view count" });
    }
  });
  app2.get("/api/agents/:userId", async (req, res) => {
    try {
      const agent = await storage.getAgent(req.params.userId);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      res.status(500).json({ error: "Failed to get agent" });
    }
  });
  app2.post("/api/agents", async (req, res) => {
    try {
      const agent = await storage.createAgent(req.body);
      res.json(agent);
    } catch (error) {
      res.status(400).json({ error: "Failed to create agent" });
    }
  });
  app2.put("/api/agents/:id/commissions", async (req, res) => {
    try {
      await storage.updateAgentCommissions(req.params.id, req.body);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update commissions" });
    }
  });
  app2.post("/api/payments/initiate-orange-money", async (req, res) => {
    try {
      const { amount, currency, phone, email, name, reference } = req.body;
      const clientId = process.env.ORANGE_CLIENT_ID;
      const clientSecret = process.env.ORANGE_CLIENT_SECRET;
      const merchantKey = process.env.ORANGE_MERCHANT_KEY;
      if (!clientId || !clientSecret || !merchantKey) {
        console.error("Missing Orange Money credentials");
        return res.status(500).json({
          success: false,
          error: "Orange Money service configuration incomplete"
        });
      }
      const orangeConfig = {
        clientId,
        clientSecret,
        merchantKey,
        merchantLogin: "MerchantWP00100",
        merchantAccountNumber: "7701900100",
        merchantCode: "101021",
        merchantName: "ELVERRA GLOBAL",
        baseUrl: "https://api.orange.com/orange-money-webpay/dev/v1",
        authHeader: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`
      };
      const tokenResponse = await fetch(`${orangeConfig.baseUrl}/oauth/v1/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        },
        body: `grant_type=client_credentials&client_id=${orangeConfig.clientId}&client_secret=${orangeConfig.clientSecret}`
      });
      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error("Failed to get Orange Money token:", tokenResponse.status, errorText);
        return res.status(500).json({
          success: false,
          error: "Failed to authenticate with Orange Money service",
          details: errorText
        });
      }
      const tokenData = await tokenResponse.json();
      const paymentRequest = {
        merchant_key: orangeConfig.merchantKey,
        currency,
        order_id: reference,
        amount,
        return_url: `${req.protocol}://${req.get("host")}/payment-success`,
        cancel_url: `${req.protocol}://${req.get("host")}/payment-cancel`,
        notif_url: `${req.protocol}://${req.get("host")}/api/payments/orange-callback`,
        lang: "fr",
        reference
      };
      const paymentResponse = await fetch(`${orangeConfig.baseUrl}/webpayment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokenData.access_token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify(paymentRequest)
      });
      if (!paymentResponse.ok) {
        const errorText = await paymentResponse.text();
        console.error("Failed to create Orange Money payment:", paymentResponse.status, errorText);
        return res.status(500).json({
          success: false,
          error: "Failed to create Orange Money payment",
          details: errorText
        });
      }
      const paymentData = await paymentResponse.json();
      try {
        console.log("Payment initiated:", { reference, amount, currency, gateway: "orange_money" });
      } catch (dbError) {
        console.warn("Failed to store payment record:", dbError);
      }
      res.json({
        success: true,
        payment_url: paymentData.payment_url,
        reference: paymentData.payment_token || reference,
        amount,
        status: "initiated",
        transactionId: paymentData.payment_token
      });
    } catch (error) {
      console.error("Orange Money payment initiation error:", error);
      res.status(500).json({
        success: false,
        error: "Orange Money payment service temporarily unavailable",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get("/demo-payment", (req, res) => {
    const { amount, currency, reference, provider } = req.query;
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Demo Payment - ${String(provider).toUpperCase()} Money</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .payment-card { border: 2px solid ${provider === "sama" ? "#10b981" : "#ff6600"}; border-radius: 10px; padding: 30px; text-align: center; }
            .amount { font-size: 2em; color: ${provider === "sama" ? "#10b981" : "#ff6600"}; font-weight: bold; margin: 20px 0; }
            .btn { background: ${provider === "sama" ? "#10b981" : "#ff6600"}; color: white; border: none; padding: 15px 30px; border-radius: 5px; font-size: 1.1em; cursor: pointer; margin: 10px; }
            .btn:hover { background: ${provider === "sama" ? "#059669" : "#e55a00"}; }
            .demo-notice { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="payment-card">
            <h1>${provider === "sama" ? "\u{1F4B0}" : "\u{1F34A}"} ${String(provider).toUpperCase()} Money Payment</h1>
            <div class="demo-notice">
                <strong>Demo Mode:</strong> This is a simulated payment for testing purposes
            </div>
            <div class="amount">${amount} ${currency}</div>
            <p><strong>Reference:</strong> ${reference}</p>
            <p>Proceed with your payment using ${String(provider).toUpperCase()} Money</p>
            <button class="btn" onclick="simulateSuccess()">\u2705 Simulate Successful Payment</button>
            <button class="btn" onclick="simulateFailure()" style="background: #dc3545;">\u274C Simulate Failed Payment</button>
            <button class="btn" onclick="goBack()" style="background: #6c757d;">\u2190 Go Back</button>
        </div>
        <script>
            function simulateSuccess() {
                alert('Payment successful! Redirecting...');
                window.close();
                if (window.opener) {
                    window.opener.postMessage({type: 'payment-success', reference: '${reference}'}, '*');
                }
            }
            function simulateFailure() {
                alert('Payment failed! Please try again.');
                window.close();
                if (window.opener) {
                    window.opener.postMessage({type: 'payment-failed', reference: '${reference}'}, '*');
                }
            }
            function goBack() {
                window.close();
            }
        </script>
    </body>
    </html>
    `;
    res.send(html);
  });
  app2.post("/api/payments/verify", async (req, res) => {
    try {
      const { reference } = req.body;
      const verificationData = {
        success: true,
        status: "completed",
        reference,
        verified: true
      };
      res.json(verificationData);
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to verify payment"
      });
    }
  });
  app2.post("/api/payments/initiate-sama-money", async (req, res) => {
    try {
      const { amount, currency, phone, email, name, reference } = req.body;
      const merchantCode = process.env.SAMA_MERCHANT_CODE;
      const publicKey = process.env.SAMA_PUBLIC_KEY;
      const transactionKey = process.env.SAMA_TRANSACTION_KEY;
      const userId = process.env.SAMA_USER_ID;
      if (!merchantCode || !publicKey || !transactionKey || !userId) {
        console.warn("SAMA Money credentials not configured - service unavailable");
        return res.status(503).json({
          success: false,
          error: "SAMA Money service temporarily unavailable",
          message: "Payment gateway configuration incomplete. Please contact support."
        });
      }
      const samaConfig = {
        baseUrl: "https://smarchandamatest.sama.money/V1",
        merchantCode,
        publicKey,
        transactionKey,
        userId
      };
      const paymentData = {
        merchant_code: samaConfig.merchantCode,
        merchant_name: "ELVERRA GLOBAL",
        user_id: samaConfig.userId,
        amount,
        currency,
        customer_phone: phone,
        customer_name: name,
        customer_email: email,
        transaction_reference: reference,
        callback_url: `${req.protocol}://${req.get("host")}/api/payments/sama-callback`,
        return_url: `${req.protocol}://${req.get("host")}/payment-success`,
        public_key: samaConfig.publicKey,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      const response = await fetch(`${samaConfig.baseUrl}/payment/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Authorization": `Bearer ${samaConfig.publicKey}`,
          "Accept": "application/json",
          "X-Merchant-Code": samaConfig.merchantCode,
          "X-User-Id": samaConfig.userId
        },
        body: JSON.stringify(paymentData)
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("SAMA Money API error:", response.status, errorText);
        return res.status(500).json({
          success: false,
          error: "Failed to create SAMA Money payment",
          details: errorText
        });
      }
      const responseData = await response.json();
      try {
        console.log("Payment initiated:", { reference, amount, currency, gateway: "sama_money" });
      } catch (dbError) {
        console.warn("Failed to store payment record:", dbError);
      }
      res.json({
        success: true,
        payment_url: responseData.payment_url,
        reference: responseData.transaction_id || reference,
        amount,
        status: "initiated",
        transactionId: responseData.transaction_id
      });
    } catch (error) {
      console.error("SAMA Money payment initiation error:", error);
      res.status(500).json({
        success: false,
        error: "SAMA Money payment service temporarily unavailable",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get("/payment-success", (req, res) => {
    res.redirect("/#/thank-you?payment=success");
  });
  app2.get("/payment-cancel", (req, res) => {
    res.redirect("/#/membership-payment?payment=cancelled");
  });
  app2.post("/api/payments/orange-callback", async (req, res) => {
    try {
      console.log("Orange Money callback received:", req.body);
      res.json({ success: true, message: "Callback processed" });
    } catch (error) {
      console.error("Orange callback error:", error);
      res.status(500).json({ error: "Callback processing failed" });
    }
  });
  app2.post("/api/payments/sama-callback", async (req, res) => {
    try {
      console.log("SAMA Money callback received:", req.body);
      res.json({ success: true, message: "Callback processed" });
    } catch (error) {
      console.error("SAMA callback error:", error);
      res.status(500).json({ error: "Callback processing failed" });
    }
  });
  app2.get("/api/files/logo", (req, res) => {
    res.json({
      url: "/lovable-uploads/elverra-global-logo-new.jpeg",
      name: "Elverra Global Logo",
      success: true
    });
  });
  app2.get("/api/users/:id/profile", async (req, res) => {
    try {
      const profile = await storage.getUserProfile(req.params.id);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to get profile" });
    }
  });
  app2.put("/api/users/:id/profile", async (req, res) => {
    try {
      const profile = await storage.updateUserProfile(req.params.id, req.body);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to update profile" });
    }
  });
  app2.get("/api/users/:id/applications", async (req, res) => {
    try {
      const applications = await storage.getUserApplications(req.params.id);
      res.json(applications || []);
    } catch (error) {
      res.status(500).json({ error: "Failed to get applications" });
    }
  });
  app2.get("/api/users/:id/bookmarks", async (req, res) => {
    try {
      const bookmarks = await storage.getUserBookmarks(req.params.id);
      res.json(bookmarks || []);
    } catch (error) {
      res.status(500).json({ error: "Failed to get bookmarks" });
    }
  });
  app2.get("/api/products/categories", async (req, res) => {
    try {
      const categories = [
        { id: "1", name: "Electronics", description: "Electronic devices and gadgets" },
        { id: "2", name: "Fashion", description: "Clothing and accessories" },
        { id: "3", name: "Home & Garden", description: "Home improvement and garden items" },
        { id: "4", name: "Sports & Outdoors", description: "Sports equipment and outdoor gear" },
        { id: "5", name: "Books & Media", description: "Books, music, and other media" },
        { id: "6", name: "Automotive", description: "Car parts and automotive accessories" },
        { id: "7", name: "Health & Beauty", description: "Health and beauty products" },
        { id: "8", name: "Toys & Games", description: "Toys and gaming items" },
        { id: "9", name: "Food & Beverages", description: "Food and drink items" },
        { id: "10", name: "Other", description: "Other miscellaneous items" }
      ];
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to get categories" });
    }
  });
  app2.get("/api/memberships/:userId", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const membership = {
        id: req.params.userId,
        user_id: req.params.userId,
        tier: user.membershipTier || "basic",
        is_active: user.membershipTier === "premium" || user.membershipTier === "elite",
        start_date: (/* @__PURE__ */ new Date()).toISOString(),
        expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3).toISOString(),
        physical_card_requested: false,
        member_id: user.id
      };
      res.json(membership);
    } catch (error) {
      res.status(500).json({ error: "Failed to get membership" });
    }
  });
  app2.post("/api/memberships", async (req, res) => {
    try {
      const { user_id, tier, paymentReference } = req.body;
      const user = await storage.getUser(user_id);
      if (user) {
        await storage.updateUser(user_id, {
          membershipTier: tier || "premium"
        });
      }
      const membership = {
        id: `membership_${Date.now()}`,
        isActive: true,
        createdAt: /* @__PURE__ */ new Date(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3),
        paymentReference
      };
      res.json(membership);
    } catch (error) {
      res.status(500).json({ error: "Failed to create membership" });
    }
  });
  app2.get("/api/agents/:userId", async (req, res) => {
    try {
      const agent = await storage.getAgent(req.params.userId);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      res.status(500).json({ error: "Failed to get agent" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
dotenv.config();
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
