/**
 * Skills.jsx
 * Skill categories displayed as cards with animated progress bars.
 * Scroll-triggered animations via GSAP.
 */
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Skill icons mapping ──────────────────────────────────────────────────────
const SKILL_ICONS = {
  'C':           '⚙️', 'C++':       '🔩', 'Python':     '🐍',
  'Java':        '☕', 'PHP':       '🐘', 'JavaScript': '🟨',
  'HTML':        '🌐', 'CSS':       '🎨', 'React':      '⚛️',
  'Streamlit':   '📊', 'Flask':     '🌶️', 'MySQL':      '🗄️',
  'SQLite':      '💾', 'Git':       '🔀', 'GitHub':      '🐙',
  'Visual Studio Code': '💻', 'Linux': '🐧', 'Windows': '🪟',
  'TypeScript': '🔷',
};

// Proficiency levels (percentage) for known skills
const PROFICIENCY = {
  'C':           75, 'C++':       60, 'Python':     80,
  'Java':        65, 'PHP':       55, 'JavaScript': 85,
  'HTML':        90, 'CSS':       85, 'React':      80,
  'Streamlit':   70, 'Flask':     65, 'MySQL':      70,
  'SQLite':      '65', 'Git': 85, 'GitHub': 90, 'Visual Studio Code': 95,
  'Linux': 75, 'Windows': 90,
};

const CATEGORY_META = [
  { key: 'languages',  label: 'Programming Languages', icon: '💻', color: '#6366f1' },
  { key: 'web',        label: 'Web Development',       icon: '🌐', color: '#06b6d4' },
  { key: 'frameworks', label: 'Frameworks & Tools',    icon: '⚡', color: '#8b5cf6' },
  { key: 'databases',  label: 'Databases',             icon: '🗄️', color: '#ec4899' },
  { key: 'tools',      label: 'Tools & Workflow',      icon: '🛠️', color: '#f59e0b' },
  { key: 'systems',    label: 'Systems & OS',          icon: '🖥️', color: '#10b981' },
];

// ── SkillBar sub-component ───────────────────────────────────────────────────
function SkillBar({ name, animate }) {
  const level   = PROFICIENCY[name] ?? 60;
  const fillRef = useRef(null);

  useEffect(() => {
    if (animate && fillRef.current) {
      gsap.to(fillRef.current, {
        scaleX: level / 100,
        duration: 1.2,
        ease: 'power2.out',
        delay: 0.2,
        transformOrigin: 'left center',
      });
    }
  }, [animate, level]);

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-300 flex items-center gap-2">
          <span>{SKILL_ICONS[name] || '•'}</span>
          {name}
        </span>
        <span className="text-xs text-gray-500">{level}%</span>
      </div>
      <div className="progress-bar">
        <div
          ref={fillRef}
          className="progress-fill"
          style={{ transform: 'scaleX(0)', transformOrigin: 'left center' }}
        />
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function Skills({ data }) {
  const sectionRef = useRef(null);
  const cardsRef   = useRef([]);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardsRef.current, {
        y: 50, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
          onEnter: () => setTriggered(true),
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-24 px-4"
      style={{ background: 'linear-gradient(to bottom, var(--bg-primary), var(--bg-surface), var(--bg-primary))' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="mb-16 text-center">
          <h2 className="section-title gradient-text">Technical Skills</h2>
          <p className="text-gray-400 mt-4 max-w-lg mx-auto">
            A diverse toolkit built through coursework, personal projects, and continuous learning.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORY_META.map(({ key, label, icon, color }, idx) => {
            const skills = data?.skills?.[key] ?? [];
            return (
              <div
                key={key}
                ref={el => (cardsRef.current[idx] = el)}
                className="card-premium"
              >
                {/* Card header */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: `${color}20`, border: `1px solid ${color}40` }}
                  >
                    {icon}
                  </div>
                  <h3 className="font-bold text-white text-sm leading-tight">{label}</h3>
                </div>

                {/* Skill bars */}
                {skills.length > 0
                  ? skills.map(skill => (
                      <SkillBar key={skill} name={skill} animate={triggered} />
                    ))
                  : <p className="text-gray-500 text-sm">—</p>
                }
              </div>
            );
          })}
        </div>

        {/* Floating tags */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm uppercase tracking-widest mb-4">Also familiar with</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Git & GitHub', 'Linux CLI', 'Agile/Scrum', 'REST APIs', 'Problem Solving'].map(tag => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full text-sm text-gray-300"
                style={{
                  background: 'rgba(99,102,241,0.08)',
                  border: '1px solid rgba(99,102,241,0.2)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
