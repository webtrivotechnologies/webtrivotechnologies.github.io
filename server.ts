import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";
import { CMSData, ContactInquiry, NewsletterSubscriber } from "./src/types";

// Setup database path relative to workspace root
const DB_PATH = path.join(process.cwd(), "data", "db.json");

async function loadDb(): Promise<CMSData> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(raw) as CMSData;
  } catch (error) {
    console.error("Error reading db.json, returning empty template", error);
    // Return empty template if reading fails
    return {
      inquiries: [],
      portfolio: [],
      services: [],
      blogs: [],
      testimonials: [],
      faqs: [],
      careers: [],
      subscribers: [],
      settings: {
        companyName: "Webtrivo Technologies",
        tagline: "Building Digital Products That Scale",
        primaryEmail: "info@webtrivo.com",
        contactEmail: "ritesh2001stm@gmail.com",
        whatsappNumber: "+917004183842",
        phoneNumber: "+917004183842",
        address: "402, Elite Business Hub, Sector 62, Noida, India",
        workingHours: "Mon - Fri: 9:00 AM - 7:00 PM (IST)",
        seoTitle: "Webtrivo Technologies | Premium Software Agency",
        seoDescription: "We build scalable websites, mobile apps, CRM, ERP, and AI solutions.",
        seoKeywords: "software development, SaaS, mobile apps",
        bookMeetingUrl: "https://calendly.com/webtrivo/consultation"
      }
    };
  }
}

async function saveDb(data: CMSData): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Public CMS Data Retrieval (only returns safe data, hides inquiries and subscribers)
  app.get("/api/cms", async (req, res) => {
    const db = await loadDb();
    res.json({
      portfolio: db.portfolio,
      services: db.services,
      blogs: db.blogs.filter(b => b.published),
      testimonials: db.testimonials,
      faqs: db.faqs,
      careers: db.careers.filter(c => c.active),
      settings: db.settings
    });
  });

  // Client Lead capture
  app.post("/api/inquiries", async (req, res) => {
    try {
      const { name, email, phone, company, budget, projectType, message, fileUrl } = req.body;
      
      if (!name || !email || !message) {
        return res.status(400).json({ error: "Missing required fields (name, email, message)" });
      }

      const db = await loadDb();
      
      const newInquiry: ContactInquiry = {
        id: `inq-${Date.now()}`,
        name,
        email,
        phone: phone || "",
        company: company || "",
        budget: budget || "Not Specified",
        projectType: projectType || "Custom Development",
        message,
        fileUrl: fileUrl || "",
        createdAt: new Date().toISOString(),
        status: "new"
      };

      db.inquiries.unshift(newInquiry);
      await saveDb(db);

      // SMTP Mock Emails - Output professional transactional logs
      console.log(`\n======================================================`);
      console.log(`[SMTP SIMULATOR] SENDING TRANSACTIONAL EMAILS`);
      console.log(`------------------------------------------------------`);
      console.log(`TO ADMIN: ${db.settings.contactEmail}`);
      console.log(`SUBJECT: 🚨 New Project Inquiry from ${name}`);
      console.log(`BODY:`);
      console.log(`  Name: ${name}`);
      console.log(`  Email: ${email}`);
      console.log(`  Phone: ${phone}`);
      console.log(`  Company: ${company}`);
      console.log(`  Project: ${projectType} (Budget: ${budget})`);
      console.log(`  Message: ${message}`);
      console.log(`------------------------------------------------------`);
      console.log(`TO CLIENT: ${email}`);
      console.log(`SUBJECT: Webtrivo Technologies - Consultation Received`);
      console.log(`BODY:`);
      console.log(`  Hello ${name},`);
      console.log(`  Thank you for contacting Webtrivo Technologies.`);
      console.log(`  Our engineering advisory team has received your request`);
      console.log(`  regarding "${projectType}" (Budget: ${budget}).`);
      console.log(`  We will review your objectives and contact you in 4-8 hours.`);
      console.log(`======================================================\n`);

      res.status(201).json({ success: true, inquiry: newInquiry });
    } catch (err: any) {
      console.error("Error creating inquiry", err);
      res.status(500).json({ error: "Failed to submit inquiry" });
    }
  });

  // Newsletter Signup
  app.post("/api/subscribe", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || !email.includes("@")) {
        return res.status(400).json({ error: "Please provide a valid email address" });
      }

      const db = await loadDb();
      const exists = db.subscribers.some(s => s.email.toLowerCase() === email.toLowerCase());
      
      if (exists) {
        return res.json({ success: true, message: "Already subscribed!" });
      }

      const newSub: NewsletterSubscriber = {
        id: `sub-${Date.now()}`,
        email: email.toLowerCase(),
        subscribedAt: new Date().toISOString()
      };

      db.subscribers.push(newSub);
      await saveDb(db);

      res.status(201).json({ success: true, message: "Thank you for subscribing!" });
    } catch (err) {
      res.status(500).json({ error: "Failed to subscribe" });
    }
  });

  // Simple Admin Auth & Dashboard Fetch
  // For the sake of this premium applet workspace, we supply a default credentials matching 'webtrivo2026'
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "webtrivo2026") {
      res.json({ success: true, token: "webtrivo_secure_session_token_2026" });
    } else {
      res.status(401).json({ error: "Invalid admin credentials" });
    }
  });

  // Authenticated full database fetch (includes inquiries, subscribers, published/unpublished data)
  app.get("/api/admin/dashboard", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader !== "Bearer webtrivo_secure_session_token_2026") {
      return res.status(403).json({ error: "Unauthorized access" });
    }
    const db = await loadDb();
    res.json(db);
  });

  // Update complete CMS Collections or Settings
  app.post("/api/admin/save", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader !== "Bearer webtrivo_secure_session_token_2026") {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    try {
      const { portfolio, services, blogs, testimonials, faqs, careers, settings } = req.body;
      const db = await loadDb();

      if (portfolio) db.portfolio = portfolio;
      if (services) db.services = services;
      if (blogs) db.blogs = blogs;
      if (testimonials) db.testimonials = testimonials;
      if (faqs) db.faqs = faqs;
      if (careers) db.careers = careers;
      if (settings) db.settings = settings;

      await saveDb(db);
      res.json({ success: true, message: "CMS database updated successfully" });
    } catch (error) {
      console.error("Error saving database", error);
      res.status(500).json({ error: "Failed to save CMS data" });
    }
  });

  // Update specific Inquiry status or notes
  app.post("/api/admin/inquiry/update", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader !== "Bearer webtrivo_secure_session_token_2026") {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    try {
      const { id, status, notes } = req.body;
      const db = await loadDb();
      const inqIndex = db.inquiries.findIndex(i => i.id === id);

      if (inqIndex === -1) {
        return res.status(404).json({ error: "Inquiry not found" });
      }

      if (status) db.inquiries[inqIndex].status = status;
      if (notes !== undefined) db.inquiries[inqIndex].notes = notes;

      await saveDb(db);
      res.json({ success: true, inquiry: db.inquiries[inqIndex] });
    } catch (error) {
      res.status(500).json({ error: "Failed to update inquiry" });
    }
  });

  // Serve static assets and bundle React client
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Webtrivo Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start Webtrivo server:", error);
});
