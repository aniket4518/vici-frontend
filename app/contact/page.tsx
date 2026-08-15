"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";

export default function ContactPage() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

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

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    // Client-side Zod validation
    const { contactFormSchema } = await import("@/lib/validators/contact");
    const result = contactFormSchema.safeParse(formData);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message).join("; ");
      setErrorMsg(messages || "Please check your input.");
      setStatus("error");
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="contact-page">
      {/* ── Header ── */}
      <header className="header">
        <Link href="/" className="logo">daur.</Link>
        <nav className="about-nav">
          <Link href="/" className="contact-btn">Home</Link>
          <Link href="/about" className="contact-btn">About</Link>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="contact-hero" ref={(el) => addRef(el, 0)}>
        <span className="about-badge">CONTACT US</span>
        <h1 className="contact-hero-title">
          Get in Touch<br />with Us
        </h1>
        <p className="contact-hero-sub">
          Have questions about Daur or looking to collaborate? We&apos;re here
          to help! Reach out for any inquiries, feedback, or partnership opportunities.
        </p>
      </section>

      {/* ── Contact Info Cards ── */}
      <section className="contact-section" ref={(el) => addRef(el, 1)}>
        <div className="contact-info-grid">
          <div className="contact-info-card">
            <div className="contact-info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h3 className="contact-info-title">Email Us</h3>
            <p className="contact-info-detail">
              <a href="mailto:contact.daur@gmail.com">contact.daur@gmail.com</a>
            </p>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h3 className="contact-info-title">Location</h3>
            <p className="contact-info-detail">India</p>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3 className="contact-info-title">Response Time</h3>
            <p className="contact-info-detail">Within 24 hours</p>
          </div>
        </div>
      </section>

      {/* ── Form Section ── */}
      <section className="contact-section contact-form-section" ref={(el) => addRef(el, 2)}>
        <div className="contact-form-wrapper">
          <div className="contact-form-header">
            <h2 className="contact-form-title">
              Have Questions?<br />We&apos;re Just a Message Away!
            </h2>
            <p className="contact-form-subtitle">
              Fill out the form below, and one of our team members will get back
              to you shortly.
            </p>
          </div>

          <form className="contact-form" onSubmit={handleSubmit} id="contact-form">
            <div className="contact-form-row">
              <div className="contact-field">
                <label htmlFor="contact-firstName" className="contact-label">First Name</label>
                <input
                  id="contact-firstName"
                  name="firstName"
                  type="text"
                  placeholder="First name"
                  className="contact-input"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="contact-field">
                <label htmlFor="contact-lastName" className="contact-label">Last Name</label>
                <input
                  id="contact-lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last name"
                  className="contact-input"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="contact-form-row">
              <div className="contact-field">
                <label htmlFor="contact-email" className="contact-label">E-mail</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="you@gmail.com"
                  className="contact-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="contact-field">
                <label htmlFor="contact-phone" className="contact-label">Phone Number</label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 XXXXXXXXXX"
                  className="contact-input"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="contact-field">
              <label htmlFor="contact-subject" className="contact-label">Subject</label>
              <select
                id="contact-subject"
                name="subject"
                className="contact-input contact-select"
                value={formData.subject}
                onChange={handleChange}
              >
                <option value="">Choose message subject</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Partnership">Partnership</option>
                <option value="Press / Media">Press / Media</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="contact-field">
              <label htmlFor="contact-message" className="contact-label">Message</label>
              <textarea
                id="contact-message"
                name="message"
                placeholder="Leave us a message..."
                className="contact-input contact-textarea"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            {status === "error" && (
              <div className="contact-error">{errorMsg}</div>
            )}
            {status === "success" && (
              <div className="contact-success">
                Message sent! We&apos;ll get back to you soon.
              </div>
            )}

            <button
              type="submit"
              className="contact-submit-btn"
              id="contact-submit-btn"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Sending..." : "Send Message"}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="contact-submit-icon">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="about-footer">
        <div className="about-footer-inner">
          <span className="logo" style={{ fontSize: "1.4rem" }}>daur.</span>
          <div className="about-footer-links">
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/terms-of-service">Terms</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <p className="about-footer-copy">© {new Date().getFullYear()} Daur. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
