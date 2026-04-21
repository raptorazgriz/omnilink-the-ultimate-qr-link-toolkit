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