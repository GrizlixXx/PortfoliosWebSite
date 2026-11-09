# Illya Sumar — Portfolio Website

Personal portfolio website for Me, a Full-Stack Developer focused on responsive interfaces, REST APIs, database-driven applications, and practical performance improvements.

The site presents selected projects, technical skills, development principles, workflow, and contact links through an interactive single-page experience.

## Features

- Responsive portfolio layout for desktop, tablet, and mobile screens
- Animated hero section with personal information and availability status
- About section with development principles and project statistics
- Horizontal project carousel with drag and touch navigation
- Project details modal with:
  - concise project overview
  - technology stack
  - live demo and GitHub links
  - screenshot gallery with three images per page
  - full-screen image viewer
  - keyboard arrow navigation
  - touch swipe navigation on mobile
- Automatic project image discovery from `public/projects/{project-slug}`
- Support for common image formats including JPG, PNG, WebP, SVG, GIF, AVIF, BMP, and ICO
- Interactive technology stack section with animated technology cards
- Development process section
- Responsive navigation with mobile menu
- Custom cursor interaction on supported desktop screens
- Smooth scrolling and motion effects
- Contact section with email and social links

## Projects

### AutoFix Service

Full-stack automotive service booking platform with a React frontend, Express REST API, MySQL database, authentication, chatbot, and Telegram notifications.

- [Live Demo](https://autoservicebooking-f84de2d9dab3.herokuapp.com/)
- [GitHub](https://github.com/GrizlixXx/Auto-Service-Booking)

### Atlas Cinema

Cinema booking application for browsing movies, checking showtimes, selecting seats, managing bookings, and viewing cinema statistics.

- [Live Demo](https://atlas-cinema-demo-767afa5afef1.herokuapp.com/)
- [GitHub](https://github.com/GrizlixXx/Atlant-cinema)

### 404 Gadgets

Responsive team e-commerce project for phones, tablets, and accessories with catalog filtering, product pages, cart, favorites, themes, and persistent local storage.

- [Live Demo](https://team-404-found-t5.github.io/react_phone-catalog/)
- [GitHub](https://github.com/Team-404-Found-T5/react_phone-catalog)

### Bang & Olufsen

Responsive landing page recreated from a Figma design with adaptive layouts, a burger menu, scroll locking, product sections, hover effects, and smooth scrolling animations.

- [Live Demo](https://GrizlixXx.github.io/landing-page-Bang-olufsen/)
- [GitHub](https://github.com/GrizlixXx/landing-page-Bang-olufsen)

## Technologies

- **Framework:** Next.js, React
- **Language:** TypeScript
- **Styling:** CSS, responsive layouts, CSS Grid, Flexbox
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Fonts:** Google Fonts — Syne, Manrope, DM Mono
- **Image handling:** Next.js App Router route handler with automatic filesystem discovery
- **Tooling:** ESLint, TypeScript, Turbopack

## Project Structure

```text
app/
  api/
    project-images/[project]/route.ts  Project image discovery endpoint
  globals.css                          Global styles and responsive layout
  icon.svg                             Site favicon
  layout.tsx                           Root layout and metadata
  page.tsx                             Main portfolio page

components/
  ProjectCarousel.tsx                  Project cards carousel
  TargetCursor.tsx                     Desktop custom cursor

data/
  portfolio.ts                         Site, project, stack, and content data

public/
  projects/
    auto-fix/                          AutoFix screenshots
    atlas-cinema/                      Atlas Cinema screenshots
    404-gadgets/                       404 Gadgets screenshots
    bang-olufsen/                      Bang & Olufsen screenshots
```

## Project Images

Place project screenshots in the corresponding folder under `public/projects/`.

The gallery automatically scans each folder and groups discovered images into pages of three. File names and supported image extensions do not need to be configured in the project data.

## Contact

- **Email:** [illasumar002@gmail.com](mailto:illasumar002@gmail.com)
- **GitHub:** [GrizlixXx](https://github.com/GrizlixXx)
- **LinkedIn:** [Illya Sumar](https://www.linkedin.com/in/illya-sumar-6486a435b/)
- **Telegram:** [@Sumar_illya](https://t.me/Sumar_illya)
