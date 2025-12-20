"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import React from "react";
import Button from "./components/Button";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
export default function Home() {
  const ropeRef = useRef<SVGPathElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const blackCurtainRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [waitlistCount, setWaitlistCount] = useState(0);
  const images = ["/1.png", "/2.png", "/3.png", "/4.png", "/5.png", "/6.png"];
  
  const people = [
    {
      id: 1,
      
      designation: "Runner",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
    },
    {
      id: 2,
    
      designation: "Walker",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    {
      id: 3,
       
      designation: "Explorer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
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
          // Subtle y-axis variation for organic feel
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    // Add your waitlist submission logic here
  };

  return (
    <div className="hero-container">
      {/* Black Curtain Overlay */}
      <div 
        ref={blackCurtainRef}
        className="fixed inset-0 z-50"
        style={{ backgroundColor: '#EAFF56' }}
      />

      {/* Header */}
      <header className="header">
        <div className="logo ">vici.</div>
        <button className="contact-btn">Contact</button>
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
       

        {/* Email Form */}
        <form className="email-form" onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 10 }}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="email-input"
            style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto' }}
            required
          />
          <Button email={email} />
        </form>
         <div className="social-proof scale-75 md:scale-100" style={{ position: 'relative', zIndex: 1 }}>
          <div className="flex items-center justify-center">
            <AnimatedTooltip items={people} />
          </div>
          <span className="join-text">Join +{waitlistCount} others</span>
        </div>
      
      {/* Phone Image - Center Bottom */}
      <div className="fixed left-1/2 transform -translate-x-1/2 z-[5] bottom-28 md:bottom-0" style={{ pointerEvents: 'none' }}>
        <Image
          src="/phone.png"
          alt="Phone"
          width={280}
          height={200}
          className="object-contain relative top-67 "
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

      {/* Footer */}
      <footer className="footer">© vici 2025</footer>
      <div className="flex items-center justify-center">
     
    </div>



      {/* hii */}
    </div>
   
 
    
 

  );

}

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
