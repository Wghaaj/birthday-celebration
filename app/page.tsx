"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Cormorant_Garamond, Playfair_Display, Montserrat } from "next/font/google";

/**
 * Soso's 25th Birthday — invitation
 * Next.js App Router page (app/page.tsx). Assumes a standard
 * `create-next-app --tailwind` project — no extra Tailwind config needed.
 */

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-playfair",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-montserrat",
});

const INK = "#7a2530";
const CREAM = "#efe7d8";

const WISHLIST_URL =
  "https://wishlist-88d58.web.app/ou88vJSMLwVHeLhOXYqY9xeuEC53/wcXPhhDb6NBI10hfbtfq/bcd5c8ea-94ab-4031-80ad-986e120eccbb";

function Sparkle({
  className = "",
  size = 18,
  delay = "0s",
}: {
  className?: string;
  size?: number;
  delay?: string;
}) {
  return (
    <svg
      className={`absolute text-[${INK}] opacity-0 ${className}`}
      style={{
        animation: `popIn 900ms ease forwards ${delay}, twinkle 3.6s ease-in-out infinite ${delay}`,
        color: INK,
      }}
      width={size}
      height={size}
      viewBox="0 0 24 24"
    >
      <path fill="currentColor" d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
    </svg>
  );
}

function CocktailIllustration() {
  return (
    <svg
      viewBox="0 0 200 220"
      width="100%"
      height="100%"
      fill="none"
      stroke={INK}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* garnish sprig */}
      <path d="M118 22 C126 12 140 10 148 16 C142 24 128 28 118 22 Z" />
      <path d="M124 26 L112 46" />

      {/* glass bowl */}
      <path d="M40 58 L100 138 L160 58" />
      <ellipse cx="100" cy="58" rx="60" ry="11" />
      <path d="M58 61 C74 67 126 67 142 61" opacity="0.45" strokeWidth="1.8" />
      <circle cx="64" cy="63" r="3.5" />

      {/* stem + foot */}
      <line x1="100" y1="138" x2="100" y2="178" />
      <ellipse cx="100" cy="180" rx="16" ry="3.5" />

      {/* citrus wedge, sitting beside the base */}
      <g transform="translate(78,206)">
        <path d="M-30 0 A30 30 0 0 1 30 0 Z" />
        <path d="M-22 0 A22 22 0 0 1 22 0 Z" opacity="0.5" strokeWidth="1.6" />
        <path d="M0 0 L0 -28 M0 0 L-19 -13 M0 0 L19 -13 M0 0 L-26 6 M0 0 L26 6" opacity="0.5" strokeWidth="1.4" />
      </g>
    </svg>
  );
}

function DetailRow({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3.5 items-start text-left max-w-[380px]">
      <span
        className="font-[var(--font-playfair)] text-[1.05rem] leading-relaxed min-w-[1.4rem]"
        style={{ color: INK }}
      >
        {n}
      </span>
      <p className="text-[1.05rem] leading-snug">{children}</p>
    </div>
  );
}

export default function BirthdayInvitePage() {
  const [revealed, setRevealed] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const noBtnRef = useRef<HTMLButtonElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const maxOffset = 70;
  const dodgeRadius = 95;

  const applyOffset = useCallback(() => {
    const el = noBtnRef.current;
    if (!el) return;
    el.style.transform = `translate(${offsetRef.current.x}px, ${offsetRef.current.y}px)`;
  }, []);

  const dodgeFrom = useCallback(
    (clientX: number, clientY: number, forced = false) => {
      const el = noBtnRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = cx - clientX;
      const dy = cy - clientY;
      const dist = Math.hypot(dx, dy);

      if (forced || dist < dodgeRadius) {
        const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * (forced ? 1.2 : 0.6);
        const strength = forced ? 1 : (dodgeRadius - dist) / dodgeRadius;
        let nx = offsetRef.current.x + Math.cos(angle) * strength * 60;
        let ny = offsetRef.current.y + Math.sin(angle) * strength * 60;
        nx = Math.max(-maxOffset, Math.min(maxOffset, nx));
        ny = Math.max(-maxOffset, Math.min(maxOffset, ny));
        offsetRef.current = { x: nx, y: ny };
        applyOffset();
      }
    },
    [applyOffset]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => dodgeFrom(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) dodgeFrom(t.clientX, t.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [dodgeFrom]);

  const handleNoTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const t = e.touches[0];
    if (t) dodgeFrom(t.clientX, t.clientY, true);
  };

  const handleYes = () => {
    setLeaving(true);
    setTimeout(() => setRevealed(true), 500);
  };

  return (
    <div
      className={`${cormorant.variable} ${playfair.variable} ${montserrat.variable} flex items-center justify-center p-5`}
      style={{
        background: CREAM,
        fontFamily: "var(--font-cormorant), serif",
        color: INK,
        minHeight: "100dvh",
      }}
    >
      <style jsx global>{`
        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-up {
          opacity: 0;
          transform: translateY(14px);
          animation-name: fadeUp;
          animation-duration: 800ms;
          animation-timing-function: cubic-bezier(0.2, 0.7, 0.2, 1);
          animation-fill-mode: forwards;
        }
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.4) rotate(-10deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.85;
            transform: scale(1);
          }
          50% {
            opacity: 0.35;
            transform: scale(0.82);
          }
        }
        @keyframes panelIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .panel-enter {
          animation: panelIn 700ms cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
        }
        .btn-yes:hover {
          background: ${INK};
          color: ${CREAM};
          box-shadow: 0 6px 18px rgba(122, 37, 48, 0.25);
        }
        .btn-yes:active {
          transform: scale(0.96);
        }
      `}</style>

      <div
        className="relative w-full max-w-[560px] p-2.5"
        style={{ height: "min(92vh, 900px)", border: `1.5px solid ${INK}`, borderRadius: "220px 220px 18px 18px" }}
      >
        <div
          className="absolute inset-2.5 pointer-events-none"
          style={{ border: `1.5px solid ${INK}`, borderRadius: "200px 200px 10px 10px" }}
        />
        <div
          className="absolute inset-[26px] overflow-y-auto overflow-x-hidden"
          style={{ borderRadius: "190px 190px 4px 4px" }}
        >
          {/* ===================== PAGE 1 : INVITE ===================== */}
          {!revealed && (
            <div
              className="absolute inset-0 flex flex-col items-center text-center px-6 pt-10 pb-7"
              style={{
                transition: "transform 900ms cubic-bezier(.65,0,.35,1), opacity 700ms ease",
                transform: leaving ? "translateY(-40px) scale(0.96)" : "translateY(0) scale(1)",
                opacity: leaving ? 0 : 1,
                pointerEvents: leaving ? "none" : "auto",
              }}
            >
              <p
                className="fade-up text-[0.68rem] font-semibold tracking-[0.08em]"
                style={{ fontFamily: "var(--font-montserrat), sans-serif", animationDelay: "80ms" }}
              >
                SAVE&nbsp; THE&nbsp; DATE
              </p>

              <div className="relative w-full h-14 mt-1.5">
                <Sparkle className="left-[30%] top-1.5" size={20} delay="250ms" />
                <Sparkle className="left-[47%] -top-1.5" size={34} delay="400ms" />
                <Sparkle className="left-[66%] top-2.5" size={16} delay="550ms" />
              </div>

              <h1
                className="fade-up leading-[1.05] mt-2.5"
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontWeight: 600,
                  fontSize: "clamp(1.9rem,7vw,2.6rem)",
                  animationDelay: "300ms",
                }}
              >
                You&apos;re invited
                <br />
                to my
              </h1>
              <h1
                className="fade-up leading-none mt-1"
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontWeight: 700,
                  fontSize: "clamp(2.4rem,9vw,3.3rem)",
                  color: INK,
                  animationDelay: "420ms",
                }}
              >
                Birthday
                <br />
                Celebration
              </h1>

              <div
                className="fade-up w-[46px] h-[1.5px] my-4"
                style={{ background: INK, opacity: 0.6, animationDelay: "560ms" }}
              />

              <div className="fade-up relative w-[180px] h-[190px] mx-auto my-1" style={{ animationDelay: "620ms" }}>
                <CocktailIllustration />
              </div>

              <p
                className="fade-up mt-2.5"
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontWeight: 600,
                  fontSize: "1.05rem",
                  letterSpacing: "0.02em",
                  animationDelay: "760ms",
                }}
              >
                So, will you come?
              </p>

              <div
                className="fade-up mt-auto pt-6 flex gap-4 items-center relative w-full justify-center"
                style={{ animationDelay: "900ms" }}
              >
                <button
                  onClick={handleYes}
                  className="btn-yes rounded-full px-8 py-3.5 text-[0.8rem] font-bold tracking-[0.1em] cursor-pointer select-none"
                  style={{
                    fontFamily: "var(--font-montserrat), sans-serif",
                    border: `1.5px solid ${INK}`,
                    background: "transparent",
                    color: INK,
                    transition: "background 220ms ease, color 220ms ease, transform 90ms ease, box-shadow 220ms ease",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  YES
                </button>
                <button
                  ref={noBtnRef}
                  onTouchStart={handleNoTouchStart}
                  onMouseEnter={() => {
                    const el = noBtnRef.current;
                    if (!el) return;
                    const r = el.getBoundingClientRect();
                    dodgeFrom(r.left + 10, r.top + 10, true);
                  }}
                  onClick={(e) => e.preventDefault()}
                  className="rounded-full px-8 py-3.5 text-[0.8rem] font-bold tracking-[0.1em] cursor-pointer select-none"
                  style={{
                    fontFamily: "var(--font-montserrat), sans-serif",
                    border: `1.5px solid ${INK}`,
                    background: "transparent",
                    color: INK,
                    transition: "transform 160ms cubic-bezier(.2,.9,.3,1.2)",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  no
                </button>
              </div>
            </div>
          )}

          {/* ===================== PAGE 2 : DETAILS ===================== */}
          {revealed && (
            <div className="panel-enter absolute inset-0 flex flex-col items-center text-center px-6 pt-10 pb-7">
              <svg width="26" height="26" viewBox="0 0 24 24" className="mt-0.5" style={{ color: INK }}>
                <path fill="currentColor" d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" />
              </svg>

              <h2
                className="mt-2"
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.7rem,6.5vw,2.2rem)",
                  color: INK,
                }}
              >
                See you there!
              </h2>
              <p
                className="mt-1.5 text-[0.68rem] font-semibold tracking-[0.08em]"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                29TH&nbsp; JULY
              </p>

              <div className="w-[46px] h-[1.5px] my-4" style={{ background: INK, opacity: 0.6 }} />

              <div className="flex flex-col gap-4 w-full items-center">
                <DetailRow n="01">
                  <b style={{ color: INK }}>Bowling at 16:30</b> — please arrive no later than <b>16:15</b>. <br /> <b style={{ color: INK }}>Location: </b> Tenpin Glasgow — PA4 8XQ.
                </DetailRow>
                <DetailRow n="02">
                  <b style={{ color: INK }}>Outfit:</b> casual for bowling — but bring something to change into.
                </DetailRow>
                <DetailRow n="03">
                  After, we head to a <b style={{ color: INK }}>bar</b> — wear something nice for that part.
                </DetailRow>
              </div>

              <div className="mt-auto pt-6 flex flex-col items-center gap-2">
                <p
                  className="text-[0.65rem] font-semibold tracking-[0.08em] opacity-75"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  A LITTLE GIFT IDEA
                </p>
                <a
                  href={WISHLIST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full px-6 py-2.5 text-[0.72rem] font-semibold tracking-[0.08em] no-underline inline-block hover:opacity-90 transition-opacity"
                  style={{
                    fontFamily: "var(--font-montserrat), sans-serif",
                    border: `1.5px solid ${INK}`,
                    color: CREAM,
                    background: INK,
                  }}
                >
                  MY WISHLIST
                </a>
              </div>
            </div>
          )}
        </div>

        <Sparkle className="-left-3.5 top-[38%]" size={22} delay="1s" />
        <Sparkle className="-right-2.5 top-[30%]" size={16} delay="1.2s" />
        <Sparkle className="right-[6%] bottom-[9%]" size={18} delay="1.4s" />
        <Sparkle className="left-[6%] bottom-[11%]" size={14} delay="1.6s" />
      </div>
    </div>
  );
}