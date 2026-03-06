/**
 * Contact.jsx
 * Contact section with social links, email, phone, and a clean card layout.
 */
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Contact({ data }) {
  const sectionRef = useRef(null);
  const cardsRef   = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardsRef.current, {
        y: 40, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const contacts = [
    {
      label:    'Email',
      value:    data?.email,
      href:     `mailto:${data?.email}`,
      icon:     (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color:    '#6366f1',
    },
    {
      label:    'GitHub',
      value:    data?.github,
      href:     `https://${data?.github}`,
      icon:     (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
      ),
      color:    '#8b5cf6',
    },
    {
      label:    'LinkedIn',
      value:    data?.linkedin,
      href:     `https://${data?.linkedin}`,
      icon:     (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      color:    '#06b6d4',
    },
    {
      label:    'Phone',
      value:    data?.phone,
      href:     `tel:${data?.phone}`,
      icon:     (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      color:    '#ec4899',
    },
  ];

  return (
    <section id="contact" ref={sectionRef} className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="mb-16 text-center">
          <h2 className="section-title gradient-text">Get In Touch</h2>
          <p className="text-gray-400 mt-4 max-w-md mx-auto">
            Open to opportunities, collaborations, and interesting conversations. Don't hesitate to reach out!
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 gap-5">
          {contacts.map(({ label, value, href, icon, color }, idx) => (
            <a
              key={label}
              href={href}
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              ref={el => (cardsRef.current[idx] = el)}
              className="glass rounded-2xl p-6 card-hover border flex items-center gap-5 group"
              style={{ borderColor: 'rgba(99,102,241,0.12)', textDecoration: 'none' }}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                   style={{ background: `${color}18`, border: `1px solid ${color}35`, color }}>
                {icon}
              </div>
              <div className="min-w-0">
                <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">{label}</p>
                <p className="text-white font-medium truncate">{value}</p>
              </div>
              <svg className="w-4 h-4 text-gray-600 ml-auto group-hover:text-indigo-400 transition-colors flex-shrink-0"
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ))}
        </div>

        {/* CTA section */}
        <div className="mt-12 text-center">
          <div className="glass rounded-2xl p-8 border"
               style={{ borderColor: 'rgba(99,102,241,0.15)' }}>
            <h3 className="text-xl font-bold text-white mb-2">Let's build something amazing together</h3>
            <p className="text-gray-400 text-sm mb-6">
              Currently based in Casablanca, Morocco · Open to remote opportunities
            </p>
            <a
              href={`mailto:${data?.email}`}
              className="btn-glow px-8 py-3 rounded-xl text-white font-semibold inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send an Email
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
