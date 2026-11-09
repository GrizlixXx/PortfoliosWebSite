"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/portfolio";

type ProjectCarouselProps = {
  activeProject: number | null;
  onOpenProject: (index: number) => void;
};

const DRAG_THRESHOLD = 10;

export default function ProjectCarousel({ activeProject, onOpenProject }: ProjectCarouselProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [inView, setInView] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hoverRef = useRef(false);
  const dragState = useRef({
    pointerId: -1,
    startX: 0,
    startScroll: 0,
    dragging: false,
  });

  const getEdgePad = useCallback((carousel: HTMLDivElement) => {
    const value = getComputedStyle(carousel).scrollPaddingLeft || "0";
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }, []);

  const scrollToSlide = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const card = cardRefs.current[index];
      const carousel = carouselRef.current;
      if (!card || !carousel) return;

      const pad = getEdgePad(carousel);
      const cardRect = card.getBoundingClientRect();
      const carouselRect = carousel.getBoundingClientRect();
      const nextLeft = carousel.scrollLeft + (cardRect.left - carouselRect.left) - pad;

      carousel.scrollTo({ left: Math.max(0, nextLeft), behavior });
      setActiveSlide(index);
    },
    [getEdgePad],
  );

  const syncActiveFromScroll = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel || dragState.current.dragging) return;

    const pad = getEdgePad(carousel);
    const focusX = carousel.getBoundingClientRect().left + pad + Math.min(carousel.clientWidth * 0.2, 120);
    let nearest = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const distance = Math.abs(rect.left - focusX);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = index;
      }
    });

    setActiveSlide((current) => (current === nearest ? current : nearest));
  }, [getEdgePad]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.scrollLeft = 0;
    setActiveSlide(0);

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(syncActiveFromScroll);
    };

    carousel.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      carousel.removeEventListener("scroll", onScroll);
    };
  }, [syncActiveFromScroll]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { root: null, rootMargin: "80px 0px", threshold: 0.12 },
    );

    observer.observe(carousel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || paused || dragging || activeProject !== null) return;

    const timer = window.setInterval(() => {
      const next = (activeSlide + 1) % projects.length;
      scrollToSlide(next);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [activeProject, activeSlide, dragging, inView, paused, scrollToSlide]);

  const resumeIfIdle = () => {
    if (!hoverRef.current && !dragState.current.dragging && activeProject === null) {
      setPaused(false);
    }
  };

  const finishPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = dragState.current;
    if (state.pointerId !== event.pointerId) return;

    const wasDragging = state.dragging;
    const carousel = carouselRef.current;

    if (carousel && state.pointerId !== -1) {
      try {
        carousel.releasePointerCapture(event.pointerId);
      } catch {
        /* ignore */
      }
      carousel.classList.remove("is-dragging");
    }

    state.pointerId = -1;
    state.dragging = false;
    setDragging(false);

    if (wasDragging) {
      window.setTimeout(syncActiveFromScroll, 40);
    }

    resumeIfIdle();
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    if (event.button !== 0) return;

    const carousel = carouselRef.current;
    if (!carousel) return;

    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: carousel.scrollLeft,
      dragging: false,
    };
    setPaused(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = dragState.current;
    if (state.pointerId !== event.pointerId) return;

    const carousel = carouselRef.current;
    if (!carousel) return;

    const delta = event.clientX - state.startX;

    if (!state.dragging) {
      if (Math.abs(delta) < DRAG_THRESHOLD) return;
      state.dragging = true;
      setDragging(true);
      carousel.classList.add("is-dragging");
      carousel.setPointerCapture(event.pointerId);
    }

    event.preventDefault();
    carousel.scrollLeft = state.startScroll - delta;
  };

  const openProject = (index: number) => {
    if (dragState.current.dragging) return;
    setActiveSlide(index);
    onOpenProject(index);
  };

  return (
    <>
      <div
        className={`project-carousel ${dragging ? "is-dragging" : ""}`}
        ref={carouselRef}
        onMouseEnter={() => {
          hoverRef.current = true;
          setPaused(true);
        }}
        onMouseLeave={() => {
          hoverRef.current = false;
          if (!dragState.current.dragging) setPaused(false);
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishPointer}
        onPointerCancel={finishPointer}
        onTouchStart={() => {
          hoverRef.current = true;
          setPaused(true);
        }}
        onTouchEnd={() => {
          hoverRef.current = false;
          window.setTimeout(() => {
            syncActiveFromScroll();
            resumeIfIdle();
          }, 140);
        }}
      >
        <div className={`project-track ${inView ? "is-in-view" : ""}`}>
          {projects.map((project, index) => (
            <motion.button
              className={`project-card cursor-target accent-${project.accent} shape-${project.shape} ${activeSlide === index ? "is-active" : ""}`}
              key={project.title}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              type="button"
              data-cursor-label="Open"
              onClick={() => openProject(index)}
              whileHover={dragging ? undefined : { y: -8 }}
            >
              <span className="project-number">{project.number}</span>
              <span className="project-category">{project.category}</span>
              <span className="project-art">
                <span className={`art-shape shape-${project.shape}`} />
                <span className="art-grid" />
              </span>
              <span className="project-card-footer">
                <strong>{project.title}</strong>
                <ArrowUpRight size={18} />
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="carousel-controls">
        <div className="carousel-dots">
          {projects.map((project, index) => (
            <button
              key={project.title}
              type="button"
              className={`cursor-target ${index === activeSlide ? "active" : ""}`}
              onClick={() => {
                setPaused(true);
                scrollToSlide(index);
                window.setTimeout(resumeIfIdle, 2200);
              }}
              aria-label={`Show ${project.title}`}
            />
          ))}
        </div>
        <span className="carousel-hint">
          <span className="hint-desktop">Hover to pause · Drag to swipe · Click to open</span>
          <span className="hint-mobile">Swipe to browse · Tap to open</span>
        </span>
      </div>
    </>
  );
}
