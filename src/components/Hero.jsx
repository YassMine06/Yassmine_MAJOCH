/**
 * Hero.jsx
 * Hero section with Three.js particle background, typing animation,
 * GSAP entrance animations, and call-to-action button.
 */
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

// ── Typing hook ──────────────────────────────────────────────────────────────
function useTyping(words, speed = 80, pause = 2000) {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex];
    const timeout = setTimeout(() => {
      if (deleting) {
        setText(current.slice(0, charIndex - 1));
        setCharIndex(i => i - 1);
        if (charIndex === 1) {
          setDeleting(false);
          setWordIndex(i => (i + 1) % words.length);
        }
      } else {
        setText(current.slice(0, charIndex + 1));
        setCharIndex(i => i + 1);
        if (charIndex === current.length) {
          setTimeout(() => setDeleting(true), pause);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex, words, speed, pause]);

  return text;
}

// ── Three.js particle background ────────────────────────────────────────────
function useThreeBackground(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Scene & camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 3;

    // ── Particles ────────────────────────────────────────────────────────────
    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 800 : 2000;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const colorPalette = [
      new THREE.Color('#6366f1'),
      new THREE.Color('#8b5cf6'),
      new THREE.Color('#06b6d4'),
      new THREE.Color('#ec4899'),
    ];

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.025,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // ── Mouse move parallax ──────────────────────────────────────────────────
    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 0.5;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 0.5;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── Animation loop ───────────────────────────────────────────────────────
    let frameId;
    const clock = new THREE.Clock();
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      particles.rotation.y = t * 0.03 + mouse.x;
      particles.rotation.x = t * 0.01 + mouse.y;
      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ──────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [canvasRef]);
}

// ── Component ────────────────────────────────────────────────────────────────
export default function Hero({ data, t }) {
  const canvasRef  = useRef(null);
  const heroRef    = useRef(null);
  const titleRef   = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef     = useRef(null);

  const typedText = useTyping(t?.typing || [
    'Engineering Student',
    'Software Developer',
    'Web Developer',
    'Problem Solver',
    'Full-Stack Explorer',
  ], 75, 2200);

  useThreeBackground(canvasRef);

  // GSAP entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 60, opacity: 0, duration: 1, ease: 'power4.out', delay: 0.3,
      });
      gsap.from(subtitleRef.current, {
        y: 40, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.7,
      });
      gsap.from(ctaRef.current, {
        y: 30, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 1.1,
      });
      
      // New: Stagger social icons
      gsap.from(".social-icon", {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "back.out(2)",
        delay: 1.5
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const scrollToWork = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-24"
    >
      {/* Three.js canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a14]/40 to-[#0a0a14]" style={{ zIndex: 1 }} />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border mb-8 text-sm font-medium"
             style={{ borderColor: 'rgba(99,102,241,0.3)' }}>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-gray-300">{t?.badge || 'Available for opportunities'}</span>
        </div>

        {/* Name */}
        <div ref={titleRef} className="mb-6">
          <h1 className="text-6xl md:text-8xl font-black leading-[1.1] tracking-tight">
            <span className="text-white">{t?.greeting || "Hi, I'm"} </span><br/>
            <span className="gradient-text">{data?.name || 'Yassmine'}</span>
          </h1>
        </div>

        {/* Animated title */}
        <div ref={subtitleRef} className="text-xl md:text-2xl font-medium mb-4 text-gray-300 h-8 flex items-center justify-center gap-1">
          <span>{typedText}</span>
          <span className="cursor-blink" />
        </div>

        {/* Subtitle */}
        <div className="text-gray-400 text-base md:text-xl mb-12 max-w-2xl mx-auto space-y-1 md:space-y-2 mt-4 md:mt-0">
          <p className="font-medium text-gray-300 leading-tight md:leading-normal text-sm md:text-lg">{data?.title}</p>
          <p className="text-xs md:text-base opacity-70">{data?.location}</p>
        </div>

        {/* CTA buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={scrollToWork}
            className="btn-glow px-8 py-4 rounded-xl text-white font-semibold text-base cursor-pointer inline-flex items-center gap-2"
          >
            <span>{t?.cta_work || 'View My Work'}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <a
            href={`mailto:${data?.email}`}
            className="px-8 py-4 rounded-xl font-semibold text-base border border-gray-600 text-gray-200 hover:border-indigo-500 hover:text-white hover:bg-indigo-500/10 transition-all duration-300 inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {t?.cta_contact || 'Contact Me'}
          </a>
        </div>

        {/* Social links */}
        <div className="mt-10 flex justify-center gap-5">
          <a
            href={`https://${data?.github}`}
            target="_blank" rel="noopener noreferrer"
            className="social-icon w-11 h-11 rounded-xl glass border flex items-center justify-center text-gray-400 hover:text-indigo-400 hover:border-indigo-500 transition-all duration-300 hover:-translate-y-1"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
            aria-label="GitHub"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
          <a
            href={`https://${data?.linkedin}`}
            target="_blank" rel="noopener noreferrer"
            className="social-icon w-11 h-11 rounded-xl glass border flex items-center justify-center text-gray-400 hover:text-indigo-400 hover:border-indigo-500 transition-all duration-300 hover:-translate-y-1"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
            aria-label="LinkedIn"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-gray-500 text-xs animate-bounce">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        <span>{t?.scroll || 'Scroll'}</span>
      </div>
    </section>
  );
}
