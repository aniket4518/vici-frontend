"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import React from "react";
import Button from "./components/Button";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { waitlistEmailSchema } from "@/lib/validators/waitlist";
import phoneImage from "../public/phone.png";

export default function HomePage() {
  const ropeRef = useRef<SVGPathElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const blackCurtainRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const images = ["/1.png", "/2.png", "/3.png", "/4.png", "/5.png", "/6.png"];

  const people = [
    {
      id: 1,
      name: "John Doe",
      designation: "Runner",
      image:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
    },
    {
      id: 2,
      name: "Robert Johnson",
      designation: "Walker",
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 3,
      name: "Jane Smith",
      designation: "Explorer",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 4,
      name: "Emily Davis",
      designation: "Marathoner",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 5,
      name: "Tyler Durden",
      designation: "Sprinter",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
    },
    {
      id: 6,
      name: "Dora",
      designation: "Trail Runner",
      image:
        "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3534&q=80",
    },
  ];

  useEffect(() => {
    // Fetch waitlist count
    const fetchWaitlistCount = async () => {
      try {
        const response = await fetch("/api/waitlist/count");
        const data = await response.json();
        setWaitlistCount(data.count || 0);
      } catch (error) {
        console.error("Error fetching waitlist count:", error);
      }
    };

    fetchWaitlistCount();
  }, []);

  useEffect(() => {
    // Only run animation on client-side after mount
    if (!ropeRef.current || !contentRef.current || !blackCurtainRef.current) return;

    const rope = ropeRef.current;
    const content = contentRef.current;
    const curtain = blackCurtainRef.current;

    // Get the total length of the rope path for stroke animation
    const ropeLength = rope.getTotalLength();

    // Set initial state: hide the rope stroke
    gsap.set(rope, {
      strokeDasharray: ropeLength,
      strokeDashoffset: ropeLength,
    });

    // Set initial state: hide content
    gsap.set(content, {
      opacity: 0,
      y: 30,
    });

    // Create the main timeline
    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
    });

    // Animate black curtain sliding up to reveal the page
    tl.to(curtain, {
      y: "-100%",
      duration: 1.2,
      ease: "power2.inOut",
      onComplete: () => {
        curtain.style.pointerEvents = "none";
        curtain.style.visibility = "hidden";
      },
    });

    // Animate the rope: draw the stroke progressively
    // This creates the effect of the rope being dragged across the screen
    tl.to(
      rope,
      {
        strokeDashoffset: 0,
        duration: 2.5,
        ease: "power2.out",
      },
      0.3 // Start slightly before curtain finishes
    );

    // Add subtle organic motion to the rope while it's being drawn
    // This creates a slight wave/wiggle effect for realism
    tl.to(
      rope,
      {
        attr: {
          
          d: `
            M 0 800
            C 150 700, 250 600, 400 650
            S 600 750, 750 650
            S 900 500, 1100 600
            S 1300 700, 1500 550
          `,
        },
        duration: 1.5,
        ease: "sine.inOut",
        repeat: 1,
        yoyo: true,
      },
      0.8 // Start this animation 0.8s into the timeline
    );

    // Fade in the content, synced with the rope animation
    tl.to(
      content,
      {
        opacity: 1,
        y: 0,
        duration: 1,
      },
      1.8 // Start when rope is about halfway drawn
    );

    // Cleanup function
    return () => {
      tl.kill();
    };
  }, []);

  // Auto-slide effect with GSAP
  useEffect(() => {
    if (!sliderRef.current) return;

    const slider = sliderRef.current;
    const slideWidth = slider.scrollWidth / 2; // Half because we duplicate images

    // Animate from right to left continuously
    gsap.to(slider, {
      x: -slideWidth,
      duration:  30,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: (x) => `${parseFloat(x) % slideWidth}px`
      }
    });

    return () => {
      gsap.killTweensOf(slider);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    // Frontend Zod validation
    const result = waitlistEmailSchema.safeParse({ email });
    if (!result.success) {
      const messages = result.error.issues.map(issue => issue.message).join("; ");
      setError(messages || "Please input valid mail");
      return;
    }
    // Send to backend
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (response.status === 409) {
       
        return;
      }
      if (response.status === 400) {
        const data = await response.json();
        setError(data.error || "Please input valid mail");
        return;
      }
      if (!response.ok) {
        setError("Something went wrong. Please try again.");
        return;
      }
      setSuccess("Successfully joined waitlist!");
      setEmail("");
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="hero-container">
      {/* Black Curtain Overlay */}
      <div 
        ref={blackCurtainRef}
        className="fixed inset-0 z-50"
        style={{ backgroundColor: '#EAFF56', pointerEvents: 'none' }}
      />

      {/* Header */}
      <header className="header">
        <div className="logo ">daur.</div>
        <a href="/contact" className="contact-btn">Contact</a>
      </header>

      {/* SVG Rope Animation - Neon Green */}
      <svg
        className="rope-svg"
        viewBox="0 0 1400 900"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          ref={ropeRef}
          id="ropePath"
          d="
            M 0 800
            C 150 700, 250 600, 400 650
            S 600 750, 750 650
            S 900 500, 1100 600
            S 1300 700, 1500 550
          "
          
          fill="none"
          stroke="#EAFF56"
          strokeWidth="28"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Main Content */}
      <div ref={contentRef} className="main-content">
        <h1 className="font-bold text-5xl justify-center text-center" >
          Stride. Claim.
          <br/> 
           Conquer. 
        
          
        </h1>
        
        <p className="subtitle"> Stop tracking miles. Start ruling your neighborhood..</p>

 
      </div>
       

        {/* Store Buttons / Waitlist — both mounted, cross-faded for a smooth transition */}
        <div className="cta-stage">
          {/* Panel 1: store buttons */}
          <div
            className={`cta-panel store-panel${!showWaitlist ? " is-active" : ""}`}
            aria-hidden={showWaitlist}
            inert={showWaitlist ? true : undefined}
          >
            <div className="store-buttons">
              {/* Google Play Store */}
              <a
                href="https://play.google.com/store/apps/details?id=com.daur.daurapp"
                target="_blank"
                rel="noopener noreferrer"
                className="store-btn"
                id="google-play-btn"
              >
                <span className="store-btn-icon">
                  <svg viewBox="0 0 512 512" width="19" height="19" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                  </svg>
                </span>
                <span className="store-btn-text">
                  <span className="store-btn-label">GET IT ON</span>
                  <span className="store-btn-name">Google Play</span>
                </span>
              </a>

              {/* Apple App Store */}
              <button
                onClick={() => setShowWaitlist(true)}
                className="store-btn"
                id="app-store-btn"
              >
                <span className="store-btn-icon">
                  <svg viewBox="0 0 384 512" width="17" height="19" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-74.3-19.7C63.1 141.2 4 184.8 4 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-62.1 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                  </svg>
                </span>
                <span className="store-btn-text">
                  <span className="store-btn-label">COMING SOON ON</span>
                  <span className="store-btn-name">App Store</span>
                </span>
              </button>
            </div>
          </div>

          {/* Panel 2: iOS waitlist */}
          <div
            className={`cta-panel waitlist-panel${showWaitlist ? " is-active" : ""}`}
            aria-hidden={!showWaitlist}
            inert={!showWaitlist ? true : undefined}
          >
            <button
              onClick={() => setShowWaitlist(false)}
              className="back-to-stores"
            >
              ← Back
            </button>
            <p className="waitlist-note">
              We’ll notify you as soon as we’re live on iOS
            </p>
            <form className="email-form" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="email-input"
                required
              />
              <Button email={email} />
            </form>
            {success && <div className="waitlist-success">{success}</div>}
            <div className="social-proof">
              <div className="social-proof-avatars">
                <AnimatedTooltip items={people} />
              </div>
              <span className="join-text">Join +{waitlistCount} others</span>
            </div>
          </div>
        </div>

      {/* Phone Image - Center Bottom */}
      <div
        className={`phone-art${showWaitlist ? " is-waitlist" : ""} fixed left-1/2 transform -translate-x-1/2 z-[5] bottom-22 md:bottom-0`}
        style={{ pointerEvents: 'none' }}
      >
        <Image
          src={phoneImage}
          alt="Phone"
          width={280}
          height={200}
          className="object-contain relative top-55 "
        />
      </div>
     
      {/* Auto-scrolling Image Slider */}
      <div className="fixed w-full overflow-hidden z-0" style={{ bottom: '3rem', pointerEvents: 'none' }}>
        <div 
          ref={sliderRef}
          className="flex gap-30"
        >
          {/* First set of images */}
          <Image src="/1.png" alt="Image 1" width={80} height={80} className="flex-shrink-0 object-cover rounded-lg " />
          <Image src="/2.png" alt="Image 2" width={80} height={80} className="flex-shrink-0 object-cover rounded-lg " />
          <Image src="/3.png" alt="Image 3" width={80} height={80} className="flex-shrink-0 object-cover rounded-lg " />
          <Image src="/4.png" alt="Image 4" width={80} height={80} className="flex-shrink-0 object-cover rounded-lg" />
          <Image src="/5.png" alt="Image 5" width={80} height={80} className="flex-shrink-0 object-cover rounded-lg" />
          <Image src="/6.png" alt="Image 6" width={80} height={80} className="flex-shrink-0 object-cover rounded-lg" />
          {/* Duplicate set for seamless loop */}
          <Image src="/1.png" alt="Image 1" width={80} height={80} className="flex-shrink-0 object-cover rounded-lg" />
          <Image src="/2.png" alt="Image 2" width={80} height={80} className="flex-shrink-0 object-cover rounded-lg" />
          <Image src="/3.png" alt="Image 3" width={80} height={80} className="flex-shrink-0 object-cover rounded-lg" />
          <Image src="/4.png" alt="Image 4" width={80} height={80} className="flex-shrink-0 object-cover rounded-lg" />
          <Image src="/5.png" alt="Image 5" width={80} height={80} className="flex-shrink-0 object-cover rounded-lg" />
          <Image src="/6.png" alt="Image 6" width={80} height={80} className="flex-shrink-0 object-cover rounded-lg" />
        </div>
      </div>

      <div className="flex items-center justify-center">
     
    </div>



      {/* hii */}
    </div>
   
 
    
 

  );
}

// ...existing code...

/**
 * ROPE ANIMATION EXPLAINED:
 * 
 * 1. strokeDasharray & strokeDashoffset:
 *    - We set both to the path length initially to hide the stroke
 *    - Animating strokeDashoffset to 0 progressively reveals the line
 * 
 * 2. Organic Motion:
 *    - We animate the 'd' attribute (path data) slightly
 *    - Creates a subtle wave effect as the rope is "dragged"
 *    - yoyo: true makes it oscillate naturally
 * 
 * 3. Timeline Sequencing:
 *    - Rope draws first (2.5s)
 *    - Text fades in at 1.2s (synced with rope)
 *    - CTA appears at 1.8s
 * 
 * TWEAKING:
 * - Animation speed: Change duration values (2.5, 1.5, etc.)
 * - Rope path: Modify the 'd' attribute coordinates
 * - Easing: Change "power2.out" to other GSAP eases
 * - Timing: Adjust the offset values (1.2, 1.8) in timeline
 */
