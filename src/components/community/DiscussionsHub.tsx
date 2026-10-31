import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  Tag,
  Send,
  Flag,
  Filter,
  User,
  Shield,
} from 'lucide-react';
import type { CommunityDiscussion, DiscussionReply, DiscussionCategory } from '../../lib/community/types';
import { DISCUSSION_CATEGORIES } from '../../lib/community/types';

interface DiscussionsHubProps {
  initialDiscussions?: CommunityDiscussion[];
}

export default function DiscussionsHub({ initialDiscussions = [] }: DiscussionsHubProps) {
  const [discussions, setDiscussions] = useState<CommunityDiscussion[]>(initialDiscussions);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDiscussion, setActiveDiscussion] = useState<CommunityDiscussion | null>(
    initialDiscussions[0] || null
  );
  const [replies, setReplies] = useState<DiscussionReply[]>([]);
  const [replyInput, setReplyInput] = useState('');
  const [isPostingReply, setIsPostingReply] = useState(false);

  // New discussion modal state
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<DiscussionCategory>('ai_development');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('react, typescript');
  const [postMessage, setPostMessage] = useState<string | null>(null);

  // Filter discussions
  const filteredDiscussions = discussions.filter((d) => {
    if (d.isHidden) return false;
    const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;
    const matchesQuery =
      searchQuery === '' ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const handleCreateDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      setPostMessage('Title and content are required.');
      return;
    }

    const tagsArray = newTags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
    const newDoc: CommunityDiscussion = {
      id: `dsc-${Date.now()}`,
      authorId: 'user-current',
      authorUsername: 'current-developer',
      category: newCategory,
      title: newTitle.trim(),
      content: newContent.trim(),
      tags: tagsArray.length > 0 ? tagsArray : ['general'],
      replyCount: 0,
      isResolved: false,
      isLocked: false,
      isHidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDiscussions([newDoc, ...discussions]);
    setActiveDiscussion(newDoc);
    setShowNewModal(false);
    setNewTitle('');
    setNewContent('');
    setPostMessage(null);
  };

  const handlePostReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim() || !activeDiscussion) return;

    setIsPostingReply(true);
    const newReply: DiscussionReply = {
      id: `rpl-${Date.now()}`,
      discussionId: activeDiscussion.id,
      authorId: 'user-current',
      authorUsername: 'current-developer',
      content: replyInput.trim(),
      isHidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setReplies([...replies, newReply]);
    setReplyInput('');
    setIsPostingReply(false);

    // Increment reply count
    setDiscussions(
      discussions.map((d) => (d.id === activeDiscussion.id ? { ...d, replyCount: d.replyCount + 1 } : d))
    );
  };

  const handleToggleResolved = () => {
    if (!activeDiscussion) return;
    const updated = { ...activeDiscussion, isResolved: !activeDiscussion.isResolved };
    setActiveDiscussion(updated);
    setDiscussions(discussions.map((d) => (d.id === updated.id ? updated : d)));
  };

  return (
    <div className="w-full space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-space-900/60 border border-border-subtle backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">Technical Discussions</h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Exchange architecture solutions, troubleshoot stacks, and discuss real-world implementations.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cosmic-cyan text-space-950 font-bold text-xs sm:text-sm transition-all hover:shadow-glow-cyan hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>New Discussion</span>
        </button>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discussions by keyword, code, or tag..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-space-900/80 border border-border-subtle focus:border-cosmic-cyan focus:outline-none text-text-primary placeholder:text-text-muted"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs font-mono rounded-xl bg-space-900/90 border border-border-subtle text-text-primary focus:border-cosmic-cyan focus:outline-none"
          >
            <option value="all">All Categories ({DISCUSSION_CATEGORIES.length})</option>
            {DISCUSSION_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Split Layout: Left Discussion List, Right Selected Thread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Discussion List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredDiscussions.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-space-900/40 border border-dashed border-border-subtle space-y-2">
              <MessageSquare className="w-8 h-8 text-text-muted mx-auto" />
              <p className="text-sm font-semibold text-text-primary">No discussions found</p>
              <p className="text-xs text-text-muted">Try adjusting your filters or start a new thread.</p>
            </div>
          ) : (
            filteredDiscussions.map((d) => {
              const isSelected = activeDiscussion?.id === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => setActiveDiscussion(d)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-space-850/90 border-cosmic-cyan shadow-sm'
                      : 'bg-space-900/60 border-border-subtle hover:border-cosmic-cyan/40 hover:bg-space-850/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cosmic-cyan bg-cosmic-cyan/10 px-2 py-0.5 rounded">
                      {d.category.replace('_', ' ')}
                    </span>
                    {d.isResolved && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-cosmic-emerald bg-cosmic-emerald/10 px-1.5 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Resolved</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-text-primary mt-2 line-clamp-2">{d.title}</h3>

                  <div className="mt-3 flex items-center justify-between text-xs text-text-muted font-mono">
                    <span>@{d.authorUsername}</span>
                    <span>{d.replyCount} replies</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Discussion Details & Replies */}
        <div className="lg:col-span-7">
          {activeDiscussion ? (
            <div className="p-6 rounded-2xl bg-space-900/70 border border-border-subtle backdrop-blur-xl space-y-6">
              {/* Thread Header */}
              <div className="space-y-3 border-b border-border-subtle pb-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-cosmic-cyan bg-cosmic-cyan/10 px-2.5 py-1 rounded">
                    {activeDiscussion.category.replace('_', ' ')}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleToggleResolved}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                        activeDiscussion.isResolved
                          ? 'bg-cosmic-emerald/20 text-cosmic-emerald border border-cosmic-emerald/40'
                          : 'bg-space-950 text-text-muted hover:text-text-primary border border-border-subtle'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{activeDiscussion.isResolved ? 'Resolved' : 'Mark Resolved'}</span>
                    </button>

                    <a
                      href={`/community/moderation?reportType=discussion&targetId=${activeDiscussion.id}`}
                      className="p-1.5 rounded-lg text-text-muted hover:text-cosmic-rose hover:bg-space-950 transition-colors"
                      title="Report Abuse"
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-text-primary">{activeDiscussion.title}</h2>

                <div className="flex items-center gap-3 text-xs text-text-muted font-mono">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    <a href={`/u/${activeDiscussion.authorUsername}`} className="hover:text-cosmic-cyan hover:underline">
                      @{activeDiscussion.authorUsername}
                    </a>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(activeDiscussion.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Thread Content */}
              <div className="prose prose-invert max-w-none text-sm text-text-secondary whitespace-pre-wrap font-sans leading-relaxed">
                {activeDiscussion.content}
              </div>

              {/* Tags */}
              <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-border-subtle">
                <Tag className="w-3.5 h-3.5 text-text-muted" />
                {activeDiscussion.tags.map((t) => (
                  <span key={t} className="text-[11px] font-mono px-2 py-0.5 rounded bg-space-950 text-text-muted border border-border-subtle">
                    #{t}
                  </span>
                ))}
              </div>

              {/* Replies Section */}
              <div className="space-y-4 pt-4 border-t border-border-subtle">
                <h3 className="text-sm font-bold text-text-primary">
                  Replies ({replies.filter((r) => r.discussionId === activeDiscussion.id).length})
                </h3>

                <div className="space-y-3">
                  {replies
                    .filter((r) => r.discussionId === activeDiscussion.id)
                    .map((reply) => (
                      <div key={reply.id} className="p-3.5 rounded-xl bg-space-950/70 border border-border-subtle space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-text-muted font-mono">
                          <a href={`/u/${reply.authorUsername}`} className="text-cosmic-cyan hover:underline font-semibold">
                            @{reply.authorUsername}
                          </a>
                          <span>{new Date(reply.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-xs text-text-secondary whitespace-pre-wrap">{reply.content}</p>
                      </div>
                    ))}
                </div>

                {/* Reply Form */}
                <form onSubmit={handlePostReply} className="space-y-2 pt-2">
                  <textarea
                    rows={3}
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                    placeholder="Write a technically grounded reply... Markdown code blocks supported."
                    className="w-full p-3 rounded-xl bg-space-950 border border-border-subtle text-xs text-text-primary focus:border-cosmic-cyan focus:outline-none resize-none font-mono placeholder:text-text-muted"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isPostingReply || !replyInput.trim()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cosmic-cyan text-space-950 font-bold text-xs disabled:opacity-50 transition-all hover:scale-105"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Reply</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-space-900/40 border border-border-subtle text-text-muted">
              Select a discussion to view the thread.
            </div>
          )}
        </div>
      </div>

      {/* New Discussion Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl p-6 rounded-2xl bg-space-900 border border-cosmic-cyan/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-text-primary">Start a Technical Discussion</h3>
              <button onClick={() => setShowNewModal(false)} className="text-text-muted hover:text-text-primary">
                &times;
              </button>
            </div>

            {postMessage && <div className="p-3 rounded-lg bg-cosmic-rose/10 text-cosmic-rose text-xs font-mono">{postMessage}</div>}

            <form onSubmit={handleCreateDiscussion} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as DiscussionCategory)}
                  className="w-full px-3 py-2 rounded-xl bg-space-950 border border-border-subtle text-xs text-text-primary focus:border-cosmic-cyan focus:outline-none"
                >
                  {DISCUSSION_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Migrating from Prisma to Cloudflare D1 with atomic transactions"
                  className="w-full px-3 py-2 rounded-xl bg-space-950 border border-border-subtle text-xs text-text-primary focus:border-cosmic-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Content (Markdown & Code)</label>
                <textarea
                  rows={6}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Describe your technical dilemma, architecture diagram, or implementation query..."
                  className="w-full p-3 rounded-xl bg-space-950 border border-border-subtle text-xs text-text-primary focus:border-cosmic-cyan focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="typescript, cloudflare, databases"
                  className="w-full px-3 py-2 rounded-xl bg-space-950 border border-border-subtle text-xs text-text-primary focus:border-cosmic-cyan focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl bg-space-850 text-text-muted text-xs hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cosmic-cyan text-space-950 font-bold text-xs hover:shadow-glow-cyan"
                >
                  Publish Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
