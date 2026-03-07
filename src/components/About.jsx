/**
 * About.jsx
 * About Me section – GSAP scroll-triggered fade-in animations
 */
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About({ data, t }) {
  const sectionRef = useRef(null);
  const textRef    = useRef(null);
  const statsRef   = useRef(null);
  const imgRef     = useRef(null);

  const stats = [
    { label: t?.stats?.experience || 'Years of Learning', value: '3+' },
    { label: t?.stats?.projects   || 'Projects Built',    value: '5+' },
    { label: t?.stats?.skills     || 'Languages Spoken',  value: '3'  },
    { label: t?.stats?.techs      || 'Technologies Used', value: '12+'},
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Title reveal
      const title = sectionRef.current.querySelector('.section-title');
      if (title) {
        gsap.from(title, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' },
        });
      }

      // Card entrance
      if (imgRef.current) {
        gsap.from(imgRef.current, {
          x: -60, opacity: 0, duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        });
      }

      if (textRef.current && textRef.current.children.length > 0) {
        gsap.from(textRef.current.children, {
          y: 40, opacity: 0, duration: 0.8, stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        });
      }

      if (statsRef.current && statsRef.current.children.length > 0) {
        gsap.from(statsRef.current.children, {
          y: 30, opacity: 0, duration: 0.6, stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: statsRef.current, start: 'top 85%' },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="mb-16 text-center">
          <h2 className="section-title gradient-text">{t?.title || 'About Me'}</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left – Avatar card */}
          <div ref={imgRef} className="flex justify-center">
            <div className="relative w-72 h-72">
              {/* Glowing border */}
              <div className="absolute inset-0 rounded-2xl"
                   style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)', padding: '3px' }}>
                <div className="w-full h-full rounded-2xl" style={{ background: 'var(--bg-card)' }} />
              </div>
              {/* Avatar initials */}
              <div className="absolute inset-[3px] rounded-2xl flex flex-col items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #12121f 0%, #1a1a3a 100%)' }}>
                <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-black text-white mb-3"
                     style={{ background: 'rgba(99,102,241,0.15)', border: '2px solid rgba(99,102,241,0.3)' }}>
                  YM
                </div>
                <p className="text-white font-bold text-lg">{data?.name}</p>
                <p className="text-gray-400 text-sm mt-1">GLSID · ENSET</p>
                <div className="flex gap-2 mt-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc' }}>
                    Engineering
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{ background: 'rgba(6,182,212,0.15)', color: '#67e8f9' }}>
                    Software
                  </span>
                </div>
              </div>
              {/* Floating decorations */}
              <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full"
                   style={{ background: '#6366f1', boxShadow: '0 0 20px #6366f1' }} />
              <div className="absolute -bottom-3 -left-3 w-4 h-4 rounded-full"
                   style={{ background: '#06b6d4', boxShadow: '0 0 16px #06b6d4' }} />
            </div>
          </div>

          {/* Right – Text content */}
          <div ref={textRef}>
            <h3 className="text-2xl font-bold text-white mb-4">
              {t?.subtitle || 'A passionate engineering student based in Casablanca, Morocco'}
            </h3>
            <p className="text-gray-400 leading-relaxed mb-6 text-lg" style={{ lineHeight: 'var(--line-height-relaxed)' }}>
              {t?.desc1 || "I'm currently pursuing an Engineering Degree in GLSID (Software Engineering and Distributed Information Systems) at ENSET. I am driven by my curiosity and passion for building meaningful software solutions."}
            </p>
            <p className="text-gray-400 leading-relaxed mb-8 text-lg" style={{ lineHeight: 'var(--line-height-relaxed)' }}>
              {t?.desc2 || "My journey spans from C and low-level programming to full-stack web development with React and Flask, along with data-driven projects using Python and Streamlit. I thrive at the intersection of engineering rigor and creative problem-solving."}
            </p>

            {/* Info pills */}
            <div className="flex flex-wrap gap-3 mb-8">
              {[
                { icon: '📍', text: data?.location || 'Casablanca, Morocco' },
                { icon: '🎓', text: 'ENSET Casablanca' },
                { icon: '📧', text: data?.email || 'Contact Me' },
              ].map(({ icon, text }, idx) => (
                <span key={`${text}-${idx}`}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-300"
                      style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <span>{icon}</span>
                  {text}
                </span>
              ))}
            </div>

            {/* Language proficiency */}
            {data?.languages?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-300 mb-2 uppercase tracking-widest">{t?.nav?.languages || 'Languages'}</p>
                <div className="flex flex-wrap gap-2">
                  {data.languages.map(({ language, level }) => (
                    <span key={language}
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#c4b5fd' }}>
                      {language} · {level}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {stats.map(({ label, value }) => (
            <div key={label} className="card-premium text-center"
                 style={{ padding: 'var(--space-md)' }}>
              <div className="text-4xl font-black gradient-text mb-2">{value}</div>
              <div className="text-gray-400 text-sm font-medium tracking-wide uppercase">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
