import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import projectRoutes from "./routes/projects";
import { insertUserSchema, insertJobSchema, insertJobApplicationSchema, insertProductSchema, insertLoanApplicationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Mount project routes
  app.use('/api/projects', projectRoutes);
  
  // Discount sectors endpoint
  app.get("/api/discounts/sectors", async (req, res) => {
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

  // Featured discounts endpoint
  app.get("/api/discounts/featured", async (req, res) => {
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

  // All discounts endpoint  
  app.get("/api/discounts", async (req, res) => {
    try {
      const { sector, location, search } = req.query;
      
      let allDiscounts = [
        // Food & Drink
        {
          id: "d1",
          title: "Coffee Corner Special",
          merchant: "Café Bella Vista",
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

      // Apply filters
      if (sector && sector !== 'all') {
        allDiscounts = allDiscounts.filter(d => d.sector === sector);
      }
      
      if (location && location !== 'all') {
        allDiscounts = allDiscounts.filter(d => d.location.includes(location));
      }
      
      if (search) {
        const searchLower = search.toString().toLowerCase();
        allDiscounts = allDiscounts.filter(d => 
          d.title.toLowerCase().includes(searchLower) ||
          d.merchant.toLowerCase().includes(searchLower) ||
          d.description.toLowerCase().includes(searchLower)
        );
      }

      res.json(allDiscounts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch discounts" });
    }
  });
  
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
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

  app.post("/api/auth/login", async (req, res) => {
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

  // User management routes
  app.get("/api/users/:id", async (req, res) => {
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

  app.put("/api/users/:id", async (req, res) => {
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

  // Admin operations (replacing Supabase Edge Function)
  app.post("/api/admin/operations", async (req, res) => {
    try {
      const { operation, email, password } = req.body;

      switch (operation) {
        case 'check_admin_exists': {
          if (!email) {
            return res.status(400).json({ error: 'Email is required' });
          }

          const user = await storage.getUserByEmail(email);
          if (!user) {
            return res.json({ exists: false, hasAdminRole: false });
          }

          const roles = await storage.getUserRoles(user.id);
          const hasAdminRole = roles.includes('admin');
          
          res.json({ 
            exists: true, 
            hasAdminRole,
            userId: user.id 
          });
          break;
        }

        case 'create_admin': {
          if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
          }

          const existingUser = await storage.getUserByEmail(email);
          if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
          }

          const user = await storage.createUser({
            email,
            password,
            fullName: 'Admin User',
            isEmailVerified: true
          });

          await storage.assignRole(user.id, 'admin');
          
          res.json({ 
            success: true, 
            userId: user.id,
            email: user.email 
          });
          break;
        }

        case 'assign_admin_role': {
          if (!email) {
            return res.status(400).json({ error: 'Email is required' });
          }

          const user = await storage.getUserByEmail(email);
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }

          await storage.assignRole(user.id, 'admin');
          res.json({ success: true });
          break;
        }

        default:
          res.status(400).json({ error: 'Invalid operation' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Job routes
  app.get("/api/jobs", async (req, res) => {
    try {
      const jobs = await storage.getJobs();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ error: "Failed to get jobs" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
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

  app.post("/api/jobs", async (req, res) => {
    try {
      const jobData = insertJobSchema.parse(req.body);
      const job = await storage.createJob(jobData);
      res.json(job);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to create job" });
    }
  });

  // Job applications
  app.get("/api/job-applications", async (req, res) => {
    try {
      const jobId = req.query.jobId as string;
      const applications = await storage.getJobApplications(jobId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ error: "Failed to get job applications" });
    }
  });

  app.post("/api/job-applications", async (req, res) => {
    try {
      const applicationData = insertJobApplicationSchema.parse(req.body);
      const application = await storage.createJobApplication(applicationData);
      res.json(application);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to create application" });
    }
  });

  app.put("/api/job-applications/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      await storage.updateJobApplicationStatus(req.params.id, status);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update application status" });
    }
  });

  // Competition routes
  app.get("/api/competitions", async (req, res) => {
    try {
      const competitions = await storage.getCompetitions();
      res.json(competitions);
    } catch (error) {
      res.status(500).json({ error: "Failed to get competitions" });
    }
  });

  app.get("/api/competitions/:id", async (req, res) => {
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

  app.post("/api/competitions", async (req, res) => {
    try {
      const competition = await storage.createCompetition(req.body);
      res.json(competition);
    } catch (error) {
      res.status(400).json({ error: "Failed to create competition" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to get products" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
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

  // Loan application routes
  app.get("/api/loan-applications", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const loans = await storage.getLoanApplications(userId);
      res.json(loans);
    } catch (error) {
      res.status(500).json({ error: "Failed to get loan applications" });
    }
  });

  app.post("/api/loan-applications", async (req, res) => {
    try {
      const loanData = insertLoanApplicationSchema.parse(req.body);
      const loan = await storage.createLoanApplication(loanData);
      res.json(loan);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to create loan application" });
    }
  });

  app.put("/api/loan-applications/:id", async (req, res) => {
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

  // CMS routes
  app.get("/api/cms-pages", async (req, res) => {
    try {
      const pages = await storage.getCmsPages();
      res.json(pages);
    } catch (error) {
      res.status(500).json({ error: "Failed to get CMS pages" });
    }
  });

  app.get("/api/cms-pages/:slug", async (req, res) => {
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

  app.post("/api/cms-pages", async (req, res) => {
    try {
      const page = await storage.createCmsPage(req.body);
      res.json(page);
    } catch (error) {
      res.status(400).json({ error: "Failed to create page" });
    }
  });

  app.put("/api/cms-pages/:id", async (req, res) => {
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

  // Increment view count for CMS pages (non-critical feature)
  app.post("/api/cms-pages/:id/views", async (req, res) => {
    try {
      // This is just a placeholder for view count tracking
      // In a real implementation, this would update the page view count
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update view count" });
    }
  });

  // Agent/affiliate routes
  app.get("/api/agents/:userId", async (req, res) => {
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

  app.post("/api/agents", async (req, res) => {
    try {
      const agent = await storage.createAgent(req.body);
      res.json(agent);
    } catch (error) {
      res.status(400).json({ error: "Failed to create agent" });
    }
  });

  app.put("/api/agents/:id/commissions", async (req, res) => {
    try {
      await storage.updateAgentCommissions(req.params.id, req.body);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update commissions" });
    }
  });

  // Payment gateway endpoints
  app.post("/api/payments/initiate-orange-money", async (req, res) => {
    try {
      const { amount, currency, phone, email, name, reference } = req.body;
      
      // Validate required environment variables
      const clientId = process.env.ORANGE_CLIENT_ID;
      const clientSecret = process.env.ORANGE_CLIENT_SECRET;
      const merchantKey = process.env.ORANGE_MERCHANT_KEY;
      
      if (!clientId || !clientSecret || !merchantKey) {
        console.error('Missing Orange Money credentials');
        return res.status(500).json({ 
          success: false, 
          error: 'Orange Money service configuration incomplete' 
        });
      }
      
      // Orange Money API configuration
      const orangeConfig = {
        clientId,
        clientSecret,
        merchantKey,
        merchantLogin: 'MerchantWP00100',
        merchantAccountNumber: '7701900100',
        merchantCode: '101021',
        merchantName: 'ELVERRA GLOBAL',
        baseUrl: 'https://api.orange.com/orange-money-webpay/dev/v1',
        authHeader: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      };

      // First, get access token - using form data format expected by Orange API
      const tokenResponse = await fetch(`${orangeConfig.baseUrl}/oauth/v1/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: `grant_type=client_credentials&client_id=${orangeConfig.clientId}&client_secret=${orangeConfig.clientSecret}`
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('Failed to get Orange Money token:', tokenResponse.status, errorText);
        return res.status(500).json({
          success: false,
          error: 'Failed to authenticate with Orange Money service',
          details: errorText
        });
      }

      const tokenData = await tokenResponse.json();
      
      // Create payment request
      const paymentRequest = {
        merchant_key: orangeConfig.merchantKey,
        currency,
        order_id: reference,
        amount: amount,
        return_url: `${req.protocol}://${req.get('host')}/payment-success`,
        cancel_url: `${req.protocol}://${req.get('host')}/payment-cancel`,
        notif_url: `${req.protocol}://${req.get('host')}/api/payments/orange-callback`,
        lang: 'fr',
        reference: reference
      };

      const paymentResponse = await fetch(`${orangeConfig.baseUrl}/webpayment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(paymentRequest)
      });

      if (!paymentResponse.ok) {
        const errorText = await paymentResponse.text();
        console.error('Failed to create Orange Money payment:', paymentResponse.status, errorText);
        return res.status(500).json({
          success: false,
          error: 'Failed to create Orange Money payment',
          details: errorText
        });
      }

      const paymentData = await paymentResponse.json();
      
      // Store payment record in database for tracking
      try {
        // For now, we'll skip database storage until the payment tables are set up
        console.log('Payment initiated:', { reference, amount, currency, gateway: 'orange_money' });
      } catch (dbError) {
        console.warn('Failed to store payment record:', dbError);
      }
      
      res.json({
        success: true,
        payment_url: paymentData.payment_url,
        reference: paymentData.payment_token || reference,
        amount,
        status: 'initiated',
        transactionId: paymentData.payment_token
      });
      
    } catch (error) {
      console.error('Orange Money payment initiation error:', error);
      res.status(500).json({
        success: false,
        error: 'Orange Money payment service temporarily unavailable',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Demo payment page route
  app.get("/demo-payment", (req, res) => {
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
            .payment-card { border: 2px solid ${provider === 'sama' ? '#10b981' : '#ff6600'}; border-radius: 10px; padding: 30px; text-align: center; }
            .amount { font-size: 2em; color: ${provider === 'sama' ? '#10b981' : '#ff6600'}; font-weight: bold; margin: 20px 0; }
            .btn { background: ${provider === 'sama' ? '#10b981' : '#ff6600'}; color: white; border: none; padding: 15px 30px; border-radius: 5px; font-size: 1.1em; cursor: pointer; margin: 10px; }
            .btn:hover { background: ${provider === 'sama' ? '#059669' : '#e55a00'}; }
            .demo-notice { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="payment-card">
            <h1>${provider === 'sama' ? '💰' : '🍊'} ${String(provider).toUpperCase()} Money Payment</h1>
            <div class="demo-notice">
                <strong>Demo Mode:</strong> This is a simulated payment for testing purposes
            </div>
            <div class="amount">${amount} ${currency}</div>
            <p><strong>Reference:</strong> ${reference}</p>
            <p>Proceed with your payment using ${String(provider).toUpperCase()} Money</p>
            <button class="btn" onclick="simulateSuccess()">✅ Simulate Successful Payment</button>
            <button class="btn" onclick="simulateFailure()" style="background: #dc3545;">❌ Simulate Failed Payment</button>
            <button class="btn" onclick="goBack()" style="background: #6c757d;">← Go Back</button>
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

  app.post("/api/payments/verify", async (req, res) => {
    try {
      const { reference } = req.body;
      
      // This is where you would verify the payment with Orange Money API
      // For now, we'll simulate successful verification
      const verificationData = {
        success: true,
        status: 'completed',
        reference,
        verified: true
      };
      
      res.json(verificationData);
    } catch (error) {
      console.error('Payment verification error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to verify payment' 
      });
    }
  });

  // SAMA Money payment gateway endpoint
  app.post("/api/payments/initiate-sama-money", async (req, res) => {
    try {
      const { amount, currency, phone, email, name, reference } = req.body;
      
      // Check for SAMA Money credentials
      const merchantCode = process.env.SAMA_MERCHANT_CODE;
      const publicKey = process.env.SAMA_PUBLIC_KEY;
      const transactionKey = process.env.SAMA_TRANSACTION_KEY;
      const userId = process.env.SAMA_USER_ID;
      
      if (!merchantCode || !publicKey || !transactionKey || !userId) {
        console.warn('SAMA Money credentials not configured - service unavailable');
        return res.status(503).json({
          success: false,
          error: 'SAMA Money service temporarily unavailable',
          message: 'Payment gateway configuration incomplete. Please contact support.'
        });
      }
      
      // SAMA Money API configuration
      const samaConfig = {
        baseUrl: 'https://smarchandamatest.sama.money/V1',
        merchantCode,
        publicKey,
        transactionKey,
        userId
      };
      
      const paymentData = {
        merchant_code: samaConfig.merchantCode,
        merchant_name: 'ELVERRA GLOBAL',
        user_id: samaConfig.userId,
        amount: amount,
        currency: currency,
        customer_phone: phone,
        customer_name: name,
        customer_email: email,
        transaction_reference: reference,
        callback_url: `${req.protocol}://${req.get('host')}/api/payments/sama-callback`,
        return_url: `${req.protocol}://${req.get('host')}/payment-success`,
        public_key: samaConfig.publicKey,
        timestamp: new Date().toISOString()
      };
      
      const response = await fetch(`${samaConfig.baseUrl}/payment/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': `Bearer ${samaConfig.publicKey}`,
          'Accept': 'application/json',
          'X-Merchant-Code': samaConfig.merchantCode,
          'X-User-Id': samaConfig.userId
        },
        body: JSON.stringify(paymentData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('SAMA Money API error:', response.status, errorText);
        return res.status(500).json({
          success: false,
          error: 'Failed to create SAMA Money payment',
          details: errorText
        });
      }
      
      const responseData = await response.json();
      
      // Store payment record in database for tracking
      try {
        // For now, we'll skip database storage until the payment tables are set up
        console.log('Payment initiated:', { reference, amount, currency, gateway: 'sama_money' });
      } catch (dbError) {
        console.warn('Failed to store payment record:', dbError);
      }
      
      res.json({
        success: true,
        payment_url: responseData.payment_url,
        reference: responseData.transaction_id || reference,
        amount,
        status: 'initiated',
        transactionId: responseData.transaction_id
      });
      
    } catch (error) {
      console.error('SAMA Money payment initiation error:', error);
      res.status(500).json({
        success: false,
        error: 'SAMA Money payment service temporarily unavailable',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Payment success/cancel routes  
  app.get("/payment-success", (req, res) => {
    res.redirect('/#/thank-you?payment=success');
  });

  app.get("/payment-cancel", (req, res) => {
    res.redirect('/#/membership-payment?payment=cancelled');
  });

  // Payment callback endpoints
  app.post("/api/payments/orange-callback", async (req, res) => {
    try {
      console.log('Orange Money callback received:', req.body);
      // Process Orange Money callback and update payment status
      // TODO: Verify payment signature and update database
      res.json({ success: true, message: 'Callback processed' });
    } catch (error) {
      console.error('Orange callback error:', error);
      res.status(500).json({ error: 'Callback processing failed' });
    }
  });

  app.post("/api/payments/sama-callback", async (req, res) => {
    try {
      console.log('SAMA Money callback received:', req.body);
      // Process SAMA Money callback and update payment status
      res.json({ success: true, message: 'Callback processed' });
    } catch (error) {
      console.error('SAMA callback error:', error);
      res.status(500).json({ error: 'Callback processing failed' });
    }
  });

  // Files/assets route
  app.get("/api/files/logo", (req, res) => {
    // Return the new logo URL
    res.json({
      url: "/lovable-uploads/elverra-global-logo-new.jpeg",
      name: "Elverra Global Logo",
      success: true
    });
  });

  // Profile routes
  app.get("/api/users/:id/profile", async (req, res) => {
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

  app.put("/api/users/:id/profile", async (req, res) => {
    try {
      const profile = await storage.updateUserProfile(req.params.id, req.body);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // User applications
  app.get("/api/users/:id/applications", async (req, res) => {
    try {
      const applications = await storage.getUserApplications(req.params.id);
      res.json(applications || []);
    } catch (error) {
      res.status(500).json({ error: "Failed to get applications" });
    }
  });

  // User bookmarks
  app.get("/api/users/:id/bookmarks", async (req, res) => {
    try {
      const bookmarks = await storage.getUserBookmarks(req.params.id);
      res.json(bookmarks || []);
    } catch (error) {
      res.status(500).json({ error: "Failed to get bookmarks" });
    }
  });

  // Product categories endpoint
  app.get("/api/products/categories", async (req, res) => {
    try {
      const categories = [
        { id: '1', name: 'Electronics', description: 'Electronic devices and gadgets' },
        { id: '2', name: 'Fashion', description: 'Clothing and accessories' },
        { id: '3', name: 'Home & Garden', description: 'Home improvement and garden items' },
        { id: '4', name: 'Sports & Outdoors', description: 'Sports equipment and outdoor gear' },
        { id: '5', name: 'Books & Media', description: 'Books, music, and other media' },
        { id: '6', name: 'Automotive', description: 'Car parts and automotive accessories' },
        { id: '7', name: 'Health & Beauty', description: 'Health and beauty products' },
        { id: '8', name: 'Toys & Games', description: 'Toys and gaming items' },
        { id: '9', name: 'Food & Beverages', description: 'Food and drink items' },
        { id: '10', name: 'Other', description: 'Other miscellaneous items' }
      ];
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to get categories" });
    }
  });

  // Membership routes
  app.get("/api/memberships/:userId", async (req, res) => {
    try {
      // Check if user has premium membership in database
      const user = await storage.getUser(req.params.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Return membership based on user's tier in database
      const membership = {
        id: req.params.userId,
        user_id: req.params.userId,
        tier: user.membershipTier || 'basic',
        is_active: user.membershipTier === 'premium' || user.membershipTier === 'elite',
        start_date: new Date().toISOString(),
        expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        physical_card_requested: false,
        member_id: user.id
      };
      res.json(membership);
    } catch (error) {
      res.status(500).json({ error: "Failed to get membership" });
    }
  });

  app.post("/api/memberships", async (req, res) => {
    try {
      const { user_id, tier, paymentReference } = req.body;
      
      // Update user's membership tier in database
      const user = await storage.getUser(user_id);
      if (user) {
        await storage.updateUser(user_id, { 
          membershipTier: tier || 'premium' 
        });
      }
      
      const membership = {
        id: `membership_${Date.now()}`,
        isActive: true,
        createdAt: new Date(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        paymentReference
      };
      
      res.json(membership);
    } catch (error) {
      res.status(500).json({ error: "Failed to create membership" });
    }
  });

  // Agents route (replacing Supabase Edge Function)
  app.get("/api/agents/:userId", async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
