"use client";

import { useEffect, useState } from "react";

let PLAYED = false;

export default function Preloader() {
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (PLAYED) {
      setGone(true);
      return;
    }
    document.body.style.overflow = "hidden";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t1 = setTimeout(() => setDone(true), reduce ? 0 : 1500);
    const t2 = setTimeout(() => {
      PLAYED = true;
      setGone(true);
      document.body.style.overflow = "";
    }, reduce ? 40 : 2300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  return (
    <div className={`preloader ${done ? "done" : ""}`} aria-hidden="true">
      <div className="text-center px-6">
        <div className="overflow-hidden">
          <div className="clip-up">
            <span className="font-serif text-cream text-4xl md:text-6xl font-semibold tracking-tight">
              Barakat <span className="text-terracotta">Collections</span>
            </span>
          </div>
        </div>
        <div className="overflow-hidden mt-2">
          <p className="clip-up label text-cream/60" style={{ animationDelay: "160ms" }}>
            Handcrafted Living
          </p>
        </div>
      </div>
      <div className="preloader__bar" />
    </div>
  );
}
