# Deployment Guide

This guide covers deploying the Okashi HVAC Services website to various platforms.

## 🚀 Vercel Deployment (Recommended)

### Prerequisites
- Node.js 16+ installed
- Vercel CLI installed: `npm i -g vercel`
- GitHub repository connected

### Step-by-Step Deployment

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build CSS**
   ```bash
   npm run build
   ```

3. **Deploy to Vercel**
   ```bash
   npx vercel --prod
   ```

4. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add the following variables:
     ```
     NODE_ENV=production
     OPENWEATHER_API_KEY=your_key_here
     YELP_API_KEY=your_key_here
     HUNTER_API_KEY=your_key_here
     NUMVERIFY_API_KEY=your_key_here
     WORKIZ_API_TOKEN=your_token_here
     ```

5. **Disable Authentication (CRITICAL)**
   - Go to Vercel Dashboard → Project Settings
   - Find "Password Protection" or "Authentication"
   - **Disable it** to make the site publicly accessible
   - Without this step, the site will require authentication

6. **Verify Deployment**
   - Visit your live URL
   - Test all pages and functionality
   - Check API endpoints: `/api/health`

### Current Production URL
```
https://okashi-hvac-website-niqz9sk5j-shais-projects-f9b9e359.vercel.app
```

## 🔧 Environment Variables

### Required for Full Functionality
- `OPENWEATHER_API_KEY` - Weather data (free tier available)
- `YELP_API_KEY` - Customer reviews (free tier available)
- `HUNTER_API_KEY` - Email validation (free tier available)
- `NUMVERIFY_API_KEY` - Phone validation (free tier available)
- `WORKIZ_API_TOKEN` - Lead submission (business account required)

### Optional
- `GA_MEASUREMENT_ID` - Google Analytics (currently disabled)

### Fallback Behavior
If API keys are missing, the site will:
- Use fallback weather data
- Display static testimonials
- Skip validation (allow form submission)
- Simulate Workiz submission

## 🐛 Troubleshooting

### Common Issues

1. **Site Requires Authentication**
   - **Solution**: Disable password protection in Vercel dashboard

2. **API Endpoints Not Working**
   - **Solution**: Check environment variables in Vercel dashboard
   - **Fallback**: Site will work with fallback data

3. **Build Failures**
   - **Solution**: Ensure all dependencies are installed
   - **Check**: `npm install` and `npm run build`

4. **CSS Not Loading**
   - **Solution**: Run `npm run build` to compile Tailwind CSS
   - **Verify**: `public/styles.css` exists and is not empty

### Debug Commands

```bash
# Test local build
npm run build
npm start

# Check Vercel deployment
npx vercel ls

# View deployment logs
npx vercel logs

# Test API endpoints
curl https://your-site.vercel.app/api/health
```

## 📊 Monitoring

### Health Check
Monitor site health with:
```
GET /api/health
```

### Performance
- Vercel provides built-in analytics
- Monitor Core Web Vitals
- Check API response times

### Error Tracking
- Vercel logs show server errors
- Browser console for client-side issues
- API endpoints return detailed error messages

## 🔄 Updates

### Deploying Updates
1. Make changes locally
2. Test with `npm run dev`
3. Commit and push to GitHub
4. Deploy: `npx vercel --prod`

### Rollback
- Vercel maintains deployment history
- Use dashboard to rollback to previous version
- Each deployment gets a unique URL

## 🔒 Security

### Best Practices
- Never commit API keys to repository
- Use environment variables for all secrets
- Enable HTTPS (automatic with Vercel)
- Regular dependency updates

### API Key Management
- Rotate keys regularly
- Use least-privilege access
- Monitor API usage
- Set up alerts for unusual activity

## 📱 Mobile Testing

### Test Checklist
- [ ] Responsive design on all screen sizes
- [ ] Touch-friendly navigation
- [ ] Form inputs work on mobile
- [ ] Images load properly
- [ ] Performance on slow networks

### Tools
- Chrome DevTools mobile simulation
- Real device testing
- PageSpeed Insights
- Lighthouse audits

---

**Need Help?** Contact: raanan@okashihvac.com 