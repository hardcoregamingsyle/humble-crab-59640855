import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // Interview sessions
  interviewSessions: defineTable({
    userId: v.id('users'),
    resumeId: v.id('resumes'),
    jobId: v.id('jobDescriptions'),
    status: v.string(),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index('by_userId', ['userId'])
    .index('by_status', ['status']),

  // Other tables...
})

// Interview session mutations
export const startInterviewSession = mutation({
  args: {
    userId: v.id('users'),
    resumeId: v.id('resumes'),
    jobId: v.id('jobDescriptions'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('interviewSessions', {
      userId: args.userId,
      resumeId: args.resumeId,
      jobId: args.jobId,
      status: 'active',
      startedAt: Date.now(),
    });
  },
});

// Interview session queries...
export const getActiveSession = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db.query('interviewSessions').withIndex('by_userId', (q) => q.eq('userId', args.userId)).filter((q) => q.eq(q.field('status'), 'active')).first();
  },
});
