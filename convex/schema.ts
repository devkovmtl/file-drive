import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  files: defineTable({ name: v.string(), orgId: v.optional(v.string()) }).index(
    'by_orgId',
    ['orgId']
  ),
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    orgIds: v.array(v.string()),
  }).index('by_tokenIdentifier', ['tokenIdentifier']),
});
