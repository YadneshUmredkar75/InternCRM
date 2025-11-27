import { z } from "zod";
import Client from "../models/Client.js";
import Counter from "../models/counter.js";
// Zod Schemas
const createClientSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^[\+]?[0-9]{10,15}$/, "Invalid phone number"),
    company: z.string().min(1, "Company name is required"),
    industry: z
        .enum([
            "Technology",
            "Healthcare",
            "Finance",
            "Education",
            "Retail",
            "Manufacturing",
            "Other",
        ])
        .optional(),
    status: z
        .enum(["Active", "Inactive", "Prospect", "VIP"])
        .default("Prospect"),
    value: z.coerce.number().int().min(0, "Value must be >= 0"),
    lastContact: z.coerce.date({ invalid_type_error: "Invalid date" }),
    notes: z.string().optional(),
    projects: z.coerce.number().int().min(0).default(0).optional(),
});

const updateClientSchema = createClientSchema.partial();

const querySchema = z.object({
    search: z.string().optional(),
    status: z.enum(["all", "Active", "Inactive", "Prospect", "VIP"]).default("all"),
    industry: z
        .enum([
            "all",
            "Technology",
            "Healthcare",
            "Finance",
            "Education",
            "Retail",
            "Manufacturing",
            "Other",
        ])
        .default("all"),
    sortBy: z
        .enum(["name", "value", "company", "lastContact", "projects"])
        .default("name"),
});

// GET: All Clients + Filters + Stats
export const getClients = async (req, res) => {
    try {
        const query = querySchema.parse(req.query);
        const { search, status, industry, sortBy } = query;

        // Build filter
        const filter = {};
        if (search) {
            const regex = new RegExp(search.trim(), "i");
            filter.$or = [{ name: regex }, { email: regex }, { company: regex }];
        }
        if (status !== "all") filter.status = status;
        if (industry !== "all") filter.industry = industry;

        // Build sort
        let sort = {};
        switch (sortBy) {
            case "name":
                sort.name = 1;
                break;
            case "value":
                sort.value = -1;
                break;
            case "company":
                sort.company = 1;
                break;
            case "lastContact":
                sort.lastContact = -1;
                break;
            case "projects":
                sort.projects = -1;
                break;
            default:
                sort.name = 1;
        }

        const clients = await Client.find(filter).sort(sort).lean();

        const stats = {
            total: clients.length,
            active: clients.filter((c) => c.status === "Active").length,
            vip: clients.filter((c) => c.status === "VIP").length,
            totalValue: clients.reduce((sum, c) => sum + c.value, 0),
            totalProjects: clients.reduce((sum, c) => sum + c.projects, 0),
        };

        res.json({ success: true, clients, stats });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// GET: Single Client
export const getClientById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id).lean();
        if (!client) return res.status(404).json({ success: false, message: "Client not found" });
        res.json({ success: true, client });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// POST: Create Client
export const createClient = async (req, res) => {
  try {
    // 1. Validate with Zod
    const result = createClientSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.errors.map(e => ({
          field: e.path.join("."),
          message: e.message
        }))
      });
    }

    const data = result.data;

    // 2. GET NEXT PROJECT NUMBER – 100% SAFE
    let projectNumber;

    if (data.projects && data.projects > 0) {
      projectNumber = data.projects; // manual override
    } else {
      // This is the ONLY way that never fails
      const counter = await Counter.findOneAndUpdate(
        { _id: "client_project_number" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      projectNumber = counter.seq; // ALWAYS a number now
    }

    // 3. Create client
    const client = await Client.create({
      ...data,
      projects: projectNumber,
      createdBy: req.user?._id
    });

    // 4. Success response
    return res.status(201).json({
      success: true,
      message: "Client created successfully",
      client: {
        id: client._id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company,
        industry: client.industry,
        status: client.status,
        value: client.value,
        lastContact: client.lastContact,
        notes: client.notes || "",
        projects: client.projects,
        projectId: `PROJ-${String(client.projects).padStart(6, "0")}`,
        joinedDate: client.joinedDate
      }
    });

  } catch (error) {
    console.error("CREATE CLIENT FULL ERROR:", error); // ← CHECK THIS IN TERMINAL!

    // Duplicate email or project number
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      if (field === "email") {
        return res.status(400).json({ success: false, message: "Email already exists" });
      }
      if (field === "projects") {
        return res.status(400).json({ success: false, message: "Project number conflict. Try again." });
      }
    }

    // Any other error
    return res.status(500).json({
      success: false,
      message: "Server error. Check logs."
    });
  }
};

// PUT: Update Client
export const updateClient = async (req, res) => {
  try {
    // 1. Check if user is Admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    // 2. Validate request body
    const parsed = updateClientSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.errors.map((e) => ({
          field: e.path[0],
          message: e.message,
        })),
      });
    }

    const updatedData = parsed.data;

    // 3. Find and update client
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // 4. Success response
    return res.status(200).json({
      success: true,
      message: "Client updated successfully",
      client,
    });
  } catch (error) {
    console.error("Update Client Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
// DELETE: Remove Client
export const deleteClient = async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        if (!client) return res.status(404).json({ success: false, message: "Client not found" });

        res.json({ success: true, message: "Client deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};