import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';

// mutation: enpoint to create a new file
export const createFile = mutation({
  args: {
    name: v.string(),
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError('You must be signed in to create a file');
    }

    await ctx.db.insert('files', { name: args.name, orgId: args.orgId });
  },
});

export const getFiles = query({
  args: {
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return [];
    }

    // return every entry stored in the 'files' collection
    // return ctx.db.query('files').collect();
    return ctx.db
      .query('files')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .collect();
  },
});
