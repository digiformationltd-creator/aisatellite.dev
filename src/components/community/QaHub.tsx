import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  Plus,
  CheckCircle2,
  ThumbsUp,
  Tag,
  Code,
  Clock,
  User,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import type { CommunityQuestion, QuestionAnswer } from '../../lib/community/types';

interface QaHubProps {
  initialQuestions?: CommunityQuestion[];
}

export default function QaHub({ initialQuestions = [] }: QaHubProps) {
  const [questions, setQuestions] = useState<CommunityQuestion[]>(initialQuestions);
  const [activeQuestion, setActiveQuestion] = useState<CommunityQuestion | null>(initialQuestions[0] || null);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSolved, setFilterSolved] = useState<'all' | 'solved' | 'unsolved'>('all');

  // Submit Answer state
  const [answerContent, setAnswerContent] = useState('');
  const [answerCode, setAnswerCode] = useState('');

  // Ask Question Modal state
  const [showAskModal, setShowAskModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContext, setNewContext] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newTags, setNewTags] = useState('react, typescript');
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredQuestions = questions.filter((q) => {
    if (filterSolved === 'solved' && !q.isAnswered) return false;
    if (filterSolved === 'unsolved' && q.isAnswered) return false;
    return (
      searchQuery === '' ||
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.technicalContext.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContext.trim()) {
      setFeedback('Question title and context are required.');
      return;
    }

    const tagsArray = newTags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
    const newQ: CommunityQuestion = {
      id: `qst-${Date.now()}`,
      authorId: 'user-current',
      authorUsername: 'current-developer',
      title: newTitle.trim(),
      technicalContext: newContext.trim(),
      codeSnippet: newCode.trim() || undefined,
      tags: tagsArray.length > 0 ? tagsArray : ['general'],
      isAnswered: false,
      answerCount: 0,
      relatedDocUrls: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setQuestions([newQ, ...questions]);
    setActiveQuestion(newQ);
    setShowAskModal(false);
    setNewTitle('');
    setNewContext('');
    setNewCode('');
    setFeedback(null);
  };

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerContent.trim() || !activeQuestion) return;

    const newA: QuestionAnswer = {
      id: `ans-${Date.now()}`,
      questionId: activeQuestion.id,
      authorId: 'user-current',
      authorUsername: 'current-developer',
      content: answerContent.trim(),
      codeExample: answerCode.trim() || undefined,
      isAccepted: false,
      isOutdated: false,
      upvoteCount: 0,
      upvoterUserIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setAnswers([...answers, newA]);
    setAnswerContent('');
    setAnswerCode('');

    setQuestions(
      questions.map((q) => (q.id === activeQuestion.id ? { ...q, answerCount: q.answerCount + 1 } : q))
    );
  };

  const handleAcceptAnswer = (answerId: string) => {
    if (!activeQuestion) return;
    setAnswers(
      answers.map((a) => (a.id === answerId ? { ...a, isAccepted: true } : { ...a, isAccepted: false }))
    );
    const updated = { ...activeQuestion, isAnswered: true, acceptedAnswerId: answerId };
    setActiveQuestion(updated);
    setQuestions(questions.map((q) => (q.id === updated.id ? updated : q)));
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-space-900/60 border border-border-subtle backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">Developer Questions & Answers</h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Real questions, reproducible code snippets, and verified solutions. No fabricated answers.
          </p>
        </div>

        <button
          onClick={() => setShowAskModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cosmic-violet text-text-primary font-bold text-xs sm:text-sm transition-all hover:shadow-glow-violet hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Ask Question</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Q&A by keyword, error message, or tags..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-space-900/80 border border-border-subtle focus:border-cosmic-violet focus:outline-none text-text-primary placeholder:text-text-muted"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'solved', 'unsolved'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterSolved(mode)}
              className={`px-3 py-2 rounded-xl text-xs font-mono capitalize transition-all ${
                filterSolved === mode
                  ? 'bg-cosmic-violet/20 text-cosmic-violet border border-cosmic-violet/40 font-bold'
                  : 'bg-space-900/80 text-text-muted hover:text-text-primary border border-border-subtle'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Question List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredQuestions.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-space-900/40 border border-dashed border-border-subtle space-y-2">
              <HelpCircle className="w-8 h-8 text-text-muted mx-auto" />
              <p className="text-sm font-semibold text-text-primary">No questions found</p>
              <p className="text-xs text-text-muted">Ask the first technical question to get community help.</p>
            </div>
          ) : (
            filteredQuestions.map((q) => {
              const isSelected = activeQuestion?.id === q.id;
              return (
                <div
                  key={q.id}
                  onClick={() => setActiveQuestion(q)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-space-850/90 border-cosmic-violet shadow-sm'
                      : 'bg-space-900/60 border-border-subtle hover:border-cosmic-violet/40 hover:bg-space-850/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {q.isAnswered ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-cosmic-emerald bg-cosmic-emerald/10 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Solved</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-cosmic-amber bg-cosmic-amber/10 px-2 py-0.5 rounded">
                          Open ({q.answerCount})
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-text-muted font-mono">{new Date(q.createdAt).toLocaleDateString()}</span>
                  </div>

                  <h3 className="text-sm font-bold text-text-primary mt-2 line-clamp-2">{q.title}</h3>

                  <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                    {q.tags.map((t) => (
                      <span key={t} className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-space-950 text-text-muted">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Question Detail & Answers */}
        <div className="lg:col-span-7">
          {activeQuestion ? (
            <div className="p-6 rounded-2xl bg-space-900/70 border border-border-subtle backdrop-blur-xl space-y-6">
              {/* Question Header */}
              <div className="space-y-3 border-b border-border-subtle pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {activeQuestion.isAnswered ? (
                      <span className="inline-flex items-center gap-1 text-xs font-mono text-cosmic-emerald bg-cosmic-emerald/10 px-2.5 py-1 rounded">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accepted Solution</span>
                      </span>
                    ) : (
                      <span className="text-xs font-mono text-cosmic-amber bg-cosmic-amber/10 px-2.5 py-1 rounded">
                        Awaiting Accepted Solution
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-text-muted font-mono">
                    Asked by @{activeQuestion.authorUsername}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-text-primary">{activeQuestion.title}</h2>
              </div>

              {/* Technical Context */}
              <div className="space-y-3">
                <p className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
                  {activeQuestion.technicalContext}
                </p>

                {activeQuestion.codeSnippet && (
                  <div className="rounded-xl overflow-hidden border border-border-subtle bg-space-950">
                    <div className="px-3 py-1.5 bg-space-900/80 border-b border-border-subtle text-[11px] font-mono text-text-muted flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5" />
                      <span>Code Snippet</span>
                    </div>
                    <pre className="p-3 text-xs font-mono text-cosmic-cyan overflow-x-auto whitespace-pre">
                      {activeQuestion.codeSnippet}
                    </pre>
                  </div>
                )}
              </div>

              {/* Answers */}
              <div className="space-y-4 pt-4 border-t border-border-subtle">
                <h3 className="text-base font-bold text-text-primary">
                  Answers ({answers.filter((a) => a.questionId === activeQuestion.id).length})
                </h3>

                <div className="space-y-4">
                  {answers
                    .filter((a) => a.questionId === activeQuestion.id)
                    .map((ans) => (
                      <div
                        key={ans.id}
                        className={`p-4 rounded-xl border space-y-3 ${
                          ans.isAccepted
                            ? 'bg-space-900/90 border-cosmic-emerald shadow-sm'
                            : 'bg-space-950/70 border-border-subtle'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-text-primary">@{ans.authorUsername}</span>
                            {ans.isAccepted && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-cosmic-emerald bg-cosmic-emerald/15 px-2 py-0.5 rounded">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Accepted Answer</span>
                              </span>
                            )}
                          </div>

                          {!ans.isAccepted && (
                            <button
                              onClick={() => handleAcceptAnswer(ans.id)}
                              className="text-xs font-mono text-cosmic-emerald hover:underline"
                            >
                              Accept as Solution &rarr;
                            </button>
                          )}
                        </div>

                        <p className="text-xs text-text-secondary whitespace-pre-wrap">{ans.content}</p>

                        {ans.codeExample && (
                          <pre className="p-2.5 rounded-lg bg-space-900 text-xs font-mono text-cosmic-emerald overflow-x-auto">
                            {ans.codeExample}
                          </pre>
                        )}
                      </div>
                    ))}
                </div>

                {/* Submit Answer Box */}
                <form onSubmit={handleSubmitAnswer} className="space-y-3 pt-3 border-t border-border-subtle">
                  <h4 className="text-xs font-bold text-text-primary">Your Technical Solution</h4>
                  <textarea
                    rows={4}
                    value={answerContent}
                    onChange={(e) => setAnswerContent(e.target.value)}
                    placeholder="Provide a grounded explanation with steps to reproduce or fix..."
                    className="w-full p-3 rounded-xl bg-space-950 border border-border-subtle text-xs text-text-primary focus:border-cosmic-violet focus:outline-none placeholder:text-text-muted"
                  />
                  <textarea
                    rows={2}
                    value={answerCode}
                    onChange={(e) => setAnswerCode(e.target.value)}
                    placeholder="Optional code snippet or terminal commands..."
                    className="w-full p-3 rounded-xl bg-space-950 border border-border-subtle text-xs font-mono text-cosmic-violet focus:border-cosmic-violet focus:outline-none placeholder:text-text-muted"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!answerContent.trim()}
                      className="px-4 py-2 rounded-xl bg-cosmic-violet text-text-primary font-bold text-xs disabled:opacity-50 hover:shadow-glow-violet transition-all"
                    >
                      Submit Solution (+15 Rep on Accept)
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-space-900/40 border border-border-subtle text-text-muted">
              Select a question to view details.
            </div>
          )}
        </div>
      </div>

      {/* Ask Question Modal */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl p-6 rounded-2xl bg-space-900 border border-cosmic-violet/30 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-text-primary">Ask a Developer Question</h3>
              <button onClick={() => setShowAskModal(false)} className="text-text-muted hover:text-text-primary">
                &times;
              </button>
            </div>

            {feedback && <div className="p-3 rounded-lg bg-cosmic-rose/15 text-cosmic-rose text-xs font-mono">{feedback}</div>}

            <form onSubmit={handleAskQuestion} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Question Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. How to handle concurrent writes in Cloudflare D1 without collisions?"
                  className="w-full px-3 py-2 rounded-xl bg-space-950 border border-border-subtle text-xs text-text-primary focus:border-cosmic-violet focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Technical Context & What You Tried *</label>
                <textarea
                  rows={5}
                  required
                  value={newContext}
                  onChange={(e) => setNewContext(e.target.value)}
                  placeholder="Describe your runtime environment, relevant logs, and specific failure symptoms..."
                  className="w-full p-3 rounded-xl bg-space-950 border border-border-subtle text-xs text-text-primary focus:border-cosmic-violet focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Minimal Reproducible Code Snippet</label>
                <textarea
                  rows={4}
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="const env = getPlatformProxy(); await env.DB.prepare(...);"
                  className="w-full p-3 rounded-xl bg-space-950 border border-border-subtle text-xs font-mono text-cosmic-cyan focus:border-cosmic-violet focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="cloudflare, d1, sqlite, typescript"
                  className="w-full px-3 py-2 rounded-xl bg-space-950 border border-border-subtle text-xs text-text-primary focus:border-cosmic-violet focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="px-4 py-2 rounded-xl bg-space-850 text-text-muted text-xs hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cosmic-violet text-text-primary font-bold text-xs hover:shadow-glow-violet"
                >
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
