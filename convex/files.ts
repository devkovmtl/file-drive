import { ConvexError, v } from 'convex/values';
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  mutation,
  query,
} from './_generated/server';
import { getUser } from './users';
import { fileTypes } from './schema';

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
    user.orgIds.some((item) => item.orgId === orgId) ||
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
    fileId: v.id('_storage'),
    orgId: v.string(),
    type: fileTypes,
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

    await ctx.db.insert('files', {
      name: args.name,
      orgId: args.orgId,
      fileId: args.fileId,
      type: args.type,
      userId: hasAccess.user._id,
    });
  },
});

export const getFiles = query({
  args: {
    orgId: v.string(),
    query: v.optional(v.string()),
    favorites: v.optional(v.boolean()),
    deletedOnly: v.optional(v.boolean()),
    type: v.optional(fileTypes),
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

    let files = await ctx.db
      .query('files')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .collect();

    const query = args.query;

    if (query) {
      files = files.filter((file) =>
        file.name.toLocaleLowerCase().includes(query.toLowerCase())
      );
    }

    if (args.favorites) {
      const favorites = await ctx.db
        .query('favorites')
        .withIndex('by_userId_orgId_fileId', (q) =>
          q.eq('userId', hasAccess.user._id).eq('orgId', args.orgId)
        )
        .collect();

      files = files.filter((file) =>
        favorites.some((favorite) => favorite.fileId === file._id)
      );
    }

    if (args.deletedOnly) {
      files = files.filter((file) => file.shouldDelete);
    } else {
      files = files.filter((file) => !file.shouldDelete);
    }

    if (args.type) {
      files = files.filter((file) => file.type === args.type);
    }

    // return every entry stored in the 'files' collection
    // return ctx.db.query('files').collect();
    return files;
  },
});

export const deleteAllFiles = internalMutation({
  args: {},
  async handler(ctx) {
    const files = await ctx.db
      .query('files')
      .withIndex('by_shouldDelete', (q) => q.eq('shouldDelete', true))
      .collect();

    await Promise.all(
      files.map(async (file) => {
        await ctx.storage.delete(file.fileId);
        return await ctx.db.delete(file._id);
      })
    );
  },
});
