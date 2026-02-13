# GSXD Landing Page

A modern 15-page landing site built with Vite, Tailwind CSS, and Handlebars.

## Features

- ⚡️ **Vite** - Lightning-fast build tool and dev server
- 🎨 **Tailwind CSS** - Utility-first CSS framework with JIT mode
- 📄 **Handlebars** - Template engine for reusable Header/Footer partials
- 🔄 **Dynamic Imports** - Page-specific JavaScript modules loaded on demand
- 📦 **Auto-scan HTML** - Vite automatically discovers all pages in `src/pages/`

## Project Structure

```
src/
├── assets/
│   ├── css/
│   │   └── main.css          # Tailwind directives
│   └── images/               # Image assets
├── js/
│   ├── main.js               # Main JavaScript with dynamic imports
│   └── pages/                # Page-specific modules
│       └── index.js          # Example page module
├── pages/                    # All HTML pages (15 pages)
│   ├── index.html
│   ├── about.html
│   ├── services.html
│   ├── portfolio.html
│   ├── team.html
│   ├── blog.html
│   ├── contact.html
│   ├── careers.html
│   ├── pricing.html
│   ├── faq.html
│   ├── testimonials.html
│   ├── case-studies.html
│   ├── partners.html
│   ├── privacy.html
│   ├── terms.html
│   └── resources.html
└── partials/
    ├── header.html           # Shared header component
    └── footer.html           # Shared footer component
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/huysinger/gsxd-landing-page.git
cd gsxd-landing-page
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

Visit http://localhost:5173/ to view the site.

### Build

Build for production:
```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview

Preview the production build:
```bash
npm run preview
```

## How It Works

### Auto-scan HTML Files

The `vite.config.js` uses `glob` to automatically scan all HTML files in `src/pages/`:

```javascript
const htmlFiles = glob.sync('src/pages/**/*.html');
```

This means you can add new pages without modifying the Vite configuration.

### Handlebars Partials

Header and footer are shared across all pages using Handlebars:

```html
{{> header}}
<!-- Page content -->
{{> footer}}
```

### Dynamic Imports

Page-specific JavaScript modules are loaded dynamically based on the `data-page` attribute:

```html
<body data-page="index">
```

The `main.js` will automatically import `src/js/pages/index.js` if it exists.

### Tailwind JIT

Tailwind is configured with JIT (Just-In-Time) mode for optimal CSS generation. The configuration in `tailwind.config.js` scans all relevant files:

```javascript
content: [
  "./src/**/*.{html,js}",
  "./src/pages/**/*.html",
  "./src/partials/**/*.html"
]
```

## Pages

The site includes 15 pages:

1. **Home** (`index.html`) - Landing page with hero and features
2. **About** - Company information
3. **Services** - Services offered
4. **Portfolio** - Project showcase
5. **Team** - Team members
6. **Blog** - Blog articles
7. **Contact** - Contact form
8. **Careers** - Job openings
9. **Pricing** - Pricing plans
10. **FAQ** - Frequently asked questions
11. **Testimonials** - Client reviews
12. **Case Studies** - Detailed project case studies
13. **Partners** - Partner companies
14. **Privacy** - Privacy policy
15. **Terms** - Terms of service
16. **Resources** - Additional resources

## License

ISC
