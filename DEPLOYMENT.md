# 🚀 Deployment Guide - Akhil Kumar Portfolio

This guide covers multiple deployment options for the portfolio website with production optimizations.

## 📋 Pre-Deployment Checklist

- [x] **SEO Optimized**: Meta tags, Open Graph, Twitter Cards
- [x] **Performance**: Source maps disabled, optimized builds
- [x] **Security**: Security headers, CSP policies
- [x] **PWA Ready**: Manifest file configured
- [x] **Multi-Platform**: Netlify, Vercel, GitHub Pages ready

## 🌐 Deployment Options

### Option 1: Netlify (Recommended)
**Best for**: Automatic deployments, edge functions, form handling

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Build the project
npm run build

# 3. Deploy to Netlify
netlify deploy --prod --dir=build

# Or use the automated script
npm run deploy:netlify
```

**Automatic Deployment:**
1. Connect your GitHub repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `build`
4. The `netlify.toml` file will handle all configurations

### Option 2: Vercel
**Best for**: React apps, automatic optimizations, edge functions

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy to Vercel
vercel --prod

# Or use the automated script
npm run deploy:vercel
```

**Automatic Deployment:**
1. Connect your GitHub repository to Vercel
2. Import project and it will automatically detect React
3. The `vercel.json` file will handle all configurations

### Option 3: GitHub Pages
**Best for**: Free hosting, simple deployment

```bash
# 1. Install gh-pages
npm install --save-dev gh-pages

# 2. Add to package.json scripts:
"predeploy": "npm run build",
"deploy": "gh-pages -d build"

# 3. Deploy
npm run deploy
```

### Option 4: Custom Server/VPS
**Best for**: Full control, custom domain

```bash
# 1. Build the project
npm run build

# 2. Serve using any static server
npx serve -s build -l 3000

# Or use nginx, apache, etc.
```

## ⚙️ Build Optimization

### Environment Variables
Create a `.env` file for local development:

```env
# Portfolio Configuration
REACT_APP_SITE_URL=https://akhilkumar.dev
REACT_APP_VERSION=1.0.0
REACT_APP_PORTFOLIO_NAME=Akhil Kumar Portfolio
REACT_APP_CONTACT_EMAIL=akhil.kumar@email.com

# Build Optimizations
GENERATE_SOURCEMAP=false
INLINE_RUNTIME_CHUNK=false

# Feature Flags
REACT_APP_ENABLE_EASTER_EGGS=true
REACT_APP_ENABLE_CUSTOM_CURSOR=true
REACT_APP_DEBUG_MODE=false
```

### Performance Optimizations Applied

1. **Build Optimizations**:
   - Source maps disabled in production
   - Bundle splitting enabled
   - Tree shaking active
   - Minification enabled

2. **Caching Strategy**:
   - Static assets: 1 year cache
   - HTML: No cache (for updates)
   - Service worker ready

3. **Security Headers**:
   - X-Frame-Options: DENY
   - X-XSS-Protection: enabled
   - Content Security Policy
   - HTTPS redirect

## 🔧 Custom Domain Setup

### For Netlify:
1. Go to Domain settings in Netlify dashboard
2. Add custom domain: `akhilkumar.dev`
3. Configure DNS records or let Netlify handle it
4. SSL certificate is automatic

### For Vercel:
1. Go to Project settings → Domains
2. Add custom domain: `akhilkumar.dev`
3. Configure DNS records
4. SSL certificate is automatic

### DNS Configuration:
```
Type: A
Name: @
Value: [Platform IP]

Type: CNAME
Name: www
Value: [Platform URL]
```

## 📊 Analytics Setup (Optional)

### Google Analytics
Add to `public/index.html` before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Vercel Analytics
Add to your React app:

```bash
npm install @vercel/analytics
```

## 🚨 Common Issues & Solutions

### Issue: Build Fails
**Solution**: Check Node.js version (>=16), clear node_modules
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Routing Issues
**Solution**: Ensure platform redirects are configured
- Netlify: `_redirects` file or `netlify.toml`
- Vercel: `vercel.json` routes
- GitHub Pages: Use HashRouter instead

### Issue: Fonts Not Loading
**Solution**: Check preconnect links in HTML and CORS headers

### Issue: Custom Cursor Not Working
**Solution**: Ensure HTTPS deployment (required for cursor API)

## 🔍 Testing Deployment

### Local Testing
```bash
# Test production build locally
npm run build
npm run serve
```

### Performance Testing
- **Lighthouse**: Built into Chrome DevTools
- **WebPageTest**: https://www.webpagetest.org/
- **GTmetrix**: https://gtmetrix.com/

### Target Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.0s
- **Cumulative Layout Shift**: < 0.1
- **Performance Score**: > 90

## 📝 Post-Deployment Steps

1. **Update URLs**: Replace placeholder URLs with actual domain
2. **Test All Routes**: Verify React Router works
3. **Check Mobile**: Test responsive design
4. **Verify Features**: Test easter eggs, animations, cursor
5. **SEO Check**: Verify meta tags, sitemap
6. **Security Scan**: Check headers, HTTPS

## 🔄 Continuous Deployment

### GitHub Actions (Optional)
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - name: Deploy to Netlify
        run: npx netlify-cli deploy --prod --dir=build
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 📞 Support

If you encounter any deployment issues:
1. Check the platform-specific documentation
2. Verify all configuration files are correct
3. Test locally first with `npm run serve`
4. Check browser console for errors

---

**Ready to deploy? Choose your platform and follow the steps above!** 