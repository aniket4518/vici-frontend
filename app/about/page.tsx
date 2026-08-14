"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  /* ─── reveal sections on scroll ─── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(entry.target, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    sectionRefs.current.forEach((el) => {
      if (el) {
        gsap.set(el, { opacity: 0, y: 40 });
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);



  function addRef(el: HTMLElement | null, idx: number) {
    sectionRefs.current[idx] = el;
  }

  /* ─── feature data ─── */
  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="about-feature-icon-svg">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      title: "Capture Territory",
      desc: "Walk or run through hex zones on the map to claim them as yours. The more you move, the bigger your empire.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="about-feature-icon-svg">
          <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
        </svg>
      ),
      title: "Track Progress",
      desc: "Monitor steps, distance, calories, and capture stats — all in one dashboard designed to keep you motivated.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="about-feature-icon-svg">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 9 7 12 7s5-3 7.5-3a2.5 2.5 0 0 1 0 5H18" />
          <path d="M18 15h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M6 15H4.5a2.5 2.5 0 0 1 0-5H6" />
          <line x1="6" x2="18" y1="9" y2="9" /><line x1="6" x2="18" y1="15" y2="15" />
          <path d="M6 9v6" /><path d="M18 9v6" />
          <path d="M12 15v5" /><path d="M8 20h8" />
        </svg>
      ),
      title: "Compete & Climb",
      desc: "Leaderboards, daily quests, and city-wide events push you to outrun the competition and top the charts.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="about-feature-icon-svg">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: "Social Feed",
      desc: "Share your runs, see your friends' territory, and comment on each other's conquests in a community-first feed.",
    },
  ];

  /* ─── how it works steps ─── */
  const steps = [
    {
      num: "01",
      title: "Lace Up & Open Daur",
      desc: "Download from Play Store, create your profile, and hit the map. Your city is already divided into hex zones waiting to be conquered.",
    },
    {
      num: "02",
      title: "Walk, Run, Conquer",
      desc: "Move through zones to claim them. Complete daily quests — step goals, distance targets, calorie burns — to unlock bonus captures.",
    },
    {
      num: "03",
      title: "Dominate & Compete",
      desc: "Climb the leaderboard, defend your territory from rivals, and join city-wide events to prove you're the ultimate urban conqueror.",
    },
  ];

  return (
    <div className="about-page">
      {/* ── Header ── */}
      <header className="header">
        <Link href="/" className="logo">daur.</Link>
        <nav className="about-nav">
          <Link href="/" className="contact-btn">Home</Link>
          <a href="mailto:contact.daur@gmail.com" className="contact-btn">Contact</a>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="about-hero" ref={(el) => addRef(el, 0)}>
        <span className="about-badge">ABOUT DAUR</span>
        <h1 className="about-hero-title">
          Your City.<br />Your Game Board.
        </h1>
        <p className="about-hero-sub">
          Daur turns every walk and run into a territory war. Claim hex zones, 
          complete quests, and climb the leaderboard — all by simply moving.
        </p>
      </section>

      {/* ── How It Works ── */}
      <section className="about-section" ref={(el) => addRef(el, 1)}>
        <h2 className="about-section-title">How It Works</h2>
        <div className="about-steps">
          {steps.map((step, i) => (
            <div className="about-step-card" key={i}>
              <span className="about-step-num">{step.num}</span>
              <h3 className="about-step-title">{step.title}</h3>
              <p className="about-step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="about-section" ref={(el) => addRef(el, 2)}>
        <h2 className="about-section-title">What You Can Do</h2>
        <div className="about-features-grid">
          {features.map((f, i) => (
            <div className="about-feature-card" key={i}>
              <div className="about-feature-icon">{f.icon}</div>
              <h3 className="about-feature-title">{f.title}</h3>
              <p className="about-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── App Showcase ── */}
      <section className="about-section about-showcase" ref={(el) => addRef(el, 3)}>
        <div className="about-showcase-inner">
          <div className="about-showcase-text">
            <h2 className="about-section-title" style={{ textAlign: "left" }}>
              Built for Runners,<br />Designed for Everyone
            </h2>
            <p className="about-showcase-desc">
              Whether you&apos;re a seasoned marathoner or someone who just wants a 
              reason to take a walk, Daur gives you that extra push. Set daily 
              goals, track your stats, and watch your territory grow on the 
              real-world map.
            </p>
            <ul className="about-showcase-list">
              <li><span className="about-check">✓</span> Real-time hex-grid map</li>
              <li><span className="about-check">✓</span> Daily quests & challenges</li>
              <li><span className="about-check">✓</span> Step, calorie & distance tracking</li>
              <li><span className="about-check">✓</span> Social feed & community</li>
              <li><span className="about-check">✓</span> City-wide leaderboards</li>
            </ul>
          </div>
          <div className="about-showcase-phone">
            <Image
              src="/phone.png"
              alt="Daur app screenshot"
              width={300}
              height={600}
              className="about-phone-img"
            />
          </div>
        </div>
      </section>



      {/* ── CTA / Play Store ── */}
      <section className="about-section about-cta-section" ref={(el) => addRef(el, 5)}>
        <h2 className="about-cta-title">Ready to Conquer Your City?</h2>
        <p className="about-cta-sub">
          Download Daur now and start claiming your neighborhood.
        </p>
        <div className="about-store-buttons">
          {/* Google Play */}
          <a
            href="https://play.google.com/store/apps/details?id=com.daur.daurapp"
            target="_blank"
            rel="noopener noreferrer"
            className="store-btn"
            id="about-google-play-btn"
          >
            <span className="store-btn-icon">
              <svg viewBox="0 0 512 512" width="22" height="22" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
              </svg>
            </span>
            <span className="store-btn-text">
              <span className="store-btn-label">GET IT ON</span>
              <span className="store-btn-name">Google Play</span>
            </span>
          </a>

          {/* App Store */}
          <div className="store-btn about-store-coming-soon" id="about-app-store-btn">
            <span className="store-btn-icon">
              <svg viewBox="0 0 384 512" width="20" height="22" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-74.3-19.7C63.1 141.2 4 184.8 4 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-62.1 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
              </svg>
            </span>
            <span className="store-btn-text">
              <span className="store-btn-label">COMING SOON ON</span>
              <span className="store-btn-name">App Store</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="about-footer">
        <div className="about-footer-inner">
          <span className="logo" style={{ fontSize: "1.4rem" }}>daur.</span>
          <div className="about-footer-links">
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/terms-of-service">Terms</Link>
            <a href="mailto:contact.daur@gmail.com">Contact</a>
          </div>
          <p className="about-footer-copy">© {new Date().getFullYear()} Daur. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
