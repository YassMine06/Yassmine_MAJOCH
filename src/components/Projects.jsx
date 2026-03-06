/**
 * Projects.jsx
 * Responsive project cards with hover animations and GitHub links.
 * GSAP scroll-triggered stagger entrance.
 */
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Map tech stacks to color accents
const TECH_COLORS = {
  'HTML':       '#f97316', 'CSS':       '#06b6d4', 'JavaScript': '#eab308',
  'React':      '#61dafb', 'Python':    '#3b82f6', 'C':          '#64748b',
  'PHP':        '#a78bfa', 'Streamlit': '#ff4b4b', 'Flask':      '#10b981',
  'API':        '#f59e0b', 'MySQL':     '#38bdf8',
};

function TechTag({ label }) {
  const color = TECH_COLORS[label] || '#94a3b8';
  return (
    <span className="px-2 py-0.5 rounded-md text-xs font-medium"
          style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
      {label}
    </span>
  );
}

const PROJECT_ICONS = ['🌿', '⚡', '🏦', '📚', '☁️', '🤖'];

export default function Projects({ data }) {
  const sectionRef = useRef(null);
  const cardsRef   = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      gsap.from(sectionRef.current.querySelector('.section-title'), {
        y: '100%',
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' },
      });

      // Description reveal
      gsap.from(sectionRef.current.querySelector('.section-description'), {
        y: '100%',
        opacity: 0,
        duration: 1,
        delay: 0.2, // Slight delay after title
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' },
      });

      gsap.from(cardsRef.current, {
        y: 60, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const projects = data?.projects ?? [];

  return (
    <section id="projects" ref={sectionRef} className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="mb-16 text-center">
          <h2 className="section-title gradient-text">Projects</h2>
          <p className="section-description text-gray-400 mt-4 max-w-lg mx-auto">
            Academic and personal projects that showcase my skills across different domains.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => {
            const techs = project.tech
              ? project.tech.split(/,\s*/)
              : [];

            return (
              <div
                key={project.title || idx}
                ref={el => (cardsRef.current[idx] = el)}
                className="card-premium flex flex-col group"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                     style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  {PROJECT_ICONS[idx % PROJECT_ICONS.length]}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors duration-300">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm flex-1 mb-6" style={{ lineHeight: 'var(--line-height-relaxed)' }}>
                  {project.description || 'An interesting project built with modern tools.'}
                </p>

                {/* Tech tags */}
                {techs.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {techs.map(t => <TechTag key={t} label={t.trim()} />)}
                  </div>
                )}

                {/* GitHub link */}
                {project.github ? (
                  <a
                    href={project.github}
                    target="_blank" rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    View on GitHub →
                  </a>
                ) : (
                  <span className="mt-auto inline-flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Academic project
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
