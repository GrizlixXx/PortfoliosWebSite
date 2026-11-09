"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";

type TargetCursorProps = {
  targetSelector?: string;
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  hoverDuration?: number;
  parallaxOn?: boolean;
  cursorColor?: string;
  cursorColorOnTarget?: string;
};

const getTransformParent = (element: HTMLElement | null) => {
  let node = element?.parentElement ?? null;
  while (node && node !== document.documentElement) {
    const style = getComputedStyle(node);
    if (
      style.transform !== "none" ||
      style.perspective !== "none" ||
      style.filter !== "none" ||
      style.willChange.includes("transform") ||
      style.willChange.includes("perspective") ||
      style.willChange.includes("filter") ||
      /paint|layout|strict|content/.test(style.contain)
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
};

const getOrigin = (element: HTMLElement | null) => {
  if (!element) return { x: 0, y: 0 };
  const rect = element.getBoundingClientRect();
  return { x: rect.left + element.clientLeft, y: rect.top + element.clientTop };
};

export default function TargetCursor({
  targetSelector = ".cursor-target",
  spinDuration = 3,
  hideDefaultCursor = true,
  hoverDuration = 0.25,
  parallaxOn = true,
  cursorColor = "#F4F1ED",
  cursorColorOnTarget = "#9C7CFF",
}: TargetCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<NodeListOf<HTMLElement> | null>(null);
  const spinRef = useRef<gsap.core.Timeline | null>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const narrow = window.innerWidth <= 768;
    const ua = navigator.userAgent || navigator.vendor || (window as Window & { opera?: string }).opera || "";
    const mobileUa = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua.toLowerCase());
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(finePointer && !reduceMotion && !((touch && narrow) || mobileUa));
  }, []);

  const constants = useMemo(() => ({ borderWidth: 3, cornerSize: 12 }), []);
  const activeTarget = useRef<Element | null>(null);
  const leaveCleanup = useRef<(() => void) | null>(null);
  const resumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickerActive = useRef(false);
  const cornerTargets = useRef<{ x: number; y: number }[] | null>(null);
  const strength = useRef({ current: 0 });
  const transformParent = useRef<HTMLElement | null>(null);
  const tickerFn = useRef<(() => void) | null>(null);

  const moveCursor = useCallback((x: number, y: number) => {
    if (!cursorRef.current) return;
    const origin = getOrigin(transformParent.current);
    gsap.to(cursorRef.current, {
      x: x - origin.x,
      y: y - origin.y,
      duration: 0.1,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    if (!enabled || !cursorRef.current) return;

    const previousCursor = document.body.style.cursor;
    if (hideDefaultCursor) document.body.style.cursor = "none";

    const cursor = cursorRef.current;
    cornersRef.current = cursor.querySelectorAll<HTMLElement>(".target-cursor-corner");
    transformParent.current = getTransformParent(cursor);

    const origin = getOrigin(transformParent.current);
    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2 - origin.x,
      y: window.innerHeight / 2 - origin.y,
    });

    spinRef.current?.kill();
    spinRef.current = gsap.timeline({ repeat: -1 }).to(cursor, {
      rotation: "+=360",
      duration: spinDuration,
      ease: "none",
    });

    tickerFn.current = () => {
      if (!cornerTargets.current || !cursorRef.current || !cornersRef.current) return;
      const amount = strength.current.current;
      if (amount === 0) return;

      const cursorX = Number(gsap.getProperty(cursorRef.current, "x"));
      const cursorY = Number(gsap.getProperty(cursorRef.current, "y"));

      Array.from(cornersRef.current).forEach((corner, index) => {
        const currentX = Number(gsap.getProperty(corner, "x"));
        const currentY = Number(gsap.getProperty(corner, "y"));
        const target = cornerTargets.current![index];
        const dx = target.x - cursorX;
        const dy = target.y - cursorY;
        const duration = amount >= 0.99 ? (parallaxOn ? 0.2 : 0) : 0.05;
        gsap.to(corner, {
          x: currentX + (dx - currentX) * amount,
          y: currentY + (dy - currentY) * amount,
          duration,
          ease: duration === 0 ? "none" : "power1.out",
          overwrite: "auto",
        });
      });
    };

    const onMove = (event: MouseEvent) => moveCursor(event.clientX, event.clientY);

    const onScroll = () => {
      if (!activeTarget.current || !cursorRef.current) return;
      const originPoint = getOrigin(transformParent.current);
      const x = Number(gsap.getProperty(cursorRef.current, "x")) + originPoint.x;
      const y = Number(gsap.getProperty(cursorRef.current, "y")) + originPoint.y;
      const under = document.elementFromPoint(x, y);
      if (!under || (under !== activeTarget.current && under.closest(targetSelector) !== activeTarget.current)) {
        leaveCleanup.current?.();
      }
    };

    const onDown = () => {
      if (dotRef.current) gsap.to(dotRef.current, { scale: 0.7, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 0.9, duration: 0.2 });
    };

    const onUp = () => {
      if (dotRef.current) gsap.to(dotRef.current, { scale: 1, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });
    };

    const resetCorners = () => {
      if (!cornersRef.current) return;
      const corners = Array.from(cornersRef.current);
      gsap.killTweensOf(corners, "x,y");
      const { cornerSize } = constants;
      const rest = [
        { x: -(1.5 * cornerSize), y: -(1.5 * cornerSize) },
        { x: 0.5 * cornerSize, y: -(1.5 * cornerSize) },
        { x: 0.5 * cornerSize, y: 0.5 * cornerSize },
        { x: -(1.5 * cornerSize), y: 0.5 * cornerSize },
      ];
      const tl = gsap.timeline();
      corners.forEach((corner, index) => {
        tl.to(corner, { x: rest[index].x, y: rest[index].y, duration: 0.3, ease: "power3.out" }, 0);
      });
    };

    const resumeSpin = () => {
      if (activeTarget.current || !cursorRef.current || !spinRef.current) return;
      const current = Number(gsap.getProperty(cursorRef.current, "rotation")) % 360;
      spinRef.current.kill();
      spinRef.current = gsap.timeline({ repeat: -1 }).to(cursorRef.current, {
        rotation: "+=360",
        duration: spinDuration,
        ease: "none",
      });
      gsap.to(cursorRef.current, {
        rotation: current + 360,
        duration: spinDuration * (1 - current / 360),
        ease: "none",
        onComplete: () => {
          spinRef.current?.restart();
        },
      });
    };

    const leaveTarget = (target: Element) => {
      if (tickerFn.current) gsap.ticker.remove(tickerFn.current);
      tickerActive.current = false;
      cornerTargets.current = null;
      gsap.set(strength.current, { current: 0, overwrite: true });
      activeTarget.current = null;

      if (cursorColorOnTarget && cornersRef.current) {
        gsap.to(Array.from(cornersRef.current), {
          borderColor: cursorColor,
          duration: 0.15,
          ease: "power2.out",
        });
        if (dotRef.current) {
          gsap.to(dotRef.current, { backgroundColor: cursorColor, duration: 0.15, ease: "power2.out" });
        }
      }

      resetCorners();

      if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
      resumeTimeout.current = setTimeout(() => {
        resumeSpin();
        resumeTimeout.current = null;
      }, 50);

      target.removeEventListener("mouseleave", leaveTargetBound);
      leaveCleanup.current = null;
    };

    const leaveTargetBound = () => {
      if (activeTarget.current) leaveTarget(activeTarget.current);
    };

    const onOver = (event: MouseEvent) => {
      const path: Element[] = [];
      let node = event.target as Element | null;
      while (node && node !== document.body) {
        if (node.matches?.(targetSelector)) path.push(node);
        node = node.parentElement;
      }
      const target = path[0] || null;
      if (!target || !cursorRef.current || !cornersRef.current || activeTarget.current === target) return;

      if (activeTarget.current) leaveTarget(activeTarget.current);
      if (resumeTimeout.current) {
        clearTimeout(resumeTimeout.current);
        resumeTimeout.current = null;
      }

      activeTarget.current = target;
      const corners = Array.from(cornersRef.current);
      corners.forEach((corner) => gsap.killTweensOf(corner, "x,y"));
      gsap.killTweensOf(cursorRef.current, "rotation");
      spinRef.current?.pause();
      gsap.set(cursorRef.current, { rotation: 0 });

      if (cursorColorOnTarget) {
        gsap.to(corners, { borderColor: cursorColorOnTarget, duration: 0.15, ease: "power2.out" });
        if (dotRef.current) {
          gsap.to(dotRef.current, {
            backgroundColor: cursorColorOnTarget,
            duration: 0.15,
            ease: "power2.out",
          });
        }
      }

      const rect = target.getBoundingClientRect();
      const { borderWidth, cornerSize } = constants;
      const originPoint = getOrigin(transformParent.current);
      const cursorX = Number(gsap.getProperty(cursorRef.current, "x"));
      const cursorY = Number(gsap.getProperty(cursorRef.current, "y"));

      cornerTargets.current = [
        { x: rect.left - borderWidth - originPoint.x, y: rect.top - borderWidth - originPoint.y },
        { x: rect.right + borderWidth - cornerSize - originPoint.x, y: rect.top - borderWidth - originPoint.y },
        {
          x: rect.right + borderWidth - cornerSize - originPoint.x,
          y: rect.bottom + borderWidth - cornerSize - originPoint.y,
        },
        { x: rect.left - borderWidth - originPoint.x, y: rect.bottom + borderWidth - cornerSize - originPoint.y },
      ];

      tickerActive.current = true;
      if (tickerFn.current) gsap.ticker.add(tickerFn.current);
      gsap.to(strength.current, { current: 1, duration: hoverDuration, ease: "power2.out" });

      corners.forEach((corner, index) => {
        gsap.to(corner, {
          x: cornerTargets.current![index].x - cursorX,
          y: cornerTargets.current![index].y - cursorY,
          duration: 0.2,
          ease: "power2.out",
        });
      });

      leaveCleanup.current = () => leaveTarget(target);
      target.addEventListener("mouseleave", leaveTargetBound);
    };

    const onResize = () => {
      transformParent.current = getTransformParent(cursor);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      if (tickerFn.current) gsap.ticker.remove(tickerFn.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      if (activeTarget.current) activeTarget.current.removeEventListener("mouseleave", leaveTargetBound);
      spinRef.current?.kill();
      document.body.style.cursor = previousCursor;
      tickerActive.current = false;
      cornerTargets.current = null;
      strength.current.current = 0;
      if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    };
  }, [
    constants,
    cursorColor,
    cursorColorOnTarget,
    hideDefaultCursor,
    hoverDuration,
    enabled,
    moveCursor,
    parallaxOn,
    spinDuration,
    targetSelector,
  ]);

  useEffect(() => {
    if (!enabled || !cursorRef.current || !spinRef.current?.isActive()) return;
    spinRef.current.kill();
    spinRef.current = gsap.timeline({ repeat: -1 }).to(cursorRef.current, {
      rotation: "+=360",
      duration: spinDuration,
      ease: "none",
    });
  }, [enabled, spinDuration]);

  if (!enabled) return null;

  return createPortal(
    <div
      ref={cursorRef}
      className="target-cursor-root"
      aria-hidden="true"
      style={{ willChange: "transform" }}
    >
      <div
        ref={dotRef}
        className="target-cursor-dot"
        style={{ willChange: "transform", backgroundColor: cursorColor }}
      />
      <div
        className="target-cursor-corner corner-tl"
        style={{ willChange: "transform", borderColor: cursorColor }}
      />
      <div
        className="target-cursor-corner corner-tr"
        style={{ willChange: "transform", borderColor: cursorColor }}
      />
      <div
        className="target-cursor-corner corner-br"
        style={{ willChange: "transform", borderColor: cursorColor }}
      />
      <div
        className="target-cursor-corner corner-bl"
        style={{ willChange: "transform", borderColor: cursorColor }}
      />
    </div>,
    document.body,
  );
}