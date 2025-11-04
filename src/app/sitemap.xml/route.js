import { connectToDb } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';

export async function GET() {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://zammel.store').replace(/\/$/, '');

  // Public, crawlable static pages
  const pages = [
    { path: '', changeFreq: 'daily', priority: '1.0' },               // Home page
    { path: '/collections', changeFreq: 'weekly', priority: '0.9' },  // All collections
    { path: '/about', changeFreq: 'monthly', priority: '0.7' },       // About Us
    { path: '/contact', changeFreq: 'monthly', priority: '0.7' },    // Contact
    { path: '/shipping', changeFreq: 'monthly', priority: '0.6' },    // Shipping Info
    { path: '/returns', changeFreq: 'monthly', priority: '0.6' },    // Returns & Exchanges
    { path: '/size-guide', changeFreq: 'monthly', priority: '0.6' }, // Size Guide
    { path: '/faq', changeFreq: 'monthly', priority: '0.6' },         // FAQ
    { path: '/privacy', changeFreq: 'yearly', priority: '0.3' },        // Privacy Policy
    { path: '/terms', changeFreq: 'yearly', priority: '0.3' },          // Terms of Service
  ];

  // Try to include dynamic pages (products and collections), but fail gracefully if database connection fails
  let dynamicProductUrls = '';
  let dynamicCollectionUrls = '';

  try {
    await connectToDb();

    // Fetch all active products for sitemap
    const products = await Product.find({ status: 'active' })
      .select('_id')
      .limit(500)
      .lean();

    if (Array.isArray(products) && products.length > 0) {
      dynamicProductUrls = products
        .map((product) => {
          const id = product?._id?.toString();
          if (!id) return '';
          return `
      <url>
        <loc>${baseUrl}/products/${id}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>`;
        })
        .filter(Boolean)
        .join('');
    }

    // Fetch all active categories/collections for sitemap
    const categories = await Category.find({ status: 'active' })
      .select('slug _id')
      .limit(100)
      .lean();

    if (Array.isArray(categories) && categories.length > 0) {
      dynamicCollectionUrls = categories
        .map((category) => {
          const slug = category?.slug || category?._id?.toString();
          if (!slug) return '';
          return `
      <url>
        <loc>${baseUrl}/collections/${slug}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>`;
        })
        .filter(Boolean)
        .join('');
    }
  } catch (error) {
    // Fail silently if database connection or query fails
    console.error('Sitemap: Failed to fetch dynamic pages', error);
  }

  const urls = pages
    .map(
      ({ path, changeFreq, priority }) => `
      <url>
        <loc>${baseUrl}${path}</loc>
        <changefreq>${changeFreq}</changefreq>
        <priority>${priority}</priority>
      </url>
    `
    )
    .join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls}
      ${dynamicCollectionUrls}
      ${dynamicProductUrls}
    </urlset>
  `;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}