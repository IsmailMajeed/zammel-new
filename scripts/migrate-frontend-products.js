/**
 * Migration Script: Frontend Products to Database
 * 
 * This script migrates frontend products from static data to database
 * according to the Product schema.
 * 
 * Usage: npm run migrate:products
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Load environment variables
dotenv.config({ path: join(process.cwd(), '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI is not set in environment variables');
  process.exit(1);
}

// Define schemas inline for migration script
const VariantSchema = new mongoose.Schema({
  color: { type: String, required: true, trim: true },
  colorCode: { type: String, trim: true },
  size: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0, default: 0 },
  sku: { type: String, required: true, trim: true },
  images: [{ type: String, trim: true }],
  discount: { type: Number, min: 0, max: 100, default: 0 }
}, { _id: true });

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, index: true },
  description: { type: String, required: true, trim: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  variants: { type: [VariantSchema], required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true },
  featured: { type: Boolean, default: false, index: true },
  tags: [{ type: String, trim: true }]
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true, index: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  description: { type: String, trim: true },
  image: { type: String, trim: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Helper function to generate slug
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Auto-generate slug for Category
CategorySchema.pre('save', function (next) {
  if (!this.slug || this.isModified('name')) {
    if (this.name) {
      this.slug = generateSlug(this.name);
    }
  }
  next();
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

// Frontend products data
const frontendProducts = [
  {
    id: 'hoodie-pack-of-2',
    title: 'Hoodie- Pack of 2',
    price: 299900, // Price in paisa
    compareAtPrice: 500000,
    discountPercentage: 40,
    image: 'https://mettwear.com/cdn/shop/files/PO2_Hoodie.jpg?v=1730314234',
    hoverImage: 'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-white.jpg?v=1696799478',
    images: [
      'https://mettwear.com/cdn/shop/files/PO2_Hoodie.jpg?v=1730314234',
      'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-white.jpg?v=1696799478',
      'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-Black.jpg?v=1696798486',
      'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-CharcoalGrey.jpg?v=1696798670'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['Black', 'White', 'Charcoal Gray', 'Navy Blue'],
    description: 'Premium quality hoodie pack of 2. Made with the finest materials for ultimate comfort and style. Perfect for casual wear and outdoor activities.',
    badge: 'sale',
    featured: true
  },
  {
    id: 'hoodie-black',
    title: 'Hoodie-Black',
    price: 185000,
    compareAtPrice: 280000,
    discountPercentage: 34,
    image: 'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-Black.jpg?v=1696798486',
    images: [
      'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-Black.jpg?v=1696798486',
      'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-white.jpg?v=1696799478'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['Black'],
    description: 'Classic black hoodie with premium quality material. Perfect for everyday wear and casual outings.',
    badge: 'sale'
  },
  {
    id: 'hoodie-white',
    title: 'Hoodie-White',
    price: 185000,
    compareAtPrice: 280000,
    discountPercentage: 34,
    image: 'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-white.jpg?v=1696799478',
    images: [
      'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-white.jpg?v=1696799478',
      'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-Black.jpg?v=1696798486'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['White'],
    description: 'Clean white hoodie with premium quality material. Versatile and stylish for any occasion.',
    badge: 'sale'
  },
  {
    id: 'hoodie-charcoal-gray',
    title: 'Hoodie-Charcoal Gray',
    price: 185000,
    compareAtPrice: 280000,
    discountPercentage: 34,
    image: 'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-CharcoalGrey.jpg?v=1696798670',
    sizes: ['M', 'L', 'XL'],
    colors: ['Charcoal Gray'],
    description: 'Stylish charcoal gray hoodie. Premium quality and comfortable fit.',
    badge: 'sale'
  },
  {
    id: 'hoodie-navy-blue',
    title: 'Hoodie-Navy Blue',
    price: 185000,
    compareAtPrice: 280000,
    discountPercentage: 34,
    image: 'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-NavyBlue.jpg?v=1696799236',
    sizes: ['M', 'L', 'XL'],
    colors: ['Navy Blue'],
    description: 'Elegant navy blue hoodie. Premium quality material with comfortable design.',
    badge: 'sale'
  },
  {
    id: 'hoodie-sky-blue',
    title: 'Hoodie-Sky Blue',
    price: 185000,
    compareAtPrice: 280000,
    discountPercentage: 34,
    image: 'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-LightBlue.jpg?v=1696799178',
    sizes: ['M', 'L', 'XL'],
    colors: ['Sky Blue'],
    description: 'Fresh sky blue hoodie. Comfortable and stylish design.',
    badge: 'sale'
  },
  {
    id: 'hoodie-beige',
    title: 'Hoodie-Beige',
    price: 185000,
    compareAtPrice: 280000,
    discountPercentage: 34,
    image: 'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-Khaki.jpg?v=1696799149',
    sizes: ['M', 'L', 'XL'],
    colors: ['Beige'],
    description: 'Sophisticated beige hoodie. Premium quality and comfortable fit.',
    badge: 'sale'
  },
  {
    id: 'hoodie-army-green',
    title: 'Hoodie-Army Green',
    price: 185000,
    compareAtPrice: 280000,
    discountPercentage: 34,
    image: 'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-ArmyGreen.jpg?v=1696796359',
    sizes: ['M', 'L', 'XL'],
    colors: ['Army Green'],
    description: 'Bold army green hoodie. Durable and stylish design.',
    badge: 'sale'
  },
  {
    id: 'hoodie-maroon',
    title: 'Hoodie-Maroon',
    price: 185000,
    compareAtPrice: 280000,
    discountPercentage: 34,
    image: 'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-Marron.jpg?v=1696799209',
    sizes: ['M', 'L', 'XL'],
    colors: ['Maroon'],
    description: 'Rich maroon hoodie. Premium quality material.',
    badge: 'sale'
  },
  {
    id: 'hoodie-bottle-green',
    title: 'Hoodie-Bottle Green',
    price: 185000,
    compareAtPrice: 280000,
    discountPercentage: 34,
    image: 'https://mettwear.com/cdn/shop/files/mettwear-Hoodie-BottleGreen.jpg?v=1696798585',
    sizes: ['M', 'L', 'XL'],
    colors: ['Bottle Green'],
    description: 'Vibrant bottle green hoodie. Comfortable and stylish.',
    badge: 'sale'
  }
];

// Color to hex mapping
const colorToHex = {
  'Black': '#000000',
  'White': '#FFFFFF',
  'Charcoal Gray': '#36454F',
  'Navy Blue': '#000080',
  'Sky Blue': '#87CEEB',
  'Beige': '#F5F5DC',
  'Army Green': '#4B5320',
  'Maroon': '#800000',
  'Bottle Green': '#006A4E'
};

// Generate SKU
const generateSKU = (productId, color, size) => {
  const colorCode = color.substring(0, 3).toUpperCase();
  const sizeCode = size.toUpperCase();
  const productCode = productId.substring(0, 5).toUpperCase().replace(/-/g, '');
  return `${productCode}-${colorCode}-${sizeCode}`;
};

// Convert frontend product to database schema
const convertToProductSchema = (frontendProduct, categoryId) => {
  const variants = [];

  // Extract colors
  const colors = frontendProduct.colors || [];
  if (colors.length === 0) {
    const titleParts = frontendProduct.title.split('-');
    if (titleParts.length > 1) {
      colors.push(titleParts[titleParts.length - 1].trim());
    } else {
      colors.push('Default');
    }
  }

  // Get images
  const productImages = frontendProduct.images || [frontendProduct.image];

  // Create variants for each size and color combination
  frontendProduct.sizes.forEach((size) => {
    colors.forEach((color) => {
      // Price in paisa, convert to PKR (divide by 100)
      const priceInPKR = frontendProduct.price / 100;

      // Get discount percentage
      const discount = frontendProduct.discountPercentage || 0;

      // Get images for this color
      let variantImages = [];
      if (productImages.length > 0) {
        const colorLower = color.toLowerCase();
        const matchingImage = productImages.find(img =>
          img.toLowerCase().includes(colorLower) ||
          img.toLowerCase().includes(colorLower.replace(/\s+/g, ''))
        );
        variantImages = matchingImage ? [matchingImage] : [productImages[0]];
      }

      variants.push({
        color: color,
        colorCode: colorToHex[color] || '#000000',
        size: size,
        price: priceInPKR,
        quantity: 50, // Default quantity
        sku: generateSKU(frontendProduct.id, color, size),
        images: variantImages,
        discount: discount
      });
    });
  });

  return {
    name: frontendProduct.title,
    description: frontendProduct.description || `${frontendProduct.title} - Premium quality hoodie.`,
    category: categoryId,
    variants: variants,
    status: 'active',
    featured: frontendProduct.featured || false,
    tags: frontendProduct.badge === 'sale' ? ['sale', 'featured'] : ['new']
  };
};

// Main migration function
async function migrateProducts() {
  try {
    console.log('🚀 Starting product migration...\n');

    // Connect to database
    await mongoose.connect(MONGODB_URI, {
      autoIndex: true,
    });
    console.log('✅ Connected to database\n');

    // Get or create "Hoodies" category
    let category = await Category.findOne({ name: 'Hoodies' });
    if (!category) {
      console.log('📦 Creating "Hoodies" category...');
      // Manually generate slug before creating
      const categorySlug = generateSlug('Hoodies');
      category = await Category.create({
        name: 'Hoodies',
        slug: categorySlug,
        description: 'Premium quality hoodies collection',
        status: 'active',
        order: 0
      });
      console.log('✅ Category created:', category.name, '\n');
    } else {
      console.log('✅ Using existing category:', category.name, '\n');
    }

    const categoryId = category._id;
    let createdCount = 0;
    let skippedCount = 0;

    // Process each frontend product
    for (const frontendProduct of frontendProducts) {
      try {
        // Check if product already exists
        const existingProduct = await Product.findOne({ name: frontendProduct.title });

        if (existingProduct) {
          console.log(`⏭️  Skipping "${frontendProduct.title}" - already exists`);
          skippedCount++;
          continue;
        }

        // Convert to database schema
        const productData = convertToProductSchema(frontendProduct, categoryId);

        // Create product
        const product = await Product.create(productData);

        await product.populate('category', 'name');

        console.log(`✅ Created: ${product.name}`);
        console.log(`   - Variants: ${product.variants.length}`);
        console.log(`   - Status: ${product.status}`);
        console.log(`   - Featured: ${product.featured}`);
        console.log('');

        createdCount++;

      } catch (error) {
        console.error(`❌ Error processing "${frontendProduct.title}":`, error.message);
        console.log('');
      }
    }

    // Summary
    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Created: ${createdCount} products`);
    console.log(`   ⏭️  Skipped: ${skippedCount} products (already exist)`);
    console.log(`   📦 Total processed: ${frontendProducts.length} products`);
    console.log('\n🎉 Migration completed successfully!\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run migration
migrateProducts();
