import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { nanoid } from "nanoid";
import { startOfDay, subDays, format } from "date-fns";
export const create = mutation({
  args: {
    title: v.string(),
    originalUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    let shortCode = nanoid(8);
    // Basic collision check
    const existing = await ctx.db
      .query("links")
      .withIndex("by_shortCode", (q) => q.eq("shortCode", shortCode))
      .unique();
    if (existing) {
      shortCode = nanoid(10);
    }
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
export const remove = mutation({
  args: { linkId: v.id("links") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const link = await ctx.db.get(args.linkId);
    if (!link || link.userId !== userId) throw new Error("Not found or unauthorized");
    // Clean up clicks
    const clicks = await ctx.db
      .query("clicks")
      .withIndex("by_linkId", (q) => q.eq("linkId", args.linkId))
      .collect();
    for (const click of clicks) {
      await ctx.db.delete(click._id);
    }
    await ctx.db.delete(args.linkId);
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
export const getAnalytics = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const userLinks = await ctx.db
      .query("links")
      .withIndex("by_userId_createdAt", (q) => q.eq("userId", userId))
      .collect();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      return format(date, "MMM dd");
    }).reverse();
    const analyticsMap: Record<string, number> = {};
    last7Days.forEach(day => analyticsMap[day] = 0);
    for (const link of userLinks) {
      const clicks = await ctx.db
        .query("clicks")
        .withIndex("by_linkId", (q) => q.eq("linkId", link._id))
        .collect();
      clicks.forEach(click => {
        const dayLabel = format(new Date(click.timestamp), "MMM dd");
        if (analyticsMap[dayLabel] !== undefined) {
          analyticsMap[dayLabel]++;
        }
      });
    }
    return last7Days.map(day => ({
      name: day,
      clicks: analyticsMap[day]
    }));
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