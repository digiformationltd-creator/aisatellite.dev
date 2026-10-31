import React, { useState } from 'react';
import {
  BookmarkCheck,
  Search,
  Plus,
  Users,
  Lock,
  Globe,
  Tag,
  Share2,
  FolderPlus,
  Shield,
  Layers,
} from 'lucide-react';
import type { CollaborativeCollection } from '../../lib/community/types';

interface CollaborativeCollectionsHubProps {
  initialCollections?: CollaborativeCollection[];
}

export default function CollaborativeCollectionsHub({
  initialCollections = [],
}: CollaborativeCollectionsHubProps) {
  const [collections, setCollections] = useState<CollaborativeCollection[]>(initialCollections);
  const [activeTab, setActiveTab] = useState<'public' | 'my'>('public');
  const [searchQuery, setSearchQuery] = useState('');

  // Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState('databases, tools');

  const filteredCollections = collections.filter((c) => {
    if (activeTab === 'public' && !c.isPublic) return false;
    return (
      searchQuery === '' ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tagsArr = tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
    const newCol: CollaborativeCollection = {
      id: `col-${Date.now()}`,
      ownerId: 'user-current',
      ownerUsername: 'current-developer',
      title: title.trim(),
      description: description.trim(),
      isPublic,
      resourceIds: [],
      notes: '',
      tags: tagsArr.length > 0 ? tagsArr : ['stack'],
      version: 1,
      members: [
        {
          userId: 'user-current',
          username: 'current-developer',
          role: 'owner',
          addedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCollections([newCol, ...collections]);
    setShowCreateModal(false);
    setTitle('');
    setDescription('');
    setIsPublic(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-space-900/60 border border-border-subtle backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">Collaborative Collections</h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Curate technology toolkits with team members. Role-based permissions (`Owner`, `Editor`, `Viewer`) with strict workspace isolation.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cosmic-cyan text-space-950 font-bold text-xs sm:text-sm transition-all hover:shadow-glow-cyan hover:scale-105"
        >
          <FolderPlus className="w-4 h-4" />
          <span>New Collection</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('public')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === 'public'
                ? 'bg-cosmic-cyan/20 text-cosmic-cyan border border-cosmic-cyan/40'
                : 'bg-space-900/60 text-text-muted hover:text-text-primary border border-border-subtle'
            }`}
          >
            Public Collections
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === 'my'
                ? 'bg-cosmic-cyan/20 text-cosmic-cyan border border-cosmic-cyan/40'
                : 'bg-space-900/60 text-text-muted hover:text-text-primary border border-border-subtle'
            }`}
          >
            My Collaborative Workspaces
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search collections..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-space-900/80 border border-border-subtle focus:border-cosmic-cyan focus:outline-none text-text-primary placeholder:text-text-muted"
          />
        </div>
      </div>

      {/* Collections Grid */}
      {filteredCollections.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-space-900/40 border border-dashed border-border-subtle space-y-3">
          <BookmarkCheck className="w-10 h-10 text-text-muted mx-auto" />
          <h3 className="text-base font-bold text-text-primary">No collections available</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            {activeTab === 'public'
              ? 'No public collections have been published yet.'
              : 'You have not created or joined any collaborative collections.'}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-cosmic-cyan/20 text-cosmic-cyan text-xs font-semibold hover:bg-cosmic-cyan/30 transition-colors"
          >
            Create Collection &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollections.map((col) => (
            <div
              key={col.id}
              className="p-6 rounded-2xl bg-space-900/70 border border-border-subtle hover:border-cosmic-cyan/40 transition-all backdrop-blur-xl flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded ${
                      col.isPublic
                        ? 'bg-cosmic-cyan/10 text-cosmic-cyan border border-cosmic-cyan/30'
                        : 'bg-space-950 text-text-muted border border-border-subtle'
                    }`}
                  >
                    {col.isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    <span>{col.isPublic ? 'Public' : 'Private'}</span>
                  </span>
                  <span className="text-[10px] font-mono text-text-muted">v{col.version}</span>
                </div>

                <h3 className="text-base font-bold text-text-primary group-hover:text-cosmic-cyan transition-colors">
                  {col.title}
                </h3>

                <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                  {col.description || 'Curated developer stack.'}
                </p>

                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {col.tags.map((t) => (
                    <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-space-950 text-text-muted">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-xs text-text-muted font-mono">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>{col.members.length} members</span>
                </div>
                <div>{col.resourceIds.length} resources</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Collection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-space-900 border border-cosmic-cyan/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-text-primary">Create Collaborative Collection</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-text-muted hover:text-text-primary">
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateCollection} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Collection Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Production SQLite & Edge Stack"
                  className="w-full px-3 py-2 rounded-xl bg-space-950 border border-border-subtle text-xs text-text-primary focus:border-cosmic-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Curated suite of verified tools for building low-latency edge applications..."
                  className="w-full p-3 rounded-xl bg-space-950 border border-border-subtle text-xs text-text-primary focus:border-cosmic-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="sqlite, cloudflare, caching"
                  className="w-full px-3 py-2 rounded-xl bg-space-950 border border-border-subtle text-xs text-text-primary focus:border-cosmic-cyan focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPublicCheck"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded border-border-subtle bg-space-950 text-cosmic-cyan focus:ring-cosmic-cyan"
                />
                <label htmlFor="isPublicCheck" className="text-xs text-text-secondary">
                  Make collection public in community directory (Unchecked keeps it private to invited collaborators)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-space-850 text-text-muted text-xs hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cosmic-cyan text-space-950 font-bold text-xs hover:shadow-glow-cyan"
                >
                  Create Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
