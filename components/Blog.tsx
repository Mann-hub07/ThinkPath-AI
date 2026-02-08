
import React, { useState, useEffect } from 'react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  tag: string;
  readingTime: string;
}

const MOCK_BLOG_DATA: BlogPost[] = [
  {
    id: 1,
    title: "Guided Reasoning in the Age of LLMs",
    excerpt: "Why the struggle of deconstruction is more valuable than the final solution. Exploring the cognitive science behind deep learning.",
    date: "Oct 24, 2024",
    tag: "PEDAGOGY",
    readingTime: "5 min read"
  },
  {
    id: 2,
    title: "The Socratic Algorithm",
    excerpt: "How ThinkPath leverages Gemini 3 Pro to mimic ancient teaching patterns, ensuring conceptual clarity through dialectic dialogue.",
    date: "Sep 12, 2024",
    tag: "TECH",
    readingTime: "8 min read"
  },
  {
    id: 3,
    title: "Mental Models for Mathematics",
    excerpt: "Visualizing complex calculus through the lens of first principles and why rote memorization fails the modern student.",
    date: "Aug 05, 2024",
    tag: "EDUCATION",
    readingTime: "6 min read"
  },
  {
    id: 4,
    title: "Security in Stateless Learning",
    excerpt: "A deep dive into how ThinkPath secures your reasoning history using JWT and AES-256 equivalent logic vaulting.",
    date: "Jul 19, 2024",
    tag: "SECURITY",
    readingTime: "4 min read"
  }
];

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate an API fetch with local data source
    const fetchPosts = async () => {
      setIsLoading(true);
      // Artificial delay to simulate network latency
      await new Promise(resolve => setTimeout(resolve, 800));
      setPosts(MOCK_BLOG_DATA);
      setIsLoading(false);
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="py-24 max-w-5xl mx-auto flex flex-col items-center space-y-16">
        <div className="text-center space-y-4 animate-pulse">
          <div className="h-8 w-32 bg-neutral-900 rounded-full mx-auto"></div>
          <div className="h-4 w-64 bg-neutral-900 rounded-full mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 bg-neutral-900 border border-neutral-800 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 max-w-5xl mx-auto space-y-24">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-semibold text-neutral-100 tracking-tight">Journal.</h2>
        <p className="text-neutral-500 text-sm">Dispatches on logic, learning, and AI mentorship.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {posts.map(p => (
          <article key={p.id} className="group bg-neutral-900 border border-neutral-800 rounded-2xl p-10 hover:border-neutral-700 transition-all cursor-pointer flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{p.tag} • {p.date}</span>
                <span className="text-[9px] text-neutral-600 font-medium uppercase tracking-tighter">{p.readingTime}</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-100 group-hover:text-white leading-tight">{p.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{p.excerpt}</p>
            </div>
            <div className="pt-8 flex items-center gap-2 text-[10px] font-bold text-neutral-600 group-hover:text-neutral-300 uppercase tracking-widest transition-colors">
              <span>Read Analysis</span>
              <i className="fa-solid fa-arrow-right text-[8px]"></i>
            </div>
          </article>
        ))}
      </div>

      <div className="pt-12 text-center">
        <p className="text-neutral-600 text-xs font-medium italic">
          More insights arriving as the reasoning engine evolves.
        </p>
      </div>
    </div>
  );
};
