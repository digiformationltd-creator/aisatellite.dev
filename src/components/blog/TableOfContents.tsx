import React, { useEffect, useState } from 'react';
import { List, ChevronRight } from 'lucide-react';

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
  class?: string;
}

export default function TableOfContents({ items, class: className = '' }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || '');
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  useEffect(() => {
    if (items.length === 0) return;

    const handleScroll = () => {
      const headingElements = items
        .map((item) => document.getElementById(item.id))
        .filter((el): el is HTMLElement => el !== null);

      const scrollPosition = window.scrollY + 120;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        if (el.offsetTop <= scrollPosition) {
          setActiveId(items[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav
      className={`rounded-card bg-space-900/90 border border-border-subtle p-5 backdrop-blur-md ${className}`}
      aria-label="Table of contents"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cosmic-cyan uppercase tracking-wider">
          <List className="w-3.5 h-3.5" />
          <span>Table of Contents</span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="md:hidden text-xs text-text-muted hover:text-text-primary focus:outline-none"
          aria-expanded={isOpenMobile}
        >
          {isOpenMobile ? 'Collapse' : 'Expand'}
        </button>
      </div>

      <ul className={`space-y-1.5 text-xs ${isOpenMobile ? 'block' : 'hidden md:block'}`}>
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li
              key={item.id}
              className={`${item.level === 3 ? 'pl-3' : 'pl-0'}`}
            >
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById(item.id);
                  if (target) {
                    const top = target.getBoundingClientRect().top + window.scrollY - 90;
                    window.scrollTo({ top, behavior: 'smooth' });
                    history.pushState(null, '', `#${item.id}`);
                    setActiveId(item.id);
                  }
                }}
                className={`flex items-start gap-1.5 py-1 transition-colors leading-relaxed ${
                  isActive
                    ? 'text-cosmic-cyan font-semibold translate-x-0.5'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <ChevronRight
                  className={`w-3 h-3 flex-shrink-0 mt-0.5 transition-transform ${
                    isActive ? 'text-cosmic-cyan rotate-90' : 'text-text-muted'
                  }`}
                />
                <span>{item.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
