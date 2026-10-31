/**
 * AI Satellite — Technical Discussions Service (Phase 13)
 * Manages 12 structured technical categories, thread creation,
 * replies, ownership-verified editing, resolved state toggling, and XSS sanitization.
 */

import crypto from 'node:crypto';
import { communityDatabase } from './database';
import {
  CreateDiscussionSchema,
  CreateReplySchema,
  type DiscussionCategory,
  type CommunityDiscussion,
  type DiscussionReply,
} from './types';
import { spamPreventionService } from './spam-prevention';

export class DiscussionsService {
  /**
   * Creates a new technical discussion with category validation and anti-spam controls.
   */
  public createDiscussion(
    authorId: string,
    authorUsername: string,
    input: {
      category: DiscussionCategory;
      title: string;
      content: string;
      tags: string[];
    }
  ): { success: boolean; discussion?: CommunityDiscussion; error?: string } {
    // 1. Rate limiting
    const rate = spamPreventionService.checkRateLimit(authorId, 'create_discussion', 5, 60000);
    if (!rate.allowed) {
      return { success: false, error: 'Rate limit reached. Please wait before posting another discussion.' };
    }

    const validated = CreateDiscussionSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || 'Invalid discussion details' };
    }

    // 2. Duplicate text detection
    const existingTitles = communityDatabase.getDiscussions().map((d) => d.title);
    if (spamPreventionService.isDuplicateContent(existingTitles, input.title)) {
      return { success: false, error: 'A discussion with this title already exists.' };
    }

    const now = new Date().toISOString();
    const id = `dsc-${crypto.randomBytes(6).toString('hex')}`;

    const discussion: CommunityDiscussion = {
      id,
      authorId,
      authorUsername,
      category: input.category,
      title: spamPreventionService.sanitizeContent(input.title.trim()),
      content: spamPreventionService.sanitizeContent(input.content.trim()),
      tags: input.tags.map((t) => t.trim().toLowerCase()),
      replyCount: 0,
      isResolved: false,
      isLocked: false,
      isHidden: false,
      createdAt: now,
      updatedAt: now,
    };

    communityDatabase.saveDiscussion(discussion);
    return { success: true, discussion };
  }

  /**
   * Edits an existing discussion, enforcing strict author ownership or moderator permissions.
   */
  public editDiscussion(
    discussionId: string,
    editorId: string,
    isModerator: boolean,
    input: { title?: string; content?: string; tags?: string[]; isResolved?: boolean }
  ): { success: boolean; discussion?: CommunityDiscussion; error?: string } {
    const discussion = communityDatabase.findDiscussionById(discussionId);
    if (!discussion) {
      return { success: false, error: 'Discussion not found' };
    }

    // Strict ownership enforcement
    if (discussion.authorId !== editorId && !isModerator) {
      return { success: false, error: 'Unauthorized: you can only edit discussions you authored.' };
    }

    if (discussion.isLocked && !isModerator) {
      return { success: false, error: 'This discussion has been locked by a moderator.' };
    }

    if (input.title) {
      discussion.title = spamPreventionService.sanitizeContent(input.title.trim());
    }
    if (input.content) {
      discussion.content = spamPreventionService.sanitizeContent(input.content.trim());
    }
    if (input.tags) {
      discussion.tags = input.tags.map((t) => t.trim().toLowerCase());
    }
    if (typeof input.isResolved === 'boolean') {
      discussion.isResolved = input.isResolved;
    }

    discussion.updatedAt = new Date().toISOString();
    communityDatabase.saveDiscussion(discussion);
    return { success: true, discussion };
  }

  /**
   * Posts a reply to a discussion with rate limiting and code block escaping.
   */
  public postReply(
    authorId: string,
    authorUsername: string,
    input: { discussionId: string; content: string }
  ): { success: boolean; reply?: DiscussionReply; error?: string } {
    const rate = spamPreventionService.checkRateLimit(authorId, 'post_reply', 10, 60000);
    if (!rate.allowed) {
      return { success: false, error: 'Reply rate limit exceeded. Please wait a moment.' };
    }

    const validated = CreateReplySchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || 'Invalid reply text' };
    }

    const discussion = communityDatabase.findDiscussionById(input.discussionId);
    if (!discussion || discussion.isHidden) {
      return { success: false, error: 'Discussion does not exist or has been hidden.' };
    }

    if (discussion.isLocked) {
      return { success: false, error: 'Discussion is locked for new replies.' };
    }

    const now = new Date().toISOString();
    const id = `rpl-${crypto.randomBytes(6).toString('hex')}`;

    const reply: DiscussionReply = {
      id,
      discussionId: input.discussionId,
      authorId,
      authorUsername,
      content: spamPreventionService.sanitizeContent(input.content.trim()),
      isHidden: false,
      createdAt: now,
      updatedAt: now,
    };

    communityDatabase.saveReply(reply);
    return { success: true, reply };
  }

  /**
   * Toggles resolved status on discussion. Author or moderator only.
   */
  public toggleResolved(
    discussionId: string,
    requesterId: string,
    isModerator: boolean
  ): { success: boolean; isResolved?: boolean; error?: string } {
    const discussion = communityDatabase.findDiscussionById(discussionId);
    if (!discussion) return { success: false, error: 'Discussion not found' };

    if (discussion.authorId !== requesterId && !isModerator) {
      return { success: false, error: 'Only the author or a moderator can toggle the resolved status.' };
    }

    discussion.isResolved = !discussion.isResolved;
    discussion.updatedAt = new Date().toISOString();
    communityDatabase.saveDiscussion(discussion);
    return { success: true, isResolved: discussion.isResolved };
  }

  /**
   * Retrieves public discussions by category or all, filtering out hidden items.
   */
  public getDiscussions(category?: DiscussionCategory): CommunityDiscussion[] {
    const all = communityDatabase.getDiscussions().filter((d) => !d.isHidden);
    if (category) {
      return all.filter((d) => d.category === category);
    }
    return all;
  }

  public getReplies(discussionId: string): DiscussionReply[] {
    return communityDatabase.getRepliesForDiscussion(discussionId);
  }
}

export const discussionsService = new DiscussionsService();
