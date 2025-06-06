# Akhil Kumar - Portfolio Website

A sophisticated, modern portfolio website showcasing the work and skills of Gudapuri Akhil Kumar, a dynamic tech professional specializing in data science, machine learning, and full-stack development.

## 🌟 Features

### Design Philosophy
- **Hub-Based Navigation**: Respects user attention spans with clear, time-estimated sections
- **User-First Approach**: Let visitors choose their exploration path
- **Thoughtful over Flashy**: Every design decision serves a clear purpose
- **Performance Excellence**: Sub-2 second load times with smooth 60 FPS animations

### Technical Highlights
- **React 18 + TypeScript**: Modern, type-safe development
- **Custom Cursor System**: Smooth spring physics with interactive feedback
- **Sophisticated Animations**: Framer Motion for delightful micro-interactions
- **Dark Theme Focus**: Professional deep navy (#091d3d) with accent colors
- **Mobile-First Design**: Responsive across all devices
- **Accessibility Compliant**: WCAG 2.1 AA standards

### Sections
1. **Hub** - Central navigation with greeting and section preview
2. **About** - Personal story and professional philosophy
3. **Work** - Featured projects with detailed technical challenges
4. **Skills** - Interactive skill visualization with proficiency levels
5. **Contact** - Professional contact form with availability status

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
cd "/Users/akhil/Desktop/Portfolio 2/akhil-portfolio"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view in browser

### Build for Production
```bash
npm run build
```

## 🎨 Design System

### Color Palette
- **Primary Blue**: #0047FF (Main brand color)
- **Secondary Cyan**: #00CFFD (Accents and highlights)
- **Accent Purple**: #7000FF (Special emphasis)
- **Background**: #091d3d (Deep navy - main theme)
- **Surface**: #111827 (Card backgrounds)

### Typography
- **Body Text**: Inter (highly legible, excellent web rendering)
- **Headers**: Plus Jakarta Sans (geometric, modern impact)
- **Code**: JetBrains Mono (developer-focused)
- **Signature**: Dancing Script (personal branding)
- **Special**: Garet, Bitter, Ubuntu (specific use cases)

### Animations
- **Smooth Transitions**: 0.3s ease for interactions
- **Spring Physics**: Custom cursor with damping: 25, stiffness: 300
- **Staggered Reveals**: Content appears with progressive delays
- **Hover Effects**: Subtle scale and movement feedback

## 🛠 Technology Stack

### Core
- **React 18**: Latest React with concurrent features
- **TypeScript**: Type safety and better developer experience
- **Tailwind CSS**: Utility-first styling with custom design tokens
- **Framer Motion**: Production-ready motion library

### Routing & State
- **React Router DOM v6**: Modern declarative routing
- **React Context**: Theme and cursor state management
- **Local Storage**: User preferences persistence

### Performance
- **Code Splitting**: Lazy loading for optimal bundle sizes
- **Image Optimization**: WebP with fallbacks
- **Font Loading**: Optimized web font strategy
- **Accessibility**: Screen reader support and keyboard navigation

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── CustomCursor.tsx
│   │   └── Logo.tsx
│   ├── layout/             # Layout components
│   │   └── Header.tsx
│   └── sections/           # Page sections
│       ├── About.tsx
│       ├── Work.tsx
│       ├── Skills.tsx
│       └── Contact.tsx
├── pages/                  # Main pages
│   └── Hub.tsx
├── contexts/               # React Context providers
│   └── ThemeContext.tsx
├── types/                  # TypeScript definitions
│   └── index.ts
├── styles/                 # Global styles
│   └── globals.css
└── utils/                  # Helper functions
```

## 🎯 Performance Targets

- **Initial Load**: < 2 seconds on 3G
- **Time to Interactive**: < 3 seconds
- **Largest Contentful Paint**: < 2.5 seconds
- **Frame Rate**: 60 FPS during animations
- **Accessibility**: WCAG 2.1 AA compliance

## 💼 Professional Information

### Core Value Proposition
*"I build intelligent systems that turn complex data into measurable business value."*

### Skills Showcase
- **Programming**: Python, JavaScript, TypeScript, Java
- **Data Science**: Pandas/NumPy, PySpark, Tableau, Matplotlib
- **Cloud & Big Data**: AWS, Apache Kafka, Cassandra, Docker/Kubernetes
- **Databases**: MongoDB, SQL, PostgreSQL
- **Machine Learning**: PyTorch, Collaborative Filtering
- **Web Development**: React.js, Node.js, Express, Tailwind CSS

### Featured Projects
1. **Large-Scale Real-Time Recommendation Engine** (2024)
   - Processes millions of interactions per hour
   - Sub-500ms recommendation delivery
   - Apache Kafka, Spark, Cassandra

2. **End-to-End Learning Management System** (2023)
   - Role-based access control
   - Interactive content delivery
   - React, Node.js, MongoDB, AWS

3. **UberEATS Prototype** (2023)
   - Real-time order tracking
   - Dual interfaces (customer/restaurant)
   - React, Express, Socket.io

## 🔧 Development Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## 📱 Browser Support

### Target Browsers
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

### Mobile Support
- iOS Safari (last 2 versions)
- Chrome Mobile (last 2 versions)
- Samsung Internet (last 1 version)

## ⚡ Performance Optimizations

- **Bundle Splitting**: Separate chunks for each route
- **Image Optimization**: WebP format with JPEG fallbacks
- **Font Optimization**: Critical font loading with display: swap
- **CSS Optimization**: Tailwind purging and minification
- **Animation Performance**: GPU-accelerated transforms
- **Memory Management**: Proper cleanup of event listeners

## 🔒 Security Features

- **Content Security Policy**: Strict CSP headers
- **XSS Prevention**: Proper input sanitization
- **HTTPS Enforcement**: Force HTTPS in production
- **Dependency Security**: Regular security audits

## 📞 Contact Information

- **Email**: akhil.kumar@email.com
- **LinkedIn**: linkedin.com/in/akhilkumar
- **GitHub**: github.com/akhilkumar
- **Status**: Currently available for new opportunities

---

## 🎨 Design Credits

This portfolio implements a sophisticated design system based on:
- Modern geometric aesthetics
- Professional color psychology
- User experience best practices
- Performance-first development approach

Built with attention to detail, accessibility, and user experience in mind.

*Last updated: June 2025*