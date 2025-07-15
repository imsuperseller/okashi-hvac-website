# Okashi HVAC Services Website

A complete, mobile-friendly three-page website for Raanan Okashi's solo HVAC business in the DFW area. Built with HTML5, CSS3 (Tailwind), JavaScript (ES6+), and Node.js with MCP (Model Context Protocol) servers for dynamic data integrations.

## 🌟 Features

### Design & Branding
- **Custom Color Palette**: Professional blue (#0066CC), green (#28A745), orange (#FD7E14) theme
- **Custom Logo**: Professional HVAC branding with local Texas flair
- **Typography**: Roboto for headings, Open Sans for body text
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Local Branding**: DFW-specific content and Texas flair

### Pages
1. **Home Page** (`index.html`)
   - Hero section with compelling CTAs
   - Dynamic weather display with eco-tips
   - Services preview with local focus
   - Emergency contact section

2. **Services Page** (`services.html`)
   - Detailed service descriptions
   - Emergency repairs, installations, maintenance
   - Dynamic testimonials carousel
   - Local SEO optimization

3. **Contact Page** (`contact.html`)
   - Lead form with validation
   - Workiz API integration
   - Contact information display
   - Emergency service CTA

### Technical Features
- **MCP Servers**: Weather, reviews, and validation APIs
- **Form Validation**: Client-side and server-side validation
- **SEO Optimized**: Meta tags, schema markup, sitemap
- **Performance**: Fast loading, optimized assets
- **Accessibility**: ARIA labels, high contrast, semantic HTML

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd okashi-hvac-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your API keys
   ```

4. **Build CSS**
   ```bash
   npm run build:css
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🔧 Configuration

### Required API Keys

1. **OpenWeatherMap API** (Free tier)
   - Get key: https://openweathermap.org/api
   - Used for: Real-time weather data

2. **Yelp API** (Free tier)
   - Get key: https://www.yelp.com/developers
   - Used for: Customer reviews

3. **Hunter.io API** (Free tier)
   - Get key: https://hunter.io/api
   - Used for: Email validation

4. **NumVerify API** (Free tier)
   - Get key: https://numverify.com/
   - Used for: Phone validation

5. **Workiz API** (Business account)
   - Get token from Workiz dashboard
   - Used for: Lead form submissions

### Environment Variables

Create a `.env` file with:

```env
NODE_ENV=development
PORT=3000
OPENWEATHER_API_KEY=your_openweather_key
YELP_API_KEY=your_yelp_key
HUNTER_API_KEY=your_hunter_key
NUMVERIFY_API_KEY=your_numverify_key
WORKIZ_API_TOKEN=your_workiz_token
GA_MEASUREMENT_ID=your_ga_id
```

## 📁 Project Structure

```
okashi-hvac-website/
├── index.html              # Home page
├── services.html           # Services page
├── contact.html            # Contact page
├── server.js               # Main Express server
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind configuration
├── vercel.json             # Vercel deployment config
├── sitemap.xml             # SEO sitemap
├── robots.txt              # Search engine instructions
├── env.example             # Environment variables template
├── README.md               # This file
├── src/
│   └── input.css           # Tailwind input CSS
├── public/
│   ├── styles.css          # Compiled CSS
│   ├── script.js           # Client-side JavaScript
│   └── logo.png            # Custom logo
└── mcp-servers/
    ├── weather-mcp.js      # Weather API integration
    ├── reviews-mcp.js      # Reviews API integration
    └── validation-mcp.js   # Contact validation
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to modify the color palette:

```javascript
colors: {
  primary: '#0066CC',      // Main blue
  secondary: '#28A745',    // Green
  accent: '#FD7E14',       // Orange
  neutral: '#6C757D'       // Gray
}
```

### Content
- Update contact information in HTML files
- Modify service descriptions
- Change testimonials in `reviews-mcp.js`
- Update logo in `public/logo.png`

### Branding
- Replace placeholder phone numbers and emails
- Update social media links
- Modify DFW service areas
- Customize eco-friendly messaging

## 🚀 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set environment variables in Vercel dashboard**

### Other Platforms

The site is compatible with:
- Netlify
- Heroku
- DigitalOcean App Platform
- AWS Amplify

## 📊 SEO Features

- **Meta Tags**: Optimized titles and descriptions
- **Schema Markup**: LocalBusiness structured data
- **Sitemap**: XML sitemap for search engines
- **Robots.txt**: Crawling instructions
- **Local SEO**: DFW-specific keywords and content
- **Performance**: Fast loading times

## 🔍 API Endpoints

### Weather API
```
GET /api/weather?city=Dallas
```
Returns current weather with eco-friendly tips.

### Reviews API
```
GET /api/reviews
```
Returns customer testimonials from Yelp or fallback data.

### Validation API
```
POST /api/validate
Body: { email: "test@example.com", phone: "1234567890" }
```
Validates contact information.

### Lead Submission
```
POST /api/submit-lead
Body: { name, phone, email, service, location, message, emergency }
```
Submits leads to Workiz.

## 🛠️ Development

### Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run build:css  # Build Tailwind CSS (watch mode)
npm run build      # Build CSS for production
```

### Adding New Features

1. **New API Endpoint**: Add route in `server.js`
2. **New MCP Server**: Create file in `mcp-servers/`
3. **New Page**: Create HTML file and add route
4. **Styling**: Use Tailwind classes or add custom CSS in `src/input.css`

## 📱 Mobile Optimization

- Responsive design with mobile-first approach
- Touch-friendly navigation
- Optimized form inputs
- Fast loading on mobile networks
- PWA-ready structure

## 🔒 Security

- Input validation and sanitization
- CORS configuration
- Environment variable protection
- API key security
- HTTPS enforcement in production

## 📈 Analytics

- Google Analytics integration ready
- Custom event tracking
- Performance monitoring
- Lead tracking via Workiz

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support or questions:
- Email: raanan@okashihvac.com
- Phone: (555) 123-4567
- Website: https://okashi-hvac.com

## 🔄 Updates

### Version 1.0.0
- Initial release
- Complete three-page website
- MCP server integration
- SEO optimization
- Mobile responsiveness

---

**Built with ❤️ for Raanan Okashi's HVAC Services in DFW** 