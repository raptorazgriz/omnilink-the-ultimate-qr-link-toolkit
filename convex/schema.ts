import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
const applicationTables = {
  // Store shortened URLs and their analytics
  links: defineTable({
    userId: v.id("users"),
    title: v.string(),
    originalUrl: v.string(),
    shortCode: v.string(),
    clicks: v.number(),
    createdAt: v.number(),
  })
  .index("by_userId_createdAt", ["userId", "createdAt"])
  .index("by_shortCode", ["shortCode"]),
  // Store click events for detailed analytics
  clicks: defineTable({
    linkId: v.id("links"),
    timestamp: v.number(),
    userAgent: v.optional(v.string()),
    ipHash: v.optional(v.string()),
  })
  .index("by_linkId", ["linkId"]),
  // Store user-generated QR code designs
  qrCodes: defineTable({
    userId: v.id("users"),
    name: v.string(),
    data: v.string(),
    design: v.object({
      fgColor: v.string(),
      bgColor: v.string(),
      includeMargin: v.boolean(),
    }),
    createdAt: v.number(),
  })
  .index("by_userId", ["userId"]),
  // File metadata for the file storage system (Required for files.ts)
  files: defineTable({
    userId: v.id("users"),
    storageId: v.id("_storage"),
    filename: v.string(),
    mimeType: v.string(),
    size: v.number(),
    description: v.optional(v.string()),
    uploadedAt: v.number(),
  })
  .index("by_userId_uploadedAt", ["userId", "uploadedAt"])
  .index("by_userId_storageId", ["userId", "storageId"]),
};
export default defineSchema({
  ...authTables,
  ...applicationTables,
});