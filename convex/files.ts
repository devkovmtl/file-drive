import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// mutation: enpoint to create a new file
export const createFile = mutation({
  args: {
    name: v.string(),
  },
  async handler(ctx, args) {
    await ctx.db.insert('files', { name: args.name });
  },
});

export const getFiles = query({
  args: {},
  handler(ctx, args) {
    // return every entry stored in the 'files' collection
    return ctx.db.query('files').collect();
  },
});
