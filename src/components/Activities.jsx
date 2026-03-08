/**
 * Activities.jsx
 * Activities & Engagement section - GSAP scroll-triggered animations
 */
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const getActivityIcon = (title) => {
  const t = title.toLowerCase();
  if (t.includes('robotics') || t.includes('robotique') || t.includes('iot')) return '🤖';
  if (t.includes('environment') || t.includes('environnement') || t.includes('cop27') || t.includes('citoyennet')) return '🌱';
  if (t.includes('citizenship') || t.includes('citoyennet') || t.includes('enactus')) return '🤝';
  if (t.includes('simulation') || t.includes('cop')) return '🌍';
  return '✨';
};

export default function Activities({ data, t }) {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  const activities = data?.activities || [];

  useEffect(() => {
    if (activities.length === 0 || !sectionRef.current) return;
    
    // Debug: expose data to window
    window.activitiesData = activities;

    const ctx = gsap.context((self) => {
      // Title reveal
      const title = self.selector('.section-title');
      if (title.length > 0) {
        gsap.from(title, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { 
            trigger: sectionRef.current, 
            start: 'top 95%',
            toggleActions: 'play none none none'
          },
        });
      }

      // Cards stagger - use a more robust selector and clearProps
      const cards = self.selector('.activity-card');
      if (cards.length > 0) {
        gsap.from(cards, {
          opacity: 0,
          y: 50,
          rotateX: -10,
          scale: 0.95,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
        });
      }
    }, sectionRef);

    // Refresh after a small tick to handle layout shifts
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 500);

    return () => {
      ctx.revert();
      clearTimeout(refreshTimer);
    };
  }, [activities]);

  if (!data || activities.length === 0) return null;

  return (
    <section id="activities" ref={sectionRef} className="py-24 px-4 bg-dark-surface/30">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="section-title gradient-text">{t?.title || 'Activities & Engagement'}</h2>
          <p className="text-gray-400 mt-4">{t?.subtitle || 'Extracurricular involvement and community engagement.'}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {activities.map((activity, idx) => (
            <div
              key={idx}
              className="activity-card card-premium perspective-1000 group p-6 md:p-8"
            >
              <div className="flex items-start gap-4 md:gap-6">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-indigo-500/10 flex-shrink-0 flex items-center justify-center text-2xl md:text-3xl group-hover:scale-110 transition-transform duration-500">
                  {getActivityIcon(activity.title)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors duration-300">
                    {activity.title}
                  </h3>
                  <p className="text-indigo-400 text-sm mb-3 font-medium">{activity.institution}</p>
                  <p className="text-gray-400 text-sm leading-relaxed" style={{ lineHeight: 'var(--line-height-relaxed)' }}>
                    {activity.detail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
