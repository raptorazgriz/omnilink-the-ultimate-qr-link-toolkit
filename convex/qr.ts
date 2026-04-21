import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
export const save = mutation({
  args: {
    name: v.string(),
    data: v.string(),
    design: v.object({
      fgColor: v.string(),
      bgColor: v.string(),
      includeMargin: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    return await ctx.db.insert("qrCodes", {
      userId,
      name: args.name,
      data: args.data,
      design: args.design,
      createdAt: Date.now(),
    });
  },
});
export const remove = mutation({
  args: { qrId: v.id("qrCodes") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const existing = await ctx.db.get(args.qrId);
    if (!existing || existing.userId !== userId) throw new Error("Unauthorized or not found");
    await ctx.db.delete(args.qrId);
  },
});
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("qrCodes")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});