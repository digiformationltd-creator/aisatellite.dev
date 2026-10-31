/**
 * AI Satellite — Developer Q&A Service (Phase 13)
 * Manages technical questions, code snippets, community answers,
 * accepted answer permissions, outdated flags, and helpful upvotes.
 */

import crypto from 'node:crypto';
import { communityDatabase } from './database';
import {
  CreateQuestionSchema,
  CreateAnswerSchema,
  type CommunityQuestion,
  type QuestionAnswer,
} from './types';
import { spamPreventionService } from './spam-prevention';

export class QaService {
  /**
   * Submits a technical developer question with code snippet context.
   */
  public askQuestion(
    authorId: string,
    authorUsername: string,
    input: {
      title: string;
      technicalContext: string;
      codeSnippet?: string;
      tags: string[];
      relatedDocUrls?: string[];
    }
  ): { success: boolean; question?: CommunityQuestion; error?: string } {
    const rate = spamPreventionService.checkRateLimit(authorId, 'ask_question', 5, 60000);
    if (!rate.allowed) {
      return { success: false, error: 'Rate limit reached. Please wait before asking another question.' };
    }

    const validated = CreateQuestionSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || 'Invalid question parameters' };
    }

    const now = new Date().toISOString();
    const id = `qst-${crypto.randomBytes(6).toString('hex')}`;

    const question: CommunityQuestion = {
      id,
      authorId,
      authorUsername,
      title: spamPreventionService.sanitizeContent(input.title.trim()),
      technicalContext: spamPreventionService.sanitizeContent(input.technicalContext.trim()),
      codeSnippet: input.codeSnippet ? spamPreventionService.sanitizeContent(input.codeSnippet.trim()) : undefined,
      tags: input.tags.map((t) => t.trim().toLowerCase()),
      isAnswered: false,
      answerCount: 0,
      relatedDocUrls: input.relatedDocUrls || [],
      createdAt: now,
      updatedAt: now,
    };

    communityDatabase.saveQuestion(question);
    return { success: true, question };
  }

  /**
   * Submits an answer to a developer question.
   */
  public submitAnswer(
    authorId: string,
    authorUsername: string,
    input: { questionId: string; content: string; codeExample?: string }
  ): { success: boolean; answer?: QuestionAnswer; error?: string } {
    const rate = spamPreventionService.checkRateLimit(authorId, 'submit_answer', 8, 60000);
    if (!rate.allowed) {
      return { success: false, error: 'Answer submission rate limit exceeded.' };
    }

    const validated = CreateAnswerSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || 'Invalid answer text' };
    }

    const question = communityDatabase.findQuestionById(input.questionId);
    if (!question) {
      return { success: false, error: 'Question not found' };
    }

    const now = new Date().toISOString();
    const id = `ans-${crypto.randomBytes(6).toString('hex')}`;

    const answer: QuestionAnswer = {
      id,
      questionId: input.questionId,
      authorId,
      authorUsername,
      content: spamPreventionService.sanitizeContent(input.content.trim()),
      codeExample: input.codeExample ? spamPreventionService.sanitizeContent(input.codeExample.trim()) : undefined,
      isAccepted: false,
      isOutdated: false,
      upvoteCount: 0,
      upvoterUserIds: [],
      createdAt: now,
      updatedAt: now,
    };

    communityDatabase.saveAnswer(answer);
    return { success: true, answer };
  }

  /**
   * Marks an answer as accepted.
   * STRICT PERMISSION: Only the question author or a community moderator can accept an answer.
   * Awards reputation points (+15) to answer author. Prevents self-reward manipulation.
   */
  public acceptAnswer(
    questionId: string,
    answerId: string,
    requesterId: string,
    isModerator: boolean
  ): { success: boolean; error?: string } {
    const question = communityDatabase.findQuestionById(questionId);
    if (!question) return { success: false, error: 'Question not found' };

    const answer = communityDatabase.findAnswerById(answerId);
    if (!answer || answer.questionId !== questionId) {
      return { success: false, error: 'Answer not found for this question' };
    }

    // Permission Check: only author or moderator
    if (question.authorId !== requesterId && !isModerator) {
      return { success: false, error: 'Permission denied: only the question author or a moderator can accept an answer.' };
    }

    // Reset previous accepted answer if any
    const existingAnswers = communityDatabase.getAnswersForQuestion(questionId);
    for (const a of existingAnswers) {
      if (a.isAccepted) {
        a.isAccepted = false;
        communityDatabase.saveAnswer(a);
      }
    }

    answer.isAccepted = true;
    answer.updatedAt = new Date().toISOString();
    communityDatabase.saveAnswer(answer);

    question.isAnswered = true;
    question.acceptedAnswerId = answer.id;
    question.updatedAt = answer.updatedAt;
    communityDatabase.saveQuestion(question);

    // Reward answer author if not self-accepting
    if (answer.authorId !== question.authorId) {
      communityDatabase.recordReputationEvent({
        id: `rep-${crypto.randomBytes(6).toString('hex')}`,
        userId: answer.authorId,
        eventType: 'accepted_answer',
        pointsDelta: 15,
        sourceEntityId: answer.id,
        description: `Accepted answer on question: ${question.title}`,
        isReversed: false,
        createdAt: answer.updatedAt,
      });

      communityDatabase.recordContribution({
        id: `cnt-${crypto.randomBytes(6).toString('hex')}`,
        userId: answer.authorId,
        username: answer.authorUsername,
        type: 'answer',
        resourceId: answer.id,
        resourceTitle: `Answer on: ${question.title}`,
        pointsAwarded: 15,
        verifiedAt: answer.updatedAt,
      });
    }

    return { success: true };
  }

  /**
   * Toggles helpful upvote on an answer.
   * Anti-abuse: Users cannot upvote their own answers.
   */
  public toggleUpvote(
    answerId: string,
    voterUserId: string
  ): { success: boolean; upvoteCount?: number; error?: string } {
    const answer = communityDatabase.findAnswerById(answerId);
    if (!answer) return { success: false, error: 'Answer not found' };

    // Prevent self-voting
    if (answer.authorId === voterUserId) {
      return { success: false, error: 'Self-voting is not permitted.' };
    }

    const alreadyVoted = answer.upvoterUserIds.includes(voterUserId);
    if (alreadyVoted) {
      answer.upvoterUserIds = answer.upvoterUserIds.filter((id) => id !== voterUserId);
      answer.upvoteCount = Math.max(0, answer.upvoteCount - 1);
    } else {
      answer.upvoterUserIds.push(voterUserId);
      answer.upvoteCount += 1;
    }

    answer.updatedAt = new Date().toISOString();
    communityDatabase.saveAnswer(answer);
    return { success: true, upvoteCount: answer.upvoteCount };
  }

  /**
   * Flags an answer as outdated with documentation link.
   */
  public flagOutdated(answerId: string, isOutdated: boolean = true): { success: boolean; error?: string } {
    const answer = communityDatabase.findAnswerById(answerId);
    if (!answer) return { success: false, error: 'Answer not found' };

    answer.isOutdated = isOutdated;
    answer.updatedAt = new Date().toISOString();
    communityDatabase.saveAnswer(answer);
    return { success: true };
  }

  public getQuestions(): CommunityQuestion[] {
    return communityDatabase.getQuestions();
  }

  public getAnswers(questionId: string): QuestionAnswer[] {
    return communityDatabase.getAnswersForQuestion(questionId);
  }
}

export const qaService = new QaService();
