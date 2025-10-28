# Mettwear - Premium Hoodies Collection

A modern Next.js e-commerce website for Mettwear, featuring a premium hoodie collection with "First Check Then Pay" policy.

## Features

- **Modern Design**: Clean, responsive design matching the original Mettwear aesthetic
- **SEO Optimized**: Complete SEO setup with meta tags, structured data, and Open Graph
- **Responsive**: Mobile-first design that works on all devices
- **Product Showcase**: Beautiful product grid with hover effects and quick actions
- **Customer Reviews**: Integrated review section with star ratings
- **Performance**: Optimized images and fast loading times

## Tech Stack

- **Framework**: Next.js 16.0.0
- **Styling**: Tailwind CSS 4
- **Fonts**: Inter & Roboto from Google Fonts
- **SEO**: Next-SEO for meta tags and structured data
- **Images**: Next.js Image component for optimization

## Project Structure

```
src/
├── app/
│   ├── layout.js          # Root layout with SEO configuration
│   ├── page.js           # Home page with product showcase
│   └── globals.css       # Global styles and Tailwind imports
└── components/
    ├── Header.js         # Navigation header with mobile menu
    ├── ProductCard.js    # Individual product card component
    ├── ProductGrid.js    # Product grid with filters and sorting
    └── Footer.js         # Footer with newsletter and links
```

## Key Components

### Header
- Sticky navigation with logo
- Mobile-responsive menu
- Search, account, and cart icons
- Announcement bar

### ProductCard
- Product image with hover effects
- Price display with discount badges
- Size selection
- Quick action buttons (view, wishlist)
- Add to cart functionality

### ProductGrid
- Responsive grid layout
- Filter and sort options
- View mode toggle (grid/list)
- Load more functionality

### Footer
- Newsletter subscription
- Social media links
- Company information
- Customer service links

## SEO Features

- Complete meta tags setup
- Open Graph and Twitter Card support
- Structured data (JSON-LD) for organization
- Canonical URLs
- Sitemap ready
- Mobile-optimized

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Product Data

The website includes sample product data based on the original Mettwear collection:

- Hoodie Pack of 2 (Rs. 2,999 - 40% off)
- Various single hoodies (Rs. 1,850 - 34% off)
- Available in multiple colors: Black, White, Charcoal Gray, Navy Blue, Sky Blue, Beige, Army Green, Maroon, Bottle Green
- Sizes: M, L, XL

## Customization

### Colors
The design uses CSS custom properties for easy theming:
- Primary: `#56cfe1` (Blue)
- Secondary: `#222222` (Dark Gray)
- Text Muted: `#878787` (Light Gray)

### Fonts
- Primary: Inter (Google Fonts)
- Secondary: Roboto (Google Fonts)

## Performance

- Optimized images with Next.js Image component
- Lazy loading for better performance
- Responsive images with multiple sizes
- CSS animations for smooth interactions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License

This project is created for Mettwear and follows their brand guidelines and design requirements.

## Contact

For any questions or support, please contact the development team.