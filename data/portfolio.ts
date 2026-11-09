export const site = {
  name: 'Illya Sumar',
  shortName: 'IS',
  role: 'Full-Stack Developer',
  location: 'Ukraine',
  timezone: 'EET',
  email: 'illasumar002@gmail.com',
  availability: 'Open to opportunities',
  tagline:
    'I build responsive full-stack web applications with React, TypeScript, Node.js, and reliable database architecture.',
  about:
    "I'm Illya, a Full-Stack Developer focused on building scalable web applications, clean REST APIs, and fast, accessible interfaces. I am studying Cybersecurity and Information Protection at CNTU and use AI development tools to accelerate thoughtful engineering.",
};

export const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/GrizlixXx', short: 'GH' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/illya-sumar-6486a435b/', short: 'IN' },
  { label: 'Telegram', href: 'https://t.me/Sumar_illya', short: 'TG' },
  { label: 'Email', href: 'mailto:illasumar002@gmail.com', short: '@' },
];

export const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Stack', href: '#stack' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
];

export const stats = [
  { value: '78%', label: 'Faster e-commerce load time' },
  { value: 'Lead', label: 'Tech Lead · 5-person team project' },
  { value: 'Full', label: 'Stack ownership' },
];

export const principles = [
  {
    number: '01',
    title: 'Frontend craft',
    copy: 'I build responsive React interfaces with reusable components, thoughtful state management, and clear user flows.',
  },
  {
    number: '02',
    title: 'Performance focused',
    copy: 'Lazy loading, WebP and SVG optimization, caching, memoization, pagination, and debounce help products feel fast from the first interaction.',
  },
  {
    number: '03',
    title: 'Reliable backend',
    copy: 'I design REST APIs, normalized SQL schemas, and dependable CRUD flows with Node.js, Express, MySQL, and PostgreSQL.',
  },
  {
    number: '04',
    title: 'Continuous growth',
    copy: 'I keep developing through formal education, Full-Stack training at Mate Academy, and hands-on team and individual projects.',
  },
];

export const ticker = [
  'React',
  'TypeScript',
  'Node.js',
  'Express',
  'REST API',
  'MySQL',
  'PostgreSQL',
  'MongoDB',
  'SCSS',
  'Docker',
];

/** Funnel rows for the perspective tech stack (wide → narrow). */
export const techStackRows = [
  [
    { name: 'JavaScript', icon: 'https://cdn.simpleicons.org/javascript/ffffff' },
    { name: 'TypeScript', icon: 'https://cdn.simpleicons.org/typescript/ffffff' },
    { name: 'HTML5', icon: 'https://cdn.simpleicons.org/html5/ffffff' },
    { name: 'CSS3', icon: 'https://cdn.simpleicons.org/css/ffffff' },
    { name: 'React', icon: 'https://cdn.simpleicons.org/react/ffffff' },
    { name: 'React Router', icon: 'https://cdn.simpleicons.org/reactrouter/ffffff' },
    { name: 'Tailwind', icon: 'https://cdn.simpleicons.org/tailwindcss/ffffff' },
  ],
  [
    { name: 'Node.js', icon: 'https://cdn.simpleicons.org/nodedotjs/ffffff' },
    { name: 'Express', icon: 'https://cdn.simpleicons.org/express/ffffff' },
    { name: 'REST API', icon: 'https://cdn.simpleicons.org/openapiinitiative/ffffff' },
    { name: 'Zustand', icon: 'https://cdn.simpleicons.org/zustand/ffffff' },
    { name: 'Redux', icon: 'https://cdn.simpleicons.org/redux/ffffff' },
    { name: 'PostgreSQL', icon: 'https://cdn.simpleicons.org/postgresql/ffffff' },
  ],
  [
    { name: 'MongoDB', icon: 'https://cdn.simpleicons.org/mongodb/ffffff' },
    { name: 'MySQL', icon: 'https://cdn.simpleicons.org/mysql/ffffff' },
    { name: 'Sass', icon: 'https://cdn.simpleicons.org/sass/ffffff' },
    { name: 'phpMyAdmin', icon: 'https://cdn.simpleicons.org/phpmyadmin/ffffff' },
    { name: 'Docker', icon: 'https://cdn.simpleicons.org/docker/ffffff' },
  ],
  [
    { name: 'Git', icon: 'https://cdn.simpleicons.org/git/ffffff' },
    { name: 'GitHub', icon: 'https://cdn.simpleicons.org/github/ffffff' },
    { name: 'WSL2', icon: 'https://cdn.simpleicons.org/linux/ffffff' },
    { name: 'Webpack', icon: 'https://cdn.simpleicons.org/webpack/ffffff' },
  ],
  [
    { name: 'Claude Code', icon: 'https://cdn.simpleicons.org/anthropic/ffffff' },
    { name: 'Postman', icon: 'https://cdn.simpleicons.org/postman/ffffff' },
    { name: 'Copilot', icon: 'https://cdn.simpleicons.org/githubcopilot/ffffff' },
  ],
];

/** @deprecated kept for ticker/back-compat — prefer techStackRows */
export const technologies = techStackRows.flat().map((tech, index) => ({
  ...tech,
  group: 'Stack',
  level: index < 9 ? 'Primary' : 'Confident',
}));

export type ProjectShape = 'diamond' | 'circle' | 'hexagon' | 'ring' | 'square' | 'triangle';

export const projects = [
  {
    number: '01',
    title: 'AutoFix Service',
    category: 'Full-stack booking platform',
    description:
      'A full-stack platform for booking automotive maintenance services across multiple cities and service centers. It combines a React SPA, Express REST API, MySQL database, AI-style chatbot, and Telegram bot notifications for staff.',
    stack: ['React', 'Express', 'MySQL', 'JWT', 'Python'],
    accent: 'violet',
    shape: 'diamond' as ProjectShape,
    slug: 'auto-fix',
    liveUrl: 'https://autoservicebooking-f84de2d9dab3.herokuapp.com/',
    githubUrl: 'https://github.com/GrizlixXx/Auto-Service-Booking',
    gallery: [
      {
        label: '01 / Booking flow',
        images: [],
      },
      {
        label: '02 / Account & chatbot',
        images: [],
      },
      {
        label: '03 / Staff tools',
        images: [],
      },
    ],
  },
  {
    number: '02',
    title: 'Atlas Cinema',
    category: 'Full-stack cinema booking',
    description:
      'A full-stack cinema booking application for browsing movies, checking showtimes, selecting seats, and managing bookings. It includes authentication, an admin panel, bilingual content, responsive layouts, and cinema statistics.',
    stack: ['TypeScript', 'Node.js', 'Express', 'MySQL', 'i18n'],
    accent: 'orange',
    shape: 'hexagon' as ProjectShape,
    slug: 'atlas-cinema',
    liveUrl: 'https://atlas-cinema-demo-767afa5afef1.herokuapp.com/',
    githubUrl: 'https://github.com/GrizlixXx/Atlant-cinema',
    gallery: [],
  },
  {
    number: '03',
    title: '404 Gadgets',
    category: 'Team e-commerce project',
    description:
      'A responsive online store for phones, tablets, and accessories built by Team 404 Found. It includes catalog filtering, product details, shopping cart, favorites, theme switching, and persistent local storage state.',
    stack: ['React', 'TypeScript', 'Vite', 'React Router', 'SCSS', 'Swiper'],
    accent: 'cyan',
    shape: 'circle' as ProjectShape,
    slug: '404-gadgets',
    liveUrl: 'https://team-404-found-t5.github.io/react_phone-catalog/',
    githubUrl: 'https://github.com/Team-404-Found-T5/react_phone-catalog',
    gallery: [],
  },
  {
    number: '04',
    title: 'Bang & Olufsen',
    category: 'Responsive landing page',
    description:
      'A responsive Bang & Olufsen landing page recreated from a Figma design. It features adaptive layouts, a burger menu with scroll locking, product sections, interactive contact links, hover effects, and smooth scrolling animations.',
    stack: ['HTML5', 'JavaScript', 'SCSS', 'BEM', 'Vite', 'Figma'],
    accent: 'violet',
    shape: 'ring' as ProjectShape,
    slug: 'bang-olufsen',
    liveUrl: 'https://GrizlixXx.github.io/landing-page-Bang-olufsen/',
    githubUrl: 'https://github.com/GrizlixXx/landing-page-Bang-olufsen',
    gallery: [],
  },
];

export const processSteps = [
  [
    '01',
    'Understand the problem',
    'I clarify the goal, user flow, and technical constraints before choosing the right frontend, backend, and data approach.',
  ],
  [
    '02',
    'Build the full stack',
    'I develop reusable React interfaces and maintainable Node.js/Express services, connecting the UI to validated REST APIs and databases.',
  ],
  [
    '03',
    'Refine and optimize',
    'I test the result, improve performance, refactor where needed, and use feedback to make the product more reliable and easier to use.',
  ],
] as const;
