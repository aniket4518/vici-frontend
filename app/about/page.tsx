"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import Link from "next/link";
import StoreButtons from "@/app/components/StoreButtons";

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
      desc: "Download from the App Store or Play Store, create your profile, and hit the map. Your city is already divided into hex zones waiting to be conquered.",
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
          <Link href="/contact" className="contact-btn">Contact</Link>
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
        <StoreButtons
          className="about-store-buttons"
          playStoreId="about-google-play-btn"
          appStoreId="about-app-store-btn"
        />
      </section>

      {/* ── Footer ── */}
      <footer className="about-footer">
        <div className="about-footer-inner">
          <span className="logo" style={{ fontSize: "1.4rem" }}>daur.</span>
          <div className="about-footer-links">
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/terms-of-service">Terms</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <p className="about-footer-copy">© {new Date().getFullYear()} Daur. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
