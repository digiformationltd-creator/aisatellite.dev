import { describe, it, expect } from 'vitest';
import { CommunitySubmissionManager } from '../../growth/submissions/submission-manager.js';

describe('Acceptance Test 24: Community Contribution & Moderation System', () => {
  const manager = new CommunitySubmissionManager();

  it('Test 24: Community submissions enter private moderation and assign tracking ID', () => {
    const submission = manager.submitContribution({
      type: 'tool',
      title: 'PocketBase Local Backend',
      description: 'Single-file open-source SQLite backend with realtime subscriptions.',
      resourcePayload: {
        githubUrl: 'https://github.com/pocketbase/pocketbase',
        license: 'MIT',
      },
    });

    expect(submission.id).toMatch(/^SUB-/);
    expect(submission.status).toBe('pending');
    expect(submission.submitterHash).toBeDefined();

    // Moderation action
    const moderated = manager.moderateSubmission(
      submission.id,
      'approved',
      'Moderator-Aisha',
      'Verified MIT license and working documentation'
    );

    expect(moderated.status).toBe('approved');
    expect(moderated.moderationNotes).toContain('Verified MIT');
  });

  it('Spam and bot trap protection catches honey pot submissions', () => {
    expect(() => {
      manager.submitContribution({
        type: 'tool',
        title: 'Spam Tool',
        description: 'Spam description',
        resourcePayload: {},
        honeyPotField: 'i am a bot filling hidden fields',
      });
    }).toThrow(/Spam submission detected/);
  });
});
