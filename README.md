# Akhil Kumar Portfolio 2.0

A modern, interactive portfolio website built with React 18, TypeScript, and Framer Motion. Features sophisticated animations, Easter eggs, and a polished user experience.

## 🌟 Features

### Core Functionality
- **Responsive Design**: Optimized for all device sizes with Tailwind CSS
- **Custom Cursor**: Physics-based cursor with spring animations
- **Dark Theme**: Modern dark theme with custom color palette
- **Smooth Navigation**: Framer Motion page transitions and animations
- **Contact Form**: Integrated contact form with validation

### Interactive Elements
- **Easter Eggs**: Konami code activation with matrix rain effect
- **Time-based Greetings**: Dynamic greetings based on time of day
- **Hover Effects**: Sophisticated hover animations throughout
- **Loading States**: Custom loading spinners and transitions

### Technical Highlights
- **TypeScript**: Full type safety and modern development experience
- **Error Boundaries**: Graceful error handling with user-friendly fallbacks
- **Lazy Loading**: Code splitting for optimal performance
- **SEO Optimized**: Meta tags, Open Graph, and structured data
- **Accessibility**: WCAG compliant with proper ARIA labels

## 🎨 Design System

### Colors
- **Primary**: `#0047FF` (Blue)
- **Secondary**: `#00CFFD` (Cyan)
- **Accent**: `#7000FF` (Purple)
- **Background**: `#091d3d` (Dark Navy)
- **Surface**: `#111827` (Dark Gray)
- **Foreground**: `#F4F7FF` (Light Blue)

### Typography
- **Display**: Inter (Headings)
- **Body**: Inter (Body text)
- **Mono**: JetBrains Mono (Code snippets)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Akhil-Lokesh/portfolio2.o.git
   cd portfolio2.o
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## 🗂️ Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   │   ├── CustomCursor.tsx
│   │   ├── MatrixRain.tsx
│   │   └── AkLogo.tsx
│   ├── pages/           # Page components
│   │   ├── Hub.tsx      # Landing page
│   │   ├── About.tsx    # About section
│   │   ├── Work.tsx     # Portfolio work
│   │   ├── Skills.tsx   # Technical skills
│   │   └── Contact.tsx  # Contact form
│   └── ErrorBoundary.tsx
├── hooks/               # Custom React hooks
│   └── useKonamiCode.ts
├── utils/               # Utility functions
│   ├── constants.ts     # App constants
│   ├── animations.ts    # Animation helpers
│   ├── format.ts        # Formatting utilities
│   └── index.ts         # Barrel exports
├── styles/              # Global styles
└── App.tsx              # Main app component
```

## 🎮 Easter Eggs

### Konami Code
Activate the hidden matrix rain effect:
- **Desktop**: `↑ ↑ ↓ ↓ ← → ← → B A`
- **Effect**: Tech skills matrix rain with achievement notification

### Time-based Features
- Dynamic greetings based on current time
- Theme variations throughout the day

## 🛠️ Technologies Used

### Frontend Framework
- **React 18**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **React Router**: Client-side routing

### Styling & Animation
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Production-ready motion library
- **Custom CSS**: Custom properties and animations

### Development Tools
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality assurance

### Deployment
- **GitHub Pages**: Static site hosting
- **GitHub Actions**: CI/CD pipeline

## 📱 Browser Support

- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions  
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions

## 🤝 Contributing

While this is a personal portfolio, suggestions and feedback are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit changes (`git commit -am 'Add improvement'`)
4. Push to branch (`git push origin feature/improvement`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Akhil Kumar**
- **Email**: [akgudapuri@gmail.com](mailto:akgudapuri@gmail.com)
- **LinkedIn**: [akhilgudapuri](https://linkedin.com/in/akhilgudapuri)
- **GitHub**: [Akhil-Lokesh](https://github.com/Akhil-Lokesh)
- **Portfolio**: [Live Demo](https://akhil-lokesh.github.io/portfolio2.o)

---

*Built with ❤️ by Akhil Kumar*