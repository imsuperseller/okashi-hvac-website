# Changelog

All notable changes to the Okashi HVAC Services website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-07-15

### Added
- Enhanced UX with clickable logo navigation
- Proper social media links with target="_blank" and rel="noopener"
- Hover effects for better user interaction
- Comprehensive error handling for all API endpoints
- Fallback data for weather, reviews, and validation services

### Changed
- Updated logo to be clickable and link to home page on all pages
- Replaced placeholder social media links with realistic URLs
- Disabled Google Analytics placeholder to prevent console errors
- Enhanced server error handling with graceful fallbacks
- Improved mobile menu functionality

### Fixed
- Server crashes due to missing API keys (now uses fallbacks)
- Logo navigation not working (now clickable)
- Social media links pointing to "#" (now have proper URLs)
- Google Analytics console errors (disabled placeholder)
- Vercel authentication blocking public access (disabled)
- Missing error handling for MCP server failures

### Technical
- Added robust error handling in server.js
- Implemented fallback data for all MCP servers
- Enhanced logging with branded messages
- Improved API endpoint error responses
- Added global error handlers for uncaught exceptions

## [1.0.0] - 2025-07-15

### Added
- Complete three-page website (Home, Services, Contact)
- MCP server integration for weather, reviews, and validation
- SEO optimization with meta tags and schema markup
- Mobile-responsive design with Tailwind CSS
- Contact form with client-side and server-side validation
- Workiz API integration for lead submission
- Weather display with eco-friendly tips
- Customer testimonials carousel
- Professional branding and color scheme

### Technical
- Express.js server with API endpoints
- Tailwind CSS for styling
- Node.js backend with MCP servers
- Vercel deployment configuration
- Environment variable management
- CORS configuration
- Input validation and sanitization

---

## Version History

- **1.1.0** - UX improvements and bug fixes
- **1.0.0** - Initial release with full functionality

## Contributing

When making changes, please:
1. Update this changelog
2. Follow semantic versioning
3. Document breaking changes
4. Include both user-facing and technical changes 