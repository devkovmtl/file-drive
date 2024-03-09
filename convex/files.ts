import { ConvexError, v } from 'convex/values';
import { MutationCtx, QueryCtx, mutation, query } from './_generated/server';
import { getUser } from './users';

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError('Unauthorized');
  }

  return await ctx.storage.generateUploadUrl();
});

export async function hasAccessToOrg(
  ctx: QueryCtx | MutationCtx,
  orgId: string
) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    return null;
  }

  const user = await ctx.db
    .query('users')
    .withIndex('by_tokenIdentifier', (q) =>
      q.eq('tokenIdentifier', identity.tokenIdentifier)
    )
    .first();

  if (!user) {
    return null;
  }

  const hasAccess =
    user.orgIds.some((item) => item === orgId) ||
    user.tokenIdentifier.includes(orgId);

  if (!hasAccess) {
    return null;
  }

  return { user };
}

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

    // const user = await ctx.db
    //   .query('users')
    //   .withIndex('by_todwsakenIdentifier', (q) =>
    //     q.eq('tokenIdentifier', identity.tokenIdentifier)
    //   )
    //   .first();
    // const user = await getUser(ctx, identity.tokenIdentifier);

    // const hasAccess =
    //   user.orgIds.some((item) => item === args.orgId) ||
    //   user.tokenIdentifier.includes(args.orgId);

    // console.log(hasAccess);
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    if (!hasAccess) {
      throw new ConvexError('You do not have permission to create a file');
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

    const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    console.log(hasAccess);

    if (!hasAccess) {
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
