// src/middleware/validate.js
import { z } from "zod";

const querySchema = z.object({
    search: z.string().optional(),
    status: z.enum(["Active", "Inactive", "Prospect", "VIP", "all"]).optional(),
    industry: z.enum(["Technology", "Healthcare", "Finance", "Education", "Retail", "Manufacturing", "Other", "all"]).optional(),
    sortBy: z.enum(["name", "value", "company", "lastContact", "projects"]).optional(),
});

export const validateQuery = (req, res, next) => {
    try {
        querySchema.parse(req.query);
        next();
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Invalid query parameters",
            errors: err.errors?.map(e => e.message) ?? [],
        });
    }
};