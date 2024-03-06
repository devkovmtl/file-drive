import { v } from 'convex/values';
import { mutation } from './_generated/server';

// mutation: enpoint to create a new file
export const createFile = mutation({
  args: {
    name: v.string(),
  },
  async handler(ctx, args) {
    await ctx.db.insert('files', { name: args.name });
  },
});
