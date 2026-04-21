import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { nanoid } from "nanoid";
export const create = mutation({
  args: {
    title: v.string(),
    originalUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const shortCode = nanoid(8);
    const linkId = await ctx.db.insert("links", {
      userId,
      title: args.title,
      originalUrl: args.originalUrl,
      shortCode,
      clicks: 0,
      createdAt: Date.now(),
    });
    return { linkId, shortCode };
  },
});
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("links")
      .withIndex("by_userId_createdAt", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});
export const getByShortCode = query({
  args: { shortCode: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("links")
      .withIndex("by_shortCode", (q) => q.eq("shortCode", args.shortCode))
      .unique();
  },
});
export const trackClick = mutation({
  args: {
    shortCode: v.string(),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("links")
      .withIndex("by_shortCode", (q) => q.eq("shortCode", args.shortCode))
      .unique();
    if (!link) return null;
    await ctx.db.patch(link._id, {
      clicks: link.clicks + 1,
    });
    await ctx.db.insert("clicks", {
      linkId: link._id,
      timestamp: Date.now(),
      userAgent: args.userAgent,
    });
    return link.originalUrl;
  },
});