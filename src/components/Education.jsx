/**
 * Education.jsx
 * Education timeline with gradient dots, GSAP scroll-triggered animations.
 */
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EDU_ICONS = ['🎓', '🏛️', '📐', '📚'];

// Parse the structured education entries from the parsed data and add extras
function buildEducation(data) {
  const entries = data?.education ?? [];
  // Enrich with extra context
  return entries.map((e, i) => ({
    ...e,
    icon: EDU_ICONS[i % EDU_ICONS.length],
    badge: i === 0 ? 'In Progress' : e.detail?.includes('Honors') ? e.detail.split(' ').slice(-2).join(' ') : '',
  }));
}

export default function Education({ data, t }) {
  const sectionRef = useRef(null);
  const itemsRef   = useRef([]);

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

      gsap.from(itemsRef.current, {
        x: -40, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const entries = buildEducation(data);

  return (
    <section id="education" ref={sectionRef} className="py-24 px-6 md:px-4"
             style={{ background: 'linear-gradient(to bottom, var(--bg-primary), var(--bg-surface), var(--bg-primary))' }}>
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="mb-16 text-center">
          <h2 className="section-title gradient-text">{t?.title || 'Education'}</h2>
          <p className="text-gray-400 mt-4">{t?.subtitle || 'My academic journey and achievements.'}</p>
        </div>

        {/* Timeline */}
        <div className="relative pl-6 md:pl-8">
          {/* Vertical line with fading bottom */}
          <div className="absolute left-3 top-0 bottom-0 w-0.5"
               style={{ background: 'linear-gradient(to bottom, #6366f1, #8b5cf6, #06b6d4, transparent 95%)' }} />

          {entries.map((edu, idx) => (
            <div
              key={idx}
              ref={el => (itemsRef.current[idx] = el)}
              className="relative mb-10 last:mb-0"
            >
              {/* Dot on timeline */}
              <div className="absolute -left-6 md:-left-8 mt-1.5 w-5 h-5 rounded-full flex items-center justify-center z-10"
                   style={{
                     background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                     boxShadow: '0 0 16px rgba(99,102,241,0.5)',
                   }}>
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>

              {/* Card */}
              <div className="card-premium">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{edu.icon}</span>
                    <div>
                      <h3 className="text-white font-bold text-base md:text-lg leading-tight">{edu.degree}</h3>
                      <p className="text-indigo-400 text-xs md:text-sm mt-1">{edu.institution}</p>
                    </div>
                  </div>
                  {edu.badge && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0"
                          style={edu.badge === 'In Progress' || edu.badge === 'En cours'
                            ? { background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }
                            : { background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }
                          }>
                      {edu.badge === 'In Progress' ? (t?.badge_in_progress || 'In Progress') : edu.badge}
                    </span>
                  )}
                </div>
                {edu.detail && (
                  <p className="text-gray-400 text-sm mt-4 leading-relaxed" style={{ lineHeight: 'var(--line-height-relaxed)' }}>{edu.detail}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
