"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink, Github, Menu, X } from "lucide-react";
import ProjectCarousel from "@/components/ProjectCarousel";
import TargetCursor from "@/components/TargetCursor";
import {
  navItems,
  principles,
  processSteps,
  projects,
  site,
  socialLinks,
  stats,
  techStackRows,
  ticker,
} from "@/data/portfolio";

type GalleryPage = {
  label: string;
  images: string[];
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

function useLocalTime(timezoneLabel: string) {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const format = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("uk-UA", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(now);
      setTime(`${formatted} ${timezoneLabel}`);
    };
    format();
    const id = window.setInterval(format, 30_000);
    return () => window.clearInterval(id);
  }, [timezoneLabel]);

  return time;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [activeGalleryPage, setActiveGalleryPage] = useState(0);
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const [projectGalleries, setProjectGalleries] = useState<Record<number, GalleryPage[]>>({});
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const localTime = useLocalTime(site.timezone);

  useEffect(() => {
    Promise.all(
      projects.map(async (project, index) => {
        const response = await fetch(`/api/project-images/${project.slug}`);
        if (!response.ok) throw new Error(`Image list request failed with ${response.status}`);
        return [index, (await response.json()) as GalleryPage[]] as const;
      }),
    )
      .then((galleries) => setProjectGalleries(Object.fromEntries(galleries)))
      .catch((error: unknown) => console.error("Unable to load project images.", error));
  }, []);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    if (activeProject === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (activeImage !== null) {
          setActiveImage(null);
        } else {
          setActiveProject(null);
        }
      } else if (activeImage !== null && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
        const images = projectGalleries[activeProject]?.flatMap((page) => page.images) ?? [];
        const direction = event.key === "ArrowRight" ? 1 : -1;
        setActiveImage((activeImage + direction + images.length) % images.length);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [activeImage, activeProject]);

  return (
    <main>
      <TargetCursor
        targetSelector=".cursor-target"
        spinDuration={3}
        hideDefaultCursor
        parallaxOn
        hoverDuration={0.25}
        cursorColor="#F4F1ED"
        cursorColorOnTarget="#9C7CFF"
      />

      <header className={`site-header ${navScrolled || menuOpen ? "is-scrolled" : ""}`}>


        <div className="top-meta">
          <span>
            {site.location} · {localTime}
          </span>
          <span className="top-meta-status">
            <i className="status-dot" /> {site.availability}
          </span>
        </div>

        <nav className="nav-shell">
          <a className="brand cursor-target" href="#top" aria-label={`${site.name} home`} data-cursor-label="Home">
            <span className="brand-avatar">{site.shortName}</span>
            <span className="brand-name">{site.name}</span>
          </a>
          <div className={`nav-links ${menuOpen ? "is-open" : ""}`}>
            {navItems.map((item) => (
              <a className="cursor-target" href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
          </div>
          <a className="nav-cta cursor-target" href={`mailto:${site.email}`} data-cursor-label="Email">
            Let&apos;s talk <ArrowUpRight size={14} />
          </a>
          <button
            className="menu-button cursor-target"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </nav>
      </header>

      <section className="hero section-grid" id="top">
        <div className="hero-copy">
          <motion.p className="eyebrow" initial="hidden" animate="visible" variants={fadeUp}>
            01 · Intro
          </motion.p>
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp}>
            {site.name.split(" ")[0]} <em>{site.name.split(" ").slice(1).join(" ")}</em>
          </motion.h1>
          <motion.div className="hero-role" initial="hidden" animate="visible" variants={fadeUp}>
            <span className="line" /> {site.role}
          </motion.div>
          <motion.p className="hero-description" initial="hidden" animate="visible" variants={fadeUp}>
            {site.tagline}
          </motion.p>
          <motion.div className="hero-actions" initial="hidden" animate="visible" variants={fadeUp}>
            <a className="button button-primary cursor-target" href="#work" data-cursor-label="Work">
              Explore my work <ArrowDownRight size={17} />
            </a>
            <a className="text-link cursor-target" href={`mailto:${site.email}`}>
              Let&apos;s talk <ArrowUpRight size={16} />
            </a>
            <a className="resume-link cursor-target" href="#about">
              About me <ArrowUpRight size={14} />
            </a>
          </motion.div>
        </div>

        <div className="hero-panel" aria-hidden="true">
          <div className="hero-panel-glow" />
          <div className="hero-panel-frame">
            <span className="hero-panel-kicker">Focus</span>
            <strong>Full-stack web development</strong>
            <p>React interfaces, Node.js APIs, and database solutions built with performance and clarity in mind.</p>
            <div className="hero-panel-meta">
              <span>{site.location}</span>
              <span>{localTime}</span>
            </div>
          </div>
          <div className="hero-orbit">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit-core">
              <span>{site.shortName}</span>
            </div>
          </div>
        </div>

        <div className="hero-socials">
          {socialLinks.map((link) => (
            <a
              className="cursor-target"
              href={link.href}
              key={link.label}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              aria-label={link.label}
            >
              {link.short}
            </a>
          ))}
        </div>
        <div className="scroll-cue">
          <span /> Scroll to explore
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...ticker, ...ticker].map((item, index) => (
            <span key={`${item}-${index}`}>
              {item} <i>·</i>
            </span>
          ))}
        </div>
      </div>

      <section className="about-section page-section" id="about">
        <div className="section-heading">
          <div>
            <p className="eyebrow">02 · Who I am</p>
            <h2>
              A developer with a bias for <em>clarity.</em>
            </h2>
          </div>
          <p className="section-intro">{site.about}</p>
        </div>
        <div className="stats-row">
          {stats.map((stat) => (
            <div className="stat-item" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
        <div className="principles-grid">
          {principles.map((item) => (
            <motion.article
              className="principle-card"
              key={item.number}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
            >
              <span className="principle-number">{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="work-section page-section" id="work">
        <div className="section-heading">
          <div>
            <p className="eyebrow">03 · Selected work</p>
            <h2>
              Things I&apos;ve <em>built.</em>
            </h2>
          </div>
          <p className="section-intro">Selected team and individual projects built with React, TypeScript, Node.js, and SQL databases.</p>
        </div>
        <ProjectCarousel
          activeProject={activeProject}
          onOpenProject={(index) => {
            setActiveGalleryPage(0);
            setActiveImage(null);
            setActiveProject(index);
          }}
        />
      </section>

      <section className="stack-section page-section" id="stack">
        <div className="stack-heading">
          <p className="eyebrow">04 · My toolkit</p>
          <h2>Tech Stack</h2>
          <p className="section-intro stack-intro">
            The technologies and tools I use across frontend, backend, databases, and everyday development.
          </p>
        </div>
        <div className="tech-funnel" aria-label="Technology stack">
          <div className="tech-funnel-grid" aria-hidden="true" />
          <div className="tech-funnel-plane">
            {techStackRows.map((row, rowIndex) => (
              <div className="tech-funnel-row" key={`row-${rowIndex}`} style={{ ["--row" as string]: rowIndex }}>
                {row.map((tech, techIndex) => (
                  <motion.div
                    className="tech-glass cursor-target"
                    key={tech.name}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -6 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      delay: rowIndex * 0.05 + techIndex * 0.025,
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={tech.icon} alt="" aria-hidden="true" />
                    <span>{tech.name}</span>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="process-section page-section" id="process">
        <div className="section-heading">
          <div>
            <p className="eyebrow">05 · The process</p>
            <h2>
              From idea to <em>delivery.</em>
            </h2>
          </div>
          <p className="section-intro">I combine clear requirements, maintainable code, and practical performance improvements to deliver dependable products.</p>
        </div>
        <div className="process-list">
          {processSteps.map(([number, title, copy]) => (
            <motion.div
              className="process-item cursor-target"
              key={number}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <span className="process-number">{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <ArrowUpRight size={20} />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="contact-section page-section" id="contact">
        <p className="eyebrow">06 · Get in touch</p>
        <h2>
          Let&apos;s build something
          <br />
          <em>useful.</em>
        </h2>
        <a className="contact-email cursor-target" href={`mailto:${site.email}`} data-cursor-label="Email">
          {site.email} <ArrowUpRight size={25} />
        </a>
        <div className="contact-footer">
          <p>Have a project, a question, or a role in mind? Send a message.</p>
          <div>
            {socialLinks.map((link) => (
              <a className="cursor-target" href={link.href} key={link.label}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer>
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>
          {site.location} · {localTime}
        </span>
        <a className="cursor-target" href="#top">
          <ArrowUpRight size={16} /> Back to top
        </a>
      </footer>

      <AnimatePresence>
        {activeProject !== null && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setActiveProject(null);
              setActiveImage(null);
            }}
          >
            <motion.div
              className={`project-modal accent-${projects[activeProject].accent}`}
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                className="modal-close cursor-target"
                onClick={() => {
                  setActiveProject(null);
                  setActiveImage(null);
                }}
                aria-label="Close project details"
              >
                <X />
              </button>
              <p className="eyebrow">
                {projects[activeProject].number} / {projects[activeProject].category}
              </p>
              <h2>{projects[activeProject].title}</h2>
              <p>{projects[activeProject].description}</p>
              <div className="modal-gallery" aria-label="Project screenshots">
                  {(() => {
                    const gallery = projectGalleries[activeProject] ?? [];
                    const page = gallery[activeGalleryPage];
                    if (!page) return null;

                    const galleryStartIndex = gallery
                      .slice(0, activeGalleryPage)
                      .reduce((total, currentPage) => total + currentPage.images.length, 0);

                    return (
                      <>
                        <div className="modal-gallery-page">
                          <span className="modal-gallery-label">{page.label}</span>
                          <div className="modal-gallery-grid">
                            {page.images.map((image, imageIndex) => (
                              <button
                                className="modal-shot cursor-target"
                                type="button"
                                key={image}
                                onClick={() => setActiveImage(galleryStartIndex + imageIndex)}
                                aria-label={`Open ${page.label} screenshot ${imageIndex + 1}`}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={image} alt={`${projects[activeProject].title} ${page.label} screenshot ${imageIndex + 1}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="modal-gallery-controls">
                          <button
                            className="modal-gallery-arrow cursor-target"
                            type="button"
                            onClick={() => setActiveGalleryPage((activeGalleryPage - 1 + gallery.length) % gallery.length)}
                            aria-label="Previous screenshot page"
                          >
                            <ArrowLeft size={16} />
                          </button>
                          <span>
                            {activeGalleryPage + 1} / {gallery.length}
                          </span>
                          <button
                            className="modal-gallery-arrow cursor-target"
                            type="button"
                            onClick={() => setActiveGalleryPage((activeGalleryPage + 1) % gallery.length)}
                            aria-label="Next screenshot page"
                          >
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              <div className="modal-stack">
                {projects[activeProject].stack.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <div className="modal-links">
                <a href={projects[activeProject].liveUrl} target="_blank" rel="noreferrer" className="button button-primary cursor-target">
                  Live demo <ExternalLink size={16} />
                </a>
                <a href={projects[activeProject].githubUrl} target="_blank" rel="noreferrer" className="button button-ghost cursor-target">
                  <Github size={16} /> GitHub
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeProject !== null && activeImage !== null && projectGalleries[activeProject] && (
          <motion.div
            className="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            onTouchStart={(event) => setTouchStartX(event.changedTouches[0].clientX)}
            onTouchEnd={(event) => {
              if (touchStartX === null) return;
              const delta = event.changedTouches[0].clientX - touchStartX;
              if (Math.abs(delta) > 45) {
                const images = projectGalleries[activeProject]?.flatMap((page) => page.images) ?? [];
                setActiveImage((activeImage + (delta < 0 ? 1 : -1) + images.length) % images.length);
              }
              setTouchStartX(null);
            }}
          >
            <button
              className="lightbox-close cursor-target"
              type="button"
              onClick={() => setActiveImage(null)}
              aria-label="Close image viewer"
            >
              <X />
            </button>
            <button
              className="lightbox-arrow lightbox-arrow-left cursor-target"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                const images = projectGalleries[activeProject]?.flatMap((page) => page.images) ?? [];
                setActiveImage((activeImage - 1 + images.length) % images.length);
              }}
              aria-label="Previous image"
            >
              <ArrowLeft />
            </button>
            <figure className="lightbox-content" onClick={(event) => event.stopPropagation()}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={projectGalleries[activeProject].flatMap((page) => page.images)[activeImage]}
                alt={`${projects[activeProject].title} screenshot ${activeImage + 1}`}
              />
              <figcaption>
                {activeImage + 1} / {projectGalleries[activeProject].flatMap((page) => page.images).length}
              </figcaption>
            </figure>
            <button
              className="lightbox-arrow lightbox-arrow-right cursor-target"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                const images = projectGalleries[activeProject]?.flatMap((page) => page.images) ?? [];
                setActiveImage((activeImage + 1) % images.length);
              }}
              aria-label="Next image"
            >
              <ArrowRight />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
