/**
 * App.jsx
 * Root component: loads README.md, parses it, manages dark/light mode,
 * renders sticky navbar and all sections with a loading overlay.
 */
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Hero      from './components/Hero';
import About     from './components/About';
import Skills    from './components/Skills';
import Projects  from './components/Projects';
import Activities from './components/Activities';
import Education from './components/Education';
import Contact   from './components/Contact';
import Footer    from './components/Footer';

import { parsePortfolioData } from './utils/parseMarkdown';
import { translations } from './utils/translations';
import './styles.css';

gsap.registerPlugin(ScrollTrigger);

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [language,      setLanguage]      = useState('FR');
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [scrolled,      setScrolled]      = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const t = translations[language];

  // ── Nav sections ─────────────────────────────────────────────────────────────
  const NAV_LINKS = [
    { href: '#home',       label: t.nav.home       },
    { href: '#about',      label: t.nav.about      },
    { href: '#skills',     label: t.nav.skills     },
    { href: '#projects',   label: t.nav.projects   },
    { href: '#activities', label: t.nav.activities },
    { href: '#education',  label: t.nav.education  },
    { href: '#contact',    label: t.nav.contact    },
  ];

  const loaderRef = useRef(null);

  // ── Fetch & parse Markdown based on language ──────────────────────────────
  useEffect(() => {
    setLoading(true);
    fetch(`/README_${language}.md?v=${Date.now()}`)
      .then(res => res.text())
      .then(text => {
        setPortfolioData(parsePortfolioData(text));
        
        // Brief delay before removing loader
        setTimeout(() => {
          gsap.to(loaderRef.current, {
            opacity: 0, 
            duration: 0.6, 
            ease: 'power2.in',
            onComplete: () => setLoading(false),
          });
        }, 600);
      })
      .catch(() => setLoading(false));
  }, [language]);

  // ── Dark mode class on <html> ─────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }, []);

  // ── Scroll tracking ───────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);

      // Scroll progress
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);

      // Active section detection
      const sections = NAV_LINKS.map(l => l.href.slice(1));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Smooth scroll on nav click ────────────────────────────────────────────
  const handleNav = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className='dark'>
      {/* Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 z-[60] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Loading overlay */}
      {loading && (
        <div ref={loaderRef} className="loader">
          <div className="loader-ring mb-4" />
          <span className="gradient-text font-bold text-lg">Loading Portfolio…</span>
        </div>
      )}

      {/* ── Navbar ────────────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass shadow-lg' : 'bg-transparent'
        }`}
        style={{ borderBottom: scrolled ? '1px solid rgba(99,102,241,0.15)' : 'none' }}
      >
        <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#home" onClick={e => handleNav(e, '#home')}
             className="font-black text-xl gradient-text tracking-tight">
            {'YM'}
            <span className="text-indigo-400"></span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={e => handleNav(e, href)}
                className={`nav-link text-sm font-medium ${activeSection === href.slice(1) ? 'active' : ''}`}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 glass p-1 rounded-xl border border-white/10 mr-2">
              <button
                onClick={() => setLanguage('FR')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === 'FR' ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => setLanguage('EN')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === 'EN' ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(m => !m)}
              className="md:hidden w-10 h-10 rounded-xl glass border flex items-center justify-center text-gray-400"
              style={{ borderColor: 'rgba(255,255,255,0.1)' }}
              aria-label="Menu"
            >
              {menuOpen
                ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
              }
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div className={`md:hidden glass border-t transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-96 py-4' : 'max-h-0'
        }`} style={{ borderColor: 'rgba(99,102,241,0.15)' }}>
          <div className="flex flex-col px-4 gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={e => handleNav(e, href)}
                className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeSection === href.slice(1)
                    ? 'text-indigo-400 bg-indigo-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <main>
        <Hero      data={portfolioData} t={t.hero} />
        <About     data={portfolioData} t={t.about} />
        <Skills    data={portfolioData} t={t.skills} />
        <Projects  data={portfolioData} t={t.projects} />
        <Activities data={portfolioData} t={t.activities} />
        <Education data={portfolioData} t={t.education} />
        <Contact   data={portfolioData} t={t.contact} />
      </main>

      <Footer data={portfolioData} t={t.footer} />
    </div>
  );
}
